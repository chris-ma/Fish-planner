"use client";

import dynamic from "next/dynamic";

interface Region {
  id: string;
  slug: string;
  name: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
}

interface AustraliaMapProps {
  regions: Region[];
  monthName: string;
}

const AustraliaMapInner = dynamic(() => import("./AustraliaMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0B1D2A] animate-pulse" />
  ),
});

export function AustraliaMap({ regions, monthName }: AustraliaMapProps) {
  return (
    <div>
      <div className="mb-4">
        <div className="h-1 w-12 bg-[#FFC423] rounded mb-3" />
        <h2 className="text-2xl font-bold text-[#0F2635]">Top spots in {monthName}</h2>
        <p className="text-sm text-slate-500 mt-1">
          Highest-rated destinations based on seasonal species activity.
        </p>
      </div>

      <div className="relative rounded-2xl overflow-hidden h-[340px] md:h-[460px]">
        <AustraliaMapInner regions={regions} />

        {/* Legend */}
        <div className="absolute bottom-3 right-3 z-[1000] flex items-center gap-2 bg-[#0B1D2A]/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-white/50 text-[10px]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFC423] inline-block" />
          Top region this month
        </div>
      </div>
    </div>
  );
}
