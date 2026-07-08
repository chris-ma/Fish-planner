"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { MapPin, Fish, Package, Check, ChevronRight, ChevronLeft, Search, Loader2 } from "lucide-react";
import { getSpeciesImage } from "@/lib/images";

interface Species {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string | null;
  category: string;
}

interface OnboardingClientProps {
  species: Species[];
}

const TECHNIQUES = ["Soft Plastics", "Surface Lures", "Bait", "Trolling", "Jigging", "Fly"];
const ROD_TYPES = ["Spinning", "Baitcaster", "Fly", "Overhead"];

export function OnboardingClient({ species }: OnboardingClientProps) {
  const router = useRouter();
  const { user } = useUser();

  const [step, setStep] = useState(1);
  const [location, setLocation] = useState("");
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");

  const [dreamFish, setDreamFish] = useState("");
  const [speciesSearch, setSpeciesSearch] = useState("");

  const [rodType, setRodType] = useState("");
  const [reel, setReel] = useState("");
  const [lineWeight, setLineWeight] = useState("");
  const [leader, setLeader] = useState("");
  const [techniques, setTechniques] = useState<string[]>([]);
  const [setupNotes, setSetupNotes] = useState("");

  const [saving, setSaving] = useState(false);

  const filteredSpecies = species.filter((s) =>
    s.commonName.toLowerCase().includes(speciesSearch.toLowerCase())
  );

  async function geocodeLocation() {
    if (!location.trim()) return;
    setGeocoding(true);
    setGeocodeError("");
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`
      );
      const data = await res.json();
      const result = data.results?.[0];
      if (result) {
        setLocationCoords({ lat: result.latitude, lng: result.longitude });
        setLocationLabel(`${result.name}, ${result.admin1 ?? ""}, ${result.country_code}`);
      } else {
        setGeocodeError("Location not found. Try a nearby town or city.");
      }
    } catch {
      setGeocodeError("Could not reach geocoding service.");
    }
    setGeocoding(false);
  }

  function toggleTechnique(t: string) {
    setTechniques((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  async function completeOnboarding(skipSetup = false) {
    if (!user) return;
    setSaving(true);

    const mySetup = skipSetup
      ? null
      : { rodType, reel, lineWeight, leader, techniques, notes: setupNotes };

    await user.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        location,
        locationCoords,
        dreamFish,
        ...(mySetup ? { mySetup } : {}),
      },
    });

    await fetch("/api/onboarding/complete", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#0A1C28] text-[#EAE2D0] flex flex-col">
      {/* Header */}
      <div className="px-4 py-6 border-b border-white/10">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight text-[#C99A3E]">Fish Tripper</span>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  s <= step ? "bg-[#C99A3E]" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-4 py-8">
          {/* Step 1: Location */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-6 w-6 text-[#C99A3E]" />
                <p className="text-xs font-semibold text-[#C99A3E] uppercase tracking-wider">Step 1 of 3</p>
              </div>
              <h1 className="text-3xl font-bold mb-2">Where do you fish?</h1>
              <p className="text-[#EAE2D0]/60 mb-8">
                We'll show you what's biting near you and tailor the home page to your local waters.
              </p>

              <div className="flex gap-2 mb-3">
                <input
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setLocationCoords(null);
                    setLocationLabel("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && geocodeLocation()}
                  placeholder="e.g. Sydney, NSW"
                  className="flex-1 bg-[#0F2635] border border-white/20 rounded-xl px-4 py-3 text-[#EAE2D0] placeholder-white/30 focus:outline-none focus:border-[#C99A3E]"
                />
                <button
                  onClick={geocodeLocation}
                  disabled={geocoding || !location.trim()}
                  className="px-4 py-3 bg-[#C99A3E] hover:bg-[#AD8232] rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 flex items-center gap-2"
                >
                  {geocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find"}
                </button>
              </div>

              {locationLabel && (
                <div className="flex items-center gap-2 bg-[#C99A3E]/15 border border-[#C99A3E]/40 rounded-lg px-3 py-2 mb-4">
                  <Check className="h-4 w-4 text-[#C99A3E] shrink-0" />
                  <span className="text-sm text-[#EAE2D0]/80">{locationLabel}</span>
                </div>
              )}
              {geocodeError && (
                <p className="text-red-400 text-sm mb-4">{geocodeError}</p>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => completeOnboarding(true)}
                  className="text-sm text-white/40 hover:text-white/60 transition-colors"
                >
                  Skip for now
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!location.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-[#C99A3E] hover:bg-[#AD8232] rounded-xl font-semibold transition-colors disabled:opacity-40"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Dream Fish */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Fish className="h-6 w-6 text-[#C99A3E]" />
                <p className="text-xs font-semibold text-[#C99A3E] uppercase tracking-wider">Step 2 of 3</p>
              </div>
              <h1 className="text-3xl font-bold mb-2">Your dream fish</h1>
              <p className="text-[#EAE2D0]/60 mb-6">
                Pick the one species you'd love to catch. We'll feature it on your home page.
              </p>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  value={speciesSearch}
                  onChange={(e) => setSpeciesSearch(e.target.value)}
                  placeholder="Search species…"
                  className="w-full bg-[#0F2635] border border-white/20 rounded-xl pl-10 pr-4 py-3 text-[#EAE2D0] placeholder-white/30 focus:outline-none focus:border-[#C99A3E]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[45vh] overflow-y-auto pr-1">
                {filteredSpecies.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => setDreamFish(s.slug)}
                    className={`relative rounded-xl overflow-hidden aspect-[3/4] transition-all ${
                      dreamFish === s.slug ? "ring-2 ring-[#C99A3E] ring-offset-2 ring-offset-[#0A1C28]" : ""
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${getSpeciesImage(s.slug, s.category, 600)})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {dreamFish === s.slug && (
                      <div className="absolute top-2 right-2 bg-[#C99A3E] rounded-full p-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-xs font-semibold leading-tight">{s.commonName}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm text-white/50 hover:text-white/70 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#C99A3E] hover:bg-[#AD8232] rounded-xl font-semibold transition-colors"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: My Setup */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Package className="h-6 w-6 text-[#C99A3E]" />
                <p className="text-xs font-semibold text-[#C99A3E] uppercase tracking-wider">Step 3 of 3</p>
              </div>
              <h1 className="text-3xl font-bold mb-2">My setup</h1>
              <p className="text-[#EAE2D0]/60 mb-6">
                Optional — your gear defaults will pre-populate new trip checklists.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                    Rod type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROD_TYPES.map((rt) => (
                      <button
                        key={rt}
                        onClick={() => setRodType(rt === rodType ? "" : rt)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                          rodType === rt
                            ? "bg-[#C99A3E] border-[#C99A3E] text-white"
                            : "bg-[#0F2635] border-white/20 text-white/70 hover:border-white/40"
                        }`}
                      >
                        {rt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                    Reel
                  </label>
                  <input
                    value={reel}
                    onChange={(e) => setReel(e.target.value)}
                    placeholder="e.g. Shimano Sustain 4000"
                    className="w-full bg-[#0F2635] border border-white/20 rounded-xl px-4 py-3 text-[#EAE2D0] placeholder-white/30 focus:outline-none focus:border-[#C99A3E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                      Line
                    </label>
                    <input
                      value={lineWeight}
                      onChange={(e) => setLineWeight(e.target.value)}
                      placeholder="e.g. 10lb braid"
                      className="w-full bg-[#0F2635] border border-white/20 rounded-xl px-4 py-3 text-[#EAE2D0] placeholder-white/30 focus:outline-none focus:border-[#C99A3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                      Leader
                    </label>
                    <input
                      value={leader}
                      onChange={(e) => setLeader(e.target.value)}
                      placeholder="e.g. 8lb fluoro"
                      className="w-full bg-[#0F2635] border border-white/20 rounded-xl px-4 py-3 text-[#EAE2D0] placeholder-white/30 focus:outline-none focus:border-[#C99A3E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Preferred techniques
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TECHNIQUES.map((t) => (
                      <button
                        key={t}
                        onClick={() => toggleTechnique(t)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          techniques.includes(t)
                            ? "bg-[#C99A3E] border-[#C99A3E] text-white"
                            : "bg-[#0F2635] border-white/20 text-white/70 hover:border-white/40"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                    Notes
                  </label>
                  <textarea
                    value={setupNotes}
                    onChange={(e) => setSetupNotes(e.target.value)}
                    placeholder="Anything else about your go-to rig…"
                    rows={2}
                    className="w-full bg-[#0F2635] border border-white/20 rounded-xl px-4 py-3 text-[#EAE2D0] placeholder-white/30 focus:outline-none focus:border-[#C99A3E] resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 text-sm text-white/50 hover:text-white/70 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => completeOnboarding(true)}
                    disabled={saving}
                    className="px-4 py-3 text-sm text-white/50 hover:text-white/70 transition-colors disabled:opacity-40"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => completeOnboarding(false)}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-[#C99A3E] hover:bg-[#AD8232] rounded-xl font-semibold transition-colors disabled:opacity-40"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {saving ? "Saving…" : "Done"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
