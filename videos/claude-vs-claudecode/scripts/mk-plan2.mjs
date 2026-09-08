// cutplan de silencios + los cortes de retake, restados con la misma funcion que usa la skill.
import { readFile, writeFile } from "node:fs/promises";
import { speechFromSilence, subtractRanges } from "../../../.claude/skills/editor-videos/scripts/cut-plan.mjs";

const [src, retakesFile, out, minSilArg] = process.argv.slice(2);
const minSil = Number(minSilArg ?? 0.6);
const base = JSON.parse(await readFile(src, "utf8"));
const retakes = JSON.parse(await readFile(retakesFile, "utf8")).cortes;

const sil = base.silences.filter((s) => s.end - s.start >= minSil);
const porSilencio = speechFromSilence(sil, base.origDur, { pad: 0.08, minKeep: 0.35, join: 0.12 });
const keep = subtractRanges(porSilencio, retakes, 0.35);

const durSil = porSilencio.reduce((a, b) => a + (b.end - b.start), 0);
const durFin = keep.reduce((a, b) => a + (b.end - b.start), 0);
const expr = keep.map((k) => `between(t,${k.start.toFixed(2)},${k.end.toFixed(2)})`).join("+");
await writeFile(out, JSON.stringify({ ...base, minSil, silences: sil, retakes, keep,
  finalDur: +durFin.toFixed(2),
  ffmpeg: `-vf "select='${expr}',setpts=N/FRAME_RATE/TB" -af "aselect='${expr}',asetpts=N/SR/TB"` }, null, 2));
console.log(`${base.origDur}s → ${durSil.toFixed(2)}s (solo silencios) → ${durFin.toFixed(2)}s (con retakes)`);
console.log(`bloques ${keep.length}  ·  retakes tirados ${(durSil - durFin).toFixed(2)}s`);
