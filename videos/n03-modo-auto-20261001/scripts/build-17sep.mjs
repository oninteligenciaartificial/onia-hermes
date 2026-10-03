// Video modo auto (N03) con la receta del lote del 17-sep (videos/tiktok-20260917/README.md):
// corte + zoom punch por bloque + tarjetas dark / keywords / pantalla completa + karaoke apple,
// en UNA pasada desde el bruto. SFX y master van después y copian el video.
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { zoomExpr, autoWindowsFromKeep, ANCHORS } from "/home/user/onia-hermes/.claude/skills/editor-videos/scripts/zoom-punch.mjs";

const D = process.env.VIDEO_DIR || "/tmp/claude-0/-home-user-onia-hermes/981fdf0a-9c86-5cd3-a526-5f18111f4f5a/scratchpad/video-v1"; // bruto en raw/bruto.mp4 (Drive: Videos Onia Octubre)
const W = 1080, H = 1920, FPS = 30;
const keep = JSON.parse(readFileSync(`${D}/scripts/cutplan.json`, "utf8")).keep;
const words = JSON.parse(readFileSync(`${D}/scripts/segments-fixed.json`, "utf8")).words; // tiempos del BRUTO
const acc = []; let off = 0;
for (const k of keep) { acc.push([k.start, k.end, off]); off += k.end - k.start; }
const map = (t) => { for (const [a, b, o] of acc) { if (t >= a && t <= b) return o + (t - a); if (t < a) return o; } return off; };

// el storyboard se escribe en PALABRAS y toma el tiempo real de la narración (sync-plan)
const at = (re, from = 0) => { const i = words.findIndex((w, k) => k >= from && re.test(w.word)); if (i < 0) throw new Error("no está: " + re); return i; };
const iClaude = at(/^Claude$/), iModo = at(/^modo$/), iModo2 = at(/^modo$/, iModo + 1), iSegun = at(/^Según/);
const iBloq = at(/^bloquea/), iPero = at(/^Pero/), iPor = at(/^Por$/, iPero + 1), iRompe = at(/^rompe/);
const iComo = at(/^¿Cómo/, iRompe), iEn = at(/^En$/, at(/^preguntarte/)), iManual = at(/^manual$/), iComenta = at(/^comentá/i);
const t = (i) => words[i].start;
const OV = [ // [tarjeta, inicio, fin, tipo]  tipo: "top" | "kw" | "full"
  ["cc-wordmark", t(iClaude) - 0.1, t(iClaude) + 2.6, "top"],
  ["kw-modoauto", t(iModo) - 0.05, t(iModo) + 2.2, "kw"],
  ["revisa", t(iModo2) - 0.05, t(iSegun) - 0.05, "top"],
  ["bloquea", t(iBloq) - 0.05, t(iPero) - 0.05, "top"],
  ["deja", t(iPero), t(iPor) - 0.05, "top"],
  ["kw-rompe", t(iRompe) - 0.1, t(iRompe) + 2.3, "kw"],
  ["shifttab", t(iComo) - 0.05, t(iEn) - 0.1, "top"],
  ["fs-settings", t(iEn) - 0.05, t(iManual) - 0.05, "full"],
  ["kw-manual", t(iManual) - 0.05, t(iManual) + 2.0, "kw"],
  ["kw-comunidad", t(iComenta) - 0.1, words[words.length - 1].end + 0.4, "kw"],
];

const wins = autoWindowsFromKeep(keep, [1, 1.06, 1.03, 1.09], "top");
const [ax, ay] = ANCHORS.top;
const sel = keep.map((k) => `between(t,${k.start},${k.end})`).join("+");
const inputs = ["-i", `${D}/raw/bruto.mp4`];
const f = [
  `[0:v]select='${sel}',setpts=N/FRAME_RATE/TB,scale=iw*2:ih*2:flags=bicubic,` +
    `zoompan=z='${zoomExpr(wins)}':d=1:x='(iw-iw/zoom)*${ax}':y='(ih-ih/zoom)*${ay}':s=${W}x${H}:fps=${FPS}[base0]`,
];
let base = "base0"; const sfx = [];
OV.forEach(([card, sa, sb, tipo], i) => {
  const a = +map(sa).toFixed(2), b = +Math.min(map(sb), off).toFixed(2), dur = +(b - a).toFixed(3);
  if (dur < 0.8) { console.log("salteo", card, dur); return; }
  inputs.push("-loop", "1", "-t", String(dur + 0.1), "-i", `${D}/cards/card-${card}.png`);
  const esc = tipo === "full" ? `${W}:${H}` : tipo === "kw" ? `${Math.round(W * 0.86)}:-1` : `${Math.round(W * 0.82)}:-1`;
  const oy = tipo === "full" ? 0 : tipo === "kw" ? Math.round(H * 0.09) : Math.round(H * 0.06);
  f.push(`[${inputs.filter((x) => x === "-i").length - 1}:v]scale=${esc},format=rgba,` +
    `fade=in:st=0:d=0.22:alpha=1,fade=out:st=${(dur - 0.22).toFixed(3)}:d=0.22:alpha=1,setpts=PTS-STARTPTS+${a}/TB[ov${i}]`);
  f.push(`[${base}][ov${i}]overlay=(${W}-w)/2:${oy}:enable='between(t,${a},${b})'[b${i}]`);
  base = `b${i}`;
  // pop en cada apoyo; whoosh al entrar y salir de la pantalla completa
  sfx.push({ asset: tipo === "full" ? "whoosh" : "pop", at: Math.max(0.02, a), gain: tipo === "full" ? 0.55 : 0.5, duck: true });
  if (tipo === "full") sfx.push({ asset: "whoosh", at: b - 0.1, gain: 0.45, duck: true });
});
f.push(`[${base}]subtitles=${D}/scripts/karaoke.ass:fontsdir=${D}/scripts/_fonts[vout]`);
// audio: un tramo por bloque con micro-fundido, para que los cortes finos no hagan clic
keep.forEach((k, i) => f.push(`[0:a]atrim=start=${k.start}:end=${k.end},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st=${(k.end - k.start - 0.012).toFixed(3)}:d=0.012[a${i}]`));
f.push(`${keep.map((_, i) => `[a${i}]`).join("")}concat=n=${keep.length}:v=0:a=1[aud]`);

writeFileSync(`${D}/scripts/build-graph.txt`, f.join(";\n"));
const SFXDIR = "/home/user/onia-hermes/videos/claude-code-03/assets/sfx";
writeFileSync(`${D}/scripts/sfx-plan.json`, JSON.stringify({ sfx: sfx.map((s) => ({ ...s, asset: `${SFXDIR}/${s.asset}.wav` })) }, null, 1));
console.log(OV.map(([c, a, b]) => `${c} ${map(a).toFixed(1)}–${Math.min(map(b), off).toFixed(1)}`).join(" | "));
const OUT = `${D}/renders/comp-17sep.mp4`;
const r = spawnSync("ffmpeg", ["-y", "-v", "error", ...inputs, "-filter_complex_script", `${D}/scripts/build-graph.txt`,
  "-map", "[vout]", "-map", "[aud]", "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "224k", "-movflags", "+faststart", OUT], { stdio: ["ignore", "inherit", "inherit"] });
if (r.status !== 0) { console.error("ffmpeg falló", r.status); process.exit(1); }
console.log("OK →", OUT);
