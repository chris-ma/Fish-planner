import { NextResponse } from "next/server";
import { db } from "@/db";
import { catchLog } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { CHALLENGES } from "@/lib/challenges";

export const dynamic = "force-dynamic";

export type RankedEntry = {
  rank: number | null;
  catcherName: string;
  metric: number | null;
  speciesSlug: string;
  location: string | null;
  caughtAt: string;
  lineWeightLb: number | null;
  gearUsed: string | null;
  photoUrl: string | null;
  notes: string | null;
  id: string;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const challenge = CHALLENGES.find((c) => c.slug === slug);
  if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 });

  // bucket_list challenges pull from existing bucket list catches rather than manual submissions
  const rows = await db
    .select()
    .from(catchLog)
    .where(
      challenge.dataSource === "bucket_list"
        ? challenge.speciesSlug
          ? eq(catchLog.speciesSlug, challenge.speciesSlug)
          : isNull(catchLog.challengeSlug)
        : eq(catchLog.challengeSlug, slug)
    );

  let entries: RankedEntry[] = [];

  if (challenge.metric === "length") {
    const sorted = rows
      .filter((r) => r.lengthCm != null)
      .sort((a, b) => (b.lengthCm ?? 0) - (a.lengthCm ?? 0));
    entries = sorted.map((r, i) => ({
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

  } else if (challenge.metric === "weight") {
    const sorted = rows
      .filter((r) => r.weightKg != null)
      .sort((a, b) => (b.weightKg ?? 0) - (a.weightKg ?? 0));
    entries = sorted.map((r, i) => ({
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

  } else if (challenge.metric === "species_count") {
    // Group by catcherName + date, count distinct species per session
    const sessionMap = new Map<string, { catcherName: string; date: string; species: Set<string> }>();
    for (const r of rows) {
      const date = r.caughtAt.slice(0, 10);
      const key = `${r.catcherName}||${date}`;
      if (!sessionMap.has(key)) {
        sessionMap.set(key, { catcherName: r.catcherName, date, species: new Set() });
      }
      sessionMap.get(key)!.species.add(r.speciesSlug);
    }
    const sessions = Array.from(sessionMap.values())
      .sort((a, b) => b.species.size - a.species.size);
    entries = sessions.map((s, i) => ({
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

  } else if (challenge.metric === "ratio") {
    const sorted = rows
      .filter((r) => r.lengthCm != null && r.lineWeightLb != null && r.lineWeightLb > 0)
      .sort((a, b) => (b.lengthCm! / b.lineWeightLb!) - (a.lengthCm! / a.lineWeightLb!));
    entries = sorted.map((r, i) => ({
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

  } else {
    // gallery — chronological, no rank
    const sorted = [...rows].sort(
      (a, b) => new Date(b.caughtAt).getTime() - new Date(a.caughtAt).getTime()
    );
    entries = sorted.map((r) => ({
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

  return NextResponse.json({ entries, totalCount: entries.length, challenge });
}
