import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, Fish, Calendar, TrendingUp, Anchor } from "lucide-react";
import { getZoneImage, getSpeciesImage } from "@/lib/images";
import { SeasonalCalendar } from "@/components/discovery/SeasonalCalendar";
import { getRegionBySlug, getSeasonCalendarForRegion, listRegions, getDestinationsForRegion } from "@/lib/queries/regions";
import { getExperiences } from "@/lib/queries/experiences";
import { currentMonth, MONTH_NAMES_FULL } from "@/lib/utils/season";
import { gregVinallYoutubeUrl } from "@/lib/affiliate";
import { REGION_EPISODES, PODCAST_SHOW_URL } from "@/lib/podcast-episodes";

export const revalidate = 86400;

const ZONE_LABELS: Record<string, string> = {
  nz_north_island: "New Zealand — North Island",
  nz_south_island: "New Zealand — South Island",
  far_north_qld: "Far North Queensland",
  central_qld: "Central Queensland",
  southeast_qld: "Southeast Queensland",
  nsw: "New South Wales",
  vic_coast: "Victoria",
  tas: "Tasmania",
  lord_howe: "Lord Howe Island",
  murray_darling: "Murray–Darling Basin",
  alpine: "Alpine & Highlands",
  nt_top_end: "NT — Top End",
  nt_gulf: "NT — Gulf of Carpentaria",
  wa_kimberley: "WA — Kimberley",
  wa_pilbara: "WA — Pilbara & Ningaloo",
  wa_mid_west: "WA — Mid West",
  wa_southwest: "WA — Southwest",
  sa_spencer_gulf: "SA — Spencer Gulf",
  sa_south: "SA — South Coast",
  christmas_island: "Christmas Island",
  cocos_islands: "Cocos (Keeling) Islands",
};

const SHORT_MONTHS = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  pelagic: "bg-blue-600",
  reef: "bg-orange-600",
  estuary: "bg-teal-600",
  inshore: "bg-sky-600",
  freshwater: "bg-emerald-600",
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
      title: `Fishing in ${region.name} | HookLine`,
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

  const [allCalendarRows, regionDestinations, allExperiences] = await Promise.all([
    getSeasonCalendarForRegion(region.id),
    getDestinationsForRegion(region.id),
    getExperiences(),
  ]);
  const month = currentMonth();

  const calendarRows = allCalendarRows.filter((row) =>
    row.months.some((m) => m === "peak")
  );

  const calendarData = calendarRows.map((row) => ({
    label: row.commonName,
    slug: row.speciesSlug,
    months: row.months,
  }));

  const peakThisMonth = calendarRows
    .filter((r) => r.months[month] === "peak" || r.months[month] === "good")
    .slice(0, 8);

  const heroImage = getZoneImage(region.zone, 1200);

  // Compute best months for this region
  const monthActivity = new Array(13).fill(0);
  for (const row of calendarRows) {
    row.months.forEach((rating, m) => {
      if (!m) return;
      if (rating === "peak") monthActivity[m] += 3;
      else if (rating === "good") monthActivity[m] += 1;
    });
  }
  const maxActivity = Math.max(...monthActivity.slice(1), 1);
  const hotMonths = monthActivity
    .map((s, i) => ({ s, i }))
    .filter(({ s, i }) => i > 0 && s >= maxActivity * 0.6)
    .map(({ i }) => i)
    .sort((a, b) => a - b);

  let bestMonthsLabel = "Year-round";
  if (hotMonths.length > 0 && hotMonths.length < 10) {
    bestMonthsLabel = hotMonths.length === 1
      ? SHORT_MONTHS[hotMonths[0]]
      : `${SHORT_MONTHS[hotMonths[0]]} – ${SHORT_MONTHS[hotMonths[hotMonths.length - 1]]}`;
  }

  // Top target species (up to 8, sorted by peak score already from query)
  const topSpecies = calendarRows.slice(0, 8);

  // Filter experiences to ones relevant to this region's species
  const regionSpeciesSlugs = new Set(calendarRows.map((r) => r.speciesSlug));
  const relevantExperiences = allExperiences.filter((exp) => {
    const targetSlugs: string[] = JSON.parse(exp.targetSpeciesSlugs || "[]");
    return targetSlugs.some((s) => regionSpeciesSlugs.has(s));
  }).slice(0, 6);

  return (
    <div className="bg-[#020B14] min-h-screen">
      {/* Hero Banner */}
      <section className="relative bg-[#020B14] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020B14]/60 via-[#020B14]/40 to-[#020B14]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-8">
          <nav className="text-sm text-white/50 mb-5 flex items-center gap-2">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <span>{region.name}</span>
          </nav>

          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-3 py-1 text-white/80 text-sm mb-3 border border-white/20">
            <MapPin className="h-3.5 w-3.5" />
            {ZONE_LABELS[region.zone] ?? region.zone} · {region.state}
          </div>

          <h1 className="text-4xl font-bold text-[#F5F0E8] mt-3 mb-3">Fishing in {region.name}</h1>

          {region.description && (
            <p className="text-white/60 max-w-2xl leading-relaxed mb-6">{region.description}</p>
          )}

          <Link href="/trips/new">
            <button className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-medium px-5 py-2.5 rounded-xl transition-colors">
              Plan a Trip Here
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-[#040F1C] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Fish className="h-4 w-4 text-[#0D9488]" />
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">Species</p>
                <p className="text-white font-semibold text-sm">{calendarRows.length} tracked</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">Active Now</p>
                <p className="text-white font-semibold text-sm">{peakThisMonth.length} species</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">Peak Season</p>
                <p className="text-white font-semibold text-sm">{bestMonthsLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* Top Target Species */}
        {topSpecies.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#F5F0E8]">Top Target Species</h2>
              <Link href="/species" className="text-sm text-[#0D9488] hover:text-[#2DD4BF] transition-colors">
                All species →
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {topSpecies.map((sp) => {
                const imageUrl = getSpeciesImage(sp.speciesSlug, sp.category, 600);
                const badgeColor = CATEGORY_BADGE_COLORS[sp.category] ?? "bg-slate-600";
                const thisMonthRating = sp.months[month];
                return (
                  <Link key={sp.speciesId} href={`/species/${sp.speciesSlug}`} className="shrink-0">
                    <div className="w-28 rounded-xl overflow-hidden relative aspect-[3/4]">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${imageUrl}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
                      <div className="relative z-10 p-1.5">
                        <span className={`${badgeColor} text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider`}>
                          {sp.category}
                        </span>
                      </div>
                      {thisMonthRating === "peak" && (
                        <div className="absolute top-1.5 right-1.5 z-10 w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 z-10 p-2">
                        <p className="text-white font-bold text-[10px] leading-tight">{sp.commonName}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Active this month */}
        {peakThisMonth.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-[#F5F0E8] mb-3 flex items-center gap-2">
              <Fish className="h-4 w-4 text-[#0D9488]" />
              Active this month — {MONTH_NAMES_FULL[month]}
            </h2>
            <div className="flex flex-wrap gap-2">
              {peakThisMonth.map((sp) => (
                <Link
                  key={sp.speciesSlug}
                  href={`/species/${sp.speciesSlug}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                    sp.months[month] === "peak"
                      ? "bg-[#0D9488] text-white"
                      : "bg-[#0D9488]/30 text-[#2DD4BF] border border-[#0D9488]/40"
                  }`}
                >
                  {sp.commonName}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Best Time to Visit — month activity grid */}
        <section>
          <h2 className="text-lg font-bold text-[#F5F0E8] mb-4">Best Time to Visit</h2>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {SHORT_MONTHS.slice(1).map((label, i) => {
              const m = i + 1;
              const activity = monthActivity[m];
              const ratio = activity / maxActivity;
              const isNow = m === month;
              const intensity =
                ratio >= 0.75 ? "bg-[#0D9488] text-white" :
                ratio >= 0.45 ? "bg-[#0D9488]/50 text-white" :
                ratio >= 0.2  ? "bg-white/15 text-white/60" :
                                "bg-white/5 text-white/30";
              return (
                <div
                  key={m}
                  className={`rounded-xl flex flex-col items-center justify-center py-3 ${intensity} ${
                    isNow ? "ring-2 ring-white/60" : ""
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                  {activity > 0 && (
                    <span className="text-[8px] mt-0.5 opacity-70">
                      {Math.round((activity / maxActivity) * 100)}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-white/30 mt-2">Activity level based on seasonal peak ratings across all tracked species.</p>
        </section>

        {/* Seasonal Calendar */}
        <section>
          <h2 className="text-lg font-bold text-[#F5F0E8] mb-2">12-Month Seasonal Calendar</h2>
          <p className="text-sm text-white/40 mb-5">
            Monthly ratings per species. Click a species to see all regions where it can be targeted.
          </p>
          {calendarData.length > 0 ? (
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#F5F0E8] p-4">
              <SeasonalCalendar rows={calendarData} highlightMonth={month} linkRowsTo="species" />
            </div>
          ) : (
            <div className="border border-white/10 rounded-xl p-8 text-center text-white/30">
              <p>No season data available for this region yet.</p>
            </div>
          )}
        </section>

        {/* Greg Vinall Podcast */}
        {(() => {
          const episodes = REGION_EPISODES[region.slug] ?? [];
          const SpotifyLogo = () => (
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#1DB954] shrink-0">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          );
          return (
            <section>
              <div className="rounded-2xl bg-[#0D1117] border border-[#1DB954]/20 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <SpotifyLogo />
                  <span className="text-sm font-semibold text-white">Australian Lure Fishing Podcast</span>
                </div>
                <p className="text-xs text-white/40 mb-4">Greg Vinall — Doc Lures</p>
                {episodes.length > 0 ? (
                  <>
                    <p className="text-xs text-white/50 mb-3">Relevant episodes for {region.name}</p>
                    <ul className="space-y-2.5">
                      {episodes.map((ep) => (
                        <li key={ep.url}>
                          <a
                            href={ep.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-2.5 group"
                          >
                            <SpotifyLogo />
                            <span className="text-sm text-[#1DB954] group-hover:text-white transition-colors leading-snug">
                              {ep.title}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-white/50 mb-3">
                      Greg Vinall covers fishing spots and techniques across Australia — search his content for {region.name}.
                    </p>
                    <a
                      href={gregVinallYoutubeUrl(region.name + " fishing")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[#1DB954] hover:text-white transition-colors"
                    >
                      <SpotifyLogo />
                      Search Greg Vinall — {region.name}
                    </a>
                  </>
                )}
                <a
                  href={PODCAST_SHOW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  Browse all episodes on Spotify
                </a>
              </div>
            </section>
          );
        })()}

        {/* Fishing Spots */}
        {regionDestinations.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Anchor className="h-4 w-4 text-[#0D9488]" />
              <h2 className="text-lg font-bold text-[#F5F0E8]">Fishing Spots</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {regionDestinations.map((dest) => (
                <div key={dest.id} className="bg-[#040F1C] border border-white/10 rounded-xl p-4 hover:border-[#0D9488]/50 transition-colors">
                  <p className="font-semibold text-[#F5F0E8] text-sm mb-1">{dest.name}</p>
                  {dest.description && (
                    <p className="text-white/50 text-xs leading-relaxed">{dest.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Experiences */}
        {relevantExperiences.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#F5F0E8]">Fishing Experiences</h2>
              <Link href="/trips/new" className="text-sm text-[#0D9488] hover:text-[#2DD4BF] transition-colors">
                Plan a trip →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {relevantExperiences.map((exp) => {
                const CATEGORY_COLORS: Record<string, string> = {
                  offshore: "bg-blue-900/50 text-blue-300 border-blue-800/50",
                  reef: "bg-orange-900/50 text-orange-300 border-orange-800/50",
                  estuary: "bg-teal-900/50 text-teal-300 border-teal-800/50",
                  inshore: "bg-sky-900/50 text-sky-300 border-sky-800/50",
                  freshwater: "bg-emerald-900/50 text-emerald-300 border-emerald-800/50",
                };
                const colorClass = CATEGORY_COLORS[exp.category] ?? "bg-slate-800/50 text-slate-300 border-slate-700/50";
                const targetSlugs: string[] = JSON.parse(exp.targetSpeciesSlugs || "[]");
                return (
                  <Link key={exp.id} href={`/trips/new?experience=${exp.slug}&region=${region.slug}`}>
                    <div className="bg-[#040F1C] border border-white/10 rounded-xl p-4 hover:border-[#0D9488]/50 transition-colors cursor-pointer group h-full">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-semibold text-[#F5F0E8] text-sm group-hover:text-[#2DD4BF] transition-colors leading-tight">{exp.name}</p>
                        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${colorClass}`}>
                          {exp.category}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-2">{exp.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {targetSlugs.slice(0, 3).map((s) => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">{s.replace(/-/g, " ")}</span>
                        ))}
                        {targetSlugs.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">+{targetSlugs.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-[#040F1C] border border-white/10 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold mb-3 text-[#F5F0E8]">Ready to plan a trip to {region.name}?</h2>
          <p className="text-white/50 mb-6 max-w-md mx-auto">
            Create a shared workspace, invite your crew, build a gear list, and store all your bookings in one place.
          </p>
          <Link href="/trips/new">
            <button className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-medium px-6 py-2.5 rounded-xl transition-colors">
              Plan This Trip
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}
