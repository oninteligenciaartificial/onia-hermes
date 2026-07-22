import type { CenterTone } from "@/app/onia-center/types";

// Un numero real leido en vivo. La page (server) arma la lista segun el rol:
// caja y aprobaciones solo para quien corresponde. El componente es presentacional.
export interface KpiItem {
  key: string;
  label: string;
  value: string;
  hint?: string;
  tone?: CenterTone;
}

const TONE_DOT: Record<CenterTone, string> = {
  green: "var(--center-tone-green)",
  yellow: "var(--center-tone-yellow)",
  red: "var(--center-tone-red)",
  blue: "var(--center-tone-blue)",
  neutral: "var(--muted-foreground)",
};

interface KpiStripProps {
  items: KpiItem[];
}

export function KpiStrip({ items }: KpiStripProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-label="Metricas del dia" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.key}
          className="onia-center-elevated grid content-start gap-2 rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: TONE_DOT[item.tone ?? "neutral"] }}
              aria-hidden="true"
            />
            <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {item.label}
            </p>
          </div>
          <p className="text-[26px] font-semibold leading-none tabular-nums text-foreground">{item.value}</p>
          {item.hint ? <p className="text-xs leading-snug text-muted-foreground">{item.hint}</p> : null}
        </div>
      ))}
    </section>
  );
}
