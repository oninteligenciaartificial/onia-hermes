// editor-videos — arma la CUT-LIST: qué se conserva y qué se tira.
// NO aplica nada: imprime la tabla para mostrar a Sergio (REGLA DE ORO) + escribe
// cutplan.json (keep[] + comando ffmpeg exacto).
//
// Uso: node cut-plan.mjs <segments.json> --video <in.mp4> [--noise -32dB] [--min-sil 0.45]
//        [--pad 0.08] [--min-keep 0.35] [--join 0.12] [--gap 0.6]
//   <segments.json> = { segments:[{start,end,text}], words:[...] } (ver-videos/transcribe.sh)
//
// EL SILENCIO SE MIDE EN EL AUDIO, no en los huecos del transcript. Whisper devuelve
// segmentos CONTIGUOS: sobre un clip real de 15s con 3.16s de silencio (21%), la versión
// que miraba solo los gaps entre segmentos reportaba 0.00s y no cortaba NADA (medido
// 2026-07-30). Con --video se corre `silencedetect` de ffmpeg y ahí sí aparecen.
// Sin --video (o si ffmpeg falla) cae al modo viejo por segmentos y lo DICE.
//
// Determinista: sin Date.now / Math.random.
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";

const FILLER = ["eh", "ehh", "em", "este", "esteee", "osea", "mmm", "mm", "aja", "ajá", "aver", "esdecir", "digamos", "pues", "nada", "tipo"];
const MULTI = [["o sea", "osea"], ["a ver", "aver"], ["es decir", "esdecir"]];

export function norm(t) {
  return (t || "").toLowerCase().replace(/[.,!?¿¡…"']/g, "").replace(/\s+/g, " ").trim();
}
export function fillerRatio(t) {
  let s = norm(t);
  for (const [a, b] of MULTI) s = s.split(a).join(b);
  const toks = s.split(" ").filter(Boolean);
  if (!toks.length) return 1;
  return toks.filter((w) => FILLER.includes(w)).length / toks.length;
}
// ¿cur es una trabada/repetición de next? (prefijo fuerte o casi-igual)
export function isRetakeOf(cur, next) {
  const a = norm(cur), b = norm(next);
  if (!a || !b) return false;
  if (a === b) return true;
  const short = a.length <= b.length ? a : b, long = a.length <= b.length ? b : a;
  return long.startsWith(short) && short.length >= 6 && short.length / long.length >= 0.5;
}

// ---- silencio → bloques de voz ---------------------------------------------
// Complemento de los silencios sobre [0, duration], con `pad` de aire a cada lado
// (cortar pegado a la palabra se come la consonante inicial y suena a tijeretazo).
export function speechFromSilence(silences, duration, opts = {}) {
  const pad = Number(opts.pad ?? 0.08);
  const minKeep = Number(opts.minKeep ?? 0.35);
  const join = Number(opts.join ?? 0.12);
  const sil = [...silences]
    .map((s) => ({ start: Math.max(0, Number(s.start)), end: Math.min(duration, Number(s.end)) }))
    .filter((s) => s.end > s.start)
    .sort((a, b) => a.start - b.start);

  const blocks = [];
  let cursor = 0;
  for (const s of sil) {
    if (s.start > cursor) blocks.push({ start: cursor, end: s.start });
    cursor = Math.max(cursor, s.end);
  }
  if (cursor < duration) blocks.push({ start: cursor, end: duration });

  // aire + merge de los que quedan pegados + descarte de restos impronunciables
  const padded = blocks.map((b) => ({
    start: Math.max(0, b.start - pad),
    end: Math.min(duration, b.end + pad),
  }));
  const merged = [];
  for (const b of padded) {
    const last = merged[merged.length - 1];
    if (last && b.start - last.end <= join) last.end = Math.max(last.end, b.end);
    else merged.push({ ...b });
  }
  return merged.filter((b) => b.end - b.start >= minKeep);
}

// Resta los tramos rechazados por TEXTO (muletilla, trabada) de los bloques de voz.
export function subtractRanges(blocks, cuts, minKeep = 0.35) {
  let out = blocks.map((b) => ({ ...b }));
  for (const c of cuts) {
    const next = [];
    for (const b of out) {
      if (c.end <= b.start || c.start >= b.end) { next.push(b); continue; }
      if (c.start > b.start) next.push({ start: b.start, end: c.start });
      if (c.end < b.end) next.push({ start: c.end, end: b.end });
    }
    out = next;
  }
  return out.filter((b) => b.end - b.start >= minKeep);
}

export const round2 = (n) => Math.round(n * 100) / 100;

// ---- ffmpeg: silencedetect --------------------------------------------------
export function parseSilenceLog(stderr) {
  const out = [];
  let start = null;
  for (const line of String(stderr).split(/\r?\n/)) {
    const s = line.match(/silence_start:\s*(-?[\d.]+)/);
    if (s) { start = Number(s[1]); continue; }
    const e = line.match(/silence_end:\s*(-?[\d.]+)/);
    if (e && start !== null) { out.push({ start, end: Number(e[1]) }); start = null; }
  }
  return out;
}

// ---- CLI --------------------------------------------------------------------
const isMain = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("cut-plan.mjs");
if (isMain) {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  const getFlag = (name, def) => { const i = args.indexOf("--" + name); return i >= 0 && i + 1 < args.length ? args[i + 1] : def; };
  const VIDEO = getFlag("video", getFlag("media", ""));
  const NOISE = getFlag("noise", "-32dB");
  const MIN_SIL = Number(getFlag("min-sil", "0.45"));   // silencio mínimo para cortar
  const PAD = Number(getFlag("pad", "0.08"));
  const MIN_KEEP = Number(getFlag("min-keep", "0.35"));
  const JOIN = Number(getFlag("join", "0.12"));

  if (!file) { console.error("uso: node cut-plan.mjs <segments.json> --video <in.mp4>"); process.exit(1); }
  const data = JSON.parse(await readFile(file, "utf8"));
  const segs = (data.segments || []).map((s, i) => ({ i, start: +s.start, end: +s.end, text: (s.text || "").trim() }));
  if (!segs.length) { console.error("sin segmentos"); process.exit(1); }

  // Decisiones por TEXTO (esto sí vive en el transcript)
  const rows = segs.map((s, idx) => {
    const next = segs[idx + 1];
    let keep = true, reason = "contenido";
    if (fillerRatio(s.text) >= 0.6) { keep = false; reason = "muletilla"; }
    else if (next && isRetakeOf(s.text, next.text)) { keep = false; reason = "trabada/repetida (me quedo con la 2da)"; }
    return { ...s, keep, reason };
  });
  const textCuts = rows.filter((r) => !r.keep).map((r) => ({ start: r.start, end: r.end }));

  // Duración real de la fuente (nunca del transcript: el audio suele durar más)
  let duration = 0;
  const haveMedia = VIDEO && existsSync(VIDEO);
  if (haveMedia) {
    const p = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", VIDEO], { encoding: "utf8" });
    if (p.status === 0) duration = Number(String(p.stdout).trim()) || 0;
  }
  if (!duration) duration = segs[segs.length - 1].end;

  // SILENCIO: del audio si se puede; si no, del transcript (y se avisa)
  let silences = [];
  let modo = "audio";
  if (haveMedia) {
    const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", VIDEO, "-af", `silencedetect=noise=${NOISE}:d=${MIN_SIL}`, "-f", "null", "-"], { encoding: "utf8" });
    silences = parseSilenceLog(r.stderr || "");
    if (r.status !== 0 && !silences.length) modo = "transcript";
  } else {
    modo = "transcript";
  }
  if (modo === "transcript") {
    // fallback: huecos entre segmentos (lo que hacía la versión vieja)
    for (let i = 0; i < segs.length - 1; i++) {
      const g = segs[i + 1].start - segs[i].end;
      if (g >= MIN_SIL) silences.push({ start: segs[i].end, end: segs[i + 1].start });
    }
    if (segs[0].start >= MIN_SIL) silences.unshift({ start: 0, end: segs[0].start });
  }

  const speech = speechFromSilence(silences, duration, { pad: PAD, minKeep: MIN_KEEP, join: JOIN });
  const keep = subtractRanges(speech, textCuts, MIN_KEEP).map((b) => ({ start: round2(b.start), end: round2(b.end) }));
  if (!keep.length) { console.error("cut-plan: no quedó NADA para conservar — revisá --noise/--min-sil"); process.exit(1); }

  const finalDur = round2(keep.reduce((a, k) => a + (k.end - k.start), 0));
  const silTotal = round2(silences.reduce((a, s) => a + (s.end - s.start), 0));

  const between = keep.map((k) => `between(t,${k.start},${k.end})`).join("+");
  const vf = `select='${between}',setpts=N/FRAME_RATE/TB`;
  const af = `aselect='${between}',asetpts=N/SR/TB`;
  const outMp4 = "renders/cut.mp4";
  const ffmpeg = `ffmpeg -y -i "${VIDEO || "in.mp4"}" -vf "${vf}" -af "${af}" "${outMp4}"`;

  // ---- tabla (REGLA DE ORO: mostrar antes de aplicar) ------------------------
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(2).padStart(5, "0")}`;
  const clip = (t, n = 46) => (t.length > n ? t.slice(0, n - 1) + "…" : t);
  const textoEn = (a, b) => segs.filter((s) => s.end > a && s.start < b).map((s) => s.text).join(" ");

  let table = `\nCUT-LIST (mostrar a Sergio antes de aplicar)\n`;
  table += `orig ${round2(duration)}s → final ${finalDur}s  (−${round2(duration - finalDur)}s)  ·  ${silences.length} silencios (${silTotal}s) · ${textCuts.length} por texto\n`;
  table += `silencio medido en: ${modo === "audio" ? `AUDIO (silencedetect ${NOISE}, mín ${MIN_SIL}s)` : "TRANSCRIPT (sin --video: los silencios DENTRO de un segmento no se ven)"}\n\n`;
  table += `#  | Me quedo con      | Tiro           | Por qué          | texto\n`;
  table += `---+-------------------+----------------+------------------+------------------------------\n`;
  let prevEnd = 0;
  keep.forEach((k, i) => {
    const hueco = round2(k.start - prevEnd);
    const motivo = hueco > 0 ? (textCuts.some((c) => c.start >= prevEnd - 0.01 && c.end <= k.start + 0.01) ? "muletilla/trabada" : "silencio") : "—";
    table += `${String(i + 1).padStart(2)} | ${fmt(k.start)}–${fmt(k.end)} | ${(hueco > 0 ? `${hueco}s antes` : "—").padEnd(14)} | ${motivo.padEnd(16)} | ${clip(textoEn(k.start, k.end))}\n`;
    prevEnd = k.end;
  });
  const cola = round2(duration - prevEnd);
  if (cola > 0.05) table += `   | (cola)            | ${(cola + "s").padEnd(14)} | silencio final   |\n`;
  console.log(table);
  if (modo === "transcript") {
    console.log("AVISO: sin --video el silencio sale de los huecos del transcript. Whisper devuelve");
    console.log("       segmentos contiguos, así que las pausas DENTRO de un segmento no se ven.");
    console.log("       Pasá --video <archivo> para medir el silencio en el audio.\n");
  }
  console.log("ffmpeg:\n" + ffmpeg + "\n");

  const outJson = join(dirname(file), "cutplan.json");
  await writeFile(outJson, JSON.stringify({ video: VIDEO || null, modo, noise: NOISE, minSil: MIN_SIL, pad: PAD, origDur: round2(duration), finalDur, silences, keep, ffmpeg, rows }, null, 2));
  console.log("cutplan → " + outJson);
  console.log(`siguiente: preview + tabla a Sergio (node preview.mjs --video "${VIDEO || "in.mp4"}" --cutplan ${outJson})`);
}
