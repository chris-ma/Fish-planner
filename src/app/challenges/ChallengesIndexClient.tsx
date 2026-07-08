import Link from "next/link";
import type { ChallengeConfig } from "@/lib/challenges";

type Leader = { catcherName: string; metric: number; unit: string } | null;
export type EnrichedChallenge = ChallengeConfig & { entryCount: number; leader: Leader };

export default function ChallengesIndexClient({ challenges }: { challenges: EnrichedChallenge[] }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="h-1 w-12 bg-[#C99A3E] rounded mb-3" />
        <h2 className="text-3xl font-bold text-[#C99A3E]">Challenges</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Self-imposed rules. No prizes, just bragging rights — and a public leaderboard.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {challenges.map((c) => (
          <Link key={c.slug} href={`/challenges/${c.slug}`} className="group block">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${c.image})` }}
              />
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#C99A3E]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-10">
                <p className="font-bold text-white text-sm mb-1 leading-tight">{c.title}</p>
                <p className="text-white/65 text-[11px] leading-relaxed line-clamp-2 mb-2">{c.description}</p>
                {c.leader && (
                  <div className="mb-2">
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 inline-block">
                      🏆 {c.leader.catcherName} — {c.leader.metric} {c.leader.unit}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-[10px]">
                    {c.entryCount} {c.entryCount === 1 ? "entry" : "entries"}
                  </span>
                  <span className="text-[#C99A3E] text-[10px] font-semibold group-hover:text-[#D9B15E] transition-colors">
                    View Rankings →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
