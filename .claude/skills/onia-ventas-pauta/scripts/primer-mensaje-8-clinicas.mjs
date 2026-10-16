#!/usr/bin/env node
// BORRADOR del primer mensaje a 8 clínicas dentales de Santa Cruz (sales-kit/PRIMER-MENSAJE-8-CLINICAS-11OCT.md), generado desde su JSON.
//   node .claude/skills/onia-ventas-pauta/scripts/primer-mensaje-8-clinicas.mjs
//
// ORIGEN (2026-10-11, MADRE MARKETING). Los hechos que cada mensaje cita (cuántos anuncios, desde cuándo, qué titular) y el estado de las
// filas de ONIA_PROMESA_VS_PRODUCTO.md de las que depende NO se teclean: se leen del JSON de la lista de clínicas y del propio doc de promesas.
// `scripts/primer-mensaje-8-clinicas.test.mjs` cruza el texto de cada mensaje contra esos datos y contra el detector de promesas de la web.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL("../../../../", import.meta.url));
export const MENSAJES_RUTA = "hermes-content/sales-kit/PRIMER-MENSAJE-8-CLINICAS-11OCT.json";
export const SALIDA_RUTA = "hermes-content/sales-kit/PRIMER-MENSAJE-8-CLINICAS-11OCT.md";
const PROMESAS_RUTA = "hermes-content/docs/ONIA_PROMESA_VS_PRODUCTO.md";
export const FILAS_DE_LAS_QUE_DEPENDE = ["B-01", "B-02", "C-01", "E-01", "G-01", "G-04", "G-06"];

const leer = (ruta) => readFileSync(new URL(ruta, `file://${raiz}`), "utf8");
const fechaLaPaz = (epoch) => new Date((epoch - 4 * 3600) * 1000).toISOString().slice(0, 10);
const esc = (s) => String(s).replace(/\|/g, "\\|");

/** Estado de una fila de la tabla larga de ONIA_PROMESA_VS_PRODUCTO.md: la primera cuyo 4.º campo empieza con un emoji de estado. */
export function estadoDeFila(promesas, id) {
  const re = new RegExp(`^\\| ${id} \\| [^|]+ \\| [^|]+ \\| ([^|]+) \\|`, "gm");
  for (const m of promesas.matchAll(re)) if (/^(✅|🟡|❌|🚫|⬜)/u.test(m[1].trim())) return m[1].trim();
  return "sin fila en el doc";
}

export function render() {
  const datos = JSON.parse(leer(MENSAJES_RUTA));
  const lista = JSON.parse(leer(datos.meta.fuente_de_datos));
  const promesas = leer(PROMESAS_RUTA);
  const porId = new Map(lista.paginas.map((p) => [p.page_id, p]));
  const estados = FILAS_DE_LAS_QUE_DEPENDE.map((id) => [id, estadoDeFila(promesas, id)]);
  const abierta = estados.some(([, e]) => !e.startsWith("✅"));
  const candidatas = datos.clinicas.filter((c) => c.estado === "Candidata").length;

  const secciones = datos.clinicas
    .map((c, i) => {
      const p = porId.get(c.page_id);
      const n = p.starts.length;
      const q = datos.meta.pregunta[c.pregunta];
      return `### ${i + 1}. ${c.nombre} · ${c.estado === "Candidata" ? "candidata" : "**condicional: no se envía hasta confirmar**"}

- **Dato de su pauta** (Biblioteca, \`page_id\` ${c.page_id}, leído el 11-oct): ${n} ${n === 1 ? "anuncio activo" : "anuncios activos"} en ${p.moneda}, el más viejo del ${fechaLaPaz(p.starts[0])}. ${esc(c.hecho)}.
- **Canal propuesto:** ${esc(c.canal.principal)}. Fuente: ${esc(c.canal.fuente)}. Alternativa: ${esc(c.canal.alternativa)}. **Lo envía Sergio Urcullo desde su WhatsApp**, no desde el número del bot (fuera de las 24 h no sale texto libre).
- **Pregunta de calificación:** ${c.pregunta === "P1" ? "1" : "2"} de \`ONIA_CLIENTE_IDEAL.md\` §9 — ${esc(q)}
- **Condición de salida:** ${esc(c.salida)}.${c.opcional ? `\n- **Línea opcional**, solo si se confirma hoy desde la PC (no está en el mensaje porque no sale de la Biblioteca): «${esc(c.opcional)}».` : ""}

${c.mensaje
  .split("\n")
  .map((l) => `> ${l}`)
  .join("\n>\n")}
`;
    })
    .join("\n");

  return `# LISTA PARA MOSTRAR: primer mensaje 8 clínicas

> **11-oct-2026 · Ventas y pauta · encargo de la MADRE MARKETING.** **BORRADORES: no se envió nada, nadie fue contactado. Enviarlos lo decide Sergio Urcullo, con el mensaje y el canal exactos de cada uno** (\`ONIA_ADQUISICION_Y_PAUTA.md\` §3). De usted. Ninguno menciona el tratamiento a medias (§5.4), precio, minutos de llamada, «clínica de ejemplo» ni IA.
> Los datos que cada mensaje cita salen de \`research/competencia/anuncios/CLINICAS-SCZ-CON-PAUTA-11OCT.json\`; este archivo lo genera \`.claude/skills/onia-ventas-pauta/scripts/primer-mensaje-8-clinicas.mjs\`.

## 0. Cambio respecto del pedido: no son «las 8 de encaje Alto»

La madre pidió mensajes para las 8 clínicas de «encaje Alto» de la lista de las 12:40 UTC. **Esa lista estaba mal**: puntuó «Alta» a las clínicas con varias sedes o muchos anuncios, y **seis de esas ocho ya estaban descartadas con evidencia** en \`ONIA_PROSPECTOS_DENTAL_SCZ.md\`: Imagina (cadena de 4 sucursales, §6.2), Cortez (multi-sede, §6.6), MUN y Boquita Sana (2 sedes, §6.7 y §6.9), Ortobom (red de sedes, §6.9) y Europea (Cochabamba, §6.9). Un mensaje a cualquiera de ellas sería escribirle a quien no es el cliente ideal (2 a 6 profesionales), o a otra ciudad. La lista se corrigió (ya no hay «Alta») y **estos 8 son los que sobreviven**: ${candidatas} **candidatas** (la verificación previa dice SIGUE, pautan hoy y tienen Santa Cruz verificada) y ${datos.clinicas.length - candidatas} **condicionales** (Santa Cruz por el nombre o un fragmento, tamaño sin dato).

## 1. La compuerta: no se envía mientras las promesas del mensaje no estén en ✅

Los 8 mensajes dicen lo mismo del producto: agenda, ficha del paciente y cobros, y que cada mañana deja anotado a quién escribirle (por ejemplo quién tiene cita mañana y no confirmó) con el mensaje listo, sin que nada salga sin aprobación. Eso descansa en estas filas de \`ONIA_PROMESA_VS_PRODUCTO.md\`, leídas del archivo al generar este borrador:

| Fila | Qué se dice | Estado hoy |
|---|---|---|
${estados
  .map(([id, e]) => `| ${id} | ${{ "B-01": "agenda del día con paciente, hora y profesional", "B-02": "cada cita muestra si está confirmada o sin confirmar", "C-01": "ficha del paciente", "E-01": "cobros con saldo", "G-01": "nada sale sin que usted lo apruebe", "G-04": "cada mañana le deja anotado a quién escribirle", "G-06": "quién tiene cita mañana y no confirmó" }[id]} | ${e} |`)
  .join("\n")}

**${abierta ? "Compuerta abierta: no enviar." : "Compuerta cerrada: las seis filas están en ✅."}** ${abierta ? "Con la cuenta demo de Plataforma (12-oct) se verifican y esta tabla se actualiza sola al regenerar. **Tensión entre documentos:** \`ONIA_ADQUISICION_Y_PAUTA.md\` §7 dice que producción no «confirma citas desde el panel» hasta publicar la 1.0, y estos mensajes hablan de «quién tiene cita mañana y no confirmó» (G-06, que descansa en B-02): hasta verlo en producción, no se envía. Además, para mostrar «cómo se ve» hace falta esa cuenta demo con datos (L-05); el mensaje no promete una duración (L-04) ni una «clínica de ejemplo»." : ""}

## 2. Antes de enviar cada uno (unos 3 minutos por clínica, desde la PC)

1. Abrir su Facebook o el anuncio y confirmar que sigue activo y que el número abre WhatsApp. Los números salen de los docs del 1 al 8-oct, no de hoy.
2. Contar profesionales (pregunta 1). Si pasa de 6, o es uno solo, sale.
3. Releer la línea «Vi que…» contra lo que se ve ese día; si cambió, se corrige esa línea y no se envía con un dato viejo.
4. Si la clínica ya respondió antes (\`ONIA_LEADS_ESPERANDO.md\`), no se le escribe dos veces.

## 3. Los 8 borradores

${secciones}
## 4. Verificación

${verificacion(datos)}

## 5. Qué depende de quién

| Qué | Quién |
|---|---|
| Elegir a cuáles enviar y aprobar mensaje y canal de cada uno | Sergio Urcullo |
| Abrir los anuncios y páginas desde la PC (número que abre WhatsApp, cuántos profesionales, «Clarident Duo», Natural Smile y ROCHA) | La madre en la PC |
| Cuenta demo con datos y verificar B-01, C-01, E-01, G-01, G-04, G-06 | Plataforma (12-oct) y Ventas y pauta |
| Decidir 20 o 30 minutos (L-04) antes de nombrar una duración en cualquier mensaje | Sergio Urcullo |
`;
}

function verificacion(datos) {
  const v = datos.meta.verificacion;
  if (!v) return "_Pendiente: detector de promesas de la web y revisor `haiku` independiente._";
  return `- **Detector de promesas de la web** (\`promesa-que-el-producto-cumple.mjs\`): ${v.detector}.
- **Revisor independiente (\`haiku\`, ${v.fecha}):** ${v.haiku}
- **Pruebas automáticas** (\`scripts/primer-mensaje-8-clinicas.test.mjs\`): cada dato citado (anuncios, fechas, titulares) coincide con la Biblioteca transcripta; de usted; una sola pregunta; sin precio, minutos, «ejemplo», IA ni tratamiento a medias.`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  writeFileSync(`${raiz}${SALIDA_RUTA}`, render());
  console.log(`${SALIDA_RUTA} escrito`);
}
