// Reads searchParams (month override) and fetches live experience data on every
// request — already implicitly dynamic, made explicit here for clarity.
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Fish, Package, Map, Users, ArrowRight, Anchor } from "lucide-react";
import { VideoParallaxHero } from "@/components/layout/VideoParallaxHero";
import { IntentSearch } from "@/components/discovery/IntentSearch";
import { FeaturedFishClient } from "@/components/home/FeaturedFishClient";
import { NearbyRegionsClient } from "@/components/home/NearbyRegionsClient";
import { ExperiencesForYouClient } from "@/components/home/ExperiencesForYouClient";
import { FeatureRow } from "@/components/home/FeatureRow";
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

interface BreadAndButterSpecies {
  slug: string;
  commonName: string;
  category: string;
  whyTrophy: string;
}

const BREAD_AND_BUTTER: BreadAndButterSpecies[] = [
  { slug: "bream", commonName: "Bream", category: "estuary",
    whyTrophy: "Bream inspect a lure for five seconds before deciding it's a fraud. Yellowfin are the most-caught sportfish in the country — black bream rarely leave their home water, and knowing that water is the only edge you'll get." },
  { slug: "flathead", commonName: "Flathead", category: "estuary",
    whyTrophy: "Ambush predators buried in sand and weed, flathead reward soft plastics worked slow and low. The 3 Meter Flatty challenge exists because one big dusky can outfight fish twice its class." },
  { slug: "whiting", commonName: "Whiting", category: "estuary",
    whyTrophy: "Sand whiting won't forgive sloppy bait presentation — light leader, worms or prawns, and a drift over the right sand flat. Small mouths, hard fight, better eating." },
  { slug: "king-george-whiting", commonName: "KG Whiting", category: "inshore",
    whyTrophy: "South Australia's premier table fish. KGs school tight on sandy flats and demand a delicate touch with tube worms or squid strips — peak season runs October to January, and miss it, you're waiting a year." },
  { slug: "australian-bass", commonName: "Australian Bass", category: "freshwater",
    whyTrophy: "Coastal river royalty. Bass spawn in the salt then push back upstream to smash surface lures at dawn — spring and autumn topwater strikes are as good as freshwater fishing gets." },
  { slug: "tailor", commonName: "Tailor", category: "inshore",
    whyTrophy: "Tailor arrive in frenzied schools and hit metal slugs like they're being timed. Autumn-winter migrations turn beaches and river mouths into a blitz — fast hands, sharp hooks, no second chances." },
  { slug: "mulloway", commonName: "Mulloway", category: "estuary",
    whyTrophy: "The holy grail of NSW estuary fishing. Big mulloway haunt deep holes and bridge pylons and mostly show themselves after dark — live bait, patience, and a healthy respect for what's about to happen." },
  { slug: "black-drummer", commonName: "Black Drummer", category: "inshore",
    whyTrophy: "Also called silver drummer, these surge-zone brawlers can exceed 5kg and unload long, punishing runs off exposed rock platforms. Underrated on the table, unforgiving on light tackle." },
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const month = params.month ? parseInt(params.month) : currentMonth();

  const [allExperiences, allSpeciesForMap] = await Promise.all([
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-16">

        {/* Featured fish — personalized for logged-in users */}
        <FeaturedFishClient month={month} monthName={MONTH_NAMES_FULL[month]} />

        {/* Experiences personalised to dreamFish */}
        <ExperiencesForYouClient experiences={parsedExperiences} />

        {/* Section A: What's in a trip plan — moved up so new users understand the value early */}
        <section>
          <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
          <h2 className="text-xl font-bold text-[#0D9488] mb-2 max-w-xl [font-family:var(--font-inter)]">
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
          <div className="space-y-3">
            {BREAD_AND_BUTTER.map(({ slug, commonName, category, whyTrophy }) => (
              <FeatureRow
                key={slug}
                href="/bucket-list"
                image={getSpeciesImage(slug, category, 600)}
                imageAlt={commonName}
                title={commonName}
                body={whyTrophy}
                cta="Add to list →"
              />
            ))}
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
          <div className="space-y-3">
            {CHALLENGES.map(({ slug, title, description, image }) => (
              <FeatureRow
                key={slug}
                href={`/challenges/${slug}`}
                image={image}
                imageAlt={title}
                title={title}
                body={description}
                cta="View rankings →"
              />
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
