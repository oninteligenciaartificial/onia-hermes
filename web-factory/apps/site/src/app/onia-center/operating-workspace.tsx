"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  ClipboardCheck,
  Copy,
  Database,
  ExternalLink,
  FileCheck2,
  HardDrive,
  Lightbulb,
  Plus,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { formatBs } from "./engine";
import {
  collabIngestionItems,
  externalAdapters,
  operatingProjects,
  operatingTasks,
} from "./operating-source";
import { operationalServices } from "./source";
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
  kind: "llamada" | "nota" | "cobro" | "bloqueo" | "idea";
  title: string;
  detail: string;
  linkedTo: string;
  actorRole?: RoleId;
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

type LeadForm = Omit<RuntimeLead, "id" | "createdAt" | "status">;
type TaskForm = Omit<RuntimeTask, "id" | "createdAt" | "status" | "evidence">;
type NoteForm = Omit<RuntimeNote, "id" | "createdAt" | "actorRole">;
type IdeaForm = Omit<RuntimeIdea, "id" | "createdAt" | "status">;
type StorageMode = "checking" | "supabase" | "local";
type RuntimeData = {
  leads: RuntimeLead[];
  tasks: RuntimeTask[];
  reviews: RuntimeReview[];
  notes: RuntimeNote[];
  ideas: RuntimeIdea[];
};
type RuntimeApiResponse<T = RuntimeData> = {
  ok: boolean;
  mode: "supabase" | "configuration_pending" | "supabase_error";
  message: string;
  missingConfiguration?: string[];
  data: T | null;
};

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

const starterReviews: RuntimeReview[] = collabIngestionItems.map((item) => ({
  id: item.id,
  source: item.sourcePath,
  title: item.summary,
  type: item.classification,
  sensitivity: item.sensitivity,
  status: "pendiente",
}));

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
  };
}

async function fetchRuntimeData() {
  const response = await fetch("/api/onia-center/runtime", { cache: "no-store" });
  return (await response.json()) as RuntimeApiResponse;
}

async function createRuntimeEntity<T>(entity: "lead" | "task" | "note" | "idea", data: T) {
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

async function updateRuntimeStatus<T>(entity: "task" | "review" | "idea", id: string, status: string) {
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

function timeRank(value: string) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
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

export function OperatingWorkspace({ selectedRole }: { selectedRole: RoleId }) {
  const [leads, setLeads] = useState<RuntimeLead[]>([]);
  const [tasks, setTasks] = useState<RuntimeTask[]>(starterTasks);
  const [reviews, setReviews] = useState<RuntimeReview[]>(starterReviews);
  const [notes, setNotes] = useState<RuntimeNote[]>([]);
  const [ideas, setIdeas] = useState<RuntimeIdea[]>([]);
  const [leadForm, setLeadForm] = useState<LeadForm>(emptyLeadForm);
  const [taskForm, setTaskForm] = useState<TaskForm>(emptyTaskForm);
  const [noteForm, setNoteForm] = useState<NoteForm>(emptyNoteForm);
  const [ideaForm, setIdeaForm] = useState<IdeaForm>(emptyIdeaForm);
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
          setStorageMode("supabase");
          setNotice("Conectado a Supabase self-hosted. Los nuevos registros se guardan en onia_center.");
          return;
        }

        setStorageMode("local");
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

    window.localStorage.setItem(storageKey, JSON.stringify({ leads, tasks, reviews, notes, ideas }));
  }, [hydrated, ideas, leads, notes, reviews, storageMode, tasks]);

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
    () => (selectedRole === "sergio" ? notes : notes.filter((note) => note.actorRole === selectedRole)),
    [notes, selectedRole],
  );
  const visibleIdeas = useMemo(
    () => ideas.filter((idea) => canViewIdea(idea, selectedRole)),
    [ideas, selectedRole],
  );

  const summary = useMemo(() => {
    const hotLeads = visibleLeads.filter((lead) => ["nuevo", "contactado", "reunion", "propuesta"].includes(lead.status)).length;
    const pendingTasks = visibleTasks.filter((task) => !["done", "blocked"].includes(task.status)).length;
    const pendingReviews = visibleReviews.filter((review) => review.status === "pendiente").length;
    const recordedPayments = visibleNotes.filter((note) => note.kind === "cobro").length;
    const ideasInbox = visibleIdeas.filter((idea) => ["inbox", "queued"].includes(idea.status)).length;

    return { hotLeads, pendingTasks, pendingReviews, recordedPayments, ideasInbox };
  }, [visibleIdeas, visibleLeads, visibleNotes, visibleReviews, visibleTasks]);

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
  }, [visibleIdeas, visibleLeads, visibleNotes, visibleTasks]);

  const snapshot = useMemo(
    () => ({
      role: selectedRole,
      leads: visibleLeads,
      tasks: visibleTasks,
      reviews: visibleReviews,
      notes: visibleNotes,
      ideas: visibleIdeas,
      exportedAt: nowIso(),
    }),
    [selectedRole, visibleIdeas, visibleLeads, visibleNotes, visibleReviews, visibleTasks],
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

  async function copySnapshot() {
    await navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
    setNotice("Snapshot filtrado por rol copiado. Sergio exporta todo; otros roles solo su vista permitida.");
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
    window.localStorage.removeItem(storageKey);
    window.localStorage.removeItem(legacyStorageKey);
    setNotice("Estado local reiniciado al seed operativo.");
  }

  const ideaVisibilityValue = selectedRole === "sergio"
    ? ideaForm.visibility
    : ideaForm.visibility === "sergio_private"
      ? "assigned_only"
      : ideaForm.visibility;

  return (
    <section className="onia-live-workspace" id="uso-diario" aria-label="Uso diario ONIA Center">
      <div className="onia-workspace-head">
        <div>
          <span>Uso inmediato</span>
          <h2>Operacion diaria funcional</h2>
          <p>
            Captura leads, crea tareas, revisa aportes, guarda ideas de reels/links y deja notas.
            {storageMode === "supabase"
              ? " Los cambios se sincronizan con Supabase self-hosted."
              : " Todo persiste en este navegador mientras falta configuracion server-side."}
          </p>
        </div>
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
      </div>

      <div className="onia-live-metrics">
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
          <span>Ideas inbox</span>
          <strong>{summary.ideasInbox}</strong>
          <small>Reels, links y notas para IA</small>
        </article>
        <article>
          <span>Revision collab</span>
          <strong>{summary.pendingReviews}</strong>
          <small>Solo Sergio aprueba</small>
        </article>
        <article>
          <span>Cobros anotados</span>
          <strong>{summary.recordedPayments}</strong>
          <small>No aprueban comision solos</small>
        </article>
      </div>

      <div className="onia-live-grid">
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
              {operationalServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
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
            {visibleNotes.slice(0, 4).map((note) => (
              <div key={note.id}>
                <span>{note.kind} / {roleLabel(note.actorRole ?? "sergio")}</span>
                <strong>{note.title}</strong>
                <small>{note.linkedTo || "Sin relacion"}</small>
              </div>
            ))}
          </div>
        </article>
      </div>

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

      <div className="onia-runtime-notice">{notice}</div>
      <div className="onia-runtime-export">
        <span>Snapshot actual filtrado por rol</span>
        <pre>{JSON.stringify(snapshot, null, 2)}</pre>
        <small>{formatBs(0)} registrados como cobro real hasta integrar conciliacion. Las notas de cobro no aprueban comisiones.</small>
      </div>
    </section>
  );
}
