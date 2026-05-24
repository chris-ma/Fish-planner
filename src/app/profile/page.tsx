export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ProfileClient } from "./ProfileClient";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const user = await currentUser();
  if (!user) redirect("/");

  return (
    <ProfileClient
      userId={userId}
      email={user.emailAddresses[0]?.emailAddress ?? ""}
      firstName={user.firstName ?? ""}
      lastName={user.lastName ?? ""}
      imageUrl={user.imageUrl}
      location={(user.unsafeMetadata?.location as string) ?? ""}
    />
  );
}
