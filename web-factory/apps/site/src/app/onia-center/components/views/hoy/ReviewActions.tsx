"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewActionsProps {
  reviewId: string;
}

export function ReviewActions({ reviewId }: ReviewActionsProps) {
  const router = useRouter();
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
      setError("Error de red, reintenta.");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => act("aprobado")}
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition-[background-color,transform] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 focus-visible:ring-offset-card active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
      >
        {busy ? "Guardando…" : "Aprobar"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => act("rechazado")}
        className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-card px-4 text-xs font-medium text-muted-foreground transition-[color,background-color,border-color,transform] hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 focus-visible:ring-offset-1 focus-visible:ring-offset-card active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
      >
        Rechazar
      </button>
      {error ? <span className="text-xs font-medium text-destructive">{error}</span> : null}
    </div>
  );
}
