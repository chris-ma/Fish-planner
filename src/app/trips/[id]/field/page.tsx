import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Waves, Map, Fish, Users, AlertTriangle, Share2 } from "lucide-react";
import { getTripWithRegion, getTripParticipants, getTripNotes } from "@/lib/queries/trips";
import { formatDateRange } from "@/lib/utils/dates";
import { REGION_TIDE_URL } from "@/lib/utils/tides";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Availability = "going" | "tentative" | "out";

const AVAIL_COLORS: Record<Availability, string> = {
  going:     "text-[#6FA88F]",
  tentative: "text-amber-400",
  out:       "text-red-400",
};

export default async function TripFieldPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getTripWithRegion(id);
  if (!row) notFound();

  const { trip, region } = row;

  const [participants, allNotes] = await Promise.all([
    getTripParticipants(id),
    getTripNotes(id),
  ]);

  const pinnedNotes = allNotes.filter((n) => n.isPinned);
  const targetSpecies: string[] = trip.targetSpecies ? JSON.parse(trip.targetSpecies) : [];

  const tideUrl = region?.zone ? REGION_TIDE_URL[region.zone] : null;
  const mapsUrl = region
    ? `https://maps.google.com/?q=${encodeURIComponent(region.name + " fishing Australia")}`
    : null;

  return (
    <div className="min-h-screen bg-[#0B1D2A] text-[#F2EDE2] print:bg-white print:text-black">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 print:hidden">
        <Link
          href={`/trips/${id}`}
          className="flex items-center gap-1.5 text-white/60 text-sm hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit field mode
        </Link>
        <span className="text-xs font-semibold text-white/30 uppercase tracking-wider">Field Mode</span>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-8">
        {/* Trip identity */}
        <div>
          <h1 className="text-2xl font-bold text-[#F2EDE2] leading-tight">{trip.title}</h1>
          <p className="text-white/50 text-sm mt-1">
            {region?.name && `${region.name} · `}
            {formatDateRange(trip.startDate, trip.endDate)}
          </p>
        </div>

        {/* Target species */}
        {targetSpecies.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              <Fish className="h-3.5 w-3.5" />
              Target Species
            </div>
            <div className="flex flex-wrap gap-2">
              {targetSpecies.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1 rounded-full text-sm bg-[#2E5E4E]/40 text-[#6FA88F] border border-[#2E5E4E]/60"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Crew */}
        {participants.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              <Users className="h-3.5 w-3.5" />
              Crew
            </div>
            <div className="space-y-2">
              {participants.map((p) => {
                const avail = (p.availability ?? "going") as Availability;
                return (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#F2EDE2]">{p.name}</span>
                    <span className={`text-xs capitalize ${AVAIL_COLORS[avail]}`}>{avail}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div>
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Quick Access</div>
          <div className="grid grid-cols-2 gap-3">
            {tideUrl && (
              <a
                href={tideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 hover:bg-white/10 transition-colors"
              >
                <Waves className="h-5 w-5 text-[#6FA88F] shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-[#F2EDE2]">Tide Chart</div>
                  <div className="text-xs text-white/40">BoM tide predictor</div>
                </div>
              </a>
            )}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 hover:bg-white/10 transition-colors"
              >
                <Map className="h-5 w-5 text-blue-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-[#F2EDE2]">Maps</div>
                  <div className="text-xs text-white/40">Google Maps</div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Emergency / pinned notes */}
        {pinnedNotes.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              Important Notes
            </div>
            <div className="space-y-3">
              {pinnedNotes.map((note) => (
                <div key={note.id} className="rounded-xl bg-amber-900/20 border border-amber-700/40 p-4">
                  <p className="text-xs text-amber-400 font-semibold mb-1.5">{note.authorName}</p>
                  <p className="text-sm text-[#F2EDE2] leading-relaxed whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share code */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
            <Share2 className="h-3.5 w-3.5" />
            Trip code (bookmark or share)
          </div>
          <p className="text-lg font-mono font-bold text-[#6FA88F] tracking-widest">{trip.shareCode}</p>
          <p className="text-xs text-white/30 mt-1">Share this code to let others find the trip plan</p>
        </div>
      </div>
    </div>
  );
}
