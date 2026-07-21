import type { SergioScheduleBlock } from "@/app/onia-center/types";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { buildDayTimeline, type TimelineBlock } from "./schedule-helpers";

const HOUR_HEIGHT = 58;

type TimelineTone = "green" | "yellow" | "blue" | "neutral";

const TONE_STYLES: Record<TimelineTone, { bg: string; border: string; dot: string }> = {
  green: {
    bg: "var(--center-tone-green-bg)",
    border: "color-mix(in oklch, var(--center-tone-green) 24%, transparent)",
    dot: "var(--center-tone-green)",
  },
  yellow: {
    bg: "var(--center-tone-yellow-bg)",
    border: "color-mix(in oklch, var(--center-tone-yellow) 28%, transparent)",
    dot: "var(--center-tone-yellow)",
  },
  blue: {
    bg: "var(--center-tone-blue-bg)",
    border: "color-mix(in oklch, var(--center-tone-blue) 24%, transparent)",
    dot: "var(--center-tone-blue)",
  },
  neutral: {
    bg: "var(--muted)",
    border: "var(--border)",
    dot: "var(--muted-foreground)",
  },
};

/** Cada categoría de bloque recibe un color semántico (foco/entrega = verde,
 *  ventas = ámbar, reuniones = azul, el resto neutral) en vez de casi todo gris. */
function categoryTone(category: TimelineBlock["category"]): TimelineTone {
  switch (category) {
    case "planning":
    case "deep_work":
      return "green";
    case "sales":
      return "yellow";
    case "meetings":
      return "blue";
    default:
      return "neutral";
  }
}

interface DayTimelineProps {
  blocks: SergioScheduleBlock[];
  referenceDate: Date;
}

export function DayTimeline({ blocks, referenceDate }: DayTimelineProps) {
  const timeline = buildDayTimeline(blocks, referenceDate);

  if (timeline.blocks.length === 0) {
    return (
      <SurfaceCard
        title="Agenda de hoy"
        subtitle="Bloques protegidos · hora Bolivia"
        className="onia-center-elevated"
      >
        <p className="text-sm text-muted-foreground">Sin bloques definidos para hoy.</p>
      </SurfaceCard>
    );
  }

  const hourSpan = Math.max(1, timeline.hourMarks.length - 1);
  const trackHeight = hourSpan * HOUR_HEIGHT;

  return (
    <SurfaceCard
      title="Agenda de hoy"
      subtitle="Bloques protegidos · hora Bolivia"
      className="onia-center-elevated"
      action={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold tabular-nums text-muted-foreground">
          {timeline.blocks.length} bloques
        </span>
      }
    >
      <div className="relative" style={{ height: `${trackHeight}px` }}>
        {timeline.hourMarks.map((hour, index) => (
          <div
            key={hour}
            className="absolute left-0 right-0 flex items-center gap-2.5"
            style={{ top: `${(index / hourSpan) * 100}%` }}
          >
            <span className="w-11 shrink-0 text-right text-[11px] font-medium tabular-nums text-muted-foreground">
              {String(hour).padStart(2, "0")}:00
            </span>
            <span className="h-px flex-1 bg-border/70" />
          </div>
        ))}

        <div className="absolute inset-y-0 left-[52px] right-0">
          {timeline.blocks.map((block) => {
            const tone = TONE_STYLES[categoryTone(block.category)];
            return (
              <div
                key={block.id}
                className="onia-center-tl-block absolute left-0 right-0 grid content-center gap-1 overflow-hidden rounded-[9px] px-3 py-1.5"
                style={{
                  top: `${block.topPct}%`,
                  height: `${block.heightPct}%`,
                  minHeight: "44px",
                  background: tone.bg,
                  border: block.isNow ? "1.5px solid var(--primary)" : `1px solid ${tone.border}`,
                  boxShadow: block.isNow
                    ? "0 0 0 3px color-mix(in oklch, var(--primary) 16%, transparent), 0 8px 20px -12px color-mix(in oklch, var(--primary) 60%, transparent)"
                    : undefined,
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-[7px] w-[7px] shrink-0 rounded-full"
                    style={{ background: tone.dot }}
                  />
                  <p className="min-w-0 truncate text-[13px] font-semibold text-foreground">{block.title}</p>
                  {block.isNow ? (
                    <span className="ml-auto inline-flex shrink-0 items-center rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground">
                      ahora
                    </span>
                  ) : null}
                </div>
                <p className="pl-[15px] text-[11px] tabular-nums text-muted-foreground">
                  {block.start} - {block.end}
                </p>
              </div>
            );
          })}

          {timeline.nowPct !== null ? (
            <div
              className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
              style={{ top: `${timeline.nowPct}%` }}
            >
              <span
                className="h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary"
                style={{ boxShadow: "0 0 0 3px color-mix(in oklch, var(--primary) 20%, transparent)" }}
              />
              <span
                className="h-0.5 flex-1"
                style={{ background: "color-mix(in oklch, var(--primary) 55%, transparent)" }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </SurfaceCard>
  );
}
