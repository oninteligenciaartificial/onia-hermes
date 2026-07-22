// ONIA — Sync del roster de agentes operativos (corre DENTRO de onia-center vía docker exec).
// Fuente de verdad del ESTADO REAL de cada agente para el panel. Contrato de "vivo 24/7":
//   live = status='ready' + raw.live=true + raw.cadence_label.
// Idempotente: parchea status/cadence + MERGEA el contrato en raw PRESERVANDO last_run.
// Necesario porque los runtimes (Contenido/Finanzas/Prospector) reescriben raw={last_run:...} al
// correr y borrarían live/cadence_label/channel; este sync los restaura. Cablear en n8n para que
// corra frecuente (p.ej. al cierre de cada workflow de agente, o cada hora).
//
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY
// Env (opcional):       AGENTS_SYNC_DRY_RUN ('true'|'false')

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = process.env.AGENTS_SYNC_DRY_RUN === "true";

// Roster canónico. cadence ∈ {daily,weekly,monthly,always_on}; status ∈ {ready,planned,...}.
// cadence_label = etiqueta legible del cron real (los crons viven en n8n).
const ROSTER = {
  // ---- VIVOS 24/7 (cron activo en n8n / GitHub Actions) ----
  agent_content_media: { status: "ready", cadence: "daily", live: true, cadence_label: "Lun a Sáb", channel: "panel" },
  agent_finance_fund: { status: "ready", cadence: "daily", live: true, cadence_label: "Lun a Sáb", channel: "panel" },
  agent_sales_crm: { status: "ready", cadence: "daily", live: true, cadence_label: "Lun a Sáb", channel: "panel" },
  agent_prospector: { status: "ready", cadence: "weekly", live: true, cadence_label: "Lun y Jue", channel: "panel" },
  agent_radar_yt: { status: "ready", cadence: "weekly", live: true, cadence_label: "Miércoles", channel: "panel" },
  agent_weekly_digest: { status: "ready", cadence: "weekly", live: true, cadence_label: "Domingo", channel: "telegram" },
  agent_auditor: { status: "ready", cadence: "weekly", live: true, cadence_label: "Semanal (GitHub Actions)", channel: "telegram" },
  // ---- NO CABLEADOS (placeholders honestos) ----
  agent_ceo_monthly: { status: "planned", cadence: "monthly", live: false, cadence_label: "Mensual — aún sin cablear", channel: "panel", placeholder: true },
  agent_delivery_projects: { status: "planned", cadence: "weekly", live: false, cadence_label: "Aún sin cablear", channel: "panel", placeholder: true },
  agent_calendar_energy: { status: "planned", cadence: "daily", live: false, cadence_label: "Diario — aún sin cablear", channel: "panel", placeholder: true },
  agent_selfhosted_integrations: { status: "planned", cadence: "weekly", live: false, cadence_label: "Aún sin cablear", channel: "panel", placeholder: true },
};

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
async function getRaw(agentKey) {
  const r = await fetch(SB_URL + "/rest/v1/operating_agents?select=raw&agent_key=eq." + agentKey, { headers: H() });
  if (!r.ok) return null;
  const rows = await r.json();
  return rows && rows[0] ? rows[0].raw || {} : null;
}
async function patch(agentKey, body) {
  const r = await fetch(SB_URL + "/rest/v1/operating_agents?agent_key=eq." + agentKey, {
    method: "PATCH",
    headers: H({ Prefer: "return=minimal" }),
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error("patch " + agentKey + " " + r.status + ": " + (await r.text()).slice(0, 160));
}

async function main() {
  if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");
  const synced = [];
  const missing = [];

  for (const [agentKey, spec] of Object.entries(ROSTER)) {
    const current = await getRaw(agentKey);
    if (current === null) {
      missing.push(agentKey); // la fila no existe (aún no seedeada); no la creamos aquí
      continue;
    }
    // Merge: preserva last_run (y cualquier metadato del runtime) y re-aplica el contrato.
    const raw = { ...current, live: spec.live, cadence_label: spec.cadence_label, channel: spec.channel };
    if (spec.placeholder) raw.placeholder = true;
    else delete raw.placeholder;
    if (!DRY_RUN) await patch(agentKey, { status: spec.status, cadence: spec.cadence, raw });
    synced.push({ agent_key: agentKey, status: spec.status, live: spec.live });
  }

  return { ok: true, dryRun: DRY_RUN, synced: synced.length, missing, agents: synced, notify: false };
}

main()
  .then(out)
  .catch((e) => out({ ok: false, notify: true, fatal: String(e.message || e).slice(0, 300) }));
