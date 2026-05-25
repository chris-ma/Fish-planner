import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createTrip, getTripsByOwner } from "@/lib/queries/trips";
import { db } from "@/db";
import { regions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userTrips = await getTripsByOwner(userId);
  return NextResponse.json(userTrips);
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const { title, regionSlug, startDate, endDate, targetSpecies, description, experienceId, destinationIds } = body;

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
      ownerId: userId ?? undefined,
      regionId,
      startDate,
      endDate,
      targetSpecies: Array.isArray(targetSpecies) ? targetSpecies : [],
      description,
      experienceId: typeof experienceId === "string" ? experienceId : undefined,
      destinationIds: Array.isArray(destinationIds) ? destinationIds : undefined,
    });

    return NextResponse.json({ id, shareCode });
  } catch (err) {
    console.error("Trip creation failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
