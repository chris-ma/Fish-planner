import { ArrowRight, Fish, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { VideoParallaxHero } from "@/components/layout/VideoParallaxHero";
import { HeroSearch } from "@/components/discovery/HeroSearch";
import { RegionCard } from "@/components/discovery/RegionCard";
import { SpeciesCard } from "@/components/discovery/SpeciesCard";
import { listRegions, getTopRegionsForMonth } from "@/lib/queries/regions";
import { listSpecies, getInSeasonSpecies } from "@/lib/queries/species";
import { currentMonth, MONTH_NAMES_FULL } from "@/lib/utils/season";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const month = params.month ? parseInt(params.month) : currentMonth();

  const [allSpecies, allRegions, topRegions, inSeasonSpecies] = await Promise.all([
    listSpecies(),
    listRegions(),
    getTopRegionsForMonth(month, 6),
    getInSeasonSpecies(month, 8),
  ]);

  const speciesList = allSpecies.map((s) => ({ slug: s.slug, commonName: s.commonName }));
  const regionList = allRegions.map((r) => ({ slug: r.slug, name: r.name, state: r.state }));

  return (
    <div>
      {/* Hero with parallax video */}
      <VideoParallaxHero>
        <h1 className="text-5xl md:text-6xl font-bold text-[#F5F0E8] mb-4 leading-tight">
          Find Your<br />Perfect Catch.
        </h1>
        <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          Find the best time and place to target any species across Australia — then plan the whole trip with your crew.
        </p>
        <div className="flex justify-center w-full">
          <HeroSearch speciesList={speciesList} regionList={regionList} />
        </div>
      </VideoParallaxHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 pb-16 space-y-16">
        {/* In Season Now */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-[#040F1C]">In Season — {MONTH_NAMES_FULL[month]}</h2>
            <div className="flex gap-2 flex-wrap justify-end">
              {[10, 11, 12, 1, 2, 3].map((m) => (
                <Link
                  key={m}
                  href={`/?month=${m}`}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    m === month
                      ? "bg-[#06B6D4] text-white border-[#06B6D4]"
                      : "text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m]}
                </Link>
              ))}
            </div>
          </div>

          {inSeasonSpecies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {inSeasonSpecies.map((sp) => (
                <SpeciesCard key={sp.id} species={sp} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 py-8 text-center">No season data loaded yet.</p>
          )}
        </section>

        {/* Top Regions This Month */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-[#040F1C]">Top Regions — {MONTH_NAMES_FULL[month]}</h2>
            <Link href="/" className="text-sm text-[#0891B2] hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {topRegions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {topRegions.map((region) => (
                <RegionCard key={region.id} region={region} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 py-8 text-center">No region data loaded yet.</p>
          )}
        </section>

        {/* How it works */}
        <section className="bg-[#040F1C] rounded-3xl p-10 text-white">
          <h2 className="text-2xl font-bold mb-10 text-center text-[#F5F0E8]">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Fish, title: "1. Choose your target", desc: "Pick a species or a location. See the best months and regions based on real seasonal data." },
              { icon: Calendar, title: "2. Find the window", desc: "Our monthly calendar shows peak, good, fair, and poor ratings for every combination." },
              { icon: MapPin, title: "3. Plan the trip", desc: "Create a shared trip workspace, add bookings, generate a gear list, and invite your crew." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-[#06B6D4]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
