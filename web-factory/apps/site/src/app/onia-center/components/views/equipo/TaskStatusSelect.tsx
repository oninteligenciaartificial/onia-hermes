"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RuntimeTask } from "@/lib/onia-center-store";

/**
 * Cambiar el estado de una tarea desde la vista Equipo (patron de LeadCard).
 * El backend ya trae la regla: el equipo mueve a todo/doing/review; "done"
 * (aprobar el cierre) es solo de Sergio — por eso a los demas se les muestra
 * "Enviar a revision" como ultimo paso.
 */

interface TaskStatusSelectProps {
  task: RuntimeTask;
  canApprove: boolean;
}

const BASE_OPTIONS: Array<{ value: RuntimeTask["status"]; label: string }> = [
  { value: "todo", label: "Pendiente" },
  { value: "doing", label: "En curso" },
  { value: "review", label: "En revision" },
  { value: "blocked", label: "Bloqueada" },
];

export function TaskStatusSelect({ task, canApprove }: TaskStatusSelectProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const options = canApprove
    ? [...BASE_OPTIONS, { value: "done" as const, label: "Hecha (aprobar)" }]
    : BASE_OPTIONS;

  async function move(status: RuntimeTask["status"]) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/onia-center/runtime", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entity: "task", id: task.id, status }),
      });
      const body = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !body.ok) {
        setError(body.message ?? "No se pudo mover la tarea.");
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
    <span className="grid shrink-0 justify-items-end gap-1">
      <select
        value={task.status}
        onChange={(event) => move(event.target.value as RuntimeTask["status"])}
        disabled={busy || (task.status === "done" && !canApprove)}
        aria-label="Estado de la tarea"
        className="h-7 rounded-md border border-border bg-card px-1.5 text-xs text-foreground outline-none focus:border-primary disabled:opacity-50"
      >
        {task.status === "done" && !canApprove ? <option value="done">Hecha</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {busy && option.value === task.status ? "Moviendo…" : option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-[10px] text-destructive">{error}</span> : null}
    </span>
  );
}
