"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTH_NAMES_FULL } from "@/lib/utils/season";

interface IntentSearchProps {
  speciesList: { slug: string; commonName: string }[];
  regionList: { slug: string; name: string; state: string; zone: string }[];
}

type Mode = "species" | "destination";

export function IntentSearch({ speciesList, regionList }: IntentSearchProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("species");
  const [speciesSlug, setSpeciesSlug] = useState("");
  const [regionSlug, setRegionSlug] = useState("");
  const [month, setMonth] = useState("");

  const resetFields = () => {
    setSpeciesSlug("");
    setRegionSlug("");
    setMonth("");
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    resetFields();
  };

  const canSearch = speciesSlug && regionSlug && month;

  const handleSearch = () => {
    if (!canSearch) return;
    if (mode === "destination") {
      router.push(
        `/trips/new?region=${regionSlug}&species=${speciesSlug}&month=${month}`
      );
    } else {
      const region = regionList.find((r) => r.slug === regionSlug);
      const regionDisplayName = region ? `${region.name}, ${region.state}` : regionSlug;
      router.push(
        `/species/${speciesSlug}?region=${regionSlug}&regionName=${encodeURIComponent(regionDisplayName)}&month=${month}`
      );
    }
  };

  const selectClass =
    "border-0 border-b-2 border-slate-200 rounded-none shadow-none px-1 h-9 bg-transparent font-semibold text-[#040F1C] data-[placeholder]:text-slate-400 hover:border-slate-400 focus:border-[#0D9488] transition-colors text-base";

  const toggleBase = "px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors";
  const toggleActive = `${toggleBase} bg-[#0D9488] text-white`;
  const toggleInactive = `${toggleBase} bg-slate-100 text-slate-600 hover:bg-slate-200`;

  return (
    <div className="bg-[#F5F0E8] rounded-2xl shadow-2xl border border-slate-100 px-6 pt-5 pb-5 w-full max-w-2xl">
      {/* Mode toggle */}
      <div className="flex gap-2 mb-5">
        <button
          type="button"
          onClick={() => switchMode("destination")}
          className={mode === "destination" ? toggleActive : toggleInactive}
        >
          By Destination
        </button>
        <button
          type="button"
          onClick={() => switchMode("species")}
          className={mode === "species" ? toggleActive : toggleInactive}
        >
          By Species
        </button>
      </div>

      {/* Desktop: inline sentence style */}
      <div className="hidden sm:flex items-end gap-x-2 gap-y-3 flex-wrap leading-none">
        {mode === "destination" ? (
          <>
            <span className="text-slate-500 text-sm pb-1.5 whitespace-nowrap">I want to fish around</span>

            <div className="min-w-[160px] flex-1">
              <Select value={regionSlug} onValueChange={setRegionSlug}>
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="where are you thinking?" />
                </SelectTrigger>
                <SelectContent>
                  {regionList.map((r) => (
                    <SelectItem key={r.slug} value={r.slug}>
                      {r.name} — {r.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <span className="text-slate-500 text-sm pb-1.5 whitespace-nowrap">for</span>

            <div className="min-w-[150px] flex-1">
              <Select value={speciesSlug} onValueChange={setSpeciesSlug}>
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="what do you want to target?" />
                </SelectTrigger>
                <SelectContent>
                  {speciesList.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>
                      {s.commonName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <span className="text-slate-500 text-sm pb-1.5 whitespace-nowrap">in</span>

            <div className="min-w-[110px]">
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="a month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_NAMES_FULL.slice(1).map((name, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <>
            <span className="text-slate-500 text-sm pb-1.5 whitespace-nowrap">I want to catch</span>

            <div className="min-w-[150px] flex-1">
              <Select value={speciesSlug} onValueChange={setSpeciesSlug}>
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="choose a species" />
                </SelectTrigger>
                <SelectContent>
                  {speciesList.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>
                      {s.commonName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <span className="text-slate-500 text-sm pb-1.5 whitespace-nowrap">around</span>

            <div className="min-w-[160px] flex-1">
              <Select value={regionSlug} onValueChange={setRegionSlug}>
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="choose a location" />
                </SelectTrigger>
                <SelectContent>
                  {regionList.map((r) => (
                    <SelectItem key={r.slug} value={r.slug}>
                      {r.name} — {r.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <span className="text-slate-500 text-sm pb-1.5 whitespace-nowrap">in</span>

            <div className="min-w-[110px]">
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="a month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_NAMES_FULL.slice(1).map((name, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      {/* Mobile: stacked layout */}
      <div className="flex sm:hidden flex-col gap-3">
        {mode === "destination" ? (
          <>
            <Select value={regionSlug} onValueChange={setRegionSlug}>
              <SelectTrigger className="h-12 rounded-xl border-slate-200 text-base">
                <SelectValue placeholder="Where are you thinking?" />
              </SelectTrigger>
              <SelectContent>
                {regionList.map((r) => (
                  <SelectItem key={r.slug} value={r.slug}>
                    {r.name} — {r.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={speciesSlug} onValueChange={setSpeciesSlug}>
              <SelectTrigger className="h-12 rounded-xl border-slate-200 text-base">
                <SelectValue placeholder="What do you want to target?" />
              </SelectTrigger>
              <SelectContent>
                {speciesList.map((s) => (
                  <SelectItem key={s.slug} value={s.slug}>
                    {s.commonName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ) : (
          <>
            <Select value={speciesSlug} onValueChange={setSpeciesSlug}>
              <SelectTrigger className="h-12 rounded-xl border-slate-200 text-base">
                <SelectValue placeholder="Choose a species…" />
              </SelectTrigger>
              <SelectContent>
                {speciesList.map((s) => (
                  <SelectItem key={s.slug} value={s.slug}>
                    {s.commonName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={regionSlug} onValueChange={setRegionSlug}>
              <SelectTrigger className="h-12 rounded-xl border-slate-200 text-base">
                <SelectValue placeholder="Choose a location…" />
              </SelectTrigger>
              <SelectContent>
                {regionList.map((r) => (
                  <SelectItem key={r.slug} value={r.slug}>
                    {r.name} — {r.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="h-12 rounded-xl border-slate-200 text-base">
            <SelectValue placeholder="Select a month…" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_NAMES_FULL.slice(1).map((name, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSearch}
          disabled={!canSearch}
          className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          Build My Trip Plan
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
