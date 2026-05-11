import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";

const PUBLIC = "artifacts/sail-hatteras/public";

const CONFIGS = [
  { dir: join(PUBLIC, "slideshow"),    maxWidth: 1920, quality: 80 },
  { dir: join(PUBLIC, "trip-photos"),  maxWidth: 900,  quality: 82 },
  { dir: PUBLIC,                       maxWidth: 1200, quality: 82, files: ["chloe.jpg"] },
  { dir: PUBLIC,                       maxWidth: 400,  quality: 90, files: ["logo.png"] },
];

let totalSaved = 0;

async function convert(inputPath, maxWidth, quality) {
  const ext = extname(inputPath).toLowerCase();
  const outPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");

  const img = sharp(inputPath);
  const meta = await img.metadata();
  const originalSize = (await stat(inputPath)).size;

  const pipeline = img.resize({ width: Math.min(maxWidth, meta.width ?? maxWidth), withoutEnlargement: true });

  if (ext === ".png") {
    await pipeline.webp({ quality, lossless: false }).toFile(outPath);
  } else {
    await pipeline.webp({ quality }).toFile(outPath);
  }

  const newSize = (await stat(outPath)).size;
  const saved = originalSize - newSize;
  totalSaved += saved;

  const pct = Math.round((saved / originalSize) * 100);
  console.log(`✓ ${basename(inputPath)} → ${basename(outPath)}  ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB  (−${pct}%)`);
}

for (const config of CONFIGS) {
  let files;
  if (config.files) {
    files = config.files.map(f => join(config.dir, f));
  } else {
    const entries = await readdir(config.dir);
    files = entries
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      .map(f => join(config.dir, f));
  }

  for (const file of files) {
    try {
      await convert(file, config.maxWidth, config.quality);
    } catch (e) {
      console.error(`✗ ${file}: ${e.message}`);
    }
  }
}

console.log(`\nTotal saved: ${(totalSaved / 1024 / 1024).toFixed(1)} MB`);
