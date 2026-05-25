export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const log: string[] = [];

  try {
    // destinations table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS destinations (
        id TEXT PRIMARY KEY NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        region_id TEXT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
        description TEXT,
        latitude REAL,
        longitude REAL,
        tags TEXT,
        created_at TEXT NOT NULL
      )
    `);
    log.push("✅ destinations table created (or already exists)");

    // experiences table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS experiences (
        id TEXT PRIMARY KEY NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        target_species_slugs TEXT NOT NULL,
        primary_technique_slug TEXT
      )
    `);
    log.push("✅ experiences table created (or already exists)");

    // experience_destinations junction
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS experience_destinations (
        experience_id TEXT NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
        destination_id TEXT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
        UNIQUE(experience_id, destination_id)
      )
    `);
    log.push("✅ experience_destinations table created (or already exists)");

    // Add experience_id column to trips if missing
    try {
      await db.run(sql`ALTER TABLE trips ADD COLUMN experience_id TEXT REFERENCES experiences(id)`);
      log.push("✅ trips.experience_id column added");
    } catch {
      log.push("ℹ️ trips.experience_id already exists");
    }

    // Add destination_ids column to trips if missing
    try {
      await db.run(sql`ALTER TABLE trips ADD COLUMN destination_ids TEXT`);
      log.push("✅ trips.destination_ids column added");
    } catch {
      log.push("ℹ️ trips.destination_ids already exists");
    }

    log.push("🎉 Migration complete");
    return NextResponse.json({ ok: true, log });
  } catch (err) {
    console.error("Migration failed:", err);
    return NextResponse.json({ ok: false, error: String(err), log }, { status: 500 });
  }
}
