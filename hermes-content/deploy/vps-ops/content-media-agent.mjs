// ONIA — Agente Contenido y Media Lab v1 (corre DENTRO del contenedor onia-center).
// Reusa la logica de "Guiones Diarios de Contenido" (rotacion de pilares) + ideas guardadas
// (onia_center.idea_inbox) y redacta con LiteLLM (barato, gpt-4o-mini) SOLO TEXTO:
//   (a) "que grabar hoy": 1 guion de Reel/video (gancho, desarrollo, CTA, texto en pantalla,
//       prompt visual, voz-tono, duracion)
//   (b) 1-2 borradores de carrusel (titulo + estructura de slides + CTA)
// Deja cada pieza en onia_center.review_queue (pending, sensitive, reviewer=sergio) y pone el
// status del agente (agent_content_media) en 'ready' con raw.last_run. Avisa por Telegram si
// dejo borradores.
//
// Regla dura: la generacion PESADA (Higgsfield video/imagenes) NO es automatica — el agente
// PROPONE texto, NO gasta creditos. La cara/voz IA solo con aprobacion por pieza (gasto-validar-primero).
//
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY
// Env (inyectadas):     LITELLM_BASE, LITELLM_KEY, CONTENT_AGENT_MODEL, CONTENT_AGENT_DRY_RUN ('true'|'false')

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const LLM_BASE = process.env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1";
const LLM_KEY = process.env.LITELLM_KEY || "";
const MODEL = process.env.CONTENT_AGENT_MODEL || "gpt-4o-mini";
const DRY_RUN = process.env.CONTENT_AGENT_DRY_RUN === "true";
const AGENT_KEY = "agent_content_media";
const CONTENT_SOURCE_KEY = "project-content";

// Pilares de contenido ONIA (mismos que el workflow "Guiones Diarios de Contenido").
const PILARES = [
  "Dolor real (proceso manual que pierde plata/tiempo)",
  "Antes/Despues (sin metricas falsas)",
  "Caso de uso concreto (chatbot / web que capta / automatizacion)",
  "Educativo o mito de IA para pyme",
  "Detras de escena de ONIA",
  "Autoridad Sergio fundador",
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
function key(prefix, day) {
  return prefix + "-" + day + "-" + Math.random().toString(36).slice(2, 7);
}
function laPazDate(offsetDays = 0) {
  const now = new Date(Date.now() - 4 * 3600 * 1000 + offsetDays * 86400000);
  return now.toISOString().slice(0, 10);
}
const s = (v, n) => String(v == null ? "" : v).slice(0, n);

async function loadTopIdea() {
  try {
    const rows = await sb(
      "idea_inbox?select=idea_key,title,summary,why_useful,category&category=eq.contenido&status=in.(inbox,queued)&order=created_at.desc&limit=1",
      { headers: H() },
    );
    return rows[0] || null;
  } catch (e) {
    return null; // idea_inbox es inspiracion opcional; nunca bloquea la generacion
  }
}

async function generate(pilar, idea) {
  const sys =
    "Eres el guionista de contenido propio de ONIA, agencia de IA practica para negocios de Bolivia. " +
    "Escribes guiones y carruseles listos para producir, claros y directos, sin humo. " +
    "REGLAS: no inventes testimonios, metricas, resultados ni precios; antes/despues sin numeros falsos; " +
    "inspiracion estructural, nunca copiar identidad ajena; nada se publica sin aprobacion; la cara/voz IA " +
    "de Sergio solo con aprobacion. Responde SOLO con JSON valido, sin markdown.";
  const ideaLine = idea
    ? "Parti de esta idea guardada por Sergio: " + JSON.stringify({ titulo: idea.title, resumen: idea.summary, porque: idea.why_useful }) + ". "
    : "";
  const user =
    "Genera el contenido de HOY para ONIA. " +
    ideaLine +
    "El Reel prioriza el pilar: " + pilar + ". " +
    'Devolve este JSON exacto:\n' +
    '{"script":{"format":"Reel","pillar":"' + pilar + '","hook":"gancho 0-3s","body":"desarrollo",' +
    '"cta":"cierre + llamada a la accion","on_screen":"texto en pantalla","visual_prompt":"prompt visual para el video",' +
    '"voice_tone":"voz-tono","duration":"20-40s"},' +
    '"carousels":[{"title":"titulo del carrusel","slides":["slide 1","slide 2","slide 3","slide 4","slide 5"],"cta":"CTA"},' +
    '{"title":"titulo carrusel 2","slides":["slide 1","slide 2","slide 3","slide 4"],"cta":"CTA"}]}';

  const res = await fetch(LLM_BASE + "/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + LLM_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
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
  const script = parsed.script || {};
  const carousels = Array.isArray(parsed.carousels) ? parsed.carousels.slice(0, 2) : [];
  return {
    script: {
      format: s(script.format || "Reel", 40),
      pillar: s(script.pillar || pilar, 120),
      hook: s(script.hook, 400),
      body: s(script.body, 3000),
      cta: s(script.cta, 500),
      on_screen: s(script.on_screen, 800),
      visual_prompt: s(script.visual_prompt, 800),
      voice_tone: s(script.voice_tone, 200),
      duration: s(script.duration || "20-40s", 40),
    },
    carousels: carousels.map((c) => ({
      title: s(c.title, 200),
      slides: (Array.isArray(c.slides) ? c.slides : []).slice(0, 10).map((x) => s(x, 400)),
      cta: s(c.cta, 300),
    })),
  };
}

async function alreadyGeneratedToday(day) {
  const rows = await sb(
    "review_queue?select=review_key&source_key=eq." + CONTENT_SOURCE_KEY + "&status=eq.pending&limit=200",
    { headers: H() },
  );
  return rows.some((r) => String(r.review_key || "").includes(day));
}

async function writeReview(title, priority, raw, day) {
  await sb("review_queue", {
    method: "POST",
    headers: H({ Prefer: "return=minimal" }),
    body: JSON.stringify({
      review_key: key("rev-cm", day),
      source_type: "project",
      source_key: CONTENT_SOURCE_KEY,
      title: s(title, 240),
      priority,
      status: "pending",
      reviewer_role_key: "sergio",
      sensitive: true,
      raw,
    }),
  });
}

async function markAgentReady(day, reviewsCreated, pilar) {
  await sb("operating_agents?agent_key=eq." + AGENT_KEY, {
    method: "PATCH",
    headers: H({ Prefer: "return=minimal" }),
    body: JSON.stringify({
      status: "ready",
      raw: {
        last_run: { at: new Date().toISOString(), day, reviews_created: reviewsCreated, pillar: pilar, runtime: "content-media-agent-v1" },
      },
    }),
  });
}

async function main() {
  if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");
  if (!DRY_RUN && !LLM_KEY) throw new Error("falta LITELLM_KEY");
  const day = laPazDate(0);
  const pilar = PILARES[Math.floor(Date.now() / 86400000) % PILARES.length];

  // Dedupe: no re-generar si ya hay borradores de contenido de hoy pendientes.
  if (!DRY_RUN && (await alreadyGeneratedToday(day))) {
    await markAgentReady(day, 0, pilar);
    return { ok: true, day, pillar: pilar, skipped: true, reason: "ya hay borradores de contenido de hoy en revision", notify: false, reviewsCreated: 0 };
  }

  const idea = DRY_RUN ? null : await loadTopIdea();
  const gen = await generate(pilar, idea);

  const drafts = [];
  let reviewsCreated = 0;
  if (!DRY_RUN) {
    // (a) guion "que grabar hoy"
    await writeReview(
      "Que grabar hoy — " + gen.script.format + ": " + (gen.script.hook || pilar),
      "media",
      { agent: "content-media-agent-v1", kind: "content_script", pillar: pilar, idea_key: idea ? idea.idea_key : null, script: gen.script },
      day,
    );
    reviewsCreated++;
    drafts.push({ kind: "script", title: gen.script.format + ": " + (gen.script.hook || "").slice(0, 80) });

    // (b) borradores de carrusel
    for (const c of gen.carousels) {
      if (!c.title && (!c.slides || !c.slides.length)) continue;
      await writeReview(
        "Carrusel: " + (c.title || pilar),
        "media",
        { agent: "content-media-agent-v1", kind: "content_carousel", pillar: pilar, idea_key: idea ? idea.idea_key : null, carousel: c },
        day,
      );
      reviewsCreated++;
      drafts.push({ kind: "carousel", title: (c.title || "").slice(0, 80), slides: c.slides.length });
    }
    await markAgentReady(day, reviewsCreated, pilar);
  } else {
    drafts.push({ kind: "script", title: gen.script.format + ": " + (gen.script.hook || "").slice(0, 80) });
    for (const c of gen.carousels) drafts.push({ kind: "carousel", title: (c.title || "").slice(0, 80), slides: c.slides.length });
  }

  return { ok: true, dryRun: DRY_RUN, day, pillar: pilar, ideaUsed: idea ? idea.idea_key : null, reviewsCreated, drafts, notify: reviewsCreated > 0, preview: gen };
}

main()
  .then(out)
  .catch((e) => out({ ok: false, notify: true, fatal: String(e.message || e).slice(0, 300) }));
