// L05 · Lunes: cero llamadas para agendar — gen1 en UNA pasada (calcado de
// videos/tiktok-20260917/scripts/tiktok-build.mjs, rutas relativas a P).
//
//   clip Kling 720x1280@24 → scale ×2 (supersample) → zoompan (golpe +3 % 5 cuadros en el sello,
//   zoomExpr de zoom-punch.mjs) a 1080x1920@24 → overlays con fade (layout.json de prep-assets.py)
//   → pista de audio en silencio (para que sfx.mjs tenga dónde mezclar) → renders/gen1.mp4
//   libx264 CRF 14 slow, yuv420p, bt709, aac 48 kHz, +faststart.
//
// Uso (desde cualquier carpeta):
//   node videos/lucia-l05/scripts/build.mjs                 → renders/gen1.mp4
//   node videos/lucia-l05/scripts/build.mjs --stills 2,30   → renders/stills/f002.png … (MISMO grafo, sin encode)
//   node videos/lucia-l05/scripts/build.mjs --dry-run       → imprime el ffmpeg
import { readFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { zoomExpr, ANCHORS } from "../../../.claude/skills/editor-videos/scripts/zoom-punch.mjs";

const P = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const L = JSON.parse(readFileSync(`${P}/scripts/layout.json`, "utf8"));
const [W, H] = L.canvas;
const FPS = L.fps;
const N = L.frames;
const DUR = N / FPS;
const RAW = `${P}/raw/l05-coworking-kling-07b938b2.mp4`;
const argv = process.argv.slice(2);
const flag = (n) => { const i = argv.indexOf("--" + n); return i >= 0 ? argv[i + 1] : undefined; };
const STILLS = flag("stills");
const DRY = argv.includes("--dry-run");
const t = (f) => +(f / FPS).toFixed(6);
const HALF = 0.5 / FPS; // medio cuadro: las ventanas se cierran entre cuadros, nunca sobre uno

// ---- golpe de zoom: ventana de 5 cuadros, punch constante (zoomExpr de la skill) ----
const g = L.golpe;
const wins = [{ start: t(g.frame) - HALF, end: t(g.frame + g.frames - 1) + HALF, from: g.z, to: g.z, animated: false }];
const [ax, ay] = ANCHORS[g.anchor];

const inputs = ["-i", RAW];
const filtro = [
  `[0:v]scale=iw*2:ih*2:flags=lanczos,` +
    `zoompan=z='${zoomExpr(wins)}':d=1:x='(iw-iw/zoom)*${ax}':y='(ih-ih/zoom)*${ay}':s=${W}x${H}:fps=${FPS},` +
    `format=yuv444p[base0]`,
];
let base = "base0";
let idx = 1;
for (const o of L.overlays) {
  // El overlay arranca UN cuadro antes de su entrada con alpha 0: así el primer cuadro de la
  // ventana ya se ve (28 %) y la entrada cae en el cuadro que dice la instrucción.
  const s0 = Math.max(0, o.in - 1);
  const dur = t(o.out - s0);
  if (o.sequence) {
    inputs.push("-framerate", String(FPS), "-start_number", "0", "-i", `${P}/${o.file}`);
  } else {
    inputs.push("-framerate", String(FPS), "-loop", "1", "-t", String(dur + 0.2), "-i", `${P}/${o.file}`);
  }
  const ch = [`[${idx}:v]format=rgba`];
  if (o.sequence) ch.push(`tpad=stop_mode=clone:stop_duration=${dur}`);
  ch.push(`scale=out_color_matrix=bt709:out_range=tv`, `format=yuva444p`);
  if (o.fade_in > 0) ch.push(`fade=in:st=0:d=${o.fade_in}:alpha=1`);
  if (o.fade_out > 0) ch.push(`fade=out:st=${(dur - o.fade_out).toFixed(4)}:d=${o.fade_out}:alpha=1`);
  ch.push(`trim=duration=${dur}`, `setpts=PTS-STARTPTS+${t(s0)}/TB`);
  filtro.push(`${ch.join(",")}[ov${idx}]`);
  filtro.push(
    `[${base}][ov${idx}]overlay=${o.x}:${o.y}:format=yuv444:eof_action=pass:` +
      `enable='between(t,${(t(o.in) - HALF).toFixed(4)},${(t(o.out) - HALF).toFixed(4)})'[b${idx}]`,
  );
  base = `b${idx}`;
  idx++;
}
filtro.push(
  `[${base}]scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,` +
    `setparams=colorspace=bt709:color_primaries=bt709:color_trc=bt709:range=tv[vout]`,
);

let args;
if (STILLS) {
  const frames = STILLS.split(",").map(Number);
  mkdirSync(`${P}/renders/stills`, { recursive: true });
  filtro[filtro.length - 1] = filtro[filtro.length - 1].replace("[vout]", ",select='" + frames.map((f) => `eq(n\\,${f})`).join("+") + "'[vout]");
  args = ["-y", ...inputs, "-filter_complex", filtro.join(";"), "-map", "[vout]", "-fps_mode", "passthrough",
    "-frame_pts", "1", `${P}/renders/stills/f%03d.png`];
  // -frame_pts con setpts en base de tiempo 1/24 → el número del archivo es el cuadro
} else {
  inputs.push("-f", "lavfi", "-t", String(DUR), "-i", "anullsrc=r=48000:cl=stereo");
  args = ["-y", ...inputs, "-filter_complex", filtro.join(";"), "-map", "[vout]", "-map", `${idx}:a`,
    "-frames:v", String(N), "-t", String(DUR),
    "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-r", String(FPS),
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", `${P}/renders/gen1.mp4`];
}
if (DRY) {
  console.log("ffmpeg " + args.map((a) => (/[\s'";]/.test(a) ? `"${a}"` : a)).join(" "));
  process.exit(0);
}
mkdirSync(`${P}/renders`, { recursive: true });
const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", ...args], { stdio: ["ignore", "inherit", "inherit"] });
if (r.status !== 0) { console.error("ffmpeg falló:", r.status); process.exit(1); }
console.log("OK →", STILLS ? `${P}/renders/stills/` : `${P}/renders/gen1.mp4`);
