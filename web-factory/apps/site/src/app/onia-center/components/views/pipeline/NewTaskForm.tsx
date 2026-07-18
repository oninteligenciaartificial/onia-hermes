"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RoleId } from "@/app/onia-center/types";

const ASSIGNEES: { role: RoleId; label: string }[] = [
  { role: "arthur", label: "Arthur" },
  { role: "sergio", label: "Yo" },
];

export function NewTaskForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState<RoleId>("arthur");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = title.trim();

  async function create() {
    if (!trimmed || busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/onia-center/runtime", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          entity: "task",
          data: {
            title: trimmed,
            assignedRole: assignee,
            projectId: "project-onia-center",
            status: "todo",
            priority: "media",
            evidence: "",
          },
        }),
      });
      const body = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !body.ok) {
        setError(body.message ?? "No se pudo crear la tarea.");
        setBusy(false);
        return;
      }
      setTitle("");
      setBusy(false);
      router.refresh();
    } catch {
      setError("Error de red, reintenta.");
      setBusy(false);
    }
  }

  return (
    <div className="mb-3 border-b border-border pb-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") create();
          }}
          placeholder="Nueva tarea…"
          disabled={busy}
          className="h-8 min-w-[10rem] flex-1 rounded-md border border-border bg-background px-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary disabled:opacity-50"
        />
        <select
          value={assignee}
          onChange={(event) => setAssignee(event.target.value as RoleId)}
          disabled={busy}
          aria-label="Asignar a"
          className="h-8 rounded-md border border-border bg-card px-2 text-xs text-foreground outline-none focus:border-primary disabled:opacity-50"
        >
          {ASSIGNEES.map((option) => (
            <option key={option.role} value={option.role}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={busy || !trimmed}
          onClick={create}
          className="h-8 rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
        >
          {busy ? "Creando…" : "Crear tarea"}
        </button>
      </div>
      {error ? <p className="mt-1.5 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
