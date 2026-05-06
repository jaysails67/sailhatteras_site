/**
 * Production server: serves the Vite static build and injects
 * article-specific Open Graph tags for social media crawlers.
 */
import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { resolve, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT ?? "8081");
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const STATIC_DIR = resolve(__dirname, "dist/public");
const CANONICAL = "https://pamliecoconnect.com";
const API_BASE = "http://localhost:8080";
const CRAWLERS =
  /facebookexternalhit|Twitterbot|LinkedInBot|Slackbot|WhatsApp|TelegramBot|Googlebot|bingbot|DuckDuckBot|rogerbot/i;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "text/xml",
};

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function serveFile(filePath, res) {
  try {
    statSync(filePath);
    const mime = MIME[extname(filePath)] ?? "application/octet-stream";
    res.writeHead(200, { "Content-Type": mime });
    createReadStream(filePath).pipe(res);
    return true;
  } catch {
    return false;
  }
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

const server = createServer(async (req, res) => {
  const urlPath = (req.url ?? "/").split("?")[0];
  const ua = req.headers["user-agent"] ?? "";

  // Social crawler hitting a press article — serve OG HTML
  if (CRAWLERS.test(ua)) {
    const m = urlPath.match(/^\/press\/(\d+)$/);
    if (m) {
      try {
        const html = await buildOgHtml(m[1]);
        if (html) {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(html);
          return;
        }
      } catch {
        // fall through to static
      }
    }
  }

  // Try serving the exact file
  const filePath = join(STATIC_DIR, urlPath);
  if (serveFile(filePath, res)) return;

  // Try with /index.html appended (directory index)
  if (serveFile(join(filePath, "index.html"), res)) return;

  // SPA fallback — serve index.html for all other routes
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  createReadStream(join(STATIC_DIR, "index.html")).pipe(res);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`PamliEcoConnect production server on http://localhost:${port}/`);
});

process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());
