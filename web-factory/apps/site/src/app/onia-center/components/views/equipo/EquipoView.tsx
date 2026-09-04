import type { RuntimeLead, RuntimeTask, TeamMember } from "@/lib/onia-center-store";
import { arthurScorecard } from "@/app/onia-center/source";
import { TaskStatusSelect } from "./TaskStatusSelect";

/**
 * Vista Equipo: las personas reales del roster (user_profiles) con su carril,
 * sus tareas y sus leads. Pedido de Sergio 2026-08-01: "el equipo es Arthur y
 * Camila, se tiene que ver mejor" + "yo tengo que poder ver absolutamente todo".
 *
 * Server component puro. El runtime llega filtrado por actor: cada colaborador
 * ve lo suyo; Sergio ve a todos y ademas la liquidacion estimada (showMoney).
 */

interface EquipoViewProps {
  team: TeamMember[];
  tasks: RuntimeTask[];
  leads: RuntimeLead[];
  /** Solo Sergio: bloque de liquidacion estimada. */
  showMoney: boolean;
}

const MEETING_LABEL: Record<string, string> = {
  pendiente: "sin reunion",
  solicitada: "reunion solicitada",
  confirmada: "reunion confirmada",
  cancelada: "cancelada",
};

/** Carril y forma de pago por persona (fuente: docs de colaboradores). */
const MEMBER_LANE: Record<string, { lane: string; pay: string }> = {
  arthur: {
    lane: "Carril contenido: piezas con ?src=, outreach y reuniones. La produccion es el rol, no se paga por unidad.",
    pay: "Gana por resultado, sin topes: Bs 50/reunion atribuible realizada · 20-25% x 6 meses por suscripcion · tabla de servicios · bono mensual discrecional de Sergio.",
  },
  seller_001: {
    lane: "Cierre comercial: entra en llamadas de cierre cuando hay volumen de reuniones.",
    pay: "Comision por venta segun tabla (35% primer mes SaaS, 12% web). Sin sueldo fijo.",
  },
  seller_002: {
    lane: "Canal banca/red propia: referidos calificados.",
    pay: "Comision de referido segun tabla (lead con cierre 12-15%).",
  },
};

function tasksFor(member: TeamMember, tasks: RuntimeTask[]): RuntimeTask[] {
  return tasks.filter((task) => {
    if (task.assignedUserKey) return task.assignedUserKey === member.userKey;
    if (member.userKey === "arthur") return task.assignedRole === "arthur";
    return member.role === "seller" && task.assignedRole === "seller";
  });
}

function leadsFor(member: TeamMember, leads: RuntimeLead[]): RuntimeLead[] {
  return leads.filter(
    (lead) =>
      lead.ownerUserKey === member.userKey ||
      (member.userKey === "arthur" && lead.source && lead.source !== "Manual" && !lead.ownerUserKey),
  );
}

function groupTasks(tasks: RuntimeTask[]): Array<[string, RuntimeTask[]]> {
  const groups = new Map<string, RuntimeTask[]>();
  for (const task of tasks) {
    const key = task.dueLabel || "General";
    const list = groups.get(key) ?? [];
    list.push(task);
    groups.set(key, list);
  }
  return [...groups.entries()];
}

export function EquipoView({ team, tasks, leads, showMoney }: EquipoViewProps) {
  const members = team.filter((member) => member.role !== "sergio");
  const attributed = leads.filter((lead) => lead.source && lead.source !== "Manual");
  const confirmedMeetings = attributed.filter((lead) => lead.meetingStatus === "confirmada");

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-lg font-semibold">Equipo</h1>
          <p className="text-sm text-muted-foreground">
            Las personas reales del roster, con su carril, sus tareas y sus leads. Regla: si no
            esta registrado aca, no existe y no se paga.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{members.length} colaboradores</p>
      </header>

      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin colaboradores activos en el roster.</p>
      ) : (
        members.map((member) => {
          const memberTasks = tasksFor(member, tasks);
          const memberLeads = leadsFor(member, leads);
          const done = memberTasks.filter((task) => task.status === "done").length;
          const lane = MEMBER_LANE[member.userKey];

          return (
            <section key={member.userKey} className="rounded-lg border border-border bg-card p-4">
              <header className="flex items-baseline justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold">{member.displayName}</h2>
                  {lane ? <p className="mt-0.5 text-sm text-muted-foreground">{lane.lane}</p> : null}
                </div>
                {memberTasks.length > 0 ? (
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {done}/{memberTasks.length} tareas
                  </span>
                ) : null}
              </header>

              {lane ? (
                <p className="mt-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                  <strong className="text-foreground">Como gana:</strong> {lane.pay}
                </p>
              ) : null}

              {/* Scorecard solo para Arthur (carril contenido) */}
              {member.userKey === "arthur" ? (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium">
                    Scorecard semanal ({arthurScorecard.length} obligaciones)
                  </summary>
                  <ul className="mt-2 divide-y divide-border">
                    {arthurScorecard.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-4 py-1.5 text-sm">
                        <span className="text-muted-foreground">{item.area}</span>
                        <span className="shrink-0 font-medium">{item.minimum}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}

              {/* Plan de tareas */}
              {memberTasks.length > 0 ? (
                groupTasks(memberTasks).map(([week, weekTasks]) => (
                  <div key={week} className="mt-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {week}
                    </h3>
                    <ul className="mt-1.5 space-y-1.5">
                      {weekTasks.map((task) => (
                        <li
                          key={task.id}
                          className="flex items-start justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm"
                        >
                          <span>{task.title}</span>
                          <TaskStatusSelect task={task} canApprove={showMoney} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Sin tareas asignadas todavia.</p>
              )}

              {/* Leads del colaborador */}
              {memberLeads.length > 0 ? (
                <div className="mt-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sus leads
                  </h3>
                  <ul className="mt-1.5 space-y-1.5">
                    {memberLeads.map((lead) => (
                      <li
                        key={lead.id}
                        className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm"
                      >
                        <span>
                          {lead.company}
                          {lead.source ? (
                            <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              src: {lead.source}
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {MEETING_LABEL[lead.meetingStatus ?? "pendiente"] ?? lead.meetingStatus}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          );
        })
      )}

      {showMoney ? (
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Liquidacion estimada del mes (solo Sergio)</h2>
          <p className="mt-2 rounded-md bg-muted px-3 py-2 text-sm">
            Reuniones confirmadas con fuente: <strong>{confirmedMeetings.length}</strong> · bounty
            estimado: <strong>Bs {confirmedMeetings.length * 50}</strong>{" "}
            <span className="text-xs text-muted-foreground">
              (estimacion — el cierre y el bono discrecional los decide Sergio a fin de mes)
            </span>
          </p>
        </section>
      ) : null}
    </div>
  );
}
