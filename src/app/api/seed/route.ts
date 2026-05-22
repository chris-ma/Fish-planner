import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import { nanoid } from "nanoid";
import { REGIONS } from "@/db/seed/regions";
import { SPECIES } from "@/db/seed/species";
import { SEASON_DATA } from "@/db/seed/season-windows";
import { GEAR_TEMPLATES } from "@/db/seed/gear-templates";

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
  { slug: "fly-fishing", name: "Fly Fishing", category: "freshwater", description: "Casting weighted fly line with artificial flies. Technique for trout, bass, and saratoga in streams, lakes, and estuaries." },
  { slug: "lure-casting-freshwater", name: "Lure Casting (Freshwater)", category: "freshwater", description: "Casting hard-body and soft-plastic lures to structure and snags in rivers and impoundments." },
  { slug: "bait-fishing-freshwater", name: "Bait Fishing (Freshwater)", category: "freshwater", description: "Bottom or suspended bait fishing with worms, yabbies, scrub worms, and live bait in rivers and lakes." },
  { slug: "trolling-freshwater", name: "Trolling (Freshwater)", category: "freshwater", description: "Slowly pulling lures behind a boat over flats and drop-offs in impoundments." },
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
  "southern-bluefin-tuna": ["trolling", "jigging"],
  "australian-salmon": ["beach-casting", "casting-hard-bodies", "jigging"],
  "gummy-shark": ["bait-fishing-estuary", "beach-casting"],
  "blue-eye-trevalla": ["slow-pitch-jigging", "bottom-bait"],
  "striped-trumpeter": ["bottom-bait", "slow-pitch-jigging"],
  "murray-cod": ["lure-casting-freshwater", "bait-fishing-freshwater", "fly-fishing"],
  "golden-perch": ["lure-casting-freshwater", "bait-fishing-freshwater", "trolling-freshwater"],
  "silver-perch": ["lure-casting-freshwater", "bait-fishing-freshwater"],
  "australian-bass": ["lure-casting-freshwater", "fly-fishing", "casting-hard-bodies"],
  "brown-trout": ["fly-fishing", "lure-casting-freshwater", "bait-fishing-freshwater"],
  "rainbow-trout": ["fly-fishing", "lure-casting-freshwater", "trolling-freshwater", "bait-fishing-freshwater"],
  "redfin": ["lure-casting-freshwater", "bait-fishing-freshwater"],
  "saratoga": ["lure-casting-freshwater", "fly-fishing"],
  "catfish": ["bait-fishing-freshwater"],
  "ocean-trout": ["fly-fishing", "trolling-freshwater", "lure-casting-freshwater"],
  "queenfish": ["popping", "stickbaiting", "casting-hard-bodies", "jigging"],
  "threadfin-salmon": ["soft-plastics", "casting-hard-bodies", "live-bait"],
  "spangled-emperor": ["bottom-bait", "soft-plastics", "slow-pitch-jigging"],
  "dhufish": ["bottom-bait", "slow-pitch-jigging", "jigging"],
  "baldchin-groper": ["bottom-bait", "slow-pitch-jigging"],
  "king-george-whiting": ["bait-fishing-estuary"],
  "black-bream": ["soft-plastics", "casting-hard-bodies", "bait-fishing-estuary"],
  "bonefish": ["fly-fishing", "casting-hard-bodies"],
  "milkfish": ["fly-fishing"],
  "rankin-cod": ["bottom-bait", "slow-pitch-jigging", "jigging"],
};

const SECRET = "SEED_V3_AUS_FULL";
const BATCH_SIZE = 200;

function esc(v: string | null | undefined): string {
  if (v === null || v === undefined) return "NULL";
  return `'${String(v).replace(/'/g, "''")}'`;
}

async function batchExec(client: ReturnType<typeof createClient>, stmts: { sql: string; args?: unknown[] }[]) {
  for (let i = 0; i < stmts.length; i += BATCH_SIZE) {
    await client.batch(stmts.slice(i, i + BATCH_SIZE) as Parameters<typeof client.batch>[0], "write");
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) return NextResponse.json({ error: "TURSO_DATABASE_URL not set" }, { status: 500 });

  const client = createClient({ url, authToken });
  const log: string[] = [];

  try {
    // 1. Regions
    const regionStmts = REGIONS.map((r) => ({
      sql: `INSERT OR IGNORE INTO regions (id,slug,name,state,zone,description,latitude,longitude,tags,createdAt) VALUES (${esc(nanoid())},${esc(r.slug)},${esc(r.name)},${esc(r.state)},${esc(r.zone)},${esc(r.description)},${r.latitude ?? "NULL"},${r.longitude ?? "NULL"},NULL,${esc(new Date().toISOString())})`,
    }));
    await batchExec(client, regionStmts);
    log.push(`regions: ${regionStmts.length} upserted`);

    // 2. Species
    const speciesStmts = SPECIES.map((s) => ({
      sql: `INSERT OR IGNORE INTO species (id,slug,commonName,scientificName,category,description,minLegalSizeMm,bagLimit,createdAt) VALUES (${esc(nanoid())},${esc(s.slug)},${esc(s.commonName)},${esc(s.scientificName)},${esc(s.category)},${esc(s.description)},${s.minLegalSizeMm ?? "NULL"},${s.bagLimit ?? "NULL"},${esc(new Date().toISOString())})`,
    }));
    await batchExec(client, speciesStmts);
    log.push(`species: ${speciesStmts.length} upserted`);

    // 3. Techniques
    const techStmts = TECHNIQUES_DATA.map((t) => ({
      sql: `INSERT OR IGNORE INTO techniques (id,slug,name,description,category) VALUES (${esc(nanoid())},${esc(t.slug)},${esc(t.name)},${esc(t.description)},${esc(t.category)})`,
    }));
    await batchExec(client, techStmts);
    log.push(`techniques: ${techStmts.length} upserted`);

    // 4. Species-Techniques (need IDs from DB)
    const [allSpeciesRows, allTechRows] = await Promise.all([
      client.execute("SELECT id, slug FROM species"),
      client.execute("SELECT id, slug FROM techniques"),
    ]);
    const speciesMap: Record<string, string> = {};
    for (const row of allSpeciesRows.rows) speciesMap[row[1] as string] = row[0] as string;
    const techMap: Record<string, string> = {};
    for (const row of allTechRows.rows) techMap[row[1] as string] = row[0] as string;

    const stStmts: { sql: string }[] = [];
    for (const [speciesSlug, techSlugs] of Object.entries(SPECIES_TECHNIQUES)) {
      const speciesId = speciesMap[speciesSlug];
      if (!speciesId) continue;
      for (const techSlug of techSlugs) {
        const techId = techMap[techSlug];
        if (!techId) continue;
        stStmts.push({ sql: `INSERT OR IGNORE INTO speciesTechniques (speciesId,techniqueId,effectiveness,notes) VALUES (${esc(speciesId)},${esc(techId)},NULL,NULL)` });
      }
    }
    await batchExec(client, stStmts);
    log.push(`species_techniques: ${stStmts.length} upserted`);

    // 5. Season windows
    const allRegionsRows = await client.execute("SELECT id, zone FROM regions");
    const regions: { id: string; zone: string }[] = allRegionsRows.rows.map((r) => ({ id: r[0] as string, zone: r[1] as string }));

    const swStmts: { sql: string }[] = [];
    for (const [speciesSlug, zoneRatings] of Object.entries(SEASON_DATA)) {
      const speciesId = speciesMap[speciesSlug];
      if (!speciesId) continue;
      for (const region of regions) {
        const zoneData = (zoneRatings as Record<string, (string | null)[]>)[region.zone];
        if (!zoneData) continue;
        for (let month = 1; month <= 12; month++) {
          const rating = zoneData[month];
          if (!rating) continue;
          swStmts.push({ sql: `INSERT OR IGNORE INTO seasonWindows (id,regionId,speciesId,month,rating,notes) VALUES (${esc(nanoid())},${esc(region.id)},${esc(speciesId)},${month},${esc(rating)},NULL)` });
        }
      }
    }
    await batchExec(client, swStmts);
    log.push(`season_windows: ${swStmts.length} upserted`);

    // 6. Gear templates
    const gearStmts = GEAR_TEMPLATES.map((item) => ({
      sql: `INSERT OR IGNORE INTO gearTemplates (id,name,category,tripType,itemName,quantity,notes,isEssential) VALUES (${esc(nanoid())},${esc(item.name)},${esc(item.category)},${esc(item.tripType)},${esc(item.itemName)},${item.quantity ?? 1},${esc((item as { notes?: string }).notes)},${item.isEssential ? 1 : 0})`,
    }));
    await batchExec(client, gearStmts);
    log.push(`gear_templates: ${gearStmts.length} upserted`);

    return NextResponse.json({ ok: true, log });
  } catch (err) {
    return NextResponse.json({ error: String(err), log }, { status: 500 });
  }
}
