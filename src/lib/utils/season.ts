export type Rating = "poor" | "fair" | "good" | "peak";

export const RATING_ORDER: Rating[] = ["poor", "fair", "good", "peak"];

export function ratingColor(rating: Rating | null): string {
  switch (rating) {
    case "peak": return "bg-emerald-500 text-white";
    case "good": return "bg-teal-100 text-teal-700";
    case "fair": return "bg-sky-200 text-sky-800";
    case "poor": return "bg-slate-100 text-slate-400";
    default: return "bg-transparent text-slate-200";
  }
}

export function ratingBorder(rating: Rating | null): string {
  switch (rating) {
    case "peak": return "border-emerald-500";
    case "good": return "border-amber-400";
    case "fair": return "border-slate-300";
    default: return "border-slate-100";
  }
}

export function ratingLabel(rating: Rating | null): string {
  if (!rating) return "—";
  return rating.charAt(0).toUpperCase() + rating.slice(1);
}

export function ratingScore(rating: Rating | null): number {
  if (!rating) return 0;
  return RATING_ORDER.indexOf(rating) + 1;
}

export function currentMonth(): number {
  return new Date().getMonth() + 1; // 1-12
}

export const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const MONTH_NAMES_FULL = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
