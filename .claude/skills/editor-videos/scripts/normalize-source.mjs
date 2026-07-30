// editor-videos — NORMALIZA el crudo del celular. Primer paso, antes de todo.
//
// El iPhone graba en HDR: HEVC 10 bits, bt2020, transfer arib-std-b67 (HLG). Si se
// transcodifica a SDR sin TONE MAPPING, ffmpeg trata la curva HLG como si fuera gamma
// normal y la imagen sale LAVADA: piel grisácea, colores pálidos, todo "muy blanco".
// Medido 2026-07-30 sobre el video del día 1 — el brillo promedio casi no cambia
// (151 → 147), por eso no se detecta mirando números: lo que se pierde es el COLOR.
//
// Uso:
//   node normalize-source.mjs --video raw/IMG_3089.MOV --out raw/3089.mp4
//        [--width 1080] [--height 1920] [--fps 30] [--crf 20] [--force-tonemap] [--dry-run]
//
// Detecta el HDR solo; si el material ya es SDR (bt709) NO toca el color.
// Determinista. El audio se re-codifica a AAC 48k porque el resto del pipeline lo espera.
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
  console.error("normalize-source: " + m);
  process.exit(1);
};

const VIDEO = flag("video");
const OUT = flag("out");
const W = Number(flag("width", "1080"));
const H = Number(flag("height", "1920"));
const FPS = Number(flag("fps", "30"));
const CRF = flag("crf", "20");
if (!VIDEO) fail("falta --video <crudo.MOV>");
if (!OUT) fail("falta --out <normalizado.mp4>");
if (!existsSync(VIDEO)) fail(`no existe: ${VIDEO}`);

// ---- ¿es HDR? ---------------------------------------------------------------
// HLG (arib-std-b67) es lo que graban los iPhone; PQ (smpte2084) es lo de las cámaras
// de cine y las capturas de consola. Las dos necesitan tone mapping.
export const HDR_TRANSFERS = new Set(["arib-std-b67", "smpte2084"]);

export function tonemapChain() {
  // linear -> primarias bt709 -> hable -> vuelta a bt709 limitado. `desat=0` evita el
  // lavado que mete el desaturador por defecto justo en los tonos de piel.
  return [
    "zscale=t=linear:npl=100",
    "format=gbrpf32le",
    "zscale=p=bt709",
    "tonemap=tonemap=hable:desat=0",
    "zscale=t=bt709:m=bt709:r=tv",
    "format=yuv420p",
  ].join(",");
}

const probe = (entries) => {
  const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", `stream=${entries}`, "-of", "default=nk=1:nw=1", VIDEO], { encoding: "utf8" });
  if (r.status !== 0) fail(`ffprobe falló: ${(r.stderr || "").trim()}`);
  return String(r.stdout).trim().split("\n");
};
const [transfer, primaries, space, pix] = probe("color_transfer,color_primaries,color_space,pix_fmt");
const esHDR = HDR_TRANSFERS.has(String(transfer).trim()) || has("force-tonemap");

const filtros = [];
if (esHDR) filtros.push(tonemapChain());
filtros.push(`scale=${W}:${H}:force_original_aspect_ratio=increase`, `crop=${W}:${H}`, `fps=${FPS}`);

const args = ["-y", "-i", VIDEO, "-vf", filtros.join(","), "-c:v", "libx264", "-preset", flag("preset", "veryfast"), "-crf", String(CRF), "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", OUT];

console.log(`\nNORMALIZAR CRUDO`);
console.log(`  origen: ${VIDEO}`);
console.log(`  color:  transfer=${transfer} · primaries=${primaries} · space=${space} · ${pix}`);
console.log(`  → ${esHDR ? "HDR DETECTADO: se aplica tone mapping (hable, desat=0)" : "SDR: el color no se toca"}`);
console.log(`  salida: ${W}×${H} @${FPS}fps · h264 crf ${CRF} · aac 48k\n`);

if (has("dry-run")) {
  console.log("ffmpeg " + args.map((a) => (/[\s'"]/.test(a) ? `"${a}"` : a)).join(" "));
  console.error("--dry-run: no se escribió nada.");
  process.exit(0);
}

mkdirSync(dirname(resolve(OUT)), { recursive: true });
const r = spawnSync("ffmpeg", args, { stdio: ["ignore", "ignore", "inherit"] });
if (r.error) fail(`no pude ejecutar ffmpeg: ${r.error.message}`);
if (typeof r.status === "number" && r.status !== 0) fail(`ffmpeg salió con código ${r.status}`);
console.log(`normalize-source: listo → ${OUT}`);
if (esHDR) console.log("  (si la piel sigue viéndose pálida, probá --force-tonemap sobre el ORIGINAL, no sobre esta salida)");
