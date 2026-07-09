import type { Metadata } from "next";
import { getCharters } from "@/lib/queries/charters";
import { CharterCard } from "@/components/discovery/CharterCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guided Fishing Charters",
  description:
    "Browse guided fishing charters and expert local operators across every Fish Tripper region — book a guide for your next trip.",
  alternates: { canonical: "/charters" },
};

export default async function ChartersIndexPage() {
  const allCharters = await getCharters();
  return (
    <div className="pt-14 bg-[#0F2635] min-h-screen">
      <div className="relative py-12 px-4 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-[#FFC423]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F2EDE2] mb-2">Guided Fishing Charters</h1>
          <p className="text-white/60 max-w-xl">
            Book with expert local operators — every charter we work with, in one place.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {allCharters.map((charter) => (
          <CharterCard key={charter.id} charter={charter} />
        ))}
      </div>
    </div>
  );
}
