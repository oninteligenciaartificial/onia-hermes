export type VideoLabLane = "cliente" | "onia" | "sergio";

export type VideoLabStatus =
  | "waiting_approval"
  | "approved_for_generation"
  | "generating"
  | "generated"
  | "avatar_review_pending"
  | "needs_revision"
  | "approved_for_publish"
  | "published";

export type VideoLabJob = {
  id: string;
  title: string;
  lane: VideoLabLane;
  format: string;
  model: string;
  status: VideoLabStatus;
  statusLabel: string;
  aspectRatio: string;
  durationS: number;
  creditsEstimated: number;
  creditsUsed?: number;
  previewUrl?: string;
  thumbnailHint: string;
  gate?: string;
  approveCommand: string;
  updatedAt: string;
  note?: string;
};

export type VideoLabLaneSummary = {
  id: VideoLabLane;
  label: string;
  blurb: string;
  jobCount: number;
};

export type VideoLabSnapshot = {
  generatedAt: string;
  videoLabRoot: string;
  counts: {
    total: number;
    waiting: number;
    generating: number;
    ready: number;
    published: number;
    creditsEstimated: number;
  };
  lanes: VideoLabLaneSummary[];
  jobs: VideoLabJob[];
  pipeline: Array<{ status: VideoLabStatus; label: string; detail: string }>;
  safety: string[];
  commands: Array<{ label: string; command: string; purpose: string }>;
};

const GENERATED_AT = "2026-07-04T00:00:00.000Z";

const STATUS_LABEL: Record<VideoLabStatus, string> = {
  waiting_approval: "Esperando aprobación",
  approved_for_generation: "Aprobado para generar",
  generating: "Generando",
  generated: "Listo para revisar",
  avatar_review_pending: "Revisión de identidad",
  needs_revision: "Necesita cambios",
  approved_for_publish: "Aprobado para publicar",
  published: "Publicado",
};

type JobSeed = {
  id: string;
  title: string;
  lane: VideoLabLane;
  format: string;
  model: string;
  status: VideoLabStatus;
  aspectRatio: string;
  durationS: number;
  creditsEstimated: number;
  creditsUsed?: number;
  thumbnailHint: string;
  gate?: string;
  updatedAt: string;
  note?: string;
};

const JOB_SEED: JobSeed[] = [
  {
    id: "vf-cafe-luna-001",
    title: "Café Luna — 2x1 los miércoles",
    lane: "cliente",
    format: "ugc-ad",
    model: "marketing_studio_video",
    status: "waiting_approval",
    aspectRatio: "9:16",
    durationS: 15,
    creditsEstimated: 120,
    thumbnailHint: "Hook del problema, demo de la oferta y CTA a WhatsApp",
    gate: "Aprobar brief + costo antes de generar",
    updatedAt: "2026-07-04T09:10:00Z",
    note: "Lane cliente: no se gasta un crédito sin brief aprobado.",
  },
  {
    id: "vf-reel-onia-014",
    title: "Reel Onia — la IA que hace seguimiento sola",
    lane: "onia",
    format: "reel-onia",
    model: "seedance_2_0",
    status: "generated",
    aspectRatio: "9:16",
    durationS: 8,
    creditsEstimated: 40,
    creditsUsed: 38,
    thumbnailHint: "Hook educativo + explicación visual del seguimiento automático",
    gate: "Revisar preview antes de publicar",
    updatedAt: "2026-07-04T08:40:00Z",
  },
  {
    id: "vf-sergio-007",
    title: "Sergio — building in public, sesión de trabajo",
    lane: "sergio",
    format: "sergio-talking-head",
    model: "seedance_2_0",
    status: "avatar_review_pending",
    aspectRatio: "9:16",
    durationS: 5,
    creditsEstimated: 25,
    thumbnailHint: "Still identidad-lock listo; motion mínimo pendiente de aprobación",
    gate: "Confirmar identidad de Sergio (cara) antes de animar",
    updatedAt: "2026-07-04T08:05:00Z",
    note: "Nunca se marca identity_ok en automático.",
  },
  {
    id: "vf-reel-onia-013",
    title: "Reel Onia — antes y después de automatizar",
    lane: "onia",
    format: "reel-onia",
    model: "seedance_2_0",
    status: "generating",
    aspectRatio: "9:16",
    durationS: 8,
    creditsEstimated: 40,
    thumbnailHint: "Comparación before/after del proceso con y sin sistema",
    updatedAt: "2026-07-04T09:25:00Z",
  },
  {
    id: "vf-vital-clinic-004",
    title: "Vital Clinic — mensajes que no se pierden",
    lane: "cliente",
    format: "ugc-ad",
    model: "marketing_studio_video",
    status: "published",
    aspectRatio: "9:16",
    durationS: 15,
    creditsEstimated: 120,
    creditsUsed: 118,
    thumbnailHint: "Problema de consultas perdidas + seguimiento ordenado + CTA",
    updatedAt: "2026-07-03T19:30:00Z",
    note: "Publicado tras aprobación explícita de Sergio.",
  },
  {
    id: "vf-sergio-006",
    title: "Sergio — lección de Onia en 30 segundos",
    lane: "sergio",
    format: "sergio-talking-head",
    model: "seedance_2_0",
    status: "needs_revision",
    aspectRatio: "9:16",
    durationS: 5,
    creditsEstimated: 25,
    thumbnailHint: "Talking head; se rechazó por leve deriva facial",
    gate: "Regenerar still antes de volver a animar",
    updatedAt: "2026-07-03T21:15:00Z",
  },
];

const LANE_BLURB: Record<VideoLabLane, string> = {
  cliente: "Ads vendibles. Gate de brief + costo antes de gastar créditos.",
  onia: "Contenido propio. Auto hasta el preview; revisión antes de publicar.",
  sergio: "Founder-led. Auto hasta el still, gate de identidad siempre.",
};

const WAITING: VideoLabStatus[] = ["waiting_approval", "avatar_review_pending", "needs_revision"];
const READY: VideoLabStatus[] = ["generated", "approved_for_publish"];

export async function getVideoLabSnapshot(): Promise<VideoLabSnapshot> {
  const jobs: VideoLabJob[] = JOB_SEED.map((seed) => ({
    ...seed,
    statusLabel: STATUS_LABEL[seed.status],
    approveCommand: buildApproveCommand(seed),
  }));

  const lanes: VideoLabLaneSummary[] = (["cliente", "onia", "sergio"] as VideoLabLane[]).map((id) => ({
    id,
    label: id === "onia" ? "Onia" : id.charAt(0).toUpperCase() + id.slice(1),
    blurb: LANE_BLURB[id],
    jobCount: jobs.filter((job) => job.lane === id).length,
  }));

  return {
    generatedAt: new Date().toISOString(),
    videoLabRoot: ".hermes/video-lab",
    counts: {
      total: jobs.length,
      waiting: jobs.filter((job) => WAITING.includes(job.status)).length,
      generating: jobs.filter((job) => job.status === "generating").length,
      ready: jobs.filter((job) => READY.includes(job.status)).length,
      published: jobs.filter((job) => job.status === "published").length,
      creditsEstimated: jobs.reduce((sum, job) => sum + job.creditsEstimated, 0),
    },
    lanes,
    jobs,
    pipeline: [
      { status: "waiting_approval", label: "Espera", detail: "Brief creado, pendiente de aprobación." },
      { status: "generating", label: "Genera", detail: "Higgsfield produce el video (async)." },
      { status: "generated", label: "Revisa", detail: "Preview listo para revisión humana." },
      { status: "published", label: "Publica", detail: "Solo con aprobación explícita." },
    ],
    safety: [
      "Higgsfield nunca publica: la publicación es un paso aparte, solo con aprobación.",
      "Cara o voz de Sergio/cliente nunca sin consentimiento; gate de identidad obligatorio.",
      "Costo estimado obligatorio antes de generar en la lane cliente.",
      "Idempotencia por hash: no se regenera ni se gasta dos veces el mismo brief.",
    ],
    commands: [
      { label: "Plan de una pieza", command: "vf plan --intake data/intakes/<slug>.json", purpose: "Modelo, costo estimado y gates antes de generar." },
      { label: "Radar de modelos", command: "vf radar --kind models", purpose: "Snapshot vigente de modelos Higgsfield." },
      { label: "Aprobar (Telegram)", command: "Aprobar video <job_id>", purpose: "Libera la generación o la publicación tras revisión." },
    ],
  };
}

function buildApproveCommand(seed: JobSeed): string {
  if (seed.status === "waiting_approval" || seed.status === "approved_for_generation") {
    return `Aprobar video ${seed.id}`;
  }
  if (seed.status === "avatar_review_pending") {
    return `Confirmar identidad ${seed.id}`;
  }
  if (seed.status === "needs_revision") {
    return `Rehacer video ${seed.id}: <cambio>`;
  }
  if (seed.status === "generated" || seed.status === "approved_for_publish") {
    return `Publicar video ${seed.id}`;
  }
  return `Estado ${seed.id}`;
}
