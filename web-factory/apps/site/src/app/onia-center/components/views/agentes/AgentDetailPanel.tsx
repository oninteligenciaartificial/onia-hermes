import { getAgentTone } from "@/app/onia-center/operating-engine";
import type { OperatingAgent } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { AgentTriggerButton } from "./AgentTriggerButton";

function formatWhen(iso: string | null): string | null {
  if (!iso) {
    return null;
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString("es-BO");
}

interface AgentDetailPanelProps {
  agents: OperatingAgent[];
  lastRuns: Record<string, string | null>;
  canTrigger: boolean;
}

export function AgentDetailPanel({ agents, lastRuns, canTrigger }: AgentDetailPanelProps) {
  return (
    <SurfaceCard title={`Agentes (${agents.length})`}>
      <div className="grid gap-3">
        {agents.map((agent) => {
          const lastRun = formatWhen(lastRuns[agent.id] ?? null);
          return (
            <div key={agent.id} className="grid gap-1 border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{agent.name}</p>
                <Badge tone={getAgentTone(agent.status)}>{agent.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{agent.mission}</p>
              {agent.nextAction ? (
                <p className="text-xs text-muted-foreground">Proxima: {agent.nextAction}</p>
              ) : null}
              {agent.blockedBy.length > 0 ? (
                <p className="text-xs text-muted-foreground">Bloqueado por: {agent.blockedBy.join(", ")}</p>
              ) : null}
              {lastRun ? <p className="text-xs text-muted-foreground">Ultima corrida: {lastRun}</p> : null}
              {canTrigger ? (
                <div className="mt-1">
                  <AgentTriggerButton agentId={agent.id} agentName={agent.name} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
