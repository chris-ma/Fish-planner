import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "Fishing with a Light Footprint",
  description:
    "Catch-and-release technique, bag limits, reef and seagrass protection, marine sanctuary zones, and lead-free tackle — how to fish sustainably.",
  alternates: { canonical: "/editorial/environmental-impact" },
};

export default function EnvironmentalImpactPage() {
  return (
    <div className="min-h-screen bg-[#0B1D2A]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
            <Leaf className="h-5 w-5 text-emerald-400" />
          </div>
          <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">Community</span>
        </div>

        <h1 className="text-4xl font-bold text-[#F2EDE2] mb-4 leading-tight">
          Fishing with a light footprint
        </h1>
        <p className="text-white/60 text-lg mb-12 leading-relaxed">
          How to keep doing what we love for the next generation.
        </p>

        <div className="space-y-12 text-white/75 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-[#F2EDE2] mb-4">Catch and release done right</h2>
            <p className="mb-3">
              Releasing a fish properly takes about twenty seconds — done poorly it can take days off its life. Keep the fish in the water as much as possible. Wet your hands before handling. Remove the hook with needle-nose pliers or a dehooker without squeezing the body. If you must lift, support the belly and keep it horizontal. Never hold a fish vertically by the jaw unless you intend to keep it.
            </p>
            <p>
              For deep-hooked fish that are bleeding heavily, a clean kill and responsible consumption is often the kinder option over releasing a fish that won't survive. The most sustainable release is a healthy one.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F2EDE2] mb-4">Bag limits are a floor, not a target</h2>
            <p className="mb-3">
              Legal bag limits are set to prevent collapse — they aren't a challenge to hit. On a good day you might reach your limit of bream in an hour. Ask yourself whether you actually need that many fish. A bag of four feeds a family; twelve fills a freezer that you'll forget about.
            </p>
            <p>
              Take what you'll eat fresh. Release the rest. The fish you put back today is the fish someone else catches next season.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F2EDE2] mb-4">Reef and seagrass damage</h2>
            <p className="mb-3">
              Anchoring on reef is one of the most destructive things a recreational boat can do. Coral that took decades to grow can be destroyed in minutes by a dragging anchor. If you're fishing in reef country, use a GPS anchor (Spot-Lock), drift-fish, or find a sandy patch nearby.
            </p>
            <p>
              Seagrass meadows are nurseries for bream, flathead, whiting, and prawns. Running a tinnie through shallow seagrass at speed tears up beds that support the estuary ecosystem your fishing depends on. Pole through, use an electric motor, or walk the flats.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F2EDE2] mb-4">Marine parks and sanctuary zones</h2>
            <p className="mb-3">
              Australia has an extensive network of marine protected areas. Green zones (sanctuary zones) are no-take — no fishing, no collecting, no spearfishing. These aren't obstacles; they're the healthy populations that replenish the areas you're allowed to fish.
            </p>
            <p>
              Download the relevant state marine parks app before you head out. Ignorance of zone boundaries isn't a defence — and fines run into the thousands.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F2EDE2] mb-4">Litter and microplastics</h2>
            <p className="mb-3">
              Lost fishing line kills birds and entangles marine life for years. Cut line should go in your pocket, then in the bin at the ramp. Most boat ramps and fishing spots now have monofilament recycling bins — use them.
            </p>
            <p>
              Soft plastic lures are a growing concern. The industry is developing biodegradable alternatives, but for now: don't leave them on the bottom when snagged. If you can feel the snag, a line-tugging technique will often free it without losing the lure. If it's gone, it's gone — accept the loss and move on.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F2EDE2] mb-4">Lead weights</h2>
            <p>
              Lead sinkers and jig heads are toxic to waterways. Bismuth, tin, and tungsten alternatives are available at most tackle shops. They're more expensive but they don't leach into the sediment. If you fish in freshwater regularly — especially highland lakes — making the switch matters more than you'd think.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
