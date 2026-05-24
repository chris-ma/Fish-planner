import { db } from "@/db";
import { catchLog } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CHALLENGES, ChallengeMetric } from "@/lib/challenges";
import ChallengesIndexClient from "./ChallengesIndexClient";

export const dynamic = "force-dynamic";

type Leader = { catcherName: string; metric: number; unit: string } | null;

async function computeLeaderAndCount(
  slug: string,
  metric: ChallengeMetric,
  unit: string | null
): Promise<{ count: number; leader: Leader }> {
  try {
    const rows = await db.select().from(catchLog).where(eq(catchLog.challengeSlug, slug));
    if (rows.length === 0) return { count: 0, leader: null };

    if (metric === "length") {
      const sorted = rows
        .filter((r) => r.lengthCm != null)
        .sort((a, b) => (b.lengthCm ?? 0) - (a.lengthCm ?? 0));
      return {
        count: rows.length,
        leader: sorted[0]
          ? { catcherName: sorted[0].catcherName, metric: sorted[0].lengthCm!, unit: unit ?? "cm" }
          : null,
      };
    }

    if (metric === "weight") {
      const sorted = rows
        .filter((r) => r.weightKg != null)
        .sort((a, b) => (b.weightKg ?? 0) - (a.weightKg ?? 0));
      return {
        count: rows.length,
        leader: sorted[0]
          ? { catcherName: sorted[0].catcherName, metric: sorted[0].weightKg!, unit: unit ?? "kg" }
          : null,
      };
    }

    if (metric === "species_count") {
      const sessionMap = new Map<string, { catcherName: string; species: Set<string> }>();
      for (const r of rows) {
        const key = `${r.catcherName}||${r.caughtAt.slice(0, 10)}`;
        if (!sessionMap.has(key)) sessionMap.set(key, { catcherName: r.catcherName, species: new Set() });
        sessionMap.get(key)!.species.add(r.speciesSlug);
      }
      const sessions = Array.from(sessionMap.values()).sort((a, b) => b.species.size - a.species.size);
      return {
        count: rows.length,
        leader: sessions[0]
          ? { catcherName: sessions[0].catcherName, metric: sessions[0].species.size, unit: unit ?? "species" }
          : null,
      };
    }

    // gallery
    return { count: rows.length, leader: null };
  } catch {
    return { count: 0, leader: null };
  }
}

export default async function ChallengesPage() {
  const enriched = await Promise.all(
    CHALLENGES.map(async (c) => {
      const { count, leader } = await computeLeaderAndCount(c.slug, c.metric, c.unit);
      return { ...c, entryCount: count, leader };
    })
  );
  return <ChallengesIndexClient challenges={enriched} />;
}
