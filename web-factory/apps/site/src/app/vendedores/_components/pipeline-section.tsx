import { CalendarClock, ListChecks } from "lucide-react";
import type { Lead } from "../types";
import { SectionPanel, StatusPill } from "./ui";

const priorityTone = {
  alta: "warning",
  media: "info",
  baja: "neutral",
} as const;

export function PipelineSection({ leads }: { leads: Lead[] }) {
  return (
    <SectionPanel
      id="leads"
      label="Pipeline"
      title="Leads, prioridad y proximo paso"
      description="La vendedora debe poder abrir esta seccion y saber a quien llamar, por que, que producto ofrecer y que informacion falta."
      icon={ListChecks}
      action={<span className="seller-section-count">{leads.length} activos</span>}
    >
      <div className="seller-pipeline-table" role="table" aria-label="Pipeline de vendedores">
        <div className="seller-pipeline-head" role="row">
          <span>Cuenta</span>
          <span>Oferta</span>
          <span>Riesgo/dolor</span>
          <span>Accion</span>
        </div>
        {leads.map((lead) => (
          <article className="seller-pipeline-row" role="row" key={lead.id}>
            <div className="seller-account-cell">
              <strong>{lead.empresa}</strong>
              <span>
                {lead.rubro} / {lead.ciudad} / {lead.canal}
              </span>
              <small>{lead.contacto}</small>
            </div>
            <div className="seller-offer-cell">
              <StatusPill tone={lead.estado === "Ganado" ? "success" : priorityTone[lead.prioridad]}>
                {lead.estado}
              </StatusPill>
              <strong>{lead.producto}</strong>
              <span>{lead.valorEstimado}</span>
            </div>
            <p>{lead.dolor}</p>
            <div className="seller-action-cell">
              <span>
                <CalendarClock size={15} />
                {lead.seguimiento}
              </span>
              <p>{lead.siguienteAccion}</p>
              <StatusPill tone={lead.datosCompletos ? "success" : "danger"}>
                {lead.datosCompletos ? "datos completos" : "faltan datos"}
              </StatusPill>
            </div>
          </article>
        ))}
      </div>
    </SectionPanel>
  );
}
