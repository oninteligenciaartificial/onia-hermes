// ONIA — Agente del Día: tareas REALES del panel (corre DENTRO de onia-center vía docker exec).
// Reemplaza las tareas genéricas del briefing ("Subir evidencia de llamadas...", "Cierre operativo...")
// por acciones concretas derivadas del ESTADO VIVO del CRM: prospectos nuevos del Prospector,
// borradores en la cola de aprobación, ideas del Radar YT. Determinista, sin LLM.
//
// Dedup estable: task_key = "auto-<kind>-<YYYY-MM-DD>" (upsert por on_conflict=task_key). Si corre
// dos veces el mismo día, actualiza el conteo en vez de duplicar. Solo crea la tarea si hay señal
// real (count > 0). Imprime {ok, created, tasks} para el resumen de Telegram/n8n.
//
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY
// Env (opcional):       DAILY_TASKS_DRY_RUN ('true'|'false')

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = process.env.DAILY_TASKS_DRY_RUN === "true";
const CLOSED = new Set(["ganado", "perdido", "cerrado", "descartado", "won", "lost", "closed"]);

function out(o) {
  process.stdout.write(JSON.stringify(o) + "\n");
}
function H(extra) {
  return {
    apikey: SB_KEY,
    Authorization: "Bearer " + SB_KEY,
    "Accept-Profile": "onia_center",
    "Content-Profile": "onia_center",
    "Content-Type": "application/json",
    ...(extra || {}),
  };
}
async function sbGet(path) {
  const r = await fetch(SB_URL + "/rest/v1/" + path, { headers: H() });
  if (!r.ok) return [];
  const t = await r.text();
  return t ? JSON.parse(t) : [];
}
async function sbUpsert(rows) {
  // Upsert por task_key (unique). merge-duplicates => INSERT ... ON CONFLICT (task_key) DO UPDATE.
  const r = await fetch(SB_URL + "/rest/v1/tasks?on_conflict=task_key", {
    method: "POST",
    headers: H({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(rows),
  });
  if (!r.ok) throw new Error("upsert tasks " + r.status + ": " + (await r.text()).slice(0, 200));
}

function laPazIsoDate() {
  // America/La_Paz = UTC-4, sin DST.
  return new Date(Date.now() - 4 * 3600 * 1000).toISOString().slice(0, 10);
}

async function main() {
  if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");
  const date = laPazIsoDate();
  const nowIso = new Date().toISOString();

  // ---- Estado vivo del CRM ----
  const leads = await sbGet("leads?select=pipeline_status&limit=5000");
  const leadsNuevos = leads.filter((l) => String(l.pipeline_status || "").toLowerCase() === "nuevo").length;
  const leadsAbiertos = leads.filter((l) => !CLOSED.has(String(l.pipeline_status || "").toLowerCase())).length;

  const reviews = await sbGet("review_queue?select=review_key&status=eq.pending&limit=1000");
  const reviewsPend = reviews.length;

  const ideas = await sbGet("idea_inbox?select=idea_key&status=eq.inbox&limit=1000");
  const ideasInbox = ideas.length;

  // ---- Tareas reales candidatas (solo con señal > 0) ----
  const base = {
    status: "todo",
    evidence_required: true,
    sensitive: false,
    source_system: "onia-center",
    reviewer_role_key: "sergio",
    due_label: "Hoy",
  };
  const mk = (kind, extra) => ({
    ...base,
    task_key: `auto-${kind}-${date}`,
    raw: { agent: "daily-tasks-agent-v1", kind, generated_at: nowIso, date },
    ...extra,
  });

  const candidates = [];
  if (leadsNuevos > 0) {
    candidates.push(
      mk("prospectos", {
        project_key: "webs_onia",
        task_type: "lead",
        priority: "alta",
        assigned_role_key: "sergio",
        title: `Trabajar los ${leadsNuevos} prospectos nuevos del CRM: calificar, priorizar y decidir a quién contactar`,
      }),
    );
    candidates.push(
      mk("arthur-prospectos", {
        project_key: "webs_onia",
        task_type: "lead",
        priority: "media",
        assigned_role_key: "arthur",
        title: `Apoyar la calificación de los ${leadsNuevos} prospectos nuevos y preparar borradores de contacto para aprobación`,
      }),
    );
  }
  if (reviewsPend > 0) {
    candidates.push(
      mk("aprobar-borradores", {
        project_key: "onia_center",
        task_type: "review",
        priority: "alta",
        assigned_role_key: "sergio",
        title: `Revisar y aprobar los ${reviewsPend} borradores en la cola de aprobación (contenido / propuestas)`,
      }),
    );
  }
  if (ideasInbox > 0) {
    candidates.push(
      mk("ideas", {
        project_key: "content_onia",
        task_type: "content",
        priority: "media",
        assigned_role_key: "sergio",
        title: `Revisar las ${ideasInbox} ideas nuevas en Ideas Inbox (Radar YT / contenido) y quedarte con las que vendan`,
      }),
    );
  }

  const summary = {
    ok: true,
    dryRun: DRY_RUN,
    date,
    signals: { leadsNuevos, leadsAbiertos, reviewsPend, ideasInbox },
    created: DRY_RUN ? 0 : candidates.length,
    tasks: candidates.map((t) => ({ task_key: t.task_key, role: t.assigned_role_key, title: t.title })),
    notify: candidates.length > 0,
  };

  if (!DRY_RUN && candidates.length > 0) {
    await sbUpsert(candidates);
  }
  return summary;
}

main()
  .then(out)
  .catch((e) => out({ ok: false, notify: true, fatal: String(e.message || e).slice(0, 300) }));
