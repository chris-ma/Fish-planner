import { notFound } from "next/navigation";
import { CHALLENGES } from "@/lib/challenges";
import { db } from "@/db";
import { catchLog } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { RankedEntry } from "@/app/api/challenges/[slug]/entries/route";
import ChallengeDetailClient from "./ChallengeDetailClient";

export const dynamic = "force-dynamic";

type CatchRow = typeof catchLog.$inferSelect;

function buildEntries(rows: CatchRow[], metric: string): RankedEntry[] {
  if (metric === "length") {
    return rows
      .filter((r) => r.lengthCm != null)
      .sort((a, b) => (b.lengthCm ?? 0) - (a.lengthCm ?? 0))
      .map((r, i) => ({
        rank: i + 1,
        catcherName: r.catcherName,
        metric: r.lengthCm,
        speciesSlug: r.speciesSlug,
        location: r.location,
        caughtAt: r.caughtAt,
        lineWeightLb: r.lineWeightLb,
        gearUsed: r.gearUsed,
        photoUrl: r.photoUrl,
        notes: r.notes,
        id: r.id,
      }));
  }

  if (metric === "weight") {
    return rows
      .filter((r) => r.weightKg != null)
      .sort((a, b) => (b.weightKg ?? 0) - (a.weightKg ?? 0))
      .map((r, i) => ({
        rank: i + 1,
        catcherName: r.catcherName,
        metric: r.weightKg,
        speciesSlug: r.speciesSlug,
        location: r.location,
        caughtAt: r.caughtAt,
        lineWeightLb: r.lineWeightLb,
        gearUsed: r.gearUsed,
        photoUrl: r.photoUrl,
        notes: r.notes,
        id: r.id,
      }));
  }

  if (metric === "species_count") {
    const sessionMap = new Map<string, { catcherName: string; date: string; species: Set<string> }>();
    for (const r of rows) {
      const date = r.caughtAt.slice(0, 10);
      const key = `${r.catcherName}||${date}`;
      if (!sessionMap.has(key)) sessionMap.set(key, { catcherName: r.catcherName, date, species: new Set() });
      sessionMap.get(key)!.species.add(r.speciesSlug);
    }
    return Array.from(sessionMap.values())
      .sort((a, b) => b.species.size - a.species.size)
      .map((s, i) => ({
        rank: i + 1,
        catcherName: s.catcherName,
        metric: s.species.size,
        speciesSlug: Array.from(s.species).join(", "),
        location: null,
        caughtAt: s.date,
        lineWeightLb: null,
        gearUsed: null,
        photoUrl: null,
        notes: null,
        id: `${s.catcherName}-${s.date}`,
      }));
  }

  if (metric === "ratio") {
    return rows
      .filter((r) => r.lengthCm != null && r.lineWeightLb != null && r.lineWeightLb > 0)
      .sort((a, b) => (b.lengthCm! / b.lineWeightLb!) - (a.lengthCm! / a.lineWeightLb!))
      .map((r, i) => ({
        rank: i + 1,
        catcherName: r.catcherName,
        metric: Math.round((r.lengthCm! / r.lineWeightLb!) * 10) / 10,
        speciesSlug: r.speciesSlug,
        location: r.location,
        caughtAt: r.caughtAt,
        lineWeightLb: r.lineWeightLb,
        gearUsed: r.gearUsed,
        photoUrl: r.photoUrl,
        notes: r.notes,
        id: r.id,
      }));
  }

  // gallery — chronological, no rank
  return [...rows]
    .sort((a, b) => new Date(b.caughtAt).getTime() - new Date(a.caughtAt).getTime())
    .map((r) => ({
      rank: null,
      catcherName: r.catcherName,
      metric: null,
      speciesSlug: r.speciesSlug,
      location: r.location,
      caughtAt: r.caughtAt,
      lineWeightLb: r.lineWeightLb,
      gearUsed: r.gearUsed,
      photoUrl: r.photoUrl,
      notes: r.notes,
      id: r.id,
    }));
}

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const challenge = CHALLENGES.find((c) => c.slug === slug);
  if (!challenge) notFound();

  let entries: RankedEntry[] = [];
  try {
    const rows = await db.select().from(catchLog).where(eq(catchLog.challengeSlug, slug));
    entries = buildEntries(rows, challenge.metric);
  } catch {
    // DB unavailable or column missing — render empty leaderboard so the page still loads
  }

  return <ChallengeDetailClient challenge={challenge} initialEntries={entries} />;
}
