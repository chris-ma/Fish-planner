import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, Fish } from "lucide-react";
import { getZoneImage } from "@/lib/images";
import { SeasonalCalendar } from "@/components/discovery/SeasonalCalendar";
import { getRegionBySlug, getSeasonCalendarForRegion, listRegions } from "@/lib/queries/regions";
import { currentMonth, MONTH_NAMES_FULL } from "@/lib/utils/season";
import { gregVinallYoutubeUrl } from "@/lib/affiliate";
import { REGION_EPISODES, PODCAST_SHOW_URL } from "@/lib/podcast-episodes";

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

  const allCalendarRows = await getSeasonCalendarForRegion(region.id);
  const month = currentMonth();

  // Only show species that have at least one peak month in this region
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
    .slice(0, 6);

  const heroImage = getZoneImage(region.zone, 1200);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-[#020B14] overflow-hidden">
        {/* Photo background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020B14]/60 via-[#020B14]/40 to-[#020B14]" />
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

        {/* Greg Vinall Podcast */}
        {(() => {
          const episodes = REGION_EPISODES[region.slug] ?? [];
          const SpotifyLogo = () => (
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#1DB954] shrink-0">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          );
          return (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-[#040F1C] mb-4">Australian Lure Fishing Podcast</h2>
              <div className="rounded-2xl bg-[#1a1a2e] border border-[#1DB954]/20 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <SpotifyLogo />
                  <span className="text-sm font-semibold text-white">Greg Vinall — Doc Lures</span>
                </div>
                {episodes.length > 0 ? (
                  <>
                    <p className="text-xs text-white/50 mb-4">Relevant episodes for {region.name}</p>
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
                  className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
                >
                  Browse all episodes on Spotify
                </a>
              </div>
            </section>
          );
        })()}

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
