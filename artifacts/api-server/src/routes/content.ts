import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contentPagesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetContentPageParams,
  UpdateContentPageParams,
  UpdateContentPageBody,
} from "@workspace/api-zod";
import { requireAdmin, requireApprovedInvestor } from "../middlewares/auth";

const router: IRouter = Router();

const INVESTOR_SLUGS = [
  "exec-summary",
  "company-overview",
  "market-analysis",
  "products",
  "services",
  "marketing-plan",
  "financial-plan",
  "conclusion",
];

function formatPage(page: typeof contentPagesTable.$inferSelect) {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    content: page.content,
    metaData: page.metaData,
    updatedAt: page.updatedAt.toISOString(),
  };
}

async function hasInvestorAccess(userId: number | undefined): Promise<boolean> {
  if (!userId) return false;
  const [user] = await db
    .select({ role: usersTable.role, approvalStatus: usersTable.approvalStatus })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!user) return false;
  return user.role === "admin" || user.approvalStatus === "approved";
}

router.get("/content", async (req, res): Promise<void> => {
  const allPages = await db.select().from(contentPagesTable);
  const canViewInvestorContent = await hasInvestorAccess(req.session?.userId);
  const visible = canViewInvestorContent
    ? allPages
    : allPages.filter((p) => !INVESTOR_SLUGS.includes(p.slug));
  res.json(visible.map(formatPage));
});

router.get(
  "/content/:slug",
  requireApprovedInvestor,
  async (req, res): Promise<void> => {
    const params = GetContentPageParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const slug = params.data.slug;

    if (!INVESTOR_SLUGS.includes(slug)) {
      res.status(404).json({ error: "Content page not found" });
      return;
    }

    const [page] = await db
      .select()
      .from(contentPagesTable)
      .where(eq(contentPagesTable.slug, slug));

    if (!page) {
      res.status(404).json({ error: "Content page not found" });
      return;
    }

    res.json(formatPage(page));
  },
);

router.get("/public-content/:slug", async (req, res): Promise<void> => {
  const params = GetContentPageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const slug = params.data.slug;

  if (INVESTOR_SLUGS.includes(slug)) {
    res.status(403).json({ error: "Access restricted" });
    return;
  }

  const [page] = await db
    .select()
    .from(contentPagesTable)
    .where(eq(contentPagesTable.slug, slug));

  if (!page) {
    res.status(404).json({ error: "Content page not found" });
    return;
  }

  res.json(formatPage(page));
});

router.put(
  "/content/:slug",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = UpdateContentPageParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const body = UpdateContentPageBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }

    const slug = params.data.slug;
    const existing = await db
      .select()
      .from(contentPagesTable)
      .where(eq(contentPagesTable.slug, slug));

    let page: typeof contentPagesTable.$inferSelect;

    if (existing.length > 0) {
      const [updated] = await db
        .update(contentPagesTable)
        .set({
          title: body.data.title,
          content: body.data.content,
          metaData: body.data.metaData ?? null,
        })
        .where(eq(contentPagesTable.slug, slug))
        .returning();
      page = updated;
    } else {
      const [created] = await db
        .insert(contentPagesTable)
        .values({
          slug,
          title: body.data.title,
          content: body.data.content,
          metaData: body.data.metaData ?? null,
        })
        .returning();
      page = created;
    }

    res.json(formatPage(page));
  },
);

export default router;
