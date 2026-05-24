"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Fish } from "lucide-react";
import { getSpeciesImage } from "@/lib/images";

interface SpeciesData {
  slug: string;
  commonName: string;
  scientificName: string | null;
  category: string;
  description: string | null;
  minLegalSizeMm: number | null;
  bagLimit: number | null;
  bestRating: string | null;
}

const RATING_STYLES: Record<string, string> = {
  peak: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  good: "bg-[#0D9488]/20 text-[#0D9488] border-[#0D9488]/40",
  fair: "bg-sky-500/20 text-sky-400 border-sky-500/40",
  poor: "bg-white/10 text-white/40 border-white/20",
};

interface Props {
  month: number;
  monthName: string;
}

export function FeaturedFishClient({ month, monthName }: Props) {
  const { user, isLoaded } = useUser();
  const [speciesData, setSpeciesData] = useState<SpeciesData | null>(null);
  const [loading, setLoading] = useState(false);

  const slug = isLoaded ? (user?.unsafeMetadata?.dreamFish as string | undefined) : undefined;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/species/${slug}?month=${month}`)
      .then((r) => r.json())
      .then((data) => {
        if (data) setSpeciesData(data);
      })
      .finally(() => setLoading(false));
  }, [slug, month]);

  if (!isLoaded || loading || !speciesData) return null;

  const photo = getSpeciesImage(speciesData.slug, speciesData.category, 1200);

  return (
    <section className="px-4 py-12 max-w-7xl mx-auto">
      <p className="text-xs font-semibold text-[#0D9488] uppercase tracking-widest mb-4 flex items-center gap-2">
        <Fish className="h-3.5 w-3.5" />
        Your Featured Fish
      </p>

      <div className="rounded-2xl overflow-hidden bg-[#040F1C] border border-white/10 flex flex-col md:flex-row">
        {/* Photo */}
        <div
          className="md:w-2/5 h-56 md:h-auto min-h-[220px] bg-cover bg-center"
          style={{ backgroundImage: `url(${photo})` }}
        />

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#F5F0E8] mb-1">
              {speciesData.commonName}
            </h2>
            {speciesData.scientificName && (
              <p className="text-sm text-white/40 italic mb-4">{speciesData.scientificName}</p>
            )}
            {speciesData.description && (
              <p className="text-[#F5F0E8]/70 text-sm leading-relaxed mb-6 line-clamp-3">
                {speciesData.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              {speciesData.bestRating && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    RATING_STYLES[speciesData.bestRating] ?? RATING_STYLES.poor
                  }`}
                >
                  {monthName}: {speciesData.bestRating.charAt(0).toUpperCase() + speciesData.bestRating.slice(1)}
                </span>
              )}
              {speciesData.minLegalSizeMm && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white/60 border border-white/15">
                  Min {speciesData.minLegalSizeMm}mm
                </span>
              )}
              {speciesData.bagLimit && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white/60 border border-white/15">
                  Bag limit {speciesData.bagLimit}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/species/${speciesData.slug}`}
            className="inline-flex items-center gap-2 text-[#0D9488] text-sm font-semibold hover:text-teal-300 transition-colors"
          >
            View full profile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
