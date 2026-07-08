"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { getZoneImage } from "@/lib/images";

interface NearbyRegion {
  id: string;
  slug: string;
  name: string;
  state: string;
  zone: string;
  distanceKm: number;
  seasonScore: number;
}

interface Props {
  month: number;
}

export function NearbyRegionsClient({ month }: Props) {
  const { user, isLoaded } = useUser();
  const [regions, setRegions] = useState<NearbyRegion[]>([]);
  const [loading, setLoading] = useState(false);

  const coords = isLoaded
    ? (user?.unsafeMetadata?.locationCoords as { lat: number; lng: number } | undefined)
    : undefined;
  const locationName = isLoaded
    ? (user?.unsafeMetadata?.location as string | undefined)
    : undefined;

  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    fetch(`/api/regions/nearby?lat=${coords.lat}&lng=${coords.lng}&month=${month}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRegions(data);
      })
      .finally(() => setLoading(false));
  }, [coords?.lat, coords?.lng, month]);

  if (!isLoaded || loading || !coords || regions.length === 0) return null;

  return (
    <section className="px-4 py-12 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="h-1 w-12 bg-[#C99A3E] rounded mb-3" />
        <h2 className="text-2xl font-bold text-[#C99A3E]">Fisheries near {locationName ?? "you"}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {regions.map((region) => {
          const img = getZoneImage(region.zone, 600);
          const km = Math.round(region.distanceKm);
          return (
            <Link
              key={region.id}
              href={`/regions/${region.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] block"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-bold text-white text-sm leading-tight">{region.name}</p>
                <p className="text-white/60 text-xs mt-0.5">{region.state}</p>
                <p className="text-[#C99A3E] text-[10px] font-semibold mt-1">{km} km away</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
