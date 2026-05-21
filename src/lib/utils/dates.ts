export function monthName(month: number, short = false): string {
  const names = short
    ? ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    : ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return names[month] ?? "";
}

export function formatDateRange(start?: string | null, end?: string | null): string {
  if (!start && !end) return "Dates TBC";
  if (start && !end) return `From ${formatDate(start)}`;
  if (!start && end) return `Until ${formatDate(end)}`;
  return `${formatDate(start!)} – ${formatDate(end!)}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}
