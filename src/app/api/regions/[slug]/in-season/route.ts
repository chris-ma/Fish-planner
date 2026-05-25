export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getRegionBySlug, getSeasonCalendarForRegion } from "@/lib/queries/regions";
import { getSpeciesImage } from "@/lib/images";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") ?? "1");

    const region = await getRegionBySlug(slug);
    if (!region) return NextResponse.json([]);

    const calendarRows = await getSeasonCalendarForRegion(region.id);
    const inSeason = calendarRows
      .filter(row => row.months[month] === "peak" || row.months[month] === "good")
      .map(row => ({
        id: row.speciesId,
        slug: row.speciesSlug,
        commonName: row.commonName,
        category: row.category,
        rating: row.months[month],
        imageUrl: getSpeciesImage(row.speciesSlug, row.category, 600),
      }));

    return NextResponse.json(inSeason);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
