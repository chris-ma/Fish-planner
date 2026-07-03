"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";

// Routes that render their own full-bleed experience and skip the site chrome.
const FULL_BLEED_PREFIXES = ["/campaign"];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const fullBleed = FULL_BLEED_PREFIXES.some((p) => pathname.startsWith(p));

  if (fullBleed) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </>
  );
}
