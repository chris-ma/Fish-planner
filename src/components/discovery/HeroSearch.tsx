"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Fish, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { MONTH_NAMES_FULL } from "@/lib/utils/season";

interface HeroSearchProps {
  speciesList: { slug: string; commonName: string }[];
  regionList: { slug: string; name: string; state: string }[];
}

type SearchMode = "species" | "location" | "month";

export function HeroSearch({ speciesList, regionList }: HeroSearchProps) {
  const router = useRouter();
  const [mode, setMode] = useState<SearchMode>("species");
  const [speciesSlug, setSpeciesSlug] = useState("");
  const [regionSlug, setRegionSlug] = useState("");
  const [month, setMonth] = useState("");

  const handleSearch = () => {
    if (mode === "species" && speciesSlug) {
      router.push(`/species/${speciesSlug}`);
    } else if (mode === "location" && regionSlug) {
      router.push(`/regions/${regionSlug}`);
    } else if (mode === "month" && month) {
      router.push(`/?month=${month}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border p-6 w-full max-w-2xl">
      {/* Mode tabs */}
      <div className="flex gap-1 mb-5 bg-slate-100 rounded-xl p-1">
        {(
          [
            { mode: "species" as const, icon: Fish, label: "By Species" },
            { mode: "location" as const, icon: MapPin, label: "By Location" },
            { mode: "month" as const, icon: Calendar, label: "By Month" },
          ] as const
        ).map(({ mode: m, icon: Icon, label }) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
              mode === m
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="flex gap-3">
        <div className="flex-1">
          {mode === "species" && (
            <Select value={speciesSlug} onValueChange={setSpeciesSlug}>
              <SelectTrigger className="h-11 text-base">
                <SelectValue placeholder="Select a target species…" />
              </SelectTrigger>
              <SelectContent>
                {speciesList.map((s) => (
                  <SelectItem key={s.slug} value={s.slug}>
                    {s.commonName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {mode === "location" && (
            <Select value={regionSlug} onValueChange={setRegionSlug}>
              <SelectTrigger className="h-11 text-base">
                <SelectValue placeholder="Select a region or town…" />
              </SelectTrigger>
              <SelectContent>
                {regionList.map((r) => (
                  <SelectItem key={r.slug} value={r.slug}>
                    {r.name} — {r.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {mode === "month" && (
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="h-11 text-base">
                <SelectValue placeholder="Select a month to plan around…" />
              </SelectTrigger>
              <SelectContent>
                {MONTH_NAMES_FULL.slice(1).map((name, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Button
          size="lg"
          onClick={handleSearch}
          disabled={
            (mode === "species" && !speciesSlug) ||
            (mode === "location" && !regionSlug) ||
            (mode === "month" && !month)
          }
          className="h-11 px-5"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Search</span>
        </Button>
      </div>
    </div>
  );
}
