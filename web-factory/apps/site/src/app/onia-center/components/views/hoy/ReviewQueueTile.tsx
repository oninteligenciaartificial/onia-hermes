import type { RuntimeReview } from "@/lib/onia-center-store";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface ReviewQueueTileProps {
  reviews: RuntimeReview[];
}

const STATUS_TONE: Record<RuntimeReview["status"], "green" | "yellow" | "red" | "blue"> = {
  pendiente: "yellow",
  aprobado: "green",
  rechazado: "red",
  importado: "blue",
};

export function ReviewQueueTile({ reviews }: ReviewQueueTileProps) {
  const pending = reviews.filter((review) => review.status === "pendiente");

  return (
    <SurfaceCard title={`Cola de aprobacion (${pending.length} pendientes)`}>
      {pending.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nada esperando tu aprobacion ahora mismo.</p>
      ) : (
        <div className="grid gap-2.5">
          {pending.map((review) => (
            <div key={review.id} className="flex items-center justify-between gap-3">
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
