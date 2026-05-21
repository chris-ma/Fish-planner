import { NextResponse } from "next/server";
import { getTripById, getTripChecklist } from "@/lib/queries/trips";
import { db } from "@/db";
import { checklistItems, gearTemplates, species, regions } from "@/db/schema";
import { eq, or, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

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
    const templates = await db
      .select()
      .from(gearTemplates)
      .where(or(eq(gearTemplates.tripType, "all"), inArray(gearTemplates.tripType, types)));

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
