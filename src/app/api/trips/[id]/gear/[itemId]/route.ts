import { NextResponse } from "next/server";
import { db } from "@/db";
import { checklistItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const { isCompleted } = body;

    await db
      .update(checklistItems)
      .set({ isCompleted: isCompleted === true })
      .where(eq(checklistItems.id, itemId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Toggle item failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
