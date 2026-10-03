// editor-videos — SEED de campaña: cargar las piezas APROBADAS EN ESTRUCTURA de una
// campaña como los primeros `onia_center.video_projects` del Estudio de Contenido.
//
// Campaña embebida: "Lucía vende DentalGest" (carril H, tanda de 2 semanas / 10 piezas).
// Fuente ÚNICA de los datos de abajo: hermes-content/docs/ONIA_CARRIL_H_LUCIA_PLAN_20260725.md
// (sección 1 = calendario/costos, sección 2 = los 10 guiones, sección 3 = presupuesto).
// Nada acá se inventa: hook, CTA, formato, pilar y costo salen textuales del doc.
//
// Todas las piezas entran en status 'intake' (aún NO producidas — gasto cero: el doc
// espera el OK de Sergio en su sección 6 "STOP"). La generación paga NO se dispara acá.
//
// Contrato de datos respetado (ver supabase/migrations/20260723_onia_center_video_studio.sql
// y web-factory/apps/site/src/app/onia-center/components/views/estudio/source.ts):
//   • lane: la columna sólo acepta client|onia|sergio → va 'onia'. El carril FINO va en
//     raw.lane='onia-ig' + raw.lane_label='ONIA · Lucía IG' (el panel prioriza raw en laneInfo).
//   • raw.raw_label: subtítulo que el panel muestra bajo el título en la tabla
//     (mapProject → strField(raw,"raw_label")). Ej: "carrusel 7 slides · P4".
//   • format: 'vertical' (todo 9:16).
//   • duration_seconds: 0 (no hay crudo todavía) → el panel muestra "—" en Duración.
//     La duración OBJETIVO del doc queda en raw.duracion_target (string), no en la columna,
//     para no mostrar un "crudo" tachado que no existe.
//   • model: 'higgsfield' SOLO en las 2 piezas de generación paga con gate por tanda
//     (día 3 = Tanda A, día 7 = Tanda B). El resto 'free'.
//     OJO: raw.needs_higgsfield es MÁS AMPLIO — marca cualquier consumo de cupo Higgsfield
//     (voz seed_audio de los días 2/6/9, imagen Soul del día 1), que el doc cotiza en 2-6 cr.
//   • credits_est: 0 en las piezas de costo cero; en las demás, el TOPE del rango del
//     escenario (a) Mínimo-gasto de la sección 3 del doc (no se inventa ningún número).
//
// DRY-RUN siempre: imprime el SQL a stdout; --out <file.sql> además lo guarda. No hay
// modo apply — el SQL lo aplica el orquestador por SSH a supabase-db tras revisarlo.
//
// Uso:
//   node seed-campaign.mjs [--out <file.sql>]
//
// Determinista: sin Date.now / Math.random / dependencias externas.
import { writeFileSync } from "node:fs";

// ---- args ------------------------------------------------------------------
const argv = process.argv.slice(2);
const flag = (name, def) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : def;
};
if (argv.includes("--help") || argv.includes("-h")) {
  console.error("uso: node seed-campaign.mjs [--out <file.sql>]  (DRY-RUN: el SQL sale por stdout)");
  process.exit(0);
}

// ---- identidad de la campaña ----------------------------------------------
const CAMPAIGN = "lucia-dentalgest-20260728";
const DOC = "ONIA_CARRIL_H_LUCIA_PLAN_20260725.md";
const KEY_PREFIX = "lucia-d";
const LANE_DB = "onia"; // CHECK: client|onia|sergio
const LANE_FINE = "onia-ig"; // FINE_LANES del panel
const LANE_LABEL = "ONIA · Lucía IG";
const FORMAT = "vertical"; // 9:16 en las 10 piezas
const STATUS = "intake"; // ninguna pieza está producida
const CREDITS_BASIS = "tope del rango · escenario (a) Mínimo-gasto (sección 3 del doc)";

// ---- las 10 piezas (datos del doc, sección 1 + sección 2) ------------------
// credits: 0 = costo cero; el resto = tope del rango del escenario mínimo del doc.
const PIECES = [
  {
    day: 1,
    titulo: "Hola, soy Lucía",
    formato: "carrusel 7 slides",
    rawLabel: "carrusel 7 slides · P4",
    pilar: "P4",
    duracionTarget: null,
    hook: "Soy Lucía. No existo. Y vengo a venderte algo real.",
    cta: "DEMO al WhatsApp",
    credits: 6, // "Imagen Soul portada (día 1) 0,5-6 cr" (sección 3)
    costNote: "Bajo — 1 imagen Soul (~0,5-6 cr) + Remotion 0 cr",
    needsHiggsfield: true, // imagen Soul de portada
    tanda: null,
    produccion: "1 imagen Soul nueva (retrato portada) + 6 slides Remotion con plantilla de marca.",
    nota: null,
    publishDateProposed: "2026-07-28",
  },
  {
    day: 2,
    titulo: "Mirá cómo reprograma solo",
    formato: "reel 25-30s captura + voz",
    rawLabel: "reel captura+voz · P2",
    pilar: "P2",
    duracionTarget: "25-30 s",
    hook: "Te cancelaron a las 8 de la noche. ¿Y ahora?",
    cta: "DEMO al WhatsApp",
    credits: 4, // voz Lucía seed_audio 2-4 cr
    costNote: "Casi 0 — captura + voz seed_audio 2-4 cr",
    needsHiggsfield: true, // voz Lucía 8de5db95 (seed_audio)
    tanda: null,
    produccion: "Captura real (demo) + voz + subtítulos Remotion/ffmpeg.",
    nota: "Pantallas demo rotuladas \"simulación con datos de demo\".",
    publishDateProposed: "2026-07-29",
  },
  {
    day: 3,
    titulo: "Faltan X días",
    formato: "reel 20-30s Lucía en cámara",
    rawLabel: "reel Lucía en cámara · P1 · Tanda A",
    pilar: "P1",
    duracionTarget: "20-30 s",
    hook: "30 de septiembre. Anotalo.",
    cta: "DEMO al WhatsApp",
    credits: 35, // Tanda A escenario (a): 18-35 cr (voz en off, sin lipsync)
    costNote: "Medio — TANDA A (~18-55 cr según escenario)",
    needsHiggsfield: true,
    tanda: "A",
    produccion:
      "2 imágenes Soul (Lucía escritorio / primer plano) + 2 clips b-roll 5s + voz + captura breve del sistema + ffmpeg.",
    nota:
      "El número de días se calcula el día de publicación (si sale el 30-jul, son 62). SIAT = timing, nunca \"por ley tenés que comprarnos\": se dice que existe el portal gratis del SIN.",
    publishDateProposed: "2026-07-30",
  },
  {
    day: 4,
    titulo: "La cuenta de la silla vacía",
    formato: "carrusel 6 slides",
    rawLabel: "carrusel 6 slides · P3",
    pilar: "P3",
    duracionTarget: null,
    hook: "¿Cuánto te cuesta UNA silla vacía por día?",
    cta: "DEMO al WhatsApp",
    credits: 0,
    costNote: "0 — Remotion + reuso Soul día 1",
    needsHiggsfield: false,
    tanda: null,
    produccion: "6 slides Remotion; portada reusa imagen Soul del día 1.",
    nota: "Solo aritmética hipotética y transparente. Cero casos de clientes inventados.",
    publishDateProposed: "2026-07-31",
  },
  {
    day: 5,
    titulo: "Encuesta: ¿quién confirma tus citas?",
    formato: "historias ×3 (encuesta)",
    rawLabel: "historias ×3 encuesta · P2",
    pilar: "P2",
    duracionTarget: null,
    hook: "Dentista: ¿quién confirma tus citas hoy?",
    cta: "DEMO por DM/WhatsApp",
    credits: 0,
    costNote: "0 — nativo IG + captura",
    needsHiggsfield: false,
    tanda: null,
    produccion: "Capturas + texto nativo IG.",
    nota: "Ops: responder cada voto por DM con el guion del embudo (sección 4 del doc).",
    publishDateProposed: "2026-08-01",
  },
  {
    day: 6,
    titulo: "Adiós al cuaderno",
    formato: "reel 25-30s captura + voz",
    rawLabel: "reel captura+voz · P1+P2",
    pilar: "P1+P2",
    duracionTarget: "25-30 s",
    hook: "Tu clínica entera vive en un cuaderno. Hasta que el cuaderno falla.",
    cta: "DEMO al WhatsApp",
    credits: 4,
    costNote: "Casi 0 — captura + voz 2-4 cr",
    needsHiggsfield: true,
    tanda: null,
    produccion: "Captura (ficha paciente → tratamiento → cobro) + voz + subtítulos.",
    nota:
      "Nota dura: si un flujo no está desplegado, no se muestra ni se promete; el ángulo SIAT queda en la voz como preparación de datos, nunca emisión certificada.",
    publishDateProposed: "2026-08-04",
  },
  {
    day: 7,
    titulo: "Yo no existo: soy IA. Los recordatorios que te muestro, sí.", // 3-oct: nada de «agenda llena» (Sergio Urcullo)
    formato: "reel 20-30s Lucía en cámara",
    rawLabel: "reel Lucía en cámara · P4+P2 · Tanda B",
    pilar: "P4+P2",
    duracionTarget: "20-30 s",
    hook: "Todo en este video es IA. Menos una cosa.",
    cta: "DEMO al WhatsApp",
    credits: 35, // Tanda B escenario (a): 18-35 cr
    costNote: "Medio — TANDA B (~18-55 cr según escenario)",
    needsHiggsfield: true,
    tanda: "B",
    produccion: "2 imágenes Soul nuevas (encuadre distinto a Tanda A) + 2 clips b-roll 5s + voz + ffmpeg.",
    nota: "Recortable: si las piezas de captura convierten igual, la Tanda B se recorta con los datos de la semana 1.",
    publishDateProposed: "2026-08-05",
  },
  {
    day: 8,
    titulo: "Bs 750 = 2 ajustes de ortodoncia",
    formato: "carrusel 6 slides",
    rawLabel: "carrusel 6 slides · P3",
    pilar: "P3",
    duracionTarget: null,
    hook: "El plan Pro de DentalGest cuesta 2 ajustes de ortodoncia al mes.",
    cta: "DEMO al WhatsApp",
    credits: 0,
    costNote: "0 — Remotion",
    needsHiggsfield: false,
    tanda: null,
    produccion: "Remotion, reuso de assets de marca.",
    nota: null,
    publishDateProposed: "2026-08-06",
  },
  {
    day: 9,
    titulo: "Tu clínica a las 3 de la mañana",
    formato: "reel 25-30s captura + voz",
    rawLabel: "reel captura+voz · P2",
    pilar: "P2",
    duracionTarget: "25-30 s",
    hook: "Son las 3 de la mañana. Mirá lo que está haciendo tu clínica.",
    cta: "DEMO al WhatsApp",
    credits: 4,
    costNote: "Casi 0 — captura + voz 2-4 cr + reuso Soul",
    needsHiggsfield: true,
    tanda: null,
    produccion: "Captura + 1 imagen Soul (reuso) + voz, estética nocturna.",
    nota: "Mostrar la bandeja de aprobación es clave: refuerza \"vos tenés el control\".",
    publishDateProposed: "2026-08-07",
  },
  {
    day: 10,
    titulo: "Cierre de quincena + countdown",
    formato: "historias ×3 (countdown)",
    rawLabel: "historias ×3 countdown · P1",
    pilar: "P1",
    duracionTarget: null,
    hook: "Faltan ~60 días para la facturación en línea obligatoria.",
    cta: "DEMO al WhatsApp + caja de preguntas",
    credits: 0,
    costNote: "0 — nativo IG + collage",
    needsHiggsfield: false,
    tanda: null,
    produccion: "Contador + collage de 4 piezas de la quincena + sticker de preguntas y link (nativo IG).",
    nota: "Ops: cada pregunta recibida se responde por DM con el guion del embudo.",
    publishDateProposed: "2026-08-08",
  },
];

// ---- helpers de literal SQL (mismo patrón que publish-cut-review.mjs) -------
// Dollar-quoting con etiqueta que no aparece en el texto → inmune a comillas.
function pgDollar(str, base) {
  const s = String(str);
  let tag = `$${base}$`;
  let n = 0;
  while (s.includes(tag)) {
    n += 1;
    tag = `$${base}${n}$`;
  }
  return tag + s + tag;
}
function sqlText(v) {
  return v === null || v === undefined ? "NULL" : pgDollar(v, "t");
}
function sqlJson(obj) {
  return pgDollar(JSON.stringify(obj), "json") + "::jsonb";
}
function sqlNum(v) {
  return typeof v === "number" && Number.isFinite(v) ? String(v) : "NULL";
}
function pad2(n) {
  return String(n).padStart(2, "0");
}

// ---- construir una fila ----------------------------------------------------
function videoKey(day) {
  return `${KEY_PREFIX}${pad2(day)}`;
}

function projectRaw(p) {
  return {
    lane: LANE_FINE,
    lane_label: LANE_LABEL,
    raw_label: p.rawLabel,
    campaign: CAMPAIGN,
    day: p.day,
    pilar: p.pilar,
    formato: p.formato,
    duracion_target: p.duracionTarget,
    hook: p.hook,
    cta: p.cta,
    cost_note: p.costNote,
    credits_basis: CREDITS_BASIS,
    needs_higgsfield: p.needsHiggsfield,
    tanda: p.tanda,
    produccion: p.produccion,
    nota: p.nota,
    // Fecha SUGERIDA por el doc (sección 6, ítem 3): arranque lun 28-jul-2026.
    // Sigue pendiente de confirmación de Sergio → por eso "_proposed".
    publish_date_proposed: p.publishDateProposed,
    guion_ref: `${DOC}#dia-${p.day}`,
  };
}

function rowSql(p) {
  const key = videoKey(p.day);
  const title = `Día ${p.day} · ${p.titulo}`;
  const model = p.tanda ? "higgsfield" : "free";
  return `-- día ${p.day} · ${p.formato} · ${p.pilar} · ${p.credits} cr${p.tanda ? ` · Tanda ${p.tanda}` : ""}
insert into onia_center.video_projects
  (video_key, title, lane, status, format, duration_seconds, model, credits_est, raw)
values
  (${sqlText(key)}, ${sqlText(title)}, ${sqlText(LANE_DB)}, ${sqlText(STATUS)}, ${sqlText(FORMAT)}, 0, ${sqlText(model)}, ${sqlNum(p.credits)}, ${sqlJson(projectRaw(p))})
on conflict (video_key) do update set
  title = excluded.title,
  lane = excluded.lane,
  format = excluded.format,
  model = excluded.model,
  credits_est = excluded.credits_est,
  raw = excluded.raw;`;
}

// ---- SQL completo ----------------------------------------------------------
const totalCredits = PIECES.reduce((acc, p) => acc + p.credits, 0);
const paidPieces = PIECES.filter((p) => p.tanda).length;

const header = [
  "-- editor-videos · SEED de campaña — primeros video_projects del Estudio de Contenido.",
  `-- campaña=${CAMPAIGN}  piezas=${PIECES.length}  carril=H (${LANE_FINE})  fuente=${DOC}`,
  `-- TODAS en status '${STATUS}' (nada producido). Créditos estimados: ${totalCredits} cr`,
  `-- (${CREDITS_BASIS}). Piezas con generación paga por tanda: ${paidPieces} (días 3 y 7).`,
  "-- Idempotente por video_key: on conflict actualiza metadata, NO pisa status/duraciones/urls",
  "-- (una pieza que ya avanzó a cut_review no vuelve a intake si el seed se re-corre).",
  "-- DRY-RUN: revisar este SQL. Lo aplica el orquestador por SSH a supabase-db.",
  "-- GASTO CERO: cargar estas filas no genera un solo crédito; la generación espera el OK por tanda.",
].join("\n");

const sql = `${header}\n\nbegin;\n\n${PIECES.map(rowSql).join("\n\n")}\n\ncommit;\n`;

// ---- salida ----------------------------------------------------------------
const outFile = flag("out");
if (outFile) {
  writeFileSync(outFile, sql);
  console.error(`SQL escrito → ${outFile}`);
}
process.stdout.write(sql);

// ---- resumen legible (a stderr para no contaminar el SQL de stdout) --------
const cols = [
  ["día", 4],
  ["video_key", 11],
  ["formato", 32],
  ["pilar", 6],
  ["cr", 4],
  ["higgs", 6],
];
const line = (cells) => cells.map(([v, w]) => String(v).padEnd(w)).join(" ");
console.error(`\n=== ${CAMPAIGN} · ${PIECES.length} piezas · ${totalCredits} cr estimados ===`);
console.error(line(cols));
console.error("-".repeat(cols.reduce((a, [, w]) => a + w + 1, 0)));
for (const p of PIECES) {
  console.error(
    line([
      [p.day, 4],
      [videoKey(p.day), 11],
      [p.formato, 32],
      [p.pilar, 6],
      [p.credits, 4],
      [p.needsHiggsfield ? (p.tanda ? `sí(${p.tanda})` : "sí") : "no", 6],
    ]),
  );
}
console.error(
  `\nmodel='higgsfield' en ${paidPieces} piezas (días 3 y 7 · tandas A/B con gate de Sergio); ` +
    `'free' en las otras ${PIECES.length - paidPieces}.`,
);
console.error(
  "higgs='sí' sin tanda = consume cupo mínimo (voz seed_audio / imagen Soul), pero no es tanda paga.",
);
