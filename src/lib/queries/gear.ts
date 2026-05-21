import { db } from "@/db";
import { gearTemplates, species } from "@/db/schema";
import { eq, inArray, or } from "drizzle-orm";

const SPECIES_TRIP_TYPE: Record<string, string> = {
  "black-marlin": "offshore_pelagic",
  "blue-marlin": "offshore_pelagic",
  "sailfish": "offshore_pelagic",
  "yellowfin-tuna": "offshore_pelagic",
  "longtail-tuna": "offshore_pelagic",
  "spanish-mackerel": "offshore_pelagic",
  "wahoo": "offshore_pelagic",
  "mahi-mahi": "offshore_pelagic",
  "yellowtail-kingfish": "inshore_sport",
  "giant-trevally": "inshore_sport",
  "cobia": "inshore_sport",
  "tailor": "inshore_sport",
  "coral-trout": "reef",
  "red-emperor": "reef",
  "nannygai": "reef",
  "snapper": "reef",
  "kingfish-qld": "reef",
  "barramundi": "estuary",
  "mangrove-jack": "estuary",
  "flathead": "estuary",
  "mulloway": "estuary",
  "bream": "estuary",
  "whiting": "estuary",
  "luderick": "estuary",
  "jewfish": "estuary",
};

export async function getGearForTripType(tripType: string) {
  return db
    .select()
    .from(gearTemplates)
    .where(or(eq(gearTemplates.tripType, tripType), eq(gearTemplates.tripType, "all")))
    .orderBy(gearTemplates.category, gearTemplates.isEssential);
}

export async function getGearForSpeciesSlugs(speciesSlugs: string[]) {
  const tripTypes = new Set<string>();
  for (const slug of speciesSlugs) {
    const type = SPECIES_TRIP_TYPE[slug];
    if (type) tripTypes.add(type);
  }

  if (tripTypes.size === 0) return getGearForTripType("all");

  const types = Array.from(tripTypes);
  return db
    .select()
    .from(gearTemplates)
    .where(
      or(
        eq(gearTemplates.tripType, "all"),
        ...(types.length > 0 ? [inArray(gearTemplates.tripType, types)] : [])
      )
    )
    .orderBy(gearTemplates.category, gearTemplates.isEssential);
}

export function tripTypeLabel(tripType: string): string {
  const labels: Record<string, string> = {
    offshore_pelagic: "Offshore Pelagic",
    reef: "Reef Fishing",
    estuary: "Estuary Fishing",
    inshore_sport: "Inshore Sport",
  };
  return labels[tripType] ?? tripType;
}

export const TRIP_TYPES = [
  { value: "offshore_pelagic", label: "Offshore Pelagic", description: "Marlin, tuna, wahoo, mahi-mahi" },
  { value: "reef", label: "Reef Fishing", description: "Coral trout, snapper, red emperor" },
  { value: "estuary", label: "Estuary Fishing", description: "Barra, flathead, bream, mulloway" },
  { value: "inshore_sport", label: "Inshore Sport", description: "Kingfish, GT, cobia, Spanish mackerel" },
];
