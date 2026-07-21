"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TeamMember } from "@/lib/onia-center-store";
import { buildAssignees, defaultAssigneeKey } from "./assignees";

interface NewTaskFormProps {
  /** Solo Sergio elige la persona; el resto se autoasigna a su propio usuario. */
  canChooseAssignee: boolean;
  /** Roster real del equipo (getOniaCenterTeam). Cada persona trae su userKey. */
  team: TeamMember[];
}

export function NewTaskForm({ canChooseAssignee, team }: NewTaskFormProps) {
  const router = useRouter();
  const assignees = useMemo(() => buildAssignees(team), [team]);
  const defaultKey = useMemo(() => defaultAssigneeKey(assignees), [assignees]);
  const [title, setTitle] = useState("");
  const [assigneeKey, setAssigneeKey] = useState(defaultKey);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = title.trim();

  async function create() {
    if (!trimmed || busy) return;
    setBusy(true);
    setError(null);

    const data: Record<string, unknown> = {
      title: trimmed,
      projectId: "project-onia-center",
      status: "todo",
      priority: "media",
      evidence: "",
    };
    // Solo Sergio asigna a otra PERSONA: estampamos assignedUserKey para separar
    // dos personas del mismo rol en el scorecard. Para el resto, el runtime
    // autoasigna la tarea a su propio userKey, asi que no mandamos responsable.
    if (canChooseAssignee) {
      const chosen = assignees.find((item) => item.key === assigneeKey) ?? assignees[0];
      if (chosen) {
        data.assignedRole = chosen.role;
        data.assignedUserKey = chosen.userKey;
      }
    }

    try {
      const response = await fetch("/api/onia-center/runtime", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entity: "task", data }),
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
        {canChooseAssignee ? (
          <select
            value={assigneeKey}
            onChange={(event) => setAssigneeKey(event.target.value)}
            disabled={busy}
            aria-label="Asignar a"
            className="h-8 rounded-md border border-border bg-card px-2 text-xs text-foreground outline-none focus:border-primary disabled:opacity-50"
          >
            {assignees.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        ) : null}
        <button
          type="button"
          disabled={busy || !trimmed}
          onClick={create}
          className="h-8 rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
        >
          {busy ? "Creando…" : "Crear tarea"}
        </button>
      </div>
      {!canChooseAssignee ? (
        <p className="mt-1.5 text-xs text-muted-foreground">La tarea queda asignada a tu usuario.</p>
      ) : null}
      {error ? <p className="mt-1.5 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
