export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { species, regions, seasonWindows } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

type Rating = "poor" | "fair" | "good" | "peak";

const NEW_SEASON_DATA: Record<string, Record<string, (Rating | null)[]>> = {
  "european-carp": {
    murray_darling:  [null, "peak", "peak", "good", "fair", "poor", "poor", "poor", "fair", "good", "peak", "peak", "peak"],
    alpine:          [null, "good", "good", "fair", "fair", "poor", null,   null,   "fair", "good", "peak", "good", "good"],
    nsw:             [null, "good", "good", "good", "fair", "poor", "poor", "poor", "fair", "good", "good", "peak", "peak"],
    vic_coast:       [null, "good", "good", "good", "fair", "poor", null,   null,   "fair", "good", "good", "good", "good"],
    southeast_qld:   [null, "peak", "peak", "good", "fair", "fair", "fair", "fair", "fair", "good", "peak", "peak", "peak"],
    sa_south:        [null, "good", "good", "fair", "fair", "poor", null,   null,   "fair", "good", "good", "peak", "peak"],
  },
  "black-drummer": {
    nsw:             [null, "fair", "fair", "good", "good", "peak", "peak", "peak", "good", "good", "fair", "fair", "fair"],
    vic_coast:       [null, "fair", "fair", "good", "good", "peak", "peak", "good", "good", "fair", "fair", "fair", "fair"],
    southeast_qld:   [null, "fair", "fair", "fair", "good", "good", "peak", "good", "fair", "fair", "fair", "fair", "fair"],
    tas:             [null, "fair", "fair", "good", "good", "peak", "peak", "good", "good", "fair", "fair", "fair", "fair"],
  },
};

export async function GET() {
  const log: string[] = [];
  const slugs = Object.keys(NEW_SEASON_DATA);

  const allSpecies = await db.select({ id: species.id, slug: species.slug }).from(species).where(inArray(species.slug, slugs));
  const speciesMap = Object.fromEntries(allSpecies.map((s) => [s.slug, s.id]));
  log.push(`Found species: ${allSpecies.map((s) => s.slug).join(", ")}`);

  const allRegions = await db.select({ id: regions.id, slug: regions.slug, zone: regions.zone }).from(regions);
  log.push(`Total regions: ${allRegions.length}`);

  let inserted = 0;

  for (const [speciesSlug, zoneRatings] of Object.entries(NEW_SEASON_DATA)) {
    const speciesId = speciesMap[speciesSlug];
    if (!speciesId) {
      log.push(`WARN: species not found: ${speciesSlug}`);
      continue;
    }

    for (const region of allRegions) {
      const ratings = zoneRatings[region.zone];
      if (!ratings) continue;

      for (let month = 1; month <= 12; month++) {
        const rating = ratings[month];
        if (!rating) continue;

        await db
          .insert(seasonWindows)
          .values({ id: nanoid(), regionId: region.id, speciesId, month, rating, notes: null })
          .onConflictDoNothing();
        inserted++;
      }
    }
  }

  log.push(`Inserted ${inserted} season window rows`);
  return NextResponse.json({ ok: true, log });
}
