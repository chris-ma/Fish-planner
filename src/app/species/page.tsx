import type { Metadata } from "next";
import { listSpecies } from "@/lib/queries/species";
import { SpeciesBrowser } from "@/components/discovery/SpeciesBrowser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fish Species Guide | Fish Tripper",
  description:
    "Browse all Australian fish species. Seasonal guides, fishing tactics, and gear recommendations for every species.",
};

export default async function SpeciesIndexPage() {
  const allSpecies = await listSpecies();
  return <SpeciesBrowser species={allSpecies} />;
}
