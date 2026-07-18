import type { FinanceSummary } from "@/app/onia-center/live/live-runtime";
import type { RoleId } from "@/app/onia-center/types";
import { getVisibleCenters } from "@/app/onia-center/engine";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { FinanceSummaryCard } from "./FinanceSummaryCard";
import { TaxPostureCard } from "./TaxPostureCard";

interface FinanzasViewProps {
  role: RoleId;
  summary: FinanceSummary | null;
}

export function FinanzasView({ role, summary }: FinanzasViewProps) {
  const centers = getVisibleCenters(role);

  return (
    <div className="grid gap-4">
      <FinanceSummaryCard summary={summary} />
      <TaxPostureCard taxPosture={summary?.taxPosture ?? null} />
      <SurfaceCard title="Centros contables">
        <div className="grid gap-2.5">
          {centers.map((center) => (
            <div key={center.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{center.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{center.rule}</p>
              </div>
              <Badge tone={center.tone}>{center.owner}</Badge>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
