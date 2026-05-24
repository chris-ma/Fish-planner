"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function NavbarAuth() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-white/70 hover:text-white text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
            Sign in
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton
          appearance={{ elements: { avatarBox: "w-8 h-8" } }}
          userProfileUrl="/profile"
          userProfileMode="navigation"
        />
      </SignedIn>
    </>
  );
}
