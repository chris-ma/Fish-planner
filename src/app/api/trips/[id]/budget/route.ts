import { NextResponse } from "next/server";
import { db } from "@/db";
import { tripBudgetItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";

async function ensureTable() {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS trip_budget_items (
      id TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 0,
      paid_amount REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;
    await ensureTable();
    const items = await db
      .select()
      .from(tripBudgetItems)
      .where(eq(tripBudgetItems.tripId, tripId))
      .orderBy(tripBudgetItems.createdAt);
    return NextResponse.json(items);
  } catch (err) {
    console.error("Budget GET failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;
    await ensureTable();
    const body = await request.json();
    const { category, description, amount } = body;
    if (!category || !description) {
      return NextResponse.json({ error: "category and description are required" }, { status: 400 });
    }
    const item = {
      id: nanoid(),
      tripId,
      category,
      description,
      amount: Number(amount) || 0,
      paidAmount: 0,
      createdAt: new Date().toISOString(),
    };
    await db.insert(tripBudgetItems).values(item);
    return NextResponse.json(item);
  } catch (err) {
    console.error("Budget POST failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
