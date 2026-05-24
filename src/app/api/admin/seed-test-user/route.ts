import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clerkClient();
    const user = await client.users.createUser({
      emailAddress: ["test@hookline.app"],
      password: "TestAngler123!",
      firstName: "Test",
      lastName: "Angler",
      unsafeMetadata: { location: "Sydney, NSW" },
      publicMetadata: { onboardingComplete: true },
    });
    return NextResponse.json({ ok: true, userId: user.id, email: "test@hookline.app" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
