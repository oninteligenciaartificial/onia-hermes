// L08 · gen2: karaoke (INSTRUCCION § ORDEN paso 3) con DOS ajustes medidos, sin tocar el script de la skill:
//  1) --max-dur 0.55 → frases «¿CUÁNTOS PACIENTES / SE OLVIDAN DE / SU CITA? / EL SISTEMA / LES MANDA».
//     Con el agrupado por defecto salía «CITA? EL SISTEMA»: una línea que cruza la pregunta y la oración siguiente.
//  2) Corte duro en la entrada del panel (sync-plan: «correo» − 0,15 = 3,746 s). karaoke-captions.mjs le suma
//     0,3 s de cola a la última frase («LES MANDA» terminaba en 4,05 s) y el texto quedaba ENCIMA del panel; la
//     receta dice que el karaoke se apaga mientras hay un panel de datos.
// Por eso: karaoke-captions.mjs --dry-run escribe el .ass (mismo agrupado, mismo estilo apple), acá se recortan
// los eventos al corte y se quema con el MISMO filtro (subtitles + fontsdir), CRF 14 slow, etiquetado bt709.
// Uso: node scripts/karaoke.mjs [--in renders/gen1.mp4] [--out renders/karaoke.mp4] [--draft]
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const P = join(dirname(fileURLToPath(import.meta.url)), "..");
const R = join(P, "../..");
const ES = join(R, ".claude/skills/editor-videos/scripts");
const argv = process.argv.slice(2);
const flag = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const DRAFT = argv.includes("--draft");
const IN = resolve(P, flag("in", DRAFT ? "renders/gen1-draft.mp4" : "renders/gen1.mp4"));
const OUT = resolve(P, flag("out", DRAFT ? "renders/karaoke-draft.mp4" : "renders/karaoke.mp4"));
const ASS = join(dirname(OUT), basename(OUT).replace(/\.mp4$/, ".ass"));

const panel = JSON.parse(readFileSync(join(P, "scripts/sync-plan.json"), "utf8")).overlays.find((o) => o.cue === "correo");
const HASTA = panel.start; // 3.746

// 1) .ass con el script de la skill (flags de la INSTRUCCION + --max-dur 0.55)
const k = spawnSync("node", [join(ES, "karaoke-captions.mjs"), "--segments", join(P, "scripts/segments-karaoke.json"),
  "--video", IN, "--out", OUT, "--ass-out", ASS, "--style", "apple", "--words-per-line", "3", "--font-size", "68",
  "--margin-v", "450", "--max-dur", "0.55", "--crf", "14", "--preset", "slow", "--dry-run"], { encoding: "utf8" });
if (k.status !== 0) { console.error(k.stderr || k.stdout); process.exit(1); }
console.log(k.stdout.split("\n--dry-run")[0]);

// 2) recorte al corte del panel
const t2s = (t) => { const [h, m, s] = t.split(":"); return +h * 3600 + +m * 60 + +s; };
const s2t = (s) => { const cs = Math.round(s * 100); return `${Math.floor(cs / 360000)}:${String(Math.floor(cs % 360000 / 6000)).padStart(2, "0")}:${String(Math.floor(cs % 6000 / 100)).padStart(2, "0")}.${String(cs % 100).padStart(2, "0")}`; };
let cortados = 0, tirados = 0;
const lines = readFileSync(ASS, "utf8").split("\n").filter((l) => {
  if (!l.startsWith("Dialogue:")) return true;
  const parts = l.split(",");
  if (t2s(parts[1]) >= HASTA) { tirados++; return false; }
  return true;
}).map((l) => {
  if (!l.startsWith("Dialogue:")) return l;
  const parts = l.split(",");
  if (t2s(parts[2]) > HASTA) { parts[2] = s2t(HASTA); cortados++; }
  return parts.join(",");
});
writeFileSync(ASS, lines.join("\n"), "utf8");
console.log(`corte en ${HASTA} s (entra el panel): ${cortados} evento(s) recortado(s), ${tirados} tirado(s) → ${ASS}`);

// 3) quemar: mismo filtro que karaoke-captions.mjs (cwd = carpeta del .ass, fuente de marca en _fonts)
const assDir = dirname(ASS);
mkdirSync(join(assDir, "_fonts"), { recursive: true });
copyFileSync(join(R, "hermes-content/brand/fonts/BricolageGrotesque-Bold.ttf"), join(assDir, "_fonts/BricolageGrotesque-Bold.ttf"));
const enc = DRAFT ? ["-crf", "23", "-preset", "ultrafast"] : ["-crf", "14", "-preset", "slow"];
const args = ["-y", "-hide_banner", "-loglevel", "error", "-i", IN, "-vf", `subtitles=${basename(ASS)}:fontsdir=_fonts`,
  "-c:v", "libx264", ...enc, "-pix_fmt", "yuv420p",
  "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
  "-c:a", "copy", "-movflags", "+faststart", OUT];
const r = spawnSync("ffmpeg", args, { cwd: assDir, stdio: ["ignore", "inherit", "inherit"] });
if (r.status !== 0) { console.error("ffmpeg falló", r.status); process.exit(1); }
console.log("OK →", OUT);
