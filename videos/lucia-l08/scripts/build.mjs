// L08 · ¿Cuántos pacientes se olvidan de su cita? — gen1 en UNA pasada (INSTRUCCION § ORDEN paso 2).
// Calcado de videos/tiktok-20260917/scripts/tiktok-build.mjs, con rutas RELATIVAS a la pieza:
//   trim 0,40 (+ tpad opcional, hoy 0) + scale ×2 + zoompan (golpe + ken, zoomExpr de zoom-punch.mjs)
//   a 1080×1920 24 fps + velo + overlays (tag IA, panel en 4 capas, sello) + voz (2 tomas, adelay, amix normalize=0)
//   → renders/gen1.mp4 (libx264 CRF 14 slow, yuv420p, bt709). El karaoke va en gen2 (scripts/karaoke.mjs).
// Los tiempos de los apoyos NO se escriben a mano: salen de scripts/sync-plan.json (sync-plan.mjs --lead -0.15
// sobre scripts/storyboard.json). Uso:  node scripts/build.mjs [--draft]   (desde cualquier carpeta)
import { readFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { zoomExpr, normalizeWindows, ANCHORS } from "../../../.claude/skills/editor-videos/scripts/zoom-punch.mjs";

const P = join(dirname(fileURLToPath(import.meta.url)), "..");
const p = (rel) => join(P, rel);
const DRAFT = process.argv.includes("--draft");
// --clean (QA): solo b-roll + zoom + velo, sin apoyos ni voz → renders/qa/clean.mp4 (CRF 10). Es la referencia para medir
// la opacidad de cada apoyo cuadro a cuadro (final − clean) sin depender del fondo que se mueve.
const CLEAN = process.argv.includes("--clean");
const W = 1080, H = 1920, FPS = 24;

// ---- línea de tiempo ------------------------------------------------------------------------------------
const RAW = p("raw/l08-cafe-kling-f79eb10e.mp4");
const TRIM = 0.40;                     // mismo gesto con el celular al arranque (arranque en caliente)
// tpad: 0 cuadros (corrección del 2-oct). Con 15 cuadros clonados el final se congelaba en medio de un movimiento
// rápido (la cara avanza ~9,5 px y se corre ~16 px por cuadro hasta f230 y en f231 se frena de golpe): se veía como un
// cuadro trabado justo en el remate, y la receta §7 dice que a la persona no se la congela. Termina en f230 = 9,625 s,
// ~0,36 s de aire después de lo audible de «dedo.». Volver a clonar solo con el OK de Sergio Urcullo sobre el preview.
const TPAD_FRAMES = 0;
const rawFrames = Number(spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-count_frames", "-show_entries",
  "stream=nb_read_frames", "-of", "csv=p=0", RAW], { encoding: "utf8" }).stdout.trim());
const keptFrames = rawFrames - Math.ceil(TRIM * FPS - 1e-9);   // trim=start=0.40 se queda con t >= 0.40 → cuadro 10
const NFRAMES = keptFrames + TPAD_FRAMES;
const DUR = NFRAMES / FPS;
const fr = (t) => Math.ceil(t * FPS - 1e-6);                   // primer cuadro con pts >= t

// ---- apoyos: tiempos de sync-plan.json ------------------------------------------------------------------
const plan = JSON.parse(readFileSync(p("scripts/sync-plan.json"), "utf8")).overlays;
const at = (asset) => {
  const o = plan.find((x) => x.asset === asset);
  if (!o) throw new Error(`sync-plan.json no tiene ${asset}`);
  return o;
};
const FIN_IN = 0.15, FIN_OUT = 0.22;   // entrada / salida de los apoyos (receta §9)

// ---- zoom: golpe +3 % durante 5 cuadros en el cuadro del sello, que vuelve; después ken 1,00 → 1,04 (anchor top)
const SELLO = at("assets/sello-dedo.png");
// Ventanas en medios cuadros: zoomExpr redondea a 3 decimales y between(it,8.167,…) dejaba AFUERA el cuadro 196
// (pts 8,16667). Con ±0,5 cuadro el golpe cubre exactamente los cuadros f0…f0+4.
const fs0 = fr(SELLO.start);
const zooms = normalizeWindows([
  { start: (fs0 - 0.5) / FPS, end: (fs0 + 4.5) / FPS, z: 1.03, anchor: "top" },
  { start: (fs0 + 4.5) / FPS, end: DUR, from: 1.0, to: 1.04, anchor: "top" },
]);
const [ax, ay] = ANCHORS.top;

// ---- entradas ------------------------------------------------------------------------------------------
const inputs = ["-i", RAW, "-i", p("audio/voz-cuerpo.mp3"), "-i", p("audio/voz-remate.mp3")];
let idx = 3;
const img = (file, dur) => { inputs.push("-loop", "1", "-framerate", String(FPS), "-t", (dur + 0.2).toFixed(3), "-i", p(file)); return idx++; };

const f = [];
f.push(
  `[0:v]trim=start=${TRIM},setpts=PTS-STARTPTS,${TPAD_FRAMES > 0 ? `tpad=stop_mode=clone:stop=${TPAD_FRAMES},` : ""}` +
  `scale=iw*2:ih*2:flags=bicubic,` +
  `zoompan=z='${zoomExpr(zooms)}':d=1:x='(iw-iw/zoom)*${ax}':y='(ih-ih/zoom)*${ay}':s=${W}x${H}:fps=${FPS},` +
  `setsar=1,format=yuv444p[v0]`,
);
// PNG (sRGB, alfa) → yuva444p con matriz bt709 EXPLÍCITA: si la conversión la hace el escalador automático usa
// bt601 y el verde #10C26B sale corrido contra lo que etiquetamos.
const toYuv = `scale=out_color_matrix=bt709:out_range=tv,format=yuva444p`;
let base = "v0", k = 0;
const over = (label, x, y, enable) => {
  const out = `v${++k}`;
  f.push(`[${base}][${label}]overlay=x='${x}':y='${y}':format=yuv444:eof_action=pass${enable ? `:enable='${enable}'` : ""}[${out}]`);
  base = out;
};

// velo: todo el video, debajo de todo el texto
const iVelo = img("assets/velo.png", DUR);
f.push(`[${iVelo}:v]format=rgba,${toYuv}[velo]`);
over("velo", 0, 0, null);

// apoyo con fundido: escala (desde el PNG @2x), fade de alfa, offset de tiempo
const apoyo = (o, { s, x, y, rise = 0, fadeIn = FIN_IN, fadeOut = FIN_OUT, name }) => {
  const dur = +(o.end - o.start).toFixed(3);
  const i = img(o.asset, dur);
  const fades = [fadeIn > 0 ? `fade=t=in:st=0:d=${fadeIn}:alpha=1` : null, `fade=t=out:st=${(dur - fadeOut).toFixed(3)}:d=${fadeOut}:alpha=1`].filter(Boolean).join(",");
  f.push(`[${i}:v]scale=iw*${s}:ih*${s}:flags=lanczos,format=rgba,${fades},setpts=PTS-STARTPTS+${o.start}/TB,${toYuv}[${name}]`);
  // subida corta con ease-out (los últimos cuadros llegan quietos): y + rise·(1−e)²
  const yy = rise ? `${y}+${rise}*pow(1-clip((t-${o.start})/${fadeIn},0,1),2)` : `${y}`;
  over(name, x, yy, `between(t,${o.start},${o.end})`);
};

if (!CLEAN) {
// tag IA — pastilla de 520 px de ancho, borde superior visible en y=1186 (PNG @2x: pastilla x 88–1353, y 56–227)
const sTag = +(520 / (1353 - 88)).toFixed(4);
apoyo(at("assets/tag-ia.png"), { s: sTag, x: `(${W}-w)/2`, y: Math.round(1186 - 56 * sTag), fadeIn: 0, name: "tag" });

// panel-diagrama — tarjeta de 900 px (PNG @2x: tarjeta x 160–2159, y 80–721 → ×0,45 = 900 × 288).
// Borde superior en y=1192 (la INSTRUCCION decía 1180): en el QA del 1-oct YuNet dio la caja de la cara hasta 1151 en
// los cuadros 135-136 (mentón+40 = 1191 > 1180). SCRFD daba 1102; igual se baja 12 px para que pasen los DOS
// detectores. Abajo queda en 1480 (< 1490) y la subida de entrada es de 10 px para no pasar 1490 ni al entrar.
const sPan = 0.45;
// 2-oct: 1194 (2 px más abajo). Re-render con TPAD 0: YuNet dio la caja (con cuello) en 1152,7 en el cuadro 133 →
// mentón+40 = 1192,7, 0,7 px ENCIMA del borde de la tarjeta. Abajo queda en 1482 y la subida de entrada baja a 8 px
// para que ni el primer cuadro (alfa ~3 %) pase de 1490.
const PANEL_TOP = 1194;
const yPan = Math.round(PANEL_TOP - 80 * sPan);
apoyo(at("assets/panel-base.png"), { s: sPan, x: `(${W}-w)/2`, y: yPan, rise: 8, name: "panel" });
for (const r of ["r1", "r2", "r3"]) apoyo(at(`assets/panel-${r}.png`), { s: sPan, x: `(${W}-w)/2`, y: yPan, rise: 8, name: `fila${r}` });

// sello «NO MOVÉS UN DEDO.» — texto de 900 px (PNG @2x: texto+raya x 87–2036), rotado −4° en el HTML,
// borde del PNG en y=1176. Entra de 130 % a 100 % en 3 cuadros (un overlay por cuadro, centrado), sin fundido.
const sSel = +(900 / (2036 - 87)).toFixed(4);
const selW = Math.round(2116 * sSel), selH = Math.round(538 * sSel);
const selCy = 1176 + selH / 2;
const iSel = img(SELLO.asset, SELLO.end - SELLO.start);
const pasos = [1.3, 1.2, 1.1, 1.0];
f.push(`[${iSel}:v]scale=${selW}:${selH}:flags=lanczos,format=rgba,setpts=PTS-STARTPTS+${SELLO.start}/TB,split=${pasos.length}${pasos.map((_, j) => `[sl${j}]`).join("")}`);
const f0 = fr(SELLO.start);
pasos.forEach((z, j) => {
  f.push(`[sl${j}]scale=${Math.round(selW * z)}:${Math.round(selH * z)}:flags=lanczos,${toYuv}[sello${j}]`);
  const a = (f0 + j - 0.5) / FPS, b = j < pasos.length - 1 ? (f0 + j + 0.5) / FPS : DUR + 1;
  over(`sello${j}`, `(${W}-w)/2`, `${selCy.toFixed(1)}-h/2`, `between(t,${a.toFixed(4)},${b.toFixed(4)})`);
});
console.log(`escalas: tag ${sTag} · panel ${sPan} (y PNG ${yPan}) · sello ${sSel} (${selW}×${selH}, centro y ${selCy.toFixed(1)}, cuadro ${f0})`);
}
f.push(`[${base}]format=yuv420p[vout]`);

// ---- voz: dos tomas de Marcela. El remate viene 3,3 LU más fuerte que el cuerpo (−20,3 vs −23,6 LUFS, medido con
// ebur128): se iguala para que no se oiga el empalme entre tomas. El master lleva todo a −14 después.
const REMATE_DB = -3.3;
f.push(`[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,adelay=100:all=1[va]`);
f.push(`[2:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=${REMATE_DB}dB,adelay=8300:all=1[vb]`);
f.push(`[va][vb]amix=inputs=2:normalize=0:duration=longest:dropout_transition=0,apad,atrim=0:${DUR.toFixed(4)}[aout]`);

const OUT = p(CLEAN ? "renders/qa/clean.mp4" : DRAFT ? "renders/gen1-draft.mp4" : "renders/gen1.mp4");
mkdirSync(dirname(OUT), { recursive: true });
const enc = CLEAN ? ["-crf", "10", "-preset", "fast"] : DRAFT ? ["-crf", "23", "-preset", "ultrafast"] : ["-crf", "14", "-preset", "slow"];
const args = ["-y", "-hide_banner", ...inputs, "-filter_complex", f.join(";\n"), "-map", "[vout]", "-map", "[aout]",
  "-frames:v", String(NFRAMES), "-r", String(FPS),
  "-c:v", "libx264", ...enc, "-pix_fmt", "yuv420p",
  "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
  "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", OUT];

console.log(`L08 gen1${DRAFT ? " (BORRADOR)" : ""}: crudo ${rawFrames} cuadros → recorte ${keptFrames} + tpad ${TPAD_FRAMES} = ${NFRAMES} cuadros = ${DUR.toFixed(3)} s`);
console.log("zoom:", JSON.stringify(zooms.map((w) => ({ start: +w.start.toFixed(3), end: +w.end.toFixed(3), from: w.from, to: w.to }))));
console.log("apoyos:", plan.map((o) => `${o.asset.split("/").pop()} ${o.start}→${o.end}`).join(" · "));
const r = spawnSync("ffmpeg", args, { stdio: ["ignore", "inherit", "inherit"] });
if (r.status !== 0) { console.error("ffmpeg falló:", r.status); process.exit(1); }
console.log("OK →", OUT);
