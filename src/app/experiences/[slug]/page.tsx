export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { species } from "@/db/schema";
import { getExperienceBySlug, getExperiences, getDestinationsForExperienceAllRegions } from "@/lib/queries/experiences";
import type { Region, Destination } from "@/db/schema";
import { EXPERIENCE_TIPS } from "@/lib/experience-tips";
import { SPECIES_GEAR } from "@/lib/gear-specs";

const CATEGORY_BADGE: Record<string, string> = {
  offshore:   "bg-blue-500/20 text-blue-300",
  reef:       "bg-orange-500/20 text-orange-300",
  estuary:    "bg-teal-500/20 text-teal-300",
  inshore:    "bg-cyan-500/20 text-cyan-300",
  freshwater: "bg-emerald-500/20 text-emerald-300",
};

const CATEGORY_IMAGE: Record<string, string> = {
  offshore:   "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1200",
  reef:       "https://images.pexels.com/photos/1591938/pexels-photo-1591938.jpeg?auto=compress&cs=tinysrgb&w=1200",
  estuary:    "https://images.pexels.com/photos/3048522/pexels-photo-3048522.jpeg?auto=compress&cs=tinysrgb&w=1200",
  inshore:    "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1200",
  freshwater: "https://images.pexels.com/photos/5200238/pexels-photo-5200238.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

export async function generateStaticParams() {
  try {
    const exps = await getExperiences();
    return exps.map((e) => ({ slug: e.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperienceBySlug(slug);
  if (!exp) return {};
  return { title: `${exp.name} | Fish Tripper`, description: exp.description ?? undefined };
}

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exp = await getExperienceBySlug(slug);
  if (!exp) notFound();

  const [allSpecies, locationRows] = await Promise.all([
    db.select({ slug: species.slug, commonName: species.commonName }).from(species),
    getDestinationsForExperienceAllRegions(exp.id),
  ]);

  const speciesSlugs = JSON.parse(exp.targetSpeciesSlugs) as string[];

  const speciesNameMap: Record<string, string> = Object.fromEntries(
    allSpecies.map((s) => [s.slug, s.commonName])
  );

  // Group locationRows by region
  const groupedLocations = new Map<string, { region: Region; dests: Destination[] }>();
  for (const row of locationRows) {
    const existing = groupedLocations.get(row.region.id);
    if (existing) {
      existing.dests.push(row.destination);
    } else {
      groupedLocations.set(row.region.id, { region: row.region, dests: [row.destination] });
    }
  }

  const tips = EXPERIENCE_TIPS[exp.slug] ?? [];
  const gearSpecs = speciesSlugs
    .map((s) => SPECIES_GEAR.find((g) => g.slug === s))
    .filter((g): g is NonNullable<typeof g> => g !== undefined)
    .slice(0, 2);

  const categoryBadge = CATEGORY_BADGE[exp.category] ?? "bg-slate-500/20 text-slate-300";
  const categoryImageUrl = CATEGORY_IMAGE[exp.category] ?? CATEGORY_IMAGE.offshore;

  return (
    <div className="bg-[#040F1C] min-h-screen text-[#F5F0E8]">
      {/* Hero */}
      <div className="relative py-16 px-4 overflow-hidden">
        {/* Background tinted image from category */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${categoryImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040F1C]/60 to-[#040F1C]" />
        <div className="relative max-w-4xl mx-auto">
          <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block ${categoryBadge}`}>
            {exp.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{exp.name}</h1>
          <p className="text-white/70 text-lg max-w-2xl mb-8">{exp.description}</p>
          <Link href={`/trips/new?experience=${exp.slug}`}>
            <button className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Plan this trip →
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16 space-y-12">
        {/* Target Species */}
        <section>
          <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
          <h2 className="text-2xl font-bold text-[#0D9488] mb-6">Target Species</h2>
          <div className="flex flex-wrap gap-3">
            {speciesSlugs.map((s) => (
              <Link key={s} href={`/species/${s}`}>
                <div className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-4 py-2 rounded-xl border border-white/10 transition-colors">
                  <span className="text-sm font-medium">{speciesNameMap[s] ?? s}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Fishing Locations grouped by region */}
        {locationRows.length > 0 && (
          <section>
            <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
            <h2 className="text-2xl font-bold text-[#0D9488] mb-6">Fishing Locations</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Array.from(groupedLocations.entries()).map(([regionId, { region, dests }]) => (
                <div key={regionId} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <Link href={`/regions/${region.slug}`} className="font-bold text-[#0D9488] hover:underline text-lg mb-3 block">
                    {region.name}
                  </Link>
                  <ul className="space-y-2">
                    {dests.map((dest) => (
                      <li key={dest.id} className="text-white/80 text-sm">• {dest.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fishing Tips */}
        {tips.length > 0 && (
          <section>
            <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
            <h2 className="text-2xl font-bold text-[#0D9488] mb-6">Fishing Tips</h2>
            <ol className="space-y-4">
              {tips.map((tip, i) => (
                <li key={i} className="flex gap-4 bg-white/5 rounded-2xl p-5 border border-white/10">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[#0D9488] text-white text-sm font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-white/80 text-sm leading-relaxed">{tip}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Gear Setup */}
        {gearSpecs.length > 0 && (
          <section>
            <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
            <h2 className="text-2xl font-bold text-[#0D9488] mb-6">Gear Setup</h2>
            <div className="space-y-6">
              {gearSpecs.map((gear) => {
                const rows: { label: string; value: string }[] = [
                  { label: "Rod", value: gear.rod },
                  { label: "Reel", value: gear.reel },
                  { label: "Main Line", value: gear.mainline },
                  { label: "Leader", value: gear.leader },
                  ...(gear.lures ? [{ label: "Lures / Terminal", value: gear.lures }] : []),
                  ...(gear.hooks ? [{ label: "Hooks", value: gear.hooks }] : []),
                  ...(gear.dragSetting ? [{ label: "Drag Setting", value: gear.dragSetting }] : []),
                ];
                return (
                  <div key={gear.slug} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                    <h3 className="font-bold text-lg mb-4">{gear.name}</h3>
                    <dl className="space-y-2">
                      {rows.map(({ label, value }) => (
                        <div key={label} className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                          <dt className="text-white/40 font-medium">{label}</dt>
                          <dd className="text-white/85">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    {gear.notes && (
                      <p className="mt-4 text-white/55 text-xs leading-relaxed border-t border-white/10 pt-3">{gear.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
