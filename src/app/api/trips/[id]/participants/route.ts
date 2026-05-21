import { NextResponse } from "next/server";
import { db } from "@/db";
import { tripParticipants } from "@/db/schema";
import { getTripById } from "@/lib/queries/trips";
import { nanoid } from "nanoid";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tripId } = await params;
    const trip = await getTripById(tripId);
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    const body = await request.json();
    const { name, role } = body;
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const id = nanoid();
    const participant = {
      id,
      tripId,
      name: String(name).trim(),
      role: role ?? "crew",
      joinedAt: new Date().toISOString(),
    };

    await db.insert(tripParticipants).values(participant).onConflictDoNothing();
    return NextResponse.json(participant);
  } catch (err) {
    console.error("Add participant failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
