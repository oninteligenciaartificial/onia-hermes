import { getAgentTone } from "@/app/onia-center/operating-engine";
import type { CenterTone, OperatingAgent, OperatingAgentStatus } from "@/app/onia-center/types";
import type { LiveAgentStatus } from "@/app/onia-center/live/live-runtime";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface AgentRosterTileProps {
  agents: OperatingAgent[];
  liveInfo?: Record<string, LiveAgentStatus>;
}

const STATUS_LABEL: Record<OperatingAgentStatus, string> = {
  ready: "Listo",
  prepared_pending_connection: "En preparación",
  planned: "En preparación",
  blocked: "Bloqueado",
};

const TONE_DOT: Record<CenterTone, string> = {
  green: "var(--center-tone-green)",
  yellow: "var(--center-tone-yellow)",
  red: "var(--center-tone-red)",
  blue: "var(--center-tone-blue)",
  neutral: "var(--muted-foreground)",
};

function relativeWhen(iso: string | null): string | null {
  if (!iso) {
    return null;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) {
    return "hace instantes";
  }
  if (diffMin < 60) {
    return `hace ${diffMin} min`;
  }
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) {
    return `hace ${diffH} h`;
  }
  const diffD = Math.round(diffH / 24);
  return `hace ${diffD} d`;
}

export function AgentRosterTile({ agents, liveInfo }: AgentRosterTileProps) {
  const activeCount = agents.filter((agent) => liveInfo?.[agent.id]?.live === true).length;

  return (
    <SurfaceCard
      title="Agentes"
      subtitle="Tu equipo autónomo, corriendo solo"
      className="onia-center-elevated"
      action={
        activeCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tabular-nums onia-center-tone-green">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ background: "var(--center-tone-green)" }}
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--center-tone-green)" }}
              />
            </span>
            {activeCount} activos 24/7
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold tabular-nums text-muted-foreground">
            {agents.length}
          </span>
        )
      }
    >
      {agents.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin agentes visibles todavía.</p>
      ) : (
        <div className="grid">
          {agents.map((agent) => {
            const live = liveInfo?.[agent.id];
            const isLive = live?.live === true;
            const tone: CenterTone = isLive ? "green" : getAgentTone(agent.status);
            const lastRun = relativeWhen(live?.lastRunAt ?? null);
            return (
              <div
                key={agent.id}
                className="-mx-2 flex items-start justify-between gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-muted"
              >
                <div className="flex min-w-0 items-start gap-2.5">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ background: TONE_DOT[tone] }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-foreground">{agent.name}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{agent.mission}</p>
                    {isLive && (live?.cadenceLabel || lastRun) ? (
                      <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
                        {[live?.cadenceLabel, lastRun ? `última: ${lastRun}` : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </div>
                {isLive ? (
                  <span className="inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold onia-center-tone-green">
                    Activo 24/7
                  </span>
                ) : (
                  <span className="inline-flex shrink-0 items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {STATUS_LABEL[agent.status]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </SurfaceCard>
  );
}
