export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

// Maps zone slug → Wikipedia article title that has the best representative photo
const ZONES: { slug: string; article: string }[] = [
  { slug: "far_north_qld",   article: "Cape York Peninsula" },
  { slug: "central_qld",     article: "Whitsunday Islands" },
  { slug: "southeast_qld",   article: "Gold Coast, Queensland" },
  { slug: "nsw",             article: "Sydney" },
  { slug: "vic_coast",       article: "Great Ocean Road" },
  { slug: "tas",             article: "Tasmania" },
  { slug: "lord_howe",       article: "Lord Howe Island" },
  { slug: "murray_darling",  article: "Murray River" },
  { slug: "alpine",          article: "Australian Alps" },
  { slug: "nt_top_end",      article: "Darwin, Northern Territory" },
  { slug: "nt_gulf",         article: "Gulf of Carpentaria" },
  { slug: "wa_kimberley",    article: "Kimberley (Western Australia)" },
  { slug: "wa_pilbara",      article: "Ningaloo Reef" },
  { slug: "wa_mid_west",     article: "Geraldton" },
  { slug: "wa_southwest",    article: "Margaret River, Western Australia" },
  { slug: "sa_spencer_gulf", article: "Spencer Gulf" },
  { slug: "sa_south",        article: "Kangaroo Island" },
  { slug: "christmas_island", article: "Christmas Island" },
  { slug: "cocos_islands",   article: "Cocos (Keeling) Islands" },
];

export async function GET() {
  const result: Record<string, string> = {};

  for (const { slug, article } of ZONES) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(article)}`,
        { headers: { "User-Agent": "fish-planner/1.0 (crispy-studios@hotmail.com)" } }
      );
      const data = await res.json();
      // originalimage is full resolution; thumbnail is resized by Wikipedia
      const url = data.originalimage?.source ?? data.thumbnail?.source;
      if (url) result[slug] = url;
    } catch {
      // falls through to Pexels fallback
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  const lines = Object.entries(result)
    .map(([k, v]) => `  "${k}": "${v}",`)
    .join("\n");

  const output = `export const WIKI_ZONE_PHOTOS: Record<string, string> = {\n${lines}\n};`;

  return new NextResponse(output, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
