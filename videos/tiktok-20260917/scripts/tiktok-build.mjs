// TikToks del 17-sep — gen1: corte + punch + tarjetas dark (estilo del reel de Codex)
// en UNA pasada. El karaoke va en gen2 (karaoke-captions --style apple, CRF 14 slow).
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { zoomExpr, autoWindowsFromKeep, ANCHORS } from "file:///C:/dev/proyectos/onia-hermes/.claude/worktrees/video-editing-silence-removal-073acb/.claude/skills/editor-videos/scripts/zoom-punch.mjs";

const S = "C:/Users/PC/AppData/Local/Temp/claude/C--dev-proyectos-onia-hermes--claude-worktrees-video-editing-silence-removal-073acb/1b27764e-a5b2-4fe6-997b-aecc00d784a6/scratchpad/tiktok";
const W = 1080, H = 1920, FPS = 30;

// full:true = pantalla COMPLETA (tapa todo el cuadro)
const CLIPS = {
  IMG_4573: [ ["s1", 9.0, 21.5], ["fs-skillmd", 30.5, 36.5, true], ["fs-slash", 50.0, 56.0, true] ],
  IMG_4595: [ ["r1", 8.0, 17.0], ["r2", 22.5, 31.0], ["r3", 31.5, 42.5], ["fs-claudemd", 62.5, 68.5, true] ],
  IMG_4572: [ ["f1", 9.0, 16.5], ["fs-diff", 17.3, 23.5, true], ["f3", 28.5, 36.0], ["fs-noche", 38.8, 44.0, true] ],
};

const clip = process.argv[2];
const keep = JSON.parse(readFileSync(`${S}/${clip}-cutplan.json`, "utf8")).keep;
const acc = []; let off = 0;
for (const k of keep) { acc.push([k.start, k.end, off]); off += k.end - k.start; }
const map = (t) => { for (const [a, b, o] of acc) { if (t >= a && t <= b) return o + (t - a); if (t < a) return o; } return off; };

const wins = autoWindowsFromKeep(keep, [1, 1.06, 1.03, 1.09], "top");
const [ax, ay] = ANCHORS.top;
const sel = keep.map((k) => `between(t,${k.start},${k.end})`).join("+");

const inputs = ["-i", `C:/Users/PC/Downloads/${clip}.MP4`];
const filtro = [
  `[0:v]select='${sel}',setpts=N/FRAME_RATE/TB,scale=iw*2:ih*2:flags=bicubic,` +
    `zoompan=z='${zoomExpr(wins)}':d=1:x='(iw-iw/zoom)*${ax}':y='(ih-ih/zoom)*${ay}':s=${W}x${H}:fps=${FPS.toFixed(6)}[base0]`,
];
let base = "base0";
CLIPS[clip].forEach(([card, sa, sb, full], i) => {
  const a = +map(sa).toFixed(2), b = +map(sb).toFixed(2);
  const dur = +(b - a).toFixed(3);
  if (dur < 0.8) return;
  inputs.push("-loop", "1", "-t", String(dur + 0.1), "-i", `${S}/card-${card}.png`);
  const esc = full ? `${W}:${H}` : `${Math.round(W * 0.82)}:-1`;
  const oy = full ? 0 : Math.round(H * 0.06);
  filtro.push(
    `[${i + 1}:v]scale=${esc},format=argb,` +
      `fade=in:st=0:d=0.22:alpha=1,fade=out:st=${(dur - 0.22).toFixed(3)}:d=0.22:alpha=1,` +
      `setpts=PTS-STARTPTS+${a}/TB[ov${i}]`,
  );
  filtro.push(`[${base}][ov${i}]overlay=(${W}-w)/2:${oy}:enable='between(t,${a},${b})'[b${i + 1}]`);
  base = `b${i + 1}`;
});
filtro.push(`[0:a]aselect='${sel}',asetpts=N/SR/TB[aud]`);

const OUT = `${S}/${clip}-comp.mp4`;
const args = ["-y", ...inputs, "-filter_complex", filtro.join(";"), "-map", `[${base}]`, "-map", "[aud]",
  "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "224k", "-movflags", "+faststart", OUT];
const r = spawnSync("ffmpeg", args, { stdio: ["ignore", "ignore", "inherit"] });
if (r.status !== 0) { console.error("ffmpeg fallo:", r.status); process.exit(1); }
console.log("OK →", OUT);
