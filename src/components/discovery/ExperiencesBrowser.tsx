"use client";

import { useState } from "react";
import Link from "next/link";
import type { Experience, Region, Charter } from "@/db/schema";
import { CharterCard } from "./CharterCard";

// Copied from RegionCard.tsx
const ZONE_LABELS: Record<string, string> = {
  far_north_qld: "Far North QLD",
  central_qld: "Central QLD",
  southeast_qld: "Southeast QLD",
  nsw: "New South Wales",
  vic_coast: "Victoria",
  tas: "Tasmania",
  lord_howe: "Lord Howe Island",
  murray_darling: "Murray–Darling",
  alpine: "Alpine",
  nt_top_end: "NT — Top End",
  nt_gulf: "NT — Gulf",
  wa_kimberley: "WA — Kimberley",
  wa_pilbara: "WA — Pilbara / Ningaloo",
  wa_mid_west: "WA — Mid West",
  wa_southwest: "WA — Southwest",
  sa_spencer_gulf: "SA — Spencer Gulf",
  sa_south: "SA — South Coast",
  christmas_island: "Christmas Island",
  cocos_islands: "Cocos Islands",
  nz_north_island: "NZ — North Island",
  nz_south_island: "NZ — South Island",
};

const CATEGORY_BG: Record<string, string> = {
  offshore:   "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=600",
  reef:       "https://images.pexels.com/photos/1591938/pexels-photo-1591938.jpeg?auto=compress&cs=tinysrgb&w=600",
  estuary:    "https://images.pexels.com/photos/3048522/pexels-photo-3048522.jpeg?auto=compress&cs=tinysrgb&w=600",
  inshore:    "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=600",
  freshwater: "https://images.pexels.com/photos/5200238/pexels-photo-5200238.jpeg?auto=compress&cs=tinysrgb&w=600",
};

const CATEGORY_BADGE: Record<string, string> = {
  offshore:   "bg-blue-600",
  reef:       "bg-orange-600",
  estuary:    "bg-teal-600",
  inshore:    "bg-cyan-600",
  freshwater: "bg-emerald-600",
};

const CATEGORY_OVERLAY: Record<string, string> = {
  offshore:   "from-blue-900/50 to-transparent",
  reef:       "from-orange-900/50 to-transparent",
  estuary:    "from-teal-900/50 to-transparent",
  inshore:    "from-cyan-900/50 to-transparent",
  freshwater: "from-emerald-900/50 to-transparent",
};

export type ParsedExperience = Experience & {
  speciesSlugs: string[];
  speciesNames: string[];
};

interface Props {
  experiences: ParsedExperience[];
  regions: Region[];
  regionSpeciesMap: Record<string, string[]>;
  charters?: Charter[];
}

// ── Experience Card ───────────────────────────────────────────────────────────

function ExperienceCard({
  exp,
  regionSlug,
}: {
  exp: ParsedExperience;
  regionSlug: string;
}) {
  const bg = CATEGORY_BG[exp.category] ?? CATEGORY_BG.offshore;
  const badge = CATEGORY_BADGE[exp.category] ?? "bg-slate-600";
  const overlay = CATEGORY_OVERLAY[exp.category] ?? "from-blue-900/50 to-transparent";
  const href = `/experiences/${exp.slug}`;

  const MAX_CHIPS = 4;
  const visibleNames = exp.speciesNames.slice(0, MAX_CHIPS);
  const overflow = exp.speciesNames.length - MAX_CHIPS;

  return (
    <Link href={href}>
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        style={{ minHeight: 240 }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${bg}')` }}
        />
        {/* Category colour tint */}
        <div className={`absolute inset-0 bg-gradient-to-t ${overlay}`} />
        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-4" style={{ minHeight: 240 }}>
          {/* Category badge */}
          <div className="flex items-start justify-between">
            <span
              className={`${badge} text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider`}
            >
              {exp.category}
            </span>
          </div>

          {/* Name + description */}
          <div className="mt-auto pt-6">
            <h3 className="text-white font-bold text-lg leading-tight">{exp.name}</h3>
            {exp.description && (
              <p className="text-white/70 text-sm mt-1 line-clamp-2 leading-relaxed">
                {exp.description}
              </p>
            )}

            {/* Species chips */}
            {visibleNames.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {visibleNames.map((name) => (
                  <span
                    key={name}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white/80"
                  >
                    {name}
                  </span>
                ))}
                {overflow > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white/80">
                    +{overflow} more
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            <p className="text-[#C99A3E] text-sm font-medium mt-3">Plan this trip →</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Main Browser ──────────────────────────────────────────────────────────────

export function ExperiencesBrowser({ experiences, regions, regionSpeciesMap, charters = [] }: Props) {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) ?? null;

  const filtered =
    selectedRegionId === null
      ? experiences
      : experiences.filter((exp) => {
          const regionSpecies = regionSpeciesMap[selectedRegionId] ?? [];
          return exp.speciesSlugs.some((s) => regionSpecies.includes(s));
        });

  // Group regions by zone for <optgroup> elements
  const zoneMap: Record<string, Region[]> = {};
  for (const region of regions) {
    if (!zoneMap[region.zone]) zoneMap[region.zone] = [];
    zoneMap[region.zone].push(region);
  }

  const n = filtered.length;
  const countLabel = `${n} experience${n !== 1 ? "s" : ""} ${
    selectedRegion ? `in ${selectedRegion.name}` : "available"
  }`;

  return (
    <div className="min-h-screen bg-[#EAE2D0]">
      {/* ── Guided Experiences ── */}
      {charters.length > 0 && (
        <div className="bg-[#DCD0B6] px-4 sm:px-6 py-8 border-b border-black/10">
          <div className="max-w-7xl mx-auto">
            <div className="h-1 w-12 bg-[#C99A3E] rounded mb-3" />
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-[#C99A3E]">Guided Experiences</h2>
                <p className="text-black/40 text-sm mt-1">Guided trips with expert local operators</p>
              </div>
              <Link href="/charters" className="text-[#C99A3E] text-sm hover:underline hidden sm:block">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {charters.map((c) => (
                <CharterCard key={c.id} charter={c} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="px-4 sm:px-6 py-5 border-b border-black/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="region-filter" className="text-sm font-semibold text-[#0F2635] shrink-0">
            Filter by region
          </label>
          <select
            id="region-filter"
            value={selectedRegionId ?? ""}
            onChange={(e) => setSelectedRegionId(e.target.value || null)}
            className="w-full sm:w-72 px-3 py-2 rounded-lg border border-black/15 bg-white text-[#0F2635] text-sm focus:outline-none focus:ring-2 focus:ring-[#C99A3E]"
          >
            <option value="">All regions</option>
            {Object.entries(zoneMap).map(([zone, zoneRegions]) => (
              <optgroup key={zone} label={ZONE_LABELS[zone] ?? zone}>
                {zoneRegions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="text-xs text-black/40 sm:ml-2">{countLabel}</p>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-black/30 text-sm">
            No experiences match this region yet. Try selecting a different region.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((exp) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                regionSlug={selectedRegion?.slug ?? ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
