import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.run(sql`ALTER TABLE catch_log ADD COLUMN challenge_slug TEXT`);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // Column already exists is fine
    if (msg.includes("duplicate column")) return NextResponse.json({ ok: true, note: "already exists" });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
