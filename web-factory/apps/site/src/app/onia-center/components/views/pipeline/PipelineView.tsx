import type { RuntimeLead, RuntimeNote, RuntimeTask } from "@/lib/onia-center-store";
import { LeadsBoard } from "./LeadsBoard";
import { NewLeadForm } from "./NewLeadForm";
import { TasksPanel } from "./TasksPanel";

interface PipelineViewProps {
  leads: RuntimeLead[];
  tasks: RuntimeTask[];
  notes: RuntimeNote[];
  canApprove: boolean;
}

export function PipelineView({ leads, tasks, notes, canApprove }: PipelineViewProps) {
  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <NewLeadForm canChooseOwner={canApprove} />
      </div>
      <LeadsBoard leads={leads} />
      <TasksPanel tasks={tasks} notes={notes} canApprove={canApprove} />
    </div>
  );
}
