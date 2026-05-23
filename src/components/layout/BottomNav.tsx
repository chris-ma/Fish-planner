"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Map, Package, Plus, Target } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/", label: "Home", Icon: Compass },
  { href: "/plan", label: "Plan", Icon: Map },
  { href: "/gear", label: "Gear", Icon: Package },
  { href: "/bucket-list", label: "List", Icon: Target },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#020B14] border-t border-white/10">
      <div className="flex items-stretch h-16">
        {/* Left tabs */}
        {NAV_ITEMS.slice(0, 2).map(({ href, label, Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-[#0D9488]"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}

        {/* Central Plan Trip button */}
        <Link
          href="/trips/new"
          className="flex-1 flex flex-col items-center justify-center gap-1 -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-[#0D9488] flex items-center justify-center shadow-lg shadow-[#0D9488]/40">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <span
            className={cn(
              "text-[10px] font-medium mt-0.5",
              pathname.startsWith("/trips/new")
                ? "text-[#0D9488]"
                : "text-white/50"
            )}
          >
            Trip
          </span>
        </Link>

        {/* Right tabs */}
        {NAV_ITEMS.slice(2).map(({ href, label, Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-[#0D9488]"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
