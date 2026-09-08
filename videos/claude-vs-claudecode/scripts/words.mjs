// Imprime las palabras con sus tiempos en un rango, marcando los huecos.
// Sirve para elegir a mano el punto de corte de un retake sin adivinar.
import { readFile } from "node:fs/promises";
const [file, a, b] = process.argv.slice(2);
const { words } = JSON.parse(await readFile(file, "utf8"));
let prev = null, line = [];
for (const w of words) {
  if (w.start < +a || w.start > +b) continue;
  const gap = prev === null ? 0 : w.start - prev;
  if (gap > 0.28) { if (line.length) console.log(line.join(" ")); console.log(`      ---- hueco ${gap.toFixed(2)}s ----`); line = []; }
  line.push(`${w.word}[${w.start.toFixed(2)}]`);
  if (line.length >= 8) { console.log(line.join(" ")); line = []; }
  prev = w.end;
}
if (line.length) console.log(line.join(" "));
