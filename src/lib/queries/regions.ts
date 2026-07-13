import { db } from "@/db";
import { regions, seasonWindows, species, destinations, experiences, experienceDestinations } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { ratingLabel, ratingScore, type Rating } from "@/lib/utils/season";

const NZ_REGIONS = [
  { id: "nzr001", slug: "bay-of-islands", name: "Bay of Islands", state: "NZ", zone: "nz_north_island", latitude: -35.2667, longitude: 174.1333, description: "NZ's premier big-game fishing destination. World-class marlin in summer, year-round snapper and kingfish in the 144-island bay system. Cape Brett and the Poor Knights Islands hold trophy yellowtail kingfish and hapuku.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr002", slug: "auckland-hauraki-gulf", name: "Auckland / Hauraki Gulf", state: "NZ", zone: "nz_north_island", latitude: -36.8485, longitude: 174.7633, description: "New Zealand's snapper capital. The Hauraki Gulf teems with snapper year-round, with yellowtail kingfish over the reefs. Great Barrier and Waiheke Islands extend the options. Close-range yellowfin and bluefin tuna in summer.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr003", slug: "tauranga-bay-of-plenty", name: "Tauranga / Bay of Plenty", state: "NZ", zone: "nz_north_island", latitude: -37.6878, longitude: 176.1651, description: "Major NZ sport fishing port. Snapper and kingfish on near-shore reefs; striped and blue marlin out wide in summer. Mayor Island is a world-class light-tackle destination for giant yellowtail kingfish.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr004", slug: "gisborne-east-cape", name: "Gisborne / East Cape", state: "NZ", zone: "nz_north_island", latitude: -38.6623, longitude: 178.0176, description: "Remote east coast with outstanding snapper, blue moki, and tarakihi. Big surf beaches produce kahawai and trevally. Deep water rises steeply close to shore.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr005", slug: "napier-hawkes-bay", name: "Napier / Hawke's Bay", state: "NZ", zone: "nz_north_island", latitude: -39.4928, longitude: 176.9120, description: "Snapper and kahawai year-round in Hawke's Bay. Yellowtail kingfish congregate over offshore reefs in summer. Pacific bluefin tuna visit the canyon grounds offshore.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr006", slug: "wellington-cook-strait", name: "Wellington / Cook Strait", state: "NZ", zone: "nz_north_island", latitude: -41.2865, longitude: 174.7762, description: "Cook Strait's ferocious tidal rips concentrate baitfish and predators. Exceptional blue cod, tarakihi, and snapper. Hapuku and bluenose from deep water channels. One of NZ's most productive but challenging fisheries.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr007", slug: "nelson-tasman", name: "Nelson / Tasman Bay", state: "NZ", zone: "nz_south_island", latitude: -41.2706, longitude: 173.2840, description: "Blue cod and snapper in sheltered Tasman Bay. Golden Bay produces large snapper on the remote northern flats. Inland rivers hold outstanding brown trout. Salmon in the Motueka River in autumn.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr008", slug: "marlborough-sounds", name: "Marlborough Sounds", state: "NZ", zone: "nz_south_island", latitude: -41.5123, longitude: 174.0650, description: "Queen Charlotte Sound and Pelorus Sound deliver superb blue cod and snapper fishing in sheltered waterways. Yellowtail kingfish patrol the sound entrances in summer. Remote bays accessible only by water.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr009", slug: "kaikoura", name: "Kaikōura", state: "NZ", zone: "nz_south_island", latitude: -42.4000, longitude: 173.6833, description: "Deep water rises steeply close to shore, producing exceptional hapuku (groper), blue cod, and tarakihi. Yellowtail kingfish arrive in summer. Dramatic Kaikōura Range backdrop and canyon-edge fishing.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr010", slug: "christchurch-canterbury", name: "Christchurch / Canterbury", state: "NZ", zone: "nz_south_island", latitude: -43.5321, longitude: 172.6362, description: "Canterbury Bight delivers blue cod, tarakihi, and snapper. The Waimakariri and Rakaia rivers run world-class salmon runs in autumn. Pristine braided river trout fishing in the foothills.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr011", slug: "akaroa-banks-peninsula", name: "Akaroa / Banks Peninsula", state: "NZ", zone: "nz_south_island", latitude: -43.8030, longitude: 172.9630, description: "Blue cod hotspot in the dramatic volcanic harbour bays. Tarakihi and snapper on the outer shelf. Unique enclosed harbour fishing. Scenic destination with productive inshore reefs.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr012", slug: "queenstown-fiordland", name: "Queenstown / Fiordland", state: "NZ", zone: "nz_south_island", latitude: -45.0312, longitude: 168.6626, description: "World-famous trout fishing in Lake Wakatipu, Wanaka, and remote Fiordland lakes. Exceptional wilderness fly fishing. Milford Sound and Doubtful Sound produce hapuku, blue cod, and groper in spectacular deep-fiord settings.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr013", slug: "dunedin-otago", name: "Dunedin / Otago", state: "NZ", zone: "nz_south_island", latitude: -45.8788, longitude: 170.5028, description: "Blue cod in Otago Harbour and the nearby coast. Hapuku (groper) on the outer continental shelf. Salmon in the Clutha and Taieri rivers. Rock and beach fishing for blue moki and kahawai around the Otago Peninsula.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr014", slug: "invercargill-southland", name: "Invercargill / Southland", state: "NZ", zone: "nz_south_island", latitude: -46.4132, longitude: 168.3538, description: "The Bluff is an iconic NZ blue cod destination. Stewart Island access for deep-water hapuku, blue cod, and groper. Oreti Beach for surf casting. Salmon in the Mataura system. Remote and wild southern fishing.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "nzr015", slug: "west-coast-greymouth", name: "West Coast / Greymouth", state: "NZ", zone: "nz_south_island", latitude: -42.4502, longitude: 171.2100, description: "Wild, remote west coast with challenging bar crossings. Blue cod, tarakihi, and hapuku offshore. Exceptional brown trout fishing in the Grey, Buller, and Hokitika rivers. Uncrowded wilderness fishing.", tags: null, createdAt: "2025-01-01T00:00:00.000Z" },
];

type NZRating = "poor" | "fair" | "good" | "peak";
type ZoneRatings = Record<string, (NZRating | null)[]>;
const NZ_SEASON_DATA: Record<string, ZoneRatings> = {
  "yellowfin-tuna":      { nz_north_island: [null, "peak", "peak", "good", "fair", null, null, null, null, null, null, null, "fair"] },
  "longtail-tuna":       { nz_north_island: [null, "good", "peak", "good", "fair", null, null, null, null, null, null, "fair", "good"] },
  "mahi-mahi":           { nz_north_island: [null, "peak", "peak", "good", "fair", null, null, null, null, null, null, "fair", "good"] },
  "yellowtail-kingfish": { nz_north_island: [null, "peak", "peak", "peak", "good", "good", "fair", null, null, null, "fair", "good", "peak"], nz_south_island: [null, "good", "peak", "good", "fair", "fair", null, null, null, null, "fair", "fair", "good"] },
  "tailor":              { nz_north_island: [null, "fair", "fair", "good", "good", "fair", null, null, null, null, null, "fair", "fair"] },
  "australian-salmon":   { nz_north_island: [null, "fair", "good", "peak", "peak", "peak", "good", "good", "fair", "fair", "fair", "fair", "fair"], nz_south_island: [null, "fair", "good", "peak", "peak", "peak", "peak", "good", "good", "fair", "fair", "fair", "fair"] },
  "gummy-shark":         { nz_south_island: [null, "fair", "fair", "good", "good", "good", "fair", "fair", "fair", "fair", "fair", "fair", "fair"] },
  "nannygai":            { nz_north_island: [null, "fair", "fair", "fair", "good", "good", "fair", "fair", "fair", "good", "good", "fair", "fair"] },
  "snapper":             { nz_north_island: [null, "peak", "peak", "good", "good", "fair", "fair", "fair", "fair", "fair", "good", "peak", "peak"], nz_south_island: [null, "fair", "good", "good", "good", "peak", "peak", "peak", "good", "good", "fair", "fair", "fair"] },
  "blue-eye-trevalla":   { nz_south_island: [null, "fair", "fair", "good", "peak", "peak", "good", "good", "good", "good", "good", "fair", "fair"] },
  "striped-trumpeter":   { nz_south_island: [null, "fair", "fair", "good", "good", "peak", "peak", "good", "fair", "fair", "fair", "fair", "fair"] },
  "brown-trout":         { nz_north_island: [null, "good", "good", "good", "good", "fair", null, null, null, "fair", "peak", "peak", "good"], nz_south_island: [null, "good", "good", "good", "fair", "fair", null, null, null, "good", "peak", "peak", "good"] },
  "rainbow-trout":       { nz_north_island: [null, "good", "good", "good", "good", "fair", "fair", "fair", "fair", "fair", "peak", "peak", "good"], nz_south_island: [null, "good", "good", "good", "fair", "fair", "fair", "fair", "fair", "good", "peak", "peak", "good"] },
  "ocean-trout":         { nz_north_island: [null, "fair", "fair", "fair", "fair", null, null, null, null, null, "fair", "fair", "fair"], nz_south_island: [null, "good", "peak", "peak", "good", "fair", null, null, null, "fair", "good", "good", "good"] },
  "european-carp":       { nz_north_island: [null, "good", "good", "peak", "good", "fair", "poor", "poor", "fair", "good", "peak", "good", "good"] },
  "yellowtail-scad":     { nz_north_island: [null, "good", "peak", "good", "good", "fair", "fair", "fair", "fair", "fair", "good", "good", "good"], nz_south_island: [null, "fair", "good", "good", "fair", "fair", "fair", "fair", "fair", "fair", "good", "fair", "fair"] },
  "calamari-squid":      { nz_north_island: [null, "fair", "fair", "good", "good", "good", "peak", "peak", "good", "fair", "fair", "fair", "fair"], nz_south_island: [null, "fair", "fair", "good", "peak", "peak", "peak", "peak", "good", "good", "fair", "fair", "fair"] },
  "blue-cod":            { nz_north_island: [null, "fair", "fair", "fair", "good", "good", "good", "good", "fair", "fair", "good", "fair", "fair"], nz_south_island: [null, "good", "good", "peak", "peak", "peak", "peak", "good", "good", "good", "good", "good", "good"] },
  "tarakihi":            { nz_north_island: [null, "fair", "fair", "good", "good", "peak", "peak", "good", "fair", "fair", "fair", "fair", "fair"], nz_south_island: [null, "good", "good", "peak", "peak", "peak", "peak", "good", "good", "good", "good", "good", "good"] },
  "hapuku-groper":       { nz_north_island: [null, "fair", "fair", "good", "good", "peak", "peak", "good", "good", "good", "fair", "fair", "fair"], nz_south_island: [null, "good", "good", "peak", "peak", "peak", "good", "good", "good", "peak", "peak", "good", "good"] },
  "john-dory":           { nz_north_island: [null, "fair", "fair", "good", "good", "peak", "peak", "good", "fair", "good", "fair", "fair", "fair"], nz_south_island: [null, "fair", "fair", "good", "peak", "peak", "peak", "good", "fair", "good", "good", "fair", "fair"] },
  "blue-moki":           { nz_north_island: [null, "fair", "fair", "good", "good", "good", "fair", "fair", "fair", "fair", "fair", "fair", "fair"], nz_south_island: [null, "good", "good", "peak", "peak", "good", "good", "fair", "fair", "good", "good", "good", "good"] },
};

async function seedNZSeasonWindows() {
  const existing = await db
    .select({ id: seasonWindows.id })
    .from(seasonWindows)
    .innerJoin(regions, eq(seasonWindows.regionId, regions.id))
    .where(eq(regions.state, "NZ"))
    .limit(1);
  if (existing.length > 0) return;

  const allSpecies = await db.select({ id: species.id, slug: species.slug }).from(species);
  const speciesMap = Object.fromEntries(allSpecies.map((s) => [s.slug, s.id]));

  for (const [speciesSlug, zoneRatings] of Object.entries(NZ_SEASON_DATA)) {
    const speciesId = speciesMap[speciesSlug];
    if (!speciesId) continue;
    for (const nzRegion of NZ_REGIONS) {
      const zoneData = zoneRatings[nzRegion.zone];
      if (!zoneData) continue;
      for (let month = 1; month <= 12; month++) {
        const rating = zoneData[month];
        if (!rating) continue;
        await db
          .insert(seasonWindows)
          .values({ id: nanoid(), regionId: nzRegion.id, speciesId, month, rating, notes: null })
          .onConflictDoNothing();
      }
    }
  }
}

export async function listRegions() {
  await db.insert(regions).values(NZ_REGIONS).onConflictDoNothing();
  await seedNZSeasonWindows();
  await seedDestinationsAndExperiences();
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

export async function getDestinationsForRegion(regionId: string) {
  return db.select().from(destinations).where(eq(destinations.regionId, regionId));
}

async function seedDestinationsAndExperiences() {
  const existing = await db.select({ id: destinations.id }).from(destinations).limit(1);
  if (existing.length > 0) return;

  const { DESTINATIONS } = await import("@/db/seed/destinations");
  const { EXPERIENCE_DESTINATIONS } = await import("@/db/seed/experience-destinations");

  const allRegions = await db.select({ id: regions.id, slug: regions.slug }).from(regions);
  const regionMap = Object.fromEntries(allRegions.map((r) => [r.slug, r.id]));

  const allExperiences = await db.select({ id: experiences.id, slug: experiences.slug }).from(experiences);
  const experienceMap = Object.fromEntries(allExperiences.map((e) => [e.slug, e.id]));

  const destRows = DESTINATIONS
    .filter((d) => regionMap[d.regionSlug])
    .map((d) => ({
      id: `dest-${d.slug}`,
      slug: d.slug,
      name: d.name,
      regionId: regionMap[d.regionSlug],
      description: d.description,
      latitude: null,
      longitude: null,
      tags: null,
      createdAt: new Date().toISOString(),
    }));

  if (destRows.length > 0) {
    for (let i = 0; i < destRows.length; i += 100) {
      await db.insert(destinations).values(destRows.slice(i, i + 100)).onConflictDoNothing();
    }
  }

  const junctionRows = EXPERIENCE_DESTINATIONS
    .filter((ed) => experienceMap[ed.experienceSlug] && `dest-${ed.destinationSlug}`)
    .map((ed) => ({
      experienceId: experienceMap[ed.experienceSlug],
      destinationId: `dest-${ed.destinationSlug}`,
    }))
    .filter((row) => row.experienceId && row.destinationId);

  if (junctionRows.length > 0) {
    for (let i = 0; i < junctionRows.length; i += 100) {
      await db.insert(experienceDestinations).values(junctionRows.slice(i, i + 100)).onConflictDoNothing();
    }
  }
}

export interface RegionWithStats {
  region: typeof regions.$inferSelect;
  speciesTracked: number;
  pct: number;
  label: string;
}

// Top regions for a month with honest, display-ready season stats:
// pct = share of the maximum possible bite score (every tracked species at "peak").
export async function getTopRegionsWithStats(month: number, limit = 3): Promise<RegionWithStats[]> {
  const windows = await db
    .select({ regionId: seasonWindows.regionId, rating: seasonWindows.rating })
    .from(seasonWindows)
    .where(eq(seasonWindows.month, month));

  const scoreMap = new Map<string, { score: number; count: number }>();
  for (const w of windows) {
    const entry = scoreMap.get(w.regionId) ?? { score: 0, count: 0 };
    entry.score += ratingScore(w.rating as Rating);
    entry.count += 1;
    scoreMap.set(w.regionId, entry);
  }

  const topIds = Array.from(scoreMap.entries())
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, limit)
    .map(([id]) => id);

  if (topIds.length === 0) return [];

  const rows = await db.select().from(regions).where(inArray(regions.id, topIds));
  rows.sort((a, b) => (scoreMap.get(b.id)?.score ?? 0) - (scoreMap.get(a.id)?.score ?? 0));

  return rows.map((region) => {
    const { score, count } = scoreMap.get(region.id) ?? { score: 0, count: 0 };
    const pct = count > 0 ? Math.round((score / (count * 4)) * 100) : 0;
    const label = pct >= 85 ? "Excellent" : pct >= 70 ? "Very Good" : pct >= 55 ? "Good" : "Fair";
    return { region, speciesTracked: count, pct, label };
  });
}

export interface SpeciesRegionRow {
  region: typeof regions.$inferSelect;
  rating: Rating | null;
  pct: number;
  label: string;
}

// Same as getTopRegionsWithStats but scoped to a single species — used by
// per-species campaign pages so "pick your water" reflects that species'
// actual season windows, not the site-wide bite score.
export async function getTopRegionsForSpecies(speciesSlug: string, month: number, limit = 3): Promise<SpeciesRegionRow[]> {
  const speciesRow = await db.select({ id: species.id }).from(species).where(eq(species.slug, speciesSlug)).limit(1);
  const speciesId = speciesRow[0]?.id;
  if (!speciesId) return [];

  const windows = await db
    .select({ regionId: seasonWindows.regionId, rating: seasonWindows.rating })
    .from(seasonWindows)
    .where(and(eq(seasonWindows.month, month), eq(seasonWindows.speciesId, speciesId)));

  const scoreMap = new Map<string, Rating>();
  for (const w of windows) {
    scoreMap.set(w.regionId, w.rating as Rating);
  }

  const topIds = Array.from(scoreMap.entries())
    .sort((a, b) => ratingScore(b[1]) - ratingScore(a[1]))
    .slice(0, limit)
    .map(([id]) => id);

  if (topIds.length === 0) return [];

  const rows = await db.select().from(regions).where(inArray(regions.id, topIds));
  rows.sort((a, b) => ratingScore(scoreMap.get(b.id) ?? null) - ratingScore(scoreMap.get(a.id) ?? null));

  return rows.map((region) => {
    const rating = scoreMap.get(region.id) ?? null;
    const pct = Math.round((ratingScore(rating) / 4) * 100);
    return { region, rating, pct, label: ratingLabel(rating) };
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
