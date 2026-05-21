import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTripById, getTripBookings } from "@/lib/queries/trips";
import { BookingsList } from "./BookingsList";

export default async function BookingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await getTripById(id);
  if (!trip) notFound();

  const bookings = await getTripBookings(id);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href={`/trips/${id}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to {trip.title}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">Store all your charters, accommodation, flights and confirmations.</p>
      </div>

      <BookingsList tripId={id} initialBookings={bookings} />
    </div>
  );
}
