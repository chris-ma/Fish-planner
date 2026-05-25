"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { AuthPrompt } from "@/components/ui/AuthPrompt";
import { ArrowRight, ArrowLeft, Loader2, X, ChevronLeft, ChevronRight, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currentMonth, MONTH_NAMES_FULL } from "@/lib/utils/season";
import { SPECIES_OPTIONS, REGION_OPTIONS } from "@/lib/data/options";
import { SPECIES_GEAR } from "@/lib/gear-specs";

const SLUG_TO_SPECIES_NAME: Record<string, string> = {
  "black-marlin": "Black Marlin", "blue-marlin": "Blue Marlin", "sailfish": "Sailfish",
  "yellowfin-tuna": "Yellowfin Tuna", "longtail-tuna": "Longtail Tuna", "spanish-mackerel": "Spanish Mackerel",
  "wahoo": "Wahoo", "mahi-mahi": "Mahi-Mahi", "southern-bluefin-tuna": "Southern Bluefin Tuna",
  "yellowtail-kingfish": "Yellowtail Kingfish", "giant-trevally": "Giant Trevally", "cobia": "Cobia",
  "tailor": "Tailor", "australian-salmon": "Australian Salmon", "gummy-shark": "Gummy Shark",
  "coral-trout": "Coral Trout", "red-emperor": "Red Emperor", "nannygai": "Nannygai", "snapper": "Snapper",
  "blue-eye-trevalla": "Blue-eye Trevalla", "striped-trumpeter": "Striped Trumpeter",
  "barramundi": "Barramundi", "mangrove-jack": "Mangrove Jack", "flathead": "Flathead",
  "mulloway": "Mulloway", "bream": "Bream", "whiting": "Whiting",
  "murray-cod": "Murray Cod", "golden-perch": "Golden Perch", "silver-perch": "Silver Perch",
  "australian-bass": "Australian Bass", "brown-trout": "Brown Trout", "rainbow-trout": "Rainbow Trout",
  "redfin": "Redfin", "saratoga": "Saratoga", "ocean-trout": "Ocean Trout",
  "queenfish": "Queenfish", "threadfin-salmon": "Threadfin Salmon", "dhufish": "Dhufish",
  "baldchin-groper": "Baldchin Groper", "bonefish": "Bonefish", "milkfish": "Milkfish",
  "calamari-squid": "Calamari / Squid", "yellowtail-scad": "Yellowtail Scad",
  "hapuku-groper": "Hapuku / Groper", "blue-cod": "Blue Cod", "tarakihi": "Tarakihi",
  "blue-moki": "Blue Moki", "john-dory": "John Dory",
};

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
  4: "What experience are you after?",
  5: "What do you want to catch?",
  6: "Review & create",
};

type ScheduleEvent = { id: string; startTime: string; endTime: string; activity: string; species: string[] };
type Itinerary = Record<string, ScheduleEvent[]>;

// Fishing activities — these show the species picker
const FISHING_ACTIVITIES = new Set(["Boat", "Land-based", "Charter", "Kayak"]);
const ACTIVITIES = ["Boat", "Land-based", "Charter", "Kayak", "Travelling", "Eating", "Rest", "Change Location", "Free Time", "Other"] as const;

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

  const dayCount = startDate && endDate ? getDaysInRange(startDate, endDate).length : null;

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

  // Schedule event dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDayKey, setDialogDayKey] = useState("");
  const [eventForm, setEventForm] = useState({
    activity: "",
    species: [] as string[],
    startTime: "06:00",
    endTime: "12:00",
  });

  type TripSummary = { id: string; title: string; status: string; startDate: string | null; endDate: string | null; createdAt: string };
  const [myTrips, setMyTrips] = useState<TripSummary[]>([]);
  useEffect(() => {
    fetch("/api/trips").then((r) => r.ok ? r.json() : []).then((data) => {
      if (Array.isArray(data)) setMyTrips(data);
    }).catch(() => {});
  }, []);

  type ExperienceRow = { id: string; slug: string; name: string; description: string | null; category: string; targetSpeciesSlugs: string; primaryTechniqueSlug: string | null };
  type DestinationRow = { id: string; slug: string; name: string; description: string | null };

  const [experiences, setExperiences] = useState<ExperienceRow[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceRow | null>(null);
  const [fromExperienceUrl, setFromExperienceUrl] = useState(false);
  const [regionSpeciesMap, setRegionSpeciesMap] = useState<Record<string, string[]>>({});
  const [destinations, setDestinations] = useState<DestinationRow[]>([]);
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/experiences").then(r => r.ok ? r.json() : []).then((data: ExperienceRow[]) => {
      if (Array.isArray(data)) {
        setExperiences(data);
        const expSlug = searchParams.get("experience");
        if (expSlug && data.length > 0) {
          const match = data.find((e: ExperienceRow) => e.slug === expSlug);
          if (match) {
            setSelectedExperience(match);
            setForm(f => ({ ...f, title: match.name }));
            setFromExperienceUrl(true);
          }
        }
      }
    }).catch(() => {});
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/regions/species-map")
      .then(r => r.json())
      .then((map: Record<string, string[]>) => setRegionSpeciesMap(map))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedRegions.length === 0) { setDestinations([]); return; }
    const slug = selectedRegions[0];
    fetch(`/api/destinations?regionSlug=${encodeURIComponent(slug)}`).then(r => r.ok ? r.json() : []).then(data => {
      if (Array.isArray(data)) setDestinations(data);
    }).catch(() => {});
  }, [selectedRegions]);

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
    Object.values(itinerary).forEach((events) => {
      events.forEach((evt) => evt.species.forEach((s) => names.add(s)));
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

  // Schedule event functions
  function openDialog(dayKey: string) {
    setDialogDayKey(dayKey);
    setEventForm({ activity: "", species: [], startTime: "06:00", endTime: "12:00" });
    setDialogOpen(true);
  }

  function removeEvent(dayKey: string, eventId: string) {
    setItinerary((prev) => ({
      ...prev,
      [dayKey]: (prev[dayKey] ?? []).filter((e) => e.id !== eventId),
    }));
  }

  function toggleEventSpecies(name: string) {
    setEventForm((f) => ({
      ...f,
      species: f.species.includes(name) ? f.species.filter((s) => s !== name) : [...f.species, name],
    }));
  }

  function saveEvent() {
    if (!eventForm.activity) return;
    const evt: ScheduleEvent = {
      id: crypto.randomUUID(),
      startTime: eventForm.startTime,
      endTime: eventForm.endTime,
      activity: eventForm.activity,
      species: FISHING_ACTIVITIES.has(eventForm.activity) ? eventForm.species : [],
    };
    setItinerary((prev) => ({
      ...prev,
      [dialogDayKey]: [...(prev[dialogDayKey] ?? []), evt],
    }));
    setDialogOpen(false);
  }

  const canAdvance: Record<number, boolean> = {
    1: form.title.trim().length > 0,
    2: true,
    3: true,
    4: fromExperienceUrl || true,
    5: true,
    6: false,
  };

  const goNext = () => {
    if (currentStep === 3 && fromExperienceUrl) {
      setCurrentStep(5);
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, 6));
  };
  const goBack = () => {
    if (currentStep === 5 && fromExperienceUrl) {
      setCurrentStep(3);
      return;
    }
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

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
          experienceId: selectedExperience?.id,
          destinationIds: selectedDestinationIds.length > 0 ? selectedDestinationIds : undefined,
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
          <h1 className="text-4xl font-bold text-[#F5F0E8] mb-2">Plan a Trip</h1>
          <p className="text-white/60">Create a shareable workspace for your crew in seconds.</p>
        </div>
      </div>

      {/* My trips */}
      {myTrips.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Your trips</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {myTrips.map((trip) => (
              <a
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="shrink-0 w-48 bg-white rounded-xl border border-slate-200 p-3.5 hover:border-[#0D9488] hover:shadow-sm transition-all group"
              >
                <p className="font-semibold text-[#040F1C] text-sm leading-tight line-clamp-2 group-hover:text-[#0D9488] transition-colors">
                  {trip.title}
                </p>
                {(trip.startDate || trip.endDate) && (
                  <p className="text-xs text-slate-400 mt-1.5">
                    {trip.startDate ? new Date(trip.startDate + "T12:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    {trip.endDate && trip.startDate ? " – " : ""}
                    {trip.endDate ? new Date(trip.endDate + "T12:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "short" }) : ""}
                  </p>
                )}
                <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                  trip.status === "confirmed" ? "bg-green-50 text-green-700" :
                  trip.status === "active" ? "bg-teal-50 text-teal-700" :
                  trip.status === "completed" ? "bg-slate-100 text-slate-500" :
                  "bg-amber-50 text-amber-700"
                }`}>
                  {trip.status}
                </span>
              </a>
            ))}
          </div>
          <div className="border-t border-slate-200 mt-6 mb-2" />
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-0">Create new</p>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-[#F5F0E8] rounded-2xl p-6 shadow-sm border border-slate-100">
          <StepProgress current={currentStep} total={6} />

          <h2 className="text-2xl font-bold text-[#040F1C] mb-6">
            {currentStep === 5 && useItinerary ? "Plan your days" : STEP_TITLES[currentStep]}
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

          {/* Step 4: Experience */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-500">Choose the type of fishing experience you're planning. This will pre-fill target species.</p>
              {experiences.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">Loading experiences…</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {(selectedRegions.length > 0
                    ? experiences.filter(exp => {
                        const expSpecies: string[] = (() => { try { return JSON.parse(exp.targetSpeciesSlugs); } catch { return []; } })();
                        return selectedRegions.some(regionSlug => {
                          const regionSpecies = regionSpeciesMap[regionSlug] ?? [];
                          return expSpecies.some(s => regionSpecies.includes(s));
                        });
                      })
                    : experiences
                  ).map((exp) => {
                    const isSelected = selectedExperience?.id === exp.id;
                    const CATEGORY_COLORS: Record<string, string> = {
                      offshore: "bg-blue-50 text-blue-700 border-blue-200",
                      reef: "bg-orange-50 text-orange-700 border-orange-200",
                      estuary: "bg-teal-50 text-teal-700 border-teal-200",
                      inshore: "bg-sky-50 text-sky-700 border-sky-200",
                      freshwater: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    };
                    const badgeColor = CATEGORY_COLORS[exp.category] ?? "bg-slate-50 text-slate-700 border-slate-200";
                    const targetSlugs: string[] = JSON.parse(exp.targetSpeciesSlugs || "[]");
                    return (
                      <button
                        key={exp.id}
                        type="button"
                        onClick={() => {
                          setSelectedExperience(isSelected ? null : exp);
                          if (!isSelected) {
                            const names = targetSlugs
                              .map(s => SLUG_TO_SPECIES_NAME[s])
                              .filter((n): n is string => Boolean(n) && SPECIES_OPTIONS.includes(n));
                            setSelectedSpecies(names);
                          }
                        }}
                        className={`w-full text-left px-3 py-3 rounded-xl border transition-all ${
                          isSelected
                            ? "border-[#0D9488] bg-teal-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`font-semibold text-sm ${isSelected ? "text-[#0F766E]" : "text-[#040F1C]"}`}>{exp.name}</p>
                          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${badgeColor}`}>
                            {exp.category}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2">{exp.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {targetSlugs.slice(0, 4).map(s => (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                              {SLUG_TO_SPECIES_NAME[s] ?? s.replace(/-/g, " ")}
                            </span>
                          ))}
                          {targetSlugs.length > 4 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">+{targetSlugs.length - 4} more</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Destinations for the selected region */}
              {destinations.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-[#040F1C] mb-2">Fishing spots in this region</p>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {destinations.map(dest => {
                      const checked = selectedDestinationIds.includes(dest.id);
                      return (
                        <button
                          key={dest.id}
                          type="button"
                          onClick={() =>
                            setSelectedDestinationIds(prev =>
                              checked ? prev.filter(id => id !== dest.id) : [...prev, dest.id]
                            )
                          }
                          className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all flex items-center gap-2 ${
                            checked
                              ? "border-[#0D9488] bg-teal-50 text-[#0F766E]"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${checked ? "bg-[#0D9488] border-[#0D9488]" : "border-slate-300"}`}>
                            {checked && <Check className="h-2.5 w-2.5 text-white" />}
                          </div>
                          <span className="font-medium">{dest.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Itinerary / Species */}
          {currentStep === 5 && (
            <div className="space-y-3">
              {useItinerary ? (
                <>
                  <p className="text-xs text-slate-500 mb-3">
                    Add events to each day. Boat / Land-based / Charter / Kayak activities reveal a species picker.
                  </p>
                  <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                    {daysInRange.map((day) => {
                      const dayKey = toDateKey(day);
                      const events = [...(itinerary[dayKey] ?? [])].sort((a, b) =>
                        a.startTime.localeCompare(b.startTime)
                      );
                      return (
                        <div key={dayKey} className="border border-slate-200 rounded-xl p-3 bg-white space-y-2">
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

                          {/* Event cards */}
                          {events.map((evt) => (
                            <div key={evt.id} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 text-sm">
                              <span className="text-slate-400 text-xs shrink-0 font-mono">
                                {evt.startTime}–{evt.endTime}
                              </span>
                              <span className="text-[#040F1C] flex-1 text-xs font-medium">
                                {evt.activity}
                                {evt.species.length > 0 && (
                                  <span className="text-teal-700 font-normal"> — {evt.species.join(", ")}</span>
                                )}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeEvent(dayKey, evt.id)}
                                className="text-slate-400 hover:text-red-500 shrink-0 transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}

                          {/* Add event button */}
                          <button
                            type="button"
                            onClick={() => openDialog(dayKey)}
                            className="flex items-center gap-1.5 text-xs text-[#0D9488] hover:text-[#0F766E] font-medium py-0.5 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add event
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Event Dialog */}
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Event</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label>Activity</Label>
                          <Select
                            value={eventForm.activity}
                            onValueChange={(v) =>
                              setEventForm((f) => ({
                                ...f,
                                activity: v,
                                species: FISHING_ACTIVITIES.has(v) ? f.species : [],
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose an activity…" />
                            </SelectTrigger>
                            <SelectContent>
                              {ACTIVITIES.map((act) => (
                                <SelectItem key={act} value={act}>{act}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {FISHING_ACTIVITIES.has(eventForm.activity) && filteredSpecies.length > 0 && (
                          <div className="space-y-2">
                            <Label>Target species <span className="text-slate-400 font-normal">(optional)</span></Label>
                            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                              {filteredSpecies.map((sp) => (
                                <button
                                  key={sp}
                                  type="button"
                                  onClick={() => toggleEventSpecies(sp)}
                                  className={`px-2.5 py-0.5 rounded-full text-xs border transition-all ${
                                    eventForm.species.includes(sp)
                                      ? "bg-[#0D9488] text-white border-[#0D9488]"
                                      : "border-slate-200 text-slate-600 hover:border-[#0D9488]"
                                  }`}
                                >
                                  {sp}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Start time</Label>
                            <input
                              type="time"
                              value={eventForm.startTime}
                              onChange={(e) => setEventForm((f) => ({ ...f, startTime: e.target.value }))}
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End time</Label>
                            <input
                              type="time"
                              value={eventForm.endTime}
                              onChange={(e) => setEventForm((f) => ({ ...f, endTime: e.target.value }))}
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={saveEvent}
                          disabled={!eventForm.activity}
                          className="w-full"
                        >
                          Add Event
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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

          {/* Step 6: Gear preview + notes + submit */}
          {currentStep === 6 && (
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

              {selectedExperience && (
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Experience</p>
                  <p className="text-sm font-medium text-[#040F1C]">{selectedExperience.name}</p>
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

              {selectedDestinationIds.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Fishing Spots</p>
                  <div className="flex flex-wrap gap-2">
                    {destinations.filter(d => selectedDestinationIds.includes(d.id)).map(d => (
                      <span key={d.id} className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                        {d.name}
                      </span>
                    ))}
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
            {currentStep < 6 && (
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
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <AuthPrompt
        icon="fish"
        heading="Plan a Fishing Trip"
        description="Log in to build your trip plan, organise your crew, and track every detail from gear to bookings."
      />
    );
  }

  return (
    <Suspense fallback={null}>
      <NewTripForm />
    </Suspense>
  );
}
