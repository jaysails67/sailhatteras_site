import { logger } from "./logger";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function deriveWebhookSecret(token: string): string {
  return token.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 256);
}

export function getWebhookSecret(): string | null {
  if (!BOT_TOKEN) return null;
  return deriveWebhookSecret(BOT_TOKEN);
}

export function sendTelegramMessage(text: string): void {
  if (!BOT_TOKEN || !CHAT_ID) return;
  sendTelegramToChat(CHAT_ID, text);
}

export function sendTelegramToChat(chatId: string | number, text: string): void {
  if (!BOT_TOKEN) return;
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  }).catch((err) => logger.warn({ err }, "Telegram notification failed"));
}

export function buildWebhookUrl(siteOrigin?: string): string | null {
  // 1. Explicit override from admin panel (browser passes window.location.origin)
  if (siteOrigin) {
    return `${siteOrigin.replace(/\/$/, "")}/api/telegram/webhook`;
  }
  // 2. Explicit override via env var (set this to production public domain, e.g. https://pamliecoconnect.com)
  if (process.env.TELEGRAM_WEBHOOK_URL) {
    return `${process.env.TELEGRAM_WEBHOOK_URL.replace(/\/$/, "")}/api/telegram/webhook`;
  }
  // 3. Fallback: Replit dev domain (correct in dev, but NOT the public production URL in autoscale deployments)
  const domain = process.env.REPLIT_DEV_DOMAIN;
  if (!domain) return null;
  return `https://${domain}/api/telegram/webhook`;
}

async function setWebhook(webhookUrl: string): Promise<{ ok: boolean; description?: string }> {
  if (!BOT_TOKEN) return { ok: false, description: "No bot token" };
  const secret = deriveWebhookSecret(BOT_TOKEN);
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ["message"],
      secret_token: secret,
    }),
  });
  return res.json() as Promise<{ ok: boolean; description?: string }>;
}

export async function registerWebhook(): Promise<void> {
  if (!BOT_TOKEN) {
    logger.warn("TELEGRAM_BOT_TOKEN not set — skipping webhook registration");
    return;
  }

  // Skip only when explicitly running as the dev server (NODE_ENV=development is
  // set by the dev workflow script). The production deployment does NOT set NODE_ENV,
  // so the old check (NODE_ENV !== "production") was always true in production too.
  if (process.env.NODE_ENV === "development") {
    logger.info("Dev mode — skipping Telegram webhook registration (production server owns the webhook)");
    return;
  }

  const webhookUrl = buildWebhookUrl();
  if (!webhookUrl) {
    logger.warn("Cannot determine webhook URL (TELEGRAM_WEBHOOK_URL and REPLIT_DEV_DOMAIN both unset) — skipping");
    return;
  }

  try {
    const data = await setWebhook(webhookUrl);
    if (data.ok) {
      logger.info({ webhookUrl }, "Telegram webhook registered");
    } else {
      logger.warn({ description: data.description }, "Telegram webhook registration failed");
    }
  } catch (err) {
    logger.warn({ err }, "Telegram webhook registration error");
  }
}

export async function forceRegisterWebhook(siteOrigin?: string): Promise<{ ok: boolean; webhookUrl: string | null; description?: string }> {
  if (!BOT_TOKEN) return { ok: false, webhookUrl: null, description: "TELEGRAM_BOT_TOKEN not set" };
  const webhookUrl = buildWebhookUrl(siteOrigin);
  if (!webhookUrl) return { ok: false, webhookUrl: null, description: "Cannot determine webhook URL" };
  try {
    const data = await setWebhook(webhookUrl);
    if (data.ok) {
      logger.info({ webhookUrl }, "Telegram webhook force-registered by admin");
    } else {
      logger.warn({ description: data.description }, "Telegram webhook force-registration failed");
    }
    return { ok: data.ok, webhookUrl, description: data.description };
  } catch (err) {
    logger.warn({ err }, "Telegram webhook force-registration error");
    return { ok: false, webhookUrl, description: String(err) };
  }
}

export async function getWebhookInfo(): Promise<{
  url: string;
  pending_update_count: number;
  last_error_message?: string;
  last_error_date?: number;
} | null> {
  if (!BOT_TOKEN) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    const data = (await res.json()) as { ok: boolean; result?: {
      url: string;
      pending_update_count: number;
      last_error_message?: string;
      last_error_date?: number;
    } };
    if (data.ok && data.result) return data.result;
  } catch {
    // ignore
  }
  return null;
}
