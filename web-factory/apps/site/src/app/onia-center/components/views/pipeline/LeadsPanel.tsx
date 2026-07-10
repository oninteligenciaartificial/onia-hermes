import type { RuntimeLead } from "@/lib/onia-center-store";
import type { CenterTone } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

const STATUS_TONE: Record<RuntimeLead["status"], CenterTone> = {
  nuevo: "blue",
  contactado: "yellow",
  reunion: "yellow",
  propuesta: "yellow",
  ganado: "green",
  perdido: "red",
};

const STATUS_LABEL: Record<RuntimeLead["status"], string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  reunion: "Reunion",
  propuesta: "Propuesta",
  ganado: "Ganado",
  perdido: "Perdido",
};

const CLOSED: RuntimeLead["status"][] = ["ganado", "perdido"];

interface LeadsPanelProps {
  leads: RuntimeLead[];
}

export function LeadsPanel({ leads }: LeadsPanelProps) {
  const open = leads.filter((lead) => !CLOSED.includes(lead.status));

  return (
    <SurfaceCard title={`Leads (${open.length} abiertos · ${leads.length} total)`}>
      {leads.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin leads todavia.</p>
      ) : (
        <div className="grid gap-2.5">
          {leads.map((lead) => (
            <div key={lead.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{lead.company}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{lead.contact || lead.source}</p>
                {lead.nextAction ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">Proxima: {lead.nextAction}</p>
                ) : null}
              </div>
              <Badge tone={STATUS_TONE[lead.status]}>{STATUS_LABEL[lead.status]}</Badge>
            </div>
          ))}
        </div>
      )}
    </SurfaceCard>
  );
}
