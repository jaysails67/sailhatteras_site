import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, postsTable, contactSubmissionsTable, waitlistTable } from "@workspace/db";
import { eq, count, desc } from "drizzle-orm";
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

export default router;
