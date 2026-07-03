import type { Metadata } from "next";
import { CampaignClient } from "./CampaignClient";

export const metadata: Metadata = {
  title: "The Trip of a Lifetime — Fish Tripper",
  description:
    "The one that still comes up at every barbecue. See how it starts — and start planning yours.",
};

export default function CampaignPage() {
  return <CampaignClient />;
}
