export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { listSpecies } from "@/lib/queries/species";
import { OnboardingClient } from "./OnboardingClient";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  if (user.publicMetadata?.onboardingComplete === true) redirect("/");

  const allSpecies = await listSpecies();

  return <OnboardingClient species={allSpecies} />;
}
