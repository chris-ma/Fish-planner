import { NextResponse } from "next/server";
import { db } from "@/db";
import { tripBudgetItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const updates: Partial<typeof tripBudgetItems.$inferInsert> = {};
    if (body.description !== undefined) updates.description = body.description;
    if (body.amount !== undefined) updates.amount = Number(body.amount);
    if (body.paidAmount !== undefined) updates.paidAmount = Number(body.paidAmount);
    await db.update(tripBudgetItems).set(updates).where(eq(tripBudgetItems.id, itemId));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Budget PATCH failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { itemId } = await params;
    await db.delete(tripBudgetItems).where(eq(tripBudgetItems.id, itemId));
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Budget DELETE failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
