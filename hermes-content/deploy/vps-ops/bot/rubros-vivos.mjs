#!/usr/bin/env node
// Cruza los rubros que el bot RECITA contra los que el producto VENDE de verdad.
//
// Por que existe: el catalogo del bot se desincronizo del alta DOS veces, y las dos en la misma
// direccion — subvendiendo. El 2026-08-13 le decia "en construcción" a comercio e importadora; el
// 2026-09-05, a servicios profesionales, y a estetica ni la nombraba, mientras las cinco se podian
// contratar en app.onia.com.bo/register. Ninguna de las tres cifras del carril (simulador, widget,
// avisos) puede ver esto: todas miran si SALE un mensaje, no si lo que dice es verdad.
//
// La fuente de verdad es `RUBROS_ACTIVOS` en onia-platform — la lista que la pantalla de alta
// OFRECE y que el endpoint ACEPTA. Vive en el OTRO repo, y por eso esto es un gate aparte y no un
// test de la cadena `npm test`: un test que depende de un repo vecino da rojo falso en todo
// worktree que no lo tenga, y ese rojo traba el merge de los 15 carriles.
//
// Salidas:  0 = coinciden · 1 = divergen (alguien tiene que barrer) · 2 = NO MEDIDO
// El 2 nunca es verde: si no encuentra el otro repo lo dice, en vez de aprobar por defecto — que
// es como esta familia de gates falla abierto.
//
//   node rubros-vivos.mjs [--self-check]

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

import { MODULOS_LISTOS, PRODUCTOS } from "./config.mjs";
// El lector del documento que produccion SIRVE. Se IMPORTA, no se copia: dos lectores del mismo
// hecho es como uno de los dos queda verde solo (ya mordio en `montosVencidos`).
import { filaPublicada, inboxesVivos } from "./precios-vivos.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/**
 * Que rubro de onia-platform es cada modulo del bot. Explicito a proposito: las dos listas usan
 * vocabularios distintos ("proveedores" aca, "proveegest-electrico" alla) y adivinar el mapeo por
 * parecido de nombre es como se cuela un rubro sin que nadie lo note.
 */
export const TRACK_POR_MODULO = Object.freeze({
  dental: "dentagest-clinical",
  comercio: "gestios-general",
  proveedores: "proveegest-electrico",
  servicios: "gestios-servicios-profesionales",
  estetica: "esteticagest-clinical",
});

const CANDIDATOS = [
  "/root/loops/onia-platform/lib/platform/rubros-activos.ts",
  "/root/loops/onia-platform-chatbot/lib/platform/rubros-activos.ts",
  resolve(AQUI, "../../../../../onia-platform/lib/platform/rubros-activos.ts"),
];

/** La ruta del archivo fuente, o null si este arbol no tiene el otro repo. */
export function rutaRubrosActivos(candidatos = CANDIDATOS) {
  return candidatos.find((ruta) => existsSync(ruta)) || null;
}

/**
 * Los trackId de RUBROS_ACTIVOS. Se leen del bloque de la constante y con los comentarios
 * QUITADOS: el archivo nombra `vetgest-clinical` y `ganadero-offline` en comentarios que explican
 * por que NO se ofrecen, y un regex ingenuo los contaria como activos — o sea, el gate aprobaria
 * justo los dos rubros que no se venden.
 */
export function parsearRubrosActivos(fuente) {
  const desde = fuente.indexOf("export const RUBROS_ACTIVOS");
  if (desde === -1) throw new Error("no encontre RUBROS_ACTIVOS: el archivo cambio de forma");
  const hasta = fuente.indexOf("] as const", desde);
  if (hasta === -1) throw new Error("no encontre el cierre de RUBROS_ACTIVOS");
  const bloque = fuente
    .slice(desde, hasta)
    .split("\n")
    .filter((linea) => !linea.trim().startsWith("//"))
    .join("\n");
  return [...bloque.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]);
}

/** Compara las dos listas. Devuelve las dos direcciones por separado: se arreglan en repos distintos. */
export function comparar(activos, listos = MODULOS_LISTOS, mapa = TRACK_POR_MODULO) {
  const declarados = new Set(Object.values(mapa));
  const tracksDelBot = new Set([...listos].map((key) => mapa[key]).filter(Boolean));

  return {
    // Produccion los vende y el bot no los ofrece: plata que se va. Es la direccion que fallo dos veces.
    subvendidos: activos.filter((track) => !tracksDelBot.has(track)),
    // El bot los ofrece y el alta no los acepta: promete lo que no se puede contratar.
    sobrevendidos: [...tracksDelBot].filter((track) => !activos.includes(track)),
    // Un rubro nuevo alla que el bot no sabe ni nombrar: hay que decidirlo, no adivinarlo.
    sinMapear: activos.filter((track) => !declarados.has(track)),
  };
}

function medir() {
  const ruta = rutaRubrosActivos();
  if (!ruta) {
    console.log("NO MEDIDO: este arbol no tiene onia-platform (probe " + CANDIDATOS.length + " rutas).");
    console.log("  El cruce necesita lib/platform/rubros-activos.ts del otro repo.");
    return 2;
  }

  let activos;
  try {
    activos = parsearRubrosActivos(readFileSync(ruta, "utf8"));
  } catch (err) {
    console.log(`NO MEDIDO: ${err.message}`);
    console.log(`  fuente: ${ruta}`);
    return 2;
  }
  if (!activos.length) {
    console.log(`NO MEDIDO: lei 0 rubros en ${ruta} — el parseo quedo viejo, no el catalogo`);
    return 2;
  }

  const { subvendidos, sobrevendidos, sinMapear } = comparar(activos);
  console.log(`fuente: ${ruta}`);
  console.log(`produccion vende ${activos.length}: ${activos.join(", ")}`);
  console.log(`el bot ofrece ${MODULOS_LISTOS.size}: ${[...MODULOS_LISTOS].join(", ")}`);

  for (const track of subvendidos) console.log(`  SUBVENDE  ${track} — se contrata hoy y el bot no lo ofrece`);
  for (const track of sobrevendidos) console.log(`  SOBREVENDE ${track} — el bot lo ofrece y el alta no lo acepta`);
  for (const track of sinMapear) console.log(`  SIN MAPEAR ${track} — rubro nuevo: decidir su modulo en TRACK_POR_MODULO`);

  // La capa EDITABLE, que le gana al archivo para el inbox que la tiene publicada.
  const { medido, porInbox } = leerEditables();
  const editables = editablesSobrevendidos(activos, porInbox);
  for (const r of editables) {
    console.log(`  SOBREVENDE ${r.key} ("${r.label}") — tipeado en el panel, inbox ${r.inbox}, y el alta no lo acepta`);
  }
  if (!medido) {
    const ciegos = porInbox.filter((f) => f.estado === "no-medido" || f.estado === "ilegible");
    console.log(
      ciegos.length
        ? `NO MEDIDO: no pude leer el documento publicado de ${ciegos.length} inbox(es) (${ciegos.map((f) => f.inbox).join(", ")}).`
        : "NO MEDIDO: no pude derivar que inboxes existen en Chatwoot.",
    );
    console.log("  La capa editable le GANA al archivo: sin leerla, este veredicto solo cubre el repo.");
    return 2;
  }
  const conFila = porInbox.filter((f) => f.estado === "doc");
  console.log(`capa editable: ${conFila.length} inbox(es) con fila publicada de ${porInbox.length} — el resto cae al archivo.`);

  const roto = subvendidos.length + sobrevendidos.length + sinMapear.length + editables.length;
  console.log(roto ? `VEREDICTO: divergen en ${roto}` : "VEREDICTO: ok — el bot ofrece exactamente lo que se vende");
  return roto ? 1 : 0;
}

/** El instrumento probado en las DOS direcciones: uno que solo sabe decir "ok" no sirve de gate. */
/**
 * Los rubros que la capa EDITABLE agrega en el documento de UN inbox.
 *
 * `rubrosExtra` es el unico campo del esquema que suma rubros — `knowledge.mjs` lo dice: "es A
 * QUIEN le vendemos". Su comentario declara que la capa editable "solo se mueve en la direccion
 * segura: agrega", y para disparadores es cierto; para RUBROS agregar es justo SOBREVENDER, que
 * es la direccion cara: el bot engancha a un lead cuyo rubro el alta rechaza.
 *
 * Tri-estado, y el `null` nunca es verde: `apagada`/`ausente` son respuestas ("ese inbox cae al
 * archivo, que ya se mide"), pero "no pude preguntar" es NO MEDIDO.
 */
export function rubrosDeLaFila(fila) {
  if (!fila || fila.estado === null || fila.estado === undefined) return { estado: "no-medido", rubros: [] };
  if (fila.estado === "apagada" || fila.estado === "ausente") return { estado: fila.estado, rubros: [] };
  let doc;
  try {
    doc = JSON.parse(fila.crudo);
  } catch {
    return { estado: "ilegible", rubros: [] };
  }
  const lista = Array.isArray(doc?.rubrosExtra) ? doc.rubrosExtra : [];
  // La `key` es el slug con el que el rubro se compara contra el alta; el `label` es lo que el
  // lead lee. Se guardan los dos: acusar por slug y no poder NOMBRAR lo que el bot dijo obliga a
  // ir a la base a mano.
  const rubros = lista
    .map((r) => ({ key: String(r?.key ?? "").trim(), label: String(r?.label ?? "").trim() }))
    .filter((r) => r.key !== "");
  return { estado: "doc", rubros };
}

/**
 * El cruce que faltaba: lo que la capa editable OFRECE, por cada inbox que existe de verdad.
 * El universo de inboxes se deriva de Chatwoot (`inboxesVivos`), nunca de una lista a mano: el
 * inbox que alguien cree manana es justo el que nadie iria a mirar.
 */
export function editablesSobrevendidos(activos, porInbox) {
  const permitidos = new Set(activos);
  const sobrevendidos = [];
  for (const { inbox, estado, rubros } of porInbox) {
    if (estado !== "doc") continue;
    for (const rubro of rubros) {
      if (!permitidos.has(rubro.key)) sobrevendidos.push({ inbox, ...rubro });
    }
  }
  return sobrevendidos;
}

export function leerEditables({ leerInboxes = inboxesVivos, leerFila = filaPublicada } = {}) {
  const inboxes = leerInboxes();
  if (!Array.isArray(inboxes) || inboxes.length === 0) return { medido: false, porInbox: [] };
  const porInbox = inboxes.map((inbox) => ({ inbox, ...rubrosDeLaFila(leerFila({ inbox })) }));
  return { medido: !porInbox.some((f) => f.estado === "no-medido" || f.estado === "ilegible"), porInbox };
}

function selfCheck() {
  const casos = [
    ["ok", ["dentagest-clinical"], new Set(["dental"]), { subvendidos: 0, sobrevendidos: 0 }],
    ["subvende", ["dentagest-clinical", "esteticagest-clinical"], new Set(["dental"]), { subvendidos: 1, sobrevendidos: 0 }],
    ["sobrevende", ["dentagest-clinical"], new Set(["dental", "estetica"]), { subvendidos: 0, sobrevendidos: 1 }],
  ];
  let fallos = 0;
  for (const [nombre, activos, listos, esperado] of casos) {
    const r = comparar(activos, listos);
    const ok = r.subvendidos.length === esperado.subvendidos && r.sobrevendidos.length === esperado.sobrevendidos;
    console.log(`  ${ok ? "ok  " : "FALLA"} ${nombre}`);
    if (!ok) fallos++;
  }

  // El parseo NO puede contar los rubros que los comentarios nombran para explicar que no se ofrecen.
  const fuente = `export const RUBROS_ACTIVOS = [
  { id: "dentagest-clinical", titulo: "Clínica dental" },
  // Veterinaria NO se ofrece: { id: "vetgest-clinical" }
] as const satisfies readonly`;
  const leidos = parsearRubrosActivos(fuente);
  const okComentario = leidos.length === 1 && leidos[0] === "dentagest-clinical";
  console.log(`  ${okComentario ? "ok  " : "FALLA"} ignora los rubros nombrados en comentarios`);
  if (!okComentario) fallos++;

  // Y el catalogo del bot tiene que estar mapeado entero, o el cruce mide de menos sin avisar.
  const sinMapa = [...MODULOS_LISTOS].filter((key) => !TRACK_POR_MODULO[key]);
  console.log(`  ${sinMapa.length ? "FALLA" : "ok  "} todo modulo listo tiene su track${sinMapa.length ? `: falta ${sinMapa}` : ""}`);
  if (sinMapa.length) fallos++;

  const huerfanos = Object.keys(TRACK_POR_MODULO).filter((key) => !PRODUCTOS.some((p) => p.key === key));
  console.log(`  ${huerfanos.length ? "FALLA" : "ok  "} el mapa no inventa modulos${huerfanos.length ? `: sobra ${huerfanos}` : ""}`);
  if (huerfanos.length) fallos++;

  // LA CAPA EDITABLE. Estos casos existen porque los dos lados que cruzaba este gate eran del
  // REPO (`MODULOS_LISTOS` contra `RUBROS_ACTIVOS`), y el documento que produccion SIRVE le gana
  // al archivo. Hoy la fila trae `rubrosExtra` vacio, asi que el gate acertaba por casualidad.
  const fila = (crudo) => ({ estado: "doc", crudo: JSON.stringify(crudo) });
  const editables = [
    ["lee los rubros que la capa editable agrega", fila({ rubrosExtra: [{ key: "vetgest-clinical", label: "Veterinaria" }] }), "doc", 1],
    ["un documento sin rubrosExtra no agrega ninguno", fila({ faq: [] }), "doc", 0],
    ["un 404 es respuesta, no ceguera", { estado: "ausente" }, "ausente", 0],
    ["no poder preguntar NO es 'no agrega nada'", { estado: null }, "no-medido", 0],
    ["un cuerpo ilegible no se aplana a vacio", { estado: "doc", crudo: "<html>502" }, "ilegible", 0],
  ];
  for (const [nombre, entrada, estado, cuantos] of editables) {
    const r = rubrosDeLaFila(entrada);
    const ok = r.estado === estado && r.rubros.length === cuantos;
    console.log(`  ${ok ? "ok  " : "FALLA"} ${nombre}`);
    if (!ok) fallos++;
  }

  // El caso que paga el gate: un rubro tipeado en el panel que el alta NO acepta.
  const sobre = editablesSobrevendidos(
    ["dentagest-clinical"],
    [{ inbox: 4, estado: "doc", rubros: [{ key: "vetgest-clinical", label: "Veterinaria" }] }],
  );
  const okSobre = sobre.length === 1 && sobre[0].inbox === 4 && sobre[0].label === "Veterinaria";
  console.log(`  ${okSobre ? "ok  " : "FALLA"} acusa el rubro editable que el alta rechaza, con su inbox`);
  if (!okSobre) fallos++;

  // Y el que evita el rojo falso: lo editable que SI se vende no es un hallazgo.
  const sano = editablesSobrevendidos(
    ["dentagest-clinical"],
    [{ inbox: 4, estado: "doc", rubros: [{ key: "dentagest-clinical", label: "Dental" }] }],
  );
  console.log(`  ${sano.length === 0 ? "ok  " : "FALLA"} no acusa un rubro editable que el alta acepta`);
  if (sano.length) fallos++;

  // Sin inboxes derivados no hay veredicto: una lista vacia no es "ningun inbox publica nada".
  const ciego = leerEditables({ leerInboxes: () => null, leerFila: () => ({ estado: "doc", crudo: "{}" }) });
  console.log(`  ${ciego.medido === false ? "ok  " : "FALLA"} sin universo de inboxes sale NO MEDIDO`);
  if (ciego.medido !== false) fallos++;

  console.log(fallos ? `SELF-CHECK: ${fallos} fallo(s)` : "SELF-CHECK: ok");
  return fallos ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(process.argv.includes("--self-check") ? selfCheck() : medir());
}
