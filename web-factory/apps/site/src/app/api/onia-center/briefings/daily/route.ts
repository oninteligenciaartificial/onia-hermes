import { NextResponse } from "next/server";
import { sergioMeetingWindows, sergioStrictScheduleBlocks } from "@/app/onia-center/operating-source";
import { operationalServices } from "@/app/onia-center/source";
import type { RoleId } from "@/app/onia-center/types";
import {
  createOniaCenterEntity,
  getMissingOniaCenterConfig,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
  type RuntimeLead,
  type RuntimeSnapshot,
  type RuntimeTask,
} from "@/lib/onia-center-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DailyAudience = Extract<RoleId, "sergio" | "arthur" | "seller" | "freelancer">;

type DailyBriefingRequest = {
  date?: string;
  audiences?: DailyAudience[];
  commit?: boolean;
  source?: string;
};

type DailyBriefingTask = {
  title: string;
  assignedRole: DailyAudience;
  projectId: string;
  priority: "alta" | "media" | "baja";
  timeBlock: string;
  evidence: string;
  reason: string;
  calendarIntent: "focus" | "sales" | "delivery" | "review" | "admin" | "personal";
};

type DailyBriefingRolePlan = {
  role: DailyAudience;
  summary: string;
  topTasks: DailyBriefingTask[];
  reminders: string[];
  blockedBy: string[];
};

type DailyBriefing = {
  date: string;
  timezone: string;
  model: string;
  source: string;
  commit: boolean;
  roles: DailyBriefingRolePlan[];
  calendarBlocks: Array<{
    owner: "sergio" | "arthur" | "seller";
    title: string;
    start: string;
    end: string;
    policy: string;
  }>;
  guardrails: string[];
};

type OpenAIResponse = {
  id?: string;
  output_text?: string;
  output?: Array<{ content?: Array<{ text?: string }> }>;
};

const allowedAudiences: DailyAudience[] = ["sergio", "arthur", "seller", "freelancer"];

// Quita cualquier cantidad de prefijos "[Plan YYYY-MM-DD] " apilados para obtener
// el titulo base real de una tarea. Evita que el briefing diario re-prefije tareas
// que ya vienen de la base con un prefijo previo.
const PLAN_PREFIX_PATTERN = /^(?:\[Plan \d{4}-\d{2}-\d{2}\]\s*)+/;

function basePlanTitle(title: string) {
  return title.replace(PLAN_PREFIX_PATTERN, "").trim();
}

function todayIso() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/La_Paz",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getInternalKey() {
  return process.env.ONIA_CENTER_INTERNAL_API_KEY || process.env.ONIA_DAILY_BRIEFING_API_KEY || "";
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  if (authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }
  return request.headers.get("x-onia-internal-key") || "";
}

function unauthorized(message: string, status = 401) {
  return NextResponse.json({ ok: false, mode: "unauthorized", message, data: null }, { status });
}

function isAuthorized(request: Request) {
  const expected = getInternalKey();
  if (!expected) {
    return { ok: false as const, response: unauthorized("Falta ONIA_CENTER_INTERNAL_API_KEY para ejecutar automatizaciones internas.", 503) };
  }

  const received = getBearerToken(request);
  if (!received || received !== expected) {
    return { ok: false as const, response: unauthorized("Automatizacion interna no autorizada.") };
  }

  return { ok: true as const };
}

function parseAudiences(value: unknown): DailyAudience[] {
  if (!Array.isArray(value) || value.length === 0) {
    return ["sergio", "arthur", "seller"];
  }

  const unique = new Set<DailyAudience>();
  for (const item of value) {
    if (typeof item === "string" && allowedAudiences.includes(item as DailyAudience)) {
      unique.add(item as DailyAudience);
    }
  }

  return unique.size > 0 ? Array.from(unique) : ["sergio", "arthur", "seller"];
}

function activeLeadScore(lead: RuntimeLead) {
  const statusScore: Record<RuntimeLead["status"], number> = {
    nuevo: 5,
    contactado: 4,
    reunion: 3,
    propuesta: 2,
    ganado: 0,
    perdido: 0,
  };
  return statusScore[lead.status] ?? 1;
}

function activeLeadsForRole(snapshot: RuntimeSnapshot, role: DailyAudience) {
  return snapshot.leads
    .filter((lead) => !["ganado", "perdido"].includes(lead.status))
    .filter((lead) => role === "sergio" || lead.owner === role || lead.meetingOwner === role)
    .sort((a, b) => activeLeadScore(b) - activeLeadScore(a))
    .slice(0, 6);
}

function pendingTasksForRole(snapshot: RuntimeSnapshot, role: DailyAudience) {
  return snapshot.tasks
    .filter((task) => task.status !== "done")
    .filter((task) => role === "sergio" || task.assignedRole === role)
    .sort((a, b) => {
      const priority = { alta: 3, media: 2, baja: 1 };
      return priority[b.priority] - priority[a.priority];
    })
    .slice(0, 8);
}

function serviceName(serviceId: string) {
  return operationalServices.find((service) => service.id === serviceId)?.name ?? serviceId;
}

function taskFromLead(lead: RuntimeLead, role: DailyAudience, index: number): DailyBriefingTask {
  return {
    title: `Seguimiento ${lead.company}: ${lead.nextAction || "definir siguiente accion"}`,
    assignedRole: role,
    projectId: "project-webs",
    priority: index === 0 ? "alta" : "media",
    timeBlock: role === "sergio" ? "08:30-10:30" : "manana comercial",
    evidence: "Registrar llamada, mensaje, nota o resultado en ONIA Center.",
    reason: `Lead activo para ${serviceName(lead.serviceId)} con estado ${lead.status}.`,
    calendarIntent: "sales",
  };
}

function taskFromRuntimeTask(task: RuntimeTask, role: DailyAudience): DailyBriefingTask {
  return {
    title: basePlanTitle(task.title),
    assignedRole: role,
    projectId: task.projectId,
    priority: task.priority,
    timeBlock: role === "sergio" ? "13:15-15:15" : "bloque asignado",
    evidence: task.evidence || "Subir evidencia o mover a revision.",
    reason: `Tarea pendiente en estado ${task.status}.`,
    calendarIntent: task.projectId === "project-content" ? "delivery" : "focus",
  };
}

function baseTasksForRole(snapshot: RuntimeSnapshot, role: DailyAudience): DailyBriefingTask[] {
  const leadTasks = activeLeadsForRole(snapshot, role).slice(0, role === "sergio" ? 2 : 3).map((lead, index) => taskFromLead(lead, role, index));
  const runtimeTasks = pendingTasksForRole(snapshot, role).slice(0, role === "sergio" ? 3 : 4).map((task) => taskFromRuntimeTask(task, role));

  if (role === "sergio") {
    return [
      {
        title: "Plan CEO: caja, ventas y 3 prioridades del dia",
        assignedRole: "sergio" as const,
        projectId: "project-onia-center",
        priority: "alta",
        timeBlock: "07:00-07:30",
        evidence: "Registrar nota de cierre o bloqueo critico.",
        reason: "Protege foco y evita llenar el dia con backlog.",
        calendarIntent: "admin",
      } satisfies DailyBriefingTask,
      ...leadTasks,
      ...runtimeTasks,
      {
        title: "Cierre operativo: actualizar ONIA Center antes de apagar trabajo",
        assignedRole: "sergio" as const,
        projectId: "project-onia-center",
        priority: "media",
        timeBlock: "16:30-17:15",
        evidence: "Notas, tareas y decisiones registradas.",
        reason: "Si no queda registrado, no cuenta para seguimiento.",
        calendarIntent: "review",
      } satisfies DailyBriefingTask,
    ].slice(0, 6);
  }

  if (role === "arthur") {
    return [
      ...leadTasks,
      ...runtimeTasks,
      {
        title: "Subir evidencia de llamadas, briefs o mejoras internas",
        assignedRole: "arthur" as const,
        projectId: "project-onia-center",
        priority: "alta",
        timeBlock: "cierre del dia",
        evidence: "Evidencia en ONIA Center o Notion.",
        reason: "Regla 60 dias: si no esta registrado, no cuenta.",
        calendarIntent: "review",
      } satisfies DailyBriefingTask,
    ].slice(0, 6);
  }

  if (role === "seller") {
    return [
      ...leadTasks,
      {
        title: "Actualizar CRM: proxima accion para cada lead abierto",
        assignedRole: "seller" as const,
        projectId: "project-webs",
        priority: "alta",
        timeBlock: "inicio de turno",
        evidence: "Cada lead debe tener estado, servicio recomendado y proxima accion.",
        reason: "Sin CRM no hay comision ni seguimiento.",
        calendarIntent: "sales",
      } satisfies DailyBriefingTask,
      {
        title: "Enviar resumen de llamadas y objeciones del dia",
        assignedRole: "seller" as const,
        projectId: "project-onia-center",
        priority: "media",
        timeBlock: "cierre de turno",
        evidence: "Nota con llamadas, objeciones, interesados y bloqueos.",
        reason: "Permite a Sergio o Arthur acompanar cierres importantes.",
        calendarIntent: "review",
      } satisfies DailyBriefingTask,
    ].slice(0, 5);
  }

  return runtimeTasks.slice(0, 4);
}

function deterministicBriefing(snapshot: RuntimeSnapshot, date: string, audiences: DailyAudience[], commit: boolean, source: string, model: string): DailyBriefing {
  return {
    date,
    timezone: "America/La_Paz",
    model,
    source,
    commit,
    roles: audiences.map((role) => {
      const topTasks = baseTasksForRole(snapshot, role);
      return {
        role,
        summary: `${topTasks.length} tareas sugeridas para ${role}.`,
        topTasks,
        reminders:
          role === "sergio"
            ? ["No reuniones fuera de ventana.", "No Higgsfield ni premium sin brief aprobado.", "Maximo 3 prioridades reales antes de abrir backlog."]
            : ["Registrar evidencia.", "No prometer descuentos ni cambios de precio.", "Escalar bloqueos comerciales a Sergio."],
        blockedBy: [],
      };
    }),
    calendarBlocks: sergioStrictScheduleBlocks
      .filter((block) => ["planning", "sales", "deep_work", "meetings", "admin"].includes(block.category))
      .slice(0, 9)
      .map((block) => ({
        owner: "sergio",
        title: block.title,
        start: block.start,
        end: block.end,
        policy: block.meetingPolicy,
      })),
    guardrails: [
      "n8n agenda y registra; no aprueba pagos, descuentos, publicaciones ni contacto sensible.",
      "Sergio aprueba decisiones privadas, pagos, comisiones y uso premium.",
      "Arthur y vendedoras ven solo tareas, leads y evidencia que les corresponde.",
      "Google Calendar solo se escribe cuando el workflow tenga OAuth aprobado.",
    ],
  };
}

function getOpenAIConfig() {
  const provider = (process.env.ONIA_ASSISTANT_PROVIDER || "openai").trim().toLowerCase();
  const apiKey = process.env.OPENAI_ONIA_CENTER_API_KEY || process.env.OPENAI_API_KEY || "";
  const model =
    process.env.ONIA_DAILY_BRIEFING_MODEL ||
    process.env.ONIA_FAST_MODEL ||
    process.env.OPENAI_ONIA_CENTER_MODEL ||
    process.env.OPENAI_MODEL ||
    "gpt-5.4-mini";
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");

  return { enabled: provider === "openai" && Boolean(apiKey), apiKey, model, baseUrl };
}

function extractOpenAIText(payload: OpenAIResponse) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const parts =
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter((text): text is string => Boolean(text?.trim())) ?? [];

  return parts.join("\n").trim();
}

function normalizeJsonCandidate(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced?.[1]?.trim() || trimmed;
}

async function improveBriefingWithOpenAI(base: DailyBriefing, snapshot: RuntimeSnapshot) {
  const config = getOpenAIConfig();
  if (!config.enabled) {
    return base;
  }

  const response = await fetch(`${config.baseUrl}/responses`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      instructions: [
        "Eres el planificador diario interno de ONIA Center.",
        "Devuelve exclusivamente JSON valido con la misma forma del briefing recibido.",
        "No inventes clientes, pagos, precios ni aprobaciones.",
        "Prioriza ventas, entrega real, evidencia y calendario saludable.",
        "Sergio ve tareas privadas. Arthur ve operacion propia. Vendedoras ven CRM, llamadas, notas y comisiones propias.",
        "No apruebes pagos, descuentos, gastos, publicaciones, reuniones fuera de ventana ni uso premium.",
      ].join("\n"),
      input: JSON.stringify({
        baseBriefing: base,
        runtimeCounts: {
          leads: snapshot.leads.length,
          tasks: snapshot.tasks.length,
          ideas: snapshot.ideas.length,
          reviews: snapshot.reviews.length,
          codexJobs: snapshot.codexJobs.length,
        },
        meetingWindows: sergioMeetingWindows,
      }),
      max_output_tokens: Number.parseInt(process.env.ONIA_DAILY_BRIEFING_MAX_OUTPUT_TOKENS || "2200", 10),
      store: false,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return base;
  }

  const payload = (await response.json()) as OpenAIResponse;
  const text = extractOpenAIText(payload);
  if (!text) {
    return base;
  }

  try {
    const parsed = JSON.parse(normalizeJsonCandidate(text)) as DailyBriefing;
    return {
      ...base,
      ...parsed,
      model: config.model,
      commit: base.commit,
      source: base.source,
    };
  } catch {
    return base;
  }
}

async function commitBriefing(briefing: DailyBriefing, snapshot: RuntimeSnapshot) {
  const createdTasks = [];
  const createdNotes = [];
  const skippedTasks = [];
  const skippedNotes = [];
  // Deduplicamos por titulo BASE (sin prefijos "[Plan ...]"). Asi una tarea creada
  // cualquier dia anterior nunca se vuelve a crear y el prefijo nunca se apila.
  const existingTaskBaseTitles = new Set(snapshot.tasks.map((task) => basePlanTitle(task.title)));
  const existingNoteTitles = new Set(snapshot.notes.map((note) => note.title));

  for (const rolePlan of briefing.roles) {
    for (const task of rolePlan.topTasks) {
      const baseTitle = basePlanTitle(task.title);
      if (!baseTitle) {
        continue;
      }
      if (existingTaskBaseTitles.has(baseTitle)) {
        skippedTasks.push({ title: baseTitle, assignedRole: task.assignedRole, reason: "already_exists" });
        continue;
      }

      // Un solo prefijo de fecha, sobre el titulo base. Nunca se apila.
      const title = `[Plan ${briefing.date}] ${baseTitle}`;
      const created = await createOniaCenterEntity("task", {
        projectId: task.projectId,
        title,
        assignedRole: task.assignedRole,
        status: "todo",
        priority: task.priority,
        evidence: task.evidence,
        createdAt: new Date().toISOString(),
      });
      createdTasks.push(created);
      existingTaskBaseTitles.add(baseTitle);
    }

    const noteTitle = `[Briefing diario ${briefing.date}] ${rolePlan.role}`;
    if (existingNoteTitles.has(noteTitle)) {
      skippedNotes.push({ title: noteTitle, actorRole: rolePlan.role, reason: "already_exists" });
      continue;
    }

    const note = await createOniaCenterEntity("note", {
      kind: "nota",
      title: noteTitle,
      detail: [rolePlan.summary, ...rolePlan.reminders.map((reminder) => `- ${reminder}`)].join("\n"),
      linkedTo: "daily-briefing",
      actorRole: rolePlan.role,
      visibility: rolePlan.role === "sergio" ? "sergio_private" : rolePlan.role === "seller" ? "seller_safe" : "assigned_only",
      createdAt: new Date().toISOString(),
    });
    createdNotes.push(note);
    existingNoteTitles.add(noteTitle);
  }

  return { createdTasks, createdNotes, skippedTasks, skippedNotes };
}

export async function POST(request: Request) {
  const authorization = isAuthorized(request);
  if (!authorization.ok) {
    return authorization.response;
  }

  if (!isOniaCenterConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        mode: "configuration_pending",
        message: "ONIA Center necesita Supabase server-side antes de ejecutar briefing diario.",
        missingConfiguration: getMissingOniaCenterConfig(),
        data: null,
      },
      { status: 200 },
    );
  }

  let payload: DailyBriefingRequest = {};
  try {
    payload = (await request.json()) as DailyBriefingRequest;
  } catch {
    return NextResponse.json({ ok: false, mode: "bad_request", message: "El cuerpo debe ser JSON valido.", data: null }, { status: 400 });
  }

  const date = payload.date?.trim() || todayIso();
  const audiences = parseAudiences(payload.audiences);
  const commit = Boolean(payload.commit);
  const source = payload.source || "n8n";
  const config = getOpenAIConfig();

  try {
    const snapshot = await getOniaCenterRuntime();
    const base = deterministicBriefing(snapshot, date, audiences, commit, source, config.model);
    const briefing = await improveBriefingWithOpenAI(base, snapshot);
    const result = commit ? await commitBriefing(briefing, snapshot) : { createdTasks: [], createdNotes: [], skippedTasks: [], skippedNotes: [] };

    return NextResponse.json({
      ok: true,
      mode: commit ? "daily_briefing_committed" : "daily_briefing_dry_run",
      message: commit ? "Briefing diario creado y registrado en ONIA Center." : "Briefing diario generado en modo prueba.",
      model: briefing.model,
      data: briefing,
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo generar briefing diario.";
    return NextResponse.json({ ok: false, mode: "daily_briefing_error", message, data: null }, { status: 500 });
  }
}
