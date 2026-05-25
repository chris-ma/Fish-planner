export type DestinationSeed = {
  slug: string;
  name: string;
  regionSlug: string;
  description: string;
};

export const DESTINATIONS: DestinationSeed[] = [
  // NZ North Island — Bay of Islands
  { slug: "bay-of-islands--cape-brett", name: "Cape Brett", regionSlug: "bay-of-islands", description: "Dramatic headland with strong currents that concentrate baitfish and trophy yellowtail kingfish. Marlin trolling grounds close by." },
  { slug: "bay-of-islands--poor-knights-islands", name: "Poor Knights Islands", regionSlug: "bay-of-islands", description: "World-class marine reserve with exceptional kingfish, snapper, and hapuku. Dive and fish the seamount drop-offs and arches." },
  { slug: "bay-of-islands--deep-water-cove", name: "Deep Water Cove", regionSlug: "bay-of-islands", description: "Sheltered cove on the outer bay with snapper, kingfish, and kahawai. Good anchoring grounds for live-bait fishing." },
  { slug: "bay-of-islands--cavalli-islands", name: "Cavalli Islands", regionSlug: "bay-of-islands", description: "Offshore islands north of the Bay. Trophy marlin water in summer with big yellowfin tuna and Spanish mackerel." },

  // NZ North Island — Auckland / Hauraki Gulf
  { slug: "auckland-hauraki-gulf--little-barrier-island", name: "Little Barrier Island (Hauturu)", regionSlug: "auckland-hauraki-gulf", description: "Protected island with excellent kingfish over the rocky drop-offs. Big snapper on the north face. Diving and fishing in pristine waters." },
  { slug: "auckland-hauraki-gulf--hen-chicken-islands", name: "Hen & Chicken Islands", regionSlug: "auckland-hauraki-gulf", description: "Productive reefs north of Whangarei with snapper, kingfish, and trevally. Excellent jigging for kings in the channels between islands." },
  { slug: "auckland-hauraki-gulf--mokohinau-islands", name: "Mokohinau Islands", regionSlug: "auckland-hauraki-gulf", description: "Remote outer-gulf islands with big kingfish, snapper, and hapuku. Trolling for yellowfin tuna in summer around the lighthouse point." },
  { slug: "auckland-hauraki-gulf--leigh-coastline", name: "Leigh Coastline", regionSlug: "auckland-hauraki-gulf", description: "Productive northeast coast adjacent to the Goat Island marine reserve. Snapper gather in numbers due to spillover effect." },
  { slug: "auckland-hauraki-gulf--waiheke-island-reefs", name: "Waiheke Island Reefs", regionSlug: "auckland-hauraki-gulf", description: "Inshore reefs around Waiheke hold resident snapper and trevally year-round. Accessible from Auckland for day trips." },

  // NZ North Island — Tauranga / Bay of Plenty
  { slug: "tauranga-bay-of-plenty--mayor-island", name: "Mayor Island (Tuhua)", regionSlug: "tauranga-bay-of-plenty", description: "World-famous for giant yellowtail kingfish. The volcanic island's steep drop-offs produce trophy kings year-round. Blue marlin out wide in summer." },
  { slug: "tauranga-bay-of-plenty--mount-maunganui-offshore", name: "Mount Maunganui Offshore", regionSlug: "tauranga-bay-of-plenty", description: "Reef systems off the Mount hold snapper and trevally. Yellowfin tuna aggregations appear in summer. Strong kingfish in season." },
  { slug: "tauranga-bay-of-plenty--opotiki-coast", name: "Opotiki Coast", regionSlug: "tauranga-bay-of-plenty", description: "Eastern Bay of Plenty coastline with excellent snapper and kahawai. Striped marlin in blue water during summer months." },
  { slug: "tauranga-bay-of-plenty--bowentown-entrance", name: "Bowentown / Waihi Entrance", regionSlug: "tauranga-bay-of-plenty", description: "Tauranga Harbour entrance with tidal rips that concentrate snapper, kahawai, and trevally. Popular land-based and boat spot." },

  // NZ North Island — Gisborne / East Cape
  { slug: "gisborne-east-cape--east-cape-lighthouse", name: "East Cape Lighthouse Grounds", regionSlug: "gisborne-east-cape", description: "The easternmost point in New Zealand. Deep water close to shore with snapper, kingfish, and marlin in blue water. Remote and uncrowded." },
  { slug: "gisborne-east-cape--tolaga-bay", name: "Tolaga Bay", regionSlug: "gisborne-east-cape", description: "Productive bay with good snapper on the inner reefs. Kahawai and trevally in the bay. Land-based fishing from the historic wharf." },
  { slug: "gisborne-east-cape--turanganui-river-mouth", name: "Tūranganui River Mouth", regionSlug: "gisborne-east-cape", description: "Gisborne's river mouth where estuary species meet ocean. Kahawai, trevally, and flounder in the shallows." },

  // NZ North Island — Napier / Hawke's Bay
  { slug: "napier-hawkes-bay--napier-port-offshore", name: "Napier Port Offshore Reefs", regionSlug: "napier-hawkes-bay", description: "Reef systems off Napier hold resident snapper and kingfish. Bluefin tuna visit the canyon grounds in summer." },
  { slug: "napier-hawkes-bay--pacific-bluefin-canyon", name: "Pacific Bluefin Canyon", regionSlug: "napier-hawkes-bay", description: "Offshore canyon system that attracts Pacific bluefin tuna in summer. A specialist big-game destination for experienced crews." },
  { slug: "napier-hawkes-bay--wairoa-river-mouth", name: "Wairoa River Mouth", regionSlug: "napier-hawkes-bay", description: "The Wairoa River estuary at the northern end of Hawke's Bay. Kahawai and trevally in the surf zone. Estuary flatfish." },

  // NZ North Island — Wellington / Cook Strait
  { slug: "wellington-cook-strait--cook-strait-rips", name: "Cook Strait Rips", regionSlug: "wellington-cook-strait", description: "The powerful tidal rips through Cook Strait concentrate baitfish and predators. Exceptional blue cod, tarakihi, and large snapper." },
  { slug: "wellington-cook-strait--kapiti-island", name: "Kāpiti Island", regionSlug: "wellington-cook-strait", description: "Marine reserve waters around Kāpiti hold large snapper and kahawai. Kingfish patrol the island's rocky edges in summer." },
  { slug: "wellington-cook-strait--palliser-bay", name: "Palliser Bay", regionSlug: "wellington-cook-strait", description: "Southern end of the North Island with hapuku and bluenose on the deep outer shelf. Blue cod fishing close inshore." },
  { slug: "wellington-cook-strait--pencarrow-head", name: "Pencarrow Head", regionSlug: "wellington-cook-strait", description: "Productive reef system at the entrance to Wellington Harbour. Strong tarakihi, snapper, and kahawai fishing." },

  // NZ South Island — Nelson / Tasman Bay
  { slug: "nelson-tasman--golden-bay-flats", name: "Golden Bay Flats", regionSlug: "nelson-tasman", description: "Remote northern flats with large snapper on shallow sandbanks. Blue cod in deeper channels. Accessible by boat from Takaka." },
  { slug: "nelson-tasman--d-urville-island", name: "D'Urville Island", regionSlug: "nelson-tasman", description: "Large island in the French Pass area with phenomenal tidal rips. Blue cod, hapuku, and snapper in the fierce current-swept channels." },
  { slug: "nelson-tasman--motueka-river", name: "Motueka River", regionSlug: "nelson-tasman", description: "Classic Nelson brown trout river with good salmon runs in autumn. Fly fishing through beautiful Tasman countryside." },
  { slug: "nelson-tasman--tasman-bay-reefs", name: "Tasman Bay Reefs", regionSlug: "nelson-tasman", description: "Mid-bay reef systems with snapper and blue cod. Sheltered year-round fishing for a wide range of species." },

  // NZ South Island — Marlborough Sounds
  { slug: "marlborough-sounds--queen-charlotte-sound", name: "Queen Charlotte Sound", regionSlug: "marlborough-sounds", description: "Sheltered sounds with superb blue cod on the bottom and snapper on the reef edges. Excellent year-round fishing in dramatic scenery." },
  { slug: "marlborough-sounds--pelorus-sound", name: "Pelorus Sound", regionSlug: "marlborough-sounds", description: "Long fjord-like sound with excellent blue cod, snapper, and kahawai. Kingfish enter the sound heads in summer." },
  { slug: "marlborough-sounds--outer-sounds-reefs", name: "Outer Sounds Reefs", regionSlug: "marlborough-sounds", description: "Exposed outer sound reefs with hapuku and bluenose in deep water. Kingfish on the rocky pinnacles in summer." },
  { slug: "marlborough-sounds--tory-channel", name: "Tory Channel", regionSlug: "marlborough-sounds", description: "Tidal rip channel connecting the sounds to Cook Strait. Strong blue cod and tarakihi fishing, particularly on the run-out tide." },

  // NZ South Island — Kaikōura
  { slug: "kaikoura--kaikoura-canyon-edge", name: "Kaikōura Canyon Edge", regionSlug: "kaikoura", description: "The deep submarine canyon rises close to shore. Hapuku (groper) and blue cod over rocky bottom. Spectacular mountain backdrop." },
  { slug: "kaikoura--south-bay-reefs", name: "South Bay Reefs", regionSlug: "kaikoura", description: "Sheltered reefs south of the peninsula with excellent blue cod and tarakihi. Kingfish visit in warmer months." },
  { slug: "kaikoura--kean-point", name: "Kean Point", regionSlug: "kaikoura", description: "Rocky headland with strong currents and blue cod feeding in the surge. Land-based rock fishing for blue moki and butterfish." },

  // NZ South Island — Christchurch / Canterbury
  { slug: "christchurch-canterbury--pegasus-bay", name: "Pegasus Bay", regionSlug: "christchurch-canterbury", description: "Wide bay north of Christchurch with blue cod, tarakihi, and snapper. Access from Motunau Beach for beach-launched boats." },
  { slug: "christchurch-canterbury--waimakariri-river", name: "Waimakariri River", regionSlug: "christchurch-canterbury", description: "World-class salmon runs in autumn. Brown trout in the upper reaches. Famous braided river system with multiple channels." },
  { slug: "christchurch-canterbury--rakaia-gorge", name: "Rakaia Gorge", regionSlug: "christchurch-canterbury", description: "Iconic salmon river with trophy chinook salmon in autumn. Brown trout year-round in the spectacular gorge setting." },

  // NZ South Island — Akaroa / Banks Peninsula
  { slug: "akaroa-banks-peninsula--akaroa-harbour", name: "Akaroa Harbour", regionSlug: "akaroa-banks-peninsula", description: "Extinct volcanic harbour with excellent blue cod and tarakihi. Snapper on the harbour entrance reefs. Unique enclosed-harbour fishing." },
  { slug: "akaroa-banks-peninsula--banks-peninsula-reefs", name: "Banks Peninsula Offshore Reefs", regionSlug: "akaroa-banks-peninsula", description: "Exposed outer shelf reefs with snapper, tarakihi, and blue cod. Accessible from Akaroa or Lyttelton in calm conditions." },
  { slug: "akaroa-banks-peninsula--lyttelton-harbour", name: "Lyttelton Harbour", regionSlug: "akaroa-banks-peninsula", description: "Port city harbour with year-round bream, flatfish, and blue cod. Boat ramp access for offshore reefs." },

  // NZ South Island — Queenstown / Fiordland
  { slug: "queenstown-fiordland--lake-wakatipu", name: "Lake Wakatipu", regionSlug: "queenstown-fiordland", description: "Large glacial lake near Queenstown with brown and rainbow trout. Famous for evening rise dry fly fishing on the delta areas." },
  { slug: "queenstown-fiordland--milford-sound", name: "Milford Sound", regionSlug: "queenstown-fiordland", description: "Spectacular fiord with hapuku, blue cod, and groper in deep water. Unique fiord fishing in one of the world's most beautiful settings." },
  { slug: "queenstown-fiordland--doubtful-sound", name: "Doubtful Sound", regionSlug: "queenstown-fiordland", description: "Remote fiord accessible by cruise or charter. Deep-water hapuku and blue cod. Sea-run brown trout in the freshwater river mouths." },
  { slug: "queenstown-fiordland--lake-wanaka", name: "Lake Wānaka", regionSlug: "queenstown-fiordland", description: "Alpine lake with excellent brown and rainbow trout. The Clutha River outlet holds fish year-round. Stunning mountain scenery." },

  // NZ South Island — Dunedin / Otago
  { slug: "dunedin-otago--otago-harbour", name: "Otago Harbour", regionSlug: "dunedin-otago", description: "Long tidal harbour with blue cod, flounder, and kahawai. The entrance channel has strong currents that concentrate fish." },
  { slug: "dunedin-otago--otago-peninsula-reefs", name: "Otago Peninsula Reefs", regionSlug: "dunedin-otago", description: "Rocky reefs around the scenic peninsula with blue cod and groper. Kingfish visit in summer. Rock fishing for blue moki." },
  { slug: "dunedin-otago--clutha-river-mouth", name: "Clutha River Mouth", regionSlug: "dunedin-otago", description: "One of NZ's largest rivers. Salmon runs in autumn. Brown trout in the lower reaches. Land-based fishing near Balclutha." },

  // NZ South Island — Invercargill / Southland
  { slug: "invercargill-southland--bluff-harbour", name: "Bluff Harbour", regionSlug: "invercargill-southland", description: "NZ's southernmost major port. Iconic blue cod fishing in the harbour and Foveaux Strait channels. Strong tidal rips produce action." },
  { slug: "invercargill-southland--stewart-island", name: "Stewart Island Offshore", regionSlug: "invercargill-southland", description: "Remote island fishing for deep-water hapuku, blue cod, and groper. Bluefin tuna visit the offshore grounds in summer." },
  { slug: "invercargill-southland--mataura-river", name: "Mataura River", regionSlug: "invercargill-southland", description: "World-famous dry fly brown trout river. Evening rises of epic proportions during the annual Mataura duck fly hatch." },
  { slug: "invercargill-southland--oreti-beach", name: "Oreti Beach", regionSlug: "invercargill-southland", description: "Long surf beach south of Invercargill. Beach casting for kahawai, trevally, and blue cod. Vehicle access along the beach." },

  // NZ South Island — West Coast / Greymouth
  { slug: "west-coast-greymouth--hokitika-offshore", name: "Hokitika Offshore", regionSlug: "west-coast-greymouth", description: "Wild west coast with blue cod, tarakihi, and hapuku offshore. Bar crossings require experienced handling in challenging sea conditions." },
  { slug: "west-coast-greymouth--grey-river", name: "Grey River", regionSlug: "west-coast-greymouth", description: "Major west coast river with brown trout fishing through the forested gorges. Sea-run trout (quinnat) enter in autumn." },
  { slug: "west-coast-greymouth--buller-river", name: "Buller River", regionSlug: "west-coast-greymouth", description: "Wild river system from Westport to the mountains. Brown trout in clear pools. Remote wilderness fishing with minimal pressure." },

  // QLD Far North — Cairns
  { slug: "cairns--ribbon-reefs", name: "Ribbon Reefs", regionSlug: "cairns", description: "Iconic outer Barrier Reef ribbon reefs stretching north of Cairns. World-class coral trout, red emperor, and giant trevally. Black marlin along the wall." },
  { slug: "cairns--osprey-reef-coral-sea", name: "Osprey Reef (Coral Sea)", regionSlug: "cairns", description: "Remote Coral Sea reef famous for pelagics. Wahoo, yellowfin tuna, GT, and dogtooth tuna. Live-aboard access to pristine offshore fishing." },
  { slug: "cairns--lizard-island-grounds", name: "Lizard Island Grounds", regionSlug: "cairns", description: "Premier black marlin territory in October–December. Ribbon Reef system nearby for GT and reef species. World-class game fishing resort." },
  { slug: "cairns--cairns-marlin-alley", name: "Cairns Marlin Alley", regionSlug: "cairns", description: "The trolling corridor off Cairns where giant black marlin over 1000lb are caught. September to December is peak season." },
  { slug: "cairns--cape-tribulation-offshore", name: "Cape Tribulation Offshore", regionSlug: "cairns", description: "Coral reef system north of Port Douglas with Spanish mackerel, mackerel tuna, and coral trout. Accessible by small boat in calm conditions." },

  // QLD Far North — Port Douglas
  { slug: "port-douglas--low-isles", name: "Low Isles", regionSlug: "port-douglas", description: "Coral cay reef close to Port Douglas with coral trout, red emperor, and trevally. Calm inner-reef fishing suitable for smaller vessels." },
  { slug: "port-douglas--tongue-reef", name: "Tongue Reef", regionSlug: "port-douglas", description: "Outer barrier reef with excellent reef fishing for coral trout and emperor. Wahoo and tuna on the outside edge in good conditions." },
  { slug: "port-douglas--agincourt-reef", name: "Agincourt Reef", regionSlug: "port-douglas", description: "Northernmost ribbon reef accessible from Port Douglas. Excellent trolling for mackerel and marlin along the outer wall." },
  { slug: "port-douglas--daintree-estuary", name: "Daintree River Estuary", regionSlug: "port-douglas", description: "Tidal estuary in World Heritage rainforest. Mangrove jack, barramundi, and estuary species in the mangrove-lined banks." },

  // QLD Far North — Cooktown
  { slug: "cooktown--endeavour-river", name: "Endeavour River", regionSlug: "cooktown", description: "Historic river where Cook beached the Endeavour. Barramundi, mangrove jack, and estuary species in the tidal reaches." },
  { slug: "cooktown--lizard-island", name: "Lizard Island Reef", regionSlug: "cooktown", description: "Remote island 90km north of Cooktown. Giant trevally on the flats, black marlin offshore, and excellent reef fishing year-round." },
  { slug: "cooktown--north-direction-island", name: "North Direction Island", regionSlug: "cooktown", description: "Remote offshore reef system with pristine coral trout and red emperor. Accessible by live-aboard only. GT on the outer edges." },

  // QLD Far North — Townsville
  { slug: "townsville--magnetic-island-reefs", name: "Magnetic Island Reefs", regionSlug: "townsville", description: "Rocky reefs around the island with coral trout, red emperor, and mackerel. Accessible day trip from Townsville." },
  { slug: "townsville--cape-cleveland", name: "Cape Cleveland", regionSlug: "townsville", description: "Headland southeast of Townsville with strong currents and excellent Spanish mackerel. GT and queenfish in the tidal rips." },
  { slug: "townsville--flinders-passage", name: "Flinders Passage", regionSlug: "townsville", description: "Channel between Magnetic Island and the mainland with productive reef fishing. Barramundi in the mangrove creeks nearby." },

  // QLD Central — Mackay
  { slug: "mackay--brampton-island", name: "Brampton Island", regionSlug: "mackay", description: "Coral Cay Island in the Cumberland Group. Spanish mackerel, coral trout, and pelagics. Excellent light tackle action around the bommies." },
  { slug: "mackay--cape-hillsborough", name: "Cape Hillsborough Reefs", regionSlug: "mackay", description: "Rocky reef headland north of Mackay with coral trout, red emperor, and strong Spanish mackerel runs in winter-spring." },
  { slug: "mackay--coral-sea-outer-reefs", name: "Coral Sea Outer Reefs", regionSlug: "mackay", description: "Remote offshore reefs east of Mackay with wahoo, yellowfin tuna, and mahi-mahi. Accessible by live-aboard from Mackay Marina." },
  { slug: "mackay--pioneer-river", name: "Pioneer River Estuary", regionSlug: "mackay", description: "Mackay's river system with barramundi, mangrove jack, and threadfin salmon in the tidal reaches. Popular light-tackle estuary." },

  // QLD Central — Airlie Beach / Whitsundays
  { slug: "airlie-beach--whitsunday-passage", name: "Whitsunday Passage", regionSlug: "airlie-beach", description: "Sheltered passage between the Whitsunday Islands and the mainland. Coral trout, red emperor, and trevally on the reef systems." },
  { slug: "airlie-beach--hook-island", name: "Hook Island", regionSlug: "airlie-beach", description: "Largest island in the Whitsundays with excellent reef fishing on the northern side. GT, mackerel, and coral trout around the bommies." },
  { slug: "airlie-beach--outer-whitsunday-reefs", name: "Outer Whitsunday Reefs", regionSlug: "airlie-beach", description: "Open-water reefs east of the islands with wahoo, mahi-mahi, and yellowfin tuna. Trolling grounds in the Coral Sea." },
  { slug: "airlie-beach--proserpine-river", name: "Proserpine River", regionSlug: "airlie-beach", description: "Mangrove estuary north of Airlie with barramundi and mangrove jack. Small boat access through the winding mangrove creeks." },

  // QLD Central — Yeppoon
  { slug: "yeppoon--great-keppel-island", name: "Great Keppel Island", regionSlug: "yeppoon", description: "Keppel Islands group with excellent reef fishing for coral trout and snapper. Spanish mackerel in autumn. Accessible by ferry from Yeppoon." },
  { slug: "yeppoon--fitzroy-river-barramundi", name: "Fitzroy River", regionSlug: "yeppoon", description: "Major river system west of Rockhampton. Excellent barramundi in the tidal estuary reaches. Golden perch and catfish further upstream." },
  { slug: "yeppoon--capricorn-bunker-group", name: "Capricorn-Bunker Group", regionSlug: "yeppoon", description: "Remote southern Great Barrier Reef reefs with pristine coral trout and red emperor. Offshore live-aboard destination." },

  // QLD Central — Gladstone
  { slug: "gladstone--lady-musgrave-island", name: "Lady Musgrave Island", regionSlug: "gladstone", description: "Southernmost true coral cay on the Great Barrier Reef. Excellent coral trout, red emperor, and snapper inside the lagoon and on the reef walls." },
  { slug: "gladstone--heron-island", name: "Heron Island Reef", regionSlug: "gladstone", description: "World Heritage reef platform with pristine fish populations. Coral trout, parrotfish, and GT around the reef edges." },
  { slug: "gladstone--calliope-river", name: "Calliope River", regionSlug: "gladstone", description: "Tidal estuary near Gladstone with barramundi and mangrove jack. Small boat fishing through the mangrove-lined channels." },

  // QLD Southeast — Hervey Bay
  { slug: "hervey-bay--platypus-bay", name: "Platypus Bay", regionSlug: "hervey-bay", description: "Protected bay on Fraser Island's western side with excellent snapper, tuna, cobia, and samsonfish. Clear calm water most of the year." },
  { slug: "hervey-bay--breaksea-spit", name: "Breaksea Spit", regionSlug: "hervey-bay", description: "Sand spit at the northern end of Fraser Island. Tuna, mahi-mahi, and spanish mackerel congregate here seasonally. Strong currents." },
  { slug: "hervey-bay--great-sandy-strait", name: "Great Sandy Strait", regionSlug: "hervey-bay", description: "Sheltered strait between Fraser Island and the mainland. Excellent flathead, whiting, and estuary species in the shallow tidal systems." },

  // QLD Southeast — Fraser Coast
  { slug: "fraser-coast--fraser-island-beach", name: "Fraser Island Ocean Beach", regionSlug: "fraser-coast", description: "75 Miles Beach — one of Australia's great surf fishing locations. Tailor, whiting, and bream along the exposed eastern beach." },
  { slug: "fraser-coast--eli-creek-estuary", name: "Eli Creek Estuary", regionSlug: "fraser-coast", description: "Crystal-clear creek on Fraser Island entering the beach. Estuary species including flathead and bream in the lower reaches." },
  { slug: "fraser-coast--maryborough-mary-river", name: "Mary River", regionSlug: "fraser-coast", description: "River flowing through Maryborough with barramundi in the tidal reaches and golden perch further upstream." },

  // QLD Southeast — Sunshine Coast
  { slug: "sunshine-coast--noosa-river-estuary", name: "Noosa River Estuary", regionSlug: "sunshine-coast", description: "Productive estuary with flathead, bream, and mangrove jack. Noosa National Park reef nearby with excellent snapper and cobia." },
  { slug: "sunshine-coast--mudjimba-island", name: "Mudjimba Island (Old Woman Island)", regionSlug: "sunshine-coast", description: "Small rocky island off Maroochydore with resident snapper, parrotfish, and kingfish. Popular reef for Sunshine Coast anglers." },
  { slug: "sunshine-coast--north-reef", name: "North Reef", regionSlug: "sunshine-coast", description: "Offshore reef system north of the Sunshine Coast with good snapper, pearl perch, and pelagic action in the right conditions." },
  { slug: "sunshine-coast--maroochy-river", name: "Maroochy River", regionSlug: "sunshine-coast", description: "Estuary system with excellent flathead, whiting, and bream. Popular light-tackle destination close to accommodation." },

  // QLD Southeast — Brisbane / Moreton Bay
  { slug: "brisbane-moreton-bay--cape-moreton", name: "Cape Moreton", regionSlug: "brisbane-moreton-bay", description: "The northern tip of Moreton Island. Yellowfin tuna, wahoo, and mahi-mahi in the deep water. Mackerel tuna and snapper on the reef." },
  { slug: "brisbane-moreton-bay--north-reef-moreton", name: "North Reef", regionSlug: "brisbane-moreton-bay", description: "Productive reef at the northern end of Moreton Bay with snapper, parrotfish, and amberjack. Good pelagics in season." },
  { slug: "brisbane-moreton-bay--south-passage", name: "South Passage", regionSlug: "brisbane-moreton-bay", description: "Tidal channel at the southern end of Moreton Bay with flathead, whiting, and snapper. Strong currents concentrate baitfish." },
  { slug: "brisbane-moreton-bay--brisbane-river-estuary", name: "Brisbane River Estuary", regionSlug: "brisbane-moreton-bay", description: "Urban estuary with underrated flathead and bream fishing. Mangrove jack in the tidal creeks. Jew fish under the bridges at night." },

  // QLD Southeast — Gold Coast
  { slug: "gold-coast--gold-coast-broadwater", name: "Gold Coast Broadwater", regionSlug: "gold-coast", description: "Large estuary system with excellent flathead, whiting, snapper, and bream. Seaway access for offshore trips to the continental shelf." },
  { slug: "gold-coast--seaway-canyon", name: "Seaway / Gold Coast Canyon", regionSlug: "gold-coast", description: "Deepwater canyon accessible from the Seaway with yellowfin tuna, marlin, and mahi-mahi. Deep jigging for ruby snapper." },
  { slug: "gold-coast--coomera-river", name: "Coomera River", regionSlug: "gold-coast", description: "Tidal river with flathead, bream, and mangrove jack. Night fishing for jewfish (mulloway) in the deeper holes." },
  { slug: "gold-coast--tweed-river-estuary", name: "Tweed River Estuary", regionSlug: "gold-coast", description: "Border river with tarpon, flathead, mangrove jack, and mulloway. The river mouth holds trevally and tailor in season." },

  // NSW — Ballina / Byron Bay
  { slug: "ballina-byron-bay--richmond-river", name: "Richmond River", regionSlug: "ballina-byron-bay", description: "Major estuary system with mulloway, flathead, and bream. Mangrove jack upstream. Tailor and trevally at the river mouth." },
  { slug: "ballina-byron-bay--byron-bay-offshore", name: "Byron Bay Offshore", regionSlug: "ballina-byron-bay", description: "Tuna, mahi-mahi, and wahoo in the blue water off Byron. Spanish mackerel autumn runs. Snapper on the rocky reefs." },
  { slug: "ballina-byron-bay--lennox-head-reef", name: "Lennox Head Reef", regionSlug: "ballina-byron-bay", description: "Rocky reef off Lennox Head with snapper, amberjack, and jewfish. Kingfish visit in summer. Accessible from the beach launch." },

  // NSW — South West Rocks
  { slug: "south-west-rocks--smoky-cape", name: "Smoky Cape", regionSlug: "south-west-rocks", description: "Headland at the southern end of Trial Bay with strong pelagic aggregations. Kingfish, tuna, and yellowtail scad year-round." },
  { slug: "south-west-rocks--trial-bay", name: "Trial Bay", regionSlug: "south-west-rocks", description: "Protected bay with snapper, flathead, and bream. Excellent yellowfin tuna in summer outside the bay. Land-based rock fishing." },
  { slug: "south-west-rocks--macleay-river", name: "Macleay River", regionSlug: "south-west-rocks", description: "Large river estuary with mulloway, flathead, and bream. School jewfish in the tidal reaches at dawn and dusk." },

  // NSW — Coffs Harbour
  { slug: "coffs-harbour--solitary-islands", name: "Solitary Islands Marine Park", regionSlug: "coffs-harbour", description: "Chain of offshore islands and reefs. Snapper, kingfish, and excellent reef fishing. Protected waters support outstanding biodiversity." },
  { slug: "coffs-harbour--coffs-harbour-offshore", name: "Coffs Offshore FADs", regionSlug: "coffs-harbour", description: "Fish aggregating devices attract yellowfin tuna, mahi-mahi, and wahoo in season. Popular target for offshore game fishing." },
  { slug: "coffs-harbour--bellinger-river", name: "Bellinger River", regionSlug: "coffs-harbour", description: "Picturesque river system south of Coffs with bream, flathead, and mulloway. Estuary perch in the freshwater reaches." },

  // NSW — Port Macquarie
  { slug: "port-macquarie--hastings-river", name: "Hastings River", regionSlug: "port-macquarie", description: "Major estuary with flathead, bream, and mulloway. Good mangrove jack in the warmer months. Popular with kayak anglers." },
  { slug: "port-macquarie--point-plomer", name: "Point Plomer", regionSlug: "port-macquarie", description: "Remote headland north of Port Macquarie with good rock fishing for drummer, groper, and tailor. Accessible 4WD only." },
  { slug: "port-macquarie--camden-haven", name: "Camden Haven Inlet", regionSlug: "port-macquarie", description: "Productive estuary at Laurieton with flathead, bream, and mulloway. Strong tailor at the entrance in season." },

  // NSW — Port Stephens
  { slug: "port-stephens--broughton-island", name: "Broughton Island", regionSlug: "port-stephens", description: "Offshore island with excellent kingfish, snapper, and amberjack. Yellowfin tuna in season. Known as one of NSW's best day-trip reefs." },
  { slug: "port-stephens--pin-reef", name: "Port Stephens Canyon", regionSlug: "port-stephens", description: "Deep canyon off Port Stephens with yellowfin tuna, marlin, and mahi-mahi. Blue-eye trevalla in deep water." },
  { slug: "port-stephens--myall-river", name: "Myall Lakes / River", regionSlug: "port-stephens", description: "Extensive lake system with bream, flathead, and estuary perch. Mulloway in the deeper channels at night." },
  { slug: "port-stephens--port-stephens-harbour", name: "Port Stephens Harbour", regionSlug: "port-stephens", description: "Deep natural harbour with flathead, bream, and luderick inside. Kingfish on the inshore bomboras year-round." },

  // NSW — Newcastle
  { slug: "newcastle--hunter-river-estuary", name: "Hunter River Estuary", regionSlug: "newcastle", description: "Wide estuary with mulloway, flathead, and bream. Jewfish under the bridges at night. Mangrove jack in summer upstream." },
  { slug: "newcastle--nobbys-head-reef", name: "Nobbys Head Reef", regionSlug: "newcastle", description: "Rocky reef at the harbour entrance with snapper, drummer, and tailor. Kingfish in the wash. Popular land-based spot." },
  { slug: "newcastle--bar-beach-offshore", name: "Newcastle Offshore FADs", regionSlug: "newcastle", description: "FADs and canyon systems off Newcastle with yellowfin tuna in summer. Kingfish and snapper on the offshore reefs." },

  // NSW — Lake Macquarie
  { slug: "lake-macquarie--swansea-channel", name: "Swansea Channel", regionSlug: "lake-macquarie", description: "The tidal connection between Lake Macquarie and the ocean. Kingfish and tailor on the tide. Bream and flathead year-round." },
  { slug: "lake-macquarie--lake-macquarie-flats", name: "Lake Macquarie Flats", regionSlug: "lake-macquarie", description: "Shallow tidal flats throughout the lake with excellent flathead and whiting. Bream on structure. Kayak and SUP fishing territory." },
  { slug: "lake-macquarie--wangi-wangi-deep", name: "Wangi Wangi Deep Water", regionSlug: "lake-macquarie", description: "Deeper western end of the lake with mulloway and bream. Night fishing from the boat ramp area popular for jewfish." },

  // NSW — Hawkesbury River
  { slug: "hawkesbury-river--broken-bay-entrance", name: "Broken Bay Entrance", regionSlug: "hawkesbury-river", description: "Ocean entrance to the Hawkesbury with kingfish, snapper, and strong pelagic action. Bull sharks and jewfish in the deeper water." },
  { slug: "hawkesbury-river--upper-hawkesbury", name: "Upper Hawkesbury Reaches", regionSlug: "hawkesbury-river", description: "Mangrove-lined upper estuary with bass, flathead, and bream. Mulloway under the river banks at night." },
  { slug: "hawkesbury-river--cowan-creek", name: "Cowan Creek", regionSlug: "hawkesbury-river", description: "Tributary of the Hawkesbury with excellent Australian bass in the snag-filled pools. Flathead and bream lower down." },

  // NSW — Sydney
  { slug: "sydney--sydney-harbour", name: "Sydney Harbour", regionSlug: "sydney", description: "Iconic harbour with flathead and bream on the flats. Kingfish on the bomboras. Night fishing for jewfish under the Harbour Bridge." },
  { slug: "sydney--sydney-offshore-fads", name: "Sydney Offshore FADs & Canyon", regionSlug: "sydney", description: "Canyon system 30km offshore with yellowfin tuna, marlin, and mahi-mahi. FADs concentrate pelagics in summer." },
  { slug: "sydney--port-hacking", name: "Port Hacking", regionSlug: "sydney", description: "Southern Sydney estuary with flathead, bream, and mulloway. Boat ramp access to offshore kingfish grounds at Cape Baily." },
  { slug: "sydney--cape-banks", name: "Cape Banks / Botany Bay", regionSlug: "sydney", description: "Southern heads of Botany Bay with snapper, groper, and kingfish on the rocky reefs. Land-based fishing from the point." },

  // NSW — Wollongong
  { slug: "wollongong--shellharbour", name: "Shellharbour", regionSlug: "wollongong", description: "Sheltered harbour south of Wollongong with snapper and flathead. Offshore reef fishing for blue-eye trevalla in deep water." },
  { slug: "wollongong--bass-point", name: "Bass Point", regionSlug: "wollongong", description: "Productive headland with kingfish, snapper, and drummer. Rock fishing for tailor and salmon. Diving and fishing offshore reefs." },
  { slug: "wollongong--lake-illawarra", name: "Lake Illawarra", regionSlug: "wollongong", description: "Coastal lake with excellent flathead and bream. Mulloway in the channels. Access to offshore grounds via Windang entrance." },

  // NSW — Jervis Bay
  { slug: "jervis-bay--jervis-bay-offshore", name: "Jervis Bay Offshore", regionSlug: "jervis-bay", description: "Clear blue water just outside the bay with tuna, mahi-mahi, and marlin in season. One of NSW's clearest offshore destinations." },
  { slug: "jervis-bay--hyams-beach-flats", name: "Hyams Beach Flats", regionSlug: "jervis-bay", description: "World-famous white sand beach in the bay. Flathead and bream on the flats. Snapper on the rocky edges of the bay." },
  { slug: "jervis-bay--st-georges-head", name: "St Georges Head", regionSlug: "jervis-bay", description: "Rocky headland at the bay entrance with excellent kingfish and snapper. Strong wash fishing for drummer and groper." },

  // NSW — Ulladulla
  { slug: "ulladulla--pigeon-bay", name: "Pigeon Bay", regionSlug: "ulladulla", description: "Small bay south of Ulladulla with sheltered bream and flathead fishing. Jewfish in the deeper holes at night." },
  { slug: "ulladulla--ulladulla-offshore", name: "Ulladulla Offshore", regionSlug: "ulladulla", description: "Productive offshore reefs and canyon with yellowfin tuna and mahi-mahi. Blue-eye trevalla deep jigging in season." },
  { slug: "ulladulla--burrill-lake", name: "Burrill Lake", regionSlug: "ulladulla", description: "Coastal lake with excellent bream, flathead, and whiting. Mulloway in the channels. Peaceful estuary fishing." },

  // NSW — Batemans Bay
  { slug: "batemans-bay--clyde-river", name: "Clyde River", regionSlug: "batemans-bay", description: "Large tidal estuary with flathead, bream, and mulloway. Oyster leases provide cover for bream and mangrove jack in summer." },
  { slug: "batemans-bay--tollgate-islands", name: "Tollgate Islands", regionSlug: "batemans-bay", description: "Small island group just outside Batemans Bay with snapper, kingfish, and tuna in season." },
  { slug: "batemans-bay--north-head-reef", name: "North Head Reef", regionSlug: "batemans-bay", description: "Rocky headland reef with drummer, groper, and tailor. Kingfish visit in warmer months. Accessible by small boat." },

  // NSW — Narooma
  { slug: "narooma--montague-island", name: "Montague Island", regionSlug: "narooma", description: "NSW marine reserve with exceptional snapper, kingfish, and tuna drawn by the seal and penguin colony baitfish. One of NSW's best reef spots." },
  { slug: "narooma--wagonga-inlet", name: "Wagonga Inlet", regionSlug: "narooma", description: "Productive estuary behind Narooma with bream, flathead, and luderick. Mulloway in the deeper channels." },
  { slug: "narooma--mystery-bay", name: "Mystery Bay", regionSlug: "narooma", description: "Sheltered bay with snapper and flathead. Rock fishing for drummer and tailor. Quiet and uncrowded." },

  // NSW — Tathra / Merimbula
  { slug: "tathra-merimbula--merimbula-lake", name: "Merimbula Lake", regionSlug: "tathra-merimbula", description: "Productive coastal lake with excellent bream, flathead, and mulloway. The two lakes system is a local icon for light tackle fishing." },
  { slug: "tathra-merimbula--tathra-wharf", name: "Tathra Wharf", regionSlug: "tathra-merimbula", description: "Historic wharf with resident snapper, bream, and luderick. Excellent light tackle and bait fishing from the jetty. Night sessions for jewfish." },
  { slug: "tathra-merimbula--bega-river", name: "Bega River", regionSlug: "tathra-merimbula", description: "River estuary with bream, flathead, and mulloway. Estuary perch in the upper reaches. Accessible from several boat ramps." },

  // NSW — Eden
  { slug: "eden--twofold-bay", name: "Twofold Bay", regionSlug: "eden", description: "Deep natural bay famous for marlin, tuna, and kingfish. Southern bluefin tuna cage diving nearby. Historically one of Australia's premier game fishing bays." },
  { slug: "eden--eden-offshore-canyon", name: "Eden Offshore Canyon", regionSlug: "eden", description: "Deep canyon system with blue-eye trevalla, striped trumpeter, and large snapper. Big-game marlin and tuna in season." },
  { slug: "eden--kiah-river", name: "Kiah River / Wonboyn Lake", regionSlug: "eden", description: "Remote lake and river system with excellent bream and flathead. Mulloway in the deep holes. Very little fishing pressure." },

  // NSW — Lord Howe Island
  { slug: "lord-howe-island--ball-pyramid", name: "Ball's Pyramid", regionSlug: "lord-howe-island", description: "Dramatic volcanic pinnacle 23km from Lord Howe. Enormous yellowtail kingfish school around the base. Wahoo and tuna in the current." },
  { slug: "lord-howe-island--nepean-island", name: "Nepean Island Reefs", regionSlug: "lord-howe-island", description: "Reef systems around Nepean Island with coral trout, trevally, and GT on the bommies. Light tackle paradise." },
  { slug: "lord-howe-island--north-beach-lagoon", name: "Lord Howe Lagoon", regionSlug: "lord-howe-island", description: "Pristine lagoon inside the reef with trevally, bonefish, and permit on the flats. Snapper on the reef edges." },

  // VIC — Port Phillip Bay
  { slug: "port-phillip-bay--rip-entrance", name: "The Rip (Port Phillip Heads)", regionSlug: "port-phillip-bay", description: "One of the most dangerous but productive fishing spots in Australia. Kingfish, southern bluefin tuna, and snapper in the rip's powerful current." },
  { slug: "port-phillip-bay--artificial-reefs", name: "Port Phillip Artificial Reefs", regionSlug: "port-phillip-bay", description: "Purpose-built artificial reefs inside the bay attract snapper, kingfish, and flathead. Proven productive year-round." },
  { slug: "port-phillip-bay--sorrento-portsea", name: "Sorrento / Portsea", regionSlug: "port-phillip-bay", description: "Peninsula tip with offshore access to kingfish and SBT. Snapper on inshore reefs. Scallops in the bay." },
  { slug: "port-phillip-bay--werribee-flats", name: "Werribee Flats", regionSlug: "port-phillip-bay", description: "Northern bay flats with excellent King George whiting and flathead in summer. Snapper in winter. Popular wading destination." },

  // VIC — Mornington Peninsula
  { slug: "mornington-peninsula--mount-eliza-reef", name: "Mount Eliza Reef", regionSlug: "mornington-peninsula", description: "Inshore reef with snapper and flathead. Bass Strait edge accessible for kingfish and SBT from the outer peninsular points." },
  { slug: "mornington-peninsula--dromana-bank", name: "Dromana Bank", regionSlug: "mornington-peninsula", description: "Productive sand bank in Port Phillip with snapper in winter and King George whiting in summer. Popular trailer-boat destination." },
  { slug: "mornington-peninsula--cape-schanck", name: "Cape Schanck", regionSlug: "mornington-peninsula", description: "Rugged Bass Strait headland with gummy shark, snapper, and salmon from rock platforms. Offshore access in calm conditions." },

  // VIC — Phillip Island
  { slug: "phillip-island--western-entrance", name: "Western Entrance", regionSlug: "phillip-island", description: "Tidal channel with SBT, snapper, and barracouta in season. One of Victoria's most reliable SBT spots in summer-autumn." },
  { slug: "phillip-island--the-nobbies", name: "The Nobbies", regionSlug: "phillip-island", description: "Rocky point with strong currents and salmon, sweep, and drummer. Offshore for SBT and kingfish when conditions allow." },
  { slug: "phillip-island--rhyll-inlet", name: "Rhyll Inlet", regionSlug: "phillip-island", description: "Sheltered bay on the north coast with King George whiting, flathead, and bream. Calm conditions year-round." },

  // VIC — Westernport Bay
  { slug: "westernport-bay--french-island", name: "French Island", regionSlug: "westernport-bay", description: "Uninhabited island with excellent snapper and whiting in the surrounding shallows. Flathead in the sandy channels." },
  { slug: "westernport-bay--lang-lang-flats", name: "Lang Lang Flats", regionSlug: "westernport-bay", description: "Extensive sandy flats in the northern bay with excellent King George whiting in summer. Gummy shark at night." },
  { slug: "westernport-bay--stony-point", name: "Stony Point", regionSlug: "westernport-bay", description: "Productive rocky point with snapper, flathead, and bream. Pier fishing for whiting and mullet. Ferry access to French Island." },

  // VIC — Wilsons Promontory
  { slug: "wilsons-promontory--sealers-cove", name: "Sealers Cove", regionSlug: "wilsons-promontory", description: "Remote cove accessible by foot or boat with snapper and flathead in the sheltered bay. Bushwalk-in fishing experience." },
  { slug: "wilsons-promontory--corner-inlet", name: "Corner Inlet", regionSlug: "wilsons-promontory", description: "Large sheltered inlet east of Wilsons Prom with King George whiting, snapper, and flathead. Protected from the worst weather." },
  { slug: "wilsons-promontory--outer-prom-reefs", name: "Outer Prom Reefs", regionSlug: "wilsons-promontory", description: "Remote offshore reefs south of the Prom accessible only in calm conditions. Blue-eye trevalla, snapper, and SBT in season." },

  // VIC — Lakes Entrance / Gippsland
  { slug: "lakes-entrance--gippsland-lakes", name: "Gippsland Lakes System", regionSlug: "lakes-entrance", description: "Australia's largest lake system. Bream, flathead, and estuary perch in the sheltered lakes. Trevally at the entrance." },
  { slug: "lakes-entrance--ninety-mile-beach", name: "Ninety Mile Beach", regionSlug: "lakes-entrance", description: "Endless surf beach with tailor, salmon, and mulloway. Remote sections accessible only by 4WD along the Gippsland coast." },
  { slug: "lakes-entrance--offshore-deep-reef", name: "Lakes Entrance Offshore Reef", regionSlug: "lakes-entrance", description: "Offshore reefs with snapper, blue-eye trevalla, and SBT. Experienced crews target big game fish in the deeper water." },

  // VIC — Mallacoota
  { slug: "mallacoota--mallacoota-inlet", name: "Mallacoota Inlet", regionSlug: "mallacoota", description: "Remote inlet near the NSW border with pristine bream, flathead, and estuary perch. Mulloway in the channels at night." },
  { slug: "mallacoota--betka-river", name: "Betka River", regionSlug: "mallacoota", description: "Small tidal river flowing into Mallacoota with bream and luderick. Fly fishing for estuary perch in the upper reaches." },
  { slug: "mallacoota--croajingolong-coast", name: "Croajingolong Coast", regionSlug: "mallacoota", description: "Remote wilderness coast with rock fishing for snapper, drummer, and salmon. Minimal fishing pressure in World Heritage parkland." },

  // VIC — Apollo Bay
  { slug: "apollo-bay--apollo-bay-reef", name: "Apollo Bay Offshore Reef", regionSlug: "apollo-bay", description: "Offshore reefs with snapper, blue-eye trevalla, and SBT. Good access in settled conditions from the harbour boat ramp." },
  { slug: "apollo-bay--barham-river", name: "Barham River Estuary", regionSlug: "apollo-bay", description: "Small estuary with bream, flathead, and sea-run trout. Surf beach at the entrance for tailor and salmon." },
  { slug: "apollo-bay--cape-otway", name: "Cape Otway Reef", regionSlug: "apollo-bay", description: "Wild headland with productive rock fishing for salmon and sweep. Offshore for snapper and gummy shark in calm conditions." },

  // VIC — Portland
  { slug: "portland-vic--portland-bay-sbt", name: "Portland Bay SBT Grounds", regionSlug: "portland-vic", description: "Victoria's primary SBT charter destination. Large southern bluefin tuna schools offshore summer-autumn. Premium live bait and berley techniques." },
  { slug: "portland-vic--blue-eye-deep-reef", name: "Portland Blue-Eye Reef", regionSlug: "portland-vic", description: "Deep offshore reef system with blue-eye trevalla and snapper. Deepwater jigging and bottom fishing in 150–300m." },
  { slug: "portland-vic--nelson-glenelg-river", name: "Glenelg River / Nelson", regionSlug: "portland-vic", description: "Scenic river estuary at Nelson with bream, flathead, and mulloway. Limestone gorge upstream provides unique river fishing." },

  // VIC — Warrnambool
  { slug: "warrnambool--lady-bay", name: "Lady Bay", regionSlug: "warrnambool", description: "Sheltered bay at Warrnambool with snapper and gummy shark. Beach fishing for salmon and tailor from the foreshore." },
  { slug: "warrnambool--hopkins-river", name: "Hopkins River Estuary", regionSlug: "warrnambool", description: "River flowing through Warrnambool with bream, flathead, and mulloway. Sea-run trout near the river mouth in season." },
  { slug: "warrnambool--port-fairy", name: "Port Fairy", regionSlug: "warrnambool", description: "Moyne River estuary with flathead and bream. Offshore access to snapper and gummy shark in Bass Strait." },

  // TAS — Hobart
  { slug: "hobart--d-entrecasteaux-channel", name: "D'Entrecasteaux Channel", regionSlug: "hobart", description: "Channel between Bruny Island and the Tasmanian mainland. Excellent blue-eye trevalla, snapper, and sea-run trout. Scenic and sheltered." },
  { slug: "hobart--derwent-estuary", name: "Derwent Estuary", regionSlug: "hobart", description: "The Derwent flowing through Hobart. Bream, flathead, and estuary perch. Sea-run trout near the upper estuary in autumn-winter." },
  { slug: "hobart--cape-bruny", name: "Cape Bruny Reefs", regionSlug: "hobart", description: "Southern tip of Bruny Island with deep-water reef fishing for blue-eye trevalla and striped trumpeter. Remote and productive." },

  // TAS — St Helens
  { slug: "st-helens--st-helens-point", name: "St Helens Point", regionSlug: "st-helens", description: "Headland at the northern end of Georges Bay. Exceptional bluefin tuna grounds nearby. Snapper on the inshore reef systems." },
  { slug: "st-helens--georges-bay", name: "Georges Bay", regionSlug: "st-helens", description: "Protected estuarine bay with flathead, bream, and estuary perch. Excellent land-based fishing from multiple access points." },
  { slug: "st-helens--eddystone-point", name: "Eddystone Point Reef", regionSlug: "st-helens", description: "Northeast Tasmania's exposed headland reef with blue cod, groper, and trevally. Remote rock fishing in wild conditions." },

  // TAS — Bicheno
  { slug: "bicheno--bicheno-reef", name: "Bicheno Offshore Reef", regionSlug: "bicheno", description: "Productive reef system east of Bicheno with snapper, blue warehou, and bastard trumpeter. Access depends on Bass Strait conditions." },
  { slug: "bicheno--diamond-island", name: "Diamond Island", regionSlug: "bicheno", description: "Tidal island joined to shore with rock fishing for blue cod, tailor, and sweep. Local penguin colony adds to the atmosphere." },
  { slug: "bicheno--moulting-lagoon", name: "Moulting Lagoon", regionSlug: "bicheno", description: "Sheltered estuary south of Bicheno with bream, flathead, and estuary perch. Swan Lake-style fishing in a remote setting." },

  // TAS — Bruny Island
  { slug: "bruny-island--adventure-bay", name: "Adventure Bay", regionSlug: "bruny-island", description: "Sheltered bay with flathead, bream, and sea-run trout near the freshwater inflow points. Scenic and remote." },
  { slug: "bruny-island--south-bruny-reefs", name: "South Bruny Offshore Reefs", regionSlug: "bruny-island", description: "Deep-water reefs off South Bruny with blue-eye trevalla, striped trumpeter, and snapper. Exposed to Southern Ocean swell." },
  { slug: "bruny-island--isthmus-channel", name: "The Isthmus Channel", regionSlug: "bruny-island", description: "Narrow tidal channel connecting North and South Bruny with blue cod, snapper, and trevally. Strong tidal flows." },

  // TAS — Strahan / Macquarie Harbour
  { slug: "strahan--macquarie-harbour", name: "Macquarie Harbour", regionSlug: "strahan", description: "One of Australia's largest harbours with exceptional sea-run trout. The Gordon River mouth is a prime hold for trophy fish." },
  { slug: "strahan--gordon-river-mouth", name: "Gordon River Mouth", regionSlug: "strahan", description: "The Gordon River entering Macquarie Harbour. Classic sea-run trout territory. Remote and wild World Heritage setting." },
  { slug: "strahan--hell-gates", name: "Hell's Gates", regionSlug: "strahan", description: "Narrow ocean entrance to Macquarie Harbour. Offshore reef access for blue-eye trevalla and striped trumpeter in calm conditions." },

  // TAS — Devonport
  { slug: "devonport--mersey-river", name: "Mersey River Estuary", regionSlug: "devonport", description: "River flowing through Devonport with flathead, bream, and estuary perch. Sea-run trout in autumn. Accessible boat ramp." },
  { slug: "devonport--bass-strait-offshore", name: "Bass Strait Offshore", regionSlug: "devonport", description: "Northern Tasmania facing Bass Strait. School and bluefin tuna in season. Snapper and flathead on the inshore reefs." },
  { slug: "devonport--port-sorell", name: "Port Sorell Estuary", regionSlug: "devonport", description: "Sheltered estuary west of Devonport with flathead, bream, and estuary perch. Peaceful and relatively uncrowded." },

  // TAS — Launceston / Tamar River
  { slug: "launceston-tamar--tamar-estuary", name: "Tamar Estuary", regionSlug: "launceston-tamar", description: "Tidal estuary from Launceston to Bass Strait with bream, flathead, and estuary perch. Sea-run trout in autumn migration." },
  { slug: "launceston-tamar--george-river", name: "George River", regionSlug: "launceston-tamar", description: "East coast river entering the bay at St Helens. Excellent sea-run trout in the lower reaches and estuary." },
  { slug: "launceston-tamar--low-head", name: "Low Head / Tamar Mouth", regionSlug: "launceston-tamar", description: "River mouth and adjacent Bass Strait shore. Snapper and trevally at the river mouth. Rock fishing nearby." },

  // TAS — Port Arthur
  { slug: "port-arthur--tasman-peninsula-reefs", name: "Tasman Peninsula Reefs", regionSlug: "port-arthur", description: "Dramatic sea cliffs with deep offshore reefs holding blue-eye trevalla, striped trumpeter, and snapper. Accessible in calm conditions." },
  { slug: "port-arthur--pirates-bay", name: "Pirates Bay", regionSlug: "port-arthur", description: "Sheltered bay with flathead and bream. Surf beach entry for tailor and salmon. Iconic Tasmanian scenery backdrop." },
  { slug: "port-arthur--eaglehawk-neck", name: "Eaglehawk Neck", regionSlug: "port-arthur", description: "Rocky channel with strong tidal flows and blue cod, trevally, and snapper. Land-based fishing from the historical isthmus." },

  // Murray-Darling — Albury
  { slug: "murray-river-albury--hume-weir-tailwater", name: "Hume Weir Tailwater", regionSlug: "murray-river-albury", description: "Below Hume Dam with excellent Murray cod and golden perch. Cold-water trout in the tailwater zone immediately below the dam wall." },
  { slug: "murray-river-albury--albury-wodonga-snags", name: "Albury-Wodonga Snag Holes", regionSlug: "murray-river-albury", description: "Deep log snag pools in the Murray between Albury and Wodonga. Trophy Murray cod in the woody debris. Night fishing excels." },
  { slug: "murray-river-albury--corowa-murray-bend", name: "Corowa River Bends", regionSlug: "murray-river-albury", description: "Sweeping river bends downstream of Albury with excellent golden perch and cod on the outside edges. Good boat access." },

  // Murray-Darling — Echuca
  { slug: "murray-river-echuca--echuca-log-snags", name: "Echuca Log Snags", regionSlug: "murray-river-echuca", description: "Classic Murray River snag fishing near the paddle steamer town. Trophy Murray cod in the submerged timber. Best at night with live shrimp." },
  { slug: "murray-river-echuca--barmah-forest-channels", name: "Barmah Forest Channels", regionSlug: "murray-river-echuca", description: "Seasonal flood channels through river red gum forest. Murray cod and golden perch in the forest during flood years. Kayak access." },
  { slug: "murray-river-echuca--perricoota-station-bends", name: "Perricoota River Bends", regionSlug: "murray-river-echuca", description: "Long sweeping river bends with deep outside edges holding big cod. Camping on the bank with minimal pressure." },

  // Murray-Darling — Mildura
  { slug: "murray-river-mildura--lake-cullulleraine", name: "Lake Cullulleraine", regionSlug: "murray-river-mildura", description: "River lake near Mildura with excellent golden perch and Murray cod. Accessible facilities and good fishing for all skill levels." },
  { slug: "murray-river-mildura--red-cliffs-bends", name: "Red Cliffs River Bends", regionSlug: "murray-river-mildura", description: "Dramatic red cliff scenery with deep river pools holding trophy Murray cod. Warm-water golden perch year-round." },
  { slug: "murray-river-mildura--hattah-lakes", name: "Hattah Lakes", regionSlug: "murray-river-mildura", description: "Flood plain lake system connected to the Murray. Excellent golden perch and Murray cod when the lakes fill. Unique landscape." },

  // Murray-Darling — Lake Hume
  { slug: "lake-hume--bellbridge-point", name: "Bellbridge Point", regionSlug: "lake-hume", description: "Rocky point on Lake Hume with good golden perch and Murray cod. Trolling with deep-diving lures along the rock shelves." },
  { slug: "lake-hume--lake-hume-arms", name: "Lake Hume Upper Arms", regionSlug: "lake-hume", description: "Upper ends of the reservoir where tributary creeks enter. Excellent golden perch in late spring and summer feeding on inflows." },
  { slug: "lake-hume--lake-hume-dam-wall", name: "Hume Dam Wall Area", regionSlug: "lake-hume", description: "Deep water near the dam wall with cold-water trout in the thermocline. Trolling with deep runners and dowriggers." },

  // Murray-Darling — Lake Mulwala
  { slug: "lake-mulwala--mulwala-timber", name: "Mulwala Submerged Timber", regionSlug: "lake-mulwala", description: "Lake Mulwala is famous for vast submerged timber. Murray cod hold tight to trees. Soft plastic and lure fishing through the snags." },
  { slug: "lake-mulwala--yarrawonga-weir", name: "Yarrawonga Weir Pool", regionSlug: "lake-mulwala", description: "Below the weir holds concentrations of golden perch and cod. The backwater pools have consistent fish year-round." },
  { slug: "lake-mulwala--lake-mulwala-channels", name: "Lake Mulwala Channels", regionSlug: "lake-mulwala", description: "Old river channel through the lake holds the biggest cod. Deep-water structure fishing with yabbies and lures." },

  // Murray-Darling — Murrumbidgee
  { slug: "murrumbidgee-river--wagga-wagga-pools", name: "Wagga Wagga Deep Pools", regionSlug: "murrumbidgee-river", description: "Deep river pools through Wagga with resident Murray cod and golden perch. Night surface fishing for big cod under the banks." },
  { slug: "murrumbidgee-river--narrandera-backwaters", name: "Narrandera Backwaters", regionSlug: "murrumbidgee-river", description: "Backwater billabong system near Narrandera with golden perch and Murray cod. Flood-fed wetland fishing in good rainfall years." },
  { slug: "murrumbidgee-river--hay-plains-section", name: "Hay Plains Section", regionSlug: "murrumbidgee-river", description: "Slow meandering river through flat plains country. Golden perch and catfish dominate. Remote camping with minimal pressure." },

  // Murray-Darling — Macquarie River
  { slug: "macquarie-river--dubbo-snags", name: "Dubbo River Snags", regionSlug: "macquarie-river", description: "Snag-filled pools below Dubbo with Murray cod and golden perch. Accessible river fishing in western NSW." },
  { slug: "macquarie-river--macquarie-marshes", name: "Macquarie Marshes", regionSlug: "macquarie-river", description: "Vast wetland system that fills in high rainfall years. Golden perch spawning aggregations and excellent bream in the billabongs." },
  { slug: "macquarie-river--warren-junction", name: "Warren Junction", regionSlug: "macquarie-river", description: "Confluence of the Macquarie and Bogan rivers with good golden perch and cod in the deep junction pools." },

  // Murray-Darling — Darling River Bourke
  { slug: "darling-river-bourke--back-darling-pools", name: "Back Darling Pools", regionSlug: "darling-river-bourke", description: "Isolated river pools downstream of Bourke. Golden perch and catfish in near-drought conditions. Remote outback fishing." },
  { slug: "darling-river-bourke--bourke-weir-pool", name: "Bourke Weir Pool", regionSlug: "darling-river-bourke", description: "Below the Bourke weir structure. Concentrates golden perch and yellowbelly. Accessible camping and good facilities." },
  { slug: "darling-river-bourke--menindee-lakes", name: "Menindee Lakes", regionSlug: "darling-river-bourke", description: "Large lake system near Broken Hill. Golden perch, Murray cod, and catfish. Excellent when lakes are full." },

  // Alpine — Lake Eucumbene
  { slug: "lake-eucumbene--seven-gates", name: "Seven Gates Area", regionSlug: "lake-eucumbene", description: "Productive shoreline section with excellent trout fishing. Bank fishing and wading for brown and rainbow trout." },
  { slug: "lake-eucumbene--dam-wall-area", name: "Eucumbene Dam Wall", regionSlug: "lake-eucumbene", description: "Deep water near the dam wall. Trolling with leadline or downrigger for large brown trout in the thermocline." },
  { slug: "lake-eucumbene--eucumbene-cove", name: "Eucumbene Cove", regionSlug: "lake-eucumbene", description: "Sheltered cove with consistent trout feeding in evenings. Fly fishing and bait fishing from the banks." },

  // Alpine — Lake Jindabyne
  { slug: "lake-jindabyne--thredbo-river-mouth", name: "Thredbo River Delta", regionSlug: "lake-jindabyne", description: "The Thredbo River entering Lake Jindabyne. Excellent trout feeding in the turbid inflow. Spring fly fishing highlight." },
  { slug: "lake-jindabyne--lake-jindabyne-dam", name: "Jindabyne Dam Wall", regionSlug: "lake-jindabyne", description: "Deep clear water near the dam. Trophy trout holding in the depth transitions. Trolling and lure casting effective." },
  { slug: "lake-jindabyne--guthega-pondage", name: "Guthega Pondage", regionSlug: "lake-jindabyne", description: "Small alpine pondage above Jindabyne with excellent rainbow trout fishing. Remote access through Snowy Mountains." },

  // Alpine — Snowy Mountains Rivers
  { slug: "snowy-mountains-rivers--thredbo-river", name: "Thredbo River", regionSlug: "snowy-mountains-rivers", description: "Classic alpine dry fly stream with wild brown trout. Evening hatches produce spectacular surface feeding. Some of Australia's best trout fishing." },
  { slug: "snowy-mountains-rivers--eucumbene-river", name: "Eucumbene River", regionSlug: "snowy-mountains-rivers", description: "Upper reaches above Lake Eucumbene with small but wild brown trout. Remote wilderness fly fishing with minimal pressure." },
  { slug: "snowy-mountains-rivers--tumut-river", name: "Tumut River", regionSlug: "snowy-mountains-rivers", description: "River flowing west from the Snowies. Excellent rainbow and brown trout below Tumut Pond pondage. Very popular fly fishing water." },

  // Alpine — Lake Eildon
  { slug: "lake-eildon--delatite-arm", name: "Delatite Arm", regionSlug: "lake-eildon", description: "Long north arm of Lake Eildon with excellent golden perch and Murray cod on the timber and rock structure. Trout also present." },
  { slug: "lake-eildon--big-river-arm", name: "Big River Arm", regionSlug: "lake-eildon", description: "Productive upper arm of the reservoir with excellent golden perch, cod, and rainbow trout. Remote camping access." },
  { slug: "lake-eildon--jerusalem-creek", name: "Jerusalem Creek Area", regionSlug: "lake-eildon", description: "Creek arm on the western side of Eildon with big cod in the snags and golden perch in the open water." },

  // Alpine — Ovens / King Rivers
  { slug: "ovens-king-rivers--bright-ovens-river", name: "Ovens River — Bright", regionSlug: "ovens-king-rivers", description: "Crystal-clear freestone river through Bright's autumn foliage. Wild brown trout in the runs and pools. Fly fishing and spinning." },
  { slug: "ovens-king-rivers--myrtleford-section", name: "Ovens River — Myrtleford", regionSlug: "ovens-king-rivers", description: "Lower gradient section with bigger pools and trophy brown trout. Evening rise fishing in summer under overhanging willows." },
  { slug: "ovens-king-rivers--king-river-cheshunt", name: "King River — Cheshunt", regionSlug: "ovens-king-rivers", description: "Remote upper King River with wild brown and rainbow trout. Minimal access keeps pressure low. Spectacular alpine scenery." },

  // Alpine — Goulburn River VIC
  { slug: "goulburn-river-vic--thornton-upper-goulburn", name: "Upper Goulburn — Thornton", regionSlug: "goulburn-river-vic", description: "Premier Victorian trout stream above Lake Eildon. Wild brown trout on the dry fly. Evening rise in summer is legendary." },
  { slug: "goulburn-river-vic--rubicon-river", name: "Rubicon River", regionSlug: "goulburn-river-vic", description: "Tributary of the Goulburn with small wild brown trout. Remote forest fishing with minimal angling pressure." },
  { slug: "goulburn-river-vic--jamieson-goulburn", name: "Goulburn River — Jamieson", regionSlug: "goulburn-river-vic", description: "Section near Jamieson with excellent trout populations. Tussock grassland banks and clear runs for dry fly presentation." },

  // Alpine — Arthurs Lake TAS
  { slug: "arthurs-lake-tas--arthurs-lake-shallows", name: "Arthurs Lake Shallows", regionSlug: "arthurs-lake-tas", description: "Famous polaroiding shallows where large trout can be sight-fished. Spring and autumn produce prolific brown trout activity." },
  { slug: "arthurs-lake-tas--pine-tier-lagoon", name: "Pine Tier Lagoon", regionSlug: "arthurs-lake-tas", description: "Small connected lagoon with excellent dry fly fishing. Dun season hatches bring up large brown trout on the surface." },
  { slug: "arthurs-lake-tas--arthurs-lake-dam", name: "Arthurs Lake Dam Area", regionSlug: "arthurs-lake-tas", description: "Deep water near the dam structure. Troll for large lake-dwelling brown trout. Winter fishing for fish seeking depth." },

  // Alpine — Lake St Clair
  { slug: "lake-st-clair--narcissus-river-mouth", name: "Narcissus River Mouth", regionSlug: "lake-st-clair", description: "Remote river delta only accessible by boat or walking track. Exceptional brown and rainbow trout in the inflow zone." },
  { slug: "lake-st-clair--cynthia-bay", name: "Cynthia Bay Shallows", regionSlug: "lake-st-clair", description: "Accessible shallow end of the lake near the visitor centre. Polaroid fishing for trout in the clear rocky shallows." },
  { slug: "lake-st-clair--derwent-outflow", name: "Derwent River Outflow", regionSlug: "lake-st-clair", description: "The upper Derwent leaving Lake St Clair. Wild brown trout in crystal-clear alpine water. Remote wilderness fly fishing." },

  // NT Top End — Darwin
  { slug: "darwin--darwin-harbour", name: "Darwin Harbour", regionSlug: "darwin", description: "Australia's tropical fishing capital. Black jewfish, barramundi, and mangrove jack in the harbour creeks. Accessible year-round." },
  { slug: "darwin--bynoe-harbour", name: "Bynoe Harbour", regionSlug: "darwin", description: "Large tidal harbour south of Darwin with excellent barramundi and mangrove jack. Estuary access by boat through mangrove channels." },
  { slug: "darwin--darwin-offshore-reefs", name: "Darwin Offshore Reefs", regionSlug: "darwin", description: "Shallow tropical reefs with coral trout, red emperor, and queenfish. Spanish mackerel and GT on the outer edges." },
  { slug: "darwin--shoal-bay", name: "Shoal Bay Estuary", regionSlug: "darwin", description: "Large tidal flat northeast of Darwin with exceptional barramundi in the creek systems. Saltwater crocodile country." },

  // NT Top End — Daly River
  { slug: "daly-river--daly-river-middle-reaches", name: "Daly River Middle Reaches", regionSlug: "daly-river", description: "Legendary barramundi water in the tidal middle Daly. Trophy barra in the pools and snag-filled banks. Dry season access." },
  { slug: "daly-river--daly-river-upper-tidal", name: "Upper Tidal Reaches", regionSlug: "daly-river", description: "Transition zone where the tidal influence ends. Peak barramundi concentration in late dry season as water drops." },
  { slug: "daly-river--flora-river", name: "Flora River", regionSlug: "daly-river", description: "Freshwater tributary with saratoga, freshwater crocodile, and barramundi in the pools. Remote and pristine." },

  // NT Top End — Katherine
  { slug: "katherine-river--nitmiluk-gorge", name: "Nitmiluk Gorge", regionSlug: "katherine-river", description: "Spectacular sandstone gorge with barramundi in the deep pools. Canoe access between gorge sections. Dry season only." },
  { slug: "katherine-river--katherine-river-lower", name: "Katherine River Lower Reaches", regionSlug: "katherine-river", description: "Tidal lower section with barramundi, mangrove jack, and saratoga. Strong runs when dry season concentrates fish." },
  { slug: "katherine-river--edith-river", name: "Edith River Falls", regionSlug: "katherine-river", description: "Crystal-clear tributary with freshwater fish below the falls. Sooty grunter and barramundi in the deep rock pools." },

  // NT Top End — Kakadu
  { slug: "kakadu--south-alligator-river", name: "South Alligator River", regionSlug: "kakadu", description: "World Heritage estuary with some of Australia's most prolific barramundi fishing. Tidal channels and billabongs teeming with barra." },
  { slug: "kakadu--east-alligator-river", name: "East Alligator River", regionSlug: "kakadu", description: "Remote river on the Arnhem Land border. Exceptional barramundi with mangrove jack and threadfin salmon. Permit required." },
  { slug: "kakadu--yellow-water-billabong", name: "Yellow Water Billabong", regionSlug: "kakadu", description: "Famous Kakadu wetland with prolific wildlife and barramundi. Fishing from the elevated banks or by charter boat." },

  // NT Top End — Arnhem Land
  { slug: "arnhem-land--nhulunbuy-reefs", name: "Nhulunbuy Offshore Reefs", regionSlug: "arnhem-land", description: "Remote Gulf of Carpentaria reefs with red emperor, coral trout, and GT. Accessible from Nhulunbuy with permit." },
  { slug: "arnhem-land--arafura-sea-coast", name: "Arafura Sea Coastline", regionSlug: "arnhem-land", description: "Remote pristine coastline with queenfish, Spanish mackerel, and GT on the flats and reef edges. Live-aboard access." },
  { slug: "arnhem-land--blyth-river", name: "Blyth River", regionSlug: "arnhem-land", description: "Remote Arnhem Land river with world-class barramundi, mangrove jack, and threadfin salmon. Permit required for access." },

  // NT Gulf — Groote Eylandt
  { slug: "groote-eylandt--groote-eylandt-reefs", name: "Groote Eylandt Reef Systems", regionSlug: "groote-eylandt", description: "Pristine Gulf of Carpentaria reefs with red emperor, coral trout, and giant trevally. Remote island access by live-aboard." },
  { slug: "groote-eylandt--anindilyakwa-channels", name: "Anindilyakwa Tidal Channels", regionSlug: "groote-eylandt", description: "Tidal channels around the island with barramundi, queenfish, and GT. Permit required to fish with traditional landowners." },
  { slug: "groote-eylandt--bickerton-island", name: "Bickerton Island", regionSlug: "groote-eylandt", description: "Adjacent island with excellent reef fishing and pristine estuary barramundi access. Remote and uncrowded." },

  // NT Gulf — Borroloola
  { slug: "borroloola--sir-edward-pellew-islands", name: "Sir Edward Pellew Islands", regionSlug: "borroloola", description: "Island group in the Gulf with world-class reef fishing for red emperor and coral trout. GT and queenfish on the flats." },
  { slug: "borroloola--mcarthur-river", name: "McArthur River", regionSlug: "borroloola", description: "Remote Gulf river with trophy barramundi and black jewfish. Dry season camping and fishing in the remote outback." },
  { slug: "borroloola--robinson-river", name: "Robinson River", regionSlug: "borroloola", description: "Gulf tributary with excellent barramundi and threadfin salmon. Very remote with minimal access and fishing pressure." },

  // NT Gulf — Roper River
  { slug: "roper-river--roper-river-tidal", name: "Roper River Tidal Reaches", regionSlug: "roper-river", description: "Large tidal estuary with trophy barramundi, mangrove jack, and threadfin salmon. Remote eastern Arnhem Land." },
  { slug: "roper-river--ngukurr-section", name: "Ngukurr Section", regionSlug: "roper-river", description: "River section near the indigenous community with excellent barramundi in the dry season pools." },
  { slug: "roper-river--limmen-bight", name: "Limmen Bight", regionSlug: "roper-river", description: "Gulf coast at the river mouth with queenfish, GT, and threadfin salmon on the tidal flats and reef edges." },

  // WA Kimberley — Broome
  { slug: "broome--dampier-peninsula-creeks", name: "Dampier Peninsula Creek Systems", regionSlug: "broome", description: "Remote creek systems on the Dampier Peninsula with excellent barramundi in the upper tidal reaches. 4WD access required." },
  { slug: "broome--roebuck-bay", name: "Roebuck Bay", regionSlug: "broome", description: "Large tidal bay with threadfin salmon, queenfish, and barramundi in the mangrove creek mouths. Spectacular tidal range." },
  { slug: "broome--eighty-mile-beach-north", name: "80-Mile Beach North", regionSlug: "broome", description: "Pristine remote beach north of Broome with whiting, queenfish, and salmon. 4WD access along the beach at low tide." },

  // WA Kimberley — Kununurra
  { slug: "kununurra--lake-argyle", name: "Lake Argyle", regionSlug: "kununurra", description: "One of Australia's largest reservoirs. Massive barramundi and saratoga. Trophy fish in the submerged ranges and creek arms." },
  { slug: "kununurra--ord-river", name: "Ord River", regionSlug: "kununurra", description: "Below Lake Argyle spillway to the estuary. Trophy barramundi in tailwater and main river. Excellent barra country." },
  { slug: "kununurra--keep-river", name: "Keep River National Park", regionSlug: "kununurra", description: "Spectacular sandstone gorge country with barramundi and sooty grunter in the remote pools. 4WD and walking access." },

  // WA Kimberley — Derby
  { slug: "derby--king-sound", name: "King Sound", regionSlug: "derby", description: "Massive tidal sound with the world's highest tides. Barramundi, queenfish, and threadfin salmon in the creek mouths on the run-in tide." },
  { slug: "derby--fitzroy-river-lower", name: "Lower Fitzroy River", regionSlug: "derby", description: "Lower tidal reaches of the Fitzroy with excellent barramundi and black jewfish. Big tides move fish actively." },
  { slug: "derby--stokes-bay", name: "Stokes Bay", regionSlug: "derby", description: "Remote bay in King Sound with queenfish, trevally, and GT on the rocky points. Barramundi in the creek mouths." },

  // WA Kimberley — Fitzroy Crossing
  { slug: "fitzroy-crossing--fitzroy-river-gorge", name: "Fitzroy River Gorge", regionSlug: "fitzroy-crossing", description: "Deep river pools in Geikie Gorge with large barramundi and freshwater crocodile. Boat tours and fishing access." },
  { slug: "fitzroy-crossing--upper-fitzroy", name: "Upper Fitzroy Reaches", regionSlug: "fitzroy-crossing", description: "Remote upper river with saratoga, bream, and barramundi in the deep rock pools. Camping access off the highway." },
  { slug: "fitzroy-crossing--christmas-creek", name: "Christmas Creek", regionSlug: "fitzroy-crossing", description: "Tributary of the Fitzroy with excellent barramundi in the monsoon season. Remote station country fishing." },

  // WA Pilbara — Exmouth / Ningaloo
  { slug: "exmouth-ningaloo--ningaloo-reef-flats", name: "Ningaloo Reef Flats", regionSlug: "exmouth-ningaloo", description: "World Heritage reef with pristine GT fishing on the flats and coral trout on the reef edge. Unparalleled fishing in crystal-clear water." },
  { slug: "exmouth-ningaloo--exmouth-gulf", name: "Exmouth Gulf", regionSlug: "exmouth-ningaloo", description: "Sheltered gulf with excellent spangled emperor, queenfish, and mangrove jack. Protected from the Indian Ocean swell." },
  { slug: "exmouth-ningaloo--lighthouse-bay", name: "Lighthouse Bay", regionSlug: "exmouth-ningaloo", description: "Shore-based fishing on the cape with GT, trevally, and queenfish from the reef edge. Whale sharks and manta rays nearby." },
  { slug: "exmouth-ningaloo--muiron-islands", name: "Muiron Islands", regionSlug: "exmouth-ningaloo", description: "Small island group north of Exmouth with exceptional reef fishing. Coral trout, red emperor, and sailfish in season." },

  // WA Pilbara — Karratha / Dampier
  { slug: "karratha-dampier--montebello-islands-offshore", name: "Dampier Archipelago", regionSlug: "karratha-dampier", description: "Island group off Dampier with excellent coral trout, red emperor, and queenfish. Remote boat camping access." },
  { slug: "karratha-dampier--legendre-island", name: "Legendre Island", regionSlug: "karratha-dampier", description: "Remote offshore island with pristine reef fishing. GT, wahoo, and Spanish mackerel on the outer edges." },
  { slug: "karratha-dampier--fortescue-river", name: "Fortescue River Mouth", regionSlug: "karratha-dampier", description: "River mouth estuary with queenfish and barramundi. Accessible 4WD track along the Pilbara coast." },

  // WA Pilbara — Port Hedland
  { slug: "port-hedland--80-mile-beach", name: "80-Mile Beach", regionSlug: "port-hedland", description: "One of WA's iconic beach fishing locations with whiting, tailor, and trevally. Vehicle beach access along the vast sand beach." },
  { slug: "port-hedland--port-hedland-harbour", name: "Port Hedland Harbour", regionSlug: "port-hedland", description: "Large industrial harbour with barramundi, mangrove jack, and queenfish in the creek systems. Accessible boat ramp." },
  { slug: "port-hedland--de-grey-river", name: "De Grey River", regionSlug: "port-hedland", description: "Seasonal river south of Port Hedland with barramundi in the tidal lower reaches after the wet season." },

  // WA Pilbara — Montebello Islands
  { slug: "montebello-islands--montebello-main-group", name: "Montebello Main Island Group", regionSlug: "montebello-islands", description: "Remote island chain with world-class GT, Spanish mackerel, coral trout, and red emperor. Accessible by live-aboard charter only." },
  { slug: "montebello-islands--barrow-island", name: "Barrow Island Adjacent Waters", regionSlug: "montebello-islands", description: "Waters around Barrow Island with exceptional pelagic action. Wahoo, Spanish mackerel, and GT on the offshore banks." },
  { slug: "montebello-islands--lowendal-islands", name: "Lowendal Islands", regionSlug: "montebello-islands", description: "Small island group near the Montebellos with pristine fishing pressure and excellent coral reef species diversity." },

  // WA Mid West — Geraldton / Abrolhos Islands
  { slug: "geraldton--abrolhos-islands-reefs", name: "Houtman Abrolhos Islands", regionSlug: "geraldton", description: "WA's premier fishing destination. Outstanding dhufish, baldchin groper, pink snapper, and coral trout on pristine reef systems. Accessible by flight or charter." },
  { slug: "geraldton--geraldton-offshore-reefs", name: "Geraldton Offshore Reefs", regionSlug: "geraldton", description: "Nearshore reef systems accessible by trailer boat. Dhufish, pink snapper, and baldchin groper on the limestone reefs." },
  { slug: "geraldton--murchison-river-mouth", name: "Murchison River Mouth", regionSlug: "geraldton", description: "River mouth and Kalbarri area south of Geraldton. Rock lobster, bream, and tailor. Kalbarri cliff fishing for pink snapper." },

  // WA Mid West — Shark Bay
  { slug: "shark-bay--monkey-mia-flats", name: "Monkey Mia Flats", regionSlug: "shark-bay", description: "Shallow seagrass flats with snapper, trevally, and whiting. The iconic dolphin beach is nearby. Calm protected fishing." },
  { slug: "shark-bay--denham-sound", name: "Denham Sound", regionSlug: "shark-bay", description: "Protected sound with excellent snapper and pink snapper on the reef systems. Tiger sharks common in season." },
  { slug: "shark-bay--steep-point", name: "Steep Point (Westernmost Australia)", regionSlug: "shark-bay", description: "Remote headland — the westernmost point of Australia. Excellent shore-based fishing for pink snapper and pelagics. 4WD essential." },

  // WA Mid West — Carnarvon
  { slug: "carnarvon--gascoyne-river-mouth", name: "Gascoyne River Mouth", regionSlug: "carnarvon", description: "River estuary with mulloway, snapper, and tailor. The river mouth bar holds bream and flathead year-round." },
  { slug: "carnarvon--bernier-island", name: "Bernier & Dorre Islands", regionSlug: "carnarvon", description: "Remote islands off Carnarvon with excellent pink snapper and dhufish. Accessible by charter boat in calm conditions." },
  { slug: "carnarvon--point-quobba", name: "Point Quobba", regionSlug: "carnarvon", description: "Remote north of Carnarvon with excellent shore fishing. Pink snapper, trevally, and mackerel from the blowholes area." },

  // WA Southwest — Perth / Rottnest
  { slug: "perth-rottnest--rottnest-island-reefs", name: "Rottnest Island Reefs", regionSlug: "perth-rottnest", description: "World-class dhufish, pink snapper, and baldchin groper on the pristine limestone reefs. 20km offshore from Fremantle." },
  { slug: "perth-rottnest--two-rocks-wanneroo", name: "Two Rocks / Yanchep Reefs", regionSlug: "perth-rottnest", description: "Northern Perth reefs with dhufish and snapper. Popular trailer-boat destination with good boat ramp facilities." },
  { slug: "perth-rottnest--metropolitan-reefs", name: "Perth Metropolitan Reefs", regionSlug: "perth-rottnest", description: "Accessible reefs within 10km of the Perth beaches. Dhufish, snapper, and trevally. Popular half-day fishing destination." },
  { slug: "perth-rottnest--cockburn-sound", name: "Cockburn Sound", regionSlug: "perth-rottnest", description: "Sheltered sound south of Fremantle with King George whiting, snapper, and flathead. Protected from the Indian Ocean swell." },

  // WA Southwest — Mandurah
  { slug: "mandurah--peel-inlet", name: "Peel Inlet", regionSlug: "mandurah", description: "Large estuarine lake with excellent bream, black bream, and flathead. King George whiting in the deeper channels in season." },
  { slug: "mandurah--harvey-estuary", name: "Harvey Estuary", regionSlug: "mandurah", description: "Southern inlet with bream and flathead. Accessible by small boat through the estuary system. Popular family fishing." },
  { slug: "mandurah--mandurah-offshore-reefs", name: "Mandurah Offshore Reefs", regionSlug: "mandurah", description: "Accessible offshore reefs with dhufish, snapper, and pink snapper. Short run from Mandurah boat harbour." },

  // WA Southwest — Bunbury / Margaret River
  { slug: "bunbury-margaret-river--bunbury-offshore", name: "Bunbury Offshore Reefs", regionSlug: "bunbury-margaret-river", description: "Southwest WA reefs with snapper, pink snapper, and dhufish. Tailor and salmon from the surf beaches." },
  { slug: "bunbury-margaret-river--margaret-river-mouth", name: "Margaret River Mouth", regionSlug: "bunbury-margaret-river", description: "River mouth surf beach with excellent tailor and salmon. Popular surfers' coast also delivers good shore fishing." },
  { slug: "bunbury-margaret-river--cape-naturaliste", name: "Cape Naturaliste", regionSlug: "bunbury-margaret-river", description: "Headland with excellent dhufish and pink snapper offshore. Shore fishing for tailor and salmon around the cape." },

  // WA Southwest — Albany
  { slug: "albany--two-peoples-bay", name: "Two Peoples Bay", regionSlug: "albany", description: "Remote bay east of Albany with excellent dhufish and snapper. Sheltered from the Southern Ocean swells most of the year." },
  { slug: "albany--king-george-sound", name: "King George Sound", regionSlug: "albany", description: "Massive natural harbour with pink snapper, dhufish, and blue-eye trevalla. Southern bluefin tuna access nearby." },
  { slug: "albany--bremer-canyon", name: "Bremer Bay Canyon", regionSlug: "albany", description: "Deep submarine canyon with sperm whales and exceptional fishing. Yellowtail kingfish, pink snapper, and rare deep-water species." },
  { slug: "albany--denmark-wilson-inlet", name: "Denmark / Wilson Inlet", regionSlug: "albany", description: "Sheltered inlet with black bream, flathead, and mulloway. Beautiful karri forest backdrop in the southwest corner." },

  // WA Southwest — Esperance
  { slug: "esperance--recherche-archipelago", name: "Recherche Archipelago", regionSlug: "esperance", description: "Remote island chain with over 100 islands. Pristine reef fishing for pink snapper, dhufish, and SBT. Live-aboard access." },
  { slug: "esperance--cape-le-grand", name: "Cape Le Grand", regionSlug: "esperance", description: "Spectacular national park coastline with excellent shore fishing for tailor, salmon, and snapper. Beautiful white beaches." },
  { slug: "esperance--esperance-offshore", name: "Esperance Offshore Reefs", regionSlug: "esperance", description: "Accessible offshore reefs with pink snapper, dhufish, and southern bluefin tuna. Remote south coast fishing." },

  // SA Spencer Gulf — Whyalla
  { slug: "whyalla--upper-spencer-gulf", name: "Upper Spencer Gulf", regionSlug: "whyalla", description: "Warm shallow gulf with excellent snapper and King George whiting. Giant Australian cuttlefish gather here in winter to breed." },
  { slug: "whyalla--point-lowly", name: "Point Lowly", regionSlug: "whyalla", description: "Headland with deep water access for snapper and mulloway. Rock fishing for snapper and tailor from the limestone platform." },
  { slug: "whyalla--arno-bay-area", name: "Arno Bay", regionSlug: "whyalla", description: "Protected bay on Eyre Peninsula with excellent King George whiting, snapper, and southern calamari." },

  // SA Spencer Gulf — Port Augusta
  { slug: "port-augusta--spencer-gulf-mid", name: "Mid Spencer Gulf", regionSlug: "port-augusta", description: "Central gulf waters with excellent snapper in winter and King George whiting year-round. Accessible from boat ramp." },
  { slug: "port-augusta--franklin-harbour", name: "Franklin Harbour", regionSlug: "port-augusta", description: "Sheltered harbour at Cowell with excellent King George whiting and snapper. Protected boat launching." },
  { slug: "port-augusta--buttercup-stony-point", name: "Stony Point Reef", regionSlug: "port-augusta", description: "Rocky reef system in the central gulf with snapper and mulloway in the tidal channels." },

  // SA Spencer Gulf — Yorke Peninsula
  { slug: "yorke-peninsula--corny-point", name: "Corny Point", regionSlug: "yorke-peninsula", description: "Remote southern Yorke Peninsula with excellent snapper and King George whiting. Southern bluefin tuna offshore in summer." },
  { slug: "yorke-peninsula--marion-bay", name: "Marion Bay", regionSlug: "yorke-peninsula", description: "Protected bay on the southern tip of Yorke Peninsula with snapper, KGW, and mulloway. Gateway to Innes NP fishing." },
  { slug: "yorke-peninsula--edithburgh", name: "Edithburgh", regionSlug: "yorke-peninsula", description: "Sheltered fishing port with excellent King George whiting in the gulf. Popular jetty and boat fishing destination." },

  // SA South — Adelaide
  { slug: "adelaide-gulf-st-vincent--outer-harbour", name: "Outer Harbour Reefs", regionSlug: "adelaide-gulf-st-vincent", description: "Accessible offshore reefs north of Adelaide with snapper, King George whiting, and mulloway. Trailer-boat destination." },
  { slug: "adelaide-gulf-st-vincent--port-noarlunga", name: "Port Noarlunga Reef", regionSlug: "adelaide-gulf-st-vincent", description: "Marine reserve reef south of Adelaide with snapper and KGW. Popular snorkel, dive, and fishing destination." },
  { slug: "adelaide-gulf-st-vincent--aldinga-beach", name: "Aldinga Beach", regionSlug: "adelaide-gulf-st-vincent", description: "Southern Adelaide coast with jetty fishing for snapper, garfish, and KGW. Beach casting for salmon in autumn." },

  // SA South — Port Lincoln
  { slug: "port-lincoln--boston-bay", name: "Boston Bay", regionSlug: "port-lincoln", description: "Protected bay with excellent snapper and King George whiting. Southern bluefin tuna cage experience nearby." },
  { slug: "port-lincoln--neptune-islands", name: "Neptune Islands", regionSlug: "port-lincoln", description: "Remote islands in the mouth of Spencer Gulf. Exceptional SBT trolling and snapper. Also famous for great white sharks." },
  { slug: "port-lincoln--thistle-island", name: "Thistle Island", regionSlug: "port-lincoln", description: "Remote island with dhufish, snapper, and KGW. Accessible by charter for serious offshore fishing in pristine waters." },
  { slug: "port-lincoln--coffin-bay-area", name: "Coffin Bay National Park Coast", regionSlug: "port-lincoln", description: "Pristine remote coastline with excellent snapper and KGW. Camping access to remote beach locations." },

  // SA South — Coffin Bay
  { slug: "coffin-bay--coffin-bay-inlet", name: "Coffin Bay Inlet", regionSlug: "coffin-bay", description: "Pristine sheltered waters with excellent King George whiting and snapper. World-famous oysters grown in the same waters." },
  { slug: "coffin-bay--elliston-offshore", name: "Elliston Offshore", regionSlug: "coffin-bay", description: "Remote west Eyre Peninsula with excellent snapper and Southern bluefin tuna. Minimal fishing pressure in remote waters." },
  { slug: "coffin-bay--mount-wedge", name: "Mount Wedge Coast", regionSlug: "coffin-bay", description: "Remote southern Eyre Peninsula coastline. Rock fishing for snapper and salmon. 4WD access only to pristine fishing." },

  // SA South — Kangaroo Island
  { slug: "kangaroo-island--cape-du-couedic", name: "Cape du Couedic", regionSlug: "kangaroo-island", description: "Wild southern cape with excellent rock fishing for salmon, sweep, and snapper. New Zealand fur seal colony nearby." },
  { slug: "kangaroo-island--vivonne-bay", name: "Vivonne Bay", regionSlug: "kangaroo-island", description: "Southern bay with excellent King George whiting and snapper. Clear water and minimal fishing pressure. Beach access." },
  { slug: "kangaroo-island--backstairs-passage", name: "Backstairs Passage", regionSlug: "kangaroo-island", description: "Tidal channel between KI and the mainland. Excellent snapper, kingfish, and SBT in the ripping currents." },

  // SA South — Coorong
  { slug: "coorong--coorong-lagoon", name: "Coorong Lagoon", regionSlug: "coorong", description: "Unique 140km lagoon system with excellent mulloway and bream. Estuary-dependent species thriving behind the dunes." },
  { slug: "coorong--murray-mouth", name: "Murray Mouth", regionSlug: "coorong", description: "Murray River mouth where estuary fish concentrate. Mulloway, bream, and flathead in the brackish mixing zone." },
  { slug: "coorong--lower-lakes", name: "Lower Lakes (Albert & Alexandrina)", regionSlug: "coorong", description: "Large freshwater lakes with Murray cod, golden perch, and European perch. Excellent accessible fishing near Meningie." },

  // SA South — Victor Harbor
  { slug: "victor-harbor--encounter-bay", name: "Encounter Bay", regionSlug: "victor-harbor", description: "Bay south of Victor Harbor with snapper in winter and King George whiting in summer. Southern bluefin tuna offshore in season." },
  { slug: "victor-harbor--granite-island", name: "Granite Island Reef", regionSlug: "victor-harbor", description: "Causeway-connected island with excellent rock fishing for sweep, snapper, and garfish. KGW off the jetty in season." },
  { slug: "victor-harbor--rapid-bay", name: "Rapid Bay", regionSlug: "victor-harbor", description: "Clear water bay with excellent snapper on the artificial reef below the old jetty. KGW and squid year-round." },

  // Christmas Island
  { slug: "christmas-island--flying-fish-cove", name: "Flying Fish Cove", regionSlug: "christmas-island", description: "Main anchorage on Christmas Island. GT, trevally, and mahi-mahi close to the cliffs. Accessible shore and boat fishing." },
  { slug: "christmas-island--christmas-island-flats", name: "Christmas Island Flats", regionSlug: "christmas-island", description: "World-famous GT on fly and light lure. Bonefish and milkfish on the coral flats surrounding the island. Bucket-list destination." },
  { slug: "christmas-island--christmas-island-offshore", name: "Christmas Island Blue Water", regionSlug: "christmas-island", description: "Offshore trolling for wahoo, yellowfin tuna, and mahi-mahi. Short runs from the harbour to productive blue water." },

  // Cocos (Keeling) Islands
  { slug: "cocos-keeling-islands--cocos-lagoon-flats", name: "Cocos Lagoon Flats", regionSlug: "cocos-keeling-islands", description: "Crystal-clear lagoon atoll with extraordinary GT, bonefish, and permit on the flats. One of the world's most remote fishing destinations." },
  { slug: "cocos-keeling-islands--north-keeling-island", name: "North Keeling Island Drop-Off", regionSlug: "cocos-keeling-islands", description: "Uninhabited northern atoll with pristine marine reserve. Deep drop-offs hold large GT and pelagics. Permit and charter access." },
  { slug: "cocos-keeling-islands--cocos-blue-water", name: "Cocos Offshore Blue Water", regionSlug: "cocos-keeling-islands", description: "Yellowfin tuna, wahoo, and dogtooth tuna in the deep Indian Ocean waters surrounding the atoll. Remote live-aboard fishing." },
];
