export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { listSpecies } from "@/lib/queries/species";
import { BucketListClient } from "./BucketListClient";
import { AuthPrompt } from "@/components/ui/AuthPrompt";

export default async function BucketListPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <AuthPrompt
        icon="target"
        heading="Your Bucket List"
        description="Track every species you've caught and discover what's left on your list."
      />
    );
  }

  const species = await listSpecies();
  return <BucketListClient species={species} />;
}
