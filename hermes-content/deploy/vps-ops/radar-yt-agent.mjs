// ONIA — Agente Radar YT v1 (corre DENTRO del contenedor onia-center vía docker exec).
// Mira tendencias de YouTube (harvest hecho en el HOST con yt-dlp — gratis, sin API key de pago)
// y con LiteLLM (barato, gpt-4o-mini) extrae 3-6 IDEAS de contenido para ONIA: ángulo, gancho y
// formato sugerido. Inspiración ESTRUCTURAL, nunca copiar identidad/marca ajena; sin métricas
// inventadas. Deja cada idea como BORRADOR en onia_center.idea_inbox (category=contenido,
// source_type=youtube, source_url=video que inspiró, status=inbox, sergio_private,
// review_tool=self_hosted). NO publica ni genera video/imágenes (cero gasto): solo surfacea ideas
// para que el Agente Contenido / Sergio decidan qué producir.
//
// El harvest de YouTube llega como RADAR_B64 (base64 del JSON {queries, videos:[...]}) porque
// yt-dlp corre en el HOST (tiene python3); el contenedor no lo tiene. Mismo patrón que
// AUDIT_B64 (auditor-write) y LEAD_B64 (intake-lead).
//
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY
// Env (inyectadas):     LITELLM_BASE, LITELLM_KEY, RADAR_MODEL, RADAR_B64,
//                       RADAR_DRY_RUN ('true'|'false'), RADAR_LIMIT (máx ideas a escribir),
//                       RADAR_POOL (máx videos que ve el LLM)

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const LLM_BASE = process.env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1";
const LLM_KEY = process.env.LITELLM_KEY || "";
const MODEL = process.env.RADAR_MODEL || "gpt-4o-mini";
const DRY_RUN = process.env.RADAR_DRY_RUN === "true";
const LIMIT = Math.max(1, Math.min(10, parseInt(process.env.RADAR_LIMIT || "6", 10)));
const POOL = Math.max(4, Math.min(40, parseInt(process.env.RADAR_POOL || "24", 10)));

// Pilares de contenido ONIA (mismos que el Agente Contenido) — guían el ángulo de las ideas.
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
const s = (v, n) => String(v == null ? "" : v).slice(0, n);
function normTitle(v) {
  return String(v || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
function laPazDate(offsetDays = 0) {
  const now = new Date(Date.now() - 4 * 3600 * 1000 + offsetDays * 86400000);
  return now.toISOString().slice(0, 10);
}

// Lee el harvest de yt-dlp (armado por el run.sh en el host), filtra, dedup por id y rankea por
// vistas. Devuelve el pool que verá el LLM.
function parseHarvest() {
  const b64 = process.env.RADAR_B64 || "";
  if (!b64) throw new Error("falta RADAR_B64 (harvest de yt-dlp; correr desde radar-yt-agent-run.sh)");
  let data;
  try {
    data = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  } catch (e) {
    throw new Error("RADAR_B64 no es JSON válido: " + String(e.message || e).slice(0, 80));
  }
  const queries = Array.isArray(data.queries) ? data.queries.map((q) => s(q, 120)) : [];
  const raw = Array.isArray(data.videos) ? data.videos : [];
  const seen = new Set();
  const videos = [];
  for (const v of raw) {
    const id = v.id || v.url;
    const title = v.title;
    if (!id || !title) continue;
    if (v.live_status === "is_live" || v.live_status === "is_upcoming") continue;
    if (seen.has(id)) continue;
    seen.add(id);
    videos.push({
      id: s(id, 40),
      title: s(title, 300),
      channel: s(v.channel || v.uploader || "", 160),
      views: Number(v.view_count) || 0,
      duration: Number(v.duration) || 0,
      url: v.url || v.webpage_url || "https://www.youtube.com/watch?v=" + id,
      query: s(v.query || "", 120),
    });
  }
  videos.sort((a, b) => b.views - a.views);
  return { queries, total: raw.length, videos: videos.slice(0, POOL) };
}

async function loadExistingIdeaTitles() {
  try {
    const rows = await sb(
      "idea_inbox?select=title&or=(source_type.eq.youtube,category.eq.contenido)&limit=800",
      { headers: H() },
    );
    return new Set(rows.map((r) => normTitle(r.title)));
  } catch (e) {
    return new Set();
  }
}

async function extractIdeas(videos) {
  if (!LLM_KEY) return null;
  const pilar = PILARES[Math.floor(Date.now() / 86400000) % PILARES.length];
  const list = videos.map((v, i) => ({
    i,
    titulo: v.title,
    canal: v.channel,
    vistas: v.views,
    min: Math.max(1, Math.round(v.duration / 60)) || null,
    tema: v.query,
  }));
  const sys =
    "Sos el estratega de contenido de ONIA, agencia de IA práctica para negocios de Bolivia/LATAM. " +
    "Recibís videos de YouTube que están teniendo tracción en temas de automatización/IA para pymes. " +
    "Tu trabajo: destilar de ellos IDEAS de contenido PROPIO para ONIA (Reel, carrusel o short), " +
    "tomando el ÁNGULO y la ESTRUCTURA que funciona, NUNCA copiando la identidad, marca, guion ni " +
    "las palabras del creador. Adaptá el tema al mundo de ONIA (chatbot WhatsApp, web que capta, " +
    "automatización n8n, IA práctica para pyme). " +
    "REGLAS DURAS: no inventes métricas, testimonios, resultados ni precios; no copies títulos ajenos; " +
    "cada idea debe apoyarse en UNO de los videos de la lista (por su índice i). Español neutro, claro, " +
    "sin humo. Respondé SOLO con JSON válido, sin markdown.";
  const user =
    "Pilar sugerido para hoy (orientativo, no obligatorio): " + pilar + ".\n" +
    "Videos con tracción (i, titulo, canal, vistas, min=duración, tema):\n" +
    JSON.stringify(list, null, 0) +
    "\n\nDevolvé entre 3 y 6 ideas en este JSON exacto:\n" +
    '{"ideas":[{"video_i":0,"idea_title":"título corto y propio de la idea (no copiar el del video)",' +
    '"angle":"el ángulo/gancho que funciona, reinterpretado para ONIA","format":"Reel|Carrusel|Short",' +
    '"hook":"gancho 0-3s para ONIA","why_useful":"1-2 frases: por qué a la audiencia pyme de ONIA le sirve y qué vende ONIA con esto"}]}';
  try {
    const res = await fetch(LLM_BASE + "/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + LLM_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
      }),
      signal: AbortSignal.timeout(90000),
    });
    const data = await res.json();
    if (!res.ok) return null;
    let content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
    content = content.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(content);
    const fmt = new Set(["Reel", "Carrusel", "Short"]);
    const ideas = [];
    for (const it of parsed.ideas || []) {
      const vi = Number(it.video_i);
      const video = videos[vi] || null;
      const title = s(it.idea_title, 220);
      if (!title) continue;
      ideas.push({
        video,
        pilar,
        idea_title: title,
        angle: s(it.angle, 900),
        format: fmt.has(it.format) ? it.format : "Reel",
        hook: s(it.hook, 400),
        why_useful: s(it.why_useful, 600),
      });
    }
    return ideas;
  } catch (e) {
    return null;
  }
}

async function writeIdea(idea, day) {
  const v = idea.video || {};
  const idea_key = "idea-radaryt-" + day + "-" + Math.random().toString(36).slice(2, 8);
  const summary =
    "[" + idea.format + "] " + idea.angle +
    (idea.hook ? "\nGancho: " + idea.hook : "");
  const why =
    (idea.why_useful || "") +
    (v.title ? "\n\nInspiración estructural (no copiar): \"" + s(v.title, 160) + "\"" + (v.channel ? " — " + v.channel : "") + (v.views ? " (" + v.views.toLocaleString("es") + " vistas)" : "") : "");
  const row = {
    idea_key,
    title: s(idea.idea_title, 240),
    source_type: "youtube",
    source_url: v.url || null,
    category: "contenido",
    summary: s(summary, 900),
    why_useful: s(why, 1900),
    target_project_key: "onia_center",
    created_by_role_key: "sergio",
    owner_role_key: "sergio",
    visibility_scope: "sergio_private",
    review_tool: "self_hosted",
    status: "inbox",
    raw: {
      agent: "radar-yt-agent-v1",
      day,
      pillar: idea.pilar,
      format: idea.format,
      hook: idea.hook,
      angle: idea.angle,
      inspired_by: {
        video_id: v.id || null,
        video_title: v.title || null,
        channel: v.channel || null,
        views: v.views || null,
        duration_s: v.duration || null,
        url: v.url || null,
        query: v.query || null,
      },
    },
  };
  await sb("idea_inbox?select=idea_key", {
    method: "POST",
    headers: H({ Prefer: "return=minimal" }),
    body: JSON.stringify(row),
  });
  return idea_key;
}

// Registro best-effort de la corrida (no pisa a otros agentes: usa clave propia; si la fila no
// existe, el PATCH es no-op y nunca bloquea).
async function markAgentReady(summary) {
  try {
    await sb("operating_agents?agent_key=eq.agent_radar_yt", {
      method: "PATCH",
      headers: H({ Prefer: "return=minimal" }),
      body: JSON.stringify({
        raw: { last_radar_run: { at: new Date().toISOString(), inserted: summary.inserted, queries: summary.queries } },
      }),
    });
  } catch (e) {
    /* opcional; nunca bloquea */
  }
}

async function main() {
  if (!DRY_RUN && (!SB_URL || !SB_KEY)) throw new Error("faltan credenciales Supabase de onia-center");
  const harvest = parseHarvest();
  if (!harvest.videos.length) {
    return { ok: true, dryRun: DRY_RUN, queries: harvest.queries, found: harvest.total, pool: 0, inserted: 0, ideas: [], notify: false, note: "harvest vacío (yt-dlp no devolvió videos)" };
  }

  const existing = DRY_RUN ? new Set() : await loadExistingIdeaTitles();
  const raw = await extractIdeas(harvest.videos);
  if (!raw) {
    return { ok: false, dryRun: DRY_RUN, queries: harvest.queries, found: harvest.total, pool: harvest.videos.length, inserted: 0, ideas: [], notify: true, error: "LiteLLM no devolvió ideas (revisar LITELLM_KEY / modelo)" };
  }

  // Dedup contra ideas ya guardadas y entre sí (por título normalizado).
  const day = laPazDate(0);
  const picked = [];
  const seenTitles = new Set(existing);
  for (const idea of raw) {
    const k = normTitle(idea.idea_title);
    if (!k || seenTitles.has(k)) continue;
    seenTitles.add(k);
    picked.push(idea);
    if (picked.length >= LIMIT) break;
  }

  const ideas = [];
  let inserted = 0;
  for (const idea of picked) {
    const preview = {
      title: idea.idea_title,
      format: idea.format,
      hook: idea.hook,
      source_url: (idea.video && idea.video.url) || null,
      inspired_by: (idea.video && idea.video.title) || null,
      views: (idea.video && idea.video.views) || null,
    };
    if (!DRY_RUN) {
      try {
        preview.idea_key = await writeIdea(idea, day);
        inserted++;
      } catch (e) {
        preview.error = String(e.message || e).slice(0, 160);
      }
    }
    ideas.push(preview);
  }

  const summary = {
    ok: true,
    dryRun: DRY_RUN,
    day,
    queries: harvest.queries,
    found: harvest.total,
    pool: harvest.videos.length,
    proposed: raw.length,
    inserted,
    ideas,
    notify: inserted > 0 || DRY_RUN,
  };
  if (!DRY_RUN) await markAgentReady(summary);
  return summary;
}

main()
  .then(out)
  .catch((e) => out({ ok: false, notify: true, fatal: String(e.message || e).slice(0, 300) }));
