"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { Fish } from "lucide-react";
import type { ChallengeConfig } from "@/lib/challenges";
import type { RankedEntry } from "@/app/api/challenges/[slug]/entries/route";

const MEDAL = ["🥇", "🥈", "🥉"];

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const SPECIES_OPTIONS = [
  "Barramundi",
  "Flathead",
  "Snapper",
  "Bream",
  "Whiting",
  "Kingfish",
  "Tuna",
  "Spanish Mackerel",
  "Mulloway",
  "Salmon",
  "Tailor",
  "Marlin",
  "Mahi Mahi",
  "Coral Trout",
  "Mangrove Jack",
  "Murray Cod",
  "Golden Perch",
  "European Carp",
  "Other",
];

export default function ChallengeDetailClient({
  challenge,
  initialEntries,
}: {
  challenge: ChallengeConfig;
  initialEntries: RankedEntry[];
}) {
  const [entries, setEntries] = useState<RankedEntry[]>(initialEntries);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState(challenge.speciesSlug ?? "");
  const [lengthCm, setLengthCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [gearUsed, setGearUsed] = useState("");
  const [caughtAt, setCaughtAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [location, setLocation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("bucketListName");
    if (saved) setName(saved);
  }, []);

  async function refetchEntries() {
    const res = await fetch(`/api/challenges/${challenge.slug}/entries`);
    if (res.ok) {
      const data = await res.json();
      setEntries(data.entries);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Please enter your name."); return; }
    if (challenge.requiresField === "lengthCm" && !lengthCm) { setError("Length is required for this challenge."); return; }
    if (challenge.requiresField === "weightKg" && !weightKg) { setError("Weight is required for this challenge."); return; }
    if (challenge.requiresField === "gearUsed" && !gearUsed.trim()) { setError("Gear description is required for this challenge."); return; }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        catcherName: name.trim(),
        speciesSlug: species || "unknown",
        caughtAt,
        challengeSlug: challenge.slug,
      };
      if (location) body.location = location;
      if (photoUrl) body.photoUrl = photoUrl;
      if (notes) body.notes = notes;
      if (lengthCm) body.lengthCm = parseFloat(lengthCm);
      if (weightKg) body.weightKg = parseFloat(weightKg);
      if (gearUsed) body.gearUsed = gearUsed;

      const res = await fetch("/api/catches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to submit");

      localStorage.setItem("bucketListName", name.trim());
      setSubmitted(true);
      setLengthCm("");
      setWeightKg("");
      setGearUsed("");
      setLocation("");
      setPhotoUrl("");
      setNotes("");
      await refetchEntries();
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const isGallery = challenge.metric === "gallery";

  return (
    <div>
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${challenge.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#0D9488]" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <Link
            href="/challenges"
            className="text-[#0D9488] text-xs font-semibold mb-3 inline-block hover:underline"
          >
            ← All Challenges
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{challenge.title}</h1>
          <p className="text-white/70 text-sm max-w-xl">{challenge.description}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* Leaderboard / Gallery */}
        <section>
          <div className="mb-5">
            <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
            <h2 className="text-xl font-bold text-[#0D9488]">
              {isGallery ? "Gallery" : "Leaderboard"}
            </h2>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm border border-dashed border-slate-200 rounded-2xl">
              No entries yet — be the first to log a catch below.
            </div>
          ) : isGallery ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {entries.map((e) => (
                <div key={e.id} className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                  {e.photoUrl ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={e.photoUrl}
                        alt={e.catcherName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-100 flex items-center justify-center">
                      <Fish className="h-10 w-10 text-slate-300" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="font-semibold text-sm text-slate-800">{e.catcherName}</p>
                    {e.gearUsed && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{e.gearUsed}</p>
                    )}
                    {e.notes && !e.gearUsed && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{e.notes}</p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1.5">{formatDate(e.caughtAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((e) => (
                <div
                  key={e.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    e.rank === 1 ? "border-amber-200 bg-amber-50" : "border-slate-100 bg-white"
                  }`}
                >
                  <div className="w-10 text-center shrink-0">
                    {e.rank != null && e.rank <= 3 ? (
                      <span className="text-xl">{MEDAL[(e.rank) - 1]}</span>
                    ) : (
                      <span className="text-sm font-bold text-slate-400">{e.rank}</span>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#0D9488]/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#0D9488]">{initials(e.catcherName)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{e.catcherName}</p>
                    {e.location && (
                      <p className="text-xs text-slate-500 truncate">{e.location}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-[#0D9488]">
                      {e.metric} {challenge.unit}
                    </p>
                    <p className="text-xs text-slate-400">{formatDate(e.caughtAt)}</p>
                  </div>
                  {e.photoUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <img src={e.photoUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Log Your Entry */}
        <section>
          <div className="mb-5">
            <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
            <h2 className="text-xl font-bold text-[#0D9488]">Log Your Entry</h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
          >
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mick"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
              />
            </div>

            {/* Challenge-specific required field */}
            {challenge.requiresField === "lengthCm" && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Length (cm) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={lengthCm}
                  onChange={(e) => setLengthCm(e.target.value)}
                  placeholder="e.g. 87.5"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                />
              </div>
            )}
            {challenge.requiresField === "weightKg" && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Weight (kg) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="e.g. 2.3"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                />
              </div>
            )}
            {challenge.requiresField === "gearUsed" && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Gear / Lure Used *</label>
                <input
                  value={gearUsed}
                  onChange={(e) => setGearUsed(e.target.value)}
                  placeholder="e.g. A bread crust tied to a bent paperclip"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Species */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Species</label>
                {challenge.speciesSlug ? (
                  <input
                    value={species}
                    readOnly
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-500"
                  />
                ) : (
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                  >
                    <option value="">Select species…</option>
                    {SPECIES_OPTIONS.map((s) => (
                      <option key={s} value={s.toLowerCase().replace(/\s+/g, "-")}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Date &amp; Time</label>
                <input
                  type="datetime-local"
                  value={caughtAt}
                  onChange={(e) => setCaughtAt(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Jervis Bay"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
              />
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Photo URL{" "}
                {isGallery && (
                  <span className="text-[#0D9488] font-normal">(encouraged)</span>
                )}
              </label>
              <input
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://…"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Story, conditions, brag…"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}
            {submitted && (
              <p className="text-[#0D9488] text-xs font-semibold">
                Entry logged! Leaderboard updated.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              {submitting ? "Submitting…" : "Submit Entry"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
