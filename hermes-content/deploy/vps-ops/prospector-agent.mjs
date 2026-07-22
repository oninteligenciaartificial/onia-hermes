// ONIA — Agente Prospector v1 (corre DENTRO del contenedor onia-center vía docker exec).
// Descubre negocios REALES de Bolivia por rubro+ciudad desde OpenStreetMap (Overpass, gratis,
// licencia ODbL) y los deja como PROSPECTOS/borradores en el CRM (onia_center.leads):
// pipeline_status='Nuevo', contact_permission='pending', owner=sergio. Prioriza los que NO
// tienen web (= candidatos a landing / web / chatbot de ONIA). Enriquecimiento opcional con
// LiteLLM (barato) para sugerir el servicio ONIA que encaja + por qué es buen prospecto.
//
// Regla dura: NO contacta a nadie. Solo surfacea targets públicos comerciales verificables y los
// deja para que Sergio/Arthur decidan y aprueben el mensaje (el Agente Vendedor redacta luego).
// Legalidad: dato público comercial (OSM ODbL). Bolivia no tiene ley integral de datos personales,
// pero igual se respeta opt-out (contact_permission='pending') y solo contacto comercial público.
//
// Env (de onia-center): ONIA_CENTER_SUPABASE_URL, ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY
// Env (inyectadas):     LITELLM_BASE, LITELLM_KEY (opcional), PROSPECTOR_MODEL,
//                       PROSPECTOR_CITY, PROSPECTOR_CATEGORY, PROSPECTOR_LIMIT,
//                       PROSPECTOR_DRY_RUN ('true'|'false'), PROSPECTOR_ONLY_NO_WEB ('true'|'false')

const SB_URL = process.env.ONIA_CENTER_SUPABASE_URL;
const SB_KEY = process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY;
const LLM_BASE = process.env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1";
const LLM_KEY = process.env.LITELLM_KEY || "";
const MODEL = process.env.PROSPECTOR_MODEL || "gpt-4o-mini";
const CITY = (process.env.PROSPECTOR_CITY || "santa_cruz").toLowerCase();
const CATEGORY = (process.env.PROSPECTOR_CATEGORY || "dental").toLowerCase();
const LIMIT = Math.max(1, Math.min(20, parseInt(process.env.PROSPECTOR_LIMIT || "8", 10)));
const DRY_RUN = process.env.PROSPECTOR_DRY_RUN === "true";
const ONLY_NO_WEB = process.env.PROSPECTOR_ONLY_NO_WEB !== "false"; // default true: prioriza hueco digital

const OVERPASS_MIRRORS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

// Bounding boxes (S,W,N,E) de las principales ciudades de Bolivia.
const CITY_BBOX = {
  santa_cruz: "-17.90,-63.30,-17.68,-63.05",
  la_paz: "-16.56,-68.20,-16.46,-68.08",
  el_alto: "-16.56,-68.25,-16.47,-68.13",
  cochabamba: "-17.44,-66.20,-17.34,-66.10",
  sucre: "-19.07,-65.29,-19.01,-65.23",
  tarija: "-21.56,-64.77,-21.50,-64.71",
  oruro: "-18.00,-67.14,-17.94,-67.08",
  potosi: "-19.62,-65.77,-19.56,-65.72",
  montero: "-17.36,-63.28,-17.30,-63.22",
  trinidad: "-14.86,-64.92,-14.80,-64.88",
};

// Rubro -> selectores OSM. Cada string es un filtro de nodo Overpass (sin el bbox).
const CATEGORY_TAGS = {
  dental: ['node["amenity"="dentist"]', 'node["healthcare"="dentist"]', 'way["amenity"="dentist"]'],
  salud: [
    'node["amenity"~"clinic|doctors|hospital"]',
    'node["healthcare"~"clinic|centre|doctor|physiotherapist"]',
  ],
  farmacia: ['node["amenity"="pharmacy"]', 'node["shop"="chemist"]'],
  estetica: ['node["shop"~"beauty|hairdresser|cosmetics"]', 'node["leisure"="spa"]', 'node["shop"="massage"]'],
  gastronomia: ['node["amenity"~"restaurant|cafe|fast_food|bar|ice_cream"]'],
  comercio: ['node["shop"]'],
  gimnasio: ['node["leisure"="fitness_centre"]', 'node["sport"="fitness"]'],
  veterinaria: ['node["amenity"="veterinary"]', 'node["shop"="pet"]'],
  hoteleria: ['node["tourism"~"hotel|guest_house|hostel"]'],
  automotriz: ['node["shop"="car_repair"]', 'node["shop"="car"]', 'node["shop"="tyres"]'],
  inmobiliaria: ['node["office"="estate_agent"]', 'node["shop"="estate_agent"]'],
  educacion: ['node["amenity"~"school|college|language_school"]', 'node["office"="educational_institution"]'],
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
async function sb(path, init) {
  const res = await fetch(SB_URL + "/rest/v1/" + path, init || { headers: H() });
  const t = await res.text();
  if (!res.ok) throw new Error("sb " + res.status + " " + path.split("?")[0] + ": " + t.slice(0, 180));
  return t ? JSON.parse(t) : [];
}
const s = (v, n) => String(v == null ? "" : v).slice(0, n);
function normName(v) {
  return String(v || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(clinica|dental|consultorio|centro|odontologic[oa]|dr|dra|sr|sra)\b/g, "")
    .trim();
}

async function overpass(ql) {
  let lastErr = "";
  for (const endpoint of OVERPASS_MIRRORS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "ONIA-Prospector/1.0 (contacto@onia.com.bo)",
          Accept: "application/json",
        },
        body: "data=" + encodeURIComponent(ql),
        signal: AbortSignal.timeout(35000),
      });
      if (res.ok) return await res.json();
      lastErr = "HTTP " + res.status + " @ " + endpoint.split("/")[2];
    } catch (e) {
      lastErr = String(e.message || e).slice(0, 60) + " @ " + endpoint.split("/")[2];
    }
  }
  throw new Error("overpass sin respuesta: " + lastErr);
}

function buildQuery(bbox, selectors) {
  const body = selectors.map((sel) => "  " + sel + "(" + bbox + ");").join("\n");
  return "[out:json][timeout:30];\n(\n" + body + "\n);\nout center 200;";
}

function normalizeElement(el) {
  const t = el.tags || {};
  const lat = el.lat != null ? el.lat : el.center && el.center.lat;
  const lon = el.lon != null ? el.lon : el.center && el.center.lon;
  const website = t.website || t["contact:website"] || null;
  const instagram = t["contact:instagram"] || null;
  const facebook = t["contact:facebook"] || null;
  return {
    name: t.name || null,
    phone: t.phone || t["contact:phone"] || t["contact:mobile"] || null,
    website,
    instagram,
    facebook,
    hasWeb: Boolean(website || instagram || facebook),
    category: t.amenity || t.shop || t.healthcare || t.office || t.tourism || t.leisure || CATEGORY,
    address: [t["addr:street"], t["addr:housenumber"]].filter(Boolean).join(" ") || null,
    lat: lat || null,
    lon: lon || null,
    osm_id: (el.type || "node") + "/" + el.id,
  };
}

async function search() {
  const bbox = CITY_BBOX[CITY];
  const selectors = CATEGORY_TAGS[CATEGORY];
  if (!bbox) throw new Error("ciudad no soportada: " + CITY + " (usa: " + Object.keys(CITY_BBOX).join(", ") + ")");
  if (!selectors) throw new Error("rubro no soportado: " + CATEGORY + " (usa: " + Object.keys(CATEGORY_TAGS).join(", ") + ")");
  const data = await overpass(buildQuery(bbox, selectors));
  const els = (data.elements || []).map(normalizeElement).filter((e) => e.name);
  // dedupe interno por nombre normalizado
  const seen = new Set();
  const uniq = [];
  for (const e of els) {
    const k = normName(e.name);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    uniq.push(e);
  }
  return uniq;
}

async function loadServices() {
  try {
    const rows = await sb("services?select=service_key,service_name,category,status&status=neq.blocked&limit=100", {
      headers: H(),
    });
    return rows.map((r) => ({ key: r.service_key, name: r.service_name, category: r.category }));
  } catch (e) {
    return [];
  }
}

async function loadExistingLeadNames() {
  try {
    const rows = await sb("leads?select=company_name&limit=2000", { headers: H() });
    return new Set(rows.map((r) => normName(r.company_name)));
  } catch (e) {
    return new Set();
  }
}

// Fallback sin LLM: heurística rubro -> service_key por keyword.
function ruleService(services) {
  const hay = (kw) => services.find((sv) => (sv.key + " " + sv.name).toLowerCase().includes(kw));
  if (CATEGORY === "dental") return (hay("dental") || {}).key || null;
  const web = hay("landing") || hay("web") || null;
  return web ? web.key : null;
}

async function enrichWithLLM(candidates, services) {
  if (!LLM_KEY) return null;
  const svcList = services.map((sv) => sv.key + " = " + sv.name).join(" | ") || "(sin catálogo)";
  const sys =
    "Sos el analista de prospección de ONIA (agencia de IA/automatización en Bolivia). " +
    "Recibís negocios reales (de OpenStreetMap) y para cada uno decidís qué servicio de ONIA encaja y por qué es buen prospecto. " +
    "ONIA vende: web/landing, DentalGest (SaaS dental), chatbot WhatsApp, automatización n8n, marketing con IA, auditorías. " +
    "Señal clave: un negocio SIN web es candidato fuerte a landing/web + chatbot. " +
    "REGLA: no inventes datos de contacto ni afirmaciones; el 'por qué' es breve y realista. Responde SOLO con JSON válido, sin markdown.";
  const user =
    "Servicios ONIA disponibles (service_key = nombre): " + svcList + ".\n" +
    "Negocios (rubro " + CATEGORY + ", " + CITY + "):\n" +
    JSON.stringify(
      candidates.map((c, i) => ({ i, nombre: c.name, categoria: c.category, tiene_web: c.hasWeb, tel: Boolean(c.phone) })),
      null,
      0,
    ) +
    "\n\nDevolvé un JSON: {\"items\":[{\"i\":0,\"business_type\":\"rubro corto\",\"suggested_service_key\":\"un service_key EXACTO de la lista o null\",\"priority\":\"alta|media|baja\",\"why_useful\":\"1-2 frases de por qué es buen prospecto y qué venderle\"}]}";
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
      signal: AbortSignal.timeout(60000),
    });
    const data = await res.json();
    if (!res.ok) return null;
    let content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
    content = content.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(content);
    const map = new Map();
    const validKeys = new Set(services.map((sv) => sv.key));
    for (const it of parsed.items || []) {
      const svc = it.suggested_service_key && validKeys.has(it.suggested_service_key) ? it.suggested_service_key : null;
      map.set(Number(it.i), {
        business_type: s(it.business_type || CATEGORY, 80),
        suggested_service_key: svc,
        priority: ["alta", "media", "baja"].includes(it.priority) ? it.priority : "media",
        why_useful: s(it.why_useful || "", 500),
      });
    }
    return map;
  } catch (e) {
    return null;
  }
}

function mapsUrl(c) {
  const q = encodeURIComponent((c.name || "") + " " + CITY.replace(/_/g, " ") + " Bolivia");
  return "https://www.google.com/maps/search/" + q;
}

async function writeLead(c, enr, ruleSvcKey) {
  const lead_key = "lead-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
  const contact = c.phone || c.instagram || c.website || c.facebook || null;
  const why = (enr && enr.why_useful) || (c.hasWeb ? "Negocio activo del rubro; evaluar chatbot/automatización." : "Sin web detectada: candidato a landing/web + chatbot ONIA.");
  const notes = why + "\nUbicar contacto: " + mapsUrl(c) + (c.address ? "\nDir: " + c.address : "");
  const row = {
    lead_key,
    company_name: s(c.name, 300),
    business_type: (enr && enr.business_type) || CATEGORY,
    public_contact: contact,
    channel: "Prospección IA",
    source: "prospector-osm",
    contact_permission: "pending",
    origin_role_key: "sergio",
    owner_role_key: "sergio",
    pipeline_status: "Nuevo",
    suggested_service_key: (enr && enr.suggested_service_key) || ruleSvcKey || null,
    priority: (enr && enr.priority) || "media",
    private_notes: notes,
    raw: {
      agent: "prospector-agent-v1",
      osm_id: c.osm_id,
      city: CITY,
      category: CATEGORY,
      has_web: c.hasWeb,
      website: c.website,
      instagram: c.instagram,
      facebook: c.facebook,
      lat: c.lat,
      lon: c.lon,
      maps_url: mapsUrl(c),
      digital_gap: !c.hasWeb,
    },
  };
  await sb("leads?select=lead_key", {
    method: "POST",
    headers: H({ Prefer: "return=minimal" }),
    body: JSON.stringify(row),
  });
  return lead_key;
}

async function markAgentReady(summary) {
  try {
    await sb("operating_agents?agent_key=eq.agent_sales_crm", {
      method: "PATCH",
      headers: H({ Prefer: "return=minimal" }),
      body: JSON.stringify({
        raw: { last_prospector_run: { at: new Date().toISOString(), city: CITY, category: CATEGORY, inserted: summary.inserted } },
      }),
    });
  } catch (e) {
    /* opcional; nunca bloquea */
  }
}

async function main() {
  if (!DRY_RUN && (!SB_URL || !SB_KEY)) throw new Error("faltan credenciales Supabase de onia-center");
  const found = await search();
  const existing = DRY_RUN ? new Set() : await loadExistingLeadNames();
  const services = DRY_RUN ? [] : await loadServices();

  // filtro: sacar los que ya están en el CRM; opcionalmente priorizar sin-web
  let pool = found.filter((c) => !existing.has(normName(c.name)));
  const noWeb = pool.filter((c) => !c.hasWeb);
  if (ONLY_NO_WEB && noWeb.length >= Math.min(LIMIT, 3)) pool = noWeb;
  const candidates = pool.slice(0, LIMIT);

  const enrMap = DRY_RUN ? null : await enrichWithLLM(candidates, services);
  const ruleSvcKey = DRY_RUN ? null : ruleService(services);

  const prospects = [];
  let inserted = 0;
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    const enr = enrMap ? enrMap.get(i) : null;
    const preview = {
      company: c.name,
      category: c.category,
      has_web: c.hasWeb,
      contact: c.phone || c.instagram || c.website || null,
      suggested_service: (enr && enr.suggested_service_key) || ruleSvcKey || null,
      priority: (enr && enr.priority) || "media",
      why: (enr && enr.why_useful) || (c.hasWeb ? "activo; evaluar chatbot" : "sin web: candidato landing/chatbot"),
    };
    if (!DRY_RUN) {
      try {
        await writeLead(c, enr, ruleSvcKey);
        inserted++;
      } catch (e) {
        preview.error = String(e.message || e).slice(0, 160);
      }
    }
    prospects.push(preview);
  }

  const summary = {
    ok: true,
    dryRun: DRY_RUN,
    city: CITY,
    category: CATEGORY,
    found: found.length,
    candidates: candidates.length,
    inserted,
    llm: Boolean(enrMap),
    prospects,
    notify: inserted > 0,
  };
  if (!DRY_RUN) await markAgentReady(summary);
  return summary;
}

main()
  .then(out)
  .catch((e) => out({ ok: false, notify: true, fatal: String(e.message || e).slice(0, 300) }));
