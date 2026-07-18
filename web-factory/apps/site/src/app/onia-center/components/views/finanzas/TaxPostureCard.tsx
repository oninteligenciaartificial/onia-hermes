import type { TaxPosture } from "@/app/onia-center/live/live-runtime";
import { formatBs } from "@/app/onia-center/engine";
import { Badge } from "../../ui/Badge";
import { EmptyState } from "../../ui/EmptyState";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface TaxPostureCardProps {
  taxPosture: TaxPosture | null;
}

export function TaxPostureCard({ taxPosture }: TaxPostureCardProps) {
  if (!taxPosture) {
    return (
      <EmptyState
        title="Postura fiscal en camino"
        body="El Agente Finanzas todavia no dejo la estimacion fiscal del mes. Cuando corra, aca ves IVA, IUE y el credito fiscal."
      />
    );
  }

  const ivaIsCredit = taxPosture.ivaSaldoFavorBs > taxPosture.ivaAPagarBs;
  const kpis = [
    {
      label: ivaIsCredit ? "IVA saldo a favor" : "IVA a pagar",
      value: formatBs(ivaIsCredit ? taxPosture.ivaSaldoFavorBs : taxPosture.ivaAPagarBs),
    },
    { label: "IUE estimado (anual)", value: formatBs(taxPosture.iueEstimadoBs) },
    { label: "IT del mes", value: formatBs(taxPosture.itBs) },
    { label: "Retenciones IUE-BE", value: formatBs(taxPosture.iueBeRetencionesBs) },
  ];

  return (
    <SurfaceCard title={`Postura fiscal${taxPosture.period ? ` · ${taxPosture.period}` : ""}`}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label}>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="mt-0.5 text-lg font-semibold">{kpi.value}</p>
          </div>
        ))}
      </div>

      {taxPosture.creditoFiscalPerdidoBs > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="red">Credito fiscal perdido</Badge>
          <span className="text-sm font-semibold" style={{ color: "var(--center-tone-red)" }}>
            {formatBs(taxPosture.creditoFiscalPerdidoBs)}
          </span>
          <span className="text-xs text-muted-foreground">por gastos sin factura</span>
        </div>
      ) : null}

      {taxPosture.proximoVencimiento ? (
        <p className="mt-4 text-sm">
          Proximo vencimiento IVA/IT: <span className="font-medium">{taxPosture.proximoVencimiento}</span>
          {taxPosture.diasParaVencimiento !== null ? (
            <span className="text-muted-foreground"> (en {taxPosture.diasParaVencimiento} dias)</span>
          ) : null}
        </p>
      ) : null}

      <p className="mt-3 text-xs text-muted-foreground">
        Estimacion automatica, validar con contador{taxPosture.regime ? ` · regimen ${taxPosture.regime}` : ""}.
      </p>
    </SurfaceCard>
  );
}
