"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RuntimeTask } from "@/lib/onia-center-store";

const STATUS_OPTIONS: { value: RuntimeTask["status"]; label: string; sergioOnly?: boolean }[] = [
  { value: "todo", label: "Pendiente" },
  { value: "doing", label: "En progreso" },
  { value: "review", label: "Enviar a revision" },
  { value: "blocked", label: "Bloqueada" },
  { value: "done", label: "Aprobada", sergioOnly: true },
];

interface TaskStatusSelectProps {
  taskId: string;
  status: RuntimeTask["status"];
  /** Sergio puede cerrar (done). El resto del equipo solo hasta revision. */
  canApprove: boolean;
  /** Muestra la etiqueta "Estado" antes del select (vista pipeline). */
  showLabel?: boolean;
}

/**
 * Control compartido para cambiar el estado de una tarea (todo -> doing -> review -> done)
 * desde el panel nuevo. Hace PATCH a /api/onia-center/runtime (entity: task) y refresca
 * la vista. El cierre a "done" queda deshabilitado para roles que no son Sergio, igual que
 * en la vista legacy /equipo. El endpoint tambien lo bloquea server-side.
 */
export function TaskStatusSelect({ taskId, status, canApprove, showLabel = false }: TaskStatusSelectProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function changeStatus(next: RuntimeTask["status"]) {
    if (next === status || busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/onia-center/runtime", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entity: "task", id: taskId, status: next }),
      });
      const body = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !body.ok) {
        setError(body.message ?? "No se pudo actualizar la tarea.");
        setBusy(false);
        return;
      }
      setBusy(false);
      router.refresh();
    } catch {
      setError("Error de red, reintenta.");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showLabel ? (
        <label className="text-xs text-muted-foreground" htmlFor={`task-status-${taskId}`}>
          Estado
        </label>
      ) : null}
      <select
        id={`task-status-${taskId}`}
        aria-label="Estado de la tarea"
        value={status}
        disabled={busy}
        onChange={(event) => changeStatus(event.target.value as RuntimeTask["status"])}
        className="h-8 rounded-md border border-border bg-card px-2 text-xs text-foreground outline-none focus:border-primary disabled:opacity-50"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} disabled={option.sergioOnly && !canApprove}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </div>
  );
}
