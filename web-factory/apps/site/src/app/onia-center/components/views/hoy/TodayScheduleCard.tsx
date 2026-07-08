import type { SergioScheduleBlock } from "@/app/onia-center/types";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { getTodaysScheduleBlocks, isBlockHappeningNow } from "./schedule-helpers";

interface TodayScheduleCardProps {
  blocks: SergioScheduleBlock[];
  referenceDate: Date;
}

export function TodayScheduleCard({ blocks, referenceDate }: TodayScheduleCardProps) {
  const todaysBlocks = getTodaysScheduleBlocks(blocks, referenceDate);

  return (
    <SurfaceCard title="Agenda de hoy">
      {todaysBlocks.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin bloques definidos para hoy.</p>
      ) : (
        <div className="grid gap-2.5">
          {todaysBlocks.map((block) => {
            const isNow = isBlockHappeningNow(block, referenceDate);
            return (
              <div
                key={block.id}
                className={`flex items-baseline gap-3 rounded-md ${isNow ? "bg-secondary px-2.5 py-2" : ""}`}
              >
                <span className="min-w-[88px] text-xs font-semibold text-muted-foreground">
                  {block.start} - {block.end}
                </span>
                <span className={`text-sm ${isNow ? "font-semibold" : ""}`}>{block.title}</span>
              </div>
            );
          })}
        </div>
      )}
    </SurfaceCard>
  );
}
