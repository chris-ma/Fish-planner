import { NextResponse } from "next/server";
import { db } from "@/db";
import { species, seasonWindows } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ratingScore, type Rating } from "@/lib/utils/season";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const month = parseInt(searchParams.get("month") ?? "0");

  const rows = await db.select().from(species).where(eq(species.slug, slug)).limit(1);
  const sp = rows[0];
  if (!sp) return NextResponse.json(null, { status: 404 });

  let bestRating: string | null = null;
  if (month >= 1 && month <= 12) {
    const windows = await db
      .select({ rating: seasonWindows.rating })
      .from(seasonWindows)
      .where(and(eq(seasonWindows.speciesId, sp.id), eq(seasonWindows.month, month)));

    if (windows.length > 0) {
      bestRating = windows.sort(
        (a, b) => ratingScore(b.rating as Rating) - ratingScore(a.rating as Rating)
      )[0].rating;
    }
  }

  return NextResponse.json({ ...sp, bestRating });
}
