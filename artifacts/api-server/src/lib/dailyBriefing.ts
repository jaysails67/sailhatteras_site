import { db } from "@workspace/db";
import { shBookingsTable, shTripsTable } from "@workspace/db";
import { eq, and, inArray } from "drizzle-orm";
import { sendTelegramMessage } from "./telegram";
import { logger } from "./logger";

export async function sendDailyBriefing(): Promise<void> {
  try {
    // Today's date in YYYY-MM-DD (Eastern time — the server may be UTC, so we
    // compute the ET offset manually: EDT = UTC-4 in summer, EST = UTC-5 in winter)
    const now = new Date();
    const etOffset = isDaylightSavingTime(now) ? -4 : -5;
    const etNow = new Date(now.getTime() + etOffset * 60 * 60 * 1000);
    const today = etNow.toISOString().slice(0, 10);

    // Find all confirmed bookings for today
    const bookings = await db
      .select()
      .from(shBookingsTable)
      .where(
        and(
          eq(shBookingsTable.bookingDate, today),
          eq(shBookingsTable.status, "confirmed"),
        )
      );

    if (bookings.length === 0) {
      sendTelegramMessage(
        `☀️ <b>Good morning! Daily briefing — ${formatDate(today)}</b>\n\n` +
        `No confirmed bookings today. Enjoy the day!`
      );
      return;
    }

    // Fetch trip names
    const tripIds = [...new Set(bookings.map((b) => b.tripId))];
    const trips = tripIds.length > 0
      ? await db.select().from(shTripsTable).where(inArray(shTripsTable.id, tripIds))
      : [];
    const tripsById = Object.fromEntries(trips.map((t) => [t.id, t]));

    const lines = bookings.map((b) => {
      const tripName = tripsById[b.tripId]?.name ?? "Charter";
      const vessel = b.vesselName ? ` · ${b.vesselName}` : "";
      const guests = b.passengers ?? 1;
      return `  • ${tripName}${vessel} — ${b.customerName} (${guests} guest${guests !== 1 ? "s" : ""}) · $${((b.totalCents ?? 0) / 100).toFixed(0)}`;
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalCents ?? 0), 0);
    const totalGuests = bookings.reduce((sum, b) => sum + (b.passengers ?? 1), 0);

    sendTelegramMessage(
      `☀️ <b>Good morning! Daily briefing — ${formatDate(today)}</b>\n\n` +
      `<b>${bookings.length} booking${bookings.length !== 1 ? "s" : ""} today</b> · ${totalGuests} guest${totalGuests !== 1 ? "s" : ""} · $${(totalRevenue / 100).toFixed(0)} total\n\n` +
      lines.join("\n")
    );

    logger.info({ today, count: bookings.length }, "Daily briefing sent");
  } catch (err) {
    logger.warn({ err }, "Daily briefing failed");
  }
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

// US Eastern DST: second Sunday in March → first Sunday in November
function isDaylightSavingTime(date: Date): boolean {
  const year = date.getUTCFullYear();
  const dstStart = nthSundayOfMonth(year, 2, 2); // March (month 2), 2nd Sunday
  const dstEnd   = nthSundayOfMonth(year, 10, 1); // November (month 10), 1st Sunday
  return date >= dstStart && date < dstEnd;
}

function nthSundayOfMonth(year: number, month: number, n: number): Date {
  const d = new Date(Date.UTC(year, month, 1));
  const dow = d.getUTCDay(); // day of week of 1st
  const firstSunday = dow === 0 ? 1 : 8 - dow;
  return new Date(Date.UTC(year, month, firstSunday + (n - 1) * 7, 7, 0, 0)); // 7 AM UTC on that Sunday
}
