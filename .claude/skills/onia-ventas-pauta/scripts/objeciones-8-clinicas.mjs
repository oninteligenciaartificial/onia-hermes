#!/usr/bin/env node
// Respuestas preparadas a las 5 objeciones más probables de las clínicas (sales-kit/OBJECIONES-8-CLINICAS-11OCT.md), generado desde su JSON.
//   node .claude/skills/onia-ventas-pauta/scripts/objeciones-8-clinicas.mjs
//
// ORIGEN (2026-10-11, MADRE MARKETING). Los precios y los planes NO se escriben a mano: se LEEN de onia-platform (`lib/subscription-plans.ts`,
// `lib/plan-catalogo.ts`, `lib/pricing.ts`, del ref publicado, y si no se encuentra el repo TIRA: no se saltea). El estado de cada fila de la que depende
// una respuesta se lee de ONIA_PROMESA_VS_PRODUCTO.md al generar.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { fuenteDePlataforma, repoPlataforma } from "../../../../hermes-content/deploy/vps-ops/bot/fuente-plataforma.mjs";
import { estadoDeFila } from "./primer-mensaje-8-clinicas.mjs";

const raiz = fileURLToPath(new URL("../../../../", import.meta.url));
export const OBJECIONES_RUTA = "hermes-content/sales-kit/OBJECIONES-8-CLINICAS-11OCT.json";
export const SALIDA_RUTA = "hermes-content/sales-kit/OBJECIONES-8-CLINICAS-11OCT.md";
const leer = (ruta) => readFileSync(new URL(ruta, `file://${raiz}`), "utf8");
const esc = (s) => String(s).replace(/\|/g, "\\|");
const bs = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** Planes de la venta: precio mensual, nombre que ve el cliente y usuarios, leídos del código publicado de onia-platform. */
export function planesDelCodigo() {
  const repo = repoPlataforma();
  const planes = fuenteDePlataforma(repo, "subscription-plans.ts");
  const desde = planes.indexOf("export const DEFAULT_PLAN_AMOUNTS");
  if (desde < 0) throw new Error("no existe DEFAULT_PLAN_AMOUNTS en subscription-plans.ts");
  const precios = {};
  for (const m of planes.slice(desde, planes.indexOf("};", desde)).matchAll(/(\w+):\s*\{\s*monthly:\s*(\d+)/g)) precios[m[1]] = Number(m[2]);
  const pricing = fuenteDePlataforma(repo, "pricing.ts");
  const dLab = pricing.indexOf("export const PLAN_LABELS");
  if (dLab < 0) throw new Error("no existe PLAN_LABELS en pricing.ts");
  const etiquetas = Object.fromEntries([...pricing.slice(dLab, pricing.indexOf("} as const", dLab)).matchAll(/(\w+):\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]));
  const catalogo = fuenteDePlataforma(repo, "plan-catalogo.ts");
  const usuarios = {};
  for (const m of catalogo.matchAll(/^  (\w+): \{\s*\n\s*patients: (-?\d+),\s*\n\s*users: (-?\d+)/gm)) usuarios[m[1]] = Number(m[3]);
  return { precios, etiquetas, usuarios };
}

/** Rellena los {{marcadores}} con un caso: N personas, plan y precio del código. */
export function conCaso(texto, caso) {
  return texto.replace("{{N}}", caso.n).replace("{{PLAN}}", caso.plan).replace("{{PRECIO}}", bs(caso.precio));
}
export function casosDePrecio(datos, codigo) {
  return datos.meta.tamanos.map((t) => ({ personas: t.personas, n: t.personas.replace(/^hasta /, "").replace(" o más", ""), clave: t.plan, plan: codigo.etiquetas[t.plan], precio: codigo.precios[t.plan], usuarios: codigo.usuarios[t.plan] }));
}

export function render() {
  const datos = JSON.parse(leer(OBJECIONES_RUTA));
  const promesas = leer("hermes-content/docs/ONIA_PROMESA_VS_PRODUCTO.md");
  const codigo = planesDelCodigo();
  const casos = casosDePrecio(datos, codigo);
  const estado = (id) => estadoDeFila(promesas, id);
  const peor = (filas, sinFila = []) => {
    const e = filas.map(estado);
    if (e.some((x) => x.startsWith("❌"))) return "❌ no";
    if (e.every((x) => x.startsWith("✅"))) return sinFila.length ? `🟡 en parte: las filas están en ✅, pero ${sinFila.length} dato${sinFila.length === 1 ? "" : "s"} no tiene${sinFila.length === 1 ? "" : "n"} fila (ver abajo)` : "✅ se puede decir hoy";
    return `⬜/🟡 después de la compuerta (${filas.filter((f) => !estado(f).startsWith("✅")).join(", ")})${sinFila.length ? " y datos sin fila" : ""}`;
  };
  const secciones = datos.objeciones
    .map((o, i) => {
      const resp = o.respuesta;
      return `### ${i + 1}. «${o.objecion}»

**Hoy (solo lo que está en ✅):**

> ${resp}${o.pregunta_de_vuelta ? `\n>\n> *Pregunta de vuelta:* ${o.pregunta_de_vuelta}` : ""}${o.si_insiste ? `\n>\n> *Si insiste:* ${o.si_insiste}` : ""}
${o.despues ? `\n**Se agrega recién cuando ${[...o.despues_filas.map((f) => `${f} (${estado(f).split(":")[0]})`), ...o.despues_sin_fila].join(" · ")}:**\n\n> ${o.despues}\n` : ""}
- **Se puede decir:** ${peor(o.filas, o.sin_fila)}.${o.sin_fila.length ? ` Sin fila en el doc de promesas: ${o.sin_fila.map(esc).join("; ")}.` : ""}${o.de_la_politica.length ? ` Sale de la política de privacidad publicada (no hay fila en el doc de promesas): ${o.de_la_politica.map(esc).join("; ")}.` : ""} Filas de \`ONIA_PROMESA_VS_PRODUCTO.md\`: ${o.filas.map((f) => `${f} ${estado(f).split(":")[0]}`).join(" · ")}. Catálogo: ${esc(o.catalogo)}.
- **Cómo se usa:** ${esc(o.como_se_usa)}
- **No se dice:** ${o.no_se_dice.map(esc).join("; ")}.
${o.id === "precio" ? `\n**Qué se pone en los marcadores** (precios leídos de \`onia-platform\` \`lib/subscription-plans.ts\`, nombres de \`lib/pricing.ts\`, usuarios de \`lib/plan-catalogo.ts\`):\n\n| Si dice… | {{N}} | {{PLAN}} | {{PRECIO}} (Bs/mes) | Tope de usuarios del plan |\n|---|---|---|---|---|\n${casos.map((c) => `| ${c.personas} personas | ${c.n} | ${c.plan} | ${bs(c.precio)} | ${c.usuarios < 0 ? "sin tope" : c.usuarios} |`).join("\n")}\n\n⚠️ **Crece = 4 usuarios** está en el código publicado; el catálogo anota que el release de producción pudo traer 3: antes de cotizar Crece para 4 personas, mirar \`onia.com.bo/precios\` ese día.\n` : ""}`;
    })
    .join("\n");

  return `# LISTA PARA MOSTRAR: objeciones

> **11-oct-2026 · Ventas y pauta · encargo de la MADRE MARKETING.** **BORRADOR para Sergio Urcullo: nada se envió, nadie fue contactado.** Respuestas de usted, cortas, a las 5 objeciones más probables de las clínicas que contesten el primer mensaje (\`PRIMER-MENSAJE-8-CLINICAS-11OCT.md\`). Cada frase se cruzó con \`ONIA_CATALOGO_DE_VENTA.md\` y con las filas de \`ONIA_PROMESA_VS_PRODUCTO.md\`; **lo que no está en ✅ queda marcado y no se dice hasta que lo esté**. Este archivo lo genera \`.claude/skills/onia-ventas-pauta/scripts/objeciones-8-clinicas.mjs\` desde su \`.json\`.
> **La factura SIAT no se promete ni se nombra como futura** (catálogo §7). Los **precios se leen de \`onia-platform\`** al generar, no se escriben a mano.

## 0. Resumen: qué se puede decir hoy y qué espera

| # | Objeción | Se puede decir |
|---|---|---|
${datos.objeciones.map((o, i) => `| ${i + 1} | ${esc(o.objecion)} | ${peor(o.filas, o.sin_fila)} |`).join("\n")}

## 1. Las 5 respuestas

${secciones}
${verificacion(datos)}
## 2. Qué depende de quién

| Qué | Quién |
|---|---|
| Elegir cuándo usarlas y con qué clínica | Sergio Urcullo |
| Decidir 20 o 30 minutos (L-04) antes de nombrar una duración | Sergio Urcullo |
| Cuenta demo con datos y verificar E-01, G-01, G-04 | Plataforma (12-oct) y Ventas y pauta |
| Confirmar «copias de seguridad diarias» con el log del respaldo del VPS | Quien tenga el VPS (la madre) |
`;
}

function verificacion(datos) {
  const v = datos.meta.verificacion;
  return `\n## Verificación\n\n${v ? `- **Detector de promesas de la web:** ${v.detector}.\n- **Revisor independiente (\`haiku\`, ${v.fecha}):** ${v.haiku}\n- **Pruebas automáticas** (\`scripts/objeciones-8-clinicas.test.mjs\`): precios y planes iguales a los de \`onia-platform\`; de usted; cortas; sin SIAT como promesa, sin duración de llamada, sin «ejemplo».` : "_Pendiente: detector de promesas de la web y revisor `haiku` independiente._"}\n\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  writeFileSync(`${raiz}${SALIDA_RUTA}`, render());
  console.log(`${SALIDA_RUTA} escrito`);
}
