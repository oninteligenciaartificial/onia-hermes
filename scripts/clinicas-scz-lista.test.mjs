// La lista de clínicas dentales con pauta (CLINICAS-SCZ-CON-PAUTA-11OCT.md) sale de su JSON y el JSON de las consultas del conector.
//   node --test scripts/clinicas-scz-lista.test.mjs
//
// ORIGEN (2026-10-11, MADRE MARKETING, «la señal más barata»). Una lista de ~60 filas con cifras tecleadas se desactualiza o se
// equivoca en silencio; acá el .md se GENERA y este test exige (1) que el archivo versionado sea lo que genera el script, (2) que los
// anuncios transcriptos de cada consulta por page_ids sumen el total que dio la Biblioteca (un error de tecleo aparece como «no suma»),
// (3) que la lista no afirme lo que la Biblioteca no puede decir (ciudad, las 5 preguntas) ni invite a contactar sin el OK.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { DATOS_RUTA, render, SALIDA_RUTA } from "../.claude/skills/onia-ventas-pauta/scripts/clinicas-scz-lista.mjs";

const leer = (ruta) => readFileSync(new URL(`../${ruta}`, import.meta.url), "utf8");
const datos = JSON.parse(leer(DATOS_RUTA));

test("el .md versionado es lo que genera el script (si cambia el JSON, hay que regenerarlo)", () => {
  assert.equal(leer(SALIDA_RUTA), render(), "node .claude/skills/onia-ventas-pauta/scripts/clinicas-scz-lista.mjs");
});

test("los anuncios transcriptos de cada consulta por page_ids suman el total que dio la Biblioteca", () => {
  const consultas = datos.meta.consultas_por_page_ids;
  assert.equal(consultas.length, 7);
  for (const c of consultas) {
    const suma = datos.paginas.filter((p) => c.ids.includes(p.page_id)).reduce((a, p) => a + p.starts.length, 0);
    assert.equal(suma, c.total, `consulta de ${c.ids.slice(0, 2).join(",")}…: suman ${suma}, la Biblioteca dio ${c.total}`);
  }
});

test("cada página completa sale de una consulta por page_ids; las incompletas llevan completo=false", () => {
  const enConsultas = new Set(datos.meta.consultas_por_page_ids.flatMap((c) => c.ids));
  for (const p of datos.paginas) {
    if (p.completo) assert.ok(enConsultas.has(p.page_id), `${p.nombre} dice completo y no está en ninguna consulta por page_ids`);
    else assert.ok(!enConsultas.has(p.page_id), `${p.nombre} está en una consulta por page_ids y dice incompleto`);
    assert.ok(p.starts.length > 0 && p.starts.every((t) => t > 1.7e9 && t <= datos.meta.corte_epoch), `${p.nombre}: fechas fuera de rango`);
  }
  const ids = datos.paginas.map((p) => p.page_id);
  assert.equal(new Set(ids).size, ids.length, "page_id repetido");
});

test("ninguna página se cuenta dos veces entre la lista y las excluidas", () => {
  const ids = new Set(datos.paginas.map((p) => p.page_id));
  for (const e of datos.excluidas) for (const id of e.page_id.split(" · ")) assert.ok(!ids.has(id), `${e.nombre} (${id}) está en la lista y en las excluidas`);
});

test("la lista dice lo que no puede decir y no manda contactar sin el OK de Sergio Urcullo", () => {
  const md = render();
  assert.match(md, /Nadie fue contactado/);
  assert.match(md, /OK escrito de Sergio Urcullo/);
  assert.match(md, /La Biblioteca no da ubicación/);
  assert.match(md, /No contesta ninguna de las 5 preguntas/);
  assert.match(md, /no califica a nadie/);
  assert.ok(!/Santa Cruz confirmada|ciudad confirmada/i.test(md), "no afirma ciudad confirmada");
  assert.ok(!/contactar (a )?(ya|ahora|hoy)\b/i.test(md), "no manda contactar ya");
  assert.ok(!/\b(Seguro|garantizad[oa]|califican? seguro)\b/i.test(md), "no promete calificación");
});

test("el resumen cuenta lo mismo que las tablas (clínicas con indicio de Santa Cruz, encaje Alta)", () => {
  const md = render();
  const tabla = md.split("## 2.")[1].split("## 3.")[0];
  const filas = tabla.split("\n").filter((l) => l.startsWith("| **") && !l.startsWith("| **Clínica |"));
  const alta = filas.filter((l) => /\*\*Alta\*\*:/.test(l)).length;
  assert.match(md, new RegExp(`${filas.length} con Santa Cruz en el nombre o en la búsqueda`));
  assert.match(md, new RegExp(`encaje visible \\*\\*Alta ${alta}\\*\\*`));
});
