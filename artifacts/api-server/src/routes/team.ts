import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { teamMembersTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  CreateTeamMemberBody,
  UpdateTeamMemberParams,
  UpdateTeamMemberBody,
  DeleteTeamMemberParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

function formatMember(m: typeof teamMembersTable.$inferSelect) {
  return {
    id: m.id,
    name: m.name,
    title: m.title,
    bio: m.bio,
    headshotUrl: m.headshotUrl,
    displayOrder: m.displayOrder,
    createdAt: m.createdAt.toISOString(),
  };
}

router.get("/team", async (_req, res): Promise<void> => {
  const members = await db.select().from(teamMembersTable).orderBy(asc(teamMembersTable.displayOrder));
  res.json(members.map(formatMember));
});

router.post("/team", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [member] = await db
    .insert(teamMembersTable)
    .values({
      name: parsed.data.name,
      title: parsed.data.title,
      bio: parsed.data.bio,
      headshotUrl: parsed.data.headshotUrl ?? null,
      displayOrder: parsed.data.displayOrder ?? 0,
    })
    .returning();

  res.status(201).json(formatMember(member));
});

router.patch("/team/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateTeamMemberParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateTeamMemberBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [member] = await db
    .update(teamMembersTable)
    .set({
      name: body.data.name,
      title: body.data.title,
      bio: body.data.bio,
      headshotUrl: body.data.headshotUrl ?? null,
      displayOrder: body.data.displayOrder ?? 0,
    })
    .where(eq(teamMembersTable.id, params.data.id))
    .returning();

  if (!member) {
    res.status(404).json({ error: "Team member not found" });
    return;
  }

  res.json(formatMember(member));
});

router.delete("/team/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteTeamMemberParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [member] = await db.delete(teamMembersTable).where(eq(teamMembersTable.id, params.data.id)).returning();
  if (!member) {
    res.status(404).json({ error: "Team member not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
