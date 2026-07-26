import type { AgentRunEntry } from "@/app/onia-center/live/live-runtime";
import type { CenterTone } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface AgentRunFeedPanelProps {
  feed: AgentRunEntry[];
}

function formatWhen(iso: string): string {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString("es-BO");
}

// Etiqueta legible de la accion cruda de audit_logs.
const ACTION_LABEL: Record<string, string> = {
  agent_trigger: "Disparo",
  create: "Alta",
  update_status: "Cambio de estado",
  note: "Nota",
};

function actionLabel(action: string): string {
  return ACTION_LABEL[action] ?? action;
}

// Estado de la corrida: viene en raw.status para los disparos; para otros
// eventos no hay estado y se muestra el tipo de accion.
function statusMeta(entry: AgentRunEntry): { tone: CenterTone; label: string } {
  if (entry.status === "sent") {
    return { tone: "green", label: "enviado" };
  }
  if (entry.status === "failed") {
    return { tone: "red", label: "fallido" };
  }
  if (entry.status) {
    return { tone: "neutral", label: entry.status };
  }
  return { tone: "neutral", label: actionLabel(entry.action) };
}

export function AgentRunFeedPanel({ feed }: AgentRunFeedPanelProps) {
  return (
    <SurfaceCard title={`Auditoria (${feed.length})`}>
      {feed.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sin corridas registradas todavia. Cuando dispares un agente o el motor registre un evento, aparece aca.
        </p>
      ) : (
        <div className="grid gap-2.5">
          {feed.slice(0, 30).map((entry) => {
            const { tone, label } = statusMeta(entry);
            const who = entry.agentName ?? actionLabel(entry.action);
            return (
              <div key={entry.id} className="flex items-start justify-between gap-3 border-b border-border pb-2.5 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <p className="text-sm font-medium">{who}</p>
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{actionLabel(entry.action)}</span>
                  </div>
                  {entry.summary ? <p className="mt-0.5 text-xs text-muted-foreground">{entry.summary}</p> : null}
                  {entry.at ? <p className="mt-0.5 text-[11px] text-muted-foreground">{formatWhen(entry.at)}</p> : null}
                </div>
                <Badge tone={tone}>{label}</Badge>
              </div>
            );
          })}
        </div>
      )}
    </SurfaceCard>
  );
}
