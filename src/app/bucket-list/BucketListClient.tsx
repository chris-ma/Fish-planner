"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Trash2, Wind, Thermometer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { getSpeciesImage } from "@/lib/images";
import type { Species, CatchLog } from "@/db/schema";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "pelagic", label: "Pelagic" },
  { id: "reef", label: "Reef" },
  { id: "estuary", label: "Estuary" },
  { id: "inshore", label: "Inshore" },
  { id: "freshwater", label: "Freshwater" },
];

const TIDE_PHASES = [
  { value: "incoming", label: "Incoming" },
  { value: "high", label: "High" },
  { value: "outgoing", label: "Outgoing" },
  { value: "low", label: "Low" },
  { value: "unknown", label: "Unknown" },
];

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 53: "Moderate drizzle",
  55: "Dense drizzle", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
  71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow", 80: "Slight showers",
  81: "Moderate showers", 82: "Heavy showers", 95: "Thunderstorm",
};

function nowLocalDatetime(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface WeatherResult {
  description: string;
  tempC: number;
  windKmh: number;
}

interface BucketListClientProps {
  species: Species[];
}

export function BucketListClient({ species }: BucketListClientProps) {
  const [catcherName, setCatcherName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [catches, setCatches] = useState<CatchLog[]>([]);
  const [loadingCatches, setLoadingCatches] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  // Modal state
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [saving, setSaving] = useState(false);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [weather, setWeather] = useState<WeatherResult | null>(null);
  const [form, setForm] = useState({
    caughtAt: nowLocalDatetime(),
    location: "",
    tidePhase: "",
    lengthCm: "",
    weightKg: "",
    lineWeightLb: "",
    gearUsed: "",
    photoUrl: "",
    notes: "",
  });

  // Load name from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("bucketListName");
    if (stored) setCatcherName(stored);
  }, []);

  // Load catches when name is known
  const loadCatches = useCallback(async (name: string) => {
    setLoadingCatches(true);
    try {
      const res = await fetch(`/api/catches?catcherName=${encodeURIComponent(name)}`);
      if (res.ok) setCatches(await res.json());
    } finally {
      setLoadingCatches(false);
    }
  }, []);

  useEffect(() => {
    if (catcherName) loadCatches(catcherName);
  }, [catcherName, loadCatches]);

  const confirmName = () => {
    const name = nameInput.trim();
    if (!name) return;
    localStorage.setItem("bucketListName", name);
    setCatcherName(name);
  };

  const changeName = () => {
    setCatcherName(null);
    setNameInput("");
    setCatches([]);
  };

  // Build set of caught slugs for the current user
  const caughtSlugs = new Set(catches.map((c) => c.speciesSlug));

  const filteredSpecies = activeCategory === "all"
    ? species
    : species.filter((s) => s.category === activeCategory);

  // Sort: caught first, then alphabetical
  const sortedSpecies = [...filteredSpecies].sort((a, b) => {
    const aCaught = caughtSlugs.has(a.slug) ? 0 : 1;
    const bCaught = caughtSlugs.has(b.slug) ? 0 : 1;
    if (aCaught !== bCaught) return aCaught - bCaught;
    return a.commonName.localeCompare(b.commonName);
  });

  const openModal = (sp: Species) => {
    setSelectedSpecies(sp);
    setWeather(null);
    setForm({ caughtAt: nowLocalDatetime(), location: "", tidePhase: "", lengthCm: "", weightKg: "", lineWeightLb: "", gearUsed: "", photoUrl: "", notes: "" });
  };

  const fetchWeather = async () => {
    if (!form.location.trim()) return;
    setFetchingWeather(true);
    setWeather(null);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(form.location)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();
      const loc = geoData.results?.[0];
      if (!loc) { setFetchingWeather(false); return; }
      const wxRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,wind_speed_10m,weather_code`
      );
      const wxData = await wxRes.json();
      const cur = wxData.current;
      if (cur) {
        setWeather({
          description: WMO_DESCRIPTIONS[cur.weather_code] ?? "Unknown",
          tempC: Math.round(cur.temperature_2m),
          windKmh: Math.round(cur.wind_speed_10m),
        });
      }
    } catch {
      // silently fail
    } finally {
      setFetchingWeather(false);
    }
  };

  const handleLogCatch = async () => {
    if (!selectedSpecies || !catcherName) return;
    setSaving(true);
    try {
      const weatherConditions = weather ? JSON.stringify(weather) : null;
      const res = await fetch("/api/catches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          speciesSlug: selectedSpecies.slug,
          catcherName,
          caughtAt: form.caughtAt,
          location: form.location || null,
          weatherConditions,
          tidePhase: form.tidePhase || null,
          lengthCm: form.lengthCm ? parseFloat(form.lengthCm) : null,
          weightKg: form.weightKg ? parseFloat(form.weightKg) : null,
          lineWeightLb: form.lineWeightLb ? parseFloat(form.lineWeightLb) : null,
          gearUsed: form.gearUsed || null,
          photoUrl: form.photoUrl || null,
          notes: form.notes || null,
        }),
      });
      if (res.ok) {
        const newCatch = await res.json();
        setCatches((prev) => [newCatch, ...prev]);
        setForm({ caughtAt: nowLocalDatetime(), location: "", tidePhase: "", lengthCm: "", weightKg: "", lineWeightLb: "", gearUsed: "", photoUrl: "", notes: "" });
        setWeather(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCatch = async (id: string) => {
    setCatches((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/catches/${id}`, { method: "DELETE" });
  };

  const speciesCatches = selectedSpecies
    ? catches.filter((c) => c.speciesSlug === selectedSpecies.slug)
    : [];

  // ── Name prompt ────────────────────────────────────────────────────────────
  if (catcherName === null) {
    return (
      <div className="min-h-screen bg-[#020B14] flex flex-col items-center justify-center px-6 pb-24">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-[#F5F0E8] mb-2 text-center">Bucket List</h1>
          <p className="text-white/50 text-sm text-center mb-8">
            Track every species you&apos;ve caught. Enter your name to get started.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70">Your name</Label>
              <Input
                placeholder="e.g. Jake"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmName()}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
              />
            </div>
            <Button onClick={confirmName} disabled={!nameInput.trim()} className="w-full">
              Start tracking
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main grid ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#020B14] pb-24">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-[#F5F0E8]">Bucket List</h1>
            <p className="text-white/40 text-xs mt-0.5">
              {caughtSlugs.size} / {species.length} caught
            </p>
          </div>
          <button
            onClick={changeName}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            {catcherName} · change
          </button>
        </div>

        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mt-3">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0D9488] rounded-full transition-all duration-500"
              style={{ width: `${species.length > 0 ? (caughtSlugs.size / species.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="max-w-4xl mx-auto mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                activeCategory === cat.id
                  ? "bg-[#0D9488] text-white"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Species grid */}
      {loadingCatches ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 text-white/30 animate-spin" />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {sortedSpecies.map((sp) => {
            const caught = caughtSlugs.has(sp.slug);
            const imgUrl = getSpeciesImage(sp.slug, sp.category, 600);
            return (
              <button
                key={sp.slug}
                onClick={() => openModal(sp)}
                className="relative rounded-xl overflow-hidden aspect-[3/4] group focus:outline-none"
              >
                {/* Species image */}
                <div
                  className={cn(
                    "absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-105",
                    !caught && "grayscale"
                  )}
                  style={{ backgroundImage: `url(${imgUrl})` }}
                />
                {/* Dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Caught badge */}
                {caught && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#0D9488] flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}

                {/* Name */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-[10px] font-semibold leading-tight line-clamp-2">
                    {sp.commonName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Catch modal */}
      <Dialog open={!!selectedSpecies} onOpenChange={(open) => { if (!open) setSelectedSpecies(null); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSpecies?.commonName}
              {selectedSpecies && caughtSlugs.has(selectedSpecies.slug) && (
                <span className="text-xs font-normal bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                  {speciesCatches.length} catch{speciesCatches.length !== 1 ? "es" : ""}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            {/* Date & time */}
            <div className="space-y-2">
              <Label>Date &amp; time</Label>
              <input
                type="datetime-local"
                value={form.caughtAt}
                onChange={(e) => setForm((f) => ({ ...f, caughtAt: e.target.value }))}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
              />
            </div>

            {/* Location + weather */}
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Cairns, QLD"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchWeather}
                  disabled={!form.location.trim() || fetchingWeather}
                  className="shrink-0 px-3"
                >
                  {fetchingWeather ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get conditions"}
                </Button>
              </div>
              {weather && (
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 border text-sm">
                  <span className="text-slate-700 font-medium">{weather.description}</span>
                  <span className="flex items-center gap-1 text-slate-500 text-xs">
                    <Thermometer className="h-3 w-3" />{weather.tempC}°C
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-xs">
                    <Wind className="h-3 w-3" />{weather.windKmh} km/h
                  </span>
                </div>
              )}
            </div>

            {/* Tide phase */}
            <div className="space-y-2">
              <Label>Tide phase</Label>
              <Select value={form.tidePhase} onValueChange={(v) => setForm((f) => ({ ...f, tidePhase: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tide…" />
                </SelectTrigger>
                <SelectContent>
                  {TIDE_PHASES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Size & weight */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Length (cm)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 85"
                  value={form.lengthCm}
                  onChange={(e) => setForm((f) => ({ ...f, lengthCm: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 4.5"
                  value={form.weightKg}
                  onChange={(e) => setForm((f) => ({ ...f, weightKg: e.target.value }))}
                />
              </div>
            </div>

            {/* Leader weight */}
            <div className="space-y-2">
              <Label>Leader / line weight (lb)</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g. 4"
                value={form.lineWeightLb}
                onChange={(e) => setForm((f) => ({ ...f, lineWeightLb: e.target.value }))}
              />
              <p className="text-xs text-slate-400">Used for the 4lb Club challenge leaderboard</p>
            </div>

            {/* Gear */}
            <div className="space-y-2">
              <Label>Gear used</Label>
              <Input
                placeholder="e.g. 20lb spin, 40g metal jig"
                value={form.gearUsed}
                onChange={(e) => setForm((f) => ({ ...f, gearUsed: e.target.value }))}
              />
            </div>

            {/* Photo */}
            <div className="space-y-2">
              <Label>Photo or Instagram link</Label>
              <Input
                type="url"
                placeholder="https://instagram.com/p/…"
                value={form.photoUrl}
                onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Bait used, conditions, structure, tips…"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
              />
            </div>

            <Button
              onClick={handleLogCatch}
              disabled={saving}
              className="w-full"
            >
              {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</> : "Log Catch"}
            </Button>

            {/* Catch history */}
            {speciesCatches.length > 0 && (
              <div className="pt-2 border-t space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Catch history</p>
                {speciesCatches.map((c) => {
                  const wx: WeatherResult | null = c.weatherConditions ? (() => { try { return JSON.parse(c.weatherConditions!); } catch { return null; } })() : null;
                  return (
                    <div key={c.id} className="flex items-start justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-700">
                          {new Date(c.caughtAt).toLocaleString("en-AU", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </div>
                        {c.location && <div className="text-xs text-slate-500">{c.location}</div>}
                        {wx && <div className="text-xs text-slate-500">{wx.description}, {wx.tempC}°C, Wind {wx.windKmh} km/h</div>}
                        <div className="flex gap-3 mt-1 text-xs text-slate-600">
                          {c.lengthCm && <span>{c.lengthCm} cm</span>}
                          {c.weightKg && <span>{c.weightKg} kg</span>}
                          {c.lineWeightLb && <span>{c.lineWeightLb}lb leader</span>}
                          {c.gearUsed && <span className="truncate max-w-[12rem]">{c.gearUsed}</span>}
                        </div>
                        {c.notes && <p className="text-xs text-slate-500 mt-0.5 leading-snug">{c.notes}</p>}
                        {c.photoUrl && (
                          <a href={c.photoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0F766E] hover:underline">
                            View photo ↗
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteCatch(c.id)}
                        className="shrink-0 text-slate-300 hover:text-red-500 transition-colors mt-0.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
