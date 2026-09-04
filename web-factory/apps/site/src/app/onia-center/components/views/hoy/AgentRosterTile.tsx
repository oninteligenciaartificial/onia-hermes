import Link from "next/link";
import type { OperatingAgent, OperatingAgentStatus } from "@/app/onia-center/types";
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

// Cuántos agentes vivos se listan en el vistazo de Hoy antes de mandar al detalle.
const ROSTER_LIMIT = 7;

function relativeWhen(iso: string | null): string | null {
  if (!iso) {
    return null;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const diffMin = Math.round((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) {
    return "recién";
  }
  if (diffMin < 60) {
    return `hace ${diffMin} min`;
  }
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) {
    return `hace ${diffH} h`;
  }
  return `hace ${Math.round(diffH / 24)} d`;
}

export function AgentRosterTile({ agents, liveInfo }: AgentRosterTileProps) {
  const activeCount = agents.filter((agent) => liveInfo?.[agent.id]?.live === true).length;
  const shown = agents.slice(0, ROSTER_LIMIT);
  const overflow = agents.length - shown.length;

  return (
    <SurfaceCard
      title="Agentes"
      className="onia-center-elevated"
      contentClassName="p-1.5"
      action={
        activeCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums onia-center-tone-green">
            {activeCount} activos 24/7
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold tabular-nums text-muted-foreground">
            {agents.length}
          </span>
        )
      }
      footer={
        <Link
          href="/onia-center/next/agentes"
          className="font-semibold text-[color:var(--accent-strong)] hover:underline"
        >
          {overflow > 0 ? `Ver los ${agents.length} agentes →` : "Ver detalle de agentes →"}
        </Link>
      }
    >
      {agents.length === 0 ? (
        <p className="px-2.5 py-3 text-sm text-muted-foreground">Sin agentes visibles todavía.</p>
      ) : (
        <div className="grid">
          {shown.map((agent) => {
            const live = liveInfo?.[agent.id];
            const isLive = live?.live === true;
            const lastRun = relativeWhen(live?.lastRunAt ?? null);
            const cadence = isLive
              ? [live?.cadenceLabel, lastRun ? `última ${lastRun}` : null].filter(Boolean).join(" · ")
              : STATUS_LABEL[agent.status];

            return (
              <div
                key={agent.id}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-[9px] p-2.5 transition-colors hover:bg-secondary"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={
                    isLive
                      ? { background: "var(--primary)", boxShadow: "0 0 0 3px var(--accent-wash)" }
                      : { background: "var(--faint)" }
                  }
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-foreground">{agent.name}</p>
                  {cadence ? (
                    <p className="truncate font-mono text-[11.5px] text-muted-foreground">{cadence}</p>
                  ) : null}
                </div>
                {isLive ? (
                  <span className="inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[10.5px] font-semibold onia-center-tone-green">
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex shrink-0 items-center rounded-md border border-[color:var(--line-soft)] bg-secondary px-2 py-0.5 text-[10.5px] font-medium text-[color:var(--faint)]">
                    Prep.
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
