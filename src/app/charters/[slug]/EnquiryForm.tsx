"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

interface Props {
  charterSlug: string;
  operatorName: string;
  operatorPhone: string | null;
  maxGuests: number;
}

export function EnquiryForm({ charterSlug, operatorName, operatorPhone, maxGuests }: Props) {
  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    preferredDateFrom: "",
    preferredDateTo: "",
    guestCount: "2",
    skillLevel: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.guestName || !form.guestEmail || !form.preferredDateFrom || !form.preferredDateTo) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/charters/${charterSlug}/enquire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, guestCount: Number(form.guestCount) }),
      });
      if (!res.ok) throw new Error("Failed to send enquiry");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-[#C99A3E]/10 border border-[#C99A3E]/30 rounded-2xl p-8 text-center">
        <CheckCircle className="h-10 w-10 text-[#C99A3E] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Enquiry sent!</h3>
        <p className="text-white/70 mb-4">
          {operatorName} has been notified and will be in touch shortly. Check your email for a confirmation.
        </p>
        {operatorPhone && (
          <p className="text-white/50 text-sm">
            You can also reach them directly at{" "}
            <a href={`tel:${operatorPhone}`} className="text-[#C99A3E] hover:underline">{operatorPhone}</a>
          </p>
        )}
      </div>
    );
  }

  const inputCls = "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#C99A3E] focus:border-transparent";
  const labelCls = "block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Full name *</label>
          <input className={inputCls} placeholder="Your name" value={form.guestName} onChange={set("guestName")} required />
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input type="email" className={inputCls} placeholder="your@email.com" value={form.guestEmail} onChange={set("guestEmail")} required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Phone (optional)</label>
          <input type="tel" className={inputCls} placeholder="+61 4xx xxx xxx" value={form.guestPhone} onChange={set("guestPhone")} />
        </div>
        <div>
          <label className={labelCls}>Number of guests *</label>
          <select className={inputCls} value={form.guestCount} onChange={set("guestCount")} required>
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "angler" : "anglers"}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Preferred date from *</label>
          <input type="date" className={inputCls} value={form.preferredDateFrom} onChange={set("preferredDateFrom")} required />
        </div>
        <div>
          <label className={labelCls}>Preferred date to *</label>
          <input type="date" className={inputCls} value={form.preferredDateTo} onChange={set("preferredDateTo")} required />
        </div>
      </div>

      <div>
        <label className={labelCls}>Skill level</label>
        <select className={inputCls} value={form.skillLevel} onChange={set("skillLevel")}>
          <option value="">Select skill level</option>
          <option value="Beginner">Beginner — first time on a charter</option>
          <option value="Intermediate">Intermediate — some charter experience</option>
          <option value="Experienced">Experienced — regularly fish charters</option>
          <option value="Expert">Expert — tournament / professional angler</option>
        </select>
      </div>

      <div>
        <label className={labelCls}>Message / special requests</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={4}
          placeholder="Tell the operator about your trip goals, any gear you're bringing, dietary requirements, etc."
          value={form.message}
          onChange={set("message")}
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C99A3E] hover:bg-[#AD8232] disabled:opacity-50 text-[#0A1C28] font-semibold py-4 rounded-xl transition-colors text-base"
      >
        {loading ? "Sending…" : "Send Enquiry"}
      </button>

      <p className="text-white/40 text-xs text-center">
        Your enquiry goes directly to {operatorName}. No payment required at this stage.
      </p>
    </form>
  );
}
