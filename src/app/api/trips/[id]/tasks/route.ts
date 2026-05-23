import { NextResponse } from "next/server";
import { db } from "@/db";
import { tripTasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tasks = await db.select().from(tripTasks).where(eq(tripTasks.tripId, id)).orderBy(tripTasks.createdAt);
  return NextResponse.json(tasks);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title, assignedTo } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  const task = {
    id: nanoid(),
    tripId: id,
    title: title.trim(),
    assignedTo: assignedTo ?? null,
    isComplete: false,
    needsApproval: false,
    isApproved: false,
    createdAt: new Date().toISOString(),
  };

  await db.insert(tripTasks).values(task);
  return NextResponse.json(task);
}
