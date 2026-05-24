import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { ratingColor, MONTH_NAMES, type Rating } from "@/lib/utils/season";

interface CalendarRow {
  label: string;
  slug: string;
  months: (string | null)[];
}

interface SeasonalCalendarProps {
  rows: CalendarRow[];
  highlightMonth?: number;
  linkRowsTo: "species" | "regions";
}

export function SeasonalCalendar({ rows, highlightMonth, linkRowsTo }: SeasonalCalendarProps) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No season data available.</p>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Header row */}
        <div className="grid grid-cols-[160px_repeat(12,1fr)] gap-px mb-1">
          <div />
          {MONTH_NAMES.slice(1).map((m, i) => (
            <div
              key={m}
              className={cn(
                "text-center text-xs font-medium py-1 rounded",
                highlightMonth === i + 1 ? "text-[#0F766E] bg-teal-50 font-bold" : "text-muted-foreground"
              )}
            >
              {m}
            </div>
          ))}
        </div>

        {/* Data rows */}
        <div className="space-y-1">
          {rows.map((row) => (
            <div key={row.slug} className="grid grid-cols-[160px_repeat(12,1fr)] gap-px items-center">
              <Link
                href={`/${linkRowsTo}/${row.slug}`}
                className="text-xs font-medium text-foreground hover:text-[#0F766E] truncate pr-2 leading-tight"
              >
                {row.label}
              </Link>
              {row.months.slice(1).map((rating, i) => (
                <div
                  key={i}
                  title={rating ? `${MONTH_NAMES[i + 1]}: ${rating}` : `${MONTH_NAMES[i + 1]}: No data`}
                  className={cn(
                    "h-7 rounded text-[10px] flex items-center justify-center font-medium transition-opacity",
                    rating ? ratingColor(rating as Rating) : "bg-slate-100 text-slate-300",
                    highlightMonth === i + 1 && "ring-2 ring-[#0D9488] ring-offset-1"
                  )}
                >
                  {rating === "peak" ? "P" : rating === "good" ? "G" : rating === "fair" ? "F" : ""}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-emerald-500 inline-block" /> Peak
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-teal-100 border border-teal-300 inline-block" /> Good
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-slate-300 inline-block" /> Fair
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-slate-100 inline-block" /> Poor/None
          </span>
        </div>
      </div>
    </div>
  );
}
