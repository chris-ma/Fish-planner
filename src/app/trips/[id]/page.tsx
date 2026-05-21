import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, Fish, Copy, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTripWithRegion, getTripBookings, getTripChecklist, getTripParticipants } from "@/lib/queries/trips";
import { formatDateRange } from "@/lib/utils/dates";
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

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/trips/${id}`
    : `/trips/${id}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[trip.status] ?? STATUS_COLORS.planning}`}>
                {trip.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{trip.title}</h1>
          </div>
          <CopyShareLink tripId={id} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {region && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <Link href={`/regions/${region.slug}`} className="hover:text-foreground">
                {region.name}
              </Link>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
        </div>

        {trip.description && (
          <p className="mt-3 text-slate-600 leading-relaxed">{trip.description}</p>
        )}
      </div>

      {/* Target species */}
      {targetSpecies.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-700">
            <Fish className="h-4 w-4" />
            Target species
          </div>
          <div className="flex flex-wrap gap-2">
            {targetSpecies.map((name) => (
              <Badge key={name} variant="secondary">{name}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Navigation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href={`/trips/${id}/gear`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-semibold">Gear List</h3>
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
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                </div>
                <h3 className="font-semibold">Bookings</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {bookings.length > 0 ? `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} saved` : "Add charters, flights, accommodation"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/trips/${id}/group`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-semibold">Group</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {participants.length > 0 ? `${participants.length} crew member${participants.length !== 1 ? "s" : ""}` : "Invite your crew"}
              </p>
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
              <Link href={`/trips/${id}/bookings`} className="text-sm text-blue-600 hover:underline block mt-2">
                View all {bookings.length} bookings
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
