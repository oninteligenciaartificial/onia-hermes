import type { RuntimeLead, RuntimeTask } from "@/lib/onia-center-store";
import { LeadsPanel } from "./LeadsPanel";
import { TasksPanel } from "./TasksPanel";

interface PipelineViewProps {
  leads: RuntimeLead[];
  tasks: RuntimeTask[];
}

export function PipelineView({ leads, tasks }: PipelineViewProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
      <LeadsPanel leads={leads} />
      <TasksPanel tasks={tasks} />
    </div>
  );
}
