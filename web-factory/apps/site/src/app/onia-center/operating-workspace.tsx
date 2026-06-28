"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Copy,
  Database,
  Dumbbell,
  ExternalLink,
  FileAudio2,
  FileCheck2,
  HardDrive,
  Heart,
  Lightbulb,
  MessageSquareOff,
  Mic,
  Moon,
  Plus,
  RotateCcw,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { formatBs } from "./engine";
import {
  collabIngestionItems,
  commercialBookingPolicy,
  externalAdapters,
  higgsfieldQuietRule,
  operatingProjects,
  operatingTasks,
  sergioAssistantCommands,
  sergioMeetingWindows,
  sergioStrictScheduleBlocks,
} from "./operating-source";
import { operationalServices, vendorCommissionRules } from "./source";
import type { RoleId } from "./types";

type RuntimeLead = {
  id: string;
  company: string;
  contact: string;
  source: string;
  serviceId: string;
  status: "nuevo" | "contactado" | "reunion" | "propuesta" | "ganado" | "perdido";
  nextAction: string;
  owner: RoleId;
  createdAt: string;
};

type RuntimeTask = {
  id: string;
  projectId: string;
  title: string;
  assignedRole: RoleId;
  status: "todo" | "doing" | "review" | "done" | "blocked";
  priority: "alta" | "media" | "baja";
  evidence: string;
  createdAt: string;
};

type RuntimeReview = {
  id: string;
  source: string;
  title: string;
  type: string;
  sensitivity: "public_safe" | "internal" | "sensitive" | "rejected";
  status: "pendiente" | "aprobado" | "rechazado" | "importado";
};

type RuntimeNote = {
  id: string;
  kind: "llamada" | "nota" | "cobro" | "bloqueo" | "idea" | "evidencia" | "actualizacion_servicio";
  title: string;
  detail: string;
  linkedTo: string;
  actorRole?: RoleId;
  visibility?: "sergio_private" | "assigned_only" | "team_safe" | "seller_safe";
  createdAt: string;
};

type RuntimeIdea = {
  id: string;
  title: string;
  url: string;
  source: "instagram" | "tiktok" | "youtube" | "web" | "cliente" | "otro";
  category: "contenido" | "venta" | "producto" | "automatizacion" | "bolivian" | "web" | "chatbot" | "operacion";
  summary: string;
  whyUseful: string;
  targetProjectId: string;
  owner: RoleId;
  visibility: "sergio_private" | "assigned_only" | "team_safe";
  reviewTool: "codex" | "claude" | "self_hosted" | "manual";
  status: "inbox" | "queued" | "reviewed" | "approved" | "archived";
  createdAt: string;
};

type RuntimeCodexJob = {
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

type LeadForm = Omit<RuntimeLead, "id" | "createdAt" | "status">;
type TaskForm = Omit<RuntimeTask, "id" | "createdAt" | "status" | "evidence">;
type NoteForm = Omit<RuntimeNote, "id" | "createdAt" | "actorRole">;
type IdeaForm = Omit<RuntimeIdea, "id" | "createdAt" | "status">;
type CodexJobForm = Omit<RuntimeCodexJob, "id" | "createdAt" | "status" | "ownerUserKey">;
type ServiceUpdateForm = {
  serviceId: string;
  title: string;
  detail: string;
  visibility: "team_safe" | "seller_safe" | "sergio_private";
};
type StorageMode = "checking" | "supabase" | "local";
type RuntimeData = {
  leads: RuntimeLead[];
  tasks: RuntimeTask[];
  reviews: RuntimeReview[];
  notes: RuntimeNote[];
  ideas: RuntimeIdea[];
  codexJobs: RuntimeCodexJob[];
};
type RuntimeApiResponse<T = RuntimeData> = {
  ok: boolean;
  mode: "supabase" | "configuration_pending" | "supabase_error" | "auth_required" | "auth_error" | "forbidden";
  message: string;
  missingConfiguration?: string[];
  data: T | null;
};
type AssistantApiResponse = {
  ok: boolean;
  mode:
    | "dify"
    | "openai"
    | "dify_not_configured"
    | "openai_not_configured"
    | "assistant_not_configured"
    | "dify_error"
    | "openai_error"
    | "configuration_pending"
    | "auth_required"
    | "auth_error"
    | "forbidden"
    | "bad_request";
  message?: string;
  answer: string | null;
  model?: string;
};
type AudioObjective = "propuesta" | "acta" | "seguimiento";
type AudioProposalDraft = Record<string, unknown>;
type AudioAnalysis = Record<string, unknown> & {
  propuesta_borrador?: AudioProposalDraft | null;
  crm_note?: string | null;
};
type AudioApiResponse = {
  ok: boolean;
  mode:
    | "audio_intelligence"
    | "openai_not_configured"
    | "openai_error"
    | "stt_error"
    | "configuration_pending"
    | "auth_required"
    | "auth_error"
    | "forbidden"
    | "bad_request";
  message?: string;
  missingConfiguration?: string[];
  transcript: string | null;
  analysis: AudioAnalysis | null;
  source?: {
    stt?: string;
    sttModel?: string | null;
    sttFallbackUsed?: boolean;
    sttAttempts?: string[];
    analysisProvider?: string;
    analysisModel?: string;
  };
};
type AudioStatusResponse = {
  ok: boolean;
  message?: string;
  stt?: {
    baseUrlConfigured: boolean;
    model: string;
    maxFileMb: number;
    reachable: boolean;
    healthMessage: string;
    fallbackProvider: "openai" | "off";
    fallbackModel: string;
    fallbackConfigured: boolean;
  };
  openai?: {
    configured: boolean;
    model: string;
    maxOutputTokens: number;
  };
};
export type WorkspaceView =
  | "daily"
  | "capture"
  | "calendar"
  | "ideas"
  | "codex-queue"
  | "connections"
  | "seller-services"
  | "assistant"
  | "audio-intelligence";

const storageKey = "onia-center-runtime-v2";
const legacyStorageKey = "onia-center-runtime-v1";

const roleOptions: RoleId[] = ["sergio", "area", "arthur", "seller", "freelancer"];

const ideaVisibilityLabels: Record<RuntimeIdea["visibility"], string> = {
  sergio_private: "Privado Sergio",
  assigned_only: "Solo asignado",
  team_safe: "Equipo seguro",
};

const reviewToolLabels: Record<RuntimeIdea["reviewTool"], string> = {
  codex: "Codex",
  claude: "Claude",
  self_hosted: "Modelo self-hosted",
  manual: "Revision manual",
};

const workspaceCopy: Record<WorkspaceView, { label: string; title: string; description: string }> = {
  daily: {
    label: "Hoy",
    title: "Tareas del dia y calendario",
    description: "Primero agenda, tareas, captura rapida y evidencia. Lo tecnico queda fuera del inicio.",
  },
  capture: {
    label: "Captura operativa",
    title: "Captura diaria funcional",
    description: "Registra leads, tareas, revisiones collab y notas. Todo queda filtrado por rol y sincronizado si Supabase esta activo.",
  },
  calendar: {
    label: "Agenda Sergio",
    title: "Calendario estricto Sergio",
    description: "Controla horas de enfoque, reuniones, gym, descanso y reglas personales sin exponerlo al equipo.",
  },
  ideas: {
    label: "Ideas y referencias",
    title: "Inbox de reels, links e ideas",
    description: "Guarda referencias para revisar despues con Codex, Claude o modelos self-hosted sin mezclarlo con CRM.",
  },
  "codex-queue": {
    label: "Codex",
    title: "Cola tecnica aprobable",
    description: "Prepara trabajos para Codex con contexto, repo, archivos, criterio de aceptacion, validacion y evidencia esperada.",
  },
  connections: {
    label: "Conexiones",
    title: "Estado self-hosted y runtime",
    description: "Verifica Supabase, requisitos multiusuario, adaptadores y snapshot filtrado por rol.",
  },
  "seller-services": {
    label: "Servicios",
    title: "Resumenes comerciales y cambios de precio",
    description: "Catalogo explicable para vendedores: que vender, precio, comision propia, limites y ultimas actualizaciones aprobadas.",
  },
  assistant: {
    label: "Asistente",
    title: "ONIA Bot interno",
    description: "Consulta servicios, leads y notas visibles para tu rol. No responde sobre datos privados que no esten en tu vista.",
  },
  "audio-intelligence": {
    label: "Audio IA",
    title: "Inteligencia de reuniones y propuestas",
    description: "Convierte audios, reuniones o transcripts en diagnostico comercial, datos faltantes, nota CRM y borrador de propuesta.",
  },
};

const sellerNotebookChecklist = [
  "Lead con fuente y servicio recomendado",
  "Resultado de llamada o WhatsApp",
  "Proxima accion con fecha o responsable",
  "Evidencia del cobro neto si se gano",
  "Bloqueo o duda que necesita Sergio",
];

const scheduleCategoryLabels: Record<string, string> = {
  wake: "Arranque",
  planning: "Direccion",
  deep_work: "Trabajo profundo",
  sales: "Ventas",
  meetings: "Reuniones",
  admin: "Admin",
  gym: "Gym",
  personal: "Personal",
  shutdown: "Cierre",
  sleep: "Dormir",
};

const scheduleCategoryIcons: Record<string, typeof Clock> = {
  wake: Clock,
  planning: ClipboardCheck,
  deep_work: HardDrive,
  sales: Bot,
  meetings: CalendarDays,
  admin: FileCheck2,
  gym: Dumbbell,
  personal: Heart,
  shutdown: Moon,
  sleep: Moon,
};

const starterReviews: RuntimeReview[] = collabIngestionItems.map((item) => ({
  id: item.id,
  source: item.sourcePath,
  title: item.summary,
  type: item.classification,
  sensitivity: item.sensitivity,
  status: "pendiente",
}));

const starterServiceUpdates: RuntimeNote[] = [
  {
    id: "update-motor-local-growth-priority",
    kind: "actualizacion_servicio",
    title: "Empujar ONIA Motor Local Growth primero",
    detail: "Oferta prioritaria: setup Bs. 2.900 + mensualidad Bs. 1.900. Sirve para negocios locales que necesitan presencia, captacion, CRM simple y seguimiento.",
    linkedTo: "onia-motor-local-growth",
    actorRole: "sergio",
    visibility: "seller_safe",
    createdAt: "seed",
  },
  {
    id: "update-web-pro-scope-lock",
    kind: "actualizacion_servicio",
    title: "Web Pro ONIA no se promete como sistema",
    detail: "Web Pro ONIA cubre web/captacion. Login, base de datos, dashboard, portal o app interna se cotiza como sistema y requiere aprobacion Sergio.",
    linkedTo: "vendor-web-pro-onia",
    actorRole: "sergio",
    visibility: "seller_safe",
    createdAt: "seed",
  },
];

const starterTasks: RuntimeTask[] = operatingTasks.map((task) => ({
  id: task.id,
  projectId: task.projectId,
  title: task.title,
  assignedRole: task.assignedRole,
  status: task.status === "in_progress" ? "doing" : task.status === "approved" ? "done" : task.status === "blocked" ? "blocked" : "todo",
  priority: task.priority,
  evidence: task.evidenceRequired ? "pendiente" : "no requerida",
  createdAt: "seed",
}));

const starterCodexJobs: RuntimeCodexJob[] = [
  {
    id: "codex-onia-center-supabase-rls",
    title: "ONIA Center: activar Supabase real, Auth y RLS sin exponer service role",
    projectId: "project-onia-center",
    targetRepo: "onia-hermes",
    requestType: "ops",
    owner: "sergio",
    visibility: "sergio_private",
    risk: "alto",
    status: "blocked",
    context:
      "El runtime ya tiene fallback local y endpoints server-side. Falta aplicar migraciones en Supabase self-hosted, cargar env vars seguras y validar usuarios reales por rol.",
    files:
      "supabase/migrations/20260622_onia_center_schema.sql, supabase/migrations/20260623_onia_center_auth_rls.sql, web-factory/apps/site/src/lib/onia-center-store.ts",
    acceptance:
      "Login Sergio funciona, Arthur/vendedor/freelancer ven solo su scope, service role nunca llega al navegador y /api/onia-center/runtime responde con datos reales.",
    validation:
      "npm run lint, npx tsc --noEmit --pretty false, prueba login, prueba GET/POST runtime y revision de policies RLS.",
    evidence: "Pendiente: tunnel Supabase activo, env server-side y captura de runtime conectado.",
    createdAt: "seed",
  },
  {
    id: "codex-collab-importer-readonly",
    title: "Importador read-only de onia-hermes-collab a review queue",
    projectId: "project-onia-center",
    targetRepo: "onia-hermes",
    requestType: "feature",
    owner: "sergio",
    visibility: "internal_restricted",
    risk: "medio",
    status: "ready",
    context:
      "Arthur debe trabajar en onia-hermes-collab sin ver memoria privada. ONIA Center necesita listar aportes, clasificar sensibilidad y permitir aprobar/rechazar/importar.",
    files:
      "web-factory/apps/site/src/app/onia-center/operating-source.ts, web-factory/apps/site/src/app/api/onia-center/runtime/route.ts, hermes-content/docs/ONIA_HERMES_COLLABORATOR_ACCESS_MODEL_2026.md",
    acceptance:
      "La vista Collab muestra cambios recientes clasificados como lead, brief, tarea, contenido, Bolivian o bloqueo; nada se importa a Hermes privado sin aprobacion Sergio.",
    validation:
      "Fixture local con 3 aportes, filtro sensible/no sensible, pruebas manuales de aprobar/rechazar y snapshot sin datos privados.",
    evidence: "Pendiente: token GitHub minimo o fuente local del repo colaborativo.",
    createdAt: "seed",
  },
  {
    id: "codex-web-factory-client-form",
    title: "Web Factory: formulario cliente a brief y receta web revisable",
    projectId: "project-webs",
    targetRepo: "onia-hermes/web-factory",
    requestType: "feature",
    owner: "sergio",
    visibility: "internal_restricted",
    risk: "medio",
    status: "draft",
    context:
      "Queremos que clientes llenen un formulario y el sistema genere brief, estructura, requisitos, assets faltantes y una receta de web sin publicar automaticamente.",
    files:
      "web-factory/apps/site/src/app/onia-center/web-factory, web-factory/docs/WEB_FACTORY_OPERATING_RUNBOOK_20260625.md",
    acceptance:
      "Formulario captura negocio, objetivo, secciones, referencias, tono, assets, dominio y restricciones; genera brief interno y checklist QA antes de pasar a Codex.",
    validation:
      "Smoke test de formulario, salida JSON limpia, sin credenciales, sin publicar, y prompt listo para Codex.",
    evidence: "Pendiente: definir primer formulario comercial y storage de assets.",
    createdAt: "seed",
  },
];

const emptyLeadForm: LeadForm = {
  company: "",
  contact: "",
  source: "Instagram",
  serviceId: "onia-motor-local-growth",
  nextAction: "",
  owner: "sergio",
};

const emptyTaskForm: TaskForm = {
  projectId: "project-onia-center",
  title: "",
  assignedRole: "sergio",
  priority: "media",
};

const emptyNoteForm: NoteForm = {
  kind: "nota",
  title: "",
  detail: "",
  linkedTo: "",
  visibility: "assigned_only",
};

const emptyIdeaForm: IdeaForm = {
  title: "",
  url: "",
  source: "instagram",
  category: "contenido",
  summary: "",
  whyUseful: "",
  targetProjectId: "project-content",
  owner: "sergio",
  visibility: "sergio_private",
  reviewTool: "codex",
};

const emptyCodexJobForm: CodexJobForm = {
  title: "",
  projectId: "project-onia-center",
  targetRepo: "onia-hermes",
  requestType: "feature",
  owner: "sergio",
  visibility: "sergio_private",
  risk: "medio",
  context: "",
  files: "",
  acceptance: "",
  validation: "npm run lint; npx tsc --noEmit --pretty false; git diff --check",
  evidence: "",
};

const emptyServiceUpdateForm: ServiceUpdateForm = {
  serviceId: "onia-motor-local-growth",
  title: "",
  detail: "",
  visibility: "seller_safe",
};

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function readLocalRuntime(): RuntimeData | null {
  const raw = window.localStorage.getItem(storageKey) ?? window.localStorage.getItem(legacyStorageKey);
  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as Partial<RuntimeData>;
  return {
    leads: parsed.leads ?? [],
    tasks: parsed.tasks ?? starterTasks,
    reviews: parsed.reviews ?? starterReviews,
    notes: parsed.notes ?? [],
    ideas: parsed.ideas ?? [],
    codexJobs: parsed.codexJobs ?? starterCodexJobs,
  };
}

async function fetchRuntimeData() {
  const response = await fetch("/api/onia-center/runtime", { cache: "no-store" });
  return (await response.json()) as RuntimeApiResponse;
}

async function createRuntimeEntity<T>(entity: "lead" | "task" | "note" | "idea" | "codex_job", data: T) {
  const response = await fetch("/api/onia-center/runtime", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ entity, data }),
  });
  const body = (await response.json()) as RuntimeApiResponse<T>;
  if (!response.ok || !body.ok) {
    if (body.mode === "configuration_pending") {
      return null;
    }
    throw new Error(body.message || "No se pudo guardar en Supabase.");
  }
  return body.data;
}

async function updateRuntimeStatus<T>(entity: "task" | "review" | "idea" | "codex_job", id: string, status: string) {
  const response = await fetch("/api/onia-center/runtime", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ entity, id, status }),
  });
  const body = (await response.json()) as RuntimeApiResponse<T>;
  if (!response.ok || !body.ok) {
    if (body.mode === "configuration_pending") {
      return null;
    }
    throw new Error(body.message || "No se pudo actualizar en Supabase.");
  }
  return body.data;
}

function roleLabel(role: RoleId) {
  const labels: Record<RoleId, string> = {
    sergio: "Sergio",
    area: "Area",
    arthur: "Arthur",
    seller: "Vendedor",
    freelancer: "Freelancer",
  };

  return labels[role];
}

function projectLabel(projectId: string) {
  return operatingProjects.find((project) => project.id === projectId)?.name ?? "Proyecto ONIA";
}

function canViewIdea(idea: RuntimeIdea, role: RoleId) {
  if (role === "sergio") {
    return true;
  }

  if (idea.visibility === "team_safe") {
    return true;
  }

  if (idea.visibility === "assigned_only") {
    return idea.owner === role;
  }

  return false;
}

function canViewNote(note: RuntimeNote, role: RoleId) {
  if (role === "sergio") {
    return true;
  }

  if (note.visibility === "team_safe") {
    return true;
  }

  if (note.visibility === "seller_safe") {
    return role === "area" || role === "arthur" || role === "seller";
  }

  if (note.visibility === "assigned_only") {
    return note.actorRole === role;
  }

  return note.actorRole === role;
}

function timeRank(value: string) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function servicePriceLabel(serviceId: string) {
  const service = operationalServices.find((item) => item.id === serviceId);
  if (service) {
    const setup = typeof service.setupPriceBs === "number" ? `setup ${formatBs(service.setupPriceBs, { compact: true })}` : "setup pendiente";
    const monthly =
      service.isRecurring && typeof service.monthlyPriceBs === "number"
        ? `mensual ${formatBs(service.monthlyPriceBs, { compact: true })}`
        : "sin mensualidad fija";
    return `${setup} / ${monthly}`;
  }

  return vendorCommissionRules.find((rule) => rule.id === serviceId)?.clientPriceLabel ?? "Precio no encontrado";
}

function serviceNameById(serviceId: string) {
  return (
    operationalServices.find((item) => item.id === serviceId)?.name ??
    vendorCommissionRules.find((rule) => rule.id === serviceId)?.serviceName ??
    serviceId
  );
}

function findServiceForQuestion(question: string) {
  const normalizedQuestion = normalizeText(question);
  const queryTerms = normalizedQuestion.split(" ").filter((term) => term.length > 3);

  const candidates = [
    ...operationalServices.map((service) => ({
      id: service.id,
      name: service.name,
      text: [service.name, service.plan, service.salesScript, service.quoteTemplate, service.risk].filter(Boolean).join(" "),
      kind: "operational" as const,
    })),
    ...vendorCommissionRules.map((rule) => ({
      id: rule.id,
      name: rule.serviceName,
      text: [rule.serviceName, rule.category, rule.clientPriceLabel, rule.offerWhen, rule.commissionLabel].join(" "),
      kind: "seller" as const,
    })),
  ];

  const scored = candidates
    .map((candidate) => {
      const searchable = normalizeText(candidate.text);
      const score = queryTerms.reduce((total, term) => total + (searchable.includes(term) ? 1 : 0), 0);
      return { ...candidate, score };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  return scored[0] ?? null;
}

function buildAssistantAnswer({
  question,
  role,
  leads,
  tasks,
  notes,
  codexJobs,
}: {
  question: string;
  role: RoleId;
  leads: RuntimeLead[];
  tasks: RuntimeTask[];
  notes: RuntimeNote[];
  codexJobs: RuntimeCodexJob[];
}) {
  const normalizedQuestion = normalizeText(question);
  if (!normalizedQuestion) {
    return "Escribe una pregunta concreta: precio de un servicio, estado de un cliente, proximas tareas o actualizaciones comerciales.";
  }

  if (role !== "sergio" && /\b(capital|deuda|caja|runway|utilidad|fondo privado|estrategia interna)\b/.test(normalizedQuestion)) {
    return "No puedo responder sobre capital, deuda, caja real, utilidad personal o estrategia privada desde esta vista. Pide a Sergio una respuesta filtrada si hace falta.";
  }

  const serviceMatch = findServiceForQuestion(question);
  const asksService =
    /\b(servicio|precio|cuanto|comision|vendo|vender|incluye|growth|web|dentagest|gesti|bot|whatsapp|n8n|auditoria)\b/.test(
      normalizedQuestion,
    );

  if (asksService && serviceMatch) {
    const operational = operationalServices.find((service) => service.id === serviceMatch.id);
    const sellerRule = vendorCommissionRules.find((rule) => rule.id === serviceMatch.id);
    const updates = notes
      .filter((note) => note.kind === "actualizacion_servicio" && note.linkedTo === serviceMatch.id)
      .slice(0, 3);

    if (operational) {
      return [
        `${operational.name}: ${operational.salesScript ?? "Servicio operativo ONIA."}`,
        `Precio: ${servicePriceLabel(operational.id)}.`,
        `Incluye: ${(operational.includes ?? operational.deliverables ?? []).slice(0, 4).join(", ") || "revisar checklist"}.`,
        `No prometas: ${(operational.notIncluded ?? []).slice(0, 4).join(", ") || operational.risk || "alcance fuera de catalogo"}.`,
        `Comision: ${operational.sellerCommission ?? "requiere aprobacion"}.`,
        updates.length ? `Ultimas actualizaciones: ${updates.map((item) => item.title).join(" / ")}.` : "No hay actualizaciones nuevas para este servicio.",
      ].join("\n");
    }

    if (sellerRule) {
      return [
        `${sellerRule.serviceName}: ${sellerRule.offerWhen}`,
        `Precio visible: ${sellerRule.clientPriceLabel}.`,
        `Comision propia: ${sellerRule.commissionLabel} solo primer pago${sellerRule.requiresSergioApproval ? " y requiere aprobacion Sergio" : ""}.`,
        `Condiciones: ${sellerRule.conditions.slice(0, 3).join(" / ")}.`,
        updates.length ? `Ultimas actualizaciones: ${updates.map((item) => item.title).join(" / ")}.` : "No hay actualizaciones nuevas para este servicio.",
      ].join("\n");
    }
  }

  const asksClient = /\b(cliente|lead|prospecto|empresa|contacto|seguimiento|paso|estado)\b/.test(normalizedQuestion);
  if (asksClient) {
    const queryTerms = normalizedQuestion.split(" ").filter((term) => term.length > 3);
    const matchedLeads = leads.filter((lead) => {
      const searchable = normalizeText([lead.company, lead.contact, lead.source, lead.nextAction, lead.serviceId].join(" "));
      return queryTerms.length === 0 || queryTerms.some((term) => searchable.includes(term));
    });
    const leadList = (matchedLeads.length ? matchedLeads : leads).slice(0, 5);

    if (!leadList.length) {
      return "No encontre leads visibles para tu rol. Registra el cliente en Captura o pide a Sergio revisar permisos.";
    }

    return [
      "Clientes visibles:",
      ...leadList.map((lead) => {
        const relatedNotes = notes
          .filter((note) => normalizeText([note.linkedTo, note.title, note.detail].join(" ")).includes(normalizeText(lead.company)))
          .slice(0, 2);
        return `- ${lead.company}: ${lead.status}, responsable ${roleLabel(lead.owner)}, servicio ${serviceNameById(lead.serviceId)}, proxima accion: ${lead.nextAction || "sin accion"}. ${
          relatedNotes.length ? `Notas: ${relatedNotes.map((note) => note.title).join(" / ")}` : "Sin notas visibles."
        }`;
      }),
    ].join("\n");
  }

  if (/\b(tarea|pendiente|hacer|hoy|mes)\b/.test(normalizedQuestion)) {
    const pending = tasks.filter((task) => !["done", "blocked"].includes(task.status)).slice(0, 6);
    if (!pending.length) {
      return "No hay tareas pendientes visibles para tu rol.";
    }

    return ["Tareas visibles pendientes:", ...pending.map((task) => `- ${task.title} (${task.priority}, ${task.status}) en ${projectLabel(task.projectId)}.`)].join("\n");
  }

  if (/\b(codex|codigo|repo|tecnico|dev|programar|pull request|commit)\b/.test(normalizedQuestion)) {
    if (role !== "sergio" && role !== "arthur") {
      return "La cola Codex no esta visible para este rol. Registra la necesidad como tarea o evidencia para revision de Sergio.";
    }

    const openJobs = codexJobs.filter((job) => !["done"].includes(job.status)).slice(0, 6);
    if (!openJobs.length) {
      return "No hay jobs Codex visibles pendientes.";
    }

    return [
      "Jobs Codex visibles:",
      ...openJobs.map((job) => `- ${job.title}: ${job.status}, repo ${job.targetRepo}, riesgo ${job.risk}. Validacion: ${job.validation || "pendiente"}.`),
    ].join("\n");
  }

  const updates = notes.filter((note) => note.kind === "actualizacion_servicio").slice(0, 5);
  if (/\b(actualizacion|actualizaciones|cambio|precio nuevo|precios)\b/.test(normalizedQuestion)) {
    return updates.length
      ? ["Actualizaciones comerciales visibles:", ...updates.map((item) => `- ${serviceNameById(item.linkedTo)}: ${item.title}. ${item.detail}`)].join("\n")
      : "No hay actualizaciones comerciales visibles todavia.";
  }

  return "Puedo responder sobre servicios, precios visibles, comisiones propias, leads visibles, tareas y actualizaciones comerciales. No invento informacion que no este en ONIA Center.";
}

function buildIdeaPrompt(idea: RuntimeIdea) {
  return [
    "Analiza esta idea para ONIA Center sin copiar identidad, guion exacto, branding ni claims del reel original.",
    "",
    `Herramienta sugerida: ${reviewToolLabels[idea.reviewTool]}`,
    `Titulo: ${idea.title}`,
    `Fuente: ${idea.source}`,
    `Link/referencia: ${idea.url || "sin link"}`,
    `Categoria: ${idea.category}`,
    `Proyecto destino: ${projectLabel(idea.targetProjectId)}`,
    `Resumen rapido: ${idea.summary || "pendiente de resumir"}`,
    `Por que podria servir: ${idea.whyUseful || "pendiente de evaluar"}`,
    "",
    "Entrega:",
    "1. Potencial real para ONIA.",
    "2. Riesgos de copia, datos sensibles o promesas debiles.",
    "3. Como adaptarla a ONIA sin copiar.",
    "4. Tareas concretas para ejecutar.",
    "5. Si conviene convertirla en contenido, lead, producto, automatizacion o tarea interna.",
  ].join("\n");
}

function buildCodexJobPrompt(job: RuntimeCodexJob) {
  return [
    `Proyecto: ${projectLabel(job.projectId)}`,
    `Repo objetivo: ${job.targetRepo}`,
    `Tipo: ${job.requestType}`,
    `Riesgo: ${job.risk}`,
    "",
    `Objetivo: ${job.title}`,
    "",
    "Contexto real:",
    job.context || "Pendiente de contexto. No ejecutes sin pedir aclaracion.",
    "",
    "Archivos o rutas relevantes:",
    job.files || "Buscar primero en docs canonicos, source de ONIA Center y git status.",
    "",
    "Criterios de aceptacion:",
    job.acceptance || "Debe quedar funcional, validado y sin datos sensibles.",
    "",
    "Validacion requerida:",
    job.validation || "npm run lint; npx tsc --noEmit --pretty false; git diff --check",
    "",
    "Evidencia esperada:",
    job.evidence || "Resumen de archivos modificados, checks ejecutados y bloqueo exacto si falta credencial.",
    "",
    "Reglas ONIA:",
    "- No inventes datos reales ni cambies reglas financieras.",
    "- No expongas secretos, credenciales, capital privado ni informacion sensible.",
    "- Si hay cambios productivos coherentes, valida, commit y push seguro.",
  ].join("\n");
}

function audioText(value: unknown, fallback = "por verificar") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function audioList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => audioText(item, "")).filter(Boolean);
  }

  const single = audioText(value, "");
  return single ? [single] : [];
}

function proposalDraft(analysis: AudioAnalysis | null | undefined) {
  const draft = analysis?.propuesta_borrador;
  return draft && typeof draft === "object" ? draft : null;
}

function audioSttSourceLabel(source?: AudioApiResponse["source"]) {
  if (source?.stt === "speaches") {
    return `Speaches local / ${source.sttModel ?? "modelo open source"}`;
  }

  if (source?.stt === "openai_transcribe") {
    return `OpenAI fallback / ${source.sttModel ?? "transcribe mini"}`;
  }

  if (source?.stt === "transcript_manual") {
    return "Transcript manual";
  }

  return "Pendiente";
}

function audioStatusTone(status: AudioStatusResponse | null) {
  if (!status?.stt) {
    return { icon: Database, className: "is-muted", label: "Verificando", detail: "Cargando estado de Audio IA." };
  }

  if (status.stt.reachable) {
    return { icon: CheckCircle2, className: "is-ready", label: "Local activo", detail: status.stt.healthMessage };
  }

  if (status.stt.fallbackConfigured) {
    return { icon: AlertTriangle, className: "is-warning", label: "Fallback barato", detail: "Speaches no responde; se usara OpenAI transcribe-mini si subes audio." };
  }

  return { icon: AlertTriangle, className: "is-blocked", label: "STT bloqueado", detail: "Speaches no responde y no hay fallback configurado." };
}

function formatAudioProposal(analysis: AudioAnalysis | null | undefined) {
  const draft = proposalDraft(analysis);
  if (!draft) {
    return "Sin propuesta generada todavia.";
  }

  return [
    audioText(draft.titulo, "Propuesta ONIA"),
    "",
    "Diagnostico:",
    audioText(draft.diagnostico),
    "",
    "Alcance recomendado:",
    ...audioList(draft.alcance_recomendado).map((item) => `- ${item}`),
    "",
    "Entregables:",
    ...audioList(draft.entregables).map((item) => `- ${item}`),
    "",
    "Fuera de alcance:",
    ...audioList(draft.fuera_de_alcance).map((item) => `- ${item}`),
    "",
    `Precio sugerido: ${audioText(draft.precio_sugerido)}`,
    "",
    "Condiciones:",
    ...audioList(draft.condiciones).map((item) => `- ${item}`),
    "",
    `Siguiente paso: ${audioText(draft.siguiente_paso)}`,
  ].join("\n");
}

function formatAudioCrmNote(analysis: AudioAnalysis | null | undefined) {
  if (!analysis) {
    return "Sin nota CRM generada todavia.";
  }

  return audioText(
    analysis.crm_note,
    [
      `Empresa: ${audioText(analysis.empresa)}`,
      `Necesidad: ${audioText(analysis.necesidad_principal)}`,
      `Interes: ${audioText(analysis.nivel_interes)}`,
      `Proximo paso: ${audioText(analysis.proximo_paso_acordado)}`,
    ].join("\n"),
  );
}

export function OperatingWorkspace({ selectedRole, workspaceView = "capture" }: { selectedRole: RoleId; workspaceView?: WorkspaceView }) {
  const [leads, setLeads] = useState<RuntimeLead[]>([]);
  const [tasks, setTasks] = useState<RuntimeTask[]>(starterTasks);
  const [reviews, setReviews] = useState<RuntimeReview[]>(starterReviews);
  const [notes, setNotes] = useState<RuntimeNote[]>([]);
  const [ideas, setIdeas] = useState<RuntimeIdea[]>([]);
  const [codexJobs, setCodexJobs] = useState<RuntimeCodexJob[]>(starterCodexJobs);
  const [leadForm, setLeadForm] = useState<LeadForm>(emptyLeadForm);
  const [taskForm, setTaskForm] = useState<TaskForm>(emptyTaskForm);
  const [noteForm, setNoteForm] = useState<NoteForm>(emptyNoteForm);
  const [ideaForm, setIdeaForm] = useState<IdeaForm>(emptyIdeaForm);
  const [codexJobForm, setCodexJobForm] = useState<CodexJobForm>(emptyCodexJobForm);
  const [serviceUpdateForm, setServiceUpdateForm] = useState<ServiceUpdateForm>(emptyServiceUpdateForm);
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState(
    "Pregunta por un servicio, un precio, una comision propia, un cliente visible o una tarea pendiente.",
  );
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioClientName, setAudioClientName] = useState("");
  const [audioContext, setAudioContext] = useState("");
  const [audioObjective, setAudioObjective] = useState<AudioObjective>("propuesta");
  const [audioTranscript, setAudioTranscript] = useState("");
  const [audioResult, setAudioResult] = useState<AudioApiResponse | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioStatus, setAudioStatus] = useState<AudioStatusResponse | null>(null);
  const [audioStatusLoading, setAudioStatusLoading] = useState(false);
  const [notice, setNotice] = useState("Modo local listo. Conecta Supabase self-hosted para multiusuario.");
  const [hydrated, setHydrated] = useState(false);
  const [storageMode, setStorageMode] = useState<StorageMode>("checking");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let active = true;

    async function hydrateRuntime() {
      const localRuntime = (() => {
        try {
          return readLocalRuntime();
        } catch {
          return null;
        }
      })();

      if (localRuntime) {
        setLeads(localRuntime.leads);
        setTasks(localRuntime.tasks);
        setReviews(localRuntime.reviews);
        setNotes(localRuntime.notes);
        setIdeas(localRuntime.ideas);
        setCodexJobs(localRuntime.codexJobs.length ? localRuntime.codexJobs : starterCodexJobs);
      }

      try {
        const runtime = await fetchRuntimeData();
        if (!active) {
          return;
        }

        if (runtime.ok && runtime.data) {
          setLeads(runtime.data.leads);
          setTasks(runtime.data.tasks.length ? runtime.data.tasks : starterTasks);
          setReviews(runtime.data.reviews.length ? runtime.data.reviews : starterReviews);
          setNotes(runtime.data.notes);
          setIdeas(runtime.data.ideas);
          setCodexJobs(runtime.data.codexJobs.length ? runtime.data.codexJobs : starterCodexJobs);
          setStorageMode("supabase");
          setNotice("Conectado a Supabase self-hosted. Los nuevos registros se guardan en onia_center.");
          return;
        }

        setStorageMode("local");
        if (runtime.mode === "auth_required" || runtime.mode === "auth_error" || runtime.mode === "forbidden") {
          setNotice(`${runtime.message} Entra desde /onia-center/login para usar Supabase multiusuario.`);
          return;
        }

        setNotice(
          runtime.missingConfiguration?.length
            ? `Modo local: falta ${runtime.missingConfiguration.join(", ")}.`
            : "Modo local activo. Supabase no esta configurado para esta ejecucion.",
        );
      } catch (error) {
        if (!active) {
          return;
        }
        const message = error instanceof Error ? error.message : "Error desconocido.";
        setStorageMode("local");
        setNotice(`Modo local activo: no se pudo conectar Supabase (${message}).`);
      } finally {
        if (active) {
          setHydrated(true);
        }
      }
    }

    hydrateRuntime();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || storageMode === "supabase") {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify({ leads, tasks, reviews, notes, ideas, codexJobs }));
  }, [codexJobs, hydrated, ideas, leads, notes, reviews, storageMode, tasks]);

  useEffect(() => {
    if (workspaceView !== "audio-intelligence") {
      return;
    }

    let active = true;
    setAudioStatusLoading(true);

    fetch("/api/onia-center/audio-intelligence", { cache: "no-store" })
      .then((response) => response.json() as Promise<AudioStatusResponse>)
      .then((status) => {
        if (active) {
          setAudioStatus(status);
        }
      })
      .catch(() => {
        if (active) {
          setAudioStatus(null);
        }
      })
      .finally(() => {
        if (active) {
          setAudioStatusLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [workspaceView]);

  const canApprove = selectedRole === "sergio";
  const visibleLeads = useMemo(
    () => (selectedRole === "sergio" ? leads : leads.filter((lead) => lead.owner === selectedRole)),
    [leads, selectedRole],
  );
  const visibleTasks = useMemo(
    () => (selectedRole === "sergio" ? tasks : tasks.filter((task) => task.assignedRole === selectedRole)),
    [selectedRole, tasks],
  );
  const visibleReviews = useMemo(
    () => (selectedRole === "sergio" ? reviews : reviews.filter((review) => review.sensitivity === "public_safe")),
    [reviews, selectedRole],
  );
  const visibleNotes = useMemo(
    () => [...starterServiceUpdates, ...notes].filter((note) => canViewNote(note, selectedRole)),
    [notes, selectedRole],
  );
  const visibleIdeas = useMemo(
    () => ideas.filter((idea) => canViewIdea(idea, selectedRole)),
    [ideas, selectedRole],
  );
  const visibleCodexJobs = useMemo(
    () =>
      selectedRole === "sergio"
        ? codexJobs
        : selectedRole === "arthur"
          ? codexJobs.filter((job) => job.visibility === "internal_restricted" || job.owner === "arthur")
          : [],
    [codexJobs, selectedRole],
  );
  const visibleServiceUpdates = useMemo(
    () =>
      visibleNotes
        .filter((note) => note.kind === "actualizacion_servicio")
        .sort((a, b) => timeRank(b.createdAt) - timeRank(a.createdAt)),
    [visibleNotes],
  );
  const visibleSellerRules = useMemo(
    () => vendorCommissionRules.filter((rule) => rule.visibility.includes(selectedRole)),
    [selectedRole],
  );
  const leadServiceOptions = useMemo(
    () => [
      ...operationalServices.map((service) => ({
        id: service.id,
        name: service.name,
        helper: service.setupPriceBs
          ? `${service.plan} / setup ${formatBs(service.setupPriceBs)}`
          : service.monthlyPriceBs
            ? `${service.plan} / mensual ${formatBs(service.monthlyPriceBs)}`
            : service.plan || "Servicio ONIA",
      })),
      ...visibleSellerRules.map((rule) => ({
        id: rule.id,
        name: rule.serviceName,
        helper: `${rule.clientPriceLabel} / comision ${rule.commissionLabel}`,
      })),
    ],
    [visibleSellerRules],
  );
  const sellerRulesByCategory = useMemo(() => {
    return visibleSellerRules.reduce<Record<string, typeof visibleSellerRules>>((groups, rule) => {
      const current = groups[rule.category] ?? [];
      return { ...groups, [rule.category]: [...current, rule] };
    }, {});
  }, [visibleSellerRules]);
  const workspaceNotes = useMemo(
    () => visibleNotes.filter((note) => note.kind !== "actualizacion_servicio"),
    [visibleNotes],
  );
  const sellerNotebookNotes = useMemo(
    () => workspaceNotes.slice(0, 8),
    [workspaceNotes],
  );

  const summary = useMemo(() => {
    const hotLeads = visibleLeads.filter((lead) => ["nuevo", "contactado", "reunion", "propuesta"].includes(lead.status)).length;
    const pendingTasks = visibleTasks.filter((task) => !["done", "blocked"].includes(task.status)).length;
    const pendingReviews = visibleReviews.filter((review) => review.status === "pendiente").length;
    const recordedPayments = visibleNotes.filter((note) => note.kind === "cobro").length;
    const evidenceRecords = visibleNotes.filter((note) => note.kind === "evidencia").length;
    const meetingNotes = visibleNotes.filter((note) => note.kind === "llamada").length;
    const ideasInbox = visibleIdeas.filter((idea) => ["inbox", "queued"].includes(idea.status)).length;
    const codexReady = visibleCodexJobs.filter((job) => ["ready", "review", "in_codex"].includes(job.status)).length;
    const proposalLeads = visibleLeads.filter((lead) => lead.status === "propuesta").length;

    return { hotLeads, pendingTasks, pendingReviews, recordedPayments, evidenceRecords, meetingNotes, ideasInbox, codexReady, proposalLeads };
  }, [visibleCodexJobs, visibleIdeas, visibleLeads, visibleNotes, visibleReviews, visibleTasks]);

  const pendingTodayTasks = useMemo(
    () =>
      visibleTasks
        .filter((task) => !["done", "blocked"].includes(task.status))
        .sort((a, b) => {
          const priorityRank = { alta: 0, media: 1, baja: 2 };
          return priorityRank[a.priority] - priorityRank[b.priority] || timeRank(b.createdAt) - timeRank(a.createdAt);
        })
        .slice(0, 8),
    [visibleTasks],
  );
  const recentEvidence = useMemo(
    () => workspaceNotes.filter((note) => ["evidencia", "bloqueo", "nota"].includes(note.kind)).slice(0, 6),
    [workspaceNotes],
  );

  const teamActivity = useMemo(() => {
    return [
      ...visibleLeads.map((lead) => ({
        id: lead.id,
        actor: lead.owner,
        label: "Lead",
        title: lead.company,
        detail: lead.nextAction || lead.source,
        at: lead.createdAt,
      })),
      ...visibleTasks.map((task) => ({
        id: task.id,
        actor: task.assignedRole,
        label: "Tarea",
        title: task.title,
        detail: task.status,
        at: task.createdAt,
      })),
      ...visibleIdeas.map((idea) => ({
        id: idea.id,
        actor: idea.owner,
        label: "Idea",
        title: idea.title,
        detail: reviewToolLabels[idea.reviewTool],
        at: idea.createdAt,
      })),
      ...visibleCodexJobs.map((job) => ({
        id: job.id,
        actor: job.owner,
        label: "Codex",
        title: job.title,
        detail: job.status,
        at: job.createdAt,
      })),
      ...visibleNotes.map((note) => ({
        id: note.id,
        actor: note.actorRole ?? "sergio",
        label: "Registro",
        title: note.title,
        detail: note.kind,
        at: note.createdAt,
      })),
    ]
      .sort((a, b) => timeRank(b.at) - timeRank(a.at))
      .slice(0, 8);
  }, [visibleCodexJobs, visibleIdeas, visibleLeads, visibleNotes, visibleTasks]);

  const snapshot = useMemo(
    () => ({
      role: selectedRole,
      leads: visibleLeads,
      tasks: visibleTasks,
      reviews: visibleReviews,
      notes: visibleNotes,
      ideas: visibleIdeas,
      codexJobs: visibleCodexJobs,
      exportedAt: nowIso(),
    }),
    [selectedRole, visibleCodexJobs, visibleIdeas, visibleLeads, visibleNotes, visibleReviews, visibleTasks],
  );

  async function addLead() {
    if (!leadForm.company.trim()) {
      setNotice("Falta empresa o nombre del lead.");
      return;
    }

    const owner = selectedRole === "sergio" ? leadForm.owner : selectedRole;
    const lead: RuntimeLead = {
      ...leadForm,
      owner,
      id: makeId("lead"),
      status: "nuevo",
      createdAt: nowIso(),
    };

    if (storageMode === "supabase") {
      setIsSyncing(true);
      try {
        const saved = await createRuntimeEntity<RuntimeLead>("lead", lead);
        if (saved) {
          setLeads((current) => [saved, ...current]);
          setLeadForm(emptyLeadForm);
          setNotice("Lead guardado en Supabase con visibilidad por responsable.");
          return;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido.";
        setNotice(`Supabase fallo al guardar lead; se guardo localmente. ${message}`);
      } finally {
        setIsSyncing(false);
      }
    }

    setLeads((current) => [lead, ...current]);
    setLeadForm(emptyLeadForm);
    setNotice("Lead guardado en modo local con visibilidad por responsable.");
  }

  async function addTask() {
    if (!taskForm.title.trim()) {
      setNotice("Falta titulo de tarea.");
      return;
    }

    const assignedRole = selectedRole === "sergio" ? taskForm.assignedRole : selectedRole;
    const task: RuntimeTask = {
      ...taskForm,
      assignedRole,
      id: makeId("task"),
      status: "todo",
      evidence: "pendiente",
      createdAt: nowIso(),
    };

    if (storageMode === "supabase") {
      setIsSyncing(true);
      try {
        const saved = await createRuntimeEntity<RuntimeTask>("task", task);
        if (saved) {
          setTasks((current) => [saved, ...current]);
          setTaskForm(emptyTaskForm);
          setNotice("Tarea creada en Supabase y lista para seguimiento.");
          return;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido.";
        setNotice(`Supabase fallo al crear tarea; se guardo localmente. ${message}`);
      } finally {
        setIsSyncing(false);
      }
    }

    setTasks((current) => [task, ...current]);
    setTaskForm(emptyTaskForm);
    setNotice("Tarea creada y persistida localmente.");
  }

  async function addNote() {
    if (!noteForm.title.trim()) {
      setNotice("Falta titulo para el registro.");
      return;
    }

    const note: RuntimeNote = { ...noteForm, actorRole: selectedRole, id: makeId("note"), createdAt: nowIso() };

    if (storageMode === "supabase") {
      setIsSyncing(true);
      try {
        const saved = await createRuntimeEntity<RuntimeNote>("note", note);
        if (saved) {
          setNotes((current) => [saved, ...current]);
          setNoteForm(emptyNoteForm);
          setNotice("Registro guardado en Supabase y visible para auditoria.");
          return;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido.";
        setNotice(`Supabase fallo al guardar registro; se guardo localmente. ${message}`);
      } finally {
        setIsSyncing(false);
      }
    }

    setNotes((current) => [note, ...current]);
    setNoteForm(emptyNoteForm);
    setNotice("Registro guardado con actor visible para Sergio.");
  }

  async function addServiceUpdate() {
    if (!canApprove) {
      setNotice("Solo Sergio puede publicar actualizaciones comerciales para vendedores.");
      return;
    }

    if (!serviceUpdateForm.title.trim() || !serviceUpdateForm.detail.trim()) {
      setNotice("Falta titulo y detalle para publicar la actualizacion.");
      return;
    }

    const note: RuntimeNote = {
      id: makeId("service-update"),
      kind: "actualizacion_servicio",
      title: serviceUpdateForm.title,
      detail: serviceUpdateForm.detail,
      linkedTo: serviceUpdateForm.serviceId,
      actorRole: "sergio",
      visibility: serviceUpdateForm.visibility,
      createdAt: nowIso(),
    };

    if (storageMode === "supabase") {
      setIsSyncing(true);
      try {
        const saved = await createRuntimeEntity<RuntimeNote>("note", note);
        if (saved) {
          setNotes((current) => [saved, ...current]);
          setServiceUpdateForm(emptyServiceUpdateForm);
          setNotice("Actualizacion comercial publicada en Supabase con visibilidad filtrada.");
          return;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido.";
        setNotice(`Supabase fallo al publicar; se guardo localmente. ${message}`);
      } finally {
        setIsSyncing(false);
      }
    }

    setNotes((current) => [note, ...current]);
    setServiceUpdateForm(emptyServiceUpdateForm);
    setNotice("Actualizacion comercial publicada en modo local para las vistas permitidas.");
  }

  async function addIdea() {
    if (!ideaForm.title.trim() && !ideaForm.url.trim()) {
      setNotice("Falta titulo o link para guardar la idea.");
      return;
    }

    const owner = selectedRole === "sergio" ? ideaForm.owner : selectedRole;
    const visibility = selectedRole === "sergio"
      ? ideaForm.visibility
      : ideaForm.visibility === "team_safe"
        ? "team_safe"
        : "assigned_only";
    const idea: RuntimeIdea = {
      ...ideaForm,
      title: ideaForm.title.trim() || ideaForm.url.trim(),
      owner,
      visibility,
      id: makeId("idea"),
      status: "inbox",
      createdAt: nowIso(),
    };

    if (storageMode === "supabase") {
      setIsSyncing(true);
      try {
        const saved = await createRuntimeEntity<RuntimeIdea>("idea", idea);
        if (saved) {
          setIdeas((current) => [saved, ...current]);
          setIdeaForm({ ...emptyIdeaForm, owner: selectedRole === "sergio" ? "sergio" : selectedRole, visibility: selectedRole === "sergio" ? "sergio_private" : "assigned_only" });
          setNotice("Idea guardada en Supabase para revision posterior.");
          return;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido.";
        setNotice(`Supabase fallo al guardar idea; se guardo localmente. ${message}`);
      } finally {
        setIsSyncing(false);
      }
    }

    setIdeas((current) => [idea, ...current]);
    setIdeaForm({ ...emptyIdeaForm, owner: selectedRole === "sergio" ? "sergio" : selectedRole, visibility: selectedRole === "sergio" ? "sergio_private" : "assigned_only" });
    setNotice("Idea guardada. Puedes copiar el prompt para Codex, Claude o el modelo self-hosted.");
  }

  async function updateIdeaStatus(id: string, status: RuntimeIdea["status"]) {
    if (status === "approved" && !canApprove) {
      setNotice("Solo Sergio puede aprobar una idea para importarla o ejecutarla.");
      return;
    }

    if (storageMode === "supabase") {
      setIsSyncing(true);
      try {
        const updated = await updateRuntimeStatus<RuntimeIdea>("idea", id, status);
        if (updated) {
          setIdeas((current) => current.map((idea) => (idea.id === id ? updated : idea)));
          setNotice("Estado de idea actualizado en Supabase.");
          return;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido.";
        setNotice(`No se pudo actualizar en Supabase; se actualizo localmente. ${message}`);
      } finally {
        setIsSyncing(false);
      }
    }

    setIdeas((current) => current.map((idea) => (idea.id === id ? { ...idea, status } : idea)));
  }

  async function addCodexJob() {
    if (selectedRole !== "sergio" && selectedRole !== "arthur") {
      setNotice("Solo Sergio o Arthur pueden proponer trabajos tecnicos para Codex.");
      return;
    }

    if (!codexJobForm.title.trim()) {
      setNotice("Falta titulo del trabajo Codex.");
      return;
    }

    const owner = selectedRole === "sergio" ? codexJobForm.owner : selectedRole;
    const job: RuntimeCodexJob = {
      ...codexJobForm,
      owner,
      visibility: selectedRole === "sergio" ? codexJobForm.visibility : "internal_restricted",
      status: selectedRole === "sergio" ? "ready" : "draft",
      id: makeId("codex-job"),
      createdAt: nowIso(),
    };

    if (storageMode === "supabase") {
      setIsSyncing(true);
      try {
        const saved = await createRuntimeEntity<RuntimeCodexJob>("codex_job", job);
        if (saved) {
          setCodexJobs((current) => [saved, ...current]);
          setCodexJobForm({ ...emptyCodexJobForm, owner: selectedRole === "sergio" ? "sergio" : selectedRole });
          setNotice("Job Codex guardado en Supabase como audit log revisable.");
          return;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido.";
        setNotice(`Supabase fallo al guardar job Codex; se guardo localmente. ${message}`);
      } finally {
        setIsSyncing(false);
      }
    }

    setCodexJobs((current) => [job, ...current]);
    setCodexJobForm({ ...emptyCodexJobForm, owner: selectedRole === "sergio" ? "sergio" : selectedRole });
    setNotice("Job Codex guardado. Copia el prompt y ejecutalo desde Codex cuando corresponda.");
  }

  async function updateCodexJobStatus(id: string, status: RuntimeCodexJob["status"]) {
    const job = codexJobs.find((item) => item.id === id);
    if (!job) {
      setNotice("Job Codex no encontrado.");
      return;
    }

    if (selectedRole !== "sergio" && !["draft", "blocked"].includes(status)) {
      setNotice("Arthur puede proponer o bloquear; Sergio aprueba, envia a Codex y cierra.");
      return;
    }

    if (status === "done" && !job.evidence.trim()) {
      setNotice("No cierres un job Codex sin evidencia de validacion o commit.");
      return;
    }

    if (storageMode === "supabase") {
      setIsSyncing(true);
      try {
        const updated = await updateRuntimeStatus<RuntimeCodexJob>("codex_job", id, status);
        if (updated) {
          setCodexJobs((current) => current.map((item) => (item.id === id ? updated : item)));
          setNotice("Estado Codex actualizado en Supabase.");
          return;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido.";
        setNotice(`No se pudo actualizar job Codex en Supabase; se actualizo localmente. ${message}`);
      } finally {
        setIsSyncing(false);
      }
    }

    setCodexJobs((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  async function updateTaskStatus(id: string, status: RuntimeTask["status"]) {
    if (storageMode === "supabase") {
      setIsSyncing(true);
      try {
        const updated = await updateRuntimeStatus<RuntimeTask>("task", id, status);
        if (updated) {
          setTasks((current) => current.map((task) => (task.id === id ? updated : task)));
          setNotice("Estado de tarea actualizado en Supabase.");
          return;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido.";
        setNotice(`No se pudo actualizar tarea en Supabase; se actualizo localmente. ${message}`);
      } finally {
        setIsSyncing(false);
      }
    }

    setTasks((current) => current.map((task) => (task.id === id ? { ...task, status } : task)));
  }

  async function updateReviewStatus(id: string, status: RuntimeReview["status"]) {
    if (!canApprove) {
      setNotice("Solo Sergio puede aprobar, rechazar o importar aportes.");
      return;
    }

    if (storageMode === "supabase") {
      setIsSyncing(true);
      try {
        const updated = await updateRuntimeStatus<RuntimeReview>("review", id, status);
        if (updated) {
          setReviews((current) => current.map((review) => (review.id === id ? updated : review)));
          setNotice("Revision actualizada en Supabase.");
          return;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error desconocido.";
        setNotice(`No se pudo actualizar revision en Supabase; se actualizo localmente. ${message}`);
      } finally {
        setIsSyncing(false);
      }
    }

    setReviews((current) => current.map((review) => (review.id === id ? { ...review, status } : review)));
  }

  async function copyIdeaPrompt(idea: RuntimeIdea) {
    await navigator.clipboard.writeText(buildIdeaPrompt(idea));
    setNotice(`Prompt de idea copiado para ${reviewToolLabels[idea.reviewTool]}.`);
  }

  async function copyCodexJobPrompt(job: RuntimeCodexJob) {
    await navigator.clipboard.writeText(buildCodexJobPrompt(job));
    setNotice(`Prompt Codex copiado: ${job.title}.`);
  }

  async function copySnapshot() {
    await navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
    setNotice("Snapshot filtrado por rol copiado. Sergio exporta todo; otros roles solo su vista permitida.");
  }

  async function askAssistant(question = assistantQuestion) {
    const cleanedQuestion = question.trim();
    const localAnswer = buildAssistantAnswer({
      question: cleanedQuestion,
      role: selectedRole,
      leads: visibleLeads,
      tasks: visibleTasks,
      notes: visibleNotes,
      codexJobs: visibleCodexJobs,
    });
    setAssistantQuestion(cleanedQuestion);
    setAssistantAnswer(localAnswer);

    if (!cleanedQuestion) {
      return;
    }

    setAssistantLoading(true);
    try {
      const response = await fetch("/api/onia-center/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: cleanedQuestion }),
      });
      const body = (await response.json()) as AssistantApiResponse;

      if (response.ok && body.ok && body.answer) {
        const sourceLabel =
          body.mode === "openai" ? `OpenAI API${body.model ? ` (${body.model})` : ""}` : "Dify conectado";
        setAssistantAnswer(`${body.answer}\n\nFuente: ${sourceLabel} por ONIA Center.`);
        setNotice(`ONIA Bot respondio usando ${sourceLabel} con contexto filtrado por rol.`);
        return;
      }

      setAssistantAnswer(`${localAnswer}\n\nModo local: ${body.message ?? "Proveedor IA no configurado o no hay sesion valida."}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido.";
      setAssistantAnswer(`${localAnswer}\n\nModo local: no se pudo consultar el proveedor IA (${message}).`);
    } finally {
      setAssistantLoading(false);
    }
  }

  async function analyzeAudioIntelligence() {
    if (!audioFile && !audioTranscript.trim()) {
      setNotice("Sube un audio o pega un transcript antes de preparar la propuesta.");
      return;
    }

    setAudioLoading(true);
    setAudioResult(null);

    try {
      const formData = new FormData();
      if (audioFile) {
        formData.append("audio", audioFile);
      }
      formData.append("transcript", audioFile ? "" : audioTranscript.trim());
      formData.append("clientName", audioClientName.trim());
      formData.append("context", audioContext.trim());
      formData.append("objective", audioObjective);

      const response = await fetch("/api/onia-center/audio-intelligence", {
        method: "POST",
        body: formData,
      });
      const body = (await response.json()) as AudioApiResponse;
      setAudioResult(body);

      if (body.transcript && !audioTranscript.trim()) {
        setAudioTranscript(body.transcript);
      }

      if (response.ok && body.ok) {
        setNotice("Audio analizado. Revisa datos faltantes y propuesta antes de enviar algo al cliente.");
        return;
      }

      setNotice(body.message ?? "No se pudo completar el analisis del audio.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido.";
      setNotice(`No se pudo procesar Audio IA: ${message}`);
    } finally {
      setAudioLoading(false);
    }
  }

  async function copyAudioProposal() {
    await navigator.clipboard.writeText(formatAudioProposal(audioResult?.analysis));
    setNotice("Borrador de propuesta copiado para revision interna.");
  }

  async function copyAudioCrmNote() {
    await navigator.clipboard.writeText(formatAudioCrmNote(audioResult?.analysis));
    setNotice("Nota CRM copiada. No actualiza fuentes externas automaticamente.");
  }

  function resetRuntime() {
    if (storageMode === "supabase") {
      setNotice("Con Supabase activo no se borran datos desde este boton. Usa estados o acciones auditadas.");
      return;
    }

    setLeads([]);
    setTasks(starterTasks);
    setReviews(starterReviews);
    setNotes([]);
    setIdeas([]);
    setCodexJobs(starterCodexJobs);
    window.localStorage.removeItem(storageKey);
    window.localStorage.removeItem(legacyStorageKey);
    setNotice("Estado local reiniciado al seed operativo.");
  }

  const ideaVisibilityValue = selectedRole === "sergio"
    ? ideaForm.visibility
    : ideaForm.visibility === "sergio_private"
      ? "assigned_only"
      : ideaForm.visibility;
  const copy = workspaceCopy[workspaceView];
  const isDailyWorkspace = workspaceView === "daily";
  const showWorkspaceAdminActions = ["connections", "assistant", "codex-queue"].includes(workspaceView);
  const persistenceCopy = storageMode === "supabase"
    ? isDailyWorkspace
      ? "Datos sincronizados."
      : "Los cambios se sincronizan con Supabase self-hosted."
    : "Borrador local en este navegador.";
  const audioAnalysis = audioResult?.analysis ?? null;
  const audioProposal = proposalDraft(audioAnalysis);
  const audioTranscriptPreview = audioResult?.transcript || audioTranscript;
  const audioEngineTone = audioStatusTone(audioStatus);
  const AudioEngineIcon = audioEngineTone.icon;
  const audioSttLabel = audioSttSourceLabel(audioResult?.source);
  const audioAnalysisModel = audioResult?.source?.analysisModel ?? audioStatus?.openai?.model ?? "modelo no confirmado";
  const audioHasInput = Boolean(audioFile || audioTranscript.trim());

  return (
    <section className="onia-live-workspace" id="uso-diario" aria-label="Uso diario ONIA Center">
      <div className="onia-workspace-head">
        <div>
          <span>{copy.label}</span>
          <h2>{copy.title}</h2>
          <p>
            {copy.description} {persistenceCopy}
          </p>
        </div>
        {showWorkspaceAdminActions ? (
          <div className="onia-workspace-actions">
            <button type="button" onClick={copySnapshot}>
              <Copy size={15} />
              Copiar snapshot
            </button>
            <button type="button" onClick={resetRuntime}>
              <RotateCcw size={15} />
              {storageMode === "supabase" ? "Bloqueado DB" : "Reiniciar local"}
            </button>
          </div>
        ) : null}
      </div>

      <div className={`onia-live-metrics${isDailyWorkspace ? " is-focused" : ""}`}>
        {isDailyWorkspace ? (
          <>
            <article>
              <span>Tareas pendientes</span>
              <strong>{summary.pendingTasks}</strong>
              <small>Lo que mueve entrega y ventas hoy</small>
            </article>
            <article>
              <span>Leads abiertos</span>
              <strong>{summary.hotLeads}</strong>
              <small>Oportunidades visibles para {roleLabel(selectedRole)}</small>
            </article>
            <article>
              <span>Ideas para revisar</span>
              <strong>{summary.ideasInbox}</strong>
              <small>Referencias utiles, no ruido operativo</small>
            </article>
            <article>
              <span>Audio/propuestas</span>
              <strong>{summary.meetingNotes + summary.proposalLeads}</strong>
              <small>Reuniones o leads en etapa propuesta</small>
            </article>
          </>
        ) : (
          <>
            <article>
              <span>Leads abiertos</span>
              <strong>{summary.hotLeads}</strong>
              <small>Visibles para {roleLabel(selectedRole)}</small>
            </article>
            <article>
              <span>Tareas pendientes</span>
              <strong>{summary.pendingTasks}</strong>
              <small>Filtradas por rol</small>
            </article>
            <article>
              <span>Evidencia/info</span>
              <strong>{summary.evidenceRecords}</strong>
              <small>Pruebas o datos valiosos</small>
            </article>
            <article>
              <span>Ideas inbox</span>
              <strong>{summary.ideasInbox}</strong>
              <small>Reels, links y notas para IA</small>
            </article>
            {selectedRole === "sergio" || selectedRole === "arthur" ? (
              <article>
                <span>Codex listos</span>
                <strong>{summary.codexReady}</strong>
                <small>Jobs tecnicos con contexto</small>
              </article>
            ) : null}
            <article>
              <span>Cobros anotados</span>
              <strong>{summary.recordedPayments}</strong>
              <small>No aprueban comision solos</small>
            </article>
          </>
        )}
      </div>

      {workspaceView === "seller-services" ? (
        <div className="onia-seller-services">
          <article className="onia-live-card onia-service-update-panel">
            <div className="onia-live-title">
              <Bot size={16} />
              <strong>Actualizaciones comerciales</strong>
            </div>
            {canApprove ? (
              <div className="onia-service-update-form">
                <div className="onia-form-row">
                  <label>
                    Servicio
                    <select
                      value={serviceUpdateForm.serviceId}
                      onChange={(event) => setServiceUpdateForm({ ...serviceUpdateForm, serviceId: event.target.value })}
                    >
                      {operationalServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                      {vendorCommissionRules.map((rule) => (
                        <option key={rule.id} value={rule.id}>
                          {rule.serviceName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Visibilidad
                    <select
                      value={serviceUpdateForm.visibility}
                      onChange={(event) => setServiceUpdateForm({ ...serviceUpdateForm, visibility: event.target.value as ServiceUpdateForm["visibility"] })}
                    >
                      <option value="seller_safe">Vendedores + Arthur</option>
                      <option value="team_safe">Equipo seguro</option>
                      <option value="sergio_private">Solo Sergio</option>
                    </select>
                  </label>
                </div>
                <label>
                  Titulo de actualizacion
                  <input
                    value={serviceUpdateForm.title}
                    onChange={(event) => setServiceUpdateForm({ ...serviceUpdateForm, title: event.target.value })}
                    placeholder="Ej. Nuevo precio, alcance bloqueado, oferta prioritaria"
                  />
                </label>
                <label>
                  Resumen para vendedores
                  <textarea
                    value={serviceUpdateForm.detail}
                    onChange={(event) => setServiceUpdateForm({ ...serviceUpdateForm, detail: event.target.value })}
                    placeholder="Escribe que cambio, como explicarlo y que no deben prometer."
                    rows={3}
                  />
                </label>
                <button className="onia-primary-button" type="button" onClick={addServiceUpdate}>
                  {isSyncing ? "Publicando..." : "Publicar actualizacion"}
                </button>
              </div>
            ) : (
              <p className="onia-muted-note">Solo Sergio publica cambios de precio, alcance o comisiones. Tu vista muestra lo aprobado para vender.</p>
            )}

            <div className="onia-service-update-list">
              {visibleServiceUpdates.map((update) => (
                <div key={update.id}>
                  <span>{serviceNameById(update.linkedTo)} / {update.visibility ?? "asignado"}</span>
                  <strong>{update.title}</strong>
                  <small>{update.detail}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="onia-live-card onia-service-priority-card">
            <div className="onia-live-title">
              <ShieldCheck size={16} />
              <strong>Reglas para vender sin romper alcance</strong>
            </div>
            <div className="onia-service-rule-grid">
              <div>
                <span>Primero</span>
                <strong>ONIA Motor Local Growth</strong>
                <small>Setup Bs. 2.900 + mensual Bs. 1.900. Es el servicio que alimenta caja recurrente.</small>
              </div>
              <div>
                <span>Comision</span>
                <strong>Primer cobro real</strong>
                <small>No hay comision sin comprobante, lead registrado, servicio y seguimiento.</small>
              </div>
              <div>
                <span>Bloqueo</span>
                <strong>No prometer sistemas</strong>
                <small>Login, dashboard, base de datos o portal requieren diagnostico y aprobacion Sergio.</small>
              </div>
            </div>
          </article>

          <div className="onia-seller-service-section">
            <div className="onia-section-strip">
              <strong>Servicios operativos ONIA</strong>
              <span>Resumen, precio, incluye, limites y evidencia.</span>
            </div>
            <div className="onia-seller-service-grid">
              {operationalServices.map((service) => (
                <article className="onia-seller-service-card" key={service.id}>
                  <div>
                    <span>{service.plan} / prioridad {service.priority}</span>
                    <strong>{service.name}</strong>
                    <p>{service.salesScript ?? service.risk ?? "Servicio operativo ONIA."}</p>
                  </div>
                  <dl>
                    <div>
                      <dt>Precio</dt>
                      <dd>{servicePriceLabel(service.id)}</dd>
                    </div>
                    <div>
                      <dt>Comision</dt>
                      <dd>{service.sellerCommission ?? "Requiere aprobacion"}</dd>
                    </div>
                    <div>
                      <dt>Evidencia</dt>
                      <dd>{(service.evidenceRequired ?? []).slice(0, 3).join(", ") || "Sin evidencia definida"}</dd>
                    </div>
                  </dl>
                  <div className="onia-service-dos-donts">
                    <div>
                      <span>Incluye</span>
                      <small>{(service.includes ?? service.deliverables ?? []).slice(0, 4).join(" / ") || "Revisar checklist"}</small>
                    </div>
                    <div>
                      <span>No prometer</span>
                      <small>{(service.notIncluded ?? [service.risk ?? "Alcance fuera de catalogo"]).slice(0, 4).join(" / ")}</small>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="onia-seller-service-section">
            <div className="onia-section-strip">
              <strong>Catalogo vendedor</strong>
              <span>Precios y comisiones visibles. Arthur coordina, Sergio aprueba cambios.</span>
            </div>
            {Object.entries(sellerRulesByCategory).map(([category, rules]) => (
              <section className="onia-seller-rule-group" key={category}>
                <h3>{category}</h3>
                <div className="onia-seller-rule-grid">
                  {rules.map((rule) => (
                    <article className="onia-seller-rule-card" key={rule.id}>
                      <span>{rule.requiresSergioApproval ? "requiere aprobacion" : "vendible"}</span>
                      <strong>{rule.serviceName}</strong>
                      <p>{rule.offerWhen}</p>
                      <dl>
                        <div>
                          <dt>Precio</dt>
                          <dd>{rule.clientPriceLabel}</dd>
                        </div>
                        <div>
                          <dt>Comision</dt>
                          <dd>{rule.commissionLabel}{rule.firstPaymentOnly ? " / primer pago" : ""}</dd>
                        </div>
                      </dl>
                      <small>{rule.conditions[0]}</small>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : null}

      {workspaceView === "assistant" ? (
        <div className="onia-assistant-workspace">
          <article className="onia-live-card onia-assistant-panel">
            <div className="onia-live-title">
              <Bot size={16} />
              <strong>ONIA Bot por rol</strong>
            </div>
            <p>
              Responde solo con servicios, leads, tareas, notas y actualizaciones visibles para {roleLabel(selectedRole)}. No usa capital privado ni datos de otros roles.
            </p>
            <div className="onia-assistant-input">
              <input
                value={assistantQuestion}
                onChange={(event) => setAssistantQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void askAssistant();
                  }
                }}
                placeholder="Ej. Que paso con el cliente X, cuanto cuesta Web Pro, que vendo primero"
              />
              <button className="onia-primary-button" type="button" disabled={assistantLoading} onClick={() => void askAssistant()}>
                {assistantLoading ? "Consultando..." : "Preguntar"}
              </button>
            </div>
            <div className="onia-assistant-suggestions">
              {[
                "Que vendo primero?",
                "Precio de ONIA Motor Local Growth",
                "Actualizaciones de precios",
                "Clientes pendientes",
                "Tareas pendientes",
                ...(selectedRole === "sergio" || selectedRole === "arthur" ? ["Jobs Codex pendientes"] : []),
              ].map((question) => (
                <button key={question} type="button" disabled={assistantLoading} onClick={() => void askAssistant(question)}>
                  {question}
                </button>
              ))}
            </div>
          </article>

          <article className="onia-live-card onia-assistant-answer">
            <div className="onia-live-title">
              <MessageSquareOff size={16} />
              <strong>Respuesta</strong>
            </div>
            <pre>{assistantAnswer}</pre>
          </article>

          <article className="onia-live-card onia-assistant-scope">
            <div className="onia-live-title">
              <Database size={16} />
              <strong>Fuentes que puede leer</strong>
            </div>
            <div className="onia-service-rule-grid">
              <div>
                <span>Leads</span>
                <strong>{visibleLeads.length}</strong>
                <small>Solo responsables visibles para el rol.</small>
              </div>
              <div>
                <span>Tareas</span>
                <strong>{visibleTasks.length}</strong>
                <small>Asignadas o vista Sergio.</small>
              </div>
              <div>
                <span>Notas</span>
                <strong>{visibleNotes.length}</strong>
                <small>Incluye actualizaciones comerciales permitidas.</small>
              </div>
              <div>
                <span>Servicios</span>
                <strong>{operationalServices.length + visibleSellerRules.length}</strong>
                <small>Catalogo operativo y reglas vendedor visibles.</small>
              </div>
            </div>
          </article>
        </div>
      ) : null}

      {workspaceView === "audio-intelligence" ? (
        <div className="onia-audio-workspace">
          <div className="onia-audio-command-bar">
            <article className={audioEngineTone.className}>
              <AudioEngineIcon size={17} />
              <div>
                <span>Motor de transcripcion</span>
                <strong>{audioStatusLoading ? "Verificando..." : audioEngineTone.label}</strong>
                <small>{audioEngineTone.detail}</small>
              </div>
            </article>
            <article>
              <FileAudio2 size={17} />
              <div>
                <span>Ruta recomendada</span>
                <strong>OBS / WhatsApp / transcript</strong>
                <small>Sube audio cuando Speaches este activo o usa fallback barato si hace falta.</small>
              </div>
            </article>
            <article>
              <Bot size={17} />
              <div>
                <span>Analisis comercial</span>
                <strong>{audioStatus?.openai?.configured ? audioAnalysisModel : "OpenAI pendiente"}</strong>
                <small>{audioStatus?.openai?.configured ? "Modelo barato/usable para propuesta interna." : "Falta API key para propuesta."}</small>
              </div>
            </article>
            <article>
              <ClipboardCheck size={17} />
              <div>
                <span>Salida</span>
                <strong>Propuesta + CRM</strong>
                <small>No envia nada al cliente sin revision humana.</small>
              </div>
            </article>
          </div>

          <article className="onia-live-card onia-audio-input-panel">
            <div className="onia-live-title">
              <Mic size={16} />
              <strong>Nueva reunion</strong>
            </div>
            <div className="onia-audio-flow">
              <span className={audioFile ? "is-done" : ""}>1. Audio</span>
              <span className={audioTranscript.trim() ? "is-done" : ""}>2. Transcript</span>
              <span className={audioAnalysis ? "is-done" : ""}>3. Diagnostico</span>
              <span className={audioProposal ? "is-done" : ""}>4. Propuesta</span>
            </div>
            <div className="onia-form-row">
              <label>
                Cliente o empresa
                <input
                  value={audioClientName}
                  onChange={(event) => setAudioClientName(event.target.value)}
                  placeholder="Ej. Clinica Norte, restaurante, constructora"
                />
              </label>
              <label>
                Objetivo
                <select value={audioObjective} onChange={(event) => setAudioObjective(event.target.value as AudioObjective)}>
                  <option value="propuesta">Preparar propuesta</option>
                  <option value="seguimiento">Seguimiento CRM</option>
                  <option value="acta">Acta/resumen</option>
                </select>
              </label>
            </div>
            <label className="onia-audio-upload">
              <span>
                <Upload size={15} />
                Audio de reunion o WhatsApp
              </span>
              <input
                type="file"
                accept="audio/*,.ogg,.m4a,.mp3,.wav,.webm"
                onChange={(event) => setAudioFile(event.target.files?.[0] ?? null)}
              />
              <small>{audioFile ? `${audioFile.name} / ${Math.max(1, Math.round(audioFile.size / 1024 / 1024))} MB` : "Opcional si ya tienes transcript."}</small>
            </label>
            <div className="onia-audio-source-note">
              <CheckCircle2 size={14} />
              <span>OBS guarda en C:\Users\PC\Videos\ONIA-Reuniones. WhatsApp Web descarga `.ogg` y se sube aqui.</span>
            </div>
            <label>
              Transcript pegado
              <textarea
                value={audioTranscript}
                onChange={(event) => setAudioTranscript(event.target.value)}
                placeholder="Pega aqui el transcript si ya existe. Si subes audio, Speaches local o el fallback barato lo generan."
                rows={6}
              />
            </label>
            <label>
              Contexto interno
              <textarea
                value={audioContext}
                onChange={(event) => setAudioContext(event.target.value)}
                placeholder="Que sabemos del cliente, canal, urgencia, restricciones o servicio que pidio."
                rows={3}
              />
            </label>
            <button className="onia-primary-button" type="button" disabled={audioLoading} onClick={() => void analyzeAudioIntelligence()}>
              <Mic size={15} />
              {audioLoading ? "Procesando..." : audioHasInput ? "Analizar para propuesta" : "Sube audio o pega transcript"}
            </button>
            <p className="onia-muted-note">
              Primero intenta Speaches local/open source. Si no responde y hay API, usa `gpt-4o-mini-transcribe` como fallback barato. No guarda audio crudo desde esta pantalla.
            </p>
          </article>

          <article className="onia-live-card onia-audio-result-panel">
            <div className="onia-live-title">
              <FileCheck2 size={16} />
              <strong>Diagnostico comercial</strong>
            </div>
            <div className="onia-audio-engine-strip">
              <span>{audioSttLabel}</span>
              <span>Analisis: {audioAnalysisModel}</span>
              {audioResult?.source?.sttFallbackUsed ? <strong>Fallback usado</strong> : null}
            </div>
            {audioAnalysis ? (
              <>
                <div className="onia-audio-summary-grid">
                  <div>
                    <span>Empresa</span>
                    <strong>{audioText(audioAnalysis.empresa)}</strong>
                  </div>
                  <div>
                    <span>Interes</span>
                    <strong>{audioText(audioAnalysis.nivel_interes)}</strong>
                  </div>
                  <div>
                    <span>Presupuesto</span>
                    <strong>{audioText(audioAnalysis.presupuesto_mencionado)}</strong>
                  </div>
                  <div>
                    <span>Proximo paso</span>
                    <strong>{audioText(audioAnalysis.proximo_paso_acordado)}</strong>
                  </div>
                </div>
                <div className="onia-audio-facts">
                  <div>
                    <span>Necesidad principal</span>
                    <p>{audioText(audioAnalysis.necesidad_principal)}</p>
                  </div>
                  <div>
                    <span>Objeciones</span>
                    <p>{audioList(audioAnalysis.objeciones).join(" / ") || "por verificar"}</p>
                  </div>
                  <div>
                    <span>Informacion faltante</span>
                    <p>{audioList(audioAnalysis.informacion_faltante).join(" / ") || "por verificar"}</p>
                  </div>
                  <div>
                    <span>Riesgos</span>
                    <p>{audioList(audioAnalysis.riesgos).join(" / ") || "sin riesgos detectados"}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="onia-muted-note">
                {audioResult?.message ?? "Procesa un audio o transcript para extraer necesidad, objeciones, faltantes y siguiente paso."}
              </p>
            )}
          </article>

          <article className="onia-live-card onia-audio-proposal-panel">
            <div className="onia-live-title">
              <Bot size={16} />
              <strong>Borrador de propuesta</strong>
            </div>
            {audioProposal ? (
              <>
                <strong className="onia-audio-proposal-title">{audioText(audioProposal.titulo, "Propuesta ONIA")}</strong>
                <p>{audioText(audioProposal.diagnostico)}</p>
                <div className="onia-audio-proposal-grid">
                  <div>
                    <span>Alcance</span>
                    <ul>
                      {audioList(audioProposal.alcance_recomendado).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span>Entregables</span>
                    <ul>
                      {audioList(audioProposal.entregables).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span>Fuera de alcance</span>
                    <ul>
                      {audioList(audioProposal.fuera_de_alcance).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span>Precio y condiciones</span>
                    <p>{audioText(audioProposal.precio_sugerido)}</p>
                    <small>{audioList(audioProposal.condiciones).join(" / ") || "por verificar"}</small>
                  </div>
                </div>
                <div className="onia-audio-actions">
                  <button type="button" onClick={() => void copyAudioProposal()}>
                    <Copy size={15} />
                    Copiar propuesta
                  </button>
                  <button type="button" onClick={() => void copyAudioCrmNote()}>
                    <ClipboardCheck size={15} />
                    Copiar nota CRM
                  </button>
                </div>
              </>
            ) : (
              <p className="onia-muted-note">El borrador aparece despues del analisis. Si solo hay transcript, revisa la API de OpenAI o pega mas contexto del cliente.</p>
            )}
          </article>

          <article className="onia-live-card onia-audio-transcript-panel">
            <div className="onia-live-title">
              <Database size={16} />
              <strong>Transcript</strong>
            </div>
            <details open={Boolean(audioTranscriptPreview)}>
              <summary>{audioTranscriptPreview ? "Ver transcript completo" : "Sin transcript todavia"}</summary>
              <pre>{audioTranscriptPreview || "Sube un audio o pega un transcript para empezar."}</pre>
            </details>
            <div className="onia-audio-technical-note">
              <small>STT: {audioSttLabel}</small>
              <small>Analisis: {audioAnalysisModel}</small>
              {audioResult?.source?.sttAttempts?.length ? (
                <small>Intentos: {audioResult.source.sttAttempts.join(" | ")}</small>
              ) : null}
            </div>
          </article>
        </div>
      ) : null}

      {workspaceView === "daily" ? (
        <div className="onia-daily-command">
          <article className="onia-live-card onia-daily-agenda">
            <div className="onia-live-title">
              <CalendarDays size={16} />
              <strong>{selectedRole === "sergio" ? "Calendario estricto de hoy" : "Agenda privada protegida"}</strong>
            </div>
            {selectedRole === "sergio" ? (
              <>
                <div className="onia-calendar-summary">
                  <div>
                    <span>Arranque</span>
                    <strong>06:30</strong>
                    <small>Plan CEO antes de telefono.</small>
                  </div>
                  <div>
                    <span>Reuniones</span>
                    <strong>14:00-20:00</strong>
                    <small>Lunes a sabado, Cal + GCal.</small>
                  </div>
                  <div>
                    <span>Protegido</span>
                    <strong>Gym + personal</strong>
                    <small>No reuniones ni Higgsfield.</small>
                  </div>
                </div>
                <div className="onia-calendar-timeline is-compact">
                  {sergioStrictScheduleBlocks.slice(0, 7).map((block) => {
                    const CategoryIcon = scheduleCategoryIcons[block.category] ?? Clock;
                    return (
                      <div className={`onia-calendar-block is-${block.category}`} key={block.id}>
                        <span>
                          <CategoryIcon size={14} />
                          {block.start} - {block.end}
                        </span>
                        <strong>{block.title}</strong>
                        <small>{block.meetingPolicy === "available" ? "reuniones permitidas" : "bloqueado"}</small>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="onia-private-calendar">
                <ShieldCheck size={17} />
                <div>
                  <span>Privacidad Sergio</span>
                  <strong>No visible para este rol</strong>
                  <p>Tu inicio se limita a tus tareas, notas, evidencias y registros asignados.</p>
                </div>
              </div>
            )}
          </article>

          <article className="onia-live-card onia-daily-tasks">
            <div className="onia-live-title">
              <ClipboardCheck size={16} />
              <strong>Tareas del dia</strong>
            </div>
            <div className="onia-live-list">
              {pendingTodayTasks.length ? (
                pendingTodayTasks.map((task) => (
                  <div key={task.id}>
                    <span>{roleLabel(task.assignedRole)} / {task.priority} / {projectLabel(task.projectId)}</span>
                    <strong>{task.title}</strong>
                    <select value={task.status} onChange={(event) => updateTaskStatus(task.id, event.target.value as RuntimeTask["status"])}>
                      <option value="todo">Por hacer</option>
                      <option value="doing">En proceso</option>
                      <option value="review">Revision</option>
                      <option value="done">Listo</option>
                      <option value="blocked">Bloqueado</option>
                    </select>
                  </div>
                ))
              ) : (
                <div>
                  <span>Sin tareas pendientes visibles</span>
                  <strong>Crea una tarea rapida o revisa captura.</strong>
                  <small>Los filtros respetan el rol actual.</small>
                </div>
              )}
            </div>
          </article>

          <article className="onia-live-card onia-daily-capture">
            <div className="onia-live-title">
              <Plus size={16} />
              <strong>Captura rapida</strong>
            </div>
            <label>
              Tarea rapida
              <input value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} placeholder="Que hay que hacer hoy" />
            </label>
            <div className="onia-form-row">
              <label>
                Proyecto
                <select value={taskForm.projectId} onChange={(event) => setTaskForm({ ...taskForm, projectId: event.target.value })}>
                  {operatingProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Prioridad
                <select value={taskForm.priority} onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value as RuntimeTask["priority"] })}>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </label>
            </div>
            <button className="onia-primary-button" type="button" onClick={addTask}>
              {isSyncing ? "Guardando..." : "Crear tarea"}
            </button>
            <div className="onia-quick-note">
              <label>
                Nota, evidencia o dato valioso
                <input value={noteForm.title} onChange={(event) => setNoteForm({ ...noteForm, title: event.target.value, kind: noteForm.kind === "nota" ? "evidencia" : noteForm.kind })} placeholder="Ej. Captura enviada, cliente pidio demo, link importante" />
              </label>
              <label>
                Detalle o link
                <textarea value={noteForm.detail} onChange={(event) => setNoteForm({ ...noteForm, detail: event.target.value })} placeholder="Pega link, acuerdo, evidencia o contexto" rows={3} />
              </label>
              <button className="onia-secondary-button" type="button" onClick={addNote}>
                Guardar informacion
              </button>
            </div>
          </article>

          <article className="onia-live-card onia-daily-evidence">
            <div className="onia-live-title">
              <FileCheck2 size={16} />
              <strong>Evidencia e informacion reciente</strong>
            </div>
            <div className="onia-live-list">
              {recentEvidence.length ? (
                recentEvidence.map((note) => (
                  <div key={note.id}>
                    <span>{note.kind} / {roleLabel(note.actorRole ?? "sergio")}</span>
                    <strong>{note.title}</strong>
                    <small>{note.linkedTo || note.detail || "Sin relacion"}</small>
                  </div>
                ))
              ) : (
                <div>
                  <span>Sin evidencia visible</span>
                  <strong>Guarda capturas, links o datos valiosos desde captura rapida.</strong>
                  <small>Esto no aprueba pagos; solo deja trazabilidad.</small>
                </div>
              )}
            </div>
          </article>
        </div>
      ) : null}

      {workspaceView === "calendar" && selectedRole === "sergio" ? (
        <div className="onia-sergio-calendar" id="calendario-sergio">
          <article className="onia-live-card onia-sergio-calendar-main">
            <div className="onia-live-title">
              <CalendarDays size={16} />
              <strong>Calendario estricto Sergio</strong>
            </div>
            <div className="onia-calendar-summary">
              <div>
                <span>Hora de levantarse</span>
                <strong>06:30</strong>
                <small>Sin telefono hasta terminar plan CEO.</small>
              </div>
              <div>
                <span>Reuniones permitidas</span>
                <strong>14:00-20:00</strong>
                <small>Lunes a sabado, con buffer minimo de 15 min.</small>
              </div>
              <div>
                <span>Bloques protegidos</span>
                <strong>Gym + novia + dormir</strong>
                <small>No vender, no reuniones, no Higgsfield.</small>
              </div>
            </div>
            <div className="onia-calendar-timeline">
              {sergioStrictScheduleBlocks.map((block) => {
                const CategoryIcon = scheduleCategoryIcons[block.category] ?? Clock;
                return (
                  <div className={`onia-calendar-block is-${block.category}`} key={block.id}>
                    <span>
                      <CategoryIcon size={14} />
                      {block.start} - {block.end}
                    </span>
                    <strong>{block.title}</strong>
                    <small>
                      {block.dayPattern} / {scheduleCategoryLabels[block.category]} / {block.meetingPolicy === "available" ? "reuniones permitidas" : "bloqueado"}
                    </small>
                    <p>{block.note}</p>
                    {block.command ? <em>Telegram: {block.command}</em> : null}
                  </div>
                );
              })}
            </div>
          </article>

          <article className="onia-live-card onia-calendar-side">
            <div className="onia-live-title">
              <Clock size={16} />
              <strong>Ventanas de reunion</strong>
            </div>
            <div className="onia-live-list">
              {sergioMeetingWindows.map((window) => (
                <div key={window.id}>
                  <span>{window.dayPattern} / {window.start} - {window.end}</span>
                  <strong>{window.title}</strong>
                  <small>{window.bookingRule}</small>
                  <small>Permitido: {window.allowedFor.join(", ")}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="onia-live-card onia-calendar-side">
            <div className="onia-live-title">
              <Bot size={16} />
              <strong>Cal.com comercial</strong>
            </div>
            <div className="onia-calendar-summary">
              <div>
                <span>Modo</span>
                <strong>{commercialBookingPolicy.mode}</strong>
                <small>{commercialBookingPolicy.publicLinkStatus}</small>
              </div>
              <div>
                <span>Identidad publica</span>
                <strong>{commercialBookingPolicy.publicDisplayName}</strong>
                <small>{commercialBookingPolicy.calAccountEmail}</small>
              </div>
              <div>
                <span>Calendario</span>
                <strong>{commercialBookingPolicy.googleCalendarId}</strong>
                <small>{commercialBookingPolicy.timezone}</small>
              </div>
              <div>
                <span>Disponibilidad base</span>
                <strong>{commercialBookingPolicy.defaultAvailability}</strong>
                <small>Cerrado: {commercialBookingPolicy.closedDays.join(", ")}</small>
              </div>
            </div>
            <div className="onia-live-list">
              {commercialBookingPolicy.eventTypes.map((eventType) => (
                <div key={eventType.id}>
                  <span>{eventType.durationMinutes} min / {eventType.enabled ? "activo" : "desactivado"}</span>
                  <strong>{eventType.label}</strong>
                  <small>Anticipo: {eventType.minimumNotice} / Agenda: {eventType.bookingWindow}</small>
                  <small>{eventType.ownerRule}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="onia-live-card onia-calendar-side">
            <div className="onia-live-title">
              <MessageSquareOff size={16} />
              <strong>AlfredHQ personal + quiet Higgsfield</strong>
            </div>
            <div className="onia-higgsfield-quiet">
              <span>Estado</span>
              <strong>{higgsfieldQuietRule.status === "manual_only" ? "Manual por defecto" : "Programado permitido"}</strong>
              <p>{higgsfieldQuietRule.problem}</p>
              <p>{higgsfieldQuietRule.newRule}</p>
            </div>
            <div className="onia-live-list">
              {sergioAssistantCommands.map((item) => (
                <div key={item.id}>
                  <span>{item.tokenPolicy}</span>
                  <strong>{item.command}</strong>
                  <small>{item.purpose}</small>
                </div>
              ))}
            </div>
          </article>
        </div>
      ) : null}

      {workspaceView === "calendar" && selectedRole !== "sergio" ? (
        <div className="onia-sergio-calendar" id="calendario-sergio">
          <article className="onia-live-card onia-sergio-calendar-main">
            <div className="onia-live-title">
              <CalendarDays size={16} />
              <strong>Agenda comercial visible</strong>
            </div>
            <p className="onia-muted-note">
              Esta vista permite operar reuniones sin exponer la agenda privada de Sergio. La disponibilidad real se controla con Cal.com gratis y bloqueos en Google Calendar.
            </p>
            <div className="onia-calendar-summary">
              <div>
                <span>Disponibilidad ONIA</span>
                <strong>{commercialBookingPolicy.defaultAvailability}</strong>
                <small>Sergio y Arthur, configurable por dia.</small>
              </div>
              <div>
                <span>Identidad publica</span>
                <strong>{commercialBookingPolicy.publicDisplayName}</strong>
                <small>{commercialBookingPolicy.calAccountEmail}</small>
              </div>
              <div>
                <span>Vendedora</span>
                <strong>Horario propio</strong>
                <small>Puede configurar sus horas disponibles en Cal.</small>
              </div>
              <div>
                <span>Notificacion</span>
                <strong>{commercialBookingPolicy.notificationChannels.join(" + ")}</strong>
                <small>Aceptar, cancelar o reasignar.</small>
              </div>
            </div>
            <div className="onia-live-list">
              {sergioMeetingWindows.map((window) => (
                <div key={window.id}>
                  <span>{window.dayPattern} / {window.start} - {window.end}</span>
                  <strong>{window.title}</strong>
                  <small>{window.bookingRule}</small>
                  <small>Permitido: {window.allowedFor.join(", ")}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="onia-live-card onia-calendar-side">
            <div className="onia-live-title">
              <Bot size={16} />
              <strong>Tipos de reunion</strong>
            </div>
            <div className="onia-live-list">
              {commercialBookingPolicy.eventTypes.map((eventType) => (
                <div key={eventType.id}>
                  <span>{eventType.durationMinutes} min / {eventType.enabled ? "activo" : "desactivado"}</span>
                  <strong>{eventType.label}</strong>
                  <small>Anticipo: {eventType.minimumNotice} / Agenda: {eventType.bookingWindow}</small>
                  <small>{eventType.ownerRule}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="onia-live-card onia-calendar-side">
            <div className="onia-live-title">
              <ShieldCheck size={16} />
              <strong>Reglas de asignacion</strong>
            </div>
            <div className="onia-live-list">
              {commercialBookingPolicy.routingRules.map((rule) => (
                <div key={rule}>
                  <span>Regla operativa</span>
                  <strong>{rule}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="onia-live-card onia-calendar-side">
            <div className="onia-live-title">
              <FileCheck2 size={16} />
              <strong>Campos del formulario</strong>
            </div>
            <div className="onia-live-list">
              {commercialBookingPolicy.intakeFields.map((field) => (
                <div key={field}>
                  <span>Requerido</span>
                  <strong>{field}</strong>
                </div>
              ))}
            </div>
          </article>
        </div>
      ) : null}

      {workspaceView === "capture" ? (
      <div className="onia-live-grid">
        <article className="onia-live-card onia-seller-notebook-card">
          <div className="onia-live-title">
            <ClipboardCheck size={16} />
            <strong>{selectedRole === "seller" ? "Mi espacio comercial" : "Cuaderno comercial filtrado"}</strong>
          </div>
          <p className="onia-muted-note">
            Registra llamadas, mensajes, cobros, bloqueos, evidencias y proximos pasos. Sergio puede auditarlo; este rol no ve caja, capital, deuda ni utilidad privada.
          </p>
          <div className="onia-seller-notebook-metrics">
            <div>
              <span>Leads</span>
              <strong>{visibleLeads.length}</strong>
              <small>Propios o visibles</small>
            </div>
            <div>
              <span>Tareas</span>
              <strong>{visibleTasks.length}</strong>
              <small>Pendientes y seguimiento</small>
            </div>
            <div>
              <span>Registros</span>
              <strong>{workspaceNotes.length}</strong>
              <small>Llamadas, cobros y evidencia</small>
            </div>
          </div>
          <div className="onia-seller-checklist">
            {sellerNotebookChecklist.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="onia-live-list">
            {sellerNotebookNotes.length ? (
              sellerNotebookNotes.map((note) => (
                <div key={note.id}>
                  <span>{note.kind} / {roleLabel(note.actorRole ?? "sergio")}</span>
                  <strong>{note.title}</strong>
                  <small>{note.linkedTo || note.detail || "Sin relacion"}</small>
                </div>
              ))
            ) : (
              <div>
                <span>Sin registros visibles</span>
                <strong>Guarda aqui la primera llamada, seguimiento o evidencia.</strong>
                <small>Lo minimo: que paso, con quien, siguiente accion y si hay cobro.</small>
              </div>
            )}
          </div>
        </article>

        <article className="onia-live-card">
          <div className="onia-live-title">
            <Plus size={16} />
            <strong>Nuevo lead</strong>
          </div>
          <label>
            Empresa
            <input value={leadForm.company} onChange={(event) => setLeadForm({ ...leadForm, company: event.target.value })} placeholder="Ej. Clinica, tienda, ferreteria" />
          </label>
          <label>
            Contacto
            <input value={leadForm.contact} onChange={(event) => setLeadForm({ ...leadForm, contact: event.target.value })} placeholder="Nombre o referencia publica" />
          </label>
          <div className="onia-form-row">
            <label>
              Fuente
              <select value={leadForm.source} onChange={(event) => setLeadForm({ ...leadForm, source: event.target.value })}>
                <option>Instagram</option>
                <option>WhatsApp</option>
                <option>Referido</option>
                <option>Bolivian</option>
                <option>Web</option>
              </select>
            </label>
            <label>
              Responsable
              <select value={canApprove ? leadForm.owner : selectedRole} disabled={!canApprove} onChange={(event) => setLeadForm({ ...leadForm, owner: event.target.value as RoleId })}>
                <option value="sergio">Sergio</option>
                <option value="arthur">Arthur</option>
                <option value="seller">Vendedor</option>
              </select>
            </label>
          </div>
          <label>
            Servicio recomendado
            <select value={leadForm.serviceId} onChange={(event) => setLeadForm({ ...leadForm, serviceId: event.target.value })}>
              {leadServiceOptions.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.helper}
                </option>
              ))}
            </select>
          </label>
          <label>
            Proxima accion
            <input value={leadForm.nextAction} onChange={(event) => setLeadForm({ ...leadForm, nextAction: event.target.value })} placeholder="Llamar, mandar auditoria, agendar reunion" />
          </label>
          <button className="onia-primary-button" type="button" onClick={addLead}>
            {isSyncing ? "Guardando..." : "Guardar lead"}
          </button>
        </article>

        <article className="onia-live-card">
          <div className="onia-live-title">
            <ClipboardCheck size={16} />
            <strong>Nueva tarea</strong>
          </div>
          <label>
            Titulo
            <input value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} placeholder="Que hay que hacer" />
          </label>
          <label>
            Proyecto
            <select value={taskForm.projectId} onChange={(event) => setTaskForm({ ...taskForm, projectId: event.target.value })}>
              {operatingProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <div className="onia-form-row">
            <label>
              Responsable
              <select value={canApprove ? taskForm.assignedRole : selectedRole} disabled={!canApprove} onChange={(event) => setTaskForm({ ...taskForm, assignedRole: event.target.value as RoleId })}>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {roleLabel(role)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Prioridad
              <select value={taskForm.priority} onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value as RuntimeTask["priority"] })}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </label>
          </div>
          <button className="onia-primary-button" type="button" onClick={addTask}>
            {isSyncing ? "Guardando..." : "Crear tarea"}
          </button>

          <div className="onia-live-list">
            {visibleTasks.slice(0, 5).map((task) => (
              <div key={task.id}>
                <span>{roleLabel(task.assignedRole)} / {task.priority}</span>
                <strong>{task.title}</strong>
                <select
                  value={task.status}
                  onChange={(event) => updateTaskStatus(task.id, event.target.value as RuntimeTask["status"])}
                >
                  <option value="todo">Por hacer</option>
                  <option value="doing">En proceso</option>
                  <option value="review">Revision</option>
                  <option value="done">Listo</option>
                  <option value="blocked">Bloqueado</option>
                </select>
              </div>
            ))}
          </div>
        </article>

        <article className="onia-live-card">
          <div className="onia-live-title">
            <FileCheck2 size={16} />
            <strong>Revision collab</strong>
          </div>
          <div className="onia-live-list is-review">
            {visibleReviews.map((review) => (
              <div key={review.id}>
                <span>{review.type} / {review.sensitivity}</span>
                <strong>{review.source}</strong>
                <small>{review.title}</small>
                <div className="onia-review-actions">
                  <button type="button" disabled={!canApprove} onClick={() => updateReviewStatus(review.id, "aprobado")}>
                    Aprobar
                  </button>
                  <button type="button" disabled={!canApprove} onClick={() => updateReviewStatus(review.id, "rechazado")}>
                    Rechazar
                  </button>
                  <button type="button" disabled={!canApprove || review.status !== "aprobado"} onClick={() => updateReviewStatus(review.id, "importado")}>
                    Importar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="onia-live-card">
          <div className="onia-live-title">
            <HardDrive size={16} />
            <strong>Registro rapido</strong>
          </div>
          <div className="onia-form-row">
            <label>
              Tipo
              <select value={noteForm.kind} onChange={(event) => setNoteForm({ ...noteForm, kind: event.target.value as RuntimeNote["kind"] })}>
                <option value="llamada">Llamada</option>
                <option value="nota">Nota</option>
                <option value="cobro">Cobro</option>
                <option value="bloqueo">Bloqueo</option>
                <option value="idea">Idea corta</option>
                <option value="evidencia">Evidencia/info</option>
              </select>
            </label>
            <label>
              Relacionado
              <input value={noteForm.linkedTo} onChange={(event) => setNoteForm({ ...noteForm, linkedTo: event.target.value })} placeholder="Lead, proyecto o tarea" />
            </label>
          </div>
          <label>
            Titulo
            <input value={noteForm.title} onChange={(event) => setNoteForm({ ...noteForm, title: event.target.value })} placeholder="Resumen corto" />
          </label>
          <label>
            Detalle
            <textarea value={noteForm.detail} onChange={(event) => setNoteForm({ ...noteForm, detail: event.target.value })} placeholder="Notas, acuerdos, pendiente o evidencia" rows={4} />
          </label>
          <button className="onia-primary-button" type="button" onClick={addNote}>
            {isSyncing ? "Guardando..." : "Guardar registro"}
          </button>
          <div className="onia-live-list">
            {workspaceNotes.slice(0, 4).map((note) => (
              <div key={note.id}>
                <span>{note.kind} / {roleLabel(note.actorRole ?? "sergio")}</span>
                <strong>{note.title}</strong>
                <small>{note.linkedTo || "Sin relacion"}</small>
              </div>
            ))}
          </div>
        </article>
      </div>
      ) : null}

      {workspaceView === "ideas" ? (
      <div className="onia-ideas-board" id="ideas">
        <article className="onia-live-card">
          <div className="onia-live-title">
            <Lightbulb size={16} />
            <strong>Ideas Inbox</strong>
          </div>
          <label>
            Titulo o gancho
            <input value={ideaForm.title} onChange={(event) => setIdeaForm({ ...ideaForm, title: event.target.value })} placeholder="Ej. Reel para vender webs con auditoria rapida" />
          </label>
          <label>
            Link del reel o referencia
            <input value={ideaForm.url} onChange={(event) => setIdeaForm({ ...ideaForm, url: event.target.value })} placeholder="https://instagram.com/reel/..." />
          </label>
          <div className="onia-form-row">
            <label>
              Fuente
              <select value={ideaForm.source} onChange={(event) => setIdeaForm({ ...ideaForm, source: event.target.value as RuntimeIdea["source"] })}>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="web">Web</option>
                <option value="cliente">Cliente</option>
                <option value="otro">Otro</option>
              </select>
            </label>
            <label>
              Categoria
              <select value={ideaForm.category} onChange={(event) => setIdeaForm({ ...ideaForm, category: event.target.value as RuntimeIdea["category"] })}>
                <option value="contenido">Contenido</option>
                <option value="venta">Venta</option>
                <option value="producto">Producto</option>
                <option value="automatizacion">Automatizacion</option>
                <option value="bolivian">Bolivian</option>
                <option value="web">Web</option>
                <option value="chatbot">Chatbot</option>
                <option value="operacion">Operacion</option>
              </select>
            </label>
          </div>
          <div className="onia-form-row">
            <label>
              Revisar con
              <select value={ideaForm.reviewTool} onChange={(event) => setIdeaForm({ ...ideaForm, reviewTool: event.target.value as RuntimeIdea["reviewTool"] })}>
                <option value="codex">Codex</option>
                <option value="claude">Claude</option>
                <option value="self_hosted">Modelo self-hosted</option>
                <option value="manual">Manual</option>
              </select>
            </label>
            <label>
              Proyecto
              <select value={ideaForm.targetProjectId} onChange={(event) => setIdeaForm({ ...ideaForm, targetProjectId: event.target.value })}>
                {operatingProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="onia-form-row">
            <label>
              Responsable
              <select value={canApprove ? ideaForm.owner : selectedRole} disabled={!canApprove} onChange={(event) => setIdeaForm({ ...ideaForm, owner: event.target.value as RoleId })}>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {roleLabel(role)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Visibilidad
              <select value={ideaVisibilityValue} onChange={(event) => setIdeaForm({ ...ideaForm, visibility: event.target.value as RuntimeIdea["visibility"] })}>
                {selectedRole === "sergio" ? <option value="sergio_private">Privado Sergio</option> : null}
                <option value="assigned_only">Solo asignado</option>
                <option value="team_safe">Equipo seguro</option>
              </select>
            </label>
          </div>
          <label>
            Resumen
            <textarea value={ideaForm.summary} onChange={(event) => setIdeaForm({ ...ideaForm, summary: event.target.value })} placeholder="Que viste, que pasa en el reel, que problema resuelve" rows={3} />
          </label>
          <label>
            Por que sirve
            <textarea value={ideaForm.whyUseful} onChange={(event) => setIdeaForm({ ...ideaForm, whyUseful: event.target.value })} placeholder="Como podria ayudar a vender, crear producto, automatizar o mejorar ONIA" rows={3} />
          </label>
          <button className="onia-primary-button" type="button" onClick={addIdea}>
            {isSyncing ? "Guardando..." : "Guardar idea"}
          </button>
        </article>

        <article className="onia-live-card onia-idea-review">
          <div className="onia-live-title">
            <Bot size={16} />
            <strong>Ideas para revisar</strong>
          </div>
          <div className="onia-live-list">
            {visibleIdeas.length ? (
              visibleIdeas.slice(0, 8).map((idea) => (
                <div className="onia-idea-item" key={idea.id}>
                  <span>
                    {idea.source} / {idea.category} / {ideaVisibilityLabels[idea.visibility]}
                  </span>
                  <strong>{idea.title}</strong>
                  <small>{idea.summary || idea.whyUseful || projectLabel(idea.targetProjectId)}</small>
                  <div className="onia-idea-meta">
                    <span>{roleLabel(idea.owner)}</span>
                    <span>{reviewToolLabels[idea.reviewTool]}</span>
                    <span>{idea.status}</span>
                  </div>
                  <div className="onia-review-actions">
                    <button type="button" onClick={() => copyIdeaPrompt(idea)}>
                      <Copy size={13} />
                      Prompt
                    </button>
                    {idea.url ? (
                      <a href={idea.url} target="_blank" rel="noreferrer">
                        <ExternalLink size={13} />
                        Abrir
                      </a>
                    ) : null}
                    <select
                      value={idea.status}
                      disabled={!canApprove && idea.owner !== selectedRole}
                      onChange={(event) => updateIdeaStatus(idea.id, event.target.value as RuntimeIdea["status"])}
                    >
                      <option value="inbox">Inbox</option>
                      <option value="queued">En cola</option>
                      <option value="reviewed">Revisada</option>
                      <option value="approved" disabled={!canApprove}>Aprobada</option>
                      <option value="archived">Archivada</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <span>Sin ideas visibles</span>
                <strong>Guarda un reel, link o nota para revisar despues.</strong>
                <small>Los roles no ven ideas privadas ni asignaciones que no les corresponden.</small>
              </div>
            )}
          </div>
        </article>

        <article className="onia-live-card onia-access-card">
          <div className="onia-live-title">
            <ShieldCheck size={16} />
            <strong>Visibilidad y auditoria</strong>
          </div>
          <div className="onia-access-rules">
            <div>
              <span>Sergio</span>
              <strong>Ve todo y aprueba</strong>
              <small>Leads, tareas, ideas, notas, collab y actividad del equipo.</small>
            </div>
            <div>
              <span>Arthur / vendedor</span>
              <strong>Solo lo asignado o seguro</strong>
              <small>No capital privado, deuda, estrategia, caja real ni utilidad interna.</small>
            </div>
            <div>
              <span>Freelancer</span>
              <strong>Solo entregable asignado</strong>
              <small>Sin CRM completo, finanzas, clientes sensibles ni decisiones.</small>
            </div>
          </div>
          <div className="onia-live-list">
            {teamActivity.map((item) => (
              <div key={`${item.label}-${item.id}`}>
                <span>{item.label} / {roleLabel(item.actor)}</span>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </div>
            ))}
          </div>
        </article>
      </div>
      ) : null}

      {workspaceView === "codex-queue" ? (
      <div className="onia-codex-workspace" id="codex-queue">
        <article className="onia-live-card onia-codex-form">
          <div className="onia-live-title">
            <Bot size={16} />
            <strong>Nuevo trabajo para Codex</strong>
          </div>
          {selectedRole === "sergio" || selectedRole === "arthur" ? (
            <>
              <label>
                Objetivo tecnico
                <input
                  value={codexJobForm.title}
                  onChange={(event) => setCodexJobForm({ ...codexJobForm, title: event.target.value })}
                  placeholder="Ej. Conectar Supabase real a ONIA Center"
                />
              </label>
              <div className="onia-form-row">
                <label>
                  Proyecto
                  <select value={codexJobForm.projectId} onChange={(event) => setCodexJobForm({ ...codexJobForm, projectId: event.target.value })}>
                    {operatingProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Repo/ruta
                  <input
                    value={codexJobForm.targetRepo}
                    onChange={(event) => setCodexJobForm({ ...codexJobForm, targetRepo: event.target.value })}
                    placeholder="onia-hermes, dental-saas, Gestios..."
                  />
                </label>
              </div>
              <div className="onia-form-row">
                <label>
                  Tipo
                  <select
                    value={codexJobForm.requestType}
                    onChange={(event) => setCodexJobForm({ ...codexJobForm, requestType: event.target.value as RuntimeCodexJob["requestType"] })}
                  >
                    <option value="feature">Feature</option>
                    <option value="bugfix">Bugfix</option>
                    <option value="audit">Auditoria</option>
                    <option value="docs">Docs</option>
                    <option value="refactor">Refactor</option>
                    <option value="ops">Ops</option>
                  </select>
                </label>
                <label>
                  Riesgo
                  <select value={codexJobForm.risk} onChange={(event) => setCodexJobForm({ ...codexJobForm, risk: event.target.value as RuntimeCodexJob["risk"] })}>
                    <option value="bajo">Bajo</option>
                    <option value="medio">Medio</option>
                    <option value="alto">Alto</option>
                  </select>
                </label>
              </div>
              <div className="onia-form-row">
                <label>
                  Responsable
                  <select
                    value={selectedRole === "sergio" ? codexJobForm.owner : selectedRole}
                    disabled={selectedRole !== "sergio"}
                    onChange={(event) => setCodexJobForm({ ...codexJobForm, owner: event.target.value as RoleId })}
                  >
                    <option value="sergio">Sergio</option>
                    <option value="arthur">Arthur</option>
                  </select>
                </label>
                <label>
                  Visibilidad
                  <select
                    value={selectedRole === "sergio" ? codexJobForm.visibility : "internal_restricted"}
                    disabled={selectedRole !== "sergio"}
                    onChange={(event) => setCodexJobForm({ ...codexJobForm, visibility: event.target.value as RuntimeCodexJob["visibility"] })}
                  >
                    <option value="sergio_private">Solo Sergio</option>
                    <option value="internal_restricted">Sergio + Arthur</option>
                  </select>
                </label>
              </div>
              <label>
                Contexto real
                <textarea
                  value={codexJobForm.context}
                  onChange={(event) => setCodexJobForm({ ...codexJobForm, context: event.target.value })}
                  placeholder="Que pasa, por que importa, que decisiones ya existen y que no debe tocar."
                  rows={4}
                />
              </label>
              <label>
                Archivos/rutas relevantes
                <textarea
                  value={codexJobForm.files}
                  onChange={(event) => setCodexJobForm({ ...codexJobForm, files: event.target.value })}
                  placeholder="Rutas, docs canonicos, componentes o migraciones."
                  rows={3}
                />
              </label>
              <label>
                Criterios de aceptacion
                <textarea
                  value={codexJobForm.acceptance}
                  onChange={(event) => setCodexJobForm({ ...codexJobForm, acceptance: event.target.value })}
                  placeholder="Que debe quedar funcionando para considerar esto cerrado."
                  rows={3}
                />
              </label>
              <div className="onia-form-row">
                <label>
                  Validacion
                  <textarea
                    value={codexJobForm.validation}
                    onChange={(event) => setCodexJobForm({ ...codexJobForm, validation: event.target.value })}
                    rows={3}
                  />
                </label>
                <label>
                  Evidencia esperada
                  <textarea
                    value={codexJobForm.evidence}
                    onChange={(event) => setCodexJobForm({ ...codexJobForm, evidence: event.target.value })}
                    placeholder="Commit, captura, test, bloqueo exacto o link de PR."
                    rows={3}
                  />
                </label>
              </div>
              <button className="onia-primary-button" type="button" onClick={addCodexJob}>
                {isSyncing ? "Guardando..." : selectedRole === "sergio" ? "Crear job listo" : "Proponer job"}
              </button>
            </>
          ) : (
            <p className="onia-muted-note">Vendedores y freelancers no crean trabajos Codex. Registra la necesidad como tarea, nota o lead para revision.</p>
          )}
        </article>

        <article className="onia-live-card onia-codex-list">
          <div className="onia-live-title">
            <ClipboardCheck size={16} />
            <strong>Cola operativa</strong>
          </div>
          <div className="onia-codex-stats">
            <div>
              <span>Listos</span>
              <strong>{visibleCodexJobs.filter((job) => job.status === "ready").length}</strong>
            </div>
            <div>
              <span>En Codex</span>
              <strong>{visibleCodexJobs.filter((job) => job.status === "in_codex").length}</strong>
            </div>
            <div>
              <span>Bloqueados</span>
              <strong>{visibleCodexJobs.filter((job) => job.status === "blocked").length}</strong>
            </div>
          </div>
          <div className="onia-live-list is-codex">
            {visibleCodexJobs.length ? (
              visibleCodexJobs.map((job) => (
                <div className="onia-codex-item" key={job.id}>
                  <span>{projectLabel(job.projectId)} / {job.targetRepo} / riesgo {job.risk}</span>
                  <strong>{job.title}</strong>
                  <small>{job.context}</small>
                  <div className="onia-idea-meta">
                    <span>{roleLabel(job.owner)}</span>
                    <span>{job.requestType}</span>
                    <span>{job.visibility}</span>
                  </div>
                  <div className="onia-codex-detail-grid">
                    <div>
                      <span>Archivos</span>
                      <small>{job.files || "Pendiente de rutas concretas"}</small>
                    </div>
                    <div>
                      <span>Aceptacion</span>
                      <small>{job.acceptance || "Pendiente de criterio claro"}</small>
                    </div>
                    <div>
                      <span>Validacion</span>
                      <small>{job.validation || "Pendiente de checks"}</small>
                    </div>
                    <div>
                      <span>Evidencia</span>
                      <small>{job.evidence || "Pendiente"}</small>
                    </div>
                  </div>
                  <div className="onia-review-actions">
                    <button type="button" onClick={() => copyCodexJobPrompt(job)}>
                      <Copy size={13} />
                      Prompt Codex
                    </button>
                    <select
                      value={job.status}
                      disabled={selectedRole !== "sergio" && job.owner !== selectedRole}
                      onChange={(event) => updateCodexJobStatus(job.id, event.target.value as RuntimeCodexJob["status"])}
                    >
                      <option value="draft">Borrador</option>
                      <option value="ready" disabled={selectedRole !== "sergio"}>Listo</option>
                      <option value="in_codex" disabled={selectedRole !== "sergio"}>En Codex</option>
                      <option value="review" disabled={selectedRole !== "sergio"}>Revision</option>
                      <option value="done" disabled={selectedRole !== "sergio"}>Cerrado</option>
                      <option value="blocked">Bloqueado</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <span>Sin jobs visibles</span>
                <strong>No hay trabajo tecnico asignado a tu rol.</strong>
                <small>Usa Captura para registrar una necesidad si requiere revision.</small>
              </div>
            )}
          </div>
        </article>

        <article className="onia-live-card onia-access-card">
          <div className="onia-live-title">
            <ShieldCheck size={16} />
            <strong>Regla de ejecucion</strong>
          </div>
          <div className="onia-access-rules">
            <div>
              <span>Sergio</span>
              <strong>Aprueba y cierra</strong>
              <small>Puede mover jobs a listo, en Codex, revision y cerrado.</small>
            </div>
            <div>
              <span>Arthur</span>
              <strong>Propone contexto</strong>
              <small>Puede sugerir trabajos internos restringidos, no aprobar ni cerrar.</small>
            </div>
            <div>
              <span>Vendedor/Freelancer</span>
              <strong>No ve cola tecnica</strong>
              <small>Registra tareas o evidencia; Sergio decide si pasa a Codex.</small>
            </div>
          </div>
        </article>
      </div>
      ) : null}

      {workspaceView === "connections" ? (
      <div className="onia-selfhosted-panel">
        <article>
          <Database size={17} />
          <div>
            <span>Estado self-hosted</span>
            <strong>
              {storageMode === "checking"
                ? "Verificando conexion"
                : storageMode === "supabase"
                  ? "Supabase privado conectado"
                  : "Modo local con fallback"}
            </strong>
            <p>
              {storageMode === "supabase"
                ? "La API server-side escribe en onia_center sin exponer service role al navegador."
                : "La app funciona en este navegador. Para multiusuario revisa env vars y tunnel/DNS privado."}
            </p>
          </div>
        </article>
        <article>
          <ShieldCheck size={17} />
          <div>
            <span>Requisitos para operar multiusuario</span>
            <strong>Env + policies + backups</strong>
            <p>NEXT_PUBLIC_SUPABASE_URL, anon key publica, service role solo servidor, RLS por membership y backup diario del stack privado.</p>
          </div>
        </article>
        <article>
          <HardDrive size={17} />
          <div>
            <span>Adaptadores</span>
            <strong>{externalAdapters.length} definidos</strong>
            <p>TR4, collab, Notion, n8n, WhatsApp, Cal y StockCam siguen aislados del core.</p>
          </div>
        </article>
      </div>
      ) : null}

      <div className="onia-runtime-notice">{notice}</div>
      {workspaceView === "connections" ? (
      <div className="onia-runtime-export">
        <span>Snapshot actual filtrado por rol</span>
        <pre>{JSON.stringify(snapshot, null, 2)}</pre>
        <small>{formatBs(0)} registrados como cobro real hasta integrar conciliacion. Las notas de cobro no aprueban comisiones.</small>
      </div>
      ) : null}
    </section>
  );
}
