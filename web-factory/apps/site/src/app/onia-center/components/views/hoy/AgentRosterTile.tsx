import { getAgentTone } from "@/app/onia-center/operating-engine";
import type { OperatingAgent, OperatingAgentStatus } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface AgentRosterTileProps {
  agents: OperatingAgent[];
}

const STATUS_LABEL: Record<OperatingAgentStatus, string> = {
  ready: "listos",
  prepared_pending_connection: "preparados",
  planned: "planeados",
  blocked: "bloqueados",
};

const STATUS_ORDER: OperatingAgentStatus[] = ["ready", "prepared_pending_connection", "planned", "blocked"];

function summarizeByStatus(agents: OperatingAgent[]): string {
  const counts = agents.reduce<Partial<Record<OperatingAgentStatus, number>>>((acc, agent) => {
    acc[agent.status] = (acc[agent.status] ?? 0) + 1;
    return acc;
  }, {});

  return STATUS_ORDER.filter((status) => (counts[status] ?? 0) > 0)
    .map((status) => `${counts[status]} ${STATUS_LABEL[status]}`)
    .join(" · ");
}

export function AgentRosterTile({ agents }: AgentRosterTileProps) {
  return (
    <SurfaceCard title={`Agentes (${agents.length})`}>
      {agents.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin agentes visibles todavia.</p>
      ) : (
        <>
          <p className="mb-3 text-xs text-muted-foreground">{summarizeByStatus(agents)}</p>
          <div className="grid gap-2.5">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{agent.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{agent.mission}</p>
                </div>
                <Badge tone={getAgentTone(agent.status)}>{agent.status}</Badge>
              </div>
            ))}
          </div>
        </>
      )}
    </SurfaceCard>
  );
}
