#!/usr/bin/env node
// Recalcula, desde el JSON de la Biblioteca, las cifras que citan la ficha del 10-oct, la skill §8.3 y ADQ §2.6.2.
//   node .claude/skills/onia-ventas-pauta/scripts/biblioteca-estadisticas.mjs [ruta-al-json]
// Sirve también para la re-medición del 24-oct: el mismo método sobre un JSON nuevo.
// «Lista completa» = anunciantes de los que se vio todo lo activo (campo lista_completa del JSON): solo ahí se comparan porcentajes.
import { readFileSync } from "node:fs";

const ruta = process.argv[2] || "hermes-content/research/competencia/anuncios/BIBLIOTECA-10OCT.json";
const d = JSON.parse(readFileSync(ruta, "utf8"));
const primero = (t) => t.split("|")[0].trim();
const largo = (t) => [...t].length; // puntos de código: un emoji cuenta 1 (con .length contaba 2)
// Fisher exacto de dos colas para una tabla 2×2 [[a,b],[c,d]] (¿la clase pesa distinto entre los que duran y los nuevos?)
const lnf = (n) => { let s = 0; for (let i = 2; i <= n; i++) s += Math.log(i); return s; };
const pHiper = (a, b, c, d) => Math.exp(lnf(a + b) + lnf(c + d) + lnf(a + c) + lnf(b + d) - lnf(a + b + c + d) - lnf(a) - lnf(b) - lnf(c) - lnf(d));
const fisher = (a, b, c, d) => { const p0 = pHiper(a, b, c, d); let s = 0; const r1 = a + b, c1 = a + c, n = a + b + c + d; for (let x = Math.max(0, r1 + c1 - n); x <= Math.min(r1, c1); x++) { const p = pHiper(x, r1 - x, c1 - x, n - r1 - c1 + x); if (p <= p0 + 1e-12) s += p; } return s; };
const mediana = (v) => { const s = [...v].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const cuartiles = (v) => { const s = [...v].sort((a, b) => a - b); const q = (p) => { const i = (s.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i); return s[lo] + (s[hi] - s[lo]) * (i - lo); }; return [q(0.25), q(0.5), q(0.75)]; };

// Clases del titular (un titular puede caer en varias). Mismas expresiones que el estudio del 10-oct.
const CLASES = [
  ["CTA en el titular", /demostraci|prueba|probá|pruébalo|demo|gratis|formulario|chatea/],
  ["IA / WhatsApp", /\bia\b|inteligencia|whatsapp|sofia|piloto/],
  ["inasistencias / citas perdidas", /inasisten|cancel|perder citas|ausenc|sin confirmar/],
  ["norma / legal", /1888|3100|normativ|cofepris|certificad|en regla|plazo|norma|rips|interoperab/],
  ["papel / orden", /carpeta|papel|ficha|historia|digitaliz|caos/],
  ["precio / cifra", /descuento|dcto|precio|\d+%/],
  ["control / aspiración", /paz mental|control|éxito|crece|sobrevive|cabinas llenas|trabaja contigo/],
];
const clasesDe = (t) => {
  const x = t.trim().toLowerCase();
  if (!x) return ["vacío"];
  const c = CLASES.filter(([, re]) => re.test(x)).map(([n]) => n);
  return c.length ? c : ["otro"];
};

const todos = Object.entries(d.software).flatMap(([n, s]) => s.anuncios.map((a) => ({ ...a, anunciante: n, completa: s.lista_completa })));
const completos = todos.filter((a) => a.completa);
const largos = completos.filter((a) => a.dias > 30);
const nuevos = completos.filter((a) => a.dias <= 30);
const pct = (n, t) => `${n} (${Math.round((100 * n) / t)} %)`;

console.log(`SOFTWARE: ${todos.length} anuncios vistos, ${todos.filter((a) => a.dias > 30).length} con más de 30 d`);
console.log(`LISTA COMPLETA: ${completos.length} anuncios, ${largos.length} con más de 30 d, ${nuevos.length} de 30 d o menos`);
for (const [nombre, g] of [["más de 30 d", largos], ["30 d o menos", nuevos]]) {
  const cuenta = {};
  for (const a of g) for (const c of clasesDe(a.titulo)) cuenta[c] = (cuenta[c] || 0) + 1;
  console.log(`  ${nombre} (n=${g.length}): ` + Object.entries(cuenta).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${pct(v, g.length)}`).join(" · "));
}
console.log("  CLASES entre los que duran: cuántos anuncios son copias del mismo titular o del mismo anunciante (no son independientes):");
for (const [clase] of CLASES) {
  const g = largos.filter((a) => clasesDe(a.titulo).includes(clase));
  if (!g.length) continue;
  const n2 = nuevos.filter((a) => clasesDe(a.titulo).includes(clase)).length;
  console.log(`    ${clase}: ${g.length} anuncios, ${new Set(g.map((a) => primero(a.titulo))).size} titulares, ${new Set(g.map((a) => a.anunciante)).size} anunciantes (${[...new Set(g.map((a) => a.anunciante))].join(", ")}); Fisher contra los de 30 d o menos p=${fisher(g.length, largos.length - g.length, n2, nuevos.length - n2).toFixed(3)}`);
}
const conTitular = (g) => g.filter((a) => a.titulo.trim() && a.titulo.trim() !== "{{product.name}}");
const lg = conTitular(largos).map((a) => primero(a.titulo));
const nv = conTitular(nuevos).map((a) => primero(a.titulo));
console.log(`TITULAR de los que pasan 30 d (n=${lg.length}): mediana ${mediana(lg.map(largo))} caracteres, ${mediana(lg.map((t) => t.split(/\s+/).length))} palabras, cuartiles ${cuartiles(lg.map(largo)).join("-")}; ${lg.filter((t) => largo(t) > 33).length} de ${lg.length} pasan de 33`);
console.log(`TITULAR de los de 30 d o menos (n=${nv.length}): mediana ${mediana(nv.map(largo))} caracteres, ${nv.filter((t) => largo(t) > 33).length} de ${nv.length} pasan de 33 (el largo NO distingue a los que duran)`);
const marca = lg.filter((t) => /doctocliq|citapro|dentalink|agendapro|reservo|calu|huli/i.test(t)).length;
console.log(`  con el nombre de la marca en el titular: ${marca} de ${lg.length}`);
console.log("TITULARES DISTINTOS por anunciante (lista completa):");
for (const [n, s] of Object.entries(d.software).filter(([, s]) => s.lista_completa)) {
  const t = {};
  for (const a of s.anuncios) { const k = primero(a.titulo); t[k] = (t[k] || 0) + 1; }
  console.log(`  ${n}: ${s.anuncios.length} anuncios, ${Object.keys(t).length} titulares, ${s.mas_de_30_dias} con más de 30 d, el más viejo ${s.mas_viejo_dias} d`);
}
const boTodos = d.bolivia_rubro || [];
const bo = d.bolivia_rubro_mas_de_30_dias;
const sinTit = (a) => !a.titulo.trim() || a.titulo.trim() === "{{product.name}}";
console.log(`BOLIVIA: ${boTodos.length} anuncios vistos; «Chatea con nosotros» en ${boTodos.filter((a) => /chatea con nosotros/i.test(a.titulo)).length}`);
console.log(`BOLIVIA más de 30 d: ${bo.length} anuncios de ${new Set(bo.map((a) => a.anunciante)).size} anunciantes, ${bo.filter(sinTit).length} sin titular`);
console.log(`  «Chatea con nosotros» o «Agenda tu cita» entre ellos: ${bo.filter((a) => /chatea con nosotros|agenda tu cita/i.test(a.titulo)).length}`);
