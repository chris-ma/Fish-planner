"use client";

import { useState } from "react";
import Link from "next/link";
import { getSpeciesImage } from "@/lib/images";
import type { Species } from "@/db/schema";

const CATEGORIES = [
  { value: "all", label: "All Species" },
  { value: "pelagic", label: "Pelagic" },
  { value: "reef", label: "Reef" },
  { value: "estuary", label: "Estuary" },
  { value: "inshore", label: "Inshore" },
  { value: "freshwater", label: "Freshwater" },
];

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  pelagic: "bg-blue-600",
  reef: "bg-orange-600",
  estuary: "bg-[#2E5E4E]",
  inshore: "bg-sky-600",
  freshwater: "bg-emerald-600",
};

export function SpeciesBrowser({ species }: { species: Species[] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? species
      : species.filter((s) => s.category === activeCategory);

  return (
    <div className="bg-[#F2EDE2]">
      {/* Category filter tabs */}
      <div className="px-4 sm:px-6 pt-5 overflow-x-auto">
        <div className="flex gap-2 pb-4 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                activeCategory === cat.value
                  ? "border-[#FFC423] text-[#FFC423] bg-[#FFC423]/10"
                  : "border-[#0F2635]/20 text-[#0F2635]/50 hover:border-[#0F2635]/40 hover:text-[#0F2635]/70"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Species grid */}
      <div className="px-4 sm:px-6 pb-24 grid grid-cols-3 gap-2">
        {filtered.map((sp) => {
          const imageUrl = getSpeciesImage(sp.slug, sp.category, 600);
          const badgeColor =
            CATEGORY_BADGE_COLORS[sp.category] ?? "bg-slate-600";

          return (
            <Link key={sp.id} href={`/species/${sp.slug}`}>
              <div className="rounded-xl overflow-hidden relative aspect-[3/4]">
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
                  style={{ backgroundImage: `url('${imageUrl}')` }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

                {/* Category badge */}
                <div className="relative z-10 p-2">
                  <span
                    className={`${badgeColor} text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider`}
                  >
                    {sp.category}
                  </span>
                </div>

                {/* Name at bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-2.5">
                  <p className="text-white font-bold text-xs leading-tight">
                    {sp.commonName}
                  </p>
                  {sp.scientificName && (
                    <p className="text-white/55 text-[9px] italic leading-tight mt-0.5 truncate">
                      {sp.scientificName}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
