import { NextResponse } from "next/server";
import { db } from "@/db";
import { catchLog } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(catchLog).where(eq(catchLog.id, id));
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Catch DELETE failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
