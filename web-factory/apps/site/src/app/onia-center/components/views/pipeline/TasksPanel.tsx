import type { RuntimeNote, RuntimeTask, TeamMember } from "@/lib/onia-center-store";
import type { CenterTone } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { NewTaskForm } from "./NewTaskForm";
import { TaskControls } from "./TaskControls";

const STATUS_TONE: Record<RuntimeTask["status"], CenterTone> = {
  todo: "neutral",
  doing: "blue",
  review: "yellow",
  done: "green",
  blocked: "red",
};

const STATUS_LABEL: Record<RuntimeTask["status"], string> = {
  todo: "Por hacer",
  doing: "En curso",
  review: "Revision",
  done: "Hecha",
  blocked: "Bloqueada",
};

const PRIORITY_TONE: Record<RuntimeTask["priority"], CenterTone> = {
  alta: "red",
  media: "yellow",
  baja: "neutral",
};

const OPEN: RuntimeTask["status"][] = ["todo", "doing", "review", "blocked"];
const PRIORITY_ORDER: Record<RuntimeTask["priority"], number> = { alta: 0, media: 1, baja: 2 };

interface TasksPanelProps {
  tasks: RuntimeTask[];
  notes: RuntimeNote[];
  canApprove: boolean;
  team: TeamMember[];
}

export function TasksPanel({ tasks, notes, canApprove, team }: TasksPanelProps) {
  const open = tasks
    .filter((task) => OPEN.includes(task.status))
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  return (
    <SurfaceCard title={`Tareas (${open.length} abiertas · ${tasks.length} total)`}>
      <NewTaskForm canChooseAssignee={canApprove} team={team} />
      {open.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin tareas abiertas.</p>
      ) : (
        <div className="grid gap-3">
          {open.map((task) => {
            const evidenceNotes = notes.filter(
              (note) => note.kind === "evidencia" && note.linkedTo === task.id,
            );
            return (
              <div
                key={task.id}
                className="grid gap-1 border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{task.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge tone={PRIORITY_TONE[task.priority]}>{task.priority}</Badge>
                    <Badge tone={STATUS_TONE[task.status]}>{STATUS_LABEL[task.status]}</Badge>
                  </div>
                </div>
                <TaskControls
                  taskId={task.id}
                  status={task.status}
                  evidence={task.evidence}
                  evidenceNotes={evidenceNotes}
                  canApprove={canApprove}
                />
              </div>
            );
          })}
        </div>
      )}
    </SurfaceCard>
  );
}
