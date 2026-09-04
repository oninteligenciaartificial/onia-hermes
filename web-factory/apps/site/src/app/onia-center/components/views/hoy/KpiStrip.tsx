import type { CSSProperties } from "react";
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

// Punto de color por tono (mockup): verde = acento vivo, amarillo = compuerta,
// azul = info, rojo = alerta, neutral = faint.
const TONE_DOT: Record<CenterTone, string> = {
  green: "var(--center-tone-green)",
  yellow: "var(--gate)",
  red: "var(--center-tone-red)",
  blue: "var(--center-tone-blue)",
  neutral: "var(--faint)",
};

interface KpiStripProps {
  items: KpiItem[];
}

export function KpiStrip({ items }: KpiStripProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Metricas del dia"
      className="onia-kpi-strip"
      style={{ "--kpi-cols": items.length } as CSSProperties}
    >
      {items.map((item) => {
        // "attn" = ámbar de compuerta: SOLO la celda que necesita tu OK (tono amarillo).
        const attn = item.tone === "yellow";
        return (
          <div
            key={item.key}
            className="flex min-h-[78px] flex-col gap-0.5 bg-card px-[15px] py-[13px]"
            style={
              attn ? { background: "linear-gradient(180deg, var(--gate-wash), var(--card) 62%)" } : undefined
            }
          >
            <div className="flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: TONE_DOT[item.tone ?? "neutral"] }}
                aria-hidden="true"
              />
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.04em] text-[color:var(--faint)]">
                {item.label}
              </p>
            </div>
            <p
              className="mt-auto text-[23px] font-semibold leading-none tracking-[-0.02em] tabular-nums"
              style={attn ? { color: "var(--gate)" } : undefined}
            >
              {item.value}
            </p>
            {item.hint ? <p className="text-[11.5px] leading-snug text-muted-foreground">{item.hint}</p> : null}
          </div>
        );
      })}
    </section>
  );
}
