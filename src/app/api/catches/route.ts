import { NextResponse } from "next/server";
import { db } from "@/db";
import { catchLog } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

async function ensureTable() {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS catch_log (
      id TEXT PRIMARY KEY,
      species_slug TEXT NOT NULL,
      catcher_name TEXT NOT NULL DEFAULT 'Anonymous',
      caught_at TEXT NOT NULL,
      location TEXT,
      weather_conditions TEXT,
      tide_phase TEXT,
      length_cm REAL,
      weight_kg REAL,
      gear_used TEXT,
      photo_url TEXT,
      notes TEXT,
      created_at TEXT NOT NULL
    )
  `);
}

export async function GET(request: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(request.url);
    const catcherName = searchParams.get("catcherName");
    const rows = catcherName
      ? await db.select().from(catchLog).where(eq(catchLog.catcherName, catcherName)).orderBy(desc(catchLog.caughtAt))
      : await db.select().from(catchLog).orderBy(desc(catchLog.caughtAt));
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Catches GET failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();
    const body = await request.json();
    const { speciesSlug, catcherName, caughtAt, location, weatherConditions, tidePhase, lengthCm, weightKg, gearUsed, photoUrl, notes } = body;
    if (!speciesSlug || !caughtAt) {
      return NextResponse.json({ error: "speciesSlug and caughtAt are required" }, { status: 400 });
    }
    const row = {
      id: nanoid(),
      speciesSlug,
      catcherName: catcherName || "Anonymous",
      caughtAt,
      location: location || null,
      weatherConditions: weatherConditions || null,
      tidePhase: tidePhase || null,
      lengthCm: lengthCm ? Number(lengthCm) : null,
      weightKg: weightKg ? Number(weightKg) : null,
      gearUsed: gearUsed || null,
      photoUrl: photoUrl || null,
      notes: notes || null,
      createdAt: new Date().toISOString(),
    };
    await db.insert(catchLog).values(row);
    return NextResponse.json(row);
  } catch (err) {
    console.error("Catches POST failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
