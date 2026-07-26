// ONIA — Agente Radar de Novedades IA v1 (corre DENTRO del contenedor onia-center via docker exec).
// Lee feeds RSS/Atom curados de novedades de IA (TLDR AI, OpenAI, Hugging Face, Gemini, Hacker News,
// Product Hunt, Reddit), deduplica contra lo ya visto, INSERTA los items NUEVOS en
// onia_center.ai_radar_items y con LiteLLM (barato, gpt-4o-mini) clasifica cada uno:
//   importance (major|notable|minor|ignore), category, vendor, topic_key, why_it_matters, content_angle.
// Devuelve UNA linea JSON {ok,text,notify,new,major} para que n8n avise por Telegram SOLO los
// lanzamientos GRANDES (major). Cero gasto pesado: solo fetch + LiteLLM self-hosted. READ-ONLY sobre
// el mundo (no publica nada); solo escribe su propia tabla/estado.
//
// El fetch de los feeds corre DENTRO del contenedor (a diferencia de radar-yt, que necesita yt-dlp en
// el host): RSS/Atom es texto plano y node lo baja con fetch. Se parsea con regex simple (sin libs).
//
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY
// Env (inyectadas):     LITELLM_BASE, LITELLM_KEY, AI_RADAR_MODEL, AI_RADAR_MAX_NEW

const crypto = require("node:crypto");

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const LLM_BASE = process.env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1";
const LLM_KEY = process.env.LITELLM_KEY || "";
const MODEL = process.env.AI_RADAR_MODEL || "gpt-4o-mini";
const MAX_NEW = Math.max(5, Math.min(80, parseInt(process.env.AI_RADAR_MAX_NEW || "40", 10)));
const AGENT_KEY = "agent_ai_radar";
const UA = "ONIA-Radar/1.0";
const FEED_TIMEOUT_MS = 8000;
const EXISTING_LOOKBACK = 500;

// Feeds verificados vivos 2026-07-22. source_type = clase de fuente (para el panel/filtrado).
const FEEDS = [
  { url: "https://tldr.tech/api/rss/ai", source: "TLDR AI", source_type: "newsletter" },
  { url: "https://openai.com/news/rss.xml", source: "OpenAI News", source_type: "vendor" },
  { url: "https://huggingface.co/blog/feed.xml", source: "Hugging Face Blog", source_type: "vendor" },
  { url: "https://blog.google/products/gemini/rss/", source: "Google Gemini", source_type: "vendor" },
  {
    url: "https://hnrss.org/newest?q=OpenAI+OR+Anthropic+OR+Gemini+OR+Claude+OR+Kling+OR+Higgsfield+OR+Sora&points=40",
    source: "Hacker News",
    source_type: "community",
  },
  { url: "https://www.producthunt.com/feed", source: "Product Hunt", source_type: "launch" },
  { url: "https://www.reddit.com/r/StableDiffusion/top/.rss?t=day", source: "Reddit r/StableDiffusion", source_type: "community" },
];

const IMPORTANCE = new Set(["major", "notable", "minor", "ignore"]);
const CATEGORY = new Set(["model_llm", "video", "image", "agents", "tooling", "policy", "other"]);

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
const oneLine = (v, n) => s(String(v == null ? "" : v).replace(/\s+/g, " ").trim(), n);

// Quita tildes, comillas raras y guiones largos para el texto de salida (Telegram-safe).
function flat(v) {
  return String(v == null ? "" : v)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[“”„‟]/g, '"')
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...");
}
function normTitle(v) {
  return String(v || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
function slug(v) {
  return normTitle(v).replace(/\s+/g, "-").slice(0, 60) || "novedad";
}
function canonicalUrl(u) {
  try {
    const url = new URL(String(u).trim());
    url.hash = "";
    const drop = [];
    for (const k of url.searchParams.keys()) {
      if (/^utm_/i.test(k) || ["ref", "ref_src", "source", "fbclid", "gclid"].includes(k.toLowerCase())) drop.push(k);
    }
    for (const k of drop) url.searchParams.delete(k);
    return url.toString().toLowerCase().replace(/\/+$/, "");
  } catch (e) {
    return String(u || "").trim().toLowerCase().replace(/\/+$/, "");
  }
}
function dedupeHash(title, url) {
  return crypto.createHash("sha256").update(normTitle(title) + "|" + canonicalUrl(url)).digest("hex");
}
function toISO(d) {
  if (!d) return null;
  const t = Date.parse(String(d).trim());
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

// --- Parseo XML (regex simple; maneja RSS <item> y Atom <entry>) ------------------------------
function stripCdata(v) {
  return String(v || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
}
function decodeEntities(v) {
  return String(v || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x2F;/gi, "/")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}
function cleanText(v) {
  return decodeEntities(stripCdata(v).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}
function firstMatch(block, regexes) {
  for (const re of regexes) {
    const m = block.match(re);
    if (m && m[1] != null) return m[1];
  }
  return "";
}
function extractLink(block) {
  // Atom: uno o mas <link href=... rel=...>. Preferimos alternate; saltamos self.
  const atom = [...block.matchAll(/<link\b([^>]*?)\/?>/gi)];
  let fallback = "";
  for (const m of atom) {
    const attrs = m[1] || "";
    const href = attrs.match(/href=["']([^"']+)["']/i);
    if (!href) continue;
    if (/rel=["']?self["']?/i.test(attrs)) continue;
    if (/rel=["']?alternate["']?/i.test(attrs) || !/rel=/i.test(attrs)) return decodeEntities(href[1]);
    if (!fallback) fallback = decodeEntities(href[1]);
  }
  if (fallback) return fallback;
  // RSS: <link>url</link>
  const rss = block.match(/<link>\s*([\s\S]*?)<\/link>/i);
  if (rss) return decodeEntities(stripCdata(rss[1]).trim());
  return "";
}
function parseFeed(xml, feed) {
  const items = [];
  const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/gi) || [];
  for (const block of blocks) {
    const title = cleanText(firstMatch(block, [/<title[^>]*>([\s\S]*?)<\/title>/i]));
    const url = extractLink(block);
    if (!title || !url) continue;
    const guid = cleanText(
      firstMatch(block, [/<guid[^>]*>([\s\S]*?)<\/guid>/i, /<id>([\s\S]*?)<\/id>/i]),
    );
    const dateRaw = firstMatch(block, [
      /<pubDate>([\s\S]*?)<\/pubDate>/i,
      /<published>([\s\S]*?)<\/published>/i,
      /<updated>([\s\S]*?)<\/updated>/i,
      /<dc:date>([\s\S]*?)<\/dc:date>/i,
    ]);
    const snippet = cleanText(
      firstMatch(block, [
        /<description>([\s\S]*?)<\/description>/i,
        /<summary[^>]*>([\s\S]*?)<\/summary>/i,
        /<content:encoded>([\s\S]*?)<\/content:encoded>/i,
        /<content[^>]*>([\s\S]*?)<\/content>/i,
      ]),
    );
    items.push({
      source: feed.source,
      source_type: feed.source_type,
      title: s(title, 500),
      url: s(url, 1000),
      external_id: s(guid || canonicalUrl(url), 300),
      snippet: s(snippet, 1000),
      published_at: toISO(dateRaw),
    });
  }
  return items;
}
async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { "User-Agent": UA, Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*" },
      signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseFeed(xml, feed);
  } catch (e) {
    return []; // un feed caido nunca rompe la corrida
  }
}

async function loadExistingHashes() {
  try {
    const rows = await sb(
      "ai_radar_items?select=dedupe_hash&order=created_at.desc&limit=" + EXISTING_LOOKBACK,
      { headers: H() },
    );
    return new Set(rows.map((r) => r.dedupe_hash).filter(Boolean));
  } catch (e) {
    return new Set();
  }
}

// Insert con return=representation (para recuperar los id). Intenta batch; si falla (ej. 409 por
// carrera), cae a insert item-por-item saltando los duplicados. Nunca crashea por un duplicado.
async function insertNew(rows) {
  try {
    const res = await fetch(SB_URL + "/rest/v1/ai_radar_items", {
      method: "POST",
      headers: H({ Prefer: "return=representation" }),
      body: JSON.stringify(rows),
    });
    if (res.ok) {
      const t = await res.text();
      return t ? JSON.parse(t) : [];
    }
  } catch (e) {
    /* cae a per-item */
  }
  const inserted = [];
  for (const row of rows) {
    try {
      const res = await fetch(SB_URL + "/rest/v1/ai_radar_items", {
        method: "POST",
        headers: H({ Prefer: "return=representation" }),
        body: JSON.stringify(row),
      });
      if (!res.ok) continue; // 409 duplicado u otro -> saltar
      const t = await res.text();
      const arr = t ? JSON.parse(t) : [];
      if (arr[0]) inserted.push(arr[0]);
    } catch (e) {
      /* saltar */
    }
  }
  return inserted;
}

// Clasifica todos los nuevos en UNA sola llamada a LiteLLM. Devuelve un mapa i->clasificacion, o
// null si falla (el caller aplica fallback y nunca crashea).
async function classify(items) {
  if (!LLM_KEY) return null;
  const list = items.map((it, i) => ({ i, title: it.title, source: it.source, snippet: s(it.snippet, 280) }));
  const sys =
    "Sos el analista de novedades de IA de ONIA, agencia de IA practica para negocios de Bolivia/LATAM y " +
    "productora de contenido faceless (YouTube/IG) sobre IA. Clasificas lanzamientos y noticias de IA para " +
    "decidir cuales merecen alerta y cuales sirven de material de contenido. " +
    "REGLAS DURAS: no inventes nada; si no sabes o el titulo es ambiguo, importance='minor'. " +
    "'major' SOLO para: modelo frontera nuevo (LLM/multimodal), producto que cambia el juego, o herramienta " +
    "de video/imagen realmente relevante. Todo lo demas es notable/minor/ignore. " +
    "why_it_matters y content_angle en espanol neutro, claros, sin humo. Responde SOLO con JSON valido, sin markdown.";
  const user =
    "Clasifica estas novedades de IA (i, title, source, snippet):\n" +
    JSON.stringify(list) +
    "\n\nDevolve este JSON exacto:\n" +
    '{"items":[{"i":0,"importance":"major|notable|minor|ignore",' +
    '"category":"model_llm|video|image|agents|tooling|policy|other",' +
    '"vendor":"empresa/creador (ej OpenAI, Google, Black Forest Labs; vacio si no aplica)",' +
    '"topic_key":"slug de LA MISMA noticia, ej gpt-6-launch o kling-2-release",' +
    '"why_it_matters":"<=140 chars ES: por que importa para el contenido/negocio de ONIA",' +
    '"content_angle":"<=140 chars ES: gancho concreto para un video/post faceless de YouTube o IG"}]}';
  try {
    const res = await fetch(LLM_BASE + "/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + LLM_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
      }),
      signal: AbortSignal.timeout(120000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    let content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
    content = content.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(content);
    const map = {};
    for (const it of parsed.items || []) {
      const i = Number(it.i);
      if (!Number.isInteger(i) || !items[i]) continue;
      const importance = IMPORTANCE.has(it.importance) ? it.importance : "minor";
      const category = CATEGORY.has(it.category) ? it.category : "other";
      map[i] = {
        importance,
        category,
        vendor: oneLine(it.vendor, 80),
        topic_key: oneLine(it.topic_key, 80) || slug(items[i].title),
        why_it_matters: oneLine(it.why_it_matters, 140),
        content_angle: oneLine(it.content_angle, 140),
      };
    }
    return map;
  } catch (e) {
    return null;
  }
}

function fallbackClass(item) {
  // LiteLLM caido: no clasificamos como major (no spameamos). Notable + snippet como why.
  return {
    importance: "notable",
    category: "other",
    vendor: "",
    topic_key: slug(item.title),
    why_it_matters: oneLine(item.snippet || item.title, 140),
    content_angle: "",
  };
}

async function patchItem(id, fields) {
  try {
    await sb("ai_radar_items?id=eq." + id, {
      method: "PATCH",
      headers: H({ Prefer: "return=minimal" }),
      body: JSON.stringify(fields),
    });
  } catch (e) {
    /* best-effort */
  }
}

// PATCH del estado propio (la fila agent_ai_radar YA existe seedeada -> nunca POST/insert).
async function markAgent(newN, majorN) {
  try {
    await sb("operating_agents?agent_key=eq." + AGENT_KEY, {
      method: "PATCH",
      headers: H({ Prefer: "return=minimal" }),
      body: JSON.stringify({
        status: "ready",
        raw: {
          live: true,
          cadence_label: "Cada 1-2h",
          last_run: new Date().toISOString(),
          new: newN,
          major: majorN,
          runtime: "ai-news-radar-v1",
        },
      }),
    });
  } catch (e) {
    /* nunca bloquea */
  }
}

function laPazDateHuman() {
  return new Date(Date.now() - 4 * 3600 * 1000).toLocaleDateString("es-BO", { day: "2-digit", month: "long" });
}

function buildText(majors, day, newN) {
  const L = [];
  L.push("Novedades IA - " + day);
  if (!majors.length) {
    L.push("");
    L.push(newN + " novedad(es) nueva(s), ninguna mayor por ahora.");
    return flat(L.join("\n")).slice(0, 3900);
  }
  L.push("");
  for (const m of majors) {
    const vendor = m.vendor ? " [" + m.vendor + "]" : "";
    const why = m.why_it_matters ? "  " + m.why_it_matters : "";
    const angle = m.content_angle ? "  gancho: " + m.content_angle : "";
    L.push("- " + oneLine(m.title, 160) + vendor + why + angle + "  " + m.url);
  }
  return flat(L.join("\n")).slice(0, 3900);
}

async function main() {
  if (!SB_URL || !SB_KEY) throw new Error("faltan credenciales Supabase de onia-center");
  const day = laPazDateHuman();

  // 1. Fetch de todos los feeds en paralelo (un feed caido no rompe nada).
  const batches = await Promise.all(FEEDS.map((f) => fetchFeed(f)));
  const raw = [];
  for (const b of batches) for (const it of b) raw.push(it);

  // 2. Dedup dentro de la corrida por dedupe_hash.
  const byHash = new Map();
  for (const it of raw) {
    it.dedupe_hash = dedupeHash(it.title, it.url);
    if (!byHash.has(it.dedupe_hash)) byHash.set(it.dedupe_hash, it);
  }

  // 3. Filtrar contra lo ya visto (ultimos ~500).
  const existing = await loadExistingHashes();
  let fresh = [...byHash.values()].filter((it) => !existing.has(it.dedupe_hash));
  // Priorizar los mas recientes y acotar el volumen por corrida (el resto entra en la siguiente).
  fresh.sort((a, b) => (b.published_at || "").localeCompare(a.published_at || ""));
  fresh = fresh.slice(0, MAX_NEW);

  // 4. Sin novedades nuevas -> estado ready + salida sin notify.
  if (!fresh.length) {
    await markAgent(0, 0);
    return { ok: true, text: "Radar IA: sin novedades nuevas.", notify: false, new: 0, major: 0 };
  }

  // 5. Insert de los nuevos (return=representation para tener los id).
  const nowISO = new Date().toISOString();
  const rows = fresh.map((it) => ({
    source: it.source,
    source_type: it.source_type,
    title: it.title,
    url: it.url,
    external_id: it.external_id,
    snippet: it.snippet,
    published_at: it.published_at,
    fetched_at: nowISO,
    dedupe_hash: it.dedupe_hash,
    status: "new",
    alerted: false,
  }));
  const inserted = await insertNew(rows);
  if (!inserted.length) {
    // Nada quedo insertado (probable carrera: ya existian). Estado ready, sin notify.
    await markAgent(0, 0);
    return { ok: true, text: "Radar IA: sin novedades nuevas (ya registradas).", notify: false, new: 0, major: 0 };
  }

  // 6. Clasificar en UNA llamada a LiteLLM (con fallback por item si falla).
  const llmMap = await classify(inserted);
  const classified = inserted.map((row, i) => {
    const c = (llmMap && llmMap[i]) || fallbackClass(row);
    return {
      id: row.id,
      title: row.title,
      url: row.url,
      importance: c.importance,
      category: c.category,
      vendor: c.vendor,
      topic_key: c.topic_key,
      why_it_matters: c.why_it_matters,
      content_angle: c.content_angle,
    };
  });

  // 7. Elegir los MAJOR a alertar (max 8, 1 por topic_key).
  const seenTopics = new Set();
  const majors = [];
  for (const c of classified) {
    if (c.importance !== "major") continue;
    const tk = c.topic_key || slug(c.title);
    if (seenTopics.has(tk)) continue;
    seenTopics.add(tk);
    majors.push(c);
    if (majors.length >= 8) break;
  }
  const alertedIds = new Set(majors.map((m) => m.id));

  // 8. PATCH de cada item con su clasificacion (alerted=true solo para los major elegidos).
  for (const c of classified) {
    await patchItem(c.id, {
      importance: c.importance,
      category: c.category,
      vendor: c.vendor || null,
      topic_key: c.topic_key || null,
      why_it_matters: c.why_it_matters || null,
      content_angle: c.content_angle || null,
      status: "classified",
      alerted: alertedIds.has(c.id),
    });
  }

  // 9. Texto + estado del agente + salida.
  const text = buildText(majors, day, inserted.length);
  await markAgent(inserted.length, majors.length);
  return { ok: true, text, notify: majors.length > 0, new: inserted.length, major: majors.length };
}

main()
  .then(out)
  .catch((e) => out({ ok: false, notify: true, text: "Radar de Novedades IA ONIA - ERROR: " + String(e.message || e).slice(0, 220) }));
