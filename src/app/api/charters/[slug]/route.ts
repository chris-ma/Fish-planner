export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCharterBySlug } from "@/lib/queries/charters";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const charter = await getCharterBySlug(slug);
  if (!charter) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(charter);
}
