export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const log: string[] = [];
  try {
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS charters (
        id TEXT PRIMARY KEY NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        operator_name TEXT NOT NULL,
        operator_email TEXT NOT NULL,
        operator_phone TEXT,
        description TEXT,
        experience_slug TEXT,
        home_port TEXT NOT NULL,
        region_id TEXT REFERENCES regions(id),
        boat_name TEXT,
        boat_type TEXT,
        max_guests INTEGER NOT NULL DEFAULT 6,
        duration_days INTEGER NOT NULL DEFAULT 1,
        price_label TEXT,
        hero_image TEXT,
        featured INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      )
    `);
    log.push("✅ charters table created (or already exists)");

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS charter_enquiries (
        id TEXT PRIMARY KEY NOT NULL,
        charter_id TEXT NOT NULL REFERENCES charters(id) ON DELETE CASCADE,
        user_id TEXT,
        guest_name TEXT NOT NULL,
        guest_email TEXT NOT NULL,
        guest_phone TEXT,
        preferred_date_from TEXT NOT NULL,
        preferred_date_to TEXT NOT NULL,
        guest_count INTEGER NOT NULL DEFAULT 1,
        skill_level TEXT,
        message TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL
      )
    `);
    log.push("✅ charter_enquiries table created (or already exists)");

    log.push("🎉 Migration complete");
    return NextResponse.json({ ok: true, log });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err), log }, { status: 500 });
  }
}
