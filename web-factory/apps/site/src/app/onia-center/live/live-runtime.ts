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
  summaryText: string;
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
  summary_text?: string;
};

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
    summaryText: row.summary_text ?? "",
  };
}

// ---------------------------------------------------------------------------
// 2. Estado en vivo de los agentes — onia_center.operating_agents.
//    Los runtimes ponen status='ready' + raw.last_run; el seed estatico los
//    tiene como prepared_pending_connection. Merge: la DB gana cuando trae un
//    status conocido.
// ---------------------------------------------------------------------------

export interface LiveAgentStatus {
  status: OperatingAgentStatus;
  lastRunAt: string | null;
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
  raw?: { last_run?: { at?: string } } | null;
};

function agentIdToKey(agentId: string): string {
  return agentId.replace(/-/g, "_");
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
    map[row.agent_key] = {
      status: row.status as OperatingAgentStatus,
      lastRunAt: row.raw?.last_run?.at ?? null,
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
