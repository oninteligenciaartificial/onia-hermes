import type { FinanceSummary } from "@/app/onia-center/live/live-runtime";
import { formatBs } from "@/app/onia-center/engine";
import { Badge } from "../../ui/Badge";
import { EmptyState } from "../../ui/EmptyState";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface FinanceSummaryCardProps {
  summary: FinanceSummary | null;
}

function formatWhen(iso: string): string {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString("es-BO");
}

export function FinanceSummaryCard({ summary }: FinanceSummaryCardProps) {
  if (!summary) {
    return (
      <EmptyState
        title="El agente Finanzas aun no dejo resumen"
        body="El Agente Finanzas y Fondo Onia corre de lunes a sabado 07:15 (La Paz) y deja aca la caja, el Fondo Onia y las alertas. Cuando corra, este panel se llena solo."
      />
    );
  }

  const kpis = [
    { label: "Caja acumulada", value: formatBs(summary.cashTotalBs) },
    { label: "Caja 30 dias", value: formatBs(summary.cashPeriodBs) },
    { label: "Fondo Onia", value: formatBs(summary.fundTotalBs) },
    { label: "Comisiones pendientes", value: formatBs(summary.commissionsPendingBs) },
  ];

  return (
    <SurfaceCard title={summary.periodLabel || "Resumen financiero"}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label}>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="mt-0.5 text-lg font-semibold">{kpi.value}</p>
          </div>
        ))}
      </div>

      {summary.anomalyCount > 0 ? (
        <div className="mt-4 grid gap-2">
          <Badge tone="red">{summary.anomalyCount} alertas</Badge>
          <ul className="grid gap-1.5">
            {summary.anomalies.map((anomaly, index) => (
              <li key={`${anomaly.kind}-${index}`} className="text-sm">
                <span className="text-muted-foreground">{anomaly.kind}:</span> {anomaly.detail}
                {anomaly.amountBs ? ` (${formatBs(anomaly.amountBs)})` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Sin anomalias detectadas.</p>
      )}

      {summary.summaryText ? (
        <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">{summary.summaryText}</p>
      ) : null}

      {summary.generatedAt ? (
        <p className="mt-4 text-xs text-muted-foreground">Ultima corrida: {formatWhen(summary.generatedAt)}</p>
      ) : null}
    </SurfaceCard>
  );
}
