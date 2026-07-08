export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { listSpecies } from "@/lib/queries/species";
import { ProfileClient } from "./ProfileClient";

export const metadata: Metadata = {
  title: "Your Profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const user = await currentUser();
  if (!user) redirect("/");

  const allSpecies = await listSpecies();

  return (
    <ProfileClient
      userId={userId}
      email={user.emailAddresses[0]?.emailAddress ?? ""}
      firstName={user.firstName ?? ""}
      lastName={user.lastName ?? ""}
      imageUrl={user.imageUrl}
      nickname={(user.unsafeMetadata?.nickname as string) ?? ""}
      avatarUrl={(user.unsafeMetadata?.avatarUrl as string) ?? ""}
      location={(user.unsafeMetadata?.location as string) ?? ""}
      locationCoords={(user.unsafeMetadata?.locationCoords as { lat: number; lng: number }) ?? null}
      dreamFish={(user.unsafeMetadata?.dreamFish as string) ?? ""}
      mySetup={(user.unsafeMetadata?.mySetup as object) ?? null}
      allSpecies={allSpecies}
    />
  );
}
