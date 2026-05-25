export type ExperienceSeed = {
  slug: string;
  name: string;
  description: string;
  category: string;
  targetSpeciesSlugs: string[];
  primaryTechniqueSlug: string;
};

export const EXPERIENCES: ExperienceSeed[] = [
  {
    slug: "topwater-gt",
    name: "Topwater GT Fishing",
    description:
      "One of the most explosive fishing experiences available, targeting giant trevally with large surface poppers across remote coral reefs and atolls throughout northern Australia and the Coral Sea. These powerful fish smash topwater lures with incredible aggression, demanding heavy tackle and skilled anglers.",
    category: "offshore",
    targetSpeciesSlugs: ["giant-trevally", "queenfish"],
    primaryTechniqueSlug: "popping",
  },
  {
    slug: "marlin-trolling",
    name: "Blue Water Marlin Trolling",
    description:
      "Trolling skirted lures and rigged baits through the warm blue water of the Coral Sea and along Australia's east coast continental shelf edge in pursuit of black and blue marlin. The Great Barrier Reef and Cairns region are world-renowned marlin destinations, particularly during the October to December spawning run.",
    category: "offshore",
    targetSpeciesSlugs: ["black-marlin", "blue-marlin", "sailfish"],
    primaryTechniqueSlug: "trolling",
  },
  {
    slug: "yellowfin-offshore",
    name: "Offshore Yellowfin Tuna",
    description:
      "Targeting hard-fighting yellowfin tuna, wahoo and mahi-mahi over offshore FADs, seamounts and temperature breaks in Australian waters. These fast pelagic species are found year-round in tropical and subtropical waters, offering exceptional sport on trolled lures and live baits.",
    category: "offshore",
    targetSpeciesSlugs: ["yellowfin-tuna", "wahoo", "mahi-mahi"],
    primaryTechniqueSlug: "trolling",
  },
  {
    slug: "kingfish-jigging",
    name: "Kingfish Jigging",
    description:
      "Yellowtail kingfish are among Australia's premier sportfish, and vertical jigging over rocky reefs and seamounts along the south-east coast is one of the most effective and rewarding techniques. These powerful fish are notorious for diving into structure, demanding strong tackle and skilled anglers.",
    category: "offshore",
    targetSpeciesSlugs: ["yellowtail-kingfish"],
    primaryTechniqueSlug: "jigging",
  },
  {
    slug: "light-tackle-pelagics",
    name: "Light Tackle Pelagics",
    description:
      "Chasing fast-moving schools of longtail tuna and Spanish mackerel across coastal reefs and headlands with light spinning gear and hard-bodied lures is a thrilling inshore experience available along most of Australia's northern and eastern coastlines. Schools can be located by working headlands and watching for diving birds.",
    category: "inshore",
    targetSpeciesSlugs: ["longtail-tuna", "spanish-mackerel"],
    primaryTechniqueSlug: "casting-hard-bodies",
  },
  {
    slug: "deep-dropping",
    name: "Deep Dropping",
    description:
      "Targeting premium table fish including blue-eye trevalla, nannygai and hapuku in deep water from 150 to 600 metres using electric reels and heavy bottom rigs over offshore reefs and ledges. This style of fishing is particularly productive along the east and south coasts of Australia and produces some of the finest eating fish available.",
    category: "reef",
    targetSpeciesSlugs: ["blue-eye-trevalla", "nannygai", "hapuku-groper"],
    primaryTechniqueSlug: "slow-pitch-jigging",
  },
  {
    slug: "coral-trout-reef",
    name: "Coral Trout Reef Fishing",
    description:
      "Coral trout and red emperor are among the most prized reef fish in the Indo-Pacific, targeted with baits and lures over shallow coral reef systems of the Great Barrier Reef and offshore Queensland and WA reefs. Drifting baits over coral bommies and ledges in 10 to 60 metres is the most reliable approach.",
    category: "reef",
    targetSpeciesSlugs: ["coral-trout", "red-emperor"],
    primaryTechniqueSlug: "bottom-bait",
  },
  {
    slug: "snapper-bottom-bashing",
    name: "Snapper Bottom Bashing",
    description:
      "Snapper are one of Australia's most popular reef species, targeted with whole pilchards, squid and prawns on paternoster rigs over rocky reef and rubble grounds from 20 to 100 metres. Consistent action can be found throughout the year from Queensland to Victoria and across southern Australian waters.",
    category: "reef",
    targetSpeciesSlugs: ["snapper", "nannygai"],
    primaryTechniqueSlug: "bottom-bait",
  },
  {
    slug: "slow-pitch-jigging",
    name: "Slow Pitch Jigging",
    description:
      "Slow pitch jigging is a refined Japanese technique that has transformed reef fishing in Australia, using specially designed asymmetric jigs worked with a rhythmic pitch-and-fall action to entice a wide variety of reef species including nannygai, snapper, red emperor and blue-eye trevalla. The technique excels in depths from 40 to 300 metres over rocky reef structures.",
    category: "reef",
    targetSpeciesSlugs: [
      "nannygai",
      "snapper",
      "red-emperor",
      "blue-eye-trevalla",
    ],
    primaryTechniqueSlug: "slow-pitch-jigging",
  },
  {
    slug: "wa-demersal-reef",
    name: "WA Demersal Reef",
    description:
      "Western Australia's unique demersal reef fishery targets iconic species such as dhufish, baldchin groper and rankin cod over the state's extensive limestone and coral reef systems from Exmouth to Albany. These fish are prized for their exceptional eating quality and are found on reefs from 20 to 120 metres depth.",
    category: "reef",
    targetSpeciesSlugs: ["dhufish", "baldchin-groper", "rankin-cod"],
    primaryTechniqueSlug: "bottom-bait",
  },
  {
    slug: "barramundi-estuary",
    name: "Barramundi Estuary Session",
    description:
      "Barramundi are Australia's iconic tropical sportfish, targeted with hard-bodied lures cast to mangrove edges, snags and tidal structure in the estuaries and coastal rivers of northern Australia from the Kimberley to Queensland. The wet season and immediately after provides some of the most exciting barramundi fishing as fish move into flooded country.",
    category: "estuary",
    targetSpeciesSlugs: ["barramundi", "mangrove-jack"],
    primaryTechniqueSlug: "casting-hard-bodies",
  },
  {
    slug: "flathead-soft-plastics",
    name: "Flathead on Soft Plastics",
    description:
      "Dusky flathead are one of Australia's most popular estuary targets, ambushing prey from sandy and muddy substrates in estuaries, bays and tidal flats from Queensland to South Australia. Soft plastic lures worked slowly along the bottom with a lift-and-drop retrieve are devastatingly effective and provide excellent sport on light tackle.",
    category: "estuary",
    targetSpeciesSlugs: ["flathead"],
    primaryTechniqueSlug: "soft-plastics",
  },
  {
    slug: "bream-estuary",
    name: "Bream & Whiting Estuary",
    description:
      "Bream and whiting are staple estuary species found in tidal waterways, estuaries and bays throughout coastal Australia, targeted with small baits such as prawns, worms and nippers on light gear. Bream in particular offer a surprisingly strong fight for their size and can be highly selective, making them a challenging and rewarding target.",
    category: "estuary",
    targetSpeciesSlugs: ["bream", "whiting"],
    primaryTechniqueSlug: "bait-fishing-estuary",
  },
  {
    slug: "mulloway-night",
    name: "Mulloway Night Session",
    description:
      "Mulloway are nocturnal predators that move into estuaries, river mouths and surf gutters under the cover of darkness to feed on baitfish and crustaceans. Fishing live yellowtail, mullet or tailor under a float or on a running sinker rig at night around bridge pylons, rock walls and tidal outflows is the most productive approach.",
    category: "inshore",
    targetSpeciesSlugs: ["mulloway"],
    primaryTechniqueSlug: "live-bait",
  },
  {
    slug: "squid-evening",
    name: "Squid Evening Session",
    description:
      "Southern calamari squid are one of Australia's most popular and accessible targets, moving into shallow seagrass beds, reef edges and jetty structures during the cooler months along the southern half of the continent. The evening bite around last light over shallow reef and weed beds is consistently the most productive period.",
    category: "inshore",
    targetSpeciesSlugs: ["calamari-squid"],
    primaryTechniqueSlug: "jigging",
  },
  {
    slug: "beach-casting-surf",
    name: "Beach & Surf Casting",
    description:
      "Casting baits and metal lures through the surf zone for tailor, Australian salmon and mulloway is a classic Australian beach fishing experience accessible from sandy beaches and headlands along the east and south coasts. Dawn and dusk sessions during tailor and salmon runs produce fast and furious action in the white water.",
    category: "inshore",
    targetSpeciesSlugs: ["tailor", "australian-salmon", "mulloway"],
    primaryTechniqueSlug: "beach-casting",
  },
  {
    slug: "trout-fly-fishing",
    name: "Trout Fly Fishing",
    description:
      "The highland rivers and lakes of the Snowy Mountains, Tasmania and Victoria offer world-class trout fly fishing for brown, rainbow and sea-run ocean trout in pristine alpine settings. Sight-fishing to rising fish with dry flies on clear tailwaters and spring creeks provides an especially refined and technical challenge.",
    category: "freshwater",
    targetSpeciesSlugs: ["brown-trout", "rainbow-trout", "ocean-trout"],
    primaryTechniqueSlug: "fly-fishing",
  },
  {
    slug: "murray-cod-lure",
    name: "Murray Cod Lure Fishing",
    description:
      "Murray cod are Australia's largest freshwater fish and one of the most exciting lure fishing targets on the continent, targeted with large hard-bodied lures and swimbaits cast tight to submerged timber and rock structure in the Murray-Darling river system. The species is highly territorial and will aggressively strike lures presented near their favoured snags.",
    category: "freshwater",
    targetSpeciesSlugs: ["murray-cod"],
    primaryTechniqueSlug: "lure-casting-freshwater",
  },
  {
    slug: "bass-impoundment",
    name: "Bass Impoundment Fishing",
    description:
      "South-east Queensland's impoundments, including Lake Somerset, Wivenhoe and Borumba, hold trophy Australian bass and golden perch that provide exciting lure fishing throughout the cooler months. Working surface lures and vibes around submerged timber and rocky points at dawn and dusk produces explosive strikes from quality fish.",
    category: "freshwater",
    targetSpeciesSlugs: ["australian-bass", "golden-perch"],
    primaryTechniqueSlug: "lure-casting-freshwater",
  },
  {
    slug: "nz-blue-cod",
    name: "NZ Blue Cod Bottom Fishing",
    description:
      "Blue cod are New Zealand's most popular table fish and are found in abundance over rocky reef and kelp habitat throughout the South Island and Stewart Island. Fishing whole squid and fresh cut baits on simple ledger rigs over rocky reef in 10 to 60 metres produces consistent catches of these aggressive and hard-fighting fish.",
    category: "reef",
    targetSpeciesSlugs: ["blue-cod", "tarakihi"],
    primaryTechniqueSlug: "bottom-bait",
  },
  {
    slug: "nz-snapper",
    name: "NZ Snapper Fishing",
    description:
      "New Zealand snapper are among the most prized recreational sportfish in the country, targeted over sandy and rocky grounds in the Hauraki Gulf, Bay of Plenty and throughout the upper North Island. Berleying with pilchards and fishing whole baits on running sinker rigs accounts for large numbers of fish during the summer and autumn months.",
    category: "reef",
    targetSpeciesSlugs: ["snapper"],
    primaryTechniqueSlug: "bottom-bait",
  },
  {
    slug: "bonefish-flats",
    name: "Bonefish Flats Fishing",
    description:
      "Sight-fishing for bonefish on shallow tropical sand flats with fly rods and light spinning gear is one of the world's great inshore fishing experiences, available in Australia's remote Kimberley region and across Pacific island destinations including Christmas Island. Spotting tailing and cruising fish on clear flats and presenting a well-placed fly or lure requires skill and precision.",
    category: "inshore",
    targetSpeciesSlugs: ["bonefish"],
    primaryTechniqueSlug: "fly-fishing",
  },
];
