import { collaborators } from "@/app/onia-center/operating-source";
import type { CenterTone, CollaboratorRecord, RoleId } from "@/app/onia-center/types";
import type { RuntimeLead, RuntimeNote, RuntimeTask } from "@/lib/onia-center-store";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

const STATUS_TONE: Record<CollaboratorRecord["status"], CenterTone> = {
  trial: "yellow",
  active: "green",
  paused: "neutral",
  blocked: "red",
};

// "Abiertas" = trabajo vivo que no esta en revision ni cerrado.
const OPEN_TASK_STATUS: RuntimeTask["status"][] = ["todo", "doing", "blocked"];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

// Mismo criterio que ownerMatches() del store (sin el bypass de Sergio): si el
// registro trae userKey, casa con la persona exacta; si no, cae al rol. Asi dos
// personas del mismo rol solo se separan cuando el dato ya viene por userKey.
function belongsTo(
  recordRole: RoleId | undefined,
  recordUserKey: string | undefined,
  person: { role: RoleId; userKey?: string },
): boolean {
  if (recordUserKey) {
    return recordUserKey === person.userKey;
  }
  return recordRole === person.role;
}

interface CollaboratorsPanelProps {
  tasks?: RuntimeTask[];
  leads?: RuntimeLead[];
  notes?: RuntimeNote[];
}

export function CollaboratorsPanel({ tasks, leads, notes }: CollaboratorsPanelProps) {
  const hasSnapshot = Boolean(tasks || leads || notes);
  const taskList = tasks ?? [];
  const leadList = leads ?? [];
  const noteList = notes ?? [];

  return (
    <SurfaceCard title={`Colaboradores (${collaborators.length})`}>
      {collaborators.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin colaboradores registrados.</p>
      ) : (
        <div className="grid gap-4">
          {collaborators.map((collaborator) => {
            const person = { role: collaborator.role, userKey: collaborator.userKey };
            const personTasks = taskList.filter((task) =>
              belongsTo(task.assignedRole, task.assignedUserKey, person),
            );
            const openTasks = personTasks.filter((task) => OPEN_TASK_STATUS.includes(task.status)).length;
            const reviewTasks = personTasks.filter((task) => task.status === "review").length;
            const doneTasks = personTasks.filter((task) => task.status === "done").length;
            const assignedLeads = leadList.filter((lead) =>
              belongsTo(lead.owner, lead.ownerUserKey, person),
            ).length;
            const evidenceNotes = noteList.filter(
              (note) => note.kind === "evidencia" && belongsTo(note.actorRole, note.actorUserKey, person),
            ).length;

            return (
              <div
                key={collaborator.id}
                className="grid gap-2.5 border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                      {initials(collaborator.displayName)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{collaborator.displayName}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {collaborator.title ?? collaborator.allowedWork.join(", ")}
                      </p>
                    </div>
                  </div>
                  <Badge tone={STATUS_TONE[collaborator.status]}>{collaborator.status}</Badge>
                </div>

                {hasSnapshot ? (
                  <dl className="grid grid-cols-3 gap-1.5 pl-[42px]">
                    <Stat label="Abiertas" value={openTasks} />
                    <Stat label="En revision" value={reviewTasks} />
                    <Stat label="Cerradas" value={doneTasks} />
                    <Stat label="Leads" value={assignedLeads} />
                    <Stat label="Evidencias" value={evidenceNotes} />
                  </dl>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </SurfaceCard>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-background/40 px-2.5 py-1.5">
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}
