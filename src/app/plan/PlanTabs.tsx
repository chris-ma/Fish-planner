"use client";

import { useState } from "react";
import { SpeciesBrowser } from "@/components/discovery/SpeciesBrowser";
import { RegionCard } from "@/components/discovery/RegionCard";
import type { Species, Region } from "@/db/schema";

export function PlanTabs({
  species,
  regions,
}: {
  species: Species[];
  regions: Region[];
}) {
  const [tab, setTab] = useState<"species" | "locations">("species");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Tab pills */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("species")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            tab === "species"
              ? "bg-[#0D9488] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Species
        </button>
        <button
          onClick={() => setTab("locations")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            tab === "locations"
              ? "bg-[#0D9488] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Locations
        </button>
      </div>

      {tab === "species" && <SpeciesBrowser species={species} />}

      {tab === "locations" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {regions.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      )}
    </div>
  );
}
