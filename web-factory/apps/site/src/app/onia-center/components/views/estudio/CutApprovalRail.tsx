"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, EyeOff, Scissors, SlidersHorizontal, X } from "lucide-react";
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

type RailAction = "approve" | "adjust";
type Resolved = "approved" | "needs_changes";

function NoSegments() {
  return (
    <p className="px-[18px] py-6 text-center text-[11.5px] text-muted-foreground">
      Detección lista. Abrí este corte para revisar sus segmentos antes de aplicar.
    </p>
  );
}

/**
 * Rail de la "regla de oro": la cola de cortes que NECESITA el OK de Sergio antes de
 * aplicar. Los botones escriben de verdad a Supabase reusando el mismo contrato que la
 * aprobación de reviews/tareas del panel (ReviewRow / TaskStatusSelect):
 *   PATCH /api/onia-center/runtime  { entity: "review", id: <review_key>, status }
 * El corte es una fila de review_queue (source_type=video_cut), así que su `id` ES el
 * review_key. Aprobar → status "approved"; Ajustar → status "needs_changes" (+ nota
 * best-effort enlazada al corte). Como getVideoCutRows() sólo trae status=pending, tras
 * router.refresh() el corte resuelto sale solo de la cola. Sólo Sergio puede: el endpoint
 * devuelve 403 para otros roles y esa razón se muestra en el estado de error.
 */
export function CutApprovalRail({ review, waitingCount, focus, onOpenFocus, onExitFocus }: CutApprovalRailProps) {
  const router = useRouter();
  const hasSegments = review.detail && review.segments.length > 0;

  const [mode, setMode] = useState<"idle" | "adjust">("idle");
  const [note, setNote] = useState("");
  const [action, setAction] = useState<RailAction | null>(null);
  const [resolved, setResolved] = useState<Resolved | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Al cambiar de corte activo (tras refresh el resuelto sale de la cola y entra el
  // siguiente) se resetea el estado local para no arrastrar busy/nota del anterior.
  useEffect(() => {
    setMode("idle");
    setNote("");
    setAction(null);
    setResolved(null);
    setError(null);
  }, [review.id]);

  const locked = action !== null || resolved !== null;

  async function patchStatus(status: Resolved): Promise<boolean> {
    try {
      const response = await fetch("/api/onia-center/runtime", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entity: "review", id: review.id, status }),
      });
      const body = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !body.ok) {
        setError(body.message ?? "No se pudo actualizar el corte.");
        return false;
      }
      return true;
    } catch {
      setError("Error de red, reintentá.");
      return false;
    }
  }

  // Nota best-effort: se guarda como nota de auditoría enlazada al corte (entity_key =
  // review_key). El PATCH de review NO tiene campo de nota (ver gap en el handoff), por
  // eso va como entidad `note` aparte. Un fallo acá no revierte el cambio de estado.
  async function postAdjustNote(detail: string): Promise<void> {
    await fetch("/api/onia-center/runtime", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        entity: "note",
        data: {
          kind: "nota",
          title: `Ajuste de cortes · ${review.title}`,
          detail,
          linkedTo: review.id,
          actorRole: "sergio",
          visibility: "team_safe",
        },
      }),
    });
  }

  async function approve() {
    if (locked) return;
    setAction("approve");
    setError(null);
    const ok = await patchStatus("approved");
    if (!ok) {
      setAction(null);
      return;
    }
    setResolved("approved");
    router.refresh();
  }

  async function confirmAdjust() {
    if (locked) return;
    setAction("adjust");
    setError(null);
    const ok = await patchStatus("needs_changes");
    if (!ok) {
      setAction(null);
      return;
    }
    try {
      await postAdjustNote(note.trim() || "Ajustar cortes");
    } catch {
      // Nota best-effort: el estado ya cambió a needs_changes; no revertimos por la nota.
    }
    setResolved("needs_changes");
    router.refresh();
  }

  const approveLabel =
    action === "approve" ? "Aprobando…" : resolved === "approved" ? "Aprobado" : "Aprobar corte";

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

        {mode === "adjust" ? (
          <div className="grid gap-2">
            <label htmlFor={`cut-adjust-note-${review.id}`} className="text-[11px] font-semibold text-foreground">
              Qué ajustar <span className="font-normal text-muted-foreground">(opcional)</span>
            </label>
            <textarea
              id={`cut-adjust-note-${review.id}`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              disabled={locked}
              rows={2}
              placeholder="Ej: mantené el segmento 0:12–0:18, recortá la muletilla del inicio…"
              className="min-h-[56px] w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-[12.5px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[color:var(--ring)] disabled:opacity-60"
            />
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={confirmAdjust}
                disabled={locked}
                className="inline-flex flex-[1.4] items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-[13px] font-semibold text-foreground transition-colors hover:border-[color:var(--muted-foreground)] hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)] disabled:pointer-events-none disabled:opacity-60"
              >
                <SlidersHorizontal size={15} aria-hidden="true" />
                {action === "adjust" ? "Enviando…" : resolved === "needs_changes" ? "Enviado a ajuste" : "Confirmar ajuste"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("idle");
                  setNote("");
                  setError(null);
                }}
                disabled={locked}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)] disabled:pointer-events-none disabled:opacity-60"
              >
                <X size={15} aria-hidden="true" />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={approve}
              disabled={locked}
              aria-busy={action === "approve"}
              className="inline-flex flex-[1.4] items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-[var(--panel-shadow-sm)] transition-[filter,transform] hover:brightness-[1.06] active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)] disabled:pointer-events-none disabled:opacity-60"
            >
              <Check size={15} aria-hidden="true" />
              {approveLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode("adjust");
              }}
              disabled={locked}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-[13px] font-semibold text-foreground transition-colors hover:border-[color:var(--muted-foreground)] hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)] disabled:pointer-events-none disabled:opacity-60"
            >
              <SlidersHorizontal size={15} aria-hidden="true" />
              Ajustar
            </button>
          </div>
        )}

        {error ? (
          <p role="alert" className="mt-2 text-[11.5px] font-medium text-destructive">
            {error}
          </p>
        ) : null}

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
