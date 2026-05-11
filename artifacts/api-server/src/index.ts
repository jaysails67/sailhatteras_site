import { createRequire } from "module";
const require = createRequire(import.meta.url);
try { require("dotenv").config(); } catch { /* dotenv optional in Replit — env vars already injected */ }

import app from "./app";
import { logger } from "./lib/logger";
import { seed } from "./seed";
import { registerWebhook } from "./lib/telegram";
import { sendDailyBriefing } from "./lib/dailyBriefing";
import { startEmailAgent } from "./routes/sh-agentmail";
import cron from "node-cron";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, async (err?: Error) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  await seed();
  await registerWebhook();
  startEmailAgent();

  // Daily 7 AM Eastern briefing via Telegram
  // 7 AM EDT (UTC-4, summer) = 11:00 UTC → cron "0 11 * * *"
  // 7 AM EST (UTC-5, winter) = 12:00 UTC → cron "0 12 * * *"
  // We schedule both and the briefing function handles the ET date calculation.
  if (process.env.NODE_ENV !== "development") {
    cron.schedule("0 11 * * *", () => {
      logger.info("Running daily 7 AM ET briefing (EDT schedule)");
      sendDailyBriefing();
    }, { timezone: "UTC" });

    cron.schedule("0 12 * * *", () => {
      logger.info("Running daily 7 AM ET briefing (EST schedule)");
      sendDailyBriefing();
    }, { timezone: "UTC" });

    logger.info("Daily briefing cron scheduled (7 AM Eastern)");
  }
});
