"use client";

import { useState, useRef } from "react";
import { CheckCircle2, Circle, Plus, Loader2, Package, Trash2, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { ChecklistItem, TripParticipant } from "@/db/schema";

const CATEGORY_LABELS: Record<string, string> = {
  tackle: "Tackle & Lures",
  safety: "Safety Equipment",
  clothing: "Clothing & Sun Protection",
  food: "Food, Water & Ice",
  logistics: "Logistics & Admin",
  other: "Other",
};

function parseAssignedTo(assignedTo: string | null): string[] {
  if (!assignedTo) return [];
  try {
    const parsed = JSON.parse(assignedTo);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return [assignedTo];
  }
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

interface GearChecklistClientProps {
  tripId: string;
  initialItems: ChecklistItem[];
  targetSpecies: string[];
  participants: TripParticipant[];
}

export function GearChecklistClient({ tripId, initialItems, targetSpecies, participants }: GearChecklistClientProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [generating, setGenerating] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [addingItem, setAddingItem] = useState(false);
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);
  const [taggingItemId, setTaggingItemId] = useState<string | null>(null);
  const touchStartX = useRef<number>(0);

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
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, isCompleted: current } : i)));
    }
  };

  const handleDelete = async (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    setSwipedItemId(null);
    await fetch(`/api/trips/${tripId}/gear/${itemId}`, { method: "DELETE" });
  };

  const handleToggleAssignee = async (itemId: string, name: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const current = parseAssignedTo(item.assignedTo);
    const next = current.includes(name) ? current.filter((n) => n !== name) : [...current, name];
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, assignedTo: JSON.stringify(next) } : i)));
    try {
      await fetch(`/api/trips/${tripId}/gear/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: next }),
      });
    } catch {
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, assignedTo: item.assignedTo } : i)));
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

  if (items.length === 0) {
    return (
      <div className="border-2 border-dashed rounded-xl p-10 text-center">
        <Package className="h-10 w-10 text-slate-300 mx-auto mb-4" />
        <h3 className="font-semibold text-slate-700 mb-2">No gear list yet</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
          Generate a recommended tackle and equipment list based on your target species.
        </p>
        <Button onClick={handleGenerate} disabled={generating} className="gap-2">
          {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</> : "Generate Gear List"}
        </Button>
        {targetSpecies.length > 0 && (
          <p className="text-xs text-muted-foreground mt-4">
            Based on: {targetSpecies.slice(0, 4).join(", ")}{targetSpecies.length > 4 ? "…" : ""}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className="space-y-6"
      onClick={() => { setSwipedItemId(null); setTaggingItemId(null); }}
    >
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${items.length > 0 ? (completedCount / items.length) * 100 : 0}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground shrink-0">{completedCount}/{items.length} packed</span>
      </div>

      {/* Items grouped by category */}
      {Object.entries(grouped).map(([cat, catItems]) => (
        <div key={cat}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-slate-700">{CATEGORY_LABELS[cat] ?? cat}</h3>
            <span className="text-xs text-muted-foreground">
              {catItems.filter((i) => i.isCompleted).length}/{catItems.length}
            </span>
          </div>
          <div className="border rounded-xl divide-y overflow-hidden">
            {catItems.map((item) => {
              const assignees = parseAssignedTo(item.assignedTo);
              const isSwiped = swipedItemId === item.id;
              const isTagging = taggingItemId === item.id;
              return (
                <div key={item.id} className="relative overflow-hidden">
                  {/* Red delete backdrop (revealed on swipe) */}
                  <div className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="text-white text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Item row */}
                  <div
                    className={cn(
                      "relative bg-white flex items-start gap-3 px-4 py-3 transition-transform duration-200 group",
                      isSwiped ? "-translate-x-20" : "translate-x-0"
                    )}
                    onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                    onTouchEnd={(e) => {
                      const delta = e.changedTouches[0].clientX - touchStartX.current;
                      if (delta < -60) {
                        e.stopPropagation();
                        setSwipedItemId(item.id);
                        setTaggingItemId(null);
                      } else if (delta > 30 && isSwiped) {
                        setSwipedItemId(null);
                      }
                    }}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggle(item.id, item.isCompleted ?? false); }}
                      className="shrink-0 mt-0.5"
                    >
                      {item.isCompleted
                        ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        : <Circle className="h-5 w-5 text-slate-300" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <span className={cn("text-sm", item.isCompleted && "line-through text-muted-foreground")}>
                        {item.itemName}
                        {(item.quantity ?? 1) > 1 && (
                          <span className="text-muted-foreground ml-1.5">× {item.quantity}</span>
                        )}
                      </span>

                      {/* Assignee circles + tag button */}
                      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                        {assignees.map((name) => (
                          <span
                            key={name}
                            title={name}
                            className="w-6 h-6 rounded-full bg-teal-500 text-white text-[10px] font-semibold flex items-center justify-center shrink-0"
                          >
                            {getInitials(name)}
                          </span>
                        ))}
                        {participants.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTaggingItemId(isTagging ? null : item.id);
                              setSwipedItemId(null);
                            }}
                            className="w-6 h-6 rounded-full border border-dashed border-slate-300 text-slate-400 flex items-center justify-center hover:border-teal-500 hover:text-teal-500 transition-colors shrink-0"
                            title="Tag crew members"
                          >
                            <UserPlus className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {/* Tagging popover */}
                      {isTagging && (
                        <div
                          className="mt-2 flex flex-wrap gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {participants.map((p) => {
                            const tagged = assignees.includes(p.name);
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => handleToggleAssignee(item.id, p.name)}
                                className={cn(
                                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all",
                                  tagged
                                    ? "bg-teal-500 text-white border-teal-500"
                                    : "border-slate-200 text-slate-600 hover:border-teal-400"
                                )}
                              >
                                {tagged && <Check className="h-3 w-3" />}
                                {p.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Desktop trash icon on hover */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500 mt-0.5 hidden sm:block"
                      title="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
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
    </div>
  );
}
