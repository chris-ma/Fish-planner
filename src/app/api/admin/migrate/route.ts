export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) return NextResponse.json({ error: "TURSO_DATABASE_URL not set" }, { status: 500 });

  const client = createClient({ url, authToken });
  const results: Record<string, string> = {};

  // 1. Check if trip_participants.availability exists
  try {
    const info = await client.execute("PRAGMA table_info(trip_participants)");
    const hasAvailability = info.rows.some((r) => r[1] === "availability");
    if (hasAvailability) {
      results["trip_participants.availability"] = "already exists";
    } else {
      await client.execute(
        `ALTER TABLE trip_participants ADD COLUMN availability TEXT NOT NULL DEFAULT 'going'`
      );
      results["trip_participants.availability"] = "added";
    }
  } catch (e) {
    results["trip_participants.availability"] = `error: ${e}`;
  }

  // 2. Check if trip_tasks table exists
  try {
    const tables = await client.execute(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='trip_tasks'`
    );
    if (tables.rows.length > 0) {
      results["trip_tasks"] = "already exists";
    } else {
      await client.execute(`
        CREATE TABLE trip_tasks (
          id TEXT PRIMARY KEY,
          trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          assigned_to TEXT,
          is_complete INTEGER NOT NULL DEFAULT 0,
          needs_approval INTEGER NOT NULL DEFAULT 0,
          is_approved INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
      `);
      results["trip_tasks"] = "created";
    }
  } catch (e) {
    results["trip_tasks"] = `error: ${e}`;
  }

  return NextResponse.json({ ok: true, results });
}
