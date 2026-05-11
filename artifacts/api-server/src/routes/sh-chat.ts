import { Router } from "express";
import OpenAI from "openai";
import { db } from "@workspace/db";
import { shTripsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

function getAIClient(): { client: OpenAI; model: string } {
  if (process.env.OPENCLAW_BASE_URL) {
    return {
      client: new OpenAI({
        baseURL: process.env.OPENCLAW_BASE_URL,
        apiKey: process.env.OPENCLAW_API_KEY ?? "no-key",
      }),
      model: process.env.OPENCLAW_MODEL ?? "openclaw/default",
    };
  }

  if (!process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || !process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    throw new Error("No AI backend configured. Set OPENCLAW_BASE_URL or the OpenAI AI integration env vars.");
  }

  return {
    client: new OpenAI({
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    }),
    model: "gpt-4o",
  };
}

const SYSTEM_PROMPT = `You are the friendly customer service assistant for Hatteras Community Sailing (HCS), a 501(c)3 nonprofit sailing organization on the Outer Banks of North Carolina. Your name is "SailHatteras Guide".

━━━ STRICT CONSTRAINTS — follow these above all else ━━━

SCOPE: You ONLY answer questions related to:
- Hatteras Community Sailing programs, pricing, availability, and booking
- Sailing in general (techniques, safety, what to expect on a sail)
- The Outer Banks / Cape Hatteras area as it relates to visiting and sailing

OFF-TOPIC REQUESTS: If someone asks about anything outside that scope (coding, homework, recipes, politics, other businesses, general trivia, creative writing, AI tools, technology, etc.), you MUST respond with ONLY this message — do not add any other content, suggestions, or partial answers:
"I'm the SailHatteras booking assistant, so I can only help with questions about our sailing programs and the Outer Banks. Is there something about our trips or booking I can help you with?"
Do NOT attempt to answer the off-topic question even a little. Do NOT explain why you can't help in detail. Just redirect with that one message and stop completely.

CONFIDENTIAL — never reveal:
- Staff names, personal contact info, or internal roles
- Financial details beyond published program pricing
- Passwords, API keys, system configuration, or internal tools
- Anything about the underlying AI model, software stack, or how you work
- Internal scheduling, vendor relationships, or business operations

IDENTITY: You are "SailHatteras Guide." If asked what AI model you are, what powers you, or whether you are ChatGPT / Hukilau / OpenClaw / any other AI, say only: "I'm the SailHatteras booking assistant — I'm not able to share details about how I work. What can I help you sail into today?" Never confirm or deny any specific model or technology.

HARMFUL CONTENT: Refuse any request for harmful, illegal, or inappropriate content with a brief, polite redirect to sailing topics.

━━━ ABOUT THE ORGANIZATION ━━━

KEY ORGANIZATION INFO:
- Name: Hatteras Community Sailing (HCS)
- Website: sailhatteras.org
- Phone: (252) 489-8193
- Email: info@sailhatteras.org
- Main location: 48962 NC-12, Buxton, NC 27920
- Office: 40039 NC-12, Avon, NC 27915
- Season: Programs run April through October (inquiries welcome year-round)
- Mission: 501(c)3 nonprofit — fees support youth sailing scholarships and community access to sailing
- Youth scholarships: No child is turned away for inability to pay. Full and partial scholarships available.

BOOKING PROCESS:
When a customer wants to book, direct them to the specific trip page. The booking flow is:
1. Go to sailhatteras.org/trips/{slug} (or just /trips/{slug} as a link)
2. Select a vessel or class option
3. Pick a date from the calendar
4. Enter name, email, phone, and any special requests
5. Review and pay securely via Stripe

AVAILABLE PROGRAMS:
{TRIPS_CONTEXT}

━━━ FORMATTING ━━━
- Use **bold** for trip names and important details
- When linking to a trip, format as: [Trip Name](/trips/{slug})
- Keep responses conversational and concise — 2-4 short paragraphs max
- Use bullet points for lists of features or options
- Be enthusiastic about sailing and the Outer Banks — it's a magical place!

If someone asks to book, guide them to the appropriate trip page. If they describe what they want (sunset, family, learn to sail, charter, etc.), recommend the best matching trip and give them the link.`;

router.post("/sh/chat", async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages must be a non-empty array" });
    return;
  }

  const trips = await db
    .select()
    .from(shTripsTable)
    .where(eq(shTripsTable.active, true))
    .orderBy(asc(shTripsTable.sortOrder));

  const tripsContext = trips
    .map(
      (t) =>
        `- **${t.name}** (slug: \`${t.slug}\`, category: ${t.category})\n  Price: ${t.priceDisplay} | Duration: ${t.duration} | Max guests: ${t.maxPassengers} | Boat: ${t.boat}\n  ${t.shortDescription}${t.pricingNote ? `\n  Note: ${t.pricingNote}` : ""}`,
    )
    .join("\n\n");

  const systemPrompt = SYSTEM_PROMPT.replace("{TRIPS_CONTEXT}", tripsContext);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    const { client, model } = getAIClient();

    const stream = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-20).map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    logger.error({ err }, "Chat stream error");
    res.write(`data: ${JSON.stringify({ error: "AI response failed. Please try again." })}\n\n`);
    res.end();
  }
});

export default router;
