import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db } from "@workspace/db";
import { shTripsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

const SYSTEM_PROMPT = `You are the friendly customer service assistant for Hatteras Community Sailing (HCS), a 501(c)3 nonprofit sailing organization on the Outer Banks of North Carolina. Your name is "SailHatteras Guide".

You help customers with:
- Learning about sailing programs and experiences
- Answering questions about pricing, duration, availability, and what to expect
- Guiding them through the booking process step-by-step
- Answering questions about the Hatteras area and sailing

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

FORMATTING INSTRUCTIONS:
- Use **bold** for trip names and important details
- When linking to a trip, format as: [Trip Name](/trips/{slug})
- Keep responses conversational and concise — 2-4 short paragraphs max
- Use bullet points for lists of features or options
- Be enthusiastic about sailing and the Outer Banks — it's a magical place!

IMPORTANT: If someone asks to book, guide them to the appropriate trip page. If they describe what they want (sunset, family, learn to sail, charter, etc.), recommend the best matching trip and give them the link.`;

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
    const stream = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 8192,
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
