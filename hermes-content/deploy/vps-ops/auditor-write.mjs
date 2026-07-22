// ONIA — Auditor de código v1 (WRITE). Corre DENTRO del contenedor onia-center (docker exec):
// tiene el service-role key de Supabase + red de LiteLLM. Lee el resultado del escáner determinista
// (scripts/onia-auditor-scan.mjs) desde AUDIT_B64 (base64 del JSON), opcionalmente sintetiza con
// LiteLLM una recomendación priorizada (español), y deja UNA idea en onia_center.idea_inbox
// (category=operacion, status=inbox, sergio_private). Imprime {ok, idea_key, score, totals, notify}.
//
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY
// Env (inyectadas):     LITELLM_BASE, LITELLM_KEY (opcional), AUDITOR_MODEL, AUDIT_B64, AUDIT_DAY

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const LLM_BASE = process.env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1";
const LLM_KEY = process.env.LITELLM_KEY || "";
const MODEL = process.env.AUDITOR_MODEL || "gpt-4o-mini";
const DAY = process.env.AUDIT_DAY || new Date().toISOString().slice(0, 10);

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
async function sb(path, init) {
  const res = await fetch(SB_URL + "/rest/v1/" + path, init || { headers: H() });
  const t = await res.text();
  if (!res.ok) throw new Error("sb " + res.status + " " + path.split("?")[0] + ": " + t.slice(0, 180));
  return t ? JSON.parse(t) : [];
}
const s = (v, n) => String(v == null ? "" : v).slice(0, n);
const shortFile = (f) => String(f || "").replace(/\\/g, "/").replace("web-factory/apps/site/src/", "");

const LABEL = {
  stubs: "funciones sin implementar (throw)",
  emptyCatch: "catch vacíos (errores tragados)",
  bigFiles: "archivos >800 líneas",
  tsIgnore: "@ts-ignore/eslint-disable",
  pendientes: "pendientes (TODO/FIXME)",
  anyTypes: "tipos any",
  debugLogs: "console.log en la app",
};
const ORDER = ["stubs", "emptyCatch", "bigFiles", "tsIgnore", "pendientes", "debugLogs", "anyTypes"];

function deterministicSummary(scan) {
  const t = scan.totals || {};
  const parts = ORDER.filter((k) => (t[k] || 0) > 0).map((k) => (t[k] || 0) + " " + LABEL[k]);
  return (
    (scan.actionScore || 0) + " pts de deuda técnica sobre " + (t.filesScanned || 0) + " archivos. " +
    (parts.length ? parts.join(", ") + "." : "Sin señales relevantes.")
  );
}

function deterministicActions(scan) {
  const samples = scan.samples || {};
  const lines = [];
  for (const k of ORDER) {
    const arr = samples[k] || [];
    if (!arr.length) continue;
    const ex = arr.slice(0, 3).map((e) => shortFile(e.file) + (e.line ? ":" + e.line : e.lines ? " (" + e.lines + " líneas)" : "")).join(" · ");
    lines.push("• " + LABEL[k] + " → " + ex);
    if (lines.length >= 4) break;
  }
  return lines.join("\n") || "Sin acciones prioritarias.";
}

async function synthesize(scan) {
  if (!LLM_KEY) return null;
  const t = scan.totals || {};
  const topSamples = {};
  for (const k of ORDER) topSamples[k] = (scan.samples?.[k] || []).slice(0, 4).map((e) => shortFile(e.file) + (e.line ? ":" + e.line : "") + (e.lines ? " (" + e.lines + "L)" : ""));
  const sys =
    "Sos el revisor técnico interno de ONIA (código Next.js/TypeScript + Node). Recibís el resultado de un " +
    "escáner determinista de deuda técnica y das una recomendación BREVE y priorizada de qué atacar primero y por qué. " +
    "REGLA: no inventes hallazgos fuera de los datos; sé concreto y accionable; español neutro. Respondé SOLO JSON válido.";
  const user =
    "Totales: " + JSON.stringify(t) + "\nEjemplos por tipo: " + JSON.stringify(topSamples) + "\n" +
    'Devolvé: {"recomendacion":"2-3 frases: qué atacar primero y por qué","top_3":["accion 1","accion 2","accion 3"]}';
  try {
    const res = await fetch(LLM_BASE + "/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + LLM_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, temperature: 0.3, messages: [{ role: "system", content: sys }, { role: "user", content: user }] }),
      signal: AbortSignal.timeout(60000),
    });
    const data = await res.json();
    if (!res.ok) return null;
    let c = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
    c = c.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(c);
    return {
      recomendacion: s(parsed.recomendacion, 700),
      top_3: Array.isArray(parsed.top_3) ? parsed.top_3.slice(0, 3).map((x) => s(x, 200)) : [],
    };
  } catch (e) {
    return null;
  }
}

async function main() {
  if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");
  const b64 = process.env.AUDIT_B64 || "";
  if (!b64) throw new Error("falta AUDIT_B64 (salida del escáner)");
  const scan = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  if (!scan || !scan.totals) throw new Error("AUDIT_B64 no es un resultado de escáner válido");

  const summary = deterministicSummary(scan);
  const llm = await synthesize(scan);
  const whyLines = [];
  if (llm && llm.recomendacion) whyLines.push(llm.recomendacion);
  whyLines.push(deterministicActions(scan));
  const why = whyLines.join("\n\n").slice(0, 1900);

  const idea_key = "idea-audit-" + DAY;
  const row = {
    idea_key,
    title: s("Auditoría de código — " + (scan.actionScore || 0) + " pts (" + DAY + ")", 240),
    source_type: "otro",
    category: "operacion",
    summary: s(summary, 900),
    why_useful: why,
    target_project_key: "onia_center",
    created_by_role_key: "sergio",
    owner_role_key: "sergio",
    visibility_scope: "sergio_private",
    review_tool: "self_hosted",
    status: "inbox",
    raw: {
      agent: "auditor-agent-v1",
      day: DAY,
      llm: Boolean(llm),
      scannedAreas: scan.scannedAreas,
      actionScore: scan.actionScore,
      totals: scan.totals,
      byArea: scan.byArea,
      samples: scan.samples,
      top_3: llm ? llm.top_3 : [],
    },
  };

  await sb("idea_inbox?on_conflict=idea_key&select=idea_key", {
    method: "POST",
    headers: H({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(row),
  });

  return { ok: true, idea_key, day: DAY, score: scan.actionScore || 0, totals: scan.totals, llm: Boolean(llm), top_3: llm ? llm.top_3 : [], notify: true };
}

main()
  .then(out)
  .catch((e) => out({ ok: false, notify: true, fatal: String(e.message || e).slice(0, 300) }));
