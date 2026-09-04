"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RuntimeLead } from "@/lib/onia-center-store";

const STAGE_OPTIONS: { value: RuntimeLead["status"]; label: string }[] = [
  { value: "nuevo", label: "Nuevo" },
  { value: "contactado", label: "Contactado" },
  { value: "reunion", label: "Reunion" },
  { value: "propuesta", label: "Propuesta" },
  { value: "ganado", label: "Ganado" },
  { value: "perdido", label: "Perdido" },
];

interface LeadCardProps {
  lead: RuntimeLead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function move(status: RuntimeLead["status"]) {
    if (status === lead.status || busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/onia-center/runtime", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entity: "lead", id: lead.id, status }),
      });
      const body = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !body.ok) {
        setError(body.message ?? "No se pudo mover el lead.");
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
    <div className="rounded-lg border border-border bg-background p-2.5">
      <p className="text-sm font-medium">{lead.company}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{lead.contact || lead.source}</p>
      {lead.source && lead.contact ? (
        <span className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          src: {lead.source}
        </span>
      ) : null}
      {lead.nextAction ? <p className="mt-1 text-xs text-muted-foreground">{lead.nextAction}</p> : null}
      <select
        value={lead.status}
        onChange={(event) => move(event.target.value as RuntimeLead["status"])}
        disabled={busy}
        aria-label="Mover lead de etapa"
        className="mt-2 h-7 w-full rounded-md border border-border bg-card px-1.5 text-xs text-foreground outline-none focus:border-primary disabled:opacity-50"
      >
        {STAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {busy && option.value === lead.status ? "Moviendo…" : option.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
