import type { ReactNode } from "react";
import Link from "next/link";
import type { RuntimeReview } from "@/lib/onia-center-store";
import type { ReviewBody } from "@/app/onia-center/live/live-runtime";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { ReviewRow } from "./ReviewRow";

interface ReviewQueueTileProps {
  reviews: RuntimeReview[];
  bodies?: Record<string, ReviewBody>;
  canApprove?: boolean;
}

function icon(body?: ReviewBody): string {
  if (body?.kind === "content_carousel") {
    return "🖼️";
  }
  if (body?.kind === "content_script") {
    return "🎬";
  }
  return "📝";
}

function cap(value?: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

// Tipo legible del borrador (mockup .qtype): "Guión · Reel", "Carrusel".
function typeLabel(body?: ReviewBody): string {
  if (body?.kind === "content_carousel") {
    return "Carrusel";
  }
  if (body?.kind === "content_script") {
    return body.format ? `Guión · ${cap(body.format)}` : "Guión";
  }
  return "Propuesta";
}

// Preview de una línea (mockup .qsub): fuente + un descriptor honesto del contenido.
function subline(review: RuntimeReview, body?: ReviewBody): string {
  const parts = [review.source].filter(Boolean);
  if (body?.kind === "content_carousel" && body.slides && body.slides.length > 0) {
    parts.push(`${body.slides.length} láminas`);
  } else if (body?.kind === "content_script") {
    parts.push("gancho, desarrollo y CTA");
  }
  return parts.join(" · ");
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

function ReviewBodyContent({ body }: { body: ReviewBody }) {
  const meta = [body.format, body.pillar].filter(Boolean).join(" · ");

  return (
    <div className="grid gap-3.5 rounded-lg border border-border bg-secondary/50 p-4">
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
  );
}

export function ReviewQueueTile({ reviews, bodies, canApprove }: ReviewQueueTileProps) {
  const pending = reviews.filter((review) => review.status === "pendiente");

  return (
    <SurfaceCard
      title="Necesita tu aprobación"
      className="onia-center-elevated"
      contentClassName=""
      action={
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums onia-center-tone-yellow">
          {pending.length} {pending.length === 1 ? "pendiente" : "pendientes"}
        </span>
      }
      footer={
        <span>
          Nada se publica ni se envía sin tu OK.{" "}
          <Link
            href="/onia-center/next/pipeline"
            className="font-semibold text-[color:var(--accent-strong)] hover:underline"
          >
            Ir al Pipeline →
          </Link>
        </span>
      }
    >
      {pending.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">Nada esperando tu aprobación ahora mismo.</p>
      ) : (
        <div className="grid">
          {pending.map((review) => {
            const body = bodies?.[review.id];
            return (
              <ReviewRow
                key={review.id}
                reviewId={review.id}
                icon={icon(body)}
                typeLabel={typeLabel(body)}
                title={review.title}
                sub={subline(review, body)}
                canApprove={canApprove}
              >
                {body ? <ReviewBodyContent body={body} /> : null}
              </ReviewRow>
            );
          })}
        </div>
      )}
    </SurfaceCard>
  );
}
