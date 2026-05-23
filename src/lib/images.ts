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
};

// ─── Category image fallbacks ─────────────────────────────────────────────────
export const SPECIES_CATEGORY_IMAGES: Record<string, string> = {
  pelagic: OCEAN_BLUE,
  reef: REEF_TROPICAL,
  estuary: ESTUARY_TROPICAL,
  inshore: INSHORE_SURF,
  freshwater: RIVER_FRESHWATER,
};

/** Returns the best image URL for a species (species-specific → category → ocean). */
export function getSpeciesImage(slug: string, category: string, size: 600 | 1200 = 1200): string {
  const base =
    SPECIES_IMAGES[slug] ??
    SPECIES_CATEGORY_IMAGES[category] ??
    OCEAN_BLUE;
  // Swap the width in the URL for card-size requests
  return size === 600 ? base.replace("w=1200", "w=600") : base;
}

// ─── Zone / region images ─────────────────────────────────────────────────────
// Pexels search terms noted per zone.

export const ZONE_IMAGES: Record<string, string> = {
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

/** Returns the zone image for a region card. */
export function getZoneImage(zone: string, size: 600 | 1200 = 600): string {
  const base = ZONE_IMAGES[zone] ?? px(994605);
  return size === 600 ? base.replace("w=1200", "w=600") : base;
}
