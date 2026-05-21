import Link from "next/link";
import { Fish, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <Fish className="h-5 w-5 text-blue-600" />
          <span>EastCoast Fishing</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
            Discover
          </Link>
          <Link href="/gear" className="text-slate-600 hover:text-slate-900 transition-colors">
            Gear Guide
          </Link>
        </nav>

        <Link href="/trips/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Plan a Trip
          </Button>
        </Link>
      </div>
    </header>
  );
}
