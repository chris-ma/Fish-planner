"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const REGION_OPTIONS = [
  // Far North QLD
  { slug: "cairns", name: "Cairns, QLD" },
  { slug: "port-douglas", name: "Port Douglas, QLD" },
  { slug: "cooktown", name: "Cooktown, QLD" },
  { slug: "weipa", name: "Weipa, QLD" },
  // Central QLD
  { slug: "townsville", name: "Townsville, QLD" },
  { slug: "bowen", name: "Bowen, QLD" },
  { slug: "mackay", name: "Mackay, QLD" },
  { slug: "airlie-beach", name: "Airlie Beach / Whitsundays, QLD" },
  { slug: "yeppoon", name: "Yeppoon, QLD" },
  { slug: "gladstone", name: "Gladstone, QLD" },
  // Southeast QLD
  { slug: "hervey-bay", name: "Hervey Bay, QLD" },
  { slug: "sunshine-coast", name: "Sunshine Coast, QLD" },
  { slug: "brisbane-moreton-bay", name: "Brisbane / Moreton Bay, QLD" },
  { slug: "gold-coast", name: "Gold Coast, QLD" },
  // NSW
  { slug: "ballina-byron-bay", name: "Ballina / Byron Bay, NSW" },
  { slug: "coffs-harbour", name: "Coffs Harbour, NSW" },
  { slug: "south-west-rocks", name: "South West Rocks, NSW" },
  { slug: "port-macquarie", name: "Port Macquarie, NSW" },
  { slug: "port-stephens", name: "Port Stephens, NSW" },
  { slug: "lake-macquarie", name: "Lake Macquarie, NSW" },
  { slug: "newcastle", name: "Newcastle, NSW" },
  { slug: "hawkesbury-river", name: "Hawkesbury River, NSW" },
  { slug: "sydney", name: "Sydney, NSW" },
  { slug: "wollongong", name: "Wollongong, NSW" },
  { slug: "jervis-bay", name: "Jervis Bay, NSW" },
  { slug: "ulladulla", name: "Ulladulla, NSW" },
  { slug: "batemans-bay", name: "Batemans Bay, NSW" },
  { slug: "narooma", name: "Narooma, NSW" },
  { slug: "eden", name: "Eden, NSW" },
  { slug: "tathra-merimbula", name: "Tathra / Merimbula, NSW" },
  // Lord Howe Island
  { slug: "lord-howe-island", name: "Lord Howe Island, NSW" },
  // Victoria
  { slug: "port-phillip-bay", name: "Port Phillip Bay, VIC" },
  { slug: "mornington-peninsula", name: "Mornington Peninsula, VIC" },
  { slug: "phillip-island", name: "Phillip Island, VIC" },
  { slug: "westernport-bay", name: "Westernport Bay, VIC" },
  { slug: "wilsons-promontory", name: "Wilsons Promontory, VIC" },
  { slug: "lakes-entrance", name: "Lakes Entrance, VIC" },
  { slug: "mallacoota", name: "Mallacoota, VIC" },
  { slug: "apollo-bay", name: "Apollo Bay, VIC" },
  { slug: "portland-vic", name: "Portland, VIC" },
  { slug: "warrnambool", name: "Warrnambool, VIC" },
  // Tasmania
  { slug: "hobart", name: "Hobart, TAS" },
  { slug: "st-helens", name: "St Helens, TAS" },
  { slug: "bicheno", name: "Bicheno, TAS" },
  { slug: "bruny-island", name: "Bruny Island, TAS" },
  { slug: "strahan", name: "Strahan, TAS" },
  { slug: "devonport", name: "Devonport, TAS" },
  { slug: "launceston-tamar", name: "Launceston / Tamar, TAS" },
  { slug: "port-arthur", name: "Port Arthur, TAS" },
  // Murray–Darling
  { slug: "murray-river-albury", name: "Murray River – Albury, NSW/VIC" },
  { slug: "murray-river-echuca", name: "Murray River – Echuca, VIC" },
  { slug: "murray-river-mildura", name: "Murray River – Mildura, VIC" },
  { slug: "lake-hume", name: "Lake Hume, NSW/VIC" },
  { slug: "lake-mulwala", name: "Lake Mulwala, VIC" },
  { slug: "murrumbidgee-river", name: "Murrumbidgee River, NSW" },
  { slug: "macquarie-river", name: "Macquarie River, NSW" },
  { slug: "darling-river-bourke", name: "Darling River – Bourke, NSW" },
  // Alpine
  { slug: "lake-eucumbene", name: "Lake Eucumbene, NSW" },
  { slug: "lake-jindabyne", name: "Lake Jindabyne, NSW" },
  { slug: "snowy-mountains-rivers", name: "Snowy Mountains Rivers, NSW" },
  { slug: "lake-eildon", name: "Lake Eildon, VIC" },
  { slug: "ovens-king-rivers", name: "Ovens & King Rivers, VIC" },
  { slug: "goulburn-river-vic", name: "Goulburn River, VIC" },
  { slug: "arthurs-lake-tas", name: "Arthurs Lake, TAS" },
  { slug: "lake-st-clair", name: "Lake St Clair, TAS" },
];

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

  const toggleSpecies = (name: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

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

  return (
    <div>
      {/* Ocean hero header */}
      <div className="relative bg-[#020B14] py-12 px-4 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto relative z-10">
          <p className="text-white/50 text-sm mb-2">🎣 No account needed</p>
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

        <div className="space-y-2">
          <Label htmlFor="region">Destination</Label>
          <Select value={form.regionSlug} onValueChange={(v) => setForm((f) => ({ ...f, regionSlug: v }))}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select a region or town…" />
            </SelectTrigger>
            <SelectContent>
              {REGION_OPTIONS.map((r) => (
                <SelectItem key={r.slug} value={r.slug}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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

        <div className="space-y-3">
          <Label>Target species</Label>
          <div className="flex flex-wrap gap-2">
            {SPECIES_OPTIONS.map((name) => (
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
