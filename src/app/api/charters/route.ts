export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCharters } from "@/lib/queries/charters";

export async function GET() {
  try {
    const data = await getCharters();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
