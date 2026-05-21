// Zone-based seasonal ratings for each species.
// Index 0 is unused. Indices 1-12 = Jan-Dec.
// Ratings: null = skip (no/very poor), 'poor', 'fair', 'good', 'peak'

type Rating = "poor" | "fair" | "good" | "peak" | null;
type ZoneRatings = Record<string, (Rating | null)[]>;

// far_north_qld | central_qld | southeast_qld | nsw
export const SEASON_DATA: Record<string, ZoneRatings> = {
  "black-marlin": {
    far_north_qld:  [null, null, null, null, null, null, null, null, "fair", "peak", "peak", "peak", "fair"],
    central_qld:    [null, null, null, null, null, null, null, "fair", "fair", "good", "good", "fair", null],
    southeast_qld:  [null, null, null, null, null, null, null, null, null, "fair", "fair", "fair", null],
    nsw:            [null, "fair", "fair", null, null, null, null, null, null, null, "fair", "fair", "fair"],
  },
  "blue-marlin": {
    far_north_qld:  [null, "fair", "fair", "fair", null, null, null, null, "fair", "fair", "good", "good", "fair"],
    central_qld:    [null, "fair", "fair", null, null, null, null, null, "fair", "fair", "good", "fair", "fair"],
    southeast_qld:  [null, "fair", "good", "fair", null, null, null, null, null, "fair", "fair", "fair", "fair"],
    nsw:            [null, "good", "peak", "good", "fair", null, null, null, null, null, "fair", "good", "good"],
  },
  "sailfish": {
    far_north_qld:  [null, "good", "peak", "peak", "good", "fair", "poor", "poor", "fair", "good", "good", "good", "good"],
    central_qld:    [null, "good", "peak", "good", "fair", "poor", "poor", "poor", "fair", "good", "good", "good", "good"],
    southeast_qld:  [null, "fair", "good", "fair", "poor", null, null, null, null, "fair", "fair", "fair", "fair"],
    nsw:            [null, "fair", "fair", "fair", null, null, null, null, null, null, null, "fair", "fair"],
  },
  "yellowfin-tuna": {
    far_north_qld:  [null, "good", "good", "fair", "fair", "poor", "poor", "poor", "fair", "good", "peak", "peak", "good"],
    central_qld:    [null, "good", "good", "good", "fair", "poor", "poor", "poor", "fair", "good", "peak", "peak", "good"],
    southeast_qld:  [null, "good", "peak", "good", "fair", "poor", "poor", "poor", "fair", "good", "peak", "peak", "good"],
    nsw:            [null, "peak", "peak", "good", "fair", "poor", "poor", "poor", "fair", "good", "good", "peak", "peak"],
  },
  "longtail-tuna": {
    far_north_qld:  [null, "fair", "fair", "fair", "good", "good", "fair", "fair", "good", "peak", "peak", "good", "fair"],
    central_qld:    [null, "fair", "fair", "fair", "good", "good", "fair", "fair", "good", "peak", "peak", "good", "fair"],
    southeast_qld:  [null, "fair", "good", "good", "peak", "good", "fair", "fair", "good", "peak", "peak", "good", "fair"],
    nsw:            [null, "good", "peak", "peak", "good", "fair", "poor", "poor", "fair", "good", "good", "good", "good"],
  },
  "spanish-mackerel": {
    far_north_qld:  [null, "good", "peak", "peak", "good", "fair", "poor", "poor", "fair", "good", "peak", "peak", "good"],
    central_qld:    [null, "good", "peak", "good", "fair", "poor", "poor", "poor", "fair", "good", "peak", "peak", "good"],
    southeast_qld:  [null, "fair", "good", "good", "fair", "poor", "poor", "poor", "poor", "fair", "good", "good", "good"],
    nsw:            [null, "fair", "fair", "good", "good", "good", "fair", "fair", "good", "good", "good", "fair", "fair"],
  },
  "wahoo": {
    far_north_qld:  [null, "peak", "peak", "good", "fair", "poor", "poor", "poor", "fair", "good", "peak", "peak", "peak"],
    central_qld:    [null, "good", "peak", "good", "fair", "poor", "poor", "poor", "fair", "good", "peak", "peak", "good"],
    southeast_qld:  [null, "good", "good", "fair", "poor", null, null, null, null, "fair", "good", "good", "good"],
    nsw:            [null, "good", "good", "fair", "poor", null, null, null, null, "fair", "fair", "good", "good"],
  },
  "mahi-mahi": {
    far_north_qld:  [null, "peak", "peak", "good", "fair", "fair", "poor", "poor", "fair", "good", "peak", "peak", "peak"],
    central_qld:    [null, "good", "peak", "good", "fair", "poor", "poor", "poor", "fair", "good", "peak", "peak", "good"],
    southeast_qld:  [null, "good", "good", "fair", "poor", null, null, null, null, "fair", "good", "good", "good"],
    nsw:            [null, "good", "good", "good", "fair", "poor", null, null, null, "fair", "fair", "good", "good"],
  },
  "yellowtail-kingfish": {
    far_north_qld:  [null, "fair", "fair", "fair", "fair", "good", "good", "good", "fair", "fair", "fair", "fair", "fair"],
    central_qld:    [null, "fair", "fair", "fair", "fair", "good", "good", "good", "fair", "fair", "fair", "fair", "fair"],
    southeast_qld:  [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "good", "fair", "fair", "fair", "fair"],
    nsw:            [null, "good", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "good", "good", "good"],
  },
  "giant-trevally": {
    far_north_qld:  [null, "good", "fair", "fair", "good", "peak", "peak", "peak", "peak", "good", "good", "good", "good"],
    central_qld:    [null, "good", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "good", "good", "good"],
    southeast_qld:  [null, "fair", "fair", "fair", "fair", "good", "good", "good", "fair", "fair", "fair", "fair", "fair"],
    nsw:            [null, "fair", "fair", "poor", "poor", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair"],
  },
  "coral-trout": {
    far_north_qld:  [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "peak", "good", "good", "fair", "fair"],
    central_qld:    [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "good", "fair", "fair"],
    southeast_qld:  [null, "fair", "fair", "fair", "good", "good", "good", "good", "good", "good", "fair", "fair", "fair"],
    nsw:            [null, "fair", "fair", "fair", "fair", "fair", "good", "good", "fair", "fair", "fair", "fair", "fair"],
  },
  "red-emperor": {
    far_north_qld:  [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "peak", "good", "good", "fair", "fair"],
    central_qld:    [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "good", "fair", "fair"],
    southeast_qld:  [null, "fair", "fair", "fair", "good", "good", "peak", "peak", "good", "good", "fair", "fair", "fair"],
    nsw:            [null, "fair", "fair", "fair", "fair", "fair", "good", "good", "fair", "fair", "fair", "fair", "fair"],
  },
  "nannygai": {
    far_north_qld:  [null, "good", "good", "good", "peak", "peak", "peak", "peak", "peak", "good", "good", "good", "good"],
    central_qld:    [null, "good", "good", "fair", "peak", "peak", "peak", "peak", "good", "good", "good", "good", "good"],
    southeast_qld:  [null, "good", "good", "good", "peak", "peak", "peak", "peak", "good", "good", "good", "good", "good"],
    nsw:            [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "fair", "fair", "fair"],
  },
  "snapper": {
    far_north_qld:  [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "fair", "fair", "fair"],
    central_qld:    [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "fair", "fair", "fair"],
    southeast_qld:  [null, "good", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "good", "good", "good"],
    nsw:            [null, "good", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "good", "good", "good"],
  },
  "cobia": {
    far_north_qld:  [null, "good", "good", "peak", "peak", "good", "fair", "fair", "fair", "fair", "good", "good", "good"],
    central_qld:    [null, "good", "good", "peak", "peak", "good", "fair", "fair", "fair", "fair", "good", "good", "good"],
    southeast_qld:  [null, "fair", "good", "peak", "peak", "good", "fair", "fair", "fair", "fair", "good", "fair", "fair"],
    nsw:            [null, "fair", "good", "good", "good", "fair", "poor", "poor", "poor", "fair", "fair", "fair", "fair"],
  },
  "barramundi": {
    far_north_qld:  [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "peak", "good", "good", "good", "fair"],
    central_qld:    [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "good", "fair", "fair"],
    southeast_qld:  [null, "fair", "poor", "poor", "fair", "good", "good", "good", "fair", "fair", "fair", "fair", "fair"],
    nsw:            [null, null, null, null, null, null, null, null, null, null, null, null, null], // not found in NSW
  },
  "mangrove-jack": {
    far_north_qld:  [null, "good", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "good", "good", "good"],
    central_qld:    [null, "good", "fair", "fair", "good", "peak", "peak", "good", "good", "good", "good", "good", "good"],
    southeast_qld:  [null, "good", "fair", "fair", "fair", "good", "good", "good", "fair", "fair", "fair", "good", "good"],
    nsw:            [null, "fair", "fair", "poor", "poor", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair"],
  },
  "flathead": {
    far_north_qld:  [null, "fair", "fair", "fair", "fair", "fair", "good", "good", "fair", "fair", "fair", "fair", "fair"],
    central_qld:    [null, "fair", "fair", "fair", "fair", "good", "good", "good", "fair", "fair", "fair", "fair", "fair"],
    southeast_qld:  [null, "good", "fair", "fair", "good", "good", "peak", "peak", "good", "good", "peak", "peak", "good"],
    nsw:            [null, "good", "fair", "fair", "good", "good", "good", "good", "good", "peak", "peak", "peak", "good"],
  },
  "mulloway": {
    far_north_qld:  [null, "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair"],
    central_qld:    [null, "fair", "fair", "fair", "fair", "good", "good", "fair", "fair", "fair", "fair", "fair", "fair"],
    southeast_qld:  [null, "fair", "fair", "fair", "good", "good", "peak", "peak", "good", "good", "fair", "fair", "fair"],
    nsw:            [null, "good", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "good", "good", "good"],
  },
  "bream": {
    far_north_qld:  [null, "fair", "fair", "fair", "good", "good", "good", "good", "good", "good", "fair", "fair", "fair"],
    central_qld:    [null, "fair", "fair", "fair", "good", "good", "good", "good", "good", "good", "fair", "fair", "fair"],
    southeast_qld:  [null, "good", "fair", "fair", "good", "peak", "peak", "good", "good", "peak", "peak", "good", "good"],
    nsw:            [null, "good", "fair", "fair", "good", "peak", "peak", "peak", "good", "peak", "peak", "good", "good"],
  },
  "tailor": {
    far_north_qld:  [null, "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair"],
    central_qld:    [null, "fair", "fair", "fair", "fair", "good", "good", "good", "good", "fair", "fair", "fair", "fair"],
    southeast_qld:  [null, "fair", "fair", "fair", "good", "peak", "peak", "good", "good", "fair", "fair", "fair", "fair"],
    nsw:            [null, "fair", "fair", "fair", "good", "peak", "peak", "good", "good", "good", "fair", "fair", "fair"],
  },
  "whiting": {
    far_north_qld:  [null, "fair", "fair", "fair", "good", "good", "good", "good", "good", "good", "fair", "fair", "fair"],
    central_qld:    [null, "fair", "fair", "fair", "good", "good", "peak", "peak", "good", "good", "fair", "fair", "fair"],
    southeast_qld:  [null, "good", "fair", "fair", "good", "good", "peak", "peak", "good", "peak", "peak", "good", "good"],
    nsw:            [null, "good", "good", "fair", "good", "good", "peak", "peak", "good", "peak", "peak", "good", "good"],
  },
  "luderick": {
    far_north_qld:  [null, null, null, null, null, null, null, null, null, null, null, null, null],
    central_qld:    [null, null, null, null, null, null, null, null, null, null, null, null, null],
    southeast_qld:  [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "peak", "good", "fair", "fair", "fair"],
    nsw:            [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "peak", "good", "fair", "fair", "fair"],
  },
  "jewfish": {
    far_north_qld:  [null, "good", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "good", "good", "good"],
    central_qld:    [null, "good", "fair", "fair", "good", "peak", "peak", "good", "good", "good", "good", "good", "good"],
    southeast_qld:  [null, "fair", "fair", "poor", "fair", "fair", "good", "good", "fair", "fair", "fair", "fair", "fair"],
    nsw:            [null, null, null, null, null, null, null, null, null, null, null, null, null], // black jewfish primarily tropical
  },
  "kingfish-qld": {
    far_north_qld:  [null, "fair", "fair", "fair", "fair", "good", "good", "good", "fair", "fair", "fair", "fair", "fair"],
    central_qld:    [null, "fair", "fair", "fair", "fair", "good", "peak", "peak", "good", "fair", "fair", "fair", "fair"],
    southeast_qld:  [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "good", "fair", "fair", "fair", "fair"],
    nsw:            [null, "fair", "fair", "fair", "good", "peak", "peak", "peak", "good", "good", "fair", "fair", "fair"],
  },
};
