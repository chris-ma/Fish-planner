export const dynamic = "force-dynamic";

import { listSpecies } from "@/lib/queries/species";
import { listRegions } from "@/lib/queries/regions";
import { PlanTabs } from "./PlanTabs";

export default async function PlanPage() {
  const [allSpecies, allRegions] = await Promise.all([
    listSpecies(),
    listRegions(),
  ]);

  return (
    <div>
      <div className="relative bg-[#020B14] py-12 px-4 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-64 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F5F0E8] mb-2">Explore</h1>
          <p className="text-white/60 max-w-xl">
            Browse species and destinations for your next Australian fishing trip.
          </p>
        </div>
      </div>
      <PlanTabs species={allSpecies} regions={allRegions} />
    </div>
  );
}
