import { db } from "@/db";
import { trips, bookings, checklistItems, tripNotes, tripParticipants, tripTasks, regions, species } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function getTripById(id: string) {
  const rows = await db.select().from(trips).where(eq(trips.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getTripByShareCode(shareCode: string) {
  const rows = await db.select().from(trips).where(eq(trips.shareCode, shareCode)).limit(1);
  return rows[0] ?? null;
}

export async function getTripWithRegion(id: string) {
  const rows = await db
    .select({ trip: trips, region: regions })
    .from(trips)
    .leftJoin(regions, eq(trips.regionId, regions.id))
    .where(eq(trips.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createTrip(data: {
  title: string;
  ownerId?: string;
  regionId?: string;
  startDate?: string;
  endDate?: string;
  targetSpecies?: string[];
  description?: string;
}) {
  const id = nanoid();
  const shareCode = nanoid(8);

  await db.insert(trips).values({
    id,
    ownerId: data.ownerId ?? null,
    title: data.title,
    regionId: data.regionId ?? null,
    startDate: data.startDate ?? null,
    endDate: data.endDate ?? null,
    targetSpecies: data.targetSpecies ? JSON.stringify(data.targetSpecies) : null,
    description: data.description ?? null,
    shareCode,
    status: "planning",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return { id, shareCode };
}

export async function getTripsByOwner(ownerId: string) {
  return db
    .select()
    .from(trips)
    .where(eq(trips.ownerId, ownerId))
    .orderBy(trips.createdAt);
}

export async function getTripBookings(tripId: string) {
  return db.select().from(bookings).where(eq(bookings.tripId, tripId)).orderBy(bookings.createdAt);
}

export async function createBooking(data: {
  tripId: string;
  type: string;
  title: string;
  providerName?: string;
  confirmationRef?: string;
  bookingDate?: string;
  costAud?: number;
  notes?: string;
}) {
  const id = nanoid();
  await db.insert(bookings).values({
    id,
    tripId: data.tripId,
    type: data.type,
    title: data.title,
    providerName: data.providerName ?? null,
    confirmationRef: data.confirmationRef ?? null,
    bookingDate: data.bookingDate ?? null,
    startDatetime: null,
    endDatetime: null,
    costAud: data.costAud ?? null,
    notes: data.notes ?? null,
    createdAt: new Date().toISOString(),
  });
  return id;
}

export async function getTripChecklist(tripId: string) {
  return db.select().from(checklistItems).where(eq(checklistItems.tripId, tripId)).orderBy(checklistItems.category, checklistItems.createdAt);
}

export async function toggleChecklistItem(itemId: string, completed: boolean) {
  await db.update(checklistItems).set({ isCompleted: completed }).where(eq(checklistItems.id, itemId));
}

export async function generateGearListForTrip(tripId: string, tripTypes: string[]) {
  const { getGearForSpeciesSlugs } = await import("./gear");

  const templates = tripTypes.length > 0
    ? await (async () => {
        const { db } = await import("@/db");
        const { gearTemplates } = await import("@/db/schema");
        const { or, eq, inArray } = await import("drizzle-orm");
        return db.select().from(gearTemplates).where(
          or(eq(gearTemplates.tripType, "all"), inArray(gearTemplates.tripType, tripTypes))
        );
      })()
    : [];

  const items = templates.map((t) => ({
    id: nanoid(),
    tripId,
    category: t.category,
    itemName: t.itemName,
    quantity: t.quantity ?? 1,
    isCompleted: false,
    fromTemplate: true,
    assignedTo: null,
    createdAt: new Date().toISOString(),
  }));

  if (items.length > 0) {
    await db.insert(checklistItems).values(items);
  }

  return items.length;
}

export async function getTripParticipants(tripId: string) {
  return db.select().from(tripParticipants).where(eq(tripParticipants.tripId, tripId)).orderBy(tripParticipants.joinedAt);
}

export async function getTripNotes(tripId: string) {
  return db.select().from(tripNotes).where(eq(tripNotes.tripId, tripId)).orderBy(tripNotes.isPinned, tripNotes.createdAt);
}

export async function getTripTasks(tripId: string) {
  return db.select().from(tripTasks).where(eq(tripTasks.tripId, tripId)).orderBy(tripTasks.createdAt);
}
