import type { RuntimeLead, RuntimeTask } from "@/lib/onia-center-store";
import { arthurScorecard } from "@/app/onia-center/source";

/**
 * Vista Equipo: como trabaja Arthur, visto desde el panel.
 *
 * Pedido de Sergio 2026-08-01: "manejarlo todo desde el Onia Center, yo tengo
 * que tener acceso a todo eso y ver como lo hace y como lo registra". Esta
 * vista junta lo que antes vivia repartido (o directamente sin renderizar,
 * como el scorecard): el plan de tareas, el scorecard semanal, las reuniones
 * con su fuente y el resumen de como gana.
 *
 * Server component puro: no hay interaccion, solo lectura. El runtime llega ya
 * filtrado por actor, asi que Arthur ve lo suyo y Sergio ve todo.
 */

interface EquipoViewProps {
  tasks: RuntimeTask[];
  leads: RuntimeLead[];
  /** Solo Sergio ve el bloque de liquidacion estimada. */
  showMoney: boolean;
}

const TASK_STATUS_LABEL: Record<RuntimeTask["status"], string> = {
  todo: "Pendiente",
  doing: "En curso",
  review: "En revision",
  done: "Hecha",
  blocked: "Bloqueada",
};

const MEETING_LABEL: Record<string, string> = {
  pendiente: "sin reunion",
  solicitada: "reunion solicitada",
  confirmada: "reunion confirmada",
  cancelada: "cancelada",
};

function groupTasks(tasks: RuntimeTask[]): Array<[string, RuntimeTask[]]> {
  const groups = new Map<string, RuntimeTask[]>();
  for (const task of tasks) {
    const key = task.dueLabel || "Sin semana";
    const list = groups.get(key) ?? [];
    list.push(task);
    groups.set(key, list);
  }
  return [...groups.entries()];
}

export function EquipoView({ tasks, leads, showMoney }: EquipoViewProps) {
  const arthurTasks = tasks.filter((task) => task.assignedRole === "arthur");
  const done = arthurTasks.filter((task) => task.status === "done").length;
  const attributedLeads = leads.filter((lead) => lead.source && lead.source !== "Manual");
  const confirmedMeetings = attributedLeads.filter((lead) => lead.meetingStatus === "confirmada");

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-lg font-semibold">Equipo · Arthur</h1>
          <p className="text-sm text-muted-foreground">
            Carril contenido — ventana de validacion 3 ago al 1 sep. Regla: si no esta
            registrado aca, no existe y no se paga.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {done}/{arthurTasks.length} tareas hechas
        </p>
      </header>

      {/* Como gana — sin topes, la produccion no se paga: es el rol */}
      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Como gana (sin topes)</h2>
        <ul className="mt-2 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
          <li>• Reunion atribuible realizada: <strong className="text-foreground">Bs 50</strong></li>
          <li>• Suscripcion plataforma atribuible: <strong className="text-foreground">20-25% × 6 meses</strong></li>
          <li>• Servicios (web, n8n, chatbot): <strong className="text-foreground">segun tabla de comisiones</strong></li>
          <li>• Bono mensual: <strong className="text-foreground">discrecional de Sergio</strong>, viendo el trabajo del mes</li>
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          La produccion (piezas, demos, listas) no paga por unidad: es el trabajo del rol.
          Se gana por lo que ese trabajo genera.
        </p>
      </section>

      {/* Scorecard semanal */}
      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Scorecard semanal</h2>
        <ul className="mt-2 divide-y divide-border">
          {arthurScorecard.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-1.5 text-sm">
              <span className="text-muted-foreground">{item.area}</span>
              <span className="shrink-0 font-medium">{item.minimum}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Plan de tareas */}
      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Plan de trabajo</h2>
        {arthurTasks.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Sin tareas asignadas.</p>
        ) : (
          groupTasks(arthurTasks).map(([week, weekTasks]) => (
            <div key={week} className="mt-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{week}</h3>
              <ul className="mt-1.5 space-y-1.5">
                {weekTasks.map((task) => (
                  <li key={task.id} className="flex items-start justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm">
                    <span>{task.title}</span>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        task.status === "done"
                          ? "bg-primary/15 text-primary"
                          : task.status === "blocked"
                            ? "bg-destructive/15 text-destructive"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {TASK_STATUS_LABEL[task.status]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>

      {/* Reuniones y fuentes: la atribucion que liquida */}
      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Leads atribuibles y reuniones</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Solo leads con fuente (?src= o bot). El bounty lo liquida Sergio al cierre del mes
          contra reuniones REALIZADAS.
        </p>
        {attributedLeads.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Todavia no hay leads con fuente.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {attributedLeads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm">
                <span>
                  {lead.company}
                  <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    src: {lead.source}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {MEETING_LABEL[lead.meetingStatus ?? "pendiente"] ?? lead.meetingStatus}
                </span>
              </li>
            ))}
          </ul>
        )}
        {showMoney ? (
          <p className="mt-3 rounded-md bg-muted px-3 py-2 text-sm">
            Reuniones confirmadas con fuente: <strong>{confirmedMeetings.length}</strong> · bounty
            estimado del mes: <strong>Bs {confirmedMeetings.length * 50}</strong>{" "}
            <span className="text-xs text-muted-foreground">(estimacion — el cierre lo aprueba Sergio)</span>
          </p>
        ) : null}
      </section>
    </div>
  );
}
