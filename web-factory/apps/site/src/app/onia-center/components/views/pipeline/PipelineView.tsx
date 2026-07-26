import type { RuntimeLead, RuntimeNote, RuntimeTask, TeamMember } from "@/lib/onia-center-store";
import { LeadsBoard } from "./LeadsBoard";
import { NewLeadForm } from "./NewLeadForm";
import { TasksPanel } from "./TasksPanel";

interface PipelineViewProps {
  leads: RuntimeLead[];
  tasks: RuntimeTask[];
  notes: RuntimeNote[];
  canApprove: boolean;
  team: TeamMember[];
}

export function PipelineView({ leads, tasks, notes, canApprove, team }: PipelineViewProps) {
  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Pipeline</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Tus leads por etapa y las tareas del equipo. El cierre sensible lo aprueba Sergio.
          </p>
        </div>
        <NewLeadForm canChooseOwner={canApprove} team={team} />
      </header>
      <LeadsBoard leads={leads} />
      <TasksPanel tasks={tasks} notes={notes} canApprove={canApprove} team={team} />
    </div>
  );
}
