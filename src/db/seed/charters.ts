export type CharterSeed = {
  slug: string;
  name: string;
  operatorName: string;
  operatorEmail: string;
  operatorPhone: string;
  description: string;
  experienceSlug: string;
  homePort: string;
  boatName: string;
  boatType: string;
  maxGuests: number;
  durationDays: number;
  priceLabel: string;
  featured: boolean;
};

export const CHARTERS: CharterSeed[] = [
  {
    slug: "seaspray-cairns-gt",
    name: "Cairns GT Topwater Charter",
    operatorName: "Seaspray Fishing Charters",
    operatorEmail: "bookings@seaspray-charters.com.au",
    operatorPhone: "+61 7 4031 2200",
    description:
      "Three to seven day live-aboard expeditions to the Coral Sea and outer Great Barrier Reef atolls in search of giant trevally and queenfish on large surface poppers. Seaspray operates a purpose-built 12-metre sportfishing vessel with full live-aboard facilities, accommodating six anglers on reef systems rarely visited by recreational fishers.",
    experienceSlug: "topwater-gt",
    homePort: "Cairns",
    boatName: "Seaspray II",
    boatType: "Custom sportfisher (12 m)",
    maxGuests: 6,
    durationDays: 4,
    priceLabel: "From $1,200/person/day",
    featured: true,
  },
  {
    slug: "reef-hunter-marlin",
    name: "Cairns Black Marlin Season Charter",
    operatorName: "Reef Hunter Sportfishing",
    operatorEmail: "info@reefhuntersportfishing.com.au",
    operatorPhone: "+61 7 4051 8800",
    description:
      "Guided day and multi-day black marlin charters operating out of Cairns during the October to December spawning run on the outer Great Barrier Reef. With 20 years of operating experience and a highly regarded skipper team, Reef Hunter consistently places clients on fish in the 200–500 kg range. Full tackle and leader supplied.",
    experienceSlug: "marlin-trolling",
    homePort: "Cairns",
    boatName: "Game On",
    boatType: "Tournament sportfisher (14 m)",
    maxGuests: 4,
    durationDays: 1,
    priceLabel: "From $2,500/day (boat)",
    featured: true,
  },
  {
    slug: "sydney-kingfish-pro",
    name: "Sydney Offshore Kingfish Charter",
    operatorName: "Sydney Offshore Fishing",
    operatorEmail: "book@sydneyoffshorefishing.com.au",
    operatorPhone: "+61 2 9555 4400",
    description:
      "Full-day offshore kingfish charters departing Sydney Heads to target yellowtail kingfish on speed jigs, slow-pitch rigs and live baits over the pinnacles and bomoras of the Sydney shelf. Catering for groups of two to eight anglers with all high-quality jigging gear supplied. Multiple departures weekly from October to May.",
    experienceSlug: "kingfish-jigging",
    homePort: "Sydney",
    boatName: "Reel Obsession",
    boatType: "Centre console (8.5 m)",
    maxGuests: 8,
    durationDays: 1,
    priceLabel: "From $280/person",
    featured: false,
  },
  {
    slug: "daly-river-barra",
    name: "Daly River Barramundi Expedition",
    operatorName: "Top End Fishing Adventures",
    operatorEmail: "adventures@topendfish.com.au",
    operatorPhone: "+61 8 8978 2100",
    description:
      "Five day guided barramundi fishing safari on the Daly River system in the NT, targeting barra on hard-bodied lures and soft plastics through remote tidal creeks and mangrove systems. All accommodation, meals and transfers included from Darwin. Suitable for anglers of all experience levels with expert local guiding throughout.",
    experienceSlug: "barramundi-estuary",
    homePort: "Darwin",
    boatName: "Tidal Runner",
    boatType: "Aluminium tinnies (5 m, supplied)",
    maxGuests: 4,
    durationDays: 5,
    priceLabel: "From $3,200/person (all inclusive)",
    featured: true,
  },
  {
    slug: "ningaloo-bluewater",
    name: "Ningaloo Blue Water Fishing Charter",
    operatorName: "Ningaloo Sportfishing",
    operatorEmail: "bookings@ningaloosportfishing.com.au",
    operatorPhone: "+61 8 9949 1155",
    description:
      "Full and half-day sportfishing charters operating from Exmouth over Ningaloo Reef and the offshore banks of WA's Coral Coast, targeting coral trout, rankin cod, spangled emperor and blue water pelagics. Ningaloo Sportfishing operates a modern 9-metre centre console capable of reaching the reef's outer edge in under 30 minutes from the marina.",
    experienceSlug: "ningaloo-reef",
    homePort: "Exmouth",
    boatName: "Coral Raider",
    boatType: "Centre console (9 m)",
    maxGuests: 6,
    durationDays: 1,
    priceLabel: "From $250/person (half day)",
    featured: false,
  },
  {
    slug: "broome-offshore",
    name: "Broome Offshore Bluewater Charter",
    operatorName: "Kimberley Fishing Co.",
    operatorEmail: "info@kimberleyfishingco.com.au",
    operatorPhone: "+61 8 9192 3300",
    description:
      "Three to five day offshore charters out of Broome targeting wahoo, spanish mackerel, giant trevally and cobia over the pristine outer Kimberley reefs and banks. The Kimberley coast is one of Australia's most remote and productive fishing environments — expect minimal fishing pressure and prolific pelagic activity on every trip.",
    experienceSlug: "wahoo-speed-trolling",
    homePort: "Broome",
    boatName: "Kimberley Dawn",
    boatType: "Sportfisher (11 m)",
    maxGuests: 6,
    durationDays: 3,
    priceLabel: "From $950/person/day",
    featured: false,
  },
  {
    slug: "christmas-island-gt",
    name: "Christmas Island GT & Bonefish Charter",
    operatorName: "CI Flats Fishing",
    operatorEmail: "bookings@ciflatsfishing.com",
    operatorPhone: "+61 4 1890 3300",
    description:
      "Week-long hosted fly fishing and light tackle adventures on Christmas Island targeting giant trevally on the ocean-side bomboras and bonefish on the pristine tropical flats. CI Flats Fishing offers all-inclusive packages from Christmas Island Settlement including accommodation, daily guiding, and airport transfers. Maximum four anglers per trip for an exclusive experience.",
    experienceSlug: "bonefish-flats",
    homePort: "Christmas Island",
    boatName: "Flats skiffs (supplied)",
    boatType: "Poling skiffs",
    maxGuests: 4,
    durationDays: 7,
    priceLabel: "From $5,500/person (all inclusive)",
    featured: true,
  },
  {
    slug: "nsw-snapper-king",
    name: "NSW South Coast Snapper & Kingfish Combo",
    operatorName: "South Coast Sportfishing",
    operatorEmail: "book@southcoastsportfishing.com.au",
    operatorPhone: "+61 2 4441 6600",
    description:
      "Day charters from Jervis Bay targeting snapper, yellowtail kingfish and blue-eye trevalla over the productive reef systems of the NSW South Coast. South Coast Sportfishing runs a purpose-rigged 8-metre vessel equipped with quality jigging and bottom-fishing tackle. Operates year-round with seasonal peaks for each target species.",
    experienceSlug: "snapper-bottom-bashing",
    homePort: "Jervis Bay",
    boatName: "Southern Cross",
    boatType: "Walkaround (8 m)",
    maxGuests: 6,
    durationDays: 1,
    priceLabel: "From $260/person",
    featured: false,
  },
  {
    slug: "tas-striped-trumpeter",
    name: "Tasmania Southern Reef Charter",
    operatorName: "Tasmanian Sportfishing",
    operatorEmail: "info@tasmaniansportfishing.com.au",
    operatorPhone: "+61 3 6223 4400",
    description:
      "Day and overnight charters targeting striped trumpeter, blue-eye trevalla and blue morwong over the pristine deep reef systems of Tasmania's east and south coasts. Operating from Hobart with access to some of southern Australia's most productive but least-pressured reef fishing grounds. Full slow-pitch jigging and bottom bait rigs supplied.",
    experienceSlug: "southern-reef-mixed",
    homePort: "Hobart",
    boatName: "Southern Stalker",
    boatType: "Hardtop sportfisher (10 m)",
    maxGuests: 6,
    durationDays: 1,
    priceLabel: "From $320/person",
    featured: false,
  },
  {
    slug: "nz-marlborough-groper",
    name: "Marlborough Sounds Deep Groper Charter",
    operatorName: "Marlborough Sea Fishing",
    operatorEmail: "bookings@marlboroughseafishing.co.nz",
    operatorPhone: "+64 3 573 7100",
    description:
      "Full-day hapuku (groper) fishing charters operating from Nelson into the deep water channels of Marlborough Sounds, targeting hapuku, blue cod and John Dory over rocky bottom structure from 100 to 300 metres. Electric reels and all tackle supplied. NZ fishing licences arranged as required. Departs daily weather permitting from Nelson City Marina.",
    experienceSlug: "nz-hapuku-deep",
    homePort: "Nelson",
    boatName: "Sounds Explorer",
    boatType: "Hardtop cruiser (9 m)",
    maxGuests: 8,
    durationDays: 1,
    priceLabel: "From NZD $280/person",
    featured: false,
  },
];
