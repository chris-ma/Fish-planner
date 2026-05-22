// Greg Vinall — Australian Lure Fishing Podcast (Doc Lures)
// Spotify show: https://open.spotify.com/show/3rYuJCGW8SCE1YsewBWgps
// Website:      https://doclures.com

export const PODCAST_SHOW_URL = "https://open.spotify.com/show/3rYuJCGW8SCE1YsewBWgps";

export interface PodcastEpisode {
  title: string;
  url: string; // open.spotify.com/episode/... or doclures.com page (has embedded Spotify player)
}

// Species slug → relevant episodes
export const SPECIES_EPISODES: Record<string, PodcastEpisode[]> = {
  barramundi: [
    { title: "Mackay Headlands Barramundi – Ep 591", url: "https://open.spotify.com/episode/1x4ADeRqNTLMDZwjJwxSjO" },
    { title: "Lakefield National Park Barramundi", url: "https://open.spotify.com/episode/5VvT2aZnG5Id0vfWKxRqGY" },
    { title: "Blue Mud Bay Barramundi – Ep 430", url: "https://open.spotify.com/episode/5ob0h0EdWBZat2hzc3Z37a" },
  ],
  flathead: [
    { title: "Topwater Flathead Masterclass – Simon Cross", url: "https://open.spotify.com/episode/1Jk1l3HS37YkLvuUYbPEZB" },
    { title: "Monster Flathead at Sussex Inlet", url: "https://open.spotify.com/episode/1l8F93GXnIAbuU2LhWiRoI" },
    { title: "Forster Topwater Flathead – Ep 601", url: "https://open.spotify.com/episode/24r92CvlmhT6wgVR9BvRHW" },
    { title: "Hastings River Flathead – Ep 333", url: "https://open.spotify.com/episode/4mP2cHdFOmISSUaPABH6ep" },
  ],
  "mangrove-jack": [
    { title: "How to Catch Mangrove Jack on Lures – Gold Coast", url: "https://open.spotify.com/episode/3kXrez5lDDZ44EBBefQkqi" },
    { title: "Noosa River Mangrove Jack – Ep 184", url: "https://doclures.com/noosa-river-mangrove-jack-phippsy/" },
    { title: "Cairns Mangrove Jack – Ep 257", url: "https://doclures.com/cairns-mangrove-jack-phil-laycock/" },
    { title: "Maroochy River Mangrove Jack – Ep 326", url: "https://doclures.com/maroochy-mangrove-jack-luke-opelt/" },
  ],
  mulloway: [
    { title: "Land-based Botany Bay: Mulloway Madness", url: "https://open.spotify.com/episode/63briBeO44hhc6udXw7qsw" },
    { title: "Lake Macquarie Jewfish – Ep 402", url: "https://doclures.com/lake-macquarie-jewfish-garret-windeatt/" },
    { title: "NSW South Coast Jewfish – Ep 51", url: "https://doclures.com/nsw-south-coast-jewfish-steve-starling/" },
  ],
  whiting: [
    { title: "Mastering Topwater Whiting on Lures", url: "https://open.spotify.com/episode/5lwJ710c3xDJcxUTPGqX8k" },
    { title: "SEQ Whiting – Ep 133", url: "https://doclures.com/seq-whiting-brad-smith/" },
  ],
  bream: [
    { title: "Hobart Bream Masterclass – Derwent Estuary", url: "https://doclures.com/fishing-in-hobart/" },
    { title: "Gold Coast Canal Bream", url: "https://doclures.com/gold-coast-canal-bream-stephen-maas/" },
    { title: "Bemm River Bream – Ep 314", url: "https://doclures.com/bemm-bream-byron-tea-hill/" },
  ],
  snapper: [
    { title: "Sydney Snapper – Ep 131", url: "https://doclures.com/sydney-snapper-steve-winser/" },
    { title: "Melbourne Metro Winter Snapper – Ep 72", url: "https://doclures.com/port-phillip-bay-winter-snapper-paul-malov/" },
    { title: "NE Tasmania Snapper – Ep 576", url: "https://doclures.com/ne-tasmania-snapper-jack-gillespie/" },
  ],
  "yellowtail-kingfish": [
    { title: "Melbourne Kingfish – Ep 480", url: "https://doclures.com/melbourne-kingfish-lee-rayner/" },
    { title: "Pittwater Kingfish – Ep 528", url: "https://doclures.com/pittwater-kingfish-shroom-peter-le-blang/" },
    { title: "Wollongong Kingfish – Ep 408", url: "https://doclures.com/wollongong-kingfish-vicki-lear/" },
  ],
  "murray-cod": [
    { title: "Nagambie Murray Cod – Ep 600", url: "https://doclures.com/nagambie-murray-cod-sunny-brislin-martins/" },
    { title: "Burrinjuck Dam Murray Cod – Ep 395", url: "https://doclures.com/burrinjuck-murray-cod-daniel-webber/" },
    { title: "Murray Cod with Rod McKenzie – Ep 16", url: "https://doclures.com/murray-cod-fishing-rod-mackenzie-codmac/" },
    { title: "Condamine River Murray Cod – Ep 461", url: "https://doclures.com/condamine-murray-cod-morgan-taylor/" },
  ],
  "golden-perch": [
    { title: "Cooby & Cressbrook Dam Yellowbelly", url: "https://open.spotify.com/episode/3Bc8V9qaE2mM9KL3wzCPIq" },
    { title: "Murray River Yellowbelly – Ep 121", url: "https://doclures.com/murray-river-yellowbelly-stephen-booth/" },
    { title: "Canberra Yellowbelly – Ep 486", url: "https://doclures.com/canberra-yellowbelly-rory-benn-clibborn/" },
  ],
  "australian-bass": [
    { title: "Nepean River Australian Bass", url: "https://open.spotify.com/episode/1oLAhkJ4peuuniMMZUtWtI" },
    { title: "Gippsland Australian Bass – Ep 479", url: "https://doclures.com/gippsland-bass-brett-geddes/" },
    { title: "Everything About Brisbane Bass", url: "https://doclures.com/brisbane-bass-tim-morgan/" },
  ],
  "brown-trout": [
    { title: "Mastering Eucumbene Trout", url: "https://open.spotify.com/episode/4JlniqozYvMGqpD2e6oFHj" },
    { title: "Secrets of Fishing Lake Dartmouth for Trout", url: "https://open.spotify.com/episode/2spApWgvPuXOEPtLv75pOZ" },
  ],
  "rainbow-trout": [
    { title: "Mastering Eucumbene Trout", url: "https://open.spotify.com/episode/4JlniqozYvMGqpD2e6oFHj" },
    { title: "Secrets of Fishing Lake Dartmouth for Trout", url: "https://open.spotify.com/episode/2spApWgvPuXOEPtLv75pOZ" },
  ],
  "ocean-trout": [
    { title: "Mastering Eucumbene Trout", url: "https://open.spotify.com/episode/4JlniqozYvMGqpD2e6oFHj" },
    { title: "Fishing in Hobart – Sea-run Trout & Bream", url: "https://doclures.com/fishing-in-hobart/" },
  ],
  "coral-trout": [
    { title: "Whitsundays Land-based Coral Trout – Ep 377", url: "https://doclures.com/whitsundays-land-based-coral-trout-andy-thomsen/" },
    { title: "Hinchinbrook Coral Trout – Ep 320", url: "https://doclures.com/hinchinbrook-coral-trout-jimmy-falkenberg/" },
    { title: "Townsville Coral Trout – Ep 291", url: "https://doclures.com/townsville-coral-trout-kyle-hennig/" },
    { title: "Yeppoon Coral Trout – Ep 158", url: "https://doclures.com/yeppoon-coral-trout-chris-henry/" },
  ],
  "black-marlin": [
    { title: "Sydney Black Marlin – Ep 11", url: "https://doclures.com/sydney-black-marlin-fishing-tim-simpson/" },
    { title: "Sunshine Coast Black Marlin – Ep 403", url: "https://doclures.com/sunshine-coast-black-marlin-david-granville/" },
  ],
  "blue-marlin": [
    { title: "Sydney Black Marlin – Ep 11", url: "https://doclures.com/sydney-black-marlin-fishing-tim-simpson/" },
  ],
  sailfish: [
    { title: "Sunshine Coast Black Marlin & Sailfish – Ep 403", url: "https://doclures.com/sunshine-coast-black-marlin-david-granville/" },
  ],
  "yellowfin-tuna": [
    { title: "SE Queensland Yellowfin Tuna", url: "https://doclures.com/seq-yellowfin-tuna-kaspar-lenigas/" },
    { title: "Coral Sea Dogtooth Tuna", url: "https://open.spotify.com/episode/1S2DOghderJoaXZCSKlb37" },
  ],
  "longtail-tuna": [
    { title: "SE Queensland Yellowfin Tuna", url: "https://doclures.com/seq-yellowfin-tuna-kaspar-lenigas/" },
  ],
  "southern-bluefin-tuna": [
    { title: "Eaglehawk Neck Southern Bluefin Tuna – Ep 13", url: "https://doclures.com/eaglehawk-neck-southern-bluefin-tuna-with-stu-nichols/" },
  ],
  "spanish-mackerel": [
    { title: "Gold Coast Spotted Mackerel", url: "https://doclures.com/gold-coast-spotted-mackerel-brad-smith/" },
  ],
  tailor: [
    { title: "Gold Coast Tailor Fishing", url: "https://doclures.com/gold-coast-tailor-fishing-paul-burt/" },
  ],
  "giant-trevally": [
    { title: "Conquering Land-based Giant Trevally", url: "https://open.spotify.com/episode/2Lgd3uuGCjGDPUqLFDyErl" },
    { title: "Whitsundays Giant Trevally – Ep 246", url: "https://doclures.com/whitsundays-giant-trevally-tony-bygrave/" },
    { title: "Brisbane Giant Trevally", url: "https://doclures.com/brisbane-giant-trevally-anthony-cass/" },
  ],
  "red-emperor": [
    { title: "Groote Eylandt Red Emperor & Fingermark", url: "https://doclures.com/groote-eylandt-reds-flats-bomber-farrell/" },
  ],
  nannygai: [
    { title: "Bloomfield Nannygai", url: "https://doclures.com/bloomfield-nannygai-nicko-fewtrell/" },
  ],
  redfin: [
    { title: "Lake Purrumbete Redfin Perch – Ep 243", url: "https://doclures.com/lake-purrumbete-redfin-perch-michael-evans/" },
  ],
  "queenfish": [
    { title: "Beach Pelagics incl. Queenfish – Ep 558", url: "https://doclures.com/beach-pelagics-ben-svenson/" },
  ],
  "threadfin-salmon": [
    { title: "Broome Blue Nosed Threadfin – Ep 89", url: "https://doclures.com/broome-blue-nosed-threadfin-mark-bantich/" },
    { title: "Fitzroy River Threadfin Salmon – Ep 29", url: "https://doclures.com/fitzroy-river-threadfin-salmon-john-haenke/" },
    { title: "Brisbane River King Threadfin – Ep 4", url: "https://doclures.com/brisbane-river-king-threadfin-fishing-steve-morgan/" },
  ],
  "spangled-emperor": [
    { title: "Exmouth Shore-based Spangled Emperor – Ep 39", url: "https://doclures.com/exmouth-shore-based-spangled-emperor-steve-riley/" },
  ],
  "dhufish": [
    { title: "Exmouth Goldband Snapper & Dhufish", url: "https://doclures.com/exmouth-goldband-snapper-steve-riley/" },
  ],
  "king-george-whiting": [
    { title: "King George Whiting on Lures – Bomber Farrell", url: "https://doclures.com/king-george-whiting-on-lures-unravelling-the-mysteries/" },
    { title: "Port Sorell King George Whiting – Ep 441", url: "https://doclures.com/port-sorell-king-george-whiting-jarvis-wall/" },
  ],
  "milkfish": [
    { title: "Beach Pelagics – Ben Svenson (milkfish tactics)", url: "https://doclures.com/beach-pelagics-ben-svenson/" },
  ],
};

// Region slug → relevant episodes
export const REGION_EPISODES: Record<string, PodcastEpisode[]> = {
  cairns: [
    { title: "Cairns Mangrove Jack – Ep 257", url: "https://doclures.com/cairns-mangrove-jack-phil-laycock/" },
    { title: "Sydney Black Marlin (marlin tactics) – Ep 11", url: "https://doclures.com/sydney-black-marlin-fishing-tim-simpson/" },
  ],
  townsville: [
    { title: "Townsville Coral Trout – Ep 291", url: "https://doclures.com/townsville-coral-trout-kyle-hennig/" },
    { title: "Townsville Beach Barramundi – Ep 405", url: "https://doclures.com/townsville-beach-barramundi-vinnie-versfeld/" },
  ],
  "airlie-beach": [
    { title: "Whitsundays Land-based Coral Trout – Ep 377", url: "https://doclures.com/whitsundays-land-based-coral-trout-andy-thomsen/" },
    { title: "Whitsundays Giant Trevally – Ep 246", url: "https://doclures.com/whitsundays-giant-trevally-tony-bygrave/" },
  ],
  yeppoon: [
    { title: "Yeppoon Coral Trout – Ep 158", url: "https://doclures.com/yeppoon-coral-trout-chris-henry/" },
  ],
  "sunshine-coast": [
    { title: "Sunshine Coast Winter Fishing Spots – Ep 506", url: "https://doclures.com/nigel-webster-sunshine-coast-winter-fishing-spots/" },
    { title: "Sunshine Coast Black Marlin – Ep 403", url: "https://doclures.com/sunshine-coast-black-marlin-david-granville/" },
    { title: "Sunshine Coast Coral Trout – Ep 218", url: "https://doclures.com/sunshine-coast-coral-trout-nigel-webster/" },
    { title: "Maroochy River Mangrove Jack – Ep 326", url: "https://doclures.com/maroochy-mangrove-jack-luke-opelt/" },
  ],
  "brisbane-moreton-bay": [
    { title: "Brisbane Land-based Winter Spots – Ep 532", url: "https://doclures.com/land-based-fishing-brisbane-beau-rixon/" },
    { title: "Brisbane Giant Trevally", url: "https://doclures.com/brisbane-giant-trevally-anthony-cass/" },
    { title: "Everything About Brisbane Bass", url: "https://doclures.com/brisbane-bass-tim-morgan/" },
    { title: "SE Queensland Yellowfin Tuna", url: "https://doclures.com/seq-yellowfin-tuna-kaspar-lenigas/" },
  ],
  "gold-coast": [
    { title: "How to Catch Mangrove Jack – Gold Coast", url: "https://open.spotify.com/episode/3kXrez5lDDZ44EBBefQkqi" },
    { title: "Gold Coast Canal Bream", url: "https://doclures.com/gold-coast-canal-bream-stephen-maas/" },
    { title: "Gold Coast Spotted Mackerel", url: "https://doclures.com/gold-coast-spotted-mackerel-brad-smith/" },
    { title: "Gold Coast Tailor Fishing", url: "https://doclures.com/gold-coast-tailor-fishing-paul-burt/" },
    { title: "Gold Coast Land-based Sport Fishing – Ep 86", url: "https://doclures.com/gold-coast-land-based-sport-fishing-andy-sparnon/" },
  ],
  sydney: [
    { title: "Sydney Snapper – Ep 131", url: "https://doclures.com/sydney-snapper-steve-winser/" },
    { title: "Sydney Black Marlin – Ep 11", url: "https://doclures.com/sydney-black-marlin-fishing-tim-simpson/" },
    { title: "Pittwater Kingfish – Ep 528", url: "https://doclures.com/pittwater-kingfish-shroom-peter-le-blang/" },
    { title: "Land-based Botany Bay: Mulloway Madness", url: "https://open.spotify.com/episode/63briBeO44hhc6udXw7qsw" },
  ],
  hawkesbury: [
    { title: "Hawkesbury Estuary Perch", url: "https://doclures.com/hawkesbury-river-estuary-perch-dan-selby/" },
  ],
  "hawkesbury-river": [
    { title: "Hawkesbury Estuary Perch", url: "https://doclures.com/hawkesbury-river-estuary-perch-dan-selby/" },
  ],
  wollongong: [
    { title: "Wollongong Kingfish – Ep 408", url: "https://doclures.com/wollongong-kingfish-vicki-lear/" },
  ],
  "port-macquarie": [
    { title: "Hastings River Flathead – Ep 333", url: "https://open.spotify.com/episode/4mP2cHdFOmISSUaPABH6ep" },
  ],
  "south-west-rocks": [
    { title: "Monster Flathead at Sussex Inlet (nearby NSW coast)", url: "https://open.spotify.com/episode/1l8F93GXnIAbuU2LhWiRoI" },
  ],
  "coffs-harbour": [
    { title: "Coffs Harbour Mangrove Jack – Ep 293", url: "https://doclures.com/coffs-harbour-mangrove-jack-with-shane-holding/" },
  ],
  "port-stephens": [
    { title: "Monster Flathead at Sussex Inlet", url: "https://open.spotify.com/episode/1l8F93GXnIAbuU2LhWiRoI" },
    { title: "Land-based Botany Bay: Mulloway Madness", url: "https://open.spotify.com/episode/63briBeO44hhc6udXw7qsw" },
  ],
  "lake-macquarie": [
    { title: "Lake Macquarie Jewfish – Ep 402", url: "https://doclures.com/lake-macquarie-jewfish-garret-windeatt/" },
  ],
  "port-phillip-bay": [
    { title: "Melbourne Kingfish – Ep 480", url: "https://doclures.com/melbourne-kingfish-lee-rayner/" },
    { title: "Melbourne Metro Winter Snapper – Ep 72", url: "https://doclures.com/port-phillip-bay-winter-snapper-paul-malov/" },
    { title: "Corio Bay & Geelong Fishing Spots – Ep 557", url: "https://doclures.com/corio-geelong-fishing-spots-john-didge/" },
    { title: "Melbourne Estuary Perch", url: "https://doclures.com/melbourne-estuary-perch-lee-rayner/" },
  ],
  "lakes-entrance": [
    { title: "Gippsland Australian Bass – Ep 479", url: "https://doclures.com/gippsland-bass-brett-geddes/" },
    { title: "Top 5 Winter Fishing Spots in Gippsland – Ep 507", url: "https://doclures.com/five-best-gippsland-fishing-spots-winter-brett-geddes/" },
    { title: "Gippsland Estuary Perch", url: "https://doclures.com/south-gippsland-estuary-perch-casey-george/" },
  ],
  hobart: [
    { title: "Fishing in Hobart: Bream Masterclass", url: "https://doclures.com/fishing-in-hobart/" },
    { title: "NE Tasmania Snapper – Ep 576", url: "https://doclures.com/ne-tasmania-snapper-jack-gillespie/" },
  ],
  "st-helens": [
    { title: "Eaglehawk Neck Southern Bluefin Tuna – Ep 13", url: "https://doclures.com/eaglehawk-neck-southern-bluefin-tuna-with-stu-nichols/" },
    { title: "NE Tasmania Snapper – Ep 576", url: "https://doclures.com/ne-tasmania-snapper-jack-gillespie/" },
  ],
  "bruny-island": [
    { title: "Eaglehawk Neck Southern Bluefin Tuna – Ep 13", url: "https://doclures.com/eaglehawk-neck-southern-bluefin-tuna-with-stu-nichols/" },
    { title: "Fishing in Hobart: Bream Masterclass", url: "https://doclures.com/fishing-in-hobart/" },
  ],
  "port-arthur": [
    { title: "Eaglehawk Neck Southern Bluefin Tuna – Ep 13", url: "https://doclures.com/eaglehawk-neck-southern-bluefin-tuna-with-stu-nichols/" },
  ],
  "murray-river-echuca": [
    { title: "Nagambie Murray Cod – Ep 600", url: "https://doclures.com/nagambie-murray-cod-sunny-brislin-martins/" },
    { title: "Murray River Yellowbelly – Ep 121", url: "https://doclures.com/murray-river-yellowbelly-stephen-booth/" },
  ],
  "murray-river-albury": [
    { title: "Burrinjuck Dam Murray Cod – Ep 395", url: "https://doclures.com/burrinjuck-murray-cod-daniel-webber/" },
    { title: "Murray Cod with Rod McKenzie – Ep 16", url: "https://doclures.com/murray-cod-fishing-rod-mackenzie-codmac/" },
  ],
  "murray-river-mildura": [
    { title: "Murray Cod with Rod McKenzie – Ep 16", url: "https://doclures.com/murray-cod-fishing-rod-mackenzie-codmac/" },
    { title: "Murray River Yellowbelly – Ep 121", url: "https://doclures.com/murray-river-yellowbelly-stephen-booth/" },
  ],
  "lake-mulwala": [
    { title: "Murray Cod with Rod McKenzie – Ep 16", url: "https://doclures.com/murray-cod-fishing-rod-mackenzie-codmac/" },
    { title: "Cooby & Cressbrook Dam Yellowbelly", url: "https://open.spotify.com/episode/3Bc8V9qaE2mM9KL3wzCPIq" },
  ],
  "murrumbidgee-river": [
    { title: "Murrumbidgee River Murray Cod – Ep 625", url: "https://doclures.com/murrumbidgee-murray-cod-tyson-zarew/" },
    { title: "Murray Cod with Rod McKenzie – Ep 16", url: "https://doclures.com/murray-cod-fishing-rod-mackenzie-codmac/" },
  ],
  "lake-eucumbene": [
    { title: "Mastering Eucumbene Trout", url: "https://open.spotify.com/episode/4JlniqozYvMGqpD2e6oFHj" },
  ],
  "lake-jindabyne": [
    { title: "Mastering Eucumbene Trout", url: "https://open.spotify.com/episode/4JlniqozYvMGqpD2e6oFHj" },
    { title: "Five Best Winter Fishing Spots Around Canberra – Ep 520", url: "https://doclures.com/best-winter-fishing-spots-canberra-romen-dicovski/" },
  ],
  "snowy-mountains-rivers": [
    { title: "Mastering Eucumbene Trout", url: "https://open.spotify.com/episode/4JlniqozYvMGqpD2e6oFHj" },
  ],
  "lake-eildon": [
    { title: "Secrets of Fishing Lake Dartmouth for Trout", url: "https://open.spotify.com/episode/2spApWgvPuXOEPtLv75pOZ" },
    { title: "Nagambie Murray Cod – Ep 600", url: "https://doclures.com/nagambie-murray-cod-sunny-brislin-martins/" },
  ],
  "ovens-king-rivers": [
    { title: "Secrets of Fishing Lake Dartmouth for Trout", url: "https://open.spotify.com/episode/2spApWgvPuXOEPtLv75pOZ" },
  ],
  "arthurs-lake-tas": [
    { title: "Mastering Eucumbene Trout", url: "https://open.spotify.com/episode/4JlniqozYvMGqpD2e6oFHj" },
    { title: "Fishing in Hobart: Bream Masterclass", url: "https://doclures.com/fishing-in-hobart/" },
  ],
  "darwin": [
    { title: "Darwin Barramundi – Ep 165", url: "https://doclures.com/darwin-barramundi-charlotte-klose/" },
    { title: "Darwin Harbour Barramundi – Ep 114", url: "https://doclures.com/darwin-harbour-barramundi-alex-julius/" },
    { title: "Victoria & Roper Rivers Barramundi", url: "https://doclures.com/victoria-river-barramundi/" },
  ],
  "daly-river": [
    { title: "Daly River Barramundi – Ep 496", url: "https://doclures.com/daly-river-barramundi-glenn-watt/" },
    { title: "Darwin Barramundi – Ep 165", url: "https://doclures.com/darwin-barramundi-charlotte-klose/" },
  ],
  "katherine-river": [
    { title: "Victoria & Roper Rivers Barramundi", url: "https://doclures.com/victoria-river-barramundi/" },
  ],
  "kakadu": [
    { title: "Darwin Harbour Barramundi – Ep 114", url: "https://doclures.com/darwin-harbour-barramundi-alex-julius/" },
    { title: "Daly River Barramundi – Ep 496", url: "https://doclures.com/daly-river-barramundi-glenn-watt/" },
  ],
  "groote-eylandt": [
    { title: "Groote Eylandt Red Emperor & Fingermark", url: "https://doclures.com/groote-eylandt-reds-flats-bomber-farrell/" },
    { title: "Victoria & Roper Rivers Barramundi", url: "https://doclures.com/victoria-river-barramundi/" },
  ],
  "borroloola": [
    { title: "Victoria & Roper Rivers Barramundi", url: "https://doclures.com/victoria-river-barramundi/" },
    { title: "Groote Eylandt Red Emperor & Fingermark", url: "https://doclures.com/groote-eylandt-reds-flats-bomber-farrell/" },
  ],
  "broome": [
    { title: "Broome Blue Nosed Threadfin – Ep 89", url: "https://doclures.com/broome-blue-nosed-threadfin-mark-bantich/" },
    { title: "Fitzroy River Threadfin Salmon – Ep 29", url: "https://doclures.com/fitzroy-river-threadfin-salmon-john-haenke/" },
  ],
  "kununurra": [
    { title: "Daly River Barramundi (Kimberley tactics) – Ep 496", url: "https://doclures.com/daly-river-barramundi-glenn-watt/" },
  ],
  "exmouth-ningaloo": [
    { title: "Fishing Around Exmouth in Spring – Ep 547", url: "https://doclures.com/exmouth-spring-fishing-spots-steve-riley/" },
    { title: "Exmouth Sailfish", url: "https://doclures.com/exmouth-sailfish-steve-riley/" },
    { title: "Exmouth Shore-based Spangled Emperor – Ep 39", url: "https://doclures.com/exmouth-shore-based-spangled-emperor-steve-riley/" },
    { title: "Exmouth Goldband Snapper", url: "https://doclures.com/exmouth-goldband-snapper-steve-riley/" },
  ],
  "geraldton": [
    { title: "King George Whiting on Lures – Bomber Farrell", url: "https://doclures.com/king-george-whiting-on-lures-unravelling-the-mysteries/" },
  ],
  "perth-rottnest": [
    { title: "Swan River Bream Fishing – Ep 123", url: "https://doclures.com/swan-river-bream-fishing-paul-burton/" },
  ],
  "mandurah": [
    { title: "Swan River Bream Fishing – Ep 123", url: "https://doclures.com/swan-river-bream-fishing-paul-burton/" },
  ],
  "whyalla": [
    { title: "King George Whiting on Lures – Bomber Farrell", url: "https://doclures.com/king-george-whiting-on-lures-unravelling-the-mysteries/" },
  ],
  "yorke-peninsula": [
    { title: "King George Whiting on Lures – Bomber Farrell", url: "https://doclures.com/king-george-whiting-on-lures-unravelling-the-mysteries/" },
  ],
  "port-lincoln": [
    { title: "King George Whiting on Lures – Bomber Farrell", url: "https://doclures.com/king-george-whiting-on-lures-unravelling-the-mysteries/" },
    { title: "Eaglehawk Neck Southern Bluefin Tuna – Ep 13", url: "https://doclures.com/eaglehawk-neck-southern-bluefin-tuna-with-stu-nichols/" },
  ],
  "kangaroo-island": [
    { title: "Eaglehawk Neck Southern Bluefin Tuna – Ep 13", url: "https://doclures.com/eaglehawk-neck-southern-bluefin-tuna-with-stu-nichols/" },
    { title: "King George Whiting on Lures – Bomber Farrell", url: "https://doclures.com/king-george-whiting-on-lures-unravelling-the-mysteries/" },
  ],
  "christmas-island": [
    { title: "Conquering Land-based Giant Trevally", url: "https://open.spotify.com/episode/2Lgd3uuGCjGDPUqLFDyErl" },
    { title: "Beach Pelagics – Ben Svenson (island tactics)", url: "https://doclures.com/beach-pelagics-ben-svenson/" },
  ],
  "cocos-keeling-islands": [
    { title: "Conquering Land-based Giant Trevally", url: "https://open.spotify.com/episode/2Lgd3uuGCjGDPUqLFDyErl" },
    { title: "Beach Pelagics – Ben Svenson (island tactics)", url: "https://doclures.com/beach-pelagics-ben-svenson/" },
  ],
};
