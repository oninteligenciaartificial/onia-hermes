import type { RuntimeReview } from "@/lib/onia-center-store";
import type { ReviewBody } from "@/app/onia-center/live/live-runtime";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { ReviewActions } from "./ReviewActions";

interface ReviewQueueTileProps {
  reviews: RuntimeReview[];
  bodies?: Record<string, ReviewBody>;
  canApprove?: boolean;
}

const STATUS_TONE: Record<RuntimeReview["status"], "green" | "yellow" | "red" | "blue"> = {
  pendiente: "yellow",
  aprobado: "green",
  rechazado: "red",
  importado: "blue",
};

function kindLabel(body: ReviewBody): string {
  return body.kind === "content_carousel" ? "carrusel" : "guion";
}

function ReviewBodyDetails({ body }: { body: ReviewBody }) {
  const label = body.kind === "content_carousel" ? "Ver carrusel" : "Ver guion";

  return (
    <details className="group mt-3">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
        <svg
          viewBox="0 0 16 16"
          className="h-3 w-3 shrink-0 transition-transform duration-200 group-open:rotate-90"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 4l4 4-4 4" />
        </svg>
        {label}
      </summary>
      <div className="mt-2.5 grid gap-2 rounded-md bg-muted/50 p-3 text-sm">
        {body.kind === "content_script" ? (
          <>
            {body.format || body.pillar ? (
              <p className="text-xs text-muted-foreground">
                {[body.format, body.pillar].filter(Boolean).join(" · ")}
              </p>
            ) : null}
            {body.hook ? <p className="font-medium">{body.hook}</p> : null}
            {body.body ? <p className="whitespace-pre-line leading-relaxed">{body.body}</p> : null}
            {body.cta ? <p className="text-xs text-muted-foreground">CTA: {body.cta}</p> : null}
          </>
        ) : (
          <>
            {body.title ? <p className="font-medium">{body.title}</p> : null}
            {body.slides && body.slides.length > 0 ? (
              <ol className="grid list-decimal gap-1 pl-5 leading-relaxed">
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

export function ReviewQueueTile({ reviews, bodies, canApprove }: ReviewQueueTileProps) {
  const pending = reviews.filter((review) => review.status === "pendiente");
  const countClass =
    pending.length > 0 ? "onia-center-tone-yellow" : "onia-center-tone-neutral";

  return (
    <SurfaceCard
      title="Cola de aprobación"
      subtitle="Propuestas de los agentes esperando tu visto bueno"
      className="onia-center-elevated"
      action={
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tabular-nums ${countClass}`}
        >
          {pending.length} {pending.length === 1 ? "pendiente" : "pendientes"}
        </span>
      }
    >
      {pending.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nada esperando tu aprobación ahora mismo.</p>
      ) : (
        <div className="grid">
          {pending.map((review) => {
            const body = bodies?.[review.id];
            return (
              <div
                key={review.id}
                className="border-t border-border py-4 first:border-t-0 first:pt-0.5 last:pb-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-foreground">{review.title}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      {body ? (
                        <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide onia-center-tone-blue">
                          {kindLabel(body)}
                        </span>
                      ) : null}
                      <span className="text-xs text-muted-foreground">{review.source}</span>
                    </div>
                  </div>
                  <Badge tone={STATUS_TONE[review.status]}>{review.status}</Badge>
                </div>
                {body ? <ReviewBodyDetails body={body} /> : null}
                {canApprove ? (
                  <div className="mt-3.5">
                    <ReviewActions reviewId={review.id} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </SurfaceCard>
  );
}
