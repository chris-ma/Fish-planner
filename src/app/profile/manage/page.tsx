export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ManageProfileClient } from "./ManageProfileClient";

export const metadata: Metadata = {
  title: "Manage Profile",
  robots: { index: false, follow: false },
};

export default function ManageProfilePage() {
  return <ManageProfileClient />;
}
