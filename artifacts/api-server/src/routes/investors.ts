import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, investorApplicationsTable } from "@workspace/db";
import { eq, and, count } from "drizzle-orm";
import {
  ListInvestorsQueryParams,
  ApproveInvestorParams,
  DenyInvestorParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { logger } from "../lib/logger";
import { sendTelegramMessage } from "../lib/telegram";

const router: IRouter = Router();

type UserRow = typeof usersTable.$inferSelect;
type AppRow = typeof investorApplicationsTable.$inferSelect;

function formatApplication(user: UserRow, app?: AppRow | null) {
  return {
    id: user.id,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone,
    status: user.approvalStatus,
    approvalStatus: user.approvalStatus,
    ndaAccepted: user.ndaAccepted,
    ndaAcceptedAt: app?.ndaAcceptedAt?.toISOString() ?? null,
    notes: app?.notes ?? null,
    applicationId: app?.id ?? null,
    createdAt: (app?.createdAt ?? user.createdAt).toISOString(),
    updatedAt: (app?.updatedAt ?? user.updatedAt).toISOString(),
  };
}

router.get("/investors", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListInvestorsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const rows = await db
    .select()
    .from(usersTable)
    .leftJoin(investorApplicationsTable, eq(investorApplicationsTable.userId, usersTable.id))
    .where(
      parsed.data.status
        ? and(eq(usersTable.role, "investor"), eq(usersTable.approvalStatus, parsed.data.status))
        : eq(usersTable.role, "investor"),
    );

  res.json(rows.map((r) => formatApplication(r.users, r.investor_applications)));
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

  const [app] = await db
    .update(investorApplicationsTable)
    .set({ status: "approved" })
    .where(eq(investorApplicationsTable.userId, user.id))
    .returning();

  sendTelegramMessage(
    `✅ <b>Investor Approved</b>\n` +
    `<b>Name:</b> ${user.name}\n` +
    `<b>Email:</b> ${user.email}\n` +
    `Access to the investor portal has been granted.`,
  );

  res.json(formatApplication(user, app));
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

  const [app] = await db
    .update(investorApplicationsTable)
    .set({ status: "denied" })
    .where(eq(investorApplicationsTable.userId, user.id))
    .returning();

  res.json(formatApplication(user, app));
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
