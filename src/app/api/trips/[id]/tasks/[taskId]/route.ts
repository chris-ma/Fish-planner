import { NextResponse } from "next/server";
import { db } from "@/db";
import { tripTasks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  const { taskId } = await params;
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  if (body.isComplete !== undefined) updates.isComplete = body.isComplete;
  if (body.assignedTo !== undefined) updates.assignedTo = body.assignedTo;
  if (body.needsApproval !== undefined) updates.needsApproval = body.needsApproval;
  if (body.isApproved !== undefined) updates.isApproved = body.isApproved;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await db.update(tripTasks).set(updates).where(eq(tripTasks.id, taskId));
  return NextResponse.json({ ok: true });
}
