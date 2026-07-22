// ONIA — Agente Integraciones self-hosted (corre DENTRO del contenedor onia-center via docker exec).
// Determinista, SIN LLM. Chequea la SALUD de los servicios self-hosted que ONIA opera (Supabase
// privado, LiteLLM, Speaches STT) haciendo un fetch con timeout a un endpoint de salud razonable,
// y refleja el estado REAL en onia_center.integration_connectors (status + current_state). Marca su
// propia fila en operating_agents (agent_selfhosted_integrations) como 'ready'. BAJO RUIDO: solo
// pinga por Telegram si hay al menos un conector self-hosted caido; si todo esta vivo, notify=false.
//
// NO mueve dinero, NO publica, NO borra columnas ajenas: solo parchea status/current_state/updated_at
// y mergea raw.last_check. n8n lo corre por cron (cada 6h) y manda el .text por Telegram si notify.
//
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY
// Env (opcional, inyectadas por el run.sh): LITELLM_BASE, LITELLM_KEY, SPEACHES_BASE_URL

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const LITELLM_BASE = (process.env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1").replace(/\/+$/, "");
const LITELLM_KEY = process.env.LITELLM_KEY || "";
const SPEACHES_BASE = (process.env.SPEACHES_BASE_URL || "http://speaches:8000").replace(/\/+$/, "");
const AGENT_KEY = "agent_selfhosted_integrations";
const TIMEOUT_MS = 4000;

// Mapa de sondas por connector_key. SOLO se chequean conectores en este mapa (todos self_hosted y
// pensados para estar vivos). Un conector self_hosted que NO este aca no se toca: se deja como esta
// (defensivo — no marcamos caido lo que no sabemos sondear). 'alive' = status HTTP que igual prueba
// que el servicio esta vivo aunque falte auth (p.ej. 401/403).
function probesFor(sbUrl) {
  return {
    supabase_onia_center: { kind: "supabase", url: sbUrl + "/rest/v1/", alive: [200, 400, 401, 403, 404] },
    litellm_gateway: { kind: "litellm", url: LITELLM_BASE + "/models", health: LITELLM_BASE.replace(/\/v1$/, "") + "/health", alive: [200, 401, 403] },
    speaches_stt: { kind: "http", url: SPEACHES_BASE + "/v1/models", alive: [200, 401, 403] },
  };
}

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
  if (!r.ok) throw new Error("sb " + r.status + " " + path.split("?")[0] + ": " + (await r.text()).slice(0, 160));
  const t = await r.text();
  return t ? JSON.parse(t) : [];
}
async function sbPatch(path, body) {
  const r = await fetch(SB_URL + "/rest/v1/" + path, {
    method: "PATCH",
    headers: H({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error("patch " + r.status + " " + path.split("?")[0] + ": " + (await r.text()).slice(0, 160));
}

// fetch con timeout duro (~4s). Cualquier fallo de red/timeout lo tratamos como "sin respuesta".
async function fetchT(url, opts) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...(opts || {}), signal: ac.signal });
  } finally {
    clearTimeout(t);
  }
}

// Ejecuta la sonda y devuelve { status, state } donde status in {connected,degraded,down}.
async function runProbe(probe) {
  try {
    let res;
    if (probe.kind === "supabase") {
      res = await fetchT(probe.url, { headers: { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY } });
    } else if (probe.kind === "litellm") {
      if (LITELLM_KEY) {
        res = await fetchT(probe.url, { headers: { Authorization: "Bearer " + LITELLM_KEY } });
      } else {
        // Sin master key: probamos el /health publico (no requiere auth).
        res = await fetchT(probe.health, {});
      }
    } else {
      res = await fetchT(probe.url, {});
    }
    if (res.ok) return { status: "connected", state: "HTTP " + res.status + " ok" };
    if (probe.alive && probe.alive.includes(res.status)) {
      return { status: "connected", state: "HTTP " + res.status + " (vivo)" };
    }
    return { status: "degraded", state: "HTTP " + res.status };
  } catch (e) {
    const msg = String((e && e.message) || e);
    const isTimeout = /abort/i.test(msg);
    return { status: "down", state: isTimeout ? "timeout" : "sin respuesta (red)" };
  }
}

async function main() {
  if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");
  const nowIso = new Date().toISOString();
  const PROBES = probesFor(SB_URL);

  const rows = await sbGet(
    "integration_connectors?select=connector_key,connector_name,status,self_hosted,route,current_state,raw&limit=1000",
  );

  const results = [];
  const down = []; // connector_keys caidos (down o degraded) que necesitan mirada
  let checked = 0;

  for (const row of rows) {
    const key = row.connector_key;
    const probe = PROBES[key];
    if (!probe) continue; // sin sonda util: no lo tocamos, se deja como estaba
    checked++;

    const prevStatus = row.status;
    const { status, state } = await runProbe(probe);

    const rawMerged = { ...(row.raw && typeof row.raw === "object" ? row.raw : {}), last_check: nowIso, last_status: status };
    await sbPatch("integration_connectors?connector_key=eq." + encodeURIComponent(key), {
      status,
      current_state: state,
      updated_at: nowIso,
      raw: rawMerged,
    });

    const bad = status === "down" || status === "degraded";
    if (bad) down.push(key);
    results.push({
      connector_key: key,
      name: row.connector_name || key,
      prev_status: prevStatus,
      status,
      state,
      was_connected: prevStatus === "connected",
    });
  }

  // BAJO RUIDO: pingar solo si hay al menos un conector self-hosted caido.
  const notify = down.length > 0;

  const L = [];
  if (down.length === 0) {
    L.push("Integraciones self-hosted OK (" + checked + " chequeadas).");
  } else {
    L.push("ONIA - Integraciones self-hosted: " + down.length + " caida(s) de " + checked + " chequeadas.");
    L.push("");
    for (const r of results) {
      const mark = r.status === "connected" ? "ok" : (r.status === "down" ? "CAIDO" : "degradado");
      L.push("- " + r.name + " [" + r.connector_key + "]: " + mark + " (" + r.state + ")" + (r.was_connected && r.status !== "connected" ? " - estaba conectado" : ""));
    }
    L.push("");
    L.push("Read-only: informo el estado, no reinicio ni cambio infra. Revisa el VPS.");
  }
  const text = L.join("\n").slice(0, 3900);

  // Marcar el agente como 'ready' con el ultimo run (PATCH+merge: la fila ya esta seedeada; hay
  // columnas NOT NULL sin default, por eso no se hace POST/insert).
  let curAgent = {};
  try {
    const a = await sbGet("operating_agents?select=raw&agent_key=eq." + AGENT_KEY);
    curAgent = a && a[0] && a[0].raw && typeof a[0].raw === "object" ? a[0].raw : {};
  } catch (_e) {
    curAgent = {};
  }
  const agentRaw = {
    ...curAgent,
    live: true,
    cadence_label: "Cada 6h",
    last_run: nowIso,
    checked,
    down,
    runtime: "selfhosted-health-agent-v1",
  };
  await sbPatch("operating_agents?agent_key=eq." + AGENT_KEY, { status: "ready", raw: agentRaw });

  return { ok: true, text, notify, checked, down, results };
}

main()
  .then(out)
  .catch((e) => out({ ok: false, notify: true, text: "Integraciones self-hosted ONIA - ERROR: " + String((e && e.message) || e).slice(0, 200) }));
