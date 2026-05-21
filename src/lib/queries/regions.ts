import { db } from "@/db";
import { regions, seasonWindows, species } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { ratingScore, type Rating } from "@/lib/utils/season";

export async function listRegions() {
  return db.select().from(regions).orderBy(regions.state, regions.name);
}

export async function getRegionBySlug(slug: string) {
  const rows = await db.select().from(regions).where(eq(regions.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getRegionsInZone(zone: string) {
  return db.select().from(regions).where(eq(regions.zone, zone));
}

export type SeasonRow = {
  speciesId: string;
  speciesSlug: string;
  commonName: string;
  category: string;
  months: (string | null)[];
};

export async function getSeasonCalendarForRegion(regionId: string): Promise<SeasonRow[]> {
  const windows = await db
    .select({
      speciesId: seasonWindows.speciesId,
      month: seasonWindows.month,
      rating: seasonWindows.rating,
      speciesSlug: species.slug,
      commonName: species.commonName,
      category: species.category,
    })
    .from(seasonWindows)
    .innerJoin(species, eq(seasonWindows.speciesId, species.id))
    .where(eq(seasonWindows.regionId, regionId));

  const map = new Map<string, SeasonRow>();

  for (const w of windows) {
    if (!map.has(w.speciesId)) {
      map.set(w.speciesId, {
        speciesId: w.speciesId,
        speciesSlug: w.speciesSlug,
        commonName: w.commonName,
        category: w.category,
        months: Array(13).fill(null),
      });
    }
    const row = map.get(w.speciesId)!;
    row.months[w.month] = w.rating;
  }

  // Sort by peak-season score descending
  return Array.from(map.values()).sort((a, b) => {
    const scoreA = a.months.reduce((s, r) => s + ratingScore(r as Rating | null), 0);
    const scoreB = b.months.reduce((s, r) => s + ratingScore(r as Rating | null), 0);
    return scoreB - scoreA;
  });
}

export async function getTopRegionsForMonth(month: number, limit = 6) {
  const windows = await db
    .select({
      regionId: seasonWindows.regionId,
      rating: seasonWindows.rating,
    })
    .from(seasonWindows)
    .where(eq(seasonWindows.month, month));

  const scoreMap = new Map<string, number>();
  for (const w of windows) {
    const current = scoreMap.get(w.regionId) ?? 0;
    scoreMap.set(w.regionId, current + ratingScore(w.rating as Rating));
  }

  const topIds = Array.from(scoreMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);

  if (topIds.length === 0) return [];

  const rows = await db.select().from(regions).where(inArray(regions.id, topIds));
  return rows.sort((a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0));
}
