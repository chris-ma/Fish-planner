import { db } from "@/db";
import { species, seasonWindows, regions, speciesTechniques, techniques } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { ratingScore, type Rating } from "@/lib/utils/season";

const NEW_SPECIES = [
  {
    id: "s0051",
    slug: "yellowtail-scad",
    commonName: "Yellowtail Scad",
    scientificName: "Trachurus novaezelandiae",
    category: "inshore",
    description: "Prolific schooling baitfish found all along the east coast. Outstanding live bait for kingfish, snapper, and tuna — and genuinely good eating when kept fresh. Schools are marked by diving birds and frigate-birds over bait balls.",
    minLegalSizeMm: 180,
    bagLimit: null,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "s0052",
    slug: "calamari-squid",
    commonName: "Calamari / Squid / Cuttlefish",
    scientificName: null,
    category: "inshore",
    description: "Covers southern calamari, arrow squid, broad squid, and cuttlefish. Jigged at night under lights in bays and estuaries across southern Australia; found over reef and sand flats in warmer months. Exceptional eating and the ultimate all-purpose bait.",
    minLegalSizeMm: 150,
    bagLimit: 15,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
];

export async function listSpecies() {
  await db.insert(species).values(NEW_SPECIES).onConflictDoNothing();
  return db.select().from(species).orderBy(species.commonName);
}

export async function getSpeciesBySlug(slug: string) {
  const rows = await db.select().from(species).where(eq(species.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getSpeciesWithTechniques(speciesId: string) {
  return db
    .select({ technique: techniques })
    .from(speciesTechniques)
    .innerJoin(techniques, eq(speciesTechniques.techniqueId, techniques.id))
    .where(eq(speciesTechniques.speciesId, speciesId));
}

export type RegionSeasonRow = {
  regionId: string;
  regionSlug: string;
  regionName: string;
  state: string;
  zone: string;
  months: (string | null)[];
  peakMonths: number[];
};

export async function getBestRegionsForSpecies(speciesId: string): Promise<RegionSeasonRow[]> {
  const windows = await db
    .select({
      regionId: seasonWindows.regionId,
      month: seasonWindows.month,
      rating: seasonWindows.rating,
      regionSlug: regions.slug,
      regionName: regions.name,
      state: regions.state,
      zone: regions.zone,
    })
    .from(seasonWindows)
    .innerJoin(regions, eq(seasonWindows.regionId, regions.id))
    .where(eq(seasonWindows.speciesId, speciesId));

  const map = new Map<string, RegionSeasonRow>();

  for (const w of windows) {
    if (!map.has(w.regionId)) {
      map.set(w.regionId, {
        regionId: w.regionId,
        regionSlug: w.regionSlug,
        regionName: w.regionName,
        state: w.state,
        zone: w.zone,
        months: Array(13).fill(null),
        peakMonths: [],
      });
    }
    const row = map.get(w.regionId)!;
    row.months[w.month] = w.rating;
    if (w.rating === "peak") row.peakMonths.push(w.month);
  }

  return Array.from(map.values()).sort((a, b) => {
    const scoreA = a.months.reduce((s, r) => s + ratingScore(r as Rating | null), 0);
    const scoreB = b.months.reduce((s, r) => s + ratingScore(r as Rating | null), 0);
    return scoreB - scoreA;
  });
}

export async function getInSeasonSpecies(month: number, limit = 12) {
  const windows = await db
    .select({
      speciesId: seasonWindows.speciesId,
      rating: seasonWindows.rating,
    })
    .from(seasonWindows)
    .where(eq(seasonWindows.month, month));

  // Only 'good' and 'peak' rated
  const scoreMap = new Map<string, number>();
  for (const w of windows) {
    if (w.rating === "good" || w.rating === "peak") {
      const current = scoreMap.get(w.speciesId) ?? 0;
      scoreMap.set(w.speciesId, current + ratingScore(w.rating));
    }
  }

  const topIds = Array.from(scoreMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);

  if (topIds.length === 0) return [];

  const rows = await db.select().from(species).where(inArray(species.id, topIds));
  return rows.sort((a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0));
}
