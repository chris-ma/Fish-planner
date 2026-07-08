import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Fish Tripper team — questions, feedback, or charter partnership enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0A1C28]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#C99A3E]/20 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-[#C99A3E]" />
          </div>
          <span className="text-[#C99A3E] text-sm font-semibold uppercase tracking-wider">Contact</span>
        </div>

        <h1 className="text-4xl font-bold text-[#EAE2D0] mb-4 leading-tight">Get in touch</h1>
        <p className="text-white/60 text-lg mb-12 leading-relaxed">
          Questions, feedback, bug reports, or want to list your charter business — we'd like to hear from you.
        </p>

        <div className="space-y-4">
          <a
            href="mailto:hello@fishtripper.app"
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C99A3E]/15 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-[#C99A3E]" />
            </div>
            <div>
              <p className="font-semibold text-[#EAE2D0]">General enquiries</p>
              <p className="text-white/50 text-sm">hello@fishtripper.app</p>
            </div>
          </a>

          <a
            href="mailto:charters@fishtripper.app"
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C99A3E]/15 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-[#C99A3E]" />
            </div>
            <div>
              <p className="font-semibold text-[#EAE2D0]">Charter operator partnerships</p>
              <p className="text-white/50 text-sm">charters@fishtripper.app</p>
            </div>
          </a>
        </div>

        <p className="mt-10 text-white/30 text-xs leading-relaxed">
          We typically reply within a few business days.
        </p>
      </div>
    </div>
  );
}
