import type { Metadata } from "next";
import { ExternalLink, Fish, BookOpen, ShieldCheck, Map } from "lucide-react";

export const metadata: Metadata = {
  title: "Fishing Regulations & Resources",
  description: "Official links to state and federal fishing regulations, licensing portals, marine park rules, and bag limit information for all Australian states and territories.",
  alternates: { canonical: "/resources" },
};

const RESOURCES = [
  {
    state: "Queensland",
    flag: "QLD",
    color: "from-red-600 to-red-800",
    links: [
      {
        label: "QLD Fisheries — Bag & Size Limits",
        url: "https://www.daf.qld.gov.au/business-priorities/fisheries/recreational/rules/bag-size-limits",
        desc: "Official bag limits, size limits and possession limits for all Queensland recreational species",
      },
      {
        label: "QLD Fishing Licence & Rules",
        url: "https://www.daf.qld.gov.au/business-priorities/fisheries/recreational",
        desc: "Recreational fishing rules, closures, and general information for Queensland waters",
      },
      {
        label: "Great Barrier Reef Marine Park Rules",
        url: "https://www.gbrmpa.gov.au/our-work/reef-protection/fishing",
        desc: "GBRMPA fishing rules, no-take zones, and green zone maps for the Reef",
      },
    ],
  },
  {
    state: "New South Wales",
    flag: "NSW",
    color: "from-blue-600 to-blue-900",
    links: [
      {
        label: "NSW DPI Fisheries — Size & Bag Limits",
        url: "https://www.dpi.nsw.gov.au/fishing/recreational/fishing-rules-and-regulations/size-bag-limits",
        desc: "Complete size and bag limits for NSW saltwater and freshwater species",
      },
      {
        label: "NSW Fishing Licence",
        url: "https://www.dpi.nsw.gov.au/fishing/recreational/fishing-rules-and-regulations/recreational-fishing-fees",
        desc: "Purchase your NSW recreational fishing licence and understand exemptions",
      },
      {
        label: "NSW Marine Parks & No-Take Zones",
        url: "https://www.marine.nsw.gov.au/",
        desc: "Marine park sanctuary zones and fishing restrictions in NSW coastal parks",
      },
    ],
  },
  {
    state: "Victoria",
    flag: "VIC",
    color: "from-blue-800 to-indigo-900",
    links: [
      {
        label: "VFA — Recreational Fishing Rules",
        url: "https://www.vfa.vic.gov.au/recreational-fishing/recreational-fishing-rules",
        desc: "Bag limits, size limits, and closed seasons for Victorian salt and freshwater species",
      },
      {
        label: "Victorian Fishing Licence",
        url: "https://www.vfa.vic.gov.au/recreational-fishing/fishing-licences",
        desc: "Apply for your Victorian recreational fishing licence online",
      },
      {
        label: "Port Phillip Bay Fisheries Rules",
        url: "https://www.vfa.vic.gov.au/recreational-fishing/where-to-fish/bays-and-harbours/port-phillip-bay",
        desc: "Specific rules for Port Phillip Bay including snapper closures and size limits",
      },
    ],
  },
  {
    state: "Tasmania",
    flag: "TAS",
    color: "from-emerald-700 to-slate-800",
    links: [
      {
        label: "IFS — Tasmanian Fishing Rules",
        url: "https://www.ifs.tas.gov.au/recreational-fishing",
        desc: "Inland Fisheries Service bag limits, size limits and licence requirements for TAS",
      },
      {
        label: "DPIPWE Sea Fishing Rules",
        url: "https://nre.tas.gov.au/sea-fishing-aquaculture/rules-for-recreational-sea-fishing",
        desc: "Sea fishing rules for Tasmania including abalone, scallop and finfish limits",
      },
      {
        label: "Tasmanian Fishing Licence",
        url: "https://www.ifs.tas.gov.au/recreational-fishing/fishing-licences",
        desc: "Freshwater fishing licence for rivers, lakes, and highland lakes in Tasmania",
      },
    ],
  },
  {
    state: "Northern Territory",
    flag: "NT",
    color: "from-amber-500 to-amber-700",
    links: [
      {
        label: "NT Recreational Fishing",
        url: "https://nt.gov.au/recreation/fishing",
        desc: "NT's Department of Industry, Tourism and Trade manages barramundi, reef, and tidal fisheries across the Top End and Gulf regions.",
      },
    ],
  },
  {
    state: "Western Australia",
    flag: "WA",
    color: "from-blue-600 to-blue-800",
    links: [
      {
        label: "WA Fisheries — Recreational Fishing",
        url: "https://www.fish.wa.gov.au",
        desc: "WA Department of Primary Industries and Regional Development. Covers dhufish, baldchin groper, pink snapper, and all WA-specific species limits.",
      },
    ],
  },
  {
    state: "South Australia",
    flag: "SA",
    color: "from-red-600 to-red-800",
    links: [
      {
        label: "SA Recreational Fishing",
        url: "https://pir.sa.gov.au/fishing",
        desc: "SA Department of Primary Industries and Regions. Covers King George whiting, snapper, southern bluefin tuna, and SA-specific regulations.",
      },
    ],
  },
];

const NATIONAL = [
  {
    label: "AFMA — Commonwealth Fishing Rules",
    url: "https://www.afma.gov.au/",
    desc: "Australian Fisheries Management Authority — rules for Commonwealth waters (3+ nautical miles offshore)",
    icon: ShieldCheck,
  },
  {
    label: "Recfish Australia — National Peak Body",
    url: "https://www.recfish.com.au/",
    desc: "Australia's peak recreational fishing body — advocacy, sustainability reports, and national rules updates",
    icon: Fish,
  },
  {
    label: "Marine Parks Australia",
    url: "https://parksaustralia.gov.au/marine/",
    desc: "Commonwealth Marine Reserves — maps, rules, and permitted activities in federal marine parks",
    icon: Map,
  },
  {
    label: "ANSA — Australian National Sportfishing Association",
    url: "https://www.ansa.com.au/",
    desc: "Fishing competition rules, record claims, and angling education",
    icon: BookOpen,
  },
];

export default function ResourcesPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative bg-[#020B14] py-12 px-4 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-[#FFD60A] text-sm font-semibold mb-2 tracking-wide uppercase">Regulations</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F5F0E8] mb-3">Fishing Resources</h1>
          <p className="text-white/60 max-w-xl leading-relaxed">
            Bag limits, size limits, and licensing requirements vary by state and change seasonally. Always check with your local fisheries authority before heading out.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* State resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESOURCES.map((state) => (
            <div key={state.flag} className="rounded-2xl overflow-hidden border border-border shadow-sm">
              {/* State header */}
              <div className={`bg-gradient-to-r ${state.color} px-5 py-4`}>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-lg">{state.state}</span>
                  <span className="text-white/60 text-sm">({state.flag})</span>
                </div>
              </div>

              {/* Links */}
              <div className="divide-y bg-[#F5F0E8]">
                {state.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors group"
                  >
                    <ExternalLink className="h-4 w-4 text-slate-400 shrink-0 mt-0.5 group-hover:text-[#0D9488] transition-colors" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 group-hover:text-[#0D9488] transition-colors">
                        {link.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{link.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* National resources */}
        <div>
          <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
          <h2 className="text-xl font-bold text-[#0D9488] mb-4">National & Federal Resources</h2>
          <div className="divide-y border rounded-2xl bg-[#F5F0E8]">
            {NATIONAL.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#0D9488]/10 transition-colors">
                    <Icon className="h-4 w-4 text-slate-500 group-hover:text-[#0D9488] transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-[#0D9488] transition-colors">
                        {item.label}
                      </p>
                      <ExternalLink className="h-3 w-3 text-slate-400 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
          <p className="font-semibold mb-1">Important notice</p>
          <p className="leading-relaxed">
            Fishing regulations change regularly. The links above go directly to official government fisheries websites. Fish Tripper does not hold or display bag limits or size limits — always verify current rules on the official state fisheries website before heading out.
          </p>
        </div>
      </div>
    </div>
  );
}
