"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TeamMember } from "@/lib/onia-center-store";
import { buildAssignees, defaultAssigneeKey } from "./assignees";

const SERVICE_OPTIONS: { id: string; label: string }[] = [
  { id: "onia-motor-local-growth", label: "ONIA Motor Local Growth" },
  { id: "onia-motor-local-starter", label: "Motor Local Starter" },
  { id: "onia-motor-local-pro", label: "Motor Local Pro" },
  { id: "web-pro-onia", label: "Web Pro ONIA" },
];

const BASE_FORM = {
  company: "",
  contact: "",
  source: "Manual",
  serviceId: "onia-motor-local-growth",
  nextAction: "",
};

const FIELD_CLASS =
  "h-9 w-full rounded-md border border-border bg-background px-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary disabled:opacity-50";
const LABEL_CLASS = "grid gap-1 text-xs font-medium text-muted-foreground";

interface NewLeadFormProps {
  canChooseOwner: boolean;
  /** Roster real del equipo (getOniaCenterTeam). Cada persona trae su userKey. */
  team: TeamMember[];
}

export function NewLeadForm({ canChooseOwner, team }: NewLeadFormProps) {
  const router = useRouter();
  const assignees = useMemo(() => buildAssignees(team), [team]);
  const defaultOwnerKey = useMemo(() => defaultAssigneeKey(assignees), [assignees]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...BASE_FORM, ownerKey: defaultOwnerKey });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function create() {
    const company = form.company.trim();
    if (!company || busy) {
      return;
    }
    setBusy(true);
    setError(null);

    const assignee = assignees.find((item) => item.key === form.ownerKey) ?? assignees[0];
    const data: Record<string, unknown> = {
      company,
      contact: form.contact.trim(),
      source: form.source.trim() || "Manual",
      serviceId: form.serviceId,
      status: "nuevo",
      nextAction: form.nextAction.trim(),
      createdAt: new Date().toISOString(),
    };
    // Solo Sergio elige la PERSONA responsable; estampamos su userKey para que el
    // scorecard separe dos personas del mismo rol (p. ej. dos vendedores). Para el
    // resto de roles el runtime sobreescribe el owner con el actor, no lo mandamos.
    if (canChooseOwner && assignee) {
      data.owner = assignee.role;
      data.ownerUserKey = assignee.userKey;
      data.originUserKey = assignee.userKey;
      data.meetingOwner = assignee.role;
      data.meetingOwnerUserKey = assignee.userKey;
      data.meetingOwnerLabel = assignee.label;
      data.meetingStatus = "pendiente";
    }

    try {
      const response = await fetch("/api/onia-center/runtime", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entity: "lead", data }),
      });
      const body = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !body.ok) {
        setError(body.message ?? "No se pudo crear el lead.");
        setBusy(false);
        return;
      }
      setForm({ ...BASE_FORM, ownerKey: defaultOwnerKey });
      setBusy(false);
      setOpen(false);
      router.refresh();
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
        className="h-9 rounded-md border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      >
        Nuevo lead
      </button>
      {open ? (
        <div className="fixed inset-0 z-30 flex justify-end bg-black/30" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Nuevo lead"
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
            <h2 className="text-lg font-medium text-card-foreground">Nuevo lead</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Queda en la etapa Nuevos del pipeline. El cierre sensible lo aprueba Sergio.
            </p>

            <form
              className="mt-4 grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                create();
              }}
            >
              <label className={LABEL_CLASS}>
                Empresa
                <input
                  type="text"
                  value={form.company}
                  onChange={(event) => update("company", event.target.value)}
                  required
                  disabled={busy}
                  placeholder="Nombre del negocio"
                  className={FIELD_CLASS}
                />
              </label>

              <label className={LABEL_CLASS}>
                Contacto publico
                <input
                  type="text"
                  value={form.contact}
                  onChange={(event) => update("contact", event.target.value)}
                  disabled={busy}
                  placeholder="Telefono, IG o web"
                  className={FIELD_CLASS}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className={LABEL_CLASS}>
                  Fuente
                  <input
                    type="text"
                    value={form.source}
                    onChange={(event) => update("source", event.target.value)}
                    disabled={busy}
                    className={FIELD_CLASS}
                  />
                </label>
                <label className={LABEL_CLASS}>
                  Servicio
                  <select
                    value={form.serviceId}
                    onChange={(event) => update("serviceId", event.target.value)}
                    disabled={busy}
                    className={FIELD_CLASS}
                  >
                    {SERVICE_OPTIONS.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {canChooseOwner ? (
                <label className={LABEL_CLASS}>
                  Responsable
                  <select
                    value={form.ownerKey}
                    onChange={(event) => update("ownerKey", event.target.value)}
                    disabled={busy}
                    className={FIELD_CLASS}
                  >
                    {assignees.map((assignee) => (
                      <option key={assignee.key} value={assignee.key}>
                        {assignee.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <p className="text-xs text-muted-foreground">
                  El lead queda asignado a tu usuario automaticamente.
                </p>
              )}

              <label className={LABEL_CLASS}>
                Proxima accion
                <textarea
                  value={form.nextAction}
                  onChange={(event) => update("nextAction", event.target.value)}
                  disabled={busy}
                  rows={3}
                  placeholder="Que sigue con este lead"
                  className="w-full rounded-md border border-border bg-background p-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary disabled:opacity-50"
                />
              </label>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={busy || form.company.trim() === ""}
                  className="h-9 rounded-md border border-border bg-secondary px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
                >
                  {busy ? "Creando..." : "Registrar lead"}
                </button>
                {error ? <span className="text-xs text-destructive">{error}</span> : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
