"use client";

import { useState } from "react";

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

function project(lat: number, lng: number): [number, number] {
  const x = Math.round((lng - 113) / 41 * 800);
  const y = Math.round((1 - (lat + 44.5) / 34) * 700);
  return [x, y];
}

// Simplified mainland Australia coastline polygon (clockwise from Cape York)
const MAINLAND =
  "576,4 640,132 663,181 706,218 747,274 782,333 788,348 " +
  "792,379 778,430 745,482 740,492 726,519 720,548 " +
  "683,562 663,575 652,589 " +       // VIC: Lakes Entrance → Sale → Wilsons Prom
  "613,576 599,577 558,575 " +       // Apollo Bay, Portland
  "542,568 523,550 " +               // SA border, Robe
  "505,519 498,517 " +               // Murray mouth area, Victor Harbor
  "447,498 479,464 " +               // Coffin Bay / Port Lincoln, Whyalla
  "402,453 312,439 " +               // SA bight, WA/SA border
  "176,484 98,505 " +                // WA south, Albany
  "53,480 57,441 " +                 // Perth south, Perth
  "31,379 20,319 22,235 " +          // Geraldton, Shark Bay, Exmouth
  "74,210 109,202 180,153 " +        // Karratha, Port Hedland, Broome
  "312,109 347,41 464,35 " +         // WA/NT border, Darwin, Arnhem NE
  "461,134 517,143 523,114 556,41";  // Gulf of Carpentaria, Cape York base

// Tasmania
const TASMANIA = "691,626 663,684 640,682 624,627";

export function AustraliaMap({ regions, monthName }: AustraliaMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4">
        <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
        <h2 className="text-2xl font-bold text-[#040F1C]">Top spots in {monthName}</h2>
        <p className="text-sm text-slate-500 mt-1">
          Highest-rated destinations based on seasonal species activity.
        </p>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-[#020B14] h-[340px] md:h-[420px]">
        <svg
          viewBox="0 0 800 700"
          className="w-full h-full"
          style={{ display: "block" }}
        >
          <defs>
            <style>{`
              @keyframes map-pulse {
                0%   { r: 8;  opacity: 0.5; }
                100% { r: 22; opacity: 0;   }
              }
            `}</style>
          </defs>

          {/* Subtle grid dots for ocean texture */}
          {Array.from({ length: 12 }).map((_, yi) =>
            Array.from({ length: 14 }).map((_, xi) => (
              <circle
                key={`${xi}-${yi}`}
                cx={xi * 62 + 20}
                cy={yi * 60 + 20}
                r="1"
                fill="#1E3A5F"
                opacity="0.4"
              />
            ))
          )}

          {/* Mainland Australia */}
          <polygon
            points={MAINLAND}
            fill="#0D1B2A"
            stroke="#1E3A5F"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Tasmania */}
          <polygon
            points={TASMANIA}
            fill="#0D1B2A"
            stroke="#1E3A5F"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Region dots */}
          {regions.filter(r => r.latitude != null && r.longitude != null).map((region) => {
            const [x, y] = project(region.latitude!, region.longitude!);
            const isHovered = hoveredId === region.id;
            const labelRight = x > 580;

            return (
              <a
                key={region.id}
                href={`/regions/${region.slug}`}
                onMouseEnter={() => setHoveredId(region.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Animated pulse ring */}
                <circle cx={x} cy={y} r="8" fill="none" stroke="#0D9488" strokeWidth="1.5" opacity="0.5">
                  <animate attributeName="r" from="8" to="22" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="2.5s" repeatCount="indefinite" />
                </circle>

                {/* Core dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 10 : 7}
                  fill="#0D9488"
                  opacity="0.95"
                  style={{ transition: "r 0.15s" }}
                />

                {/* Hover label */}
                {isHovered && (
                  <g>
                    <rect
                      x={labelRight ? x - region.name.length * 7 - 18 : x + 12}
                      y={y - 14}
                      width={region.name.length * 7 + 16}
                      height={26}
                      rx="5"
                      fill="#020B14"
                      stroke="#0D9488"
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      x={labelRight ? x - region.name.length * 7 - 10 : x + 20}
                      y={y + 4}
                      fill="white"
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="system-ui, sans-serif"
                    >
                      {region.name}
                    </text>
                  </g>
                )}
              </a>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-white/40 text-[10px]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488] inline-block" />
          Top region this month
        </div>
      </div>
    </div>
  );
}
