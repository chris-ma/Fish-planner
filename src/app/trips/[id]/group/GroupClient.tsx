"use client";

import { useState } from "react";
import { Copy, Check, Plus, Square, CheckSquare, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TripParticipant, ChecklistItem, TripNote, TripTask } from "@/db/schema";

type Availability = "going" | "tentative" | "out";

const AVAIL: Record<Availability, { label: string; active: string; inactive: string }> = {
  going:     { label: "Going",     active: "bg-teal-100 text-teal-800 border-teal-300",   inactive: "border-slate-200 text-slate-400" },
  tentative: { label: "Tentative", active: "bg-amber-100 text-amber-800 border-amber-300", inactive: "border-slate-200 text-slate-400" },
  out:       { label: "Out",       active: "bg-red-100 text-red-700 border-red-300",       inactive: "border-slate-200 text-slate-400" },
};

interface GroupClientProps {
  tripId: string;
  initialParticipants: TripParticipant[];
  checklist: ChecklistItem[];
  initialNotes: TripNote[];
  initialTasks: TripTask[];
}

export function GroupClient({ tripId, initialParticipants, checklist, initialNotes, initialTasks }: GroupClientProps) {
  const [participants, setParticipants] = useState<TripParticipant[]>(initialParticipants);
  const [tasks, setTasks] = useState<TripTask[]>(initialTasks);
  const [notes, setNotes] = useState<TripNote[]>(initialNotes);

  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  const [newNoteAuthor, setNewNoteAuthor] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/trips/${tripId}` : "";
  const crewNames = participants.map((p) => p.name);

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

  const handleAvailability = async (participantId: string, availability: Availability) => {
    setParticipants((prev) => prev.map((p) => p.id === participantId ? { ...p, availability } : p));
    await fetch(`/api/trips/${tripId}/participants/${participantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availability }),
    });
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    setAddingTask(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskTitle.trim(), assignedTo: newTaskAssignee || null }),
      });
      if (!res.ok) throw new Error();
      const task = await res.json();
      setTasks((prev) => [...prev, task]);
      setNewTaskTitle("");
      setNewTaskAssignee("");
    } finally {
      setAddingTask(false);
    }
  };

  const patchTask = async (taskId: string, patch: Record<string, unknown>) => {
    await fetch(`/api/trips/${tripId}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  };

  const toggleTask = (taskId: string, isComplete: boolean) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, isComplete } : t));
    patchTask(taskId, { isComplete });
  };

  const flagApproval = (taskId: string) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, needsApproval: true } : t));
    patchTask(taskId, { needsApproval: true });
  };

  const approveTask = (taskId: string) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, isApproved: true } : t));
    patchTask(taskId, { isApproved: true });
  };

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: newNoteAuthor.trim() || "Anonymous",
          content: newNoteContent.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      const note = await res.json();
      setNotes((prev) => [note, ...prev]);
      setNewNoteContent("");
    } finally {
      setAddingNote(false);
    }
  };

  const pinnedNotes = notes.filter((n) => n.isPinned);
  const regularNotes = notes.filter((n) => !n.isPinned);

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
            <Input readOnly value={shareUrl} className="bg-slate-50 font-mono text-xs" onClick={(e) => (e.target as HTMLInputElement).select()} />
            <Button variant="outline" onClick={handleCopy} className="gap-2 shrink-0">
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Crew & Availability */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Crew &amp; Availability ({participants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {participants.length === 0 ? (
            <p className="text-sm text-muted-foreground pb-2">No crew members yet. Add names below.</p>
          ) : (
            <div className="divide-y mb-4">
              {participants.map((p) => {
                const assignedItems = checklist.filter((c) => c.assignedTo === p.name);
                const avail = (p.availability ?? "going") as Availability;
                return (
                  <div key={p.id} className="flex items-center justify-between py-3 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{p.name}</div>
                        {assignedItems.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {assignedItems.filter((i) => i.isCompleted).length}/{assignedItems.length} items packed
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {(["going", "tentative", "out"] as const).map((a) => (
                        <button
                          key={a}
                          onClick={() => handleAvailability(p.id, a)}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                            avail === a ? AVAIL[a].active : AVAIL[a].inactive + " hover:border-slate-300"
                          }`}
                        >
                          {AVAIL[a].label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

      {/* Tasks & Ownership */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tasks &amp; Ownership</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground pb-1">No tasks yet. Track who&apos;s responsible for what.</p>
          )}
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start gap-3 rounded-xl p-3 border ${
                task.isComplete ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-100"
              }`}
            >
              <button onClick={() => toggleTask(task.id, !task.isComplete)} className="mt-0.5 shrink-0">
                {task.isComplete
                  ? <CheckSquare className="h-4 w-4 text-emerald-500" />
                  : <Square className="h-4 w-4 text-slate-400" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.isComplete ? "line-through text-slate-400" : "text-slate-900"}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {task.assignedTo && (
                    <span className="text-xs text-slate-500">{task.assignedTo}</span>
                  )}
                  {task.needsApproval && !task.isApproved && (
                    <button
                      onClick={() => approveTask(task.id)}
                      className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 transition-colors"
                    >
                      Needs sign-off — tap to approve
                    </button>
                  )}
                  {task.isApproved && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Approved
                    </span>
                  )}
                  {!task.isComplete && !task.needsApproval && !task.isApproved && (
                    <button
                      onClick={() => flagApproval(task.id)}
                      className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      + needs approval
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Add task */}
          <div className="flex gap-2 pt-1">
            <Input
              placeholder="New task…"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              className="flex-1"
            />
            {crewNames.length > 0 && (
              <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                <SelectTrigger className="w-32 shrink-0">
                  <SelectValue placeholder="Assign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {crewNames.map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" onClick={handleAddTask} disabled={!newTaskTitle.trim() || addingTask}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shared Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Shared Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pinnedNotes.map((note) => (
            <div key={note.id} className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Pin className="h-3 w-3 text-amber-600" />
                <span className="text-xs font-semibold text-amber-800">{note.authorName}</span>
                <span className="text-xs text-amber-500 ml-auto">
                  {new Date(note.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                </span>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">{note.content}</p>
            </div>
          ))}
          {regularNotes.map((note) => (
            <div key={note.id} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-semibold text-slate-700">{note.authorName}</span>
                <span className="text-xs text-slate-400 ml-auto">
                  {new Date(note.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{note.content}</p>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-sm text-muted-foreground">No notes yet.</p>
          )}
          {/* Add note form */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <Input
              placeholder="Your name (optional)"
              value={newNoteAuthor}
              onChange={(e) => setNewNoteAuthor(e.target.value)}
              className="w-48"
            />
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note for the crew…"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={2}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleAddNote}
                disabled={!newNoteContent.trim() || addingNote}
                className="self-end"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
