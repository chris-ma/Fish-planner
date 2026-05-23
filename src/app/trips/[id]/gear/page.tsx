import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTripById, getTripChecklist, getTripParticipants } from "@/lib/queries/trips";
import { GearChecklistClient } from "./GearChecklistClient";

export default async function TripGearPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await getTripById(id);
  if (!trip) notFound();

  const [checklist, participants] = await Promise.all([
    getTripChecklist(id),
    getTripParticipants(id),
  ]);
  const targetSpecies: string[] = trip.targetSpecies ? JSON.parse(trip.targetSpecies) : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href={`/trips/${id}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to {trip.title}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gear List</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your trip-specific tackle and packing checklist.
        </p>
      </div>

      <GearChecklistClient
        tripId={id}
        initialItems={checklist}
        targetSpecies={targetSpecies}
        participants={participants}
      />
    </div>
  );
}
