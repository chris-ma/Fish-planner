import Link from "next/link";
import dynamic from "next/dynamic";
import { Compass } from "lucide-react";

const NavbarAuth = dynamic(() => import("./NavbarAuth").then((m) => m.NavbarAuth), {
  ssr: false,
  loading: () => <div className="w-8 h-8 rounded-full bg-white/10" />,
});

export function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-[1100] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-ocean-500">
            <Compass className="h-4 w-4 text-[#0B1D2A]" />
          </span>
          <span
            className="font-black text-[#F2EDE2] text-xl"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            Fish Tripper
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-white/70 hover:text-white transition-colors">
            Discover
          </Link>
          <Link href="/gear" className="text-white/70 hover:text-white transition-colors">
            Gear Guide
          </Link>
          <Link href="/experiences" className="text-white/70 hover:text-white transition-colors">
            Experiences
          </Link>
          <Link href="/resources" className="text-white/70 hover:text-white transition-colors">
            Resources
          </Link>
        </nav>

        <NavbarAuth />
      </div>
    </header>
  );
}
