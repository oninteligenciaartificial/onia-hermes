import { getAgentTone } from "@/app/onia-center/operating-engine";
import type { OperatingAgent } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface AgentRosterTileProps {
  agents: OperatingAgent[];
}

export function AgentRosterTile({ agents }: AgentRosterTileProps) {
  return (
    <SurfaceCard title="Agentes">
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
    </SurfaceCard>
  );
}
