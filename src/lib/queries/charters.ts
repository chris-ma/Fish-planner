import { db } from "@/db";
import { charters, charterEnquiries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { CHARTERS } from "@/db/seed/charters";

async function seedCharters() {
  const existing = await db.select({ id: charters.id }).from(charters).limit(1);
  if (existing.length > 0) return;

  await db
    .insert(charters)
    .values(
      CHARTERS.map((c) => ({
        id: `chr-${c.slug}`,
        slug: c.slug,
        name: c.name,
        operatorName: c.operatorName,
        operatorEmail: c.operatorEmail,
        operatorPhone: c.operatorPhone ?? null,
        description: c.description ?? null,
        experienceSlug: c.experienceSlug ?? null,
        homePort: c.homePort,
        boatName: c.boatName ?? null,
        boatType: c.boatType ?? null,
        maxGuests: c.maxGuests,
        durationDays: c.durationDays,
        priceLabel: c.priceLabel ?? null,
        featured: c.featured,
      }))
    )
    .onConflictDoNothing();
}

export async function getCharters() {
  await seedCharters();
  return db.select().from(charters).orderBy(charters.featured, charters.name);
}

export async function getCharterBySlug(slug: string) {
  await seedCharters();
  const rows = await db.select().from(charters).where(eq(charters.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function createCharterEnquiry(data: {
  charterId: string;
  userId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  preferredDateFrom: string;
  preferredDateTo: string;
  guestCount: number;
  skillLevel?: string;
  message?: string;
}) {
  const id = nanoid();
  await db.insert(charterEnquiries).values({
    id,
    charterId: data.charterId,
    userId: data.userId ?? null,
    guestName: data.guestName,
    guestEmail: data.guestEmail,
    guestPhone: data.guestPhone ?? null,
    preferredDateFrom: data.preferredDateFrom,
    preferredDateTo: data.preferredDateTo,
    guestCount: data.guestCount,
    skillLevel: data.skillLevel ?? null,
    message: data.message ?? null,
    status: "pending",
  });
  return id;
}
