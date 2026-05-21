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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span>{region.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <MapPin className="h-4 w-4" />
            <span>{ZONE_LABELS[region.zone] ?? region.zone}</span>
            <Badge variant="outline">{region.state}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Fishing in {region.name}</h1>
          {region.description && (
            <p className="text-slate-600 max-w-2xl leading-relaxed">{region.description}</p>
          )}
        </div>
        <Link href="/trips/new">
          <Button className="shrink-0 gap-2">
            Plan a Trip Here
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* In season now */}
      {peakThisMonth.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8">
          <h2 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
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
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-400 text-white"
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
        <h2 className="text-xl font-bold text-slate-900 mb-4">12-Month Seasonal Calendar</h2>
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
      <section className="bg-blue-950 text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to plan a trip to {region.name}?</h2>
        <p className="text-blue-200 mb-6 max-w-md mx-auto">
          Create a shared workspace, invite your crew, build a gear list, and store all your bookings in one place.
        </p>
        <Link href="/trips/new">
          <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-950">
            Plan This Trip
          </Button>
        </Link>
      </section>
    </div>
  );
}
