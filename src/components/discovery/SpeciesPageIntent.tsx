"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { MONTH_NAMES_FULL } from "@/lib/utils/season";

interface Props {
  commonName: string;
}

function IntentBanner({ commonName }: Props) {
  const params = useSearchParams();
  const regionSlug = params.get("region");
  const regionName = params.get("regionName") ?? regionSlug;
  const monthNum = Number(params.get("month"));
  const monthName =
    monthNum >= 1 && monthNum <= 12 ? MONTH_NAMES_FULL[monthNum] : "";

  if (!regionSlug) return null;

  return (
    <div className="mb-5 bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-white/80 text-sm min-w-0">
          <MapPin className="h-4 w-4 text-[#C99A3E] shrink-0" />
          <span className="truncate">
            <span className="text-white font-semibold">{commonName}</span>
            {regionName && (
              <>
                <span className="mx-1.5 text-white/40">·</span>
                {regionName}
              </>
            )}
            {monthName && (
              <>
                <span className="mx-1.5 text-white/40">·</span>
                {monthName}
              </>
            )}
          </span>
        </div>
        <Link
          href={`/trips/new?region=${regionSlug}&species=${encodeURIComponent(commonName)}`}
          className="inline-flex items-center gap-1.5 bg-[#C99A3E] hover:bg-[#AD8232] text-[#0A1C28] text-sm font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
        >
          Plan This Trip
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function SpeciesPageIntent({ commonName }: Props) {
  return (
    <Suspense fallback={null}>
      <IntentBanner commonName={commonName} />
    </Suspense>
  );
}
