import { collaborators } from "@/app/onia-center/operating-source";
import type { RuntimeTask } from "@/lib/onia-center-store";
import { SurfaceCard } from "../../ui/SurfaceCard";

const OPEN: RuntimeTask["status"][] = ["todo", "doing", "review", "blocked"];
const PRIORITY_ORDER: Record<RuntimeTask["priority"], number> = { alta: 0, media: 1, baja: 2 };

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

/**
 * "Equipo hoy" del mockup: una fila por colaborador con su foco actual (la tarea
 * abierta de mayor prioridad) y el conteo de abiertas. Es un vistazo; la gestión
 * interactiva de tareas (cambiar estado, evidencia) vive en Pipeline.
 */
export function TeamWorkPanel({ tasks }: TeamWorkPanelProps) {
  return (
    <SurfaceCard
      title="Equipo hoy"
      className="onia-center-elevated"
      contentClassName="p-1.5"
      action={<span className="font-mono text-xs text-[color:var(--faint)]">tareas abiertas</span>}
    >
      <div className="grid">
        {collaborators.map((collaborator) => {
          const open = tasks
            .filter((task) => task.assignedRole === collaborator.role && OPEN.includes(task.status))
            .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
          const focus = open[0]?.title ?? "Sin tareas asignadas";

          return (
            <div
              key={collaborator.id}
              className="flex items-center gap-2.5 rounded-[9px] p-2.5 transition-colors hover:bg-secondary"
            >
              <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full border border-border bg-secondary text-xs font-semibold text-muted-foreground">
                {initials(collaborator.displayName)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-foreground">{collaborator.displayName}</p>
                <p
                  className={`truncate text-xs ${open.length > 0 ? "text-muted-foreground" : "text-[color:var(--faint)]"}`}
                >
                  {focus}
                </p>
              </div>
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-[color:var(--faint)]">
                {open.length > 0 ? open.length : "·"}
              </span>
            </div>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
