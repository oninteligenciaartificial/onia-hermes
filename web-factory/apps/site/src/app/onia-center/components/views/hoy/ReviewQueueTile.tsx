import type { RuntimeReview } from "@/lib/onia-center-store";
import type { ReviewBody } from "@/app/onia-center/live/live-runtime";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface ReviewQueueTileProps {
  reviews: RuntimeReview[];
  bodies?: Record<string, ReviewBody>;
}

const STATUS_TONE: Record<RuntimeReview["status"], "green" | "yellow" | "red" | "blue"> = {
  pendiente: "yellow",
  aprobado: "green",
  rechazado: "red",
  importado: "blue",
};

function ReviewBodyDetails({ body }: { body: ReviewBody }) {
  const label = body.kind === "content_carousel" ? "Ver carrusel" : "Ver guion";

  return (
    <details className="rounded-md border border-border bg-background px-3 py-2">
      <summary className="cursor-pointer text-xs font-medium text-muted-foreground">{label}</summary>
      <div className="mt-2 grid gap-2 text-sm">
        {body.kind === "content_script" ? (
          <>
            {body.format || body.pillar ? (
              <p className="text-xs text-muted-foreground">
                {[body.format, body.pillar].filter(Boolean).join(" · ")}
              </p>
            ) : null}
            {body.hook ? <p className="font-medium">{body.hook}</p> : null}
            {body.body ? <p className="whitespace-pre-line">{body.body}</p> : null}
            {body.cta ? <p className="text-xs text-muted-foreground">CTA: {body.cta}</p> : null}
          </>
        ) : (
          <>
            {body.title ? <p className="font-medium">{body.title}</p> : null}
            {body.slides && body.slides.length > 0 ? (
              <ol className="grid list-decimal gap-1 pl-5">
                {body.slides.map((slide, index) => (
                  <li key={index}>{slide}</li>
                ))}
              </ol>
            ) : null}
            {body.cta ? <p className="text-xs text-muted-foreground">CTA: {body.cta}</p> : null}
          </>
        )}
      </div>
    </details>
  );
}

export function ReviewQueueTile({ reviews, bodies }: ReviewQueueTileProps) {
  const pending = reviews.filter((review) => review.status === "pendiente");

  return (
    <SurfaceCard title={`Cola de aprobacion (${pending.length} pendientes)`}>
      {pending.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nada esperando tu aprobacion ahora mismo.</p>
      ) : (
        <div className="grid gap-3">
          {pending.map((review) => {
            const body = bodies?.[review.id];
            return (
              <div key={review.id} className="grid gap-1.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{review.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{review.source}</p>
                  </div>
                  <Badge tone={STATUS_TONE[review.status]}>{review.status}</Badge>
                </div>
                {body ? <ReviewBodyDetails body={body} /> : null}
              </div>
            );
          })}
        </div>
      )}
    </SurfaceCard>
  );
}
