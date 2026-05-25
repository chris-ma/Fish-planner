"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { SpeciesCarousel } from "./SpeciesCarousel";

type Species = { id: string; slug: string; commonName: string; category: string };

interface Props {
  fallbackSpecies: Species[];
  month: number;
  monthName: string;
}

export function OnTheBiteClient({ fallbackSpecies, month, monthName }: Props) {
  const { user, isLoaded } = useUser();
  const [displaySpecies, setDisplaySpecies] = useState<Species[]>(fallbackSpecies);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const coords = user.unsafeMetadata?.locationCoords as { lat: number; lng: number } | undefined;
    if (!coords) return;

    (async () => {
      try {
        const nearbyRes = await fetch(`/api/regions/nearby?lat=${coords.lat}&lng=${coords.lng}&month=${month}`);
        if (!nearbyRes.ok) return;
        const nearby: { slug: string }[] = await nearbyRes.json();
        if (!nearby?.[0]?.slug) return;

        const inSeasonRes = await fetch(`/api/regions/${nearby[0].slug}/in-season?month=${month}`);
        if (!inSeasonRes.ok) return;
        const inSeason: Species[] = await inSeasonRes.json();
        if (inSeason.length > 0) setDisplaySpecies(inSeason);
      } catch {
        // silently fall back to global species
      }
    })();
  }, [isLoaded, user, month]);

  return <SpeciesCarousel species={displaySpecies} monthName={monthName} />;
}
