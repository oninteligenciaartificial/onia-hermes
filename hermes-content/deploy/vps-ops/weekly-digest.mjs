// ONIA — Digest semanal (READ-ONLY, corre DENTRO de onia-center vía docker exec).
// Agrega en UN solo mensaje la actividad de la semana del panel (leads nuevos, ideas y
// borradores para revisar, caja) — reemplaza los pings sueltos de los agentes. Determinista,
// sin LLM, no toca nada. Imprime {ok, text, notify}. n8n lo manda por Telegram los domingos.
//
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const CENTER = process.env.ONIA_CENTER_URL || "https://center.onia.com.bo/onia-center";
const CLOSED = new Set(["ganado", "perdido", "cerrado", "descartado", "won", "lost", "closed"]);

function out(o) {
  process.stdout.write(JSON.stringify(o) + "\n");
}
function H() {
  return { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY, "Accept-Profile": "onia_center" };
}
async function sb(path) {
  const r = await fetch(SB_URL + "/rest/v1/" + path, { headers: H() });
  if (!r.ok) return [];
  const t = await r.text();
  return t ? JSON.parse(t) : [];
}
function laPazDate() {
  return new Date(Date.now() - 4 * 3600 * 1000).toLocaleDateString("es-BO", { day: "2-digit", month: "long" });
}

async function main() {
  if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const leads = await sb("leads?select=lead_key,created_at,pipeline_status&limit=5000");
  const newLeads = leads.filter((l) => l.created_at && l.created_at >= weekAgo).length;
  const openLeads = leads.filter((l) => !CLOSED.has(String(l.pipeline_status || "").toLowerCase())).length;

  const ideas = await sb("idea_inbox?select=category,status&limit=1000");
  const pend = ideas.filter((i) => i.status === "inbox");
  const contenido = pend.filter((i) => i.category === "contenido").length;
  const codigo = pend.filter((i) => i.category === "operacion").length;
  const otras = pend.length - contenido - codigo;

  const reviews = await sb("review_queue?select=review_key&status=eq.pending&limit=1000");

  let cajaLine = "";
  const fin = await sb("finance_summary?select=raw&order=created_at.desc&limit=1");
  const raw = fin[0] && fin[0].raw;
  if (raw && typeof raw === "object") {
    const anomalies = Array.isArray(raw.anomalies) ? raw.anomalies.length : 0;
    if (anomalies > 0) cajaLine = "\n⚠️ Finanzas: " + anomalies + " anomalia(s) para mirar en la vista Finanzas.";
  }

  const L = [];
  L.push("📊 Resumen semanal ONIA — " + laPazDate());
  L.push("");
  L.push("Esta semana entraron " + newLeads + " lead(s) nuevo(s). Hay " + openLeads + " abiertos en el CRM.");
  L.push("");
  L.push("Te espera en el panel para revisar y aprobar:");
  const items = [];
  if (contenido) items.push("• " + contenido + " idea(s) de contenido");
  if (codigo) items.push("• " + codigo + " de deuda tecnica (codigo)");
  if (otras) items.push("• " + otras + " otra(s) idea(s)");
  items.push("• " + reviews.length + " borrador(es) en la cola de aprobacion");
  L.push(items.join("\n"));
  if (cajaLine) L.push(cajaLine);
  L.push("");
  L.push("Abri el panel: " + CENTER);
  L.push("Nada se envio ni publico sin tu OK.");

  const totalPend = contenido + codigo + otras + reviews.length;
  return { ok: true, newLeads, openLeads, pendingItems: totalPend, text: L.join("\n").slice(0, 3900), notify: true };
}

main()
  .then(out)
  .catch((e) => out({ ok: false, notify: true, text: "Digest semanal ONIA - ERROR: " + String(e.message || e).slice(0, 200), fatal: String(e.message || e).slice(0, 200) }));
