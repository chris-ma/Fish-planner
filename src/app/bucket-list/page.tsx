export const dynamic = "force-dynamic";

import { listSpecies } from "@/lib/queries/species";
import { BucketListClient } from "./BucketListClient";

export default async function BucketListPage() {
  const species = await listSpecies();
  return <BucketListClient species={species} />;
}
