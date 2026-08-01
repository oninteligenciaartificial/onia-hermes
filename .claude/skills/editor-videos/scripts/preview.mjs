// editor-videos — PREVIEW del corte (la mitad que faltaba de la REGLA DE ORO).
//
// La regla dice "tabla de cortes + preview 360p SIEMPRE se muestran a Sergio ANTES de
// aplicar el corte", pero NADA generaba ese preview: `publish-cut-review.mjs` solo acepta
// un --preview-url que alguien tenía que producir por su cuenta, y el panel (donde vive la
// cola de aprobación) puede estar caído — el 2026-07-30 lo estuvo. Esto lo hace local:
//
//   1. preview-360.mp4  — el corte YA aplicado, en 360p y rápido. Se mira y se escucha
//                          antes de gastar un render bueno.
//   2. costuras.jpg     — el cuadro ANTES y DESPUÉS de cada empalme, uno al lado del otro:
//                          es donde se ve si el corte se comió una sílaba o un parpadeo.
//
// Uso:
//   node preview.mjs --video raw.mp4 --cutplan scripts/cutplan.json [--out-dir renders]
//        [--height 360] [--no-sheet] [--dry-run]
//
// Determinista. Nunca toca el archivo original ni escribe en producción.
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";

const argv = process.argv.slice(2);
const has = (n) => argv.includes("--" + n);
const flag = (n, d) => {
  const i = argv.indexOf("--" + n);
  return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : d;
};
const fail = (m) => {
  console.error("preview: " + m);
  process.exit(1);
};
const run = (args, label) => {
  const r = spawnSync("ffmpeg", args, { encoding: "utf8" });
  if (r.error) fail(`no pude ejecutar ffmpeg: ${r.error.message}`);
  if (r.status !== 0) fail(`ffmpeg falló (${label}): ${String(r.stderr || "").split("\n").slice(-6).join("\n")}`);
};

const VIDEO = flag("video");
const CUTPLAN = flag("cutplan");
const OUT_DIR = flag("out-dir", "renders");
const HEIGHT = Math.max(180, Number(flag("height", "360")));
const DRY = has("dry-run");

if (!VIDEO) fail("falta --video <raw.mp4>");
if (!CUTPLAN) fail("falta --cutplan <cutplan.json>");
if (!existsSync(VIDEO)) fail(`no existe el video: ${VIDEO}`);
if (!existsSync(CUTPLAN)) fail(`no existe el cutplan: ${CUTPLAN}`);

let plan;
try {
  plan = JSON.parse(readFileSync(CUTPLAN, "utf8"));
} catch (err) {
  fail(`cutplan inválido: ${err.message}`);
}
const keep = Array.isArray(plan.keep) ? plan.keep : null;
if (!keep || !keep.length) fail("el cutplan no tiene keep[]");

const n2 = (v) => Math.round(Number(v) * 100) / 100;
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(2).padStart(5, "0")}`;

// ---- 1) preview 360p con el corte aplicado ---------------------------------
// El MISMO filtro que usará el render bueno (select/aselect + setpts), así lo que se
// aprueba es lo que sale. Lo único distinto es la escala y el preset.
const between = keep.map((k) => `between(t,${n2(k.start)},${n2(k.end)})`).join("+");
const vf = `select='${between}',setpts=N/FRAME_RATE/TB,scale=-2:${HEIGHT}`;
const af = `aselect='${between}',asetpts=N/SR/TB`;
const outPrev = join(OUT_DIR, "preview-360.mp4");
const prevArgs = ["-y", "-i", VIDEO, "-vf", vf, "-af", af, "-c:v", "libx264", "-preset", "veryfast", "-crf", "28", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", outPrev];

// ---- 2) tira de costuras ----------------------------------------------------
// Por cada empalme: el último cuadro que se conserva y el primero del bloque siguiente.
// Si el corte quedó pegado a una consonante o parte un gesto, se ve acá.
const seams = [];
for (let i = 0; i < keep.length - 1; i++) {
  seams.push({ i: i + 1, antes: Math.max(0, Number(keep[i].end) - 0.06), despues: Number(keep[i + 1].start) + 0.06, hueco: n2(keep[i + 1].start - keep[i].end) });
}

console.log(`\nPREVIEW DEL CORTE (mostrar a Sergio ANTES de aplicar)`);
console.log(`origen ${VIDEO}`);
console.log(`bloques que se conservan: ${keep.length}  ·  ${plan.origDur ?? "?"}s → ${plan.finalDur ?? "?"}s  ·  empalmes: ${seams.length}`);
console.log(`silencio medido en: ${plan.modo === "audio" ? "AUDIO" : "TRANSCRIPT (sin --video en cut-plan: se pierden las pausas dentro de un segmento)"}\n`);
console.log(`#  | conservo          | dura   | hueco tirado antes`);
console.log(`---+-------------------+--------+-------------------`);
keep.forEach((k, i) => {
  const hueco = i === 0 ? Number(k.start) : Number(k.start) - Number(keep[i - 1].end);
  console.log(`${String(i + 1).padStart(2)} | ${fmt(k.start)}–${fmt(k.end)} | ${(n2(k.end - k.start) + "s").padEnd(6)} | ${hueco > 0.01 ? n2(hueco) + "s" : "—"}`);
});
console.log("");

if (DRY) {
  console.log("ffmpeg (preview):\nffmpeg " + prevArgs.map((a) => (/[\s'"]/.test(a) ? `"${a}"` : a)).join(" ") + "\n");
  console.error("--dry-run: no se generó nada.");
  process.exit(0);
}

mkdirSync(resolve(OUT_DIR), { recursive: true });
run(prevArgs, "preview");
console.log(`preview 360p → ${outPrev}`);

if (!has("no-sheet") && seams.length) {
  const tmp = join(OUT_DIR, ".seams");
  mkdirSync(resolve(tmp), { recursive: true });
  const filas = [];
  seams.forEach((s) => {
    const a = join(tmp, `s${s.i}a.png`);
    const b = join(tmp, `s${s.i}b.png`);
    run(["-y", "-ss", String(n2(s.antes)), "-i", VIDEO, "-frames:v", "1", "-vf", `scale=-2:${HEIGHT}`, a], `costura ${s.i}a`);
    run(["-y", "-ss", String(n2(s.despues)), "-i", VIDEO, "-frames:v", "1", "-vf", `scale=-2:${HEIGHT}`, b], `costura ${s.i}b`);
    const fila = join(tmp, `fila${s.i}.png`);
    run(["-y", "-i", a, "-i", b, "-filter_complex", "[0:v][1:v]hstack=inputs=2", fila], `fila ${s.i}`);
    filas.push(fila);
  });
  const sheet = join(OUT_DIR, "costuras.jpg");
  if (filas.length === 1) {
    run(["-y", "-i", filas[0], "-q:v", "3", sheet], "sheet");
  } else {
    const ins = filas.flatMap((f) => ["-i", f]);
    const labels = filas.map((_, i) => `[${i}:v]`).join("");
    run(["-y", ...ins, "-filter_complex", `${labels}vstack=inputs=${filas.length}`, "-q:v", "3", sheet], "sheet");
  }
  rmSync(resolve(tmp), { recursive: true, force: true });
  console.log(`costuras → ${sheet}   (por fila: izquierda = último cuadro que queda, derecha = primero del bloque siguiente)`);
  seams.forEach((s) => console.log(`   empalme ${s.i}: corta ${s.hueco}s en ${fmt(Number(keep[s.i - 1].end))}`));
}

console.log(`\nRegla de oro: mostrale ESTO a Sergio y esperá el OK. Recién después:`);
console.log(`  node render-approved.mjs --video "${VIDEO}" --cutplan ${CUTPLAN} --video-key <slug> --apply`);
