/**
 * HCS Email Agent — polls hope26, hukilau26, danforth26 AgentMail inboxes
 * every 60 s, auto-replies to unread customer emails using gpt-5.4, and
 * CCs the admin via SMTP.
 *
 * AgentMail API (no version prefix for list; /v0 prefix for reply/update):
 *   GET  /inboxes/{inbox_id}/messages?labels=unread
 *   POST /v0/inboxes/{inbox_id}/messages/{message_id}/reply   body: {text, html}
 *   PATCH /v0/inboxes/{inbox_id}/messages/{message_id}         body: {remove_labels}
 *
 * inbox_id = URL-encoded email address  (e.g. hope26%40agentmail.to)
 * Bearer token = am_us_inbox_... hash
 */

import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db } from "@workspace/db";
import { shTripsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

// ─── Inbox registry ────────────────────────────────────────────────────────
interface Inbox {
  email: string;           // e.g. "hope26@agentmail.to"
  encodedId: string;       // URL-encoded email for API paths
  bearerToken: string;     // am_us_inbox_... hash
  label: string;           // human name
}

function buildInboxes(): Inbox[] {
  const defs = [
    { key: "AGENTMAIL_HOPE_INBOX_ID",    email: "hope26@agentmail.to",    label: "Hope" },
    { key: "AGENTMAIL_HUKILAU_INBOX_ID", email: "hukilau26@agentmail.to", label: "Hukilau" },
    { key: "AGENTMAIL_DANFORTH_INBOX_ID",email: "danforth26@agentmail.to",label: "Danforth" },
  ];
  return defs
    .map(({ key, email, label }) => ({
      email,
      encodedId: encodeURIComponent(email),
      bearerToken: process.env[key] ?? "",
      label,
    }))
    .filter((i) => i.bearerToken !== "");
}

// ─── AgentMail API helpers ─────────────────────────────────────────────────

const AM_BASE = "https://api.agentmail.to";

async function amFetch(
  bearerToken: string,
  url: string,
  options: RequestInit = {},
): Promise<unknown> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
      ...(options.headers as Record<string, string> | undefined),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`AgentMail ${options.method ?? "GET"} ${url} → ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

interface AgentMailMessage {
  message_id: string;
  thread_id: string;
  labels: string[];
  from: string;
  to: string[];
  subject: string;
  preview: string;
  timestamp: string;
}

async function listUnreadReceived(inbox: Inbox): Promise<AgentMailMessage[]> {
  const data = (await amFetch(
    inbox.bearerToken,
    `${AM_BASE}/inboxes/${inbox.encodedId}/messages?labels=unread`,
  )) as { messages?: AgentMailMessage[] };
  // Only process messages we received (not ones we sent)
  return (data.messages ?? []).filter((m) => m.labels.includes("received"));
}

async function sendReply(inbox: Inbox, messageId: string, text: string, html: string) {
  const encodedMsgId = encodeURIComponent(messageId);
  return amFetch(
    inbox.bearerToken,
    `${AM_BASE}/v0/inboxes/${inbox.encodedId}/messages/${encodedMsgId}/reply`,
    { method: "POST", body: JSON.stringify({ text, html }) },
  );
}

async function markRead(inbox: Inbox, messageId: string) {
  const encodedMsgId = encodeURIComponent(messageId);
  return amFetch(
    inbox.bearerToken,
    `${AM_BASE}/v0/inboxes/${inbox.encodedId}/messages/${encodedMsgId}`,
    { method: "PATCH", body: JSON.stringify({ remove_labels: ["unread"] }) },
  );
}

// ─── Email Agent AI ────────────────────────────────────────────────────────

const EMAIL_SYSTEM = `You are the Email Agent for Hatteras Community Sailing (HCS), a 501(c)3 nonprofit on the Outer Banks of North Carolina. You handle customer emails that arrive in the {INBOX_LABEL} inbox.

YOUR ROLE:
- Answer questions about sailing programs, pricing, dates, and bookings
- Help customers find the right program for their needs
- Provide clear next steps for booking
- Represent HCS's warm, community-focused nonprofit mission

ABOUT HCS:
- Website: sailhatteras.org
- Phone: (252) 489-8193 | Email: info@sailhatteras.org
- Location: 48962 NC-12, Buxton, NC 27920 | Office: 40039 NC-12, Avon, NC 27915
- Season: April–October (inquiries answered year-round)
- 501(c)3 nonprofit — fees fund youth sailing scholarships
- Youth scholarships available — no child turned away for inability to pay

BOOKING: Customers book at sailhatteras.org/trips/{slug}

AVAILABLE PROGRAMS:
{TRIPS_CONTEXT}

REPLY STYLE:
- Warm and friendly, but professional — like talking to a knowledgeable local
- Address customer by first name if available
- Answer their specific question directly and fully
- Recommend the most suitable program with a booking link when relevant
- End with an invitation to call or email with further questions
- Sign off as: The Hatteras Community Sailing Team
- Plain text only — no markdown, no subject line, just the email body`;

async function generateReply(
  inbox: Inbox,
  from: string,
  subject: string,
  preview: string,
): Promise<string> {
  const trips = await db
    .select()
    .from(shTripsTable)
    .where(eq(shTripsTable.active, true))
    .orderBy(asc(shTripsTable.sortOrder));

  const tripsContext = trips
    .map(
      (t) =>
        `- ${t.name} (sailhatteras.org/trips/${t.slug}): ${t.priceDisplay}, ${t.duration}, up to ${t.maxPassengers} guests. ${t.shortDescription}`,
    )
    .join("\n");

  const systemPrompt = EMAIL_SYSTEM
    .replace("{INBOX_LABEL}", inbox.label)
    .replace("{TRIPS_CONTEXT}", tripsContext);

  // Parse sender name from "Name <email>" format
  const nameMatch = from.match(/^(.+?)\s*</) ;
  const fromName = nameMatch?.[1]?.trim() ?? from;

  const response = await openai.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Customer email:\nFrom: ${from}\nSubject: ${subject}\n\n${preview}`,
      },
    ],
  });

  return (
    response.choices[0]?.message?.content ??
    `Thank you for reaching out to Hatteras Community Sailing! We'll get back to you shortly.\n\nYou can also reach us at (252) 489-8193.\n\nThe Hatteras Community Sailing Team`
  );
}

function textToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const paragraphs = escaped
    .split(/\n\n+/)
    .map((p) => `<p style="margin:0 0 14px 0">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
  return `<div style="font-family:Georgia,serif;font-size:15px;line-height:1.7;color:#333;max-width:600px">${paragraphs}</div>`;
}

async function sendAdminCC(
  inbox: Inbox,
  from: string,
  subject: string,
  preview: string,
  replyText: string,
) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const smtpReady = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (!adminEmail || !smtpReady) return;

  try {
    const nodemailer = await import("nodemailer");
    const smtpPort = Number(process.env.SMTP_PORT ?? 587);
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: adminEmail,
      subject: `[AI Reply Sent] ${subject} — ${inbox.email}`,
      text: [
        `Auto-reply sent by HCS Email Agent`,
        `Inbox: ${inbox.email}`,
        `From: ${from}`,
        `Subject: ${subject}`,
        ``,
        `═══ CUSTOMER EMAIL ═══`,
        preview,
        ``,
        `═══ AI REPLY SENT ═══`,
        replyText,
      ].join("\n"),
    });
  } catch (err) {
    logger.warn({ err }, "Admin CC email failed");
  }
}

// ─── Polling loop ─────────────────────────────────────────────────────────

// Track message IDs we've already handled this session (guards against re-processing
// if the mark-read request fails transiently)
const processed = new Set<string>();

async function processInbox(inbox: Inbox) {
  const messages = await listUnreadReceived(inbox);
  if (messages.length === 0) return;

  logger.info({ inbox: inbox.email, count: messages.length }, "Email Agent: unread messages found");

  for (const msg of messages) {
    if (processed.has(msg.message_id)) continue;
    processed.add(msg.message_id);

    try {
      logger.info(
        { inbox: inbox.email, from: msg.from, subject: msg.subject },
        "Email Agent: generating reply",
      );

      const replyText = await generateReply(inbox, msg.from, msg.subject, msg.preview);
      const replyHtml = textToHtml(replyText);

      await sendReply(inbox, msg.message_id, replyText, replyHtml);
      logger.info({ inbox: inbox.email, msg: msg.message_id }, "Email Agent: reply sent");

      await markRead(inbox, msg.message_id);

      await sendAdminCC(inbox, msg.from, msg.subject, msg.preview, replyText).catch(() => {});
    } catch (err) {
      logger.error({ err, inbox: inbox.email, msg: msg.message_id }, "Email Agent: error processing message");
      // Remove from processed so it retries next cycle
      processed.delete(msg.message_id);
    }
  }
}

async function pollAllInboxes() {
  const inboxes = buildInboxes();
  if (inboxes.length === 0) return;

  await Promise.allSettled(
    inboxes.map((inbox) =>
      processInbox(inbox).catch((err) =>
        logger.error({ err, inbox: inbox.email }, "Email Agent: poll error"),
      ),
    ),
  );
}

// Start polling every 60 seconds when the env vars are present
const POLL_INTERVAL_MS = 60_000;

function startEmailAgent() {
  const inboxes = buildInboxes();
  if (inboxes.length === 0) {
    logger.warn("Email Agent: no inbox bearer tokens configured — skipping startup");
    return;
  }

  logger.info(
    { inboxes: inboxes.map((i) => i.email) },
    `Email Agent: starting — polling every ${POLL_INTERVAL_MS / 1000}s`,
  );

  // Run immediately on startup, then on interval
  pollAllInboxes();
  setInterval(pollAllInboxes, POLL_INTERVAL_MS);
}

// ─── Admin endpoints ────────────────────────────────────────────────────────

// GET /sh/admin/agentmail/status — confirm agent is running and show inbox state
router.get("/sh/admin/agentmail/status", async (_req, res) => {
  const inboxes = buildInboxes();
  const results: Record<string, unknown> = {};

  for (const inbox of inboxes) {
    try {
      const messages = await listUnreadReceived(inbox);
      results[inbox.email] = {
        ok: true,
        unreadReceived: messages.length,
        messages: messages.slice(0, 3).map((m) => ({
          from: m.from,
          subject: m.subject,
          time: m.timestamp,
        })),
      };
    } catch (err: unknown) {
      results[inbox.email] = { ok: false, error: String(err) };
    }
  }

  res.json({
    agentRunning: inboxes.length > 0,
    pollIntervalSeconds: POLL_INTERVAL_MS / 1000,
    inboxes: results,
    processedThisSession: processed.size,
  });
});

export { startEmailAgent };
export default router;
