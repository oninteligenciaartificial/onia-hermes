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
    <div className="grid gap-4">
      <div className="flex justify-end">
        <NewLeadForm canChooseOwner={canApprove} team={team} />
      </div>
      <LeadsBoard leads={leads} />
      <TasksPanel tasks={tasks} notes={notes} canApprove={canApprove} team={team} />
    </div>
  );
}
