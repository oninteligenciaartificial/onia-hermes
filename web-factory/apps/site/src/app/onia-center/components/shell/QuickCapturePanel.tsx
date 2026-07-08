"use client";

import { useState } from "react";
import { EmptyState } from "../ui/EmptyState";

export function QuickCapturePanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-9 rounded-md border border-border bg-card px-3.5 text-sm font-medium text-foreground"
      >
        Notas e ideas
      </button>
      {open ? (
        <div className="fixed inset-0 z-30 flex justify-end bg-black/30" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-label="Notas e ideas"
            onClick={(event) => event.stopPropagation()}
            className="h-full w-full max-w-md overflow-y-auto border-l border-border bg-card p-6"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mb-4 text-sm text-muted-foreground"
            >
              Cerrar
            </button>
            <EmptyState
              title="Notas e ideas en camino"
              body="Esta captura rapida todavia vive en el panel actual. Se conecta a los datos reales cuando se porte esta pieza."
              linkHref="/onia-center"
              linkLabel="Ver notas e ideas en el panel actual"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
