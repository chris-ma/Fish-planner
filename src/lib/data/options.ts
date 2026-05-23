export const SPECIES_OPTIONS: string[] = [
  // Pelagic
  "Black Marlin", "Blue Marlin", "Sailfish", "Yellowfin Tuna", "Longtail Tuna",
  "Spanish Mackerel", "Wahoo", "Mahi-Mahi", "Southern Bluefin Tuna",
  // Inshore
  "Yellowtail Kingfish", "Giant Trevally", "Cobia", "Tailor", "Australian Salmon",
  "Gummy Shark",
  // Reef
  "Coral Trout", "Red Emperor", "Nannygai", "Snapper", "Amberjack (Samson Fish)",
  "Blue-eye Trevalla", "Striped Trumpeter",
  // Estuary
  "Barramundi", "Mangrove Jack", "Flathead", "Mulloway", "Bream",
  "Whiting", "Luderick", "Black Jewfish",
  // Freshwater
  "Murray Cod", "Golden Perch", "Silver Perch", "Australian Bass",
  "Brown Trout", "Rainbow Trout", "Redfin", "Saratoga", "Catfish", "Ocean Trout",
  // NT / Tropical
  "Queenfish", "Threadfin Salmon",
  // WA Endemic
  "Dhufish", "Baldchin Groper", "King George Whiting", "Black Bream",
  "Spangled Emperor", "Rankin Cod",
  // Flats / Islands
  "Bonefish", "Milkfish",
];

export const REGION_OPTIONS: { slug: string; name: string; zone: string }[] = [
  // Far North QLD
  { slug: "cairns", name: "Cairns, QLD", zone: "far_north_qld" },
  { slug: "port-douglas", name: "Port Douglas, QLD", zone: "far_north_qld" },
  { slug: "cooktown", name: "Cooktown, QLD", zone: "far_north_qld" },
  { slug: "weipa", name: "Weipa, QLD", zone: "far_north_qld" },
  // Central QLD
  { slug: "townsville", name: "Townsville, QLD", zone: "central_qld" },
  { slug: "bowen", name: "Bowen, QLD", zone: "central_qld" },
  { slug: "mackay", name: "Mackay, QLD", zone: "central_qld" },
  { slug: "airlie-beach", name: "Airlie Beach / Whitsundays, QLD", zone: "central_qld" },
  { slug: "yeppoon", name: "Yeppoon, QLD", zone: "central_qld" },
  { slug: "gladstone", name: "Gladstone, QLD", zone: "central_qld" },
  // Southeast QLD
  { slug: "hervey-bay", name: "Hervey Bay, QLD", zone: "southeast_qld" },
  { slug: "sunshine-coast", name: "Sunshine Coast, QLD", zone: "southeast_qld" },
  { slug: "brisbane-moreton-bay", name: "Brisbane / Moreton Bay, QLD", zone: "southeast_qld" },
  { slug: "gold-coast", name: "Gold Coast, QLD", zone: "southeast_qld" },
  // NSW
  { slug: "ballina-byron-bay", name: "Ballina / Byron Bay, NSW", zone: "nsw" },
  { slug: "coffs-harbour", name: "Coffs Harbour, NSW", zone: "nsw" },
  { slug: "south-west-rocks", name: "South West Rocks, NSW", zone: "nsw" },
  { slug: "port-macquarie", name: "Port Macquarie, NSW", zone: "nsw" },
  { slug: "port-stephens", name: "Port Stephens, NSW", zone: "nsw" },
  { slug: "lake-macquarie", name: "Lake Macquarie, NSW", zone: "nsw" },
  { slug: "newcastle", name: "Newcastle, NSW", zone: "nsw" },
  { slug: "hawkesbury-river", name: "Hawkesbury River, NSW", zone: "nsw" },
  { slug: "sydney", name: "Sydney, NSW", zone: "nsw" },
  { slug: "wollongong", name: "Wollongong, NSW", zone: "nsw" },
  { slug: "jervis-bay", name: "Jervis Bay, NSW", zone: "nsw" },
  { slug: "ulladulla", name: "Ulladulla, NSW", zone: "nsw" },
  { slug: "batemans-bay", name: "Batemans Bay, NSW", zone: "nsw" },
  { slug: "narooma", name: "Narooma, NSW", zone: "nsw" },
  { slug: "eden", name: "Eden, NSW", zone: "nsw" },
  { slug: "tathra-merimbula", name: "Tathra / Merimbula, NSW", zone: "nsw" },
  // Lord Howe Island
  { slug: "lord-howe-island", name: "Lord Howe Island, NSW", zone: "lord_howe" },
  // Victoria
  { slug: "port-phillip-bay", name: "Port Phillip Bay, VIC", zone: "vic_coast" },
  { slug: "mornington-peninsula", name: "Mornington Peninsula, VIC", zone: "vic_coast" },
  { slug: "phillip-island", name: "Phillip Island, VIC", zone: "vic_coast" },
  { slug: "westernport-bay", name: "Westernport Bay, VIC", zone: "vic_coast" },
  { slug: "wilsons-promontory", name: "Wilsons Promontory, VIC", zone: "vic_coast" },
  { slug: "lakes-entrance", name: "Lakes Entrance, VIC", zone: "vic_coast" },
  { slug: "mallacoota", name: "Mallacoota, VIC", zone: "vic_coast" },
  { slug: "apollo-bay", name: "Apollo Bay, VIC", zone: "vic_coast" },
  { slug: "portland-vic", name: "Portland, VIC", zone: "vic_coast" },
  { slug: "warrnambool", name: "Warrnambool, VIC", zone: "vic_coast" },
  // Tasmania
  { slug: "hobart", name: "Hobart, TAS", zone: "tas" },
  { slug: "st-helens", name: "St Helens, TAS", zone: "tas" },
  { slug: "bicheno", name: "Bicheno, TAS", zone: "tas" },
  { slug: "bruny-island", name: "Bruny Island, TAS", zone: "tas" },
  { slug: "strahan", name: "Strahan, TAS", zone: "tas" },
  { slug: "devonport", name: "Devonport, TAS", zone: "tas" },
  { slug: "launceston-tamar", name: "Launceston / Tamar, TAS", zone: "tas" },
  { slug: "port-arthur", name: "Port Arthur, TAS", zone: "tas" },
  // Murray–Darling
  { slug: "murray-river-albury", name: "Murray River – Albury, NSW/VIC", zone: "murray_darling" },
  { slug: "murray-river-echuca", name: "Murray River – Echuca, VIC", zone: "murray_darling" },
  { slug: "murray-river-mildura", name: "Murray River – Mildura, VIC", zone: "murray_darling" },
  { slug: "lake-hume", name: "Lake Hume, NSW/VIC", zone: "murray_darling" },
  { slug: "lake-mulwala", name: "Lake Mulwala, VIC", zone: "murray_darling" },
  { slug: "murrumbidgee-river", name: "Murrumbidgee River, NSW", zone: "murray_darling" },
  { slug: "macquarie-river", name: "Macquarie River, NSW", zone: "murray_darling" },
  { slug: "darling-river-bourke", name: "Darling River – Bourke, NSW", zone: "murray_darling" },
  // Alpine
  { slug: "lake-eucumbene", name: "Lake Eucumbene, NSW", zone: "alpine" },
  { slug: "lake-jindabyne", name: "Lake Jindabyne, NSW", zone: "alpine" },
  { slug: "snowy-mountains-rivers", name: "Snowy Mountains Rivers, NSW", zone: "alpine" },
  { slug: "lake-eildon", name: "Lake Eildon, VIC", zone: "alpine" },
  { slug: "ovens-king-rivers", name: "Ovens & King Rivers, VIC", zone: "alpine" },
  { slug: "goulburn-river-vic", name: "Goulburn River, VIC", zone: "alpine" },
  { slug: "arthurs-lake-tas", name: "Arthurs Lake, TAS", zone: "alpine" },
  { slug: "lake-st-clair", name: "Lake St Clair, TAS", zone: "alpine" },
  // NT — Top End
  { slug: "darwin", name: "Darwin, NT", zone: "nt_top_end" },
  { slug: "bynoe-harbour", name: "Bynoe Harbour, NT", zone: "nt_top_end" },
  { slug: "daly-river", name: "Daly River, NT", zone: "nt_top_end" },
  { slug: "tiwi-islands", name: "Tiwi Islands, NT", zone: "nt_top_end" },
  { slug: "cobourg-peninsula", name: "Cobourg Peninsula, NT", zone: "nt_top_end" },
  // NT — Gulf
  { slug: "nhulunbuy-gove", name: "Nhulunbuy (Gove), NT", zone: "nt_gulf" },
  { slug: "groote-eylandt", name: "Groote Eylandt, NT", zone: "nt_gulf" },
  { slug: "borroloola", name: "Borroloola, NT", zone: "nt_gulf" },
  // WA — Kimberley
  { slug: "broome", name: "Broome, WA", zone: "wa_kimberley" },
  { slug: "kununurra", name: "Kununurra, WA", zone: "wa_kimberley" },
  { slug: "dampier-peninsula", name: "Dampier Peninsula, WA", zone: "wa_kimberley" },
  { slug: "horizontal-falls", name: "Horizontal Falls, WA", zone: "wa_kimberley" },
  // WA — Pilbara / Ningaloo
  { slug: "exmouth-ningaloo", name: "Exmouth / Ningaloo, WA", zone: "wa_pilbara" },
  { slug: "port-hedland", name: "Port Hedland, WA", zone: "wa_pilbara" },
  { slug: "karratha-dampier", name: "Karratha / Dampier, WA", zone: "wa_pilbara" },
  { slug: "shark-bay", name: "Shark Bay, WA", zone: "wa_pilbara" },
  // WA — Mid West
  { slug: "geraldton", name: "Geraldton, WA", zone: "wa_mid_west" },
  { slug: "kalbarri", name: "Kalbarri, WA", zone: "wa_mid_west" },
  { slug: "jurien-bay", name: "Jurien Bay, WA", zone: "wa_mid_west" },
  { slug: "lancelin-cervantes", name: "Lancelin / Cervantes, WA", zone: "wa_mid_west" },
  // WA — Southwest
  { slug: "perth-rottnest", name: "Perth / Rottnest, WA", zone: "wa_southwest" },
  { slug: "mandurah", name: "Mandurah, WA", zone: "wa_southwest" },
  { slug: "busselton-margaret-river", name: "Busselton / Margaret River, WA", zone: "wa_southwest" },
  { slug: "albany", name: "Albany, WA", zone: "wa_southwest" },
  { slug: "esperance", name: "Esperance, WA", zone: "wa_southwest" },
  // SA — Spencer Gulf
  { slug: "port-augusta", name: "Port Augusta, SA", zone: "sa_spencer_gulf" },
  { slug: "whyalla", name: "Whyalla, SA", zone: "sa_spencer_gulf" },
  { slug: "port-lincoln", name: "Port Lincoln, SA", zone: "sa_spencer_gulf" },
  { slug: "coffin-bay", name: "Coffin Bay, SA", zone: "sa_spencer_gulf" },
  { slug: "streaky-bay", name: "Streaky Bay, SA", zone: "sa_spencer_gulf" },
  // SA — South Coast
  { slug: "adelaide", name: "Adelaide, SA", zone: "sa_south" },
  { slug: "victor-harbor", name: "Victor Harbor, SA", zone: "sa_south" },
  { slug: "kangaroo-island", name: "Kangaroo Island, SA", zone: "sa_south" },
  { slug: "robe-beachport", name: "Robe / Beachport, SA", zone: "sa_south" },
  { slug: "mount-gambier", name: "Mount Gambier, SA", zone: "sa_south" },
  // Islands
  { slug: "christmas-island", name: "Christmas Island", zone: "christmas_island" },
  { slug: "cocos-islands", name: "Cocos (Keeling) Islands", zone: "cocos_islands" },
];
