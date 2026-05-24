export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { species, seasonWindows, speciesTechniques } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

const SLUGS_TO_DELETE = ["luderick", "catfish", "black-bream"];

const UPDATES: Array<{ slug: string; commonName: string; scientificName: string; description: string }> = [
  {
    slug: "flathead",
    commonName: "Flathead",
    scientificName: "Platycephalidae",
    description:
      "Australia's flathead group includes Dusky Flathead (the most common, to 1.2m in NSW and QLD estuaries), Tiger Flathead (southern VIC and SA, prized eating), Rock Flathead, and Deep-Sea Flathead. Soft plastics worked over sand and weed beds are the go-to technique for dusky flathead. Southern anglers prize the Tiger Flathead for the table. The 3 Meter Flatty challenge belongs here.",
  },
  {
    slug: "bream",
    commonName: "Bream",
    scientificName: "Acanthopagrus spp.",
    description:
      "The bream group covers Yellowfin Bream (NSW and QLD estuaries, the most widespread), Black Bream (permanent residents of southern Australian estuaries), Tarwine, and Silver/Pikey Bream. Light-tackle structure fishing with lures, soft plastics, and bait year-round. Yellowfin bream are Australia's most widely caught sportfish; black bream rarely leave their home waterway and reward local knowledge.",
  },
];

const NEW_SPECIES = [
  {
    slug: "european-carp",
    commonName: "European Carp",
    scientificName: "Cyprinus carpio",
    category: "freshwater",
    description:
      "Widespread invasive species across the Murray-Darling basin and most inland waterways. Grows large — fish over 10kg are common — and fights hard. It is illegal to return carp to the water in most states. The 'Mud Marlin' of Australian freshwater: surprisingly powerful on appropriate tackle and good eating if bled and iced immediately.",
    minLegalSizeMm: null,
    bagLimit: null,
  },
  {
    slug: "black-drummer",
    commonName: "Black Drummer",
    scientificName: "Kyphosus sydneyanus",
    category: "inshore",
    description:
      "Also called Silver Drummer — powerful fish that inhabit rocky headlands, surge zones, and ocean rock platforms along the NSW, QLD, and VIC coast. Feed on algae and encrusting organisms; caught using float rigs and green weed similar to luderick technique. Can exceed 5kg and make long, powerful runs in the surge. Underrated on the table.",
    minLegalSizeMm: null,
    bagLimit: 20,
  },
];

export async function GET() {
  const log: string[] = [];

  // 1. Find IDs of species to delete
  const toDelete = await db
    .select({ id: species.id, slug: species.slug })
    .from(species)
    .where(inArray(species.slug, SLUGS_TO_DELETE));

  log.push(`Found ${toDelete.length} species to delete: ${toDelete.map((s) => s.slug).join(", ")}`);

  if (toDelete.length > 0) {
    const ids = toDelete.map((s) => s.id);

    // season_windows and species_techniques cascade-delete via FK, but let's be explicit
    const swDel = await db.delete(seasonWindows).where(inArray(seasonWindows.speciesId, ids));
    log.push(`Deleted season_windows rows: ${JSON.stringify(swDel)}`);

    const stDel = await db.delete(speciesTechniques).where(inArray(speciesTechniques.speciesId, ids));
    log.push(`Deleted species_techniques rows: ${JSON.stringify(stDel)}`);

    for (const { id, slug } of toDelete) {
      await db.delete(species).where(eq(species.id, id));
      log.push(`Deleted species: ${slug}`);
    }
  }

  // 2. Update bream and flathead
  for (const update of UPDATES) {
    const row = await db.select({ id: species.id }).from(species).where(eq(species.slug, update.slug)).limit(1);
    if (row.length === 0) {
      log.push(`WARN: ${update.slug} not found — skipping update`);
      continue;
    }
    await db
      .update(species)
      .set({ commonName: update.commonName, scientificName: update.scientificName, description: update.description })
      .where(eq(species.slug, update.slug));
    log.push(`Updated: ${update.slug} → ${update.commonName}`);
  }

  // 3. Insert new species
  for (const sp of NEW_SPECIES) {
    await db
      .insert(species)
      .values({ id: nanoid(), createdAt: new Date().toISOString(), ...sp })
      .onConflictDoNothing();
    log.push(`Inserted (or already exists): ${sp.slug}`);
  }

  return NextResponse.json({ ok: true, log });
}
