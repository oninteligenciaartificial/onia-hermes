import type { SergioScheduleBlock } from "@/app/onia-center/types";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { buildDayTimeline, type TimelineBlock } from "./schedule-helpers";

const HOUR_HEIGHT = 52;

function blockBackground(category: TimelineBlock["category"]): string {
  if (category === "deep_work") {
    return "var(--center-tone-blue-bg)";
  }
  if (category === "planning") {
    return "var(--center-tone-green-bg)";
  }
  return "var(--muted)";
}

interface DayTimelineProps {
  blocks: SergioScheduleBlock[];
  referenceDate: Date;
}

export function DayTimeline({ blocks, referenceDate }: DayTimelineProps) {
  const timeline = buildDayTimeline(blocks, referenceDate);

  if (timeline.blocks.length === 0) {
    return (
      <SurfaceCard title="Agenda de hoy">
        <p className="text-sm text-muted-foreground">Sin bloques definidos para hoy.</p>
      </SurfaceCard>
    );
  }

  const hourSpan = Math.max(1, timeline.hourMarks.length - 1);
  const trackHeight = hourSpan * HOUR_HEIGHT;

  return (
    <SurfaceCard title="Agenda de hoy">
      <div className="relative" style={{ height: `${trackHeight}px` }}>
        {timeline.hourMarks.map((hour, index) => (
          <div
            key={hour}
            className="absolute left-0 right-0 flex items-center gap-2"
            style={{ top: `${(index / hourSpan) * 100}%` }}
          >
            <span className="w-11 shrink-0 text-[11px] tabular-nums text-muted-foreground">
              {String(hour).padStart(2, "0")}:00
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
        ))}

        <div className="absolute inset-y-0 left-[52px] right-0">
          {timeline.blocks.map((block) => (
            <div
              key={block.id}
              className="absolute left-0 right-0 overflow-hidden rounded-lg px-3 py-1.5 transition-colors"
              style={{
                top: `${block.topPct}%`,
                height: `${block.heightPct}%`,
                minHeight: "42px",
                background: blockBackground(block.category),
                border: block.isNow ? "2px solid var(--primary)" : "1px solid var(--border)",
              }}
            >
              <p className="truncate text-xs font-medium text-foreground">{block.title}</p>
              <p className="text-[11px] tabular-nums text-muted-foreground">
                {block.start} - {block.end}
                {block.isNow ? " · ahora" : ""}
              </p>
            </div>
          ))}

          {timeline.nowPct !== null ? (
            <div
              className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
              style={{ top: `${timeline.nowPct}%` }}
            >
              <span className="h-2 w-2 -translate-x-1/2 rounded-full bg-primary" />
              <span className="h-px flex-1" style={{ background: "color-mix(in oklch, var(--primary) 55%, transparent)" }} />
            </div>
          ) : null}
        </div>
      </div>
    </SurfaceCard>
  );
}
