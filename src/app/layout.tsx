import type { Metadata, Viewport } from "next";
import { Lato, Fraunces, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { AppChrome } from "@/components/layout/AppChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

// Brand type system (brand bible): Fraunces for headlines and moments of
// feeling, Lato for all running text and interface copy, JetBrains Mono for
// coordinates / timestamps / field-guide data.
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
  weight: ["400", "500"],
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
  themeColor: "#0A1C28",
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
    colorPrimary: "#C99A3E",
    colorBackground: "#0F2635",
    colorText: "#EAE2D0",
    colorTextSecondary: "rgba(234,226,208,0.55)",
    colorInputBackground: "#143244",
    colorInputText: "#EAE2D0",
    colorNeutral: "#EAE2D0",
    borderRadius: "0.75rem",
  },
  elements: {
    card: "bg-[#0F2635] shadow-2xl !border !border-white/10",
    headerTitle: "!text-[#EAE2D0]",
    headerSubtitle: "!text-white/55",
    socialButtonsBlockButton: "!border !border-white/15 !text-[#EAE2D0] hover:!bg-white/5",
    socialButtonsBlockButtonText: "!text-[#EAE2D0]",
    formFieldLabel: "!text-white/70",
    formFieldInput: "!bg-[#143244] !border-white/20 !text-[#EAE2D0] focus:!border-[#C99A3E]",
    formButtonPrimary: "!bg-[#C99A3E] hover:!bg-[#AD8232] !text-white",
    footerActionLink: "!text-[#C99A3E] hover:!text-[#D9B15E]",
    identityPreviewText: "!text-[#EAE2D0]",
    identityPreviewEditButtonIcon: "!text-[#C99A3E]",
    dividerLine: "!bg-white/10",
    dividerText: "!text-white/40",
  },
} as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const body = (
    <html lang="en" className={`${lato.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
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
