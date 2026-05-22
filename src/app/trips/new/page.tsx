"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
];

// ── Which zones each species is active in ────────────────────────────────────
const SPECIES_ACTIVE_ZONES: Record<string, string[]> = {
  "Black Marlin": ["far_north_qld", "central_qld"],
  "Blue Marlin": ["far_north_qld", "central_qld", "southeast_qld", "nsw", "lord_howe"],
  "Sailfish": ["far_north_qld", "central_qld", "southeast_qld"],
  "Yellowfin Tuna": ["far_north_qld", "central_qld", "southeast_qld", "nsw", "lord_howe"],
  "Longtail Tuna": ["far_north_qld", "central_qld", "southeast_qld", "nsw"],
  "Spanish Mackerel": ["far_north_qld", "central_qld", "southeast_qld", "nsw"],
  "Wahoo": ["far_north_qld", "central_qld", "southeast_qld", "lord_howe"],
  "Mahi-Mahi": ["far_north_qld", "central_qld", "southeast_qld", "nsw", "lord_howe"],
  "Southern Bluefin Tuna": ["vic_coast", "tas", "nsw"],
  "Yellowtail Kingfish": ["nsw", "southeast_qld", "vic_coast"],
  "Giant Trevally": ["far_north_qld", "central_qld", "southeast_qld", "lord_howe"],
  "Cobia": ["far_north_qld", "central_qld", "southeast_qld"],
  "Tailor": ["nsw", "southeast_qld", "vic_coast"],
  "Australian Salmon": ["nsw", "vic_coast", "tas"],
  "Gummy Shark": ["vic_coast", "tas", "nsw"],
  "Coral Trout": ["far_north_qld", "central_qld", "southeast_qld"],
  "Red Emperor": ["far_north_qld", "central_qld"],
  "Nannygai": ["far_north_qld", "central_qld", "southeast_qld", "nsw"],
  "Snapper": ["nsw", "southeast_qld", "vic_coast", "tas", "central_qld"],
  "Amberjack (Samson Fish)": ["nsw", "southeast_qld"],
  "Blue-eye Trevalla": ["nsw", "vic_coast", "tas"],
  "Striped Trumpeter": ["tas", "vic_coast"],
  "Barramundi": ["far_north_qld", "central_qld"],
  "Mangrove Jack": ["far_north_qld", "central_qld", "southeast_qld"],
  "Flathead": ["nsw", "southeast_qld", "vic_coast"],
  "Mulloway": ["nsw", "southeast_qld", "vic_coast"],
  "Bream": ["nsw", "southeast_qld", "vic_coast"],
  "Whiting": ["nsw", "southeast_qld", "vic_coast"],
  "Luderick": ["nsw", "southeast_qld", "vic_coast"],
  "Black Jewfish": ["far_north_qld", "central_qld"],
  "Murray Cod": ["murray_darling"],
  "Golden Perch": ["murray_darling"],
  "Silver Perch": ["murray_darling"],
  "Australian Bass": ["nsw", "southeast_qld"],
  "Brown Trout": ["alpine", "tas"],
  "Rainbow Trout": ["alpine", "tas"],
  "Redfin": ["murray_darling", "alpine", "vic_coast"],
  "Saratoga": ["far_north_qld"],
  "Catfish": ["murray_darling"],
  "Ocean Trout": ["tas", "alpine"],
};

export default function NewTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    regionSlug: "",
    startDate: "",
    endDate: "",
    description: "",
  });

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
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />
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
              <p className="text-xs text-[#0891B2]">
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
              <p className="text-xs text-[#0891B2]">
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
                      ? "bg-[#06B6D4] text-white border-[#06B6D4]"
                      : "border-slate-200 text-slate-600 hover:border-[#06B6D4] hover:text-[#0891B2]"
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
