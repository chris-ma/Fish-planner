import Link from "next/link";
import { Compass, Fish, Package, Map, Users, ArrowRight, Anchor } from "lucide-react";
import { VideoParallaxHero } from "@/components/layout/VideoParallaxHero";
import { IntentSearch } from "@/components/discovery/IntentSearch";
import { AustraliaMap } from "@/components/home/AustraliaMap";
import { FeaturedFishClient } from "@/components/home/FeaturedFishClient";
import { NearbyRegionsClient } from "@/components/home/NearbyRegionsClient";
import { ExperiencesForYouClient } from "@/components/home/ExperiencesForYouClient";
import { OnTheBiteClient } from "@/components/home/OnTheBiteClient";
import { getTopRegionsForMonth } from "@/lib/queries/regions";
import { getInSeasonSpecies } from "@/lib/queries/species";
import { getExperiences } from "@/lib/queries/experiences";
import { db } from "@/db";
import { species } from "@/db/schema";
import { currentMonth, MONTH_NAMES_FULL } from "@/lib/utils/season";
import { getSpeciesImage, getZoneImage } from "@/lib/images";
import { CHALLENGES } from "@/lib/challenges";

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

const BREAD_AND_BUTTER = [
  { slug: "bream",               commonName: "Bream",            category: "estuary" },
  { slug: "flathead",            commonName: "Flathead",         category: "estuary" },
  { slug: "whiting",             commonName: "Whiting",          category: "estuary" },
  { slug: "king-george-whiting", commonName: "KG Whiting",       category: "inshore" },
  { slug: "australian-bass",     commonName: "Australian Bass",  category: "freshwater" },
  { slug: "tailor",              commonName: "Tailor",           category: "inshore" },
  { slug: "mulloway",            commonName: "Mulloway",         category: "estuary" },
  { slug: "black-drummer",       commonName: "Black Drummer",    category: "inshore" },
];


export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const month = params.month ? parseInt(params.month) : currentMonth();

  const [topRegions, inSeasonSpecies, allExperiences, allSpeciesForMap] = await Promise.all([
    getTopRegionsForMonth(month, 6),
    getInSeasonSpecies(month, 16),
    getExperiences(),
    db.select({ slug: species.slug, commonName: species.commonName }).from(species),
  ]);

  const speciesNameMap: Record<string, string> = Object.fromEntries(allSpeciesForMap.map(s => [s.slug, s.commonName]));
  const parsedExperiences = allExperiences.map(exp => ({
    ...exp,
    speciesSlugs: JSON.parse(exp.targetSpeciesSlugs) as string[],
    speciesNames: (JSON.parse(exp.targetSpeciesSlugs) as string[]).map(s => speciesNameMap[s] ?? s),
  }));

  return (
    <div>
      {/* Hero with parallax video */}
      <VideoParallaxHero>
        <span className="inline-block bg-[#0D9488]/20 border border-[#0D9488]/40 text-[#0D9488] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
          The fishing trip planner
        </span>
        <h1 className="text-5xl md:text-7xl font-bold text-[#F5F0E8] mb-5 leading-tight tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Plan the trip.<br />Not just the idea.
        </h1>
        <p className="text-white/65 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
          Giant trevally on the flats, barramundi in the mangroves, or bream in your local estuary —
          find the experience, build the plan, fish with your crew.
        </p>
        <IntentSearch />
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Link href="/trips/new">
            <button className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Start Planning <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link href="/plan">
            <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors border border-white/20 text-sm backdrop-blur-sm">
              Explore Experiences
            </button>
          </Link>
        </div>
      </VideoParallaxHero>

      {/* Platform value strip */}
      <div className="bg-[#020B14] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-[#0D9488]/15 border border-[#0D9488]/20 flex items-center justify-center mb-3">
              <Compass className="h-5 w-5 text-[#0D9488]" />
            </div>
            <p className="text-white font-semibold text-sm">Discover</p>
            <p className="text-white/40 text-xs mt-1 leading-relaxed hidden sm:block">Curated fishing experiences for every target species and style</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-[#0D9488]/15 border border-[#0D9488]/20 flex items-center justify-center mb-3">
              <Map className="h-5 w-5 text-[#0D9488]" />
            </div>
            <p className="text-white font-semibold text-sm">Plan</p>
            <p className="text-white/40 text-xs mt-1 leading-relaxed hidden sm:block">Species, gear, logistics and dates — all in one shared doc</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-[#0D9488]/15 border border-[#0D9488]/20 flex items-center justify-center mb-3">
              <Anchor className="h-5 w-5 text-[#0D9488]" />
            </div>
            <p className="text-white font-semibold text-sm">Book a Guide</p>
            <p className="text-white/40 text-xs mt-1 leading-relaxed hidden sm:block">Expert local operators for guided charter experiences</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 pb-16 space-y-16">

        {/* Featured fish — personalized for logged-in users */}
        <FeaturedFishClient month={month} monthName={MONTH_NAMES_FULL[month]} />

        {/* Experiences personalised to dreamFish */}
        <ExperiencesForYouClient experiences={parsedExperiences} />

        {/* Section A: What's in a trip plan — moved up so new users understand the value early */}
        <section>
          <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
          <h2 className="text-2xl font-bold text-[#0D9488] mb-2 max-w-xl">
            Everything your trip needs, in one plan.
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

        {/* Seasonal species carousel — personalised to nearby region if available */}
        <section className="pt-8 md:pt-0">
          <OnTheBiteClient fallbackSpecies={inSeasonSpecies} month={month} monthName={MONTH_NAMES_FULL[month]} />
        </section>

        {/* Top Destinations — interactive map */}
        <section>
          <AustraliaMap regions={topRegions} monthName={MONTH_NAMES_FULL[month]} />
        </section>

        {/* Nearby regions — personalized for logged-in users with location */}
        <NearbyRegionsClient month={month} />

        {/* Bread & butter species */}
        <section>
          <div className="mb-2">
            <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
            <h2 className="text-2xl font-bold text-[#0D9488]">The bread &amp; butter</h2>
          </div>
          <p className="text-sm text-slate-500 mb-5 max-w-2xl">
            The species every Aussie angler should tick off.{" "}
            <Link href="/bucket-list" className="text-[#0D9488] hover:underline">
              Start your bucket list →
            </Link>
          </p>
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible">
            {BREAD_AND_BUTTER.map(({ slug, commonName, category }) => {
              const imgUrl = getSpeciesImage(slug, category, 600);
              return (
                <Link
                  key={slug}
                  href="/bucket-list"
                  className="relative rounded-xl overflow-hidden aspect-[3/4] w-36 shrink-0 snap-start md:w-auto group block"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${imgUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-[#0D9488] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      Add to list →
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <p className="text-white text-xs font-semibold line-clamp-2">{commonName}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Fun challenges */}
        <section>
          <div className="mb-4">
            <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
            <h2 className="text-2xl font-bold text-[#0D9488]">Challenge yourself</h2>
          </div>
          <p className="text-sm text-slate-500 mb-6 max-w-2xl">
            Self-imposed rules. No leaderboard, just bragging rights.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CHALLENGES.map(({ slug, title, description, image }) => (
              <Link
                key={slug}
                href={`/challenges/${slug}`}
                className="relative rounded-2xl overflow-hidden aspect-[4/5] group block"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${image})` }}
                />
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0D9488]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-10">
                  <p className="font-bold text-white text-sm mb-1 leading-tight">{title}</p>
                  <p className="text-white/65 text-[11px] leading-relaxed line-clamp-3">{description}</p>
                  <span className="mt-2 inline-block text-[#0D9488] text-[10px] font-semibold group-hover:text-teal-300 transition-colors">
                    View rankings →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link href="/challenges" className="text-[#0D9488] text-sm font-semibold hover:underline">
              View all challenges →
            </Link>
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
                Stop planning across group chats.
              </h2>
              <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto md:mx-0 leading-relaxed">
                One shared link. Destination, species, dates, gear list — everything your crew needs, in one place. No account required.
              </p>
              <Link href="/trips/new">
                <button className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                  Build a Trip Plan
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
