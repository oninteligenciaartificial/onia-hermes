// editor-videos — Fase 4: PUBLICAR el corte propuesto como una review PENDIENTE
// en la cola de aprobación del panel (ONIA Center → Estudio de Contenido).
//
// Materializa la REGLA DE ORO: el pipeline NO corta a ciegas. Toma el cutplan.json
// (salida de cut-plan.mjs) y genera el SQL de UPSERT para:
//   • onia_center.video_projects  → status 'cut_review'  (la pieza queda esperando el OK)
//   • onia_center.review_queue    → source_type 'video_cut', status 'pending',
//                                    reviewer_role_key 'sergio', sensitive=true
// El panel (components/views/estudio/source.ts → getCutQueue/mapCut) lee justo
// review_queue.raw con la forma { kind, aspect, lane, orig_seconds, final_seconds,
// preview_url, detected, keep_blocks, trim_seconds, segments:[...] }. Se respeta al pie.
//
// El corte real (ffmpeg) SOLO se aplica cuando Sergio APRUEBA la review en el panel
// (Fase 5). Esta pieza nunca corta ni escribe a producción.
//
// Uso:
//   node publish-cut-review.mjs --cutplan <cutplan.json> \
//        [--video-key <slug>] [--title <"..."> ] [--lane sergio] \
//        [--format vertical] [--aspect 9:16] [--preview-url <url>] \
//        [--duration <seg crudo>] [--priority alta] [--out <file.sql>] [--apply]
//
// Por DEFECTO es DRY-RUN: imprime el SQL a stdout (no toca la DB).
//   --out  también escribe el SQL a un archivo.
//   --apply NO se implementa acá: lo aplica el orquestador por SSH a supabase-db
//           (ver TODO abajo). Nunca escribir a producción desde esta skill.
//
// Determinista: sin Date.now / Math.random. Sin dependencias externas.
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

// ---- args ------------------------------------------------------------------
const argv = process.argv.slice(2);
const has = (name) => argv.includes("--" + name);
const flag = (name, def) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : def;
};

const CUTPLAN = flag("cutplan");
if (!CUTPLAN) {
  console.error("falta --cutplan <cutplan.json> (salida de cut-plan.mjs)");
  process.exit(1);
}

// ---- helpers de literal SQL (dollar-quoting seguro) ------------------------
// Elige una etiqueta $tag$ que no aparezca en el texto → inmune a comillas y a
// que el propio transcript contenga "$json$". Determinista.
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
function round2(n) {
  return Math.round(n * 100) / 100;
}
function slug(s) {
  return String(s)
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "video";
}

// ---- cargar cutplan --------------------------------------------------------
let plan;
try {
  plan = JSON.parse(readFileSync(CUTPLAN, "utf8"));
} catch (err) {
  console.error(`no pude leer ${CUTPLAN}: ${err.message}`);
  process.exit(1);
}
const rows = Array.isArray(plan.rows) ? plan.rows : [];
if (!rows.length) {
  console.error("el cutplan no tiene rows[] (¿corriste cut-plan.mjs?)");
  process.exit(1);
}
const keep = Array.isArray(plan.keep) ? plan.keep : rows.filter((r) => r.keep);

// ---- resolver parámetros ---------------------------------------------------
const sourceBase = plan.video ? basename(plan.video) : undefined;
const videoKey = flag("video-key") || (flag("title") ? slug(flag("title")) : slug(sourceBase || "video"));
const title = flag("title") || videoKey;
const fineLane = flag("lane", "sergio"); // lane fino (sergio/cliente/onia-yt/onia-ig/onia)
const format = flag("format", "vertical");
const aspect = flag("aspect", "9:16");
const priority = flag("priority", "alta");
const previewUrl = flag("preview-url") || null;

const VALID_FORMAT = new Set(["vertical", "horizontal", "square"]);
if (!VALID_FORMAT.has(format)) {
  console.error(`--format inválido "${format}" (vertical|horizontal|square)`);
  process.exit(1);
}
const VALID_PRIORITY = new Set(["alta", "media", "baja"]);
if (!VALID_PRIORITY.has(priority)) {
  console.error(`--priority inválido "${priority}" (alta|media|baja)`);
  process.exit(1);
}

// lane base para la columna video_projects.lane (CHECK: client|onia|sergio).
// El lane fino va en raw.lane, que el panel prioriza (laneInfo).
function baseLane(fine) {
  if (fine === "sergio") return "sergio";
  if (fine === "client" || fine === "cliente") return "client";
  return "onia"; // onia, onia-yt, onia-ig, ...
}
const dbLane = baseLane(fineLane);
const laneLabel = { sergio: "Sergio", cliente: "Cliente", client: "Cliente", onia: "ONIA", "onia-yt": "ONIA · YouTube", "onia-ig": "ONIA · Instagram" }[fineLane] || "ONIA";

// ---- métricas del corte ----------------------------------------------------
const origDur = typeof plan.origDur === "number" ? plan.origDur : undefined;
const finalDur = typeof plan.finalDur === "number" ? plan.finalDur : undefined;
const rawDuration = flag("duration") !== undefined ? Number(flag("duration")) : origDur;
const detected = rows.length;
const keepBlocks = keep.length;
const trimSeconds =
  origDur !== undefined && finalDur !== undefined ? Math.round(origDur - finalDur) : undefined;

// segments: cutplan.rows → contrato del panel (source.ts RawCutSegment)
const segments = rows.map((r, i) => {
  const from = round2(Number(r.start));
  const to = round2(Number(r.end));
  return {
    index: (typeof r.i === "number" ? r.i : i) + 1,
    from,
    to,
    decision: r.keep ? "keep" : "cut",
    reason: typeof r.reason === "string" ? r.reason : "",
    text: typeof r.text === "string" ? r.text : "",
    weight: Math.max(1, Math.round(to - from)),
  };
});

// review_queue.raw — forma EXACTA que lee el panel (getCutQueue/mapCut).
const reviewRaw = {
  kind: "video_cut",
  aspect,
  lane: fineLane,
  lane_label: laneLabel,
  orig_seconds: origDur ?? null,
  final_seconds: finalDur ?? null,
  preview_url: previewUrl,
  detected,
  keep_blocks: keepBlocks,
  trim_seconds: trimSeconds ?? null,
  segments,
};

// video_projects.raw — el panel lee raw.lane / raw.lane_label / raw.raw_label.
const projectRaw = {
  lane: fineLane,
  lane_label: laneLabel,
  raw_label: sourceBase || format,
};

const reviewKey = `vc_${videoKey}`;

// ---- construir SQL ---------------------------------------------------------
const header = [
  "-- editor-videos · Fase 4 — publicar corte propuesto como review PENDIENTE (REGLA DE ORO).",
  `-- video_key=${videoKey}  review_key=${reviewKey}  lane=${fineLane}  ${aspect}`,
  `-- orig ${origDur ?? "?"}s → final ${finalDur ?? "?"}s  (−${trimSeconds ?? "?"}s · ${detected} segmentos · ${keepBlocks} keep)`,
  "-- DRY-RUN: revisar este SQL. Lo aplica el orquestador por SSH a supabase-db.",
  "-- El corte real (ffmpeg) solo se aplica cuando Sergio APRUEBA en el panel (Fase 5).",
].join("\n");

const projectSql = `insert into onia_center.video_projects
  (video_key, title, lane, status, format, duration_seconds, final_seconds, model, credits_est, source_url, preview_url, cut_plan_ref, raw)
values
  (${sqlText(videoKey)}, ${sqlText(title)}, ${sqlText(dbLane)}, 'cut_review', ${sqlText(format)}, ${sqlNum(rawDuration)}, ${sqlNum(finalDur)}, 'free', 0, NULL, ${sqlText(previewUrl)}, ${sqlText(CUTPLAN)}, ${sqlJson(projectRaw)})
on conflict (video_key) do update set
  title = excluded.title,
  lane = excluded.lane,
  status = 'cut_review',
  format = excluded.format,
  duration_seconds = excluded.duration_seconds,
  final_seconds = excluded.final_seconds,
  preview_url = excluded.preview_url,
  cut_plan_ref = excluded.cut_plan_ref,
  raw = excluded.raw;`;

const reviewSql = `insert into onia_center.review_queue
  (review_key, source_type, source_key, title, priority, status, reviewer_role_key, sensitive, raw)
values
  (${sqlText(reviewKey)}, 'video_cut', ${sqlText(videoKey)}, ${sqlText(title)}, ${sqlText(priority)}, 'pending', 'sergio', true, ${sqlJson(reviewRaw)})
on conflict (review_key) do update set
  source_key = excluded.source_key,
  title = excluded.title,
  priority = excluded.priority,
  status = 'pending',
  reviewer_role_key = 'sergio',
  sensitive = true,
  raw = excluded.raw;`;

const sql = `${header}\n\nbegin;\n\n${projectSql}\n\n${reviewSql}\n\ncommit;\n`;

// ---- salida (DRY-RUN por defecto) ------------------------------------------
const outFile = flag("out");
if (outFile) {
  writeFileSync(outFile, sql);
  console.error(`SQL escrito → ${outFile}`);
}
process.stdout.write(sql);

if (has("apply")) {
  // TODO(orquestador): --apply NO se ejecuta acá. Esta skill nunca escribe a
  // producción. El orquestador (sesión de control) aplica este SQL por SSH a
  // supabase-db (docker exec … psql / MCP Supabase execute_sql) tras revisarlo.
  console.error(
    "\n--apply: no-op en la skill. Aplicá el SQL de arriba por SSH a supabase-db (lo hace el orquestador).",
  );
}
