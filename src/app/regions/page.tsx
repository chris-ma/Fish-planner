import type { Metadata } from "next";
import { listRegions } from "@/lib/queries/regions";
import { RegionCard } from "@/components/discovery/RegionCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fishing Regions & Destinations",
  description:
    "Browse every fishing region and destination covered by Fish Tripper — seasonal calendars, top species, and trip planning guides for each location.",
  alternates: { canonical: "/regions" },
};

export default async function RegionsIndexPage() {
  const allRegions = await listRegions();
  return (
    <div className="bg-[#EAE2D0] min-h-screen">
      <div className="relative bg-[#0A1C28] pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-[#C99A3E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#EAE2D0] mb-2">Fishing Regions</h1>
          <p className="text-white/60 max-w-xl">
            Browse every region we cover — seasonal windows, top species, and trip planning guides.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {allRegions.map((region) => (
          <RegionCard key={region.id} region={region} />
        ))}
      </div>
    </div>
  );
}
