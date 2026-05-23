import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTripById, getTripParticipants } from "@/lib/queries/trips";
import { db } from "@/db";
import { tripBudgetItems } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { BudgetClient } from "./BudgetClient";

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

export default async function TripBudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await getTripById(id);
  if (!trip) notFound();

  await ensureTable();

  const [items, participants] = await Promise.all([
    db.select().from(tripBudgetItems).where(eq(tripBudgetItems.tripId, id)).orderBy(tripBudgetItems.createdAt),
    getTripParticipants(id),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href={`/trips/${id}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to {trip.title}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Budget</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track costs and split them across your crew.
        </p>
      </div>

      <BudgetClient
        tripId={id}
        initialItems={items}
        participantCount={participants.length}
      />
    </div>
  );
}
