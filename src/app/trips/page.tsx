export const dynamic = "force-dynamic";

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Calendar, MapPin, Plus } from "lucide-react";
import { db } from "@/db";
import { trips, regions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AuthPrompt } from "@/components/ui/AuthPrompt";

const STATUS_LABEL: Record<string, string> = {
  planning: "Planning",
  confirmed: "Confirmed",
  active: "Active",
  completed: "Completed",
};

export default async function TripsIndexPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <AuthPrompt
        icon="fish"
        heading="Your Trips"
        description="Sign in to see every trip you've planned and pick up where you left off."
      />
    );
  }

  const rows = await db
    .select({ trip: trips, region: regions })
    .from(trips)
    .leftJoin(regions, eq(trips.regionId, regions.id))
    .where(eq(trips.ownerId, userId))
    .orderBy(trips.createdAt);

  return (
    <div className="pt-14 bg-[#F5F0E8] min-h-screen">
      <div className="relative bg-[#020B14] py-12 px-4 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#F5F0E8] mb-2">My Trips</h1>
            <p className="text-white/60 max-w-xl">Every trip you've planned, in one place.</p>
          </div>
          <Link href="/trips/new">
            <button className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
              <Plus className="h-4 w-4" /> New Trip
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-slate-500 mb-6">You haven't planned a trip yet.</p>
            <Link href="/trips/new">
              <button className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                Build a Trip Plan <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map(({ trip, region }) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-bold text-[#040F1C] mb-1">{trip.title}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    {region && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {region.name}
                      </span>
                    )}
                    {trip.startDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {trip.startDate}
                        {trip.endDate ? ` – ${trip.endDate}` : ""}
                      </span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                  {STATUS_LABEL[trip.status] ?? trip.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
