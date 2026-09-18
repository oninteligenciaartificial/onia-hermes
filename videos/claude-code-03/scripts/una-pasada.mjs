// Video 03 — reconstrucción a UNA PASADA por pieza (lección del video 2:
// encadenar encodes ablanda la cámara). Corte + zoom(s) + overlays en un solo
// filter_complex, CRF 13 preset slow. Reusa zoomExpr/autoWindowsFromKeep del
// zoom-punch de la skill para que el resultado sea EXACTAMENTE el aprobado.
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { zoomExpr, autoWindowsFromKeep, ANCHORS } from "file:///C:/dev/proyectos/onia-hermes/.claude/worktrees/video-editing-silence-removal-073acb/.claude/skills/editor-videos/scripts/zoom-punch.mjs";

const SCRATCH = "C:/Users/PC/AppData/Local/Temp/claude/C--dev-proyectos-onia-hermes--claude-worktrees-video-editing-silence-removal-073acb/1b27764e-a5b2-4fe6-997b-aecc00d784a6/scratchpad/v03";
const pieza = process.argv[2]; // "intro" | "main"
// FPS = el REAL del crudo (ffprobe r_frame_rate=30/1). Hardcodear 29.97 sobre un
// crudo de 30.00 estira el video 0.1% y la voz se desfasa ~0.6s en 10 min.
const CRF = "13", PRESET = "slow", W = 1920, H = 1080, FPS = 30;

const leer = (p) => JSON.parse(readFileSync(p, "utf8"));
const sel = (keep) => keep.map((k) => `between(t,${k.start},${k.end})`).join("+");

// posiciones de overlay-visuals (mismos márgenes: 5% X, 8% Y)
const pos = (p, w) => {
  const mx = Math.round(W * 0.05), my = Math.round(H * 0.08);
  switch (p) {
    case "top-left": return [mx, my];
    case "top-right": return [`${W}-w-${mx}`, my];
    case "right": return [`${W}-w-${mx}`, `(${H}-h)/2`];
    case "center": return [`(${W}-w)/2`, `(${H}-h)/2`];
    default: throw new Error("pos " + p);
  }
};

let inputs = [], filtro = [], mapaV, mapaA, OUT;

if (pieza === "intro") {
  const keep = leer(`${SCRATCH}/intro-cutplan.json`).keep;
  const plan = leer(`${SCRATCH}/overlay-intro-v4.json`).overlays;
  const wins = autoWindowsFromKeep(keep, [1, 1.08, 1.04, 1.12], "top");
  const [ax, ay] = ANCHORS.top;
  inputs = ["-i", "E:/ONIA-YouTube/grabaciones/ONIA-YT-2026-09-17-16-15-14.mp4"];
  const S = sel(keep);
  filtro.push(
    `[0:v]select='${S}',setpts=N/FRAME_RATE/TB,scale=iw*2:ih*2:flags=bicubic,` +
      `zoompan=z='${zoomExpr(wins)}':d=1:x='(iw-iw/zoom)*${ax}':y='(ih-ih/zoom)*${ay}':s=${W}x${H}:fps=${FPS.toFixed(6)}[base0]`,
  );
  plan.forEach((o, i) => {
    const dur = o.end - o.start;
    inputs.push("-loop", "1", "-t", String(dur + 0.1), "-i", o.asset);
    const wpx = Math.round(W * o.scale);
    const [x, y] = pos(o.position, wpx);
    filtro.push(
      `[${i + 1}:v]scale=${o.scale === 1 ? `${W}:${H}` : `${wpx}:-1`},format=argb,` +
        `fade=in:st=0:d=${o.fade}:alpha=1,fade=out:st=${(dur - o.fade).toFixed(3)}:d=${o.fade}:alpha=1,` +
        `setpts=PTS-STARTPTS+${o.start}/TB[ov${i}]`,
    );
    filtro.push(
      `[base${i}][ov${i}]overlay=${x}:${y}:enable='between(t,${o.start},${o.end})'[base${i + 1}]`,
    );
  });
  mapaV = `base${plan.length}`;
  filtro.push(`[0:a]aselect='${S}',asetpts=N/SR/TB[aud]`);
  mapaA = "aud";
  OUT = `${SCRATCH}/renders-intro/intro-1pasada.mp4`;
} else {
  // main [i0] [i1] [sufijo]: renderiza el rango de bloques [i0,i1) — con >100 bloques
  // el filter_complex entero revienta la memoria de ffmpeg ("Cannot allocate memory"),
  // asi que se parte en mitades y se unen con concat demuxer (sin re-encode).
  const todos = leer(`${SCRATCH}/main-cutplan.json`).keep;
  const i0 = Number(process.argv[3] ?? 0), i1 = Number(process.argv[4] ?? todos.length);
  const sufijo = process.argv[5] ?? "";
  const keep = todos.slice(i0, i1);
  // desplazamiento del tramo en el timeline de salida GLOBAL
  const off = todos.slice(0, i0).reduce((s, k) => s + k.end - k.start, 0);
  const durTramo = keep.reduce((s, k) => s + k.end - k.start, 0);
  const recorta = (zs) => zs
    .map((z) => ({ ...z, start: z.start - off, end: z.end - off }))
    .map((z) => ({ ...z, start: Math.max(z.start, 0), end: Math.min(z.end, durTramo) }))
    .filter((z) => z.end - z.start > 0.3)
    .map((z) => ({ ...z, animated: z.from !== z.to }));
  const top = recorta(leer(`${SCRATCH}/zooms-top.json`).zooms);
  const tl = recorta(leer(`${SCRATCH}/zooms-tl.json`).zooms);
  const S = sel(keep);
  inputs = ["-i", "E:/ONIA-YouTube/grabaciones/ONIA-YT-2026-09-17-16-18-09.mp4"];
  const [axT, ayT] = ANCHORS.top;
  const [axL, ayL] = ANCHORS["top-left"];
  filtro.push(
    `[0:v]select='${S}',setpts=N/FRAME_RATE/TB,scale=iw*2:ih*2:flags=bicubic,` +
      `zoompan=z='${zoomExpr(top)}':d=1:x='(iw-iw/zoom)*${axT}':y='(ih-ih/zoom)*${ayT}':s=${W * 2}x${H * 2}:fps=${FPS.toFixed(6)},` +
      `zoompan=z='${zoomExpr(tl)}':d=1:x='(iw-iw/zoom)*${axL}':y='(ih-ih/zoom)*${ayL}':s=${W}x${H}:fps=${FPS.toFixed(6)}[v]`,
  );
  mapaV = "v";
  filtro.push(`[0:a]aselect='${S}',asetpts=N/SR/TB[aud]`);
  mapaA = "aud";
  OUT = `${SCRATCH}/renders-main/main-1pasada${sufijo}.mp4`;
}

const args = [
  "-y", ...inputs,
  "-filter_complex", filtro.join(";"),
  "-map", `[${mapaV}]`, "-map", `[${mapaA}]`,
  "-c:v", "libx264", "-crf", CRF, "-preset", PRESET, "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "224k", "-movflags", "+faststart", OUT,
];
console.log("pieza:", pieza, "| filtros:", filtro.length, "| inputs:", (inputs.length / 2) | 0);
const r = spawnSync("ffmpeg", args, { stdio: ["ignore", "ignore", "inherit"] });
if (r.status !== 0) { console.error("ffmpeg fallo:", r.status); process.exit(1); }
console.log("OK →", OUT);
