import { Router } from "express";
import { db } from "@workspace/db";
import {
  shTripsTable,
  shBookingsTable,
  shAvailabilityTable,
  shContactsTable,
  shVesselsTable,
  shTripVesselsTable,
} from "@workspace/db";
import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";
import {
  ListShTripsQueryParams,
  CreateShCheckoutBody,
  GetShTripParams,
  GetShTripAvailabilityParams,
  GetShBookingParams,
  CreateShContactBody,
  UpdateShAdminBookingParams,
  UpdateShAdminBookingBody,
  ListShAdminBookingsQueryParams,
  SetShAvailabilityBody,
  CreateShAdminTripBody,
  UpdateShAdminTripParams,
  UpdateShAdminTripBody,
} from "@workspace/api-zod";
import { getUncachableStripeClient } from "../stripeClient";
import { logger } from "../lib/logger";

const router = Router();

function tripToApi(trip: typeof shTripsTable.$inferSelect) {
  return {
    id: trip.id,
    slug: trip.slug,
    name: trip.name,
    category: trip.category,
    type: trip.type,
    shortDescription: trip.shortDescription,
    description: trip.description,
    duration: trip.duration,
    priceMin: trip.priceMin,
    priceDisplay: trip.priceDisplay,
    pricingNote: trip.pricingNote ?? null,
    pricingModel: trip.pricingModel ?? "per_person",
    maxPassengers: trip.maxPassengers,
    boat: trip.boat,
    highlights: (trip.highlights as string[]) ?? [],
    imageUrl: trip.imageUrl ?? null,
    active: trip.active,
    comingSoon: trip.comingSoon ?? false,
    sortOrder: trip.sortOrder,
  };
}

// GET /sh/summary
router.get("/sh/summary", async (req, res) => {
  const trips = await db
    .select()
    .from(shTripsTable)
    .where(eq(shTripsTable.active, true))
    .orderBy(asc(shTripsTable.sortOrder));

  const categories = [...new Set(trips.map((t) => t.category))];
  const featured = trips.slice(0, 6);

  res.json({
    totalTrips: trips.length,
    categories,
    featuredTrips: featured.map(tripToApi),
  });
});

// GET /sh/trips
router.get("/sh/trips", async (req, res) => {
  const parsed = ListShTripsQueryParams.safeParse(req.query);
  const category = parsed.success ? parsed.data.category : undefined;

  const query = db
    .select()
    .from(shTripsTable)
    .where(
      category
        ? and(
            eq(shTripsTable.active, true),
            eq(shTripsTable.category, category),
          )
        : eq(shTripsTable.active, true),
    )
    .orderBy(asc(shTripsTable.sortOrder));

  const trips = await query;
  res.json(trips.map(tripToApi));
});

// GET /sh/trips/:slug
router.get("/sh/trips/:slug", async (req, res) => {
  const params = GetShTripParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid slug" });
    return;
  }

  const [trip] = await db
    .select()
    .from(shTripsTable)
    .where(eq(shTripsTable.slug, params.data.slug))
    .limit(1);

  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }

  res.json(tripToApi(trip));
});

// GET /sh/trips/:slug/vessels
router.get("/sh/trips/:slug/vessels", async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.status(400).json({ error: "Invalid slug" });
    return;
  }

  const [trip] = await db
    .select()
    .from(shTripsTable)
    .where(eq(shTripsTable.slug, slug))
    .limit(1);

  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }

  const tripVessels = await db
    .select({
      id: shVesselsTable.id,
      name: shVesselsTable.name,
      description: shVesselsTable.description,
      capacity: shVesselsTable.capacity,
      priceCents: shVesselsTable.priceCents,
      priceDisplay: shVesselsTable.priceDisplay,
      imageUrl: shVesselsTable.imageUrl,
      sortOrder: shVesselsTable.sortOrder,
      priceOverrideCents: shTripVesselsTable.priceOverrideCents,
    })
    .from(shTripVesselsTable)
    .innerJoin(shVesselsTable, eq(shTripVesselsTable.vesselId, shVesselsTable.id))
    .where(
      and(
        eq(shTripVesselsTable.tripId, trip.id),
        eq(shTripVesselsTable.active, true),
        eq(shVesselsTable.active, true),
      ),
    )
    .orderBy(asc(shVesselsTable.sortOrder));

  const isFlat = trip.pricingModel === "flat";

  res.json(
    tripVessels.map((v) => {
      // For flat-rate charters: price is per-boat override OR the trip's base price
      // For per-person: price is the vessel's rate (with optional override)
      const effectivePriceCents = isFlat
        ? (v.priceOverrideCents ?? trip.priceMin)
        : (v.priceOverrideCents ?? v.priceCents);

      const effectivePriceDisplay = isFlat
        ? `$${(effectivePriceCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`
        : (v.priceOverrideCents
            ? `$${(v.priceOverrideCents / 100).toFixed(0)}`
            : v.priceDisplay);

      return {
        id: v.id,
        name: v.name,
        description: v.description,
        capacity: v.capacity,
        priceCents: effectivePriceCents,
        priceDisplay: effectivePriceDisplay,
        pricingModel: trip.pricingModel,
        imageUrl: v.imageUrl ?? null,
        sortOrder: v.sortOrder,
      };
    }),
  );
});

// GET /sh/trips/:tripId/availability
router.get("/sh/trips/:tripId/availability", async (req, res) => {
  const params = GetShTripAvailabilityParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid tripId" });
    return;
  }

  const today = new Date();
  const in90Days = new Date();
  in90Days.setDate(today.getDate() + 90);
  const todayStr = today.toISOString().slice(0, 10);
  const in90Str = in90Days.toISOString().slice(0, 10);

  const slots = await db
    .select()
    .from(shAvailabilityTable)
    .where(
      and(
        eq(shAvailabilityTable.tripId, params.data.tripId),
        gte(shAvailabilityTable.date, todayStr),
        lte(shAvailabilityTable.date, in90Str),
      ),
    )
    .orderBy(asc(shAvailabilityTable.date));

  res.json(
    slots.map((s) => ({
      date: s.date,
      availableSlots: s.availableSlots,
      isBlocked: s.isBlocked,
    })),
  );
});

// POST /sh/checkout
router.post("/sh/checkout", async (req, res) => {
  const parsed = CreateShCheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
    return;
  }

  const {
    tripSlug,
    bookingDate,
    vacationStart,
    vacationEnd,
    passengers,
    customerName,
    customerEmail,
    customerPhone,
    specialRequests,
    vesselId,
    vesselName,
  } = parsed.data;

  const [trip] = await db
    .select()
    .from(shTripsTable)
    .where(and(eq(shTripsTable.slug, tripSlug), eq(shTripsTable.active, true)))
    .limit(1);

  if (!trip) {
    res.status(400).json({ error: "Trip not found or unavailable" });
    return;
  }

  // Use vessel price if a vessel was selected, otherwise fall back to trip's base price
  let priceCents = trip.priceMin;
  if (vesselId) {
    const [vessel] = await db
      .select()
      .from(shVesselsTable)
      .where(and(eq(shVesselsTable.id, vesselId), eq(shVesselsTable.active, true)))
      .limit(1);
    if (vessel) {
      // Check for trip-level price override
      const [tripVessel] = await db
        .select()
        .from(shTripVesselsTable)
        .where(
          and(
            eq(shTripVesselsTable.tripId, trip.id),
            eq(shTripVesselsTable.vesselId, vesselId),
          ),
        )
        .limit(1);
      priceCents = tripVessel?.priceOverrideCents ?? vessel.priceCents;
    }
  }

  // Flat-rate (charter): price is for the boat regardless of passenger count
  // Per-person (lesson/rental): price multiplies by headcount
  const totalCents =
    trip.pricingModel === "flat" ? priceCents : priceCents * passengers;

  // Create a pending booking first
  const [booking] = await db
    .insert(shBookingsTable)
    .values({
      tripId: trip.id,
      vesselId: vesselId ?? null,
      vesselName: vesselName ?? null,
      customerName,
      customerEmail,
      customerPhone,
      bookingDate,
      vacationStart: vacationStart ?? null,
      vacationEnd: vacationEnd ?? null,
      passengers,
      totalCents,
      status: "pending",
      specialRequests: specialRequests ?? null,
    })
    .returning();

  try {
    const stripe = await getUncachableStripeClient();
    const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0] ?? "localhost"}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: totalCents,
            product_data: {
              name: `${trip.name} — ${bookingDate}`,
              description: trip.pricingModel === "flat"
                ? `Private charter · ${trip.boat}`
                : `${passengers} passenger${passengers > 1 ? "s" : ""} · ${trip.boat}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: customerEmail,
      metadata: {
        bookingId: String(booking.id),
        tripId: String(trip.id),
        tripSlug: trip.slug,
      },
      success_url: `${baseUrl}/booking-confirmation?bookingId=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/trips/${trip.slug}`,
    });

    await db
      .update(shBookingsTable)
      .set({ stripeSessionId: session.id })
      .where(eq(shBookingsTable.id, booking.id));

    res.json({ checkoutUrl: session.url!, bookingId: booking.id });
  } catch (err: any) {
    logger.error({ err }, "Stripe checkout error");
    await db
      .delete(shBookingsTable)
      .where(eq(shBookingsTable.id, booking.id));
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// GET /sh/bookings/:id
router.get("/sh/bookings/:id", async (req, res) => {
  const params = GetShBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid booking ID" });
    return;
  }

  const [booking] = await db
    .select()
    .from(shBookingsTable)
    .where(eq(shBookingsTable.id, params.data.id))
    .limit(1);

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const [trip] = await db
    .select()
    .from(shTripsTable)
    .where(eq(shTripsTable.id, booking.tripId))
    .limit(1);

  // If session completed, confirm the booking
  if (
    booking.status === "pending" &&
    booking.stripeSessionId
  ) {
    try {
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(
        booking.stripeSessionId,
      );
      if (session.payment_status === "paid") {
        await db
          .update(shBookingsTable)
          .set({
            status: "confirmed",
            stripePaymentIntentId: session.payment_intent as string,
          })
          .where(eq(shBookingsTable.id, booking.id));
        booking.status = "confirmed";
      }
    } catch (err) {
      logger.warn({ err }, "Could not verify Stripe session status");
    }
  }

  res.json({
    id: booking.id,
    trip: tripToApi(trip!),
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    bookingDate: booking.bookingDate,
    passengers: booking.passengers,
    totalCents: booking.totalCents,
    status: booking.status,
    specialRequests: booking.specialRequests ?? null,
    stripeSessionId: booking.stripeSessionId ?? null,
    createdAt: booking.createdAt.toISOString(),
  });
});

// POST /sh/contact
router.post("/sh/contact", async (req, res) => {
  const parsed = CreateShContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }

  await db.insert(shContactsTable).values({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    message: parsed.data.message,
    tripInterest: parsed.data.tripInterest ?? null,
  });

  res.json({ ok: true });
});

// ─── Admin Routes ───────────────────────────────────────────

// GET /sh/admin/dashboard
router.get("/sh/admin/dashboard", async (req, res) => {
  const allBookings = await db
    .select()
    .from(shBookingsTable)
    .orderBy(desc(shBookingsTable.createdAt));

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const confirmed = allBookings.filter((b) => b.status === "confirmed");
  const pending = allBookings.filter((b) => b.status === "pending");
  const revenueThisMonth = confirmed
    .filter((b) => new Date(b.createdAt) >= monthStart)
    .reduce((sum, b) => sum + b.totalCents, 0);

  const tripIds = [...new Set(allBookings.map((b) => b.tripId))];
  const trips =
    tripIds.length > 0
      ? await db
          .select()
          .from(shTripsTable)
          .where(sql`${shTripsTable.id} = ANY(${tripIds})`)
      : [];
  const tripsById = Object.fromEntries(trips.map((t) => [t.id, t]));

  const toSummary = (b: typeof shBookingsTable.$inferSelect) => ({
    id: b.id,
    tripName: tripsById[b.tripId]?.name ?? "Unknown",
    tripSlug: tripsById[b.tripId]?.slug ?? "",
    customerName: b.customerName,
    customerEmail: b.customerEmail,
    bookingDate: b.bookingDate,
    passengers: b.passengers,
    totalCents: b.totalCents,
    status: b.status,
    createdAt: b.createdAt.toISOString(),
  });

  const todayStr = now.toISOString().slice(0, 10);
  const upcoming = allBookings
    .filter(
      (b) => b.bookingDate >= todayStr && b.status !== "cancelled",
    )
    .slice(0, 10);

  res.json({
    totalBookings: allBookings.length,
    confirmedBookings: confirmed.length,
    pendingBookings: pending.length,
    revenueThisMonth,
    recentBookings: allBookings.slice(0, 5).map(toSummary),
    upcomingBookings: upcoming.map(toSummary),
  });
});

// GET /sh/admin/bookings
router.get("/sh/admin/bookings", async (req, res) => {
  const parsed = ListShAdminBookingsQueryParams.safeParse(req.query);
  const status = parsed.success ? parsed.data.status : undefined;

  const bookings = await db
    .select()
    .from(shBookingsTable)
    .where(status ? eq(shBookingsTable.status, status) : undefined)
    .orderBy(desc(shBookingsTable.createdAt));

  const tripIds = [...new Set(bookings.map((b) => b.tripId))];
  const trips =
    tripIds.length > 0
      ? await db
          .select()
          .from(shTripsTable)
          .where(sql`${shTripsTable.id} = ANY(${tripIds})`)
      : [];
  const tripsById = Object.fromEntries(trips.map((t) => [t.id, t]));

  res.json(
    bookings.map((b) => ({
      id: b.id,
      tripName: tripsById[b.tripId]?.name ?? "Unknown",
      tripSlug: tripsById[b.tripId]?.slug ?? "",
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      bookingDate: b.bookingDate,
      passengers: b.passengers,
      totalCents: b.totalCents,
      status: b.status,
      createdAt: b.createdAt.toISOString(),
    })),
  );
});

// PATCH /sh/admin/bookings/:id
router.patch("/sh/admin/bookings/:id", async (req, res) => {
  const params = UpdateShAdminBookingParams.safeParse(req.params);
  const body = UpdateShAdminBookingBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [updated] = await db
    .update(shBookingsTable)
    .set({ status: body.data.status })
    .where(eq(shBookingsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const [trip] = await db
    .select()
    .from(shTripsTable)
    .where(eq(shTripsTable.id, updated.tripId))
    .limit(1);

  res.json({
    id: updated.id,
    tripName: trip?.name ?? "Unknown",
    tripSlug: trip?.slug ?? "",
    customerName: updated.customerName,
    customerEmail: updated.customerEmail,
    bookingDate: updated.bookingDate,
    passengers: updated.passengers,
    totalCents: updated.totalCents,
    status: updated.status,
    createdAt: updated.createdAt.toISOString(),
  });
});

// POST /sh/admin/availability
router.post("/sh/admin/availability", async (req, res) => {
  const parsed = SetShAvailabilityBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const { tripId, date, availableSlots, isBlocked } = parsed.data;

  const existing = await db
    .select()
    .from(shAvailabilityTable)
    .where(
      and(
        eq(shAvailabilityTable.tripId, tripId),
        eq(shAvailabilityTable.date, date),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(shAvailabilityTable)
      .set({
        availableSlots: availableSlots ?? existing[0].availableSlots,
        isBlocked,
      })
      .where(eq(shAvailabilityTable.id, existing[0].id));
  } else {
    await db.insert(shAvailabilityTable).values({
      tripId,
      date,
      availableSlots: availableSlots ?? 1,
      isBlocked,
    });
  }

  res.json({
    date,
    availableSlots: availableSlots ?? 1,
    isBlocked,
  });
});

// POST /sh/admin/trips
router.post("/sh/admin/trips", async (req, res) => {
  const parsed = CreateShAdminTripBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid trip data" });
    return;
  }

  const [trip] = await db
    .insert(shTripsTable)
    .values({
      ...parsed.data,
      highlights: parsed.data.highlights as string[],
      pricingNote: parsed.data.pricingNote ?? null,
      imageUrl: parsed.data.imageUrl ?? null,
      active: parsed.data.active ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();

  res.status(201).json(tripToApi(trip));
});

// PATCH /sh/admin/trips/:id
router.patch("/sh/admin/trips/:id", async (req, res) => {
  const params = UpdateShAdminTripParams.safeParse(req.params);
  const parsed = UpdateShAdminTripBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [trip] = await db
    .update(shTripsTable)
    .set({
      ...parsed.data,
      highlights: parsed.data.highlights
        ? (parsed.data.highlights as string[])
        : undefined,
      pricingNote: parsed.data.pricingNote ?? undefined,
      imageUrl: parsed.data.imageUrl ?? undefined,
    })
    .where(eq(shTripsTable.id, params.data.id))
    .returning();

  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }

  res.json(tripToApi(trip));
});

export default router;
