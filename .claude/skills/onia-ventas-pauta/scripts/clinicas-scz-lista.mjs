#!/usr/bin/env node
// Lista de clínicas dentales de Santa Cruz que pautan HOY en la Biblioteca de Meta (datos: CLINICAS-SCZ-CON-PAUTA-11OCT.json).
//   node .claude/skills/onia-ventas-pauta/scripts/clinicas-scz-lista.mjs            → escribe el .md
//
// ORIGEN (2026-10-11, MADRE MARKETING: «la señal más barata, ADQ §3»). Las cifras de la lista (anuncios, días, cuántas páginas) NO se
// teclean: salen del JSON que se transcribió de las consultas del conector `Meta_ads` (solo lectura). Mismo patrón que la planilla:
// el .md se genera y `scripts/clinicas-scz-lista.test.mjs` exige que el archivo versionado sea lo que el generador produce.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL("../../../../", import.meta.url));
export const DATOS_RUTA = "hermes-content/research/competencia/anuncios/CLINICAS-SCZ-CON-PAUTA-11OCT.json";
export const SALIDA_RUTA = "hermes-content/research/competencia/anuncios/CLINICAS-SCZ-CON-PAUTA-11OCT.md";

// Páginas hermanas: una clínica con dos páginas se muestra como una fila (la suma de sus anuncios).
const GRUPOS = [
  { nombre: "Ortobom Odontología (Santa Cruz de la Sierra + Mutualista)", ids: ["103822665275137", "110177058793289"] },
  { nombre: "Boquita Sana (Dentofacial + Sucursal Udabol)", ids: ["380639486016768", "100226682495467"] },
  { nombre: "MUN (Clínica Odontología Especializada + Odontopediatría)", ids: ["572588712615373", "108942198437850"] },
  { nombre: "Doctormaxilofacial (Odontología Avanzada + Doctormaxilofacial)", ids: ["511897128678646", "102844034875276"] },
];
// Lo que ya estaba en ONIA_PROSPECTOS_DENTAL_SCZ.md §5.1 (30-sep) con su page_id.
const DEL_30_SEP = new Map([
  ["111017921072549", "#9 de los 20 prospectos"], ["662533600624550", "#1 de los 20 prospectos"], ["447192008650376", "§5.1"], ["572588712615373", "§5.1"],
  ["113481741822891", "§5.1"], ["169289006270602", "§5.1"], ["110445244840996", "§5.1"], ["100193878311097", "§5.1"], ["758264870991469", "§5.1"],
  ["920721404450647", "§5.1"], ["1709119185977006", "§5.1"], ["756968257500768", "§5.1"], ["255332044891977", "§5.1"], ["109306495537111", "§5.1"],
  ["608572659242258", "§5.1"], ["697014900382758", "§5.1"], ["787098867820512", "§5.1"], ["625324393996576", "§5.1 (hipótesis DS)"],
  ["1732856310310270", "§5.1"], ["1008202805702373", "§5.1"],
]);
const SIN_ADS_HOY = [
  ["Clínica Dental San Pedro", "662533600624550", "#1 de los 20 prospectos; 23-sep con clic a WhatsApp"],
  ["Clínica Dental \"DS\"", "625324393996576", "hipótesis: el lead de la conversación 36 (`ds-santacruz.bo`). **Ya no paga pauta activa**"],
  ["Stildent Santa Cruz", "110445244840996", "hay otra página «Clinica Dental Stildent» (918559771552554) con 2 anuncios, a verificar si es la misma"],
  ["Clínica Dental Vid", "920721404450647", "—"], ["DÚO Consultorio Dental", "109306495537111", "—"], ["Clínica Dental Sanident", "787098867820512", "—"],
];

const fechaLaPaz = (epoch) => new Date((epoch - 4 * 3600) * 1000).toISOString().slice(0, 10);
const dias = (corte, epoch) => Math.round((corte - epoch) / 86400);
const esc = (s) => String(s).replace(/\|/g, "\\|");

function agrupar(paginas) {
  const usados = new Set();
  const filas = [];
  for (const g of GRUPOS) {
    const miembros = paginas.filter((p) => g.ids.includes(p.page_id));
    if (!miembros.length) continue;
    miembros.forEach((m) => usados.add(m.page_id));
    const base = miembros[0];
    filas.push({ ...base, nombre: g.nombre, page_id: miembros.map((m) => m.page_id).join(" · "), starts: miembros.flatMap((m) => m.starts).sort(), titulos: [...new Set(miembros.flatMap((m) => m.titulos))], whatsapp: miembros.some((m) => m.whatsapp), sedes: miembros.length, ids: miembros.map((m) => m.page_id) });
  }
  for (const p of paginas) if (!usados.has(p.page_id)) filas.push({ ...p, sedes: 1, ids: [p.page_id] });
  return filas;
}

// Veredicto con la evidencia que YA estaba en el repo (ONIA_PROSPECTOS_DENTAL_SCZ.md §6.2, §6.5-§6.9). Nunca se puntúa por cantidad de
// anuncios ni por sedes: varias sedes o una cadena SACAN a la clínica (el cliente ideal es de 2 a 6 profesionales, ONIA_CLIENTE_IDEAL.md).
// Error del 11-oct: la primera versión de esta lista puntuó «Alta» a las multi-sede (Cortez, Ortobom, MUN, Boquita, Imagina) y a Europea
// (Cochabamba), todas ya descartadas con evidencia en esos docs. Antes de ordenar, se lee lo que ya se verificó.
function clasificar(f) {
  const e = f.previo_estado;
  if (e === "SALE") return ["Fuera", f.previo_texto];
  if (e === "SIGUE") return ["Candidata", f.previo_texto];
  if (e === "ESPERA") return ["A verificar", f.previo_texto];
  if (f.tipo === "otro") return ["A verificar", "no está claro quién es ni si es clínica"];
  return ["A verificar", "no estaba en las listas previas: ciudad y tamaño sin verificar"];
}
const ORDEN = { Candidata: 0, "A verificar": 1, Fuera: 2 };

function evidenciaCiudad(f, consultas) {
  if (f.ciudad === "verificada") return "Santa Cruz verificada en los docs previos (directorio o web)";
  if (f.ciudad === "nombre") return "Santa Cruz en el nombre de la página (o su zona)";
  const q = (f.consultas || []).filter((c) => c !== "Q4").map((c) => `«${consultas[c]}»`);
  if (q.length) return `salió con ${q.join(", ")} (indicio, no prueba)`;
  return DEL_30_SEP.has(f.ids[0]) ? "listada el 30-sep por «clínica dental Santa Cruz» (indicio)" : "sin indicio";
}
const promete = (f) => {
  const t = f.titulos.filter((x) => x && x !== "{{product.name}}");
  return t.length ? t.map((x) => `«${esc(x)}»`).join(" · ") : "— (el texto va en la imagen o el cuerpo; el conector no lo trae)";
};

export function render() {
  const datos = JSON.parse(readFileSync(new URL(DATOS_RUTA, `file://${raiz}`), "utf8"));
  const { meta, excluidas } = datos;
  const corte = meta.corte_epoch;
  const filas = agrupar(datos.paginas);
  const dentales = filas.filter((f) => f.tipo !== "personal");
  const personales = filas.filter((f) => f.tipo === "personal");
  const fila = (f) => {
    const [v, razon] = clasificar(f);
    const mas = f.starts[0];
    const nuevo = f.starts[f.starts.length - 1];
    return { f, v, razon, mas, nuevo, d: dias(corte, mas), dn: dias(corte, nuevo) };
  };
  const todas = dentales.map(fila);
  const conIndicio = todas.filter((x) => ["verificada", "nombre", "busqueda"].includes(x.f.ciudad));
  const candidatas = conIndicio.filter((x) => x.v === "Candidata").sort((a, b) => b.f.starts.length - a.f.starts.length);
  const aVerificar = conIndicio.filter((x) => x.v === "A verificar").sort((a, b) => b.f.starts.length - a.f.starts.length);
  const fuera = conIndicio.filter((x) => x.v === "Fuera").sort((a, b) => b.f.starts.length - a.f.starts.length);
  const sinCiudad = todas.filter((x) => x.f.ciudad === "sin").sort((a, b) => b.f.starts.length - a.f.starts.length);
  const linea = ({ f, v, razon, mas, d, dn }) =>
    `| **${esc(f.nombre)}** | ${f.page_id} | ${evidenciaCiudad(f, meta.consultas_por_texto)} | ${f.starts.length}${f.completo ? "" : "+"} | ${fechaLaPaz(mas)} (${d} d) · el último, hace ${dn} d | ${promete(f)} | ${f.whatsapp ? "sí" : "no se ve"} | ${f.moneda} | **${v}**: ${esc(razon)}${f.nota ? `. ${esc(f.nota)}` : ""} |`;
  const cab = "| Clínica | page_id | Ciudad: evidencia | Anuncios activos | Desde (el más viejo) | Qué promete (titulares) | Botón de chat | Moneda | Lo que ya se sabía (docs del 30-sep al 8-oct) |\n|---|---|---|---|---|---|---|---|---|";
  const tabla = (xs) => [cab, ...xs.map(linea)].join("\n");
  const anuncios = (xs) => xs.reduce((a, x) => a + x.f.starts.length, 0);

  return `# Clínicas dentales con pauta HOY en la Biblioteca de Meta · lista para Sergio Urcullo

> **11-oct-2026, 12:40 UTC (08:40 La Paz) · Ventas y pauta · encargo de la MADRE MARKETING («la señal más barata», ADQ §3).** Solo lectura con el conector \`Meta_ads\` (\`ads_library_search\`, estado ACTIVE, sin gasto). **Nadie fue contactado, no se creó nada en Meta.** Datos: \`CLINICAS-SCZ-CON-PAUTA-11OCT.json\`; este archivo lo genera \`.claude/skills/onia-ventas-pauta/scripts/clinicas-scz-lista.mjs\` y no se edita a mano.
> **Corregida el 11-oct a las 13:30 UTC.** La primera versión puntuó «Alta» a las clínicas con varias sedes o muchos anuncios y recomendó empezar por Ortobom y Cortez: **seis de esas ocho ya estaban descartadas con evidencia** en \`ONIA_PROSPECTOS_DENTAL_SCZ.md\` §6.2, §6.6, §6.7 y §6.9 (multi-sede, cadena, otra ciudad) y yo no leí esos veredictos antes de ordenar. Ahora el orden sale de esos veredictos: **ya no hay «Alta»**.
> **Contactar a cualquiera de estas clínicas requiere el OK escrito de Sergio Urcullo sobre el mensaje y el canal exactos** (\`ONIA_ADQUISICION_Y_PAUTA.md\` §3, subagente \`onia-crm-prospeccion\`) y el mensaje **no promete el Recall de tratamiento a medias** (§5.4).

## 0. Lo que esta lista NO puede decir (leer antes de usarla)

- **La Biblioteca no da ubicación.** Se buscó por texto («Santa Cruz» en el texto del anuncio) con alcance Bolivia: sale gente de La Paz, Cochabamba y hasta Perú. **«Ciudad: indicio» no es confirmación**; solo valen como confirmación el nombre de la página con «Santa Cruz» o la verificación de los docs previos (directorio o web propia).
- **No contesta ninguna de las 5 preguntas** de \`ONIA_CLIENTE_IDEAL.md\` §9 (profesionales, quién agenda, cómo llevan la agenda, tratamientos a medias, NIT). **Cantidad de anuncios y de sedes no miden el encaje**: una cadena o una red de sedes pasa de los 2-6 profesionales y **sale**.
- **No es exhaustiva.** Sale de 5 consultas por texto (los 50 anuncios más nuevos de cada una) y de recuentos por \`page_ids\`; 5 páginas de la pasada del 8-oct no habían salido y se sumaron por \`page_id\`. Puede faltar alguna.
- **«Anuncios activos» = copias activas en la Biblioteca**, no campañas. **«Desde» = el anuncio activo más viejo**, no desde cuándo pauta la página (una reactivación reinicia la fecha). Lo que el anuncio **promete** es solo su titular: el conector no trae el texto ni la imagen.
- **«Botón de chat»** es el titular «Chatea con nosotros», «NUESTRO WHATSAPP», «Agenda tu cita» o similar: puede llevar a WhatsApp o a Messenger (la Biblioteca no distingue).

## 1. Resumen

- **${dentales.length} clínicas o páginas dentales con pauta activa hoy** (las hermanas cuentan como una), más ${personales.length} profesionales con página propia.
- De las ${conIndicio.length} con indicio de Santa Cruz: **${candidatas.length} candidatas** (la verificación previa dice SIGUE y pautan hoy), **${aVerificar.length} a verificar** y **${fuera.length} fuera** por evidencia previa (${anuncios(fuera)} anuncios que no cambian eso).
- **Candidatas:** ${candidatas.map((x) => x.f.nombre).join(", ")}. Todas con una condición de tamaño: si pasan de 6 profesionales, o son uno solo, salen.
- Del 30-sep, **${SIN_ADS_HOY.length} páginas de la lista ya no tienen anuncios activos** (tabla 5), entre ellas la hipótesis «DS». También sin anuncios hoy: San Pablo, Henners, Dentessa y Gooddental kids (del 8-oct).

## 2. Candidatas: la verificación previa dice SIGUE y pautan hoy

${tabla(candidatas)}

## 3. A verificar (ciudad y tamaño, desde la PC)

${tabla(aVerificar)}

## 4. Fuera por evidencia previa, aunque pautan hoy

> Esta tabla existe para que nadie las vuelva a contar como señal. La cantidad de anuncios es la que muestra la Biblioteca; no cambia el veredicto.

${tabla(fuera)}

## 5. Estaban en la lista del 30-sep y hoy NO tienen anuncios activos

| Página | page_id | Nota |
|---|---|---|
${SIN_ADS_HOY.map(([n, id, nota]) => `| ${n} | ${id} | ${nota} |`).join("\n")}

«Sin anuncios activos hoy» no dice que cerraron ni que no inviertan: puede ser una pausa o un cambio de página.

## 6. Dentales en Bolivia con ciudad SIN indicio (incompleto: sale de una sola consulta de 50 de ${meta.totales_de_la_consulta.Q4})

> «Blanqueamiento dental» no lleva ciudad: estas páginas pueden ser de cualquier ciudad de Bolivia. Sirven para saber **quién más pauta**, no para elegir a quién escribir.

${tabla(sinCiudad)}

## 7. Profesionales con página propia (un profesional: no es el tamaño de 2-6)

${personales.map((f) => `${esc(f.nombre)} (${f.page_id}, ${f.starts.length}${f.completo ? "" : "+"} ${f.starts.length === 1 ? "anuncio" : "anuncios"})`).join(" · ")}.

## 8. Fuera de la lista, y por qué

| Página | page_id | Motivo |
|---|---|---|
${excluidas.map((e) => `| ${esc(e.nombre)} | ${e.page_id} | ${esc(e.motivo)} |`).join("\n")}

## 9. Las 5 preguntas: qué se sabe y qué falta

| Pregunta (\`ONIA_CLIENTE_IDEAL.md\` §9) | La Biblioteca dice | Cómo se contesta |
|---|---|---|
| 1. ¿Cuántos profesionales atienden? (2-6 es el punto dulce) | Solo pistas: varias sedes (que **sacan**), varios anuncios | Preguntarla; **es la primera** |
| 2. ¿Quién agenda las citas? (con recepción, el dolor existe) | Nada. «Agenda tu cita» / «Chatea con nosotros» indican que alguien contesta el chat | Preguntarla; **es la segunda** |
| 3. ¿Cómo llevan la agenda y las fichas? | Nada | En la llamada |
| 4. ¿Cuántos pacientes tienen un tratamiento empezado y no volvieron? (**la que vende**) | Nada | En la llamada; si no lo saben, ya dijeron el problema |
| 5. ¿Facturan con NIT? | Nada | En la llamada |

## 10. Qué sigue, y quién decide

| Qué | Quién |
|---|---|
| Elegir a cuáles contactar entre las **${candidatas.length} candidatas** y aprobar el mensaje y el canal exactos de cada una (borrador: \`sales-kit/PRIMER-MENSAJE-8-CLINICAS-11OCT.md\`) | Sergio Urcullo |
| Resolver desde la PC las filas «A verificar» (ciudad, tamaño, número que abre WhatsApp); **Sonríe a La Vida**: cruzar con el lead «consultorio dental sonrisa feliz» antes de escribirle | La madre en la PC |
| Decidir si acepta 2 sedes en la misma ciudad (MUN, Boquita Sana): hoy están fuera | Sergio Urcullo |
| Repetir esta lista cada semana con la tanda de competencia (la lista del 30-sep ya perdió ${SIN_ADS_HOY.length} páginas) | Ventas y pauta |

**Recomendación de este análisis:** escribir, con el OK de Sergio Urcullo, solo a las **candidatas**, y empezar por las que ya pautan con chat y **tienen Santa Cruz verificada**; el tamaño es la primera pregunta de la conversación. Ningún dato de esta lista justifica escribirle a las ${conIndicio.length} páginas: con 5 conversaciones buenas alcanza (ADQ §4).
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  writeFileSync(`${raiz}${SALIDA_RUTA}`, render());
  console.log(`${SALIDA_RUTA} escrito`);
}
