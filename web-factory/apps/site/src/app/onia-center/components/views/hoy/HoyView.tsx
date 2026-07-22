import type { OperatingAgent, SergioScheduleBlock } from "@/app/onia-center/types";
import type { RuntimeReview, RuntimeTask } from "@/lib/onia-center-store";
import type { LiveAgentStatus, ReviewBody } from "@/app/onia-center/live/live-runtime";
import { AgentRosterTile } from "./AgentRosterTile";
import { DayTimeline } from "./DayTimeline";
import { KpiStrip, type KpiItem } from "./KpiStrip";
import { ReviewQueueTile } from "./ReviewQueueTile";
import { TeamWorkPanel } from "./TeamWorkPanel";

interface HoyViewProps {
  agents: OperatingAgent[];
  liveInfo?: Record<string, LiveAgentStatus>;
  kpis?: KpiItem[];
  reviews: RuntimeReview[];
  reviewBodies?: Record<string, ReviewBody>;
  canApprove?: boolean;
  /** Panel "qué hace cada uno": operación del equipo, oculto a seller/freelancer. */
  showTeam?: boolean;
  /** Agenda protegida de Sergio (scope sergio_private): solo la ve Sergio. */
  showSchedule?: boolean;
  headline?: string;
  tasks: RuntimeTask[];
  scheduleBlocks: SergioScheduleBlock[];
  referenceDate: Date;
}

export function HoyView({
  agents,
  liveInfo,
  kpis,
  reviews,
  reviewBodies,
  canApprove,
  showTeam = true,
  showSchedule = true,
  headline,
  tasks,
  scheduleBlocks,
  referenceDate,
}: HoyViewProps) {
  const showLeft = showSchedule || showTeam;
  const rightStack = (
    <>
      <ReviewQueueTile reviews={reviews} bodies={reviewBodies} canApprove={canApprove} />
      <AgentRosterTile agents={agents} liveInfo={liveInfo} />
    </>
  );

  return (
    <div className="grid gap-8">
      <header className="grid gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Hoy</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {headline ??
            "Tu día de un vistazo: la agenda protegida, qué necesita tu aprobación y en qué está el equipo."}
        </p>
      </header>
      {kpis && kpis.length > 0 ? <KpiStrip items={kpis} /> : null}
      {showLeft ? (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="grid content-start gap-6">
            {showSchedule ? <DayTimeline blocks={scheduleBlocks} referenceDate={referenceDate} /> : null}
            {showTeam ? <TeamWorkPanel tasks={tasks} canApprove={canApprove} /> : null}
          </div>
          <div className="grid content-start gap-6">{rightStack}</div>
        </div>
      ) : (
        <div className="grid items-start gap-6 sm:grid-cols-2">{rightStack}</div>
      )}
    </div>
  );
}
