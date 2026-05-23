import Link from "next/link";
import { Compass, Fish, ArrowRight } from "lucide-react";

export function IntentSearch() {
  return (
    <div className="w-full max-w-lg px-2">
      {/* Liquid Glass outer shell */}
      <div className="rounded-3xl backdrop-blur-2xl bg-gradient-to-b from-white/18 to-white/8 border border-white/30 p-2 shadow-2xl shadow-black/40"
        style={{
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div className="grid grid-cols-2 gap-2">
          {/* By Destination */}
          <Link href="/trips/new" className="group block">
            <div
              className="rounded-2xl p-5 border border-white/20 transition-all duration-200 group-hover:bg-white/20 group-hover:border-white/35 group-active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center mb-3">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <p className="font-bold text-white text-sm leading-tight mb-1">By Destination</p>
              <p className="text-white/55 text-xs leading-snug">Plan a trip to a specific spot</p>
              <div className="flex items-center gap-1 mt-3 text-[#2DD4BF] text-xs font-semibold">
                Start planning <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </Link>

          {/* By Species */}
          <Link href="/species" className="group block">
            <div
              className="rounded-2xl p-5 border border-white/20 transition-all duration-200 group-hover:bg-white/20 group-hover:border-white/35 group-active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center mb-3">
                <Fish className="h-5 w-5 text-white" />
              </div>
              <p className="font-bold text-white text-sm leading-tight mb-1">By Species</p>
              <p className="text-white/55 text-xs leading-snug">Start with your target fish</p>
              <div className="flex items-center gap-1 mt-3 text-[#2DD4BF] text-xs font-semibold">
                Browse species <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
