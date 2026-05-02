import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

/**
 * POST /storage/uploads/request-url
 *
 * Request a presigned URL for file upload.
 * The client sends JSON metadata (name, size, contentType) — NOT the file.
 * Then uploads the file directly to the returned presigned URL.
 */
router.post("/storage/uploads/request-url", requireAdmin, async (req: Request, res: Response) => {
  const { name, size, contentType } = req.body as { name?: unknown; size?: unknown; contentType?: unknown };
  if (typeof name !== "string" || typeof size !== "number" || typeof contentType !== "string") {
    res.status(400).json({ error: "Missing or invalid required fields (name, size, contentType)" });
    return;
  }

  try {
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

    res.json({ uploadURL, objectPath, metadata: { name, size, contentType } });
  } catch (error) {
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

/**
 * GET /storage/public-objects/*
 *
 * Serve public assets from PUBLIC_OBJECT_SEARCH_PATHS.
 * These are unconditionally public — no authentication or ACL checks.
 * IMPORTANT: Always provide this endpoint when object storage is set up.
 */
router.get("/storage/public-objects/*filePath", async (req: Request, res: Response) => {
  try {
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    const response = await objectStorageService.downloadObject(file);

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

/**
 * GET /storage/objects/*
 *
 * Serve object entities from PRIVATE_OBJECT_DIR with full Range request support
 * so that HTML5 audio/video players can stream and seek correctly.
 */
router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);

    const [metadata] = await objectFile.getMetadata();
    const fileSize = metadata.size ? Number(metadata.size) : null;
    const contentType = (metadata.contentType as string) || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", "private, max-age=3600");

    const rangeHeader = req.headers.range;

    if (rangeHeader && fileSize) {
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (!match) {
        res.status(400).json({ error: "Invalid Range header" });
        return;
      }

      const start = parseInt(match[1], 10);
      const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize || start > end) {
        res.setHeader("Content-Range", `bytes */${fileSize}`);
        res.status(416).end();
        return;
      }

      const chunkSize = end - start + 1;
      res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      res.setHeader("Content-Length", String(chunkSize));
      res.status(206);

      const nodeStream = objectFile.createReadStream({ start, end });
      nodeStream.pipe(res);
    } else {
      if (fileSize) {
        res.setHeader("Content-Length", String(fileSize));
      }
      res.status(200);
      const nodeStream = objectFile.createReadStream();
      nodeStream.pipe(res);
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      req.log.warn({ err: error }, "Object not found");
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
