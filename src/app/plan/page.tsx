export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { listSpecies } from "@/lib/queries/species";
import { listRegions } from "@/lib/queries/regions";
import { getExperiences, getRegionSpeciesSlugs } from "@/lib/queries/experiences";
import { getCharters } from "@/lib/queries/charters";
import { db } from "@/db";
import { species } from "@/db/schema";
import { PlanTabs } from "./PlanTabs";

// Not indexed: this page browses the same experiences/species/regions catalogue
// already published at /experiences, /species and /regions — kept out of search
// results to avoid duplicate-content dilution, while staying crawlable so Google
// can see that directive (see src/app/robots.ts).
export const metadata: Metadata = {
  title: "Explore",
  description: "Browse species and destinations for your next fishing trip.",
  robots: { index: false, follow: true },
};

export default async function PlanPage() {
  const [allSpecies, allRegions, allExperiences, regionSpeciesRows, allSpeciesForMap, allCharters] = await Promise.all([
    listSpecies(),
    listRegions(),
    getExperiences(),
    getRegionSpeciesSlugs(),
    db.select({ slug: species.slug, commonName: species.commonName }).from(species),
    getCharters(),
  ]);

  const regionSpeciesMap: Record<string, string[]> = {};
  for (const row of regionSpeciesRows) {
    if (!regionSpeciesMap[row.regionId]) regionSpeciesMap[row.regionId] = [];
    if (!regionSpeciesMap[row.regionId].includes(row.speciesSlug))
      regionSpeciesMap[row.regionId].push(row.speciesSlug);
  }

  const speciesNameMap: Record<string, string> = Object.fromEntries(
    allSpeciesForMap.map((s) => [s.slug, s.commonName])
  );

  const parsedExperiences = allExperiences.map((exp) => ({
    ...exp,
    speciesSlugs: JSON.parse(exp.targetSpeciesSlugs) as string[],
    speciesNames: (JSON.parse(exp.targetSpeciesSlugs) as string[]).map((s) => speciesNameMap[s] ?? s),
  }));

  return (
    <div>
      <div className="relative bg-[#0B1D2A] py-12 px-4 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-[#FFC423]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-64 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F2EDE2] mb-2">Explore</h1>
          <p className="text-white/60 max-w-xl">
            Browse species and destinations for your next Australian fishing trip.
          </p>
        </div>
      </div>
      <PlanTabs
        species={allSpecies}
        regions={allRegions}
        experiences={parsedExperiences}
        regionSpeciesMap={regionSpeciesMap}
        charters={allCharters}
      />
    </div>
  );
}
