"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Fish,
  Package,
  Ship,
  Anchor,
  Footprints,
  Waves,
  Leaf,
  Plus,
  X,
  Shield,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  SPECIES_GEAR,
  ENV_CHECKLIST,
  UNIVERSAL_CHECKLIST,
  ENVIRONMENT_LABELS,
  TECHNIQUE_LABELS,
  TECHNIQUE_COLORS,
  type Environment,
  type TechniqueStyle,
} from "@/lib/gear-specs";

const ENV_ICONS: Record<Environment, React.FC<{ className?: string }>> = {
  offshore_boat: Ship,
  inshore_boat: Anchor,
  estuary_boat: Ship,
  land_based: Footprints,
  freshwater_boat: Waves,
  freshwater_shore: Leaf,
};

const CATEGORY_COLORS: Record<string, string> = {
  pelagic: "bg-blue-500",
  inshore: "bg-teal-500",
  reef: "bg-orange-500",
  estuary: "bg-teal-500",
  freshwater: "bg-emerald-500",
};

const CATEGORY_LABEL: Record<string, string> = {
  pelagic: "Pelagic",
  inshore: "Inshore",
  reef: "Reef",
  estuary: "Estuary",
  freshwater: "Freshwater",
};

type TripTypeFilter = "all" | "boat" | "land" | "charter" | "kayak";

const TRIP_TYPE_LABELS: Record<TripTypeFilter, string> = {
  all: "All types",
  boat: "Boat",
  land: "Land-based",
  charter: "Charter",
  kayak: "Kayak",
};

const ENV_FOR_TRIP_TYPE: Record<TripTypeFilter, Environment[]> = {
  all: ["offshore_boat", "inshore_boat", "estuary_boat", "land_based", "freshwater_boat", "freshwater_shore"],
  boat: ["offshore_boat", "inshore_boat", "estuary_boat", "freshwater_boat"],
  land: ["land_based", "freshwater_shore"],
  charter: ["offshore_boat", "inshore_boat"],
  kayak: ["inshore_boat", "estuary_boat", "freshwater_shore"],
};

function GearRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td className="py-1.5 pr-3 text-slate-500 font-medium whitespace-nowrap w-24 align-top text-sm">
        {label}
      </td>
      <td className="py-1.5 text-slate-800 leading-snug text-sm">{value}</td>
    </tr>
  );
}

function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-slate-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {icon}
          {title}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      {open && <div className="px-4 pb-4 pt-2">{children}</div>}
    </div>
  );
}

export function GearClient() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [tripType, setTripType] = useState<TripTypeFilter>("all");
  const [customGear, setCustomGear] = useState<Record<string, string[]>>({});
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [newGearText, setNewGearText] = useState("");

  const relevantEnvs = ENV_FOR_TRIP_TYPE[tripType];

  const filteredSpecies = useMemo(() => {
    if (tripType === "all") return SPECIES_GEAR;
    return SPECIES_GEAR.filter((sp) =>
      sp.environments.some((e) => relevantEnvs.includes(e))
    );
  }, [tripType, relevantEnvs]);

  function addCustomItem(slug: string) {
    if (!newGearText.trim()) return;
    setCustomGear((prev) => ({
      ...prev,
      [slug]: [...(prev[slug] ?? []), newGearText.trim()],
    }));
    setNewGearText("");
    setAddingFor(null);
  }

  function removeCustomItem(slug: string, item: string) {
    setCustomGear((prev) => ({
      ...prev,
      [slug]: (prev[slug] ?? []).filter((i) => i !== item),
    }));
  }

  // Accessories from UNIVERSAL_CHECKLIST (non-safety categories)
  const accessoryItems = UNIVERSAL_CHECKLIST.filter(
    (i) => !["Safety"].includes(i.category)
  );

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-[#0A1C28] py-12 px-4 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-[#C99A3E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-64 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-[#C99A3E] text-sm font-semibold mb-2 tracking-wide uppercase">Gear Guide</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#EAE2D0] mb-3">What to Pack</h1>
          <p className="text-white/60 max-w-xl">
            Select a species to see exact rod, reel, line, lure and safety specs. Filter by trip type to refine the list.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Trip type filter */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trip type</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TRIP_TYPE_LABELS) as TripTypeFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTripType(t)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border font-medium transition-all",
                  tripType === t
                    ? "bg-[#0A1C28] text-white border-[#0A1C28]"
                    : "bg-[#EAE2D0] text-slate-600 border-slate-200 hover:border-slate-400"
                )}
              >
                {TRIP_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
          {tripType !== "all" && (
            <p className="text-sm text-slate-500 mt-2">{filteredSpecies.length} species for {TRIP_TYPE_LABELS[tripType].toLowerCase()} fishing</p>
          )}
        </div>

        {/* Species list */}
        {filteredSpecies.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Fish className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No species match that trip type</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSpecies.map((sp) => {
              const isOpen = openSlug === sp.slug;
              const EnvIcons = sp.environments.map((e) => ENV_ICONS[e]);
              const spCustomGear = customGear[sp.slug] ?? [];

              // Safety items based on species environments and trip type filter
              const safetyEnvs = tripType === "all"
                ? sp.environments
                : sp.environments.filter((e) => relevantEnvs.includes(e));
              const safetyItems = safetyEnvs.flatMap((e) =>
                (ENV_CHECKLIST[e] ?? []).filter((i) => i.category === "Safety")
              );
              const uniqueSafetyItems = safetyItems.filter(
                (item, idx, arr) => arr.findIndex((x) => x.item === item.item) === idx
              );

              return (
                <div
                  key={sp.slug}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-[#EAE2D0] shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Card header */}
                  <button
                    className="w-full text-left p-4 flex items-start gap-3"
                    onClick={() => setOpenSlug(isOpen ? null : sp.slug)}
                  >
                    <div
                      className={cn(
                        "w-2.5 h-2.5 rounded-full mt-1.5 shrink-0",
                        CATEGORY_COLORS[sp.category] ?? "bg-slate-400"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{sp.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{CATEGORY_LABEL[sp.category]}</p>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                        )}
                      </div>
                      {/* Technique badges + env icons */}
                      <div className="flex flex-wrap items-center gap-1 mt-2">
                        {sp.techniques.map((t: TechniqueStyle) => (
                          <span
                            key={t}
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full font-medium",
                              TECHNIQUE_COLORS[t]
                            )}
                          >
                            {TECHNIQUE_LABELS[t]}
                          </span>
                        ))}
                        {EnvIcons.map((Icon, i) => (
                          <span
                            key={sp.environments[i]}
                            title={ENVIRONMENT_LABELS[sp.environments[i]]}
                            className="w-5 h-5 flex items-center justify-center text-slate-400"
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>

                  {/* Expanded sections */}
                  {isOpen && (
                    <div>
                      {/* Fishing Gear */}
                      <AccordionSection
                        title="Fishing Gear"
                        icon={<Fish className="h-4 w-4 text-[#C99A3E]" />}
                        defaultOpen
                      >
                        <table className="w-full text-sm">
                          <tbody className="divide-y divide-slate-100">
                            <GearRow label="Rod" value={sp.rod} />
                            <GearRow label="Reel" value={sp.reel} />
                            <GearRow label="Line" value={sp.mainline} />
                            <GearRow label="Leader" value={sp.leader} />
                            {sp.lures && <GearRow label="Lures" value={sp.lures} />}
                            {sp.hooks && <GearRow label="Hooks" value={sp.hooks} />}
                            {sp.dragSetting && <GearRow label="Drag" value={sp.dragSetting} />}
                          </tbody>
                        </table>
                        {sp.notes && (
                          <p className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                            {sp.notes}
                          </p>
                        )}
                      </AccordionSection>

                      {/* Accessories */}
                      <AccordionSection
                        title="Accessories"
                        icon={<ShoppingBag className="h-4 w-4 text-slate-500" />}
                      >
                        <ul className="space-y-1">
                          {accessoryItems.map((item) => (
                            <li key={item.item} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="mt-0.5 text-slate-300">•</span>
                              <span>{item.item}</span>
                              {item.essential && (
                                <span className="ml-auto text-xs text-red-500 font-medium shrink-0">Essential</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </AccordionSection>

                      {/* Safety Gear (hidden for charter) */}
                      {tripType !== "charter" && uniqueSafetyItems.length > 0 && (
                        <AccordionSection
                          title="Safety Gear"
                          icon={<Shield className="h-4 w-4 text-red-500" />}
                        >
                          <ul className="space-y-1">
                            {uniqueSafetyItems.map((item) => (
                              <li key={item.item} className="flex items-start gap-2 text-sm text-slate-700">
                                <span className="mt-0.5 text-slate-300">•</span>
                                <div>
                                  <span>{item.item}</span>
                                  {item.notes && (
                                    <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>
                                  )}
                                </div>
                                {item.essential && (
                                  <span className="ml-auto text-xs text-red-500 font-medium shrink-0">Essential</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </AccordionSection>
                      )}

                      {/* My Gear */}
                      <AccordionSection
                        title="My Gear"
                        icon={<Package className="h-4 w-4 text-slate-500" />}
                      >
                        {spCustomGear.length > 0 && (
                          <ul className="space-y-1 mb-3">
                            {spCustomGear.map((item) => (
                              <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                                <Circle className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                <span className="flex-1">{item}</span>
                                <button
                                  type="button"
                                  onClick={() => removeCustomItem(sp.slug, item)}
                                  className="text-slate-300 hover:text-red-400 transition-colors"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                        {addingFor === sp.slug ? (
                          <div className="flex gap-2">
                            <input
                              autoFocus
                              type="text"
                              value={newGearText}
                              onChange={(e) => setNewGearText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") addCustomItem(sp.slug);
                                if (e.key === "Escape") { setAddingFor(null); setNewGearText(""); }
                              }}
                              placeholder="e.g. Custom jig 150g"
                              className="flex-1 text-sm px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C99A3E]"
                            />
                            <button
                              type="button"
                              onClick={() => addCustomItem(sp.slug)}
                              className="px-3 py-1.5 bg-[#C99A3E] text-[#0A1C28] rounded-lg text-sm font-medium hover:bg-[#AD8232]"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => { setAddingFor(null); setNewGearText(""); }}
                              className="px-2 py-1.5 text-slate-400 hover:text-slate-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAddingFor(sp.slug)}
                            className="flex items-center gap-1.5 text-sm text-[#C99A3E] hover:text-[#AD8232] font-medium"
                          >
                            <Plus className="h-4 w-4" />
                            Add gear item
                          </button>
                        )}
                      </AccordionSection>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <strong>Reminder:</strong> Always check current bag limits, size restrictions, and licence requirements for your state before your trip. Regulations can change seasonally.
        </div>
      </div>
    </div>
  );
}
