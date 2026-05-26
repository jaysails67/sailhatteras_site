import { pgTable, text, jsonb, timestamp, index } from "drizzle-orm/pg-core";

export const sessionsTable = pgTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    data: jsonb("data").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    expiresAtIdx: index("sessions_expires_at_idx").on(table.expiresAt),
  }),
);

export type Session = typeof sessionsTable.$inferSelect;
export type InsertSession = typeof sessionsTable.$inferInsert;
