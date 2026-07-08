// Fetches live month-based season data on every request; kept dynamic so builds
// never require database access.
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { catchLog } from "@/db/schema";
import { getTopRegionsWithStats } from "@/lib/queries/regions";
import { currentMonth } from "@/lib/utils/season";
import { HomeStoryClient, type HomeRegion } from "./HomeStoryClient";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const month = currentMonth();

  const [topRegions, challengeEntries] = await Promise.all([
    getTopRegionsWithStats(month, 3).catch(() => []),
    db
      .select({ id: catchLog.id })
      .from(catchLog)
      .where(eq(catchLog.speciesSlug, "flathead"))
      .then((rows) => rows.length)
      .catch(() => null),
  ]);

  const regions: HomeRegion[] = topRegions.map(({ region, speciesTracked, pct, label }) => ({
    slug: region.slug,
    name: region.name,
    state: region.state,
    speciesTracked,
    pct,
    label,
  }));

  return <HomeStoryClient regions={regions} challengeEntries={challengeEntries} />;
}
