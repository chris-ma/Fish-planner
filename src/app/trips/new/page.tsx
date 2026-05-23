"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Loader2, X, Footprints, Anchor, Ship, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currentMonth, MONTH_NAMES_FULL } from "@/lib/utils/season";

// ── Species list ──────────────────────────────────────────────────────────────
const SPECIES_OPTIONS = [
  // Pelagic
  "Black Marlin", "Blue Marlin", "Sailfish", "Yellowfin Tuna", "Longtail Tuna",
  "Spanish Mackerel", "Wahoo", "Mahi-Mahi", "Southern Bluefin Tuna",
  // Inshore
  "Yellowtail Kingfish", "Giant Trevally", "Cobia", "Tailor", "Australian Salmon",
  "Gummy Shark",
  // Reef
  "Coral Trout", "Red Emperor", "Nannygai", "Snapper", "Amberjack (Samson Fish)",
  "Blue-eye Trevalla", "Striped Trumpeter",
  // Estuary
  "Barramundi", "Mangrove Jack", "Flathead", "Mulloway", "Bream",
  "Whiting", "Luderick", "Black Jewfish",
  // Freshwater
  "Murray Cod", "Golden Perch", "Silver Perch", "Australian Bass",
  "Brown Trout", "Rainbow Trout", "Redfin", "Saratoga", "Catfish", "Ocean Trout",
  // NT / Tropical
  "Queenfish", "Threadfin Salmon",
  // WA Endemic
  "Dhufish", "Baldchin Groper", "King George Whiting", "Black Bream",
  "Spangled Emperor", "Rankin Cod",
  // Flats / Islands
  "Bonefish", "Milkfish",
];

// ── Region list with zone field ───────────────────────────────────────────────
const REGION_OPTIONS = [
  // Far North QLD
  { slug: "cairns", name: "Cairns, QLD", zone: "far_north_qld" },
  { slug: "port-douglas", name: "Port Douglas, QLD", zone: "far_north_qld" },
  { slug: "cooktown", name: "Cooktown, QLD", zone: "far_north_qld" },
  { slug: "weipa", name: "Weipa, QLD", zone: "far_north_qld" },
  // Central QLD
  { slug: "townsville", name: "Townsville, QLD", zone: "central_qld" },
  { slug: "bowen", name: "Bowen, QLD", zone: "central_qld" },
  { slug: "mackay", name: "Mackay, QLD", zone: "central_qld" },
  { slug: "airlie-beach", name: "Airlie Beach / Whitsundays, QLD", zone: "central_qld" },
  { slug: "yeppoon", name: "Yeppoon, QLD", zone: "central_qld" },
  { slug: "gladstone", name: "Gladstone, QLD", zone: "central_qld" },
  // Southeast QLD
  { slug: "hervey-bay", name: "Hervey Bay, QLD", zone: "southeast_qld" },
  { slug: "sunshine-coast", name: "Sunshine Coast, QLD", zone: "southeast_qld" },
  { slug: "brisbane-moreton-bay", name: "Brisbane / Moreton Bay, QLD", zone: "southeast_qld" },
  { slug: "gold-coast", name: "Gold Coast, QLD", zone: "southeast_qld" },
  // NSW
  { slug: "ballina-byron-bay", name: "Ballina / Byron Bay, NSW", zone: "nsw" },
  { slug: "coffs-harbour", name: "Coffs Harbour, NSW", zone: "nsw" },
  { slug: "south-west-rocks", name: "South West Rocks, NSW", zone: "nsw" },
  { slug: "port-macquarie", name: "Port Macquarie, NSW", zone: "nsw" },
  { slug: "port-stephens", name: "Port Stephens, NSW", zone: "nsw" },
  { slug: "lake-macquarie", name: "Lake Macquarie, NSW", zone: "nsw" },
  { slug: "newcastle", name: "Newcastle, NSW", zone: "nsw" },
  { slug: "hawkesbury-river", name: "Hawkesbury River, NSW", zone: "nsw" },
  { slug: "sydney", name: "Sydney, NSW", zone: "nsw" },
  { slug: "wollongong", name: "Wollongong, NSW", zone: "nsw" },
  { slug: "jervis-bay", name: "Jervis Bay, NSW", zone: "nsw" },
  { slug: "ulladulla", name: "Ulladulla, NSW", zone: "nsw" },
  { slug: "batemans-bay", name: "Batemans Bay, NSW", zone: "nsw" },
  { slug: "narooma", name: "Narooma, NSW", zone: "nsw" },
  { slug: "eden", name: "Eden, NSW", zone: "nsw" },
  { slug: "tathra-merimbula", name: "Tathra / Merimbula, NSW", zone: "nsw" },
  // Lord Howe Island
  { slug: "lord-howe-island", name: "Lord Howe Island, NSW", zone: "lord_howe" },
  // Victoria
  { slug: "port-phillip-bay", name: "Port Phillip Bay, VIC", zone: "vic_coast" },
  { slug: "mornington-peninsula", name: "Mornington Peninsula, VIC", zone: "vic_coast" },
  { slug: "phillip-island", name: "Phillip Island, VIC", zone: "vic_coast" },
  { slug: "westernport-bay", name: "Westernport Bay, VIC", zone: "vic_coast" },
  { slug: "wilsons-promontory", name: "Wilsons Promontory, VIC", zone: "vic_coast" },
  { slug: "lakes-entrance", name: "Lakes Entrance, VIC", zone: "vic_coast" },
  { slug: "mallacoota", name: "Mallacoota, VIC", zone: "vic_coast" },
  { slug: "apollo-bay", name: "Apollo Bay, VIC", zone: "vic_coast" },
  { slug: "portland-vic", name: "Portland, VIC", zone: "vic_coast" },
  { slug: "warrnambool", name: "Warrnambool, VIC", zone: "vic_coast" },
  // Tasmania
  { slug: "hobart", name: "Hobart, TAS", zone: "tas" },
  { slug: "st-helens", name: "St Helens, TAS", zone: "tas" },
  { slug: "bicheno", name: "Bicheno, TAS", zone: "tas" },
  { slug: "bruny-island", name: "Bruny Island, TAS", zone: "tas" },
  { slug: "strahan", name: "Strahan, TAS", zone: "tas" },
  { slug: "devonport", name: "Devonport, TAS", zone: "tas" },
  { slug: "launceston-tamar", name: "Launceston / Tamar, TAS", zone: "tas" },
  { slug: "port-arthur", name: "Port Arthur, TAS", zone: "tas" },
  // Murray–Darling
  { slug: "murray-river-albury", name: "Murray River – Albury, NSW/VIC", zone: "murray_darling" },
  { slug: "murray-river-echuca", name: "Murray River – Echuca, VIC", zone: "murray_darling" },
  { slug: "murray-river-mildura", name: "Murray River – Mildura, VIC", zone: "murray_darling" },
  { slug: "lake-hume", name: "Lake Hume, NSW/VIC", zone: "murray_darling" },
  { slug: "lake-mulwala", name: "Lake Mulwala, VIC", zone: "murray_darling" },
  { slug: "murrumbidgee-river", name: "Murrumbidgee River, NSW", zone: "murray_darling" },
  { slug: "macquarie-river", name: "Macquarie River, NSW", zone: "murray_darling" },
  { slug: "darling-river-bourke", name: "Darling River – Bourke, NSW", zone: "murray_darling" },
  // Alpine
  { slug: "lake-eucumbene", name: "Lake Eucumbene, NSW", zone: "alpine" },
  { slug: "lake-jindabyne", name: "Lake Jindabyne, NSW", zone: "alpine" },
  { slug: "snowy-mountains-rivers", name: "Snowy Mountains Rivers, NSW", zone: "alpine" },
  { slug: "lake-eildon", name: "Lake Eildon, VIC", zone: "alpine" },
  { slug: "ovens-king-rivers", name: "Ovens & King Rivers, VIC", zone: "alpine" },
  { slug: "goulburn-river-vic", name: "Goulburn River, VIC", zone: "alpine" },
  { slug: "arthurs-lake-tas", name: "Arthurs Lake, TAS", zone: "alpine" },
  { slug: "lake-st-clair", name: "Lake St Clair, TAS", zone: "alpine" },
  // NT — Top End
  { slug: "darwin", name: "Darwin, NT", zone: "nt_top_end" },
  { slug: "bynoe-harbour", name: "Bynoe Harbour, NT", zone: "nt_top_end" },
  { slug: "daly-river", name: "Daly River, NT", zone: "nt_top_end" },
  { slug: "tiwi-islands", name: "Tiwi Islands, NT", zone: "nt_top_end" },
  { slug: "cobourg-peninsula", name: "Cobourg Peninsula, NT", zone: "nt_top_end" },
  // NT — Gulf
  { slug: "nhulunbuy-gove", name: "Nhulunbuy (Gove), NT", zone: "nt_gulf" },
  { slug: "groote-eylandt", name: "Groote Eylandt, NT", zone: "nt_gulf" },
  { slug: "borroloola", name: "Borroloola, NT", zone: "nt_gulf" },
  // WA — Kimberley
  { slug: "broome", name: "Broome, WA", zone: "wa_kimberley" },
  { slug: "kununurra", name: "Kununurra, WA", zone: "wa_kimberley" },
  { slug: "dampier-peninsula", name: "Dampier Peninsula, WA", zone: "wa_kimberley" },
  { slug: "horizontal-falls", name: "Horizontal Falls, WA", zone: "wa_kimberley" },
  // WA — Pilbara / Ningaloo
  { slug: "exmouth-ningaloo", name: "Exmouth / Ningaloo, WA", zone: "wa_pilbara" },
  { slug: "port-hedland", name: "Port Hedland, WA", zone: "wa_pilbara" },
  { slug: "karratha-dampier", name: "Karratha / Dampier, WA", zone: "wa_pilbara" },
  { slug: "shark-bay", name: "Shark Bay, WA", zone: "wa_pilbara" },
  // WA — Mid West
  { slug: "geraldton", name: "Geraldton, WA", zone: "wa_mid_west" },
  { slug: "kalbarri", name: "Kalbarri, WA", zone: "wa_mid_west" },
  { slug: "jurien-bay", name: "Jurien Bay, WA", zone: "wa_mid_west" },
  { slug: "lancelin-cervantes", name: "Lancelin / Cervantes, WA", zone: "wa_mid_west" },
  // WA — Southwest
  { slug: "perth-rottnest", name: "Perth / Rottnest, WA", zone: "wa_southwest" },
  { slug: "mandurah", name: "Mandurah, WA", zone: "wa_southwest" },
  { slug: "busselton-margaret-river", name: "Busselton / Margaret River, WA", zone: "wa_southwest" },
  { slug: "albany", name: "Albany, WA", zone: "wa_southwest" },
  { slug: "esperance", name: "Esperance, WA", zone: "wa_southwest" },
  // SA — Spencer Gulf
  { slug: "port-augusta", name: "Port Augusta, SA", zone: "sa_spencer_gulf" },
  { slug: "whyalla", name: "Whyalla, SA", zone: "sa_spencer_gulf" },
  { slug: "port-lincoln", name: "Port Lincoln, SA", zone: "sa_spencer_gulf" },
  { slug: "coffin-bay", name: "Coffin Bay, SA", zone: "sa_spencer_gulf" },
  { slug: "streaky-bay", name: "Streaky Bay, SA", zone: "sa_spencer_gulf" },
  // SA — South Coast
  { slug: "adelaide", name: "Adelaide, SA", zone: "sa_south" },
  { slug: "victor-harbor", name: "Victor Harbor, SA", zone: "sa_south" },
  { slug: "kangaroo-island", name: "Kangaroo Island, SA", zone: "sa_south" },
  { slug: "robe-beachport", name: "Robe / Beachport, SA", zone: "sa_south" },
  { slug: "mount-gambier", name: "Mount Gambier, SA", zone: "sa_south" },
  // Islands
  { slug: "christmas-island", name: "Christmas Island", zone: "christmas_island" },
  { slug: "cocos-islands", name: "Cocos (Keeling) Islands", zone: "cocos_islands" },
];

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

const TRIP_TYPES = [
  { value: "land",    label: "Land-based", Icon: Footprints },
  { value: "boat",    label: "Boat",       Icon: Anchor },
  { value: "charter", label: "Charter",    Icon: Ship },
  { value: "kayak",   label: "Kayak",      Icon: Waves },
] as const;

const STEP_TITLES: Record<number, string> = {
  1: "What kind of trip?",
  2: "When are you going?",
  3: "Where are you headed?",
  4: "What do you want to catch?",
  5: "Add notes & create",
};

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

function NewTripForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [tripType, setTripType] = useState<"land" | "boat" | "charter" | "kayak" | "">("");

  const [selectedSpecies, setSelectedSpecies] = useState<string[]>(() => {
    const s = searchParams.get("species");
    return s && SPECIES_OPTIONS.includes(s) ? [s] : [];
  });

  const [form, setForm] = useState(() => ({
    title: "",
    regionSlug: searchParams.get("region") ?? "",
    startDate: "",
    endDate: "",
    description: "",
  }));

  const activeZonesFromSpecies = useMemo(() => {
    if (selectedSpecies.length === 0) return new Set<string>();
    const zones = new Set<string>();
    selectedSpecies.forEach((sp) => {
      (SPECIES_ACTIVE_ZONES[sp] ?? []).forEach((z) => zones.add(z));
    });
    return zones;
  }, [selectedSpecies]);

  const selectedRegionZone = useMemo(() => {
    if (!form.regionSlug) return null;
    return REGION_OPTIONS.find((r) => r.slug === form.regionSlug)?.zone ?? null;
  }, [form.regionSlug]);

  const filteredSpecies = useMemo(() => {
    if (!selectedRegionZone) return SPECIES_OPTIONS;
    return SPECIES_OPTIONS.filter((sp) =>
      (SPECIES_ACTIVE_ZONES[sp] ?? []).includes(selectedRegionZone)
    );
  }, [selectedRegionZone]);

  const filteredRegions = useMemo(() => {
    if (activeZonesFromSpecies.size === 0) return REGION_OPTIONS;
    return REGION_OPTIONS.filter((r) => activeZonesFromSpecies.has(r.zone));
  }, [activeZonesFromSpecies]);

  const toggleSpecies = (name: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
    if (form.regionSlug && selectedRegionZone) {
      const newSelection = selectedSpecies.includes(name)
        ? selectedSpecies.filter((s) => s !== name)
        : [...selectedSpecies, name];
      const allZones = new Set(newSelection.flatMap((sp) => SPECIES_ACTIVE_ZONES[sp] ?? []));
      if (allZones.size > 0 && !allZones.has(selectedRegionZone)) {
        setForm((f) => ({ ...f, regionSlug: "" }));
      }
    }
  };

  const clearRegion = () => setForm((f) => ({ ...f, regionSlug: "" }));
  const clearSpeciesFilter = () => setSelectedSpecies([]);

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
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          regionSlug: form.regionSlug || undefined,
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          targetSpecies: selectedSpecies,
          description: form.description || undefined,
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

          <h2 className="text-2xl font-bold text-[#040F1C] mb-6">{STEP_TITLES[currentStep]}</h2>

          {/* Step 1: Trip name + type */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Trip name *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Cairns Marlin Trip 2025"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="h-11"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Trip style</p>
                <div className="grid grid-cols-2 gap-3">
                  {TRIP_TYPES.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTripType(value)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        tripType === value
                          ? "border-[#0D9488] bg-teal-50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${tripType === value ? "text-[#0D9488]" : "text-slate-400"}`} />
                      <span className={`text-sm font-semibold block ${tripType === value ? "text-[#0D9488]" : "text-[#040F1C]"}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dates */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    className="h-11"
                  />
                </div>
              </div>
              <p className="text-xs text-[#0F766E] bg-teal-50 rounded-xl px-4 py-2.5">
                {MONTH_NAMES_FULL[month]} is an active month for many Australian coastal species.
              </p>
            </div>
          )}

          {/* Step 3: Destination */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="region">Destination</Label>
                {form.regionSlug && (
                  <button
                    type="button"
                    onClick={clearRegion}
                    className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>
              <Select
                value={form.regionSlug}
                onValueChange={(v) => {
                  setForm((f) => ({ ...f, regionSlug: v }));
                  const newZone = REGION_OPTIONS.find((r) => r.slug === v)?.zone;
                  if (newZone) {
                    setSelectedSpecies((prev) =>
                      prev.filter((sp) => (SPECIES_ACTIVE_ZONES[sp] ?? []).includes(newZone))
                    );
                  }
                }}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a region or town…" />
                </SelectTrigger>
                <SelectContent>
                  {filteredRegions.map((r) => (
                    <SelectItem key={r.slug} value={r.slug}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activeZonesFromSpecies.size > 0 && filteredRegions.length < REGION_OPTIONS.length && (
                <p className="text-xs text-[#0F766E]">
                  Showing {filteredRegions.length} regions where your target species are active
                </p>
              )}
            </div>
          )}

          {/* Step 4: Species */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Target species</Label>
                {selectedSpecies.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSpeciesFilter}
                    className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Clear all
                  </button>
                )}
              </div>
              {form.regionSlug && filteredSpecies.length < SPECIES_OPTIONS.length && (
                <p className="text-xs text-[#0F766E]">
                  Showing {filteredSpecies.length} species active in the selected region
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
            </div>
          )}

          {/* Step 5: Notes + submit */}
          {currentStep === 5 && (
            <div className="space-y-4">
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
