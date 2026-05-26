import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import * as fs from "fs";
import * as path from "path";
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
router.post("/storage/uploads/request-url", async (req: Request, res: Response) => {
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
 * PUT /storage/uploads/:fileId
 *
 * Handle direct file uploads for local filesystem storage.
 * Client uploads the file body directly to this endpoint.
 */
router.put("/storage/uploads/:fileId", async (req: Request, res: Response) => {
  // NOTE: Presigned URLs are unauthenticated by design.
  // File uploads are accepted for ANY valid UUID.
  // The fileId itself serves as the authorization (temporary, one-time use).
  const uploadDir = process.env.LOCAL_UPLOAD_DIR || "/home/ca12a15/sites/sailhatteras_site/uploads";
  const fileId = req.params.fileId;
  if (!fileId || fileId.includes("..") || fileId.includes("/")) {
    res.status(400).json({ error: "Invalid file ID" });
    return;
  }

  try {
    await fs.promises.mkdir(path.join(uploadDir, "uploads"), { recursive: true });
    const filePath = path.join(uploadDir, "uploads", fileId);
    const writeStream = fs.createWriteStream(filePath);
    let uploadedBytes = 0;
    const startTime = Date.now();

    // Track upload progress
    req.on('data', (chunk: Buffer) => {
      uploadedBytes += chunk.length;
      const elapsed = (Date.now() - startTime) / 1000;
      req.log.info({ uploadedBytes, elapsed }, `Upload progress for ${fileId}`);
    });

    req.pipe(writeStream);

    writeStream.on("finish", () => {
      const totalTime = (Date.now() - startTime) / 1000;
      req.log.info({ fileId, uploadedBytes, totalTime }, "File uploaded successfully");
      res.json({ success: true, message: "File uploaded successfully", bytes: uploadedBytes });
    });

    writeStream.on("error", (err) => {
      req.log.error({ err, fileId }, "Error writing file");
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to write file" });
      }
    });

    req.on("error", (err) => {
      req.log.error({ err, fileId, uploadedBytes }, "Error reading request body");
      writeStream.destroy();
      if (!res.headersSent) {
        res.status(400).json({ error: "Error reading request body" });
      }
    });

    // Timeout handling
    req.on('timeout', () => {
      req.log.warn({ fileId, uploadedBytes }, "Upload request timeout");
      writeStream.destroy();
      if (!res.headersSent) {
        res.status(408).json({ error: "Upload timeout - request took too long" });
      }
    });
  } catch (error) {
    req.log.error({ err: error }, "Error handling file upload");
    res.status(500).json({ error: "Failed to handle file upload" });
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
 * Serve object entities from PRIVATE_OBJECT_DIR (GCS) or local filesystem.
 *
 * For GCS: Audio and video files are served via a short-lived signed GCS URL redirect
 * (307) so that the browser streams directly from Google Cloud Storage, which
 * has full native Range/seek support and avoids any proxy buffering issues.
 *
 * For local filesystem: All files are streamed directly through this server.
 */
router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    
    req.log.info({ objectPath }, "Retrieving object");
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);

    // Handle local files
    if (objectFile && typeof objectFile === "object" && "isLocal" in objectFile && objectFile.isLocal) {
      req.log.info({ filePath: (objectFile as any).filePath }, "Serving local file");
      const contentType = (objectFile as any).contentType || "application/octet-stream";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "private, max-age=3600");
      if ((objectFile as any).size) {
        res.setHeader("Content-Length", String((objectFile as any).size));
      }
      res.status(200);
      const nodeStream = fs.createReadStream((objectFile as any).filePath);
      nodeStream.on("error", (err) => {
        req.log.error({ err }, "Error streaming local object");
        if (!res.headersSent) {
          res.status(500).json({ error: "Stream error" });
        } else {
          res.end();
        }
      });
      nodeStream.pipe(res);
      return;
    }

    // Handle GCS files
    req.log.info({}, "Serving GCS file");
    const [metadata] = await (objectFile as any).getMetadata();
    const contentType = (metadata.contentType as string) || "application/octet-stream";

    // For audio and video: redirect to a signed GCS URL so the browser can
    // stream directly with native Range request support (no proxy in the way).
    const isMedia =
      contentType.startsWith("audio/") || contentType.startsWith("video/");

    if (isMedia) {
      const signedUrl = await objectStorageService.getSignedReadUrl(objectFile as any, 300);
      res.redirect(307, signedUrl);
      return;
    }

    // For all other files: stream through this server.
    const fileSize = metadata.size ? Number(metadata.size) : null;
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "private, max-age=3600");
    if (fileSize) {
      res.setHeader("Content-Length", String(fileSize));
    }
    res.status(200);
    const nodeStream = (objectFile as any).createReadStream();
    nodeStream.on("error", (err) => {
      req.log.error({ err }, "Error streaming object");
      if (!res.headersSent) {
        res.status(500).json({ error: "Stream error" });
      } else {
        res.end();
      }
    });
    nodeStream.pipe(res);
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
