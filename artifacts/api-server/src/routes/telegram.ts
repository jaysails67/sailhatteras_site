import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, investorApplicationsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { logger } from "../lib/logger";
import { sendTelegramToChat } from "../lib/telegram";

const router: IRouter = Router();

const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

router.post("/telegram/webhook", async (req, res): Promise<void> => {
  res.sendStatus(200);

  const update = req.body as {
    message?: {
      text?: string;
      chat?: { id: number };
      from?: { id: number };
    };
  };

  const msg = update?.message;
  if (!msg?.text || !msg?.chat) return;

  const fromChatId = String(msg.chat.id);
  if (!CHAT_ID || fromChatId !== CHAT_ID) {
    logger.warn({ fromChatId }, "Telegram message from unknown chat — ignoring");
    return;
  }

  const text = msg.text.trim();

  const approveMatch = text.match(/^\/approve\s+(\d+)$/i);
  const denyMatch = text.match(/^\/deny\s+(\d+)(?:\s+(.+))?$/i);
  const helpMatch = text.match(/^\/help$/i);

  if (helpMatch) {
    sendTelegramToChat(CHAT_ID, 
      `<b>PamliEcoConnect Bot Commands</b>\n\n` +
      `/approve &lt;id&gt; — Approve an investor application\n` +
      `/deny &lt;id&gt; &lt;reason&gt; — Deny with a reason message\n\n` +
      `Example:\n<code>/approve 5</code>\n<code>/deny 5 Unable to verify identity. Please re-register with a corporate email.</code>`
    );
    return;
  }

  if (approveMatch) {
    const id = Number(approveMatch[1]);
    const [user] = await db
      .update(usersTable)
      .set({ approvalStatus: "approved" })
      .where(and(eq(usersTable.id, id), eq(usersTable.role, "investor")))
      .returning();

    if (!user) {
      sendTelegramToChat(CHAT_ID, `❌ Investor #${id} not found.`);
      return;
    }

    await db
      .update(investorApplicationsTable)
      .set({ status: "approved" })
      .where(eq(investorApplicationsTable.userId, user.id));

    logger.info({ investorId: id, email: user.email }, "Investor approved via Telegram");
    sendTelegramToChat(CHAT_ID,
      `✅ <b>Approved!</b>\n<b>${user.name}</b> (${user.email}) now has access to the investor portal.`
    );
    return;
  }

  if (denyMatch) {
    const id = Number(denyMatch[1]);
    const reason = denyMatch[2]?.trim() || "Your application did not meet our current criteria.";

    const [user] = await db
      .update(usersTable)
      .set({ approvalStatus: "denied" })
      .where(and(eq(usersTable.id, id), eq(usersTable.role, "investor")))
      .returning();

    if (!user) {
      sendTelegramToChat(CHAT_ID, `❌ Investor #${id} not found.`);
      return;
    }

    await db
      .update(investorApplicationsTable)
      .set({ status: "denied", notes: reason })
      .where(eq(investorApplicationsTable.userId, user.id));

    logger.info({ investorId: id, email: user.email, reason }, "Investor denied via Telegram");
    sendTelegramToChat(CHAT_ID,
      `🚫 <b>Denied.</b>\n<b>${user.name}</b> (${user.email}) has been denied access.\n<b>Reason sent:</b> ${reason}`
    );
    return;
  }

  sendTelegramToChat(CHAT_ID,
    `Unknown command. Type /help to see available commands.`
  );
});

export default router;
