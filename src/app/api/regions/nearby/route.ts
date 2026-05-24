import { NextResponse } from "next/server";
import { db } from "@/db";
import { regions, seasonWindows } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ratingScore, type Rating } from "@/lib/utils/season";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");
  const month = parseInt(searchParams.get("month") ?? "0");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  const allRegions = await db.select().from(regions);
  const withCoords = allRegions.filter((r) => r.latitude != null && r.longitude != null);

  // Compute season score for each region this month
  let scoreMap = new Map<string, number>();
  if (month >= 1 && month <= 12) {
    const windows = await db
      .select({ regionId: seasonWindows.regionId, rating: seasonWindows.rating })
      .from(seasonWindows)
      .where(eq(seasonWindows.month, month));
    for (const w of windows) {
      scoreMap.set(w.regionId, (scoreMap.get(w.regionId) ?? 0) + ratingScore(w.rating as Rating));
    }
  }

  const sorted = withCoords
    .map((r) => ({
      ...r,
      distanceKm: haversineKm(lat, lng, r.latitude!, r.longitude!),
      seasonScore: scoreMap.get(r.id) ?? 0,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 4);

  return NextResponse.json(sorted);
}
