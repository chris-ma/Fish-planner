"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { TRIP_TYPES } from "@/lib/queries/gear";

const GEAR_DATA = {
  offshore_pelagic: {
    tackle: [
      { item: "Heavy trolling rod 80–130lb class", qty: 2, essential: true },
      { item: "Overhead trolling reel (Penn International / Shimano Tiagra)", qty: 2, essential: true },
      { item: "Skirted trolling lures (assorted colours, 9–14 inch)", qty: 6, essential: true, notes: "Black/red, purple/black, pink/white" },
      { item: "Large bibbed diving minnows (Halco, Pakula, Nomad DTX)", qty: 4, essential: false },
      { item: "Wire traces and heavy fluorocarbon leader", qty: 1, essential: true },
      { item: "Gaffs (2 short + 1 flying gaff for billfish)", qty: 1, essential: true },
      { item: "Live bait hooks (7/0–10/0) and rigging kit", qty: 1, essential: false },
      { item: "Light jigging spin setup 20–30lb", qty: 1, essential: false },
    ],
    safety: [],
    clothing: [],
    food: [{ item: "Large insulated fish box (100L+) with ice", qty: 1, essential: true }],
    logistics: [],
  },
  reef: {
    tackle: [
      { item: "Medium-heavy overhead rod 30–50lb, 6–7ft", qty: 2, essential: true },
      { item: "Shimano Electric or manual overhead reel", qty: 2, essential: true },
      { item: "50lb braid mainline + 60lb mono leader", qty: 1, essential: true },
      { item: "Double hook paternoster rigs + snapper leads 100–400g", qty: 1, essential: true },
      { item: "Frozen pilchards (2–3 boxes)", qty: 3, essential: true },
      { item: "Squid tubes and whole squid", qty: 2, essential: true },
      { item: "Large paddle tails 5–7 inch (Zerek, Zman)", qty: 1, essential: false },
      { item: "Bait board with knife and scissors", qty: 1, essential: true },
    ],
    safety: [],
    clothing: [],
    food: [],
    logistics: [],
  },
  estuary: {
    tackle: [
      { item: "7ft light-medium spinning rod (6–10lb or 10–15lb)", qty: 2, essential: true },
      { item: "Spinning reel 2500–4000 size with 10–15lb braid", qty: 2, essential: true },
      { item: "Soft plastics — paddle tails, curl tails, grubs 2–5 inch", qty: 1, essential: true, notes: "Natural + bright colours" },
      { item: "Jigheads 1/6–3/8 oz", qty: 1, essential: true },
      { item: "Shallow diving hard bodies 50–80mm", qty: 1, essential: false },
      { item: "Fluorocarbon leader 8–20lb", qty: 1, essential: true },
      { item: "Prawns, worms, mullet strips (optional bait)", qty: 1, essential: false },
      { item: "Rubber mesh landing net", qty: 1, essential: true },
    ],
    safety: [],
    clothing: [{ item: "Wading booties or neoprene waders", qty: 1, essential: false }],
    food: [],
    logistics: [],
  },
  inshore_sport: {
    tackle: [
      { item: "Heavy popper rod 40–80lb (topwater game rod)", qty: 1, essential: true },
      { item: "Shimano Stella / Daiwa Saltiga 8000–14000 with 65–80lb braid", qty: 1, essential: true },
      { item: "Cup face poppers 80–120g (Halco Roosta Popper, GT Raider)", qty: 4, essential: true },
      { item: "Sinking and floating stickbaits 100–160g", qty: 3, essential: false },
      { item: "Speed jigs 100–200g", qty: 4, essential: false },
      { item: "Heavy fluorocarbon trace 60–100lb", qty: 1, essential: true },
      { item: "Wire trace 60–100lb (Spanish mackerel cut-off prevention)", qty: 1, essential: false },
      { item: "Assist hook rigs for jigs", qty: 1, essential: true },
    ],
    safety: [],
    clothing: [],
    food: [],
    logistics: [],
  },
};

const SHARED_GEAR = {
  safety: [
    { item: "Life jackets / PFDs for all crew (AMSA approved)", qty: 1, essential: true },
    { item: "EPIRB (boat) or PLB (personal) — registered with AMSA", qty: 1, essential: true },
    { item: "VHF marine radio (handheld or fixed-mount)", qty: 1, essential: true },
    { item: "Marine flare kit (within expiry date)", qty: 1, essential: true },
    { item: "Marine first aid kit with hook removal", qty: 1, essential: true },
    { item: "Fully charged mobile in waterproof case", qty: 1, essential: true },
  ],
  clothing: [
    { item: "Polarised sunglasses (amber or grey lens)", qty: 1, essential: true },
    { item: "Long-sleeve UV sun shirt (UPF 50+)", qty: 1, essential: true },
    { item: "Wide-brim hat or cap (UPF 50+)", qty: 1, essential: true },
    { item: "SPF 50+ sunscreen (reef-safe)", qty: 2, essential: true },
    { item: "Fishing gloves (sun and grip protection)", qty: 1, essential: false },
  ],
  tackle: [
    { item: "Long-nose pliers and hook remover", qty: 1, essential: true },
    { item: "Sharp braid scissors", qty: 1, essential: true },
    { item: "Digital fishing scales (0–30kg)", qty: 1, essential: false },
    { item: "Folding fish ruler or measure tape", qty: 1, essential: true },
  ],
  food: [
    { item: "Drinking water — 2L per person per day", qty: 1, essential: true },
    { item: "High-energy snacks, sandwiches, easy-to-eat meals", qty: 1, essential: true },
    { item: "Esky with ice for catch and drinks", qty: 1, essential: true },
    { item: "Motion sickness tablets (Kwells/Stugeron) — take night before", qty: 1, essential: false },
  ],
  logistics: [
    { item: "Valid state fishing licence (QLD / NSW)", qty: 1, essential: true },
    { item: "Fillet knife, cutting board, fish bags, zip-lock bags", qty: 1, essential: true },
    { item: "Camera or GoPro for catch photos", qty: 1, essential: false },
    { item: "Waterproof torch or headlamp (early starts / night fishing)", qty: 1, essential: false },
  ],
};

const CATEGORY_LABELS: Record<string, string> = {
  tackle: "Tackle & Lures",
  safety: "Safety Equipment",
  clothing: "Clothing & Sun Protection",
  food: "Food, Water & Ice",
  logistics: "Logistics & Admin",
};

type TripType = keyof typeof GEAR_DATA;

export default function GearPage() {
  const [selectedType, setSelectedType] = useState<TripType>("offshore_pelagic");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const specificGear = GEAR_DATA[selectedType];

  const allCategories = ["tackle", "safety", "clothing", "food", "logistics"] as const;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Gear Guide</h1>
        <p className="text-slate-600">
          Select your trip type to get a recommended tackle and equipment checklist.
        </p>
      </div>

      {/* Trip type selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {TRIP_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setSelectedType(t.value as TripType)}
            className={cn(
              "p-4 rounded-xl border-2 text-left transition-all",
              selectedType === t.value
                ? "border-blue-600 bg-blue-50"
                : "border-slate-200 hover:border-slate-300"
            )}
          >
            <div className="font-semibold text-sm mb-1">{t.label}</div>
            <div className="text-xs text-muted-foreground">{t.description}</div>
          </button>
        ))}
      </div>

      {/* Checklist */}
      <div className="space-y-6">
        {allCategories.map((cat) => {
          const specific = (specificGear as Record<string, { item: string; qty: number; essential: boolean; notes?: string }[]>)[cat] ?? [];
          const shared = SHARED_GEAR[cat] ?? [];
          const items = [...specific, ...shared];
          if (items.length === 0) return null;

          const categoryChecked = items.filter((_, i) => checked.has(`${cat}-${i}`)).length;

          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  {CATEGORY_LABELS[cat]}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {categoryChecked}/{items.length}
                </span>
              </div>
              <div className="border rounded-xl divide-y">
                {items.map((item, i) => {
                  const key = `${cat}-${i}`;
                  const isChecked = checked.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggle(key)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl",
                        isChecked && "bg-slate-50"
                      )}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={cn("text-sm", isChecked && "line-through text-muted-foreground")}>
                          {item.item}
                          {item.qty > 1 && (
                            <span className="text-muted-foreground ml-1.5">× {item.qty}</span>
                          )}
                        </div>
                        {(item as { notes?: string }).notes && !isChecked && (
                          <div className="text-xs text-muted-foreground mt-0.5">{(item as { notes?: string }).notes}</div>
                        )}
                      </div>
                      {item.essential && !isChecked && (
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full shrink-0 font-medium">
                          Essential
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <strong>Reminder:</strong> Always check current bag limits, size restrictions, and licence requirements for your state before your trip. Regulations can change seasonally.
      </div>
    </div>
  );
}
