import { APP_URL } from "@/lib/constants";
import { CtaWhatsApp } from "./cta-whatsapp";

interface Plan {
  id: string;
  nombre: string;
  precio: string;
  tagline: string;
  lead: string;
  items: string[];
  nota: string;
  notaAmber?: boolean;
  destacado?: boolean;
}

const PLANES: Plan[] = [
  {
    id: "basico",
    nombre: "BÁSICO",
    precio: "Bs 320",
    tagline: "Ordenar la clínica",
    lead: "Incluye:",
    items: [
      "Agenda de citas y ficha por paciente",
      "Historia clínica y odontograma digital",
      "Facturación SIAT integrada",
      "Registro de pagos y saldos por tratamiento",
      "Botón de WhatsApp para tus pacientes",
    ],
    nota: "Bs 320 = lo que cobrás por tres consultas.",
  },
  {
    id: "pro",
    nombre: "PRO",
    precio: "Bs 750",
    tagline: "Cobrar y no perder pacientes",
    lead: "Todo lo del Básico, más:",
    items: [
      "Agente que reprograma: cancelación o silencio → ofrece otro horario y llena el hueco",
      "Confirmación de citas por WhatsApp",
      "Cobranza con QR: cuotas y saldos reclamados solos, con tu aprobación",
      "Reactivación de pacientes que dejaron el tratamiento a medias",
    ],
    nota: "Menos que dos ausencias de ortodoncia al mes.",
    notaAmber: true,
    destacado: true,
  },
  {
    id: "full",
    nombre: "FULL",
    precio: "Bs 1.500",
    tagline: "La clínica opera sola",
    lead: "Todo lo del Pro, más:",
    items: [
      "Varios profesionales y sillones en la misma agenda",
      "Agentes 24/7 sobre toda la operación: agenda, cobros y seguimiento",
      "Reportes de producción por profesional y tratamiento",
      "Acompañamiento prioritario de ONIA",
    ],
    nota: "Media endodoncia multirradicular al mes.",
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  const cardClass = plan.destacado ? "plan-card plan-pro" : "plan-card";
  const noteClass = plan.notaAmber ? "plan-note plan-note-amber" : "plan-note";
  return (
    <article className={cardClass} data-reveal aria-label={`Plan ${plan.nombre}`}>
      {plan.destacado ? (
        <span className="plan-chip">El plan recomendado</span>
      ) : null}
      <p className="plan-name">{plan.nombre}</p>
      <p className="plan-price">
        {plan.precio}
        <span className="plan-per">/mes</span>
      </p>
      <p className="plan-tagline">{plan.tagline}</p>
      <p className="plan-lead">{plan.lead}</p>
      <ul className="plan-list">
        {plan.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className={noteClass}>
        <p className="plan-note-inner">{plan.nota}</p>
      </div>
    </article>
  );
}

export function Planes() {
  return (
    <section className="planes" aria-labelledby="planes-heading">
      <div className="container">
        <div className="section-head-center" data-reveal>
          <h2 id="planes-heading">Elegí cuánto querés que trabaje solo</h2>
          <p className="section-intro">
            La facturación SIAT viene incluida en los tres planes. Lo que sube
            de nivel es cuánto se automatiza tu clínica.
          </p>
          <p className="chip chip-launch">Precios de lanzamiento</p>
        </div>
        <div className="planes-grid reveal-stagger">
          {PLANES.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
        <p className="planes-strip" data-reveal>
          Implementación y migración de tus datos: incluidas, sin costo de
          setup. Pagás por QR; si preferís, trimestral adelantado.
        </p>
        <div className="planes-cta" data-reveal>
          <CtaWhatsApp label="Quiero una demo por WhatsApp" />
          <a href={APP_URL} className="btn btn-ghost">
            Entrar a la app
          </a>
        </div>
        <p className="planes-fine">
          Precios de lanzamiento en bolivianos, sujetos a ajuste con preaviso.
          Sin permanencia forzada.
        </p>
      </div>
    </section>
  );
}
