import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { AppChrome } from "@/components/layout/AppChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
  weight: "400",
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
  themeColor: "#020B14",
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
    colorPrimary: "#0D9488",
    colorBackground: "#040F1C",
    colorText: "#F5F0E8",
    colorTextSecondary: "rgba(245,240,232,0.55)",
    colorInputBackground: "#071B30",
    colorInputText: "#F5F0E8",
    colorNeutral: "#F5F0E8",
    borderRadius: "0.75rem",
  },
  elements: {
    card: "bg-[#040F1C] shadow-2xl !border !border-white/10",
    headerTitle: "!text-[#F5F0E8]",
    headerSubtitle: "!text-white/55",
    socialButtonsBlockButton: "!border !border-white/15 !text-[#F5F0E8] hover:!bg-white/5",
    socialButtonsBlockButtonText: "!text-[#F5F0E8]",
    formFieldLabel: "!text-white/70",
    formFieldInput: "!bg-[#071B30] !border-white/20 !text-[#F5F0E8] focus:!border-[#0D9488]",
    formButtonPrimary: "!bg-[#0D9488] hover:!bg-[#0F766E] !text-white",
    footerActionLink: "!text-[#0D9488] hover:!text-teal-400",
    identityPreviewText: "!text-[#F5F0E8]",
    identityPreviewEditButtonIcon: "!text-[#0D9488]",
    dividerLine: "!bg-white/10",
    dividerText: "!text-white/40",
  },
} as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const body = (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable}`}>
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
