import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { nanoid } from "nanoid";
import * as schema from "@/db/schema";
import { REGIONS } from "@/db/seed/regions";
import { SPECIES } from "@/db/seed/species";
import { SEASON_DATA } from "@/db/seed/season-windows";
import { GEAR_TEMPLATES } from "@/db/seed/gear-templates";

const SEED_SECRET = "SEED_2024_FISH_PLANNER";

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

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) return NextResponse.json({ error: "TURSO_DATABASE_URL not set" }, { status: 500 });

  const client = createClient({ url, authToken });

  // Create schema via raw SQL (idempotent — uses IF NOT EXISTS)
  const schemaSql = [
    `CREATE TABLE IF NOT EXISTS regions (
      id TEXT PRIMARY KEY NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      state TEXT NOT NULL,
      zone TEXT NOT NULL,
      description TEXT,
      latitude REAL,
      longitude REAL,
      tags TEXT,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS species (
      id TEXT PRIMARY KEY NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      common_name TEXT NOT NULL,
      scientific_name TEXT,
      category TEXT NOT NULL,
      description TEXT,
      min_legal_size_mm INTEGER,
      bag_limit INTEGER,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS techniques (
      id TEXT PRIMARY KEY NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS species_techniques (
      species_id TEXT NOT NULL REFERENCES species(id) ON DELETE CASCADE,
      technique_id TEXT NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
      effectiveness INTEGER,
      notes TEXT,
      UNIQUE(species_id, technique_id)
    )`,
    `CREATE TABLE IF NOT EXISTS season_windows (
      id TEXT PRIMARY KEY NOT NULL,
      region_id TEXT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
      species_id TEXT NOT NULL REFERENCES species(id) ON DELETE CASCADE,
      month INTEGER NOT NULL,
      rating TEXT NOT NULL,
      notes TEXT,
      UNIQUE(region_id, species_id, month)
    )`,
    `CREATE TABLE IF NOT EXISTS gear_templates (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      trip_type TEXT,
      item_name TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      notes TEXT,
      is_essential INTEGER DEFAULT false
    )`,
    `CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      region_id TEXT REFERENCES regions(id),
      start_date TEXT,
      end_date TEXT,
      target_species TEXT,
      description TEXT,
      share_code TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'planning',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY NOT NULL,
      trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      provider_name TEXT,
      confirmation_ref TEXT,
      booking_date TEXT,
      start_datetime TEXT,
      end_datetime TEXT,
      cost_aud REAL,
      notes TEXT,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS checklist_items (
      id TEXT PRIMARY KEY NOT NULL,
      trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
      category TEXT NOT NULL DEFAULT 'other',
      item_name TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      is_completed INTEGER DEFAULT false,
      from_template INTEGER DEFAULT false,
      assigned_to TEXT,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS trip_notes (
      id TEXT PRIMARY KEY NOT NULL,
      trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
      author_name TEXT NOT NULL DEFAULT 'Anonymous',
      content TEXT NOT NULL,
      is_pinned INTEGER DEFAULT false,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS trip_participants (
      id TEXT PRIMARY KEY NOT NULL,
      trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'crew',
      joined_at TEXT NOT NULL,
      UNIQUE(trip_id, name)
    )`,
  ];

  for (const sql of schemaSql) {
    await client.execute(sql);
  }

  const db = drizzle(client, { schema });
  const now = new Date().toISOString();
  const log: string[] = ["Schema created."];

  // 1. Regions
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
    createdAt: now,
  }));
  for (const region of regionRecords) {
    await db.insert(schema.regions).values(region).onConflictDoNothing();
  }
  log.push(`Regions: ${regionRecords.length} upserted.`);

  // 2. Species
  const speciesRecords = SPECIES.map((s) => ({
    id: nanoid(),
    slug: s.slug,
    commonName: s.commonName,
    scientificName: s.scientificName ?? null,
    category: s.category,
    description: s.description ?? null,
    minLegalSizeMm: s.minLegalSizeMm ?? null,
    bagLimit: s.bagLimit ?? null,
    createdAt: now,
  }));
  for (const sp of speciesRecords) {
    await db.insert(schema.species).values(sp).onConflictDoNothing();
  }
  log.push(`Species: ${speciesRecords.length} upserted.`);

  // 3. Techniques
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
  log.push(`Techniques: ${techniqueRecords.length} upserted.`);

  // 4. Species-Techniques junction
  const allSpecies = await db.select().from(schema.species);
  const allTechniques = await db.select().from(schema.techniques);
  const speciesMap = Object.fromEntries(allSpecies.map((s) => [s.slug, s.id]));
  const techniqueMap = Object.fromEntries(allTechniques.map((t) => [t.slug, t.id]));
  let stCount = 0;
  for (const [speciesSlug, techSlugs] of Object.entries(SPECIES_TECHNIQUES)) {
    const speciesId = speciesMap[speciesSlug];
    if (!speciesId) continue;
    for (const techSlug of techSlugs) {
      const techniqueId = techniqueMap[techSlug];
      if (!techniqueId) continue;
      await db.insert(schema.speciesTechniques).values({ speciesId, techniqueId, effectiveness: null, notes: null }).onConflictDoNothing();
      stCount++;
    }
  }
  log.push(`Species-techniques: ${stCount} upserted.`);

  // 5. Season windows
  const allRegions = await db.select().from(schema.regions);
  let swCount = 0;
  for (const [speciesSlug, zoneRatings] of Object.entries(SEASON_DATA)) {
    const speciesId = speciesMap[speciesSlug];
    if (!speciesId) continue;
    for (const region of allRegions) {
      const zoneData = zoneRatings[region.zone];
      if (!zoneData) continue;
      for (let month = 1; month <= 12; month++) {
        const rating = zoneData[month];
        if (!rating) continue;
        await db.insert(schema.seasonWindows).values({ id: nanoid(), regionId: region.id, speciesId, month, rating, notes: null }).onConflictDoNothing();
        swCount++;
      }
    }
  }
  log.push(`Season windows: ${swCount} upserted.`);

  // 6. Gear templates
  let gtCount = 0;
  for (const item of GEAR_TEMPLATES) {
    await db.insert(schema.gearTemplates).values({
      id: nanoid(),
      name: item.name,
      category: item.category,
      tripType: item.tripType ?? null,
      itemName: item.itemName,
      quantity: item.quantity ?? 1,
      notes: (item as { notes?: string }).notes ?? null,
      isEssential: item.isEssential ?? false,
    }).onConflictDoNothing();
    gtCount++;
  }
  log.push(`Gear templates: ${gtCount} upserted.`);

  return NextResponse.json({ ok: true, log });
}
