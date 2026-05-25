"use client";

import { useState } from "react";
import { SpeciesBrowser } from "@/components/discovery/SpeciesBrowser";
import { RegionCard } from "@/components/discovery/RegionCard";
import { ExperiencesBrowser } from "@/components/discovery/ExperiencesBrowser";
import type { Species, Region } from "@/db/schema";
import type { ParsedExperience } from "@/components/discovery/ExperiencesBrowser";

const TABS = ["experiences", "species", "locations"] as const;
type Tab = (typeof TABS)[number];

export function PlanTabs({
  species,
  regions,
  experiences,
  regionSpeciesMap,
}: {
  species: Species[];
  regions: Region[];
  experiences: ParsedExperience[];
  regionSpeciesMap: Record<string, string[]>;
}) {
  const [tab, setTab] = useState<Tab>("experiences");

  return (
    <div>
      <div className="bg-[#020B14] px-4 sm:px-6 pt-5 flex items-end gap-1">
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 rounded-t-xl text-sm font-semibold capitalize transition-all ${
                active
                  ? "bg-[#F5F0E8] text-[#040F1C] py-3"
                  : "bg-white/10 text-white/50 hover:bg-white/15 hover:text-white/70 py-2"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {tab === "experiences" && (
        <ExperiencesBrowser
          experiences={experiences}
          regions={regions}
          regionSpeciesMap={regionSpeciesMap}
        />
      )}
      {tab === "species" && <SpeciesBrowser species={species} />}
      {tab === "locations" && (
        <div className="bg-[#F5F0E8] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {regions.map((region) => (
              <RegionCard key={region.id} region={region} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
