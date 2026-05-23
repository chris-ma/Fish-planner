"use client";

import { useState } from "react";
import { Plus, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TripBudgetItem } from "@/db/schema";

const CATEGORIES = [
  { id: "accommodation", label: "Accommodation" },
  { id: "travel", label: "Travel" },
  { id: "food", label: "Food & Drinks" },
  { id: "activities", label: "Activities" },
  { id: "other", label: "Other" },
] as const;

type CategoryId = typeof CATEGORIES[number]["id"];

interface BudgetClientProps {
  tripId: string;
  initialItems: TripBudgetItem[];
  participantCount: number;
}

interface AddForm {
  description: string;
  amount: string;
}

export function BudgetClient({ tripId, initialItems, participantCount }: BudgetClientProps) {
  const [items, setItems] = useState<TripBudgetItem[]>(initialItems);
  const [addForms, setAddForms] = useState<Record<string, AddForm>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const grouped = CATEGORIES.reduce<Record<string, TripBudgetItem[]>>((acc, cat) => {
    acc[cat.id] = items.filter((i) => i.category === cat.id);
    return acc;
  }, {});

  const totalAmount = items.reduce((s, i) => s + i.amount, 0);
  const totalPaid = items.reduce((s, i) => s + i.paidAmount, 0);
  const perPerson = participantCount > 0 ? totalAmount / participantCount : null;

  function perPersonLabel(amount: number) {
    if (participantCount <= 0) return "—";
    return `$${(amount / participantCount).toFixed(0)}`;
  }

  const handleAdd = async (category: string) => {
    const form = addForms[category];
    if (!form?.description?.trim()) return;
    setSaving(category);
    try {
      const res = await fetch(`/api/trips/${tripId}/budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          description: form.description.trim(),
          amount: parseFloat(form.amount) || 0,
        }),
      });
      if (!res.ok) throw new Error();
      const item = await res.json();
      setItems((prev) => [...prev, item]);
      setAddForms((prev) => ({ ...prev, [category]: { description: "", amount: "" } }));
    } finally {
      setSaving(null);
    }
  };

  const handlePaidChange = async (itemId: string, value: string) => {
    const paidAmount = parseFloat(value) || 0;
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, paidAmount } : i)));
    await fetch(`/api/trips/${tripId}/budget/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paidAmount }),
    });
  };

  const handleDelete = async (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    await fetch(`/api/trips/${tripId}/budget/${itemId}`, { method: "DELETE" });
  };

  return (
    <div className="space-y-8">
      {/* Summary banner */}
      {items.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-slate-500" />
            <span className="text-sm text-slate-600">Total budget:</span>
            <span className="font-bold text-slate-900">${totalAmount.toFixed(0)}</span>
            {perPerson !== null && (
              <span className="text-xs text-slate-500 ml-2">
                ${perPerson.toFixed(0)} / person ({participantCount} crew)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 pl-7 text-sm text-slate-600">
            <span>Paid so far:</span>
            <span className="font-semibold text-emerald-700">${totalPaid.toFixed(0)}</span>
            {totalAmount > 0 && (
              <span className="text-xs text-slate-400">
                (${(totalAmount - totalPaid).toFixed(0)} remaining)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Category sections */}
      {CATEGORIES.map((cat) => {
        const catItems = grouped[cat.id] ?? [];
        const catTotal = catItems.reduce((s, i) => s + i.amount, 0);
        const form = addForms[cat.id] ?? { description: "", amount: "" };
        return (
          <div key={cat.id}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-slate-700">{cat.label}</h3>
              {catTotal > 0 && (
                <span className="text-xs text-slate-500">
                  ${catTotal.toFixed(0)} total
                </span>
              )}
            </div>

            {catItems.length > 0 && (
              <div className="border rounded-xl overflow-hidden mb-3">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 px-4 py-2 bg-slate-50 text-xs font-medium text-slate-500 border-b">
                  <span>Description</span>
                  <span className="text-right w-16">Amount</span>
                  <span className="text-right w-20">Per person</span>
                  <span className="text-right w-16">Paid</span>
                  <span className="w-6" />
                </div>

                {/* Item rows */}
                {catItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 px-4 py-2.5 items-center border-b last:border-0 hover:bg-slate-50 group">
                    <span className="text-sm text-slate-800 truncate">{item.description}</span>
                    <span className="text-sm text-right w-16 font-medium">${item.amount.toFixed(0)}</span>
                    <span className="text-xs text-right w-20 text-slate-500">{perPersonLabel(item.amount)}</span>
                    <div className="w-16">
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={item.paidAmount === 0 ? "" : String(item.paidAmount)}
                        placeholder="0"
                        onChange={(e) => handlePaidChange(item.id, e.target.value)}
                        className="h-7 text-xs text-right px-2"
                      />
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Inline add row */}
            <div className="flex gap-2 items-center">
              <Input
                placeholder={`Add ${cat.label.toLowerCase()} item…`}
                value={form.description}
                onChange={(e) =>
                  setAddForms((prev) => ({ ...prev, [cat.id]: { ...form, description: e.target.value } }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleAdd(cat.id)}
                className="flex-1 h-8 text-sm"
              />
              <Input
                type="number"
                min="0"
                placeholder="$0"
                value={form.amount}
                onChange={(e) =>
                  setAddForms((prev) => ({ ...prev, [cat.id]: { ...form, amount: e.target.value } }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleAdd(cat.id)}
                className="w-20 h-8 text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAdd(cat.id)}
                disabled={!form.description?.trim() || saving === cat.id}
                className="h-8 px-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
