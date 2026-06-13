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
  Gauge,
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
  delta: string;
  tone: "good" | "warn" | "danger" | "neutral";
};

type NavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

type AgentLane = {
  name: string;
  role: string;
  status: string;
  progress: number;
  tone: "green" | "cyan" | "amber" | "rose" | "violet";
};

type VideoJob = {
  title: string;
  lane: string;
  state: string;
  next: string;
  icon: LucideIcon;
};

const metrics: Metric[] = [
  {
    label: "Gateway",
    value: "9119",
    detail: "Dashboard via tunnel",
    delta: "VPS route ready",
    tone: "good",
  },
  {
    label: "Video Lab",
    value: "4",
    detail: "jobs locales",
    delta: "0 auto-publish",
    tone: "warn",
  },
  {
    label: "Higgsfield",
    value: "869.67",
    detail: "creditos Ultra",
    delta: "-24.5 hoy",
    tone: "good",
  },
  {
    label: "Automations",
    value: "18",
    detail: "cadencias activas",
    delta: "sin acciones sensibles",
    tone: "neutral",
  },
];

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Subagentes", icon: Bot },
  { label: "Video Studio", icon: Clapperboard },
  { label: "WhatsApp CRM", icon: MessageCircle },
  { label: "Automations", icon: Workflow },
  { label: "Finanzas", icon: WalletCards },
  { label: "Integrations", icon: GitBranch },
];

const operatingTrend = [64, 71, 69, 73, 78, 76, 81, 79, 84, 86, 82, 88, 91];
const executionBars = [42, 48, 52, 46, 58, 63, 57, 61, 68, 73, 70, 78, 86, 92, 81, 76, 71];
const microBars = [18, 24, 31, 28, 42, 38, 49, 52, 44, 59, 64, 54, 71, 78, 69, 62, 57, 73, 80, 67, 61, 55];

const agentLanes: AgentLane[] = [
  {
    name: "Planner / Arquitectura",
    role: "divide frentes, riesgos y orden",
    status: "activo",
    progress: 88,
    tone: "green",
  },
  {
    name: "Video Lab / Higgsfield",
    role: "briefs, prompts, renders, aprobaciones",
    status: "4 jobs",
    progress: 62,
    tone: "cyan",
  },
  {
    name: "CRM / WhatsApp",
    role: "Notion, Chatwoot, handoff humano",
    status: "manual",
    progress: 38,
    tone: "amber",
  },
  {
    name: "Ops / VPS",
    role: "gateway, assets, n8n, crons",
    status: "watching",
    progress: 74,
    tone: "violet",
  },
];

const videoJobs: VideoJob[] = [
  {
    title: "Sergio avatar all-black",
    lane: "sergio",
    state: "avatar_review_pending",
    next: "review identity",
    icon: PlayCircle,
  },
  {
    title: "Radar IA: ahora trabaja",
    lane: "onia",
    state: "waiting_approval",
    next: "approve brief",
    icon: Sparkles,
  },
  {
    title: "Futbol Lab IA piloto",
    lane: "onia",
    state: "waiting_approval",
    next: "approve brief",
    icon: Clapperboard,
  },
  {
    title: "Francia vs Jordania",
    lane: "onia",
    state: "waiting_approval",
    next: "approve brief",
    icon: Activity,
  },
];

const attentionItems = [
  { label: "WhatsApp automatico", value: "Meta/NIT pendiente", count: "1", icon: MessageCircle },
  { label: "Notion en n8n", value: "credencial pendiente", count: "1", icon: Database },
  { label: "Publicaciones", value: "requieren frase exacta", count: "4", icon: ShieldCheck },
  { label: "TikTok / YouTube", value: "OAuth pendiente", count: "2", icon: Send },
  { label: "Meta token", value: "rotar antes 2026-08-03", count: "1", icon: AlertTriangle },
];

const weeklyCadence = [
  ["Mon", "Kickoff", "08:00"],
  ["Tue", "Prospecting", "09:30"],
  ["Wed", "Build sprint", "10:00"],
  ["Thu", "Content", "10:00"],
  ["Fri", "Finance ops", "15:00"],
  ["Sat", "Sergio brand", "10:00"],
  ["Sun", "Review", "17:00"],
];

const projectMix = [
  ["DentalGest", "Bs. 349/mo", 82],
  ["Gesti-OS", "Bs. 490/mo", 74],
  ["Web ONIA", "Bs. 1490+", 66],
  ["Higgsfield Mkt", "Bs. 2200/mo", 91],
];

function MiniLineChart({ data }: { data: number[] }) {
  const width = 540;
  const height = 150;
  const min = Math.min(...data) - 5;
  const max = Math.max(...data) + 5;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / (max - min)) * height;
    return [x, y] as const;
  });
  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `0,${height} ${line} ${width},${height}`;

  return (
    <svg className="hct-line-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Operating trend">
      <defs>
        <linearGradient id="line-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(49, 230, 161, 0.32)" />
          <stop offset="100%" stopColor="rgba(49, 230, 161, 0)" />
        </linearGradient>
      </defs>
      <g className="hct-grid-lines">
        {[0, 1, 2, 3].map((row) => (
          <line key={row} x1="0" x2={width} y1={(height / 3) * row} y2={(height / 3) * row} />
        ))}
      </g>
      <polygon points={area} fill="url(#line-fill)" />
      <polyline points={line} fill="none" stroke="rgba(234, 238, 242, 0.78)" strokeWidth="2" />
      {points.slice(-4).map(([x, y], index) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={index === 3 ? 4 : 2.5} fill={index === 3 ? "#31e6a1" : "#eef2f6"} />
      ))}
    </svg>
  );
}

function RadialGauge({ value, total }: { value: number; total: number }) {
  const segments = 54;
  const activeSegments = Math.round((value / total) * segments);

  return (
    <div className="hct-radial" aria-label={`${value} credits`}>
      {Array.from({ length: segments }).map((_, index) => (
        <span
          className={index < activeSegments ? "hct-radial-segment is-active" : "hct-radial-segment"}
          key={index}
          style={{ transform: `rotate(${(360 / segments) * index}deg)` }}
        />
      ))}
      <div className="hct-radial-core">
        <Gauge size={18} />
        <span>Total credits</span>
        <strong>{value.toFixed(2)}</strong>
      </div>
    </div>
  );
}

function StatCard({ metric }: { metric: Metric }) {
  return (
    <section className={`hct-stat is-${metric.tone}`}>
      <p>{metric.label}</p>
      <strong>{metric.value}</strong>
      <span>{metric.detail}</span>
      <small>{metric.delta}</small>
    </section>
  );
}

export default function Home() {
  return (
    <main className="hct-page">
      <div className="hct-shell">
        <aside className="hct-sidebar" aria-label="Hermes navigation">
          <div className="hct-brand">
            <span className="hct-brand-mark">
              <RadioTower size={17} />
            </span>
            <div>
              <strong>Hermes</strong>
              <small>ONIA Control Tower</small>
            </div>
            <Settings size={15} className="hct-brand-action" />
          </div>

          <nav className="hct-nav">
            <span className="hct-nav-label">Platform</span>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a className={item.active ? "hct-nav-item is-active" : "hct-nav-item"} href="#" key={item.label}>
                  <Icon size={15} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="hct-sidebar-panel">
            <span>Live route</span>
            <strong>ssh -L 9119</strong>
            <p>VPS dashboard tunnel</p>
          </div>

          <div className="hct-user">
            <span className="hct-avatar">S</span>
            <div>
              <strong>Sergio</strong>
              <small>operator / owner</small>
            </div>
            <ChevronRight size={15} />
          </div>
        </aside>

        <section className="hct-main">
          <header className="hct-topbar">
            <div>
              <p>Good evening</p>
              <h1>Hermes Control Tower</h1>
            </div>
            <div className="hct-actions">
              <button type="button">
                <CalendarClock size={15} />
                Jun 12, 2026
              </button>
              <button type="button">
                <Command size={15} />
                Command Center
              </button>
            </div>
          </header>

          <section className="hct-metrics" aria-label="Hermes metrics">
            {metrics.map((metric) => (
              <StatCard key={metric.label} metric={metric} />
            ))}
          </section>

          <section className="hct-panel hct-trend-panel">
            <div className="hct-panel-heading">
              <div>
                <span>Monthly operating signal</span>
                <h2>Automation momentum</h2>
              </div>
              <p><Zap size={13} /> +27.4% over last 30 days</p>
            </div>
            <MiniLineChart data={operatingTrend} />
            <div className="hct-axis-labels">
              <span>May 14</span>
              <span>May 22</span>
              <span>Jun 2</span>
              <span>Jun 12</span>
            </div>
          </section>

          <section className="hct-split">
            <div className="hct-insight">
              <div className="hct-tab-row">
                <span className="is-selected"><Sparkles size={13} /> AI Insights</span>
                <span><Bot size={13} /> Ask AI</span>
                <span><Bell size={13} /> Manage</span>
              </div>
              <p>
                Manual gates are holding. <strong>Publishing, WhatsApp and face/voice work</strong> still require exact approval.
              </p>
            </div>

            <div className="hct-budget">
              <span>Base monthly tools</span>
              <strong>$281.00</strong>
              <div className="hct-budget-bars">
                <i style={{ "--w": "46%" } as CSSProperties} />
                <i style={{ "--w": "22%" } as CSSProperties} />
                <i style={{ "--w": "32%" } as CSSProperties} />
              </div>
              <div className="hct-legend">
                <span>AI</span>
                <span>Infra</span>
                <span>SaaS</span>
              </div>
            </div>
          </section>

          <section className="hct-panel">
            <div className="hct-panel-heading">
              <div>
                <span>Subagents</span>
                <h2>Working lanes</h2>
              </div>
              <p><Activity size={13} /> orchestration ready</p>
            </div>
            <div className="hct-agent-list">
              {agentLanes.map((agent) => (
                <article className={`hct-agent is-${agent.tone}`} key={agent.name}>
                  <div>
                    <strong>{agent.name}</strong>
                    <span>{agent.role}</span>
                  </div>
                  <em>{agent.status}</em>
                  <div className="hct-progress" aria-label={`${agent.progress}%`}>
                    <i style={{ "--w": `${agent.progress}%` } as CSSProperties} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="hct-panel hct-execution">
            <div className="hct-panel-heading">
              <div>
                <span>Daily execution</span>
                <h2>Crons and command pack</h2>
              </div>
              <p><CheckCircle2 size={13} /> no auto publish</p>
            </div>
            <div className="hct-bar-chart">
              {executionBars.map((bar, index) => (
                <i key={index} style={{ "--h": `${bar}%` } as CSSProperties} />
              ))}
            </div>
            <div className="hct-cadence-grid">
              {weeklyCadence.map(([day, name, time]) => (
                <span key={day}>
                  <strong>{day}</strong>
                  {name}
                  <em>{time}</em>
                </span>
              ))}
            </div>
          </section>
        </section>

        <aside className="hct-right">
          <section className="hct-panel hct-credit-panel">
            <RadialGauge value={869.67} total={1000} />
            <div className="hct-mini-legend">
              <span>Ultra plan</span>
              <span>24.5 spent today</span>
            </div>
            <button type="button" className="hct-wide-button">
              <ArrowUpRight size={14} />
              View Video Studio
            </button>
          </section>

          <section className="hct-panel">
            <div className="hct-right-heading">
              <span>Active operations</span>
              <strong>2,540</strong>
              <small>signals indexed</small>
            </div>
            <div className="hct-micro-bars">
              {microBars.map((bar, index) => (
                <i key={index} style={{ "--h": `${bar}%` } as CSSProperties} />
              ))}
            </div>
            <div className="hct-mini-legend">
              <span>Docs</span>
              <span>Jobs</span>
              <span>CRM</span>
            </div>
          </section>

          <section className="hct-panel">
            <div className="hct-right-heading">
              <span>Video Lab queue</span>
              <strong>4</strong>
              <small>approval-first</small>
            </div>
            <div className="hct-job-list">
              {videoJobs.map((job) => {
                const Icon = job.icon;
                return (
                  <article className="hct-job" key={job.title}>
                    <Icon size={14} />
                    <div>
                      <strong>{job.title}</strong>
                      <span>{job.lane} / {job.state}</span>
                    </div>
                    <em>{job.next}</em>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="hct-panel">
            <div className="hct-right-heading">
              <span>WhatsApp CRM</span>
              <strong>manual</strong>
              <small>Cloud API gated</small>
            </div>
            <div className="hct-crm-stack">
              <span><Inbox size={14} /> Official number inbound</span>
              <span><Users size={14} /> Chatwoot team inbox pending</span>
              <span><Database size={14} /> Notion CRM confirmed</span>
              <span><ShieldCheck size={14} /> bot_allowed handoff rule</span>
            </div>
          </section>

          <section className="hct-panel">
            <div className="hct-right-heading">
              <span>Commercial mix</span>
              <strong>ONIA</strong>
              <small>priority offers</small>
            </div>
            <div className="hct-projects">
              {projectMix.map(([name, price, progress]) => (
                <div key={name}>
                  <span>
                    <strong>{name}</strong>
                    <em>{price}</em>
                  </span>
                  <i style={{ "--w": `${progress}%` } as CSSProperties} />
                </div>
              ))}
            </div>
          </section>

          <section className="hct-panel hct-attention">
            <div className="hct-right-heading">
              <span>Needs attention</span>
              <strong>9</strong>
              <small>before full automation</small>
            </div>
            {attentionItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label}>
                  <Icon size={14} />
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
                  </div>
                  <em>{item.count}</em>
                </article>
              );
            })}
          </section>

          <section className="hct-panel hct-terminal">
            <SquareTerminal size={15} />
            <span>hermes-command telegram</span>
            <strong>Estado Semana</strong>
            <small>Plan Hoy / Watcher Higgsfield / Registro Hermes</small>
          </section>
        </aside>
      </div>
    </main>
  );
}
