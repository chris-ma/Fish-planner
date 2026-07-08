import type { Metadata } from "next";
import { TripsNewClient } from "./TripsNewClient";

export const metadata: Metadata = {
  title: "Start a New Trip",
  description:
    "Build a shared fishing trip plan — pick your species, destination, dates and gear, then invite your crew with one link.",
  alternates: { canonical: "/trips/new" },
};

export default function NewTripPage() {
  return <TripsNewClient />;
}
