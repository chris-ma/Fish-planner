import { NextResponse } from "next/server";
import { db } from "@/db";
import { destinations, regions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regionSlug = searchParams.get("regionSlug");

    if (!regionSlug) {
      return NextResponse.json({ error: "regionSlug is required" }, { status: 400 });
    }

    const regionRows = await db.select({ id: regions.id }).from(regions).where(eq(regions.slug, regionSlug)).limit(1);
    if (!regionRows[0]) return NextResponse.json([]);

    const data = await db.select().from(destinations).where(eq(destinations.regionId, regionRows[0].id));
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch destinations:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
