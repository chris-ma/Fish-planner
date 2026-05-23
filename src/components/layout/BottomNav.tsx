"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Package, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/", label: "Discover", Icon: Compass },
  { href: "/gear", label: "Gear", Icon: Package },
  { href: "/trips/new", label: "Plan Trip", Icon: Plus },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#020B14] border-t border-white/10">
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                isActive ? "text-[#0D9488]" : "text-white/50 hover:text-white/80"
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
