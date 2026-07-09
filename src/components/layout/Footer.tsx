import Link from "next/link";
import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div
              className="flex items-center gap-2 font-black text-white mb-3"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-ocean-500">
                <Compass className="h-3.5 w-3.5 text-[#0B1D2A]" />
              </span>
              Fish Tripper 🌊
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Plan smarter fishing trips with your crew.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-white/80">Regions</h4>
            <ul className="space-y-2 text-xs text-white/50">
              <li>
                <Link href="/regions/cairns" className="hover:text-white/90 transition-colors">
                  Cairns
                </Link>
              </li>
              <li>
                <Link href="/regions/sydney" className="hover:text-white/90 transition-colors">
                  Sydney
                </Link>
              </li>
              <li>
                <Link href="/regions/hervey-bay" className="hover:text-white/90 transition-colors">
                  Hervey Bay
                </Link>
              </li>
              <li>
                <Link href="/regions/brisbane-moreton-bay" className="hover:text-white/90 transition-colors">
                  Brisbane
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-white/80">Species</h4>
            <ul className="space-y-2 text-xs text-white/50">
              <li>
                <Link href="/species/spanish-mackerel" className="hover:text-white/90 transition-colors">
                  Spanish Mackerel
                </Link>
              </li>
              <li>
                <Link href="/species/barramundi" className="hover:text-white/90 transition-colors">
                  Barramundi
                </Link>
              </li>
              <li>
                <Link href="/species/yellowtail-kingfish" className="hover:text-white/90 transition-colors">
                  Kingfish
                </Link>
              </li>
              <li>
                <Link href="/species/black-marlin" className="hover:text-white/90 transition-colors">
                  Black Marlin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-white/80">Plan</h4>
            <ul className="space-y-2 text-xs text-white/50">
              <li>
                <Link href="/trips/new" className="hover:text-white/90 transition-colors">
                  Create a Trip
                </Link>
              </li>
              <li>
                <Link href="/gear" className="hover:text-white/90 transition-colors">
                  Gear Guide
                </Link>
              </li>
              <li>
                <Link href="/bucket-list" className="hover:text-white/90 transition-colors">
                  Bucket List
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="hover:text-white/90 transition-colors">
                  Challenges
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-white/80">Community</h4>
            <ul className="space-y-2 text-xs text-white/50">
              <li>
                <Link href="/editorial/environmental-impact" className="hover:text-white/90 transition-colors">
                  Environmental Impact
                </Link>
              </li>
              <li>
                <Link href="/editorial/local-businesses" className="hover:text-white/90 transition-colors">
                  Local Businesses
                </Link>
              </li>
              <li>
                <Link href="/editorial/mental-health" className="hover:text-white/90 transition-colors">
                  Fishing &amp; Mental Health
                </Link>
              </li>
              <li>
                <Link href="/editorial/sustainability" className="hover:text-white/90 transition-colors">
                  Catch &amp; Sustainability
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col items-center gap-3 text-xs text-white/30 text-center">
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white/60 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white/60 transition-colors">Contact</Link>
          </div>
          <p>
            Season data is a general guide only — always check local conditions, regulations, and bag limits before fishing.
          </p>
        </div>
      </div>
    </footer>
  );
}
