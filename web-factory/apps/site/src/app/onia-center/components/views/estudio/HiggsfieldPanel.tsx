import {
  ImageIcon,
  Maximize2,
  Ratio,
  Scissors,
  TrendingUp,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { HiggsfieldAccount, HiggsfieldFunction, HiggsfieldFunctionIcon } from "./source";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface HiggsfieldPanelProps {
  account: HiggsfieldAccount;
}

const FN_ICON: Record<HiggsfieldFunctionIcon, LucideIcon> = {
  image: ImageIcon,
  video: Video,
  trend: TrendingUp,
  shorts: Scissors,
  reframe: Ratio,
  upscale: Maximize2,
};

function FunctionButton({ fn }: { fn: HiggsfieldFunction }) {
  const Icon = FN_ICON[fn.icon];
  const paga = fn.cost === "paga";
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 border-t border-[color:var(--line-soft)] px-[18px] py-3 text-left transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[color:var(--ring)] sm:even:border-l sm:even:border-l-[color:var(--line-soft)]"
    >
      <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-lg border border-border bg-[color:var(--surface-2)] text-muted-foreground">
        <Icon size={15} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-[12.5px] font-semibold text-foreground">
          {fn.name}
          {paga ? (
            <span className="rounded-[4px] border border-[color:var(--gate-line)] bg-[color:var(--gate-wash)] px-1.5 py-px text-[9px] font-bold uppercase tracking-[0.04em] text-[color:var(--gate-strong)]">
              paga
            </span>
          ) : (
            <span className="rounded-[4px] px-1.5 py-px text-[9px] font-bold uppercase tracking-[0.04em] onia-center-tone-green">
              gratis
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-[10.5px] text-[color:var(--faint)]">{fn.desc}</span>
      </span>
    </button>
  );
}

export function HiggsfieldPanel({ account }: HiggsfieldPanelProps) {
  return (
    <SurfaceCard
      title="Higgsfield"
      subtitle="Motor generativo · genera imagen/video y consume créditos"
      action={
        <span
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums"
          style={{
            color: "var(--accent-strong)",
            background: "var(--accent-wash)",
            border: "1px solid color-mix(in oklch, var(--primary) 28%, var(--border))",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          {account.creditsLabel} cr · {account.plan}
        </span>
      }
      contentClassName="p-0"
    >
      {/* Sólo saldo y plan: es lo único que el sync trae de verdad (provider_credits).
          Consumo del mes, renovación e historial de generaciones no están en la DB —
          no se dibujan barras ni listas inventadas; se dice que faltan. */}
      <div className="p-[18px]">
        <p className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.04em] text-[color:var(--faint)]">Balance</p>
        <p className="flex items-baseline gap-2">
          <span className="text-[30px] font-bold tracking-[-0.02em] tabular-nums" style={{ color: "var(--accent-strong)" }}>
            {account.creditsLabel}
          </span>
          <span className="text-xs font-semibold text-[color:var(--faint)]">créditos · plan {account.plan}</span>
        </p>
        <p className="mt-2 text-[11px] text-[color:var(--faint)]">
          Consumo del mes, fecha de renovación e historial de generaciones: sin datos todavía — el sync sólo trae saldo y
          plan.
        </p>
      </div>

      <div
        className="flex items-center justify-between border-t border-[color:var(--line-soft)] px-[18px] py-3"
        style={{ background: "color-mix(in oklch, var(--surface-2) 40%, var(--card))" }}
      >
        <span className="text-xs font-semibold text-foreground">Funciones del motor</span>
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-[color:var(--gate-strong)]">
          <span className="h-2 w-2 rounded-sm bg-[color:var(--gate)]" aria-hidden="true" />
          Generación paga pide tu OK · Upscale/remove-bg no cobran al aplicar
        </span>
      </div>
      <div className="grid sm:grid-cols-2">
        {account.functions.map((fn) => (
          <FunctionButton key={fn.id} fn={fn} />
        ))}
      </div>
    </SurfaceCard>
  );
}
