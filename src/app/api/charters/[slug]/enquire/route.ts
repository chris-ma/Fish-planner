export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCharterBySlug, createCharterEnquiry } from "@/lib/queries/charters";
import { sendCharterEnquiryToOperator, sendCharterEnquiryConfirmation } from "@/lib/email";
import { charterEnquiries } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const charter = await getCharterBySlug(slug);
  if (!charter) return NextResponse.json({ error: "Charter not found" }, { status: 404 });

  const body = await req.json();
  const { guestName, guestEmail, guestPhone, preferredDateFrom, preferredDateTo, guestCount, skillLevel, message } = body;

  if (!guestName || !guestEmail || !preferredDateFrom || !preferredDateTo || !guestCount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { userId } = await auth();

  const enquiryId = await createCharterEnquiry({
    charterId: charter.id,
    userId: userId ?? undefined,
    guestName,
    guestEmail,
    guestPhone: guestPhone || undefined,
    preferredDateFrom,
    preferredDateTo,
    guestCount: Number(guestCount),
    skillLevel: skillLevel || undefined,
    message: message || undefined,
  });

  // Fetch the saved enquiry for emails
  const rows = await db.select().from(charterEnquiries).where(eq(charterEnquiries.id, enquiryId)).limit(1);
  const enquiry = rows[0];

  if (enquiry) {
    await Promise.allSettled([
      sendCharterEnquiryToOperator(charter, enquiry),
      sendCharterEnquiryConfirmation(charter, enquiry),
    ]);
  }

  return NextResponse.json({ ok: true, enquiryId });
}
