import { NextResponse } from "next/server";
import { db } from "@/db";
import { tripNotes } from "@/db/schema";
import { nanoid } from "nanoid";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { authorName, content } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const note = {
    id: nanoid(),
    tripId: id,
    authorName: authorName?.trim() || "Anonymous",
    content: content.trim(),
    isPinned: false,
    createdAt: new Date().toISOString(),
  };

  await db.insert(tripNotes).values(note);
  return NextResponse.json(note);
}
