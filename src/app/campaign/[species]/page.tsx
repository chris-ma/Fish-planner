// Fetches live month-based season data on every request; kept dynamic (like
// the homepage) so builds never require database access.
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { catchLog } from "@/db/schema";
import { getSpeciesStory } from "@/lib/species-stories";
import { getTopRegionsForSpecies } from "@/lib/queries/regions";
import { currentMonth } from "@/lib/utils/season";
import { SpeciesStoryClient } from "@/components/species-story/SpeciesStoryClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ species: string }> }): Promise<Metadata> {
  const { species } = await params;
  const story = getSpeciesStory(species);
  if (!story) return {};
  return {
    title: `${story.commonName} — ${story.ch1.titleLines[0]} ${story.ch1.titleLines[1]}`,
    description: story.ch1.body,
    alternates: { canonical: `/campaign/${story.speciesSlug}` },
  };
}

// Only GT's story currently sets a challengeSlug (3-meter-flatty, whose
// entries are actually keyed by catchLog.speciesSlug === "flathead" — same
// query the homepage already runs). Every other story has challengeSlug:
// null and never renders the challenge card. Wrapped in an async function
// (not a bare promise chain) so a synchronous throw from the lazy db proxy
// — e.g. no DB configured — is caught by try/catch instead of crashing
// the render.
async function getChallengeEntries(challengeSlug: string | null): Promise<number | null> {
  if (challengeSlug !== "3-meter-flatty") return null;
  try {
    const rows = await db.select({ id: catchLog.id }).from(catchLog).where(eq(catchLog.speciesSlug, "flathead"));
    return rows.length;
  } catch {
    return null;
  }
}

export default async function SpeciesCampaignPage({ params }: { params: Promise<{ species: string }> }) {
  const { species } = await params;
  const story = getSpeciesStory(species);
  if (!story) notFound();

  const month = currentMonth();
  const [regions, challengeEntries] = await Promise.all([
    getTopRegionsForSpecies(story.speciesSlug, month, 3).catch(() => []),
    getChallengeEntries(story.ch5.challengeSlug),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: story.commonName, path: `/campaign/${story.speciesSlug}` },
        ])}
      />
      <SpeciesStoryClient story={story} regions={regions} challengeEntries={challengeEntries} />
    </>
  );
}
