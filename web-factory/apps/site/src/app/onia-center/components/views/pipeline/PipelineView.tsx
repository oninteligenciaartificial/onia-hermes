import type { RuntimeLead, RuntimeTask } from "@/lib/onia-center-store";
import { LeadsBoard } from "./LeadsBoard";
import { TasksPanel } from "./TasksPanel";

interface PipelineViewProps {
  leads: RuntimeLead[];
  tasks: RuntimeTask[];
}

export function PipelineView({ leads, tasks }: PipelineViewProps) {
  return (
    <div className="grid gap-4">
      <LeadsBoard leads={leads} />
      <TasksPanel tasks={tasks} />
    </div>
  );
}
