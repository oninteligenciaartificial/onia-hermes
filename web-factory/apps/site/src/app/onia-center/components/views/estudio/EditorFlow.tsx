import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import type { EditorStage } from "./source";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface EditorFlowProps {
  stages: EditorStage[];
}

// Chip índice por estado: hecho = wash esmeralda, activo = ámbar sólido (compuerta),
// pendiente = superficie neutra. El gate humano vive SOLO en el paso activo (Cut-list).
const IDX_STYLE: Record<EditorStage["state"], CSSProperties> = {
  done: {
    background: "var(--accent-wash)",
    borderColor: "color-mix(in oklch, var(--primary) 30%, var(--border))",
    color: "var(--accent-strong)",
  },
  active: { background: "var(--gate)", borderColor: "var(--gate)", color: "oklch(0.99 0 0)" },
  todo: { background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--muted-foreground)" },
};

export function EditorFlow({ stages }: EditorFlowProps) {
  return (
    <SurfaceCard
      title="Flujo del editor"
      action={
        <span className="text-[11.5px] text-[color:var(--faint)]">
          Núcleo <b className="font-semibold text-[color:var(--center-tone-green)]">100% gratis</b> · el gate humano vive en Cut-list
        </span>
      }
      contentClassName="p-0"
    >
      <ol className="flex items-stretch gap-0 overflow-x-auto px-2 py-4">
        {stages.map((stage, i) => {
          const active = stage.state === "active";
          return (
            <li key={stage.index} className="flex min-w-[150px] flex-1 items-center">
              <div
                className="flex flex-1 flex-col gap-1.5 rounded-[11px] px-3 py-1.5 transition-colors"
                style={
                  active
                    ? {
                        background: "linear-gradient(180deg, var(--gate-wash), transparent)",
                        boxShadow: "inset 0 0 0 1px var(--gate-line)",
                      }
                    : undefined
                }
              >
                <div className="flex items-center gap-2">
                  <span
                    className="grid h-[22px] w-[22px] place-items-center rounded-[7px] border text-[11px] font-bold tabular-nums"
                    style={IDX_STYLE[stage.state]}
                    aria-hidden="true"
                  >
                    {stage.index}
                  </span>
                  <span className="text-[12.5px] font-semibold tracking-[-0.005em] text-foreground">{stage.name}</span>
                  {stage.gate ? (
                    <span className="rounded-[5px] border border-[color:var(--gate-line)] bg-[color:var(--gate-wash)] px-1.5 py-px text-[9.5px] font-bold uppercase tracking-[0.05em] text-[color:var(--gate-strong)]">
                      tu OK
                    </span>
                  ) : null}
                </div>
                <span className="font-mono text-[10.5px] text-[color:var(--faint)]">{stage.tool}</span>
                <span
                  className="text-[11.5px] font-semibold"
                  style={active ? { color: "var(--gate-strong)" } : { color: "var(--muted-foreground)" }}
                >
                  {stage.count}
                </span>
              </div>
              {i < stages.length - 1 ? (
                <ArrowRight className="mx-0.5 shrink-0 text-[color:var(--border)]" size={18} aria-hidden="true" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </SurfaceCard>
  );
}
