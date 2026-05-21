import { cn } from "@/lib/utils/cn";
import { ratingColor, ratingLabel, type Rating } from "@/lib/utils/season";

interface SeasonBadgeProps {
  rating: Rating | string | null;
  className?: string;
}

export function SeasonBadge({ rating, className }: SeasonBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        ratingColor(rating as Rating | null),
        className
      )}
    >
      {ratingLabel(rating as Rating | null)}
    </span>
  );
}
