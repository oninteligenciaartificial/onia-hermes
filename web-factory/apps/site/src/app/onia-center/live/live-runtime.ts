// Lectura de las superficies "vivas" que escriben los runtimes de agentes (carril infra)
// en Supabase `onia_center`. Contrato: hermes-content/docs/ONIA_FINANCE_SUMMARY_CONTRACT.md
// (infra ESCRIBE, el panel LEE). Este modulo vive en el arbol del panel nuevo y NO toca el
// store compartido (`lib/onia-center-store.ts`) para no afectar el monolito en produccion.
// Replica el minimo patron PostgREST del store (mismos env vars, header Accept-Profile).
import type { OperatingAgent, OperatingAgentStatus } from "@/app/onia-center/types";

type LiveConfig = {
  url: string;
  serviceRoleKey: string;
  schema: string;
};

function getLiveConfig(): LiveConfig | null {
  const url =
    process.env.ONIA_CENTER_SUPABASE_URL ||
    process.env.WEB_FACTORY_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";
  const serviceRoleKey =
    process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.WEB_FACTORY_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "";
  const schema = process.env.ONIA_CENTER_SUPABASE_SCHEMA || "onia_center";

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url: url.replace(/\/$/, ""), serviceRoleKey, schema };
}

async function liveRequest<T>(path: string): Promise<T | null> {
  const config = getLiveConfig();
  if (!config) {
    return null;
  }

  try {
    const response = await fetch(`${config.url}/rest/v1/${path}`, {
      headers: {
        apikey: config.serviceRoleKey,
        authorization: `Bearer ${config.serviceRoleKey}`,
        "accept-profile": config.schema,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function toNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

// ---------------------------------------------------------------------------
// 1. Resumen financiero — onia_center.finance_summary (fila mas reciente).
// ---------------------------------------------------------------------------

export interface FinanceAnomaly {
  kind: string;
  detail: string;
  amountBs: number;
}

export interface TaxPosture {
  period: string;
  regime: string;
  siatEmitting: boolean;
  ivaAPagarBs: number;
  ivaSaldoFavorBs: number;
  itBs: number;
  iueEstimadoBs: number;
  creditoFiscalPerdidoBs: number;
  iueBeRetencionesBs: number;
  proximoVencimiento: string;
  diasParaVencimiento: number | null;
  notes: string;
}

// Ganancia por persona del equipo. La escribe el agente Finanzas (carril infra)
// dentro de finance_summary.raw.earnings; el panel solo LEE. Permite mostrar
// "cuanto lleva ganado / pendiente cada colaborador" con datos reales.
export interface PersonEarnings {
  personKey: string;
  displayName: string;
  role: string;
  earnedBs: number;
  pendingBs: number;
  salesCount: number;
}

export interface FinanceSummary {
  summaryKey: string;
  periodLabel: string;
  generatedAt: string;
  cashTotalBs: number;
  cashPeriodBs: number;
  incomeCount: number;
  commissionsPendingBs: number;
  commissionsBlockedBs: number;
  fundTotalBs: number;
  expensesPendingBs: number;
  premiumPendingBs: number;
  anomalyCount: number;
  anomalies: FinanceAnomaly[];
  earnings: PersonEarnings[];
  summaryText: string;
  taxPosture: TaxPosture | null;
}

type DbFinanceRow = {
  summary_key?: string;
  period_label?: string;
  generated_at?: string;
  cash_total_bs?: unknown;
  cash_period_bs?: unknown;
  income_count?: unknown;
  commissions_pending_bs?: unknown;
  commissions_blocked_bs?: unknown;
  fund_total_bs?: unknown;
  expenses_pending_bs?: unknown;
  premium_pending_bs?: unknown;
  anomaly_count?: unknown;
  anomalies?: unknown;
  raw?: unknown;
  summary_text?: string;
  tax_posture?: unknown;
};

function mapTaxPosture(value: unknown): TaxPosture | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const record = value as Record<string, unknown>;
  if (Object.keys(record).length === 0) {
    return null;
  }
  const dias = record.dias_para_vencimiento;
  return {
    period: typeof record.period === "string" ? record.period : "",
    regime: typeof record.regime === "string" ? record.regime : "",
    siatEmitting: record.siat_emitting === true,
    ivaAPagarBs: toNumber(record.iva_a_pagar_bs),
    ivaSaldoFavorBs: toNumber(record.iva_saldo_favor_bs),
    itBs: toNumber(record.it_bs),
    iueEstimadoBs: toNumber(record.iue_estimado_bs),
    creditoFiscalPerdidoBs: toNumber(record.credito_fiscal_perdido_bs),
    iueBeRetencionesBs: toNumber(record.iue_be_retenciones_bs),
    proximoVencimiento: typeof record.proximo_vencimiento === "string" ? record.proximo_vencimiento : "",
    diasParaVencimiento: dias === null || dias === undefined ? null : Math.trunc(toNumber(dias)),
    notes: typeof record.notes === "string" ? record.notes : "",
  };
}

function mapAnomalies(value: unknown): FinanceAnomaly[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const record = (item ?? {}) as Record<string, unknown>;
    return {
      kind: typeof record.kind === "string" ? record.kind : "desconocido",
      detail: typeof record.detail === "string" ? record.detail : "",
      amountBs: toNumber(record.amount_bs),
    };
  });
}

// Lee finance_summary.raw.earnings: lista de ganancias por persona. Tolerante:
// si la columna raw no existe o no trae earnings, devuelve [] y el panel muestra
// "sin ventas aun". Los montos vienen como earned_bs/pending_bs (snake_case).
function mapEarnings(raw: unknown): PersonEarnings[] {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return [];
  }
  const list = (raw as Record<string, unknown>).earnings;
  if (!Array.isArray(list)) {
    return [];
  }
  return list
    .map((item) => {
      const record = (item ?? {}) as Record<string, unknown>;
      return {
        personKey: typeof record.person_key === "string" ? record.person_key : "",
        displayName:
          typeof record.display_name === "string" && record.display_name.trim() !== ""
            ? record.display_name
            : typeof record.person_key === "string"
              ? record.person_key
              : "",
        role: typeof record.role === "string" ? record.role : "",
        earnedBs: toNumber(record.earned_bs),
        pendingBs: toNumber(record.pending_bs),
        salesCount: Math.trunc(toNumber(record.sales_count)),
      };
    })
    .filter((entry) => entry.displayName !== "");
}

export async function getFinanceSummary(): Promise<FinanceSummary | null> {
  const rows = await liveRequest<DbFinanceRow[]>(
    "finance_summary?select=*&order=generated_at.desc&limit=1",
  );
  const row = rows?.[0];
  if (!row) {
    return null;
  }

  return {
    summaryKey: row.summary_key ?? "",
    periodLabel: row.period_label ?? "",
    generatedAt: row.generated_at ?? "",
    cashTotalBs: toNumber(row.cash_total_bs),
    cashPeriodBs: toNumber(row.cash_period_bs),
    incomeCount: Math.trunc(toNumber(row.income_count)),
    commissionsPendingBs: toNumber(row.commissions_pending_bs),
    commissionsBlockedBs: toNumber(row.commissions_blocked_bs),
    fundTotalBs: toNumber(row.fund_total_bs),
    expensesPendingBs: toNumber(row.expenses_pending_bs),
    premiumPendingBs: toNumber(row.premium_pending_bs),
    anomalyCount: Math.trunc(toNumber(row.anomaly_count)),
    anomalies: mapAnomalies(row.anomalies),
    earnings: mapEarnings(row.raw),
    summaryText: row.summary_text ?? "",
    taxPosture: mapTaxPosture(row.tax_posture),
  };
}

// ---------------------------------------------------------------------------
// 2. Estado en vivo de los agentes — onia_center.operating_agents.
//    Los runtimes ponen status='ready' + raw.last_run; el seed estatico los
//    tiene como prepared_pending_connection. Merge: la DB gana cuando trae un
//    status conocido.
// ---------------------------------------------------------------------------

// Contrato de agente "vivo" (carril infra escribe, panel lee): un agente esta
// activo 24/7 cuando status='ready' + raw.live=true. raw.cadence_label trae el
// horario legible ("Lun+Jue 07:40") y raw.last_run la ultima corrida real.
export interface LiveAgentStatus {
  status: OperatingAgentStatus;
  lastRunAt: string | null;
  live: boolean;
  cadenceLabel: string | null;
}

const KNOWN_STATUSES: OperatingAgentStatus[] = [
  "ready",
  "prepared_pending_connection",
  "planned",
  "blocked",
];

type DbAgentRow = {
  agent_key?: string;
  status?: string;
  raw?: Record<string, unknown> | null;
};

function agentIdToKey(agentId: string): string {
  return agentId.replace(/-/g, "_");
}

// raw.last_run puede llegar como string ISO o como objeto { at }. Tolerante a
// ambos para no romper si el contrato del carril infra cambia de forma.
function readLastRun(raw: Record<string, unknown> | null | undefined): string | null {
  const lastRun = raw?.last_run;
  if (typeof lastRun === "string" && lastRun.trim() !== "") {
    return lastRun;
  }
  if (lastRun && typeof lastRun === "object") {
    const at = (lastRun as Record<string, unknown>).at;
    return typeof at === "string" && at.trim() !== "" ? at : null;
  }
  return null;
}

export async function getLiveAgentStatuses(): Promise<Record<string, LiveAgentStatus>> {
  const rows = await liveRequest<DbAgentRow[]>("operating_agents?select=agent_key,status,raw");
  if (!rows) {
    return {};
  }

  const map: Record<string, LiveAgentStatus> = {};
  for (const row of rows) {
    if (!row.agent_key || !row.status) {
      continue;
    }
    if (!KNOWN_STATUSES.includes(row.status as OperatingAgentStatus)) {
      continue;
    }
    const raw = row.raw ?? null;
    const cadence = raw?.cadence_label;
    map[row.agent_key] = {
      status: row.status as OperatingAgentStatus,
      lastRunAt: readLastRun(raw),
      live: raw?.live === true,
      cadenceLabel: typeof cadence === "string" && cadence.trim() !== "" ? cadence : null,
    };
  }

  return map;
}

export function mergeLiveAgentStatus(
  agents: OperatingAgent[],
  liveStatuses: Record<string, LiveAgentStatus>,
): OperatingAgent[] {
  return agents.map((agent) => {
    const live = liveStatuses[agentIdToKey(agent.id)];
    if (!live) {
      return agent;
    }
    return { ...agent, status: live.status };
  });
}

// Reindexa el mapa de estados vivos por agent.id (el runtime lo guarda por
// agent_key con guiones bajos). Lo consumen la vista Hoy (roster) y Agentes
// (detalle) para mostrar "Activo 24/7", cadencia y ultima corrida sin repetir
// la conversion de clave en cada componente.
export function selectLiveInfoByAgentId(
  agents: OperatingAgent[],
  liveStatuses: Record<string, LiveAgentStatus>,
): Record<string, LiveAgentStatus> {
  const out: Record<string, LiveAgentStatus> = {};
  for (const agent of agents) {
    const live = liveStatuses[agentIdToKey(agent.id)];
    if (live) {
      out[agent.id] = live;
    }
  }
  return out;
}

// Cuenta los agentes realmente activos 24/7 (contrato live=true). Si el carril
// infra aun no marca `live`, cae a contar los que estan en estado 'ready' para
// no mostrar 0 cuando de hecho hay agentes corriendo por cron.
export function countActiveAgents(
  agents: OperatingAgent[],
  liveStatuses: Record<string, LiveAgentStatus>,
): number {
  const liveCount = agents.filter(
    (agent) => liveStatuses[agentIdToKey(agent.id)]?.live === true,
  ).length;
  if (liveCount > 0) {
    return liveCount;
  }
  return agents.filter((agent) => agent.status === "ready").length;
}

// ---------------------------------------------------------------------------
// 3. Cuerpo de los borradores de contenido — review_queue.raw.
//    La lista de reviews (getOniaCenterRuntime, ya filtrada por rol) trae sólo
//    el título; el guion/carrusel vive en `raw`. Acá lo leemos aparte y el tile
//    lo muestra SÓLO para reviews que ya están en la lista filtrada (match por
//    review_key), así el filtrado de seguridad del store se respeta.
// ---------------------------------------------------------------------------

export interface ReviewBody {
  kind: "content_script" | "content_carousel";
  format?: string;
  pillar?: string;
  hook?: string;
  body?: string;
  cta?: string;
  title?: string;
  slides?: string[];
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function toSlides(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((slide) => {
      if (typeof slide === "string") {
        return slide;
      }
      if (slide && typeof slide === "object") {
        const record = slide as Record<string, unknown>;
        return asString(record.text) ?? asString(record.body) ?? asString(record.title) ?? JSON.stringify(slide);
      }
      return String(slide);
    })
    .filter((slide) => slide.trim() !== "");
}

export function parseReviewBody(raw: unknown): ReviewBody | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const record = raw as Record<string, unknown>;
  const kind = asString(record.kind);

  if (kind === "content_script" && record.script && typeof record.script === "object") {
    const script = record.script as Record<string, unknown>;
    return {
      kind: "content_script",
      format: asString(script.format),
      pillar: asString(script.pillar),
      hook: asString(script.hook),
      body: asString(script.body),
      cta: asString(script.cta),
    };
  }

  if (kind === "content_carousel" && record.carousel && typeof record.carousel === "object") {
    const carousel = record.carousel as Record<string, unknown>;
    return {
      kind: "content_carousel",
      title: asString(carousel.title),
      cta: asString(carousel.cta),
      slides: toSlides(carousel.slides),
    };
  }

  return null;
}

type DbReviewRawRow = {
  review_key?: string;
  raw?: unknown;
};

export async function getReviewBodies(): Promise<Record<string, ReviewBody>> {
  const rows = await liveRequest<DbReviewRawRow[]>(
    "review_queue?select=review_key,raw&status=eq.pending&order=created_at.desc&limit=80",
  );
  if (!rows) {
    return {};
  }

  const map: Record<string, ReviewBody> = {};
  for (const row of rows) {
    if (!row.review_key) {
      continue;
    }
    const body = parseReviewBody(row.raw);
    if (body) {
      map[row.review_key] = body;
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// 4. Estado de integraciones — onia_center.integration_connectors.
//    El sistema modela cada conector externo (Cal.com, Google Calendar, n8n,
//    WhatsApp, LiteLLM, etc.) con su estado real de conexion. El panel lo LEE
//    para responder "que esta conectado / que falta" sin exponer credenciales.
// ---------------------------------------------------------------------------

export interface IntegrationConnector {
  key: string;
  name: string;
  provider: string;
  category: string;
  status: string;
  selfHosted: boolean;
  nextAction: string;
  priority: string;
}

type DbConnectorRow = {
  connector_key?: string;
  connector_name?: string;
  provider?: string;
  category?: string;
  status?: string;
  self_hosted?: boolean;
  next_action?: string;
  priority?: string;
};

export async function getIntegrationConnectors(): Promise<IntegrationConnector[]> {
  const rows = await liveRequest<DbConnectorRow[]>(
    "integration_connectors?select=connector_key,connector_name,provider,category,status,self_hosted,next_action,priority&order=category.asc,connector_key.asc",
  );
  if (!rows) {
    return [];
  }
  return rows
    .filter((row) => row.connector_key)
    .map((row) => ({
      key: row.connector_key as string,
      name: row.connector_name ?? row.provider ?? (row.connector_key as string),
      provider: row.provider ?? "",
      category: row.category ?? "otros",
      status: row.status ?? "planned",
      selfHosted: row.self_hosted === true,
      nextAction: row.next_action ?? "",
      priority: row.priority ?? "",
    }));
}

// ---------------------------------------------------------------------------
// 5. Feed de auditoria — onia_center.audit_logs.
//    Las corridas de agentes (action='agent_trigger'), notas de runtime y otros
//    eventos quedan en audit_logs. El panel LEE las ultimas filas como feed real
//    de auditoria. El filtrado por rol se hace arriba (page) con la columna
//    sensitivity_scope, para no exponer eventos privados a roles no-Sergio.
// ---------------------------------------------------------------------------

export interface AgentRunEntry {
  id: string;
  action: string;
  actorRole: string;
  summary: string;
  at: string;
  sensitivityScope: string;
  agentId: string | null;
  agentName: string | null;
  status: string | null;
}

type DbAuditRow = {
  audit_key?: string;
  action?: string;
  actor_role_key?: string;
  summary?: string;
  sensitivity_scope?: string;
  raw?: Record<string, unknown> | null;
  created_at?: string;
};

export async function getAgentRunFeed(limit = 40): Promise<AgentRunEntry[]> {
  const capped = Math.min(Math.max(Math.trunc(limit), 1), 100);
  const rows = await liveRequest<DbAuditRow[]>(
    `audit_logs?select=audit_key,action,actor_role_key,summary,sensitivity_scope,raw,created_at&order=created_at.desc&limit=${capped}`,
  );
  if (!rows) {
    return [];
  }

  return rows
    .filter((row) => Boolean(row.audit_key))
    .map((row) => {
      const raw = (row.raw ?? {}) as Record<string, unknown>;
      const agentId =
        typeof raw.agentId === "string" ? raw.agentId : typeof raw.agent === "string" ? raw.agent : null;
      return {
        id: row.audit_key as string,
        action: row.action ?? "evento",
        actorRole: row.actor_role_key ?? "",
        summary: row.summary ?? "",
        at: row.created_at ?? "",
        sensitivityScope: row.sensitivity_scope ?? "internal_restricted",
        agentId,
        agentName: typeof raw.agentName === "string" ? raw.agentName : null,
        status: typeof raw.status === "string" ? raw.status : null,
      };
    });
}

// ---------------------------------------------------------------------------
// 6. Disparo de agentes — resolucion de webhook n8n + registro de la corrida.
//    La URL del webhook nunca viene del request; sale de env o de
//    integration_connectors (controlados por infra), asi el usuario solo elige
//    QUE agente disparar, no a donde. Si no hay webhook -> null (no configurado).
// ---------------------------------------------------------------------------

function normalizeHttpUrl(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : null;
}

function agentEnvSuffix(agentId: string): string {
  return agentId.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase();
}

function webhookFromEnvMap(agentId: string): string | null {
  const rawMap = process.env.ONIA_CENTER_AGENT_WEBHOOKS;
  if (!rawMap) {
    return null;
  }
  try {
    const map = JSON.parse(rawMap) as Record<string, unknown>;
    return normalizeHttpUrl(map[agentId]) ?? normalizeHttpUrl(map[agentIdToKey(agentId)]);
  } catch {
    return null;
  }
}

async function webhookFromConnectors(agentId: string): Promise<string | null> {
  // Lectura tolerante: si la columna `raw` no existe en integration_connectors,
  // PostgREST responde 4xx y liveRequest devuelve null (caemos a env).
  const rows = await liveRequest<Array<{ connector_key?: string; raw?: Record<string, unknown> | null }>>(
    "integration_connectors?select=connector_key,raw&provider=eq.n8n",
  );
  if (!rows) {
    return null;
  }

  const key = agentIdToKey(agentId);
  for (const row of rows) {
    const raw = (row.raw ?? {}) as Record<string, unknown>;
    const agentMap = raw.agent_webhooks;
    if (agentMap && typeof agentMap === "object") {
      const record = agentMap as Record<string, unknown>;
      const mapped = normalizeHttpUrl(record[agentId]) ?? normalizeHttpUrl(record[key]);
      if (mapped) {
        return mapped;
      }
    }
    const connectorAgentKey = typeof raw.agent_key === "string" ? raw.agent_key : row.connector_key;
    if (connectorAgentKey === agentId || connectorAgentKey === key) {
      const direct = normalizeHttpUrl(raw.webhook_url) ?? normalizeHttpUrl(raw.webhook);
      if (direct) {
        return direct;
      }
    }
  }
  return null;
}

export async function resolveAgentWebhookUrl(agentId: string): Promise<string | null> {
  const fromEnvMap = webhookFromEnvMap(agentId);
  if (fromEnvMap) {
    return fromEnvMap;
  }
  const perAgent = normalizeHttpUrl(process.env[`ONIA_CENTER_AGENT_WEBHOOK_${agentEnvSuffix(agentId)}`]);
  if (perAgent) {
    return perAgent;
  }
  const fromConnector = await webhookFromConnectors(agentId);
  if (fromConnector) {
    return fromConnector;
  }
  return normalizeHttpUrl(process.env.ONIA_CENTER_N8N_WEBHOOK_URL);
}

async function liveWrite(path: string, body: unknown): Promise<boolean> {
  const config = getLiveConfig();
  if (!config) {
    return false;
  }
  try {
    const response = await fetch(`${config.url}/rest/v1/${path}`, {
      method: "POST",
      headers: {
        apikey: config.serviceRoleKey,
        authorization: `Bearer ${config.serviceRoleKey}`,
        "content-profile": config.schema,
        "content-type": "application/json",
        prefer: "return=minimal",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export interface AgentTriggerRecord {
  agentId: string;
  agentName: string;
  actorRoleKey: string;
  actorLabel: string;
  actorUserKey: string;
  status: "sent" | "failed";
  detail: string;
  httpStatus: number | null;
}

// Registra la corrida en audit_logs con las MISMAS columnas que el store usa al
// insertar notas (audit_key/actor_role_key/action/entity_table/entity_key/
// sensitivity_scope/summary/raw). Best-effort: si falla, no rompe el disparo.
export async function recordAgentTrigger(entry: AgentTriggerRecord): Promise<void> {
  const at = new Date().toISOString();
  const summary =
    entry.status === "sent"
      ? `Disparo manual: ${entry.agentName} (por ${entry.actorLabel})`
      : `Disparo fallido: ${entry.agentName} (por ${entry.actorLabel})`;

  await liveWrite("audit_logs", {
    audit_key: `agent-trigger-${agentIdToKey(entry.agentId)}-${Date.now()}`,
    actor_role_key: entry.actorRoleKey,
    action: "agent_trigger",
    entity_table: "onia_center.operating_agents",
    entity_key: agentIdToKey(entry.agentId),
    sensitivity_scope: "internal_restricted",
    summary,
    raw: {
      agentId: entry.agentId,
      agentName: entry.agentName,
      status: entry.status,
      detail: entry.detail,
      httpStatus: entry.httpStatus,
      triggeredBy: entry.actorUserKey,
      actorRole: entry.actorRoleKey,
      at,
    },
  });
}

// ---------------------------------------------------------------------------
// 7. Conteo del pipeline de contenido — idea_inbox + review_queue.
//    Numeros crudos para la torre de control: cuantas ideas esperan trabajo y
//    cuantos borradores estan en cola de revision. El panel LEE, no escribe.
// ---------------------------------------------------------------------------

export interface ContentPipelineCounts {
  ideasPending: number;
  draftsPending: number;
}

// Puro y testeable: convierte las dos listas crudas (o null si no se pudo leer)
// en los conteos. Si NINGUNA lectura funciono (sin config o error de red),
// devuelve null para que el panel oculte el bloque en vez de mostrar ceros
// enganosos. Si al menos una lista llego, cuenta su largo (0 es un dato valido).
export function toContentPipelineCounts(
  ideas: unknown[] | null,
  drafts: unknown[] | null,
): ContentPipelineCounts | null {
  if (ideas === null && drafts === null) {
    return null;
  }
  return {
    ideasPending: Array.isArray(ideas) ? ideas.length : 0,
    draftsPending: Array.isArray(drafts) ? drafts.length : 0,
  };
}

// Ideas que aun esperan trabajo (estado inbox o queued, no reviewed/approved/
// archived) y borradores pendientes en review_queue. El tope alto (500) cubre de
// sobra un pipeline real de decenas; solo acota una lectura patologica.
export async function getContentPipelineCounts(): Promise<ContentPipelineCounts | null> {
  const [ideas, drafts] = await Promise.all([
    liveRequest<unknown[]>("idea_inbox?select=idea_key&status=in.(inbox,queued)&limit=500"),
    liveRequest<unknown[]>("review_queue?select=review_key&status=eq.pending&limit=500"),
  ]);
  return toContentPipelineCounts(ideas, drafts);
}

// ---------------------------------------------------------------------------
// 8. Costos y suscripciones — onia_center.cost_items.
//    Cada gasto recurrente de ONIA (infra, dominios, APIs, email, tools) con su
//    ciclo de cobro y proximo pago. Para item_key='openai_api' el raw trae el
//    gasto IA del mes en vivo (raw.spend_usd_mtd). El panel LEE, no escribe.
// ---------------------------------------------------------------------------

const COST_CATEGORIES = ["infra", "domain", "api", "email", "tool", "other"] as const;
export type CostCategory = (typeof COST_CATEGORIES)[number];

const COST_CYCLES = ["monthly", "yearly", "usage"] as const;
export type CostCycle = (typeof COST_CYCLES)[number];

export interface CostItem {
  itemKey: string;
  name: string;
  provider: string;
  category: CostCategory;
  amount: number | null;
  currency: string;
  cycle: CostCycle;
  dueDay: number | null;
  renewalDate: string | null;
  status: "active" | "paused";
  source: "detected" | "manual";
  notes: string;
  // Gasto IA del mes en vivo (raw.spend_usd_mtd) para cycle='usage'; null si no aplica.
  spendUsdMtd: number | null;
  requestsMtd: number | null;
  // Etiqueta legible del proximo cobro ("15 ago (en 8 dias)"); null para usage.
  nextDueLabel: string | null;
}

type DbCostRow = {
  item_key?: string;
  name?: string;
  provider?: string;
  category?: string;
  amount?: unknown;
  currency?: string;
  cycle?: string;
  due_day?: unknown;
  renewal_date?: string | null;
  status?: string;
  source?: string;
  notes?: string;
  raw?: unknown;
};

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toNullableInt(value: unknown): number | null {
  const parsed = toNullableNumber(value);
  return parsed === null ? null : Math.trunc(parsed);
}

function toCostCategory(value: unknown): CostCategory {
  return typeof value === "string" && (COST_CATEGORIES as readonly string[]).includes(value)
    ? (value as CostCategory)
    : "other";
}

function toCostCycle(value: unknown): CostCycle {
  return value === "monthly" || value === "yearly" || value === "usage" ? value : "monthly";
}

function readCostSpend(raw: unknown): { spendUsdMtd: number | null; requestsMtd: number | null } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { spendUsdMtd: null, requestsMtd: null };
  }
  const record = raw as Record<string, unknown>;
  return {
    spendUsdMtd: toNullableNumber(record.spend_usd_mtd),
    requestsMtd: toNullableInt(record.requests_mtd),
  };
}

// --- Calculo del proximo pago (SSR-safe: corre en el server component) --------

function daysUntil(target: Date, now: Date): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const a = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const b = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((a - b) / MS_PER_DAY);
}

// Clampa el dia al ultimo valido del mes (ej. due_day=31 en un mes de 30 dias).
function clampedDay(year: number, month: number, day: number): Date {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, daysInMonth));
}

function nextMonthlyOccurrence(dueDay: number, now: Date): Date {
  const thisMonth = clampedDay(now.getFullYear(), now.getMonth(), dueDay);
  if (daysUntil(thisMonth, now) >= 0) {
    return thisMonth;
  }
  return clampedDay(now.getFullYear(), now.getMonth() + 1, dueDay);
}

// Parseo local de 'YYYY-MM-DD' para evitar el corrimiento de dia por zona horaria
// que produce new Date(isoDate) (interpreta UTC medianoche).
function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) {
    return null;
  }
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysPhrase(days: number): string | null {
  if (days < 0) {
    return null;
  }
  if (days === 0) {
    return "hoy";
  }
  if (days === 1) {
    return "mañana";
  }
  return `en ${days} días`;
}

function withDaysPhrase(label: string, days: number): string {
  const phrase = daysPhrase(days);
  return phrase ? `${label} (${phrase})` : label;
}

function computeNextDueLabel(
  cycle: CostCycle,
  dueDay: number | null,
  renewalDate: string | null,
  now: Date,
): string | null {
  if (cycle === "monthly" && dueDay !== null && dueDay >= 1 && dueDay <= 31) {
    const date = nextMonthlyOccurrence(dueDay, now);
    const label = date.toLocaleDateString("es-BO", { day: "numeric", month: "short" });
    return withDaysPhrase(label, daysUntil(date, now));
  }
  if (cycle === "yearly" && renewalDate) {
    const date = parseIsoDate(renewalDate);
    if (!date) {
      return null;
    }
    const label = date.toLocaleDateString("es-BO", { day: "numeric", month: "short", year: "numeric" });
    return withDaysPhrase(label, daysUntil(date, now));
  }
  return null;
}

function mapCostItem(row: DbCostRow, now: Date): CostItem {
  const cycle = toCostCycle(row.cycle);
  const dueDay = toNullableInt(row.due_day);
  const renewalDate =
    typeof row.renewal_date === "string" && row.renewal_date.trim() !== "" ? row.renewal_date : null;
  const spend = readCostSpend(row.raw);

  return {
    itemKey: row.item_key ?? "",
    name: row.name ?? row.provider ?? (row.item_key ?? ""),
    provider: row.provider ?? "",
    category: toCostCategory(row.category),
    amount: toNullableNumber(row.amount),
    currency:
      typeof row.currency === "string" && row.currency.trim() !== "" ? row.currency : "USD",
    cycle,
    dueDay,
    renewalDate,
    status: row.status === "paused" ? "paused" : "active",
    source: row.source === "detected" ? "detected" : "manual",
    notes: typeof row.notes === "string" ? row.notes : "",
    spendUsdMtd: spend.spendUsdMtd,
    requestsMtd: spend.requestsMtd,
    nextDueLabel: computeNextDueLabel(cycle, dueDay, renewalDate, now),
  };
}

export async function getCostItems(): Promise<CostItem[]> {
  const rows = await liveRequest<DbCostRow[]>(
    "cost_items?select=*&status=eq.active&order=category.asc",
  );
  if (!rows) {
    return [];
  }
  const now = new Date();
  return rows.filter((row) => row.item_key).map((row) => mapCostItem(row, now));
}

// ---------------------------------------------------------------------------
// Estudio de Contenido — video_projects + cola de aprobacion de cortes (video_cut).
// Lectores CRUDOS (raw DB); el mapeo a view-models vive en
// components/views/estudio/source.ts. Ante fallo/sin config devuelven [] (nunca lanzan).
// ---------------------------------------------------------------------------

export type DbVideoProjectRow = {
  video_key?: string;
  title?: string;
  lane?: string;
  status?: string;
  owner_role_key?: string | null;
  format?: string;
  duration_seconds?: number | string | null;
  final_seconds?: number | string | null;
  model?: string;
  credits_est?: number | string | null;
  source_url?: string | null;
  preview_url?: string | null;
  render_url?: string | null;
  cut_plan_ref?: string | null;
  raw?: Record<string, unknown> | null;
  updated_at?: string;
};

export type DbVideoCutRow = {
  review_key?: string;
  source_key?: string;
  title?: string;
  priority?: string;
  status?: string;
  raw?: Record<string, unknown> | null;
};

export async function getVideoProjectRows(): Promise<DbVideoProjectRow[]> {
  const rows = await liveRequest<DbVideoProjectRow[]>(
    "video_projects?select=video_key,title,lane,status,owner_role_key,format,duration_seconds,final_seconds,model,credits_est,source_url,preview_url,render_url,cut_plan_ref,raw,updated_at&order=updated_at.desc&limit=100",
  );
  return rows ?? [];
}

export async function getVideoCutRows(): Promise<DbVideoCutRow[]> {
  const rows = await liveRequest<DbVideoCutRow[]>(
    "review_queue?select=review_key,source_key,title,priority,status,raw&source_type=eq.video_cut&status=eq.pending&order=created_at.desc&limit=80",
  );
  return rows ?? [];
}

// ---------------------------------------------------------------------------
// 9. Balance de créditos de proveedores generativos — onia_center.provider_credits.
//    Una sesión Claude Code con el MCP de Higgsfield lee el balance vivo y lo
//    escribe (higgsfield-balance-sync.mjs); el panel LEE. Ante fallo/sin fila
//    devuelve null y el consumidor cae a la constante (fallback graceful).
// ---------------------------------------------------------------------------

export interface ProviderBalance {
  credits: number;
  plan: string;
}

type DbProviderCreditsRow = {
  credits?: unknown;
  plan?: unknown;
};

export async function getHiggsfieldBalance(): Promise<ProviderBalance | null> {
  const rows = await liveRequest<DbProviderCreditsRow[]>(
    "provider_credits?select=credits,plan&provider=eq.higgsfield&limit=1",
  );
  const row = rows?.[0];
  if (!row) {
    return null;
  }
  return {
    credits: toNumber(row.credits),
    plan: typeof row.plan === "string" && row.plan.trim() !== "" ? row.plan : "",
  };
}
