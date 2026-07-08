"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function NavbarAuth() {
  // layout.tsx deliberately renders without ClerkProvider when no key is set
  // (keyless mode); Clerk's control components throw in that case.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;

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
