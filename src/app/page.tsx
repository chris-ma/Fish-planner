import Link from "next/link";
import { Compass, Fish, Package, Map, Users, ArrowRight } from "lucide-react";
import { VideoParallaxHero } from "@/components/layout/VideoParallaxHero";
import { IntentSearch } from "@/components/discovery/IntentSearch";
import { RegionCard } from "@/components/discovery/RegionCard";
import { SpeciesCard } from "@/components/discovery/SpeciesCard";
import { getTopRegionsForMonth } from "@/lib/queries/regions";
import { getInSeasonSpecies } from "@/lib/queries/species";
import { currentMonth, MONTH_NAMES_FULL } from "@/lib/utils/season";
import { getZoneImage } from "@/lib/images";

const TRIP_FEATURES = [
  {
    Icon: Compass,
    title: "Destination",
    description: "Where to go, when to go, and what species are active.",
    image: getZoneImage("far_north_qld", 600),
  },
  {
    Icon: Fish,
    title: "Target Species",
    description: "Best months, techniques, tackle and local patterns.",
    image: getZoneImage("wa_kimberley", 600),
  },
  {
    Icon: Package,
    title: "Gear Checklist",
    description: "Rods, reels, line, leaders, lures and packing lists.",
    image: getZoneImage("nsw", 600),
  },
  {
    Icon: Map,
    title: "Logistics",
    description: "Access, accommodation, boat ramps, fuel and permits.",
    image: getZoneImage("nt_top_end", 600),
  },
  {
    Icon: Users,
    title: "Crew",
    description: "Invite mates, assign tasks, and keep everyone aligned.",
    image: getZoneImage("alpine", 600),
  },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const month = params.month ? parseInt(params.month) : currentMonth();

  const [topRegions, inSeasonSpecies] = await Promise.all([
    getTopRegionsForMonth(month, 6),
    getInSeasonSpecies(month, 8),
  ]);

  return (
    <div>
      {/* Hero with parallax video */}
      <VideoParallaxHero>
        <h1 className="text-5xl md:text-7xl font-bold text-[#F5F0E8] mb-5 leading-tight tracking-tight">
          Plan the trip.<br />Not just the idea.
        </h1>
        <p className="text-white/65 text-lg md:text-xl mb-10 max-w-sm mx-auto leading-relaxed">
          Find your spot, choose your species,<br className="hidden md:block" />
          and share the plan with your crew.
        </p>
        <IntentSearch />
      </VideoParallaxHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 pb-16 space-y-16">
        {/* Where to Plan This Month */}
        <section>
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-[#040F1C]">Where to Plan in {MONTH_NAMES_FULL[month]}</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5 max-w-2xl">
            Species at peak season this month — find the best destinations to target them.
          </p>

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

        {/* Top Destinations This Month */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-[#040F1C]">Top Destinations — {MONTH_NAMES_FULL[month]}</h2>
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

        {/* Section A: What's in a trip plan */}
        <section>
          <h2 className="text-2xl font-bold text-[#040F1C] mb-2">
            Everything your fishing trip needs in one shared plan.
          </h2>
          <p className="text-sm text-slate-500 mb-6 max-w-2xl">
            From destination research to gear packing and crew coordination.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {TRIP_FEATURES.map(({ Icon, title, description, image }) => (
              <div key={title} className="relative rounded-2xl overflow-hidden aspect-[3/4] flex flex-col justify-end">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <div className="relative z-10 p-4">
                  <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center mb-2">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="font-bold text-sm text-white mb-1">{title}</p>
                  <p className="text-xs text-white/60 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section B: Plan with your crew */}
        <section className="relative rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url('${getZoneImage("southeast_qld", 1200)}')` }}
          />
          <div className="absolute inset-0 bg-[#020B14]/85" />

          <div className="relative z-10 px-8 py-12 md:px-12 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-[#F5F0E8] mb-3">
                Plan with your crew, not across scattered group chats.
              </h2>
              <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto md:mx-0 leading-relaxed">
                Share the destination, species, dates, gear list and logistics in one place.
                No account needed — just create a plan and send the link.
              </p>
              <Link href="/trips/new">
                <button className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                  Create Shared Trip
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            <div className="w-full md:w-72 bg-[#0D1B2A]/90 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shrink-0 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[#F5F0E8] font-bold text-sm">Cape York GT Mission</p>
                  <p className="text-white/40 text-xs mt-0.5">Far North QLD · Oct 2025</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 uppercase tracking-wide shrink-0">
                  Planning
                </span>
              </div>
              <div className="flex items-center gap-2">
                {["J", "S", "T"].map((initial) => (
                  <div
                    key={initial}
                    className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-xs font-bold text-white"
                  >
                    {initial}
                  </div>
                ))}
                <span className="text-xs text-white/40 ml-1">+ 2 more</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <p className="text-xs text-white/40">Open decision</p>
                <p className="text-xs text-amber-400 mt-0.5 font-medium">Charter booked? — open</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
