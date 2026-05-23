import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

export default function MentalHealthPage() {
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
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 flex items-center justify-center">
            <Heart className="h-5 w-5 text-rose-400" />
          </div>
          <span className="text-rose-400 text-sm font-semibold uppercase tracking-wider">Community</span>
        </div>

        <h1 className="text-4xl font-bold text-[#F5F0E8] mb-4 leading-tight">
          Fishing, friendship & mental health
        </h1>
        <p className="text-white/60 text-lg mb-12 leading-relaxed">
          Why getting out on the water is about more than the fish.
        </p>

        <div className="space-y-12 text-white/75 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">The science of being near water</h2>
            <p className="mb-3">
              Research from the University of Exeter found that people who spend time near blue space — oceans, rivers, lakes — consistently report lower stress, better mood, and higher life satisfaction than those who don't. Marine biologist Wallace J. Nichols called it "blue mind": the calm, meditative state that water induces in the human brain.
            </p>
            <p>
              You don't need a study to know this. You already know what it feels like to sit at the edge of an estuary at dawn with a rod in your hand and nothing else demanding your attention.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Fishing as active mindfulness</h2>
            <p className="mb-3">
              Mindfulness is a word that gets thrown around a lot, but fishing is one of the oldest forms of it. When you're reading the water — watching for baitfish flickers, feeling for the tick of a bite, adjusting your retrieve — your mind has a single point of focus. The cognitive chatter quiets down.
            </p>
            <p>
              This isn't passive. You're not zoning out. You're in a state of relaxed alertness that's genuinely hard to access in everyday life. It's one of the reasons fishing is used in therapeutic programs for veterans, youth at risk, and people in recovery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">The social ritual of the fishing trip</h2>
            <p className="mb-3">
              Men, in particular, often struggle to maintain friendships in adulthood. The shared activity gives you something to do side-by-side — which makes conversation easier, less confrontational, more honest. Fishing trips are one of the few remaining contexts where it's socially acceptable to spend twelve hours with a mate and barely talk.
            </p>
            <p>
              That's not nothing. In fact, it might be everything. Shared silence in a comfortable context is a sign of deep trust. The conversations that do happen — about work, family, health, worries — often come out naturally when there's no agenda and the phone is out of reach.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Leave-the-phones-in-the-bag rule</h2>
            <p className="mb-3">
              Try this on your next trip: phones go in the dry bag at the start of the day and don't come out until you're back at the ramp. Photos allowed, but scrolling not. You'll be surprised how quickly the group recalibrates — people start noticing things. The pelican working the shallows. The way the light hits the water at 7am. The fact that Dave has been using the wrong knot for fifteen years.
            </p>
            <p>
              The trip doesn't need to be documented to have happened. The best ones often aren't.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Fishing with kids</h2>
            <p className="mb-3">
              Getting a child into fishing is one of the most straightforward ways to give them something that stays with them. It teaches patience — real patience, not waiting-for-a-download patience. It introduces them to food systems in a way that's honest: this is where protein comes from, and it requires effort and attention.
            </p>
            <p>
              More practically, it gives you something to do together that isn't transactional. You're not driving them somewhere or watching them in an activity. You're alongside each other, sharing the same experience, with the same chance of catching nothing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">When it's hard to get out</h2>
            <p>
              If you're going through a rough period — stress, grief, burnout, anxiety — a fishing trip is not the cure, but it's a starting point. Getting out of the house, into nature, with or without company, breaks the inertia that tends to deepen low periods. The river doesn't care what you're going through. It's just there, doing what it does. Sometimes that's exactly what's needed.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
