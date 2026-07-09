"use client";

import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function ManageProfileClient() {
  return (
    <div className="min-h-screen bg-[#F2EDE2] py-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to profile
        </Link>
        <UserProfile
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border border-slate-200 rounded-2xl",
            },
          }}
        />
      </div>
    </div>
  );
}
