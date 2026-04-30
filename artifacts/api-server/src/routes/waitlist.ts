import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { waitlistTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { JoinWaitlistBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

function formatEntry(e: typeof waitlistTable.$inferSelect) {
  return {
    id: e.id,
    name: e.name,
    email: e.email,
    phone: e.phone,
    createdAt: e.createdAt.toISOString(),
  };
}

router.post("/waitlist", async (req, res): Promise<void> => {
  const parsed = JoinWaitlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db.select().from(waitlistTable).where(eq(waitlistTable.email, parsed.data.email));
  if (existing.length > 0) {
    res.status(409).json({ error: "You're already on the waitlist." });
    return;
  }

  const [entry] = await db
    .insert(waitlistTable)
    .values({ name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone })
    .returning();

  res.status(201).json({ message: "You've been added to the waitlist. We'll notify you when reservations open." });
});

router.get("/waitlist", requireAdmin, async (_req, res): Promise<void> => {
  const entries = await db.select().from(waitlistTable).orderBy(asc(waitlistTable.createdAt));
  res.json(entries.map(formatEntry));
});

export default router;
