import { Store } from "express-session";
import { db, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

export class DrizzleSessionStore extends Store {
  get(sid: string, callback: (err: any, session?: Express.Sessional | null) => void): void {
    db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.sid, sid))
      .then((sessions) => {
        const session = sessions[0];
        if (!session) {
          callback(null, null);
          return;
        }

        // Check if session has expired
        if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
          // Session expired, delete it
          db.delete(sessionsTable).where(eq(sessionsTable.sid, sid)).then(() => {
            callback(null, null);
          }).catch((err) => {
            logger.error({ err, sid }, "Error deleting expired session");
            callback(err);
          });
          return;
        }

        callback(null, session.data as any);
      })
      .catch((err) => {
        logger.error({ err, sid }, "Error retrieving session from database");
        callback(err);
      });
  }

  set(sid: string, session: Express.Session, callback?: (err?: any) => void): void {
    const expiresAt = new Date(Date.now() + (session.cookie.maxAge || 7 * 24 * 60 * 60 * 1000));

    logger.debug({ sid, expiresAt }, "Saving session to database");

    db
      .insert(sessionsTable)
      .values({
        sid,
        data: session as any,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: sessionsTable.sid,
        set: {
          data: session as any,
          expiresAt,
        },
      })
      .then(() => {
        logger.debug({ sid }, "Session saved successfully");
        if (callback) callback();
      })
      .catch((err) => {
        logger.error({ err, sid }, "Error saving session to database");
        if (callback) callback(err);
      });
  }

  destroy(sid: string, callback?: (err?: any) => void): void {
    logger.debug({ sid }, "Destroying session");
    db
      .delete(sessionsTable)
      .where(eq(sessionsTable.sid, sid))
      .then(() => {
        logger.debug({ sid }, "Session destroyed successfully");
        if (callback) callback();
      })
      .catch((err) => {
        logger.error({ err, sid }, "Error destroying session from database");
        if (callback) callback(err);
      });
  }

  // Optional: Cleanup expired sessions (can be called periodically)
  async clearExpiredSessions(): Promise<void> {
    try {
      const now = new Date();
      const result = await db
        .delete(sessionsTable)
        .where(sessionsTable.expiresAt < now);
      logger.info("Cleared expired sessions");
    } catch (err) {
      logger.error({ err }, "Error clearing expired sessions");
    }
  }
}
