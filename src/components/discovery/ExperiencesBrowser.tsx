"use client";

import { useState } from "react";
import Link from "next/link";
import type { Experience, Region } from "@/db/schema";

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
  const href = `/trips/new?experience=${exp.slug}${regionSlug ? `&region=${regionSlug}` : ""}`;

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
            <p className="text-[#0D9488] text-sm font-medium mt-3">Plan this trip →</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Main Browser ──────────────────────────────────────────────────────────────

export function ExperiencesBrowser({ experiences, regions, regionSpeciesMap }: Props) {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) ?? null;

  // Filter experiences by region (by species overlap)
  const filtered =
    selectedRegionId === null
      ? experiences
      : experiences.filter((exp) => {
          const regionSpecies = regionSpeciesMap[selectedRegionId] ?? [];
          return exp.speciesSlugs.some((s) => regionSpecies.includes(s));
        });

  // Group regions by zone
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
    <div className="min-h-screen bg-[#040F1C] text-[#F5F0E8]">
      {/* Page header */}
      <div className="px-4 sm:px-6 pt-20 pb-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-wide text-[#F5F0E8]"
            style={{ fontFamily: "var(--font-bebas), system-ui, sans-serif" }}
          >
            Fishing Experiences
          </h1>
          <p className="text-white/60 mt-2 text-base max-w-xl">
            Discover curated fishing experiences. Filter by region to find what&apos;s on in your area.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-0 md:gap-6 px-0 md:px-6 pb-24">
        {/* ── Left panel: region selector ── */}
        <aside className="md:w-64 shrink-0 md:sticky md:top-4 md:self-start md:max-h-[calc(100vh-6rem)] md:overflow-y-auto border-b md:border-b-0 md:border-r border-white/10 px-4 py-4 md:py-6">
          {/* "All" button */}
          <button
            onClick={() => setSelectedRegionId(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold mb-4 transition-colors ${
              selectedRegionId === null
                ? "text-[#0D9488] border-l-2 border-[#0D9488] pl-2"
                : "text-white/60 hover:text-white/90"
            }`}
          >
            All Experiences
          </button>

          {/* Zone groups */}
          {Object.entries(zoneMap).map(([zone, zoneRegions]) => (
            <div key={zone} className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35 mb-1.5 px-1">
                {ZONE_LABELS[zone] ?? zone}
              </p>
              <div className="flex flex-col gap-0.5">
                {zoneRegions.map((region) => {
                  const isActive = selectedRegionId === region.id;
                  return (
                    <button
                      key={region.id}
                      onClick={() => setSelectedRegionId(region.id)}
                      className={`text-left pl-4 pr-3 py-1.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "text-[#0D9488] border-l-2 border-[#0D9488] pl-3 bg-[#0D9488]/5"
                          : "text-white/55 hover:text-white/85 hover:bg-white/5"
                      }`}
                    >
                      {region.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* ── Right panel: cards ── */}
        <main className="flex-1 px-4 md:px-0 py-4 md:py-6">
          {/* Count header */}
          <p className="text-white/50 text-sm mb-4 font-medium">{countLabel}</p>

          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-24 text-white/40 text-sm">
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
        </main>
      </div>
    </div>
  );
}
