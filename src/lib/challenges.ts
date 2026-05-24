export type ChallengeMetric = "length" | "weight" | "gallery" | "species_count";

export interface ChallengeConfig {
  slug: string;
  title: string;
  description: string;
  image: string;
  metric: ChallengeMetric;
  unit: string | null;
  speciesSlug: string | null;
  requiresField: "lengthCm" | "weightKg" | "gearUsed" | null;
}

export const CHALLENGES: ChallengeConfig[] = [
  {
    slug: "3-meter-flatty",
    title: "3 Meter Flatty",
    description: "The biggest flathead caught and documented. Platycephalus fuscus grows to 120cm — your PB is your target.",
    image: "https://images.pexels.com/photos/3048522/pexels-photo-3048522.jpeg?auto=compress&cs=tinysrgb&w=600",
    metric: "length",
    unit: "cm",
    speciesSlug: "flathead",
    requiresField: "lengthCm",
  },
  {
    slug: "4lb-club",
    title: "4lb Club",
    description: "The heaviest fish on 4lb fluorocarbon leader. Finesse, patience, and a lot of luck required.",
    image: "https://images.pexels.com/photos/5200238/pexels-photo-5200238.jpeg?auto=compress&cs=tinysrgb&w=600",
    metric: "weight",
    unit: "kg",
    speciesSlug: null,
    requiresField: "weightKg",
  },
  {
    slug: "the-dumbest-catch",
    title: "The Dumbest Catch",
    description: "Catch a legal fish on something that has no right working — bread, a rubber duck, a spoon from the camp kitchen.",
    image: "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=600",
    metric: "gallery",
    unit: null,
    speciesSlug: null,
    requiresField: "gearUsed",
  },
  {
    slug: "grand-slam",
    title: "Grand Slam",
    description: "Most different species in a single session. Estuary, inshore, reef — the angler with the longest list wins.",
    image: "https://images.pexels.com/photos/2156311/pexels-photo-2156311.jpeg?auto=compress&cs=tinysrgb&w=600",
    metric: "species_count",
    unit: "species",
    speciesSlug: null,
    requiresField: null,
  },
  {
    slug: "catch-and-cook",
    title: "Catch & Cook",
    description: "Keep a legal feed and cook it on the water — open fire, camp stove, or BBQ on the back of the boat.",
    image: "https://images.pexels.com/photos/1680779/pexels-photo-1680779.jpeg?auto=compress&cs=tinysrgb&w=600",
    metric: "gallery",
    unit: null,
    speciesSlug: null,
    requiresField: null,
  },
  {
    slug: "mud-marlin",
    title: "Mud Marlin",
    description: "The biggest European carp you can find. Invasive and destructive, but a hell of a fight. Kill it, eat it, compost it.",
    image: "https://images.pexels.com/photos/1461471/pexels-photo-1461471.jpeg?auto=compress&cs=tinysrgb&w=600",
    metric: "weight",
    unit: "kg",
    speciesSlug: "european-carp",
    requiresField: "weightKg",
  },
];
