import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  date,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const shTripsTable = pgTable("sh_trips", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  priceMin: integer("price_min").notNull(),
  priceDisplay: text("price_display").notNull(),
  pricingNote: text("pricing_note"),
  pricingModel: text("pricing_model").notNull().default("per_person"),
  maxPassengers: integer("max_passengers").notNull(),
  boat: text("boat").notNull(),
  highlights: jsonb("highlights").notNull().$type<string[]>().default([]),
  imageUrl: text("image_url"),
  active: boolean("active").notNull().default(true),
  comingSoon: boolean("coming_soon").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  stripePriceId: text("stripe_price_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const shVesselsTable = pgTable("sh_vessels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  capacity: integer("capacity").notNull().default(6),
  priceCents: integer("price_cents").notNull(),
  priceDisplay: text("price_display").notNull(),
  imageUrl: text("image_url"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const shTripVesselsTable = pgTable("sh_trip_vessels", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id")
    .notNull()
    .references(() => shTripsTable.id),
  vesselId: integer("vessel_id")
    .notNull()
    .references(() => shVesselsTable.id),
  priceOverrideCents: integer("price_override_cents"),
  active: boolean("active").notNull().default(true),
});

export const shBookingsTable = pgTable("sh_bookings", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id")
    .notNull()
    .references(() => shTripsTable.id),
  vesselId: integer("vessel_id"),
  vesselName: text("vessel_name"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  bookingDate: date("booking_date").notNull(),
  vacationStart: date("vacation_start"),
  vacationEnd: date("vacation_end"),
  passengers: integer("passengers").notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text("status").notNull().default("pending"),
  specialRequests: text("special_requests"),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const shAvailabilityTable = pgTable("sh_availability", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id")
    .notNull()
    .references(() => shTripsTable.id),
  date: date("date").notNull(),
  availableSlots: integer("available_slots").notNull().default(1),
  isBlocked: boolean("is_blocked").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const shContactsTable = pgTable("sh_contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  tripInterest: text("trip_interest"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const shDevTasksTable = pgTable("sh_dev_tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  architectureNotes: text("architecture_notes").notNull().default(""),
  status: text("status").notNull().default("backlog"),
  priority: text("priority").notNull().default("medium"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type ShDevTask = typeof shDevTasksTable.$inferSelect;

export const insertShTripSchema = createInsertSchema(shTripsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertShTrip = z.infer<typeof insertShTripSchema>;
export type ShTrip = typeof shTripsTable.$inferSelect;

export const insertShBookingSchema = createInsertSchema(shBookingsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertShBooking = z.infer<typeof insertShBookingSchema>;
export type ShBooking = typeof shBookingsTable.$inferSelect;

export const insertShAvailabilitySchema = createInsertSchema(
  shAvailabilityTable,
).omit({ id: true, createdAt: true });
export type InsertShAvailability = z.infer<typeof insertShAvailabilitySchema>;
export type ShAvailability = typeof shAvailabilityTable.$inferSelect;
