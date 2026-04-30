import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { postsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  ListPostsQueryParams,
  CreatePostBody,
  GetPostParams,
  UpdatePostParams,
  UpdatePostBody,
  DeletePostParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

function formatPost(post: typeof postsTable.$inferSelect) {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    type: post.type,
    mediaUrl: post.mediaUrl,
    featured: post.featured,
    publishedAt: post.publishedAt.toISOString(),
    createdAt: post.createdAt.toISOString(),
  };
}

router.get("/posts/featured", async (_req, res): Promise<void> => {
  const allPosts = await db.select().from(postsTable).orderBy(desc(postsTable.publishedAt));

  const pressReleases = allPosts.filter(p => p.type === "press_release").slice(0, 3);
  const videos = allPosts.filter(p => p.type === "video").slice(0, 3);
  const presentations = allPosts.filter(p => p.type === "presentation").slice(0, 3);

  res.json({
    pressReleases: pressReleases.map(formatPost),
    videos: videos.map(formatPost),
    presentations: presentations.map(formatPost),
  });
});

router.get("/posts", async (req, res): Promise<void> => {
  const parsed = ListPostsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let query = db.select().from(postsTable).orderBy(desc(postsTable.publishedAt));
  const results = await query;

  let filtered = results;
  if (parsed.data.type) {
    filtered = filtered.filter(p => p.type === parsed.data.type);
  }
  if (parsed.data.limit) {
    filtered = filtered.slice(0, parsed.data.limit);
  }

  res.json(filtered.map(formatPost));
});

router.post("/posts", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [post] = await db
    .insert(postsTable)
    .values({
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      type: parsed.data.type,
      mediaUrl: parsed.data.mediaUrl ?? null,
      featured: parsed.data.featured ?? false,
    })
    .returning();

  res.status(201).json(formatPost(post));
});

router.get("/posts/:id", async (req, res): Promise<void> => {
  const params = GetPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db.select().from(postsTable).where(eq(postsTable.id, params.data.id));
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json(formatPost(post));
});

router.patch("/posts/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdatePostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdatePostBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [post] = await db
    .update(postsTable)
    .set({
      title: body.data.title,
      excerpt: body.data.excerpt,
      content: body.data.content,
      type: body.data.type,
      mediaUrl: body.data.mediaUrl ?? null,
      featured: body.data.featured ?? false,
    })
    .where(eq(postsTable.id, params.data.id))
    .returning();

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json(formatPost(post));
});

router.delete("/posts/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeletePostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db.delete(postsTable).where(eq(postsTable.id, params.data.id)).returning();
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
