import { ReplitConnectors } from "@replit/connectors-sdk";
import { logger } from "./logger";

// Google Calendar integration via Replit Connectors SDK
// Connection: conn_google-calendar_01KR7NZVJZW5MFJZ7WHPCEW8XM

const connectors = new ReplitConnectors();

export interface CalendarEventOptions {
  summary: string;
  description: string;
  date: string; // YYYY-MM-DD
  reminderMinutes?: number; // default 24hrs = 1440
  calendarId?: string; // default "primary"
}

export async function createCalendarEvent(opts: CalendarEventOptions): Promise<string | null> {
  const {
    summary,
    description,
    date,
    reminderMinutes = 1440,
    calendarId = "primary",
  } = opts;

  const body = {
    summary,
    description,
    start: { date },
    end: { date },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: reminderMinutes },
        { method: "popup", minutes: reminderMinutes },
      ],
    },
  };

  try {
    const response = await connectors.proxy(
      "google-calendar",
      `/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json() as { id?: string; error?: { message: string } };
    if (data.error) {
      logger.warn({ error: data.error }, "Google Calendar event creation failed");
      return null;
    }
    logger.info({ eventId: data.id, date, summary }, "Google Calendar event created");
    return data.id ?? null;
  } catch (err) {
    logger.warn({ err }, "Google Calendar request error");
    return null;
  }
}
