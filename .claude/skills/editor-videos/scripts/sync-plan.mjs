// editor-videos — SINCRONÍA PALABRA → ELEMENTO (el corazón del método Remotion del reel).
//
// "A transcrição marca o tempo de cada palavra e cada palavra dispara um elemento em cena.
//  É por isso que o motion parece grudado na voz — porque está, literalmente."
//  (@human___academy, reel DbTxeqsBWST, 2026-07-27)
//
// Traduce un STORYBOARD escrito en palabras ("cuando diga 'seis doctores' entra la tarjeta")
// a un overlay-plan con TIMESTAMPS REALES sacados del transcript word-level. Sin esto los
// apoyos se ponen a ojo y el motion nunca queda pegado a la voz.
//
// Uso:
//   node sync-plan.mjs --segments scripts/segments.json --storyboard storyboard.json \
//        --out scripts/overlay-plan.json [--video renders/cut.mp4] [--hold 2.5] [--fade 0.3]
//
//   storyboard.json = { "beats": [
//     { "cue": "seis doctores", "asset": "assets/stat.png", "position": "top", "scale": 0.7 },
//     { "cue": "agenda", "asset": "assets/phone", "until": "next" },
//     { "at": 12.5, "asset": "assets/cta.png" }        // beat a tiempo fijo (sin cue)
//   ] }
//
// La salida la consume tal cual `overlay-visuals.mjs --plan`.
// Determinista: sin Date.now / Math.random. Sin dependencias externas.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";

// ---- normalización ---------------------------------------------------------
// El ASR devuelve "Seis", "seis," o "séis": para machear un cue hay que comparar
// el núcleo alfanumérico sin acentos ni puntuación. NFD + quitar diacríticos
// cubre español y portugués (el reel es en pt-BR).
export function normToken(t) {
  return String(t ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
}

export function tokenizeCue(cue) {
  return String(cue ?? "")
    .split(/\s+/)
    .map(normToken)
    .filter(Boolean);
}

// ---- macheo del cue contra el stream de palabras ---------------------------
// Monotónico: cada beat se busca DESDE la palabra donde quedó el anterior, así
// un cue repetido ("sistema") no dispara siempre en la primera aparición.
// Si no aparece hacia adelante, se busca desde el principio y se AVISA (el
// storyboard estaba fuera del orden de la narración) — nunca se inventa un tiempo.
export function matchCue(words, cueTokens, fromIndex = 0) {
  if (!cueTokens.length) return null;
  const find = (start) => {
    for (let i = start; i + cueTokens.length <= words.length; i++) {
      let ok = true;
      for (let j = 0; j < cueTokens.length; j++) {
        if (words[i + j].norm !== cueTokens[j]) {
          ok = false;
          break;
        }
      }
      if (ok) return i;
    }
    return -1;
  };
  let i = find(fromIndex);
  let outOfOrder = false;
  if (i < 0 && fromIndex > 0) {
    i = find(0);
    outOfOrder = i >= 0;
  }
  if (i < 0) return null;
  const first = words[i];
  const last = words[i + cueTokens.length - 1];
  return { index: i, endIndex: i + cueTokens.length - 1, start: first.start, end: last.end, outOfOrder };
}

// ---- armado del plan -------------------------------------------------------
// Reglas:
//  · start = tiempo de la PRIMERA palabra del cue + lead (lead negativo = anticipa)
//  · end   = start + hold, o el arranque del próximo beat si until:"next"
//  · nada se sale del video (clamp a duration) ni arranca antes de 0
//  · dos apoyos en la MISMA posición no se pisan: se acorta el anterior
export const MIN_VISIBLE = 0.4; // menos que esto no se llega a leer

export function buildOverlays(words, beats, opts = {}) {
  const hold = Number(opts.hold ?? 2.5);
  const fade = Number(opts.fade ?? 0.3);
  const lead = Number(opts.lead ?? 0);
  const duration = Number(opts.duration ?? 0);
  const gap = Number(opts.gap ?? 0.05); // aire entre dos apoyos de la misma posición

  const rows = [];
  const misses = [];
  const warnings = [];
  let cursor = 0;

  beats.forEach((beat, i) => {
    const label = beat.cue ? `"${beat.cue}"` : beat.at !== undefined ? `t=${beat.at}` : `beats[${i}]`;
    if (!beat.asset) {
      misses.push({ i, label, why: "el beat no tiene asset" });
      return;
    }
    let start;
    if (beat.cue) {
      const hit = matchCue(words, tokenizeCue(beat.cue), cursor);
      if (!hit) {
        misses.push({ i, label, why: "el cue no aparece en la narración" });
        return;
      }
      if (hit.outOfOrder) warnings.push(`beats[${i}] ${label} aparece ANTES del beat anterior (storyboard fuera de orden)`);
      cursor = hit.endIndex + 1;
      start = hit.start + Number(beat.lead ?? lead);
    } else if (Number.isFinite(Number(beat.at))) {
      start = Number(beat.at);
    } else {
      misses.push({ i, label, why: "el beat no tiene cue ni at" });
      return;
    }
    if (start < 0) start = 0;
    rows.push({
      i,
      label,
      cue: beat.cue ?? null,
      asset: beat.asset,
      start,
      hold: Number(beat.hold ?? hold),
      until: beat.until ?? null,
      position: beat.position ?? "center",
      scale: beat.scale,
      fade: Number(beat.fade ?? fade),
    });
  });

  // orden real de aparición (un beat at: puede caer antes que un cue)
  rows.sort((a, b) => a.start - b.start || a.i - b.i);

  // end: hold fijo o "hasta el próximo"
  rows.forEach((r, idx) => {
    const next = rows[idx + 1];
    r.end = r.until === "next" && next ? next.start - gap : r.start + r.hold;
    if (duration && r.end > duration) r.end = duration;
  });

  // anti-pisada por posición
  for (let a = 0; a < rows.length; a++) {
    for (let b = a + 1; b < rows.length; b++) {
      if (rows[b].position !== rows[a].position) continue;
      if (rows[b].start < rows[a].end) {
        const cut = rows[b].start - gap;
        warnings.push(
          `beats[${rows[a].i}] ${rows[a].label} se pisaba con beats[${rows[b].i}] ${rows[b].label} en "${rows[a].position}" → se acorta a ${cut.toFixed(2)}s`,
        );
        rows[a].end = cut;
      }
      break; // solo contra el siguiente de esa misma posición
    }
  }

  const dropped = [];
  const kept = rows.filter((r) => {
    if (r.end - r.start >= MIN_VISIBLE) return true;
    dropped.push({ i: r.i, label: r.label, why: `queda en ${(r.end - r.start).toFixed(2)}s (< ${MIN_VISIBLE}s, no se llega a leer)` });
    return false;
  });

  const overlays = kept.map((r) => {
    const ov = {
      asset: r.asset,
      start: Math.round(r.start * 1000) / 1000,
      end: Math.round(r.end * 1000) / 1000,
      position: r.position,
      fade: r.fade,
    };
    if (r.scale !== undefined) ov.scale = Number(r.scale);
    if (r.cue) ov.cue = r.cue;
    return ov;
  });

  return { overlays, rows: kept, misses: misses.concat(dropped), warnings };
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
    console.error("sync-plan: " + m);
    process.exit(1);
  };

  const SEGMENTS = flag("segments");
  const STORYBOARD = flag("storyboard");
  const OUT = flag("out");
  const VIDEO = flag("video");
  if (!SEGMENTS) fail("falta --segments <segments.json> (salida de ver-videos/transcribe.sh)");
  if (!STORYBOARD) fail("falta --storyboard <storyboard.json>");
  if (!existsSync(SEGMENTS)) fail(`no existe --segments: ${SEGMENTS}`);
  if (!existsSync(STORYBOARD)) fail(`no existe --storyboard: ${STORYBOARD}`);

  const data = JSON.parse(readFileSync(SEGMENTS, "utf8"));
  const words = (data.words || [])
    .map((w) => ({ start: +w.start, end: +w.end, word: String(w.word ?? w.text ?? "").trim() }))
    .filter((w) => w.word && Number.isFinite(w.start) && Number.isFinite(w.end))
    .sort((a, b) => a.start - b.start)
    .map((w) => ({ ...w, norm: normToken(w.word) }))
    .filter((w) => w.norm);
  if (!words.length) fail("segments.json sin words[] — la sincronía por palabra necesita timestamps word-level (verbose_json)");

  const sb = JSON.parse(readFileSync(STORYBOARD, "utf8"));
  const beats = Array.isArray(sb) ? sb : Array.isArray(sb.beats) ? sb.beats : null;
  if (!beats) fail("el storyboard necesita { beats: [ ... ] }");
  if (!beats.length) fail("el storyboard no tiene beats");

  // duración real del video (si lo pasan): nada se agenda fuera del clip
  let duration = Number(flag("duration", "0"));
  if (!duration && VIDEO && existsSync(VIDEO)) {
    const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", VIDEO], { encoding: "utf8" });
    if (r.status === 0) duration = Number(String(r.stdout).trim()) || 0;
  }

  const res = buildOverlays(words, beats, {
    hold: Number(flag("hold", "2.5")),
    fade: Number(flag("fade", "0.3")),
    lead: Number(flag("lead", "0")),
    gap: Number(flag("gap", "0.05")),
    duration,
  });

  // ---- tabla (REGLA DE ORO: se muestra antes de aplicar) --------------------
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(2).padStart(5, "0")}`;
  const clip = (t, n) => (t.length > n ? t.slice(0, n - 1) + "…" : t);
  let table = `\nSINCRONÍA PALABRA → ELEMENTO (mostrar a Sergio antes de aplicar)\n`;
  table += `narración ${words.length} palabras${duration ? `  ·  video ${duration.toFixed(2)}s` : ""}  ·  beats ${beats.length} → apoyos ${res.overlays.length}\n\n`;
  table += `#  | dispara en | entra   | sale    | dur   | posición     | apoyo\n`;
  table += `---+------------+---------+---------+-------+--------------+--------------------------\n`;
  res.rows.forEach((r, n) => {
    const cue = clip(r.cue ? `"${r.cue}"` : "t fijo", 10).padEnd(10);
    table += `${String(n + 1).padStart(2)} | ${cue} | ${fmt(r.start)} | ${fmt(r.end)} | ${((r.end - r.start).toFixed(2) + "s").padEnd(5)} | ${String(r.position).padEnd(12)} | ${String(r.asset).split(/[\\/]/).pop()}\n`;
  });
  console.log(table);

  // ---- honestidad: lo que NO entró se dice, no se esconde -------------------
  if (res.warnings.length) {
    console.log("AVISOS:");
    for (const w of res.warnings) console.log("  · " + w);
    console.log("");
  }
  if (res.misses.length) {
    console.log(`SIN SINCRONIZAR (${res.misses.length}):`);
    for (const m of res.misses) console.log(`  · beats[${m.i}] ${m.label} — ${m.why}`);
    console.log("  → corregí el cue con las palabras EXACTAS del transcript, o usá \"at\": <segundos>.\n");
  }

  if (!res.overlays.length) fail("ningún beat sincronizó: no hay plan que escribir");

  const plan = { source: SEGMENTS, storyboard: STORYBOARD, video: VIDEO ?? null, overlays: res.overlays };
  if (OUT) {
    mkdirSync(dirname(resolve(OUT)), { recursive: true });
    writeFileSync(OUT, JSON.stringify(plan, null, 2));
    console.log(`overlay-plan → ${OUT}`);
    console.log(`aplicar:  node overlay-visuals.mjs --video ${VIDEO ?? "<video.mp4>"} --plan ${OUT} --out renders/apoyos.mp4`);
  } else {
    console.log(JSON.stringify(plan, null, 2));
  }
}
