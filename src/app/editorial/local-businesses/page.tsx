import Link from "next/link";
import { ArrowLeft, Store } from "lucide-react";

export default function LocalBusinessesPage() {
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
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 flex items-center justify-center">
            <Store className="h-5 w-5 text-amber-400" />
          </div>
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Community</span>
        </div>

        <h1 className="text-4xl font-bold text-[#F5F0E8] mb-4 leading-tight">
          Why local businesses matter
        </h1>
        <p className="text-white/60 text-lg mb-12 leading-relaxed">
          The tackle shop, the charter operator, the bait guy at the ramp. These people are the fabric of the fishing community.
        </p>

        <div className="space-y-12 text-white/75 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Book a local charter</h2>
            <p className="mb-3">
              A licensed charter operator knows their patch better than any article you'll read. They know where the fish were yesterday, what the current is doing at the reef, and which bait is working this week. That knowledge is worth more than any sounder or fishing app.
            </p>
            <p>
              When booking, ask whether the operator is a registered commercial fishing licence holder with the relevant state authority. In Queensland that means holding a Vessel Operator Accreditation. In NSW, look for a Charter Fishing Vessel Licence. Operating legally also means they carry appropriate insurance — which protects you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Finding the right guide</h2>
            <p className="mb-3">
              Word of mouth beats Google reviews in the fishing world. Ask in local Facebook fishing groups, at the tackle shop counter, or at the boat ramp. The regulars will point you to the operators who run honest trips.
            </p>
            <p>
              For freshwater fly fishing and light tackle, look for guides affiliated with Australian Trout Guides Association or Freshwater Guides Australia. For offshore pelagics and reef fishing, local fishing clubs often maintain lists of trusted charters.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">The independent tackle shop</h2>
            <p className="mb-3">
              Chain stores have their place for bulk consumables. But the independent tackle shop is where you learn. The person behind the counter fishes the same water you're heading to. They'll tell you what's working, what isn't, and why — something no algorithm can replicate.
            </p>
            <p>
              They also stock local knowledge items: the lure colour that's been killing flathead in the estuary this season, the correct running depth for the local rip, the bait that's been scarce because the supplier has been out. Buy something when you ask for advice. It keeps the lights on.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Respecting charter guides</h2>
            <p className="mb-3">
              A charter is not just a service. The guide is responsible for your safety, their vessel, and the reputation of their business. Follow their instructions on the water — especially around safety equipment, fish handling, and fishing technique. If they ask you to put down the rod, put it down.
            </p>
            <p>
              Tipping is not as common in Australia as it is in the US, but on a charter that goes above and beyond — a guide who runs an extra hour to keep you on fish, or who ices down your catch perfectly — a gesture of cash appreciation is always noticed and always remembered.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">The bait shop and the ramp operator</h2>
            <p className="mb-3">
              The person running the bait shop at 4am, the ramp operator collecting launch fees, the caravan park right by the estuary — these businesses exist because of fishing. When they're gone, the infrastructure around the sport starts to hollow out.
            </p>
            <p>
              Paying ramp fees matters. Supporting the small caravan park over the big chain resort matters. Buying your ice and bait locally rather than from the servo on the highway matters. These are small choices that add up.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Leave a review that helps</h2>
            <p>
              A good review for a charter or tackle shop is worth more than any paid ad. Be specific: what you caught, how the guide handled the day, whether the gear was well-maintained. Bad reviews happen — if something went genuinely wrong, say so honestly but fairly. The best operators in this industry have built their reputation on trust, not on gaming search results.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
