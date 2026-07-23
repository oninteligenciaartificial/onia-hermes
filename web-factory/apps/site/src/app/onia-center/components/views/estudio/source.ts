import type { CenterTone } from "@/app/onia-center/types";
import { formatBs } from "@/app/onia-center/engine";

// ============================================================================
// Estudio de Contenido — seed de Fase 1 (sin DB).
//
// Modela el editor de video de ONIA: ver → transcribir → cortar → tu OK →
// render → publicar. La "regla de oro" (la tabla de cortes se aprueba antes de
// aplicar) es el centro del producto, así que el modelo la representa entera:
// cada CutReview trae los segmentos keep/cut con motivo y texto.
//
// Cada reader es async (paridad con getFinanceSummary/getVideoLabSnapshot) para
// que en Fase 2 se cambie el cuerpo por una lectura real sin tocar la vista.
// ============================================================================

export type EditorLane = "sergio" | "cliente" | "onia-yt" | "onia-ig" | "onia";

// Estados del pipeline del editor (6). Mapean 1:1 a los pasos de EditorFlow.
export type EditorProjectStatus =
  | "intake" // Recibir / Subir
  | "transcribe" // Transcribir
  | "cutlist" // Cut-list · tu OK (compuerta)
  | "captions" // Subtítulos
  | "render" // Render
  | "published"; // Publicado

export type EditorProjectAction = {
  label: string;
  // gate = abre el rail de cortes (ámbar); primary = acción viva; muted = ver algo cerrado.
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

export type HiggsfieldGenerationKind = "video" | "image" | "effect";

export type HiggsfieldGeneration = {
  id: string;
  title: string;
  kind: HiggsfieldGenerationKind;
  meta: string;
  credits: number;
};

// paga = consume créditos y pide tu OK (ámbar); free = no cobra cuando aplica (esmeralda).
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

export type HiggsfieldAccount = {
  creditsLabel: string;
  plan: string;
  usedThisMonth: number;
  renewsInDays: number;
  usedFraction: number;
  capacityHint: string;
  recent: HiggsfieldGeneration[];
  functions: HiggsfieldFunction[];
};

export type CutDecision = "keep" | "cut";

export type CutSegment = {
  index: number;
  timeLabel: string;
  decision: CutDecision;
  reason: string;
  text: string;
  // Texto completo (sin truncar): se muestra en modo foco y como title del recorte.
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
  // true = trae preview + segmentos completos; false = solo resumen (aún en cola).
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

const HIGGSFIELD_CREDITS = 2354.22;

const EDITOR_PROJECTS: EditorProject[] = [
  {
    id: "p-siat",
    title: "3 errores al facturar en Bolivia",
    rawLabel: "sergio-reel-siat.mov · talking-head 9:16",
    lane: "sergio",
    laneLabel: "Sergio",
    status: "cutlist",
    statusLabel: "Cut-list · tu OK",
    tone: "yellow",
    durationFromLabel: "1:48",
    durationToLabel: "1:12",
    deltaLabel: "−33%",
    credits: 0,
    action: { label: "Ver cortes", kind: "gate" },
    cutReviewId: "cr-siat",
  },
  {
    id: "p-cafeluna",
    title: "Café Luna · promo apertura",
    rawLabel: "cafeluna-crudo.mp4 · 16:9",
    lane: "cliente",
    laneLabel: "Cliente",
    status: "render",
    statusLabel: "Render",
    tone: "blue",
    durationFromLabel: "0:34",
    durationToLabel: "0:28",
    credits: 45,
    action: { label: "Abrir", kind: "primary" },
  },
  {
    id: "p-onia-ep4",
    title: "ONIA Automatiza · ep.004",
    rawLabel: "faceless · guion aprobado",
    lane: "onia-yt",
    laneLabel: "ONIA · YT",
    status: "captions",
    statusLabel: "Subtítulos",
    tone: "neutral",
    durationFromLabel: "6:20",
    durationToLabel: "5:48",
    credits: 0,
    action: { label: "Abrir", kind: "primary" },
  },
  {
    id: "p-lucia",
    title: "Lucía · lifestyle Soul",
    rawLabel: "lucia-soul-set2 · 9:16",
    lane: "onia-ig",
    laneLabel: "ONIA · IG",
    status: "transcribe",
    statusLabel: "Transcribir",
    tone: "neutral",
    durationToLabel: "0:22",
    credits: 36,
    action: { label: "Abrir", kind: "primary" },
  },
  {
    id: "p-dentalgest",
    title: "DentalGest · demo producto",
    rawLabel: "product-launch · publicado",
    lane: "cliente",
    laneLabel: "Cliente",
    status: "published",
    statusLabel: "Publicado",
    tone: "green",
    durationFromLabel: "1:15",
    durationToLabel: "0:58",
    credits: 120,
    action: { label: "Ver publicado", kind: "muted" },
  },
  {
    id: "p-ganadero",
    title: "Ganadero OS · teaser",
    rawLabel: "sin crudo aún",
    lane: "onia",
    laneLabel: "ONIA",
    status: "intake",
    statusLabel: "Recibir",
    tone: "neutral",
    credits: null,
    action: { label: "Subir crudo", kind: "primary" },
  },
];

const HIGGSFIELD_ACCOUNT: HiggsfieldAccount = {
  creditsLabel: creditsLabel(HIGGSFIELD_CREDITS),
  plan: "ultra",
  usedThisMonth: 246,
  renewsInDays: 12,
  usedFraction: 0.095,
  capacityHint: "Alcanza para ~52 videos kling o ~65 imágenes Soul.",
  recent: [
    {
      id: "gen-cafeluna-broll",
      title: "Café Luna · b-roll kling",
      kind: "video",
      meta: "video · hace 3 h · usado",
      credits: 45,
    },
    {
      id: "gen-lucia-soul",
      title: "Lucía Soul · retrato set 2",
      kind: "image",
      meta: "imagen · ayer · aprobado",
      credits: 36,
    },
    {
      id: "gen-onia-sting",
      title: "ONIA · logo sting",
      kind: "effect",
      meta: "video · hace 3 d",
      credits: 30,
    },
  ],
  functions: [
    { id: "fn-image", name: "Generar imagen", desc: "Soul · recraft · referencias", cost: "paga", icon: "image" },
    { id: "fn-video", name: "Generar video", desc: "kling turbo · motion control", cost: "paga", icon: "video" },
    { id: "fn-virality", name: "Virality predictor", desc: "score antes de publicar", cost: "paga", icon: "trend" },
    { id: "fn-shorts", name: "Auto-shorts", desc: "personal clipper · largo → clips", cost: "paga", icon: "shorts" },
    { id: "fn-reframe", name: "Reframe", desc: "16:9 ↔ 9:16 con tracking", cost: "paga", icon: "reframe" },
    { id: "fn-upscale", name: "Upscale", desc: "sube resolución · no cobra al aplicar", cost: "free", icon: "upscale" },
  ],
};

const CUT_QUEUE: CutReview[] = [
  {
    id: "cr-siat",
    projectId: "p-siat",
    lane: "sergio",
    laneLabel: "Sergio",
    title: 'Reel "3 errores al facturar en Bolivia"',
    aspect: "9:16",
    origLabel: "1:48",
    finalLabel: "1:12",
    previewLabel: "Preview 360p · cut.mp4",
    timeLabel: "0:00 / 1:12",
    trimLabel: "−36 s",
    detected: 12,
    keepBlocks: 4,
    detail: true,
    segments: [
      {
        index: 1,
        timeLabel: "00:00–00:14",
        decision: "keep",
        reason: "Hook fuerte",
        text: "“Si facturás mal, el SIAT…”",
        fullText: "Si facturás mal en Bolivia, el SIAT te observa la factura y te cae la multa.",
        weight: 14,
      },
      { index: 2, timeLabel: "00:14–00:18", decision: "cut", reason: "Silencio 4,2 s", text: "—", weight: 4 },
      {
        index: 3,
        timeLabel: "00:18–00:40",
        decision: "keep",
        reason: "Error #1",
        text: "“…no validar el NIT.”",
        fullText: "El error número uno es no validar el NIT del cliente antes de emitir.",
        weight: 22,
      },
      {
        index: 4,
        timeLabel: "00:40–00:43",
        decision: "cut",
        reason: "Muletilla",
        text: "“eh, este, o sea…”",
        fullText: "eh, este, o sea… (muletilla)",
        weight: 3,
      },
      {
        index: 5,
        timeLabel: "00:43–01:01",
        decision: "keep",
        reason: "Error #2",
        text: "“…la fecha límite.”",
        fullText: "Segundo error: pasarse de la fecha límite de emisión de la factura.",
        weight: 18,
      },
      {
        index: 6,
        timeLabel: "01:01–01:06",
        decision: "cut",
        reason: "Repetición",
        text: "“la fecha, la fecha…”",
        fullText: "la fecha límite, la fecha… (repetición)",
        weight: 5,
      },
      {
        index: 7,
        timeLabel: "01:06–01:19",
        decision: "keep",
        reason: "CTA",
        text: "“Escribime y te paso la guía.”",
        fullText: "Escribime y te paso la guía completa gratis para facturar sin errores.",
        weight: 13,
      },
    ],
  },
  {
    id: "cr-onia-ep3",
    projectId: "p-onia-ep3",
    lane: "onia-yt",
    laneLabel: "ONIA · YT",
    title: "ONIA Automatiza · ep.003",
    aspect: "16:9",
    origLabel: "6:52",
    finalLabel: "6:04",
    previewLabel: "Preview 360p · cut.mp4",
    timeLabel: "0:00 / 6:04",
    trimLabel: "−48 s",
    detected: 9,
    keepBlocks: 5,
    detail: false,
    segments: [],
  },
  {
    id: "cr-lucia-set1",
    projectId: "p-lucia-set1",
    lane: "onia-ig",
    laneLabel: "ONIA · IG",
    title: "Lucía · set 1 corte largo",
    aspect: "9:16",
    origLabel: "0:41",
    finalLabel: "0:24",
    previewLabel: "Preview 360p · cut.mp4",
    timeLabel: "0:00 / 0:24",
    trimLabel: "−17 s",
    detected: 7,
    keepBlocks: 3,
    detail: false,
    segments: [],
  },
];

const STUDIO_OVERVIEW: StudioOverview = {
  headerCreditsLabel: creditsLabel(HIGGSFIELD_CREDITS),
  headerCreditUnit: "cr",
  plan: "ultra",
  spendMonthLabel: formatBs(1240, { compact: true }),
  spendTodayLabel: `hoy ${formatBs(42.8)}`,
  pipeline: [
    { index: 1, name: "Recibir / Subir", tool: "yt-dlp · Telegram · ffprobe", count: "2 crudos en espera", state: "done" },
    { index: 2, name: "Transcribir", tool: "Speaches · faster-whisper-small", count: "1 en proceso", state: "done" },
    { index: 3, name: "Cut-list", tool: "cut-plan.mjs · regla de oro", count: "3 esperando tu OK", state: "active", gate: true },
    { index: 4, name: "Subtítulos", tool: "embedded-captions · karaoke", count: "1 en cola", state: "todo" },
    { index: 5, name: "Render", tool: "HyperFrames · SFX", count: "2 renderizando", state: "todo" },
    { index: 6, name: "Publicar", tool: "handoff n8n · redes", count: "4 listos p/ publicar", state: "todo" },
  ],
  kpis: {
    higgsfieldCreditsLabel: creditsLabel(HIGGSFIELD_CREDITS),
    higgsfieldUsedLabel: "plan ultra · 246 usados",
    spendMonthLabel: formatBs(1240, { compact: true }),
    spendTodayLabel: `hoy ${formatBs(42.8)}`,
    cutQueue: 3,
    videosReady: 4,
    videosReadyHint: "listos p/ publicar",
    inProcess: 2,
    inProcessHint: "render · ~4 min",
    savingsLabel: formatBs(9600, { compact: true }),
    savingsHint: "estimado · mes",
  },
};

export async function getStudioOverview(): Promise<StudioOverview> {
  return STUDIO_OVERVIEW;
}

export async function getEditorProjects(): Promise<EditorProject[]> {
  return EDITOR_PROJECTS;
}

export async function getHiggsfieldAccount(): Promise<HiggsfieldAccount> {
  return HIGGSFIELD_ACCOUNT;
}

export async function getCutQueue(): Promise<CutReview[]> {
  return CUT_QUEUE;
}
