import type { Metadata } from "next";
import { GearClient } from "./GearClient";

export const metadata: Metadata = {
  title: "Fishing Gear Guide",
  description:
    "Rod, reel, line, leader and lure recommendations for every species and environment — plus a packing checklist for your next trip.",
  alternates: { canonical: "/gear" },
};

export default function GearPage() {
  return <GearClient />;
}
