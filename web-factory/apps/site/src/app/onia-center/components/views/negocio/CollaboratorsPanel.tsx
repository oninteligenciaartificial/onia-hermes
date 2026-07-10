import { collaborators } from "@/app/onia-center/operating-source";
import type { CenterTone, CollaboratorRecord } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

const STATUS_TONE: Record<CollaboratorRecord["status"], CenterTone> = {
  trial: "yellow",
  active: "green",
  paused: "neutral",
  blocked: "red",
};

export function CollaboratorsPanel() {
  return (
    <SurfaceCard title={`Colaboradores (${collaborators.length})`}>
      {collaborators.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin colaboradores registrados.</p>
      ) : (
        <div className="grid gap-2.5">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{collaborator.displayName}</p>
                {collaborator.allowedWork.length > 0 ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{collaborator.allowedWork.join(", ")}</p>
                ) : null}
              </div>
              <Badge tone={STATUS_TONE[collaborator.status]}>{collaborator.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </SurfaceCard>
  );
}
