"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  MapPin, Mail, User, Settings, ChevronLeft, Check, Fish, Package,
  Pencil, X, Search, ChevronDown, ChevronUp
} from "lucide-react";
import { getSpeciesImage } from "@/lib/images";

interface Species {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string | null;
  category: string;
}

interface MySetup {
  rodType?: string;
  reel?: string;
  lineWeight?: string;
  leader?: string;
  techniques?: string[];
  notes?: string;
}

interface ProfileClientProps {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  location: string;
  dreamFish: string;
  mySetup: object | null;
  allSpecies: Species[];
}

const TECHNIQUES = ["Soft Plastics", "Surface Lures", "Bait", "Trolling", "Jigging", "Fly"];
const ROD_TYPES = ["Spinning", "Baitcaster", "Fly", "Overhead"];

function SavedBadge({ saved }: { saved: boolean }) {
  if (!saved) return null;
  return (
    <span className="flex items-center gap-1 text-xs text-[#0D9488] font-semibold">
      <Check className="h-3 w-3" /> Saved
    </span>
  );
}

export function ProfileClient({
  email,
  firstName,
  lastName,
  imageUrl,
  location: initialLocation,
  dreamFish: initialDreamFish,
  mySetup: initialMySetup,
  allSpecies,
}: ProfileClientProps) {
  const { user } = useUser();

  // Location
  const [location, setLocation] = useState(initialLocation);
  const [locationSaved, setLocationSaved] = useState(false);
  const [locationSaving, setLocationSaving] = useState(false);

  // Dream Fish
  const [dreamFish, setDreamFish] = useState(initialDreamFish);
  const [showFishPicker, setShowFishPicker] = useState(false);
  const [fishSearch, setFishSearch] = useState("");
  const [fishSaved, setFishSaved] = useState(false);

  // My Setup
  const parsedSetup = initialMySetup as MySetup | null;
  const [setupOpen, setSetupOpen] = useState(false);
  const [editSetup, setEditSetup] = useState(false);
  const [rodType, setRodType] = useState(parsedSetup?.rodType ?? "");
  const [reel, setReel] = useState(parsedSetup?.reel ?? "");
  const [lineWeight, setLineWeight] = useState(parsedSetup?.lineWeight ?? "");
  const [leader, setLeader] = useState(parsedSetup?.leader ?? "");
  const [techniques, setTechniques] = useState<string[]>(parsedSetup?.techniques ?? []);
  const [setupNotes, setSetupNotes] = useState(parsedSetup?.notes ?? "");
  const [setupSaved, setSetupSaved] = useState(false);
  const [setupSaving, setSetupSaving] = useState(false);

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Angler";

  const currentDreamFishSpecies = allSpecies.find((s) => s.slug === dreamFish);
  const filteredSpecies = allSpecies.filter((s) =>
    s.commonName.toLowerCase().includes(fishSearch.toLowerCase())
  );

  async function saveLocation() {
    if (!user) return;
    setLocationSaving(true);
    await user.update({ unsafeMetadata: { ...user.unsafeMetadata, location } });
    setLocationSaving(false);
    setLocationSaved(true);
    setTimeout(() => setLocationSaved(false), 2500);
  }

  async function saveDreamFish(slug: string) {
    if (!user) return;
    setDreamFish(slug);
    setShowFishPicker(false);
    await user.update({ unsafeMetadata: { ...user.unsafeMetadata, dreamFish: slug } });
    setFishSaved(true);
    setTimeout(() => setFishSaved(false), 2500);
  }

  async function saveSetup() {
    if (!user) return;
    setSetupSaving(true);
    const mySetup: MySetup = { rodType, reel, lineWeight, leader, techniques, notes: setupNotes };
    await user.update({ unsafeMetadata: { ...user.unsafeMetadata, mySetup } });
    setSetupSaving(false);
    setSetupSaved(true);
    setEditSetup(false);
    setTimeout(() => setSetupSaved(false), 2500);
  }

  function toggleTechnique(t: string) {
    setTechniques((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-8">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Avatar + name */}
        <div className="flex items-center gap-5 mb-10">
          <img
            src={imageUrl}
            alt={fullName}
            className="w-20 h-20 rounded-full object-cover border-2 border-[#0D9488]/30"
          />
          <div>
            <h1 className="text-2xl font-bold text-[#040F1C]">{fullName}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{email}</p>
          </div>
        </div>

        {/* Info fields */}
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 mb-6">
          {/* Name */}
          <div className="flex items-center gap-4 px-5 py-4">
            <User className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Name</p>
              <p className="text-sm text-[#040F1C] font-medium truncate">{fullName}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 px-5 py-4">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Email</p>
              <p className="text-sm text-[#040F1C] font-medium truncate">{email}</p>
            </div>
          </div>

          {/* Home Waters */}
          <div className="flex items-start gap-4 px-5 py-4">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-2.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Home Waters</p>
                <SavedBadge saved={locationSaved} />
              </div>
              <div className="flex gap-2">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sydney, NSW"
                  className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[#040F1C] focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
                />
                <button
                  onClick={saveLocation}
                  disabled={locationSaving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D9488] text-white text-xs font-semibold hover:bg-[#0F766E] transition-colors disabled:opacity-60"
                >
                  {locationSaving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>

          {/* Dream Fish */}
          <div className="flex items-start gap-4 px-5 py-4">
            <Fish className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Dream Fish</p>
                <div className="flex items-center gap-3">
                  <SavedBadge saved={fishSaved} />
                  <button
                    onClick={() => { setShowFishPicker((v) => !v); setFishSearch(""); }}
                    className="text-[#0D9488] text-xs font-semibold hover:underline"
                  >
                    {showFishPicker ? "Cancel" : currentDreamFishSpecies ? "Change" : "Set"}
                  </button>
                </div>
              </div>

              {currentDreamFishSpecies && !showFishPicker && (
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url(${getSpeciesImage(currentDreamFishSpecies.slug, currentDreamFishSpecies.category, 600)})` }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#040F1C]">{currentDreamFishSpecies.commonName}</p>
                    {currentDreamFishSpecies.scientificName && (
                      <p className="text-xs text-slate-400 italic">{currentDreamFishSpecies.scientificName}</p>
                    )}
                  </div>
                </div>
              )}

              {!currentDreamFishSpecies && !showFishPicker && (
                <p className="text-sm text-slate-400">Not set</p>
              )}

              {showFishPicker && (
                <div className="mt-2">
                  <div className="relative mb-3">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      value={fishSearch}
                      onChange={(e) => setFishSearch(e.target.value)}
                      placeholder="Search species…"
                      autoFocus
                      className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-[#040F1C] focus:outline-none focus:border-[#0D9488]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto">
                    {filteredSpecies.map((s) => (
                      <button
                        key={s.slug}
                        onClick={() => saveDreamFish(s.slug)}
                        className={`relative rounded-xl overflow-hidden aspect-square transition-all ${
                          dreamFish === s.slug ? "ring-2 ring-[#0D9488]" : ""
                        }`}
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${getSpeciesImage(s.slug, s.category, 600)})` }}
                        />
                        <div className="absolute inset-0 bg-black/50" />
                        <p className="absolute bottom-1 left-1 right-1 text-white text-[9px] font-semibold leading-tight text-center">
                          {s.commonName}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Setup */}
        <div className="bg-white rounded-2xl border border-slate-200 mb-6">
          <button
            onClick={() => setSetupOpen((v) => !v)}
            className="w-full flex items-center gap-4 px-5 py-4"
          >
            <Package className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-[#040F1C]">My Setup</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {parsedSetup?.rodType
                  ? `${parsedSetup.rodType} · ${parsedSetup.reel || "no reel"}`
                  : "Add your go-to rod, reel and line"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SavedBadge saved={setupSaved} />
              {setupOpen ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </div>
          </button>

          {setupOpen && (
            <div className="px-5 pb-5 border-t border-slate-100">
              {!editSetup ? (
                <div className="pt-4">
                  {parsedSetup && (parsedSetup.rodType || parsedSetup.reel) ? (
                    <div className="space-y-2 text-sm text-[#040F1C] mb-4">
                      {parsedSetup.rodType && (
                        <div className="flex gap-2">
                          <span className="text-slate-400 w-20 shrink-0">Rod</span>
                          <span className="font-medium">{parsedSetup.rodType}</span>
                        </div>
                      )}
                      {parsedSetup.reel && (
                        <div className="flex gap-2">
                          <span className="text-slate-400 w-20 shrink-0">Reel</span>
                          <span className="font-medium">{parsedSetup.reel}</span>
                        </div>
                      )}
                      {parsedSetup.lineWeight && (
                        <div className="flex gap-2">
                          <span className="text-slate-400 w-20 shrink-0">Line</span>
                          <span className="font-medium">{parsedSetup.lineWeight}</span>
                        </div>
                      )}
                      {parsedSetup.leader && (
                        <div className="flex gap-2">
                          <span className="text-slate-400 w-20 shrink-0">Leader</span>
                          <span className="font-medium">{parsedSetup.leader}</span>
                        </div>
                      )}
                      {parsedSetup.techniques && parsedSetup.techniques.length > 0 && (
                        <div className="flex gap-2">
                          <span className="text-slate-400 w-20 shrink-0">Techniques</span>
                          <span className="font-medium">{parsedSetup.techniques.join(", ")}</span>
                        </div>
                      )}
                      {parsedSetup.notes && (
                        <div className="flex gap-2">
                          <span className="text-slate-400 w-20 shrink-0">Notes</span>
                          <span className="font-medium">{parsedSetup.notes}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 mb-4">No setup saved yet.</p>
                  )}
                  <button
                    onClick={() => setEditSetup(true)}
                    className="inline-flex items-center gap-1.5 text-sm text-[#0D9488] font-semibold hover:underline"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {parsedSetup?.rodType ? "Edit setup" : "Add setup"}
                  </button>
                </div>
              ) : (
                <div className="pt-4 space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Rod type</p>
                    <div className="grid grid-cols-2 gap-2">
                      {ROD_TYPES.map((rt) => (
                        <button
                          key={rt}
                          onClick={() => setRodType(rt === rodType ? "" : rt)}
                          className={`py-1.5 px-3 rounded-lg text-sm font-medium border transition-colors ${
                            rodType === rt
                              ? "bg-[#0D9488] border-[#0D9488] text-white"
                              : "bg-slate-50 border-slate-200 text-[#040F1C] hover:border-slate-400"
                          }`}
                        >
                          {rt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Reel</label>
                    <input
                      value={reel}
                      onChange={(e) => setReel(e.target.value)}
                      placeholder="e.g. Shimano Sustain 4000"
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[#040F1C] focus:outline-none focus:border-[#0D9488]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Line</label>
                      <input
                        value={lineWeight}
                        onChange={(e) => setLineWeight(e.target.value)}
                        placeholder="e.g. 10lb braid"
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[#040F1C] focus:outline-none focus:border-[#0D9488]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Leader</label>
                      <input
                        value={leader}
                        onChange={(e) => setLeader(e.target.value)}
                        placeholder="e.g. 8lb fluoro"
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[#040F1C] focus:outline-none focus:border-[#0D9488]"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Preferred techniques</p>
                    <div className="flex flex-wrap gap-2">
                      {TECHNIQUES.map((t) => (
                        <button
                          key={t}
                          onClick={() => toggleTechnique(t)}
                          className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                            techniques.includes(t)
                              ? "bg-[#0D9488] border-[#0D9488] text-white"
                              : "bg-slate-50 border-slate-200 text-[#040F1C] hover:border-slate-400"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Notes</label>
                    <textarea
                      value={setupNotes}
                      onChange={(e) => setSetupNotes(e.target.value)}
                      placeholder="Anything else about your rig…"
                      rows={2}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[#040F1C] focus:outline-none focus:border-[#0D9488] resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditSetup(false)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                    <button
                      onClick={saveSetup}
                      disabled={setupSaving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0D9488] text-white text-sm font-semibold hover:bg-[#0F766E] transition-colors disabled:opacity-60"
                    >
                      {setupSaving ? "Saving…" : "Save setup"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account settings */}
        <div className="bg-white rounded-2xl border border-slate-200 mb-6">
          <div className="flex items-center gap-4 px-5 py-4">
            <Settings className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#040F1C]">Account settings</p>
              <p className="text-xs text-slate-400 mt-0.5">Change your name, email, password and connected accounts.</p>
            </div>
            <a href="/profile/manage" className="text-[#0D9488] text-xs font-semibold hover:underline shrink-0">
              Manage →
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/bucket-list"
            className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#040F1C] hover:border-[#0D9488] transition-colors"
          >
            My Bucket List
          </Link>
          <Link
            href="/trips"
            className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#040F1C] hover:border-[#0D9488] transition-colors"
          >
            My Trips
          </Link>
        </div>
      </div>
    </div>
  );
}
