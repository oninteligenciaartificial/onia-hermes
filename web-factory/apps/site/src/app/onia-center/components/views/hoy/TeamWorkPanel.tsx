import { collaborators } from "@/app/onia-center/operating-source";
import type { RuntimeTask } from "@/lib/onia-center-store";
import type { CenterTone } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

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
}

export function TeamWorkPanel({ tasks }: TeamWorkPanelProps) {
  return (
    <SurfaceCard title="Equipo — que hace cada uno">
      <div className="grid gap-4">
        {collaborators.map((collaborator) => {
          const open = tasks.filter(
            (task) => task.assignedRole === collaborator.role && OPEN.includes(task.status),
          );
          return (
            <div key={collaborator.id} className="grid gap-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                  {initials(collaborator.displayName)}
                </span>
                <p className="text-sm font-medium">{collaborator.displayName}</p>
                <span className="text-xs text-muted-foreground">{open.length} abiertas</span>
              </div>
              {open.length === 0 ? (
                <p className="pl-[42px] text-xs text-muted-foreground">Sin tareas asignadas ahora.</p>
              ) : (
                <ul className="grid gap-1.5 pl-[42px]">
                  {open.map((task) => (
                    <li key={task.id} className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate text-sm">{task.title}</span>
                      <Badge tone={PRIORITY_TONE[task.priority]}>{task.priority}</Badge>
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
