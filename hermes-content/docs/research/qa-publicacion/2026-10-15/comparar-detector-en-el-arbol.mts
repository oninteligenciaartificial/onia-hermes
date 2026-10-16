// Mide un detector de tú/vos CONTRA TEXTO REAL, no contra frases escritas a mano: recorre `app`, `components` y `lib` de un árbol
// y lista los textos que marca solo el viejo (el nuevo dejó pasar algo: regresión) y los que marca solo el nuevo (lo que corrige).
// Uso (un detector por carpeta, como en `comparar-detector-tu-y-vos.mts`):
//   git show origin/master:__tests__/voseo-ratchet.ts > old/voseo-ratchet.ts ; git show origin/pr-N:__tests__/voseo-ratchet.ts > new/voseo-ratchet.ts
//   git archive origin/master app components lib public | tar -x -C /ruta/arbol        # el árbol a medir, FUERA del repo
//   node --experimental-strip-types comparar-detector-en-el-arbol.mts /ruta/arbol
// Medido el 15-oct (#175, barrido 4): 51.859 textos de `master`; 0 que el nuevo deje pasar y 10 que el viejo no veía.
import * as viejo from "./old/voseo-ratchet.ts";
import * as nuevo from "./new/voseo-ratchet.ts";
import fs from "node:fs";
process.chdir(process.argv[2]);
const archivos = ["app", "components", "lib"].flatMap((c) => viejo.archivosDe(c));
const hits = (m: any, t: string) => new Set([...m.tuOVosEn(t), ...m.voseoEn(t)].map((x: string) => x.toLowerCase()));
let textos = 0, soloViejo: string[] = [], soloNuevo: string[] = [];
for (const a of archivos) {
  const codigo = fs.readFileSync(a, "utf8");
  for (const t of viejo.textosDeCodigo(codigo, a)) {
    textos++;
    const v = hits(viejo, t), n = hits(nuevo, t);
    const sv = [...v].filter((x) => !n.has(x)), sn = [...n].filter((x) => !v.has(x));
    if (sv.length) soloViejo.push(`${a} :: ${sv.join(",")} ← ${t.replace(/\s+/g, " ").slice(0, 90)}`);
    if (sn.length) soloNuevo.push(`${a} :: ${sn.join(",")} ← ${t.replace(/\s+/g, " ").slice(0, 90)}`);
  }
}
console.log(`archivos ${archivos.length}, textos ${textos}`);
console.log(`Los marca el VIEJO y el NUEVO ya no (más permisivo): ${soloViejo.length}`);
soloViejo.slice(0, 40).forEach((l) => console.log("  -", l));
console.log(`Los marca el NUEVO y el VIEJO no (más estricto): ${soloNuevo.length}`);
soloNuevo.slice(0, 60).forEach((l) => console.log("  +", l));
