/**
 * Custom dev server that wraps Vite in middleware mode.
 * Social-media crawlers hitting /press/:id get a server-rendered HTML page
 * with correct Open Graph meta tags. All other requests pass through to Vite.
 */
import { createServer as createViteServer } from "vite";
import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";

const port = Number(process.env.PORT ?? "5173");
const CANONICAL = "https://pamliecoconnect.com";
const API_BASE = "http://localhost:8080";
const CRAWLERS =
  /facebookexternalhit|Twitterbot|LinkedInBot|Slackbot|WhatsApp|TelegramBot|Googlebot|bingbot|DuckDuckBot|rogerbot/i;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function buildOgHtml(id) {
  const r = await fetch(`${API_BASE}/api/posts/${id}`);
  if (!r.ok) return null;
  const post = await r.json();
  const pageUrl = `${CANONICAL}/press/${id}`;
  const img = `${CANONICAL}/opengraph.jpg`;
  const title = esc(post.title ?? "PamliEcoConnect");
  const desc = esc(post.excerpt ?? "Phillips Boatworks electric foiling boats.");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title} — PamliEcoConnect</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${pageUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="PamliEcoConnect — Phillips Boatworks Electric Foiling Boats" />
  <meta property="og:image" content="${img}" />
  <meta property="og:image:width" content="1280" />
  <meta property="og:image:height" content="720" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="${img}" />
</head>
<body>
  <h1>${title}</h1>
  <p>${desc}</p>
  <p><a href="${pageUrl}">Read more at PamliEcoConnect</a></p>
</body>
</html>`;
}

const vite = await createViteServer({
  configFile: path.join(__dirname, "vite.config.ts"),
  server: {
    middlewareMode: true,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: API_BASE,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  appType: "spa",
});

const server = createHttpServer(async (req, res) => {
  const ua = req.headers["user-agent"] ?? "";
  if (CRAWLERS.test(ua)) {
    const m = (req.url ?? "").split("?")[0].match(/^\/press\/(\d+)$/);
    if (m) {
      try {
        const html = await buildOgHtml(m[1]);
        if (html) {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(html);
          return;
        }
      } catch {
        // fall through to Vite
      }
    }
  }

  vite.middlewares(req, res, () => {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`  ➜  OG-aware server: http://localhost:${port}/`);
});

process.on("SIGTERM", async () => {
  await vite.close();
  server.close();
});
process.on("SIGINT", async () => {
  await vite.close();
  server.close();
});
