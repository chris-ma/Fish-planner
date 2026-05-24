"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Fish, Lock, Target } from "lucide-react";

interface AuthPromptProps {
  heading: string;
  description: string;
  icon?: "fish" | "target" | "lock";
}

const ICONS = { fish: Fish, target: Target, lock: Lock };

export function AuthPrompt({ heading, description, icon = "lock" }: AuthPromptProps) {
  const Icon = ICONS[icon];

  return (
    <div className="min-h-screen bg-[#020B14] flex flex-col items-center justify-center px-4 py-20">
      {/* Decorative ring */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-[#0D9488]/10 border border-[#0D9488]/30 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#0D9488]/15 border border-[#0D9488]/40 flex items-center justify-center">
            <Icon className="h-7 w-7 text-[#0D9488]" />
          </div>
        </div>
      </div>

      <div className="h-1 w-12 bg-[#0D9488] rounded mb-5" />

      <h1 className="text-3xl md:text-4xl font-bold text-[#F5F0E8] text-center mb-3 max-w-sm">
        {heading}
      </h1>
      <p className="text-[#F5F0E8]/55 text-center max-w-xs leading-relaxed mb-10">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <SignInButton mode="modal">
          <button className="flex-1 py-3 px-6 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold rounded-xl transition-colors text-sm">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/15 border border-white/20 text-[#F5F0E8] font-semibold rounded-xl transition-colors text-sm">
            Create account
          </button>
        </SignUpButton>
      </div>

      <p className="mt-8 text-[#F5F0E8]/30 text-xs text-center max-w-xs">
        Free to use. Your data stays private.
      </p>
    </div>
  );
}
