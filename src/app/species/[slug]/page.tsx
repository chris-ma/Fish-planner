import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Waves, Sun, Cloud, Anchor, Zap, Lightbulb, ExternalLink, Youtube, Clock, Wind } from "lucide-react";
import { SeasonalCalendar } from "@/components/discovery/SeasonalCalendar";
import { SeasonBadge } from "@/components/discovery/SeasonBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSpeciesBySlug, getBestRegionsForSpecies, getSpeciesWithTechniques, listSpecies } from "@/lib/queries/species";
import { currentMonth, MONTH_NAMES, MONTH_NAMES_FULL } from "@/lib/utils/season";
import { FISHING_TIPS } from "@/lib/species-tips";
import { getSpeciesImage } from "@/lib/images";
import { SpeciesPageIntent } from "@/components/discovery/SpeciesPageIntent";
import { gregVinallYoutubeUrl } from "@/lib/affiliate";
import { SPECIES_EPISODES, PODCAST_SHOW_URL } from "@/lib/podcast-episodes";

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


const TIPS_ICONS = [
  { key: "tide", label: "Tides", Icon: Waves },
  { key: "timeOfDay", label: "Time of Day", Icon: Sun },
  { key: "conditions", label: "Conditions", Icon: Cloud },
  { key: "structure", label: "Structure", Icon: Anchor },
  { key: "retrieve", label: "Technique", Icon: Zap },
  { key: "hotTip", label: "Pro Tip", Icon: Lightbulb },
] as const;

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
      title: `${sp.commonName} Fishing in Australia | HookLine`,
      description: `Best times and places to target ${sp.commonName} across Australia. Seasonal calendar, top regions, fishing techniques, and gear guide.`,
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
  const tips = FISHING_TIPS[sp.slug] ?? null;

  const calendarData = bestRegions.slice(0, 15).map((row) => ({
    label: row.regionName,
    slug: row.regionSlug,
    months: row.months,
  }));

  const topRegionsThisMonth = bestRegions
    .filter((r) => r.months[month] === "peak" || r.months[month] === "good")
    .slice(0, 6);

  const heroGradient = CATEGORY_GRADIENTS[sp.category] ?? "from-[#040F1C] via-[#020B14] to-[#020B14]";
  const heroImage = getSpeciesImage(sp.slug, sp.category, 1200);

  return (
    <div>
      {/* Hero Banner */}
      <section className={`relative bg-gradient-to-b ${heroGradient} overflow-hidden`}>
        {/* Photo background with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0D9488] to-[#0F766E] opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <nav className="text-sm text-white/50 mb-5 flex items-center gap-2">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <span>{sp.commonName}</span>
          </nav>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="inline-flex items-center bg-white/10 rounded-full px-3 py-1 text-white/80 text-sm border border-white/20">
              {CATEGORY_LABELS[sp.category] ?? sp.category}
            </span>
            {sp.scientificName && (
              <span className="text-sm text-white/60 italic">{sp.scientificName}</span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-[#F5F0E8] mb-3">{sp.commonName} Fishing</h1>

          {sp.description && (
            <p className="text-white/60 max-w-2xl leading-relaxed mb-5">{sp.description}</p>
          )}

          {/* Intent banner — shown when arriving from the homepage search form */}
          <SpeciesPageIntent commonName={sp.commonName} />

          <div className="flex gap-3 flex-wrap">
            <Link href="/trips/new">
              <button className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-medium px-5 py-2.5 rounded-xl transition-colors">
                Plan a Trip
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/resources">
              <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/80 font-medium px-5 py-2.5 rounded-xl transition-colors border border-white/20">
                Bag &amp; Size Limits
                <ExternalLink className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* How to Catch section */}
            {tips && (
              <section>
                <h2 className="text-xl font-bold text-[#040F1C] mb-3">How to Catch {sp.commonName}</h2>
                {/* Quick condition chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tips.timeOfDay && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      {tips.timeOfDay.split(/[.,]/)[0].trim()}
                    </span>
                  )}
                  {tips.tide && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                      <Waves className="h-3.5 w-3.5 shrink-0" />
                      {tips.tide.split(/[.,]/)[0].trim()}
                    </span>
                  )}
                  {tips.conditions && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                      <Wind className="h-3.5 w-3.5 shrink-0" />
                      {tips.conditions.split(/[.,]/)[0].trim()}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TIPS_ICONS.map(({ key, label, Icon }) => {
                    const text = tips[key as keyof typeof tips];
                    const isHotTip = key === "hotTip";
                    return (
                      <div
                        key={key}
                        className={`rounded-xl p-4 border ${
                          isHotTip
                            ? "bg-amber-50 border-amber-200 sm:col-span-2"
                            : "bg-[#F5F0E8] border-slate-100 shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isHotTip ? "bg-amber-100" : "bg-slate-100"
                          }`}>
                            <Icon className={`h-4 w-4 ${isHotTip ? "text-amber-600" : "text-slate-500"}`} />
                          </div>
                          <span className={`text-xs font-semibold uppercase tracking-wider ${
                            isHotTip ? "text-amber-700" : "text-slate-500"
                          }`}>
                            {label}
                          </span>
                        </div>
                        <p className={`text-sm leading-relaxed ${isHotTip ? "text-amber-900" : "text-slate-700"}`}>
                          {text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

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
                        <Link href={`/regions/${r.regionSlug}`} className="font-medium text-sm hover:text-[#0D9488] transition-colors">
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
                Seasonal ratings across all Australian regions. Click a region to see the full calendar.
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
                        <span className={`text-xs w-8 font-medium ${m === month ? "text-[#0F766E]" : "text-muted-foreground"}`}>
                          {name}
                        </span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-[#0D9488] rounded-full"
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

            {/* Regulations link */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-1 text-slate-800">Bag &amp; Size Limits</h3>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  Regulations vary by state and change seasonally. Check the official fisheries website for current rules.
                </p>
                <Link href="/resources">
                  <button className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 font-medium text-sm px-4 py-2 rounded-lg transition-colors border border-slate-200">
                    Fishing Regulations <ExternalLink className="h-3 w-3" />
                  </button>
                </Link>
              </CardContent>
            </Card>

            {/* Greg Vinall Podcast */}
            {(() => {
              const episodes = SPECIES_EPISODES[sp.slug] ?? [];
              return (
                <Card className="bg-[#1a1a2e] border-[#1DB954]/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#1DB954] shrink-0"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                      <h3 className="font-semibold text-sm text-white">Australian Lure Fishing Podcast</h3>
                    </div>
                    <p className="text-xs text-white/50 mb-3">Greg Vinall — Doc Lures</p>
                    {episodes.length > 0 ? (
                      <ul className="space-y-2">
                        {episodes.map((ep) => (
                          <li key={ep.url}>
                            <a
                              href={ep.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-2 text-xs text-[#1DB954] hover:text-white transition-colors leading-snug"
                            >
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-[#1DB954] shrink-0 mt-0.5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                              {ep.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <a
                        href={gregVinallYoutubeUrl(sp.commonName + " fishing Australia")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#1DB954] hover:text-white transition-colors"
                      >
                        <Youtube className="h-3.5 w-3.5" />
                        Search Greg Vinall — {sp.commonName}
                      </a>
                    )}
                    <a
                      href={PODCAST_SHOW_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
                    >
                      Browse all episodes on Spotify
                    </a>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Gear Guide */}
            <Card className="bg-teal-950 border-teal-800">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-1 text-white">Gear Guide</h3>
                <p className="text-xs text-white/60 mb-3 leading-relaxed">
                  See the recommended tackle, lures, and equipment for this species.
                </p>
                <Link href="/gear">
                  <button className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0D9488] hover:bg-[#0F766E] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors">
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
