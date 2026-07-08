import type { Metadata } from "next";
import { db } from "@/db";
import { species } from "@/db/schema";
import { getExperiences, getRegionSpeciesSlugs } from "@/lib/queries/experiences";
import { listRegions } from "@/lib/queries/regions";
import { ExperiencesBrowser } from "@/components/discovery/ExperiencesBrowser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fishing Experiences",
  description:
    "Explore fishing experiences by region. Find the perfect offshore, reef, estuary, inshore, and freshwater adventures.",
  alternates: { canonical: "/experiences" },
};

export default async function ExperiencesPage() {
  const [allExperiences, allRegions, speciesRows, allSpecies] = await Promise.all([
    getExperiences(),
    listRegions(),
    getRegionSpeciesSlugs(),
    db.select({ slug: species.slug, commonName: species.commonName }).from(species),
  ]);

  // Build regionId → unique speciesSlug[]
  const regionSpeciesMap: Record<string, string[]> = {};
  for (const row of speciesRows) {
    if (!regionSpeciesMap[row.regionId]) {
      regionSpeciesMap[row.regionId] = [];
    }
    if (!regionSpeciesMap[row.regionId].includes(row.speciesSlug)) {
      regionSpeciesMap[row.regionId].push(row.speciesSlug);
    }
  }

  // Build slug → commonName
  const speciesNameMap: Record<string, string> = {};
  for (const sp of allSpecies) {
    speciesNameMap[sp.slug] = sp.commonName;
  }

  // Parse each experience's targetSpeciesSlugs and resolve names
  const parsedExperiences = allExperiences.map((exp) => {
    let speciesSlugs: string[] = [];
    try {
      const parsed = JSON.parse(exp.targetSpeciesSlugs);
      if (Array.isArray(parsed)) speciesSlugs = parsed as string[];
    } catch {
      speciesSlugs = [];
    }

    const speciesNames = speciesSlugs.map(
      (slug) =>
        speciesNameMap[slug] ??
        slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
    );

    return { ...exp, speciesSlugs, speciesNames };
  });

  return (
    <div className="pt-14 bg-[#0A1C28]">
      <ExperiencesBrowser
        experiences={parsedExperiences}
        regions={allRegions}
        regionSpeciesMap={regionSpeciesMap}
      />
    </div>
  );
}
