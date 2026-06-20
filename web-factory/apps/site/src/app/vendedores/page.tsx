"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import "./vendedores.css";
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  BookOpen,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Lightbulb,
  MessageSquareText,
  PhoneCall,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

type LeadStatus =
  | "Nuevo"
  | "Investigado"
  | "Calificado"
  | "Mensaje preparado"
  | "Aprobado para contactar"
  | "Contactado"
  | "Respondio"
  | "Demo agendada"
  | "Propuesta enviada"
  | "Ganado";

type Lead = {
  empresa: string;
  rubro: string;
  ciudad: string;
  canal: string;
  estado: LeadStatus;
  prioridad: "alta" | "media" | "baja";
  producto: string;
  dolor: string;
  seguimiento: string;
  datosCompletos: boolean;
};

type Note = {
  title: string;
  body: string;
  type: string;
  owner: string;
};

type Idea = {
  title: string;
  body: string;
  signal: string;
};

type Income = {
  client: string;
  service: string;
  charged: string;
  commission: string;
  status: "pendiente" | "aprobada" | "pagada" | "retenida";
};

type Metric = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: "green" | "blue" | "amber" | "rose";
};

const initialLeads: Lead[] = [
  {
    empresa: "Clinica Dental Norte",
    rubro: "Dental",
    ciudad: "Santa Cruz",
    canal: "WhatsApp",
    estado: "Demo agendada",
    prioridad: "alta",
    producto: "DentalGest + landing",
    dolor: "Pierde consultas por agenda manual y respuestas lentas.",
    seguimiento: "Hoy 16:30",
    datosCompletos: true,
  },
  {
    empresa: "Beauty Lab SCZ",
    rubro: "Estetica",
    ciudad: "Santa Cruz",
    canal: "Instagram",
    estado: "Respondio",
    prioridad: "alta",
    producto: "Web Pro ONIA + CRM simple",
    dolor: "Recibe mensajes pero no sabe que prospectos vuelven.",
    seguimiento: "Manana 10:00",
    datosCompletos: false,
  },
  {
    empresa: "Distribuidora KAI",
    rubro: "Pyme comercial",
    ciudad: "La Paz",
    canal: "Llamada",
    estado: "Propuesta enviada",
    prioridad: "media",
    producto: "GestiOS + automatizacion",
    dolor: "Inventario y pedidos dependen de Excel.",
    seguimiento: "Viernes 09:00",
    datosCompletos: true,
  },
  {
    empresa: "Estudio Legal Vargas",
    rubro: "Servicios",
    ciudad: "Cochabamba",
    canal: "Referido",
    estado: "Mensaje preparado",
    prioridad: "media",
    producto: "Web Profesional",
    dolor: "No tiene presencia clara ni formulario.",
    seguimiento: "Pendiente aprobar contacto",
    datosCompletos: false,
  },
];

const initialNotes: Note[] = [
  {
    title: "Objecion repetida",
    body: "Varios clientes preguntan si la web incluye WhatsApp y seguimiento. Responder con alcance exacto.",
    type: "objecion",
    owner: "Vendedor",
  },
  {
    title: "Promesa que requiere Sergio",
    body: "No prometer integracion de WhatsApp automatico sin validar BSP, numero y costo mensual.",
    type: "riesgo",
    owner: "Sergio",
  },
];

const initialIdeas: Idea[] = [
  {
    title: "Paquete clinicas pequenas",
    body: "Landing + agenda + mensajes preparados + seguimiento en CRM simple.",
    signal: "3 consultas similares",
  },
  {
    title: "Auditoria web express",
    body: "Diagnostico de presencia digital con plan de accion y cotizacion de mejora.",
    signal: "Entrada barata",
  },
];

const incomes: Income[] = [
  {
    client: "Clinica Dental Norte",
    service: "DentalGest primer mes",
    charged: "Bs. 750",
    commission: "Pendiente",
    status: "pendiente",
  },
  {
    client: "Tienda Lira",
    service: "Landing captacion",
    charged: "Bs. 1,200",
    commission: "Bs. 180",
    status: "aprobada",
  },
  {
    client: "AutoPartes Sur",
    service: "Auditoria express",
    charged: "Bs. 350",
    commission: "Bs. 52.50",
    status: "pagada",
  },
];

const webChecklist = [
  { label: "Tiene web", offer: "Si no tiene: Landing de Captacion" },
  { label: "WhatsApp visible", offer: "Si no: CTA y boton directo" },
  { label: "Formulario funcional", offer: "Si no: captacion + CRM simple" },
  { label: "Oferta clara", offer: "Si no: copy y estructura comercial" },
  { label: "Seguimiento post-contacto", offer: "Si no: pipeline y recordatorios" },
];

const library = [
  {
    title: "Regla de comision",
    body: "La comision aplica solo sobre el primer pago realmente cobrado y validado por ONIA.",
    icon: ShieldCheck,
  },
  {
    title: "Que no prometer",
    body: "No prometer ventas garantizadas, SEO garantizado, viralidad ni WhatsApp automatico sin validar.",
    icon: AlertTriangle,
  },
  {
    title: "Web vs sistema",
    body: "Si hay login, dashboard, base de datos o usuarios internos, no es web simple: va a discovery pagado.",
    icon: ClipboardCheck,
  },
  {
    title: "Llamada critica",
    body: "La vendedora llama. Sergio acompana solo si el cierre es sensible, tecnico o de alto valor.",
    icon: PhoneCall,
  },
];

function StatusPill({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "green" | "blue" | "amber" | "rose" | "gray";
}) {
  return <span className={`seller-pill is-${tone}`}>{children}</span>;
}

function LeadRow({ lead }: { lead: Lead }) {
  return (
    <article className={`seller-lead-row priority-${lead.prioridad}`}>
      <div className="seller-lead-main">
        <strong>{lead.empresa}</strong>
        <span>
          {lead.rubro} / {lead.ciudad} / {lead.canal}
        </span>
      </div>
      <div>
        <StatusPill tone={lead.estado === "Ganado" ? "green" : lead.prioridad === "alta" ? "amber" : "blue"}>
          {lead.estado}
        </StatusPill>
        <p>{lead.producto}</p>
      </div>
      <small>{lead.dolor}</small>
      <div className="seller-followup">
        <CalendarClock size={15} />
        <span>{lead.seguimiento}</span>
      </div>
      <StatusPill tone={lead.datosCompletos ? "green" : "rose"}>
        {lead.datosCompletos ? "datos completos" : "faltan datos"}
      </StatusPill>
    </article>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  return (
    <article className={`seller-metric is-${metric.tone}`}>
      <span>
        <Icon size={18} />
      </span>
      <p>{metric.label}</p>
      <strong>{metric.value}</strong>
      <small>{metric.detail}</small>
    </article>
  );
}

export default function VendedoresPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [leadForm, setLeadForm] = useState({
    empresa: "",
    rubro: "",
    ciudad: "",
    canal: "WhatsApp",
    dolor: "",
  });
  const [noteForm, setNoteForm] = useState({ title: "", body: "" });
  const [ideaForm, setIdeaForm] = useState({ title: "", body: "" });

  const metrics = useMemo<Metric[]>(
    () => [
      {
        label: "Leads activos",
        value: String(leads.length),
        detail: "Incluye nuevos, demos y propuestas",
        icon: UsersRound,
        tone: "green",
      },
      {
        label: "Seguimientos",
        value: "5",
        detail: "Acciones que no pueden quedar sueltas",
        icon: CalendarClock,
        tone: "blue",
      },
      {
        label: "Ventas calientes",
        value: String(leads.filter((lead) => lead.prioridad === "alta").length),
        detail: "Prioridad alta o demo cercana",
        icon: Target,
        tone: "amber",
      },
      {
        label: "Comision pendiente",
        value: "Bs. 232.50",
        detail: "No aprobada hasta validar cobro y datos",
        icon: Banknote,
        tone: "rose",
      },
    ],
    [leads],
  );

  function addLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!leadForm.empresa.trim() || !leadForm.rubro.trim()) {
      return;
    }

    setLeads((current) => [
      {
        empresa: leadForm.empresa.trim(),
        rubro: leadForm.rubro.trim(),
        ciudad: leadForm.ciudad.trim() || "Sin ciudad",
        canal: leadForm.canal,
        estado: "Nuevo",
        prioridad: "media",
        producto: "Auditoria Express",
        dolor: leadForm.dolor.trim() || "Dolor pendiente de validar.",
        seguimiento: "Definir proximo contacto",
        datosCompletos: false,
      },
      ...current,
    ]);
    setLeadForm({ empresa: "", rubro: "", ciudad: "", canal: "WhatsApp", dolor: "" });
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!noteForm.title.trim() || !noteForm.body.trim()) {
      return;
    }
    setNotes((current) => [
      { title: noteForm.title.trim(), body: noteForm.body.trim(), type: "nota", owner: "Vendedor" },
      ...current,
    ]);
    setNoteForm({ title: "", body: "" });
  }

  function addIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ideaForm.title.trim() || !ideaForm.body.trim()) {
      return;
    }
    setIdeas((current) => [
      { title: ideaForm.title.trim(), body: ideaForm.body.trim(), signal: "captura local" },
      ...current,
    ]);
    setIdeaForm({ title: "", body: "" });
  }

  return (
    <main className="seller-page">
      <aside className="seller-sidebar" aria-label="Panel de vendedores">
        <Link className="seller-back" href="/">
          <ArrowLeft size={16} />
          Control Center
        </Link>
        <div className="seller-brand">
          <span>
            <WalletCards size={20} />
          </span>
          <div>
            <strong>ONIA Panel</strong>
            <small>Vendedores</small>
          </div>
        </div>
        <nav className="seller-nav">
          <a href="#inicio" className="is-active">
            <Target size={15} />
            Inicio
          </a>
          <a href="#leads">
            <Building2 size={15} />
            Leads
          </a>
          <a href="#webs">
            <Search size={15} />
            Webs
          </a>
          <a href="#notas">
            <MessageSquareText size={15} />
            Notas
          </a>
          <a href="#ideas">
            <Lightbulb size={15} />
            Ideas
          </a>
          <a href="#ingresos">
            <Banknote size={15} />
            Ingresos
          </a>
        </nav>
        <section className="seller-rule">
          <ShieldCheck size={17} />
          <strong>Sin datos completos, no hay comision aprobada.</strong>
          <p>Notion es fuente oficial hoy; Supabase queda preparado para el panel propio.</p>
        </section>
      </aside>

      <section className="seller-main" id="inicio">
        <header className="seller-header">
          <div>
            <span className="seller-eyebrow">Sales Desk / MVP operativo</span>
            <h1>ONIA Panel de Vendedores</h1>
            <p>
              Un sistema unico para registrar leads, vender webs y servicios, anotar llamadas, capturar ideas,
              controlar ingresos y preparar comisiones sin improvisar.
            </p>
          </div>
          <div className="seller-header-actions">
            <a href="#captura">
              <Plus size={16} />
              Nuevo lead
            </a>
            <a href="#biblioteca">
              <BookOpen size={16} />
              Reglas
            </a>
          </div>
        </header>

        <section className="seller-metrics" aria-label="Resumen de ventas">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="seller-grid">
          <div className="seller-column">
            <section className="seller-panel" id="captura">
              <div className="seller-panel-heading">
                <div>
                  <span>Captura rapida</span>
                  <h2>Registrar prospecto sin perder contexto</h2>
                </div>
                <Plus size={17} />
              </div>
              <form className="seller-form" onSubmit={addLead}>
                <label>
                  Empresa
                  <input
                    value={leadForm.empresa}
                    onChange={(event) => setLeadForm((value) => ({ ...value, empresa: event.target.value }))}
                    placeholder="Ej. Clinica, tienda, taller"
                  />
                </label>
                <label>
                  Rubro
                  <input
                    value={leadForm.rubro}
                    onChange={(event) => setLeadForm((value) => ({ ...value, rubro: event.target.value }))}
                    placeholder="Dental, estetica, comercio"
                  />
                </label>
                <label>
                  Ciudad
                  <input
                    value={leadForm.ciudad}
                    onChange={(event) => setLeadForm((value) => ({ ...value, ciudad: event.target.value }))}
                    placeholder="Santa Cruz"
                  />
                </label>
                <label>
                  Canal
                  <select
                    value={leadForm.canal}
                    onChange={(event) => setLeadForm((value) => ({ ...value, canal: event.target.value }))}
                  >
                    <option>WhatsApp</option>
                    <option>Instagram</option>
                    <option>Llamada</option>
                    <option>Email</option>
                    <option>Referido</option>
                  </select>
                </label>
                <label className="seller-form-wide">
                  Dolor probable
                  <textarea
                    value={leadForm.dolor}
                    onChange={(event) => setLeadForm((value) => ({ ...value, dolor: event.target.value }))}
                    placeholder="Que problema parece tener y que debemos validar en la llamada"
                  />
                </label>
                <button type="submit">
                  <Plus size={16} />
                  Guardar lead
                </button>
              </form>
            </section>

            <section className="seller-panel" id="leads">
              <div className="seller-panel-heading">
                <div>
                  <span>Pipeline</span>
                  <h2>Leads y proximos pasos</h2>
                </div>
                <UsersRound size={17} />
              </div>
              <div className="seller-leads">
                {leads.map((lead) => (
                  <LeadRow key={`${lead.empresa}-${lead.canal}`} lead={lead} />
                ))}
              </div>
            </section>

            <section className="seller-panel" id="webs">
              <div className="seller-panel-heading">
                <div>
                  <span>Venta de webs</span>
                  <h2>Checklist para recomendar bien</h2>
                </div>
                <ClipboardCheck size={17} />
              </div>
              <div className="seller-checklist">
                {webChecklist.map((item) => (
                  <article key={item.label}>
                    <CheckCircle2 size={16} />
                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.offer}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="seller-column seller-column-side">
            <section className="seller-panel" id="notas">
              <div className="seller-panel-heading">
                <div>
                  <span>Llamadas</span>
                  <h2>Notas importantes</h2>
                </div>
                <MessageSquareText size={17} />
              </div>
              <form className="seller-mini-form" onSubmit={addNote}>
                <input
                  value={noteForm.title}
                  onChange={(event) => setNoteForm((value) => ({ ...value, title: event.target.value }))}
                  placeholder="Titulo de la nota"
                />
                <textarea
                  value={noteForm.body}
                  onChange={(event) => setNoteForm((value) => ({ ...value, body: event.target.value }))}
                  placeholder="Objecion, promesa, pregunta tecnica o siguiente paso"
                />
                <button type="submit">
                  <FileText size={15} />
                  Anotar
                </button>
              </form>
              <div className="seller-notes">
                {notes.map((note) => (
                  <article key={`${note.title}-${note.body}`}>
                    <StatusPill tone={note.type === "riesgo" ? "rose" : "blue"}>{note.type}</StatusPill>
                    <strong>{note.title}</strong>
                    <p>{note.body}</p>
                    <small>{note.owner}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="seller-panel" id="ideas">
              <div className="seller-panel-heading">
                <div>
                  <span>Aprendizaje comercial</span>
                  <h2>Lluvia de ideas</h2>
                </div>
                <Sparkles size={17} />
              </div>
              <form className="seller-mini-form" onSubmit={addIdea}>
                <input
                  value={ideaForm.title}
                  onChange={(event) => setIdeaForm((value) => ({ ...value, title: event.target.value }))}
                  placeholder="Idea, nicho o paquete"
                />
                <textarea
                  value={ideaForm.body}
                  onChange={(event) => setIdeaForm((value) => ({ ...value, body: event.target.value }))}
                  placeholder="Que se podria vender o mejorar"
                />
                <button type="submit">
                  <Lightbulb size={15} />
                  Guardar idea
                </button>
              </form>
              <div className="seller-ideas">
                {ideas.map((idea) => (
                  <article key={`${idea.title}-${idea.signal}`}>
                    <Lightbulb size={15} />
                    <div>
                      <strong>{idea.title}</strong>
                      <p>{idea.body}</p>
                      <small>{idea.signal}</small>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="seller-panel" id="ingresos">
              <div className="seller-panel-heading">
                <div>
                  <span>Cobros</span>
                  <h2>Ingresos y comisiones</h2>
                </div>
                <Banknote size={17} />
              </div>
              <div className="seller-income-table">
                {incomes.map((income) => (
                  <article key={`${income.client}-${income.service}`}>
                    <div>
                      <strong>{income.client}</strong>
                      <span>{income.service}</span>
                    </div>
                    <strong>{income.charged}</strong>
                    <span>{income.commission}</span>
                    <StatusPill
                      tone={
                        income.status === "pagada"
                          ? "green"
                          : income.status === "aprobada"
                            ? "blue"
                            : income.status === "retenida"
                              ? "rose"
                              : "amber"
                      }
                    >
                      {income.status}
                    </StatusPill>
                  </article>
                ))}
              </div>
            </section>

            <section className="seller-panel" id="biblioteca">
              <div className="seller-panel-heading">
                <div>
                  <span>Biblioteca</span>
                  <h2>Reglas para vender sin riesgo</h2>
                </div>
                <BookOpen size={17} />
              </div>
              <div className="seller-library">
                {library.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title}>
                      <Icon size={16} />
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.body}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
