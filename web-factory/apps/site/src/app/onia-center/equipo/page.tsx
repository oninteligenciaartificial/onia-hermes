"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ClipboardCheck,
  ExternalLink,
  Lightbulb,
  ListChecks,
  LogOut,
  Plus,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import "../onia-center.css";
import type { RoleId } from "../types";

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

type RuntimeNote = {
  id: string;
  kind: "llamada" | "nota" | "cobro" | "bloqueo" | "idea" | "evidencia";
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

type RuntimeSnapshot = {
  leads: RuntimeLead[];
  tasks: RuntimeTask[];
  reviews: Array<{
    id: string;
    source: string;
    title: string;
    type: string;
    sensitivity: string;
    status: string;
  }>;
  notes: RuntimeNote[];
  ideas: RuntimeIdea[];
};

type AuthStatusResponse = {
  ok: boolean;
  mode: string;
  message?: string;
  actor?: {
    userKey: string;
    displayName: string;
    role: RoleId;
    memberships: Array<{
      organizationKey: string;
      role: RoleId;
      scope: string;
      canViewSensitive: boolean;
    }>;
  } | null;
};

type RuntimeApiResponse<T = RuntimeSnapshot> = {
  ok: boolean;
  mode: string;
  message: string;
  actor?: {
    userKey: string;
    displayName: string;
    role: RoleId;
  };
  data: T | null;
};

type TeamEntity = "lead" | "task" | "note" | "idea";

const serviceOptions = [
  { id: "onia-motor-local-growth", label: "ONIA Motor Local Growth" },
  { id: "onia-motor-local-starter", label: "Motor Local Starter" },
  { id: "onia-motor-local-pro", label: "Motor Local Pro" },
  { id: "web-pro-onia", label: "Web Pro ONIA" },
];

const projectOptions = [
  { id: "project-webs", label: "Webs ONIA" },
  { id: "project-chatbots", label: "Chatbots" },
  { id: "project-automations", label: "Automatizaciones" },
  { id: "project-dentagest", label: "DentalGest" },
  { id: "project-gestios", label: "GestiOS" },
  { id: "project-bolivian-os", label: "Bolivian Electric" },
  { id: "project-content", label: "Contenido" },
];

const roleLabels: Record<RoleId, string> = {
  sergio: "Sergio",
  area: "Responsable de area",
  arthur: "Arthur",
  seller: "Vendedor",
  freelancer: "Freelancer",
};

const emptyRuntime: RuntimeSnapshot = {
  leads: [],
  tasks: [],
  reviews: [],
  notes: [],
  ideas: [],
};

function projectLabel(projectId: string) {
  return projectOptions.find((project) => project.id === projectId)?.label ?? projectId;
}

function serviceLabel(serviceId: string) {
  return serviceOptions.find((service) => service.id === serviceId)?.label ?? serviceId;
}

function statusLabel(value: string) {
  return value.replace(/_/g, " ");
}

async function parseJson<T>(response: Response) {
  const body = (await response.json()) as T;
  if (!response.ok) {
    const message = typeof body === "object" && body && "message" in body ? String(body.message) : "Error de ONIA Center.";
    throw new Error(message);
  }
  return body;
}

export default function OniaCenterTeamPage() {
  const [actor, setActor] = useState<AuthStatusResponse["actor"]>(null);
  const [runtime, setRuntime] = useState<RuntimeSnapshot>(emptyRuntime);
  const [notice, setNotice] = useState("Cargando vista segura del equipo...");
  const [isSaving, setIsSaving] = useState(false);
  const [leadForm, setLeadForm] = useState({
    company: "",
    contact: "",
    source: "Manual",
    serviceId: "onia-motor-local-growth",
    nextAction: "",
  });
  const [taskForm, setTaskForm] = useState({
    projectId: "project-webs",
    title: "",
    priority: "media" as RuntimeTask["priority"],
  });
  const [noteForm, setNoteForm] = useState({
    kind: "nota" as RuntimeNote["kind"],
    title: "",
    detail: "",
    linkedTo: "",
  });
  const [ideaForm, setIdeaForm] = useState({
    title: "",
    url: "",
    source: "instagram" as RuntimeIdea["source"],
    category: "contenido" as RuntimeIdea["category"],
    summary: "",
    whyUseful: "",
    targetProjectId: "project-content",
    visibility: "assigned_only" as RuntimeIdea["visibility"],
    reviewTool: "codex" as RuntimeIdea["reviewTool"],
  });

  async function loadRuntime() {
    const [statusBody, runtimeBody] = await Promise.all([
      fetch("/api/onia-center/auth/status", { cache: "no-store" }).then((response) => parseJson<AuthStatusResponse>(response)),
      fetch("/api/onia-center/runtime", { cache: "no-store" }).then((response) => parseJson<RuntimeApiResponse>(response)),
    ]);

    setActor(statusBody.actor ?? null);
    setRuntime(runtimeBody.data ?? emptyRuntime);
    setNotice(runtimeBody.message || "Vista segura cargada.");
  }

  useEffect(() => {
    loadRuntime().catch((error) => {
      const message = error instanceof Error ? error.message : "No se pudo cargar ONIA Center.";
      setNotice(message);
      if (message.toLowerCase().includes("sesion") || message.toLowerCase().includes("auth")) {
        window.location.href = "/onia-center/login?next=/onia-center/equipo&reason=auth_required";
      }
    });
  }, []);

  const metrics = useMemo(
    () => [
      { label: "Leads visibles", value: runtime.leads.length, detail: "Filtrados por rol desde Supabase/RLS." },
      { label: "Tareas asignadas", value: runtime.tasks.length, detail: "Cierre final solo Sergio." },
      { label: "Ideas en revision", value: runtime.ideas.filter((idea) => idea.status !== "archived").length, detail: "Codex, Claude o modelo local." },
      { label: "Notas registradas", value: runtime.notes.length, detail: "Llamadas, bloqueos y seguimiento." },
    ],
    [runtime],
  );

  async function createEntity(entity: TeamEntity, data: unknown) {
    setIsSaving(true);
    setNotice("Guardando en ONIA Center...");
    try {
      await fetch("/api/onia-center/runtime", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entity, data }),
      }).then((response) => parseJson(response));
      await loadRuntime();
      setNotice("Registrado correctamente.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setIsSaving(false);
    }
  }

  async function updateTaskStatus(taskId: string, status: RuntimeTask["status"]) {
    setNotice("Actualizando tarea...");
    try {
      await fetch("/api/onia-center/runtime", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ entity: "task", id: taskId, status }),
      }).then((response) => parseJson(response));
      await loadRuntime();
      setNotice(status === "review" ? "Tarea enviada a revision de Sergio." : "Tarea actualizada.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo actualizar.");
    }
  }

  async function logout() {
    await fetch("/api/onia-center/auth/logout", { method: "POST" });
    window.location.href = "/onia-center/login?next=/onia-center/equipo";
  }

  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createEntity("lead", {
      ...leadForm,
      status: "nuevo",
      owner: actor?.role ?? "seller",
      createdAt: new Date().toISOString(),
    });
    setLeadForm({ company: "", contact: "", source: "Manual", serviceId: "onia-motor-local-growth", nextAction: "" });
  }

  function handleTaskSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createEntity("task", {
      ...taskForm,
      status: "todo",
      assignedRole: actor?.role ?? "seller",
      evidence: "pendiente",
      createdAt: new Date().toISOString(),
    });
    setTaskForm({ projectId: "project-webs", title: "", priority: "media" });
  }

  function handleNoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createEntity("note", {
      ...noteForm,
      actorRole: actor?.role ?? "seller",
      createdAt: new Date().toISOString(),
    });
    setNoteForm({ kind: "nota", title: "", detail: "", linkedTo: "" });
  }

  function handleIdeaSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createEntity("idea", {
      ...ideaForm,
      owner: actor?.role ?? "seller",
      status: "inbox",
      createdAt: new Date().toISOString(),
    });
    setIdeaForm({
      title: "",
      url: "",
      source: "instagram",
      category: "contenido",
      summary: "",
      whyUseful: "",
      targetProjectId: "project-content",
      visibility: "assigned_only",
      reviewTool: "codex",
    });
  }

  return (
    <main className="onia-center-page onia-team-page">
      <aside className="onia-center-sidebar">
        <Link className="onia-back-link" href="/">
          <ArrowRight size={16} />
          Control Center
        </Link>

        <div className="onia-brand">
          <span>
            <ShieldCheck size={22} />
          </span>
          <div>
            <strong>ONIA Center</strong>
            <small>Vista equipo segura</small>
          </div>
        </div>

        <nav className="onia-nav" aria-label="Vista equipo">
          <a href="#captura">
            <Plus size={17} />
            <span>Captura</span>
            <small>Leads y tareas</small>
          </a>
          <a href="#ideas">
            <Lightbulb size={17} />
            <span>Ideas</span>
            <small>Revisar despues</small>
          </a>
          <a href="#seguimiento">
            <ListChecks size={17} />
            <span>Seguimiento</span>
            <small>Trabajo visible</small>
          </a>
        </nav>

        <div className="onia-team-session">
          <span>Sesion</span>
          <strong>{actor?.displayName ?? "No autenticado"}</strong>
          <small>{actor ? roleLabels[actor.role] : "Esperando Supabase Auth"}</small>
          <button onClick={logout} type="button">
            <LogOut size={15} />
            Salir
          </button>
        </div>
      </aside>

      <section className="onia-center-main">
        <header className="onia-hero">
          <div>
            <span className="onia-eyebrow">ONIA Center / Equipo</span>
            <h1>Trabajo registrable sin datos privados</h1>
            <p>
              Esta vista usa solo APIs filtradas por rol. No carga capital Sergio, deuda exacta, caja completa,
              lotes Nuvia, calendario personal ni estrategia interna.
            </p>
          </div>
          <div className="onia-hero-actions">
            {actor?.role === "sergio" ? (
              <Link href="/onia-center">
                <ShieldCheck size={16} />
                Vista Sergio
              </Link>
            ) : null}
            <a href="#ideas">
              <Lightbulb size={16} />
              Guardar idea
            </a>
          </div>
        </header>

        <section className="onia-role-banner">
          <div>
            <span>Acceso actual</span>
            <strong>{actor ? `${actor.displayName} / ${roleLabels[actor.role]}` : "Sin sesion activa"}</strong>
            <p>{notice}</p>
          </div>
          <UserCheck size={24} />
        </section>

        <section className="onia-team-metrics">
          {metrics.map((metric) => (
            <article className="onia-metric is-blue" key={metric.label}>
              <span>
                <ClipboardCheck size={18} />
              </span>
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
              <small>{metric.detail}</small>
            </article>
          ))}
        </section>

        <section className="onia-team-grid" id="captura">
          <form className="onia-live-card onia-panel" onSubmit={handleLeadSubmit}>
            <div className="onia-live-title">
              <Plus size={17} />
              <strong>Nuevo lead</strong>
            </div>
            <label>
              Empresa
              <input onChange={(event) => setLeadForm({ ...leadForm, company: event.target.value })} required value={leadForm.company} />
            </label>
            <label>
              Contacto publico
              <input onChange={(event) => setLeadForm({ ...leadForm, contact: event.target.value })} value={leadForm.contact} />
            </label>
            <div className="onia-form-row">
              <label>
                Fuente
                <input onChange={(event) => setLeadForm({ ...leadForm, source: event.target.value })} value={leadForm.source} />
              </label>
              <label>
                Servicio
                <select onChange={(event) => setLeadForm({ ...leadForm, serviceId: event.target.value })} value={leadForm.serviceId}>
                  {serviceOptions.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Proxima accion
              <textarea onChange={(event) => setLeadForm({ ...leadForm, nextAction: event.target.value })} rows={3} value={leadForm.nextAction} />
            </label>
            <button className="onia-team-submit" disabled={isSaving} type="submit">Registrar lead</button>
          </form>

          <form className="onia-live-card onia-panel" onSubmit={handleTaskSubmit}>
            <div className="onia-live-title">
              <ListChecks size={17} />
              <strong>Nueva tarea</strong>
            </div>
            <label>
              Titulo
              <input onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} required value={taskForm.title} />
            </label>
            <div className="onia-form-row">
              <label>
                Proyecto
                <select onChange={(event) => setTaskForm({ ...taskForm, projectId: event.target.value })} value={taskForm.projectId}>
                  {projectOptions.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Prioridad
                <select onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value as RuntimeTask["priority"] })} value={taskForm.priority}>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </label>
            </div>
            <p className="onia-team-helper">La tarea queda asignada automaticamente a tu rol. El cierre final lo aprueba Sergio.</p>
            <button className="onia-team-submit" disabled={isSaving} type="submit">Crear tarea</button>
          </form>

          <form className="onia-live-card onia-panel" onSubmit={handleNoteSubmit}>
            <div className="onia-live-title">
              <ClipboardCheck size={17} />
              <strong>Nota de trabajo</strong>
            </div>
            <div className="onia-form-row">
              <label>
                Tipo
                <select onChange={(event) => setNoteForm({ ...noteForm, kind: event.target.value as RuntimeNote["kind"] })} value={noteForm.kind}>
                  <option value="llamada">Llamada</option>
                  <option value="nota">Nota</option>
                  <option value="cobro">Cobro</option>
                  <option value="bloqueo">Bloqueo</option>
                  <option value="idea">Idea</option>
                  <option value="evidencia">Evidencia/info</option>
                </select>
              </label>
              <label>
                Vinculado a
                <input onChange={(event) => setNoteForm({ ...noteForm, linkedTo: event.target.value })} value={noteForm.linkedTo} />
              </label>
            </div>
            <label>
              Titulo
              <input onChange={(event) => setNoteForm({ ...noteForm, title: event.target.value })} required value={noteForm.title} />
            </label>
            <label>
              Detalle
              <textarea onChange={(event) => setNoteForm({ ...noteForm, detail: event.target.value })} rows={4} value={noteForm.detail} />
            </label>
            <button className="onia-team-submit" disabled={isSaving} type="submit">Guardar nota</button>
          </form>
        </section>

        <section className="onia-team-grid is-ideas" id="ideas">
          <form className="onia-live-card onia-panel" onSubmit={handleIdeaSubmit}>
            <div className="onia-live-title">
              <Lightbulb size={17} />
              <strong>Idea para revisar despues</strong>
            </div>
            <label>
              Titulo
              <input onChange={(event) => setIdeaForm({ ...ideaForm, title: event.target.value })} required value={ideaForm.title} />
            </label>
            <label>
              URL o referencia
              <input onChange={(event) => setIdeaForm({ ...ideaForm, url: event.target.value })} placeholder="Reel, web, video o nota" value={ideaForm.url} />
            </label>
            <div className="onia-form-row">
              <label>
                Fuente
                <select onChange={(event) => setIdeaForm({ ...ideaForm, source: event.target.value as RuntimeIdea["source"] })} value={ideaForm.source}>
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
                <select onChange={(event) => setIdeaForm({ ...ideaForm, category: event.target.value as RuntimeIdea["category"] })} value={ideaForm.category}>
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
            <label>
              Resumen
              <textarea onChange={(event) => setIdeaForm({ ...ideaForm, summary: event.target.value })} required rows={3} value={ideaForm.summary} />
            </label>
            <label>
              Por que sirve
              <textarea onChange={(event) => setIdeaForm({ ...ideaForm, whyUseful: event.target.value })} rows={3} value={ideaForm.whyUseful} />
            </label>
            <div className="onia-form-row">
              <label>
                Proyecto
                <select onChange={(event) => setIdeaForm({ ...ideaForm, targetProjectId: event.target.value })} value={ideaForm.targetProjectId}>
                  {projectOptions.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Revisar con
                <select onChange={(event) => setIdeaForm({ ...ideaForm, reviewTool: event.target.value as RuntimeIdea["reviewTool"] })} value={ideaForm.reviewTool}>
                  <option value="codex">Codex</option>
                  <option value="claude">Claude</option>
                  <option value="self_hosted">Modelo self-hosted</option>
                  <option value="manual">Manual</option>
                </select>
              </label>
            </div>
            <label>
              Visibilidad
              <select onChange={(event) => setIdeaForm({ ...ideaForm, visibility: event.target.value as RuntimeIdea["visibility"] })} value={ideaForm.visibility}>
                <option value="assigned_only">Solo mi rol</option>
                <option value="team_safe">Equipo seguro</option>
              </select>
            </label>
            <button className="onia-team-submit" disabled={isSaving} type="submit">Guardar idea</button>
          </form>

          <article className="onia-panel onia-team-list-card">
            <div className="onia-section-heading">
              <div>
                <span>Ideas visibles</span>
                <h2>Cola de revision</h2>
                <p>Todo lo guardado aqui queda para que Sergio/Hermes lo revise con Codex, Claude o modelo local.</p>
              </div>
              <Lightbulb size={22} />
            </div>
            <div className="onia-live-list">
              {runtime.ideas.length ? runtime.ideas.map((idea) => (
                <div key={idea.id}>
                  <strong>{idea.title}</strong>
                  <span>{idea.source} / {idea.category} / {statusLabel(idea.status)}</span>
                  <small>{idea.summary}</small>
                  {idea.url ? (
                    <a className="onia-team-link" href={idea.url} rel="noreferrer" target="_blank">
                      <ExternalLink size={13} />
                      Abrir referencia
                    </a>
                  ) : null}
                </div>
              )) : <div><strong>Sin ideas visibles</strong><small>Guarda el primer reel, referencia o idea.</small></div>}
            </div>
          </article>
        </section>

        <section className="onia-team-grid" id="seguimiento">
          <article className="onia-panel onia-team-list-card">
            <div className="onia-section-heading">
              <div>
                <span>Leads</span>
                <h2>Pipeline visible</h2>
              </div>
            </div>
            <div className="onia-live-list">
              {runtime.leads.length ? runtime.leads.map((lead) => (
                <div key={lead.id}>
                  <strong>{lead.company}</strong>
                  <span>{lead.status} / {serviceLabel(lead.serviceId)}</span>
                  <small>{lead.nextAction || lead.contact || "Sin siguiente accion."}</small>
                </div>
              )) : <div><strong>Sin leads visibles</strong><small>Registra uno desde Captura.</small></div>}
            </div>
          </article>

          <article className="onia-panel onia-team-list-card">
            <div className="onia-section-heading">
              <div>
                <span>Tareas</span>
                <h2>Seguimiento</h2>
              </div>
            </div>
            <div className="onia-live-list">
              {runtime.tasks.length ? runtime.tasks.map((task) => (
                <div key={task.id}>
                  <strong>{task.title}</strong>
                  <span>{projectLabel(task.projectId)} / {task.priority} / {task.status}</span>
                  <small>Evidencia: {task.evidence}</small>
                  <select onChange={(event) => updateTaskStatus(task.id, event.target.value as RuntimeTask["status"])} value={task.status}>
                    <option value="todo">Pendiente</option>
                    <option value="doing">En progreso</option>
                    <option value="review">Enviar a revision</option>
                    <option value="blocked">Bloqueada</option>
                    <option disabled={actor?.role !== "sergio"} value="done">
                      Aprobada
                    </option>
                  </select>
                </div>
              )) : <div><strong>Sin tareas visibles</strong><small>Crea una tarea para empezar.</small></div>}
            </div>
          </article>

          <article className="onia-panel onia-team-list-card">
            <div className="onia-section-heading">
              <div>
                <span>Notas</span>
                <h2>Registro</h2>
              </div>
            </div>
            <div className="onia-live-list">
              {runtime.notes.length ? runtime.notes.map((note) => (
                <div key={note.id}>
                  <strong>{note.title}</strong>
                  <span>{note.kind} / {note.actorRole ? roleLabels[note.actorRole] : "ONIA"}</span>
                  <small>{note.detail || note.linkedTo}</small>
                </div>
              )) : <div><strong>Sin notas visibles</strong><small>Registra llamadas, bloqueos o avances.</small></div>}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
