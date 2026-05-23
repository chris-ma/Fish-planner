"use client";

import Link from "next/link";
import { Heart, Flame } from "lucide-react";
import { SeasonBadge } from "./SeasonBadge";
import { getSpeciesImage } from "@/lib/images";
import type { Species } from "@/db/schema";

const CATEGORY_LABELS: Record<string, string> = {
  pelagic: "Pelagic",
  reef: "Reef",
  estuary: "Estuary",
  inshore: "Inshore",
  freshwater: "Freshwater",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  pelagic: "from-blue-900/80 to-indigo-900/60",
  reef: "from-orange-900/80 to-red-900/60",
  estuary: "from-teal-900/80 to-green-900/60",
  inshore: "from-cyan-900/80 to-sky-900/60",
  freshwater: "from-emerald-900/80 to-green-900/60",
};

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  pelagic: "bg-blue-100 text-blue-700",
  reef: "bg-orange-100 text-orange-700",
  estuary: "bg-teal-100 text-teal-700",
  inshore: "bg-teal-100 text-teal-700",
  freshwater: "bg-emerald-100 text-emerald-700",
};

interface SpeciesCardProps {
  species: Species;
  bestRating?: string | null;
  bestMonth?: string;
}

export function SpeciesCard({ species, bestRating, bestMonth }: SpeciesCardProps) {
  const gradient = CATEGORY_GRADIENTS[species.category] ?? "from-blue-900/80 to-indigo-900/60";
  const categoryLabel = CATEGORY_LABELS[species.category] ?? species.category;
  const badgeColor = CATEGORY_BADGE_COLORS[species.category] ?? "bg-slate-100 text-slate-600";
  const imageUrl = getSpeciesImage(species.slug, species.category, 600);

  return (
    <Link href={`/species/${species.slug}`}>
      <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border cursor-pointer h-full flex flex-col group">
        {/* Image area with colour overlay */}
        <div className="relative h-36 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

          {bestRating === "peak" && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              <Flame className="h-3 w-3" />
              Prime
            </div>
          )}
          <button className="absolute top-3 right-3 z-10" onClick={(e) => e.preventDefault()}>
            <Heart className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
          </button>

          <div className="absolute bottom-3 left-3 z-10">
            <p className="text-white font-bold text-base leading-tight drop-shadow-md">
              {species.commonName}
            </p>
            {species.scientificName && (
              <p className="text-white/70 text-xs italic mt-0.5">{species.scientificName}</p>
            )}
          </div>
        </div>

        <div className="bg-[#F5F0E8] flex-1 p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${badgeColor}`}>
              {categoryLabel}
            </span>
            {bestRating && <SeasonBadge rating={bestRating} />}
          </div>
          {bestMonth && (
            <p className="text-xs text-muted-foreground">Best: {bestMonth}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
