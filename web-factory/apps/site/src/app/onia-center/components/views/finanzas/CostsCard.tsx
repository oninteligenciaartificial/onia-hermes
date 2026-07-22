import type { CostCategory, CostItem } from "@/app/onia-center/live/live-runtime";
import type { CenterTone } from "@/app/onia-center/types";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { Badge } from "../../ui/Badge";

interface CostsCardProps {
  costItems: CostItem[];
}

const CATEGORY_LABEL: Record<CostCategory, string> = {
  infra: "Infraestructura",
  domain: "Dominio",
  api: "API",
  email: "Email",
  tool: "Herramienta",
  other: "Otro",
};

const CATEGORY_TONE: Record<CostCategory, CenterTone> = {
  infra: "blue",
  domain: "neutral",
  api: "green",
  email: "yellow",
  tool: "neutral",
  other: "neutral",
};

const CYCLE_LABEL: Record<CostItem["cycle"], string> = {
  monthly: "por mes",
  yearly: "por año",
  usage: "por uso",
};

// Formatea montos. `usage` con montos chicos (gasto IA, ej 0.006) muestra 3
// decimales; el resto 2. USD sale como "US$ 12.00"; otra moneda como "12.00 EUR".
function formatMoney(amount: number, currency: string, usage = false): string {
  const digits = usage && Math.abs(amount) < 1 ? 3 : 2;
  const num = new Intl.NumberFormat("es-BO", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
  if (currency === "USD" || currency === "") {
    return `US$ ${num}`;
  }
  return `${num} ${currency}`;
}

// Valor mostrado a la derecha de cada item: monto principal + linea de ciclo.
function amountDisplay(item: CostItem): { primary: string; secondary: string } {
  if (item.cycle === "usage") {
    if (item.spendUsdMtd !== null) {
      return { primary: formatMoney(item.spendUsdMtd, item.currency, true), secondary: "este mes · uso" };
    }
    return { primary: "—", secondary: "por uso" };
  }
  if (item.amount === null) {
    return { primary: "por confirmar", secondary: CYCLE_LABEL[item.cycle] };
  }
  return { primary: formatMoney(item.amount, item.currency), secondary: CYCLE_LABEL[item.cycle] };
}

// Total mensual estimado: suma de los mensuales + anuales/12 que tengan monto.
// Los `usage` no cuentan al fijo; los `null` se omiten y se cuentan aparte.
function monthlyEstimate(costItems: CostItem[]): { total: number; missing: number } {
  let total = 0;
  let missing = 0;
  for (const item of costItems) {
    if (item.cycle === "usage") {
      continue;
    }
    if (item.amount === null) {
      missing += 1;
      continue;
    }
    total += item.cycle === "yearly" ? item.amount / 12 : item.amount;
  }
  return { total, missing };
}

export function CostsCard({ costItems }: CostsCardProps) {
  if (costItems.length === 0) {
    return (
      <SurfaceCard title="Costos y Suscripciones" subtitle="En qué gasta ONIA y cuándo se cobra">
        <p className="text-sm text-muted-foreground">
          Sin costos registrados aún. Cuando se detecten o carguen suscripciones (infra, dominios,
          APIs), aparecen acá con su monto, ciclo y próximo pago.
        </p>
      </SurfaceCard>
    );
  }

  const { total, missing } = monthlyEstimate(costItems);

  return (
    <SurfaceCard
      title="Costos y Suscripciones"
      subtitle="En qué gasta ONIA y cuándo se cobra"
      footer={
        <span>
          Total mensual estimado:{" "}
          <span className="font-semibold tabular-nums text-foreground">{formatMoney(total, "USD")}</span>
          {missing > 0 ? ` · faltan ${missing} ${missing === 1 ? "monto" : "montos"} por confirmar` : ""}
        </span>
      }
    >
      <div className="grid">
        {costItems.map((item) => {
          const display = amountDisplay(item);
          return (
            <div
              key={item.itemKey || item.name}
              className="grid gap-2 border-t border-border py-3 first:border-t-0 first:pt-0.5 last:pb-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge tone={CATEGORY_TONE[item.category]}>{CATEGORY_LABEL[item.category]}</Badge>
                    {item.provider ? (
                      <span className="text-xs text-muted-foreground">{item.provider}</span>
                    ) : null}
                    {item.source === "detected" ? (
                      <span className="inline-flex h-6 items-center rounded-full bg-secondary px-2.5 text-[11px] font-medium text-muted-foreground">
                        detectado · confirmar
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums text-foreground">{display.primary}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{display.secondary}</p>
                </div>
              </div>
              {item.nextDueLabel ? (
                <p className="text-xs text-muted-foreground">
                  Próximo pago: <span className="font-medium text-foreground">{item.nextDueLabel}</span>
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
