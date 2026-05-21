import Link from "next/link";
import { Fish } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-3">
              <Fish className="h-4 w-4 text-blue-600" />
              EastCoast Fishing
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Season-aware trip planning for Australian east coast fishing groups.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Regions</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link href="/regions/cairns" className="hover:text-slate-900">Cairns</Link></li>
              <li><Link href="/regions/sydney" className="hover:text-slate-900">Sydney</Link></li>
              <li><Link href="/regions/hervey-bay" className="hover:text-slate-900">Hervey Bay</Link></li>
              <li><Link href="/regions/brisbane-moreton-bay" className="hover:text-slate-900">Brisbane</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Species</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link href="/species/spanish-mackerel" className="hover:text-slate-900">Spanish Mackerel</Link></li>
              <li><Link href="/species/barramundi" className="hover:text-slate-900">Barramundi</Link></li>
              <li><Link href="/species/yellowtail-kingfish" className="hover:text-slate-900">Kingfish</Link></li>
              <li><Link href="/species/black-marlin" className="hover:text-slate-900">Black Marlin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Plan</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link href="/trips/new" className="hover:text-slate-900">Create a Trip</Link></li>
              <li><Link href="/gear" className="hover:text-slate-900">Gear Guide</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 text-xs text-slate-400 text-center">
          Season data is a general guide only — always check local conditions, regulations, and bag limits before fishing.
        </div>
      </div>
    </footer>
  );
}
