import type { Metadata, Viewport } from "next";
import { Sora, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { AppChrome } from "@/components/layout/AppChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

// Brand type system (brand bible v1.0): Fraunces (up to Black/900) for
// headlines and moments of feeling, Sora for all subhead/UI/body copy —
// no monospace face in this system.
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Fishing Trip Planner`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Fishing Trip Planner`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Fishing Trip Planner`,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B1D2A",
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#FFC423",
    colorBackground: "#0F2635",
    colorText: "#F2EDE2",
    colorTextSecondary: "rgba(234,226,208,0.55)",
    colorInputBackground: "#143244",
    colorInputText: "#F2EDE2",
    colorNeutral: "#F2EDE2",
    borderRadius: "0.75rem",
  },
  elements: {
    card: "bg-[#0F2635] shadow-2xl !border !border-white/10",
    headerTitle: "!text-[#F2EDE2]",
    headerSubtitle: "!text-white/55",
    socialButtonsBlockButton: "!border !border-white/15 !text-[#F2EDE2] hover:!bg-white/5",
    socialButtonsBlockButtonText: "!text-[#F2EDE2]",
    formFieldLabel: "!text-white/70",
    formFieldInput: "!bg-[#143244] !border-white/20 !text-[#F2EDE2] focus:!border-[#FFC423]",
    formButtonPrimary: "!bg-[#FFC423] hover:!bg-[#D9A61C] !text-[#0B1D2A]",
    footerActionLink: "!text-[#FFC423] hover:!text-[#FFD666]",
    identityPreviewText: "!text-[#F2EDE2]",
    identityPreviewEditButtonIcon: "!text-[#FFC423]",
    dividerLine: "!bg-white/10",
    dividerText: "!text-white/40",
  },
} as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const body = (
    <html lang="en" className={`${sora.variable} ${fraunces.variable}`}>
      <body>
        <JsonLd data={ORGANIZATION_JSON_LD} />
        <JsonLd data={WEBSITE_JSON_LD} />
        <AppChrome>{children}</AppChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );

  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return body;

  return (
    <ClerkProvider
      appearance={clerkAppearance}
      afterSignInUrl="/onboarding"
      afterSignUpUrl="/onboarding"
    >
      {body}
    </ClerkProvider>
  );
}
