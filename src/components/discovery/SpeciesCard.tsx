"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { SeasonBadge } from "./SeasonBadge";
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
  inshore: "bg-cyan-100 text-cyan-700",
  freshwater: "bg-emerald-100 text-emerald-700",
};

const CATEGORY_IMAGES: Record<string, string> = {
  pelagic: "https://images.unsplash.com/photo-1559827291-72416316ece9?w=600&auto=format&fit=crop&q=80",
  reef: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&auto=format&fit=crop&q=80",
  estuary: "https://images.unsplash.com/photo-1542601906897-ec823b17a0b7?w=600&auto=format&fit=crop&q=80",
  inshore: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&fit=crop&q=80",
  freshwater: "https://images.unsplash.com/photo-1511525729718-ad15d2ab17ce?w=600&auto=format&fit=crop&q=80",
};

const SPECIES_IMAGES: Record<string, string> = {
  "barramundi": "https://images.unsplash.com/photo-1574914629354-f5108fb16e1f?w=600&auto=format&fit=crop&q=80",
  "murray-cod": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
  "brown-trout": "https://images.unsplash.com/photo-1511525729718-ad15d2ab17ce?w=600&auto=format&fit=crop&q=80",
  "rainbow-trout": "https://images.unsplash.com/photo-1511525729718-ad15d2ab17ce?w=600&auto=format&fit=crop&q=80",
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
  const imageUrl = SPECIES_IMAGES[species.slug] ?? CATEGORY_IMAGES[species.category] ?? CATEGORY_IMAGES.pelagic;

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

        <div className="bg-white flex-1 p-3 flex flex-col gap-2">
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
