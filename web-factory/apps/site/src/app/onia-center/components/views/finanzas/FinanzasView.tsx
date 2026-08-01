import type { CostItem, FinanceSummary } from "@/app/onia-center/live/live-runtime";
import type { RoleId } from "@/app/onia-center/types";
import { getVisibleCenters } from "@/app/onia-center/engine";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { CostsCard } from "./CostsCard";
import { EarningsCard } from "./EarningsCard";
import { FinanceSummaryCard } from "./FinanceSummaryCard";
import { TaxPostureCard } from "./TaxPostureCard";

interface FinanzasViewProps {
  role: RoleId;
  summary: FinanceSummary | null;
  costItems: CostItem[];
}

export function FinanzasView({ role, summary, costItems }: FinanzasViewProps) {
  const centers = getVisibleCenters(role);

  return (
    <div className="grid gap-6">
      <header className="grid gap-1">
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Finanzas</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Caja, Fondo Onia, postura fiscal y lo que gana cada persona. Lo deja el agente Finanzas al correr.
        </p>
      </header>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <FinanceSummaryCard summary={summary} />
        <EarningsCard earnings={summary?.earnings ?? []} />
      </div>
      <TaxPostureCard taxPosture={summary?.taxPosture ?? null} />
      <CostsCard costItems={costItems} />
      <SurfaceCard title="Centros contables">
        <div className="grid gap-3">
          {centers.map((center) => (
            <div
              key={center.id}
              className="flex items-start justify-between gap-3 border-t border-border py-3 first:border-t-0 first:pt-0.5 last:pb-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{center.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{center.rule}</p>
              </div>
              <Badge tone={center.tone}>{center.owner}</Badge>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
