"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Archive,
  BadgeCheck,
  Banknote,
  Ban,
  BarChart3,
  Bot,
  Boxes,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Code2,
  Crown,
  Database,
  EyeOff,
  FileCheck2,
  Gauge,
  Globe2,
  HandCoins,
  Layers3,
  Lightbulb,
  LockKeyhole,
  Percent,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  UsersRound,
  WalletCards,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import "./onia-center.css";
import type { CenterTone, OperationalService, RoleId } from "./types";
import {
  arthurScorecard,
  dataModelTables,
  evidenceGates,
  expenseSeed,
  incomeSeed,
  leadSeed,
  nuviaExample,
  oniaCenterSeedSource,
  operationalServices,
  paymentExamples,
  premiumToolPolicies,
  privateCapital,
  roleDefinitions,
  sourceDocuments,
  sustainabilityTargets,
} from "./source";
import {
  auditLogSeed,
  calendarConnectorPlans,
  collaborators,
  externalAdapters,
  featureReadinessItems,
  integrationConnectors,
  inventoryItems,
  operatingOrganizations,
  repoStrategy,
} from "./operating-source";
import {
  calculateNuviaLot,
  calculatePayment,
  canSeePrivateCapital,
  businessRuleAudit,
  centerSnapshot,
  formatBs,
  formatPercent,
  getServiceValidation,
  getVisibleCenters,
  getVisibleVendorCommissionRules,
  growthTarget,
  serviceValidations,
} from "./engine";
import {
  getAdapterSummary,
  getAgentTone,
  getBolivianModuleSummary,
  getCollabSafetySummary,
  getFeatureReadinessSummary,
  getFeatureTone,
  getIntegrationReadinessSummary,
  getIntegrationTone,
  getMembershipSummary,
  getOperatingAgentSummary,
  getOperatingDashboardSummary,
  getTaskStatusTone,
  getVisibleCollabIngestionItems,
  getVisibleProjects,
  getVisibleReviews,
  getVisibleTasks,
} from "./operating-engine";
import { OperatingWorkspace } from "./operating-workspace";

type NavItem = {
  id: string;
  label: string;
  detail: string;
  group: string;
  icon: LucideIcon;
  href?: string;
};

type AuthStatusResponse = {
  ok: boolean;
  mode: string;
  message?: string;
  actor?: {
    displayName: string;
    role: RoleId;
  } | null;
};

type RuntimeStatusResponse = {
  ok: boolean;
  mode: string;
  message?: string;
  data?: {
    leads?: unknown[];
    tasks?: unknown[];
    reviews?: unknown[];
    notes?: unknown[];
    ideas?: unknown[];
    codexJobs?: unknown[];
  } | null;
};

type RuntimeConnection = {
  state: "checking" | "connected" | "blocked" | "error";
  mode: string;
  detail: string;
  counts: {
    leads: number;
    tasks: number;
    reviews: number;
    notes: number;
    ideas: number;
    codexJobs: number;
  };
};

// Propuestas del agente Vendedor que esperan decision de Sergio. Salen del
// review_queue real de Supabase (entity "review" del runtime); nunca se inventan.
type RuntimeReviewItem = {
  id: string;
  source: string;
  title: string;
  type: string;
  sensitivity: string;
  status: "pendiente" | "aprobado" | "rechazado" | "importado";
};

const SALES_AGENT_ID = "agent-sales-crm";

function parseReviewItems(raw: unknown[] | undefined): RuntimeReviewItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    if (typeof record.id !== "string") {
      return [];
    }

    const status = record.status;
    return [
      {
        id: record.id,
        source: typeof record.source === "string" ? record.source : "",
        title: typeof record.title === "string" ? record.title : "",
        type: typeof record.type === "string" ? record.type : "revision",
        sensitivity: typeof record.sensitivity === "string" ? record.sensitivity : "internal",
        status:
          status === "aprobado" || status === "rechazado" || status === "importado" ? status : "pendiente",
      },
    ];
  });
}

const DAILY_AGENT_ID = "agent-calendar-energy";

const TASK_STATUS_LABEL: Record<string, string> = {
  todo: "por hacer",
  doing: "en proceso",
  review: "en revision",
  done: "listo",
  blocked: "bloqueado",
};

const TASK_PRIORITY_RANK: Record<string, number> = { alta: 0, media: 1, baja: 2 };

// Tareas reales del runtime (schema onia_center) que el Agente del Dia ordena
// por prioridad para decir "que hacer hoy". Nunca se inventan.
type RuntimeTaskItem = {
  id: string;
  title: string;
  priority: "alta" | "media" | "baja";
  status: "todo" | "doing" | "review" | "done" | "blocked";
  assignedRole: string;
};

function parseTaskItems(raw: unknown[] | undefined): RuntimeTaskItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    if (typeof record.id !== "string") {
      return [];
    }

    const priority = record.priority;
    const status = record.status;
    return [
      {
        id: record.id,
        title: typeof record.title === "string" ? record.title : "",
        priority: priority === "alta" || priority === "baja" ? priority : "media",
        status:
          status === "doing" || status === "review" || status === "done" || status === "blocked"
            ? status
            : "todo",
        assignedRole: typeof record.assignedRole === "string" ? record.assignedRole : "",
      },
    ];
  });
}

// Nav reordenado por lo que Sergio HACE (no por categoria tecnica). Primario:
// Trabajo (dia a dia) · Ventas · Entrega · Dinero. Todo lo secundario/config/
// referencia vive en "Mas" (colapsado). Objetivo: entrar y en 5s saber que hacer.
const navItems: NavItem[] = [
  { id: "dashboard", label: "Hoy", detail: "Prioridades y agenda", group: "Trabajo", icon: CalendarDays },
  { id: "uso-diario", label: "Captura", detail: "Notas y evidencia", group: "Trabajo", icon: FileCheck2 },
  { id: "calendario-sergio", label: "Calendario", detail: "Agenda", group: "Trabajo", icon: CalendarDays },
  { id: "asistente", label: "Asistente", detail: "ONIA Bot", group: "Trabajo", icon: Bot },
  { id: "ideas", label: "Ideas", detail: "Reels e IA", group: "Trabajo", icon: Lightbulb },
  // "Audio IA" (audio-intelligence) oculto del nav hasta usarlo en real. El
  // widget sigue en operating-workspace.tsx; se reactiva agregando el item aqui.
  { id: "agentes", label: "Agentes", detail: "Aprobar Vendedor", group: "Ventas", icon: Sparkles },
  { id: "servicios", label: "Servicios", detail: "Catalogo", group: "Ventas", icon: Layers3 },
  { id: "pagos", label: "Comisiones", detail: "Propias", group: "Ventas", icon: HandCoins },
  { id: "proyectos", label: "Proyectos", detail: "ONIA", group: "Entrega", icon: BriefcaseBusiness },
  { id: "tareas", label: "Tareas", detail: "Revision", group: "Entrega", icon: ClipboardCheck },
  { id: "finanzas", label: "Finanzas", detail: "Centros", group: "Dinero", icon: WalletCards },
  { id: "codex", label: "Codex", detail: "Jobs", group: "Mas", icon: Code2 },
  { id: "evidencias", label: "Evidencias", detail: "Gates", group: "Mas", icon: FileCheck2 },
  { id: "collab", label: "Collab", detail: "Ingestion", group: "Mas", icon: Database },
  { id: "bolivian", label: "Bolivian", detail: "Modulo", group: "Mas", icon: Building2 },
  { id: "integraciones", label: "Integraciones", detail: "Pendientes", group: "Mas", icon: Workflow },
  { id: "web-factory", label: "Web Factory", detail: "Modulo", group: "Mas", icon: Globe2, href: "/onia-center/web-factory" },
  { id: "premium", label: "Premium", detail: "Herramientas", group: "Mas", icon: Zap },
  { id: "nuvia", label: "Nuvia", detail: "Lotes", group: "Mas", icon: Boxes },
  { id: "ceo", label: "CEO", detail: "Privado", group: "Mas", icon: Crown },
  { id: "roles", label: "Roles", detail: "Permisos", group: "Mas", icon: UsersRound },
  { id: "arthur", label: "Arthur", detail: "60 dias", group: "Mas", icon: UserCheck },
  { id: "seguridad", label: "Seguridad", detail: "Privacidad", group: "Mas", icon: ShieldCheck },
  { id: "archivo", label: "Archivo", detail: "Fuentes y reglas", group: "Mas", icon: Archive },
];

const navGroups = ["Trabajo", "Ventas", "Entrega", "Dinero", "Mas"];

const heroActionItems = [
  { id: "uso-diario", label: "Captura rapida", icon: FileCheck2 },
  { id: "ideas", label: "Ideas", icon: Lightbulb },
  { id: "evidencias", label: "Evidencias", icon: ShieldCheck },
] as const;

const moduleCopy: Record<string, { title: string; description: string; content: string[] }> = {
  dashboard: {
    title: "Hoy en ONIA",
    description: "Tareas del dia, calendario de tiempos, captura rapida y alertas operativas filtradas por rol.",
    content: ["Agenda", "Tareas", "Notas rapidas", "Evidencia"],
  },
  "uso-diario": {
    title: "Captura rapida",
    description: "Notas, tareas rapidas, evidencia e informacion valiosa para que nada quede perdido en chats.",
    content: ["Leads", "Tareas", "Notas", "Evidencia"],
  },
  "calendario-sergio": {
    title: "Calendario ONIA",
    description: "Agenda comercial con Cal.com, Google Calendar y Telegram; muestra informacion privada solo a Sergio.",
    content: ["Disponibilidad", "Reuniones", "Asignacion", "Telegram"],
  },
  asistente: {
    title: "ONIA Bot interno",
    description: "Asistente filtrado por rol para consultar servicios, precios, leads visibles, tareas y actualizaciones comerciales.",
    content: ["Servicios", "Clientes visibles", "Tareas", "Actualizaciones"],
  },
  "audio-intelligence": {
    title: "Audio IA comercial",
    description: "Procesa reuniones, audios de WhatsApp o transcripts para extraer necesidad, objeciones, faltantes y borrador de propuesta.",
    content: ["Audio", "Transcript", "Diagnostico", "Propuesta"],
  },
  agentes: {
    title: "Agentes operativos",
    description: "Tareas mensuales, automatizaciones y limites de aprobacion para cada agente.",
    content: ["Plan mensual", "Cadencias", "Evidencia", "Bloqueos"],
  },
  ideas: {
    title: "Bandeja de ideas",
    description: "Reels, links y referencias para revisar despues con Codex, Claude o modelo self-hosted.",
    content: ["Ideas inbox", "Prompts", "Visibilidad", "Revision IA"],
  },
  codex: {
    title: "Codex Queue",
    description: "Trabajos tecnicos preparados con contexto, repo, archivos, aceptacion, validacion y evidencia.",
    content: ["Prompt", "Repo", "Validacion", "Evidencia"],
  },
  proyectos: {
    title: "Proyectos ONIA",
    description: "Portafolio operativo separado de la logica profunda de cada producto.",
    content: ["DentalGest", "GestiOS", "Webs", "Chatbots", "Bolivian", "StockCam"],
  },
  tareas: {
    title: "Tareas y revision",
    description: "Trabajo asignado por rol, evidencia requerida y estado de revision.",
    content: ["Responsables", "Prioridad", "Evidencia", "Revision Sergio"],
  },
  collab: {
    title: "Ingestion colaborativa",
    description: "Aportes de onia-hermes-collab saneados antes de importar a Hermes privado.",
    content: ["Clasificacion", "Sensibilidad", "Aprobar", "Importar"],
  },
  bolivian: {
    title: "Bolivian Electric",
    description: "Modulo propio sobre base reutilizable. TR4 se trata como adaptador externo.",
    content: ["Procesos", "Inventario", "Contenido", "Roadmap"],
  },
  integraciones: {
    title: "Integraciones pendientes",
    description: "Estado de Cal, n8n, modelos locales, Remotion, Web Factory automatico y self-hosted.",
    content: ["Supabase", "Cal", "n8n", "IA local", "Remotion"],
  },
  "web-factory": {
    title: "Web Factory",
    description: "Modulo operativo para recetas, referencias, capturas, codigo revisable y previews internos.",
    content: ["Brief", "Referencias", "Receta", "Preview", "QA"],
  },
  seguridad: {
    title: "Seguridad y permisos",
    description: "Separacion entre privado, operativo y colaborativo por rol y organizacion.",
    content: ["Roles", "RLS", "Auditoria", "Adaptadores"],
  },
  ceo: {
    title: "Dashboard CEO Sergio",
    description: "Caja, runway, deuda, capital y recuperacion. Arthur solo ve senales filtradas, nunca capital privado.",
    content: ["Ventas netas", "Fondo ONIA", "Runway", "Capital privado"],
  },
  roles: {
    title: "Roles y permisos",
    description: "Jerarquia operativa: Sergio, responsables, Arthur, vendedores y freelancers.",
    content: ["Puede", "No puede", "Scope", "Privacidad"],
  },
  arthur: {
    title: "Operacion Arthur 60 dias",
    description: "Scorecard semanal, evidencia, pago estimado y aprobacion final de Sergio.",
    content: ["Leads", "Llamadas", "Contenido", "Mejoras internas"],
  },
  servicios: {
    title: "Catalogo operativo",
    description: "Servicios vendibles, bloqueo por campos obligatorios y prioridad ONIA Motor Local Growth.",
    content: ["Setup", "Mensualidad", "Margen", "Checklist"],
  },
  evidencias: {
    title: "Evidencias",
    description: "Pruebas requeridas para pagos, entregas, semanas Arthur y comisiones.",
    content: ["Prueba", "Responsable", "Bloquea", "Aprobacion"],
  },
  premium: {
    title: "Herramientas premium",
    description: "Higgsfield, IA, pauta y herramientas asignadas por centro contable.",
    content: ["Centro", "Limite", "Brief", "Aprobacion"],
  },
  finanzas: {
    title: "Finanzas y centros",
    description: "Caja por centro, Fondo ONIA, reglas de gastos y capital privado filtrado.",
    content: ["ONIA Servicios", "Fondo ONIA", "Nuvia", "Owner income"],
  },
  nuvia: {
    title: "Nuvia por lote",
    description: "Costos completos, margen bruto minimo, recuperacion de capital y reparto posterior.",
    content: ["Lote", "Costos", "Reserva", "Reparto"],
  },
  pagos: {
    title: "Pagos y comisiones",
    description: "Motor de calculo con evidencia, descuentos, adelantos y aprobacion Sergio.",
    content: ["Vendedor", "Arthur", "Adelanto", "Cierre mensual"],
  },
  archivo: {
    title: "Archivo y sistema",
    description: "Fuentes canonicas, modelo de datos, reglas de bloqueo y detalles tecnicos que no se usan en produccion diaria.",
    content: ["Fuentes", "Modelo", "Reglas", "Auditoria"],
  },
};

const centerBalances = [
  {
    center: "ONIA Servicios",
    amountBs: centerSnapshot.monthlyNetSalesBs,
    detail: "Ventas netas registradas en Center",
    privateOnly: false,
  },
  {
    center: "Fondo ONIA",
    amountBs: centerSnapshot.oniaFundAccumulatedBs,
    detail: "40% de ventas netas registradas",
    privateOnly: false,
  },
  { center: "Nuvia", amountBs: 0, detail: "Sin lotes reales cargados todavia", privateOnly: false },
  { center: "Reserva Nuvia", amountBs: 0, detail: "20% bootstrap; 10% solo cuando Nuvia viva sola", privateOnly: false },
  { center: "ONIA Media", amountBs: 0, detail: "Sin ingresos cobrados registrados", privateOnly: false },
  { center: "Sergio owner income", amountBs: 0, detail: "Retiro privado no aprobado", privateOnly: true },
  { center: "Pagos Arthur aprobados", amountBs: 0, detail: "No hay pagos aprobados sin evidencia", privateOnly: false },
];

const serviceIconById: Record<string, LucideIcon> = {
  "onia-motor-local-growth": Sparkles,
  "onia-motor-local-starter": Target,
  "onia-motor-local-pro": Workflow,
  "web-pro-onia": Building2,
};

function TonePill({ tone, children }: { tone: CenterTone; children: React.ReactNode }) {
  return <span className={`onia-tone-pill is-${tone}`}>{children}</span>;
}

function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="onia-section-heading">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      <Icon size={18} />
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
  privateBlocked,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: CenterTone;
  privateBlocked?: boolean;
}) {
  return (
    <article className={`onia-metric is-${tone} ${privateBlocked ? "is-private" : ""}`}>
      <span>
        {privateBlocked ? <EyeOff size={18} /> : <Icon size={18} />}
      </span>
      <p>{label}</p>
      <strong>{privateBlocked ? "Oculto" : value}</strong>
      <small>{privateBlocked ? "Visible solo para Sergio / Direccion ONIA." : detail}</small>
    </article>
  );
}

function ProgressBar({ value, tone }: { value: number; tone: CenterTone }) {
  const width = `${Math.max(0, Math.min(100, value))}%`;

  return (
    <div className={`onia-progress is-${tone}`} aria-label={`Progreso ${width}`}>
      <span style={{ width }} />
    </div>
  );
}

function ServiceCard({ service }: { service: OperationalService }) {
  const Icon = serviceIconById[service.id] ?? Layers3;
  const validation = getServiceValidation(service.id);
  const canSell = validation?.canSell ?? false;
  const isPriority = service.id === "onia-motor-local-growth";

  return (
    <article className={`onia-service-card ${isPriority ? "is-priority" : ""} ${canSell ? "can-sell" : "is-blocked"}`}>
      <div className="onia-service-card__top">
        <span>
          <Icon size={18} />
        </span>
        <div>
          <strong>{service.name}</strong>
          <small>{service.plan}</small>
        </div>
        <TonePill tone={canSell ? "green" : "red"}>{canSell ? "vendible" : "bloqueado"}</TonePill>
      </div>

      <div className="onia-price-grid">
        <div>
          <span>Setup</span>
          <strong>{service.setupPriceBs ? formatBs(service.setupPriceBs, { compact: true }) : "No definido"}</strong>
        </div>
        <div>
          <span>Mensual</span>
          <strong>{service.isRecurring ? formatBs(service.monthlyPriceBs ?? 0, { compact: true }) : "No aplica"}</strong>
        </div>
        <div>
          <span>Centro</span>
          <strong>{service.accountingCenter ?? "Falta"}</strong>
        </div>
      </div>

      <p>{service.salesScript ?? service.risk ?? "Servicio pendiente de catalogo operativo completo."}</p>

      {service.includes?.length ? (
        <ul className="onia-compact-list">
          {service.includes.slice(0, 5).map((item) => (
            <li key={item}>
              <CheckCircle2 size={14} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {!canSell ? (
        <div className="onia-blocker">
          <Ban size={15} />
          <span>Falta: {validation?.missing.join(", ")}</span>
        </div>
      ) : (
        <div className="onia-blocker is-ok">
          <BadgeCheck size={15} />
          <span>Checklist, evidencia, centro y comision/pago definidos.</span>
        </div>
      )}
    </article>
  );
}

function PrivateCapitalPanel({ visible }: { visible: boolean }) {
  if (!visible) {
    return (
      <article className="onia-private-panel is-hidden">
        <LockKeyhole size={18} />
        <div>
          <strong>Capital privado oculto</strong>
          <p>Arthur, vendedores y freelancers no ven capital Sergio, deuda exacta, runway, recuperacion ni caja real completa.</p>
        </div>
      </article>
    );
  }

  return (
    <article className="onia-private-panel">
      <div className="onia-private-panel__summary">
        <div>
          <span>Capital Sergio/ONIA</span>
          <strong>{formatBs(privateCapital.grossCapitalBs)}</strong>
        </div>
        <div>
          <span>Deuda exacta</span>
          <strong>{formatBs(privateCapital.exactDebtBs)}</strong>
        </div>
        <div>
          <span>Caja despues deuda</span>
          <strong>{formatBs(privateCapital.estimatedCashAfterDebtBs)}</strong>
        </div>
        <div>
          <span>Runway privado</span>
          <strong>{centerSnapshot.runwayMonths.toFixed(2)} meses</strong>
        </div>
      </div>

      <div className="onia-capital-grid">
        <section>
          <h3>Bloque protegido</h3>
          {privateCapital.protectedBuckets.map((bucket) => (
            <div className="onia-ledger-row" key={bucket.name}>
              <span>{bucket.name}</span>
              <strong>{formatBs(bucket.amountBs)}</strong>
              <small>{bucket.rule}</small>
            </div>
          ))}
        </section>
        <section>
          <h3>Crecimiento controlado</h3>
          {privateCapital.growthBuckets.map((bucket) => (
            <div className="onia-ledger-row" key={bucket.name}>
              <span>{bucket.name}</span>
              <strong>{formatBs(bucket.amountBs)}</strong>
              <small>{bucket.rule}</small>
            </div>
          ))}
        </section>
      </div>
    </article>
  );
}

export default function OniaCenterPage() {
  const searchParams = useSearchParams();
  const requestedView = searchParams?.get("view") || "dashboard";
  const [selectedRole, setSelectedRole] = useState<RoleId>("sergio");
  const [sessionRole, setSessionRole] = useState<RoleId | null>(null);
  const [sessionLabel, setSessionLabel] = useState("Sesion local");
  const [runtimeConnection, setRuntimeConnection] = useState<RuntimeConnection>({
    state: "checking",
    mode: "checking",
    detail: "Verificando Auth y Supabase.",
    counts: { leads: 0, tasks: 0, reviews: 0, notes: 0, ideas: 0, codexJobs: 0 },
  });
  const [reviewQueue, setReviewQueue] = useState<RuntimeReviewItem[]>([]);
  const [approvalNotice, setApprovalNotice] = useState<string | null>(null);
  const [approvingReviewId, setApprovingReviewId] = useState<string | null>(null);
  const [runtimeTasks, setRuntimeTasks] = useState<RuntimeTaskItem[]>([]);
  const roleLocked = sessionRole !== null && sessionRole !== "sergio";
  const role = roleDefinitions.find((item) => item.id === selectedRole) ?? roleDefinitions[0];
  const allowedNavItems = useMemo(
    () => navItems.filter((item) => role.visibleModules.includes(item.id)),
    [role.visibleModules],
  );
  const activeView = allowedNavItems.some((item) => item.id === requestedView)
    ? requestedView
    : allowedNavItems[0]?.id ?? "dashboard";
  const activeModule = moduleCopy[activeView] ?? moduleCopy.dashboard;
  const activeNavItem = allowedNavItems.find((item) => item.id === activeView) ?? allowedNavItems[0] ?? navItems[0];
  const ActiveModuleIcon = activeNavItem.icon;
  const showOperationalContext = ["integraciones", "seguridad", "roles", "archivo"].includes(activeView);
  const groupedNavItems = useMemo(
    () =>
      navGroups
        .map((group) => ({ group, items: allowedNavItems.filter((item) => item.group === group) }))
        .filter(({ items }) => items.length > 0),
    [allowedNavItems],
  );
  const visibleHeroActions = useMemo(
    () => heroActionItems.filter((item) => role.visibleModules.includes(item.id)),
    [role.visibleModules],
  );
  const switcherRoles = useMemo(
    () => (roleLocked ? roleDefinitions.filter((item) => item.id === selectedRole) : roleDefinitions),
    [roleLocked, selectedRole],
  );
  const privateVisible = canSeePrivateCapital(selectedRole);
  const visibleCenters = useMemo(() => getVisibleCenters(selectedRole), [selectedRole]);
  const visiblePremium = premiumToolPolicies.filter((policy) => policy.visibility.includes(selectedRole));
  const visibleVendorCommissionRules = useMemo(() => getVisibleVendorCommissionRules(selectedRole), [selectedRole]);
  const blockedServices = serviceValidations.filter((validation) => !validation.canSell).length;
  const nuvia = calculateNuviaLot(nuviaExample);
  const payments = paymentExamples
    .filter((payment) => selectedRole === "sergio" || selectedRole === "area" || payment.role === selectedRole)
    .map((payment) => ({ input: payment, result: calculatePayment(payment) }));
  const salesTone = centerSnapshot.salesStatus === "green" ? "green" : centerSnapshot.salesStatus === "yellow" ? "yellow" : "red";
  const operatingSummary = getOperatingDashboardSummary();
  const visibleProjects = useMemo(() => getVisibleProjects(selectedRole), [selectedRole]);
  const visibleTasks = useMemo(() => getVisibleTasks(selectedRole), [selectedRole]);
  const visibleReviews = useMemo(() => getVisibleReviews(selectedRole), [selectedRole]);
  const visibleIntegrationConnectors = useMemo(
    () =>
      privateVisible
        ? integrationConnectors
        : integrationConnectors.filter((connector) => connector.visibility !== "sergio_private"),
    [privateVisible],
  );
  const visibleFeatureReadinessItems = useMemo(
    () => (privateVisible ? featureReadinessItems : featureReadinessItems.filter((item) => !item.privateOnly)),
    [privateVisible],
  );
  const collabSummary = getCollabSafetySummary();
  const visibleCollabItems = useMemo(() => getVisibleCollabIngestionItems(selectedRole), [selectedRole]);
  const visibleCollabSummary = useMemo(
    () => ({
      queued: visibleCollabItems.filter((item) => item.status === "queued").length,
      sensitive: visibleCollabItems.filter((item) => item.sensitivity === "sensitive").length,
      importable: visibleCollabItems.filter((item) => item.status === "approved" || item.status === "imported").length,
      rejected: visibleCollabItems.filter((item) => item.status === "rejected").length,
    }),
    [visibleCollabItems],
  );
  const bolivianSummary = getBolivianModuleSummary();
  const adapterSummary = getAdapterSummary();
  const integrationSummary = getIntegrationReadinessSummary();
  const featureSummary = getFeatureReadinessSummary();
  const membershipSummary = getMembershipSummary(selectedRole);
  const agentSummary = getOperatingAgentSummary(selectedRole);
  const pendingProposals = reviewQueue.filter((review) => review.status === "pendiente");
  const salesAgentLiveStatus =
    runtimeConnection.state !== "connected"
      ? null
      : pendingProposals.length > 0
        ? { label: `Esperando aprobacion (${pendingProposals.length})`, tone: "yellow" as CenterTone }
        : { label: "Trabajando", tone: "green" as CenterTone };
  const actionableTasks = runtimeTasks.filter(
    (task) => task.status === "todo" || task.status === "doing" || task.status === "review",
  );
  const todayPriorities = [...actionableTasks]
    .sort((a, b) => (TASK_PRIORITY_RANK[a.priority] ?? 1) - (TASK_PRIORITY_RANK[b.priority] ?? 1))
    .slice(0, 5);
  const dailyAgentLiveStatus =
    runtimeConnection.state !== "connected"
      ? null
      : actionableTasks.length > 0
        ? { label: `${actionableTasks.length} para hoy`, tone: "blue" as CenterTone }
        : { label: "Al dia", tone: "green" as CenterTone };
  // Resumen hablado con datos reales (nunca se muestra si no hay conexion real).
  const voiceBriefing =
    runtimeConnection.state !== "connected"
      ? null
      : actionableTasks.length === 0 && pendingProposals.length === 0
        ? "Hoy: sin pendientes."
        : [
            actionableTasks.length > 0 ? `${actionableTasks.length} tarea(s) abierta(s)` : null,
            pendingProposals.length > 0 ? `${pendingProposals.length} propuesta(s) esperando tu aprobacion` : null,
          ]
            .filter(Boolean)
            .join(", ") + ".";
  const visibleCalendarConnectorPlans = useMemo(
    () => (privateVisible ? calendarConnectorPlans : calendarConnectorPlans.filter((plan) => plan.visibility !== "sergio_private")),
    [privateVisible],
  );
  const projectNameById = useMemo(
    () => new Map(visibleProjects.map((project) => [project.id, project.name])),
    [visibleProjects],
  );

  useEffect(() => {
    let active = true;

    async function loadSessionRole() {
      try {
        const response = await fetch("/api/onia-center/auth/status", { cache: "no-store" });
        const body = (await response.json()) as AuthStatusResponse;

        if (!active) {
          return;
        }

        if (!body.ok) {
          if (body.mode !== "configuration_pending") {
            window.location.href = "/onia-center/login";
          }
          return;
        }

        if (body.actor) {
          setSessionRole(body.actor.role);
          setSessionLabel(`${body.actor.displayName} / ${body.actor.role}`);
          if (body.actor.role !== "sergio") {
            setSelectedRole(body.actor.role);
          }
        }
      } catch {
        if (active) {
          setSessionLabel("Sesion local");
        }
      }
    }

    async function loadRuntimeConnection() {
      try {
        const response = await fetch("/api/onia-center/runtime", { cache: "no-store" });
        const body = (await response.json()) as RuntimeStatusResponse;

        if (!active) {
          return;
        }

        if (!body.ok) {
          setRuntimeConnection({
            state: body.mode === "auth_required" || body.mode === "auth_error" ? "blocked" : "error",
            mode: body.mode,
            detail: body.message ?? "No se pudo leer el runtime de ONIA Center.",
            counts: { leads: 0, tasks: 0, reviews: 0, notes: 0, ideas: 0, codexJobs: 0 },
          });
          setReviewQueue([]);
          setRuntimeTasks([]);
          return;
        }

        const data = body.data;
        setRuntimeConnection({
          state: "connected",
          mode: body.mode,
          detail: "Supabase self-hosted responde con datos reales del schema onia_center.",
          counts: {
            leads: data?.leads?.length ?? 0,
            tasks: data?.tasks?.length ?? 0,
            reviews: data?.reviews?.length ?? 0,
            notes: data?.notes?.length ?? 0,
            ideas: data?.ideas?.length ?? 0,
            codexJobs: data?.codexJobs?.length ?? 0,
          },
        });
        setReviewQueue(parseReviewItems(data?.reviews));
        setRuntimeTasks(parseTaskItems(data?.tasks));
      } catch {
        if (active) {
          setRuntimeConnection({
            state: "error",
            mode: "network_error",
            detail: "No se pudo conectar al runtime. Revisa el tunel local a Supabase.",
            counts: { leads: 0, tasks: 0, reviews: 0, notes: 0, ideas: 0, codexJobs: 0 },
          });
          setReviewQueue([]);
          setRuntimeTasks([]);
        }
      }
    }

    loadSessionRole();
    loadRuntimeConnection();

    return () => {
      active = false;
    };
  }, []);

  async function submitReviewDecision(id: string, status: "aprobado" | "rechazado") {
    if (selectedRole !== "sergio") {
      setApprovalNotice("Solo Sergio puede aprobar o rechazar propuestas del agente.");
      return;
    }

    const previous = reviewQueue;
    setApprovingReviewId(id);
    setApprovalNotice(null);
    setReviewQueue((current) => current.map((review) => (review.id === id ? { ...review, status } : review)));

    try {
      const response = await fetch("/api/onia-center/runtime", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entity: "review", id, status }),
      });
      const body = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !body.ok) {
        setReviewQueue(previous);
        setApprovalNotice(body.message ?? "No se pudo actualizar la propuesta en Supabase.");
        return;
      }
      setApprovalNotice(status === "aprobado" ? "Propuesta aprobada." : "Propuesta rechazada.");
    } catch {
      setReviewQueue(previous);
      setApprovalNotice("Error de red al actualizar la propuesta.");
    } finally {
      setApprovingReviewId(null);
    }
  }

  return (
    <main className="onia-center-page">
      <aside className="onia-center-sidebar" aria-label="Navegacion ONIA Center">
        <Link className="onia-back-link" href="/">
          <ChevronRight size={15} />
          Hermes Control
        </Link>

        <div className="onia-brand">
          <span className={pendingProposals.length > 0 ? "has-signal" : ""}>
            <Crown size={20} />
            {pendingProposals.length > 0 ? <i className="onia-signal-dot" aria-hidden="true" /> : null}
          </span>
          <div>
            <strong>ONIA Center</strong>
            <small>
              {pendingProposals.length > 0 ? `${pendingProposals.length} por aprobar` : "Al dia"}
            </small>
          </div>
        </div>

        <nav className="onia-nav" aria-label="Modulos ONIA Center">
          {groupedNavItems.map(({ group, items }) => {
            const groupHasActiveItem = items.some((item) => item.id === activeView);
            // Primarios abiertos de arranque; "Mas" colapsado (disclosure progresivo).
            const startsOpen = group !== "Mas" || groupHasActiveItem;

            return (
              <details className={group === "Mas" ? "onia-nav-group is-mas" : "onia-nav-group"} key={group} open={startsOpen}>
                <summary>{group}</summary>
                <div className="onia-nav-group-links">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const active = activeView === item.id;
                    return (
                      <Link
                        aria-current={active ? "page" : undefined}
                        className={active ? "is-active" : ""}
                        href={item.href ?? `/onia-center?view=${item.id}`}
                        key={item.id}
                      >
                        <Icon size={15} />
                        <span>{item.label}</span>
                        <small>{item.detail}</small>
                      </Link>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </nav>

        <section className="onia-role-switcher" aria-label="Selector de rol">
          <span>Vista activa</span>
          {switcherRoles.map((item) => (
            <button
              className={selectedRole === item.id ? "is-active" : ""}
              disabled={roleLocked && item.id !== selectedRole}
              key={item.id}
              type="button"
              onClick={() => {
                if (!roleLocked) {
                  setSelectedRole(item.id);
                }
              }}
            >
              <strong>{item.title.split(" / ")[0]}</strong>
              <small>Nivel {item.level}</small>
            </button>
          ))}
          <small className="onia-session-lock">{roleLocked ? `Bloqueado por sesion: ${sessionLabel}` : `Sesion: ${sessionLabel}`}</small>
        </section>
      </aside>

      <section className="onia-center-main">
        <header className="onia-hero">
          <div>
            <span className="onia-eyebrow">ONIA Center / {activeNavItem.group}</span>
            <h1>{activeModule.title}</h1>
            <p>{activeModule.description}</p>
            {voiceBriefing ? <p className="onia-voice-briefing">{voiceBriefing}</p> : null}
          </div>
          <div className="onia-hero-actions">
            {visibleHeroActions.map((item) => {
              const Icon = item.icon;
              return (
                <Link href={`/onia-center?view=${item.id}`} key={item.id}>
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>

        {runtimeConnection.mode === "configuration_pending" ? (
          <div className="onia-wrong-deployment-banner" role="alert">
            <ShieldCheck size={16} />
            <div>
              <strong>Este no es el panel de produccion.</strong>
              <p>
                Este despliegue no tiene acceso a la base de datos real (por diseño: la base vive en una red
                privada). Entra por{" "}
                <a href="https://center.onia.com.bo/onia-center">center.onia.com.bo/onia-center</a> para ver
                datos reales.
              </p>
            </div>
          </div>
        ) : null}

        {showOperationalContext ? (
          <section className="onia-active-module" aria-label="Pantalla activa y conexion">
            <article>
              <span>
                <ActiveModuleIcon size={17} />
                Pantalla activa
              </span>
              <strong>{activeNavItem.label}</strong>
              <p>{activeModule.content.join(" / ")}</p>
            </article>
            <article className={`is-${runtimeConnection.state}`}>
              <span>
                <Database size={17} />
                Runtime
              </span>
              <strong>{runtimeConnection.state === "connected" ? "Supabase conectado" : runtimeConnection.mode}</strong>
              <p>{runtimeConnection.detail}</p>
            </article>
            <article>
              <span>
                <ShieldCheck size={17} />
                Sesion y rol
              </span>
              <strong>{sessionRole ? sessionLabel : "Verificando sesion"}</strong>
              <p>{privateVisible ? "Vista Sergio completa." : "Vista filtrada por permisos."}</p>
            </article>
            <article>
              <span>
                <BarChart3 size={17} />
                Datos vivos
              </span>
              <strong>
                {runtimeConnection.counts.tasks} tareas / {runtimeConnection.counts.reviews} revisiones
              </strong>
              <p>
                Leads {runtimeConnection.counts.leads}, ideas {runtimeConnection.counts.ideas}, Codex {runtimeConnection.counts.codexJobs}, notas {runtimeConnection.counts.notes}.
              </p>
            </article>
          </section>
        ) : null}

        {["dashboard", "uso-diario", "calendario-sergio", "asistente", "audio-intelligence", "ideas", "codex", "integraciones", "servicios"].includes(activeView) ? (
          <OperatingWorkspace
            selectedRole={selectedRole}
            workspaceView={
              activeView === "dashboard"
                ? "daily"
                : activeView === "calendario-sergio"
                  ? "calendar"
                  : activeView === "asistente"
                    ? "assistant"
                    : activeView === "audio-intelligence"
                      ? "audio-intelligence"
                      : activeView === "ideas"
                        ? "ideas"
                        : activeView === "codex"
                          ? "codex-queue"
                          : activeView === "servicios"
                            ? "seller-services"
                            : activeView === "integraciones"
                              ? "connections"
                              : "capture"
            }
          />
        ) : null}

        <section className="onia-panel onia-agent-command-center" id="agentes" hidden={activeView !== "agentes"}>
          <SectionHeader
            eyebrow="Agentes operativos"
            title="Plan mensual, agenda estricta y conexiones"
            description="Los agentes proponen tareas del mes y protegen el cronograma. Las acciones sensibles siguen bloqueadas hasta aprobacion de Sergio y conectores reales."
            icon={Sparkles}
          />

          <div className="onia-collab-summary">
            <div>
              <span>Agentes visibles</span>
              <strong>{agentSummary.visibleAgents.length}</strong>
            </div>
            <div>
              <span>Preparados</span>
              <strong>{agentSummary.prepared}</strong>
            </div>
            <div>
              <span>Tareas del mes</span>
              <strong>{agentSummary.monthlyTasks}</strong>
            </div>
            <div>
              <span>Alta prioridad</span>
              <strong>{agentSummary.highPriorityPlans}</strong>
            </div>
          </div>

          <div className="onia-agent-grid">
            {agentSummary.visibleAgents.map((agent) => (
              <article className="onia-agent-card" key={agent.id}>
                <div className="onia-agent-card__head">
                  <div>
                    <span>{agent.cadence} / {agent.visibility}</span>
                    <strong>{agent.name}</strong>
                  </div>
                  {agent.id === SALES_AGENT_ID && salesAgentLiveStatus ? (
                    <TonePill tone={salesAgentLiveStatus.tone}>{salesAgentLiveStatus.label}</TonePill>
                  ) : agent.id === DAILY_AGENT_ID && dailyAgentLiveStatus ? (
                    <TonePill tone={dailyAgentLiveStatus.tone}>{dailyAgentLiveStatus.label}</TonePill>
                  ) : (
                    <TonePill tone={getAgentTone(agent.status)}>{agent.status.replaceAll("_", " ")}</TonePill>
                  )}
                </div>
                <p>{agent.mission}</p>
                <div className="onia-agent-columns">
                  <div>
                    <strong>Entrega mensual</strong>
                    <small>{agent.monthlyOutcome}</small>
                  </div>
                  <div>
                    <strong>Siguiente accion</strong>
                    <small>{agent.nextAction}</small>
                  </div>
                </div>
                <ul className="onia-compact-list">
                  {agent.actions.slice(0, 4).map((action) => (
                    <li key={action}>
                      <CheckCircle2 size={14} />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
                <small className="onia-agent-rule">{agent.safetyRule}</small>
              </article>
            ))}
          </div>

          <div className="onia-agent-month-plan onia-agent-approval-queue">
            <div className="onia-live-title">
              <CalendarDays size={16} />
              <strong>Prioridades de hoy</strong>
            </div>
            <p>
              El Agente del Dia ordena tus tareas abiertas reales por prioridad. Esto es lo que conviene hacer hoy; no se inventa nada.
            </p>
            {runtimeConnection.state !== "connected" ? (
              <article>
                <div>
                  <span>Runtime</span>
                  <strong>{runtimeConnection.state === "checking" ? "Verificando runtime" : "Runtime no disponible"}</strong>
                  <p>{runtimeConnection.detail} Las prioridades aparecen cuando ONIA Center responde con datos reales.</p>
                </div>
              </article>
            ) : todayPriorities.length ? (
              todayPriorities.map((task) => (
                <article key={task.id}>
                  <div>
                    <span>prioridad {task.priority} / {TASK_STATUS_LABEL[task.status] ?? task.status}</span>
                    <strong>{task.title || "Tarea sin titulo"}</strong>
                  </div>
                  <TonePill tone={task.priority === "alta" ? "red" : task.priority === "media" ? "yellow" : "blue"}>
                    {task.priority}
                  </TonePill>
                </article>
              ))
            ) : (
              <article>
                <div>
                  <span>Al dia</span>
                  <strong>Sin tareas pendientes para hoy.</strong>
                  <p>Cuando haya tareas abiertas en ONIA Center, el Agente del Dia las ordena aca por prioridad.</p>
                </div>
              </article>
            )}
          </div>

          <div className="onia-agent-month-plan onia-agent-approval-queue">
            <div className="onia-live-title">
              <ClipboardCheck size={16} />
              <strong>Cola de aprobacion</strong>
            </div>
            <p>
              Lo que el agente Vendedor propone (mensaje a un lead, propuesta o proxima accion) espera tu OK aca. Sale del review_queue real de Supabase; nada se ejecuta sin tu aprobacion.
            </p>
            {approvalNotice ? <small className="onia-agent-rule">{approvalNotice}</small> : null}
            {runtimeConnection.state !== "connected" ? (
              <article>
                <div>
                  <span>Runtime</span>
                  <strong>{runtimeConnection.state === "checking" ? "Verificando runtime" : "Runtime no disponible"}</strong>
                  <p>{runtimeConnection.detail} La cola aparece cuando ONIA Center responde con datos reales.</p>
                </div>
              </article>
            ) : pendingProposals.length ? (
              pendingProposals.map((proposal) => (
                <article key={proposal.id}>
                  <div>
                    <span>{proposal.type} / {proposal.sensitivity}</span>
                    <strong>{proposal.source || "Propuesta del agente Vendedor"}</strong>
                    <p>{proposal.title || "Sin detalle registrado."}</p>
                  </div>
                  {selectedRole === "sergio" ? (
                    <div className="onia-review-actions">
                      <button
                        type="button"
                        disabled={approvingReviewId === proposal.id}
                        onClick={() => submitReviewDecision(proposal.id, "aprobado")}
                      >
                        Aprobar
                      </button>
                      <button
                        type="button"
                        disabled={approvingReviewId === proposal.id}
                        onClick={() => submitReviewDecision(proposal.id, "rechazado")}
                      >
                        Rechazar
                      </button>
                    </div>
                  ) : (
                    <small>Solo Sergio aprueba o rechaza.</small>
                  )}
                </article>
              ))
            ) : (
              <article>
                <div>
                  <span>Cola vacia</span>
                  <strong>Sin propuestas pendientes.</strong>
                  <p>Cuando el agente Vendedor proponga un mensaje, una propuesta o una proxima accion, aparecera aca para tu aprobacion.</p>
                </div>
              </article>
            )}
          </div>

          <div className="onia-agent-month-plan">
            <div className="onia-live-title">
              <ClipboardCheck size={16} />
              <strong>Tareas que los agentes deben empujar este mes</strong>
            </div>
            {agentSummary.visiblePlans.map((plan) => (
              <article key={plan.id}>
                <div>
                  <span>{plan.monthLabel} / {plan.dueWindow}</span>
                  <strong>{plan.title}</strong>
                  <p>{plan.expectedEvidence}</p>
                  {plan.blockedUntil ? <small>Bloqueado hasta: {plan.blockedUntil}</small> : null}
                </div>
                <TonePill tone={plan.status === "done" ? "green" : plan.status === "blocked" ? "red" : plan.status === "waiting_connection" ? "yellow" : "blue"}>
                  {plan.status.replaceAll("_", " ")}
                </TonePill>
              </article>
            ))}
          </div>

          <div className="onia-calendar-sync-grid">
            {visibleCalendarConnectorPlans.map((plan) => (
              <article key={plan.id}>
                <div>
                  <span>{plan.provider} / {plan.direction}</span>
                  <strong>{plan.name}</strong>
                  <p>{plan.writePolicy}</p>
                </div>
                <div>
                  <strong>Eventos</strong>
                  <small>{plan.eventTypes.join(", ")}</small>
                </div>
                <div>
                  <strong>Protege</strong>
                  <small>{plan.protectedBlocks.join(", ")}</small>
                </div>
                <small>{plan.nextAction}</small>
              </article>
            ))}
          </div>

          <div className="onia-rule-strip">
            <ShieldCheck size={17} />
            <strong>Regla de agentes:</strong>
            <span>
              Proponen tareas y agenda; no contactan clientes, no publican, no aprueban pagos y no mueven reuniones fuera de ventana sin aprobacion Sergio.
            </span>
          </div>
        </section>

        <section className="onia-panel onia-repo-strategy" id="repo-strategy" aria-label="Arquitectura operativa ONIA" hidden={activeView !== "archivo"}>
          <SectionHeader
            eyebrow="Archivo / arquitectura"
            title="onia-center ejecuta; Hermes piensa; collab aporta"
            description="Referencia de arquitectura y limites entre privado, operativo y colaborativo. No hace falta verla en produccion diaria."
            icon={BarChart3}
          />
          <div className="onia-repo-grid">
            <article>
              <span>Cerebro privado</span>
              <strong>{repoStrategy.privateBrain}</strong>
              <p>Memoria, estrategia, decisiones sensibles, precios internos y reglas privadas.</p>
            </article>
            <article>
              <span>Sistema operativo</span>
              <strong>{repoStrategy.operatingApp}</strong>
              <p>CRM, proyectos, tareas, vendedores, colaboradores, Bolivian, StockCam, evidencias y auditoria.</p>
            </article>
            <article>
              <span>Trabajo colaborativo</span>
              <strong>{repoStrategy.collabWorkspace}</strong>
              <p>Arthur sube aportes saneados; ONIA Center los revisa antes de importar.</p>
            </article>
          </div>
          <div className="onia-operating-metrics">
            <MetricCard
              label="Proyectos activos"
              value={String(operatingSummary.activeProjects)}
              detail={`${visibleProjects.length} visibles para el rol actual.`}
              icon={BriefcaseBusiness}
              tone="green"
            />
            <MetricCard
              label="Tareas abiertas"
              value={String(operatingSummary.openTasks)}
              detail={`${visibleTasks.length} asignadas o visibles para este rol.`}
              icon={ClipboardCheck}
              tone="blue"
            />
            <MetricCard
              label="Pendientes revision"
              value={String(operatingSummary.pendingReviews)}
              detail={`${visibleReviews.length} visibles para este rol.`}
              icon={FileCheck2}
              tone={operatingSummary.pendingReviews > 0 ? "yellow" : "green"}
            />
            <MetricCard
              label="Alertas operativas"
              value={String(operatingSummary.alerts)}
              detail="Suma revisiones, bloqueos y adaptadores en riesgo."
              icon={AlertTriangle}
              tone={operatingSummary.alerts > 0 ? "red" : "green"}
            />
          </div>
          <div className="onia-rule-strip">
            <ShieldCheck size={17} />
            <strong>Regla de repos:</strong>
            <span>{repoStrategy.rule}</span>
          </div>
        </section>

        <section className="onia-two-column" hidden={!["proyectos", "tareas"].includes(activeView)}>
          <article className="onia-panel" id="proyectos" hidden={activeView !== "proyectos"}>
            <SectionHeader
              eyebrow="Proyectos ONIA"
              title="Portafolio operativo filtrado por rol"
              description="ONIA Center maneja los proyectos; la logica vertical profunda queda en su sistema correspondiente."
              icon={BriefcaseBusiness}
            />
            <div className="onia-project-list">
              {visibleProjects.map((project) => (
                <article key={project.id}>
                  <div>
                    <span>{project.productLine}</span>
                    <strong>{project.name}</strong>
                    <p>{project.description}</p>
                  </div>
                  <TonePill tone={project.status === "active" ? "green" : project.status === "blocked" ? "red" : "blue"}>
                    {project.status}
                  </TonePill>
                  <small>{project.nextStep}</small>
                </article>
              ))}
            </div>
          </article>

          <article className="onia-panel" id="tareas" hidden={activeView !== "tareas"}>
            <SectionHeader
              eyebrow="Tareas y revision"
              title="Operacion diaria con evidencia"
              description="Arthur solo aparece como colaborador con tareas, aportes, briefs y entregables revisables."
              icon={ClipboardCheck}
            />
            <div className="onia-task-list">
              {visibleTasks.length ? (
                visibleTasks.map((task) => (
                  <article key={task.id}>
                    <div>
                      <span>{projectNameById.get(task.projectId) ?? "Proyecto privado"}</span>
                      <strong>{task.title}</strong>
                      <p>
                        {task.source} / {task.evidenceRequired ? "requiere evidencia" : "sin evidencia requerida"}
                      </p>
                    </div>
                    <TonePill tone={getTaskStatusTone(task.status)}>{task.status}</TonePill>
                  </article>
                ))
              ) : (
                <article className="is-empty">
                  <div>
                    <span>Vista filtrada</span>
                    <strong>No hay tareas visibles para este rol</strong>
                    <p>Las tareas sensibles o no asignadas quedan ocultas.</p>
                  </div>
                  <TonePill tone="blue">privacidad</TonePill>
                </article>
              )}
            </div>
            <div className="onia-review-strip">
              {visibleReviews.map((review) => (
                <article key={review.id}>
                  <span>{review.priority}</span>
                  <strong>{review.title}</strong>
                  <small>{review.status}</small>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="onia-two-column" hidden={!["collab", "bolivian"].includes(activeView)}>
          <article className="onia-panel" id="collab" hidden={activeView !== "collab"}>
            <SectionHeader
              eyebrow="Ingestion desde onia-hermes-collab"
              title="Bandeja de aportes revisables"
              description="El repo colaborativo es entrada saneada, no fuente privada ni sistema operativo."
              icon={Database}
            />
            <div className="onia-collab-summary">
              <div>
                <span>En cola</span>
                <strong>{visibleCollabSummary.queued}</strong>
              </div>
              <div>
                <span>Sensibles</span>
                <strong>{visibleCollabSummary.sensitive}</strong>
              </div>
              <div>
                <span>Importables</span>
                <strong>{visibleCollabSummary.importable}</strong>
              </div>
              <div>
                <span>Rechazados</span>
                <strong>{visibleCollabSummary.rejected}</strong>
              </div>
            </div>
            <div className="onia-collab-list">
              {visibleCollabItems.length ? (
                visibleCollabItems.map((item) => (
                <article key={item.id}>
                  <div>
                    <span>{item.classification}</span>
                    <strong>{item.sourcePath}</strong>
                    <p>{item.summary}</p>
                  </div>
                  <TonePill tone={item.sensitivity === "sensitive" ? "red" : item.sensitivity === "internal" ? "yellow" : "green"}>
                    {item.sensitivity}
                  </TonePill>
                </article>
                ))
              ) : (
                <article>
                  <div>
                    <span>sin acceso</span>
                    <strong>No hay aportes visibles para este rango</strong>
                    <p>Freelancers y vendedores no ven la cola colaborativa salvo elementos publicos o asignados.</p>
                  </div>
                  <TonePill tone="blue">filtrado</TonePill>
                </article>
              )}
            </div>
            <div className="onia-rule-strip">
              <ShieldCheck size={17} />
              <strong>Regla:</strong>
              <span>{collabSummary.rule}</span>
            </div>
          </article>

          <article className="onia-panel" id="bolivian" hidden={activeView !== "bolivian"}>
            <SectionHeader
              eyebrow="Bolivian Electric"
              title="Modulo propio sobre base reusable"
              description="Bolivian se personaliza por configuracion; TR4 no entra al core."
              icon={Building2}
            />
            {selectedRole === "sergio" ? (
              <div className="onia-module-list">
                {bolivianSummary.modules.map((module) => (
                  <article key={module.id}>
                    <div>
                      <span>{module.moduleType}</span>
                      <strong>{module.name}</strong>
                      <p>{module.note}</p>
                    </div>
                    <TonePill tone={module.status === "blocked" ? "red" : module.status === "ready" ? "green" : "blue"}>
                      {module.status}
                    </TonePill>
                  </article>
                ))}
              </div>
            ) : selectedRole === "arthur" ? (
              <div className="onia-module-list">
                {visibleTasks.filter((task) => task.projectId === "project-bolivian-os").length ? (
                  visibleTasks
                    .filter((task) => task.projectId === "project-bolivian-os")
                    .map((task) => (
                      <article key={task.id}>
                        <div>
                          <span>{task.type} / {task.priority}</span>
                          <strong>{task.title}</strong>
                          <p>{task.dueLabel ?? "Tarea Bolivian asignada; sin TR4 ni datos sensibles."}</p>
                        </div>
                        <TonePill tone={getTaskStatusTone(task.status)}>{task.status}</TonePill>
                      </article>
                    ))
                ) : (
                  <article>
                    <div>
                      <span>Arthur / propio</span>
                      <strong>Sin tareas Bolivian visibles</strong>
                      <p>Arthur solo ve Bolivian cuando tiene tarea asignada, brief saneado o entregable revisable.</p>
                    </div>
                    <TonePill tone="blue">filtrado</TonePill>
                  </article>
                )}
              </div>
            ) : (
              <PrivateCapitalPanel visible={false} />
            )}
            <div className="onia-blocker">
              <AlertTriangle size={15} />
              <span>{bolivianSummary.tr4Rule}</span>
            </div>
          </article>
        </section>

        <section className="onia-two-column" hidden={activeView !== "seguridad"}>
          <article className="onia-panel" id="seguridad">
            <SectionHeader
              eyebrow="Seguridad y privacidad"
              title="Separacion entre privado, operativo y colaborativo"
              description="El rol actual determina alcance visible. La seguridad real queda pendiente de Supabase Auth/RLS."
              icon={ShieldCheck}
            />
            <div className="onia-security-grid">
              <article>
                <span>Rol actual</span>
                <strong>{role.title}</strong>
                <p>Scope: {membershipSummary.scopeLabel}. Membresias registradas: {membershipSummary.memberships.length}.</p>
              </article>
              <article>
                <span>Organizaciones</span>
                <strong>{operatingOrganizations.length}</strong>
                <p>ONIA privado, collab saneado y Bolivian como workspace de cliente.</p>
              </article>
              <article>
                <span>Colaboradores</span>
                <strong>{collaborators.length}</strong>
                <p>Arthur queda como colaborador, no socio ni aprobador financiero.</p>
              </article>
              <article>
                <span>Auditoria seed</span>
                <strong>{auditLogSeed.length}</strong>
                <p>Primeras acciones canonicas registradas sin secretos.</p>
              </article>
            </div>
          </article>

          <article className="onia-panel">
            <SectionHeader
              eyebrow="Adaptadores externos"
              title="TR4, Notion, n8n, WhatsApp, Cal y StockCam"
              description="Los sistemas externos se conectan como adaptadores, no como parte del core."
              icon={Workflow}
            />
            <div className="onia-collab-summary">
              <div>
                <span>Total</span>
                <strong>{adapterSummary.total}</strong>
              </div>
              <div>
                <span>Auditoria</span>
                <strong>{adapterSummary.auditRequired}</strong>
              </div>
              <div>
                <span>Bloqueados</span>
                <strong>{adapterSummary.blocked}</strong>
              </div>
              <div>
                <span>Escritura</span>
                <strong>{adapterSummary.writable}</strong>
              </div>
            </div>
            <div className="onia-adapter-list">
              {externalAdapters.map((adapter) => (
                <article key={adapter.id}>
                  <div>
                    <span>{adapter.systemType}</span>
                    <strong>{adapter.name}</strong>
                    <p>{adapter.rule}</p>
                  </div>
                  <TonePill tone={adapter.status === "blocked" || adapter.status === "audit_required" ? "red" : "blue"}>
                    {adapter.status}
                  </TonePill>
                </article>
              ))}
            </div>
            <div className="onia-rule-strip">
              <Boxes size={17} />
              <strong>StockCam:</strong>
              <span>{inventoryItems.length} item demo; el MVP real sera foto, codigo, cantidad, ubicacion y exportacion.</span>
            </div>
          </article>
        </section>

        <section className="onia-panel onia-integration-readiness" id="integraciones" hidden={activeView !== "integraciones"}>
          <SectionHeader
            eyebrow="Preparado para conectar"
            title="Integraciones y funciones pendientes"
            description="La logica queda lista en ONIA Center, pero cada conector declara que falta antes de activarse. No se guardan secretos en pantalla ni en base visible."
            icon={Workflow}
          />
          <div className="onia-collab-summary">
            <div>
              <span>Conectores</span>
              <strong>{integrationSummary.total}</strong>
            </div>
            <div>
              <span>Config pendiente</span>
              <strong>{integrationSummary.configPending}</strong>
            </div>
            <div>
              <span>Planeados</span>
              <strong>{integrationSummary.planned}</strong>
            </div>
            <div>
              <span>Funciones listas</span>
              <strong>{featureSummary.readyToUse}</strong>
            </div>
          </div>

          <div className="onia-readiness-grid">
            {visibleIntegrationConnectors.map((connector) => (
              <article key={connector.id}>
                <div className="onia-readiness-card-head">
                  <div>
                    <span>{connector.category} / {connector.provider}</span>
                    <strong>{connector.name}</strong>
                  </div>
                  <TonePill tone={getIntegrationTone(connector.status)}>{connector.status.replaceAll("_", " ")}</TonePill>
                </div>
                <p>{connector.currentState}</p>
                <div className="onia-readiness-meta">
                  <span>{connector.selfHosted ? "self-hosted" : "externo"}</span>
                  <span>{connector.priority}</span>
                  <span>{connector.requiredEnv.length} env</span>
                </div>
                <div className="onia-readiness-columns">
                  <div>
                    <strong>Preparado</strong>
                    <ul>
                      {connector.prepared.slice(0, 3).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Falta</strong>
                    <ul>
                      {connector.missing.slice(0, 3).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <small>{connector.nextAction}</small>
              </article>
            ))}
          </div>

          <div className="onia-feature-readiness">
            {visibleFeatureReadinessItems.map((feature) => (
              <article key={feature.id}>
                <div>
                  <span>{feature.module}</span>
                  <strong>{feature.title}</strong>
                  <p>{feature.nextAction}</p>
                  <small>{feature.evidenceRule}</small>
                </div>
                <TonePill tone={getFeatureTone(feature.status)}>{feature.status.replaceAll("_", " ")}</TonePill>
              </article>
            ))}
          </div>

          <div className="onia-rule-strip">
            <ShieldCheck size={17} />
            <strong>Regla de conexion:</strong>
            <span>
              Primero Supabase real y Auth/RLS. Despues Cal/n8n. Luego IA local/LiteLLM. Remotion, Web Factory automatico y WhatsApp se activan por fases.
            </span>
          </div>
        </section>

        <section className="onia-panel onia-system-base" aria-label="Base operativa Fase 1" hidden={activeView !== "archivo"}>
          <SectionHeader
            eyebrow="Archivo / sistema"
            title="Fuentes, modelo y reglas de soporte"
            description="Esto queda fuera del inicio porque no se usa cada hora. Sirve para auditoria, debug, validacion y preservacion de conocimiento."
            icon={Archive}
          />
          <section className="onia-source-strip" aria-label="Fuentes canonicas">
            {sourceDocuments.map((source) => (
              <code key={source}>{source}</code>
            ))}
          </section>
          <div className="onia-seed-summary">
            <article>
              <span>Seed fuente</span>
              <strong>{oniaCenterSeedSource.sourcePath}</strong>
              <small>{oniaCenterSeedSource.principle}</small>
            </article>
            <article>
              <span>Leads reales cargados</span>
              <strong>{leadSeed.length}</strong>
              <small>No se inventan prospectos.</small>
            </article>
            <article>
              <span>Ingresos reales cargados</span>
              <strong>{incomeSeed.length}</strong>
              <small>Ventas netas salen de registros reales.</small>
            </article>
            <article>
              <span>Gastos reales cargados</span>
              <strong>{expenseSeed.length}</strong>
              <small>Todo gasto futuro exige centro contable.</small>
            </article>
          </div>
          <div className="onia-model-table">
            {dataModelTables.map((table) => (
              <article key={table.name}>
                <span>{table.name}</span>
                <strong>{table.purpose}</strong>
                <small>
                  SQL {table.implementedInSql ? "OK" : "pendiente"} / App {table.implementedInApp ? "OK" : "pendiente"}
                </small>
              </article>
            ))}
          </div>
        </section>

        <section className="onia-role-banner" hidden={activeView !== "roles"}>
          <div>
            <span>Rol actual</span>
            <strong>{role.title}</strong>
            <p>{role.description}</p>
          </div>
          <TonePill tone={privateVisible ? "green" : "blue"}>{privateVisible ? "acceso completo" : "vista filtrada"}</TonePill>
        </section>

        <section className="onia-panel" aria-label="Reglas de negocio implementadas" hidden={activeView !== "archivo"}>
          <SectionHeader
            eyebrow="Archivo / reglas"
            title="Bloqueos ejecutables"
            description="Estas reglas son calculadas por el motor, no solo texto en pantalla."
            icon={ShieldCheck}
          />
          <div className="onia-rule-audit">
            {businessRuleAudit.map((rule) => (
              <article className={`is-${rule.severity}`} key={rule.id}>
                {rule.passed ? <CheckCircle2 size={15} /> : <Ban size={15} />}
                <div>
                  <strong>{rule.label}</strong>
                  <p>{rule.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="onia-metrics" id="ceo" aria-label="Dashboard CEO Sergio" hidden={activeView !== "ceo"}>
          <MetricCard
            label="Ventas netas del mes"
            value={formatBs(centerSnapshot.monthlyNetSalesBs)}
            detail="Registradas en ONIA Center. No se inventan ingresos."
            icon={Banknote}
            tone={salesTone}
          />
          <MetricCard
            label="Fondo ONIA acumulado"
            value={formatBs(centerSnapshot.oniaFundAccumulatedBs)}
            detail="40% de ventas netas registradas."
            icon={PiggyBank}
            tone={salesTone}
          />
          <MetricCard
            label="Faltante para cubrir"
            value={formatBs(centerSnapshot.missingForMonthlyNeedBs)}
            detail={`Necesidad conservadora ${formatBs(sustainabilityTargets.conservativeMonthlyNeedBs)}.`}
            icon={AlertTriangle}
            tone={centerSnapshot.missingForMonthlyNeedBs > 0 ? "red" : "green"}
          />
          <MetricCard
            label="Meta venta neta mensual"
            value={formatBs(sustainabilityTargets.requiredMonthlyNetSalesBs)}
            detail={`Meta semanal ${formatBs(sustainabilityTargets.weeklyTargetLowBs, { compact: true })}-${formatBs(
              sustainabilityTargets.weeklyTargetHighBs,
              { compact: true },
            )}.`}
            icon={Target}
            tone="blue"
          />
          <MetricCard
            label="Capital Sergio/ONIA"
            value={formatBs(privateCapital.grossCapitalBs)}
            detail="Privado; capital de supervivencia y crecimiento controlado."
            icon={Crown}
            tone="neutral"
            privateBlocked={!privateVisible}
          />
          <MetricCard
            label="Deuda exacta"
            value={formatBs(privateCapital.exactDebtBs)}
            detail="Privado; no visible para Arthur ni vendedores."
            icon={ReceiptText}
            tone="yellow"
            privateBlocked={!privateVisible}
          />
          <MetricCard
            label="Runway"
            value={`${centerSnapshot.runwayMonths.toFixed(2)} meses`}
            detail={`Caja despues de deuda / ${formatBs(sustainabilityTargets.conservativeMonthlyNeedBs)}.`}
            icon={Gauge}
            tone={centerSnapshot.runwayStatus}
            privateBlocked={!privateVisible}
          />
          <MetricCard
            label="Recuperacion capital"
            value={formatBs(0)}
            detail={`Registrado recuperado hoy; capital base ${formatBs(privateCapital.grossCapitalBs)}.`}
            icon={Calculator}
            tone="neutral"
            privateBlocked={!privateVisible}
          />
        </section>

        <section className="onia-status-grid" hidden={activeView !== "ceo"}>
          <article className={`onia-status-card is-${salesTone}`}>
            <div>
              <span>Semaforo motor de ventas</span>
              <strong>{salesTone === "green" ? "Verde" : salesTone === "yellow" ? "Amarillo" : "Rojo"}</strong>
              <p>
                El 40% del Fondo ONIA no cubre la existencia mensual hasta registrar al menos{" "}
                {formatBs(sustainabilityTargets.requiredMonthlyNetSalesBs)} netos.
              </p>
            </div>
            <ProgressBar value={centerSnapshot.fundProgressPercent} tone={salesTone} />
          </article>

          <article className={`onia-status-card is-${privateVisible ? centerSnapshot.runwayStatus : "blue"}`}>
            <div>
              <span>Semaforo caja/runway</span>
              <strong>{privateVisible ? (centerSnapshot.runwayStatus === "green" ? "Verde" : "Amarillo") : "Oculto"}</strong>
              <p>
                {privateVisible
                  ? "Caja privada despues de deuda cubre mas de 2 meses, pero el motor comercial sigue rojo por ventas registradas."
                  : "Esta informacion incluye capital y caja real; solo Sergio puede verla."}
              </p>
            </div>
            <ProgressBar value={privateVisible ? centerSnapshot.runwayMonths * 50 : 0} tone={privateVisible ? centerSnapshot.runwayStatus : "blue"} />
          </article>
        </section>

        <section className="onia-two-column" hidden={!["servicios", "roles"].includes(activeView)}>
          <article className="onia-panel" id="servicios" hidden={activeView !== "servicios"}>
            <SectionHeader
              eyebrow="Catalogo Operativo de Servicios"
              title="El sistema empuja ONIA Motor Local Growth"
              description={`${blockedServices} servicio(s) quedan bloqueados hasta completar campos obligatorios.`}
              icon={Layers3}
            />
            <div className="onia-growth-card">
              <div>
                <span>Servicio prioritario</span>
                <strong>ONIA Motor Local Growth</strong>
                <p>
                  Setup {formatBs(2900, { compact: true })}, mensualidad {formatBs(1900, { compact: true })}. Meta:{" "}
                  {growthTarget.activeClients} clientes activos = {formatBs(growthTarget.monthlyRevenueBs, { compact: true })}/mes y{" "}
                  {formatBs(growthTarget.fundBs, { compact: true })} al Fondo ONIA.
                </p>
              </div>
              <TonePill tone={growthTarget.coversMonthlyNeed ? "green" : "yellow"}>caballito principal</TonePill>
            </div>
            <div className="onia-service-grid">
              {operationalServices.map((service) => (
                <ServiceCard service={service} key={service.id} />
              ))}
            </div>
          </article>

          <article className="onia-panel" id="roles" hidden={activeView !== "roles"}>
            <SectionHeader
              eyebrow="Roles y permisos"
              title="Arthur coordina, Sergio aprueba"
              description="Arthur esta arriba de vendedor normal, pero no es socio ni aprueba dinero."
              icon={UsersRound}
            />
            <div className="onia-role-grid">
              {roleDefinitions.map((item) => (
                <article className={`onia-role-card ${item.id === selectedRole ? "is-active" : ""}`} key={item.id}>
                  <span>Nivel {item.level} / {item.accessRank.replaceAll("_", " ")}</span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                  <small>{item.scopeLabel}</small>
                </article>
              ))}
            </div>

            <div className="onia-role-scope-panel">
              <article>
                <span>Alcance actual</span>
                <strong>{role.scopeLabel}</strong>
                <p>
                  {role.privateAccess
                    ? "Acceso completo de direccion. Puede simular otros rangos para revisar seguridad antes de crear usuarios."
                    : "Acceso filtrado. El sistema debe mostrar solo registros propios, asignados o seguros para ese rol."}
                </p>
              </article>
              <article>
                <span>Datos visibles</span>
                <ul>
                  {role.dataAccess.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <span>Modulos habilitados</span>
                <strong>{role.visibleModules.length}</strong>
                <p>{role.visibleModules.map((moduleId) => moduleCopy[moduleId]?.title ?? moduleId).join(", ")}</p>
              </article>
            </div>

            <div className="onia-permission-box">
              <div>
                <CheckCircle2 size={17} />
                <strong>Puede</strong>
                <ul>
                  {role.can.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Ban size={17} />
                <strong>No puede</strong>
                <ul>
                  {role.cannot.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </section>

        <section className="onia-panel" id="arthur" hidden={activeView !== "arthur"}>
          <SectionHeader
            eyebrow="Operacion Arthur 60 dias"
            title="Scorecard semanal con evidencia"
            description="Semana aprobada: minimo 80%, sin fallar CRM/ONIA Center, seguimientos ni reporte semanal."
            icon={UserCheck}
          />
          <div className="onia-scorecard-grid">
            {arthurScorecard.map((item) => (
              <article key={item.id}>
                <span>{item.area}</span>
                <strong>{item.minimum}</strong>
                <small>{item.required ? "obligatorio" : "operativo"}</small>
              </article>
            ))}
          </div>
          <div className="onia-rule-strip">
            <ShieldCheck size={17} />
            <strong>Regla dura:</strong>
            <span>Si no esta en ONIA Center o Notion, no cuenta.</span>
          </div>
        </section>

        <section className="onia-two-column" hidden={activeView !== "finanzas"}>
          <article className="onia-panel" id="finanzas">
            <SectionHeader
              eyebrow="Finanzas y centros contables"
              title="Caja por centro y reglas de fondo"
              description="Los saldos actuales no se inventan; lo no cargado aparece en Bs. 0 registrado."
              icon={WalletCards}
            />
            <div className="onia-center-table">
              {centerBalances.map((balance) => {
                const hidden = balance.privateOnly && !privateVisible;
                return (
                  <article className={hidden ? "is-hidden" : ""} key={balance.center}>
                    <span>{balance.center}</span>
                    <strong>{hidden ? "Oculto" : formatBs(balance.amountBs)}</strong>
                    <small>{hidden ? "Solo Sergio." : balance.detail}</small>
                  </article>
                );
              })}
            </div>

            <div className="onia-accounting-grid">
              {visibleCenters.map((center) => (
                <article key={center.id}>
                  <TonePill tone={center.tone}>{center.name}</TonePill>
                  <strong>{center.owner}</strong>
                  <p>{center.rule}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="onia-panel">
            <SectionHeader
              eyebrow="Modulo privado"
              title="Capital interno Sergio"
              description="Esta seccion se filtra automaticamente por rol."
              icon={LockKeyhole}
            />
            <PrivateCapitalPanel visible={privateVisible} />
          </article>
        </section>

        <section className="onia-two-column" hidden={!["nuvia", "pagos"].includes(activeView)}>
          <article className="onia-panel" id="nuvia" hidden={activeView !== "nuvia"}>
            <SectionHeader
              eyebrow="Nuvia"
              title="Lotes con costo completo"
              description="Primero se recupera capital y costos. Despues 20% Fondo ONIA, caja chica, 20% Reserva Nuvia bootstrap y solo luego utilidad por capital real."
              icon={Boxes}
            />
            <div className="onia-nuvia-ledger">
              <div><span>Ventas cobradas</span><strong>{formatBs(nuviaExample.salesCollectedBs)}</strong></div>
              <div><span>Capital producto Sergio</span><strong>-{formatBs(nuviaExample.productCapitalRecoveryBs)}</strong></div>
              <div><span>Empaque/logistica</span><strong>-{formatBs(nuviaExample.packagingLogisticsBs)}</strong></div>
              <div><span>Ganancia bruta real</span><strong>{formatBs(nuvia.realGrossProfitBs)}</strong></div>
              <div><span>Margen bruto</span><strong>{formatPercent(nuvia.grossMarginPercent)}</strong></div>
              <div><span>Fondo ONIA 20%</span><strong>-{formatBs(nuvia.oniaFundBs)}</strong></div>
              <div><span>Caja chica Nuvia</span><strong>-{formatBs(nuvia.nuviaPettyCashBs)}</strong></div>
              <div><span>Reserva Nuvia {formatPercent(nuvia.nuviaReservePercent)}</span><strong>-{formatBs(nuvia.nuviaReserveBs)}</strong></div>
              <div><span>Pago operativo Arthur</span><strong>-{formatBs(nuvia.arthurOperatingPaymentBs)}</strong></div>
              <div><span>Utilidad distribuible</span><strong>{formatBs(nuvia.distributableUtilityBs)}</strong></div>
              <div><span>Ganancia por capital real</span><strong>{formatBs(nuvia.investorUtilityBs)}</strong></div>
            </div>
            <div className={`onia-blocker ${nuvia.canApproveDistribution ? "is-ok" : ""}`}>
              {nuvia.canApproveDistribution ? <BadgeCheck size={15} /> : <Ban size={15} />}
              <span>
                {nuvia.canApproveDistribution
                  ? "Distribucion calculable: margen bruto minimo 40%, evidencia y aprobacion Sergio presentes."
                  : "Bloqueado: falta margen, evidencia o aprobacion Sergio."}
              </span>
            </div>
          </article>

          <article className="onia-panel" id="pagos" hidden={activeView !== "pagos"}>
            <SectionHeader
              eyebrow="Pagos y comisiones"
              title="Motor bloquea pagos sin evidencia"
              description="La vendedora cobra solo sobre el primer cobro neto real y comprobado. Sergio aprueba el pago final."
              icon={HandCoins}
            />
            <div className="onia-commission-policy">
              <article>
                <span>Regla base vendedora</span>
                <strong>Primer cobro neto</strong>
                <p>No hay comision recurrente por mensualidades futuras, renovaciones o mantenimiento posterior salvo acuerdo escrito.</p>
              </article>
              <article>
                <span>Bloqueos</span>
                <strong>Datos + comprobante</strong>
                <p>Sin lead completo, servicio vendido, monto neto, comprobante y aprobacion de Sergio, queda pendiente.</p>
              </article>
              <article>
                <span>Visibilidad actual</span>
                <strong>{selectedRole === "seller" ? "Solo sus reglas y pagos" : "Vista de direccion"}</strong>
                <p>{selectedRole === "seller" ? "No ve caja privada, capital, deuda ni comisiones de otros." : "Sergio/area pueden auditar reglas y ejemplos."}</p>
              </article>
            </div>
            <div className="onia-commission-table" aria-label="Reglas de comision vendedora">
              <div className="onia-commission-table__head">
                <span>Servicio</span>
                <span>Precio</span>
                <span>Comision</span>
                <span>Cuando ofrecerlo</span>
              </div>
              {visibleVendorCommissionRules.map((rule) => (
                <article key={rule.id}>
                  <div>
                    <strong>{rule.serviceName}</strong>
                    <small>{rule.firstPaymentOnly ? "Solo primer cobro" : "Segun acuerdo"}</small>
                  </div>
                  <span>{rule.clientPriceLabel}</span>
                  <span>{rule.commissionLabel}</span>
                  <p>{rule.offerWhen}</p>
                </article>
              ))}
            </div>
            <div className="onia-payment-list">
              {payments.map(({ input, result }, index) => (
                <article className={`is-${result.status}`} key={`${input.role}-${index}`}>
                  <div>
                    <span>{input.role === "seller" ? result.sellerRule?.serviceName ?? "Vendedor normal" : "Arthur"}</span>
                    <strong>{formatBs(result.payableBeforeApprovalBs)}</strong>
                    <small>
                      {input.role === "seller"
                        ? `Primer cobro ${formatBs(result.firstPaymentNetCollectedBs)} x ${formatPercent(result.setupRate)}`
                        : `Setup ${formatPercent(result.setupRate)} / primer mes ${formatPercent(result.firstMonthRate)}`}
                    </small>
                  </div>
                  <TonePill tone={result.approved ? "green" : result.status === "pendiente_sergio" ? "yellow" : "red"}>
                    {result.status.replaceAll("_", " ")}
                  </TonePill>
                  <p>
                    Adelanto quincenal: {formatBs(result.biweeklyAdvanceBs)}. Cierre mensual: {formatBs(result.monthlyCloseBs)}.
                  </p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="onia-two-column" hidden={!["evidencias", "premium"].includes(activeView)}>
          <article className="onia-panel" id="evidencias" hidden={activeView !== "evidencias"}>
            <SectionHeader
              eyebrow="Evidencias"
              title="Lo que bloquea pagos y semanas"
              description="Cada gate define prueba, responsable y que queda bloqueado."
              icon={ClipboardCheck}
            />
            <div className="onia-evidence-grid">
              {evidenceGates.map((gate) => (
                <article key={gate.id}>
                  <span>{gate.title}</span>
                  <strong>{gate.requiredProof}</strong>
                  <p>{gate.blocks}</p>
                  <small>{gate.owner}</small>
                </article>
              ))}
            </div>
          </article>

          <article className="onia-panel" id="premium" hidden={activeView !== "premium"}>
            <SectionHeader
              eyebrow="Herramientas premium"
              title="Higgsfield, IA y pauta por centro"
              description="Arthur no puede pedir generaciones premium sin brief aprobado."
              icon={Zap}
            />
            <div className="onia-premium-list">
              {visiblePremium.map((policy) => (
                <article key={policy.id}>
                  <Percent size={16} />
                  <div>
                    <strong>{policy.center}</strong>
                    <span>{policy.allocation}</span>
                    <p>{policy.rule}</p>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>

        <footer className="onia-footer">
          <span>
            <BarChart3 size={16} />
            JSON vendor panel parseado en validacion local.
          </span>
          <span>
            <ShieldCheck size={16} />
            Nada publicado ni enviado a clientes.
          </span>
        </footer>
      </section>
    </main>
  );
}
