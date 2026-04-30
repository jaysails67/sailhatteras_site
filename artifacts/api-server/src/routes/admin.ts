import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, postsTable, contactSubmissionsTable, waitlistTable } from "@workspace/db";
import { eq, count, desc, and } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

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

export default router;
