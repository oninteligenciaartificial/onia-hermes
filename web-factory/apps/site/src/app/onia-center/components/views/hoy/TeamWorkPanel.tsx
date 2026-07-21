import { collaborators } from "@/app/onia-center/operating-source";
import type { RuntimeTask } from "@/lib/onia-center-store";
import type { CenterTone } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { TaskStatusSelect } from "../../ui/TaskStatusSelect";

const OPEN: RuntimeTask["status"][] = ["todo", "doing", "review", "blocked"];
const PRIORITY_TONE: Record<RuntimeTask["priority"], CenterTone> = {
  alta: "red",
  media: "yellow",
  baja: "neutral",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

interface TeamWorkPanelProps {
  tasks: RuntimeTask[];
  /** Sergio puede cerrar tareas (done); el resto solo hasta revision. */
  canApprove?: boolean;
}

export function TeamWorkPanel({ tasks, canApprove = false }: TeamWorkPanelProps) {
  return (
    <SurfaceCard
      title="Equipo — qué hace cada uno"
      subtitle="Tareas abiertas por colaborador"
      className="onia-center-elevated"
    >
      <div className="grid">
        {collaborators.map((collaborator) => {
          const open = tasks.filter(
            (task) => task.assignedRole === collaborator.role && OPEN.includes(task.status),
          );
          return (
            <div
              key={collaborator.id}
              className="border-t border-border py-4 first:border-t-0 first:pt-0.5 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                  {initials(collaborator.displayName)}
                </span>
                <p className="text-sm font-medium text-foreground">{collaborator.displayName}</p>
                <span className="ml-auto inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {open.length} {open.length === 1 ? "abierta" : "abiertas"}
                </span>
              </div>
              {open.length === 0 ? (
                <p className="mt-2 pl-12 text-xs text-muted-foreground">Sin tareas asignadas ahora.</p>
              ) : (
                <ul className="mt-2.5 grid gap-0.5">
                  {open.map((task) => (
                    <li
                      key={task.id}
                      className="-mx-2 flex items-center justify-between gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
                    >
                      <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">{task.title}</span>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge tone={PRIORITY_TONE[task.priority]}>{task.priority}</Badge>
                        <TaskStatusSelect taskId={task.id} status={task.status} canApprove={canApprove} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
