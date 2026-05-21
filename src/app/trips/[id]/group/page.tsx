import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTripById, getTripParticipants, getTripChecklist } from "@/lib/queries/trips";
import { GroupClient } from "./GroupClient";

export default async function TripGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await getTripById(id);
  if (!trip) notFound();

  const [participants, checklist] = await Promise.all([
    getTripParticipants(id),
    getTripChecklist(id),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href={`/trips/${id}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to {trip.title}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Group</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your crew and share the trip link.</p>
      </div>

      <GroupClient tripId={id} initialParticipants={participants} checklist={checklist} />
    </div>
  );
}
