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

export async function registerWebhook(): Promise<void> {
  if (!BOT_TOKEN) {
    logger.warn("TELEGRAM_BOT_TOKEN not set — skipping webhook registration");
    return;
  }
  // Only register in production — dev server must never overwrite the production
  // webhook, as they use separate databases and the wrong server would receive callbacks.
  if (process.env.NODE_ENV !== "production") {
    logger.info("Dev mode — skipping Telegram webhook registration (production server owns the webhook)");
    return;
  }
  const devDomain = process.env.REPLIT_DEV_DOMAIN;
  if (!devDomain) {
    logger.warn("REPLIT_DEV_DOMAIN not set — skipping Telegram webhook registration");
    return;
  }
  const webhookUrl = `https://${devDomain}/api/telegram/webhook`;
  const secret = deriveWebhookSecret(BOT_TOKEN);
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message"],
        secret_token: secret,
      }),
    });
    const data = (await res.json()) as { ok: boolean; description?: string };
    if (data.ok) {
      logger.info({ webhookUrl }, "Telegram webhook registered");
    } else {
      logger.warn({ description: data.description }, "Telegram webhook registration failed");
    }
  } catch (err) {
    logger.warn({ err }, "Telegram webhook registration error");
  }
}
