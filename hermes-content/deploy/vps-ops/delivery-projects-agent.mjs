// ONIA — Agente Entrega de proyectos (corre DENTRO de onia-center via docker exec).
// Determinista, SIN LLM. Lee el estado vivo de projects (join opcional con clients para el
// nombre), clasifica activos vs cerrados y marca los que necesitan atencion (estancados: sin
// proximo paso, o sin avance en +14 dias). Panel-first + bajo ruido: SIEMPRE actualiza su fila
// en operating_agents (agent_delivery_projects) con status='ready' y el contrato de vivo; SOLO
// pinga Telegram si hay >=1 proyecto activo que necesita atencion (sino, calma).
//
// READ-ONLY salvo su propia fila en operating_agents. Imprime UNA linea JSON:
//   { ok, text, notify, active_count, stalled_count }.
//
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const CENTER = process.env.ONIA_CENTER_URL || "https://center.onia.com.bo/onia-center";
const AGENT_KEY = "agent_delivery_projects";
const STALE_DAYS = 14;
const MAX_LIST = 8;

// status que cuentan como "cerrado" (NO activo). Defensivo con los valores reales que aparezcan.
const CLOSED = new Set([
  "done", "entregado", "entregada", "cerrado", "cerrada", "cancelado", "cancelada",
  "cancelled", "canceled", "archived", "archivado", "archivada", "completed",
  "completado", "completada", "closed", "delivered", "finalizado", "finalizada",
]);

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
// Lectura tolerante: si falla, devuelve [] (degrada con gracia, no crashea).
async function sbGet(path) {
  try {
    const r = await fetch(SB_URL + "/rest/v1/" + path, { headers: H() });
    if (!r.ok) return [];
    const t = await r.text();
    return t ? JSON.parse(t) : [];
  } catch (_e) {
    return [];
  }
}
// PATCH de la propia fila del agente. La fila ya existe seedeada y operating_agents tiene columnas
// NOT NULL sin default, asi que un INSERT/upsert daria 23502. No fatal: si el panel-write falla,
// no rompe el resto (igual que finance-fund/self-hosted).
async function upsertAgent(row) {
  const { agent_key, status, cadence, raw } = row;
  const body = {};
  if (status !== undefined) body.status = status;
  if (cadence !== undefined) body.cadence = cadence;
  if (raw !== undefined) body.raw = raw;
  try {
    const r = await fetch(SB_URL + "/rest/v1/operating_agents?agent_key=eq." + (agent_key || AGENT_KEY), {
      method: "PATCH",
      headers: H({ "Content-Profile": "onia_center", "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify(body),
    });
    if (!r.ok) console.warn("patch operating_agents " + r.status + ": " + (await r.text()).slice(0, 180));
  } catch (e) {
    console.warn("patch operating_agents error: " + String(e.message || e).slice(0, 120));
  }
}

// Fecha La Paz (UTC-4, sin DST) legible.
function laPazLabel() {
  return new Date(Date.now() - 4 * 3600 * 1000).toLocaleDateString("es-BO", { day: "2-digit", month: "long" });
}
// Dias transcurridos desde un ISO (o null si no parsea).
function daysSince(iso) {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 86400000);
}
const lc = (s) => String(s || "").trim().toLowerCase();

async function main() {
  if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");
  const nowIso = new Date().toISOString();

  // ---- Estado vivo de projects (+ nombres de cliente, join opcional) ----
  const projects = await sbGet(
    "projects?select=project_key,project_name,product_line,status,priority,owner_role_key,next_step,description,client_key,active_modules,created_at,updated_at&limit=5000",
  );
  const clients = await sbGet("clients?select=client_key,client_name&limit=5000");
  const clientName = {};
  for (const c of clients) if (c.client_key) clientName[c.client_key] = c.client_name;

  // ---- Clasificar activos y detectar estancados ----
  const active = projects.filter((p) => !CLOSED.has(lc(p.status)));
  const rows = active.map((p) => {
    const nameFromClient = p.client_key ? clientName[p.client_key] : null;
    const name = p.project_name || nameFromClient || p.project_key || "(proyecto sin nombre)";
    const hasNext = !!(p.next_step && String(p.next_step).trim());
    const age = daysSince(p.updated_at || p.created_at);
    const stale = typeof age === "number" && age > STALE_DAYS;
    const stalled = !hasNext || stale;
    let reason = "";
    if (!hasNext) reason = "definir el proximo paso (no tiene)";
    else if (stale) reason = "sin avance en " + age + " dias; retomar o cerrar";
    return {
      project_key: p.project_key,
      project_name: name,
      product_line: p.product_line || "-",
      status: p.status || "-",
      next_step: hasNext ? String(p.next_step).trim() : null,
      client_name: nameFromClient || null,
      days_old: typeof age === "number" ? age : null,
      stalled,
      reason: stalled ? reason : null,
    };
  });

  const active_count = rows.length;
  const stalledRows = rows.filter((r) => r.stalled);
  const stalled_count = stalledRows.length;
  const notify = active_count > 0 && stalled_count > 0;

  // ---- Texto humano ----
  let text;
  if (active_count === 0) {
    text = "Entrega de proyectos ONIA (" + laPazLabel() + "): sin proyectos activos por ahora.";
  } else {
    const L = [];
    L.push("Entrega de proyectos ONIA — " + laPazLabel());
    L.push("");
    L.push(active_count + " proyecto(s) activo(s) en curso.");
    if (stalled_count > 0) {
      L.push(stalled_count + " necesita(n) atencion (sin proximo paso o sin avance en +" + STALE_DAYS + " dias).");
    } else {
      L.push("Ninguno estancado: todos con proximo paso y avance reciente.");
    }
    L.push("");
    L.push("Proyectos activos:");
    for (const r of rows.slice(0, MAX_LIST)) {
      const next = r.next_step || "(sin proximo paso definido)";
      L.push("- " + r.project_name + " — " + r.product_line + " — " + r.status + " — " + next + (r.stalled ? "  [!]" : ""));
    }
    if (active_count > MAX_LIST) L.push("... y " + (active_count - MAX_LIST) + " mas en el panel.");
    if (stalled_count > 0) {
      L.push("");
      L.push("Para destrabar:");
      for (const r of stalledRows.slice(0, MAX_LIST)) {
        L.push("- " + r.project_name + ": " + r.reason);
      }
    }
    L.push("");
    L.push("Abri el panel: " + CENTER);
    text = L.join("\n");
  }
  text = text.slice(0, 3900);

  // ---- Actualizar la propia fila (contrato de vivo para el panel) ----
  await upsertAgent({
    agent_key: AGENT_KEY,
    agent_name: "Entrega de proyectos",
    status: "ready",
    cadence: "weekly",
    raw: {
      live: true,
      cadence_label: "Semanal (lunes)",
      channel: "panel",
      last_run: nowIso,
      active_count,
      stalled_count,
      projects: rows.slice(0, 50),
      runtime: "delivery-projects-agent-v1",
    },
  });

  return { ok: true, text, notify, active_count, stalled_count };
}

main()
  .then(out)
  .catch((e) => out({ ok: false, notify: true, text: "Entrega de proyectos ONIA - ERROR: " + String(e.message || e).slice(0, 200) }));
