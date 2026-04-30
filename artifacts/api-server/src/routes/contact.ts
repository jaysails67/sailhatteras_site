import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactSubmissionsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { SubmitContactBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function formatSubmission(s: typeof contactSubmissionsTable.$inferSelect) {
  return {
    id: s.id,
    name: s.name,
    email: s.email,
    message: s.message,
    createdAt: s.createdAt.toISOString(),
  };
}

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.honeypot && parsed.data.honeypot.trim() !== "") {
    res.status(201).json({ message: "Thank you for your message. We'll be in touch soon." });
    return;
  }

  const { name, email, message } = parsed.data;

  await db.insert(contactSubmissionsTable).values({ name, email, message });

  const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (smtpConfigured) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: "info@pamliecoconnect.com",
        subject: `Contact form: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      });
    } catch (err) {
      logger.warn({ err }, "Failed to send contact email");
    }
  }

  res.status(201).json({ message: "Thank you for your message. We'll be in touch soon." });
});

router.get("/contact", requireAdmin, async (_req, res): Promise<void> => {
  const submissions = await db
    .select()
    .from(contactSubmissionsTable)
    .orderBy(desc(contactSubmissionsTable.createdAt));
  res.json(submissions.map(formatSubmission));
});

export default router;
