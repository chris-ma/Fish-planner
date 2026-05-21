"use client";

import { useState } from "react";
import { Plus, Anchor, Hotel, Plane, Car, MoreHorizontal, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import type { Booking } from "@/db/schema";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  charter: <Anchor className="h-4 w-4" />,
  accommodation: <Hotel className="h-4 w-4" />,
  flight: <Plane className="h-4 w-4" />,
  transport: <Car className="h-4 w-4" />,
  other: <MoreHorizontal className="h-4 w-4" />,
};

const TYPE_LABELS: Record<string, string> = {
  charter: "Charter / Boat",
  accommodation: "Accommodation",
  flight: "Flight",
  transport: "Transport",
  other: "Other",
};

interface BookingsListProps {
  tripId: string;
  initialBookings: Booking[];
}

export function BookingsList({ tripId, initialBookings }: BookingsListProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: "charter",
    title: "",
    providerName: "",
    confirmationRef: "",
    bookingDate: "",
    costAud: "",
    notes: "",
  });

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          costAud: form.costAud ? parseFloat(form.costAud) : undefined,
        }),
      });
      if (!res.ok) throw new Error();
      const newBooking = await res.json();
      setBookings((prev) => [...prev, newBooking]);
      setForm({ type: "charter", title: "", providerName: "", confirmationRef: "", bookingDate: "", costAud: "", notes: "" });
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const totalCost = bookings.reduce((s, b) => s + (b.costAud ?? 0), 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      {bookings.length > 0 && totalCost > 0 && (
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-4 mb-2">
          <DollarSign className="h-5 w-5 text-slate-500" />
          <span className="text-sm text-slate-600">Total estimated cost:</span>
          <span className="font-bold text-slate-900">${totalCost.toFixed(0)} AUD</span>
        </div>
      )}

      {/* Booking cards */}
      {bookings.map((b) => (
        <Card key={b.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                {TYPE_ICONS[b.type] ?? TYPE_ICONS.other}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm">{b.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {TYPE_LABELS[b.type] ?? b.type}
                      {b.providerName && ` · ${b.providerName}`}
                      {b.bookingDate && ` · ${b.bookingDate}`}
                    </div>
                  </div>
                  {b.costAud && (
                    <span className="text-sm font-bold text-slate-900 shrink-0">
                      ${b.costAud.toFixed(0)}
                    </span>
                  )}
                </div>
                {b.confirmationRef && (
                  <div className="mt-2 text-xs bg-slate-50 rounded px-2 py-1 inline-block font-mono">
                    Ref: {b.confirmationRef}
                  </div>
                )}
                {b.notes && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{b.notes}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {bookings.length === 0 && (
        <div className="border-2 border-dashed rounded-xl p-10 text-center text-muted-foreground">
          <p className="text-sm">No bookings yet.</p>
          <p className="text-xs mt-1">Add your charter, accommodation, flights and confirmations here.</p>
        </div>
      )}

      {/* Add button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add Booking
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_LABELS).map(([v, label]) => (
                    <SelectItem key={v} value={v}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="e.g. Saltwater Sportfishing Charter"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provider name</Label>
                <Input
                  placeholder="e.g. Capt. Murphy"
                  value={form.providerName}
                  onChange={(e) => setForm((f) => ({ ...f, providerName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Cost (AUD)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.costAud}
                  onChange={(e) => setForm((f) => ({ ...f, costAud: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Confirmation ref</Label>
                <Input
                  placeholder="Booking ref / number"
                  value={form.confirmationRef}
                  onChange={(e) => setForm((f) => ({ ...f, confirmationRef: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.bookingDate}
                  onChange={(e) => setForm((f) => ({ ...f, bookingDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Any details, confirmation text, important notes…"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
              />
            </div>
            <Button onClick={handleSave} disabled={saving || !form.title.trim()} className="w-full">
              {saving ? "Saving…" : "Save Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
