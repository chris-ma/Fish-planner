export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

// Only the zones that returned maps/flags/signs on the first pass — fetching better articles
const ZONES: { slug: string; article: string }[] = [
  { slug: "far_north_qld",    article: "Daintree National Park" },
  { slug: "central_qld",      article: "Whitehaven Beach" },
  { slug: "vic_coast",        article: "Twelve Apostles, Victoria" },
  { slug: "tas",              article: "Cradle Mountain-Lake St Clair National Park" },
  { slug: "murray_darling",   article: "Echuca" },
  { slug: "nt_gulf",          article: "Karumba, Queensland" },
  { slug: "wa_kimberley",     article: "Purnululu National Park" },
  { slug: "wa_southwest",     article: "Cape Leeuwin" },
  { slug: "sa_spencer_gulf",  article: "Port Lincoln" },
  { slug: "christmas_island", article: "Christmas Island red crab" },
  { slug: "cocos_islands",    article: "Direction Island, Cocos (Keeling) Islands" },
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

  const output = `// Second-pass zone photos — merge these with the good ones from pass 1\n{\n${lines}\n}`;

  return new NextResponse(output, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
