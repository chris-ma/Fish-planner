"use client";

import { useState } from "react";
import { Copy, Check, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TripParticipant, ChecklistItem } from "@/db/schema";

const ROLE_LABELS: Record<string, string> = {
  owner: "Trip Owner",
  organizer: "Organizer",
  crew: "Crew",
};

interface GroupClientProps {
  tripId: string;
  initialParticipants: TripParticipant[];
  checklist: ChecklistItem[];
}

export function GroupClient({ tripId, initialParticipants, checklist }: GroupClientProps) {
  const [participants, setParticipants] = useState<TripParticipant[]>(initialParticipants);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/trips/${tripId}` : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMember = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), role: "crew" }),
      });
      if (!res.ok) throw new Error();
      const p = await res.json();
      setParticipants((prev) => [...prev, p]);
      setNewName("");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Share link */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Share this trip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Anyone with this link can view the trip and add themselves to the crew.
          </p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={shareUrl}
              className="bg-slate-50 font-mono text-xs"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button variant="outline" onClick={handleCopy} className="gap-2 shrink-0">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Crew list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Crew ({participants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {participants.length === 0 ? (
            <p className="text-sm text-muted-foreground pb-2">No crew members yet. Add names below.</p>
          ) : (
            <div className="divide-y mb-4">
              {participants.map((p) => {
                const assignedItems = checklist.filter((c) => c.assignedTo === p.name);
                return (
                  <div key={p.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{ROLE_LABELS[p.role] ?? p.role}</div>
                      </div>
                    </div>
                    {assignedItems.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {assignedItems.filter((i) => i.isCompleted).length}/{assignedItems.length} items packed
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add member */}
          <div className="flex gap-2">
            <Input
              placeholder="Add crew member name…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
            />
            <Button variant="outline" onClick={handleAddMember} disabled={!newName.trim() || adding}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
