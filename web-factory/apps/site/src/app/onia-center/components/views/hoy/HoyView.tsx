import type { OperatingAgent, SergioScheduleBlock } from "@/app/onia-center/types";
import type { RuntimeReview, RuntimeTask } from "@/lib/onia-center-store";
import type { LiveAgentStatus, ReviewBody } from "@/app/onia-center/live/live-runtime";
import { AgentRosterTile } from "./AgentRosterTile";
import { BookingsTile } from "./BookingsTile";
import type { CalcomBooking } from "@/lib/onia-center-store";
import { DayTimeline } from "./DayTimeline";
import { KpiStrip, type KpiItem } from "./KpiStrip";
import { TeamWorkPanel } from "./TeamWorkPanel";

interface HoyViewProps {
  bookings?: CalcomBooking[];
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

function todayLabel(referenceDate: Date): string {
  const formatted = new Intl.DateTimeFormat("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "short",
    timeZone: "America/La_Paz",
  }).format(referenceDate);
  return `${formatted} · Bolivia`;
}

export function HoyView({
  bookings = [],
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
  return (
    <div className="grid gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Hoy</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {headline ??
              "Tu día de un vistazo: qué necesita tu aprobación, la agenda protegida y en qué está el equipo."}
          </p>
        </div>
        <span className="font-mono text-xs lowercase text-[color:var(--faint)]">{todayLabel(referenceDate)}</span>
      </header>

      {kpis && kpis.length > 0 ? <KpiStrip items={kpis} /> : null}

      <div className="grid items-start gap-[18px] lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-[18px]">
          <BookingsTile bookings={bookings} />
          {showSchedule ? <DayTimeline blocks={scheduleBlocks} referenceDate={referenceDate} /> : null}
        </div>
        <div className="grid content-start gap-[18px]">
          <AgentRosterTile agents={agents} liveInfo={liveInfo} />
          {showTeam ? <TeamWorkPanel tasks={tasks} /> : null}
        </div>
      </div>
    </div>
  );
}
