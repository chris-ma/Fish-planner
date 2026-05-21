import { Suspense } from "react";
import { ArrowRight, Fish, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { HeroSearch } from "@/components/discovery/HeroSearch";
import { RegionCard } from "@/components/discovery/RegionCard";
import { SpeciesCard } from "@/components/discovery/SpeciesCard";
import { listRegions } from "@/lib/queries/regions";
import { listSpecies, getInSeasonSpecies } from "@/lib/queries/species";
import { getTopRegionsForMonth } from "@/lib/queries/regions";
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
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-950 to-blue-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-700/50 rounded-full px-4 py-1.5 text-sm mb-6">
            <Fish className="h-4 w-4" />
            Australian East Coast Fishing Planner
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Plan your trip around<br />the fishing, not the calendar.
          </h1>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Find the best time and place to target any species on the east coast — then plan the whole trip with your crew.
          </p>
          <div className="flex justify-center">
            <HeroSearch speciesList={speciesList} regionList={regionList} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {/* In Season Now */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">In Season — {MONTH_NAMES_FULL[month]}</h2>
              <p className="text-sm text-slate-500 mt-1">Species with good or peak ratings this month</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {[10, 11, 12, 1, 2, 3].map((m) => (
                <Link
                  key={m}
                  href={`/?month=${m}`}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    m === month
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m]}
                </Link>
              ))}
            </div>
          </div>

          {inSeasonSpecies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {inSeasonSpecies.map((sp) => (
                <SpeciesCard key={sp.id} species={sp} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 py-8 text-center">No season data loaded yet — add your Turso credentials and run the seed script.</p>
          )}
        </section>

        {/* Top Regions This Month */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Top Regions — {MONTH_NAMES_FULL[month]}</h2>
              <p className="text-sm text-slate-500 mt-1">Ranked by overall species activity</p>
            </div>
            <Link href="/" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              All regions <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {topRegions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topRegions.map((region) => (
                <RegionCard key={region.id} region={region} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 py-8 text-center">No region data loaded yet — run the seed script to populate.</p>
          )}
        </section>

        {/* How it works */}
        <section className="bg-slate-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Fish, title: "1. Choose your target", desc: "Pick a species or a location. See the best months and regions based on real seasonal data." },
              { icon: Calendar, title: "2. Find the window", desc: "Our monthly calendar shows peak, good, fair, and poor ratings for every combination." },
              { icon: MapPin, title: "3. Plan the trip", desc: "Create a shared trip workspace, add bookings, generate a gear list, and invite your crew." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
