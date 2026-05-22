import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body>
        <Navbar />
        <main className="min-h-[calc(100vh-56px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
