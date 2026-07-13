// Narrative content for the /campaign/[species] scrollytelling pages.
// Structural mirror of the GT chapter format proven on the homepage
// (src/app/HomeStoryClient.tsx), generalized so SpeciesStoryClient can
// render any of the 5 species below from data instead of hardcoded JSX.

import { getSpeciesImage } from "@/lib/images";

// Same helper as src/lib/images.ts — reused directly here rather than
// exported from there, since these are just plain category/mood photos
// (not species-specific overrides) already verified live on the site.
const px = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
const OCEAN_BLUE = px(1680779);   // deep open ocean — used for marlin/pelagics site-wide
const OCEAN_ACTIVE = px(994605);  // offshore fishing boat action — used for yellowfin site-wide
const REEF_TROPICAL = px(1591938); // coral reef underwater
const REEF_FISH = px(2156311);    // colourful tropical reef fish
const ESTUARY_TROPICAL = px(3048522); // tropical mangrove/estuary creek — used for barramundi site-wide

export type ChapterMedia =
  | { type: "video"; slug: string; alt: string; dir?: string; poster?: string }
  | { type: "photo"; src: string; alt: string };

export interface TechStep {
  title: string;
  body: string;
}

export interface SpeciesFact {
  label: string;
  value: string;
  /** 12 booleans, Jan..Dec — when present, this fact renders as an expandable
   *  month-bar chart (only the first fact in ch2.facts should set this). */
  peakMonths?: boolean[];
}

export interface ChecklistItem {
  label: string;
  done: boolean;
}

export interface SpeciesStory {
  speciesSlug: string;
  experienceSlug: string | null;
  commonName: string;
  scientificName: string;
  chapterLabels: [string, string, string, string, string, string, string, string];

  ch1: {
    heroMedia: ChapterMedia;
    titleLines: [string, string];
    body: string;
    trophyStat: string;
    trophyLocation: string;
    trophyTime: string;
    scrollCue: string;
  };
  ch2: {
    bgMedia: ChapterMedia;
    caption: [string, string];
    titleLines: [string, string];
    body: string;
    facts: [SpeciesFact, SpeciesFact, SpeciesFact, SpeciesFact];
  };
  ch3: {
    bgMedia: ChapterMedia;
    caption: [string, string];
    titleLines: [string, string];
    body: string;
    steps: [TechStep, TechStep, TechStep];
    gearTag: string;
  };
  ch4: {
    bgMedia: ChapterMedia;
    caption: [string, string];
    titleLines: [string, string];
    body: string;
  };
  ch5: {
    bgMedia: ChapterMedia;
    caption: [string, string];
    titleLines: [string, string];
    body: string;
    crewNote: string;
    challengeSlug: string | null;
  };
  ch6: {
    bgMedia: ChapterMedia;
    caption: [string, string];
    titleLines: [string, string];
    countdownDays: number;
    body: string;
    checklist: [ChecklistItem, ChecklistItem, ChecklistItem, ChecklistItem];
  };
  ch7: {
    bgMedia: ChapterMedia;
    words: { text: string; accent?: boolean; breakAfter?: 1 | 2 }[];
  };
  ch8: {
    bgMedia: ChapterMedia;
    askTitleLines: [string, string];
    ctaNote: string;
  };
}

const GT_PIVOT = [
  { text: "That" }, { text: "was" }, { text: "someone's", accent: true }, { text: "trip.", breakAfter: 1 as const },
];

export const SPECIES_STORIES: SpeciesStory[] = [
  // ── GIANT TREVALLY ──────────────────────────────────────────────────────────
  {
    speciesSlug: "giant-trevally",
    experienceSlug: "topwater-gt",
    commonName: "Giant Trevally",
    scientificName: "Caranx ignobilis",
    chapterLabels: ["Trophy", "Species", "Technique", "Region", "Crew", "Countdown", "Chapter 2", "Plan"],
    ch1: {
      heroMedia: { type: "video", slug: "trophy-gt", dir: "/home", poster: "/home/trophy-gt.png", alt: "Angler holding a 112cm giant trevally caught at Ningaloo Reef" },
      titleLines: ["The one you'll", "tell people about."],
      body: "A GT like this doesn't happen by accident. It happens because someone picked the right species, the right reef, the right tide — and did the work to be standing there, popper in hand, when it counted.",
      trophyStat: "112cm Giant Trevally",
      trophyLocation: "Ningaloo Reef, WA",
      trophyTime: "5:52am · Outgoing tide, first light",
      scrollCue: "Where it starts",
    },
    ch2: {
      bgMedia: { type: "video", slug: "bg-wild", alt: "Open reef water, the kind of ground GT patrol" },
      caption: ["THE WATER", "REEF EDGE"],
      titleLines: ["Know what", "you're chasing."],
      body: "Before anyone plans a trip, they learn the fish. GT aren't caught by luck — they're caught by anglers who understand exactly which reef edge, which tide, and which thirty-minute window actually matters.",
      facts: [
        { label: "Peak season", value: "July — WA, NT, QLD reef edges", peakMonths: [false, false, false, false, false, false, true, false, false, false, false, false] },
        { label: "Best tide", value: "Outgoing, high slack" },
        { label: "Time of day", value: "Dawn only" },
        { label: "Structure", value: "Reef edges, bomboras" },
      ],
    },
    ch3: {
      bgMedia: { type: "video", slug: "bg-strike", alt: "The line going tight the moment a GT strikes" },
      caption: ["THE STRIKE", "LINE TIGHT"],
      titleLines: ["Learn the", "technique."],
      body: "Research becomes skill. This is where the fish stops being an idea and starts being something you know how to actually catch.",
      steps: [
        { title: "Short, violent retrieves.", body: "Work large cup-face poppers hard and fast over the reef edge — GT respond to aggression, not finesse." },
        { title: "Strike on the first explosion.", body: "Don't work the lure back to the boat waiting for a second hit. Set hard the moment it blows up." },
        { title: "Maximum drag, immediately.", body: "A GT will run straight for the reef and cut you off in seconds. Pressure starts on the strike, not after." },
      ],
      gearTag: "🎣 Size 8000+ sealed-drag reel, 100lb+ fluoro leader — non-negotiable for reef GT",
    },
    ch4: {
      bgMedia: { type: "video", slug: "bg-itch-office", alt: "Coral reef seen underwater, the kind of ground worth choosing" },
      caption: ["THE REEF", "PICK YOUR SPOT"],
      titleLines: ["Pick your", "water."],
      body: "Same species, completely different water depending on where you go. Here's where the bite is best right now.",
    },
    ch5: {
      bgMedia: { type: "video", slug: "bg-dawn-drive", alt: "A small boat sitting calm on the water, the last quiet moment before the trip" },
      caption: ["THE DRIVE", "4:12 AM"],
      titleLines: ["Get the", "crew together."],
      body: "Nobody plans a trip like this alone. This is the part where it becomes real — texts sent, mates confirmed, a weekend actually locked in.",
      crewNote: "Macca and Dools are in; the third is out practising popper technique off the local rocks.",
      challengeSlug: "3-meter-flatty",
    },
    ch6: {
      bgMedia: { type: "video", slug: "bg-dawn-detail", alt: "Tackle laid out and packed, ready to go" },
      caption: ["READY TO GO", "T-MINUS 6 DAYS"],
      titleLines: ["The days", "before."],
      countdownDays: 6,
      body: "Gear checked. Bags packed. The last few things that matter before you leave.",
      checklist: [
        { label: "8000+ reel, sealed drag serviced — checked", done: true },
        { label: "Poppers and 100lb fluoro leader — checked", done: true },
        { label: "Tide charts for the week — pending", done: false },
        { label: "Crew confirmed on dates — pending", done: false },
      ],
    },
    ch7: {
      bgMedia: { type: "video", slug: "bg-after-fire", alt: "Fire going after the trip, the story already getting bigger" },
      words: [
        ...GT_PIVOT,
        { text: "Every" }, { text: "part" }, { text: "of" }, { text: "it" }, { text: "—" }, { text: "the" },
        { text: "fish," }, { text: "the" }, { text: "water," }, { text: "the" }, { text: "mates," }, { text: "the" },
        { text: "six" }, { text: "days" }, { text: "of" }, { text: "waiting" }, { text: "—" }, { text: "started" },
        { text: "the" }, { text: "same" }, { text: "way" }, { text: "yours" }, { text: "can.", breakAfter: 2 },
        { text: "How", accent: true }, { text: "will", accent: true }, { text: "you", accent: true },
        { text: "write", accent: true }, { text: "chapter", accent: true }, { text: "2?", accent: true },
      ],
    },
    ch8: {
      bgMedia: { type: "video", slug: "bg-cta", alt: "Clear water, boat idling, ready for the next trip" },
      askTitleLines: ["Your trophy fish", "is still out there."],
      ctaNote: "No account required · Save your plan when you're ready",
    },
  },

  // ── YELLOWFIN TUNA ──────────────────────────────────────────────────────────
  {
    speciesSlug: "yellowfin-tuna",
    experienceSlug: "yellowfin-offshore",
    commonName: "Yellowfin Tuna",
    scientificName: "Thunnus albacares",
    chapterLabels: ["Trophy", "Species", "Technique", "Region", "Crew", "Countdown", "Chapter 2", "Plan"],
    ch1: {
      heroMedia: { type: "photo", src: `${getSpeciesImage("yellowfin-tuna", "pelagic", 1200)}`, alt: "Angler with a yellowfin tuna caught trolling off the temperature break" },
      titleLines: ["The one that", "bent the rod in half."],
      body: "A yellowfin like this doesn't happen by accident. It happens because someone read the sounder for the temperature break, ran the boat to where the birds were working, and had thirty kilos of drag ready before the reel ever screamed.",
      trophyStat: "41kg Yellowfin Tuna",
      trophyLocation: "Port Stephens Canyon, NSW",
      trophyTime: "5:15am · Glass-out, birds working bait",
      scrollCue: "Where it starts",
    },
    ch2: {
      bgMedia: { type: "photo", src: `${OCEAN_ACTIVE}`, alt: "Open blue water where yellowfin tuna school around current lines" },
      caption: ["THE WATER", "BLUE WATER"],
      titleLines: ["Know what", "you're chasing."],
      body: "Hard-fighting, blue-water, and they don't sit still — you find yellowfin by finding the conditions, not the spot.",
      facts: [
        { label: "Peak season", value: "Jan–Feb & Oct–Dec — NSW canyons, WA, Christmas & Cocos Is.", peakMonths: [true, true, false, false, false, false, false, false, false, true, true, true] },
        { label: "Best conditions", value: "26°C isotherm, blue-to-green colour change" },
        { label: "Time of day", value: "Dawn through mid-morning" },
        { label: "Structure", value: "FADs, temperature breaks, current lines" },
      ],
    },
    ch3: {
      bgMedia: { type: "photo", src: `${OCEAN_ACTIVE}`, alt: "A trolled lure working the surface near a temperature break" },
      caption: ["THE STRIKE", "LINE TIGHT"],
      titleLines: ["Learn the", "technique."],
      body: "Research becomes skill. This is where the fish stops being an idea and starts being something you know how to actually catch.",
      steps: [
        { title: "Troll the temp break, not the middle of nowhere.", body: "Work skirted lures along the colour change where bait actually stacks up." },
        { title: "When the birds work, kill the engine.", body: "A diving flock means tuna are balling bait at the surface — cast metal slices or poppers straight into the wash." },
        { title: "Set the drag light, then hang on.", body: "Around 30% of breaking strain — yellowfin run hard and deep on the first burst, and over-tightening on the strike snaps leaders instantly." },
      ],
      gearTag: "🎣 PE4–8 spin or 20–30lb overhead, 60–100lb fluoro leader — enough runway for the first dive",
    },
    ch4: {
      bgMedia: { type: "photo", src: `${OCEAN_BLUE}`, alt: "Offshore canyon water, the kind of ground yellowfin patrol" },
      caption: ["THE CANYONS", "PICK YOUR SPOT"],
      titleLines: ["Pick your", "water."],
      body: "Same species, completely different water depending on where you go. Here's where the bite is best right now.",
    },
    ch5: {
      bgMedia: { type: "photo", src: `${OCEAN_ACTIVE}`, alt: "Boat heading offshore before dawn" },
      caption: ["THE RUN", "BEFORE DAWN"],
      titleLines: ["Get the", "crew together."],
      body: "A tuna morning needs a spotter as much as an angler — someone runs the boat and reads the sounder, someone else calls the birds.",
      crewNote: "Skipper's in, already checked the swell forecast. Deckie's in, sharpening every hook in the box. Still working out who's on burley duty.",
      challengeSlug: null,
    },
    ch6: {
      bgMedia: { type: "photo", src: `${OCEAN_BLUE}`, alt: "Tackle and lures packed and ready" },
      caption: ["READY TO GO", "T-MINUS 6 DAYS"],
      titleLines: ["The days", "before."],
      countdownDays: 6,
      body: "Gear checked. Bags packed. The last few things that matter before you leave.",
      checklist: [
        { label: "Overhead reel drag serviced, 50–80lb braid spooled — checked", done: true },
        { label: "Skirted lures and spare leader stocked — checked", done: true },
        { label: "Ice/kill bags sorted for the esky — pending", done: false },
        { label: "Crew confirmed on the weather window — pending", done: false },
      ],
    },
    ch7: {
      bgMedia: { type: "photo", src: `${OCEAN_BLUE}`, alt: "Sunset over open ocean after a day offshore" },
      words: [
        { text: "That" }, { text: "was" }, { text: "someone's", accent: true }, { text: "trip.", breakAfter: 1 },
        { text: "Every" }, { text: "part" }, { text: "of" }, { text: "it" }, { text: "—" }, { text: "the" },
        { text: "birds" }, { text: "working," }, { text: "the" }, { text: "drag" }, { text: "screaming," }, { text: "the" },
        { text: "six-hour" }, { text: "run" }, { text: "to" }, { text: "find" }, { text: "the" }, { text: "break" }, { text: "—" },
        { text: "started" }, { text: "the" }, { text: "same" }, { text: "way" }, { text: "yours" }, { text: "can.", breakAfter: 2 },
        { text: "How", accent: true }, { text: "will", accent: true }, { text: "you", accent: true },
        { text: "write", accent: true }, { text: "chapter", accent: true }, { text: "2?", accent: true },
      ],
    },
    ch8: {
      bgMedia: { type: "photo", src: `${OCEAN_ACTIVE}`, alt: "Open ocean, clear water, ready for the next trip" },
      askTitleLines: ["Your yellowfin", "is still out there."],
      ctaNote: "No account required · Save your plan when you're ready",
    },
  },

  // ── BLUE MARLIN ─────────────────────────────────────────────────────────────
  {
    speciesSlug: "blue-marlin",
    experienceSlug: "marlin-trolling",
    commonName: "Blue Marlin",
    scientificName: "Makaira nigricans",
    chapterLabels: ["Trophy", "Species", "Technique", "Region", "Crew", "Countdown", "Chapter 2", "Plan"],
    ch1: {
      heroMedia: { type: "photo", src: `${getSpeciesImage("blue-marlin", "pelagic", 1200)}`, alt: "A blue marlin boat-side after a long fight on the troll" },
      titleLines: ["The one that", "pulled line all morning."],
      body: "A blue marlin like this doesn't happen by accident. Someone read the sounder for the colour change, ran the right spread, and had four hundred pounds of leader ready when the reel finally screamed.",
      trophyStat: "Est. 165kg Blue Marlin",
      trophyLocation: "Sydney Canyon, NSW",
      trophyTime: "6:40am · Glass-out, first troll pass",
      scrollCue: "Where it starts",
    },
    ch2: {
      bgMedia: { type: "photo", src: `${OCEAN_BLUE}`, alt: "Deep blue offshore water off the continental shelf" },
      caption: ["THE WATER", "SHELF EDGE"],
      titleLines: ["Know what", "you're chasing."],
      body: "Before anyone plans a trip, they learn the fish. Marlin aren't caught by luck — they're caught by anglers who read the sounder for the temperature line, not the chart.",
      facts: [
        { label: "Peak season", value: "Feb–Mar — Sydney, Port Stephens, Eden, Lord Howe Is.", peakMonths: [false, true, true, false, false, false, false, false, false, false, false, false] },
        { label: "Best conditions", value: "26°C isotherm, blue-to-green colour break" },
        { label: "Time of day", value: "Mid-morning through afternoon" },
        { label: "Structure", value: "Continental shelf edge, canyons, temp breaks" },
      ],
    },
    ch3: {
      bgMedia: { type: "photo", src: `${OCEAN_BLUE}`, alt: "A trolling spread working behind a game-fishing boat" },
      caption: ["THE STRIKE", "SPREAD UP"],
      titleLines: ["Learn the", "technique."],
      body: "Research becomes skill. This is where the fish stops being an idea and starts being something you know how to actually catch.",
      steps: [
        { title: "Run a five-lure spread, not a random one.", body: "Two short corners, two long riggers, one straight-back teaser pulling fish into the strike zone." },
        { title: "Troll the colour change, not the chart.", body: "Marlin sit on the temperature line and the blue-to-green edge; find it on the sounder before you find it on the map." },
        { title: "Ease off when it sounds, lean on it when it surfaces.", body: "A marlin fight is give and take — over-pressuring a tired fish boat-side is where tackle snaps, not out wide." },
      ],
      gearTag: "🎣 50W overhead lever-drag, 200–400lb leader — nothing lighter survives the first run",
    },
    ch4: {
      bgMedia: { type: "photo", src: `${OCEAN_BLUE}`, alt: "Continental shelf-edge canyon water" },
      caption: ["THE CANYONS", "PICK YOUR SPOT"],
      titleLines: ["Pick your", "water."],
      body: "Same species, completely different water depending on where you go. Here's where the bite is best right now.",
    },
    ch5: {
      bgMedia: { type: "photo", src: `${OCEAN_ACTIVE}`, alt: "Game-fishing boat outriggers set for a trolling spread" },
      caption: ["THE SPREAD", "RIGGED"],
      titleLines: ["Get the", "crew together."],
      body: "A marlin spread needs more hands than one — someone on the teaser, someone on the corners, someone calling colour off the sounder.",
      crewNote: "Skipper's in, spread rigged the night before. Wireman's in, gloves already in the tackle bag. Still deciding who calls the leader on the double.",
      challengeSlug: null,
    },
    ch6: {
      bgMedia: { type: "photo", src: `${OCEAN_BLUE}`, alt: "Heavy tackle and leader material packed and ready" },
      caption: ["READY TO GO", "T-MINUS 6 DAYS"],
      titleLines: ["The days", "before."],
      countdownDays: 6,
      body: "Gear checked. Bags packed. The last few things that matter before you leave.",
      checklist: [
        { label: "50W overheads serviced, drags checked at strike setting — checked", done: true },
        { label: "Leader material and crimps restocked — checked", done: true },
        { label: "Spread rigged the night before — pending", done: false },
        { label: "Crew confirmed on the weather window — pending", done: false },
      ],
    },
    ch7: {
      bgMedia: { type: "photo", src: `${OCEAN_BLUE}`, alt: "Sunset over the continental shelf after a day trolling" },
      words: [
        { text: "That" }, { text: "was" }, { text: "someone's", accent: true }, { text: "trip.", breakAfter: 1 },
        { text: "Every" }, { text: "part" }, { text: "of" }, { text: "it" }, { text: "—" }, { text: "the" },
        { text: "spread" }, { text: "out" }, { text: "the" }, { text: "back," }, { text: "the" }, { text: "colour" },
        { text: "change," }, { text: "the" }, { text: "six-hour" }, { text: "run" }, { text: "to" }, { text: "the" },
        { text: "shelf" }, { text: "edge" }, { text: "—" }, { text: "started" }, { text: "the" }, { text: "same" },
        { text: "way" }, { text: "yours" }, { text: "can.", breakAfter: 2 },
        { text: "How", accent: true }, { text: "will", accent: true }, { text: "you", accent: true },
        { text: "write", accent: true }, { text: "chapter", accent: true }, { text: "2?", accent: true },
      ],
    },
    ch8: {
      bgMedia: { type: "photo", src: `${OCEAN_BLUE}`, alt: "Open blue water, boat idling, ready for the next trip" },
      askTitleLines: ["Your blue marlin", "is still out there."],
      ctaNote: "No account required · Save your plan when you're ready",
    },
  },

  // ── DOGTOOTH TUNA ───────────────────────────────────────────────────────────
  {
    speciesSlug: "dogtooth-tuna",
    experienceSlug: "dogtooth-jigging",
    commonName: "Dogtooth Tuna",
    scientificName: "Gymnosarda unicolor",
    chapterLabels: ["Trophy", "Species", "Technique", "Region", "Crew", "Countdown", "Chapter 2", "Plan"],
    ch1: {
      heroMedia: { type: "photo", src: `${getSpeciesImage("dogtooth-tuna", "reef", 1200)}`, alt: "A dogtooth tuna boated after a jigging drop over reef structure" },
      titleLines: ["The one that", "nearly spooled you."],
      body: "A dogtooth like this doesn't happen by accident. Someone found the right pinnacle, dropped a jig to the exact depth the sounder marked, and had the reel loaded before it ever hit bottom.",
      trophyStat: "38kg Dogtooth Tuna",
      trophyLocation: "Osprey Reef, Coral Sea",
      trophyTime: "10:20am · Slack high over the drop-off",
      scrollCue: "Where it starts",
    },
    ch2: {
      bgMedia: { type: "photo", src: `${REEF_TROPICAL}`, alt: "Clear tropical reef water over a deep drop-off" },
      caption: ["THE WATER", "THE DROP-OFF"],
      titleLines: ["Know what", "you're chasing."],
      body: "Before anyone plans a trip, they learn the fish. Unlike its open-water cousins, a dogtooth doesn't roam blue water — it holds tight to structure, which means the mark matters more than the day.",
      facts: [
        { label: "Peak season", value: "Year-round — best in calmer dry-season weather" },
        { label: "Best tide", value: "Slack water, top and bottom of tide" },
        { label: "Time of day", value: "Mid-morning to afternoon" },
        { label: "Structure", value: "Deep reef drop-offs, current-swept pinnacles" },
      ],
    },
    ch3: {
      bgMedia: { type: "photo", src: `${REEF_FISH}`, alt: "A jig worked over deep reef structure" },
      caption: ["THE DROP", "LOCKED UP"],
      titleLines: ["Learn the", "technique."],
      body: "Research becomes skill. This is where the fish stops being an idea and starts being something you know how to actually catch.",
      steps: [
        { title: "Drop fast, work faster.", body: "Get a jig to the bottom of the mark before the school moves off, then rip it back in short, violent strokes." },
        { title: "Lock up on the take, not after.", body: "A dogtooth's first move is straight back to the reef — there's no time to wind down slack once it eats." },
        { title: "Win the fight in the first ten seconds.", body: "Maximum drag from the strike, rod low, everything you can hold; anything less and you're cut off on coral before the fish even shows itself." },
      ],
      gearTag: "🎣 PE5–8 jigging outfit, heavy-duty assist hooks, 100lb+ leader — reef structure gives you no second chances",
    },
    ch4: {
      bgMedia: { type: "photo", src: `${REEF_TROPICAL}`, alt: "Remote coral reef pinnacle seen from the water" },
      caption: ["THE REEF", "PICK YOUR SPOT"],
      titleLines: ["Pick your", "water."],
      body: "Same species, completely different water depending on where you go. Here's where the bite is best right now.",
    },
    ch5: {
      bgMedia: { type: "photo", src: `${REEF_FISH}`, alt: "Live-aboard boat anchored near remote reef structure" },
      caption: ["THE CHARTER", "LIVE-ABOARD"],
      titleLines: ["Get the", "crew together."],
      body: "Live-aboard trips to reef structure like this mean a small, committed crew — everyone on jigs, everyone taking turns on the sounder.",
      crewNote: "Two crew confirmed, gear already packed. Still finalising the live-aboard dates with the third.",
      challengeSlug: null,
    },
    ch6: {
      bgMedia: { type: "photo", src: `${REEF_TROPICAL}`, alt: "Jigging tackle spooled and packed" },
      caption: ["READY TO GO", "T-MINUS 6 DAYS"],
      titleLines: ["The days", "before."],
      countdownDays: 6,
      body: "Gear checked. Bags packed. The last few things that matter before you leave.",
      checklist: [
        { label: "Jigging outfits spooled, assist hooks checked — checked", done: true },
        { label: "Spare jigs in 2–3 weights packed — checked", done: true },
        { label: "Live-aboard dates confirmed — pending", done: false },
        { label: "Crew confirmed on the charter — pending", done: false },
      ],
    },
    ch7: {
      bgMedia: { type: "photo", src: `${REEF_TROPICAL}`, alt: "Remote reef water at last light" },
      words: [
        { text: "That" }, { text: "was" }, { text: "someone's", accent: true }, { text: "trip.", breakAfter: 1 },
        { text: "Every" }, { text: "part" }, { text: "of" }, { text: "it" }, { text: "—" }, { text: "the" },
        { text: "drop," }, { text: "the" }, { text: "lock-up," }, { text: "the" }, { text: "first" }, { text: "run" },
        { text: "straight" }, { text: "for" }, { text: "the" }, { text: "reef" }, { text: "—" }, { text: "started" },
        { text: "the" }, { text: "same" }, { text: "way" }, { text: "yours" }, { text: "can.", breakAfter: 2 },
        { text: "How", accent: true }, { text: "will", accent: true }, { text: "you", accent: true },
        { text: "write", accent: true }, { text: "chapter", accent: true }, { text: "2?", accent: true },
      ],
    },
    ch8: {
      bgMedia: { type: "photo", src: `${REEF_FISH}`, alt: "Remote reef water, boat idling, ready for the next trip" },
      askTitleLines: ["Your dogtooth", "is still out there."],
      ctaNote: "No account required · Save your plan when you're ready",
    },
  },

  // ── BARRAMUNDI ──────────────────────────────────────────────────────────────
  {
    speciesSlug: "barramundi",
    experienceSlug: "barramundi-estuary",
    commonName: "Barramundi",
    scientificName: "Lates calcarifer",
    chapterLabels: ["Trophy", "Species", "Technique", "Region", "Crew", "Countdown", "Chapter 2", "Plan"],
    ch1: {
      heroMedia: { type: "photo", src: `${getSpeciesImage("barramundi", "estuary", 1200)}`, alt: "Angler holding a barramundi caught casting to mangrove structure" },
      titleLines: ["The one that came", "out of the roots sideways."],
      body: "A barra like this doesn't happen by accident. Someone found the right drain on the run-out, cast tight enough to the mangroves to risk losing a lure, and didn't flinch when it ate.",
      trophyStat: "98cm Barramundi",
      trophyLocation: "Daly River, NT",
      trophyTime: "5:40pm · Run-out tide, last light",
      scrollCue: "Where it starts",
    },
    ch2: {
      bgMedia: { type: "photo", src: `${ESTUARY_TROPICAL}`, alt: "Mangrove-lined tidal river, the kind of water barra ambush from" },
      caption: ["THE WATER", "THE DRAIN"],
      titleLines: ["Know what", "you're chasing."],
      body: "Before anyone plans a trip, they learn the fish. Barra aren't caught by luck — they're caught by anglers who understand exactly which drain, which tide, and which thirty-minute window actually matters.",
      facts: [
        { label: "Peak season", value: "Oct–Mar — NT Top End & Gulf, WA Kimberley", peakMonths: [true, true, true, false, false, false, false, false, false, true, true, true] },
        { label: "Best tide", value: "Last two hours of the run-out" },
        { label: "Time of day", value: "Dawn and dusk" },
        { label: "Structure", value: "Mangrove roots, snags, creek mouths" },
      ],
    },
    ch3: {
      bgMedia: { type: "photo", src: `${ESTUARY_TROPICAL}`, alt: "A lure cast tight to mangrove roots" },
      caption: ["THE CAST", "TIGHT TO STRUCTURE"],
      titleLines: ["Learn the", "technique."],
      body: "Research becomes skill. This is where the fish stops being an idea and starts being something you know how to actually catch.",
      steps: [
        { title: "Cast tight enough to risk it.", body: "Land the lure within 30cm of the roots — barra won't move far to chase, they ambush from the shadow line." },
        { title: "Match the light to the lure.", body: "Surface poppers and walk-the-dog sticks at dawn and dusk, sub-surface vibes and jerkbaits once the sun's up." },
        { title: "Work the drains on the run-out.", body: "The last two hours of a falling tide flush bait past every creek mouth, and that's when the biggest fish move up to feed." },
      ],
      gearTag: "🎣 PE2–3 baitcaster, 30–50lb fluoro leader — enough to turn a fish before it reaches the roots",
    },
    ch4: {
      bgMedia: { type: "photo", src: `${ESTUARY_TROPICAL}`, alt: "Tidal creek mouth flanked by mangroves" },
      caption: ["THE RIVER", "PICK YOUR SPOT"],
      titleLines: ["Pick your", "water."],
      body: "Same species, completely different water depending on where you go. Here's where the bite is best right now.",
    },
    ch5: {
      bgMedia: { type: "photo", src: `${ESTUARY_TROPICAL}`, alt: "Small boat working a tidal river at dusk" },
      caption: ["THE SESSION", "LAST LIGHT"],
      titleLines: ["Get the", "crew together."],
      body: "Barra trips run small and technical — everyone casting to their own snag, no one crowding the good drains.",
      crewNote: "Two mates confirmed, tackle boxes already restocked. Still locking in who's driving the tinny.",
      challengeSlug: null,
    },
    ch6: {
      bgMedia: { type: "photo", src: `${ESTUARY_TROPICAL}`, alt: "Hard-body lures and leader packed and ready" },
      caption: ["READY TO GO", "T-MINUS 6 DAYS"],
      titleLines: ["The days", "before."],
      countdownDays: 6,
      body: "Gear checked. Bags packed. The last few things that matter before you leave.",
      checklist: [
        { label: "Hard-body and soft-plastic tackle box restocked — checked", done: true },
        { label: "Leader retied, tide charts printed — checked", done: true },
        { label: "Crew confirmed on dates — pending", done: false },
        { label: "Boat/charter booking confirmed — pending", done: false },
      ],
    },
    ch7: {
      bgMedia: { type: "photo", src: `${ESTUARY_TROPICAL}`, alt: "Tidal river at last light" },
      words: [
        { text: "That" }, { text: "was" }, { text: "someone's", accent: true }, { text: "trip.", breakAfter: 1 },
        { text: "Every" }, { text: "part" }, { text: "of" }, { text: "it" }, { text: "—" }, { text: "the" },
        { text: "cast" }, { text: "to" }, { text: "the" }, { text: "roots," }, { text: "the" }, { text: "last" },
        { text: "light," }, { text: "the" }, { text: "six" }, { text: "days" }, { text: "of" }, { text: "waiting" },
        { text: "for" }, { text: "the" }, { text: "run-out" }, { text: "—" }, { text: "started" }, { text: "the" },
        { text: "same" }, { text: "way" }, { text: "yours" }, { text: "can.", breakAfter: 2 },
        { text: "How", accent: true }, { text: "will", accent: true }, { text: "you", accent: true },
        { text: "write", accent: true }, { text: "chapter", accent: true }, { text: "2?", accent: true },
      ],
    },
    ch8: {
      bgMedia: { type: "photo", src: `${ESTUARY_TROPICAL}`, alt: "Tidal river, boat idling, ready for the next trip" },
      askTitleLines: ["Your barra", "is still out there."],
      ctaNote: "No account required · Save your plan when you're ready",
    },
  },
];

export function getSpeciesStory(speciesSlug: string): SpeciesStory | null {
  return SPECIES_STORIES.find((s) => s.speciesSlug === speciesSlug) ?? null;
}
