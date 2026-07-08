import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { listSpecies } from "@/lib/queries/species";
import { listRegions } from "@/lib/queries/regions";
import { getExperiences } from "@/lib/queries/experiences";
import { getCharters } from "@/lib/queries/charters";
import { CHALLENGES } from "@/lib/challenges";

export const dynamic = "force-dynamic";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/species", priority: 0.8, changeFrequency: "weekly" },
  { path: "/regions", priority: 0.8, changeFrequency: "weekly" },
  { path: "/experiences", priority: 0.8, changeFrequency: "weekly" },
  { path: "/charters", priority: 0.8, changeFrequency: "weekly" },
  { path: "/challenges", priority: 0.6, changeFrequency: "weekly" },
  { path: "/resources", priority: 0.5, changeFrequency: "monthly" },
  { path: "/gear", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.3, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.3, changeFrequency: "yearly" },
  { path: "/editorial/environmental-impact", priority: 0.4, changeFrequency: "monthly" },
  { path: "/editorial/local-businesses", priority: 0.4, changeFrequency: "monthly" },
  { path: "/editorial/mental-health", priority: 0.4, changeFrequency: "monthly" },
  { path: "/editorial/sustainability", priority: 0.4, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allSpecies, allRegions, allExperiences, allCharters] = await Promise.all([
    listSpecies(),
    listRegions(),
    getExperiences(),
    getCharters(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const speciesEntries: MetadataRoute.Sitemap = allSpecies.map((s) => ({
    url: `${SITE_URL}/species/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const regionEntries: MetadataRoute.Sitemap = allRegions.map((r) => ({
    url: `${SITE_URL}/regions/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const experienceEntries: MetadataRoute.Sitemap = allExperiences.map((e) => ({
    url: `${SITE_URL}/experiences/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const charterEntries: MetadataRoute.Sitemap = allCharters.map((c) => ({
    url: `${SITE_URL}/charters/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const challengeEntries: MetadataRoute.Sitemap = CHALLENGES.map((c) => ({
    url: `${SITE_URL}/challenges/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...speciesEntries,
    ...regionEntries,
    ...experienceEntries,
    ...charterEntries,
    ...challengeEntries,
  ];
}
