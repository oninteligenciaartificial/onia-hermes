// ONIA — Agente Nuevo Lead (speed-to-lead). Corre DENTRO de onia-center (docker exec).
// Un inbound (formulario/WhatsApp/Hermes) llega como LEAD_B64 (base64 JSON con
// {company, contact, channel, message, source}). El agente:
//   1) inserta el lead en onia_center.leads,
//   2) lo califica + redacta la PRIMERA respuesta con LiteLLM (sin precios),
//   3) deja tarea + borrador en review_queue (pending/sensitive/reviewer=sergio).
// Devuelve un resumen. NO envia nada: el envio lo aprueba Sergio.

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const LLM_BASE = process.env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1";
const LLM_KEY = process.env.LITELLM_KEY || "";
const MODEL = process.env.SALES_AGENT_MODEL || "gpt-4o-mini";
const PRIORITY = new Set(["alta", "media", "baja"]);

function out(o) { process.stdout.write(JSON.stringify(o) + "\n"); }
function sbHeaders(extra) {
  return {
    apikey: SB_KEY, Authorization: "Bearer " + SB_KEY,
    "Accept-Profile": "onia_center", "Content-Profile": "onia_center",
    "Content-Type": "application/json", ...(extra || {}),
  };
}
async function sb(path, init) {
  const res = await fetch(SB_URL + "/rest/v1/" + path, init);
  const text = await res.text();
  if (!res.ok) throw new Error("supabase " + res.status + ": " + text.slice(0, 200));
  return text ? JSON.parse(text) : [];
}
const key = (p) => p + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);

async function qualify(lead) {
  const sys =
    "Sos el asistente de ventas de ONIA (agencia de IA/automatizacion en Bolivia). " +
    "Un lead recien entro por un canal inbound. Calificalo y redacta la PRIMERA respuesta " +
    "en espanol claro y humano, agradeciendo el contacto y proponiendo una llamada/reunion. " +
    "REGLA DURA: nunca prometas precios, descuentos ni plazos — eso lo aprueba Sergio. " +
    "Responde SOLO con JSON valido, sin markdown.";
  const user =
    "Lead inbound:\n" + JSON.stringify({
      empresa: lead.company, contacto: lead.contact, canal: lead.channel, mensaje: lead.message,
    }, null, 2) +
    '\n\nDevolve este JSON:\n{"qualification":"hot|warm|cold","priority":"alta|media|baja",' +
    '"next_action":"1 frase","followup_message":"primera respuesta lista para revisar (sin precios)",' +
    '"proposal_outline":"solo si hot/warm: bullets de propuesta; si no null"}';
  const res = await fetch(LLM_BASE + "/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + LLM_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, temperature: 0.4, messages: [
      { role: "system", content: sys }, { role: "user", content: user },
    ] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("llm " + res.status + ": " + JSON.stringify(data).slice(0, 180));
  let c = (data.choices?.[0]?.message?.content || "").replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const p = JSON.parse(c);
  return {
    qualification: String(p.qualification || "warm"),
    priority: PRIORITY.has(p.priority) ? p.priority : "media",
    next_action: String(p.next_action || "Responder y coordinar llamada").slice(0, 400),
    followup_message: String(p.followup_message || "").slice(0, 4000),
    proposal_outline: p.proposal_outline ? String(p.proposal_outline).slice(0, 4000) : null,
  };
}

(async () => {
  try {
    if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase");
    if (!LLM_KEY) throw new Error("falta LITELLM_KEY");
    const lead = JSON.parse(Buffer.from(process.env.LEAD_B64 || "", "base64").toString("utf8"));
    if (!lead.company) throw new Error("el lead necesita 'company'");
    const company = String(lead.company).slice(0, 300);

    // 1) insertar lead
    const lead_key = key("lead");
    await sb("leads", {
      method: "POST",
      headers: sbHeaders({ prefer: "return=minimal" }),
      body: JSON.stringify({
        lead_key, company_name: company, business_type: "pendiente",
        public_contact: lead.contact || null, channel: lead.channel || "Inbound",
        source: lead.source || "inbound-agent", contact_permission: "pending",
        origin_role_key: "sergio", owner_role_key: "sergio",
        pipeline_status: "Nuevo", priority: "media", private_notes: lead.message || null,
        raw: { ...lead, addedBy: "intake-lead-agent" },
      }),
    });

    // 2) calificar + redactar
    const q = await qualify(lead);

    // 3) tarea + borrador(es)
    await sb("tasks", { method: "POST", headers: sbHeaders({ prefer: "return=minimal" }), body: JSON.stringify({
      task_key: key("task-il"), project_key: "onia_center",
      title: ("Responder lead nuevo: " + company + " — " + q.next_action).slice(0, 240),
      task_type: "lead", status: "todo", priority: q.priority,
      assigned_role_key: "sergio", reviewer_role_key: "sergio",
      evidence_required: false, sensitive: true, source_system: "onia-hermes",
      raw: { agent: "intake-lead-agent", lead_key, qualification: q.qualification },
    }) });
    let reviews = 0;
    await sb("review_queue", { method: "POST", headers: sbHeaders({ prefer: "return=minimal" }), body: JSON.stringify({
      review_key: key("rev-il-fu"), source_type: "lead", source_key: lead_key,
      title: ("Borrador respuesta: " + company).slice(0, 240), priority: q.priority,
      status: "pending", reviewer_role_key: "sergio", sensitive: true,
      raw: { agent: "intake-lead-agent", kind: "first_touch", company, qualification: q.qualification, message: q.followup_message },
    }) });
    reviews++;
    if (q.proposal_outline) {
      await sb("review_queue", { method: "POST", headers: sbHeaders({ prefer: "return=minimal" }), body: JSON.stringify({
        review_key: key("rev-il-prop"), source_type: "lead", source_key: lead_key,
        title: ("Borrador propuesta: " + company).slice(0, 240), priority: q.priority,
        status: "pending", reviewer_role_key: "sergio", sensitive: true,
        raw: { agent: "intake-lead-agent", kind: "proposal", company, outline: q.proposal_outline },
      }) });
      reviews++;
    }

    out({ ok: true, lead_key, company, qualification: q.qualification, priority: q.priority,
      next_action: q.next_action, followup_preview: q.followup_message.slice(0, 280),
      has_proposal: Boolean(q.proposal_outline), reviewsCreated: reviews });
  } catch (e) {
    out({ ok: false, error: String(e.message || e).slice(0, 260) });
  }
})();
