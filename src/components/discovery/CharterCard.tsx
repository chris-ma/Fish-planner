import Link from "next/link";
import { MapPin, Users, Clock, ArrowRight } from "lucide-react";
import type { Charter } from "@/db/schema";

const CATEGORY_BG: Record<string, string> = {
  "topwater-gt":          "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=600",
  "marlin-trolling":      "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=600",
  "barramundi-estuary":   "https://images.pexels.com/photos/3048522/pexels-photo-3048522.jpeg?auto=compress&cs=tinysrgb&w=600",
  "ningaloo-reef":        "https://images.pexels.com/photos/1591938/pexels-photo-1591938.jpeg?auto=compress&cs=tinysrgb&w=600",
  "wahoo-speed-trolling": "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=600",
  "bonefish-flats":       "https://images.pexels.com/photos/3048522/pexels-photo-3048522.jpeg?auto=compress&cs=tinysrgb&w=600",
  "kingfish-jigging":     "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=600",
  "snapper-bottom-bashing": "https://images.pexels.com/photos/1591938/pexels-photo-1591938.jpeg?auto=compress&cs=tinysrgb&w=600",
  "southern-reef-mixed":  "https://images.pexels.com/photos/5200238/pexels-photo-5200238.jpeg?auto=compress&cs=tinysrgb&w=600",
  "nz-hapuku-deep":       "https://images.pexels.com/photos/5200238/pexels-photo-5200238.jpeg?auto=compress&cs=tinysrgb&w=600",
};
const DEFAULT_BG = "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=600";

export function CharterCard({ charter }: { charter: Charter }) {
  const bg = (charter.experienceSlug && CATEGORY_BG[charter.experienceSlug]) ?? charter.heroImage ?? DEFAULT_BG;

  return (
    <Link href={`/charters/${charter.slug}`}>
      <div className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#C99A3E]/50 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-64">
        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${bg}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

        {/* Featured badge */}
        {charter.featured && (
          <div className="absolute top-3 right-3 bg-[#C99A3E] text-[#0A1C28] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Featured
          </div>
        )}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <p className="text-[#C99A3E] text-[11px] font-semibold uppercase tracking-widest mb-1">
            {charter.operatorName}
          </p>
          <h3 className="text-white font-bold text-base leading-tight mb-3">{charter.name}</h3>

          <div className="flex flex-wrap gap-2 text-white/70 text-xs mb-3">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{charter.homePort}</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />Up to {charter.maxGuests}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{charter.durationDays === 1 ? "Day trip" : `${charter.durationDays} days`}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#C99A3E] font-semibold text-sm">{charter.priceLabel ?? "Enquire for pricing"}</span>
            <span className="text-white/60 text-xs flex items-center gap-1">Enquire <ArrowRight className="h-3 w-3" /></span>
          </div>
        </div>
      </div>
    </Link>
  );
}
