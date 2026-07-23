// editor-videos — arma la CUT-LIST desde una transcripción con timestamps (Speaches verbose_json).
// Detecta silencios (gaps entre segmentos), muletillas y repeticiones/trabadas, y decide qué se
// conserva. NO aplica nada: imprime la tabla para mostrar a Sergio (REGLA DE ORO) + escribe
// cutplan.json (keep[] + comando ffmpeg exacto).
//
// Uso: node cut-plan.mjs <segments.json> [--video in.mp4] [--gap 0.6]
//   <segments.json> = { segments:[{start,end,text}], words:[...] } (salida de ver-videos/transcribe.sh)
// Determinista: sin Date.now / Math.random.
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const getFlag = (name, def) => { const i = args.indexOf("--" + name); return i >= 0 ? args[i + 1] : def; };
const VIDEO = getFlag("video", "in.mp4");
const GAP = Number(getFlag("gap", "0.6"));           // silencio a recortar (s) entre segmentos
const FILLER = ["eh", "ehh", "em", "este", "esteee", "osea", "mmm", "mm", "aja", "ajá", "aver", "esdecir", "digamos", "pues", "bueno", "nada", "tipo"];
const MULTI = [["o sea", "osea"], ["a ver", "aver"], ["es decir", "esdecir"]];  // muletillas de 2 palabras → 1 token

function norm(t) { return (t || "").toLowerCase().replace(/[.,!?¿¡…"']/g, "").replace(/\s+/g, " ").trim(); }
function fillerRatio(t) {
  let s = norm(t);
  for (const [a, b] of MULTI) s = s.split(a).join(b);   // colapsar "o sea"→"osea" antes de tokenizar
  const toks = s.split(" ").filter(Boolean);
  if (!toks.length) return 1;
  const f = toks.filter((w) => FILLER.includes(w)).length;
  return f / toks.length;
}
// ¿cur es una trabada/repetición de next? (prefijo fuerte o casi-igual, y next no es más corto)
function isRetakeOf(cur, next) {
  const a = norm(cur), b = norm(next);
  if (!a || !b) return false;
  if (a === b) return true;
  const short = a.length <= b.length ? a : b, long = a.length <= b.length ? b : a;
  return long.startsWith(short) && short.length >= 6 && short.length / long.length >= 0.5;
}

const data = JSON.parse(await readFile(file, "utf8"));
const segs = (data.segments || []).map((s, i) => ({ i, start: +s.start, end: +s.end, text: (s.text || "").trim() }));
if (!segs.length) { console.error("sin segmentos"); process.exit(1); }

// Decidir por segmento
const rows = segs.map((s, idx) => {
  const next = segs[idx + 1];
  let keep = true, reason = "contenido";
  if (fillerRatio(s.text) >= 0.6) { keep = false; reason = "muletilla"; }
  else if (next && isRetakeOf(s.text, next.text)) { keep = false; reason = "trabada/repetida (me quedo con la 2da)"; }
  const gapAfter = next ? +(next.start - s.end).toFixed(2) : 0;
  return { ...s, keep, reason, gapAfter };
});

// keep[] = rangos de segmentos conservados (los silencios entre segmentos se caen solos)
const keep = rows.filter((r) => r.keep).map((r) => ({ start: +r.start.toFixed(2), end: +r.end.toFixed(2) }));

const origDur = +(segs[segs.length - 1].end - segs[0].start).toFixed(2);
const finalDur = +keep.reduce((a, k) => a + (k.end - k.start), 0).toFixed(2);
const nSilence = rows.filter((r) => r.gapAfter > GAP).length;

// Filtro ffmpeg: conservar solo los rangos keep y pegar sin huecos (select/aselect + setpts)
const between = keep.map((k) => `between(t,${k.start},${k.end})`).join("+");
const vf = `select='${between}',setpts=N/FRAME_RATE/TB`;
const af = `aselect='${between}',asetpts=N/SR/TB`;
const outMp4 = "renders/cut.mp4";
const ffmpeg = `ffmpeg -y -i "${VIDEO}" -vf "${vf}" -af "${af}" "${outMp4}"`;

// Tabla legible (REGLA DE ORO: mostrar a Sergio antes de aplicar)
const clip = (t, n = 54) => (t.length > n ? t.slice(0, n - 1) + "…" : t);
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(1).padStart(4, "0")}`;
let table = `\nCUT-LIST (mostrar a Sergio antes de aplicar)\n`;
table += `orig ${origDur}s → final ${finalDur}s  (−${(origDur - finalDur).toFixed(1)}s, ${nSilence} silencios recortados)\n\n`;
table += `#  | t       | decisión | motivo                          | texto\n`;
table += `---+---------+----------+---------------------------------+------------------------------\n`;
for (const r of rows) {
  table += `${String(r.i + 1).padStart(2)} | ${fmt(r.start)} | ${(r.keep ? "KEEP" : "CUT ").padEnd(8)} | ${r.reason.padEnd(31)} | ${clip(r.text)}\n`;
}
console.log(table);
console.log("ffmpeg:\n" + ffmpeg + "\n");

const outJson = join(dirname(file), "cutplan.json");
await writeFile(outJson, JSON.stringify({ video: VIDEO, gap: GAP, origDur, finalDur, nSilence, keep, ffmpeg, rows }, null, 2));
console.log("cutplan → " + outJson);
