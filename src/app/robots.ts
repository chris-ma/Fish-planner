import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/trips/new"],
        // /trips (index) and /trips/[id] hold private, per-user trip data — never crawl.
        // /profile, /onboarding, /bucket-list are auth-gated account flows that show only
        // generic sign-in boilerplate to an anonymous crawler.
        // /plan is intentionally left crawlable (not disallowed) so Google can see its
        // noindex meta tag directly, since it duplicates /experiences and /species content.
        disallow: ["/api/", "/profile", "/profile/", "/onboarding", "/bucket-list", "/trips", "/trips/", "/sign-in", "/sign-up"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
