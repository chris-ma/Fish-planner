import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Region } from "@/db/schema";

const ZONE_LABELS: Record<string, string> = {
  far_north_qld: "Far North QLD",
  central_qld: "Central QLD",
  southeast_qld: "Southeast QLD",
  nsw: "New South Wales",
};

interface RegionCardProps {
  region: Region;
  seasonScore?: number;
}

export function RegionCard({ region, seasonScore }: RegionCardProps) {
  return (
    <Link href={`/regions/${region.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-base leading-tight">{region.name}</h3>
              <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{ZONE_LABELS[region.zone] ?? region.zone}</span>
              </div>
            </div>
            {seasonScore !== undefined && seasonScore > 0 && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                {seasonScore > 40 ? "🔥 Hot" : seasonScore > 25 ? "✓ Active" : "Quiet"}
              </Badge>
            )}
          </div>
          {region.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {region.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
