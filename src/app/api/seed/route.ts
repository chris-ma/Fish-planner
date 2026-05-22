import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import { nanoid } from "nanoid";
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

function q(s: string | null | undefined): string {
  if (s === null || s === undefined) return "NULL";
  return `'${s.replace(/'/g, "''")}'`;
}

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) return NextResponse.json({ error: "TURSO_DATABASE_URL not set" }, { status: 500 });

  const client = createClient({ url, authToken });
  const now = new Date().toISOString();

  // ── 1. Schema ──────────────────────────────────────────────────────────────
  await client.batch([
    `CREATE TABLE IF NOT EXISTS regions (id TEXT PRIMARY KEY NOT NULL, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, state TEXT NOT NULL, zone TEXT NOT NULL, description TEXT, latitude REAL, longitude REAL, tags TEXT, created_at TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS species (id TEXT PRIMARY KEY NOT NULL, slug TEXT NOT NULL UNIQUE, common_name TEXT NOT NULL, scientific_name TEXT, category TEXT NOT NULL, description TEXT, min_legal_size_mm INTEGER, bag_limit INTEGER, created_at TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS techniques (id TEXT PRIMARY KEY NOT NULL, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT, category TEXT)`,
    `CREATE TABLE IF NOT EXISTS species_techniques (species_id TEXT NOT NULL REFERENCES species(id) ON DELETE CASCADE, technique_id TEXT NOT NULL REFERENCES techniques(id) ON DELETE CASCADE, effectiveness INTEGER, notes TEXT, UNIQUE(species_id, technique_id))`,
    `CREATE TABLE IF NOT EXISTS season_windows (id TEXT PRIMARY KEY NOT NULL, region_id TEXT NOT NULL REFERENCES regions(id) ON DELETE CASCADE, species_id TEXT NOT NULL REFERENCES species(id) ON DELETE CASCADE, month INTEGER NOT NULL, rating TEXT NOT NULL, notes TEXT, UNIQUE(region_id, species_id, month))`,
    `CREATE TABLE IF NOT EXISTS gear_templates (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, category TEXT NOT NULL, trip_type TEXT, item_name TEXT NOT NULL, quantity INTEGER DEFAULT 1, notes TEXT, is_essential INTEGER DEFAULT false)`,
    `CREATE TABLE IF NOT EXISTS trips (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, region_id TEXT REFERENCES regions(id), start_date TEXT, end_date TEXT, target_species TEXT, description TEXT, share_code TEXT NOT NULL UNIQUE, status TEXT NOT NULL DEFAULT 'planning', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS bookings (id TEXT PRIMARY KEY NOT NULL, trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE, type TEXT NOT NULL, title TEXT NOT NULL, provider_name TEXT, confirmation_ref TEXT, booking_date TEXT, start_datetime TEXT, end_datetime TEXT, cost_aud REAL, notes TEXT, created_at TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS checklist_items (id TEXT PRIMARY KEY NOT NULL, trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE, category TEXT NOT NULL DEFAULT 'other', item_name TEXT NOT NULL, quantity INTEGER DEFAULT 1, is_completed INTEGER DEFAULT false, from_template INTEGER DEFAULT false, assigned_to TEXT, created_at TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS trip_notes (id TEXT PRIMARY KEY NOT NULL, trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE, author_name TEXT NOT NULL DEFAULT 'Anonymous', content TEXT NOT NULL, is_pinned INTEGER DEFAULT false, created_at TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS trip_participants (id TEXT PRIMARY KEY NOT NULL, trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE, name TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'crew', joined_at TEXT NOT NULL, UNIQUE(trip_id, name))`,
  ], "write");

  // Clear seed tables so re-runs are idempotent (trips/bookings are preserved)
  await client.batch([
    `DELETE FROM season_windows`,
    `DELETE FROM species_techniques`,
    `DELETE FROM gear_templates`,
    `DELETE FROM techniques`,
    `DELETE FROM species`,
    `DELETE FROM regions`,
  ], "write");

  // ── 2. Regions ─────────────────────────────────────────────────────────────
  const regionIds: Record<string, string> = {};
  const regionBatch = REGIONS.map((r) => {
    const id = nanoid();
    regionIds[r.slug] = id;
    return `INSERT INTO regions (id, slug, name, state, zone, description, latitude, longitude, tags, created_at) VALUES (${q(id)}, ${q(r.slug)}, ${q(r.name)}, ${q(r.state)}, ${q(r.zone)}, ${q(r.description)}, ${r.latitude ?? "NULL"}, ${r.longitude ?? "NULL"}, NULL, ${q(now)})`;
  });
  await client.batch(regionBatch, "write");

  // ── 3. Species ─────────────────────────────────────────────────────────────
  const speciesIds: Record<string, string> = {};
  const speciesBatch = SPECIES.map((s) => {
    const id = nanoid();
    speciesIds[s.slug] = id;
    return `INSERT INTO species (id, slug, common_name, scientific_name, category, description, min_legal_size_mm, bag_limit, created_at) VALUES (${q(id)}, ${q(s.slug)}, ${q(s.commonName)}, ${q(s.scientificName)}, ${q(s.category)}, ${q(s.description)}, ${s.minLegalSizeMm ?? "NULL"}, ${s.bagLimit ?? "NULL"}, ${q(now)})`;
  });
  await client.batch(speciesBatch, "write");

  // ── 4. Techniques ──────────────────────────────────────────────────────────
  const techniqueIds: Record<string, string> = {};
  const techniqueBatch = TECHNIQUES_DATA.map((t) => {
    const id = nanoid();
    techniqueIds[t.slug] = id;
    return `INSERT INTO techniques (id, slug, name, description, category) VALUES (${q(id)}, ${q(t.slug)}, ${q(t.name)}, ${q(t.description)}, ${q(t.category)})`;
  });
  await client.batch(techniqueBatch, "write");

  // ── 5. Species-Techniques ──────────────────────────────────────────────────
  const stBatch: string[] = [];
  for (const [speciesSlug, techSlugs] of Object.entries(SPECIES_TECHNIQUES)) {
    const speciesId = speciesIds[speciesSlug];
    if (!speciesId) continue;
    for (const techSlug of techSlugs) {
      const techniqueId = techniqueIds[techSlug];
      if (!techniqueId) continue;
      stBatch.push(`INSERT INTO species_techniques (species_id, technique_id, effectiveness, notes) VALUES (${q(speciesId)}, ${q(techniqueId)}, NULL, NULL)`);
    }
  }
  if (stBatch.length) await client.batch(stBatch, "write");

  // ── 6. Season windows ──────────────────────────────────────────────────────
  const swBatch: string[] = [];
  for (const [speciesSlug, zoneRatings] of Object.entries(SEASON_DATA)) {
    const speciesId = speciesIds[speciesSlug];
    if (!speciesId) continue;
    for (const region of REGIONS) {
      const regionId = regionIds[region.slug];
      if (!regionId) continue;
      const zoneData = zoneRatings[region.zone];
      if (!zoneData) continue;
      for (let month = 1; month <= 12; month++) {
        const rating = zoneData[month];
        if (!rating) continue;
        swBatch.push(`INSERT INTO season_windows (id, region_id, species_id, month, rating, notes) VALUES (${q(nanoid())}, ${q(regionId)}, ${q(speciesId)}, ${month}, ${q(rating)}, NULL)`);
      }
    }
  }
  // Batch in chunks of 500 to stay within limits
  for (let i = 0; i < swBatch.length; i += 500) {
    await client.batch(swBatch.slice(i, i + 500), "write");
  }

  // ── 7. Gear templates ──────────────────────────────────────────────────────
  const gtBatch = GEAR_TEMPLATES.map((item) => {
    const notes = (item as { notes?: string }).notes ?? null;
    return `INSERT INTO gear_templates (id, name, category, trip_type, item_name, quantity, notes, is_essential) VALUES (${q(nanoid())}, ${q(item.name)}, ${q(item.category)}, ${q(item.tripType)}, ${q(item.itemName)}, ${item.quantity ?? 1}, ${q(notes)}, ${item.isEssential ? 1 : 0})`;
  });
  await client.batch(gtBatch, "write");

  return NextResponse.json({
    ok: true,
    counts: {
      regions: regionBatch.length,
      species: speciesBatch.length,
      techniques: techniqueBatch.length,
      speciesTechniques: stBatch.length,
      seasonWindows: swBatch.length,
      gearTemplates: gtBatch.length,
    },
  });
}
