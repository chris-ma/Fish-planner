import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, Fish, Copy, Package, Users, Smartphone, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTripWithRegion, getTripBookings, getTripChecklist, getTripParticipants } from "@/lib/queries/trips";
import { formatDateRange } from "@/lib/utils/dates";
import { REGION_OPTIONS } from "@/lib/data/options";
import { CopyShareLink } from "./CopyShareLink";

const STATUS_COLORS: Record<string, string> = {
  planning: "bg-slate-100 text-slate-700",
  confirmed: "bg-blue-100 text-blue-700",
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

const BOOKING_TYPE_LABELS: Record<string, string> = {
  charter: "Charter",
  accommodation: "Accommodation",
  flight: "Flight",
  transport: "Transport",
  other: "Other",
};

export default async function TripOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getTripWithRegion(id);
  if (!row) notFound();

  const { trip, region } = row;

  const [bookings, checklist, participants] = await Promise.all([
    getTripBookings(id),
    getTripChecklist(id),
    getTripParticipants(id),
  ]);

  const targetSpecies: string[] = trip.targetSpecies ? JSON.parse(trip.targetSpecies) : [];
  const completedItems = checklist.filter((i) => i.isCompleted).length;

  let parsedDescription = "";
  type SlotEntry = string[] | { activity: string; species: string[] };
  type ScheduleEvent = { id: string; startTime: string; endTime: string; activity: string; species: string[] };
  let itinerary: Record<string, Record<string, SlotEntry> | ScheduleEvent[]> = {};
  let dayLocations: Record<string, string> = {};
  if (trip.description) {
    try {
      const parsed = JSON.parse(trip.description);
      parsedDescription = parsed.notes ?? "";
      itinerary = parsed.itinerary ?? {};
      dayLocations = parsed.dayLocations ?? {};
    } catch {
      parsedDescription = trip.description;
    }
  }

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/trips/${id}`
    : `/trips/${id}`;

  return (
    <div>
      {/* Ocean hero header */}
      <div className="relative bg-[#020B14] py-10 px-4 overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-96 h-64 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[trip.status] ?? STATUS_COLORS.planning}`}>
                  {trip.status}
                </span>
                {region && (
                  <span className="flex items-center gap-1 text-white/50 text-xs">
                    <MapPin className="h-3 w-3" />
                    <Link href={`/regions/${region.slug}`} className="hover:text-white/80">
                      {region.name}
                    </Link>
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-[#F5F0E8] mb-1">{trip.title}</h1>
              <p className="text-white/50 text-sm flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDateRange(trip.startDate, trip.endDate)}
              </p>
              {parsedDescription && (
                <p className="mt-2 text-white/60 text-sm leading-relaxed max-w-xl">{parsedDescription}</p>
              )}
            </div>
            <CopyShareLink tripId={id} />
          </div>
        </div>
      </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Target species */}
      {targetSpecies.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-[#040F1C]">
            <Fish className="h-4 w-4 text-[#0D9488]" />
            Target species
          </div>
          <div className="flex flex-wrap gap-2">
            {targetSpecies.map((name) => (
              <span key={name} className="px-3 py-1 rounded-full text-sm bg-teal-50 text-[#0F766E] border border-teal-200">{name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Schedule section */}
      {Object.keys(itinerary).length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-[#040F1C]">
              <Calendar className="h-4 w-4 text-[#0D9488]" />
              Trip Schedule
            </div>
            <Link href="/trips/new" className="text-xs text-[#0F766E] hover:underline">
              Edit
            </Link>
          </div>
          <div className="space-y-2">
            {Object.entries(itinerary).map(([day, dayValue]) => {
              // New format: ScheduleEvent[]
              if (Array.isArray(dayValue) && dayValue.length > 0 && "startTime" in (dayValue[0] ?? {})) {
                const events = [...(dayValue as ScheduleEvent[])].sort((a, b) => a.startTime.localeCompare(b.startTime));
                return (
                  <div key={day} className="bg-[#F5F0E8] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-500">
                        {new Date(day + "T12:00:00").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}
                      </p>
                      {dayLocations[day] && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {REGION_OPTIONS.find((r) => r.slug === dayLocations[day])?.name ?? dayLocations[day]}
                        </span>
                      )}
                    </div>
                    {events.map((evt) => (
                      <div key={evt.id} className="flex items-center gap-2 text-sm mb-1">
                        <span className="text-slate-400 text-xs shrink-0 font-mono">{evt.startTime}–{evt.endTime}</span>
                        <span className="text-[#040F1C] text-xs">
                          {evt.activity}
                          {evt.species.length > 0 && <span className="text-teal-700"> — {evt.species.join(", ")}</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }

              // Old format: Record<slot, SlotEntry>
              const slots = dayValue as Record<string, SlotEntry>;
              const hasEntries = Object.values(slots).some((entry) => {
                if (Array.isArray(entry)) return entry.length > 0;
                const e = entry as { activity: string; species: string[] };
                return !!e.activity || e.species.length > 0;
              });
              if (!hasEntries) return null;
              return (
                <div key={day} className="bg-[#F5F0E8] rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-500">
                      {new Date(day + "T12:00:00").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                    {dayLocations[day] && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {REGION_OPTIONS.find((r) => r.slug === dayLocations[day])?.name ?? dayLocations[day]}
                      </span>
                    )}
                  </div>
                  {Object.entries(slots)
                    .filter(([, entry]) => {
                      if (Array.isArray(entry)) return entry.length > 0;
                      const e = entry as { activity: string; species: string[] };
                      return !!e.activity || e.species.length > 0;
                    })
                    .map(([slot, entry]) => {
                      const isOld = Array.isArray(entry);
                      const activity = isOld ? null : (entry as { activity: string; species: string[] }).activity;
                      const species = isOld ? (entry as string[]) : (entry as { activity: string; species: string[] }).species;
                      const display = [activity, species.length > 0 ? species.join(", ") : null].filter(Boolean).join(" — ");
                      return (
                        <div key={slot} className="flex items-center gap-2 text-sm mb-1">
                          <span className="text-slate-400 w-20 text-xs shrink-0">{slot}</span>
                          <span className="text-[#040F1C] text-xs">{display}</span>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href={`/trips/${id}/gear`}>
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center">
                  <Package className="h-5 w-5 text-[#0D9488]" />
                </div>
                <h3 className="font-semibold text-[#040F1C]">Gear List</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {checklist.length > 0
                  ? `${completedItems}/${checklist.length} items packed`
                  : "Generate your gear checklist"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/trips/${id}/bookings`}>
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-[#040F1C]">Bookings</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {bookings.length > 0 ? `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} saved` : "Add charters, flights, accommodation"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/trips/${id}/group`}>
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gold-400/10 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-gold-500" />
                </div>
                <h3 className="font-semibold text-[#040F1C]">Group</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {participants.length > 0 ? `${participants.length} crew member${participants.length !== 1 ? "s" : ""}` : "Invite your crew"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/trips/${id}/budget`}>
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-[#040F1C]">Budget</h3>
              </div>
              <p className="text-sm text-muted-foreground">Track costs &amp; split between crew</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/trips/${id}/field`}>
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-sm rounded-2xl bg-[#020B14]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-teal-400" />
                </div>
                <h3 className="font-semibold text-[#F5F0E8]">Field Mode</h3>
              </div>
              <p className="text-sm text-white/50">Tides, maps &amp; crew on your phone</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent bookings preview */}
      {bookings.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Bookings</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y">
              {bookings.slice(0, 3).map((b) => (
                <div key={b.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-sm">{b.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {BOOKING_TYPE_LABELS[b.type] ?? b.type}
                      {b.providerName && ` · ${b.providerName}`}
                      {b.bookingDate && ` · ${b.bookingDate}`}
                    </div>
                  </div>
                  {b.costAud && (
                    <span className="text-sm font-medium text-slate-900">
                      ${b.costAud.toFixed(0)}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {bookings.length > 3 && (
              <Link href={`/trips/${id}/bookings`} className="text-sm text-[#0F766E] hover:underline block mt-2">
                View all {bookings.length} bookings
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
    </div>
  );
}
