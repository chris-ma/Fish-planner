import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, Fish } from "lucide-react";
import { SeasonalCalendar } from "@/components/discovery/SeasonalCalendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRegionBySlug, getSeasonCalendarForRegion, listRegions } from "@/lib/queries/regions";
import { getSpeciesWithTechniques } from "@/lib/queries/species";
import { currentMonth, MONTH_NAMES_FULL } from "@/lib/utils/season";

export const revalidate = 86400;

const ZONE_LABELS: Record<string, string> = {
  far_north_qld: "Far North Queensland",
  central_qld: "Central Queensland",
  southeast_qld: "Southeast Queensland",
  nsw: "New South Wales",
  vic_coast: "Victoria",
  tas: "Tasmania",
  lord_howe: "Lord Howe Island",
  murray_darling: "Murray–Darling Basin",
  alpine: "Alpine & Highlands",
};

export async function generateStaticParams() {
  try {
    const regions = await listRegions();
    return regions.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const region = await getRegionBySlug(slug);
    if (!region) return {};
    return {
      title: `Fishing in ${region.name} | EastCoast Fishing Planner`,
      description: `Best times to fish in ${region.name}, ${region.state}. Monthly seasonal calendar, top species, fishing methods and trip planning guide.`,
    };
  } catch {
    return {};
  }
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) notFound();

  const calendarRows = await getSeasonCalendarForRegion(region.id);
  const month = currentMonth();

  const calendarData = calendarRows.map((row) => ({
    label: row.commonName,
    slug: row.speciesSlug,
    months: row.months,
  }));

  const peakThisMonth = calendarRows
    .filter((r) => r.months[month] === "peak" || r.months[month] === "good")
    .slice(0, 6);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-[#020B14] overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-white/50 mb-5 flex items-center gap-2">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <span>{region.name}</span>
          </nav>

          {/* Zone badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-3 py-1 text-white/80 text-sm mb-3 border border-white/20">
            <MapPin className="h-3.5 w-3.5" />
            {ZONE_LABELS[region.zone] ?? region.zone} · {region.state}
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-[#F5F0E8] mt-3 mb-3">Fishing in {region.name}</h1>

          {/* Description */}
          {region.description && (
            <p className="text-white/60 max-w-2xl leading-relaxed mb-6">{region.description}</p>
          )}

          {/* CTA */}
          <Link href="/trips/new">
            <button className="inline-flex items-center gap-2 bg-[#06B6D4] hover:bg-[#0891B2] text-white font-medium px-5 py-2.5 rounded-xl transition-colors">
              Plan a Trip Here
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* In season now */}
        {peakThisMonth.length > 0 && (
          <div className="bg-cyan-950/50 border border-cyan-800/50 rounded-2xl p-5 mb-8">
            <h2 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
              <Fish className="h-4 w-4" />
              Active this month — {MONTH_NAMES_FULL[month]}
            </h2>
            <div className="flex flex-wrap gap-2">
              {peakThisMonth.map((sp) => (
                <Link
                  key={sp.speciesSlug}
                  href={`/species/${sp.speciesSlug}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 ${
                    sp.months[month] === "peak"
                      ? "bg-[#06B6D4] text-white"
                      : "bg-[#0891B2] text-white"
                  }`}
                >
                  {sp.commonName}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Seasonal Calendar */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#040F1C] mb-4">12-Month Seasonal Calendar</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Monthly ratings for each species. Click a species name to see where else it can be targeted.
          </p>
          {calendarData.length > 0 ? (
            <SeasonalCalendar rows={calendarData} highlightMonth={month} linkRowsTo="species" />
          ) : (
            <div className="border rounded-xl p-8 text-center text-muted-foreground">
              <p>No season data available for this region yet.</p>
              <p className="text-sm mt-1">Run the seed script to populate seasonal data.</p>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="bg-[#040F1C] rounded-3xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-3 text-[#F5F0E8]">Ready to plan a trip to {region.name}?</h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Create a shared workspace, invite your crew, build a gear list, and store all your bookings in one place.
          </p>
          <Link href="/trips/new">
            <button className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white hover:text-[#040F1C] font-medium px-6 py-2.5 rounded-xl transition-colors">
              Plan This Trip
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}
