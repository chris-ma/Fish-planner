import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Utensils } from "lucide-react";

export const metadata: Metadata = {
  title: "Catch, Cook & Sustainability",
  description:
    "Which species are good to eat, why minimum sizes matter, proper bleeding and icing technique, and how to responsibly handle invasive carp and redfin.",
  alternates: { canonical: "/editorial/sustainability" },
};

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-[#020B14]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-600/20 flex items-center justify-center">
            <Utensils className="h-5 w-5 text-green-400" />
          </div>
          <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">Community</span>
        </div>

        <h1 className="text-4xl font-bold text-[#F5F0E8] mb-4 leading-tight">
          Catch, cook & sustainability
        </h1>
        <p className="text-white/60 text-lg mb-12 leading-relaxed">
          Eating what you catch is an act of respect — if you do it right.
        </p>

        <div className="space-y-12 text-white/75 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Which species are good to eat?</h2>
            <p className="mb-3">
              Most Australian recreational target species are excellent eating when handled correctly. Flathead, bream, whiting, snapper, coral trout, and barramundi are all superb table fish. Mulloway (jewfish) is underrated. Tailor is best eaten the same day.
            </p>
            <p className="mb-3">
              Species to approach more carefully: yellowfin tuna is excellent sashimi-grade but can carry mercury in large specimens — limit consumption of very large fish. Shark and large mackerel accumulate mercury over their lifespan; regular large servings are not recommended for pregnant women or young children.
            </p>
            <p>
              Carp and redfin (European perch) are invasive in Australian freshwater systems. Keeping and eating them is actively encouraged — it's one of the few cases where your catch directly helps the ecosystem you're fishing in.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Minimum sizes — why they matter</h2>
            <p className="mb-3">
              Minimum legal sizes are set to ensure fish have spawned at least once before they're taken. A bream below 25cm hasn't yet contributed to the next generation. Returning undersized fish is not just a legal requirement — it's the most effective single thing you can do to maintain healthy populations.
            </p>
            <p>
              Carry a measuring device on board. A length measure printed on your tackle box lid, or a bump board, takes three seconds to use. Don't eyeball it — especially with species close to the minimum.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Bleeding and icing: quality starts at the water</h2>
            <p className="mb-3">
              A poorly handled fish that's been flopping in a live well for two hours is worth half the eating quality of a fish that was bled immediately and put straight onto ice. The process is simple: spike or cut the gills (a brain spike kills the fish instantly and humanely), let it bleed into the water for thirty seconds, then pack into an ice slurry — not just ice, but ice and water in roughly equal amounts so the fish is surrounded by cold, not just sitting on it.
            </p>
            <p>
              An ice slurry drops the fish's core temperature in minutes. This stops the enzymes that break down flesh texture and dramatically extends freshness. Fish handled this way will still be excellent three days later; fish not handled this way often won't be good the next morning.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Invasive species: carp and redfin</h2>
            <p className="mb-3">
              European carp are one of the most destructive invasive species in Australian freshwater. They root through the bottom, cloud the water, and collapse the aquatic plant systems that native fish depend on. In most states, it is illegal to return a carp to the water once caught — they must be killed and disposed of on land.
            </p>
            <p className="mb-3">
              Carp are actually excellent eating if treated like any other fish — bled immediately, iced well, and skinned (not scaled) before cooking. Eastern European and Chinese cuisines have cooked carp for centuries. Don't waste them.
            </p>
            <p>
              Redfin (European perch) carry the epizootic haematopoietic necrosis (EHN) virus, which is lethal to native perch species. Do not transfer water or equipment between catchments — the virus spreads this way. Kill and dispose of all redfin.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Seasonal closures and spawning</h2>
            <p className="mb-3">
              Many species have seasonal closures or size restrictions that coincide with spawning periods. Murray cod are protected during their spawning season (September to November in most states). Barramundi have seasonal closures in northern fisheries. Snapper in some south-eastern zones have annual closures.
            </p>
            <p>
              Check your state's fisheries website before each trip, particularly if you're fishing outside your home area. Regulations change — sometimes significantly — and what was legal last year may not be this year.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Camp cooking and the fish on the fire</h2>
            <p>
              Eating fish you've caught, cooked over a camp fire or on a gas stove on the back of the boat, is one of the most satisfying things you can do in this sport. Keep it simple: barramundi fillets with butter, salt, and lime on a camp fire grill. Whiting whole-bodied in the coals. Flathead fish tacos with cabbage slaw and lime crema on a tailgate. The fish has never been fresher. Nothing compares.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
