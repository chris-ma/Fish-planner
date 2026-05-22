import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as { db: DrizzleDb | undefined };

function getDb(): DrizzleDb {
  if (globalForDb.db) return globalForDb.db;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not set. Add it to your environment variables.");
  }

  const client = createClient({ url, authToken });
  const db = drizzle(client, { schema });

  if (process.env.NODE_ENV !== "production") globalForDb.db = db;
  return db;
}

// Lazy proxy — the connection is only created when a query is first executed
export const db = new Proxy({} as DrizzleDb, {
  get(_target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getDb() as any)[prop];
  },
});
