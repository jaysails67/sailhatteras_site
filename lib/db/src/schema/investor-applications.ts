import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const investorApplicationsTable = pgTable("investor_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["pending", "approved", "denied"] }).notNull().default("pending"),
  ndaAcceptedAt: timestamp("nda_accepted_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertInvestorApplicationSchema = createInsertSchema(investorApplicationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertInvestorApplication = z.infer<typeof insertInvestorApplicationSchema>;
export type InvestorApplicationRecord = typeof investorApplicationsTable.$inferSelect;
