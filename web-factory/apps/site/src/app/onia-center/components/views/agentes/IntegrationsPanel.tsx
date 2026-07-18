import type { IntegrationConnector } from "@/app/onia-center/live/live-runtime";
import type { CenterTone } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { EmptyState } from "../../ui/EmptyState";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface IntegrationsPanelProps {
  integrations: IntegrationConnector[];
}

const STATUS_META: Record<string, { tone: CenterTone; label: string; rank: number }> = {
  connected: { tone: "green", label: "Conectado", rank: 0 },
  active: { tone: "green", label: "Activo", rank: 0 },
  live: { tone: "green", label: "En vivo", rank: 0 },
  config_pending: { tone: "yellow", label: "Por configurar", rank: 1 },
  manual_only: { tone: "blue", label: "Manual", rank: 2 },
  planned: { tone: "neutral", label: "Planeado", rank: 3 },
  blocked: { tone: "red", label: "Bloqueado", rank: 4 },
};

function meta(status: string) {
  return STATUS_META[status] ?? { tone: "neutral" as CenterTone, label: status, rank: 5 };
}

export function IntegrationsPanel({ integrations }: IntegrationsPanelProps) {
  if (integrations.length === 0) {
    return (
      <EmptyState
        title="Integraciones sin datos"
        body="No se pudo leer el estado de las integraciones desde Supabase ahora mismo."
      />
    );
  }

  const sorted = [...integrations].sort((a, b) => {
    const rankDiff = meta(a.status).rank - meta(b.status).rank;
    return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
  });

  const counts = new Map<string, number>();
  for (const item of integrations) {
    const label = meta(item.status).label;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return (
    <SurfaceCard title={`Integraciones (${integrations.length})`}>
      <div className="mb-3 border-b border-border pb-3 text-xs text-muted-foreground">
        {[...counts.entries()].map(([label, count]) => `${count} ${label.toLowerCase()}`).join(" · ")}
      </div>
      <div className="grid gap-2.5">
        {sorted.map((item) => {
          const { tone, label } = meta(item.status);
          return (
            <div key={item.key} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.selfHosted ? (
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      self-hosted
                    </span>
                  ) : null}
                </div>
                {item.nextAction ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.nextAction}</p>
                ) : null}
              </div>
              <Badge tone={tone}>{label}</Badge>
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
