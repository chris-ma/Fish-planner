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
};

// Category colour overlays per zone
const ZONE_GRADIENTS: Record<string, string> = {
  far_north_qld: "from-cyan-900/75 to-blue-900/60",
  central_qld: "from-teal-900/75 to-cyan-900/60",
  southeast_qld: "from-sky-900/75 to-blue-900/60",
  nsw: "from-slate-900/75 to-blue-900/60",
  vic_coast: "from-indigo-900/75 to-slate-900/60",
  tas: "from-violet-900/75 to-indigo-900/60",
  lord_howe: "from-emerald-900/75 to-teal-900/60",
  murray_darling: "from-amber-900/75 to-green-900/60",
  alpine: "from-sky-900/75 to-slate-700/60",
  nt_top_end: "from-amber-900/75 to-orange-900/60",
  nt_gulf: "from-orange-900/75 to-amber-900/60",
  wa_kimberley: "from-red-900/75 to-orange-900/60",
  wa_pilbara: "from-cyan-900/75 to-teal-900/60",
  wa_mid_west: "from-blue-900/75 to-cyan-900/60",
  wa_southwest: "from-slate-900/75 to-blue-900/60",
  sa_spencer_gulf: "from-teal-900/75 to-slate-900/60",
  sa_south: "from-indigo-900/75 to-teal-900/60",
  christmas_island: "from-emerald-900/75 to-cyan-900/60",
  cocos_islands: "from-cyan-900/75 to-emerald-900/60",
};

// Zone-level photography
const ZONE_IMAGES: Record<string, string> = {
  far_north_qld: "https://images.unsplash.com/photo-1524275539700-cf51138f679b?w=600&auto=format&fit=crop&q=80",
  central_qld: "https://images.unsplash.com/photo-1523395243481-163f8f6155ab?w=600&auto=format&fit=crop&q=80",
  southeast_qld: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&auto=format&fit=crop&q=80",
  nsw: "https://images.unsplash.com/photo-1549816954-9e9a7cb3ef4c?w=600&auto=format&fit=crop&q=80",
  vic_coast: "https://images.unsplash.com/photo-1576089872996-64d5a31b738a?w=600&auto=format&fit=crop&q=80",
  tas: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80",
  lord_howe: "https://images.unsplash.com/photo-1516026672322-18933d4c52f3?w=600&auto=format&fit=crop&q=80",
  murray_darling: "https://images.unsplash.com/photo-1542601906897-ec823b17a0b7?w=600&auto=format&fit=crop&q=80",
  alpine: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
  nt_top_end: "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=600&auto=format&fit=crop&q=80",
  nt_gulf: "https://images.unsplash.com/photo-1559827291-72416316ece9?w=600&auto=format&fit=crop&q=80",
  wa_kimberley: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80",
  wa_pilbara: "https://images.unsplash.com/photo-1516026672322-18933d4c52f3?w=600&auto=format&fit=crop&q=80",
  wa_mid_west: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&auto=format&fit=crop&q=80",
  wa_southwest: "https://images.unsplash.com/photo-1549816954-9e9a7cb3ef4c?w=600&auto=format&fit=crop&q=80",
  sa_spencer_gulf: "https://images.unsplash.com/photo-1542601906897-ec823b17a0b7?w=600&auto=format&fit=crop&q=80",
  sa_south: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&fit=crop&q=80",
  christmas_island: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&auto=format&fit=crop&q=80",
  cocos_islands: "https://images.unsplash.com/photo-1491566102020-21838872658e?w=600&auto=format&fit=crop&q=80",
};

interface RegionCardProps {
  region: Region;
  seasonScore?: number;
}

export function RegionCard({ region, seasonScore }: RegionCardProps) {
  const gradient = ZONE_GRADIENTS[region.zone] ?? "from-slate-900/75 to-blue-900/60";
  const zoneLabel = ZONE_LABELS[region.zone] ?? region.zone;
  const imageUrl = ZONE_IMAGES[region.zone] ?? ZONE_IMAGES.nsw;

  return (
    <Link href={`/regions/${region.slug}`}>
      <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border cursor-pointer h-full flex flex-col group">
        {/* Image area with colour overlay */}
        <div className="relative h-44 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

          <button className="absolute top-3 right-3 z-10" onClick={(e) => e.preventDefault()}>
            <Heart className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
          </button>

          <div className="absolute bottom-3 left-3 z-10">
            <p className="text-white font-bold text-base leading-tight drop-shadow-md">{region.name}</p>
            <p className="text-white/80 text-xs mt-0.5">{region.state}</p>
          </div>
        </div>

        {/* Info area */}
        <div className="bg-white flex-1 p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-medium">
              {zoneLabel}
            </span>
            {seasonScore !== undefined && seasonScore > 25 && (
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  seasonScore > 40
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {seasonScore > 40 ? "Hot" : "Active"}
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
