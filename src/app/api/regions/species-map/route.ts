export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getRegionSpeciesSlugs } from "@/lib/queries/experiences";
import { db } from "@/db";
import { regions } from "@/db/schema";

export async function GET() {
  try {
    const [rows, allRegions] = await Promise.all([
      getRegionSpeciesSlugs(),
      db.select({ id: regions.id, slug: regions.slug }).from(regions),
    ]);
    const idToSlug = Object.fromEntries(allRegions.map((r) => [r.id, r.slug]));
    const map: Record<string, string[]> = {};
    for (const row of rows) {
      const slug = idToSlug[row.regionId];
      if (!slug) continue;
      if (!map[slug]) map[slug] = [];
      if (!map[slug].includes(row.speciesSlug)) map[slug].push(row.speciesSlug);
    }
    return NextResponse.json(map);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
