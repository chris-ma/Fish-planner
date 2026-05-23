export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

const SPECIES = [
  { slug: "black-marlin",          scientific: "Istiompax indica" },
  { slug: "blue-marlin",           scientific: "Makaira nigricans" },
  { slug: "sailfish",              scientific: "Istiophorus platypterus" },
  { slug: "yellowfin-tuna",        scientific: "Thunnus albacares" },
  { slug: "longtail-tuna",         scientific: "Thunnus tonggol" },
  { slug: "southern-bluefin-tuna", scientific: "Thunnus maccoyii" },
  { slug: "spanish-mackerel",      scientific: "Scomberomorus commerson" },
  { slug: "wahoo",                 scientific: "Acanthocybium solandri" },
  { slug: "mahi-mahi",             scientific: "Coryphaena hippurus" },
  { slug: "yellowtail-kingfish",   scientific: "Seriola lalandi" },
  { slug: "kingfish-qld",          scientific: "Seriola hippos" },
  { slug: "giant-trevally",        scientific: "Caranx ignobilis" },
  { slug: "queenfish",             scientific: "Scomberoides commersonnianus" },
  { slug: "threadfin-salmon",      scientific: "Polydactylus macrochir" },
  { slug: "cobia",                 scientific: "Rachycentron canadum" },
  { slug: "coral-trout",           scientific: "Plectropomus leopardus" },
  { slug: "red-emperor",           scientific: "Lutjanus sebae" },
  { slug: "nannygai",              scientific: "Centroberyx affinis" },
  { slug: "spangled-emperor",      scientific: "Lethrinus nebulosus" },
  { slug: "rankin-cod",            scientific: "Epinephelus multinotatus" },
  { slug: "snapper",               scientific: "Pagrus auratus" },
  { slug: "dhufish",               scientific: "Glaucosoma hebraicum" },
  { slug: "baldchin-groper",       scientific: "Choerodon rubescens" },
  { slug: "blue-eye-trevalla",     scientific: "Hyperoglyphe antarctica" },
  { slug: "striped-trumpeter",     scientific: "Latris lineata" },
  { slug: "barramundi",            scientific: "Lates calcarifer" },
  { slug: "mangrove-jack",         scientific: "Lutjanus argentimaculatus" },
  { slug: "flathead",              scientific: "Platycephalus fuscus" },
  { slug: "bream",                 scientific: "Acanthopagrus australis" },
  { slug: "black-bream",           scientific: "Acanthopagrus butcheri" },
  { slug: "whiting",               scientific: "Sillago ciliata" },
  { slug: "king-george-whiting",   scientific: "Sillaginodes punctata" },
  { slug: "luderick",              scientific: "Girella tricuspidata" },
  { slug: "mulloway",              scientific: "Argyrosomus japonicus" },
  { slug: "jewfish",               scientific: "Protonibea diacanthus" },
  { slug: "tailor",                scientific: "Pomatomus saltatrix" },
  { slug: "australian-salmon",     scientific: "Arripis trutta" },
  { slug: "gummy-shark",           scientific: "Mustelus antarcticus" },
  { slug: "bonefish",              scientific: "Albula vulpes" },
  { slug: "milkfish",              scientific: "Chanos chanos" },
  { slug: "murray-cod",            scientific: "Maccullochella peelii" },
  { slug: "golden-perch",          scientific: "Macquaria ambigua" },
  { slug: "silver-perch",          scientific: "Bidyanus bidyanus" },
  { slug: "redfin",                scientific: "Perca fluviatilis" },
  { slug: "catfish",               scientific: "Tandanus tandanus" },
  { slug: "australian-bass",       scientific: "Macquaria novemaculeata" },
  { slug: "saratoga",              scientific: "Scleropages leichardtii" },
  { slug: "brown-trout",           scientific: "Salmo trutta" },
  { slug: "rainbow-trout",         scientific: "Oncorhynchus mykiss" },
  { slug: "ocean-trout",           scientific: "Oncorhynchus mykiss" },
];

export async function GET() {
  const result: Record<string, string> = {};

  for (const { slug, scientific } of SPECIES) {
    try {
      const res = await fetch(
        `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(scientific)}&rank=species&photos=true`,
        { headers: { "User-Agent": "fish-planner/1.0" }, cache: "no-store" }
      );
      const data = await res.json();
      const photo = data.results?.[0]?.default_photo;
      if (photo?.url) result[slug] = photo.url;
    } catch {
      // leave slug absent; falls through to Pexels fallback
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  const lines = Object.entries(result)
    .map(([k, v]) => `  "${k}": "${v}",`)
    .join("\n");

  const output = `export const INAT_SPECIES_PHOTOS: Record<string, string> = {\n${lines}\n};`;

  return new NextResponse(output, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
