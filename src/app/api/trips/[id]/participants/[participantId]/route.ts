import { NextResponse } from "next/server";
import { db } from "@/db";
import { tripParticipants } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  const { participantId } = await params;
  const body = await req.json();
  const { availability } = body;

  if (!["going", "tentative", "out"].includes(availability)) {
    return NextResponse.json({ error: "Invalid availability" }, { status: 400 });
  }

  await db
    .update(tripParticipants)
    .set({ availability })
    .where(eq(tripParticipants.id, participantId));

  return NextResponse.json({ ok: true });
}
