// editor-videos — ZOOMS (punch-in y Ken Burns) sin abrir un editor.
//
// Dos usos distintos, un solo script:
//  · PUNCH  — escalón fijo por bloque. Es el recurso clásico del talking-head: después de
//             cada corte el encuadre cambia de tamaño, y el jump cut deja de notarse.
//             Sin animación = sin jitter. Es el default.
//  · KEN    — zoom ANIMADO (from → to) con easing suave dentro de una ventana. Para el
//             remate, el dato fuerte o el CTA.
//
// Uso:
//   node zoom-punch.mjs --video renders/cut.mp4 --out renders/zoom.mp4 --auto --cutplan scripts/cutplan.json
//   node zoom-punch.mjs --video renders/cut.mp4 --out renders/zoom.mp4 --plan scripts/zooms.json
//   … --dry-run   (imprime la tabla + el ffmpeg, no renderiza)
//
//   zooms.json = { "zooms": [
//     { "start": 0,    "end": 3.2,  "z": 1.08 },                        // punch fijo
//     { "start": 3.2,  "end": 7.0,  "from": 1.0, "to": 1.15, "anchor": "top" }   // ken animado
//   ] }
//
// Anchors: center | top | bottom | left | right  (en 9:16 la cara suele estar arriba → "top").
// El audio se COPIA (-c:a copy): la voz nunca se re-encodea.
// Determinista: sin Date.now / Math.random. Sin dependencias externas.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";

export const MAX_Z = 2.0; // más que esto es un crop, no un zoom: se ve la pérdida
// top-left [0,0]: esquina exacta — con un deck 16:9 que lleva la camarita de OBS
// abajo-derecha, z ≥ 1.35 la deja FUERA del encuadre (pantalla completa sin tapas).
export const ANCHORS = { center: [0.5, 0.5], top: [0.5, 0.22], bottom: [0.5, 0.78], left: [0.22, 0.5], right: [0.78, 0.5], "top-left": [0, 0] };

const n3 = (v) => Math.round(Number(v) * 1000) / 1000;

// ---- ventanas --------------------------------------------------------------
export function normalizeWindows(zooms) {
  const out = [];
  zooms.forEach((z, i) => {
    const start = Number(z.start);
    const end = Number(z.end);
    if (!Number.isFinite(start) || !Number.isFinite(end)) throw new Error(`zooms[${i}]: start/end deben ser números`);
    if (end <= start) throw new Error(`zooms[${i}]: end (${end}) debe ser > start (${start})`);
    const from = Number(z.from ?? z.z ?? 1);
    const to = Number(z.to ?? z.z ?? from);
    for (const [k, v] of [["from", from], ["to", to]]) {
      if (!Number.isFinite(v) || v < 1) throw new Error(`zooms[${i}]: ${k} debe ser >= 1 (1 = sin zoom), recibí ${v}`);
      if (v > MAX_Z) throw new Error(`zooms[${i}]: ${k}=${v} pasa el máximo ${MAX_Z} (a ese nivel se pixela)`);
    }
    const anchor = z.anchor ?? "center";
    if (!ANCHORS[anchor]) throw new Error(`zooms[${i}]: anchor "${anchor}" desconocido (usá: ${Object.keys(ANCHORS).join(" | ")})`);
    out.push({ i, start, end, from, to, anchor, animated: from !== to });
  });
  out.sort((a, b) => a.start - b.start);
  for (let i = 1; i < out.length; i++) {
    if (out[i].start < out[i - 1].end - 1e-6) {
      throw new Error(`zooms[${out[i].i}] empieza en ${out[i].start}s pero zooms[${out[i - 1].i}] todavía no terminó (${out[i - 1].end}s): las ventanas no se pueden pisar`);
    }
  }
  return out;
}

// ---- auto: un tamaño distinto por bloque del corte --------------------------
// keep[] viene en tiempos del CRUDO; en el video ya cortado los bloques quedan
// pegados uno atrás del otro, así que las costuras son las duraciones acumuladas.
export function autoWindowsFromKeep(keep, levels = [1, 1.08, 1.04, 1.12], anchor = "center") {
  const wins = [];
  let t = 0;
  keep.forEach((k, i) => {
    const dur = Number(k.end) - Number(k.start);
    if (!(dur > 0)) return;
    const z = levels[wins.length % levels.length];
    wins.push({ start: n3(t), end: n3(t + dur), z, anchor, block: i + 1 });
    t += dur;
  });
  return wins;
}

// ---- expresión z(t) para zoompan -------------------------------------------
// Fuera de toda ventana, z = 1 (sin zoom). Dentro:
//  · punch → constante
//  · ken   → from + (to-from) * smoothstep(p), p = avance normalizado en la ventana.
//    smoothstep (p²(3-2p)) arranca y termina sin tirón; una rampa lineal se nota.
export function zoomExpr(windows) {
  let expr = "1";
  for (let i = windows.length - 1; i >= 0; i--) {
    const w = windows[i];
    const s = n3(w.start);
    const e = n3(w.end);
    let val;
    if (w.animated) {
      const p = `clip((it-${s})/${n3(e - s)},0,1)`;
      val = `(${n3(w.from)}+${n3(w.to - w.from)}*(${p}*${p}*(3-2*${p})))`;
    } else {
      val = String(n3(w.to));
    }
    expr = `if(between(it,${s},${e}),${val},${expr})`;
  }
  return expr;
}

// ---- CLI -------------------------------------------------------------------
const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
if (isMain) {
  const argv = process.argv.slice(2);
  const has = (n) => argv.includes("--" + n);
  const flag = (n, d) => {
    const i = argv.indexOf("--" + n);
    return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : d;
  };
  const fail = (m) => {
    console.error("zoom-punch: " + m);
    process.exit(1);
  };

  const VIDEO = flag("video");
  const OUT = flag("out");
  const PLAN = flag("plan");
  const CUTPLAN = flag("cutplan");
  const AUTO = has("auto");
  const DRY = has("dry-run");
  const ANCHOR = flag("anchor", "center");
  const LEVELS = flag("levels", "1,1.08,1.04,1.12");
  // supersample: zoompan redondea x/y a píxel entero del ORIGEN. Escalando antes,
  // ese píxel vale menos en la salida y el movimiento del ken deja de "escalonar".
  // En punch (estático) no hace falta: default 1, y 2 solo si hay ventana animada.
  const SS_FLAG = flag("supersample");

  if (!VIDEO) fail("falta --video <in.mp4>");
  if (!OUT) fail("falta --out <out.mp4>");
  if (!existsSync(VIDEO)) fail(`no existe el video: ${VIDEO}`);
  if (!PLAN && !AUTO) fail("falta --plan <zooms.json> o --auto --cutplan <cutplan.json>");

  // ---- ffprobe: nada hardcodeado
  const probe = (fields, stream = "v:0") => {
    const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", stream, "-show_entries", `stream=${fields}`, "-of", "csv=p=0:nk=1", VIDEO], { encoding: "utf8" });
    if (r.error) fail(`no pude ejecutar ffprobe: ${r.error.message} (¿está instalado?)`);
    if (r.status !== 0) fail(`ffprobe falló sobre ${VIDEO}: ${(r.stderr || "").trim()}`);
    return String(r.stdout).trim().split("\n")[0].split(",").map((s) => s.trim());
  };
  const [W, H] = probe("width,height").map(Number);
  const fpsRaw = probe("r_frame_rate")[0] || "30/1";
  const [fn, fd] = fpsRaw.split("/").map(Number);
  const fps = fd ? fn / fd : fn || 30;
  const durRaw = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", VIDEO], { encoding: "utf8" });
  const baseDur = Number(String(durRaw.stdout).trim()) || 0;
  if (!W || !H) fail(`no pude leer el tamaño de ${VIDEO}`);

  // ---- ventanas
  let raw;
  if (AUTO) {
    if (!CUTPLAN) fail("--auto necesita --cutplan <cutplan.json> (de dónde saca las costuras)");
    if (!existsSync(CUTPLAN)) fail(`no existe --cutplan: ${CUTPLAN}`);
    const cp = JSON.parse(readFileSync(CUTPLAN, "utf8"));
    const keep = Array.isArray(cp.keep) ? cp.keep : null;
    if (!keep || !keep.length) fail("el cutplan no tiene keep[]: no hay bloques que alternar");
    const levels = LEVELS.split(",").map(Number).filter((v) => Number.isFinite(v));
    if (!levels.length) fail("--levels inválido");
    raw = autoWindowsFromKeep(keep, levels, ANCHOR);
  } else {
    if (!existsSync(PLAN)) fail(`no existe --plan: ${PLAN}`);
    const p = JSON.parse(readFileSync(PLAN, "utf8"));
    raw = Array.isArray(p) ? p : Array.isArray(p.zooms) ? p.zooms : null;
    if (!raw) fail("el plan necesita { zooms: [ ... ] }");
    if (!raw.length) fail("el plan no tiene zooms");
  }

  let windows;
  try {
    windows = normalizeWindows(raw);
  } catch (err) {
    fail(err.message);
  }
  if (baseDur) {
    for (const w of windows) {
      if (w.start >= baseDur) fail(`una ventana arranca en ${w.start}s y el video dura ${baseDur.toFixed(2)}s`);
      if (w.end > baseDur + 0.05) {
        console.error(`zoom-punch: AVISO la ventana ${w.start}–${w.end}s pasa el final del video (${baseDur.toFixed(2)}s) → se corta ahí.`);
        w.end = baseDur;
      }
    }
  }

  const anyAnimated = windows.some((w) => w.animated);
  const SS = Number(SS_FLAG ?? (anyAnimated ? 2 : 1));
  if (!(SS >= 1 && SS <= 4)) fail("--supersample debe estar entre 1 y 4");

  // ---- filtro: (opcional) supersample → zoompan → salida al tamaño original
  const anchors = new Set(windows.map((w) => w.anchor));
  if (anchors.size > 1) {
    fail(`hay ${anchors.size} anchors distintos (${[...anchors].join(", ")}): zoompan usa uno solo por pasada. Partí el render o dejá un anchor.`);
  }
  const [ax, ay] = ANCHORS[windows[0].anchor];
  const z = zoomExpr(windows);
  const parts = [];
  if (SS > 1) parts.push(`scale=iw*${SS}:ih*${SS}:flags=bicubic`);
  parts.push(
    `zoompan=z='${z}':d=1:x='(iw-iw/zoom)*${ax}':y='(ih-ih/zoom)*${ay}':s=${W}x${H}:fps=${n3(fps)}`,
  );
  const vf = parts.join(",");

  const ffArgs = ["-y", "-i", VIDEO, "-vf", vf, "-c:v", "libx264", "-preset", flag("preset", "veryfast"), "-crf", flag("crf", "18"), "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", OUT];
  const shellCmd = "ffmpeg " + ffArgs.map((a) => (/[\s'"$;|&<>()*?]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a)).join(" ");

  // ---- tabla (REGLA DE ORO)
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(2).padStart(5, "0")}`;
  let table = `\nZOOMS (mostrar a Sergio antes de aplicar)\n`;
  table += `base ${VIDEO}  ${W}×${H} @${n3(fps)}fps  ${baseDur ? baseDur.toFixed(2) + "s" : "dur ?"}  ·  supersample ×${SS}\n\n`;
  table += `#  | entra   | sale    | dur   | tipo  | zoom          | anchor\n`;
  table += `---+---------+---------+-------+-------+---------------+--------\n`;
  windows.forEach((w, i) => {
    const tipo = w.animated ? "ken  " : "punch";
    const zz = w.animated ? `${w.from.toFixed(2)} → ${w.to.toFixed(2)}` : `${w.to.toFixed(2)} fijo`;
    table += `${String(i + 1).padStart(2)} | ${fmt(w.start)} | ${fmt(w.end)} | ${((w.end - w.start).toFixed(2) + "s").padEnd(5)} | ${tipo} | ${zz.padEnd(13)} | ${w.anchor}\n`;
  });
  console.log(table);
  const cubierto = windows.reduce((a, w) => a + (w.end - w.start), 0);
  if (baseDur) console.log(`cobertura: ${cubierto.toFixed(2)}s de ${baseDur.toFixed(2)}s (${Math.round((cubierto / baseDur) * 100)}%) — el resto va sin zoom.\n`);
  console.log("ffmpeg:\n" + shellCmd + "\n");

  if (DRY) {
    console.error("--dry-run: no se corrió nada. Quitá --dry-run para renderizar.");
    process.exit(0);
  }

  mkdirSync(dirname(resolve(OUT)), { recursive: true });
  const res = spawnSync("ffmpeg", ffArgs, { stdio: ["ignore", "inherit", "inherit"] });
  if (res.error) fail(`no pude ejecutar ffmpeg: ${res.error.message} (¿está instalado?)`);
  if (typeof res.status === "number" && res.status !== 0) fail(`ffmpeg salió con código ${res.status}`);
  console.log(`zoom-punch: ${windows.length} ventana(s) → ${OUT}`);
}
