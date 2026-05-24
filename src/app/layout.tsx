import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { Navbar } from "@/components/layout/Navbar";

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
  title: "HookLine — Australian Fishing Planner",
  description:
    "Plan your Australian fishing trip around the best seasonal windows. Discover top species, seasonal calendars, gear guides, and collaborative trip planning.",
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
        <Navbar />
        <main className="min-h-screen pb-16 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );

  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return body;

  return <ClerkProvider appearance={clerkAppearance}>{body}</ClerkProvider>;
}
