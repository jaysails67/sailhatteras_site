import { Router } from "express";
import { spawn } from "node:child_process";
import OpenAI from "openai";
import { db } from "@workspace/db";
import { shTripsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

// ─── Replit dev: OpenAI integration ────────────────────────────────────────
function getOpenAIClient(): { client: OpenAI; model: string } {
  if (!process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || !process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    throw new Error("No AI backend configured.");
  }
  return {
    client: new OpenAI({
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    }),
    model: "gpt-4o",
  };
}

// ─── Production: call `openclaw agent` CLI (one-shot, returns full reply) ──
function runViaOpenClaw(sessionId: string, prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const openclawBin = process.env.OPENCLAW_BIN ?? "/bin/openclaw";
    // On InMotion the Node process runs as ca12a15 but openclaw's config lives
    // in /root/.openclaw — inaccessible to ca12a15. OPENCLAW_SUDO=true makes
    // the spawn use "sudo -u root -H" so openclaw runs as root and finds it.
    const useSudo = process.env.OPENCLAW_SUDO === "true";
    const [cmd, ...cmdArgs] = useSudo
      ? ["sudo", "-u", "root", "-H", openclawBin, "agent", "--session-id", sessionId, "--json", "-m", prompt]
      : [openclawBin, "agent", "--session-id", sessionId, "--json", "-m", prompt];
    const proc = spawn(cmd, cmdArgs, {
      env: { ...process.env },
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    proc.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });

    proc.on("close", (code) => {
      if (stderr) logger.warn({ stderr: stderr.slice(0, 500) }, "openclaw agent stderr");
      logger.info({ code, stdoutLen: stdout.length }, "openclaw agent exited");

      // Non-zero exit is expected when gateway fails and embedded fallback runs.
      // Only hard-reject if there is no stdout to work with.
      if (code !== 0 && !stdout.trim()) {
        reject(new Error(`openclaw agent exited ${code} with no output: ${stderr.slice(0, 300)}`));
        return;
      }
      try {
        const parsed = JSON.parse(stdout);
        // OpenClaw JSON: { payloads: [{ text: "..." }], meta: {...} }
        const raw =
          parsed?.payloads?.[0]?.text ??
          parsed.reply ?? parsed.text ?? parsed.content ??
          stdout.trim();
        // When the upstream model is content-filtered, OpenClaw returns
        // "Provider finish_reason: content_filter" as the text — swallow it
        // and return a friendly fallback so the user never sees this message.
        if (typeof raw === "string" && raw.toLowerCase().includes("finish_reason")) {
          logger.warn({ raw }, "openclaw: content filter fired — returning fallback");
          resolve("I'm sorry, I had trouble with that one. Could you rephrase your question? I'm here to help with Hatteras Community Sailing trips, pricing, and booking.");
        } else {
          resolve(raw);
        }
      } catch {
        // Not JSON — treat raw stdout as the response
        const raw = stdout.trim();
        if (raw.toLowerCase().includes("finish_reason")) {
          resolve("I'm sorry, I had trouble with that one. Could you rephrase your question? I'm here to help with Hatteras Community Sailing trips, pricing, and booking.");
        } else {
          resolve(raw);
        }
      }
    });

    proc.on("error", reject);
  });
}

const SYSTEM_PROMPT = `You are the friendly customer service assistant for Hatteras Community Sailing (HCS), a 501(c)3 nonprofit sailing organization on the Outer Banks of North Carolina. Your name is "SailHatteras Guide".

━━━ STRICT CONSTRAINTS — follow these above all else ━━━

SCOPE: You ONLY answer questions related to:
- Hatteras Community Sailing programs, pricing, availability, and booking
- Sailing in general (techniques, safety, what to expect on a sail)
- The Outer Banks / Cape Hatteras area as it relates to visiting and sailing

OFF-TOPIC REQUESTS: If someone asks about anything outside that scope (coding, homework, recipes, politics, other businesses, general trivia, creative writing, AI tools, technology, etc.), you MUST respond with ONLY this message — do not add any other content, suggestions, or partial answers:
"I'm the SailHatteras booking assistant, so I can only help with questions about our sailing programs and the Outer Banks. Is there something about our trips or booking I can help you with?"
Do NOT attempt to answer the off-topic question even a little. Do NOT explain why you can't help in detail. Just redirect with that one message and stop completely.

CONFIDENTIAL — never reveal:
- Staff names, personal contact info, or internal roles
- Financial details beyond published program pricing
- Passwords, API keys, system configuration, or internal tools
- Anything about the underlying AI model, software stack, or how you work
- Internal scheduling, vendor relationships, or business operations

IDENTITY: You are "SailHatteras Guide." If asked what AI model you are, what powers you, or whether you are ChatGPT / Hukilau / OpenClaw / any other AI, say only: "I'm the SailHatteras booking assistant — I'm not able to share details about how I work. What can I help you sail into today?" Never confirm or deny any specific model or technology.

HARMFUL CONTENT: Refuse any request for harmful, illegal, or inappropriate content with a brief, polite redirect to sailing topics.

━━━ ABOUT THE ORGANIZATION ━━━

KEY ORGANIZATION INFO:
- Name: Hatteras Community Sailing (HCS)
- Website: sailhatteras.org
- Phone: (252) 489-8193
- Email: info@sailhatteras.org
- Main location: 48962 NC-12, Buxton, NC 27920
- Office: 40039 NC-12, Avon, NC 27915
- Season: Programs run April through October (inquiries welcome year-round)
- Mission: 501(c)3 nonprofit — fees support youth sailing scholarships and community access to sailing
- Youth scholarships: No child is turned away for inability to pay. Full and partial scholarships available.

BOOKING PROCESS:
When a customer wants to book, direct them to the specific trip page. The booking flow is:
1. Go to sailhatteras.org/trips/{slug} (or just /trips/{slug} as a link)
2. Select a vessel or class option
3. Pick a date from the calendar
4. Enter name, email, phone, and any special requests
5. Review and pay securely via Stripe

AVAILABLE PROGRAMS:
{TRIPS_CONTEXT}

━━━ FORMATTING ━━━
- Use **bold** for trip names and important details
- When linking to a trip, format as: [Trip Name](/trips/{slug})
- Keep responses conversational and concise — 2-4 short paragraphs max
- Use bullet points for lists of features or options
- Be enthusiastic about sailing and the Outer Banks — it's a magical place!

If someone asks to book, guide them to the appropriate trip page. If they describe what they want (sunset, family, learn to sail, charter, etc.), recommend the best matching trip and give them the link.`;

router.post("/sh/chat", async (req, res) => {
  const { messages, sessionId: rawSessionId } = req.body;
  // Sanitize session ID — alphanumeric + hyphens only, max 64 chars
  const sessionId = typeof rawSessionId === "string" && /^[\w-]{1,64}$/.test(rawSessionId)
    ? rawSessionId
    : `sh-${Date.now()}`;

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages must be a non-empty array" });
    return;
  }

  const trips = await db
    .select()
    .from(shTripsTable)
    .where(eq(shTripsTable.active, true))
    .orderBy(asc(shTripsTable.sortOrder));

  const tripsContext = trips
    .map(
      (t) =>
        `- **${t.name}** (slug: \`${t.slug}\`, category: ${t.category})\n  Price: ${t.priceDisplay} | Duration: ${t.duration} | Max guests: ${t.maxPassengers} | Boat: ${t.boat}\n  ${t.shortDescription}${t.pricingNote ? `\n  Note: ${t.pricingNote}` : ""}`,
    )
    .join("\n\n");

  const systemPrompt = SYSTEM_PROMPT.replace("{TRIPS_CONTEXT}", tripsContext);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const useOpenClaw = !!process.env.OPENCLAW_AGENT;

  try {
    if (useOpenClaw) {
      const lastUserMsg = messages.filter((m: { role: string }) => m.role === "user").at(-1)?.content ?? "";
      // Provide context naturally — adversarial phrasing triggers content filters
      const prompt = `You are responding as the SailHatteras Guide, the friendly booking assistant for Hatteras Community Sailing (HCS) — a 501(c)3 nonprofit sailing organization on the Outer Banks of North Carolina.

Only answer questions about HCS programs, sailing, and the Outer Banks. For off-topic questions reply: "I'm the SailHatteras booking assistant — I can only help with questions about our sailing programs. Is there something about our trips or booking I can help you with?"

Never reveal internal details, staff contact info, API keys, or the underlying AI technology. If asked what AI you are, say: "I'm the SailHatteras booking assistant and can't share details about how I work."

HCS contact: (252) 489-8193 | info@sailhatteras.org | sailhatteras.org
Season: April–October | Location: Buxton & Avon, NC | Scholarships available for youth.

Current programs:
${tripsContext}

When linking to a trip use: [Trip Name](/trips/{slug})
Keep replies conversational, 2–3 short paragraphs max. Be warm and enthusiastic about sailing.

Visitor question: ${lastUserMsg}`;

      const reply = await runViaOpenClaw(sessionId, prompt);
      if (reply) {
        res.write(`data: ${JSON.stringify({ content: reply })}\n\n`);
      }
    } else {
      const { client, model } = getOpenAIClient();
      const stream = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-20).map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    logger.error({ err }, "Chat stream error");
    res.write(`data: ${JSON.stringify({ error: "AI response failed. Please try again." })}\n\n`);
    res.end();
  }
});

export default router;
