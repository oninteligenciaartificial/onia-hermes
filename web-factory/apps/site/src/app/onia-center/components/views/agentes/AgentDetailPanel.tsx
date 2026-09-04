import type { CenterTone, OperatingAgent, OperatingAgentStatus } from "@/app/onia-center/types";
import type { LiveAgentStatus } from "@/app/onia-center/live/live-runtime";
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
  liveInfo: Record<string, LiveAgentStatus>;
  canTrigger: boolean;
}

type Presentation = {
  label: string;
  tone: CenterTone;
  /** Puede dispararse a mano (solo agentes que ya corren). */
  runnable: boolean;
};

// Traduce el estado crudo + la señal `live` del contrato a una etiqueta honesta.
// Los agentes en preparación NO muestran botón (no engañar con un "Disparar" que
// no hace nada); los que corren 24/7 sí, como acción opcional.
function present(status: OperatingAgentStatus, isLive: boolean): Presentation {
  if (isLive) {
    return { label: "Activo 24/7", tone: "green", runnable: true };
  }
  switch (status) {
    case "ready":
      return { label: "Listo", tone: "green", runnable: true };
    case "prepared_pending_connection":
      return { label: "En preparación", tone: "yellow", runnable: false };
    case "blocked":
      return { label: "Bloqueado", tone: "red", runnable: false };
    default:
      return { label: "En preparación", tone: "blue", runnable: false };
  }
}

const BADGE_TONE: Record<CenterTone, string> = {
  green: "onia-center-tone-green",
  yellow: "onia-center-tone-yellow",
  red: "onia-center-tone-red",
  blue: "onia-center-tone-blue",
  neutral: "onia-center-tone-neutral",
};

export function AgentDetailPanel({ agents, liveInfo, canTrigger }: AgentDetailPanelProps) {
  const liveCount = agents.filter((agent) => liveInfo[agent.id]?.live === true).length;

  return (
    <SurfaceCard
      title="Agentes"
      subtitle="Cada uno corre solo en su horario. Podés verlos, no hace falta dispararlos."
      action={
        liveCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums onia-center-tone-green">
            {liveCount}/{agents.length} activos 24/7
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold tabular-nums text-muted-foreground">
            {agents.length}
          </span>
        )
      }
    >
      <div className="grid">
        {agents.map((agent) => {
          const live = liveInfo[agent.id];
          const isLive = live?.live === true;
          const presentation = present(agent.status, isLive);
          const lastRun = formatWhen(live?.lastRunAt ?? null);
          return (
            <div key={agent.id} className="grid gap-2 border-t border-border py-4 first:border-t-0 first:pt-0.5 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${BADGE_TONE[presentation.tone]}`}
                >
                  {isLive ? (
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--center-tone-green)" }} aria-hidden="true" />
                  ) : null}
                  {presentation.label}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{agent.mission}</p>

              {live?.cadenceLabel || lastRun ? (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] tabular-nums text-muted-foreground">
                  {live?.cadenceLabel ? (
                    <span>
                      <span className="font-medium text-foreground/70">Corre:</span> {live.cadenceLabel}
                    </span>
                  ) : null}
                  {lastRun ? (
                    <span>
                      <span className="font-medium text-foreground/70">Última:</span> {lastRun}
                    </span>
                  ) : null}
                </div>
              ) : null}

              {agent.nextAction ? (
                <p className="text-xs text-muted-foreground">Próxima: {agent.nextAction}</p>
              ) : null}
              {agent.blockedBy.length > 0 ? (
                <p className="text-xs text-muted-foreground">Bloqueado por: {agent.blockedBy.join(", ")}</p>
              ) : null}

              {canTrigger && presentation.runnable ? (
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <AgentTriggerButton agentId={agent.id} agentName={agent.name} />
                  <span className="text-[11px] text-muted-foreground">corre solo en su horario</span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
