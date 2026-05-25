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
  // ── Offshore ────────────────────────────────────────────────────────────────
  {
    slug: "southern-bluefin-tuna",
    name: "Southern Bluefin Tuna",
    description:
      "Southern bluefin tuna are one of the most powerful and prized pelagic fish in Australian waters, targeted by trolling lures and rigged baits or chunking live and dead baits along the continental shelf edge of southern Australia from SA through Victoria and Tasmania. These fish can grow to over 200 kg and are capable of sustained high-speed runs that test tackle to the limit.",
    category: "offshore",
    targetSpeciesSlugs: ["southern-bluefin-tuna"],
    primaryTechniqueSlug: "trolling",
  },
  {
    slug: "wahoo-speed-trolling",
    name: "Wahoo Speed Trolling",
    description:
      "Wahoo are the fastest fish in Australian waters and are targeted by trolling high-speed skirted lures at 14 to 18 knots over offshore FADs, current edges and temperature breaks in tropical and subtropical waters. Their razor-sharp teeth and lightning-quick strikes make them one of the most exciting pelagic species to target, and they share habitat with Spanish mackerel on inshore reefs.",
    category: "offshore",
    targetSpeciesSlugs: ["wahoo", "spanish-mackerel"],
    primaryTechniqueSlug: "trolling",
  },
  {
    slug: "cobia-casting",
    name: "Cobia Casting & Jigging",
    description:
      "Cobia are a large, hard-fighting offshore species found in warm Australian waters from WA through Queensland, frequently encountered around channel markers, FADs, whale sharks, manta rays and offshore structure. They respond eagerly to large soft plastic jigs, hard-bodied lures and live baits, and are known for following hooked fish to the surface, providing exciting sight-casting opportunities.",
    category: "offshore",
    targetSpeciesSlugs: ["cobia"],
    primaryTechniqueSlug: "casting-hard-bodies",
  },
  // ── Reef ────────────────────────────────────────────────────────────────────
  {
    slug: "samson-fish-jigging",
    name: "Samson Fish & Amberjack Jigging",
    description:
      "Samson fish and amberjack are among Australia's hardest fighting reef species, notorious for diving into structure and breaking tackle on the initial run. These powerful fish are targeted primarily in WA and Queensland waters using speed jigs and slow-pitch jigs worked over rocky pinnacles, bomboras and offshore reefs from 30 to 100 metres depth.",
    category: "reef",
    targetSpeciesSlugs: ["kingfish-qld"],
    primaryTechniqueSlug: "jigging",
  },
  {
    slug: "spangled-emperor-bashing",
    name: "Spangled Emperor Reef Fishing",
    description:
      "Spangled emperor are a prized tropical reef species found across northern Australian reefs from WA through the NT and Queensland, targeted with fresh baits on paternoster rigs in 10 to 50 metres over coral and rubble substrate. They are excellent table fish and are frequently caught alongside coral trout and red emperor on shallow inshore and offshore reefs.",
    category: "reef",
    targetSpeciesSlugs: ["spangled-emperor", "red-emperor", "coral-trout"],
    primaryTechniqueSlug: "bottom-bait",
  },
  {
    slug: "southern-reef-mixed",
    name: "Southern Reef Mixed Bag",
    description:
      "The temperate reefs of southern Australia and Tasmania hold a diverse mix of premium table fish including striped trumpeter, blue-eye trevalla and blue morwong, targeted by bottom fishing with baits and slow-pitch jigs in depths from 60 to 300 metres. Cold, nutrient-rich southern waters produce exceptional eating fish and the mixed-bag nature of this style keeps every drop interesting.",
    category: "reef",
    targetSpeciesSlugs: ["striped-trumpeter", "blue-eye-trevalla"],
    primaryTechniqueSlug: "bottom-bait",
  },
  {
    slug: "ningaloo-reef",
    name: "Ningaloo Reef Fishing",
    description:
      "Ningaloo Reef in WA's Coral Coast is a world heritage site with outstanding fishing for coral trout, rankin cod, spangled emperor and a host of tropical species over pristine coral reef in crystal-clear water. The accessibility of the reef from the shore and the diversity of species on offer makes Ningaloo one of Australia's premier reef fishing destinations.",
    category: "reef",
    targetSpeciesSlugs: ["coral-trout", "rankin-cod", "spangled-emperor"],
    primaryTechniqueSlug: "bottom-bait",
  },
  {
    slug: "nz-hapuku-deep",
    name: "NZ Deep Groper Fishing",
    description:
      "Hapuku, also known as groper, are New Zealand's premier deep-sea table fish, targeted over deep-water pinnacles and rock faces from 100 to 400 metres around both islands. Fresh squid and fish baits on heavy paternoster rigs dropped to the bottom produce consistent results on these large, powerful fish. John Dory and blue cod often share the same structure.",
    category: "reef",
    targetSpeciesSlugs: ["hapuku-groper", "blue-cod", "john-dory"],
    primaryTechniqueSlug: "bottom-bait",
  },
  // ── Inshore ─────────────────────────────────────────────────────────────────
  {
    slug: "gummy-shark-fishing",
    name: "Gummy Shark Night Fishing",
    description:
      "Gummy sharks are Victoria and SA's most popular inshore target, sought at night in tidal bays, channels and coastal surf beaches using large fresh baits of squid, pilchard and tuna on wire or heavy mono traces. Port Phillip Bay, Westernport Bay and the Yorke Peninsula are consistent producers, particularly on the tide change during the warmer months.",
    category: "inshore",
    targetSpeciesSlugs: ["gummy-shark"],
    primaryTechniqueSlug: "live-bait",
  },
  {
    slug: "kingfish-livebait",
    name: "Kingfish on Live Bait",
    description:
      "Yellowtail kingfish are extremely responsive to live baits, particularly slimy mackerel, yakkas and squid drifted over offshore reefs and pinnacles along the NSW and VIC coast. Live baiting is particularly effective when kingfish are finicky and not responding to jigs or lures, and regularly produces the largest fish of a session.",
    category: "inshore",
    targetSpeciesSlugs: ["yellowtail-kingfish"],
    primaryTechniqueSlug: "live-bait",
  },
  {
    slug: "rock-fishing",
    name: "Rock Platform & Drummer Fishing",
    description:
      "Rock fishing for black drummer and Australian salmon from exposed headlands and rock platforms is a traditional Australian fishing experience, particularly popular in NSW and VIC. Black drummer (luderick) are targeted with green weed on light float rigs in surging gutters while Australian salmon and tailor smash metal lures cast into the white water from the same platforms.",
    category: "inshore",
    targetSpeciesSlugs: ["black-drummer", "australian-salmon"],
    primaryTechniqueSlug: "beach-casting",
  },
  {
    slug: "milkfish-fly",
    name: "Milkfish on the Fly",
    description:
      "Milkfish are one of the ultimate fly fishing challenges, a large, fast and incredibly powerful filter-feeder found on the surface scum lines and current edges around Christmas Island and Cocos Keeling Islands. Presenting tiny flies in surface foam to finicky fish that rarely take and then make blistering 200 m runs is the pinnacle of tropical saltwater fly fishing.",
    category: "inshore",
    targetSpeciesSlugs: ["milkfish"],
    primaryTechniqueSlug: "fly-fishing",
  },
  // ── Estuary ─────────────────────────────────────────────────────────────────
  {
    slug: "black-jewfish-estuary",
    name: "Black Jewfish Estuary Fishing",
    description:
      "Black jewfish are a large, nocturnal estuary predator found in the tidal rivers and estuaries of northern Australia from the Kimberley through to central Queensland, prized for both their size and exceptional eating quality. Large live mullet and catfish baits fished in tidal holes and deep channel bends produce the best results during low light periods.",
    category: "estuary",
    targetSpeciesSlugs: ["jewfish", "mulloway"],
    primaryTechniqueSlug: "live-bait",
  },
  {
    slug: "threadfin-salmon",
    name: "Threadfin Salmon Casting",
    description:
      "Threadfin salmon are one of the most exciting lure fishing targets in tropical Australia, found in the turbid estuaries and creek mouths of Queensland and the NT where they ambush prawns and baitfish on tidal run-outs. These powerful fish respond aggressively to large soft plastic lures and hard-bodied swimbaits worked through the dirty water of tidal outflows.",
    category: "estuary",
    targetSpeciesSlugs: ["threadfin-salmon", "barramundi"],
    primaryTechniqueSlug: "casting-hard-bodies",
  },
  {
    slug: "king-george-whiting-sa",
    name: "King George Whiting",
    description:
      "King George whiting are South Australia's most prized table fish and are found in the shallow seagrass beds and sandy bays of Gulf St Vincent, Spencer Gulf and the Yorke and Eyre peninsulas. Fishing fresh peeled prawn, pippi or bluebait on small hooks with running sinker rigs over clean sandy ground produces consistent catches of these delicately flavoured fish.",
    category: "estuary",
    targetSpeciesSlugs: ["king-george-whiting", "whiting"],
    primaryTechniqueSlug: "bait-fishing-estuary",
  },
  {
    slug: "mangrove-jack-lure",
    name: "Mangrove Jack Lure Fishing",
    description:
      "Mangrove jack are one of Australia's most aggressive and frustrating estuary species, ambushing lures from beneath mangrove overhangs, submerged timber and bridge pylon shadows in tidal rivers from the Kimberley to northern NSW. These fish hit hard, turn instantly and use every piece of structure to bust off anglers, demanding heavy leader and immediate pressure after the strike.",
    category: "estuary",
    targetSpeciesSlugs: ["mangrove-jack"],
    primaryTechniqueSlug: "casting-hard-bodies",
  },
  // ── Freshwater ──────────────────────────────────────────────────────────────
  {
    slug: "saratoga-topwater",
    name: "Saratoga Topwater Fishing",
    description:
      "Saratoga are a prehistoric-looking freshwater predator native to northern Queensland and the NT, highly prized by lure anglers for their aggression on surface lures and hard-bodied stickbaits worked over weed beds and submerged timber in impoundments and slow-moving rivers. Their acrobatic jumps after being hooked make them one of Australia's most exciting freshwater sport fish.",
    category: "freshwater",
    targetSpeciesSlugs: ["saratoga"],
    primaryTechniqueSlug: "lure-casting-freshwater",
  },
  {
    slug: "redfin-impoundment",
    name: "Redfin Perch Impoundment",
    description:
      "Redfin perch are a highly regarded sport fish in southern Australian impoundments, schooling over submerged structure and rocky points in lakes throughout Victoria, SA and the ACT. They are aggressive biters that respond well to blade vibes, small soft plastics and Tassie Devil lures retrieved at mid-depth, and provide fast-action fishing when located with a sounder.",
    category: "freshwater",
    targetSpeciesSlugs: ["redfin"],
    primaryTechniqueSlug: "lure-casting-freshwater",
  },
];
