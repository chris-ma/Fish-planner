"use client";

import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";

export function NavbarAuth() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />;
  }

  if (isSignedIn) {
    return (
      <UserButton
        appearance={{ elements: { avatarBox: "w-8 h-8" } }}
        userProfileUrl="/profile"
        userProfileMode="navigation"
      />
    );
  }

  return (
    <SignInButton mode="modal">
      <button className="text-white/70 hover:text-white text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
        Sign in
      </button>
    </SignInButton>
  );
}
