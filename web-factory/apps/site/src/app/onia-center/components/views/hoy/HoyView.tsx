import type { OperatingAgent, SergioScheduleBlock } from "@/app/onia-center/types";
import type { RuntimeReview, RuntimeTask } from "@/lib/onia-center-store";
import type { ReviewBody } from "@/app/onia-center/live/live-runtime";
import { AgentRosterTile } from "./AgentRosterTile";
import { DayTimeline } from "./DayTimeline";
import { ReviewQueueTile } from "./ReviewQueueTile";
import { TeamWorkPanel } from "./TeamWorkPanel";

interface HoyViewProps {
  agents: OperatingAgent[];
  reviews: RuntimeReview[];
  reviewBodies?: Record<string, ReviewBody>;
  canApprove?: boolean;
  tasks: RuntimeTask[];
  scheduleBlocks: SergioScheduleBlock[];
  referenceDate: Date;
}

export function HoyView({
  agents,
  reviews,
  reviewBodies,
  canApprove,
  tasks,
  scheduleBlocks,
  referenceDate,
}: HoyViewProps) {
  return (
    <div className="grid gap-6">
      <header className="grid gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Hoy</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Tu día de un vistazo: la agenda protegida, qué necesita tu aprobación y en qué está el equipo.
        </p>
      </header>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-5">
          <DayTimeline blocks={scheduleBlocks} referenceDate={referenceDate} />
          <TeamWorkPanel tasks={tasks} canApprove={canApprove} />
        </div>
        <div className="grid content-start gap-5">
          <ReviewQueueTile reviews={reviews} bodies={reviewBodies} canApprove={canApprove} />
          <AgentRosterTile agents={agents} />
        </div>
      </div>
    </div>
  );
}
