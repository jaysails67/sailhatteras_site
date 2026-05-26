import { Storage, File } from "@google-cloud/storage";
import { Readable } from "stream";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import {
  ObjectAclPolicy,
  ObjectPermission,
  canAccessObject,
  getObjectAclPolicy,
  setObjectAclPolicy,
} from "./objectAcl";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
const fsPromises = fs.promises;

type StorageType = "gcs" | "local";

function getStorageType(): StorageType {
  const storageType = process.env.STORAGE_TYPE || "local";
  if (storageType !== "gcs" && storageType !== "local") {
    throw new Error(`Invalid STORAGE_TYPE: ${storageType}. Must be 'gcs' or 'local'.`);
  }
  return storageType as StorageType;
}

function getLocalUploadDir(): string {
  const dir = process.env.LOCAL_UPLOAD_DIR || "/home/ca12a15/sites/sailhatteras_site/uploads";
  if (!dir) {
    throw new Error("LOCAL_UPLOAD_DIR not set and no default available.");
  }
  return dir;
}

export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

interface LocalFile {
  isLocal: true;
  filePath: string;
  contentType: string;
  size?: number;
}

export class ObjectStorageService {
  private storageType: StorageType;

  constructor() {
    this.storageType = getStorageType();
  }

  private isUsingLocal(): boolean {
    return this.storageType === "local";
  }

  getPublicObjectSearchPaths(): Array<string> {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr
          .split(",")
          .map((path) => path.trim())
          .filter((path) => path.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' " +
          "tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
      );
    }
    return paths;
  }

  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          "tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    return dir;
  }

  async searchPublicObject(filePath: string): Promise<File | LocalFile | null> {
    if (this.isUsingLocal()) {
      const uploadDir = getLocalUploadDir();
      const localPath = path.join(uploadDir, filePath);
      try {
        const stat = await fsPromises.stat(localPath);
        if (stat.isFile()) {
          return {
            isLocal: true,
            filePath: localPath,
            contentType: "application/octet-stream",
            size: stat.size,
          } as LocalFile;
        }
      } catch (err) {
        // File not found, continue
      }
      return null;
    }

    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;

      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);

      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }

    return null;
  }

  async downloadObject(file: File | LocalFile, cacheTtlSec: number = 3600): Promise<Response> {
    if ("isLocal" in file && file.isLocal) {
      const nodeStream = fs.createReadStream(file.filePath);
      const webStream = Readable.toWeb(nodeStream) as ReadableStream;
      const headers: Record<string, string> = {
        "Content-Type": file.contentType || "application/octet-stream",
        "Cache-Control": `private, max-age=${cacheTtlSec}`,
      };
      if (file.size) {
        headers["Content-Length"] = String(file.size);
      }
      return new Response(webStream, { headers });
    }

    const [metadata] = await (file as File).getMetadata();
    const aclPolicy = await getObjectAclPolicy(file as File);
    const isPublic = aclPolicy?.visibility === "public";

    const nodeStream = (file as File).createReadStream();
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    const headers: Record<string, string> = {
      "Content-Type": (metadata.contentType as string) || "application/octet-stream",
      "Cache-Control": `${isPublic ? "public" : "private"}, max-age=${cacheTtlSec}`,
    };
    if (metadata.size) {
      headers["Content-Length"] = String(metadata.size);
    }

    return new Response(webStream, { headers });
  }

  async getObjectEntityUploadURL(): Promise<string> {
    if (this.isUsingLocal()) {
      const uploadDir = getLocalUploadDir();
      await fsPromises.mkdir(uploadDir, { recursive: true });
      const objectId = randomUUID();
      const uploadPath = path.join(uploadDir, "uploads", objectId);
      await fsPromises.mkdir(path.dirname(uploadPath), { recursive: true });
      // Return the presigned URL endpoint (the API endpoint, not a file path)
      return `/api/storage/uploads/${objectId}`;
    }

    const privateObjectDir = this.getPrivateObjectDir();
    if (!privateObjectDir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          "tool and set PRIVATE_OBJECT_DIR env var."
      );
    }

    const objectId = randomUUID();
    const fullPath = `${privateObjectDir}/uploads/${objectId}`;

    const { bucketName, objectName } = parseObjectPath(fullPath);

    return signObjectURL({
      bucketName,
      objectName,
      method: "PUT",
      ttlSec: 900,
    });
  }

  async getSignedReadUrl(objectFile: File | LocalFile, ttlSec: number = 300): Promise<string> {
    if ("isLocal" in objectFile && objectFile.isLocal) {
      // For local files, just return the file path as a URI
      return objectFile.filePath;
    }
    const { bucketName, objectName } = parseObjectPath(
      `/${(objectFile as File).bucket.name}/${(objectFile as File).name}`
    );
    return signObjectURL({ bucketName, objectName, method: "GET", ttlSec });
  }

  async getObjectEntityFile(objectPath: string): Promise<File | LocalFile> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }

    const parts = objectPath.slice(1).split("/");
    if (parts.length < 2) {
      throw new ObjectNotFoundError();
    }

    if (this.isUsingLocal()) {
      const uploadDir = getLocalUploadDir();
      const entityId = parts.slice(1).join("/");
      // If entityId already starts with "uploads/", don't add it again
      const localPath = entityId.startsWith("uploads/")
        ? path.join(uploadDir, entityId)
        : path.join(uploadDir, "uploads", entityId);
      try {
        const stat = await fsPromises.stat(localPath);
        if (stat.isFile()) {
          return {
            isLocal: true,
            filePath: localPath,
            contentType: "application/octet-stream",
            size: stat.size,
          } as LocalFile;
        }
      } catch (err) {
        throw new ObjectNotFoundError();
      }
      throw new ObjectNotFoundError();
    }

    const entityId = parts.slice(1).join("/");
    let entityDir = this.getPrivateObjectDir();
    if (!entityDir.endsWith("/")) {
      entityDir = `${entityDir}/`;
    }
    const objectEntityPath = `${entityDir}${entityId}`;
    const { bucketName, objectName } = parseObjectPath(objectEntityPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const objectFile = bucket.file(objectName);
    const [exists] = await objectFile.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return objectFile;
  }

  normalizeObjectEntityPath(rawPath: string): string {
    // For local uploads, convert /uploads/{uuid} or /api/storage/uploads/{uuid} to /objects/uploads/{uuid}
    if (!rawPath.startsWith("https://storage.googleapis.com/")) {
      if (rawPath.startsWith("/uploads/")) {
        return `/objects${rawPath}`;
      }
      if (rawPath.startsWith("/api/storage/uploads/")) {
        const uuid = rawPath.split('/').pop();
        return `/objects/uploads/${uuid}`;
      }
      return rawPath;
    }

    const url = new URL(rawPath);
    const rawObjectPath = url.pathname;

    let objectEntityDir = this.getPrivateObjectDir();
    if (!objectEntityDir.endsWith("/")) {
      objectEntityDir = `${objectEntityDir}/`;
    }

    if (!rawObjectPath.startsWith(objectEntityDir)) {
      return rawObjectPath;
    }

    const entityId = rawObjectPath.slice(objectEntityDir.length);
    return `/objects/${entityId}`;
  }

  async trySetObjectEntityAclPolicy(
    rawPath: string,
    aclPolicy: ObjectAclPolicy
  ): Promise<string> {
    const normalizedPath = this.normalizeObjectEntityPath(rawPath);
    if (!normalizedPath.startsWith("/")) {
      return normalizedPath;
    }

    if (this.isUsingLocal()) {
      // Local filesystem doesn't support ACL policies, just return the path
      return normalizedPath;
    }

    const objectFile = await this.getObjectEntityFile(normalizedPath) as File;
    await setObjectAclPolicy(objectFile, aclPolicy);
    return normalizedPath;
  }

  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: File | LocalFile;
    requestedPermission?: ObjectPermission;
  }): Promise<boolean> {
    if ("isLocal" in objectFile && objectFile.isLocal) {
      // Local files are always accessible (no ACL)
      return true;
    }
    return canAccessObject({
      userId,
      objectFile: objectFile as File,
      requestedPermission: requestedPermission ?? ObjectPermission.READ,
    });
  }
}

function parseObjectPath(path: string): {
  bucketName: string;
  objectName: string;
} {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  const pathParts = path.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }

  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");

  return {
    bucketName,
    objectName,
  };
}

async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec,
}: {
  bucketName: string;
  objectName: string;
  method: "GET" | "PUT" | "DELETE" | "HEAD";
  ttlSec: number;
}): Promise<string> {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(30_000),
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}, ` +
        `make sure you're running on Replit`
    );
  }

  const { signed_url: signedURL } = await response.json();
  return signedURL;
}
