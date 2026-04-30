import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq, and, count } from "drizzle-orm";
import {
  ListInvestorsQueryParams,
  ApproveInvestorParams,
  DenyInvestorParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

function formatApplication(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone,
    status: user.approvalStatus,
    ndaAccepted: user.ndaAccepted,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

router.get("/investors", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListInvestorsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let query = db.select().from(usersTable).where(eq(usersTable.role, "investor"));

  if (parsed.data.status) {
    const status = parsed.data.status;
    const results = await db.select().from(usersTable)
      .where(and(eq(usersTable.role, "investor"), eq(usersTable.approvalStatus, status)));
    res.json(results.map(formatApplication));
    return;
  }

  const results = await query;
  res.json(results.map(formatApplication));
});

router.post("/investors/:id/approve", requireAdmin, async (req, res): Promise<void> => {
  const params = ApproveInvestorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ approvalStatus: "approved" })
    .where(and(eq(usersTable.id, params.data.id), eq(usersTable.role, "investor")))
    .returning();

  if (!user) {
    res.status(404).json({ error: "Investor not found" });
    return;
  }

  const telegramWebhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
  if (telegramWebhookUrl) {
    fetch(telegramWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `Investor ${user.name} (${user.email}) has been approved.`,
      }),
    }).catch(() => {});
  }

  res.json(formatApplication(user));
});

router.post("/investors/:id/deny", requireAdmin, async (req, res): Promise<void> => {
  const params = DenyInvestorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ approvalStatus: "denied" })
    .where(and(eq(usersTable.id, params.data.id), eq(usersTable.role, "investor")))
    .returning();

  if (!user) {
    res.status(404).json({ error: "Investor not found" });
    return;
  }

  res.json(formatApplication(user));
});

router.get("/investors/stats", requireAdmin, async (req, res): Promise<void> => {
  const [totalRow] = await db
    .select({ count: count() })
    .from(usersTable)
    .where(eq(usersTable.role, "investor"));

  const [pendingRow] = await db
    .select({ count: count() })
    .from(usersTable)
    .where(and(eq(usersTable.role, "investor"), eq(usersTable.approvalStatus, "pending")));

  const [approvedRow] = await db
    .select({ count: count() })
    .from(usersTable)
    .where(and(eq(usersTable.role, "investor"), eq(usersTable.approvalStatus, "approved")));

  const [deniedRow] = await db
    .select({ count: count() })
    .from(usersTable)
    .where(and(eq(usersTable.role, "investor"), eq(usersTable.approvalStatus, "denied")));

  res.json({
    total: Number(totalRow?.count ?? 0),
    pending: Number(pendingRow?.count ?? 0),
    approved: Number(approvedRow?.count ?? 0),
    denied: Number(deniedRow?.count ?? 0),
  });
});

export default router;
