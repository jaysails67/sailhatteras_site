import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, postsTable, contactSubmissionsTable, waitlistTable, investorApplicationsTable } from "@workspace/db";
import { eq, count, desc, and } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { forceRegisterWebhook, getWebhookInfo, buildWebhookUrl } from "../lib/telegram";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/admin/dashboard", requireAdmin, async (_req, res): Promise<void> => {
  const [totalRow] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.role, "investor"));
  const [pendingRow] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.approvalStatus, "pending"));
  const [approvedRow] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.approvalStatus, "approved"));
  const [deniedRow] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.approvalStatus, "denied"));
  const [contactsRow] = await db.select({ count: count() }).from(contactSubmissionsTable);
  const [waitlistRow] = await db.select({ count: count() }).from(waitlistTable);

  const recentPosts = await db.select().from(postsTable).orderBy(desc(postsTable.publishedAt)).limit(5);

  res.json({
    investorStats: {
      total: Number(totalRow?.count ?? 0),
      pending: Number(pendingRow?.count ?? 0),
      approved: Number(approvedRow?.count ?? 0),
      denied: Number(deniedRow?.count ?? 0),
    },
    totalContacts: Number(contactsRow?.count ?? 0),
    totalWaitlist: Number(waitlistRow?.count ?? 0),
    recentPosts: recentPosts.map(p => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      type: p.type,
      mediaUrl: p.mediaUrl,
      featured: p.featured,
      publishedAt: p.publishedAt.toISOString(),
      createdAt: p.createdAt.toISOString(),
    })),
  });
});

router.get("/admin/telegram/status", requireAdmin, async (req, res): Promise<void> => {
  const info = await getWebhookInfo();
  const siteOrigin = (req.query.siteOrigin as string | undefined);
  const currentUrl = buildWebhookUrl(siteOrigin);
  res.json({
    registered: info ?? null,
    currentServerUrl: currentUrl,
    isCorrect: info ? info.url === currentUrl : false,
  });
});

router.post("/admin/telegram/reregister", requireAdmin, async (req, res): Promise<void> => {
  const siteOrigin = (req.body as { siteOrigin?: string }).siteOrigin;
  logger.info({ siteOrigin }, "Admin triggered Telegram webhook re-registration");
  const result = await forceRegisterWebhook(siteOrigin);
  if (!result.ok) {
    res.status(500).json({ error: result.description ?? "Webhook registration failed" });
    return;
  }
  const info = await getWebhookInfo();
  res.json({ ok: true, webhookUrl: result.webhookUrl, info });
});

router.post("/admin/investors/:id/reset-password", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { newPassword } = req.body as { newPassword?: string };

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
    res.status(400).json({ error: "New password must be at least 8 characters" });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  const [user] = await db
    .update(usersTable)
    .set({ passwordHash })
    .where(and(eq(usersTable.id, id), eq(usersTable.role, "investor")))
    .returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email });

  if (!user) {
    res.status(404).json({ error: "Investor not found" });
    return;
  }

  res.json({ message: `Password reset for ${user.name} (${user.email})` });
});

router.patch("/admin/investors/:id/email", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { email } = req.body as { email?: string };

  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "A valid email address is required" });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, normalizedEmail));
  if (existing.length > 0 && existing[0].id !== id) {
    res.status(409).json({ error: "That email is already in use by another account" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ email: normalizedEmail })
    .where(and(eq(usersTable.id, id), eq(usersTable.role, "investor")))
    .returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email });

  if (!user) {
    res.status(404).json({ error: "Investor not found" });
    return;
  }

  logger.info({ investorId: id, newEmail: normalizedEmail }, "Investor email updated by admin");
  res.json({ message: `Email updated for ${user.name}`, email: user.email });
});

router.delete("/admin/investors/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);

  const [user] = await db
    .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, id));

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (user.role === "admin") {
    res.status(403).json({ error: "Admin accounts cannot be deleted" });
    return;
  }

  await db.delete(investorApplicationsTable).where(eq(investorApplicationsTable.userId, id));
  await db.delete(usersTable).where(eq(usersTable.id, id));

  logger.info({ investorId: id, email: user.email }, "Investor account deleted by admin");
  res.json({ message: `Account for ${user.name} (${user.email}) has been deleted` });
});

export default router;
