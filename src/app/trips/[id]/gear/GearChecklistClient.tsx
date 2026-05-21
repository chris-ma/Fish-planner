"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Plus, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { ChecklistItem } from "@/db/schema";

const CATEGORY_LABELS: Record<string, string> = {
  tackle: "Tackle & Lures",
  safety: "Safety Equipment",
  clothing: "Clothing & Sun Protection",
  food: "Food, Water & Ice",
  logistics: "Logistics & Admin",
  other: "Other",
};

interface GearChecklistClientProps {
  tripId: string;
  initialItems: ChecklistItem[];
  targetSpecies: string[];
}

export function GearChecklistClient({ tripId, initialItems, targetSpecies }: GearChecklistClientProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [generating, setGenerating] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [addingItem, setAddingItem] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/gear`, { method: "POST" });
      if (!res.ok) throw new Error();
      const { items: newItems } = await res.json();
      setItems(newItems);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggle = async (itemId: string, current: boolean) => {
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, isCompleted: !current } : i)));
    try {
      await fetch(`/api/trips/${tripId}/gear/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !current }),
      });
    } catch {
      // revert on failure
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, isCompleted: current } : i)));
    }
  };

  const handleAddItem = async () => {
    if (!newItem.trim()) return;
    setAddingItem(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/gear`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName: newItem.trim(), category: "other" }),
      });
      if (!res.ok) throw new Error();
      const item = await res.json();
      setItems((prev) => [...prev, item]);
      setNewItem("");
    } finally {
      setAddingItem(false);
    }
  };

  const grouped = items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    const cat = item.category ?? "other";
    acc[cat] = [...(acc[cat] ?? []), item];
    return acc;
  }, {});

  const completedCount = items.filter((i) => i.isCompleted).length;

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <div className="border-2 border-dashed rounded-xl p-10 text-center">
          <Package className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">No gear list yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
            Generate a recommended tackle and equipment list based on your target species.
          </p>
          <Button onClick={handleGenerate} disabled={generating} className="gap-2">
            {generating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
            ) : (
              "Generate Gear List"
            )}
          </Button>
          {targetSpecies.length > 0 && (
            <p className="text-xs text-muted-foreground mt-4">
              Based on: {targetSpecies.slice(0, 4).join(", ")}{targetSpecies.length > 4 ? "…" : ""}
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${items.length > 0 ? (completedCount / items.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground shrink-0">
              {completedCount}/{items.length} packed
            </span>
          </div>

          {/* Items by category */}
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-slate-700">{CATEGORY_LABELS[cat] ?? cat}</h3>
                <span className="text-xs text-muted-foreground">
                  {catItems.filter((i) => i.isCompleted).length}/{catItems.length}
                </span>
              </div>
              <div className="border rounded-xl divide-y">
                {catItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleToggle(item.id, item.isCompleted ?? false)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl",
                      item.isCompleted && "bg-slate-50"
                    )}
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                    )}
                    <span className={cn("text-sm flex-1", item.isCompleted && "line-through text-muted-foreground")}>
                      {item.itemName}
                      {(item.quantity ?? 1) > 1 && (
                        <span className="text-muted-foreground ml-1.5">× {item.quantity}</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Add custom item */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a custom item…"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
            />
            <Button variant="outline" onClick={handleAddItem} disabled={!newItem.trim() || addingItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
