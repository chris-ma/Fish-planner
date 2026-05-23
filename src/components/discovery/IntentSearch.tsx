"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SPECIES_OPTIONS, REGION_OPTIONS } from "@/lib/data/options";

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function IntentSearch() {
  const router = useRouter();
  const [mode, setMode] = useState<"species" | "location">("species");

  function handleSelect(value: string) {
    if (!value) return;
    if (mode === "species") {
      router.push(`/species/${toSlug(value)}`);
    } else {
      router.push(`/regions/${value}`);
    }
  }

  return (
    <div className="w-full max-w-lg px-2">
      {/* Liquid Glass outer shell */}
      <div
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-b from-white/18 to-white/8 border border-white/30 p-5"
        style={{
          boxShadow:
            "0 12px 48px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Mode toggle pills */}
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={() => setMode("species")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              mode === "species"
                ? "bg-[#0D9488] text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Species
          </button>
          <button
            onClick={() => setMode("location")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              mode === "location"
                ? "bg-[#0D9488] text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Location
          </button>
        </div>

        {/* Dropdown */}
        <div className="relative">
          <select
            key={mode}
            defaultValue=""
            onChange={(e) => handleSelect(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40 text-sm cursor-pointer appearance-none"
            style={{ WebkitAppearance: "none" }}
          >
            <option value="" disabled style={{ color: "#555", background: "#0a1628" }}>
              {mode === "species" ? "Choose a species…" : "Choose a location…"}
            </option>
            {mode === "species"
              ? SPECIES_OPTIONS.map((name) => (
                  <option key={name} value={name} style={{ color: "#fff", background: "#0a1628" }}>
                    {name}
                  </option>
                ))
              : REGION_OPTIONS.map((r) => (
                  <option key={r.slug} value={r.slug} style={{ color: "#fff", background: "#0a1628" }}>
                    {r.name}
                  </option>
                ))}
          </select>
          {/* Chevron icon */}
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <svg className="h-4 w-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
