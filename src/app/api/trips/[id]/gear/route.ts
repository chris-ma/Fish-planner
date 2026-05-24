import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { getTripById, getTripChecklist } from "@/lib/queries/trips";
import { db } from "@/db";
import { checklistItems } from "@/db/schema";
import { nanoid } from "nanoid";

interface MySetup {
  rodType?: string;
  reel?: string;
  lineWeight?: string;
  leader?: string;
  techniques?: string[];
  notes?: string;
}
import { GEAR_TEMPLATES } from "@/db/seed/gear-templates";

const SPECIES_TRIP_TYPE: Record<string, string> = {
  "Black Marlin": "offshore_pelagic",
  "Blue Marlin": "offshore_pelagic",
  "Sailfish": "offshore_pelagic",
  "Yellowfin Tuna": "offshore_pelagic",
  "Longtail Tuna": "offshore_pelagic",
  "Spanish Mackerel": "offshore_pelagic",
  "Wahoo": "offshore_pelagic",
  "Mahi-Mahi": "offshore_pelagic",
  "Mahi-Mahi (Dolphinfish)": "offshore_pelagic",
  "Yellowtail Kingfish": "inshore_sport",
  "Giant Trevally": "inshore_sport",
  "Giant Trevally (GT)": "inshore_sport",
  "Cobia": "inshore_sport",
  "Tailor": "inshore_sport",
  "Coral Trout": "reef",
  "Red Emperor": "reef",
  "Nannygai": "reef",
  "Nannygai (Red Snapper)": "reef",
  "Snapper": "reef",
  "Amberjack (Samson Fish)": "reef",
  "Barramundi": "estuary",
  "Mangrove Jack": "estuary",
  "Flathead": "estuary",
  "Dusky Flathead": "estuary",
  "Mulloway": "estuary",
  "Mulloway (Jewfish)": "estuary",
  "Bream": "estuary",
  "Yellowfin Bream": "estuary",
  "Whiting": "estuary",
  "Sand Whiting": "estuary",
  "Luderick": "estuary",
  "Luderick (Blackfish)": "estuary",
  "Black Jewfish": "estuary",
};

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tripId } = await params;
    const trip = await getTripById(tripId);
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    const targetSpecies: string[] = trip.targetSpecies ? JSON.parse(trip.targetSpecies) : [];
    const tripTypes = new Set<string>();
    for (const sp of targetSpecies) {
      const type = SPECIES_TRIP_TYPE[sp];
      if (type) tripTypes.add(type);
    }
    if (tripTypes.size === 0) tripTypes.add("offshore_pelagic");

    const types = Array.from(tripTypes);
    const templates = GEAR_TEMPLATES.filter(
      (t) => t.tripType === "all" || types.includes(t.tripType)
    );

    const newItems = templates.map((t) => ({
      id: nanoid(),
      tripId,
      category: t.category,
      itemName: t.itemName,
      quantity: t.quantity ?? 1,
      isCompleted: false,
      fromTemplate: true,
      assignedTo: null,
      createdAt: new Date().toISOString(),
    }));

    if (newItems.length > 0) {
      for (const item of newItems) {
        await db.insert(checklistItems).values(item).onConflictDoNothing();
      }
    }

    // Inject user's personal tackle setup as the first item
    try {
      const { userId } = await auth();
      if (userId) {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);
        const setup = clerkUser.unsafeMetadata?.mySetup as MySetup | undefined;
        if (setup && (setup.rodType || setup.reel || setup.lineWeight)) {
          const label = [setup.rodType, setup.reel, setup.lineWeight].filter(Boolean).join(" · ");
          await db.insert(checklistItems).values({
            id: nanoid(),
            tripId,
            category: "tackle",
            itemName: `My setup: ${label}`,
            quantity: 1,
            isCompleted: false,
            fromTemplate: false,
            assignedTo: null,
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch {
      // Non-critical — proceed without user setup item
    }

    const items = await getTripChecklist(tripId);
    return NextResponse.json({ items, count: newItems.length });
  } catch (err) {
    console.error("Gear generation failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tripId } = await params;
    const trip = await getTripById(tripId);
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    const body = await request.json();
    const { itemName, category } = body;
    if (!itemName) return NextResponse.json({ error: "itemName required" }, { status: 400 });

    const id = nanoid();
    const item = {
      id,
      tripId,
      category: category ?? "other",
      itemName,
      quantity: 1,
      isCompleted: false,
      fromTemplate: false,
      assignedTo: null,
      createdAt: new Date().toISOString(),
    };
    await db.insert(checklistItems).values(item);
    return NextResponse.json(item);
  } catch (err) {
    console.error("Add item failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
