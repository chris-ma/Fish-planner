import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "About Fish Tripper",
  description:
    "Fish Tripper helps anglers plan smarter fishing trips — the right destination, the right species, the right gear, and a crew that's actually aligned.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
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
          <div className="w-10 h-10 rounded-xl bg-[#0D9488]/20 flex items-center justify-center">
            <Compass className="h-5 w-5 text-[#0D9488]" />
          </div>
          <span className="text-[#0D9488] text-sm font-semibold uppercase tracking-wider">About</span>
        </div>

        <h1 className="text-4xl font-bold text-[#F5F0E8] mb-4 leading-tight">
          Plan the trip, not just the idea
        </h1>
        <p className="text-white/60 text-lg mb-12 leading-relaxed">
          Fish Tripper exists because "we should do that sometime" is where most good fishing trips die.
        </p>

        <div className="space-y-12 text-white/75 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">What we do</h2>
            <p className="mb-3">
              Fish Tripper is a trip planning platform for recreational anglers. We bring together seasonal
              species data, destination guides, gear recommendations, and guided charter operators in one
              place — so building a trip takes minutes, not a dozen open browser tabs and a group chat that
              never quite lands on a date.
            </p>
            <p>
              Pick a species or a destination, see when it's actually on, build a shared plan, and invite your
              crew with one link. No account required to get started.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Why we built it</h2>
            <p>
              The best fishing trips aren't accidents. Someone picked the right month, knew the species and
              technique, sorted the gear list, and kept the crew out of four different group chats. That's the
              difference between a plan and a "we should do that sometime" — and it shouldn't take a spreadsheet
              to get there.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#F5F0E8] mb-4">Get in touch</h2>
            <p>
              Questions, feedback, or want to list your charter business?{" "}
              <Link href="/contact" className="text-[#0D9488] hover:underline">
                Reach out here
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
