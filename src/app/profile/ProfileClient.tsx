"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { MapPin, Mail, User, Settings, ChevronLeft, Check } from "lucide-react";

interface ProfileClientProps {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  location: string;
}

export function ProfileClient({ email, firstName, lastName, imageUrl, location: initialLocation }: ProfileClientProps) {
  const { user } = useUser();
  const [location, setLocation] = useState(initialLocation);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Angler";

  const saveLocation = async () => {
    if (!user) return;
    setSaving(true);
    await user.update({ unsafeMetadata: { ...user.unsafeMetadata, location } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-8">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Avatar + name */}
        <div className="flex items-center gap-5 mb-10">
          <img
            src={imageUrl}
            alt={fullName}
            className="w-20 h-20 rounded-full object-cover border-2 border-[#0D9488]/30"
          />
          <div>
            <h1 className="text-2xl font-bold text-[#040F1C]">{fullName}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{email}</p>
          </div>
        </div>

        {/* Info fields */}
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 mb-6">
          <div className="flex items-center gap-4 px-5 py-4">
            <User className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Name</p>
              <p className="text-sm text-[#040F1C] font-medium truncate">{fullName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5 py-4">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Email</p>
              <p className="text-sm text-[#040F1C] font-medium truncate">{email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 px-5 py-4">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-2.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Home Waters</p>
              <div className="flex gap-2">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sydney, NSW"
                  className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[#040F1C] focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
                />
                <button
                  onClick={saveLocation}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D9488] text-white text-xs font-semibold hover:bg-[#0F766E] transition-colors disabled:opacity-60"
                >
                  {saved ? <Check className="h-3.5 w-3.5" /> : null}
                  {saved ? "Saved" : saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account settings */}
        <div className="bg-white rounded-2xl border border-slate-200 mb-6">
          <div className="flex items-center gap-4 px-5 py-4">
            <Settings className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#040F1C]">Account settings</p>
              <p className="text-xs text-slate-400 mt-0.5">Change your name, email, password and connected accounts.</p>
            </div>
            <a
              href="/profile/manage"
              className="text-[#0D9488] text-xs font-semibold hover:underline shrink-0"
            >
              Manage →
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/bucket-list"
            className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#040F1C] hover:border-[#0D9488] transition-colors"
          >
            My Bucket List
          </Link>
          <Link
            href="/trips"
            className="bg-white rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#040F1C] hover:border-[#0D9488] transition-colors"
          >
            My Trips
          </Link>
        </div>
      </div>
    </div>
  );
}
