// editor-videos — REMAPEA el transcript del crudo a la línea de tiempo del CORTE.
//
// Después de cortar, los subtítulos necesitan los tiempos del video YA cortado. Volver a
// transcribir el corte es lento y frágil: sobre una pieza de 79s la llamada a Speaches se
// cayó con "fetch failed" (2026-07-30). Y es innecesario — el corte es determinista, así
// que los tiempos nuevos se CALCULAN: a cada palabra se le resta todo lo que se tiró antes.
//
// Uso:
//   node remap-transcript.mjs --segments scripts/segments.json --cutplan scripts/cutplan.json \
//        --out scripts/segments-cut.json
//
// Lo que cae dentro de un hueco tirado se DESCARTA y se reporta cuántas palabras se fueron.
// Determinista. Sin dependencias.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const n3 = (v) => Math.round(Number(v) * 1000) / 1000;

// keep[] (tiempos del crudo) -> bloques con el desplazamiento que hay que restar
export function buildBlocks(keep) {
  const blocks = [];
  let acc = 0; // duración ya conservada
  for (const k of [...keep].sort((a, b) => a.start - b.start)) {
    const start = Number(k.start);
    const end = Number(k.end);
    if (!(end > start)) continue;
    blocks.push({ start, end, offset: start - acc });
    acc += end - start;
  }
  return blocks;
}

// Devuelve el tiempo en el corte, o null si ese instante fue tirado.
export function mapTime(blocks, t, { clamp = false } = {}) {
  for (const b of blocks) {
    if (t >= b.start && t <= b.end) return n3(t - b.offset);
  }
  if (!clamp) return null;
  // para EXTREMOS de un segmento: si cayó en un hueco, se pega al borde más cercano
  let best = null;
  let bestDist = Infinity;
  for (const b of blocks) {
    for (const edge of [b.start, b.end]) {
      const d = Math.abs(edge - t);
      if (d < bestDist) {
        bestDist = d;
        best = n3(edge - b.offset);
      }
    }
  }
  return best;
}

export function remap(data, keep) {
  const blocks = buildBlocks(keep);
  const words = [];
  let dropped = 0;
  for (const w of data.words || []) {
    const s = mapTime(blocks, Number(w.start));
    const e = mapTime(blocks, Number(w.end));
    // la palabra viaja solo si SU ARRANQUE sobrevivió; el final se pega al borde
    if (s === null) {
      dropped++;
      continue;
    }
    words.push({ start: s, end: e === null ? mapTime(blocks, Number(w.end), { clamp: true }) : e, word: w.word });
  }
  const segments = [];
  for (const sg of data.segments || []) {
    const s = mapTime(blocks, Number(sg.start), { clamp: true });
    const e = mapTime(blocks, Number(sg.end), { clamp: true });
    if (s === null || e === null || !(e > s)) continue;
    segments.push({ start: s, end: e, text: String(sg.text || "").trim() });
  }
  // el corte puede partir un segmento en dos: se ordenan y se fusionan solapes mínimos
  segments.sort((a, b) => a.start - b.start);
  words.sort((a, b) => a.start - b.start);
  return { segments, words, dropped, total: (data.words || []).length };
}

// ---- CLI --------------------------------------------------------------------
const isMain = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("remap-transcript.mjs");
if (isMain) {
  const argv = process.argv.slice(2);
  const flag = (n, d) => {
    const i = argv.indexOf("--" + n);
    return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : d;
  };
  const fail = (m) => {
    console.error("remap-transcript: " + m);
    process.exit(1);
  };
  const SEG = flag("segments");
  const CUT = flag("cutplan");
  const OUT = flag("out");
  if (!SEG || !CUT || !OUT) fail("uso: --segments <segments.json> --cutplan <cutplan.json> --out <segments-cut.json>");
  if (!existsSync(SEG)) fail(`no existe --segments ${SEG}`);
  if (!existsSync(CUT)) fail(`no existe --cutplan ${CUT}`);

  const data = JSON.parse(readFileSync(SEG, "utf8"));
  const plan = JSON.parse(readFileSync(CUT, "utf8"));
  if (!Array.isArray(plan.keep) || !plan.keep.length) fail("el cutplan no tiene keep[]");
  if (!(data.words || []).length) fail("el transcript no tiene words[] (hace falta verbose_json)");

  const r = remap(data, plan.keep);
  const dur = plan.keep.reduce((a, k) => a + (k.end - k.start), 0);
  mkdirSync(dirname(resolve(OUT)), { recursive: true });
  writeFileSync(OUT, JSON.stringify({ ok: true, remapped_from: SEG, n_segments: r.segments.length, n_words: r.words.length, segments: r.segments, words: r.words }, null, 1));

  console.log(`\nREMAPEO A LA LÍNEA DEL CORTE`);
  console.log(`  bloques: ${plan.keep.length}  ·  dura ${n3(dur)}s`);
  console.log(`  palabras: ${r.total} → ${r.words.length}  (${r.dropped} cayeron en los huecos tirados)`);
  console.log(`  segmentos: ${(data.segments || []).length} → ${r.segments.length}`);
  console.log(`  → ${OUT}\n`);
  if (r.words.length && r.words[r.words.length - 1].end > dur + 0.2) {
    console.error(`AVISO: la última palabra termina en ${r.words[r.words.length - 1].end}s y el corte dura ${n3(dur)}s.`);
  }
}
