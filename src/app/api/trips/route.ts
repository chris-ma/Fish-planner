import { NextResponse } from "next/server";
import { createTrip } from "@/lib/queries/trips";
import { db } from "@/db";
import { regions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, regionSlug, startDate, endDate, targetSpecies, description } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    let regionId: string | undefined;
    if (regionSlug) {
      const rows = await db.select().from(regions).where(eq(regions.slug, regionSlug)).limit(1);
      regionId = rows[0]?.id;
    }

    const { id, shareCode } = await createTrip({
      title: title.trim(),
      regionId,
      startDate,
      endDate,
      targetSpecies: Array.isArray(targetSpecies) ? targetSpecies : [],
      description,
    });

    return NextResponse.json({ id, shareCode });
  } catch (err) {
    console.error("Trip creation failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
