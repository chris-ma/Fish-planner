export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const log: string[] = [];

  // Add availability column to existing trip_participants rows
  try {
    await db.run(sql`ALTER TABLE trip_participants ADD COLUMN availability TEXT NOT NULL DEFAULT 'going'`);
    log.push("OK: added availability column to trip_participants");
  } catch (e: unknown) {
    log.push(`SKIP: ${e instanceof Error ? e.message : String(e)}`);
  }

  // Create trip_tasks table
  try {
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS trip_tasks (
        id TEXT PRIMARY KEY,
        trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        assigned_to TEXT,
        is_complete INTEGER NOT NULL DEFAULT 0,
        needs_approval INTEGER NOT NULL DEFAULT 0,
        is_approved INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      )
    `);
    log.push("OK: created trip_tasks table");
  } catch (e: unknown) {
    log.push(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
  }

  return NextResponse.json({ ok: true, log });
}
