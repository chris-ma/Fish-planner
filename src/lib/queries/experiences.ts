import { db } from "@/db";
import { experiences, destinations, experienceDestinations, seasonWindows, species, regions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { EXPERIENCES } from "@/db/seed/experiences";

async function seedExperiences() {
  const existing = await db.select({ id: experiences.id }).from(experiences).limit(1);
  if (existing.length > 0) return;

  await db
    .insert(experiences)
    .values(
      EXPERIENCES.map((e) => ({
        id: `exp-${e.slug}`,
        slug: e.slug,
        name: e.name,
        description: e.description ?? null,
        category: e.category,
        targetSpeciesSlugs: JSON.stringify(e.targetSpeciesSlugs),
        primaryTechniqueSlug: e.primaryTechniqueSlug ?? null,
      }))
    )
    .onConflictDoNothing();
}

export async function getExperiences() {
  await seedExperiences();
  return db.select().from(experiences).orderBy(experiences.category, experiences.name);
}

export async function getExperienceBySlug(slug: string) {
  await seedExperiences();
  const rows = await db.select().from(experiences).where(eq(experiences.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getRegionSpeciesSlugs(): Promise<{ regionId: string; speciesSlug: string }[]> {
  return db
    .selectDistinct({ regionId: seasonWindows.regionId, speciesSlug: species.slug })
    .from(seasonWindows)
    .innerJoin(species, eq(seasonWindows.speciesId, species.id));
}

export async function getDestinationsForExperience(experienceId: string, regionId: string) {
  return db
    .select({ destination: destinations })
    .from(experienceDestinations)
    .innerJoin(destinations, eq(experienceDestinations.destinationId, destinations.id))
    .where(
      and(
        eq(experienceDestinations.experienceId, experienceId),
        eq(destinations.regionId, regionId)
      )
    );
}

export async function getDestinationsForExperienceAllRegions(experienceId: string) {
  return db
    .select({ destination: destinations, region: regions })
    .from(experienceDestinations)
    .innerJoin(destinations, eq(experienceDestinations.destinationId, destinations.id))
    .innerJoin(regions, eq(destinations.regionId, regions.id))
    .where(eq(experienceDestinations.experienceId, experienceId));
}
