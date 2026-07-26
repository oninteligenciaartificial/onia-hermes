"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RuntimeNote, RuntimeTask } from "@/lib/onia-center-store";
import { TaskStatusSelect } from "../../ui/TaskStatusSelect";

interface TaskControlsProps {
  taskId: string;
  status: RuntimeTask["status"];
  evidence: string;
  evidenceNotes: RuntimeNote[];
  canApprove: boolean;
}

export function TaskControls({ taskId, status, evidence, evidenceNotes, canApprove }: TaskControlsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [evidenceText, setEvidenceText] = useState("");

  async function attachEvidence() {
    const trimmed = evidenceText.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/onia-center/runtime", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          entity: "note",
          data: {
            kind: "evidencia",
            title: `Evidencia: ${trimmed}`.slice(0, 120),
            detail: trimmed,
            linkedTo: taskId,
            createdAt: new Date().toISOString(),
          },
        }),
      });
      const body = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !body.ok) {
        setError(body.message ?? "No se pudo adjuntar la evidencia.");
        setBusy(false);
        return;
      }
      setEvidenceText("");
      setBusy(false);
      router.refresh();
    } catch {
      setError("Error de red, reintenta.");
      setBusy(false);
    }
  }

  return (
    <div className="mt-2 grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <TaskStatusSelect taskId={taskId} status={status} canApprove={canApprove} showLabel />
        <button
          type="button"
          onClick={() => setEvidenceOpen((open) => !open)}
          aria-expanded={evidenceOpen}
          className="h-8 rounded-md border border-border bg-card px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Evidencia{evidenceNotes.length ? ` (${evidenceNotes.length})` : ""}
        </button>
      </div>

      {evidenceOpen ? (
        <div className="grid gap-2 rounded-md border border-border bg-background px-3 py-2">
          <p className="text-xs text-muted-foreground">Requisito de evidencia: {evidence}</p>
          {evidenceNotes.length ? (
            <ul className="grid gap-1">
              {evidenceNotes.map((note) => (
                <li key={note.id} className="text-sm text-foreground">
                  {note.detail || note.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">Sin evidencia adjunta.</p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={evidenceText}
              onChange={(event) => setEvidenceText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") attachEvidence();
              }}
              placeholder="Link o nota de evidencia…"
              disabled={busy}
              className="h-8 min-w-[10rem] flex-1 rounded-md border border-border bg-card px-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary disabled:opacity-50"
            />
            <button
              type="button"
              disabled={busy || !evidenceText.trim()}
              onClick={attachEvidence}
              className="h-8 rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
            >
              {busy ? "Guardando…" : "Adjuntar"}
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
