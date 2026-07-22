import type { ReactNode } from "react";
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

// Un campo etiquetado del guion: rótulo pequeño en mayúsculas + contenido con
// aire. Da jerarquía clara (gancho vs desarrollo vs CTA) en vez de un bloque denso.
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function ReviewBodyDetails({ body }: { body: ReviewBody }) {
  const label = body.kind === "content_carousel" ? "Ver carrusel" : "Ver guion";
  const meta = [body.format, body.pillar].filter(Boolean).join(" · ");

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
      <div className="mt-2.5 grid gap-3.5 rounded-lg border border-border bg-muted/40 p-4">
        {body.kind === "content_script" ? (
          <>
            {meta ? (
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{meta}</p>
            ) : null}
            {body.hook ? (
              <Field label="Gancho">
                <p className="text-[15px] font-semibold leading-snug text-foreground">{body.hook}</p>
              </Field>
            ) : null}
            {body.body ? (
              <Field label="Desarrollo">
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{body.body}</p>
              </Field>
            ) : null}
            {body.cta ? (
              <Field label="CTA">
                <p className="text-sm font-medium leading-relaxed text-foreground">{body.cta}</p>
              </Field>
            ) : null}
          </>
        ) : (
          <>
            {body.title ? (
              <Field label="Título">
                <p className="text-[15px] font-semibold leading-snug text-foreground">{body.title}</p>
              </Field>
            ) : null}
            {body.slides && body.slides.length > 0 ? (
              <Field label={`Láminas (${body.slides.length})`}>
                <ol className="grid gap-2">
                  {body.slides.map((slide, index) => (
                    <li key={index} className="flex gap-2.5">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-background text-[11px] font-semibold tabular-nums text-muted-foreground">
                        {index + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-foreground/90">{slide}</span>
                    </li>
                  ))}
                </ol>
              </Field>
            ) : null}
            {body.cta ? (
              <Field label="CTA">
                <p className="text-sm font-medium leading-relaxed text-foreground">{body.cta}</p>
              </Field>
            ) : null}
          </>
        )}
      </div>
    </details>
  );
}

export function ReviewQueueTile({ reviews, bodies, canApprove }: ReviewQueueTileProps) {
  const pending = reviews.filter((review) => review.status === "pendiente");
  const countClass = pending.length > 0 ? "onia-center-tone-yellow" : "onia-center-tone-neutral";

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
