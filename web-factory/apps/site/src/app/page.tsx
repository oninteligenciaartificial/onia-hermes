import type { CSSProperties } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  Command,
  Database,
  GitBranch,
  Inbox,
  LayoutDashboard,
  MessageCircle,
  PlayCircle,
  RadioTower,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  Users,
  WalletCards,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

type Metric = {
  label: string;
  value: string;
  detail: string;
  tone: "ok" | "warn" | "info" | "hold";
  icon: LucideIcon;
};

type WorkflowItem = {
  name: string;
  id: string;
  state: string;
  route: string;
  detail: string;
  href?: string;
  icon: LucideIcon;
  tone: "ok" | "warn" | "info";
};

type ScheduleItem = {
  time: string;
  command: string;
  output: string;
  channel: string;
  tone: "green" | "cyan" | "amber" | "rose";
};

type Guardrail = {
  title: string;
  detail: string;
  icon: LucideIcon;
};

type BacklogItem = {
  title: string;
  owner: string;
  state: string;
  icon: LucideIcon;
};

const metrics: Metric[] = [
  {
    label: "Workflows activos",
    value: "2",
    detail: "Command Center + Scheduled Pack",
    tone: "ok",
    icon: Workflow,
  },
  {
    label: "Cadencias diarias",
    value: "7",
    detail: "Telegram interno, sin publicar",
    tone: "info",
    icon: CalendarClock,
  },
  {
    label: "Acciones sensibles",
    value: "0",
    detail: "contactos, WhatsApp y publish bloqueados",
    tone: "hold",
    icon: ShieldCheck,
  },
  {
    label: "Pendientes tecnicos",
    value: "3",
    detail: "Notion n8n, Higgsfield polling, OAuth",
    tone: "warn",
    icon: AlertTriangle,
  },
];

const navigation = [
  { label: "Mapa", icon: LayoutDashboard, active: true },
  { label: "Workflows", icon: Workflow },
  { label: "Telegram", icon: MessageCircle },
  { label: "Video Lab", icon: Clapperboard },
  { label: "CRM", icon: Users },
  { label: "Finanzas", icon: WalletCards },
  { label: "Logs", icon: Inbox },
];

const workflows: WorkflowItem[] = [
  {
    name: "ONIA - Telegram Command Center",
    id: "vuicWsvh0hwqKhYs",
    state: "activo publicado",
    route: "Telegram -> SSH -> hermes-command",
    detail: "Router general para proyectos, Video Lab, plan semanal y estado operativo.",
    href: "https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/vuicWsvh0hwqKhYs",
    icon: Command,
    tone: "ok",
  },
  {
    name: "ONIA - Scheduled Operations Pack",
    id: "VeCHKr6wkK5Wet25",
    state: "activo publicado",
    route: "Schedule -> hermes-command -> Telegram",
    detail: "Agenda interna diaria para radar, contenido, CRM, Video Lab, copy y registro.",
    href: "https://n8n-sergio-n8n.hqdqgh.easypanel.host/workflow/VeCHKr6wkK5Wet25",
    icon: CalendarClock,
    tone: "ok",
  },
  {
    name: "Hermes Radar Diario Creativo",
    id: "lryabRhGQW4WIuJG",
    state: "historico inactivo",
    route: "cubierto por Scheduled Pack",
    detail: "Queda como referencia; el radar local seguro ya opera en el pack diario.",
    icon: Sparkles,
    tone: "warn",
  },
];

const schedule: ScheduleItem[] = [
  {
    time: "07:30",
    command: "Radar creativo ONIA",
    output: "ideas seguras y oportunidades",
    channel: "Telegram",
    tone: "green",
  },
  {
    time: "08:00",
    command: "Cola contenido diaria",
    output: "piezas Sergio + ONIA",
    channel: "Telegram",
    tone: "cyan",
  },
  {
    time: "08:30",
    command: "Seguimientos ONIA hoy",
    output: "CRM sin envio automatico",
    channel: "Telegram",
    tone: "amber",
  },
  {
    time: "10:00",
    command: "Recordatorios Video Lab",
    output: "aprobaciones pendientes",
    channel: "Telegram",
    tone: "rose",
  },
  {
    time: "15:00",
    command: "Platform Copy Queue",
    output: "copy por canal",
    channel: "Telegram",
    tone: "cyan",
  },
  {
    time: "17:00",
    command: "Watcher Higgsfield",
    output: "jobs, renders y MP4",
    channel: "Telegram",
    tone: "green",
  },
  {
    time: "21:00",
    command: "Registro Hermes",
    output: "log y outbox local",
    channel: "Telegram",
    tone: "amber",
  },
];

const approvalCommands = [
  "Apruebo plan semanal: <pieza>",
  "Apruebo contactar: <empresa>",
  "Confirmo impuesto: <obligacion> <fecha>",
  "Aprobar video <job_id>",
  "Publicar video <job_id>",
];

const guardrails: Guardrail[] = [
  {
    title: "No publica solo",
    detail: "Instagram, TikTok, YouTube y LinkedIn esperan aprobacion exacta por pieza.",
    icon: Send,
  },
  {
    title: "No contacta prospectos",
    detail: "Prospeccion y CRM preparan mensajes; el contacto queda en control humano.",
    icon: Users,
  },
  {
    title: "No expone secretos",
    detail: "Tokens, chat IDs y claves viven fuera de Markdown y no se muestran en pantalla.",
    icon: ShieldCheck,
  },
  {
    title: "Cara y voz requieren revision",
    detail: "Videos con Sergio pasan por Video Lab antes de generar o publicar.",
    icon: PlayCircle,
  },
];

const backlog: BacklogItem[] = [
  {
    title: "Credencial Notion dentro de n8n",
    owner: "Automatizacion",
    state: "pendiente",
    icon: Database,
  },
  {
    title: "Polling estable de Higgsfield",
    owner: "Video Lab",
    state: "pendiente",
    icon: Clapperboard,
  },
  {
    title: "OAuth TikTok / YouTube",
    owner: "Publishing",
    state: "bloqueado",
    icon: GitBranch,
  },
  {
    title: "Rotacion de claves pegadas en nodos HTTP",
    owner: "Seguridad",
    state: "prioridad",
    icon: AlertTriangle,
  },
];

const signalBars = [52, 64, 71, 58, 83, 78, 92, 69, 86, 74, 88, 95, 81, 90];

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;

  return (
    <article className={`automation-metric is-${metric.tone}`}>
      <span className="automation-icon">
        <Icon size={18} />
      </span>
      <p>{metric.label}</p>
      <strong>{metric.value}</strong>
      <small>{metric.detail}</small>
    </article>
  );
}

function WorkflowCard({ workflow }: { workflow: WorkflowItem }) {
  const Icon = workflow.icon;
  const content = (
    <>
      <span className="workflow-card__icon">
        <Icon size={18} />
      </span>
      <div className="workflow-card__body">
        <div className="workflow-card__topline">
          <strong>{workflow.name}</strong>
          <em className={`status-pill is-${workflow.tone}`}>{workflow.state}</em>
        </div>
        <span>{workflow.route}</span>
        <p>{workflow.detail}</p>
        <code>{workflow.id}</code>
      </div>
      {workflow.href ? <ArrowUpRight size={16} className="workflow-card__arrow" /> : null}
    </>
  );

  if (workflow.href) {
    return (
      <a className="workflow-card" href={workflow.href} rel="noreferrer" target="_blank">
        {content}
      </a>
    );
  }

  return <article className="workflow-card">{content}</article>;
}

function ScheduleRow({ item, index }: { item: ScheduleItem; index: number }) {
  return (
    <article className={`schedule-row is-${item.tone}`}>
      <div className="schedule-row__time">
        <strong>{item.time}</strong>
        <span>#{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="schedule-row__line">
        <i />
      </div>
      <div className="schedule-row__body">
        <strong>{item.command}</strong>
        <span>{item.output}</span>
      </div>
      <em>{item.channel}</em>
    </article>
  );
}

function GuardrailCard({ item }: { item: Guardrail }) {
  const Icon = item.icon;

  return (
    <article className="guardrail-card">
      <Icon size={17} />
      <div>
        <strong>{item.title}</strong>
        <span>{item.detail}</span>
      </div>
    </article>
  );
}

function BacklogRow({ item }: { item: BacklogItem }) {
  const Icon = item.icon;

  return (
    <article className="backlog-row">
      <Icon size={16} />
      <div>
        <strong>{item.title}</strong>
        <span>{item.owner}</span>
      </div>
      <em>{item.state}</em>
    </article>
  );
}

export default function Home() {
  return (
    <main className="automation-page">
      <div className="automation-shell">
        <aside className="automation-sidebar" aria-label="Navegacion Hermes">
          <div className="automation-brand">
            <span>
              <RadioTower size={18} />
            </span>
            <div>
              <strong>Hermes</strong>
              <small>Automatizacion ONIA</small>
            </div>
            <Settings size={15} />
          </div>

          <nav className="automation-nav">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <a className={item.active ? "is-active" : ""} href={`#${item.label.toLowerCase()}`} key={item.label}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <section className="operator-card">
            <span className="status-dot" />
            <div>
              <strong>n8n_n8n</strong>
              <small>instancia canonica</small>
            </div>
            <ChevronRight size={15} />
          </section>

          <section className="sidebar-note">
            <span>Ruta tecnica</span>
            <code>hermes-command telegram</code>
            <p>n8n agenda, Hermes razona, Telegram aprueba.</p>
          </section>
        </aside>

        <section className="automation-main">
          <header className="automation-header">
            <div>
              <span className="eyebrow">Snapshot operativo / 13 Jun 2026</span>
              <h1>Panel web para la automatizacion ONIA</h1>
              <p>
                Command Center, schedules diarios, aprobaciones por Telegram y estado de integraciones en un solo lugar.
              </p>
            </div>
            <div className="header-actions" aria-label="Acciones principales">
              <a href="#workflows">
                <Workflow size={16} />
                Workflows
              </a>
              <a href="#aprobaciones">
                <ShieldCheck size={16} />
                Aprobaciones
              </a>
            </div>
          </header>

          <section className="automation-metrics" aria-label="Estado resumido">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </section>

          <section className="ops-grid">
            <article className="primary-panel command-panel">
              <div className="panel-heading">
                <div>
                  <span>Entrada principal</span>
                  <h2>Telegram Command Center</h2>
                </div>
                <em className="status-pill is-ok">activo</em>
              </div>

              <div className="command-route" aria-label="Ruta de automatizacion">
                <span>
                  <MessageCircle size={17} />
                  Telegram
                </span>
                <i />
                <span>
                  <Workflow size={17} />
                  n8n
                </span>
                <i />
                <span>
                  <SquareTerminal size={17} />
                  Hermes
                </span>
                <i />
                <span>
                  <Bell size={17} />
                  Respuesta
                </span>
              </div>

              <div className="terminal-preview">
                <span>$ hermes-command telegram --message</span>
                <strong>Automatizaciones ONIA</strong>
                <small>stdout JSON to telegram_reply to outbox local</small>
              </div>

              <div className="command-chips">
                {["Estado Semana", "Plan Hoy", "Mapa proyectos ONIA", "Watcher Higgsfield"].map((command) => (
                  <code key={command}>{command}</code>
                ))}
              </div>
            </article>

            <article className="primary-panel signal-panel">
              <div className="panel-heading">
                <div>
                  <span>Actividad diaria</span>
                  <h2>Cadencia segura</h2>
                </div>
                <Activity size={17} />
              </div>
              <div className="signal-bars">
                {signalBars.map((value, index) => (
                  <i key={index} style={{ "--height": `${value}%` } as CSSProperties} />
                ))}
              </div>
              <div className="signal-footer">
                <span>7 disparos</span>
                <span>0 envios automaticos</span>
              </div>
            </article>
          </section>

          <section className="content-grid">
            <div className="left-column">
              <section className="automation-panel" id="workflows">
                <div className="panel-heading">
                  <div>
                    <span>Workflows n8n</span>
                    <h2>Mapa de automatizacion</h2>
                  </div>
                  <Zap size={17} />
                </div>
                <div className="workflow-list">
                  {workflows.map((workflow) => (
                    <WorkflowCard key={workflow.name} workflow={workflow} />
                  ))}
                </div>
              </section>

              <section className="automation-panel" id="aprobaciones">
                <div className="panel-heading">
                  <div>
                    <span>Control humano</span>
                    <h2>Aprobaciones validas</h2>
                  </div>
                  <ShieldCheck size={17} />
                </div>
                <div className="approval-grid">
                  {approvalCommands.map((command) => (
                    <code key={command}>{command}</code>
                  ))}
                </div>
              </section>

              <section className="guardrail-grid" aria-label="Guardrails">
                {guardrails.map((guardrail) => (
                  <GuardrailCard item={guardrail} key={guardrail.title} />
                ))}
              </section>
            </div>

            <aside className="right-column">
              <section className="automation-panel schedule-panel">
                <div className="panel-heading">
                  <div>
                    <span>Scheduled Operations Pack</span>
                    <h2>Hoy</h2>
                  </div>
                  <CalendarClock size={17} />
                </div>
                <div className="schedule-list">
                  {schedule.map((item, index) => (
                    <ScheduleRow item={item} index={index} key={item.command} />
                  ))}
                </div>
              </section>

              <section className="automation-panel">
                <div className="panel-heading">
                  <div>
                    <span>Siguientes desbloqueos</span>
                    <h2>Backlog operativo</h2>
                  </div>
                  <AlertTriangle size={17} />
                </div>
                <div className="backlog-list">
                  {backlog.map((item) => (
                    <BacklogRow item={item} key={item.title} />
                  ))}
                </div>
              </section>

              <section className="automation-panel sources-panel">
                <div className="panel-heading">
                  <div>
                    <span>Fuentes usadas</span>
                    <h2>Canon local</h2>
                  </div>
                  <Database size={17} />
                </div>
                <span className="source-row">
                  N8N_AUTOMATION_PLAN.md
                </span>
                <span className="source-row">
                  hermes-content/docs/N8N_AUTOMATIONS.md
                </span>
                <span className="source-row">
                  HERMES_EXECUTION_PROTOCOL.md
                </span>
              </section>
            </aside>
          </section>

          <footer className="automation-footer">
            <span>
              <CheckCircle2 size={16} />
              Guardrail activo: ninguna publicacion, contacto o accion client-facing sin aprobacion exacta.
            </span>
            <span>
              <Bot size={16} />
              Hermes opera como capa de razonamiento; n8n agenda y registra.
            </span>
          </footer>
        </section>
      </div>
    </main>
  );
}
