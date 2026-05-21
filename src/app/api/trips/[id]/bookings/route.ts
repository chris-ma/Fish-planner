import { NextResponse } from "next/server";
import { createBooking, getTripById } from "@/lib/queries/trips";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tripId } = await params;
    const trip = await getTripById(tripId);
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    const body = await request.json();
    const { type, title, providerName, confirmationRef, bookingDate, costAud, notes } = body;

    if (!title || !type) {
      return NextResponse.json({ error: "Type and title are required" }, { status: 400 });
    }

    const id = await createBooking({ tripId, type, title, providerName, confirmationRef, bookingDate, costAud, notes });

    const rows = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("Booking creation failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
