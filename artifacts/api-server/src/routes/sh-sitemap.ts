/**
 * Dynamic XML sitemap for SailHatteras.org
 * GET /sitemap.xml — includes all static pages + live trip slugs from DB
 */

import { Router } from "express";
import { db } from "@workspace/db";
import { shTripsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

const BASE = "https://sailhatteras.org";

const STATIC_PAGES = [
  { loc: "/",           changefreq: "weekly",  priority: "1.0" },
  { loc: "/trips",      changefreq: "weekly",  priority: "0.9" },
  { loc: "/about",      changefreq: "monthly", priority: "0.8" },
  { loc: "/membership", changefreq: "monthly", priority: "0.8" },
  { loc: "/contact",    changefreq: "monthly", priority: "0.7" },
  { loc: "/support",    changefreq: "monthly", priority: "0.6" },
];

router.get("/sitemap.xml", async (_req, res) => {
  try {
    const trips = await db
      .select({ slug: shTripsTable.slug })
      .from(shTripsTable)
      .where(eq(shTripsTable.active, true))
      .orderBy(asc(shTripsTable.sortOrder));

    const today = new Date().toISOString().slice(0, 10);

    const urls = [
      ...STATIC_PAGES.map(
        (p) => `
  <url>
    <loc>${BASE}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
      ),
      ...trips.map(
        (t) => `
  <url>
    <loc>${BASE}/trips/${t.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`,
      ),
    ].join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    res.status(500).send("<?xml version=\"1.0\"?><error>Sitemap generation failed</error>");
  }
});

export default router;
