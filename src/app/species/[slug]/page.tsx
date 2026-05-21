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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span>{sp.commonName}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{CATEGORY_LABELS[sp.category] ?? sp.category}</Badge>
            {sp.scientificName && (
              <span className="text-sm text-muted-foreground italic">{sp.scientificName}</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">{sp.commonName} Fishing</h1>
          {sp.description && (
            <p className="text-slate-600 max-w-2xl leading-relaxed">{sp.description}</p>
          )}
          <div className="flex gap-4 mt-4 text-sm text-muted-foreground flex-wrap">
            {sp.minLegalSizeMm && (
              <span className="flex items-center gap-1">
                <Ruler className="h-3.5 w-3.5" />
                Min size: {sp.minLegalSizeMm}mm
              </span>
            )}
            {sp.bagLimit && (
              <span className="flex items-center gap-1">
                <Package className="h-3.5 w-3.5" />
                Bag limit: {sp.bagLimit}
              </span>
            )}
          </div>
        </div>
        <Link href="/trips/new">
          <Button className="shrink-0 gap-2">
            Plan a Trip
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Best regions now */}
          {topRegionsThisMonth.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Best spots this month — {MONTH_NAMES_FULL[month]}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {topRegionsThisMonth.map((r) => (
                    <div key={r.regionSlug} className="flex items-center justify-between py-2.5">
                      <Link href={`/regions/${r.regionSlug}`} className="font-medium text-sm hover:text-blue-600">
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
            <h2 className="text-xl font-bold text-slate-900 mb-4">Best Regions by Month</h2>
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
          {/* Techniques */}
          {techniques.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fishing Techniques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {techniques.map((t) => (
                  <div key={t.id}>
                    <div className="font-medium text-sm">{t.name}</div>
                    {t.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Peak months summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">When to Target</CardTitle>
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
                      <span className={`text-xs w-8 font-medium ${m === month ? "text-blue-600" : "text-muted-foreground"}`}>
                        {name}
                      </span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
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

          {/* Gear link */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-1">Gear Guide</h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                See the recommended tackle, lures, and equipment for this type of fishing.
              </p>
              <Link href="/gear">
                <Button size="sm" variant="outline" className="w-full gap-1.5">
                  View Gear Guide <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
