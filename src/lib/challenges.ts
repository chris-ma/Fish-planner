export type ChallengeMetric = "length" | "weight" | "gallery" | "species_count" | "ratio";
export type ChallengeDataSource = "bucket_list" | "tagged" | "instagram";

export interface ChallengeConfig {
  slug: string;
  title: string;
  description: string;
  image: string;
  metric: ChallengeMetric;
  unit: string | null;
  speciesSlug: string | null;
  requiresField: "lengthCm" | "weightKg" | "lineWeightLb" | null;
  dataSource: ChallengeDataSource;
  hashtags?: string[];
  maxLineWeightLb?: number;
}

export const CHALLENGES: ChallengeConfig[] = [
  {
    slug: "3-meter-flatty",
    title: "3 Meter Flatty",
    description: "The longest flathead from anyone's bucket list. Log your PB catch and it appears here automatically.",
    image: "https://images.pexels.com/photos/3048522/pexels-photo-3048522.jpeg?auto=compress&cs=tinysrgb&w=600",
    metric: "length",
    unit: "cm",
    speciesSlug: "flathead",
    requiresField: null,
    dataSource: "bucket_list",
  },
  {
    slug: "4lb-club",
    title: "4lb Club",
    description: "Caught on 4lb leader or lighter. Log your catch in your bucket list with the leader weight and your biggest fish appears here automatically.",
    image: "https://images.pexels.com/photos/5200238/pexels-photo-5200238.jpeg?auto=compress&cs=tinysrgb&w=600",
    metric: "length",
    unit: "cm",
    speciesSlug: null,
    requiresField: null,
    dataSource: "bucket_list",
    maxLineWeightLb: 4,
  },
  {
    slug: "the-dumbest-catch",
    title: "The Dumbest Catch",
    description: "Catch a legal fish on something that has no right working. Post it on Instagram with #HooklineDumbest then submit your post link — the community votes with hearts.",
    image: "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=600",
    metric: "gallery",
    unit: null,
    speciesSlug: null,
    requiresField: null,
    dataSource: "instagram",
    hashtags: ["HooklineDumbest"],
  },
  {
    slug: "grand-slam",
    title: "Grand Slam",
    description: "Most distinct bucket list species logged in a single day. The session with the longest species list tops the board.",
    image: "https://images.pexels.com/photos/2156311/pexels-photo-2156311.jpeg?auto=compress&cs=tinysrgb&w=600",
    metric: "species_count",
    unit: "species",
    speciesSlug: null,
    requiresField: null,
    dataSource: "bucket_list",
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
    dataSource: "tagged",
  },
  {
    slug: "mud-marlin",
    title: "Mud Marlin",
    description: "The heaviest European carp from anyone's bucket list. Invasive and destructive, but a hell of a fight.",
    image: "https://images.pexels.com/photos/1461471/pexels-photo-1461471.jpeg?auto=compress&cs=tinysrgb&w=600",
    metric: "weight",
    unit: "kg",
    speciesSlug: "european-carp",
    requiresField: null,
    dataSource: "bucket_list",
  },
];
