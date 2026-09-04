import { Banknote, CalendarClock, Target, UsersRound } from "lucide-react";
import type { DailyAction, Lead, Metric } from "../types";
import { StatusPill } from "./ui";

export function buildMetrics(leads: Lead[]): Metric[] {
  const hotLeads = leads.filter((lead) => lead.prioridad === "alta").length;
  const incompleteLeads = leads.filter((lead) => !lead.datosCompletos).length;

  return [
    {
      label: "Leads activos",
      value: String(leads.length),
      detail: `${incompleteLeads} con datos pendientes`,
      icon: UsersRound,
      tone: "success",
    },
    {
      label: "Seguimientos",
      value: "5",
      detail: "Acciones que no pueden quedar sueltas",
      icon: CalendarClock,
      tone: "info",
    },
    {
      label: "Ventas calientes",
      value: String(hotLeads),
      detail: "Prioridad alta o demo cercana",
      icon: Target,
      tone: "warning",
    },
    {
      label: "Comision pendiente",
      value: "Bs. 232.50",
      detail: "No aprobada hasta validar cobro",
      icon: Banknote,
      tone: "danger",
    },
  ];
}

export function OverviewSection({
  metrics,
  actions,
}: {
  metrics: Metric[];
  actions: DailyAction[];
}) {
  return (
    <section className="seller-overview" aria-label="Resumen de ventas">
      <div className="seller-metrics">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article className={`seller-metric is-${metric.tone}`} key={metric.label}>
              <span>
                <Icon size={18} />
              </span>
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
              <small>{metric.detail}</small>
            </article>
          );
        })}
      </div>

      <div className="seller-daybook" aria-label="Acciones del dia">
        <div className="seller-daybook__heading">
          <span>Hoy</span>
          <strong>Acciones criticas</strong>
        </div>
        <div className="seller-daybook__list">
          {actions.map((action) => (
            <article key={action.id}>
              <time>{action.time}</time>
              <div>
                <strong>{action.title}</strong>
                <p>{action.detail}</p>
              </div>
              <StatusPill tone={action.tone}>{action.owner}</StatusPill>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
