// editor-videos — MASTER de audio: deja la pieza al volumen del feed.
//
// Medido 2026-07-30 sobre material real: el crudo salía a -20.0 LUFS y -4.0 dBTP. TikTok,
// Reels y YouTube normalizan alrededor de -14 LUFS: subir el volumen del celular no arregla
// nada, el video simplemente suena MÁS BAJO que el de al lado y se scrollea. No había ningún
// paso de loudness en el pipeline.
//
// Hace loudnorm de DOS PASADAS (la de una pasada es un compresor a ciegas: mide y corrige
// sobre la marcha, y en un talking-head con pausas bombea). La primera pasada mide, la
// segunda aplica con esos números exactos.
//
// Uso:
//   node master.mjs --video renders/final.mp4 --out final/video.mp4 [--lufs -14] [--tp -1.5]
//        [--fade-out 0.4] [--dry-run]
//
// El VIDEO se copia tal cual (-c:v copy): no se re-encodea la imagen para tocar el audio.
import { existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";

const argv = process.argv.slice(2);
const has = (n) => argv.includes("--" + n);
const flag = (n, d) => {
  const i = argv.indexOf("--" + n);
  return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : d;
};
const fail = (m) => {
  console.error("master: " + m);
  process.exit(1);
};

const VIDEO = flag("video");
const OUT = flag("out");
const LUFS = Number(flag("lufs", "-14"));
const TP = Number(flag("tp", "-1.5"));
const LRA = Number(flag("lra", "11"));
const FADE = Number(flag("fade-out", "0"));
const DRY = has("dry-run");

if (!VIDEO) fail("falta --video <in.mp4>");
if (!OUT) fail("falta --out <final.mp4>");
if (!existsSync(VIDEO)) fail(`no existe: ${VIDEO}`);
if (!(LUFS >= -30 && LUFS <= -5)) fail("--lufs fuera de rango (-30 a -5; el feed vive en -14)");

const ff = (args) => spawnSync("ffmpeg", args, { encoding: "utf8" });

// ---- pasada 1: medir --------------------------------------------------------
const medir = ff(["-hide_banner", "-nostats", "-i", VIDEO, "-af", `loudnorm=I=${LUFS}:TP=${TP}:LRA=${LRA}:print_format=json`, "-f", "null", "-"]);
if (medir.error) fail(`no pude ejecutar ffmpeg: ${medir.error.message}`);
// ffmpeg imprime el bloque JSON y DESPUÉS sigue logueando. Cortar desde el último "{"
// agarra basura del log y el parse revienta: hay que recortar el objeto en sí.
function loudnormJson(salida) {
  const hit = String(salida).match(/\{[\s\S]*?"target_offset"[\s\S]*?\}/);
  if (!hit) return null;
  try {
    return JSON.parse(hit[0]);
  } catch {
    return null;
  }
}
const txt = String(medir.stderr || "");
const m = loudnormJson(txt);
if (!m) fail(`la medición no devolvió JSON (¿el archivo tiene audio?)\n${txt.split("\n").slice(-5).join("\n")}`);

const antes = { I: Number(m.input_i), TP: Number(m.input_tp), LRA: Number(m.input_lra), thresh: Number(m.input_thresh) };
const delta = Math.round((LUFS - antes.I) * 10) / 10;

console.log(`\nMASTER DE AUDIO`);
console.log(`origen ${VIDEO}`);
console.log(`  medido:  ${antes.I} LUFS · pico real ${antes.TP} dBTP · rango ${antes.LRA} LU`);
console.log(`  destino: ${LUFS} LUFS · pico ${TP} dBTP   →  ${delta >= 0 ? "+" : ""}${delta} dB\n`);
if (Math.abs(delta) < 0.5) console.log("  (ya estaba en destino: el master casi no lo toca)\n");
if (antes.TP > -0.5) console.log("  AVISO: el crudo viene clippeando (pico ≥ -0.5 dBTP). Se limita, pero la distorsión ya grabada no se saca.\n");

// ---- pasada 2: aplicar con los números medidos -------------------------------
const af =
  `loudnorm=I=${LUFS}:TP=${TP}:LRA=${LRA}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true:print_format=summary` +
  (FADE > 0 ? `,afade=t=out:st=DUR:d=${FADE}` : "");

let filtro = af;
if (FADE > 0) {
  const p = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", VIDEO], { encoding: "utf8" });
  const dur = Number(String(p.stdout).trim());
  if (!Number.isFinite(dur) || dur <= FADE) fail(`--fade-out ${FADE}s no entra en el clip`);
  filtro = af.replace("st=DUR", `st=${Math.round((dur - FADE) * 100) / 100}`);
}

const args = ["-y", "-i", VIDEO, "-af", filtro, "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", OUT];
console.log("ffmpeg:\nffmpeg " + args.map((a) => (/[\s'"]/.test(a) ? `"${a}"` : a)).join(" ") + "\n");

if (DRY) {
  console.error("--dry-run: no se escribió nada.");
  process.exit(0);
}

mkdirSync(dirname(resolve(OUT)), { recursive: true });
const r = ff(args);
if (r.error) fail(`no pude ejecutar ffmpeg: ${r.error.message}`);
if (r.status !== 0) fail(`ffmpeg falló: ${String(r.stderr || "").split("\n").slice(-8).join("\n")}`);

// ---- verificar de verdad (no se anuncia sin medir) ---------------------------
const check = ff(["-hide_banner", "-nostats", "-i", OUT, "-af", "loudnorm=print_format=json", "-f", "null", "-"]);
const after = loudnormJson(String(check.stderr || ""));
if (after) {
  {
    console.log(`master: ${OUT}`);
    console.log(`  quedó en ${after.input_i} LUFS · pico ${after.input_tp} dBTP (destino ${LUFS} / ${TP})`);
    const off = Math.abs(Number(after.input_i) - LUFS);
    if (off > 1.0) console.log(`  AVISO: quedó a ${off.toFixed(1)} dB del destino — pasa con material muy comprimido o con mucho silencio.`);
  }
} else {
  console.log(`master: ${OUT} (no pude re-medir, revisá a oído)`);
}
