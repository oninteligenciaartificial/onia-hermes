import { operatingProjects } from "@/app/onia-center/operating-source";
import type { CenterTone, ProjectStatus } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

const STATUS_TONE: Record<ProjectStatus, CenterTone> = {
  planning: "blue",
  active: "green",
  review: "yellow",
  blocked: "red",
  paused: "neutral",
  archived: "neutral",
};

export function ProjectsPanel() {
  return (
    <SurfaceCard title={`Proyectos (${operatingProjects.length})`}>
      <div className="grid gap-3">
        {operatingProjects.map((project) => (
          <div key={project.id} className="grid gap-1 border-b border-border pb-3 last:border-0 last:pb-0">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{project.name}</p>
              <Badge tone={STATUS_TONE[project.status]}>{project.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{project.description}</p>
            {project.nextStep ? (
              <p className="text-xs text-muted-foreground">Proximo: {project.nextStep}</p>
            ) : null}
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
