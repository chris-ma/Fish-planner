import { createClient } from "@libsql/client";
import { nanoid } from "nanoid";

export const maxDuration = 60;

const SECRET = "EXPAND_V2_FISH_PLANNER";

const esc = (s: string | null | undefined) =>
  s ? s.replace(/'/g, "''") : "";

// ─── New regions ──────────────────────────────────────────────────────────────
const NEW_REGIONS = [
  // Lord Howe Island
  { slug: "lord-howe-island", name: "Lord Howe Island", state: "NSW", zone: "lord_howe", lat: -31.55, lon: 159.08, desc: "World Heritage island 600km offshore. Exceptional kingfish, trevally, wahoo, and coral reef fishing. Remote and pristine — world-class light-tackle action." },
  // Victoria Coastal
  { slug: "port-phillip-bay", name: "Port Phillip Bay / Melbourne", state: "VIC", zone: "vic_coast", lat: -37.8136, lon: 144.9631, desc: "Victoria's largest bay offers year-round snapper, flathead, whiting, and bream. Rips and artificial reefs attract kingfish and southern bluefin tuna in summer." },
  { slug: "mornington-peninsula", name: "Mornington Peninsula", state: "VIC", zone: "vic_coast", lat: -38.2, lon: 145.03, desc: "The Port Phillip side holds flathead and bream; Bass Strait side offers snapper and excellent kingfish in summer. Strong gummy shark fishery." },
  { slug: "phillip-island", name: "Phillip Island", state: "VIC", zone: "vic_coast", lat: -38.5, lon: 145.2, desc: "Strong snapper and barracouta. Western Entrance productive for SBT in summer. Good rock fishing for salmon and sweep." },
  { slug: "westernport-bay", name: "Westernport Bay", state: "VIC", zone: "vic_coast", lat: -38.35, lon: 145.35, desc: "Excellent snapper and whiting bay. Channels and flats around French Island produce great flathead and bream year-round. Good gummy shark at night." },
  { slug: "wilsons-promontory", name: "Wilsons Promontory", state: "VIC", zone: "vic_coast", lat: -39.13, lon: 146.37, desc: "The southernmost tip of mainland Australia. Remote offshore reefs hold snapper, blue-eye trevalla, and striped trumpeter. SBT and kingfish in summer." },
  { slug: "lakes-entrance", name: "Lakes Entrance / Gippsland", state: "VIC", zone: "vic_coast", lat: -37.88, lon: 147.98, desc: "Gippsland Lakes is one of Australia's largest lake systems. Bream, flathead, and estuary perch inside. Offshore holds snapper, blue-eye trevalla, and SBT." },
  { slug: "mallacoota", name: "Mallacoota", state: "VIC", zone: "vic_coast", lat: -37.57, lon: 149.75, desc: "Remote and pristine, Mallacoota Inlet holds exceptional bream, flathead, and estuary perch. Offshore reefs deliver snapper and blue-eye trevalla." },
  { slug: "apollo-bay", name: "Apollo Bay", state: "VIC", zone: "vic_coast", lat: -38.75, lon: 143.67, desc: "Great Ocean Road fishing hub. Offshore reefs hold snapper and blue-eye. Rock and jetty fishing for salmon and sweep. SBT charters in summer." },
  { slug: "portland-vic", name: "Portland", state: "VIC", zone: "vic_coast", lat: -38.34, lon: 141.6, desc: "Victoria's main southern bluefin tuna port. SBT charters run summer through autumn. Offshore reefs hold blue-eye trevalla, snapper, and gummy shark." },
  { slug: "warrnambool", name: "Warrnambool", state: "VIC", zone: "vic_coast", lat: -38.38, lon: 142.48, desc: "Surf coast fishing for salmon and tailor. Lady Bay and Hopkins River hold bream and flathead. Offshore snapper and gummy shark." },
  // Tasmania
  { slug: "hobart", name: "Hobart / D'Entrecasteaux Channel", state: "TAS", zone: "tas", lat: -42.88, lon: 147.33, desc: "Tasmania's capital on the Derwent Estuary with bream, flathead, and estuary perch. D'Entrecasteaux Channel offers snapper and blue-eye trevalla. Sea-run trout are a specialty." },
  { slug: "st-helens", name: "St Helens", state: "TAS", zone: "tas", lat: -41.32, lon: 148.25, desc: "Northeast Tasmania's premier fishing hub. Exceptional bluefin tuna from St Helens Point. Nearby reefs and Georges Bay hold snapper, flathead, and bream." },
  { slug: "bicheno", name: "Bicheno", state: "TAS", zone: "tas", lat: -41.87, lon: 148.3, desc: "Protected east coast location with good reef fishing. Snapper, bastard trumpeter, and blue warehou are common. Offshore for blue-eye and striped trumpeter." },
  { slug: "bruny-island", name: "Bruny Island", state: "TAS", zone: "tas", lat: -43.45, lon: 147.38, desc: "Remote island south of Hobart. Excellent snapper, blue-eye trevalla, and striped trumpeter. Wild sea-run trout in the Adventure Bay area." },
  { slug: "strahan", name: "Strahan / Macquarie Harbour", state: "TAS", zone: "tas", lat: -42.15, lon: 145.33, desc: "West coast fishing with Macquarie Harbour holding exceptional sea-run trout. Offshore for blue-eye and striped trumpeter in season." },
  { slug: "devonport", name: "Devonport / Bass Strait", state: "TAS", zone: "tas", lat: -41.18, lon: 146.35, desc: "Northern Tasmania facing Bass Strait. Good snapper and flathead in the Mersey River. Offshore delivers school and bluefin tuna in season." },
  { slug: "launceston-tamar", name: "Launceston / Tamar River", state: "TAS", zone: "tas", lat: -41.43, lon: 147.13, desc: "The Tamar estuary holds bream, flathead, and estuary perch. Sea-run trout run the river in autumn. Bass Strait offshore for tuna and snapper." },
  { slug: "port-arthur", name: "Port Arthur / Tasman Peninsula", state: "TAS", zone: "tas", lat: -43.15, lon: 147.85, desc: "Spectacular cliff fishing for striped trumpeter and blue warehou. Offshore deep reefs hold blue-eye trevalla and diverse reef species." },
  // Missing NSW
  { slug: "south-west-rocks", name: "South West Rocks", state: "NSW", zone: "nsw", lat: -30.88, lon: 153.04, desc: "Trial Bay and the surrounding reefs produce excellent snapper, kingfish, and tuna. Smoky Cape is a known pelagic aggregation point." },
  { slug: "port-stephens", name: "Port Stephens", state: "NSW", zone: "nsw", lat: -32.72, lon: 152.1, desc: "One of NSW's premier destinations. Deep-water port with excellent flathead, bream, and luderick inside. Offshore canyon delivers yellowfin tuna and marlin." },
  { slug: "lake-macquarie", name: "Lake Macquarie", state: "NSW", zone: "nsw", lat: -33.07, lon: 151.6, desc: "Australia's largest coastal saltwater lake. Exceptional flathead, bream, mullet, and luderick. Swansea channel connection delivers pelagic access." },
  { slug: "hawkesbury-river", name: "Hawkesbury River", state: "NSW", zone: "nsw", lat: -33.57, lon: 151.27, desc: "Major river system north of Sydney with excellent flathead, bream, jewfish, and Australian bass. Mangrove systems hold mulloway on tide changes." },
  { slug: "wollongong", name: "Wollongong", state: "NSW", zone: "nsw", lat: -34.43, lon: 150.89, desc: "Rock fishing capital of NSW. Close offshore canyon access produces kingfish and tuna. Shellharbour and Lake Illawarra hold flathead and bream." },
  { slug: "ulladulla", name: "Ulladulla", state: "NSW", zone: "nsw", lat: -35.35, lon: 150.47, desc: "Productive offshore grounds with excellent yellowfin tuna and mahi-mahi. The harbour and Pigeon Bay hold bream, flathead, and jewfish." },
  { slug: "narooma", name: "Narooma", state: "NSW", zone: "nsw", lat: -36.22, lon: 150.13, desc: "Wagonga Inlet holds bream, flathead, and luderick. Offshore delivers excellent snapper and tuna. Montague Island draws pelagics and seals." },
  { slug: "tathra-merimbula", name: "Tathra / Merimbula", state: "NSW", zone: "nsw", lat: -36.73, lon: 149.9, desc: "Two Lakes at Merimbula and the Tathra wharf are local icons. Snapper, flathead, and bream in the lakes. Offshore pelagics in summer." },
  // Murray-Darling
  { slug: "murray-river-albury", name: "Murray River (Albury)", state: "NSW", zone: "murray_darling", lat: -36.07, lon: 146.92, desc: "The upper Murray around Albury-Wodonga is prime Murray cod and golden perch country. Snags, rock bars, and deep pools hold big cod throughout the system." },
  { slug: "murray-river-echuca", name: "Murray River (Echuca)", state: "VIC", zone: "murray_darling", lat: -36.14, lon: 144.75, desc: "Historic paddle steamer town on the Murray. Excellent Murray cod with trophy fish common. Golden perch and catfish year-round." },
  { slug: "murray-river-mildura", name: "Murray River (Mildura)", state: "VIC", zone: "murray_darling", lat: -34.19, lon: 142.16, desc: "Lower Murray with warm water and excellent golden perch. Trophy Murray cod in the deeper pools and log snags." },
  { slug: "lake-hume", name: "Lake Hume", state: "NSW", zone: "murray_darling", lat: -36.1, lon: 147.03, desc: "Large reservoir on the upper Murray. Excellent golden perch, Murray cod, and trout. Rocky points and submerged timber hold fish year-round." },
  { slug: "lake-mulwala", name: "Lake Mulwala / Yarrawonga", state: "VIC", zone: "murray_darling", lat: -35.98, lon: 146.0, desc: "Impoundment on the Murray at Yarrawonga. Famous for large Murray cod and golden perch. Fallen trees and rock walls provide excellent structure." },
  { slug: "murrumbidgee-river", name: "Murrumbidgee River", state: "NSW", zone: "murray_darling", lat: -34.82, lon: 146.04, desc: "Major Murray-Darling tributary with good Murray cod and golden perch. The Wagga Wagga to Hay stretch has significant snag habitat for big cod." },
  { slug: "macquarie-river", name: "Macquarie River", state: "NSW", zone: "murray_darling", lat: -31.97, lon: 148.66, desc: "Western NSW river system with good golden perch and Murray cod. The Macquarie Marshes hold healthy populations in flood seasons." },
  { slug: "darling-river-bourke", name: "Darling River (Bourke)", state: "NSW", zone: "murray_darling", lat: -30.09, lon: 145.94, desc: "Remote outback fishing on the iconic Darling River. Golden perch, bony bream, and catfish. Best in spring when flood flows activate the system." },
  // Alpine
  { slug: "lake-eucumbene", name: "Lake Eucumbene", state: "NSW", zone: "alpine", lat: -36.13, lon: 148.75, desc: "Australia's largest inland reservoir. Trophy brown and rainbow trout fishing. Spring bait fishing and autumn fly fishing are highlights of the trout calendar." },
  { slug: "lake-jindabyne", name: "Lake Jindabyne", state: "NSW", zone: "alpine", lat: -36.42, lon: 148.63, desc: "Gateway to Snowy Mountains trout fishing. Brown and rainbow trout with excellent trolling and fly fishing. Surrounded by spectacular mountain scenery." },
  { slug: "snowy-mountains-rivers", name: "Snowy Mountains Rivers", state: "NSW", zone: "alpine", lat: -36.4, lon: 148.36, desc: "World-class fly fishing on the Thredbo, Eucumbene, and Tumut rivers. Wild brown trout in pristine alpine streams — dry fly and nymph territory." },
  { slug: "lake-eildon", name: "Lake Eildon", state: "VIC", zone: "alpine", lat: -37.18, lon: 145.93, desc: "Victoria's largest reservoir. Excellent golden perch, Murray cod, and rainbow trout. Rocky points, creek arms, and the Delatite arm hold fish year-round." },
  { slug: "ovens-king-rivers", name: "Ovens / King Rivers", state: "VIC", zone: "alpine", lat: -36.73, lon: 146.89, desc: "Victorian alpine rivers with wild brown and rainbow trout. The Ovens between Bright and Myrtleford is a fly fishing gem — clear water and challenging fish." },
  { slug: "goulburn-river-vic", name: "Goulburn River (VIC)", state: "VIC", zone: "alpine", lat: -37.33, lon: 145.91, desc: "One of Victoria's premier trout fisheries. The upper Goulburn above Eildon has wild brown trout. Excellent dry fly fishing during the evening rise." },
  { slug: "arthurs-lake-tas", name: "Arthurs Lake", state: "TAS", zone: "alpine", lat: -41.99, lon: 146.9, desc: "Tasmania's premier trout lake. Prolific brown and rainbow trout with famous polaroiding in the shallows. Dun season produces spectacular dry fly fishing." },
  { slug: "lake-st-clair", name: "Lake St Clair", state: "TAS", zone: "alpine", lat: -42.11, lon: 146.17, desc: "Australia's deepest lake in the heart of the World Heritage wilderness. Remote brown and rainbow trout in a spectacular alpine setting." },
];

// ─── New species ──────────────────────────────────────────────────────────────
const NEW_SPECIES = [
  { slug: "southern-bluefin-tuna", commonName: "Southern Bluefin Tuna", scientificName: "Thunnus maccoyii", category: "pelagic", desc: "The prized tuna of southern Australia. Portland and St Helens (TAS) are SBT hotspots. Trolled minnows and skirted lures in cooler Southern Ocean currents.", minSize: null, bagLimit: 3 },
  { slug: "australian-salmon", commonName: "Australian Salmon (Kahawai)", scientificName: "Arripis trutta", category: "inshore", desc: "Powerful schooling fish of the southern surf beaches. Fantastic on metal slugs and soft plastics. Peak runs April-August in VIC and TAS.", minSize: 280, bagLimit: 20 },
  { slug: "gummy-shark", commonName: "Gummy Shark", scientificName: "Mustelus antarcticus", category: "inshore", desc: "A Victorian and Tasmanian favourite. Prime table fish targeted with whole pilchards and squid on the bottom. Night fishing from beaches and bays produces the best results.", minSize: 450, bagLimit: 2 },
  { slug: "blue-eye-trevalla", commonName: "Blue-eye Trevalla", scientificName: "Hyperoglyphe antarctica", category: "reef", desc: "A southern deep-water prized table fish. Targeted with slow-pitch jigs and bait in 150-500m over southern continental shelf reefs. Peak in VIC and TAS.", minSize: 450, bagLimit: 5 },
  { slug: "striped-trumpeter", commonName: "Striped Trumpeter", scientificName: "Latris lineata", category: "reef", desc: "Tasmania's iconic deep-water reef fish. Targeted from the rocks and offshore in cold southern waters. Excellent eating and fierce fighter.", minSize: 400, bagLimit: 10 },
  { slug: "murray-cod", commonName: "Murray Cod", scientificName: "Maccullochella peelii", category: "freshwater", desc: "Australia's largest freshwater fish and the most prized inland target. Big cod lurk in deep snag-filled pools year-round. Peak action spring to early summer on surface lures.", minSize: 550, bagLimit: 2 },
  { slug: "golden-perch", commonName: "Golden Perch (Yellowbelly)", scientificName: "Macquaria ambigua", category: "freshwater", desc: "The Murray-Darling's premier table fish. Active year-round but fired up in spring and summer floods. Bibbed minnows, soft plastics, and bait all work.", minSize: 300, bagLimit: 10 },
  { slug: "silver-perch", commonName: "Silver Perch", scientificName: "Bidyanus bidyanus", category: "freshwater", desc: "A native Murray-Darling perch stocked in many impoundments. Responds to small lures and bait. Best in warmer months.", minSize: 300, bagLimit: 10 },
  { slug: "australian-bass", commonName: "Australian Bass", scientificName: "Macquaria novemaculeata", category: "freshwater", desc: "The premier sportfish of eastern Australian coastal rivers. Spawns in estuaries in winter then returns to freshwater. Aggressive surface and lure strikes in spring and autumn.", minSize: 300, bagLimit: 5 },
  { slug: "brown-trout", commonName: "Brown Trout", scientificName: "Salmo trutta", category: "freshwater", desc: "The ultimate challenge for Australian fly fishers. Wild fish in alpine streams and highland lakes. Selective feeders rewarding precise presentation — dry fly season runs spring through autumn.", minSize: 300, bagLimit: 5 },
  { slug: "rainbow-trout", commonName: "Rainbow Trout", scientificName: "Oncorhynchus mykiss", category: "freshwater", desc: "Energetic jumpers found in stocked lakes and alpine streams. Respond well to spinners, fly, and bait. Prolific in the Snowy Mountains and Victorian highlands.", minSize: 250, bagLimit: 5 },
  { slug: "redfin", commonName: "Redfin (European Perch)", scientificName: "Perca fluviatilis", category: "freshwater", desc: "Introduced but widely popular. Found in most inland lakes and rivers. Aggressive schooling predators that hammer small lures, spinners, and worms. Peak action in autumn.", minSize: 250, bagLimit: 50 },
  { slug: "saratoga", commonName: "Saratoga (Spotted)", scientificName: "Scleropages leichardtii", category: "freshwater", desc: "Ancient bony-tongued fish of tropical Queensland rivers. Surface-dwelling predator that hits topwater flies and lures. A bucket-list target in far north QLD impoundments.", minSize: 450, bagLimit: 2 },
  { slug: "catfish", commonName: "Eel-tailed Catfish (Tandanus)", scientificName: "Tandanus tandanus", category: "freshwater", desc: "Native freshwater catfish found throughout the Murray-Darling basin and northern coastal rivers. Caught on bait fished on the bottom. Good table fish with firm white flesh.", minSize: 300, bagLimit: 10 },
  { slug: "ocean-trout", commonName: "Ocean (Sea-run) Trout", scientificName: "Oncorhynchus mykiss", category: "freshwater", desc: "Sea-run rainbow trout that grow large in the ocean before running into rivers and estuaries. A Tasmanian specialty — caught trolling in bays or fly fishing in estuaries.", minSize: 300, bagLimit: 5 },
];

// ─── New techniques ───────────────────────────────────────────────────────────
const NEW_TECHNIQUES = [
  { slug: "fly-fishing", name: "Fly Fishing", category: "freshwater", desc: "Traditional fly fishing with dry flies and nymphs for trout and bass in streams and lakes. The pinnacle of freshwater technique." },
  { slug: "lure-casting-freshwater", name: "Lure Casting (Freshwater)", category: "freshwater", desc: "Casting hard body lures, swimbaits, and surface lures to freshwater structure — snags, rock bars, and weed edges." },
  { slug: "bait-fishing-freshwater", name: "Freshwater Bait Fishing", category: "freshwater", desc: "Bottom and mid-water bait fishing using yabbies, worms, scrub worms, and grubs targeting perch, cod, and catfish." },
  { slug: "trolling-freshwater", name: "Trolling (Freshwater)", category: "freshwater", desc: "Trolling minnow lures, spinnerbaits, and deep-diving hard bodies in lakes and large rivers targeting trout and golden perch." },
];

// ─── New species-technique links ──────────────────────────────────────────────
const NEW_SPECIES_TECHNIQUES: Record<string, string[]> = {
  "murray-cod": ["lure-casting-freshwater", "bait-fishing-freshwater", "trolling-freshwater"],
  "golden-perch": ["lure-casting-freshwater", "bait-fishing-freshwater", "trolling-freshwater"],
  "silver-perch": ["bait-fishing-freshwater", "lure-casting-freshwater"],
  "australian-bass": ["lure-casting-freshwater", "fly-fishing", "bait-fishing-freshwater"],
  "brown-trout": ["fly-fishing", "lure-casting-freshwater", "bait-fishing-freshwater", "trolling-freshwater"],
  "rainbow-trout": ["fly-fishing", "lure-casting-freshwater", "bait-fishing-freshwater", "trolling-freshwater"],
  "ocean-trout": ["fly-fishing", "lure-casting-freshwater", "trolling-freshwater"],
  "redfin": ["lure-casting-freshwater", "bait-fishing-freshwater", "fly-fishing"],
  "saratoga": ["lure-casting-freshwater", "fly-fishing"],
  "catfish": ["bait-fishing-freshwater"],
  "southern-bluefin-tuna": ["trolling", "jigging"],
  "australian-salmon": ["beach-casting", "trolling", "jigging", "casting-hard-bodies"],
  "gummy-shark": ["bottom-bait", "bait-fishing-estuary"],
  "blue-eye-trevalla": ["slow-pitch-jigging", "jigging", "bottom-bait"],
  "striped-trumpeter": ["jigging", "slow-pitch-jigging", "bottom-bait"],
};

// ─── Season data (new zones for existing species + all zones for new species) ──
type Rating = "poor" | "fair" | "good" | "peak" | null;
const SEASON_DATA: Record<string, Record<string, (Rating | null)[]>> = {
  // Existing species × new zones
  "black-marlin":        { lord_howe: [null,"fair","peak","good",null,null,null,null,null,null,"fair","good","fair"] },
  "blue-marlin":         { lord_howe: [null,"good","peak","good","fair",null,null,null,null,null,"fair","good","good"] },
  "sailfish":            { lord_howe: [null,"good","good","fair","poor",null,null,null,null,"fair","fair","good","good"] },
  "yellowfin-tuna":      { vic_coast:[null,"good","good","fair","poor",null,null,null,null,"fair","fair","good","good"], tas:[null,"fair","good","fair","poor",null,null,null,null,null,"fair","fair","fair"], lord_howe:[null,"good","good","good","fair","poor",null,null,"fair","good","peak","peak","good"] },
  "longtail-tuna":       { vic_coast:[null,"fair","fair","fair","fair","poor",null,null,null,"fair","fair","fair","fair"], lord_howe:[null,"fair","good","good","peak","good","fair","fair","good","peak","peak","good","fair"] },
  "spanish-mackerel":    { lord_howe:[null,"good","peak","peak","good","fair","poor","poor","fair","good","peak","peak","good"] },
  "wahoo":               { lord_howe:[null,"peak","peak","good","fair","poor",null,null,"fair","good","peak","peak","peak"] },
  "mahi-mahi":           { lord_howe:[null,"peak","peak","good","fair","poor",null,null,null,"good","peak","peak","peak"] },
  "yellowtail-kingfish": { vic_coast:[null,"good","good","fair","fair","fair","poor","poor","fair","fair","good","peak","peak"], tas:[null,"fair","good","fair","fair","poor","poor","poor","poor","fair","fair","fair","fair"], lord_howe:[null,"good","good","good","good","peak","peak","peak","good","good","good","good","good"] },
  "giant-trevally":      { lord_howe:[null,"good","fair","fair","good","peak","peak","peak","peak","good","good","good","good"] },
  "cobia":               { lord_howe:[null,"good","peak","peak","good","fair",null,null,null,"fair","good","good","good"] },
  "coral-trout":         { lord_howe:[null,"fair","fair","fair","good","peak","peak","peak","peak","good","good","fair","fair"] },
  "red-emperor":         { lord_howe:[null,"fair","fair","fair","good","peak","peak","peak","good","good","fair","fair","fair"] },
  "nannygai":            { vic_coast:[null,"fair","fair","fair","good","good","good","good","good","good","fair","fair","fair"], tas:[null,"fair","fair","fair","good","peak","peak","good","good","good","fair","fair","fair"] },
  "snapper":             { vic_coast:[null,"good","fair","fair","good","peak","good","fair","peak","peak","peak","good","good"], tas:[null,"good","good","good","peak","good","fair","fair","good","peak","peak","good","good"], lord_howe:[null,"fair","fair","fair","good","peak","peak","good","good","good","fair","fair","fair"] },
  "kingfish-qld":        { vic_coast:[null,"good","good","fair","fair","fair","poor","poor","fair","fair","good","good","good"], tas:[null,"fair","fair","fair","fair","poor","poor","poor","poor","fair","fair","fair","fair"], lord_howe:[null,"good","good","fair","fair","good","good","good","fair","good","good","good","good"] },
  "mangrove-jack":       { lord_howe:[null,"good","fair","fair","fair","peak","peak","peak","good","good","good","good","good"] },
  "flathead":            { vic_coast:[null,"good","good","fair","fair","fair","fair","fair","fair","good","good","peak","peak"], tas:[null,"good","good","fair","fair","fair","fair","fair","fair","good","good","good","good"] },
  "mulloway":            { vic_coast:[null,"fair","fair","fair","good","peak","peak","good","good","good","fair","fair","fair"], tas:[null,"fair","fair","fair","good","good","fair","fair","fair","good","fair","fair","fair"] },
  "bream":               { vic_coast:[null,"good","good","fair","good","peak","peak","good","good","good","good","good","good"], tas:[null,"good","good","fair","fair","good","fair","fair","good","good","good","good","good"] },
  "tailor":              { vic_coast:[null,"fair","fair","fair","good","peak","peak","good","good","fair","fair","fair","fair"], tas:[null,"fair","fair","fair","good","peak","peak","good","good","fair","fair","fair","fair"], lord_howe:[null,"fair","fair","fair","fair","good","good","good","good","fair","fair","fair","fair"] },
  "whiting":             { vic_coast:[null,"good","good","fair","fair","good","good","good","fair","good","good","good","good"], tas:[null,"good","good","fair","fair","good","good","good","fair","good","good","good","good"] },
  "luderick":            { vic_coast:[null,"fair","fair","fair","good","peak","peak","peak","good","fair","fair","fair","fair"], tas:[null,"fair","fair","fair","good","peak","peak","peak","good","fair","fair","fair","fair"] },
  "jewfish":             { lord_howe:[null,"good","fair","fair","good","peak","peak","good","good","good","good","good","good"] },
  // New species × all zones
  "southern-bluefin-tuna": { vic_coast:[null,"peak","peak","good","fair","poor",null,null,null,"fair","good","peak","peak"], tas:[null,"peak","peak","good","fair","poor",null,null,null,"fair","good","good","peak"], nsw:[null,"good","good","fair","poor",null,null,null,null,null,"fair","fair","good"] },
  "australian-salmon":     { vic_coast:[null,"fair","fair","good","peak","peak","good","good","good","good","fair","fair","fair"], tas:[null,"fair","fair","good","peak","peak","good","good","good","good","fair","fair","fair"], nsw:[null,"fair","fair","good","peak","peak","good","good","good","good","fair","fair","fair"], southeast_qld:[null,"fair","fair","fair","good","good","fair","fair","good","good","fair","fair","fair"] },
  "gummy-shark":           { vic_coast:[null,"good","good","good","peak","good","fair","fair","fair","good","good","good","good"], tas:[null,"good","good","good","peak","good","fair","fair","fair","good","good","good","good"], nsw:[null,"fair","fair","good","peak","good","fair","fair","fair","good","good","fair","fair"] },
  "blue-eye-trevalla":     { vic_coast:[null,"good","fair","good","peak","peak","good","good","good","good","fair","fair","good"], tas:[null,"good","fair","good","peak","peak","good","good","good","good","fair","fair","good"], nsw:[null,"fair","fair","good","peak","peak","good","good","fair","fair","fair","fair","fair"] },
  "striped-trumpeter":     { tas:[null,"good","good","fair","peak","peak","peak","peak","good","good","good","good","good"], vic_coast:[null,"fair","fair","fair","good","peak","peak","good","good","fair","fair","fair","fair"] },
  "murray-cod":            { murray_darling:[null,"good","good","good","fair","fair","poor","poor","fair","good","peak","peak","good"], alpine:[null,"fair","fair","good","fair","poor","poor","poor","fair","good","peak","good","fair"] },
  "golden-perch":          { murray_darling:[null,"good","fair","fair","fair","poor","poor","poor","fair","good","peak","peak","good"], alpine:[null,"fair","fair","fair","fair","poor","poor","poor","fair","good","peak","good","fair"] },
  "silver-perch":          { murray_darling:[null,"fair","fair","fair","fair","poor","poor","poor","fair","good","peak","good","fair"] },
  "australian-bass":       { southeast_qld:[null,"good","good","fair","fair","poor","poor","poor","fair","good","peak","peak","good"], nsw:[null,"good","good","fair","fair","poor","poor","poor","fair","good","peak","peak","good"] },
  "brown-trout":           { alpine:[null,"fair","fair","good","peak","peak","fair","poor","poor","good","peak","peak","good"], murray_darling:[null,"fair","fair","good","peak","good","fair","poor","poor","good","peak","good","fair"], tas:[null,"fair","good","good","peak","peak","good","fair","fair","good","peak","peak","fair"] },
  "rainbow-trout":         { alpine:[null,"fair","good","good","peak","peak","good","fair","poor","good","peak","peak","good"], murray_darling:[null,"fair","good","good","peak","good","fair","poor","poor","good","peak","good","fair"], tas:[null,"good","good","good","peak","peak","good","fair","fair","good","peak","peak","good"] },
  "ocean-trout":           { tas:[null,"good","good","peak","peak","good","fair","fair","good","peak","peak","good","good"], alpine:[null,"good","good","good","peak","peak","good","fair","fair","peak","peak","good","good"], vic_coast:[null,"fair","fair","good","peak","good","fair","fair","fair","good","good","fair","fair"], nsw:[null,"fair","fair","good","good","fair","fair","fair","fair","good","good","fair","fair"] },
  "redfin":                { murray_darling:[null,"good","good","fair","peak","peak","good","fair","fair","good","good","good","good"], alpine:[null,"good","good","fair","peak","peak","fair","fair","fair","good","good","good","good"], tas:[null,"good","good","fair","peak","peak","fair","fair","fair","good","good","good","good"], nsw:[null,"good","good","fair","peak","good","fair","fair","fair","good","good","good","good"] },
  "saratoga":              { far_north_qld:[null,"fair","fair","fair","good","peak","peak","peak","good","fair","fair","fair","fair"], central_qld:[null,"fair","fair","fair","fair","good","peak","good","fair","fair","fair","fair","fair"] },
  "catfish":               { murray_darling:[null,"good","good","fair","fair","fair","fair","fair","fair","good","peak","peak","good"], far_north_qld:[null,"good","good","fair","fair","good","good","good","good","good","good","good","good"], central_qld:[null,"fair","fair","fair","fair","good","good","good","good","fair","fair","good","fair"], southeast_qld:[null,"good","good","fair","fair","good","good","good","fair","fair","good","good","good"] },
};

export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (secret !== SECRET) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.TURSO_DATABASE_URL) {
    return Response.json({ error: "TURSO_DATABASE_URL not set" }, { status: 500 });
  }

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const now = new Date().toISOString();
  const CHUNK = 400;

  const insertBatch: { sql: string; args: [] }[] = [];

  for (const r of NEW_REGIONS) {
    const id = nanoid();
    insertBatch.push({ sql: `INSERT OR IGNORE INTO regions (id,slug,name,state,zone,description,latitude,longitude,tags,created_at) VALUES ('${id}','${esc(r.slug)}','${esc(r.name)}','${esc(r.state)}','${esc(r.zone)}','${esc(r.desc)}',${r.lat},${r.lon},NULL,'${now}')`, args: [] });
  }

  for (const s of NEW_SPECIES) {
    const id = nanoid();
    insertBatch.push({ sql: `INSERT OR IGNORE INTO species (id,slug,common_name,scientific_name,category,description,min_legal_size_mm,bag_limit,created_at) VALUES ('${id}','${esc(s.slug)}','${esc(s.commonName)}',${s.scientificName ? `'${esc(s.scientificName)}'` : "NULL"},'${esc(s.category)}','${esc(s.desc)}',${s.minSize ?? "NULL"},${s.bagLimit ?? "NULL"},'${now}')`, args: [] });
  }

  for (const t of NEW_TECHNIQUES) {
    const id = nanoid();
    insertBatch.push({ sql: `INSERT OR IGNORE INTO techniques (id,slug,name,description,category) VALUES ('${id}','${esc(t.slug)}','${esc(t.name)}','${esc(t.desc)}','${esc(t.category)}')`, args: [] });
  }

  for (let i = 0; i < insertBatch.length; i += CHUNK) {
    await client.batch(insertBatch.slice(i, i + CHUNK));
  }

  // Query all IDs
  const [allRegions, allSpecies, allTechniques] = await Promise.all([
    client.execute("SELECT id, slug, zone FROM regions"),
    client.execute("SELECT id, slug FROM species"),
    client.execute("SELECT id, slug FROM techniques"),
  ]);

  const speciesBySlug: Record<string, string> = {};
  const techniqueBySlug: Record<string, string> = {};
  const regionsByZone: Record<string, Array<{ id: string }>> = {};

  for (const row of allSpecies.rows) speciesBySlug[row.slug as string] = row.id as string;
  for (const row of allTechniques.rows) techniqueBySlug[row.slug as string] = row.id as string;
  for (const row of allRegions.rows) {
    const zone = row.zone as string;
    if (!regionsByZone[zone]) regionsByZone[zone] = [];
    regionsByZone[zone].push({ id: row.id as string });
  }

  // Season windows
  const swBatch: { sql: string; args: [] }[] = [];
  for (const [speciesSlug, zoneData] of Object.entries(SEASON_DATA)) {
    const speciesId = speciesBySlug[speciesSlug];
    if (!speciesId) continue;
    for (const [zone, ratings] of Object.entries(zoneData)) {
      const regionsInZone = regionsByZone[zone];
      if (!regionsInZone || !ratings) continue;
      for (const region of regionsInZone) {
        for (let month = 1; month <= 12; month++) {
          const rating = ratings[month];
          if (!rating) continue;
          swBatch.push({ sql: `INSERT OR IGNORE INTO season_windows (id,region_id,species_id,month,rating,notes) VALUES ('${nanoid()}','${region.id}','${speciesId}',${month},'${rating}',NULL)`, args: [] });
        }
      }
    }
  }

  for (let i = 0; i < swBatch.length; i += CHUNK) {
    await client.batch(swBatch.slice(i, i + CHUNK));
  }

  // Species-technique junctions
  const stBatch: { sql: string; args: [] }[] = [];
  for (const [speciesSlug, techSlugs] of Object.entries(NEW_SPECIES_TECHNIQUES)) {
    const speciesId = speciesBySlug[speciesSlug];
    if (!speciesId) continue;
    for (const techSlug of techSlugs) {
      const techId = techniqueBySlug[techSlug];
      if (!techId) continue;
      stBatch.push({ sql: `INSERT OR IGNORE INTO species_techniques (species_id,technique_id,effectiveness,notes) VALUES ('${speciesId}','${techId}',NULL,NULL)`, args: [] });
    }
  }
  if (stBatch.length > 0) await client.batch(stBatch);

  return Response.json({
    ok: true,
    regionsInserted: NEW_REGIONS.length,
    speciesInserted: NEW_SPECIES.length,
    techniquesInserted: NEW_TECHNIQUES.length,
    seasonWindowsGenerated: swBatch.length,
  });
}
