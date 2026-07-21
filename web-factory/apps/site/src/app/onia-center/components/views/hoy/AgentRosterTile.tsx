import { getAgentTone } from "@/app/onia-center/operating-engine";
import type { CenterTone, OperatingAgent, OperatingAgentStatus } from "@/app/onia-center/types";
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

const TONE_DOT: Record<CenterTone, string> = {
  green: "var(--center-tone-green)",
  yellow: "var(--center-tone-yellow)",
  red: "var(--center-tone-red)",
  blue: "var(--center-tone-blue)",
  neutral: "var(--muted-foreground)",
};

const TONE_PILL: Record<CenterTone, string> = {
  green: "onia-center-tone-green",
  yellow: "onia-center-tone-yellow",
  red: "onia-center-tone-red",
  blue: "onia-center-tone-blue",
  neutral: "onia-center-tone-neutral",
};

function countByStatus(agents: OperatingAgent[]): Partial<Record<OperatingAgentStatus, number>> {
  return agents.reduce<Partial<Record<OperatingAgentStatus, number>>>((acc, agent) => {
    acc[agent.status] = (acc[agent.status] ?? 0) + 1;
    return acc;
  }, {});
}

export function AgentRosterTile({ agents }: AgentRosterTileProps) {
  const counts = countByStatus(agents);
  const summary = STATUS_ORDER.filter((status) => (counts[status] ?? 0) > 0);

  return (
    <SurfaceCard
      title="Agentes"
      subtitle="Estado del equipo autónomo"
      className="onia-center-elevated"
      action={
        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold tabular-nums text-muted-foreground">
          {agents.length}
        </span>
      }
    >
      {agents.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin agentes visibles todavía.</p>
      ) : (
        <>
          {summary.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {summary.map((status) => (
                <span
                  key={status}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums ${TONE_PILL[getAgentTone(status)]}`}
                >
                  {counts[status]} {STATUS_LABEL[status]}
                </span>
              ))}
            </div>
          ) : null}
          <div className="grid">
            {agents.map((agent) => {
              const tone = getAgentTone(agent.status);
              return (
                <div
                  key={agent.id}
                  className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted"
                >
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: TONE_DOT[tone] }}
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-foreground">{agent.name}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{agent.mission}</p>
                    </div>
                  </div>
                  <Badge tone={tone}>{agent.status}</Badge>
                </div>
              );
            })}
          </div>
        </>
      )}
    </SurfaceCard>
  );
}
