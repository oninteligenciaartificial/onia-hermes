// Reconstruye keep[] desde los silencios ya medidos, con otro umbral.
// Usa la MISMA función que cut-plan.mjs para que el filtro salga idéntico.
import { readFile, writeFile } from "node:fs/promises";
import { speechFromSilence } from "../../../.claude/skills/editor-videos/scripts/cut-plan.mjs";

const [src, out, minSilArg] = process.argv.slice(2);
const minSil = Number(minSilArg ?? 0.6);
const base = JSON.parse(await readFile(src, "utf8"));
const sil = base.silences.filter((s) => s.end - s.start >= minSil);
const keep = speechFromSilence(sil, base.origDur, { pad: 0.08, minKeep: 0.35, join: 0.12 });
const finalDur = keep.reduce((a, b) => a + (b.end - b.start), 0);
const expr = keep.map((k) => `between(t,${k.start.toFixed(2)},${k.end.toFixed(2)})`).join("+");
const plan = { ...base, minSil, silences: sil, keep, finalDur: +finalDur.toFixed(2),
  ffmpeg: `-vf "select='${expr}',setpts=N/FRAME_RATE/TB" -af "aselect='${expr}',asetpts=N/SR/TB"` };
await writeFile(out, JSON.stringify(plan, null, 2));
console.log(`${out}  min-sil ${minSil}  bloques ${keep.length}  ${base.origDur}s -> ${finalDur.toFixed(2)}s (-${(base.origDur-finalDur).toFixed(1)}s)`);
