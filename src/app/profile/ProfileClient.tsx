"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  MapPin, Mail, User, Settings, ChevronLeft, Check, Fish, Package,
  Pencil, X, Search, ChevronDown, ChevronUp, Loader2, Navigation
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

interface GeocodeResult {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

interface ProfileClientProps {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  nickname: string;
  avatarUrl: string;
  location: string;
  locationCoords: { lat: number; lng: number } | null;
  dreamFish: string;
  mySetup: object | null;
  allSpecies: Species[];
}

const TECHNIQUES = ["Soft Plastics", "Surface Lures", "Bait", "Trolling", "Jigging", "Fly"];
const ROD_TYPES = ["Spinning", "Baitcaster", "Fly", "Overhead"];

function SavedBadge({ saved }: { saved: boolean }) {
  if (!saved) return null;
  return (
    <span className="flex items-center gap-1 text-xs text-[#C99A3E] font-semibold">
      <Check className="h-3 w-3" /> Saved
    </span>
  );
}

function ProfileAvatar({ avatarUrl, clerkImageUrl, displayName }: { avatarUrl: string; clerkImageUrl: string; displayName: string }) {
  const preferred = avatarUrl || clerkImageUrl;
  const [src, setSrc] = useState(preferred);
  const [showInitials, setShowInitials] = useState(false);

  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  function handleError() {
    if (src === avatarUrl && clerkImageUrl && src !== clerkImageUrl) {
      setSrc(clerkImageUrl);
    } else {
      setShowInitials(true);
    }
  }

  if (showInitials || !src) {
    return (
      <div className="w-20 h-20 rounded-full bg-[#C99A3E]/20 flex items-center justify-center border-2 border-[#C99A3E]/30 shrink-0">
        <span className="text-2xl font-bold text-[#C99A3E]">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={displayName}
      className="w-20 h-20 rounded-full object-cover border-2 border-[#C99A3E]/30 shrink-0"
      onError={handleError}
    />
  );
}

export function ProfileClient({
  email,
  firstName,
  lastName,
  imageUrl,
  nickname: initialNickname,
  avatarUrl: initialAvatarUrl,
  location: initialLocation,
  locationCoords: initialCoords,
  dreamFish: initialDreamFish,
  mySetup: initialMySetup,
  allSpecies,
}: ProfileClientProps) {
  const { user } = useUser();

  // Nickname
  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameSaved, setNicknameSaved] = useState(false);
  const [nicknameSaving, setNicknameSaving] = useState(false);

  // Avatar URL
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [avatarSaved, setAvatarSaved] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);

  // Location
  const [locationInput, setLocationInput] = useState(initialLocation);
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(initialCoords);
  const [locationSaved, setLocationSaved] = useState(false);
  const [locationSaving, setLocationSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [detectingIP, setDetectingIP] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // IP-based location detection on mount (only if no location is set yet)
  useEffect(() => {
    if (initialLocation) return;
    setDetectingIP(true);
    fetch("https://freeipapi.com/api/json")
      .then((r) => r.json())
      .then((data) => {
        if (data.cityName && data.cityName !== "-") {
          const label = [data.cityName, data.regionName].filter(Boolean).join(", ");
          setLocationInput(label);
          setLocationCoords({ lat: data.latitude, lng: data.longitude });
        }
      })
      .catch(() => {})
      .finally(() => setDetectingIP(false));
  }, []);

  // Debounced geocoding search
  useEffect(() => {
    const input = locationInput.trim();
    if (input.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(input)}&count=5`
        );
        const data = await res.json();
        setSuggestions(data.results ?? []);
      } catch {
        setSuggestions([]);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [locationInput]);

  function selectSuggestion(result: GeocodeResult) {
    const label = [result.name, result.admin1, result.country].filter(Boolean).join(", ");
    setLocationInput(label);
    setLocationCoords({ lat: result.latitude, lng: result.longitude });
    setSuggestions([]);
    setShowSuggestions(false);
  }

  async function detectLocation() {
    setDetectingIP(true);
    try {
      const res = await fetch("https://freeipapi.com/api/json");
      const data = await res.json();
      if (data.cityName && data.cityName !== "-") {
        const label = [data.cityName, data.regionName].filter(Boolean).join(", ");
        setLocationInput(label);
        setLocationCoords({ lat: data.latitude, lng: data.longitude });
        setSuggestions([]);
      }
    } catch {}
    setDetectingIP(false);
  }

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

  async function saveNickname() {
    if (!user) return;
    setNicknameSaving(true);
    await user.update({ unsafeMetadata: { ...user.unsafeMetadata, nickname: nickname.trim() } });
    if (nickname.trim()) localStorage.setItem("bucketListName", nickname.trim());
    setNicknameSaving(false);
    setNicknameSaved(true);
    setTimeout(() => setNicknameSaved(false), 2500);
  }

  async function saveAvatar() {
    if (!user) return;
    setAvatarSaving(true);
    await user.update({ unsafeMetadata: { ...user.unsafeMetadata, avatarUrl: avatarUrl.trim() } });
    setAvatarSaving(false);
    setAvatarSaved(true);
    setTimeout(() => setAvatarSaved(false), 2500);
  }

  async function saveLocation() {
    if (!user) return;
    setLocationSaving(true);
    await user.update({
      unsafeMetadata: { ...user.unsafeMetadata, location: locationInput, locationCoords },
    });
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
    <div className="min-h-screen bg-[#EAE2D0]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-8">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Avatar + name */}
        <div className="flex items-center gap-5 mb-10">
          <ProfileAvatar
            avatarUrl={avatarUrl}
            clerkImageUrl={imageUrl}
            displayName={nickname || fullName}
          />
          <div>
            <h1 className="text-2xl font-bold text-[#0F2635]">{nickname || fullName}</h1>
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
              <p className="text-sm text-[#0F2635] font-medium truncate">{fullName}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 px-5 py-4">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Email</p>
              <p className="text-sm text-[#0F2635] font-medium truncate">{email}</p>
            </div>
          </div>

          {/* Nickname */}
          <div className="flex items-start gap-4 px-5 py-4">
            <Pencil className="h-4 w-4 text-slate-400 shrink-0 mt-2.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Nickname</p>
                <SavedBadge saved={nicknameSaved} />
              </div>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Mick"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[#0F2635] focus:outline-none focus:border-[#C99A3E] focus:ring-1 focus:ring-[#C99A3E]"
              />
              <p className="text-[10px] text-slate-400 mt-1">Used as your name in challenges and bucket list</p>
              <button
                onClick={saveNickname}
                disabled={nicknameSaving || !nickname.trim()}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C99A3E] text-[#0A1C28] text-xs font-semibold hover:bg-[#AD8232] transition-colors disabled:opacity-60"
              >
                {nicknameSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="flex items-start gap-4 px-5 py-4">
            <User className="h-4 w-4 text-slate-400 shrink-0 mt-2.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Profile Photo</p>
                <SavedBadge saved={avatarSaved} />
              </div>
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://… (paste an image URL)"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[#0F2635] focus:outline-none focus:border-[#C99A3E] focus:ring-1 focus:ring-[#C99A3E]"
              />
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={saveAvatar}
                  disabled={avatarSaving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C99A3E] text-[#0A1C28] text-xs font-semibold hover:bg-[#AD8232] transition-colors disabled:opacity-60"
                >
                  {avatarSaving ? "Saving…" : "Save"}
                </button>
                <a href="/profile/manage" className="text-[10px] text-[#C99A3E] font-semibold hover:underline">
                  Or upload via account settings →
                </a>
              </div>
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

              {/* Input + save row */}
              <div className="relative">
                <input
                  value={locationInput}
                  onChange={(e) => { setLocationInput(e.target.value); setShowSuggestions(true); setLocationCoords(null); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder={detectingIP ? "Detecting your location…" : "Search suburb, town or city"}
                  disabled={detectingIP}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-[#0F2635] focus:outline-none focus:border-[#C99A3E] focus:ring-1 focus:ring-[#C99A3E] disabled:opacity-50"
                />
                {detectingIP && (
                  <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 animate-spin" />
                )}

                {/* Autocomplete dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionRef}
                    className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
                  >
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onMouseDown={() => selectSuggestion(s)}
                        className="w-full text-left px-3 py-2 text-sm text-[#0F2635] hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100 last:border-0"
                      >
                        <MapPin className="h-3 w-3 text-[#C99A3E] shrink-0" />
                        <span className="truncate">
                          {[s.name, s.admin1, s.country].filter(Boolean).join(", ")}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Detect + coord confirmation row */}
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={detectLocation}
                  disabled={detectingIP}
                  className="flex items-center gap-1 text-[10px] text-[#C99A3E] font-semibold hover:underline disabled:opacity-40"
                >
                  <Navigation className="h-3 w-3" />
                  Detect my location
                </button>
                {locationCoords && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Check className="h-3 w-3 text-[#C99A3E]" /> Geocoded
                  </span>
                )}
              </div>

              <button
                onClick={saveLocation}
                disabled={locationSaving || !locationInput.trim()}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C99A3E] text-[#0A1C28] text-xs font-semibold hover:bg-[#AD8232] transition-colors disabled:opacity-60"
              >
                {locationSaving ? "Saving…" : "Save"}
              </button>
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
                    className="text-[#C99A3E] text-xs font-semibold hover:underline"
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
                    <p className="text-sm font-semibold text-[#0F2635]">{currentDreamFishSpecies.commonName}</p>
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
                      className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-[#0F2635] focus:outline-none focus:border-[#C99A3E]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto">
                    {filteredSpecies.map((s) => (
                      <button
                        key={s.slug}
                        onClick={() => saveDreamFish(s.slug)}
                        className={`relative rounded-xl overflow-hidden aspect-square transition-all ${
                          dreamFish === s.slug ? "ring-2 ring-[#C99A3E]" : ""
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
              <p className="text-sm font-semibold text-[#0F2635]">My Setup</p>
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
                    <div className="space-y-2 text-sm text-[#0F2635] mb-4">
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
                    className="inline-flex items-center gap-1.5 text-sm text-[#C99A3E] font-semibold hover:underline"
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
                              ? "bg-[#C99A3E] border-[#C99A3E] text-[#0A1C28]"
                              : "bg-slate-50 border-slate-200 text-[#0F2635] hover:border-slate-400"
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
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[#0F2635] focus:outline-none focus:border-[#C99A3E]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Line</label>
                      <input
                        value={lineWeight}
                        onChange={(e) => setLineWeight(e.target.value)}
                        placeholder="e.g. 10lb braid"
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[#0F2635] focus:outline-none focus:border-[#C99A3E]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Leader</label>
                      <input
                        value={leader}
                        onChange={(e) => setLeader(e.target.value)}
                        placeholder="e.g. 8lb fluoro"
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[#0F2635] focus:outline-none focus:border-[#C99A3E]"
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
                              ? "bg-[#C99A3E] border-[#C99A3E] text-[#0A1C28]"
                              : "bg-slate-50 border-slate-200 text-[#0F2635] hover:border-slate-400"
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
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[#0F2635] focus:outline-none focus:border-[#C99A3E] resize-none"
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
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C99A3E] text-[#0A1C28] text-sm font-semibold hover:bg-[#AD8232] transition-colors disabled:opacity-60"
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
              <p className="text-sm font-semibold text-[#0F2635]">Account settings</p>
              <p className="text-xs text-slate-400 mt-0.5">Change your name, email, password and connected accounts.</p>
            </div>
            <a href="/profile/manage" className="text-[#C99A3E] text-xs font-semibold hover:underline shrink-0">
              Manage →
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/bucket-list"
            className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0F2635] hover:border-[#C99A3E] transition-colors"
          >
            My Bucket List
          </Link>
          <Link
            href="/trips"
            className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0F2635] hover:border-[#C99A3E] transition-colors"
          >
            My Trips
          </Link>
        </div>
      </div>
    </div>
  );
}
