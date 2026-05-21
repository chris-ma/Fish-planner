import Link from "next/link";
import { Fish } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeasonBadge } from "./SeasonBadge";
import type { Species } from "@/db/schema";

const CATEGORY_LABELS: Record<string, string> = {
  pelagic: "Pelagic",
  reef: "Reef",
  estuary: "Estuary",
  inshore: "Inshore",
  freshwater: "Freshwater",
};

const CATEGORY_COLORS: Record<string, string> = {
  pelagic: "bg-blue-100 text-blue-700",
  reef: "bg-orange-100 text-orange-700",
  estuary: "bg-green-100 text-green-700",
  inshore: "bg-teal-100 text-teal-700",
  freshwater: "bg-emerald-100 text-emerald-700",
};

interface SpeciesCardProps {
  species: Species;
  bestRating?: string | null;
  bestMonth?: string;
}

export function SpeciesCard({ species, bestRating, bestMonth }: SpeciesCardProps) {
  return (
    <Link href={`/species/${species.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-base leading-tight">{species.commonName}</h3>
              {species.scientificName && (
                <p className="text-xs text-muted-foreground italic mt-0.5">{species.scientificName}</p>
              )}
            </div>
            <span
              className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                CATEGORY_COLORS[species.category] ?? "bg-slate-100 text-slate-600"
              }`}
            >
              {CATEGORY_LABELS[species.category] ?? species.category}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {species.description}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {bestRating && <SeasonBadge rating={bestRating} />}
            {bestMonth && <span className="text-xs text-muted-foreground">Best: {bestMonth}</span>}
            {species.bagLimit && (
              <span className="text-xs text-slate-400">Bag: {species.bagLimit}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
