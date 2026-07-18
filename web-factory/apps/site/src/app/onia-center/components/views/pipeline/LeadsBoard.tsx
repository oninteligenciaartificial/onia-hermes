import type { RuntimeLead } from "@/lib/onia-center-store";
import { SurfaceCard } from "../../ui/SurfaceCard";

const STAGES: { key: RuntimeLead["status"]; label: string }[] = [
  { key: "nuevo", label: "Nuevos" },
  { key: "contactado", label: "Contactados" },
  { key: "reunion", label: "Reunion" },
  { key: "propuesta", label: "Propuesta" },
];

interface LeadsBoardProps {
  leads: RuntimeLead[];
}

export function LeadsBoard({ leads }: LeadsBoardProps) {
  const won = leads.filter((lead) => lead.status === "ganado").length;
  const lost = leads.filter((lead) => lead.status === "perdido").length;

  return (
    <SurfaceCard title={`Pipeline de leads (${won} ganados · ${lost} perdidos)`}>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {STAGES.map((stage) => {
          const items = leads.filter((lead) => lead.status === stage.key);
          return (
            <div key={stage.key} className="min-w-[210px] flex-1">
              <div className="mb-2 flex items-center justify-between border-b border-border pb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {stage.label}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">{items.length}</span>
              </div>
              <div className="grid gap-2">
                {items.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Sin leads aca.</p>
                ) : (
                  items.map((lead) => (
                    <div key={lead.id} className="rounded-lg border border-border bg-background p-2.5">
                      <p className="text-sm font-medium">{lead.company}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{lead.contact || lead.source}</p>
                      {lead.nextAction ? (
                        <p className="mt-1 text-xs text-muted-foreground">{lead.nextAction}</p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
