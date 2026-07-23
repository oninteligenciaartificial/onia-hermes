import { ArrowLeft, Check, EyeOff, Scissors, SlidersHorizontal } from "lucide-react";
import type { CutReview } from "./source";
import { CutPreview } from "./CutPreview";
import { CutTable } from "./CutTable";

interface CutApprovalRailProps {
  review: CutReview;
  waitingCount: number;
  focus: boolean;
  onOpenFocus: () => void;
  onExitFocus: () => void;
}

function NoSegments() {
  return (
    <p className="px-[18px] py-6 text-center text-[11.5px] text-muted-foreground">
      Detección lista. Abrí este corte para revisar sus segmentos antes de aplicar.
    </p>
  );
}

export function CutApprovalRail({ review, waitingCount, focus, onOpenFocus, onExitFocus }: CutApprovalRailProps) {
  const hasSegments = review.detail && review.segments.length > 0;

  return (
    <section
      className="overflow-hidden rounded-2xl border border-[color:var(--gate-line)] bg-card"
      style={{ boxShadow: "var(--panel-shadow-gate)" }}
      aria-label="Aprobación de cortes"
    >
      <div
        className="border-b border-[color:var(--line-soft)] px-[18px] pb-3.5 pt-3.5"
        style={{ background: "linear-gradient(180deg, var(--gate-wash), transparent)" }}
      >
        <div className="flex items-center justify-between gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.05em] text-[color:var(--gate-strong)]">
            <Scissors size={13} aria-hidden="true" />
            Regla de oro
          </span>
          {focus ? (
            <button
              type="button"
              onClick={onExitFocus}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[color:var(--ring)]"
            >
              <ArrowLeft size={13} aria-hidden="true" />
              Salir del foco
            </button>
          ) : (
            <span
              className="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-[0.04em] text-white"
              style={{ background: "var(--gate)" }}
            >
              Necesita tu OK
            </span>
          )}
        </div>
        <h2 className="mt-2 text-[15.5px] font-bold tracking-[-0.015em] text-foreground">Aprobación de cortes</h2>
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          <b className="font-semibold text-foreground">{review.laneLabel}</b> · {review.title} · {review.aspect} · orig{" "}
          <b className="font-semibold text-foreground">{review.origLabel}</b> → final{" "}
          <b className="font-semibold text-foreground">{review.finalLabel}</b>
        </p>
      </div>

      <div
        className="flex items-center gap-2 border-b border-[color:var(--line-soft)] px-[18px] py-2.5"
        style={{ background: "color-mix(in oklch, var(--gate-wash) 55%, var(--card))" }}
      >
        <EyeOff size={14} className="shrink-0 text-[color:var(--gate-strong)]" aria-hidden="true" />
        <p className="text-[11.5px] font-medium text-[color:var(--gate-strong)]">
          Nunca cortar a ciegas — revisá antes de aplicar.
        </p>
      </div>

      {focus ? (
        <div className="lg:grid lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <div className="pb-2 lg:border-r lg:border-[color:var(--line-soft)] lg:pb-4">
            <CutPreview review={review} />
          </div>
          <div>{hasSegments ? <CutTable segments={review.segments} truncateText={false} /> : <NoSegments />}</div>
        </div>
      ) : (
        <>
          <CutPreview review={review} />
          {hasSegments ? <CutTable segments={review.segments} /> : <NoSegments />}
        </>
      )}

      <div
        className="border-t border-[color:var(--line-soft)] px-[18px] pb-4 pt-3.5"
        style={{ background: "color-mix(in oklch, var(--surface-2) 35%, var(--card))" }}
      >
        <div className="mb-3 flex flex-wrap gap-x-3.5 gap-y-1 text-[11px] text-muted-foreground">
          <span>
            <b className="font-semibold tabular-nums text-foreground">{review.detected}</b> cortes detectados
          </span>
          <span>
            <b className="font-semibold tabular-nums text-foreground">{review.keepBlocks}</b> bloques KEEP
          </span>
          <span className="tabular-nums">
            <b className="font-semibold text-foreground">{review.trimLabel}</b> de recorte
          </span>
          <span className="font-semibold text-[color:var(--center-tone-green)]">Detección gratis</span>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            className="inline-flex flex-[1.4] items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-[var(--panel-shadow-sm)] transition-[filter,transform] hover:brightness-[1.06] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
          >
            <Check size={15} aria-hidden="true" />
            Aprobar corte
          </button>
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-[13px] font-semibold text-foreground transition-colors hover:border-[color:var(--muted-foreground)] hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
          >
            <SlidersHorizontal size={15} aria-hidden="true" />
            Ajustar
          </button>
        </div>
        <button
          type="button"
          onClick={focus ? undefined : onOpenFocus}
          className="mt-2.5 block w-full rounded-md py-1 text-center text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[color:var(--ring)]"
        >
          Ver plan completo de cortes ({review.detected}) →
        </button>
      </div>

      {!focus ? (
        <div className="flex items-center justify-between border-t border-[color:var(--line-soft)] px-[18px] py-2.5 text-[11.5px] text-muted-foreground">
          <span>
            <b className="font-semibold text-foreground tabular-nums">{waitingCount}</b> cortes más esperando tu OK
          </span>
          <button
            type="button"
            onClick={onOpenFocus}
            className="rounded-md px-1.5 py-0.5 font-semibold text-[color:var(--gate-strong)] transition-colors hover:bg-[color:var(--gate-wash)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[color:var(--ring)]"
          >
            Ver cola →
          </button>
        </div>
      ) : null}
    </section>
  );
}
