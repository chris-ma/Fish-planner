import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { VideoParallaxHero } from "@/components/layout/VideoParallaxHero";
import { IntentSearch } from "@/components/discovery/IntentSearch";
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
          Know Where<br />the Bite Is.
        </h1>
        <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
          Seasonal forecasts and expert tactics for 49 species across 100+ Australian locations.
        </p>
        <div className="flex justify-center w-full">
          <IntentSearch speciesList={speciesList} regionList={regionList} />
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
                      ? "bg-[#0D9488] text-white border-[#0D9488]"
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

      </div>
    </div>
  );
}
