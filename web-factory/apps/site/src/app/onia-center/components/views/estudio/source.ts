import type { CenterTone } from "@/app/onia-center/types";
import { formatBs } from "@/app/onia-center/engine";
import {
  getVideoProjectRows,
  getVideoCutRows,
  getHiggsfieldBalance,
  getCostItems,
  type DbVideoProjectRow,
  type DbVideoCutRow,
  type ProviderBalance,
  type CostItem,
} from "@/app/onia-center/live/live-runtime";

// ============================================================================
// Estudio de Contenido — datos reales (Fase 2).
//
// Modela el editor de video de ONIA: ver → transcribir → cortar → tu OK →
// render → publicar. La "regla de oro" (la tabla de cortes se aprueba antes de
// aplicar) es el centro del producto: cada CutReview trae los segmentos
// keep/cut con motivo y texto, leídos de review_queue (source_type=video_cut).
//
// Los readers leen Supabase (onia_center.video_projects + review_queue) vía los
// lectores crudos de live-runtime y mapean a los view-models. Sin datos → arrays
// vacíos (empty state), nunca seed falso. Fase 3: créditos Higgsfield (balance real
// de provider_credits) y gasto IA (row openai_api de cost_items) son datos reales;
// si Supabase no responde, caen a las constantes de abajo (fallback graceful).
// ============================================================================

export type EditorLane = "sergio" | "cliente" | "onia-yt" | "onia-ig" | "onia";

export type EditorProjectStatus =
  | "intake"
  | "transcribe"
  | "cutlist"
  | "captions"
  | "render"
  | "published";

export type EditorProjectAction = {
  label: string;
  kind: "gate" | "primary" | "muted";
};

export type EditorProject = {
  id: string;
  title: string;
  rawLabel: string;
  lane: EditorLane;
  laneLabel: string;
  status: EditorProjectStatus;
  statusLabel: string;
  tone: CenterTone;
  durationFromLabel?: string;
  durationToLabel?: string;
  deltaLabel?: string;
  credits: number | null;
  action: EditorProjectAction;
  cutReviewId?: string;
};

export type HiggsfieldFunctionCost = "paga" | "free";

export type HiggsfieldFunctionIcon =
  | "image"
  | "video"
  | "trend"
  | "shorts"
  | "reframe"
  | "upscale";

export type HiggsfieldFunction = {
  id: string;
  name: string;
  desc: string;
  cost: HiggsfieldFunctionCost;
  icon: HiggsfieldFunctionIcon;
};

// Sólo lo que existe de verdad: saldo y plan salen de provider_credits. Consumo
// del mes, fecha de renovación e historial de generaciones NO están en la DB, así
// que no viven acá (ver nota en HiggsfieldPanel). `functions` no es telemetría:
// es el catálogo estático de qué sabe hacer el motor y cuáles cobran.
export type HiggsfieldAccount = {
  creditsLabel: string;
  plan: string;
  functions: HiggsfieldFunction[];
};

export type CutDecision = "keep" | "cut";

export type CutSegment = {
  index: number;
  timeLabel: string;
  decision: CutDecision;
  reason: string;
  text: string;
  fullText?: string;
  weight: number;
};

export type CutReview = {
  id: string;
  projectId: string;
  lane: EditorLane;
  laneLabel: string;
  title: string;
  aspect: string;
  origLabel: string;
  finalLabel: string;
  previewLabel: string;
  timeLabel: string;
  trimLabel: string;
  detected: number;
  keepBlocks: number;
  segments: CutSegment[];
  detail: boolean;
};

export type EditorStage = {
  index: number;
  name: string;
  tool: string;
  count: string;
  state: "done" | "active" | "todo";
  gate?: boolean;
};

export type StudioOverview = {
  headerCreditsLabel: string;
  headerCreditUnit: string;
  plan: string;
  spendMonthLabel: string;
  spendTodayLabel: string;
  pipeline: EditorStage[];
  kpis: {
    higgsfieldCreditsLabel: string;
    higgsfieldUsedLabel: string;
    spendMonthLabel: string;
    spendTodayLabel: string;
    cutQueue: number;
    videosReady: number;
    videosReadyHint: string;
    inProcess: number;
    inProcessHint: string;
    savingsLabel: string;
    savingsHint: string;
  };
};

const creditsFormatter = new Intl.NumberFormat("es-BO", { maximumFractionDigits: 0 });
function creditsLabel(value: number): string {
  return creditsFormatter.format(value);
}

// Fallback si Supabase no trae provider_credits (balance real). El sync
// (higgsfield-balance-sync.mjs) escribe el balance vivo leído por el MCP Higgsfield.
const HIGGSFIELD_CREDITS = 2354.22;

// El gasto IA se factura en USD (LiteLLM/OpenAI) y se muestra en USD. No se
// convierte a Bs: la tasa quedó obsoleta con la flotación (26-jun-2026) y pegarla
// al panel de créditos daba a entender que cada video es plata nueva saliendo.
const usdFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function formatUsd(value: number): string {
  return `US$ ${usdFormatter.format(value)}`;
}

// Plan de respaldo si provider_credits no trae el campo.
const HIGGSFIELD_FALLBACK_PLAN = "ultra";

// Catálogo estático del motor: qué sabe hacer Higgsfield y qué cobra. No es un
// dato de cuenta (no se lee de la DB porque no cambia con el saldo).
const HIGGSFIELD_FUNCTIONS: HiggsfieldFunction[] = [
  { id: "fn-image", name: "Generar imagen", desc: "Soul · recraft · referencias", cost: "paga", icon: "image" },
  { id: "fn-video", name: "Generar video", desc: "kling turbo · motion control", cost: "paga", icon: "video" },
  { id: "fn-virality", name: "Virality predictor", desc: "score antes de publicar", cost: "paga", icon: "trend" },
  { id: "fn-shorts", name: "Auto-shorts", desc: "personal clipper · largo → clips", cost: "paga", icon: "shorts" },
  { id: "fn-reframe", name: "Reframe", desc: "16:9 ↔ 9:16 con tracking", cost: "paga", icon: "reframe" },
  { id: "fn-upscale", name: "Upscale", desc: "sube resolución · no cobra al aplicar", cost: "free", icon: "upscale" },
];

// --- helpers de mapeo raw DB → view-model ---------------------------------

function toNum(v: unknown): number | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function fmtDur(sec?: number): string | undefined {
  if (sec === undefined || sec <= 0) return undefined;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function clockLabel(sec?: number): string {
  const x = Math.max(0, Math.round(sec ?? 0));
  return `${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;
}

function deltaLabel(dur?: number, final?: number): string | undefined {
  if (!dur || !final || dur <= 0 || final <= 0 || final >= dur) return undefined;
  return `−${Math.round((1 - final / dur) * 100)}%`;
}

type StatusInfo = { status: EditorProjectStatus; label: string; tone: CenterTone; action: EditorProjectAction };

function statusInfo(db?: string): StatusInfo {
  switch (db) {
    case "intake":
      return { status: "intake", label: "Recibir", tone: "neutral", action: { label: "Subir crudo", kind: "primary" } };
    case "transcribing":
      return { status: "transcribe", label: "Transcribir", tone: "neutral", action: { label: "Abrir", kind: "primary" } };
    case "cut_review":
      return { status: "cutlist", label: "Cut-list · tu OK", tone: "yellow", action: { label: "Ver cortes", kind: "gate" } };
    case "approved":
      return { status: "render", label: "Aprobado", tone: "blue", action: { label: "Abrir", kind: "primary" } };
    case "rendering":
      return { status: "render", label: "Render", tone: "blue", action: { label: "Abrir", kind: "primary" } };
    case "captioning":
      return { status: "captions", label: "Subtítulos", tone: "neutral", action: { label: "Abrir", kind: "primary" } };
    case "ready":
      return { status: "published", label: "Listo", tone: "green", action: { label: "Abrir", kind: "primary" } };
    case "published":
      return { status: "published", label: "Publicado", tone: "green", action: { label: "Ver publicado", kind: "muted" } };
    case "blocked":
      return { status: "intake", label: "Bloqueado", tone: "yellow", action: { label: "Ver", kind: "muted" } };
    default:
      return { status: "intake", label: "Recibir", tone: "neutral", action: { label: "Abrir", kind: "primary" } };
  }
}

const FINE_LANES = new Set(["sergio", "cliente", "onia-yt", "onia-ig", "onia"]);
const BASE_LANE: Record<string, { lane: EditorLane; laneLabel: string }> = {
  sergio: { lane: "sergio", laneLabel: "Sergio" },
  client: { lane: "cliente", laneLabel: "Cliente" },
  onia: { lane: "onia", laneLabel: "ONIA" },
};

function laneInfo(dbLane?: string, raw?: Record<string, unknown> | null): { lane: EditorLane; laneLabel: string } {
  const rawLane = raw && typeof raw.lane === "string" ? raw.lane : undefined;
  const rawLabel = raw && typeof raw.lane_label === "string" ? raw.lane_label : undefined;
  const base = BASE_LANE[dbLane ?? "onia"] ?? BASE_LANE.onia;
  const lane = (rawLane && FINE_LANES.has(rawLane) ? rawLane : base.lane) as EditorLane;
  return { lane, laneLabel: rawLabel ?? base.laneLabel };
}

function strField(raw: Record<string, unknown> | null | undefined, key: string): string | undefined {
  return raw && typeof raw[key] === "string" ? (raw[key] as string) : undefined;
}

function mapProject(row: DbVideoProjectRow, cutKeyByVideo: Map<string, string>): EditorProject {
  const info = statusInfo(row.status);
  const { lane, laneLabel } = laneInfo(row.lane, row.raw);
  const dur = toNum(row.duration_seconds);
  const final = toNum(row.final_seconds);
  const key = row.video_key ?? "";
  const rawLabel =
    strField(row.raw, "raw_label") ??
    (row.source_url ? row.source_url.split("/").pop() ?? "" : row.format ?? "");
  return {
    id: key,
    title: row.title ?? key,
    rawLabel,
    lane,
    laneLabel,
    status: info.status,
    statusLabel: info.label,
    tone: info.tone,
    durationFromLabel: fmtDur(dur),
    durationToLabel: fmtDur(final),
    deltaLabel: deltaLabel(dur, final),
    credits: toNum(row.credits_est) ?? null,
    action: info.action,
    cutReviewId: info.status === "cutlist" ? cutKeyByVideo.get(key) : undefined,
  };
}

// Contrato del raw de review_queue (source_type=video_cut) que escribe el pipeline (Fase 4).
type RawCutSegment = {
  index?: number;
  from?: number;
  to?: number;
  decision?: string;
  reason?: string;
  text?: string;
  full_text?: string;
  weight?: number;
};
type RawCutBody = {
  aspect?: string;
  lane?: string;
  lane_label?: string;
  orig_seconds?: number;
  final_seconds?: number;
  preview_url?: string;
  detected?: number;
  keep_blocks?: number;
  trim_seconds?: number;
  segments?: RawCutSegment[];
};

function mapCut(row: DbVideoCutRow): CutReview {
  const raw = (row.raw ?? {}) as RawCutBody;
  const segs = Array.isArray(raw.segments) ? raw.segments : [];
  const orig = toNum(raw.orig_seconds);
  const final = toNum(raw.final_seconds);
  const trim = toNum(raw.trim_seconds) ?? (orig !== undefined && final !== undefined ? orig - final : undefined);
  const { lane, laneLabel } = laneInfo(raw.lane, raw as Record<string, unknown>);
  return {
    id: row.review_key ?? "",
    projectId: row.source_key ?? "",
    lane,
    laneLabel,
    title: row.title ?? "Corte de video",
    aspect: typeof raw.aspect === "string" ? raw.aspect : "9:16",
    origLabel: fmtDur(orig) ?? "—",
    finalLabel: fmtDur(final) ?? "—",
    previewLabel: "Preview 360p · cut.mp4",
    timeLabel: `0:00 / ${fmtDur(final) ?? "0:00"}`,
    trimLabel: trim !== undefined ? `−${Math.round(trim)} s` : "—",
    detected: toNum(raw.detected) ?? segs.length,
    keepBlocks: toNum(raw.keep_blocks) ?? segs.filter((s) => s.decision === "keep").length,
    detail: segs.length > 0,
    segments: segs.map((s, i) => ({
      index: toNum(s.index) ?? i + 1,
      timeLabel: `${clockLabel(toNum(s.from))}–${clockLabel(toNum(s.to))}`,
      decision: s.decision === "cut" ? "cut" : "keep",
      reason: typeof s.reason === "string" ? s.reason : "",
      text: typeof s.text === "string" ? s.text : "",
      fullText: typeof s.full_text === "string" ? s.full_text : undefined,
      weight: toNum(s.weight) ?? Math.max(1, Math.round((toNum(s.to) ?? 0) - (toNum(s.from) ?? 0))),
    })),
  };
}

// --- readers (Promise.all en next/estudio/page.tsx) ------------------------

export async function getEditorProjects(): Promise<EditorProject[]> {
  const [projects, cuts] = await Promise.all([getVideoProjectRows(), getVideoCutRows()]);
  const cutKeyByVideo = new Map<string, string>();
  for (const c of cuts) {
    if (c.source_key && c.review_key) cutKeyByVideo.set(c.source_key, c.review_key);
  }
  return projects.filter((r) => r.video_key).map((r) => mapProject(r, cutKeyByVideo));
}

export async function getCutQueue(): Promise<CutReview[]> {
  const cuts = await getVideoCutRows();
  return cuts.filter((c) => c.review_key).map(mapCut);
}

// Créditos + plan reales de provider_credits; si no hay fila (sync aún no corrió o
// Supabase no responde) cae a la constante de fallback. El plan vacío también cae.
function resolveHiggsfield(balance: ProviderBalance | null): { credits: number; plan: string } {
  if (!balance) {
    return { credits: HIGGSFIELD_CREDITS, plan: HIGGSFIELD_FALLBACK_PLAN };
  }
  return {
    credits: balance.credits,
    plan: balance.plan !== "" ? balance.plan : HIGGSFIELD_FALLBACK_PLAN,
  };
}

// Gasto IA real del mes: row openai_api de cost_items (raw.spend_usd_mtd, escrito por
// ai-spend-sync desde LiteLLM). Devuelve las etiquetas en USD, la moneda en que se
// factura. Si no hay dato real, null → el consumidor mantiene el fallback sin romper.
function resolveAiSpend(costs: CostItem[]): { monthLabel: string; hint: string } | null {
  const row = costs.find((item) => item.itemKey === "openai_api");
  if (!row || row.spendUsdMtd === null) {
    return null;
  }
  const requests = row.requestsMtd;
  return {
    monthLabel: formatUsd(row.spendUsdMtd),
    // No hay desglose diario en LiteLLM; el hint muestra un dato real (llamadas del mes).
    hint: requests !== null ? `${requests} llamadas · IA propia` : "IA propia · LiteLLM",
  };
}

export async function getHiggsfieldAccount(): Promise<HiggsfieldAccount> {
  const balance = await getHiggsfieldBalance();
  const { credits, plan } = resolveHiggsfield(balance);
  return {
    creditsLabel: creditsLabel(credits),
    plan,
    functions: HIGGSFIELD_FUNCTIONS,
  };
}

export async function getStudioOverview(): Promise<StudioOverview> {
  const [projects, cuts, balance, costs] = await Promise.all([
    getVideoProjectRows(),
    getVideoCutRows(),
    getHiggsfieldBalance(),
    getCostItems(),
  ]);
  const count = (s: string) => projects.filter((p) => p.status === s).length;

  const { credits, plan } = resolveHiggsfield(balance);
  const higgsfieldCreditsLabel = creditsLabel(credits);

  // Gasto IA real (USD); fallback a la constante previa si no hay dato en cost_items.
  const aiSpend = resolveAiSpend(costs);
  const spendMonthLabel = aiSpend ? aiSpend.monthLabel : formatUsd(178.16);
  const spendHintLabel = aiSpend ? aiSpend.hint : `hoy ${formatUsd(6.15)}`;

  const cutQueue = cuts.length;
  const videosReady = count("ready");
  const inProcess = count("rendering") + count("captioning") + count("transcribing");

  const intakeN = count("intake");
  const transN = count("transcribing");
  const capN = count("captioning");
  const renderN = count("rendering") + count("approved");
  const pubN = count("published") + count("ready");

  const pipeline: EditorStage[] = [
    { index: 1, name: "Recibir / Subir", tool: "yt-dlp · Telegram · ffprobe", count: `${intakeN} en intake`, state: intakeN > 0 ? "active" : "done" },
    { index: 2, name: "Transcribir", tool: "Speaches · faster-whisper-small", count: `${transN} en proceso`, state: transN > 0 ? "active" : "todo" },
    { index: 3, name: "Cut-list", tool: "cut-plan.mjs · regla de oro", count: `${cutQueue} esperando tu OK`, state: cutQueue > 0 ? "active" : "todo", gate: true },
    { index: 4, name: "Subtítulos", tool: "embedded-captions · karaoke", count: `${capN} en cola`, state: capN > 0 ? "active" : "todo" },
    { index: 5, name: "Render", tool: "HyperFrames · SFX", count: `${renderN} renderizando`, state: renderN > 0 ? "active" : "todo" },
    { index: 6, name: "Publicar", tool: "handoff n8n · redes", count: `${pubN} listos`, state: pubN > 0 ? "done" : "todo" },
  ];

  return {
    headerCreditsLabel: higgsfieldCreditsLabel,
    headerCreditUnit: "cr",
    plan,
    spendMonthLabel,
    spendTodayLabel: spendHintLabel,
    pipeline,
    kpis: {
      higgsfieldCreditsLabel,
      higgsfieldUsedLabel: `plan ${plan}`,
      spendMonthLabel,
      spendTodayLabel: spendHintLabel,
      cutQueue,
      videosReady,
      videosReadyHint: "listos p/ publicar",
      inProcess,
      inProcessHint: "en proceso",
      savingsLabel: formatBs(9600, { compact: true }),
      savingsHint: "estimado · mes",
    },
  };
}
