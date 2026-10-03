// editor-videos — PANTALLA VERDE: vos recortado delante de la captura.
//
// Recorta la tela verde de la toma con ffmpeg (chromakey + despill) y pone detrás
// la captura (imagen o video). Nada se adivina: el color de la tela y el umbral se
// MIDEN en el borde del cuadro, que es tela.
//
// Lo que se aprendió probándolo (3-oct-2026, toma de prueba limpia y otra
// degradada con viñeta, menos saturación y ruido; ver SKILL.md):
//   · chromakey compara solo el COLOR (U,V), no el brillo. Si se le da el verde
//     medido tal cual y la tela está en sombra (p. ej. 0x167F03), ese verde queda
//     tan cerca del gris que la camiseta blanca sale medio transparente: fondo y
//     persona se solapan (fondo hasta 0,19 de distancia, persona desde 0,15).
//   · Arreglo: se usa el MISMO tono llevado a brillo pleno (0x2CFF06). Ahí el fondo
//     queda por debajo de 0,22 y la persona por arriba de 0,34: hay hueco limpio.
//   · hsvkey se probó y se descartó: se come la ropa clara.
//
// Uso:
//   node fondo-verde.mjs --toma toma.mp4 --fondo captura.png --out out.mp4
//     [--similitud auto]  distancia de color hasta la que un píxel se borra (0-1).
//                         auto = el p99 del verde del borde + 0,02. Subir si quedan
//                         manchas verdes; bajar si se come pelo o ropa.
//     [--suavizado auto]  borde suave del recorte (chromakey blend). auto = lo que
//                         queda de hueco hasta el gris, con tope 0,10.
//     [--color 0x15A030]  fuerza el color de la tela en vez de medirlo.
//     [--fit ancho]       ancho: la captura a lo ancho, arriba (y=--fondo-y), y lo
//                         que sobra en la tinta de marca (0x0A0F0D).
//                         cover: la captura llena el cuadro y se recortan bordes.
//     [--fondo-y 0]       en fit=ancho, a qué altura empieza la captura (px).
//     [--crop x:y:w:h]    recorte focal de la captura ANTES de escalar: mostrar la
//                         línea que importa, no la página entera.
//     [--offset 0]        si el fondo es video, desde qué segundo se lee.
//     [--mate x:y:w:h]    máscara de basura: solo se conserva de la toma este
//                         rectángulo (px del cuadro de salida). Para cuando la
//                         cámara ve más allá de la tela (bordes oscuros, soporte).
//     [--chequeo f.png]   en vez del video, una lámina para MIRAR el recorte en el
//                         segundo --t: original | recorte sobre magenta | final.
//                         El magenta delata agujeros y bordes verdes que sobre la
//                         captura se esconden.
//     [--t 1]  [--width 1080] [--height 1920] [--crf 18] [--preset veryfast]
//
// Si el hueco entre la tela y el gris es chico (luz despareja, tela arrugada), lo
// avisa: ahí se mejora la luz o se usa la pantalla partida (receta Santiago).
// El audio de la toma se COPIA (la voz nunca se re-encodea). La toma tiene que
// venir ya en vertical 1080x1920 o se escala con cover.
// Determinista: sin Date.now / Math.random. Sin dependencias externas.
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { extname } from "node:path";

const argv = process.argv.slice(2);
const flag = (name, def) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : def;
};
const fail = (msg) => {
  console.error("fondo-verde: " + msg);
  process.exit(1);
};

const TOMA = flag("toma");
const FONDO = flag("fondo");
const OUT = flag("out");
const CHEQUEO = flag("chequeo");
const FIT = flag("fit", "ancho");
const FONDO_Y = parseInt(flag("fondo-y", "0"), 10);
const CROP = flag("crop");
const MATE = flag("mate");
const OFFSET = parseFloat(flag("offset", "0"));
const T = parseFloat(flag("t", "1"));
const W = parseInt(flag("width", "1080"), 10);
const H = parseInt(flag("height", "1920"), 10);
const CRF = flag("crf", "18");
const PRESET = flag("preset", "veryfast");

if (!TOMA || !FONDO || !(OUT || CHEQUEO)) fail("faltan --toma, --fondo y --out (o --chequeo)");
for (const f of [TOMA, FONDO]) if (!existsSync(f)) fail("no existe " + f);
if (!["ancho", "cover"].includes(FIT)) fail("--fit es ancho o cover");

const run = (args, opts = {}) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-v", "error", ...args], { maxBuffer: 1 << 26, ...opts });
  if (r.status !== 0) fail("ffmpeg falló:\n" + String(r.stderr));
  return r.stdout;
};

// ---- color de la tela y umbral: medidos en el borde ---------------------------
// Franja de arriba (8 % del alto) + 6 columnas a cada costado, en un cuadro chico.
// Solo cuentan los píxeles donde manda el verde: si la persona toca un costado, su
// piel y su ropa no entran en la cuenta.
// Distancia = la misma que usa chromakey: U,V de BT.601, normalizada a 0-1.
const uv = (r, g, b) => [(-38 * r - 74 * g + 112 * b + 128) / 256 + 128, (112 * r - 94 * g - 18 * b + 128) / 256 + 128];
const dist = ([u1, v1], [u2, v2]) => Math.sqrt(((u1 - u2) ** 2 + (v1 - v2) ** 2) / (255 * 255 * 2));
const hex = (rgb) => "0x" + rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("").toUpperCase();

function medirTela() {
  const sw = 108, sh = 192;
  const raw = run(["-ss", String(T), "-i", TOMA, "-frames:v", "1", "-vf", `scale=${sw}:${sh}`,
    "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]);
  if (raw.length < sw * sh * 3) fail("no pude leer un cuadro de la toma en t=" + T);
  const px = [];
  const push = (x, y) => {
    const i = (y * sw + x) * 3, p = [raw[i], raw[i + 1], raw[i + 2]];
    if (p[1] > p[0] + 30 && p[1] > p[2] + 30) px.push(p);
  };
  for (let y = 0; y < Math.round(sh * 0.08); y++) for (let x = 0; x < sw; x++) push(x, y);
  for (let y = 0; y < sh; y++) for (const x of [0, 1, 2, 3, 4, 5, sw - 6, sw - 5, sw - 4, sw - 3, sw - 2, sw - 1]) push(x, y);
  if (px.length < sw) fail("el borde no es verde. ¿La tela llena los bordes? Usá --color o la pantalla partida.");
  const med = (i) => px.map((p) => p[i]).sort((a, b) => a - b)[px.length >> 1];
  const medido = [med(0), med(1), med(2)];
  // Mismo tono, brillo pleno: el canal más alto a 255.
  const k = 255 / Math.max(...medido);
  const tela = medido.map((c) => Math.min(255, c * k));
  const ds = px.map((p) => dist(uv(...p), uv(...tela))).sort((a, b) => a - b);
  return { medido: hex(medido), tela: hex(tela), p99: ds[Math.floor(ds.length * 0.99)], gris: dist(uv(128, 128, 128), uv(...tela)) };
}

const forzado = flag("color");
const m = forzado ? null : medirTela();
const COLOR = forzado || m.tela;
const GRIS = forzado ? 0.36 : m.gris; // a qué distancia de la tela está un gris neutro
const SIM = flag("similitud", "auto") === "auto" ? Math.min(0.3, Math.max(0.1, (m ? m.p99 : 0.12) + 0.02)) : parseFloat(flag("similitud"));
const BLEND = flag("suavizado", "auto") === "auto" ? Math.min(0.1, Math.max(0.02, 0.85 * GRIS - SIM)) : parseFloat(flag("suavizado"));
const HUECO = 0.85 * GRIS - SIM;
if (HUECO < 0.04) {
  console.error(`fondo-verde: AVISO hueco chico entre la tela y el gris (${HUECO.toFixed(3)}): luz despareja o tela ` +
    "arrugada. Mirá la lámina --chequeo; si la ropa sale transparente, mejorá la luz o usá la pantalla partida.");
}
const DATOS = { color: COLOR, medido: m ? m.medido : null, similitud: +SIM.toFixed(3), suavizado: +BLEND.toFixed(3), hueco: +HUECO.toFixed(3) };

// ---- grafo --------------------------------------------------------------------
const esVideo = [".mp4", ".mov", ".webm", ".mkv"].includes(extname(FONDO).toLowerCase());
const mate = (() => {
  if (!MATE) return null;
  const [x, y, w, h] = MATE.split(":").map(Number);
  if ([x, y, w, h].some((n) => !Number.isFinite(n)) || x < 0 || y < 0 || x + w > W || y + h > H) fail("--mate es x:y:w:h dentro del cuadro");
  return { x, y, w, h };
})();
const cropF = (() => {
  if (!CROP) return "";
  const [x, y, w, h] = CROP.split(":").map(Number);
  if ([x, y, w, h].some((n) => !Number.isFinite(n))) fail("--crop es x:y:w:h");
  return `crop=${w}:${h}:${x}:${y},`;
})();
const INK = "0x0A0F0D"; // tinta de marca, la misma de split-layout
const cover = `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`;
// setpts=PTS-STARTPTS en todas las ramas: sin eso, en la lámina de --chequeo el
// primer cuadro del fondo llega antes que el de la toma y sale el fondo solo.
const fondoGrafo = FIT === "cover"
  ? `[1:v]${cropF}${cover},setsar=1,setpts=PTS-STARTPTS,format=yuv420p[bg]`
  : `[1:v]${cropF}scale=${W}:-2,setsar=1,setpts=PTS-STARTPTS[ancho];` +
    `color=c=${INK}:s=${W}x${H}:r=30[tinta];` +
    `[tinta][ancho]overlay=0:${FONDO_Y}:shortest=0,format=yuv420p[bg]`;

// Recorte: chromakey mide distancia en croma (U,V), no en brillo, así la tela con
// una arruga más oscura sigue siendo "tela". despill saca el reflejo verde que la
// tela deja en el borde del pelo y los hombros.
const recorte = `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1,setpts=PTS-STARTPTS,` +
  `format=yuva420p,chromakey=color=${COLOR}:similarity=${SIM.toFixed(3)}:blend=${BLEND.toFixed(3)},despill=type=green` +
  (MATE ? `,crop=${mate.w}:${mate.h}:${mate.x}:${mate.y}` : "") + "[fg]";
const FG_XY = MATE ? `${mate.x}:${mate.y}` : "0:0";

const fondoIn = esVideo
  ? ["-ss", String(OFFSET), "-stream_loop", "-1", "-i", FONDO]
  : ["-loop", "1", "-framerate", "30", "-i", FONDO];

if (CHEQUEO) {
  // Lámina de control en el segundo T: original | recorte sobre magenta | final.
  const g = `${recorte};[fg]split[fa][fb];${fondoGrafo};` +
    `color=c=0xFF00FF:s=${W}x${H}:r=30[mg];[mg][fa]overlay=${FG_XY}:format=auto:eof_action=repeat[sobreMg];` +
    `[bg][fb]overlay=${FG_XY}:format=auto:eof_action=repeat[fin];` +
    `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1,setpts=PTS-STARTPTS[orig];` +
    `[orig][sobreMg][fin]hstack=inputs=3,scale=${Math.round((W * 3) / 2)}:-2[out]`;
  run(["-y", "-ss", String(T), "-i", TOMA, ...fondoIn, "-filter_complex", g, "-map", "[out]", "-frames:v", "1", CHEQUEO]);
  console.log(JSON.stringify({ chequeo: CHEQUEO, t: T, ...DATOS }));
  process.exit(0);
}

const g = `${recorte};${fondoGrafo};[bg][fg]overlay=${FG_XY}:format=auto:shortest=1,format=yuv420p[out]`;
run(["-y", "-i", TOMA, ...fondoIn, "-filter_complex", g, "-map", "[out]", "-map", "0:a?",
  "-c:v", "libx264", "-crf", CRF, "-preset", PRESET, "-c:a", "copy", "-movflags", "+faststart", OUT]);
console.log(JSON.stringify({ out: OUT, fit: FIT, ...DATOS }));
