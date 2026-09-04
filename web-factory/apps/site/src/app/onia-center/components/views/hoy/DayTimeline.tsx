import type { CSSProperties } from "react";
import type { SergioScheduleBlock } from "@/app/onia-center/types";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { buildDayTimeline, type TimelineBlock } from "./schedule-helpers";

type TimelineTone = "work" | "sales" | "meet" | "plain";

// Cada categoría recibe un color semántico de fondo (mockup): foco/entrega = acento,
// ventas = compuerta ámbar, reuniones = info azul, el resto neutral (surface-2).
const TONE_STYLE: Record<TimelineTone, CSSProperties> = {
  work: {
    background: "var(--accent-wash)",
    borderColor: "color-mix(in oklch, var(--primary) 22%, transparent)",
  },
  sales: {
    background: "var(--gate-wash)",
    borderColor: "color-mix(in oklch, var(--gate) 24%, transparent)",
  },
  meet: {
    background: "var(--info-wash)",
    borderColor: "color-mix(in oklch, var(--info) 22%, transparent)",
  },
  plain: {
    background: "var(--surface-2)",
    borderColor: "var(--line-soft)",
  },
};

function categoryTone(category: TimelineBlock["category"]): TimelineTone {
  switch (category) {
    case "planning":
    case "deep_work":
      return "work";
    case "sales":
      return "sales";
    case "meetings":
      return "meet";
    default:
      return "plain";
  }
}

interface DayTimelineProps {
  blocks: SergioScheduleBlock[];
  referenceDate: Date;
}

export function DayTimeline({ blocks, referenceDate }: DayTimelineProps) {
  const timeline = buildDayTimeline(blocks, referenceDate);

  const meta = (
    <span className="font-mono text-xs text-[color:var(--faint)]">bloques protegidos · hora Bolivia</span>
  );

  if (timeline.blocks.length === 0) {
    return (
      <SurfaceCard title="Agenda de hoy" action={meta} className="onia-center-elevated">
        <p className="text-sm text-muted-foreground">Sin bloques definidos para hoy.</p>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard
      title="Agenda de hoy"
      action={meta}
      className="onia-center-elevated"
      contentClassName="px-4 pb-3.5 pt-1.5"
    >
      <div className="grid">
        {timeline.blocks.map((block) => {
          const style = TONE_STYLE[categoryTone(block.category)];
          return (
            <div key={block.id} className="grid grid-cols-[52px_1fr] gap-3">
              <span className="pt-[11px] text-right font-mono text-[11.5px] tabular-nums text-[color:var(--faint)]">
                {block.start}
              </span>
              <div className="border-l-2 border-border py-[9px] pl-[13px]">
                <div
                  className="onia-center-tl-block rounded-[9px] border px-3 py-2.5"
                  style={
                    block.isNow
                      ? {
                          ...style,
                          borderColor: "var(--primary)",
                          boxShadow:
                            "0 0 0 3px color-mix(in oklch, var(--primary) 16%, transparent), 0 8px 20px -14px color-mix(in oklch, var(--primary) 60%, transparent)",
                        }
                      : style
                  }
                >
                  <div className="flex items-center gap-2">
                    <p className="min-w-0 flex-1 text-[13px] font-medium text-foreground">{block.title}</p>
                    {block.isNow ? (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground">
                        ahora
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                    {block.start} – {block.end}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
