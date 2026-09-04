import type { RuntimeReview } from "@/lib/onia-center-store";
import type { CenterTone } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

const STATUS_TONE: Record<RuntimeReview["status"], CenterTone> = {
  pendiente: "yellow",
  aprobado: "green",
  rechazado: "red",
  importado: "blue",
};

interface ReviewHistoryPanelProps {
  reviews: RuntimeReview[];
}

export function ReviewHistoryPanel({ reviews }: ReviewHistoryPanelProps) {
  return (
    <SurfaceCard title={`Revisiones recientes (${reviews.length})`}>
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin revisiones registradas.</p>
      ) : (
        <div className="grid gap-2.5">
          {reviews.slice(0, 20).map((review) => (
            <div key={review.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{review.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{review.source}</p>
              </div>
              <Badge tone={STATUS_TONE[review.status]}>{review.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </SurfaceCard>
  );
}
