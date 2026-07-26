// ONIA — Agente Building in Public v1 (corre DENTRO del contenedor onia-center).
// Dos cosas:
//   (1) Visibilidad de desarrollo: lee el repo-pulse (commits por carril, inyectado por el
//       wrapper desde /opt/onia/state/repo-pulse-latest.json) y escribe onia_center.dev_pulse
//       (1 fila/dia, upsert). READ-ONLY, interno (sergio_private): guarda los nombres REALES.
//   (2) Contenido "building in public": con LiteLLM (barato) redacta 1 guion + 1 carrusel sobre
//       LO QUE ESTAMOS CONSTRUYENDO, dejandolo en review_queue (pending/sensitive/reviewer=sergio).
//
// Regla dura: el contenido PUBLICO se SANITIZA — nunca menciona clientes ni carriles internos
// crudos (ej. Bolivian Electric = cliente, se descarta). Solo temas de allowlist. Nada se
// publica sin aprobacion; generacion pesada (Higgsfield) NO automatica.
//
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY
// Env (inyectadas): REPO_PULSE_B64, LITELLM_BASE, LITELLM_KEY, BUILDING_PUBLIC_MODEL, BUILDING_PUBLIC_DRY_RUN

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const LLM_BASE = process.env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1";
const LLM_KEY = process.env.LITELLM_KEY || "";
const MODEL = process.env.BUILDING_PUBLIC_MODEL || "gpt-4o-mini";
const DRY_RUN = process.env.BUILDING_PUBLIC_DRY_RUN === "true";
const CONTENT_SOURCE_KEY = "project-content";

// Allowlist: carril interno -> tema PUBLICO seguro. Lo que no matchea se DESCARTA (clientes,
// carriles internos sin equivalente publico). DentaGest/GestiOS son productos PROPIOS = ok.
const LANE_THEMES = [
  { rx: /(web-factory|wf-|landing|web)/i, theme: "nuestra fabrica de webs" },
  { rx: /(onia-core|(^|[^a-z])core)/i, theme: "el nucleo de sistemas ONIA" },
  { rx: /(content|contenido|higgsfield|video|yt|canal|remotion)/i, theme: "contenido y video" },
  { rx: /(infra|n8n|deploy|automat)/i, theme: "automatizaciones internas" },
  { rx: /(propuesta)/i, theme: "propuestas comerciales" },
  { rx: /(dentagest|dentalgest|dental)/i, theme: "DentalGest, nuestro software dental" },
  { rx: /(gestios)/i, theme: "GestiOS, nuestro software para pymes" },
  { rx: /(siat|factura)/i, theme: "facturacion electronica para Bolivia" },
  { rx: /(research|estrategia)/i, theme: "investigacion y estrategia" },
  { rx: /(meta|ads|publicidad)/i, theme: "publicidad digital" },
];

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
function key(prefix, day) {
  return prefix + "-" + day + "-" + Math.random().toString(36).slice(2, 7);
}
function laPazDate(offsetDays = 0) {
  const now = new Date(Date.now() - 4 * 3600 * 1000 + offsetDays * 86400000);
  return now.toISOString().slice(0, 10);
}

function parsePulse() {
  try {
    const b64 = process.env.REPO_PULSE_B64 || "";
    if (!b64) return {};
    return JSON.parse(Buffer.from(b64, "base64").toString("utf8")) || {};
  } catch (e) {
    return {};
  }
}

// Carriles internos -> temas publicos (allowlist). Dedup, orden por commits.
function publicThemes(activeLanes) {
  const seen = new Set();
  const themes = [];
  for (const l of activeLanes) {
    const name = String(l.lane || "");
    const hit = LANE_THEMES.find((t) => t.rx.test(name));
    if (hit && !seen.has(hit.theme)) {
      seen.add(hit.theme);
      themes.push(hit.theme);
    }
  }
  return themes;
}

async function generate(themes) {
  const sys =
    "Eres el guionista de contenido propio de ONIA, agencia de IA practica para negocios de Bolivia. " +
    "Escribes contenido 'building in public': mostrar el proceso real de construccion de ONIA, honesto y cercano, " +
    "en espanol neutro para Bolivia. REGLAS: no inventes metricas, resultados, plazos ni nombres de clientes; " +
    "habla SOLO de los temas que te paso; inspiracion estructural, nunca copiar identidad ajena; nada se publica " +
    "sin aprobacion. Responde SOLO con JSON valido, sin markdown.";
  const user =
    "Esta semana el equipo de ONIA avanzo en: " + themes.join("; ") + ". " +
    "Redacta contenido building-in-public que muestre que estamos construyendo todo el tiempo, sin cifras inventadas. " +
    'Devolve este JSON exacto:\n' +
    '{"script":{"format":"Reel","hook":"gancho 0-3s","body":"desarrollo mostrando el detras de escena","cta":"cierre + CTA",' +
    '"on_screen":"texto en pantalla","visual_prompt":"prompt visual","voice_tone":"voz-tono","duration":"20-40s"},' +
    '"carousel":{"title":"titulo","slides":["slide 1","slide 2","slide 3","slide 4","slide 5"],"cta":"CTA"}}';

  const res = await fetch(LLM_BASE + "/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + LLM_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, temperature: 0.7, messages: [{ role: "system", content: sys }, { role: "user", content: user }] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("llm " + res.status + ": " + JSON.stringify(data).slice(0, 200));
  let content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
  content = content.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(content);
  const sc = parsed.script || {};
  const c = parsed.carousel || {};
  return {
    script: {
      format: s(sc.format || "Reel", 40),
      hook: s(sc.hook, 400),
      body: s(sc.body, 3000),
      cta: s(sc.cta, 500),
      on_screen: s(sc.on_screen, 800),
      visual_prompt: s(sc.visual_prompt, 800),
      voice_tone: s(sc.voice_tone, 200),
      duration: s(sc.duration || "20-40s", 40),
    },
    carousel: { title: s(c.title, 200), slides: (Array.isArray(c.slides) ? c.slides : []).slice(0, 10).map((x) => s(x, 400)), cta: s(c.cta, 300) },
  };
}

async function writeReview(title, raw, day) {
  await sb("review_queue", {
    method: "POST",
    headers: H({ Prefer: "return=minimal" }),
    body: JSON.stringify({
      review_key: key("rev-bp", day),
      source_type: "project",
      source_key: CONTENT_SOURCE_KEY,
      title: s(title, 240),
      priority: "media",
      status: "pending",
      reviewer_role_key: "sergio",
      sensitive: true,
      raw,
    }),
  });
}

async function main() {
  if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");
  const day = laPazDate(0);
  const pulse = parsePulse();
  const activeLanes = Array.isArray(pulse.byLane) ? pulse.byLane : [];
  const staleLanes = Array.isArray(pulse.staleLanes) ? pulse.staleLanes : [];
  const totalCommits = Number(pulse.totalCommits) || 0;
  const lookback = Number(pulse.lookbackHours) || 0;

  // (1) dev_pulse (interno, nombres reales) — SIEMPRE, deterministico.
  const laneLine = activeLanes.slice(0, 8).map((l) => l.lane + " (" + l.commits + ")").join(", ");
  const devText =
    "Desarrollo ONIA (ultimas " + lookback + "h): " + totalCommits + " commits" +
    (laneLine ? ". Carriles activos: " + laneLine : ".");
  await sb("dev_pulse?on_conflict=pulse_key", {
    method: "POST",
    headers: H({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify({
      pulse_key: "dev-" + day,
      generated_by: "agent-building-public",
      lookback_hours: lookback,
      total_commits: totalCommits,
      active_lanes: activeLanes,
      stale_lanes: staleLanes,
      summary_text: devText,
      raw: { agent: "building-public-agent-v1" },
    }),
  });

  // (2) Contenido building-in-public (sanitizado) — solo con LLM y no dry-run.
  const themes = publicThemes(activeLanes);
  let reviewsCreated = 0;
  const drafts = [];
  let gen = null;
  if (!DRY_RUN && LLM_KEY && themes.length) {
    gen = await generate(themes);
    await writeReview(
      "Building in public — " + gen.script.format + ": " + (gen.script.hook || "lo que construimos"),
      { agent: "building-public-agent-v1", kind: "content_script", themes, script: gen.script },
      day,
    );
    reviewsCreated++;
    drafts.push({ kind: "script", title: (gen.script.hook || "").slice(0, 80) });
    if (gen.carousel.title || (gen.carousel.slides && gen.carousel.slides.length)) {
      await writeReview(
        "Building in public — Carrusel: " + (gen.carousel.title || "lo que construimos"),
        { agent: "building-public-agent-v1", kind: "content_carousel", themes, carousel: gen.carousel },
        day,
      );
      reviewsCreated++;
      drafts.push({ kind: "carousel", title: (gen.carousel.title || "").slice(0, 80), slides: gen.carousel.slides.length });
    }
  }

  return {
    ok: true,
    dryRun: DRY_RUN,
    day,
    totalCommits,
    lookbackHours: lookback,
    themes,
    reviewsCreated,
    drafts,
    devText,
    notify: reviewsCreated > 0,
    preview: gen,
  };
}

main()
  .then(out)
  .catch((e) => out({ ok: false, notify: true, fatal: String(e.message || e).slice(0, 300) }));
