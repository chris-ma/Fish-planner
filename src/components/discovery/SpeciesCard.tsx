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
  pelagic: "from-blue-500 to-indigo-900",
  reef: "from-orange-400 to-red-800",
  estuary: "from-teal-400 to-green-800",
  inshore: "from-cyan-400 to-sky-800",
  freshwater: "from-emerald-400 to-green-900",
};

const CATEGORY_EMOJI: Record<string, string> = {
  pelagic: "⚡",
  reef: "🪸",
  estuary: "🌿",
  inshore: "🌊",
  freshwater: "💧",
};

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  pelagic: "bg-blue-100 text-blue-700",
  reef: "bg-orange-100 text-orange-700",
  estuary: "bg-teal-100 text-teal-700",
  inshore: "bg-cyan-100 text-cyan-700",
  freshwater: "bg-emerald-100 text-emerald-700",
};

interface SpeciesCardProps {
  species: Species;
  bestRating?: string | null;
  bestMonth?: string;
}

export function SpeciesCard({ species, bestRating, bestMonth }: SpeciesCardProps) {
  const gradient = CATEGORY_GRADIENTS[species.category] ?? "from-blue-500 to-indigo-900";
  const emoji = CATEGORY_EMOJI[species.category] ?? "🐟";
  const categoryLabel = CATEGORY_LABELS[species.category] ?? species.category;
  const badgeColor = CATEGORY_BADGE_COLORS[species.category] ?? "bg-slate-100 text-slate-600";

  return (
    <Link href={`/species/${species.slug}`}>
      <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border cursor-pointer h-full flex flex-col">
        {/* Gradient image area */}
        <div className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          {/* Large background emoji */}
          <span className="text-7xl opacity-20 select-none">{emoji}</span>

          {/* Heart icon top-right */}
          <button className="absolute top-3 right-3" onClick={(e) => e.preventDefault()}>
            <Heart className="h-5 w-5 text-white/60" />
          </button>

          {/* Species name + scientific name bottom-left */}
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-bold text-base leading-tight drop-shadow">
              {species.commonName}
            </p>
            {species.scientificName && (
              <p className="text-white/70 text-xs italic mt-0.5">{species.scientificName}</p>
            )}
          </div>
        </div>

        {/* White info area */}
        <div className="bg-white flex-1 p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category badge */}
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${badgeColor}`}>
              {categoryLabel}
            </span>

            {/* Season badge */}
            {bestRating && <SeasonBadge rating={bestRating} />}

            {/* Bag limit chip */}
            {species.bagLimit && (
              <span className="text-xs text-slate-500">Bag: {species.bagLimit}</span>
            )}
          </div>

          {bestMonth && (
            <p className="text-xs text-muted-foreground">Best: {bestMonth}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
