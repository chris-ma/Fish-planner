import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EastCoast Fishing — Australian Trip Planner",
  description:
    "Plan your Australian east coast fishing trip around the best seasonal windows. Discover top species, seasonal calendars, gear guides, and collaborative trip planning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-[calc(100vh-56px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
