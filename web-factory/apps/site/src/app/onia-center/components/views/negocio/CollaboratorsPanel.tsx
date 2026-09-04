import { collaborators } from "@/app/onia-center/operating-source";
import type { CenterTone, RoleId } from "@/app/onia-center/types";
import type { RuntimeLead, RuntimeNote, RuntimeTask, TeamMember } from "@/lib/onia-center-store";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

// Cubre tanto los estados de user_profiles (active/invited/blocked) como los del
// roster estatico (trial/active/paused/blocked).
const STATUS_TONE: Record<string, CenterTone> = {
  trial: "yellow",
  invited: "blue",
  active: "green",
  paused: "neutral",
  blocked: "red",
  revoked: "red",
};

const ROLE_LABEL: Record<RoleId, string> = {
  sergio: "Dueno / operacion",
  arthur: "Colaborador",
  seller: "Comercial",
  area: "Responsable de area",
  freelancer: "Freelancer",
};

// "Abiertas" = trabajo vivo que no esta en revision ni cerrado.
const OPEN_TASK_STATUS: RuntimeTask["status"][] = ["todo", "doing", "blocked"];

// Persona ya normalizada para pintar la tarjeta, venga del equipo real o del
// roster estatico de respaldo.
type PanelPerson = {
  id: string;
  userKey?: string;
  displayName: string;
  subtitle: string;
  role: RoleId;
  statusLabel: string;
  tone: CenterTone;
};

function statusTone(status: string): CenterTone {
  return STATUS_TONE[status] ?? "neutral";
}

function roleLabel(role: RoleId): string {
  return ROLE_LABEL[role] ?? role;
}

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

function fromTeam(member: TeamMember): PanelPerson {
  return {
    id: `team-${member.userKey}`,
    userKey: member.userKey,
    displayName: member.displayName,
    subtitle: member.accessNote || roleLabel(member.role),
    role: member.role,
    statusLabel: member.status,
    tone: statusTone(member.status),
  };
}

function fromStaticRoster(): PanelPerson[] {
  return collaborators.map((collaborator) => ({
    id: collaborator.id,
    userKey: collaborator.userKey,
    displayName: collaborator.displayName,
    subtitle: collaborator.title ?? collaborator.allowedWork.join(", "),
    role: collaborator.role,
    statusLabel: collaborator.status,
    tone: statusTone(collaborator.status),
  }));
}

interface CollaboratorsPanelProps {
  tasks?: RuntimeTask[];
  leads?: RuntimeLead[];
  notes?: RuntimeNote[];
  /** Personas reales del equipo (onia_center). Si falta, cae al roster estatico. */
  team?: TeamMember[];
}

export function CollaboratorsPanel({ tasks, leads, notes, team }: CollaboratorsPanelProps) {
  const hasSnapshot = Boolean(tasks || leads || notes);
  const taskList = tasks ?? [];
  const leadList = leads ?? [];
  const noteList = notes ?? [];

  const usingRealTeam = Boolean(team && team.length > 0);
  const roster: PanelPerson[] = usingRealTeam ? team!.map(fromTeam) : fromStaticRoster();
  const title = usingRealTeam ? `Equipo (${roster.length})` : `Colaboradores (${roster.length})`;

  return (
    <SurfaceCard title={title}>
      {roster.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin personas registradas.</p>
      ) : (
        <div className="grid gap-4">
          {roster.map((person) => {
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
                key={person.id}
                className="grid gap-2.5 border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                      {initials(person.displayName)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{person.displayName}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{person.subtitle}</p>
                    </div>
                  </div>
                  <Badge tone={person.tone}>{person.statusLabel}</Badge>
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
