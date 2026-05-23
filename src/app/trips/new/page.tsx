"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Loader2, X, ChevronLeft, ChevronRight, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { currentMonth, MONTH_NAMES_FULL } from "@/lib/utils/season";
import { SPECIES_OPTIONS, REGION_OPTIONS } from "@/lib/data/options";
import { SPECIES_GEAR } from "@/lib/gear-specs";

// ── Which zones each species is active in ────────────────────────────────────
const SPECIES_ACTIVE_ZONES: Record<string, string[]> = {
  "Black Marlin": ["far_north_qld", "central_qld"],
  "Blue Marlin": ["far_north_qld", "central_qld", "southeast_qld", "nsw", "lord_howe"],
  "Sailfish": ["far_north_qld", "central_qld", "southeast_qld"],
  "Yellowfin Tuna": ["far_north_qld", "central_qld", "southeast_qld", "nsw", "lord_howe", "christmas_island", "cocos_islands"],
  "Longtail Tuna": ["far_north_qld", "central_qld", "southeast_qld", "nsw"],
  "Spanish Mackerel": ["far_north_qld", "central_qld", "southeast_qld", "nsw", "nt_top_end", "nt_gulf", "wa_kimberley", "wa_pilbara", "wa_mid_west"],
  "Wahoo": ["far_north_qld", "central_qld", "southeast_qld", "lord_howe", "christmas_island", "cocos_islands"],
  "Mahi-Mahi": ["far_north_qld", "central_qld", "southeast_qld", "nsw", "lord_howe", "christmas_island", "cocos_islands"],
  "Southern Bluefin Tuna": ["vic_coast", "tas", "nsw", "sa_south"],
  "Yellowtail Kingfish": ["nsw", "southeast_qld", "vic_coast", "wa_southwest"],
  "Giant Trevally": ["far_north_qld", "central_qld", "southeast_qld", "lord_howe", "nt_top_end", "nt_gulf", "wa_kimberley", "wa_pilbara", "christmas_island", "cocos_islands"],
  "Cobia": ["far_north_qld", "central_qld", "southeast_qld", "nt_top_end", "wa_kimberley"],
  "Tailor": ["nsw", "southeast_qld", "vic_coast", "wa_mid_west", "wa_southwest"],
  "Australian Salmon": ["nsw", "vic_coast", "tas", "sa_south", "wa_southwest"],
  "Gummy Shark": ["vic_coast", "tas", "nsw", "sa_spencer_gulf", "sa_south", "wa_southwest"],
  "Coral Trout": ["far_north_qld", "central_qld", "southeast_qld", "nt_top_end", "wa_kimberley", "wa_pilbara"],
  "Red Emperor": ["far_north_qld", "central_qld", "nt_top_end", "wa_kimberley", "wa_pilbara"],
  "Nannygai": ["far_north_qld", "central_qld", "southeast_qld", "nsw"],
  "Snapper": ["nsw", "southeast_qld", "vic_coast", "tas", "central_qld", "wa_mid_west", "wa_southwest", "sa_spencer_gulf", "sa_south"],
  "Amberjack (Samson Fish)": ["nsw", "southeast_qld"],
  "Blue-eye Trevalla": ["nsw", "vic_coast", "tas"],
  "Striped Trumpeter": ["tas", "vic_coast"],
  "Barramundi": ["far_north_qld", "central_qld", "nt_top_end", "nt_gulf", "wa_kimberley"],
  "Mangrove Jack": ["far_north_qld", "central_qld", "southeast_qld", "nt_top_end", "nt_gulf", "wa_kimberley"],
  "Flathead": ["nsw", "southeast_qld", "vic_coast", "sa_south", "wa_southwest"],
  "Mulloway": ["nsw", "southeast_qld", "vic_coast", "sa_south", "wa_southwest"],
  "Bream": ["nsw", "southeast_qld", "vic_coast", "sa_south"],
  "Whiting": ["nsw", "southeast_qld", "vic_coast", "sa_south", "wa_southwest"],
  "Luderick": ["nsw", "southeast_qld", "vic_coast"],
  "Black Jewfish": ["far_north_qld", "central_qld", "nt_top_end"],
  "Murray Cod": ["murray_darling"],
  "Golden Perch": ["murray_darling"],
  "Silver Perch": ["murray_darling"],
  "Australian Bass": ["nsw", "southeast_qld"],
  "Brown Trout": ["alpine", "tas"],
  "Rainbow Trout": ["alpine", "tas"],
  "Redfin": ["murray_darling", "alpine", "vic_coast"],
  "Saratoga": ["far_north_qld", "nt_top_end"],
  "Catfish": ["murray_darling"],
  "Ocean Trout": ["tas", "alpine"],
  "Queenfish": ["nt_top_end", "nt_gulf", "wa_kimberley", "far_north_qld", "central_qld"],
  "Threadfin Salmon": ["nt_top_end", "nt_gulf", "wa_kimberley", "far_north_qld"],
  "Dhufish": ["wa_southwest", "wa_mid_west", "wa_pilbara"],
  "Baldchin Groper": ["wa_southwest", "wa_mid_west"],
  "King George Whiting": ["sa_spencer_gulf", "sa_south", "wa_southwest", "vic_coast"],
  "Black Bream": ["nsw", "vic_coast", "sa_south", "wa_southwest"],
  "Spangled Emperor": ["far_north_qld", "central_qld", "nt_top_end", "wa_kimberley", "wa_pilbara"],
  "Rankin Cod": ["wa_kimberley", "wa_pilbara", "wa_mid_west"],
  "Bonefish": ["christmas_island", "cocos_islands", "nt_top_end"],
  "Milkfish": ["christmas_island", "cocos_islands"],
};

const STEP_TITLES: Record<number, string> = {
  1: "Name your trip",
  2: "When are you going?",
  3: "Where are you headed?",
  4: "What do you want to catch?",
  5: "Review & create",
};

const TIME_SLOTS = ["Morning", "Afternoon", "Evening", "Night"] as const;
type TimeSlot = typeof TIME_SLOTS[number];
type SlotData = { activity: string; species: string[] };
type Itinerary = Record<string, Record<TimeSlot, SlotData>>;

// Fishing activities — these show the species picker
const FISHING_ACTIVITIES = new Set(["Boat", "Land-based", "Charter", "Kayak"]);
const ACTIVITIES = ["Boat", "Land-based", "Charter", "Kayak", "Travelling", "Eating", "Rest", "Change Location", "Free Time", "Other"] as const;

function emptyDay(): Record<TimeSlot, SlotData> {
  return TIME_SLOTS.reduce((acc, s) => ({ ...acc, [s]: { activity: "", species: [] } }), {} as Record<TimeSlot, SlotData>);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDaysInRange(start: string, end: string): Date[] {
  const days: Date[] = [];
  const s = new Date(start + "T12:00:00");
  const e = new Date(end + "T12:00:00");
  const current = new Date(s);
  while (current <= e) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function toDateKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatDateKey(key: string): string {
  return new Date(key + "T12:00:00").toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// ── CalendarPicker ────────────────────────────────────────────────────────────

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"];

function CalendarPicker({
  startDate,
  endDate,
  onSelect,
}: {
  startDate: string;
  endDate: string;
  onSelect: (start: string, end: string) => void;
}) {
  const now = new Date();
  const [displayYear, setDisplayYear] = useState(
    startDate ? new Date(startDate + "T12:00:00").getFullYear() : now.getFullYear()
  );
  const [displayMonth, setDisplayMonth] = useState(
    startDate ? new Date(startDate + "T12:00:00").getMonth() : now.getMonth()
  );
  const [selecting, setSelecting] = useState<"start" | "end">(startDate ? "end" : "start");

  function prevMonth() {
    if (displayMonth === 0) { setDisplayMonth(11); setDisplayYear(y => y - 1); }
    else setDisplayMonth(m => m - 1);
  }
  function nextMonth() {
    if (displayMonth === 11) { setDisplayMonth(0); setDisplayYear(y => y + 1); }
    else setDisplayMonth(m => m + 1);
  }

  const firstDay = new Date(displayYear, displayMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

  function handleDayClick(day: number) {
    const dateStr = `${displayYear}-${String(displayMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (selecting === "start" || !startDate) {
      onSelect(dateStr, "");
      setSelecting("end");
    } else {
      if (dateStr < startDate) {
        onSelect(dateStr, "");
        setSelecting("end");
      } else {
        onSelect(startDate, dateStr);
        setSelecting("start");
      }
    }
  }

  function getDayStyle(day: number): string {
    const dateStr = `${displayYear}-${String(displayMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isStart = dateStr === startDate;
    const isEnd = dateStr === endDate;
    const inRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
    if (isStart || isEnd) return "bg-[#0D9488] text-white rounded-full font-semibold";
    if (inRange) return "bg-teal-100 text-teal-800";
    return "hover:bg-slate-100 rounded-full";
  }

  const dayCount = startDate && endDate
    ? getDaysInRange(startDate, endDate).length
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-lg">
          <ChevronLeft className="h-4 w-4 text-slate-500" />
        </button>
        <span className="text-sm font-semibold text-[#040F1C]">
          {MONTH_NAMES[displayMonth]} {displayYear}
        </span>
        <button type="button" onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-lg">
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-slate-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => handleDayClick(day)}
            className={`text-center text-sm py-1.5 transition-colors w-full ${getDayStyle(day)}`}
          >
            {day}
          </button>
        ))}
      </div>

      {startDate && (
        <div className="mt-4 text-sm text-[#040F1C]">
          {endDate ? (
            <span className="font-medium">
              {new Date(startDate + "T12:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
              {" → "}
              {new Date(endDate + "T12:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
              {dayCount ? ` (${dayCount} day${dayCount !== 1 ? "s" : ""})` : ""}
            </span>
          ) : (
            <span className="text-slate-500">Select end date…</span>
          )}
        </div>
      )}
    </div>
  );
}

// ── StepProgress ──────────────────────────────────────────────────────────────

function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-1.5 flex-1 mr-3">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i + 1 <= current ? "bg-[#0D9488]" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{current} of {total}</span>
    </div>
  );
}

// ── AddSpeciesButton ──────────────────────────────────────────────────────────

function AddSpeciesButton({
  available,
  onAdd,
}: {
  available: string[];
  onAdd: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-dashed border-slate-300 text-slate-400 text-xs hover:border-[#0D9488] hover:text-[#0D9488] transition-colors"
      >
        <Plus className="h-3 w-3" /> Add species
      </button>
      {open && (
        <div className="absolute left-0 top-7 z-20 w-52 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {available.map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => { onAdd(sp); setOpen(false); }}
              className="block w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-[#0D9488]"
            >
              {sp}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── NewTripForm ───────────────────────────────────────────────────────────────

function NewTripForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedSpecies, setSelectedSpecies] = useState<string[]>(() => {
    const s = searchParams.get("species");
    return s && SPECIES_OPTIONS.includes(s) ? [s] : [];
  });

  const [selectedRegions, setSelectedRegions] = useState<string[]>(() => {
    const r = searchParams.get("region");
    return r ? [r] : [];
  });
  const [regionSearch, setRegionSearch] = useState("");
  const [dayLocations, setDayLocations] = useState<Record<string, string>>({});
  const [itinerary, setItinerary] = useState<Itinerary>({});

  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const activeZonesFromSpecies = useMemo(() => {
    if (selectedSpecies.length === 0) return new Set<string>();
    const zones = new Set<string>();
    selectedSpecies.forEach((sp) => {
      (SPECIES_ACTIVE_ZONES[sp] ?? []).forEach((z) => zones.add(z));
    });
    return zones;
  }, [selectedSpecies]);

  // Zones from all selected regions
  const selectedZones = useMemo(() => {
    return new Set(
      selectedRegions.flatMap((slug) => {
        const zone = REGION_OPTIONS.find((r) => r.slug === slug)?.zone;
        return zone ? [zone] : [];
      })
    );
  }, [selectedRegions]);

  const filteredSpecies = useMemo(() => {
    if (selectedZones.size === 0) return SPECIES_OPTIONS;
    return SPECIES_OPTIONS.filter((sp) =>
      (SPECIES_ACTIVE_ZONES[sp] ?? []).some((z) => selectedZones.has(z))
    );
  }, [selectedZones]);

  const filteredRegions = useMemo(() => {
    let regions = REGION_OPTIONS;
    if (activeZonesFromSpecies.size > 0) {
      regions = regions.filter((r) => activeZonesFromSpecies.has(r.zone));
    }
    if (regionSearch.trim()) {
      const q = regionSearch.toLowerCase();
      regions = regions.filter((r) => r.name.toLowerCase().includes(q));
    }
    return regions;
  }, [activeZonesFromSpecies, regionSearch]);

  const hasDateRange = form.startDate && form.endDate;
  const daysInRange = hasDateRange ? getDaysInRange(form.startDate, form.endDate) : [];
  const useItinerary = daysInRange.length > 0 && daysInRange.length <= 10;

  const itinerarySpecies = useMemo(() => {
    const names = new Set<string>();
    Object.values(itinerary).forEach((slots) => {
      Object.values(slots).forEach((slotData) => slotData.species.forEach((s) => names.add(s)));
    });
    return Array.from(names);
  }, [itinerary]);

  const allSelectedSpecies = useMemo(() => {
    const combined = new Set([...selectedSpecies, ...itinerarySpecies]);
    return Array.from(combined);
  }, [selectedSpecies, itinerarySpecies]);

  const toggleSpecies = (name: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
    // Drop any selected regions that no longer match the new species selection
    const newSelection = selectedSpecies.includes(name)
      ? selectedSpecies.filter((s) => s !== name)
      : [...selectedSpecies, name];
    const allZones = new Set(newSelection.flatMap((sp) => SPECIES_ACTIVE_ZONES[sp] ?? []));
    if (allZones.size > 0) {
      setSelectedRegions((prev) =>
        prev.filter((slug) => {
          const zone = REGION_OPTIONS.find((r) => r.slug === slug)?.zone;
          return zone && allZones.has(zone);
        })
      );
    }
  };

  const toggleRegion = (slug: string) => {
    setSelectedRegions((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  function setSlotActivity(dayKey: string, slot: TimeSlot, activity: string) {
    setItinerary((prev) => {
      const day = prev[dayKey] ?? emptyDay();
      const current = day[slot];
      return {
        ...prev,
        [dayKey]: {
          ...day,
          [slot]: { ...current, activity, species: !FISHING_ACTIVITIES.has(activity) ? [] : current.species },
        },
      };
    });
  }

  function addToSlot(dayKey: string, slot: TimeSlot, name: string) {
    setItinerary((prev) => {
      const day = prev[dayKey] ?? emptyDay();
      if (day[slot].species.includes(name)) return prev;
      return { ...prev, [dayKey]: { ...day, [slot]: { ...day[slot], species: [...day[slot].species, name] } } };
    });
  }

  function removeFromSlot(dayKey: string, slot: TimeSlot, name: string) {
    setItinerary((prev) => {
      const day = prev[dayKey];
      if (!day) return prev;
      return { ...prev, [dayKey]: { ...day, [slot]: { ...day[slot], species: day[slot].species.filter((s) => s !== name) } } };
    });
  }

  const canAdvance: Record<number, boolean> = {
    1: form.title.trim().length > 0,
    2: true,
    3: true,
    4: true,
    5: false,
  };

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError("Give your trip a name.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const descriptionPayload = JSON.stringify({
        notes: form.description,
        itinerary,
        regionSlugs: selectedRegions,
        dayLocations,
      });

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          regionSlug: selectedRegions[0] || undefined,
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          targetSpecies: allSelectedSpecies,
          description: descriptionPayload,
        }),
      });
      if (!res.ok) throw new Error("Failed to create trip");
      const { id } = await res.json();
      router.push(`/trips/${id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const month = currentMonth();

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-[#020B14] py-12 px-4 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto relative z-10">
          <p className="text-white/50 text-sm mb-2">No account needed</p>
          <h1 className="text-4xl font-bold text-[#F5F0E8] mb-2">Plan a Trip</h1>
          <p className="text-white/60">Create a shareable workspace for your crew in seconds.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-[#F5F0E8] rounded-2xl p-6 shadow-sm border border-slate-100">
          <StepProgress current={currentStep} total={5} />

          <h2 className="text-2xl font-bold text-[#040F1C] mb-6">
            {currentStep === 4 && useItinerary ? "Plan your days" : STEP_TITLES[currentStep]}
          </h2>

          {/* Step 1: Trip name */}
          {currentStep === 1 && (
            <div className="space-y-2">
              <Label htmlFor="title">Trip name *</Label>
              <Input
                id="title"
                placeholder="e.g. Cairns Marlin Trip 2025"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && canAdvance[1] && goNext()}
                className="h-11"
              />
            </div>
          )}

          {/* Step 2: Dates */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <CalendarPicker
                startDate={form.startDate}
                endDate={form.endDate}
                onSelect={(s, e) => setForm((f) => ({ ...f, startDate: s, endDate: e }))}
              />
              <p className="text-xs text-[#0F766E] bg-teal-50 rounded-xl px-4 py-2.5">
                {MONTH_NAMES_FULL[month]} is an active month for many Australian coastal species.
              </p>
            </div>
          )}

          {/* Step 3: Locations (multi-select) */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-500">Select one or more destinations. You can assign each day to a location in step 4.</p>

              {/* Selected region chips */}
              {selectedRegions.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-1">
                  {selectedRegions.map((slug) => {
                    const region = REGION_OPTIONS.find((r) => r.slug === slug);
                    if (!region) return null;
                    return (
                      <span key={slug} className="flex items-center gap-1 px-3 py-1 bg-[#0D9488] text-white rounded-full text-sm font-medium">
                        {region.name}
                        <button type="button" onClick={() => toggleRegion(slug)} className="ml-0.5 hover:text-white/70">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setSelectedRegions([])}
                    className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 self-center"
                  >
                    <X className="h-3 w-3" /> Clear all
                  </button>
                </div>
              )}

              {/* Search input */}
              <Input
                placeholder="Search regions…"
                value={regionSearch}
                onChange={(e) => setRegionSearch(e.target.value)}
                className="h-9"
              />

              {activeZonesFromSpecies.size > 0 && filteredRegions.length < REGION_OPTIONS.length && (
                <p className="text-xs text-[#0F766E]">
                  Showing {filteredRegions.length} region{filteredRegions.length !== 1 ? "s" : ""} where your target species are active
                </p>
              )}

              {/* Scrollable region list */}
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {filteredRegions.map((r) => {
                  const selected = selectedRegions.includes(r.slug);
                  return (
                    <button
                      key={r.slug}
                      type="button"
                      onClick={() => toggleRegion(r.slug)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm border transition-all flex items-center justify-between ${
                        selected
                          ? "border-[#0D9488] bg-teal-50 text-[#0F766E] font-medium"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {r.name}
                      {selected && (
                        <span className="w-4 h-4 rounded-full bg-[#0D9488] flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5 text-white" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Itinerary / Species */}
          {currentStep === 4 && (
            <div className="space-y-3">
              {useItinerary ? (
                <>
                  <p className="text-xs text-slate-500 mb-3">
                    Plan each day. Boat / Land-based / Charter / Kayak slots reveal a species picker.
                  </p>
                  <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                    {daysInRange.map((day) => {
                      const dayKey = toDateKey(day);
                      const dayData = itinerary[dayKey] ?? emptyDay();
                      return (
                        <div key={dayKey} className="border border-slate-200 rounded-xl p-3 bg-white space-y-3">
                          {/* Day header + location selector */}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <p className="text-sm font-semibold text-[#040F1C]">{formatDateKey(dayKey)}</p>
                            {selectedRegions.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {selectedRegions.map((slug) => {
                                  const region = REGION_OPTIONS.find((r) => r.slug === slug);
                                  if (!region) return null;
                                  const active = dayLocations[dayKey] === slug;
                                  return (
                                    <button
                                      key={slug}
                                      type="button"
                                      onClick={() =>
                                        setDayLocations((prev) => ({
                                          ...prev,
                                          [dayKey]: active ? "" : slug,
                                        }))
                                      }
                                      className={`px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all ${
                                        active
                                          ? "bg-blue-500 text-white border-blue-500"
                                          : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                                      }`}
                                    >
                                      {region.name}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Time slots */}
                          {TIME_SLOTS.map((slot) => {
                            const slotData = dayData[slot] ?? { activity: "", species: [] };
                            const isFishing = FISHING_ACTIVITIES.has(slotData.activity);
                            return (
                              <div key={slot} className="flex items-start gap-2">
                                <span className="text-xs text-slate-400 w-20 pt-1 shrink-0">{slot}</span>
                                <div className="flex-1 space-y-1.5">
                                  <div className="flex flex-wrap gap-1">
                                    {ACTIVITIES.map((act) => (
                                      <button
                                        key={act}
                                        type="button"
                                        onClick={() =>
                                          setSlotActivity(dayKey, slot, slotData.activity === act ? "" : act)
                                        }
                                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all ${
                                          slotData.activity === act
                                            ? "bg-[#0D9488] text-white border-[#0D9488]"
                                            : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                                        }`}
                                      >
                                        {act}
                                      </button>
                                    ))}
                                  </div>
                                  {isFishing && (
                                    <div className="flex flex-wrap gap-1 pt-0.5">
                                      {slotData.species.map((sp) => (
                                        <span
                                          key={sp}
                                          className="flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-[#0F766E] border border-teal-200 rounded-full text-xs"
                                        >
                                          {sp}
                                          <button
                                            type="button"
                                            onClick={() => removeFromSlot(dayKey, slot, sp)}
                                            className="ml-0.5 hover:text-red-500"
                                          >
                                            ×
                                          </button>
                                        </span>
                                      ))}
                                      <AddSpeciesButton
                                        available={filteredSpecies.filter((s) => !slotData.species.includes(s))}
                                        onAdd={(name) => addToSlot(dayKey, slot, name)}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <Label>Target species</Label>
                    {selectedSpecies.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedSpecies([])}
                        className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                      >
                        <X className="h-3 w-3" /> Clear all
                      </button>
                    )}
                  </div>
                  {selectedRegions.length > 0 && filteredSpecies.length < SPECIES_OPTIONS.length && (
                    <p className="text-xs text-[#0F766E]">
                      Showing {filteredSpecies.length} species active in the selected region{selectedRegions.length !== 1 ? "s" : ""}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {filteredSpecies.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleSpecies(name)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                          selectedSpecies.includes(name)
                            ? "bg-[#0D9488] text-white border-[#0D9488]"
                            : "border-slate-200 text-slate-600 hover:border-[#0D9488] hover:text-[#0F766E]"
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 5: Gear preview + notes + submit */}
          {currentStep === 5 && (
            <div className="space-y-4">
              {allSelectedSpecies.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Gear Preview</p>
                  {allSelectedSpecies.map((name) => {
                    const gear = SPECIES_GEAR.find((g) => g.name === name);
                    if (!gear) return null;
                    return (
                      <div key={name} className="text-sm">
                        <span className="font-medium text-[#040F1C]">{name}: </span>
                        <span className="text-slate-500">{gear.rod} · {gear.mainline}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedRegions.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Destinations</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegions.map((slug) => {
                      const region = REGION_OPTIONS.find((r) => r.slug === slug);
                      return region ? (
                        <span key={slug} className="px-3 py-1 rounded-full text-sm bg-teal-50 text-[#0F766E] border border-teal-200">
                          {region.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Notes (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Any notes about the trip, charter, or plan…"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                type="button"
                size="lg"
                className="w-full gap-2"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating trip…</>
                ) : (
                  <>Create Trip Plan <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={goBack}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-0 disabled:pointer-events-none transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            {currentStep < 5 && (
              <button
                type="button"
                onClick={goNext}
                disabled={!canAdvance[currentStep]}
                className="inline-flex items-center gap-1.5 bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewTripPage() {
  return (
    <Suspense fallback={null}>
      <NewTripForm />
    </Suspense>
  );
}
