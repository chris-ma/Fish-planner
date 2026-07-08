"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

type ParsedExperience = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  speciesSlugs: string[];
};

const CATEGORY_COLORS: Record<string, string> = {
  offshore: "bg-blue-500/20 text-blue-300",
  reef: "bg-orange-500/20 text-orange-300",
  estuary: "bg-teal-500/20 text-teal-300",
  inshore: "bg-cyan-500/20 text-cyan-300",
  freshwater: "bg-emerald-500/20 text-emerald-300",
};

const CATEGORY_IMAGES: Record<string, string> = {
  offshore: "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=600",
  reef: "https://images.pexels.com/photos/1591938/pexels-photo-1591938.jpeg?auto=compress&cs=tinysrgb&w=600",
  estuary: "https://images.pexels.com/photos/3048522/pexels-photo-3048522.jpeg?auto=compress&cs=tinysrgb&w=600",
  inshore: "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=600",
  freshwater: "https://images.pexels.com/photos/5200238/pexels-photo-5200238.jpeg?auto=compress&cs=tinysrgb&w=600",
};

export function ExperiencesForYouClient({ experiences }: { experiences: ParsedExperience[] }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return null;

  const dreamFish = user.unsafeMetadata?.dreamFish as string | undefined;

  // Filter to experiences that match dreamFish, then fill to min 4 from remainder
  let matched = dreamFish
    ? experiences.filter(e => e.speciesSlugs.includes(dreamFish))
    : [];

  if (matched.length < 4) {
    const rest = experiences.filter(e => !matched.includes(e));
    matched = [...matched, ...rest].slice(0, 6);
  } else {
    matched = matched.slice(0, 6);
  }

  if (matched.length === 0) return null;

  return (
    <section>
      <div className="mb-4">
        <div className="h-1 w-12 bg-[#C99A3E] rounded mb-3" />
        <h2 className="text-2xl font-bold text-[#C99A3E]">Experiences you might like</h2>
        <p className="text-sm text-slate-500 mt-1">Based on your favourite fish.</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
        {matched.map(exp => {
          const imgUrl = CATEGORY_IMAGES[exp.category] ?? CATEGORY_IMAGES.offshore;
          const badgeColor = CATEGORY_COLORS[exp.category] ?? "bg-white/10 text-white/60";
          return (
            <Link
              key={exp.slug}
              href={`/trips/new?experience=${exp.slug}`}
              className="snap-start shrink-0 w-64 relative rounded-2xl overflow-hidden group block"
              style={{ minHeight: "180px" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${imgUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="relative z-10 p-4 flex flex-col h-full justify-end" style={{ minHeight: "180px" }}>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit mb-2 ${badgeColor}`}>
                  {exp.category}
                </span>
                <p className="text-white font-bold text-sm leading-tight mb-1">{exp.name}</p>
                <p className="text-[#C99A3E] text-xs font-semibold group-hover:text-[#D9B15E] transition-colors">
                  Plan this trip →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
