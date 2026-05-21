import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { nanoid } from "nanoid";
import * as schema from "../schema";
import { REGIONS } from "./regions";
import { SPECIES } from "./species";
import { SEASON_DATA } from "./season-windows";
import { GEAR_TEMPLATES } from "./gear-templates";

const TECHNIQUES_DATA = [
  { slug: "trolling", name: "Trolling", category: "offshore", description: "Dragging lures or baits at speed behind a moving boat. Primary technique for pelagics." },
  { slug: "popping", name: "Surface Popping", category: "offshore", description: "Casting cup-faced poppers to create surface commotion targeting aggressive surface feeders." },
  { slug: "stickbaiting", name: "Stickbaiting", category: "offshore", description: "Casting and working walk-the-dog style stickbaits on the surface or just subsurface." },
  { slug: "jigging", name: "Vertical Jigging", category: "offshore", description: "Working metal jigs up and down in the water column over reefs or structure." },
  { slug: "slow-pitch-jigging", name: "Slow Pitch Jigging", category: "reef", description: "Methodical jigging technique using specially designed slow-pitch jigs over reef structure." },
  { slug: "bottom-bait", name: "Bottom Bait Fishing", category: "reef", description: "Presenting bait (pilchards, squid, cut fish) on the bottom over reef structure." },
  { slug: "soft-plastics", name: "Soft Plastic Lures", category: "estuary", description: "Working soft plastic lures on jigheads through estuaries, flats, and inshore areas." },
  { slug: "live-bait", name: "Live Baiting", category: "offshore", description: "Presenting live baitfish (yakkas, mullet, mackerel) to attract larger predators." },
  { slug: "casting-hard-bodies", name: "Casting Hard Bodies", category: "estuary", description: "Casting hard body lures to structure, mangroves, and rocky areas in estuaries." },
  { slug: "bait-fishing-estuary", name: "Estuary Bait Fishing", category: "estuary", description: "Traditional bait fishing in estuaries using prawns, worms, and cut bait." },
  { slug: "float-fishing", name: "Float / Bobber Fishing", category: "estuary", description: "Presenting bait under a float — common for luderick with green weed." },
  { slug: "beach-casting", name: "Beach / Surf Casting", category: "inshore", description: "Casting from beaches and rock platforms into gutters and breaks for tailor, mulloway, and trevally." },
];

const SPECIES_TECHNIQUES: Record<string, string[]> = {
  "black-marlin": ["trolling", "live-bait"],
  "blue-marlin": ["trolling", "live-bait"],
  "sailfish": ["trolling", "live-bait"],
  "yellowfin-tuna": ["trolling", "popping", "stickbaiting", "jigging"],
  "longtail-tuna": ["trolling", "popping", "casting-hard-bodies"],
  "spanish-mackerel": ["trolling", "live-bait", "jigging"],
  "wahoo": ["trolling", "jigging"],
  "mahi-mahi": ["trolling", "popping", "jigging"],
  "yellowtail-kingfish": ["popping", "stickbaiting", "jigging", "slow-pitch-jigging", "live-bait"],
  "giant-trevally": ["popping", "stickbaiting", "live-bait"],
  "coral-trout": ["soft-plastics", "live-bait", "bottom-bait"],
  "red-emperor": ["bottom-bait", "slow-pitch-jigging"],
  "nannygai": ["bottom-bait", "slow-pitch-jigging", "jigging"],
  "snapper": ["bottom-bait", "soft-plastics", "slow-pitch-jigging"],
  "cobia": ["live-bait", "jigging", "casting-hard-bodies"],
  "barramundi": ["soft-plastics", "casting-hard-bodies", "live-bait"],
  "mangrove-jack": ["soft-plastics", "casting-hard-bodies", "live-bait"],
  "flathead": ["soft-plastics", "bait-fishing-estuary"],
  "mulloway": ["soft-plastics", "live-bait", "bait-fishing-estuary", "beach-casting"],
  "bream": ["soft-plastics", "bait-fishing-estuary", "casting-hard-bodies"],
  "tailor": ["beach-casting", "casting-hard-bodies", "jigging"],
  "whiting": ["bait-fishing-estuary"],
  "luderick": ["float-fishing"],
  "jewfish": ["live-bait", "bait-fishing-estuary"],
  "kingfish-qld": ["popping", "stickbaiting", "slow-pitch-jigging", "jigging"],
};

async function seed() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) throw new Error("TURSO_DATABASE_URL not set");

  const client = createClient({ url, authToken });
  const db = drizzle(client, { schema });

  console.log("🌱 Seeding database...");

  // 1. Regions
  console.log("  → Regions...");
  const regionRecords = REGIONS.map((r) => ({
    id: nanoid(),
    slug: r.slug,
    name: r.name,
    state: r.state,
    zone: r.zone,
    description: r.description ?? null,
    latitude: r.latitude ?? null,
    longitude: r.longitude ?? null,
    tags: null,
    createdAt: new Date().toISOString(),
  }));

  for (const region of regionRecords) {
    await db.insert(schema.regions).values(region).onConflictDoNothing();
  }

  // 2. Species
  console.log("  → Species...");
  const speciesRecords = SPECIES.map((s) => ({
    id: nanoid(),
    slug: s.slug,
    commonName: s.commonName,
    scientificName: s.scientificName ?? null,
    category: s.category,
    description: s.description ?? null,
    minLegalSizeMm: s.minLegalSizeMm ?? null,
    bagLimit: s.bagLimit ?? null,
    createdAt: new Date().toISOString(),
  }));

  for (const sp of speciesRecords) {
    await db.insert(schema.species).values(sp).onConflictDoNothing();
  }

  // 3. Techniques
  console.log("  → Techniques...");
  const techniqueRecords = TECHNIQUES_DATA.map((t) => ({
    id: nanoid(),
    slug: t.slug,
    name: t.name,
    description: t.description,
    category: t.category,
  }));

  for (const t of techniqueRecords) {
    await db.insert(schema.techniques).values(t).onConflictDoNothing();
  }

  // 4. Species-Techniques junction
  console.log("  → Species techniques...");
  const allSpecies = await db.select().from(schema.species);
  const allTechniques = await db.select().from(schema.techniques);
  const speciesMap = Object.fromEntries(allSpecies.map((s) => [s.slug, s.id]));
  const techniqueMap = Object.fromEntries(allTechniques.map((t) => [t.slug, t.id]));

  for (const [speciesSlug, techniquesSlugs] of Object.entries(SPECIES_TECHNIQUES)) {
    const speciesId = speciesMap[speciesSlug];
    if (!speciesId) continue;
    for (const techSlug of techniquesSlugs) {
      const techniqueId = techniqueMap[techSlug];
      if (!techniqueId) continue;
      await db
        .insert(schema.speciesTechniques)
        .values({ speciesId, techniqueId, effectiveness: null, notes: null })
        .onConflictDoNothing();
    }
  }

  // 5. Season windows (zone-based expansion)
  console.log("  → Season windows...");
  const allRegions = await db.select().from(schema.regions);
  const regionMap = Object.fromEntries(allRegions.map((r) => [r.slug, { id: r.id, zone: r.zone }]));

  for (const [speciesSlug, zoneRatings] of Object.entries(SEASON_DATA)) {
    const speciesId = speciesMap[speciesSlug];
    if (!speciesId) continue;

    for (const region of allRegions) {
      const zoneData = zoneRatings[region.zone];
      if (!zoneData) continue;

      for (let month = 1; month <= 12; month++) {
        const rating = zoneData[month];
        if (!rating) continue;

        await db
          .insert(schema.seasonWindows)
          .values({
            id: nanoid(),
            regionId: region.id,
            speciesId,
            month,
            rating,
            notes: null,
          })
          .onConflictDoNothing();
      }
    }
  }

  // 6. Gear templates
  console.log("  → Gear templates...");
  for (const item of GEAR_TEMPLATES) {
    await db
      .insert(schema.gearTemplates)
      .values({
        id: nanoid(),
        name: item.name,
        category: item.category,
        tripType: item.tripType ?? null,
        itemName: item.itemName,
        quantity: item.quantity ?? 1,
        notes: (item as { notes?: string }).notes ?? null,
        isEssential: item.isEssential ?? false,
      })
      .onConflictDoNothing();
  }

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
