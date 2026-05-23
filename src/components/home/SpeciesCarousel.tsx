"use client";

import Link from "next/link";
import { getSpeciesImage } from "@/lib/images";

type Species = {
  id: string;
  slug: string;
  commonName: string;
  category: string;
};

interface SpeciesCarouselProps {
  species: Species[];
  monthName: string;
}

export function SpeciesCarousel({ species, monthName }: SpeciesCarouselProps) {
  if (species.length === 0) {
    return (
      <p className="text-slate-500 py-8 text-center">No season data loaded yet.</p>
    );
  }

  const cards = [...species, ...species];

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-[#040F1C]">On the bite in {monthName}</h2>
      </div>
      <p className="text-sm text-slate-500 mb-5 max-w-2xl">
        Species at peak or good season this month — click to explore.
      </p>

      <div className="relative overflow-hidden group">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-[#F5F0E8] to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-[#F5F0E8] to-transparent" />

        <div
          className="flex gap-3"
          style={{
            animation: "carousel-scroll 45s linear infinite",
            animationPlayState: "var(--carousel-play, running)",
            width: "max-content",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.setProperty("--carousel-play", "paused"))
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.setProperty("--carousel-play", "running"))
          }
        >
          {cards.map((sp, i) => {
            const imgUrl = getSpeciesImage(sp.slug, sp.category, 600);
            return (
              <Link
                key={`${sp.id}-${i}`}
                href={`/species/${sp.slug}`}
                className="relative rounded-xl overflow-hidden aspect-[3/4] w-36 md:w-44 shrink-0 group/card block"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/card:scale-105"
                  style={{ backgroundImage: `url(${imgUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                    {sp.commonName}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes carousel-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
