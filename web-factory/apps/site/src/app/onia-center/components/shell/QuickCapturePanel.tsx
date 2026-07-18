"use client";

import { useEffect, useState } from "react";

export function QuickCapturePanel() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  async function save() {
    const title = text.trim();
    if (!title) {
      return;
    }
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch("/api/onia-center/runtime", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entity: "note", data: { kind: "nota", title, detail: "" } }),
      });
      const body = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !body.ok) {
        setError(body.message ?? "No se pudo guardar.");
        setBusy(false);
        return;
      }
      setText("");
      setSaved(true);
      setBusy(false);
    } catch {
      setError("Error de red, reintenta.");
      setBusy(false);
    }
  }

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
            aria-modal="true"
            aria-label="Captura rapida"
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
            <h2 className="text-lg font-medium text-card-foreground">Captura rapida</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Anota algo para no perderlo. Queda como nota interna en ONIA Center.
            </p>
            <textarea
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setSaved(false);
              }}
              rows={5}
              placeholder="Que anotas..."
              className="mt-4 w-full rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-ring"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={busy || text.trim() === ""}
                onClick={save}
                className="h-9 rounded-md border border-border bg-secondary px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
              >
                {busy ? "Guardando..." : "Guardar nota"}
              </button>
              {saved ? (
                <span className="text-xs font-medium" style={{ color: "var(--center-tone-green)" }}>
                  Guardado
                </span>
              ) : null}
              {error ? <span className="text-xs text-destructive">{error}</span> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
