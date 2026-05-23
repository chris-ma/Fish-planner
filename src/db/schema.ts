import { integer, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

// ─── Reference / Seed tables ───────────────────────────────────────────────

export const regions = sqliteTable("regions", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  state: text("state").notNull(), // QLD | NSW
  zone: text("zone").notNull(), // far_north_qld | central_qld | southeast_qld | nsw
  description: text("description"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  tags: text("tags"), // JSON array string
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const species = sqliteTable("species", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  commonName: text("common_name").notNull(),
  scientificName: text("scientific_name"),
  category: text("category").notNull(), // pelagic | reef | estuary | inshore | freshwater
  description: text("description"),
  minLegalSizeMm: integer("min_legal_size_mm"),
  bagLimit: integer("bag_limit"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const techniques = sqliteTable("techniques", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"), // offshore | inshore | estuary | freshwater
});

export const speciesTechniques = sqliteTable(
  "species_techniques",
  {
    speciesId: text("species_id")
      .notNull()
      .references(() => species.id, { onDelete: "cascade" }),
    techniqueId: text("technique_id")
      .notNull()
      .references(() => techniques.id, { onDelete: "cascade" }),
    effectiveness: integer("effectiveness"), // 1-5
    notes: text("notes"),
  },
  (t) => ({ pk: unique().on(t.speciesId, t.techniqueId) })
);

export const seasonWindows = sqliteTable(
  "season_windows",
  {
    id: text("id").primaryKey(),
    regionId: text("region_id")
      .notNull()
      .references(() => regions.id, { onDelete: "cascade" }),
    speciesId: text("species_id")
      .notNull()
      .references(() => species.id, { onDelete: "cascade" }),
    month: integer("month").notNull(), // 1-12
    rating: text("rating").notNull(), // poor | fair | good | peak
    notes: text("notes"),
  },
  (t) => ({ uniq: unique().on(t.regionId, t.speciesId, t.month) })
);

export const gearTemplates = sqliteTable("gear_templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // tackle | clothing | safety | food | logistics | other
  tripType: text("trip_type"), // offshore_pelagic | reef | estuary | inshore_sport | all
  itemName: text("item_name").notNull(),
  quantity: integer("quantity").default(1),
  notes: text("notes"),
  isEssential: integer("is_essential", { mode: "boolean" }).default(false),
});

// ─── Trip tables (no-auth) ──────────────────────────────────────────────────

export const trips = sqliteTable("trips", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  regionId: text("region_id").references(() => regions.id),
  startDate: text("start_date"),
  endDate: text("end_date"),
  targetSpecies: text("target_species"), // JSON array of species IDs
  description: text("description"),
  shareCode: text("share_code").unique().notNull(),
  status: text("status").notNull().default("planning"), // planning | confirmed | active | completed
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  tripId: text("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // charter | accommodation | flight | transport | other
  title: text("title").notNull(),
  providerName: text("provider_name"),
  confirmationRef: text("confirmation_ref"),
  bookingDate: text("booking_date"),
  startDatetime: text("start_datetime"),
  endDatetime: text("end_datetime"),
  costAud: real("cost_aud"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const checklistItems = sqliteTable("checklist_items", {
  id: text("id").primaryKey(),
  tripId: text("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  category: text("category").notNull().default("other"),
  itemName: text("item_name").notNull(),
  quantity: integer("quantity").default(1),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
  fromTemplate: integer("from_template", { mode: "boolean" }).default(false),
  assignedTo: text("assigned_to"), // free-text name (no auth)
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const tripNotes = sqliteTable("trip_notes", {
  id: text("id").primaryKey(),
  tripId: text("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull().default("Anonymous"),
  content: text("content").notNull(),
  isPinned: integer("is_pinned", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const tripParticipants = sqliteTable(
  "trip_participants",
  {
    id: text("id").primaryKey(),
    tripId: text("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    role: text("role").notNull().default("crew"), // owner | organizer | crew
    availability: text("availability").notNull().default("going"), // going | tentative | out
    joinedAt: text("joined_at").notNull().$defaultFn(() => new Date().toISOString()),
  },
  (t) => ({ uniq: unique().on(t.tripId, t.name) })
);

export const tripTasks = sqliteTable("trip_tasks", {
  id: text("id").primaryKey(),
  tripId: text("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  assignedTo: text("assigned_to"),
  isComplete: integer("is_complete", { mode: "boolean" }).notNull().default(false),
  needsApproval: integer("needs_approval", { mode: "boolean" }).notNull().default(false),
  isApproved: integer("is_approved", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ─── Type exports ───────────────────────────────────────────────────────────

export type Region = typeof regions.$inferSelect;
export type Species = typeof species.$inferSelect;
export type Technique = typeof techniques.$inferSelect;
export type SpeciesTechnique = typeof speciesTechniques.$inferSelect;
export type SeasonWindow = typeof seasonWindows.$inferSelect;
export type GearTemplate = typeof gearTemplates.$inferSelect;
export type Trip = typeof trips.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type ChecklistItem = typeof checklistItems.$inferSelect;
export type TripNote = typeof tripNotes.$inferSelect;
export type TripParticipant = typeof tripParticipants.$inferSelect;
export type TripTask = typeof tripTasks.$inferSelect;
