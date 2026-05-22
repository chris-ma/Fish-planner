"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Region } from "@/db/schema";

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
};

const ZONE_GRADIENTS: Record<string, string> = {
  far_north_qld: "from-cyan-500 to-blue-700",
  central_qld: "from-teal-500 to-cyan-800",
  southeast_qld: "from-sky-500 to-blue-800",
  nsw: "from-slate-500 to-blue-900",
  vic_coast: "from-indigo-500 to-slate-800",
  tas: "from-violet-500 to-indigo-900",
  lord_howe: "from-emerald-400 to-teal-800",
  murray_darling: "from-amber-500 to-green-800",
  alpine: "from-sky-300 to-slate-600",
};

const ZONE_EMOJI: Record<string, string> = {
  far_north_qld: "🐠",
  central_qld: "🦈",
  southeast_qld: "🌊",
  nsw: "🎣",
  vic_coast: "🐙",
  tas: "🦞",
  lord_howe: "🌴",
  murray_darling: "🐟",
  alpine: "🏔️",
};

interface RegionCardProps {
  region: Region;
  seasonScore?: number;
}

export function RegionCard({ region, seasonScore }: RegionCardProps) {
  const gradient = ZONE_GRADIENTS[region.zone] ?? "from-slate-500 to-blue-900";
  const emoji = ZONE_EMOJI[region.zone] ?? "🎣";
  const zoneLabel = ZONE_LABELS[region.zone] ?? region.zone;

  return (
    <Link href={`/regions/${region.slug}`}>
      <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border cursor-pointer h-full flex flex-col">
        {/* Gradient image area */}
        <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          {/* Large background wave emoji */}
          <span className="text-7xl opacity-20 select-none">{emoji}</span>

          {/* Heart icon top-right */}
          <button className="absolute top-3 right-3" onClick={(e) => e.preventDefault()}>
            <Heart className="h-5 w-5 text-white/60" />
          </button>

          {/* Name + state bottom-left */}
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-bold text-base leading-tight drop-shadow">{region.name}</p>
            <p className="text-white/80 text-xs mt-0.5">{region.state}</p>
          </div>
        </div>

        {/* White info area */}
        <div className="bg-white flex-1 p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Zone badge */}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-medium">
              {zoneLabel}
            </span>

            {/* Season score badge */}
            {seasonScore !== undefined && seasonScore > 25 && (
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  seasonScore > 40
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {seasonScore > 40 ? "🔥 Hot" : "✓ Active"}
              </span>
            )}
          </div>

          {region.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {region.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
