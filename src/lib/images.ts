/**
 * Centralised Pexels image & video library.
 * All images sourced from pexels.com — search terms shown as comments.
 * Image format: https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg?auto=compress&cs=tinysrgb&w={size}
 */

const px = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

// Hero video sources are managed in VideoParallaxHero.tsx (multiple fps variants)

// ─── Category fallback images ─────────────────────────────────────────────────
// Pexels search: "australia open ocean deep sea fishing"
const OCEAN_BLUE = px(1680779);
// Pexels search: "offshore fishing boat action australia"
const OCEAN_ACTIVE = px(994605);
// Pexels search: "coral reef underwater tropical australia"
const REEF_TROPICAL = px(1591938);
// Pexels search: "tropical fish reef underwater colourful"
const REEF_FISH = px(2156311);
// Pexels search: "tropical estuary mangroves creek australia"
const ESTUARY_TROPICAL = px(3048522);
// Pexels search: "surf beach inshore fishing australia"
const INSHORE_SURF = px(994605);
// Pexels search: "fly fishing trout mountain stream clear water"
const STREAM_FLY = px(5200238);
// Pexels search: "australian river freshwater fishing impoundment"
const RIVER_FRESHWATER = px(1461471);

// ─── iNaturalist species photos (CC-licensed) ────────────────────────────────
export const INAT_SPECIES_PHOTOS: Record<string, string> = {
  "black-marlin": "https://static.inaturalist.org/photos/5662220/square.jpeg",
  "blue-marlin": "https://inaturalist-open-data.s3.amazonaws.com/photos/161629363/square.jpg",
  "sailfish": "https://inaturalist-open-data.s3.amazonaws.com/photos/152543/square.jpg",
  "yellowfin-tuna": "https://inaturalist-open-data.s3.amazonaws.com/photos/207078977/square.jpg",
  "longtail-tuna": "https://inaturalist-open-data.s3.amazonaws.com/photos/469254837/square.jpeg",
  "southern-bluefin-tuna": "https://inaturalist-open-data.s3.amazonaws.com/photos/56212493/square.jpeg",
  "spanish-mackerel": "https://inaturalist-open-data.s3.amazonaws.com/photos/218054568/square.jpg",
  "wahoo": "https://inaturalist-open-data.s3.amazonaws.com/photos/206402044/square.jpeg",
  "mahi-mahi": "https://inaturalist-open-data.s3.amazonaws.com/photos/361046671/square.jpg",
  "yellowtail-kingfish": "https://inaturalist-open-data.s3.amazonaws.com/photos/5853956/square.jpg",
  "kingfish-qld": "https://inaturalist-open-data.s3.amazonaws.com/photos/313945281/square.jpeg",
  "giant-trevally": "https://inaturalist-open-data.s3.amazonaws.com/photos/11911542/square.jpg",
  "queenfish": "https://static.inaturalist.org/photos/341981629/square.jpeg",
  "threadfin-salmon": "https://static.inaturalist.org/photos/50447387/square.jpeg",
  "cobia": "https://inaturalist-open-data.s3.amazonaws.com/photos/19249056/square.jpg",
  "coral-trout": "https://static.inaturalist.org/photos/216412385/square.jpeg",
  "red-emperor": "https://inaturalist-open-data.s3.amazonaws.com/photos/77724926/square.jpg",
  "nannygai": "https://inaturalist-open-data.s3.amazonaws.com/photos/393931352/square.jpg",
  "spangled-emperor": "https://inaturalist-open-data.s3.amazonaws.com/photos/5333031/square.jpeg",
  "rankin-cod": "https://inaturalist-open-data.s3.amazonaws.com/photos/127651227/square.jpeg",
  "snapper": "https://static.inaturalist.org/photos/18161210/square.jpeg",
  "dhufish": "https://inaturalist-open-data.s3.amazonaws.com/photos/5399767/square.jpg",
  "baldchin-groper": "https://inaturalist-open-data.s3.amazonaws.com/photos/63559013/square.jpeg",
  "blue-eye-trevalla": "https://inaturalist-open-data.s3.amazonaws.com/photos/449594763/square.png",
  "striped-trumpeter": "https://static.inaturalist.org/photos/118196849/square.jpeg",
  "barramundi": "https://inaturalist-open-data.s3.amazonaws.com/photos/256218238/square.jpg",
  "mangrove-jack": "https://inaturalist-open-data.s3.amazonaws.com/photos/42950611/square.jpeg",
  "flathead": "https://inaturalist-open-data.s3.amazonaws.com/photos/6032115/square.jpg",
  "bream": "https://inaturalist-open-data.s3.amazonaws.com/photos/5942267/square.jpg",
  "black-bream": "https://inaturalist-open-data.s3.amazonaws.com/photos/411406402/square.jpeg",
  "whiting": "https://inaturalist-open-data.s3.amazonaws.com/photos/71744567/square.jpg",
  "king-george-whiting": "https://inaturalist-open-data.s3.amazonaws.com/photos/32470101/square.jpeg",
  "luderick": "https://inaturalist-open-data.s3.amazonaws.com/photos/5861777/square.jpeg",
  "mulloway": "https://inaturalist-open-data.s3.amazonaws.com/photos/401352232/square.jpg",
  "jewfish": "https://inaturalist-open-data.s3.amazonaws.com/photos/315955428/square.jpeg",
  "tailor": "https://inaturalist-open-data.s3.amazonaws.com/photos/437666426/square.jpeg",
  "australian-salmon": "https://inaturalist-open-data.s3.amazonaws.com/photos/344433472/square.jpg",
  "gummy-shark": "https://inaturalist-open-data.s3.amazonaws.com/photos/659056766/square.jpg",
  "bonefish": "https://inaturalist-open-data.s3.amazonaws.com/photos/601558048/square.jpg",
  "milkfish": "https://inaturalist-open-data.s3.amazonaws.com/photos/124520494/square.jpeg",
  "murray-cod": "https://static.inaturalist.org/photos/60742218/square.jpg",
  "golden-perch": "https://inaturalist-open-data.s3.amazonaws.com/photos/5408381/square.jpg",
  "silver-perch": "https://inaturalist-open-data.s3.amazonaws.com/photos/98345076/square.jpeg",
  "redfin": "https://inaturalist-open-data.s3.amazonaws.com/photos/194421912/square.jpg",
  "catfish": "https://inaturalist-open-data.s3.amazonaws.com/photos/53033874/square.jpg",
  "australian-bass": "https://inaturalist-open-data.s3.amazonaws.com/photos/575365441/square.jpg",
  "brown-trout": "https://inaturalist-open-data.s3.amazonaws.com/photos/34847723/square.jpg",
  "rainbow-trout": "https://static.inaturalist.org/photos/60921460/square.jpg",
  "ocean-trout": "https://static.inaturalist.org/photos/60921460/square.jpg",
  // New species
  "yellowtail-scad": "https://inaturalist-open-data.s3.amazonaws.com/photos/58360952/square.jpeg",
  "calamari-squid": "https://inaturalist-open-data.s3.amazonaws.com/photos/132859816/square.jpg",
};

function inatPhoto(url: string, size: "medium" | "large" | "original"): string {
  return url.replace(/\/(square|small|medium|large|original)\./, `/${size}.`);
}

// ─── Species images ───────────────────────────────────────────────────────────
// Individual overrides keyed by species slug.
// Falls back to category image when no override is defined.

export const SPECIES_IMAGES: Record<string, string> = {
  // Big-game pelagic — Pexels: "australia black marlin big game fishing"
  "black-marlin": OCEAN_BLUE,
  "blue-marlin": OCEAN_BLUE,
  // Pexels: "sailfish jumping offshore fishing"
  "sailfish": OCEAN_BLUE,
  // Pexels: "yellowfin tuna fishing offshore australia"
  "yellowfin-tuna": OCEAN_ACTIVE,
  "longtail-tuna": OCEAN_ACTIVE,
  "southern-bluefin-tuna": OCEAN_ACTIVE,
  // Pexels: "spanish mackerel fish caught australia" — photo 3046643
  "spanish-mackerel": px(3046643),
  // Pexels: "wahoo fish offshore deep sea"
  "wahoo": OCEAN_BLUE,
  // Pexels: "mahi mahi dorado fish colourful" — photo 4824816
  "mahi-mahi": px(4824816),
  // Pexels: "yellowtail kingfish australia fishing"
  "yellowtail-kingfish": OCEAN_ACTIVE,
  "kingfish-qld": OCEAN_ACTIVE,
  // Pexels: "giant trevally gt popping offshore"
  "giant-trevally": REEF_FISH,
  // Pexels: "queenfish tropical fishing northern australia"
  "queenfish": REEF_FISH,
  // Pexels: "threadfin salmon tropical estuary fishing"
  "threadfin-salmon": ESTUARY_TROPICAL,
  // Pexels: "cobia fishing offshore reef"
  "cobia": OCEAN_ACTIVE,
  // Reef fish
  // Pexels: "coral trout leopard reef fish australia"
  "coral-trout": REEF_TROPICAL,
  // Pexels: "red emperor fish reef deep water australia"
  "red-emperor": REEF_TROPICAL,
  "nannygai": REEF_TROPICAL,
  // Pexels: "spangled emperor tropical reef fish"
  "spangled-emperor": REEF_TROPICAL,
  "rankin-cod": REEF_TROPICAL,
  // Pexels: "snapper fish reef australia caught" — photo 3046629
  "snapper": px(3046629),
  // Pexels: "dhufish western australia reef fishing"
  "dhufish": REEF_TROPICAL,
  "baldchin-groper": REEF_TROPICAL,
  // Pexels: "blue eye trevalla deep water fish australia"
  "blue-eye-trevalla": OCEAN_BLUE,
  "striped-trumpeter": REEF_TROPICAL,
  // Estuary / tropical species
  // Pexels: "barramundi australia tropical estuary fishing"
  "barramundi": ESTUARY_TROPICAL,
  // Pexels: "mangrove jack tropical creek australia"
  "mangrove-jack": ESTUARY_TROPICAL,
  // Pexels: "flathead fish estuary sand australia"
  "flathead": ESTUARY_TROPICAL,
  // Pexels: "bream fish estuary australia caught"
  "bream": ESTUARY_TROPICAL,
  "black-bream": ESTUARY_TROPICAL,
  // Pexels: "whiting fish estuary australia"
  "whiting": ESTUARY_TROPICAL,
  "king-george-whiting": ESTUARY_TROPICAL,
  // Pexels: "luderick blackfish float fishing australia"
  "luderick": ESTUARY_TROPICAL,
  // Pexels: "mulloway jewfish inshore australia surf"
  "mulloway": INSHORE_SURF,
  "jewfish": INSHORE_SURF,
  // Pexels: "tailor fish surf beach australia casting"
  "tailor": INSHORE_SURF,
  // Pexels: "australian salmon surf casting beach"
  "australian-salmon": INSHORE_SURF,
  // Pexels: "gummy shark fishing australia southern"
  "gummy-shark": INSHORE_SURF,
  // Tropical flats
  // Pexels: "bonefish flats fishing tropical australia"
  "bonefish": REEF_FISH,
  // Pexels: "milkfish fly fishing tropical flats"
  "milkfish": REEF_FISH,
  // Freshwater species
  // Pexels: "murray cod river fishing australia freshwater"
  "murray-cod": RIVER_FRESHWATER,
  "golden-perch": RIVER_FRESHWATER,
  "silver-perch": RIVER_FRESHWATER,
  "redfin": RIVER_FRESHWATER,
  "catfish": RIVER_FRESHWATER,
  // Pexels: "australian bass bass fishing freshwater lure"
  "australian-bass": RIVER_FRESHWATER,
  // Pexels: "saratoga fish tropical freshwater australia"
  "saratoga": ESTUARY_TROPICAL,
  // Pexels: "brown trout fly fishing stream australia"
  "brown-trout": STREAM_FLY,
  "rainbow-trout": STREAM_FLY,
  "ocean-trout": STREAM_FLY,
  // New species
  "yellowtail-scad": INSHORE_SURF,
  "calamari-squid": REEF_FISH,
  // NZ species
  "blue-cod": REEF_FISH,
  "tarakihi": REEF_TROPICAL,
  "hapuku-groper": OCEAN_BLUE,
  "john-dory": REEF_FISH,
  "blue-moki": REEF_FISH,
};

// ─── Category image fallbacks ─────────────────────────────────────────────────
export const SPECIES_CATEGORY_IMAGES: Record<string, string> = {
  pelagic: OCEAN_BLUE,
  reef: REEF_TROPICAL,
  estuary: ESTUARY_TROPICAL,
  inshore: INSHORE_SURF,
  freshwater: RIVER_FRESHWATER,
};

/** Returns the best image URL for a species (iNaturalist → Pexels species → category → ocean). */
export function getSpeciesImage(slug: string, category: string, size: 600 | 1200 = 1200): string {
  const inat = INAT_SPECIES_PHOTOS[slug];
  if (inat) return inatPhoto(inat, size === 600 ? "medium" : "large");
  const base =
    SPECIES_IMAGES[slug] ??
    SPECIES_CATEGORY_IMAGES[category] ??
    OCEAN_BLUE;
  return size === 600 ? base.replace("w=1200", "w=600") : base;
}

// ─── Zone / region images ─────────────────────────────────────────────────────
// Pexels search terms noted per zone.

export const ZONE_IMAGES: Record<string, string> = {
  // Pexels: "new zealand north island coast ocean fishing"
  nz_north_island: OCEAN_ACTIVE,
  // Pexels: "new zealand south island fiordland mountain"
  nz_south_island: STREAM_FLY,
  // Pexels: "great barrier reef cairns tropical underwater"
  far_north_qld: REEF_TROPICAL,
  // Pexels: "whitsundays queensland tropical water sailing"
  central_qld: px(1591938),
  // Pexels: "gold coast sunshine coast beach queensland ocean"
  southeast_qld: px(994605),
  // Pexels: "sydney harbour nsw australia coast ocean"
  nsw: px(1680779),
  // Pexels: "victoria australia great ocean road coast"
  vic_coast: px(1680779),
  // Pexels: "tasmania wilderness lake highland remote"
  tas: px(1461471),
  // Pexels: "lord howe island tropical lagoon australia"
  lord_howe: REEF_TROPICAL,
  // Pexels: "murray darling river australia inland waterway"
  murray_darling: px(1461471),
  // Pexels: "australian alps snow mountains highland stream"
  alpine: px(5200238),
  // Pexels: "darwin northern territory tropical harbour australia"
  nt_top_end: ESTUARY_TROPICAL,
  // Pexels: "gulf carpentaria northern australia flats fishing"
  nt_gulf: ESTUARY_TROPICAL,
  // Pexels: "kimberley western australia red rocks turquoise water"
  wa_kimberley: px(3048522),
  // Pexels: "ningaloo reef western australia coral turquoise"
  wa_pilbara: REEF_TROPICAL,
  // Pexels: "geraldton mid west western australia coast"
  wa_mid_west: px(994605),
  // Pexels: "margaret river southwest western australia coast"
  wa_southwest: px(994605),
  // Pexels: "spencer gulf south australia ocean fishing"
  sa_spencer_gulf: px(1680779),
  // Pexels: "kangaroo island south australia southern ocean coast"
  sa_south: px(1680779),
  // Pexels: "christmas island tropical fish indian ocean"
  christmas_island: REEF_FISH,
  // Pexels: "cocos keeling islands tropical lagoon atoll"
  cocos_islands: REEF_FISH,
};

// ─── Wikipedia zone photos (CC-licensed) ─────────────────────────────────────
export const WIKI_ZONE_PHOTOS: Record<string, string> = {
  "far_north_qld":    "https://upload.wikimedia.org/wikipedia/commons/9/96/Daintree_National_Park.jpg",
  "central_qld":      "https://upload.wikimedia.org/wikipedia/commons/8/8f/Whitehaven_Beach%2C_Whitsunday_Island%2C_Queensland.jpg",
  "southeast_qld":    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Gold_Coast_skyline_%28Unsplash%29.jpg/3840px-Gold_Coast_skyline_%28Unsplash%29.jpg",
  "nsw":              "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/3840px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg",
  "tas":              "https://upload.wikimedia.org/wikipedia/commons/8/88/Cradle_Mountain_Behind_Dove_Lake.jpg",
  "lord_howe":        "https://upload.wikimedia.org/wikipedia/commons/3/3f/Lord_Howe_ISS006-E-5731.png",
  "murray_darling":   "https://upload.wikimedia.org/wikipedia/commons/b/b2/EchucaWharf.JPG",
  "alpine":           "https://upload.wikimedia.org/wikipedia/commons/1/1c/Mount_Feathertop_and_Razorback.jpg",
  "nt_top_end":       "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/DarwinOct172024_02.jpg/3840px-DarwinOct172024_02.jpg",
  "nt_gulf":          "https://upload.wikimedia.org/wikipedia/commons/7/70/Karumba-beach-gulf-savannah-queensland-australia.jpg",
  "wa_kimberley":     "https://upload.wikimedia.org/wikipedia/commons/1/1c/Echidna_chasm_WA.jpg",
  "wa_pilbara":       "https://upload.wikimedia.org/wikipedia/commons/a/a0/Ningaloo.jpg",
  "wa_mid_west":      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/00_1761_Geraldton%2C_Western_Australia.jpg/3840px-00_1761_Geraldton%2C_Western_Australia.jpg",
  "wa_southwest":     "https://upload.wikimedia.org/wikipedia/commons/c/c8/Cape_Leeuwin_From_North.jpg",
  "sa_spencer_gulf":  "https://upload.wikimedia.org/wikipedia/commons/8/86/Port_Lincoln.jpg",
  "sa_south":         "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Flinders_Chase_National_Park_01.jpg/3840px-Flinders_Chase_National_Park_01.jpg",
  "christmas_island": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Christmas_Island_%285774532171%29.jpg/3840px-Christmas_Island_%285774532171%29.jpg",
  "cocos_islands":    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Cocos%28keeling%29_76.jpg",
};

/** Returns the zone image for a region card. */
export function getZoneImage(zone: string, size: 600 | 1200 = 600): string {
  const wiki = WIKI_ZONE_PHOTOS[zone];
  if (wiki) return wiki;
  const base = ZONE_IMAGES[zone] ?? px(994605);
  return size === 600 ? base.replace("w=1200", "w=600") : base;
}
