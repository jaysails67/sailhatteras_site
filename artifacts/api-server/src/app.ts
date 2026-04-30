import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

const isProd = process.env.NODE_ENV === "production";

const PRODUCTION_ORIGINS = [
  "https://pamliecoconnect.com",
  "https://www.pamliecoconnect.com",
];

const DEV_ORIGINS = [
  "http://localhost:19161",
  "http://localhost:3000",
];

function buildAllowedOrigins(): Set<string> {
  const origins = new Set<string>();
  for (const o of PRODUCTION_ORIGINS) origins.add(o);
  if (!isProd) {
    for (const o of DEV_ORIGINS) origins.add(o);
  }
  const extra = process.env.ALLOWED_ORIGINS;
  if (extra) {
    for (const o of extra.split(",").map((s) => s.trim()).filter(Boolean)) {
      origins.add(o);
    }
  }
  return origins;
}

const allowedOrigins = buildAllowedOrigins();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    const allowed =
      allowedOrigins.has(origin) ||
      origin.endsWith(".replit.dev") ||
      origin.endsWith(".replit.app");
    callback(allowed ? null : new Error("CORS: origin not allowed"), allowed);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && isProd) {
  throw new Error("SESSION_SECRET environment variable is required in production");
}

app.use(session({
  secret: sessionSecret ?? "pamliecoconnect-dev-secret-do-not-use-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProd,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  },
}));

app.use("/api", router);

export default app;
