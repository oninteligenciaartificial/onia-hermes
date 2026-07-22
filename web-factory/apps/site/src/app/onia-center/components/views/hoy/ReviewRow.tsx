"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ReviewRowProps {
  reviewId: string;
  icon: string;
  typeLabel: string;
  title: string;
  sub: string;
  /** Sergio ve Aprobar/Rechazar; el resto solo la vista previa. */
  canApprove?: boolean;
  /** Cuerpo del borrador (guion/carrusel) que se muestra al expandir. */
  children?: ReactNode;
}

/**
 * Fila del panel "Necesita tu aprobación" (mockup .qrow): icono + tipo + título +
 * preview, con [Ver] para expandir el borrador y [Aprobar] a la derecha. Rechazar
 * aparece en el área expandida para no ensuciar la fila. Preserva el contrato:
 * PATCH a /api/onia-center/runtime (entity: review) y refresh de la vista.
 */
export function ReviewRow({ reviewId, icon, typeLabel, title, sub, canApprove, children }: ReviewRowProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function act(status: "aprobado" | "rechazado") {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/onia-center/runtime", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entity: "review", id: reviewId, status }),
      });
      const body = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !body.ok) {
        setError(body.message ?? "No se pudo actualizar.");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Error de red, reintentá.");
      setBusy(false);
    }
  }

  const ghost =
    "inline-flex h-8 items-center rounded-md border border-border bg-card px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-[color:var(--faint)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-card disabled:pointer-events-none disabled:opacity-50";

  return (
    <div className="border-b border-[color:var(--line-soft)] last:border-b-0">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary">
        <span
          aria-hidden="true"
          className="grid h-[34px] w-[34px] place-items-center rounded-[9px] border border-[color:var(--line-soft)] bg-secondary text-[15px]"
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.05em] text-[color:var(--faint)]">
            {typeLabel}
          </p>
          <p className="truncate text-[13.5px] font-medium text-foreground">{title}</p>
          {sub ? <p className="truncate text-xs text-muted-foreground">{sub}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {children ? (
            <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className={ghost}>
              {open ? "Ocultar" : "Ver"}
            </button>
          ) : null}
          {canApprove ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => act("aprobado")}
              className="inline-flex h-8 items-center rounded-md bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-[color:var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 focus-visible:ring-offset-card active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
            >
              {busy ? "…" : "Aprobar"}
            </button>
          ) : null}
        </div>
      </div>

      {open && children ? (
        <div className="px-4 pb-4">
          {children}
          {canApprove ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => act("rechazado")}
                className="inline-flex h-8 items-center rounded-md border border-border bg-card px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 focus-visible:ring-offset-1 focus-visible:ring-offset-card disabled:pointer-events-none disabled:opacity-50"
              >
                Rechazar
              </button>
              {error ? <span className="text-xs font-medium text-destructive">{error}</span> : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {!open && error ? <p className="px-4 pb-3 text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
