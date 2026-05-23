"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  // NT / Tropical
  "Queenfish": ["nt_top_end", "nt_gulf", "wa_kimberley", "far_north_qld", "central_qld"],
  "Threadfin Salmon": ["nt_top_end", "nt_gulf", "wa_kimberley", "far_north_qld"],
  // WA Endemic
  "Dhufish": ["wa_southwest", "wa_mid_west", "wa_pilbara"],
  "Baldchin Groper": ["wa_southwest", "wa_mid_west"],
  "King George Whiting": ["sa_spencer_gulf", "sa_south", "wa_southwest", "vic_coast"],
  "Black Bream": ["nsw", "vic_coast", "sa_south", "wa_southwest"],
  "Spangled Emperor": ["far_north_qld", "central_qld", "nt_top_end", "wa_kimberley", "wa_pilbara"],
  "Rankin Cod": ["wa_kimberley", "wa_pilbara", "wa_mid_west"],
  // Flats / Islands
  "Bonefish": ["christmas_island", "cocos_islands", "nt_top_end"],
  "Milkfish": ["christmas_island", "cocos_islands"],
};

function NewTripForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill from intent search URL params (?region=sydney&species=Barramundi)
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

  // Cross-filter: zones that match the selected species
  const activeZonesFromSpecies = useMemo(() => {
    if (selectedSpecies.length === 0) return new Set<string>();
    const zones = new Set<string>();
    selectedSpecies.forEach((sp) => {
      (SPECIES_ACTIVE_ZONES[sp] ?? []).forEach((z) => zones.add(z));
    });
    return zones;
  }, [selectedSpecies]);

  // Cross-filter: zone of selected region
  const selectedRegionZone = useMemo(() => {
    if (!form.regionSlug) return null;
    return REGION_OPTIONS.find((r) => r.slug === form.regionSlug)?.zone ?? null;
  }, [form.regionSlug]);

  // Filtered species: if a region is selected, only show species active in that zone
  const filteredSpecies = useMemo(() => {
    if (!selectedRegionZone) return SPECIES_OPTIONS;
    return SPECIES_OPTIONS.filter((sp) =>
      (SPECIES_ACTIVE_ZONES[sp] ?? []).includes(selectedRegionZone)
    );
  }, [selectedRegionZone]);

  // Filtered regions: if species are selected, only show regions in matching zones
  const filteredRegions = useMemo(() => {
    if (activeZonesFromSpecies.size === 0) return REGION_OPTIONS;
    return REGION_OPTIONS.filter((r) => activeZonesFromSpecies.has(r.zone));
  }, [activeZonesFromSpecies]);

  const toggleSpecies = (name: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
    // If this species isn't available in the selected region, clear the region
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const isFiltered = form.regionSlug || selectedSpecies.length > 0;

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
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Destination — filters species */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="region">Destination</Label>
              {form.regionSlug && (
                <button
                  type="button"
                  onClick={clearRegion}
                  className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Clear filter
                </button>
              )}
            </div>
            <Select
              value={form.regionSlug}
              onValueChange={(v) => {
                setForm((f) => ({ ...f, regionSlug: v }));
                // Remove any selected species not available in the new zone
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

          {/* Target species — filters regions */}
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

          <div className="space-y-2">
            <Label htmlFor="description">Notes (optional)</Label>
            <Textarea
              id="description"
              placeholder="Any notes about the trip, charter, or plan…"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Creating trip…</>
            ) : (
              <>Create Trip <ArrowRight className="h-4 w-4" /></>
            )}
          </Button>
        </form>
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
