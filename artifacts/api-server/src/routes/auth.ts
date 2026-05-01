import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, investorApplicationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  RegisterUserBody,
  LoginUserBody,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { sendTelegramMessage } from "../lib/telegram";

const router: IRouter = Router();

function formatUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    approvalStatus: user.approvalStatus,
    ndaAccepted: user.ndaAccepted,
    createdAt: user.createdAt.toISOString(),
  };
}

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, phone, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail));
  if (existing.length > 0) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email: normalizedEmail,
      phone,
      passwordHash,
      role: "investor",
      approvalStatus: "pending",
      ndaAccepted: false,
    })
    .returning();

  await db.insert(investorApplicationsTable).values({
    userId: user.id,
    status: "pending",
  });

  req.session.userId = user.id;

  res.status(201).json({
    user: formatUser(user),
    message: "Account created successfully. Please review and accept our terms.",
  });
});

router.post("/auth/accept-nda", async (req, res): Promise<void> => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ ndaAccepted: true })
    .where(eq(usersTable.id, req.session.userId))
    .returning();

  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  await db
    .update(investorApplicationsTable)
    .set({ ndaAcceptedAt: new Date(), status: "pending" })
    .where(eq(investorApplicationsTable.userId, user.id));

  sendTelegramMessage(
    `🚀 <b>New Investor Application</b>\n` +
    `<b>ID:</b> ${user.id}\n` +
    `<b>Name:</b> ${user.name}\n` +
    `<b>Email:</b> ${user.email}\n` +
    `<b>Phone:</b> ${user.phone}\n` +
    `NDA accepted — pending your approval.\n\n` +
    `Reply <code>/approve ${user.id}</code> to grant access\n` +
    `Reply <code>/deny ${user.id} &lt;reason&gt;</code> to deny`,
  );

  const adminEmail = process.env.ADMIN_EMAIL;
  const smtpConfigured =
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (adminEmail && smtpConfigured) {
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
        to: adminEmail,
        subject: `New Investor Application — ${user.name}`,
        text:
          `A new investor has submitted an application and accepted the NDA.\n\n` +
          `ID: ${user.id}\n` +
          `Name: ${user.name}\n` +
          `Email: ${user.email}\n` +
          `Phone: ${user.phone}\n\n` +
          `Log in to the admin dashboard to review:\n` +
          `https://pamliecoconnect.com/admin`,
      });
      logger.info(
        { investorName: user.name, investorEmail: user.email, adminEmail },
        "Admin email notification sent for new investor application",
      );
    } catch (err) {
      logger.warn({ err }, "Failed to send admin investor notification email");
    }
  } else if (adminEmail) {
    logger.info(
      { investorName: user.name, investorEmail: user.email, adminEmail },
      "SMTP not configured — skipping admin email for new investor application",
    );
  }

  res.json({
    user: formatUser(user),
    message: "Thank you. Your access request is pending review. You will be notified once approved.",
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail));
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  req.session.userId = user.id;

  res.json({
    user: formatUser(user),
    message: "Logged in successfully",
  });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {});
  res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");

  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId));
  if (!user) {
    req.session.destroy(() => {});
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json(formatUser(user));
});

export default router;
