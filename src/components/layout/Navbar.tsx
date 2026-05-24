import Link from "next/link";
import dynamic from "next/dynamic";
import { Anchor, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Load auth UI client-side only — useAuth() cannot run during SSR without ClerkProvider
const NavbarAuth = dynamic(() => import("./NavbarAuth").then((m) => m.NavbarAuth), {
  ssr: false,
  loading: () => <div className="w-8 h-8 rounded-full bg-white/10" />,
});

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-navy-900/95 backdrop-blur supports-[backdrop-filter]:bg-navy-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-ocean-500">
            <Anchor className="h-4 w-4 text-white" />
          </span>
          <span
            className="font-bold text-[#F5F0E8] text-xl tracking-wide"
            style={{ fontFamily: "var(--font-bebas), system-ui, sans-serif" }}
          >
            HookLine
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-white/70 hover:text-white transition-colors">
            Discover
          </Link>
          <Link href="/gear" className="text-white/70 hover:text-white transition-colors">
            Gear Guide
          </Link>
          <Link href="/resources" className="text-white/70 hover:text-white transition-colors">
            Resources
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/trips/new">
            <Button size="sm" className="gap-1.5 bg-ocean-500 hover:bg-ocean-600 text-white border-0">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Plan a Trip</span>
            </Button>
          </Link>

          <NavbarAuth />
        </div>
      </div>
    </header>
  );
}
