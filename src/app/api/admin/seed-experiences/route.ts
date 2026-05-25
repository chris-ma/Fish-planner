export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { experiences } from "@/db/schema";
import { EXPERIENCES } from "@/db/seed/experiences";

export async function GET() {
  try {
    const values = EXPERIENCES.map((e) => ({
      id: `exp-${e.slug}`,
      slug: e.slug,
      name: e.name,
      description: e.description ?? null,
      category: e.category,
      targetSpeciesSlugs: JSON.stringify(e.targetSpeciesSlugs),
      primaryTechniqueSlug: e.primaryTechniqueSlug ?? null,
    }));

    await db.insert(experiences).values(values).onConflictDoNothing();

    const all = await db.select({ slug: experiences.slug }).from(experiences);
    return NextResponse.json({ ok: true, total: all.length });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
