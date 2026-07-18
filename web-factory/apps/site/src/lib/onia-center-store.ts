import type { RoleId } from "@/app/onia-center/types";

export type RuntimeLead = {
  id: string;
  company: string;
  contact: string;
  source: string;
  serviceId: string;
  status: "nuevo" | "contactado" | "reunion" | "propuesta" | "ganado" | "perdido";
  nextAction: string;
  owner: RoleId;
  ownerUserKey?: string;
  originUserKey?: string;
  meetingOwner: RoleId;
  meetingOwnerUserKey?: string;
  meetingOwnerLabel?: string;
  meetingWindow?: string;
  meetingStatus?: "pendiente" | "solicitada" | "confirmada" | "cancelada";
  createdAt: string;
};

export type RuntimeTask = {
  id: string;
  projectId: string;
  title: string;
  assignedRole: RoleId;
  status: "todo" | "doing" | "review" | "done" | "blocked";
  priority: "alta" | "media" | "baja";
  evidence: string;
  assignedUserKey?: string;
  createdAt: string;
};

export type RuntimeReview = {
  id: string;
  source: string;
  title: string;
  type: string;
  sensitivity: "public_safe" | "internal" | "sensitive" | "rejected";
  status: "pendiente" | "aprobado" | "rechazado" | "importado";
};

export type RuntimeNote = {
  id: string;
  kind: "llamada" | "nota" | "cobro" | "bloqueo" | "idea" | "evidencia" | "actualizacion_servicio";
  title: string;
  detail: string;
  linkedTo: string;
  actorRole?: RoleId;
  actorUserKey?: string;
  visibility?: "sergio_private" | "assigned_only" | "team_safe" | "seller_safe";
  createdAt: string;
};

export type RuntimeIdea = {
  id: string;
  title: string;
  url: string;
  source: "instagram" | "tiktok" | "youtube" | "web" | "cliente" | "otro";
  category: "contenido" | "venta" | "producto" | "automatizacion" | "bolivian" | "web" | "chatbot" | "operacion";
  summary: string;
  whyUseful: string;
  targetProjectId: string;
  owner: RoleId;
  ownerUserKey?: string;
  visibility: "sergio_private" | "assigned_only" | "team_safe";
  reviewTool: "codex" | "claude" | "self_hosted" | "manual";
  status: "inbox" | "queued" | "reviewed" | "approved" | "archived";
  createdAt: string;
};

export type RuntimeCodexJob = {
  id: string;
  title: string;
  projectId: string;
  targetRepo: string;
  requestType: "feature" | "bugfix" | "audit" | "docs" | "refactor" | "ops";
  owner: RoleId;
  ownerUserKey?: string;
  visibility: "sergio_private" | "internal_restricted";
  risk: "bajo" | "medio" | "alto";
  status: "draft" | "ready" | "in_codex" | "review" | "done" | "blocked";
  context: string;
  files: string;
  acceptance: string;
  validation: string;
  evidence: string;
  createdAt: string;
};

export type RuntimeSnapshot = {
  leads: RuntimeLead[];
  tasks: RuntimeTask[];
  reviews: RuntimeReview[];
  notes: RuntimeNote[];
  ideas: RuntimeIdea[];
  codexJobs: RuntimeCodexJob[];
};

export type RuntimeEntity = "lead" | "task" | "review" | "note" | "idea" | "codex_job";

type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
  schema: string;
};

type DbLead = {
  lead_key: string;
  company_name: string;
  public_contact: string | null;
  channel: string;
  source: string | null;
  owner_role_key: string | null;
  pipeline_status: string;
  suggested_service_key: string | null;
  private_notes: string | null;
  raw: Record<string, unknown> | null;
  created_at: string;
};

type DbTask = {
  task_key: string;
  project_key: string;
  title: string;
  status: string;
  priority: RuntimeTask["priority"];
  assigned_role_key: string;
  evidence_required: boolean;
  raw: Record<string, unknown> | null;
  created_at: string;
};

type DbReview = {
  review_key: string;
  source_type: string;
  source_key: string;
  title: string;
  status: string;
  sensitive: boolean;
};

type DbNote = {
  audit_key: string;
  actor_role_key: string;
  summary: string;
  raw: Record<string, unknown> | null;
  created_at: string;
};

type DbIdea = {
  idea_key: string;
  title: string;
  source_type: RuntimeIdea["source"];
  source_url: string | null;
  category: RuntimeIdea["category"];
  summary: string;
  why_useful: string;
  target_project_key: string | null;
  owner_role_key: string;
  visibility_scope: RuntimeIdea["visibility"];
  review_tool: RuntimeIdea["reviewTool"];
  status: RuntimeIdea["status"];
  raw: Record<string, unknown> | null;
  created_at: string;
};

type DbCodexJobLog = DbNote;

const serviceIdToKey: Record<string, string> = {
  "onia-motor-local-growth": "onia_motor_local_growth",
  "onia-motor-local-starter": "onia_motor_local_starter",
  "onia-motor-local-pro": "onia_motor_local_pro",
  "web-pro-onia": "web_pro_onia",
};

const serviceKeyToId = Object.fromEntries(Object.entries(serviceIdToKey).map(([id, key]) => [key, id]));

const projectIdToKey: Record<string, string> = {
  "project-onia-center": "onia_center",
  "project-dentagest": "dentagest",
  "project-gestios": "gestios",
  "project-webs": "webs_onia",
  "project-chatbots": "chatbots",
  "project-automations": "automations",
  "project-bolivian-os": "bolivian_electric_os",
  "project-content": "content_onia",
  "project-stockcam": "stockcam",
};

const projectKeyToId = Object.fromEntries(Object.entries(projectIdToKey).map(([id, key]) => [key, id]));

function roleToDb(role: RoleId) {
  return role === "area" ? "area_responsible" : role;
}

function roleFromDb(role: string | null | undefined): RoleId {
  if (role === "area_responsible" || role === "area") {
    return "area";
  }

  if (role === "sergio" || role === "arthur" || role === "seller" || role === "freelancer") {
    return role;
  }

  return "seller";
}

const leadStatusToDb: Record<RuntimeLead["status"], string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  reunion: "Reunion",
  propuesta: "Propuesta",
  ganado: "Ganado",
  perdido: "Perdido",
};

const dbStatusToLead: Record<string, RuntimeLead["status"]> = {
  Nuevo: "nuevo",
  Contactado: "contactado",
  Reunion: "reunion",
  Reunión: "reunion",
  Propuesta: "propuesta",
  Ganado: "ganado",
  Perdido: "perdido",
};

const taskStatusToDb: Record<RuntimeTask["status"], string> = {
  todo: "todo",
  doing: "in_progress",
  review: "review",
  done: "approved",
  blocked: "blocked",
};

const dbStatusToTask: Record<string, RuntimeTask["status"]> = {
  todo: "todo",
  in_progress: "doing",
  review: "review",
  approved: "done",
  blocked: "blocked",
};

const reviewStatusToDb: Record<RuntimeReview["status"], string> = {
  pendiente: "pending",
  aprobado: "approved",
  rechazado: "rejected",
  importado: "approved",
};

const dbStatusToReview: Record<string, RuntimeReview["status"]> = {
  pending: "pendiente",
  approved: "aprobado",
  rejected: "rechazado",
  needs_changes: "pendiente",
};

function getSupabaseConfig(): SupabaseConfig | null {
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

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
    schema,
  };
}

export function getMissingOniaCenterConfig() {
  const missing: string[] = [];
  if (!(process.env.ONIA_CENTER_SUPABASE_URL || process.env.WEB_FACTORY_SUPABASE_URL || process.env.SUPABASE_URL)) {
    missing.push("ONIA_CENTER_SUPABASE_URL");
  }
  if (
    !(
      process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY ||
      process.env.WEB_FACTORY_SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY
    )
  ) {
    missing.push("ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY");
  }
  return missing;
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(`Falta configuracion: ${getMissingOniaCenterConfig().join(", ")}`);
  }

  const headers = new Headers(init.headers);
  headers.set("apikey", config.serviceRoleKey);
  headers.set("authorization", `Bearer ${config.serviceRoleKey}`);
  headers.set("accept-profile", config.schema);
  headers.set("content-profile", config.schema);
  headers.set("content-type", "application/json");

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${response.status}: ${body.slice(0, 500)}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

function serviceToDb(serviceId: string) {
  return serviceIdToKey[serviceId] ?? serviceId.replace(/-/g, "_");
}

function serviceFromDb(serviceKey: string | null) {
  return serviceKey ? serviceKeyToId[serviceKey] ?? serviceKey.replace(/_/g, "-") : "onia-motor-local-growth";
}

function projectToDb(projectId: string) {
  return projectIdToKey[projectId] ?? projectId.replace(/^project-/, "").replace(/-/g, "_");
}

function projectFromDb(projectKey: string | null) {
  return projectKey ? projectKeyToId[projectKey] ?? `project-${projectKey.replace(/_/g, "-")}` : "project-onia-center";
}

function makeKey(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Legacy auto-generated titles looked like "[Plan 2026-07-04] ...",
// "[Briefing diario 2026-07-04] ..." and "[Higiene 2026-07-04] ...". The daily
// generator re-ingested pending tasks and re-prefixed them, stacking prefixes
// ("[Plan 07-04] [Plan 07-03] ..."). Strip every leading date prefix so titles
// dedup to a stable base and never accumulate.
const GENERATED_TITLE_PREFIX_RE =
  /^(?:\[(?:Plan|Briefing diario|Higiene diaria|Higiene)\s+\d{4}-\d{2}-\d{2}\]\s*)+/;

export function stripPlanPrefixes(title: string): string {
  return title.replace(GENERATED_TITLE_PREFIX_RE, "").trim();
}

// SQL ILIKE patterns (PostgREST maps "*" to "%") that match every task title
// ever produced by the auto-generators. Used by the maintenance cleanup.
export const GENERATED_TASK_TITLE_PATTERNS = ["[Plan *", "[Briefing diario *", "[Higiene *"] as const;

export async function deleteOniaCenterTasksByTitlePatterns(
  patterns: readonly string[] = GENERATED_TASK_TITLE_PATTERNS,
): Promise<{ deleted: number; keys: string[] }> {
  const keys: string[] = [];
  for (const pattern of patterns) {
    const rows = await supabaseRequest<Array<{ task_key: string }>>(
      `tasks?title=ilike.${encodeURIComponent(pattern)}&select=task_key`,
      { method: "DELETE", headers: { prefer: "return=representation" } },
    );
    if (Array.isArray(rows)) {
      for (const row of rows) {
        keys.push(row.task_key);
      }
    }
  }
  return { deleted: keys.length, keys };
}

export async function countOniaCenterTasksByTitlePatterns(
  patterns: readonly string[] = GENERATED_TASK_TITLE_PATTERNS,
): Promise<number> {
  let total = 0;
  for (const pattern of patterns) {
    const rows = await supabaseRequest<Array<{ task_key: string }>>(
      `tasks?title=ilike.${encodeURIComponent(pattern)}&select=task_key`,
    );
    total += Array.isArray(rows) ? rows.length : 0;
  }
  return total;
}

function rawString(raw: Record<string, unknown> | null | undefined, key: string) {
  const value = raw?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function rawRole(raw: Record<string, unknown> | null | undefined, key: string, fallback: RoleId) {
  return roleFromDb(rawString(raw, key) ?? fallback);
}

function mapLead(row: DbLead): RuntimeLead {
  const raw = row.raw ?? {};
  const owner = roleFromDb(row.owner_role_key ?? "sergio");
  return {
    id: row.lead_key,
    company: row.company_name,
    contact: row.public_contact ?? "",
    source: row.source ?? row.channel,
    serviceId: serviceFromDb(row.suggested_service_key),
    status: dbStatusToLead[row.pipeline_status] ?? "nuevo",
    nextAction: row.private_notes ?? "",
    owner,
    ownerUserKey: rawString(raw, "ownerUserKey"),
    originUserKey: rawString(raw, "originUserKey"),
    meetingOwner: rawRole(raw, "meetingOwner", owner),
    meetingOwnerUserKey: rawString(raw, "meetingOwnerUserKey"),
    meetingOwnerLabel: rawString(raw, "meetingOwnerLabel"),
    meetingWindow: rawString(raw, "meetingWindow"),
    meetingStatus: (rawString(raw, "meetingStatus") as RuntimeLead["meetingStatus"]) ?? undefined,
    createdAt: row.created_at,
  };
}

function mapTask(row: DbTask): RuntimeTask {
  const raw = row.raw ?? {};
  return {
    id: row.task_key,
    projectId: projectFromDb(row.project_key),
    title: row.title,
    assignedRole: roleFromDb(row.assigned_role_key),
    status: dbStatusToTask[row.status] ?? "todo",
    priority: row.priority,
    evidence: row.evidence_required ? "pendiente" : "no requerida",
    assignedUserKey: rawString(raw, "assignedUserKey"),
    createdAt: row.created_at,
  };
}

function mapReview(row: DbReview): RuntimeReview {
  return {
    id: row.review_key,
    source: row.source_key,
    title: row.title,
    type: row.source_type,
    sensitivity: row.sensitive ? "sensitive" : "internal",
    status: dbStatusToReview[row.status] ?? "pendiente",
  };
}

function mapNote(row: DbNote): RuntimeNote {
  const raw = row.raw ?? {};
  return {
    id: row.audit_key,
    kind: typeof raw.kind === "string" ? (raw.kind as RuntimeNote["kind"]) : "nota",
    title: typeof raw.title === "string" ? raw.title : row.summary,
    detail: typeof raw.detail === "string" ? raw.detail : "",
    linkedTo: typeof raw.linkedTo === "string" ? raw.linkedTo : "",
    actorRole: roleFromDb(row.actor_role_key),
    actorUserKey: rawString(raw, "actorUserKey"),
    visibility: typeof raw.visibility === "string" ? (raw.visibility as RuntimeNote["visibility"]) : undefined,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : row.created_at,
  };
}

function mapIdea(row: DbIdea): RuntimeIdea {
  const raw = row.raw ?? {};
  return {
    id: row.idea_key,
    title: row.title,
    url: row.source_url ?? "",
    source: row.source_type,
    category: row.category,
    summary: row.summary,
    whyUseful: row.why_useful,
    targetProjectId: projectFromDb(row.target_project_key),
    owner: roleFromDb(row.owner_role_key),
    ownerUserKey: rawString(raw, "ownerUserKey"),
    visibility: row.visibility_scope,
    reviewTool: row.review_tool,
    status: row.status,
    createdAt: row.created_at,
  };
}

function codexJobValue<T extends string>(raw: Record<string, unknown>, key: string, fallback: T): T {
  const value = raw[key];
  return typeof value === "string" && value.trim() ? (value.trim() as T) : fallback;
}

function mapCodexJob(row: DbCodexJobLog): RuntimeCodexJob {
  const raw = row.raw ?? {};
  return {
    id: typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : row.audit_key,
    title: typeof raw.title === "string" && raw.title.trim() ? raw.title.trim() : row.summary,
    projectId: codexJobValue(raw, "projectId", "project-onia-center"),
    targetRepo: codexJobValue(raw, "targetRepo", "onia-hermes"),
    requestType: codexJobValue(raw, "requestType", "feature"),
    owner: rawRole(raw, "owner", roleFromDb(row.actor_role_key)),
    ownerUserKey: rawString(raw, "ownerUserKey"),
    visibility: codexJobValue(raw, "visibility", "sergio_private"),
    risk: codexJobValue(raw, "risk", "medio"),
    status: codexJobValue(raw, "status", "draft"),
    context: codexJobValue(raw, "context", ""),
    files: codexJobValue(raw, "files", ""),
    acceptance: codexJobValue(raw, "acceptance", ""),
    validation: codexJobValue(raw, "validation", ""),
    evidence: codexJobValue(raw, "evidence", ""),
    createdAt: typeof raw.createdAt === "string" && raw.createdAt.trim() ? raw.createdAt.trim() : row.created_at,
  };
}

function ownerMatches(recordRole: RoleId | undefined, recordUserKey: string | undefined, actor: { role: RoleId; userKey: string }) {
  if (actor.role === "sergio") {
    return true;
  }

  if (recordUserKey) {
    return recordUserKey === actor.userKey;
  }

  return recordRole === actor.role;
}

function canActorViewIdea(idea: RuntimeIdea, actor: { role: RoleId; userKey: string }) {
  if (actor.role === "sergio") {
    return true;
  }

  if (idea.visibility === "team_safe") {
    return true;
  }

  return idea.visibility === "assigned_only" && ownerMatches(idea.owner, idea.ownerUserKey, actor);
}

function canActorViewNote(note: RuntimeNote, actor: { role: RoleId; userKey: string }) {
  if (actor.role === "sergio") {
    return true;
  }

  if (note.visibility === "team_safe") {
    return true;
  }

  if (note.visibility === "seller_safe") {
    return actor.role === "area" || actor.role === "arthur" || actor.role === "seller";
  }

  if (note.visibility === "assigned_only") {
    return ownerMatches(note.actorRole, note.actorUserKey, actor);
  }

  return ownerMatches(note.actorRole, note.actorUserKey, actor);
}

function canActorViewCodexJob(job: RuntimeCodexJob, actor: { role: RoleId; userKey: string }) {
  if (actor.role === "sergio") {
    return true;
  }

  if (actor.role !== "arthur") {
    return false;
  }

  if (job.visibility === "internal_restricted") {
    return true;
  }

  return ownerMatches(job.owner, job.ownerUserKey, actor);
}

export function filterOniaCenterRuntimeForActor(snapshot: RuntimeSnapshot, actor: { role: RoleId; userKey: string }): RuntimeSnapshot {
  if (actor.role === "sergio") {
    return snapshot;
  }

  return {
    leads: snapshot.leads.filter((lead) => ownerMatches(lead.owner, lead.ownerUserKey, actor)),
    tasks: snapshot.tasks.filter((task) => ownerMatches(task.assignedRole, task.assignedUserKey, actor)),
    reviews: snapshot.reviews.filter((review) => review.sensitivity === "public_safe"),
    notes: snapshot.notes.filter((note) => canActorViewNote(note, actor)),
    ideas: snapshot.ideas.filter((idea) => canActorViewIdea(idea, actor)),
    codexJobs: snapshot.codexJobs.filter((job) => canActorViewCodexJob(job, actor)),
  };
}

export function isOniaCenterConfigured() {
  return Boolean(getSupabaseConfig());
}

export async function getOniaCenterRuntime(): Promise<RuntimeSnapshot> {
  const [leads, tasks, reviews, notes, ideas, codexJobs] = await Promise.all([
    supabaseRequest<DbLead[]>(
      "leads?select=lead_key,company_name,public_contact,channel,source,owner_role_key,pipeline_status,suggested_service_key,private_notes,raw,created_at&order=created_at.desc&limit=80",
    ),
    supabaseRequest<DbTask[]>(
      "tasks?select=task_key,project_key,title,status,priority,assigned_role_key,evidence_required,raw,created_at&order=created_at.desc&limit=120",
    ),
    supabaseRequest<DbReview[]>(
      "review_queue?select=review_key,source_type,source_key,title,status,sensitive&order=created_at.desc&limit=80",
    ),
    supabaseRequest<DbNote[]>(
      "audit_logs?action=eq.runtime_note&select=audit_key,actor_role_key,summary,raw,created_at&order=created_at.desc&limit=80",
    ),
    supabaseRequest<DbIdea[]>(
      "idea_inbox?select=idea_key,title,source_type,source_url,category,summary,why_useful,target_project_key,owner_role_key,visibility_scope,review_tool,status,raw,created_at&order=created_at.desc&limit=120",
    ),
    supabaseRequest<DbCodexJobLog[]>(
      "audit_logs?action=eq.codex_job&select=audit_key,actor_role_key,summary,raw,created_at&order=created_at.desc&limit=80",
    ),
  ]);

  return {
    leads: leads.map(mapLead),
    tasks: tasks.map(mapTask),
    reviews: reviews.map(mapReview),
    notes: notes.map(mapNote),
    ideas: ideas.map(mapIdea),
    codexJobs: codexJobs.map(mapCodexJob),
  };
}

export async function createOniaCenterEntity(entity: RuntimeEntity, payload: unknown) {
  if (entity === "lead") {
    const lead = payload as RuntimeLead;
    const rows = await supabaseRequest<DbLead[]>("leads?select=lead_key,company_name,public_contact,channel,source,owner_role_key,pipeline_status,suggested_service_key,private_notes,raw,created_at", {
      method: "POST",
      headers: { prefer: "return=representation" },
      body: JSON.stringify({
        lead_key: lead.id || makeKey("lead"),
        company_name: lead.company,
        business_type: "pendiente",
        public_contact: lead.contact || null,
        channel: lead.source || "Manual",
        source: lead.source || null,
        contact_permission: "pending",
        origin_role_key: roleToDb(lead.owner),
        owner_role_key: roleToDb(lead.owner),
        pipeline_status: leadStatusToDb[lead.status] ?? "Nuevo",
        suggested_service_key: serviceToDb(lead.serviceId),
        priority: "media",
        private_notes: lead.nextAction || null,
        raw: {
          ...lead,
          ownerUserKey: lead.ownerUserKey,
          originUserKey: lead.originUserKey,
          meetingOwner: lead.meetingOwner ?? lead.owner,
          meetingOwnerUserKey: lead.meetingOwnerUserKey,
          meetingOwnerLabel: lead.meetingOwnerLabel,
          meetingWindow: lead.meetingWindow,
          meetingStatus: lead.meetingStatus ?? "pendiente",
        },
      }),
    });
    return mapLead(rows[0]);
  }

  if (entity === "task") {
    const task = payload as RuntimeTask;
    const rows = await supabaseRequest<DbTask[]>("tasks?select=task_key,project_key,title,status,priority,assigned_role_key,evidence_required,raw,created_at", {
      method: "POST",
      headers: { prefer: "return=representation" },
      body: JSON.stringify({
        task_key: task.id || makeKey("task"),
        project_key: projectToDb(task.projectId),
        title: task.title,
        task_type: "system",
        status: taskStatusToDb[task.status] ?? "todo",
        priority: task.priority,
        assigned_role_key: roleToDb(task.assignedRole),
        reviewer_role_key: "sergio",
        evidence_required: true,
        sensitive: task.assignedRole === "sergio",
        source_system: "onia-center",
        raw: {
          ...task,
          assignedUserKey: task.assignedUserKey,
        },
      }),
    });
    return mapTask(rows[0]);
  }

  if (entity === "note") {
    const note = payload as RuntimeNote & { author?: string; body?: string };
    const summary = note.title || note.body || note.detail || "Nota ONIA Center";
    const sensitivityScope =
      note.visibility === "team_safe"
        ? "collab_safe"
        : note.visibility === "seller_safe"
          ? "seller_basic"
          : note.actorRole === "sergio"
            ? "sergio_private"
            : "internal_restricted";
    const rows = await supabaseRequest<DbNote[]>("audit_logs?select=audit_key,actor_role_key,summary,raw,created_at", {
      method: "POST",
      headers: { prefer: "return=representation" },
      body: JSON.stringify({
        audit_key: note.id || makeKey("note"),
        actor_role_key: roleToDb(note.actorRole ?? "sergio"),
        action: "runtime_note",
        entity_table: "onia_center.runtime_notes",
        entity_key: note.linkedTo || note.id || "unlinked",
        sensitivity_scope: sensitivityScope,
        summary,
        raw: note,
      }),
    });
    return mapNote(rows[0]);
  }

  if (entity === "idea") {
    const idea = payload as RuntimeIdea;
    const rows = await supabaseRequest<DbIdea[]>(
      "idea_inbox?select=idea_key,title,source_type,source_url,category,summary,why_useful,target_project_key,owner_role_key,visibility_scope,review_tool,status,raw,created_at",
      {
        method: "POST",
        headers: { prefer: "return=representation" },
        body: JSON.stringify({
          idea_key: idea.id || makeKey("idea"),
          title: idea.title,
          source_type: idea.source,
          source_url: idea.url || null,
          category: idea.category,
          summary: idea.summary,
          why_useful: idea.whyUseful,
          target_project_key: projectToDb(idea.targetProjectId),
          created_by_role_key: roleToDb(idea.owner),
          owner_role_key: roleToDb(idea.owner),
          visibility_scope: idea.visibility,
          review_tool: idea.reviewTool,
          status: idea.status,
          raw: {
            ...idea,
            ownerUserKey: idea.ownerUserKey,
          },
        }),
      },
    );
    return mapIdea(rows[0]);
  }

  if (entity === "codex_job") {
    const job = payload as RuntimeCodexJob;
    const rows = await supabaseRequest<DbCodexJobLog[]>("audit_logs?select=audit_key,actor_role_key,summary,raw,created_at", {
      method: "POST",
      headers: { prefer: "return=representation" },
      body: JSON.stringify({
        audit_key: job.id || makeKey("codex-job"),
        actor_role_key: roleToDb(job.owner),
        action: "codex_job",
        entity_table: "onia_center.codex_jobs",
        entity_key: job.id || job.title || "unlinked",
        sensitivity_scope: job.visibility,
        summary: `${job.title} / ${job.status}`,
        raw: job,
      }),
    });
    return mapCodexJob(rows[0]);
  }

  throw new Error(`Entidad no soportada para crear: ${entity}`);
}

export async function updateOniaCenterEntityStatus(entity: RuntimeEntity, id: string, status: string, actorRole?: RoleId) {
  if (entity === "lead") {
    const actorFilter = actorRole && actorRole !== "sergio" ? `&owner_role_key=eq.${encodeURIComponent(roleToDb(actorRole))}` : "";
    const rows = await supabaseRequest<DbLead[]>(
      `leads?lead_key=eq.${encodeURIComponent(id)}${actorFilter}&select=lead_key,company_name,public_contact,channel,source,owner_role_key,pipeline_status,suggested_service_key,private_notes,raw,created_at`,
      {
        method: "PATCH",
        headers: { prefer: "return=representation" },
        body: JSON.stringify({ pipeline_status: leadStatusToDb[status as RuntimeLead["status"]] ?? status }),
      },
    );
    if (!rows[0]) {
      throw new Error("Lead no encontrado o no asignado al usuario actual.");
    }
    return mapLead(rows[0]);
  }

  if (entity === "task") {
    const actorFilter = actorRole && actorRole !== "sergio" ? `&assigned_role_key=eq.${encodeURIComponent(roleToDb(actorRole))}` : "";
    const rows = await supabaseRequest<DbTask[]>(
      `tasks?task_key=eq.${encodeURIComponent(id)}${actorFilter}&select=task_key,project_key,title,status,priority,assigned_role_key,evidence_required,raw,created_at`,
      {
        method: "PATCH",
        headers: { prefer: "return=representation" },
        body: JSON.stringify({ status: taskStatusToDb[status as RuntimeTask["status"]] ?? status }),
      },
    );
    if (!rows[0]) {
      throw new Error("Tarea no encontrada o no asignada al usuario actual.");
    }
    return mapTask(rows[0]);
  }

  if (entity === "review") {
    if (actorRole && actorRole !== "sergio") {
      throw new Error("Solo Sergio puede actualizar revisiones.");
    }
    const rows = await supabaseRequest<DbReview[]>(
      `review_queue?review_key=eq.${encodeURIComponent(id)}&select=review_key,source_type,source_key,title,status,sensitive`,
      {
        method: "PATCH",
        headers: { prefer: "return=representation" },
        body: JSON.stringify({ status: reviewStatusToDb[status as RuntimeReview["status"]] ?? status }),
      },
    );
    if (!rows[0]) {
      throw new Error("Revision no encontrada.");
    }
    return mapReview(rows[0]);
  }

  if (entity === "idea") {
    if (actorRole && actorRole !== "sergio" && status === "approved") {
      throw new Error("Solo Sergio puede aprobar ideas.");
    }
    const body: Record<string, string> = { status };
    if (status === "approved") {
      body.reviewed_by_role_key = "sergio";
    }
    const actorFilter = actorRole && actorRole !== "sergio" ? `&owner_role_key=eq.${encodeURIComponent(roleToDb(actorRole))}` : "";
    const rows = await supabaseRequest<DbIdea[]>(
      `idea_inbox?idea_key=eq.${encodeURIComponent(id)}${actorFilter}&select=idea_key,title,source_type,source_url,category,summary,why_useful,target_project_key,owner_role_key,visibility_scope,review_tool,status,raw,created_at`,
      {
        method: "PATCH",
        headers: { prefer: "return=representation" },
        body: JSON.stringify(body),
      },
    );
    if (!rows[0]) {
      throw new Error("Idea no encontrada o no asignada al usuario actual.");
    }
    return mapIdea(rows[0]);
  }

  if (entity === "codex_job") {
    const existingRows = await supabaseRequest<DbCodexJobLog[]>(
      `audit_logs?audit_key=eq.${encodeURIComponent(id)}&action=eq.codex_job&select=audit_key,actor_role_key,summary,raw,created_at&limit=1`,
    );
    const existing = existingRows[0] ? mapCodexJob(existingRows[0]) : null;
    if (!existing) {
      throw new Error("Job Codex no encontrado.");
    }

    if (actorRole && actorRole !== "sergio") {
      if (actorRole !== "arthur" || existing.owner !== "arthur" || !["draft", "blocked"].includes(status)) {
        throw new Error("Solo Sergio puede aprobar, enviar o cerrar jobs Codex.");
      }
    }

    const next = { ...existing, status: status as RuntimeCodexJob["status"] };
    const rows = await supabaseRequest<DbCodexJobLog[]>(
      `audit_logs?audit_key=eq.${encodeURIComponent(id)}&action=eq.codex_job&select=audit_key,actor_role_key,summary,raw,created_at`,
      {
        method: "PATCH",
        headers: { prefer: "return=representation" },
        body: JSON.stringify({
          summary: `${next.title} / ${next.status}`,
          raw: next,
        }),
      },
    );
    return mapCodexJob(rows[0]);
  }

  throw new Error(`Entidad no soportada para actualizar: ${entity}`);
}
