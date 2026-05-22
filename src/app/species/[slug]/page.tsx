import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ruler, Package } from "lucide-react";
import { SeasonalCalendar } from "@/components/discovery/SeasonalCalendar";
import { SeasonBadge } from "@/components/discovery/SeasonBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSpeciesBySlug, getBestRegionsForSpecies, getSpeciesWithTechniques, listSpecies } from "@/lib/queries/species";
import { currentMonth, MONTH_NAMES, MONTH_NAMES_FULL } from "@/lib/utils/season";

export const revalidate = 86400;

const CATEGORY_LABELS: Record<string, string> = {
  pelagic: "Pelagic Game Fish",
  reef: "Reef Fish",
  estuary: "Estuary Fish",
  inshore: "Inshore Sport Fish",
  freshwater: "Freshwater",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  pelagic: "from-blue-950 via-[#020B14] to-[#020B14]",
  reef: "from-cyan-950 via-[#020B14] to-[#020B14]",
  estuary: "from-teal-950 via-[#020B14] to-[#020B14]",
  inshore: "from-sky-950 via-[#020B14] to-[#020B14]",
  freshwater: "from-emerald-950 via-[#020B14] to-[#020B14]",
};

export async function generateStaticParams() {
  try {
    const allSpecies = await listSpecies();
    return allSpecies.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const sp = await getSpeciesBySlug(slug);
    if (!sp) return {};
    return {
      title: `${sp.commonName} Fishing — East Coast Australia | EastCoast Fishing`,
      description: `Best times and places to target ${sp.commonName} on the Australian east coast. Seasonal calendar, top regions, fishing techniques, and gear guide.`,
    };
  } catch {
    return {};
  }
}

export default async function SpeciesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sp = await getSpeciesBySlug(slug);
  if (!sp) notFound();

  const [bestRegions, techniqueRows] = await Promise.all([
    getBestRegionsForSpecies(sp.id),
    getSpeciesWithTechniques(sp.id),
  ]);

  const techniques = techniqueRows.map((t) => t.technique);
  const month = currentMonth();

  const calendarData = bestRegions.slice(0, 15).map((row) => ({
    label: row.regionName,
    slug: row.regionSlug,
    months: row.months,
  }));

  const topRegionsThisMonth = bestRegions
    .filter((r) => r.months[month] === "peak" || r.months[month] === "good")
    .slice(0, 6);

  const heroGradient = CATEGORY_GRADIENTS[sp.category] ?? "from-[#040F1C] via-[#020B14] to-[#020B14]";

  return (
    <div>
      {/* Hero Banner */}
      <section className={`relative bg-gradient-to-b ${heroGradient} overflow-hidden`}>
        {/* Glow orbs */}
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Category tint bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-white/50 mb-5 flex items-center gap-2">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <span>{sp.commonName}</span>
          </nav>

          {/* Category + scientific name */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="inline-flex items-center bg-white/10 rounded-full px-3 py-1 text-white/80 text-sm border border-white/20">
              {CATEGORY_LABELS[sp.category] ?? sp.category}
            </span>
            {sp.scientificName && (
              <span className="text-sm text-white/60 italic">{sp.scientificName}</span>
            )}
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-white mb-3">{sp.commonName} Fishing</h1>

          {/* Description */}
          {sp.description && (
            <p className="text-white/60 max-w-2xl leading-relaxed mb-5">{sp.description}</p>
          )}

          {/* Legal size + bag limit chips */}
          {(sp.minLegalSizeMm || sp.bagLimit) && (
            <div className="flex gap-3 mb-6 flex-wrap">
              {sp.minLegalSizeMm && (
                <span className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-white/80 text-sm border border-white/20">
                  <Ruler className="h-3.5 w-3.5" />
                  Min size: {sp.minLegalSizeMm}mm
                </span>
              )}
              {sp.bagLimit && (
                <span className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-white/80 text-sm border border-white/20">
                  <Package className="h-3.5 w-3.5" />
                  Bag limit: {sp.bagLimit}
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <Link href="/trips/new">
            <button className="inline-flex items-center gap-2 bg-[#06B6D4] hover:bg-[#0891B2] text-white font-medium px-5 py-2.5 rounded-xl transition-colors">
              Plan a Trip
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Best regions now */}
            {topRegionsThisMonth.length > 0 && (
              <Card>
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="text-base text-[#040F1C]">
                    Best spots this month — {MONTH_NAMES_FULL[month]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="divide-y">
                    {topRegionsThisMonth.map((r) => (
                      <div key={r.regionSlug} className="flex items-center justify-between py-2.5">
                        <Link href={`/regions/${r.regionSlug}`} className="font-medium text-sm hover:text-[#06B6D4] transition-colors">
                          {r.regionName}
                        </Link>
                        <div className="flex items-center gap-2">
                          <SeasonBadge rating={r.months[month]} />
                          <span className="text-xs text-muted-foreground">{r.state}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Full calendar */}
            <section>
              <h2 className="text-xl font-bold text-[#040F1C] mb-4">Best Regions by Month</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Seasonal ratings across all east coast regions. Click a region to see the full calendar.
              </p>
              {calendarData.length > 0 ? (
                <SeasonalCalendar rows={calendarData} highlightMonth={month} linkRowsTo="regions" />
              ) : (
                <p className="text-muted-foreground py-4">No data available yet.</p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fishing Techniques */}
            {techniques.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-[#040F1C]">Fishing Techniques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {techniques.map((t) => (
                    <div key={t.id}>
                      <div className="font-medium text-sm text-[#040F1C]">{t.name}</div>
                      {t.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t.description}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* When to Target */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-[#040F1C]">When to Target</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {MONTH_NAMES.slice(1).map((name, i) => {
                    const m = i + 1;
                    const peakCount = bestRegions.filter((r) => r.months[m] === "peak").length;
                    const goodCount = bestRegions.filter((r) => r.months[m] === "good").length;
                    const total = peakCount + goodCount;
                    if (total === 0) return null;
                    return (
                      <div key={m} className="flex items-center gap-3">
                        <span className={`text-xs w-8 font-medium ${m === month ? "text-[#0891B2]" : "text-muted-foreground"}`}>
                          {name}
                        </span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-[#06B6D4] rounded-full"
                            style={{ width: `${Math.min(100, (total / Math.max(bestRegions.length, 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-14 text-right">
                          {total} region{total !== 1 ? "s" : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Gear Guide */}
            <Card className="bg-cyan-950 border-cyan-800">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-1 text-white">Gear Guide</h3>
                <p className="text-xs text-white/60 mb-3 leading-relaxed">
                  See the recommended tackle, lures, and equipment for this type of fishing.
                </p>
                <Link href="/gear">
                  <button className="w-full inline-flex items-center justify-center gap-1.5 bg-[#06B6D4] hover:bg-[#0891B2] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors">
                    View Gear Guide <ArrowRight className="h-3 w-3" />
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
