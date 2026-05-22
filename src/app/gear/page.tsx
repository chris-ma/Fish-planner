"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Fish, Package } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  SPECIES_GEAR,
  ENV_CHECKLIST,
  UNIVERSAL_CHECKLIST,
  ENVIRONMENT_LABELS,
  ENVIRONMENT_EMOJI,
  TECHNIQUE_LABELS,
  TECHNIQUE_COLORS,
  type Environment,
  type TechniqueStyle,
} from "@/lib/gear-specs";

const ENVIRONMENTS: { value: Environment | "all"; label: string; emoji: string }[] = [
  { value: "all", label: "All", emoji: "🎣" },
  { value: "offshore_boat", label: "Offshore Boat", emoji: "⛵" },
  { value: "inshore_boat", label: "Inshore Boat", emoji: "🚤" },
  { value: "estuary_boat", label: "Estuary Boat", emoji: "🛶" },
  { value: "land_based", label: "Land-Based", emoji: "🪨" },
  { value: "freshwater_boat", label: "Freshwater Boat", emoji: "⛵" },
  { value: "freshwater_shore", label: "Freshwater Shore", emoji: "🌿" },
];

const TECHNIQUES: { value: TechniqueStyle | "all"; label: string; color: string }[] = [
  { value: "all", label: "All Styles", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { value: "trolling", label: "Trolling", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "heavy", label: "Heavy", color: "bg-red-100 text-red-700 border-red-200" },
  { value: "medium", label: "Medium", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "light", label: "Light", color: "bg-sky-100 text-sky-700 border-sky-200" },
  { value: "finesse", label: "Finesse", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "fly", label: "Fly", color: "bg-teal-100 text-teal-700 border-teal-200" },
];

const CATEGORY_COLORS: Record<string, string> = {
  pelagic: "bg-blue-500",
  inshore: "bg-cyan-500",
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

export default function GearPage() {
  const [env, setEnv] = useState<Environment | "all">("all");
  const [technique, setTechnique] = useState<TechniqueStyle | "all">("all");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const filteredSpecies = useMemo(() => {
    return SPECIES_GEAR.filter((s) => {
      const envMatch = env === "all" || s.environments.includes(env as Environment);
      const techMatch = technique === "all" || s.techniques.includes(technique as TechniqueStyle);
      return envMatch && techMatch;
    });
  }, [env, technique]);

  const toggleChecked = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Build checklist from selected environment
  const checklistItems = useMemo(() => {
    const envItems = env !== "all" ? ENV_CHECKLIST[env] ?? [] : [];
    return { envItems, universal: UNIVERSAL_CHECKLIST };
  }, [env]);

  const totalChecklist = checklistItems.envItems.length + checklistItems.universal.length;
  const checkedCount = [...checklistItems.envItems, ...checklistItems.universal].filter((_, i) =>
    checked.has(`cl-${i}`)
  ).length;

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-[#020B14] py-12 px-4 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-64 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-[#FFD60A] text-sm font-semibold mb-2 tracking-wide uppercase">Gear Guide</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F5F0E8] mb-3">What to Pack</h1>
          <p className="text-white/60 max-w-xl">
            Filter by where you're fishing and your technique style to find exact rod, reel, line, and lure specs for every species.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Filter Section */}
        <div className="space-y-4">
          {/* Environment filter */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Fishing environment</p>
            <div className="flex flex-wrap gap-2">
              {ENVIRONMENTS.map((e) => (
                <button
                  key={e.value}
                  onClick={() => setEnv(e.value as Environment | "all")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all font-medium",
                    env === e.value
                      ? "bg-[#020B14] text-white border-[#020B14]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  )}
                >
                  <span>{e.emoji}</span>
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          {/* Technique filter */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Technique style</p>
            <div className="flex flex-wrap gap-2">
              {TECHNIQUES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTechnique(t.value as TechniqueStyle | "all")}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm border transition-all font-medium",
                    technique === t.value
                      ? cn(t.color, "ring-2 ring-offset-1 ring-current")
                      : cn(t.value === "all" ? "bg-white text-slate-600 border-slate-200" : t.color, "opacity-60 hover:opacity-100")
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-500">
            {filteredSpecies.length} species match
          </p>
        </div>

        {/* Species gear cards */}
        {filteredSpecies.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Fish className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No species match those filters</p>
            <p className="text-sm mt-1">Try broadening your selection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSpecies.map((sp) => {
              const isOpen = expandedSlug === sp.slug;
              return (
                <div
                  key={sp.slug}
                  className="border border-border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Card header */}
                  <button
                    className="w-full text-left p-4 flex items-start gap-3"
                    onClick={() => setExpandedSlug(isOpen ? null : sp.slug)}
                  >
                    {/* Category dot */}
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
                          <p className="text-xs text-slate-500 mt-0.5">
                            {CATEGORY_LABEL[sp.category]}
                          </p>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                        )}
                      </div>
                      {/* Technique + Environment badges */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sp.techniques.map((t) => (
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
                        {sp.environments.map((e) => (
                          <span
                            key={e}
                            className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium"
                          >
                            {ENVIRONMENT_EMOJI[e]} {ENVIRONMENT_LABELS[e]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>

                  {/* Expanded gear details */}
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50 px-4 pb-4 pt-3">
                      <table className="w-full text-sm">
                        <tbody className="divide-y divide-slate-100">
                          <GearRow label="Rod" value={sp.rod} />
                          <GearRow label="Reel" value={sp.reel} />
                          <GearRow label="Line" value={sp.mainline} />
                          <GearRow label="Leader" value={sp.leader} />
                          {sp.lures && <GearRow label="Lures" value={sp.lures} />}
                          {sp.hooks && <GearRow label="Hooks/Bait" value={sp.hooks} />}
                        </tbody>
                      </table>
                      {sp.notes && (
                        <p className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                          💡 {sp.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Gear Checklist */}
        <div className="border border-border rounded-2xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-slate-50 transition-colors"
            onClick={() => setChecklistOpen((v) => !v)}
          >
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-slate-900">Packing Checklist</span>
              {env !== "all" && (
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {ENVIRONMENT_LABELS[env as Environment]}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">
                {checkedCount}/{totalChecklist}
              </span>
              {checklistOpen ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </div>
          </button>

          {checklistOpen && (
            <div className="border-t border-slate-100 divide-y bg-white">
              {/* Environment-specific items */}
              {checklistItems.envItems.length > 0 && (
                <>
                  <div className="px-5 py-2 bg-slate-50">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {ENVIRONMENT_LABELS[env as Environment]} — Specific Items
                    </p>
                  </div>
                  {checklistItems.envItems.map((item, i) => (
                    <ChecklistRow
                      key={`env-${i}`}
                      item={item.item}
                      notes={item.notes}
                      essential={item.essential}
                      category={item.category}
                      checked={checked.has(`cl-${i}`)}
                      onToggle={() => toggleChecked(`cl-${i}`)}
                    />
                  ))}
                </>
              )}

              {/* Universal items */}
              <div className="px-5 py-2 bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Universal — All Trips
                </p>
              </div>
              {checklistItems.universal.map((item, i) => {
                const idx = checklistItems.envItems.length + i;
                return (
                  <ChecklistRow
                    key={`uni-${i}`}
                    item={item.item}
                    essential={item.essential}
                    category={item.category}
                    checked={checked.has(`cl-${idx}`)}
                    onToggle={() => toggleChecked(`cl-${idx}`)}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <strong>Reminder:</strong> Always check current bag limits, size restrictions, and licence requirements for your state before your trip. Regulations can change seasonally.
        </div>
      </div>
    </div>
  );
}

function GearRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td className="py-1.5 pr-3 text-slate-500 font-medium whitespace-nowrap w-20 align-top">
        {label}
      </td>
      <td className="py-1.5 text-slate-800 leading-snug">{value}</td>
    </tr>
  );
}

function ChecklistRow({
  item,
  notes,
  essential,
  category,
  checked,
  onToggle,
}: {
  item: string;
  notes?: string;
  essential: boolean;
  category: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-slate-50 transition-colors",
        checked && "bg-slate-50"
      )}
    >
      {checked ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
      ) : (
        <Circle className="h-5 w-5 text-slate-300 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <span className={cn("text-sm", checked && "line-through text-slate-400")}>
          {item}
        </span>
        {notes && !checked && (
          <p className="text-xs text-slate-500 mt-0.5">{notes}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-slate-400">{category}</span>
        {essential && !checked && (
          <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
            Essential
          </span>
        )}
      </div>
    </button>
  );
}
