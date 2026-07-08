import type { OperatingAgent, SergioScheduleBlock } from "@/app/onia-center/types";
import type { RuntimeReview } from "@/lib/onia-center-store";
import { AgentRosterTile } from "./AgentRosterTile";
import { ReviewQueueTile } from "./ReviewQueueTile";
import { TodayScheduleCard } from "./TodayScheduleCard";

interface HoyViewProps {
  agents: OperatingAgent[];
  reviews: RuntimeReview[];
  scheduleBlocks: SergioScheduleBlock[];
  referenceDate: Date;
}

export function HoyView({ agents, reviews, scheduleBlocks, referenceDate }: HoyViewProps) {
  return (
    <div className="grid gap-4">
      <TodayScheduleCard blocks={scheduleBlocks} referenceDate={referenceDate} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        <AgentRosterTile agents={agents} />
        <ReviewQueueTile reviews={reviews} />
      </div>
    </div>
  );
}
