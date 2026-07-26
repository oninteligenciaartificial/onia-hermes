// ONIA — Agente Vendedor v1 (corre DENTRO del contenedor onia-center vía docker exec).
// Lee leads del CRM (onia_center), los califica y redacta borradores con el LLM (LiteLLM),
// y deja SOLO borradores: una tarea en onia_center.tasks + el borrador en review_queue
// (status pending, sensitive, reviewer=sergio). NO envia nada. Devuelve un resumen JSON.
//
// Env (de onia-center):   ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY
// Env (inyectadas):       LITELLM_BASE, LITELLM_KEY, SALES_AGENT_MODEL, SALES_AGENT_LIMIT,
//                         SALES_AGENT_DRY_RUN ('true'|'false'), SALES_AGENT_TEST_LEAD (JSON, dry-run)
//
// Regla dura: NO envia mensajes ni compromete precios. El envio queda tras aprobacion de Sergio.

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const LLM_BASE = process.env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1";
const LLM_KEY = process.env.LITELLM_KEY || "";
const MODEL = process.env.SALES_AGENT_MODEL || "gpt-4o-mini";
const LIMIT = Math.max(1, Math.min(20, parseInt(process.env.SALES_AGENT_LIMIT || "8", 10)));
const DRY_RUN = process.env.SALES_AGENT_DRY_RUN === "true";
const CAL_LINK = process.env.SALES_AGENT_CAL_LINK || "https://cal.onia.com.bo";

// Garantiza que todo seguimiento invite a agendar en Cal (si el LLM no lo incluyo).
function withCalLink(msg) {
  const text = String(msg || "");
  if (!CAL_LINK) return text;
  if (text.includes("cal.onia.com.bo") || text.includes(CAL_LINK)) return text;
  return (text + "\n\nAgenda una llamada corta cuando te quede comodo: " + CAL_LINK).slice(0, 4000);
}

const CLOSED = new Set(["ganado", "perdido", "cerrado", "descartado", "won", "lost", "closed"]);
const PRIORITY = new Set(["alta", "media", "baja"]);

function out(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n");
}
function sbHeaders(extra) {
  return {
    apikey: SB_KEY,
    Authorization: "Bearer " + SB_KEY,
    "Accept-Profile": "onia_center",
    "Content-Profile": "onia_center",
    "Content-Type": "application/json",
    ...(extra || {}),
  };
}
async function sb(path, init) {
  const res = await fetch(SB_URL + "/rest/v1/" + path, init);
  const text = await res.text();
  if (!res.ok) throw new Error("supabase " + res.status + ": " + text.slice(0, 200));
  return text ? JSON.parse(text) : [];
}
function key(prefix) {
  return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

async function qualifyLead(lead) {
  const sys =
    "Sos el asistente de ventas de ONIA (agencia de IA/automatizacion en Bolivia). " +
    "Calificas leads y redactas seguimientos en espanol rioplatense-boliviano, claros y humanos. " +
    "REGLA DURA: nunca prometas precios, descuentos ni plazos concretos — eso lo aprueba Sergio. " +
    "El mensaje debe mover al lead a AGENDAR una llamada corta en " + CAL_LINK + " (link de agenda de ONIA), " +
    "o a pedir mas contexto, sin cerrar numeros. Cerra invitando a reservar un horario en ese link. " +
    "Responde SOLO con JSON valido, sin markdown.";
  const user =
    "Lead:\n" +
    JSON.stringify(
      {
        empresa: lead.company_name,
        contacto: lead.public_contact,
        canal: lead.channel,
        estado_pipeline: lead.pipeline_status,
        servicio_sugerido: lead.suggested_service_key,
        notas: lead.private_notes,
      },
      null,
      2,
    ) +
    '\n\nDevolve este JSON exacto:\n{"qualification":"hot|warm|cold","priority":"alta|media|baja",' +
    '"next_action":"1 frase concreta","followup_message":"mensaje de seguimiento listo para revisar (sin precios)",' +
    '"proposal_outline":"solo si hot/warm: bullets de la propuesta a medida; si no, null"}';

  const res = await fetch(LLM_BASE + "/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + LLM_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("llm " + res.status + ": " + JSON.stringify(data).slice(0, 200));
  let content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
  content = content.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(content);
  const priority = PRIORITY.has(parsed.priority) ? parsed.priority : "media";
  return {
    qualification: String(parsed.qualification || "cold"),
    priority,
    next_action: String(parsed.next_action || "Contactar para agendar llamada").slice(0, 400),
    followup_message: withCalLink(String(parsed.followup_message || "").slice(0, 3800)),
    proposal_outline: parsed.proposal_outline ? String(parsed.proposal_outline).slice(0, 4000) : null,
  };
}

async function loadLeads() {
  if (DRY_RUN && process.env.SALES_AGENT_TEST_LEAD) {
    return [JSON.parse(process.env.SALES_AGENT_TEST_LEAD)];
  }
  const rows = await sb(
    "leads?select=lead_key,company_name,public_contact,channel,pipeline_status,suggested_service_key,private_notes,created_at&order=created_at.desc&limit=" +
      LIMIT * 4,
    { headers: sbHeaders() },
  );
  const active = rows.filter((l) => !CLOSED.has(String(l.pipeline_status || "").toLowerCase()));
  // dedupe: saltear leads que ya tienen un borrador de seguimiento pendiente
  let pendingKeys = new Set();
  if (!DRY_RUN && active.length) {
    const pend = await sb("review_queue?select=source_key&status=eq.pending&source_type=eq.lead&limit=500", {
      headers: sbHeaders(),
    });
    pendingKeys = new Set(pend.map((r) => r.source_key));
  }
  return active.filter((l) => !pendingKeys.has(l.lead_key)).slice(0, LIMIT);
}

async function writeDrafts(lead, q) {
  const now = Date.now();
  const company = lead.company_name || lead.lead_key;
  // 1) tarea de seguimiento
  await sb("tasks", {
    method: "POST",
    headers: sbHeaders({ prefer: "return=minimal" }),
    body: JSON.stringify({
      task_key: "task-sa-" + now.toString(36) + "-" + Math.random().toString(36).slice(2, 6),
      project_key: "onia_center",
      title: ("Seguir a " + company + ": " + q.next_action).slice(0, 240),
      task_type: "lead",
      status: "todo",
      priority: q.priority,
      assigned_role_key: "sergio",
      reviewer_role_key: "sergio",
      evidence_required: false,
      sensitive: true,
      source_system: "onia-hermes",
      raw: { agent: "sales-agent-v1", lead_key: lead.lead_key, qualification: q.qualification, next_action: q.next_action },
    }),
  });
  let reviews = 0;
  // 2) borrador de seguimiento en review_queue
  await sb("review_queue", {
    method: "POST",
    headers: sbHeaders({ prefer: "return=minimal" }),
    body: JSON.stringify({
      review_key: key("rev-sa-fu"),
      source_type: "lead",
      source_key: lead.lead_key,
      title: ("Borrador seguimiento: " + company).slice(0, 240),
      priority: q.priority,
      status: "pending",
      reviewer_role_key: "sergio",
      sensitive: true,
      raw: { agent: "sales-agent-v1", kind: "followup", company, qualification: q.qualification, message: q.followup_message },
    }),
  });
  reviews++;
  // 3) borrador de propuesta (solo calificados)
  if (q.proposal_outline) {
    await sb("review_queue", {
      method: "POST",
      headers: sbHeaders({ prefer: "return=minimal" }),
      body: JSON.stringify({
        review_key: key("rev-sa-prop"),
        source_type: "lead",
        source_key: lead.lead_key,
        title: ("Borrador propuesta: " + company).slice(0, 240),
        priority: q.priority,
        status: "pending",
        reviewer_role_key: "sergio",
        sensitive: true,
        raw: { agent: "sales-agent-v1", kind: "proposal", company, qualification: q.qualification, outline: q.proposal_outline },
      }),
    });
    reviews++;
  }
  return reviews;
}

(async () => {
  const summary = { ok: true, dryRun: DRY_RUN, processed: 0, tasksCreated: 0, reviewsCreated: 0, drafts: [], errors: [] };
  try {
    if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");
    if (!LLM_KEY) throw new Error("falta LITELLM_KEY");
    const leads = await loadLeads();
    for (const lead of leads) {
      summary.processed++;
      try {
        const q = await qualifyLead(lead);
        const draft = {
          company: lead.company_name || lead.lead_key,
          qualification: q.qualification,
          priority: q.priority,
          next_action: q.next_action,
          followup_preview: q.followup_message.slice(0, 280),
          has_proposal: Boolean(q.proposal_outline),
        };
        if (!DRY_RUN) {
          const reviews = await writeDrafts(lead, q);
          summary.tasksCreated++;
          summary.reviewsCreated += reviews;
        }
        summary.drafts.push(draft);
      } catch (e) {
        summary.errors.push({ lead: lead.lead_key || lead.company_name, error: String(e.message || e).slice(0, 200) });
      }
    }
  } catch (e) {
    summary.ok = false;
    summary.fatal = String(e.message || e).slice(0, 300);
  }
  out(summary);
})();
