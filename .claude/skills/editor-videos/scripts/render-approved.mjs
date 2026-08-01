// editor-videos — Fase 5: WORKER DE RENDER LOCAL — aplica el corte TRAS el OK de Sergio.
//
// Cierra la REGLA DE ORO: el corte real (ffmpeg) SOLO se ejecuta cuando Sergio APRUEBA
// la review en el panel (ONIA Center → Estudio de Contenido). Este worker toma el
// cutplan.json (salida de cut-plan.mjs), reconstruye el filtro ffmpeg EXACTO desde
// keep[] (select/aselect entre los rangos + setpts) y produce <out-dir>/cut.mp4.
//
// El render corre LOCAL (la máquina de Sergio / la sesión Claude Code), NUNCA en el VPS.
// La escritura a la DB de producción la aplica el ORQUESTADOR por SSH a supabase-db:
// este worker solo IMPRIME el SQL de UPDATE (nunca escribe a prod), igual que
// publish-cut-review.mjs.
//
// Uso:
//   node render-approved.mjs --video <raw.mp4> --cutplan <cutplan.json> --video-key <slug> \
//        [--out-dir renders] [--review-key <vc_slug>] [--apply]
//
// Por DEFECTO es DRY-RUN: imprime (a) el comando ffmpeg exacto y (b) el SQL de UPDATE.
//   --apply corre el ffmpeg LOCAL de verdad (OK, es local) y AUN ASÍ solo imprime el SQL.
//
// Determinista: sin Date.now / Math.random. Sin dependencias externas.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

// ---- args ------------------------------------------------------------------
const argv = process.argv.slice(2);
const has = (name) => argv.includes("--" + name);
const flag = (name, def) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : def;
};

const VIDEO = flag("video");
const CUTPLAN = flag("cutplan");
const VIDEO_KEY = flag("video-key");
const OUT_DIR_RAW = flag("out-dir", "renders");

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

if (!VIDEO) fail("falta --video <ruta cruda local .mp4>");
if (!CUTPLAN) fail("falta --cutplan <cutplan.json> (salida de cut-plan.mjs)");
if (!VIDEO_KEY) fail("falta --video-key <slug> (el video_key del proyecto)");

// El corte se aplica sobre el crudo REAL: si no existe, no hay nada que cortar.
if (!existsSync(VIDEO)) fail(`no existe el video crudo: ${VIDEO}`);

// ---- helpers de literal SQL (dollar-quoting seguro) ------------------------
// Misma técnica que publish-cut-review.mjs: elige una etiqueta $tag$ que no aparezca
// en el texto → inmune a comillas y a rutas raras. Determinista.
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

// ---- cargar cutplan --------------------------------------------------------
let plan;
try {
  plan = JSON.parse(readFileSync(CUTPLAN, "utf8"));
} catch (err) {
  fail(`no pude leer ${CUTPLAN}: ${err.message}`);
}
const keep = Array.isArray(plan.keep) ? plan.keep : [];
if (!keep.length) fail("el cutplan no tiene keep[] (¿corriste cut-plan.mjs?)");
for (const k of keep) {
  if (!Number.isFinite(Number(k.start)) || !Number.isFinite(Number(k.end))) {
    fail(`keep[] inválido: cada rango necesita {start,end} numéricos → ${JSON.stringify(k)}`);
  }
}

// ---- construir el corte ffmpeg desde keep[] (IGUAL que cut-plan.mjs) --------
// select/aselect conserva SOLO los rangos keep y los pega sin huecos (setpts).
const outDir = OUT_DIR_RAW.replace(/[\\/]+$/, "").replace(/\\/g, "/") || "renders";
const outMp4 = `${outDir}/cut.mp4`;
const between = keep.map((k) => `between(t,${k.start},${k.end})`).join("+");
const vf = `select='${between}',setpts=N/FRAME_RATE/TB`;
const af = `aselect='${between}',asetpts=N/SR/TB`;
// Forma shell (para mostrar). El exec real usa argv (spawnSync) → sin problemas de quoting.
const ffmpegCmd = `ffmpeg -y -i "${VIDEO}" -vf "${vf}" -af "${af}" "${outMp4}"`;
const ffmpegArgs = ["-y", "-i", VIDEO, "-vf", vf, "-af", af, outMp4];

// ---- SQL de UPDATE (lo aplica el orquestador por SSH; el worker NUNCA escribe) --
const reviewKey = flag("review-key") || `vc_${VIDEO_KEY}`;
const sqlHeader = [
  "-- editor-videos · Fase 5 — render aplicado LOCAL; marcar la pieza como lista.",
  `-- video_key=${VIDEO_KEY}  review_key=${reviewKey}  out=${outMp4}`,
  "-- DRY-RUN: revisar este SQL. Lo aplica el orquestador por SSH a supabase-db.",
  "-- El worker corre ffmpeg LOCAL; NUNCA escribe a producción.",
].join("\n");
const sql = `${sqlHeader}

begin;

update onia_center.video_projects
   set status = 'ready',
       render_url = ${sqlText(outMp4)}
 where video_key = ${sqlText(VIDEO_KEY)};

update onia_center.review_queue
   set status = 'approved'
 where review_key = ${sqlText(reviewKey)}
   and source_type = 'video_cut'
   and status <> 'approved';

commit;
`;

// ---- salida ----------------------------------------------------------------
const APPLY = has("apply");

console.log(`\nffmpeg (corte de ${keep.length} bloque(s) keep → ${outMp4}):`);
console.log(ffmpegCmd + "\n");

if (APPLY) {
  // Render LOCAL de verdad (permitido: es local, no el VPS). Aun así, la DB NO se toca.
  mkdirSync(outDir, { recursive: true });
  console.error(`--apply: corriendo ffmpeg LOCAL → ${outMp4} …`);
  const res = spawnSync("ffmpeg", ffmpegArgs, { stdio: "inherit" });
  if (res.error) fail(`no pude ejecutar ffmpeg: ${res.error.message} (¿está instalado?)`);
  if (typeof res.status === "number" && res.status !== 0) {
    fail(`ffmpeg salió con código ${res.status}`);
  }
  console.error(`ffmpeg OK → ${outMp4}`);
}

process.stdout.write(sql);

if (!APPLY) {
  console.error(
    "\nDRY-RUN: no se corrió ffmpeg ni se tocó la DB. Con --apply se renderiza LOCAL; " +
      "el SQL de arriba lo aplica el orquestador por SSH a supabase-db.",
  );
} else {
  console.error(
    "\n--apply: render LOCAL hecho. Aplicá el SQL de arriba por SSH a supabase-db (lo hace el orquestador).",
  );
}
