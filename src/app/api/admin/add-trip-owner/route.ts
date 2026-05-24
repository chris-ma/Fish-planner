export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await db.run(sql`ALTER TABLE trips ADD COLUMN owner_id TEXT`);
    return NextResponse.json({ ok: true, message: "Added owner_id column to trips" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // "duplicate column" means it already exists — that's fine
    if (msg.includes("duplicate column")) {
      return NextResponse.json({ ok: true, message: "Column already exists" });
    }
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
