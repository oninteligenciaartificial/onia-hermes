import type { ReactNode } from "react";
import Link from "next/link";
import "./control-center.css";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Command,
  Database,
  FileText,
  Globe2,
  HardDrive,
  Inbox,
  Layers3,
  Lock,
  Mail,
  MonitorCheck,
  Network,
  RadioTower,
  Rocket,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  UsersRound,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

type Tone = "ok" | "warn" | "info" | "hold";

type Metric = {
  label: string;
  value: string;
  detail: string;
  tone: Tone;
  icon: LucideIcon;
};

type Service = {
  name: string;
  role: string;
  status: string;
  access: string;
  next: string;
  tone: Tone;
  icon: LucideIcon;
};

type Migration = {
  from: string;
  to: string;
  priority: string;
  condition: string;
};

type Requirement = {
  title: string;
  minimum: string;
  use: string;
  decision: string;
  tone: Tone;
  icon: LucideIcon;
};

type EmailOption = {
  name: string;
  fit: string;
  decision: string;
  risk: string;
  tone: Tone;
  icon: LucideIcon;
};

const metrics: Metric[] = [
  {
    label: "Core activo",
    value: "9",
    detail: "Supabase, n8n, Cal, Chatwoot, IA, PDF y monitoreo",
    tone: "ok",
    icon: CheckCircle2,
  },
  {
    label: "RAM disponible",
    value: "2.8 GiB",
    detail: "Post-stack; no meter cargas pesadas aqui",
    tone: "warn",
    icon: HardDrive,
  },
  {
    label: "Correo preparado",
    value: "mail",
    detail: "Mailpit + Listmonk privados; sin SMTP productivo",
    tone: "info",
    icon: Mail,
  },
  {
    label: "Bloqueos reales",
    value: "4",
    detail: "auth, DNS, backups offsite y worker VPS",
    tone: "hold",
    icon: ShieldCheck,
  },
];

const navigation = [
  { label: "Control", icon: RadioTower, active: true },
  { label: "Servicios", icon: Server },
  { label: "Migracion", icon: ArrowRight },
  { label: "Correo", icon: Mail },
  { label: "Requisitos", icon: Layers3 },
  { label: "Riesgos", icon: AlertTriangle },
];

const services: Service[] = [
  {
    name: "ONIA Panel de Vendedores",
    role: "Sales desk para leads, webs, notas, ideas, ingresos y comisiones",
    status: "mvp",
    access: "/vendedores",
    next: "Conectar Notion/Supabase cuando el flujo diario este validado.",
    tone: "info",
    icon: UsersRound,
  },
  {
    name: "Supabase",
    role: "Base, auth, storage y memoria operativa",
    status: "privado",
    access: "127.0.0.1:54321 / 54322",
    next: "Mapear apps/tablas antes de exponer APIs.",
    tone: "ok",
    icon: Database,
  },
  {
    name: "n8n",
    role: "Motor de procesos y schedules",
    status: "activo",
    access: "Easypanel n8n-sergio",
    next: "Mantener aprobaciones por Telegram/Hermes.",
    tone: "ok",
    icon: Workflow,
  },
  {
    name: "Cal.com",
    role: "Auto-booking y reuniones",
    status: "activo",
    access: "self-hosted existente",
    next: "Publicar solo con dominio y email estable.",
    tone: "ok",
    icon: CalendarClock,
  },
  {
    name: "Chatwoot",
    role: "Inbox clientes y WhatsApp",
    status: "activo",
    access: "stack onia-chatbot",
    next: "Definir WhatsApp Cloud/BSP antes de vender mas.",
    tone: "ok",
    icon: Inbox,
  },
  {
    name: "Uptime Kuma",
    role: "Monitoreo interno",
    status: "healthy",
    access: "127.0.0.1:3101",
    next: "Crear checks para cada panel y dominio.",
    tone: "ok",
    icon: MonitorCheck,
  },
  {
    name: "LiteLLM",
    role: "Gateway IA y costos",
    status: "healthy",
    access: "127.0.0.1:4000",
    next: "Agregar presupuestos y logs antes de abrir usuarios.",
    tone: "ok",
    icon: Zap,
  },
  {
    name: "Open WebUI",
    role: "Cockpit IA interno",
    status: "healthy",
    access: "127.0.0.1:3102",
    next: "Usar por tunel hasta tener auth gateway.",
    tone: "ok",
    icon: Bot,
  },
  {
    name: "Stirling PDF",
    role: "Herramientas PDF",
    status: "healthy",
    access: "127.0.0.1:3103",
    next: "No exponer sin auth proxy.",
    tone: "ok",
    icon: FileText,
  },
  {
    name: "SearXNG",
    role: "Busqueda privada para research",
    status: "local",
    access: "127.0.0.1:8080",
    next: "Conectarlo a workflows de investigacion.",
    tone: "info",
    icon: Globe2,
  },
  {
    name: "Dify",
    role: "Apps IA vendibles y RAG",
    status: "separar",
    access: "pendiente worker VPS",
    next: "No correr aqui; necesita mas margen y revision de puertos.",
    tone: "warn",
    icon: Sparkles,
  },
  {
    name: "Crawl4AI",
    role: "Crawling AI-ready",
    status: "separar",
    access: "pendiente worker VPS",
    next: "Ejecutar como worker privado con limites.",
    tone: "warn",
    icon: Network,
  },
  {
    name: "Mailpit + Listmonk",
    role: "QA de correo y campanas",
    status: "preparado",
    access: "3104 / 3025 / 3105",
    next: "No configurar SMTP productivo sin DNS/reputacion.",
    tone: "hold",
    icon: Mail,
  },
];

const migrations: Migration[] = [
  {
    from: "Chats IA y prompts sueltos",
    to: "Open WebUI + LiteLLM",
    priority: "P1",
    condition: "auth gateway y presupuestos por modelo",
  },
  {
    from: "Booking externo",
    to: "Cal.com self-hosted",
    priority: "P1",
    condition: "dominio, SMTP y plantillas de reunion",
  },
  {
    from: "Docs y decisiones dispersas",
    to: "Control Tower + hermes-content",
    priority: "P1",
    condition: "snapshots de estado y dueños por accion",
  },
  {
    from: "PDF tools externos",
    to: "Stirling PDF",
    priority: "P2",
    condition: "login privado y politica de uso",
  },
  {
    from: "Newsletters en SaaS",
    to: "Listmonk primero, Mautic despues",
    priority: "P2",
    condition: "dominio de envio y reputacion",
  },
  {
    from: "AI app builders / RAG",
    to: "Dify en VPS worker",
    priority: "P1",
    condition: "8 vCPU / 24 GB RAM clase Contabo VPS 30+",
  },
];

const requirements: Requirement[] = [
  {
    title: "VPS AI worker",
    minimum: "8 vCPU / 24 GB RAM / 200 GB NVMe",
    use: "Dify, Crawl4AI, Browser Use, Maxun y futuros RAG workers.",
    decision: "Comprar o crear antes de instalar cargas pesadas.",
    tone: "warn",
    icon: Server,
  },
  {
    title: "VPS/IP correo",
    minimum: "2-4 vCPU / 4-8 GB RAM / IPv4 limpio",
    use: "Postal, Mailu o docker-mailserver si queremos SMTP propio.",
    decision: "Separado del VPS principal por riesgo de reputacion.",
    tone: "hold",
    icon: Mail,
  },
  {
    title: "Auth gateway",
    minimum: "Authentik o Authelia + Traefik/Easypanel",
    use: "Proteger Open WebUI, Kuma, Listmonk y Dify antes de publicar DNS.",
    decision: "Requisito antes de abrir paneles a internet.",
    tone: "info",
    icon: Lock,
  },
  {
    title: "Backups offsite",
    minimum: "Object storage o segundo VPS de respaldo",
    use: "Supabase, n8n, Listmonk, Dify y Hermes docs.",
    decision: "No migrar clientes sin restauracion probada.",
    tone: "warn",
    icon: HardDrive,
  },
];

const emailOptions: EmailOption[] = [
  {
    name: "Mailpit",
    fit: "Testing y QA de formularios/apps",
    decision: "Usar ya para pruebas privadas.",
    risk: "No entrega correos reales.",
    tone: "ok",
    icon: ShieldCheck,
  },
  {
    name: "Listmonk",
    fit: "Newsletters, listas y campanas simples",
    decision: "Primera opcion ONIA para empezar.",
    risk: "Necesita SMTP y reputacion bien configurados.",
    tone: "info",
    icon: Mail,
  },
  {
    name: "Mautic",
    fit: "Marketing automation completo",
    decision: "Esperar hasta tener journeys y scoring reales.",
    risk: "Mas mantenimiento que Listmonk.",
    tone: "warn",
    icon: Workflow,
  },
  {
    name: "Postal",
    fit: "SMTP tipo SendGrid/Mailgun self-hosted",
    decision: "Solo con VPS/IP separado.",
    risk: "PTR, SPF, DKIM, DMARC y calentamiento obligatorios.",
    tone: "hold",
    icon: Server,
  },
];

const phases = [
  {
    title: "1. Consolidar control",
    detail: "Panel, Uptime Kuma, docs canonicas y runbooks.",
  },
  {
    title: "2. Migrar utilidades",
    detail: "AI interna, PDF, booking, CRM e inbox bajo rutas privadas.",
  },
  {
    title: "3. Preparar correo",
    detail: "Mailpit, Listmonk, dominio de envio y DNS completo.",
  },
  {
    title: "4. Separar workloads",
    detail: "Dify/Crawl4AI/Browser workers en VPS dedicado.",
  },
];

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

function StatusPill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <em className={`status-pill is-${tone}`}>{children}</em>;
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <article className={`service-card is-${service.tone}`}>
      <span className="service-card__icon">
        <Icon size={18} />
      </span>
      <div className="service-card__body">
        <div className="service-card__topline">
          <strong>{service.name}</strong>
          <StatusPill tone={service.tone}>{service.status}</StatusPill>
        </div>
        <p>{service.role}</p>
        <code>{service.access}</code>
        <small>{service.next}</small>
      </div>
    </article>
  );
}

function MigrationRow({ item }: { item: Migration }) {
  return (
    <article className="migration-row">
      <div>
        <span>Desde</span>
        <strong>{item.from}</strong>
      </div>
      <ArrowRight size={16} />
      <div>
        <span>Hacia</span>
        <strong>{item.to}</strong>
      </div>
      <StatusPill tone={item.priority === "P1" ? "ok" : "info"}>{item.priority}</StatusPill>
      <small>{item.condition}</small>
    </article>
  );
}

function RequirementCard({ requirement }: { requirement: Requirement }) {
  const Icon = requirement.icon;

  return (
    <article className={`requirement-card is-${requirement.tone}`}>
      <div className="requirement-card__top">
        <Icon size={18} />
        <StatusPill tone={requirement.tone}>{requirement.title}</StatusPill>
      </div>
      <strong>{requirement.minimum}</strong>
      <p>{requirement.use}</p>
      <small>{requirement.decision}</small>
    </article>
  );
}

function EmailOptionCard({ option }: { option: EmailOption }) {
  const Icon = option.icon;

  return (
    <article className={`email-option is-${option.tone}`}>
      <Icon size={17} />
      <div>
        <strong>{option.name}</strong>
        <span>{option.fit}</span>
        <p>{option.decision}</p>
        <small>{option.risk}</small>
      </div>
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
              <strong>Hermes OS</strong>
              <small>Control Center</small>
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
              <strong>Control Tower</strong>
              <small>localhost:3010</small>
            </div>
            <ChevronRight size={15} />
          </section>

          <section className="sidebar-note">
            <span>Regla operativa</span>
            <code>private-first</code>
            <p>Paneles por tunel SSH hasta tener auth, DNS y backups.</p>
          </section>
        </aside>

        <section className="automation-main">
          <header className="automation-header control-center-header" id="control">
            <div>
              <span className="eyebrow">Snapshot operativo / 20 Jun 2026</span>
              <h1>Hermes OS Control Center</h1>
              <p>
                Un solo mapa para migrar ONIA a infraestructura self-hosted: servicios activos, cargas que deben
                separarse, correo, requisitos y proximas acciones.
              </p>
            </div>
            <div className="header-actions" aria-label="Acciones principales">
              <a href="#servicios">
                <Server size={16} />
                Servicios
              </a>
              <Link href="/vendedores">
                <UsersRound size={16} />
                Vendedores
              </Link>
              <a href="#requisitos">
                <ShieldCheck size={16} />
                Requisitos
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
                  <span>Arquitectura recomendada</span>
                  <h2>Hermes decide, n8n ejecuta, Supabase recuerda</h2>
                </div>
                <StatusPill tone="ok">control plane</StatusPill>
              </div>

              <div className="stack-map" aria-label="Mapa de control">
                <span>
                  <Command size={17} />
                  Hermes
                </span>
                <i />
                <span>
                  <Workflow size={17} />
                  n8n
                </span>
                <i />
                <span>
                  <Database size={17} />
                  Supabase
                </span>
                <i />
                <span>
                  <MonitorCheck size={17} />
                  Uptime
                </span>
              </div>

              <div className="terminal-preview">
                <span>$ npm run audit:selfhosted</span>
                <strong>El VPS actual queda como nucleo, no como servidor para todo.</strong>
                <small>Dify, crawlers pesados y SMTP propio van fuera para no romper operaciones.</small>
              </div>
            </article>

            <article className="primary-panel decision-panel">
              <div className="panel-heading">
                <div>
                  <span>Decision de infraestructura</span>
                  <h2>Comprar capacidad antes de migrar lo pesado</h2>
                </div>
                <AlertTriangle size={17} />
              </div>
              <div className="decision-list">
                <span>
                  <Server size={16} />
                  VPS AI worker: Contabo Cloud VPS 30 class o superior.
                </span>
                <span>
                  <Mail size={16} />
                  Correo productivo: IP separado con PTR/rDNS.
                </span>
                <span>
                  <Lock size={16} />
                  Publicar paneles: solo despues de auth gateway.
                </span>
              </div>
            </article>
          </section>

          <section className="content-grid">
            <div className="left-column">
              <section className="automation-panel" id="servicios">
                <div className="panel-heading">
                  <div>
                    <span>Servicios y capacidades</span>
                    <h2>Inventario self-hosted ONIA</h2>
                  </div>
                  <Activity size={17} />
                </div>
                <div className="service-grid">
                  {services.map((service) => (
                    <ServiceCard key={service.name} service={service} />
                  ))}
                </div>
              </section>

              <section className="automation-panel" id="migracion">
                <div className="panel-heading">
                  <div>
                    <span>Ruta de mudanza</span>
                    <h2>Que se trae al panel y en que orden</h2>
                  </div>
                  <Rocket size={17} />
                </div>
                <div className="migration-list">
                  {migrations.map((item) => (
                    <MigrationRow item={item} key={`${item.from}-${item.to}`} />
                  ))}
                </div>
              </section>

              <section className="automation-panel" id="correo">
                <div className="panel-heading">
                  <div>
                    <span>Correo open-source</span>
                    <h2>Enviar no es lo mismo que tener un panel</h2>
                  </div>
                  <Mail size={17} />
                </div>
                <div className="email-option-grid">
                  {emailOptions.map((option) => (
                    <EmailOptionCard option={option} key={option.name} />
                  ))}
                </div>
              </section>
            </div>

            <aside className="right-column">
              <section className="automation-panel" id="requisitos">
                <div className="panel-heading">
                  <div>
                    <span>Compras y requisitos</span>
                    <h2>Lo nuevo que hace falta</h2>
                  </div>
                  <Layers3 size={17} />
                </div>
                <div className="requirement-list">
                  {requirements.map((requirement) => (
                    <RequirementCard requirement={requirement} key={requirement.title} />
                  ))}
                </div>
              </section>

              <section className="automation-panel">
                <div className="panel-heading">
                  <div>
                    <span>Roadmap operativo</span>
                    <h2>Orden sano</h2>
                  </div>
                  <SquareTerminal size={17} />
                </div>
                <div className="phase-list">
                  {phases.map((phase) => (
                    <article className="phase-card" key={phase.title}>
                      <strong>{phase.title}</strong>
                      <span>{phase.detail}</span>
                    </article>
                  ))}
                </div>
              </section>

              <section className="automation-panel" id="riesgos">
                <div className="panel-heading">
                  <div>
                    <span>Riesgos activos</span>
                    <h2>No cruzar estas lineas</h2>
                  </div>
                  <AlertTriangle size={17} />
                </div>
                <div className="risk-list">
                  <span>
                    <AlertTriangle size={16} />
                    No instalar otro orquestador tipo Coolify si Easypanel/Traefik ya controla 80/443.
                  </span>
                  <span>
                    <ShieldCheck size={16} />
                    No publicar Supabase ni paneles internos sin SSO/auth gateway.
                  </span>
                  <span>
                    <Mail size={16} />
                    No mandar campañas desde el IP principal de operaciones.
                  </span>
                </div>
              </section>
            </aside>
          </section>

          <footer className="automation-footer">
            <span>
              <CheckCircle2 size={16} />
              Fuente canonica: hermes-content/references/hermes-os-control-plane-20260620.json
            </span>
            <span>
              <Bot size={16} />
              Hermes opera como capa de decision; los servicios son capacidades.
            </span>
          </footer>
        </section>
      </div>
    </main>
  );
}
