export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Users, Clock, Anchor, Phone, Mail } from "lucide-react";
import { getCharterBySlug, getCharters } from "@/lib/queries/charters";
import { getExperienceBySlug } from "@/lib/queries/experiences";
import { db } from "@/db";
import { species } from "@/db/schema";
import { EnquiryForm } from "./EnquiryForm";

const CATEGORY_IMAGE: Record<string, string> = {
  offshore:   "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1200",
  reef:       "https://images.pexels.com/photos/1591938/pexels-photo-1591938.jpeg?auto=compress&cs=tinysrgb&w=1200",
  estuary:    "https://images.pexels.com/photos/3048522/pexels-photo-3048522.jpeg?auto=compress&cs=tinysrgb&w=1200",
  inshore:    "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1200",
  freshwater: "https://images.pexels.com/photos/5200238/pexels-photo-5200238.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

export async function generateStaticParams() {
  try {
    const list = await getCharters();
    return list.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const charter = await getCharterBySlug(slug);
  if (!charter) return {};
  return { title: `${charter.name} | HookLine Charters`, description: charter.description ?? undefined };
}

export default async function CharterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const charter = await getCharterBySlug(slug);
  if (!charter) notFound();

  const [experience, allSpecies] = await Promise.all([
    charter.experienceSlug ? getExperienceBySlug(charter.experienceSlug) : null,
    db.select({ slug: species.slug, commonName: species.commonName }).from(species),
  ]);

  const speciesNameMap = Object.fromEntries(allSpecies.map((s) => [s.slug, s.commonName]));

  let speciesSlugs: string[] = [];
  if (experience?.targetSpeciesSlugs) {
    try { speciesSlugs = JSON.parse(experience.targetSpeciesSlugs) as string[]; } catch { /* empty */ }
  }

  const heroImage = charter.heroImage ?? CATEGORY_IMAGE[experience?.category ?? "offshore"] ?? CATEGORY_IMAGE.offshore;

  return (
    <div className="bg-[#040F1C] min-h-screen text-[#F5F0E8]">
      {/* Hero */}
      <div className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040F1C]/40 to-[#040F1C]" />
        <div className="relative max-w-4xl mx-auto pt-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#0D9488]/20 text-[#0D9488] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#0D9488]/30">
              Guided Experience
            </span>
            {charter.featured && (
              <span className="bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/30">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight">{charter.name}</h1>
          <p className="text-[#0D9488] text-lg font-semibold mb-4">{charter.operatorName}</p>
          <p className="text-white/70 text-lg max-w-2xl mb-6">{charter.description}</p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#0D9488]" />{charter.homePort}</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#0D9488]" />Up to {charter.maxGuests} anglers</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#0D9488]" />{charter.durationDays === 1 ? "Day trip" : `${charter.durationDays} days`}</span>
            {charter.priceLabel && <span className="text-white font-semibold">{charter.priceLabel}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-12">
        {/* Operator info */}
        <section className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="h-1 w-8 bg-[#0D9488] rounded mb-3" />
            <h2 className="text-lg font-bold mb-4">The Vessel</h2>
            <dl className="space-y-2 text-sm">
              {charter.boatName && (
                <div className="flex gap-2"><dt className="text-white/40 w-24 shrink-0">Boat</dt><dd className="flex items-center gap-1.5"><Anchor className="h-3.5 w-3.5 text-[#0D9488]" />{charter.boatName}</dd></div>
              )}
              {charter.boatType && (
                <div className="flex gap-2"><dt className="text-white/40 w-24 shrink-0">Type</dt><dd>{charter.boatType}</dd></div>
              )}
              <div className="flex gap-2"><dt className="text-white/40 w-24 shrink-0">Capacity</dt><dd>{charter.maxGuests} anglers max</dd></div>
              <div className="flex gap-2"><dt className="text-white/40 w-24 shrink-0">Duration</dt><dd>{charter.durationDays === 1 ? "Full day" : `${charter.durationDays} days`}</dd></div>
              <div className="flex gap-2"><dt className="text-white/40 w-24 shrink-0">Home port</dt><dd>{charter.homePort}</dd></div>
            </dl>
          </div>

          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="h-1 w-8 bg-[#0D9488] rounded mb-3" />
            <h2 className="text-lg font-bold mb-4">Contact</h2>
            <p className="text-white/80 font-semibold mb-3">{charter.operatorName}</p>
            <div className="space-y-2 text-sm">
              {charter.operatorPhone && (
                <a href={`tel:${charter.operatorPhone}`} className="flex items-center gap-2 text-white/70 hover:text-[#0D9488] transition-colors">
                  <Phone className="h-4 w-4 text-[#0D9488]" />{charter.operatorPhone}
                </a>
              )}
              <a href={`mailto:${charter.operatorEmail}`} className="flex items-center gap-2 text-white/70 hover:text-[#0D9488] transition-colors">
                <Mail className="h-4 w-4 text-[#0D9488]" />{charter.operatorEmail}
              </a>
            </div>
          </div>
        </section>

        {/* Target species */}
        {speciesSlugs.length > 0 && (
          <section>
            <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
            <h2 className="text-2xl font-bold text-[#0D9488] mb-6">Target Species</h2>
            <div className="flex flex-wrap gap-3">
              {speciesSlugs.map((s) => (
                <Link key={s} href={`/species/${s}`}>
                  <div className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-4 py-2 rounded-xl border border-white/10 transition-colors text-sm font-medium">
                    {speciesNameMap[s] ?? s}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Enquiry form */}
        <section>
          <div className="h-1 w-12 bg-[#0D9488] rounded mb-3" />
          <h2 className="text-2xl font-bold text-[#0D9488] mb-2">Book This Guided Experience</h2>
          <p className="text-white/60 mb-8">
            Send an enquiry directly to {charter.operatorName}. They will confirm availability and provide full trip details.
          </p>
          <EnquiryForm
            charterSlug={charter.slug}
            operatorName={charter.operatorName}
            operatorPhone={charter.operatorPhone}
            maxGuests={charter.maxGuests}
          />
        </section>
      </div>
    </div>
  );
}
