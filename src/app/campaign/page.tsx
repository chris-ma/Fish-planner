import type { Metadata } from "next";
import { CampaignClient } from "./CampaignClient";

export const metadata: Metadata = {
  title: "The Trip of a Lifetime",
  description:
    "The one that still comes up at every barbecue. See how it starts — and start planning yours.",
  alternates: { canonical: "/campaign" },
};

export default function CampaignPage() {
  return <CampaignClient />;
}
