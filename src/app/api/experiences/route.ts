import { NextResponse } from "next/server";
import { getExperiences } from "@/lib/queries/experiences";

export async function GET() {
  try {
    const data = await getExperiences();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch experiences:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
