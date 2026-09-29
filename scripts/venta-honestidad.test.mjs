#!/usr/bin/env node
// Ata la COPIA DE VENTA al producto que la sostiene. Correr:
//   node --test scripts/venta-honestidad.test.mjs
//
// Origen (2026-08-31): `lib/pricing.ts` de onia-platform vendia el chatbot de
// Bs 390/mes como que "contesta, califica, AGENDA y hace seguimiento", y el motor
// hace lo contrario — un pedido de cita se ESCALA a un humano. Se corrigio alla y
// quedo su guarda (`lib/pricing-honestidad.test.ts`)... y la misma frase seguia viva
// en ONIA_CATALOGO_DE_VENTA.md, que CLAUDE.md declara la fuente unica de "que se
// vende". Arreglar una copia y no la otra es el defecto que esta cola ya tiene
// anotado cuatro veces: se arregla el sistema equivocado.
//
// Las propuestas ya ENTREGADAS (hermes-content/propuestas/*.html) quedan fuera a
// proposito: son artefactos historicos de lo que se le cotizo a alguien un dia, no
// material vigente. Cambiar lo que un cliente ya leyo es decision comercial.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const leer = (rel) => readFileSync(path.join(RAIZ, rel), "utf8");

const MOTOR = "hermes-content/deploy/vps-ops/bot/recepcionista.mjs";
const CATALOGO = "hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md";

// 2026-09-01: el bot APRENDIO a agendar y este test cambio de forma, siguiendo el
// procedimiento que el propio comentario de abajo exigia ("verificarlo en vivo y recien
// ahi cambiar la copia"). Verificado MIRANDO la pantalla, no razonado:
// https://app.onia.com.bo/book/zz-qa-clinica-chatbot-9k651 renderiza el asistente de 4
// pasos (Profesional / Fecha / Horario / Datos) con los profesionales reales de esa org,
// y un slug inexistente (/book/demo) da "Negocio no encontrado". El link que manda el
// motor lleva a una agenda que existe y crea la cita.
//
// Lo que este test guarda YA NO es una frase del comentario —esa se reescribio con el
// cambio y ataba la guarda a la prosa, no al comportamiento— sino la unica regla que
// hace seguro mandar ese link: FAIL-CLOSED. Sin slug limpio no hay link, y el turno
// deriva a un humano exactamente como antes. Un link roto delante del cliente final es
// peor que un handoff.
test("agendar es FAIL-CLOSED: sin slug limpio no hay link, hay handoff", async () => {
  const { linkDeReserva, AGENDA_BASE_URL } = await import(
    pathToFileURL(path.join(RAIZ, MOTOR)).href
  );
  assert.equal(linkDeReserva({ orgSlug: "zz-qa-clinica-chatbot-9k651" }), `${AGENDA_BASE_URL}/zz-qa-clinica-chatbot-9k651`);
  for (const basura of [undefined, "", "   ", "Con Mayus", "con espacio", "-arranca-guion", "termina-guion-", "slug/../../etc", "a".repeat(121)]) {
    assert.equal(linkDeReserva({ orgSlug: basura }), null, `deberia derivar con orgSlug ${JSON.stringify(basura)}`);
  }
});

test("lo que NO agenda sigue escalando: precio y pedido son del humano", () => {
  // El bot aprendio a agendar, no a vender. Si esto se pone rojo, el motor empezo a
  // cotizar solo: verificar en vivo antes de tocar la copia de venta.
  assert.match(leer(MOTOR), /JAMAS precios/);
});

test("el catalogo de venta no vende que el chatbot agenda", () => {
  const filasChatbot = leer(CATALOGO)
    .split("\n")
    .filter((linea) => /chatbot/i.test(linea) && !/^\s*(\/\/|#)/.test(linea));
  assert.ok(filasChatbot.length > 0, `no se encontro ninguna linea de chatbot en ${CATALOGO}`);
  // La "Agenda publica" (key "agenda") SI reserva sola y es otro producto: por eso
  // el filtro mira solo las lineas que hablan del chatbot, no la palabra suelta.
  const mentirosas = filasChatbot.filter((linea) => /agend/i.test(linea));
  assert.deepEqual(mentirosas, [], `el chatbot no agenda: deriva a un humano (${MOTOR})`);
});

// ---------------------------------------------------------------------------
// Inventario avanzado: se publicaba "Desde Bs 180/mes" en la portada y en
// /precios (una sola fila de ADDONS alimenta las dos) por funciones que NO
// tienen gate — `addon.inventory_advanced` se calcula en entitlements.ts y no lo
// lee ningun archivo del producto. Sergio lo saco de la oferta el 2026-08-27
// ("no se cobra"). Cobrar por lo que el cliente ya tiene encendido se cae en la
// primera pregunta del que ya lo usa.
const PRICING = "web-factory/apps/onia-platform/src/lib/pricing.ts";

/** El literal de un `export const NOMBRE ... ] as const;`, sin lo de alrededor. */
function bloque(src, nombre) {
  const desde = src.indexOf(`export const ${nombre}`);
  assert.notEqual(desde, -1, `no se encontro ${nombre} en ${PRICING}`);
  const hasta = src.indexOf("] as const;", desde);
  assert.notEqual(hasta, -1, `${nombre} no cierra con "] as const;" en ${PRICING}`);
  return src.slice(desde, hasta);
}

/**
 * El archivo con los comentarios en BLANCO, conservando los saltos de linea: un
 * comentario acusa y absuelve igual que el codigo. Este archivo explica sus propios
 * precios en prosa —"`Bs 70` en el `incluye` del Basico"— y contar esa linea como copy
 * de venta es un rojo que manda a borrar el registro de por que algo se decidio.
 */
function sinComentarios(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/([^:"'`\\])\/\/[^\n]*/g, (m, antes) => antes + " ".repeat(m.length - antes.length));
}

/** Desde el `=` de una declaracion hasta el `;` que la cierra, contando anidamiento. */
function finDeLaDeclaracion(src, desde) {
  let nivel = 0;
  for (let i = desde; i < src.length; i += 1) {
    const c = src[i];
    if ("([{".includes(c)) nivel += 1;
    else if (")]}".includes(c)) nivel -= 1;
    else if (c === ";" && nivel === 0) return i;
  }
  return src.length;
}

/**
 * El texto de TODAS las listas de planes del archivo, derivado del TIPO que el
 * compilador obliga (`readonly Plan[]`) y NO del nombre de la constante.
 *
 * POR QUE ASI, medido el 2026-09-13 integrando `claude/web-venta` (5501a3c4): ese commit
 * partio las tarjetas en dos —`ESCALERA`, con el `incluye` de cada plan, y `PLANES`, un
 * `.map()` derivado— y los dos tests de abajo pedian `bloque(..., "PLANES")`. El de
 * PRESENCIA se puso rojo, que es honesto; el de AUSENCIA —el que busca un cobro de
 * inventario escondido en la letra chica— paso VERDE sobre un tramo donde ya no queda ni
 * un plan. Un universo tipeado a mano falla ABIERTO justo del lado que importa, y el
 * renombre que lo apaga no se parece a un bug: se parece a un refactor prolijo.
 *
 * El tipo es lo unico que no se puede renombrar sin que `tsc` lo persiga: una lista de
 * planes nueva entra sola, y si `Plan` desaparece el gate se queda SIN sujetos y lo dice
 * (lo exige el caso ancla de mas abajo), nunca en verde.
 */
function listasDePlanes(src) {
  const limpio = sinComentarios(src);
  const declara = /\bconst\s+[A-Za-z_$][\w$]*\s*:\s*readonly\s+Plan\[\]\s*=/g;
  const listas = [];
  for (let m = declara.exec(limpio); m; m = declara.exec(limpio)) {
    listas.push(limpio.slice(m.index, finDeLaDeclaracion(limpio, m.index + m[0].length)));
  }
  return listas.join("\n");
}

/**
 * Las CUATRO capacidades que el add-on retirado cobraba, con el vocabulario con
 * el que se las puede nombrar. El guard se ata a ESTO y no a la palabra
 * "inventario": filtrar por el nombre dejaba pasar la MISMA fila renombrada a
 * "Control de stock avanzado" o a "Compras y proveedores", que es exactamente
 * con lo que volveria. La capacidad no cambia de nombre; la fila si.
 */
const CAPACIDADES_INVENTARIO = [
  ["existencias", /\binventario|\bstock\b|\bexistencias\b|\bkardex\b|\balmac[eé]n|\bdep[oó]sito/i],
  ["compras y proveedores", /\bcompras?\b|\bproveedor/i],
  ["vencimientos por lote", /\bvencimiento|\blotes?\b|\bcaducidad\b/i],
  ["aviso de stock bajo", /\balertas?\b|stock m[ií]nimo|stock bajo/i],
];

test("ninguna superficie de cliente le pone precio a las capacidades de inventario", () => {
  // ADDONS es lo que la portada y /precios rinden bajo "Lo demas que se suma".
  // TODA fila de ADDONS lleva su `precio` al lado por construccion (el tipo
  // AddOn lo exige), asi que nombrar una de estas capacidades aca ES cobrarla,
  // con o sin el numero 180 escrito.
  const filas = bloque(leer(PRICING), "ADDONS").split("\n");
  for (const [capacidad, patron] of CAPACIDADES_INVENTARIO) {
    assert.deepEqual(
      filas.filter((linea) => patron.test(linea)),
      [],
      `${capacidad}: no se cobra — va en el \`incluye\` del plan, no en ADDONS`,
    );
  }
});

test("ningun plan cotiza el inventario en la letra chica", () => {
  // El otro lugar donde cabe un precio sin pasar por ADDONS: el `sinEsto` de un
  // plan ya usa la forma "Reservas online — se agrega como add-on a Bs 150/mes".
  // Una capacidad de inventario junto a una cifra en Bs, en la misma linea, es
  // el mismo cobro entrando por la puerta de atras.
  const culpables = listasDePlanes(leer(PRICING))
    .split("\n")
    .filter((linea) => /\bBs\s*\d/.test(linea))
    .filter((linea) => CAPACIDADES_INVENTARIO.some(([, patron]) => patron.test(linea)));
  assert.deepEqual(culpables, [], "el inventario no tiene precio en ningun plan: viene incluido");
});

test("el inventario sigue contandose como valor incluido, capacidad por capacidad", () => {
  // La otra mitad del mismo arreglo, tambien atada a la capacidad: pedir solo la
  // palabra "inventario" dejaba pasar el "Inventario simple con aviso de stock
  // minimo" de antes — y ese "simple" era justo lo que justificaba vender un
  // "avanzado". Los cuatro terminos son los cuatro campos que InventoryClient.tsx
  // muestra de verdad.
  const planes = listasDePlanes(leer(PRICING));
  for (const termino of [/\bexistencias\b/i, /\bcosto\b/i, /\bproveedor/i, /stock m[ií]nimo/i]) {
    assert.match(planes, termino, `el \`incluye\` del plan dejo de nombrar ${termino}`);
  }
});

test("los planes se derivan del TIPO: renombrar la constante no puede apagar el gate", () => {
  // El caso ancla de los dos tests de arriba. Sin esto, el dia que alguien vuelva a
  // mover las tarjetas de constante los dos se quedan sin sujetos y firman verde: el
  // de AUSENCIA porque no encuentra culpables donde no hay nada, y el de PRESENCIA
  // porque bastaria con que el recorte agarrara CUALQUIER tramo que nombre inventario.
  const src = leer(PRICING);
  const texto = listasDePlanes(src);
  assert.notEqual(texto, "", `no hay ninguna lista \`readonly Plan[]\` en ${PRICING}`);
  assert.match(texto, /id:\s*"basico"/, "el recorte no alcanza al plan mas barato");
  assert.match(texto, /incluye:\s*\[/, "el recorte no trae ni un `incluye`");

  // Y la prueba de que el nombre no manda: con la constante renombrada sale lo mismo.
  const aplanar = (t) => t.replace(/\bESCALERA\b/g, "OTRA_COSA").replace(/\s+/g, " ").trim();
  assert.equal(aplanar(listasDePlanes(src.replace(/\bESCALERA\b/g, "OTRA_COSA"))), aplanar(texto));
});

// ─────────────────────────────────────────────────────────────────────────────
// El KIT DE VENTA no puede prometer una capacidad que el producto no entrega.
//
// POR QUE EXISTE, medido el 2026-09-06 por onia-cola (tarea t_9b7d6f71, abierta por
// web-venta el 04-sep). El SITIO ya se habia limpiado dos veces —el pie que listaba
// "Facturacion SIAT" (198cca363) y /nosotros, que reescribia la promesa fiscal a mano
// (8db85fba8)— y el KIT seguia con SEIS lineas vendiendo "factura SIAT incluida en los
// 3 planes, sin costo aparte" mientras `docker exec onia-platform env | grep -c SIAT`
// daba 0. Es exactamente "una promesa que cambia se barre en TODA la superficie":
// se barrio la superficie que se estaba tocando y no la hermana.
//
// Y la pista de que era despegue y no decision: el material MAS VIEJO era el honesto.
// SPEECH_REUNION_SCZ_20260801.md ya contestaba "el emisor esta en homologacion ante el
// SIN" y dejaba escrito literal "No prometer facturacion SIAT ya en vivo". Los scripts
// de WhatsApp y el guion de demo se despegaron DESPUES de esa regla.
//
// COMO ESTA ESCRITO, y es lo que lo hace no caducar:
//  · el valor se ancla a la FUENTE (la fila de Onia en proof.ts), nunca al valor que el
//    kit tenia hoy. El dia que el emisor salga de homologacion, `siat: "si"` apaga este
//    gate solo — no hay que acordarse de venir a borrarlo. Un gate que afirma el dato en
//    vez de leerlo lo cementa (ya paso: dos gates del bot exigian "30 de septiembre"
//    siendo el plazo el 1 de octubre, y lo defendian en verde).
//  · los SUJETOS salen del DISCO, no de una lista de los dos archivos que fallaron: un
//    material nuevo del kit nace cubierto y hay que excluirlo a la vista, con su motivo.
//  · perdona la PROSA que narra el defecto y las instrucciones NEGADAS ("No prometer
//    SIAT en vivo", "❌ ..."). Un barrido de literales que no distingue eso obliga a
//    borrar la regla que enseña a no cometer el error.
import { readdirSync, statSync } from "node:fs";

const PROOF = "web-factory/apps/onia-platform/src/lib/proof.ts";
const KIT = "hermes-content/sales-kit";

// Carpetas con FECHA en el nombre = historia (CLAUDE.md). Un deck que alguien ya vio en
// una reunion no se reescribe: cambiar lo que un cliente ya leyo es decision comercial.
// El caso de abajo se pone rojo si esta exencion apunta a algo que ya no existe, asi que
// una exencion vencida no puede tapar al material siguiente.
//
// 2026-09-28: el unico exento (`presentacion-scz-20260801`) salio del kit a
// `hermes-content/docs/historial/` (Sergio Urcullo: se archiva). Historia en su lugar ya
// no necesita exencion; la lista queda vacia y lista para el proximo caso.
const EXENTOS_HISTORICOS = [];

/** El estado del emisor segun la fuente: "si" | "tramite" | "no". */
function estadoSiatDeLaFuente() {
  const filaOnia = leer(PROOF)
    .split("\n")
    .find((l) => /estados:\s*\{[^}]*siat:\s*"(si|tramite|no)"/.test(l) && /siat:\s*"tramite"/.test(l));
  const m = filaOnia?.match(/siat:\s*"(si|tramite|no)"/);
  return m ? m[1] : leer(PROOF).match(/siat:\s*"(tramite)"/)?.[1] ?? null;
}

function materialesVivosDelKit() {
  const salida = [];
  const recorrer = (rel) => {
    for (const entrada of readdirSync(path.join(RAIZ, rel))) {
      const hijo = path.join(rel, entrada);
      if (statSync(path.join(RAIZ, hijo)).isDirectory()) {
        if (!EXENTOS_HISTORICOS.includes(entrada)) recorrer(hijo);
      } else if (entrada.endsWith(".md")) salida.push(hijo);
    }
  };
  recorrer(KIT);
  return salida;
}

/** Una linea que AFIRMA que entregamos la factura SIAT. Perdona lo negado y la prosa. */
function prometeEmitirSiat(linea) {
  if (!/SIAT/i.test(linea)) return false;
  if (/^\s*[-*>|\s]*❌/.test(linea)) return false;                    // "❌ no decir esto"
  if (/\bno\s+(prometer|prometas|decir|digas)\b/i.test(linea)) return false; // la regla que lo prohibe
  if (/\bno\s+(incluye|esta|está)\b/i.test(linea)) return false;      // la salvedad honesta
  if (/homologaci[oó]n|tr[aá]mite/i.test(linea)) return false;        // la respuesta honesta
  return /\b(incluid[ao]s?|incluye|incluyen)\b/i.test(linea);
}

test("el kit de venta no promete emitir la factura SIAT mientras el emisor no emita", () => {
  const estado = estadoSiatDeLaFuente();
  assert.ok(estado, `no pude leer el estado de SIAT en ${PROOF}: la fuente cambio de forma`);
  if (estado === "si") return; // el emisor salio de homologacion: el kit ya puede prometerlo

  const ofensores = [];
  for (const rel of materialesVivosDelKit()) {
    leer(rel).split("\n").forEach((linea, i) => {
      if (prometeEmitirSiat(linea)) ofensores.push(`${rel}:${i + 1}  ${linea.trim().slice(0, 90)}`);
    });
  }
  assert.deepEqual(
    ofensores,
    [],
    `El kit promete factura SIAT y la fuente dice siat:"${estado}".\n` +
      `Molde honesto ya escrito: "el emisor esta en homologacion ante el SIN; hasta que salga, el\n` +
      `sistema deja la venta lista y se factura por el portal gratuito del SIN".\n` +
      ofensores.join("\n")
  );
});

// Las DOS direcciones. Sin el caso que YA cumple, el detector podria estar siempre-vacio
// (verde sobre cualquier cosa) y nadie se enteraria; sin el que debe fallar, podria estar
// siempre-lleno. Un gate probado en una sola direccion no prueba nada.
test("el detector del kit anda en las dos direcciones", () => {
  assert.ok(prometeEmitirSiat("factura SIAT incluida en los 3 planes, sin costo aparte"));
  assert.ok(prometeEmitirSiat("y ya incluye la factura SIAT."));
  assert.ok(!prometeEmitirSiat("- No prometer facturación SIAT \"ya en vivo\" (está en homologación)."));
  assert.ok(!prometeEmitirSiat("❌ \"Vos sos grupo X del SIAT\" (depende del NIT)."));
  assert.ok(!prometeEmitirSiat("El emisor está en homologación ante el SIN; se factura por el portal."));
  assert.ok(!prometeEmitirSiat("demo enfocada en orden + SIAT (posible Básico como downsell)"));
});

// ─────────────────────────────────────────────────────────────────────────────
// "SIN LIMITE DE CHATS" — la promesa de VOLUMEN ilimitado sobre un add-on que topa.
//
// Origen (medido el 2026-09-19): el add-on corta a CONVERSACIONES_INCLUIDAS al mes y
// cobra una recarga, y el material de venta de hermes-content seguia diciendo "IA
// incluida sin limite de chats" en CUATRO lugares — incluido el CATALOGO, que
// CLAUDE.md declara fuente unica de "que se vende", y el pitch de una frase que
// Sergio Urcullo dice en una demo.
//
// No fue nunca una mentira escrita a proposito: era CIERTA hasta el 2026-09-11, el dia
// que el cupo dejo de ser copy y paso a ser un corte aplicado (lo cuenta la cabecera de
// content/chatbot-precios.ts). El barrido de esa promesa alcanzo al producto y al sitio
// y NO a hermes-content/docs, que es de donde salen las propuestas y el pitch.
//
// Por que ningun gate lo veia: no mueve una cifra (los cruces de precio validan montos y
// aca no hay ninguno), no tipea un nombre de plan junto a una capacidad, y no es un
// alcance total sobre EL SISTEMA ni sobre SUS PARTES — es sobre el VOLUMEN.
//
// El gate se escribe contra la FORMA y se apaga solo el dia que el cupo desaparezca:
// si nadie declara un tope, no hay nada que prometer de mas.
const CHATBOT_PRECIOS = "web-factory/apps/onia-platform/src/content/chatbot-precios.ts";

/** El cupo que el producto APLICA, o null si dejo de haber tope. */
function cupoMensualDeLaFuente() {
  const m = leer(CHATBOT_PRECIOS).match(/CONVERSACIONES_INCLUIDAS\s*=\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

/**
 * Los .md que VENDEN: el primer nivel de docs/ y el kit. Quedan fuera por construccion
 * las subcarpetas — `historial/` y `research/` son historia y competencia guardada
 * (CLAUDE.md), y ahi describir el plan ilimitado de otro es correcto.
 */
function materialesDeVenta() {
  const docs = readdirSync(path.join(RAIZ, "hermes-content/docs"))
    .filter((e) => e.endsWith(".md"))
    .map((e) => `hermes-content/docs/${e}`);
  return [...docs, ...materialesVivosDelKit()];
}

const FORMA_SIN_TOPE =
  /\b(sin\s+l[ií]mite\s*(artificial)?\s+de\s+(chat|conversac|mensaj)|(chat|conversacion|mensaje)e?s?\s+ilimitad)/i;

/**
 * La VENTANA a la que pertenece la promesa, que no es el renglon.
 *
 * Nace de un falso verde medido al escribir esto: el pitch de una frase —el sujeto mas
 * caro, porque es lo que se dice en una demo— tiene "en Onia" y "sin limite de chats" en
 * renglones distintos del mismo blockquote, asi que por linea quedaba sin sujeto y el
 * gate lo absolvia. La ventana depende de la FORMA: en una tabla el sujeto es la FILA
 * (la de Sendy y la nuestra son vecinas y dicen cosas opuestas), en prosa es el bloque.
 */
function ventanaDe(lineas, i) {
  if (/^\s*\|/.test(lineas[i])) return lineas[i]; // tabla: la fila es el sujeto
  const abre = (l) => l.trim() === "" || /^\s*\|/.test(l) || /^\s*#/.test(l) || /^\s*(\d+\.|[-*+])\s/.test(l);
  let ini = i;
  while (ini > 0 && !abre(lineas[ini])) ini--;
  let fin = i;
  while (fin + 1 < lineas.length && !abre(lineas[fin + 1])) fin++;
  return lineas.slice(ini, fin + 1).join(" ");
}

/**
 * Una ventana que nos atribuye a NOSOTROS volumen sin tope.
 *
 * La atribucion es la mitad que importa: media docena de lineas vivas describen el plan
 * "chats ilimitados" de Sendy o de Cliengo, y esas son ciertas. Se acusa cuando la
 * ventana nombra a Onia (o habla en primera persona), o cuando vive en el CATALOGO —
 * donde toda fila es nuestra por construccion y por eso ninguna necesita decirlo.
 *
 * ⚠️ No se absuelve por COMILLAS. Parece que citar es de otro, y es al reves: nuestro
 * pitch va entre comillas justamente porque es una frase para decir en voz alta.
 */
function prometeChatsSinTope(ventana, { esCatalogo }) {
  if (!FORMA_SIN_TOPE.test(ventana)) return false;
  const esNuestra = /\bOnia\b/i.test(ventana) || /\bnuestro\s+modelo\b/i.test(ventana);
  if (!esCatalogo && !esNuestra) return false;                                   // es el plan de otro
  if (/\bno\s+(es|son|hay|ofrece)\b[^.]*ilimitad|ilimitad\w*\s*:?\s*no\b/i.test(ventana)) return false; // lo niega
  return !/\b\d{3,}\s*(conversacion|chat|mensaj)/i.test(ventana);                // ya dice el cupo: honesta
}

/** Los renglones ofensores de un documento, con la ventana ya resuelta. */
function ofensoresEn(texto, opciones) {
  const lineas = texto.split("\n");
  const salida = [];
  lineas.forEach((linea, i) => {
    if (!FORMA_SIN_TOPE.test(linea)) return; // la forma entra por el renglon; el sujeto, por la ventana
    if (prometeChatsSinTope(ventanaDe(lineas, i), opciones)) salida.push(i + 1);
  });
  return salida;
}

test("ningun material de venta promete chats ilimitados mientras el add-on tenga cupo", () => {
  const cupo = cupoMensualDeLaFuente();
  if (cupo === null) return; // el producto dejo de topar: la promesa seria cierta

  const ofensores = [];
  for (const rel of materialesDeVenta()) {
    const texto = leer(rel);
    const lineas = texto.split("\n");
    for (const n of ofensoresEn(texto, { esCatalogo: rel === CATALOGO }))
      ofensores.push(`${rel}:${n}  ${lineas[n - 1].trim().slice(0, 110)}`);
  }
  assert.deepEqual(
    ofensores,
    [],
    `El material de venta promete chats sin tope y el producto corta a ${cupo}/mes\n` +
      `(${CHATBOT_PRECIOS}: el cupo dejo de ser copy el 2026-09-11 y hoy lo aplica cupo.ts).\n` +
      `Molde honesto, derivado: "atiende ${cupo} conversaciones al mes; si se agotan pasan a una\n` +
      `persona de tu equipo y podes sumar mas con una recarga". Decir "sin limite" le garantiza\n` +
      `al cliente justo lo que el producto le corta — y la derivacion nos la cobra en soporte.\n` +
      ofensores.join("\n")
  );
});

test("el detector de volumen anda en las dos direcciones", () => {
  const nuestro = { esCatalogo: false };
  const cat = { esCatalogo: true };
  // ACUSA lo nuestro, en las formas que estaban vivas
  assert.ok(prometeChatsSinTope("en Onia son Bs 390 con la IA adentro, sin límite de chats", nuestro));
  assert.ok(prometeChatsSinTope("| **Onia** | la IA va adentro, **sin límite artificial de chats** |", nuestro));
  assert.ok(prometeChatsSinTope("Incluida, sin límite de chats, con tope de gasto controlado por Onia", nuestro));
  assert.ok(prometeChatsSinTope("IA incluida sin límite de chats | ✅ vivo", cat)); // el catalogo no dice "Onia"
  assert.ok(prometeChatsSinTope("Onia da conversaciones ilimitadas", nuestro));
  // ABSUELVE lo que es cierto
  assert.ok(!prometeChatsSinTope("| **Sendy** | $39 USD/mes | **chats ilimitados** |", nuestro));
  assert.ok(!prometeChatsSinTope("Cliengo Starter: 500 conversaciones; no ofrece conversaciones ilimitadas", nuestro));
  assert.ok(!prometeChatsSinTope("Onia atiende 500 conversaciones al mes, no es ilimitado", nuestro));
  assert.ok(!prometeChatsSinTope("Onia: el add-on trae 500 conversaciones por mes incluidas", nuestro));
  assert.ok(!prometeChatsSinTope("El bot de Onia contesta 24/7 y deriva al humano", nuestro));
});

// El caso que el gate PERDIO en su primera version, y por eso existe: el sujeto y la
// promesa viven en renglones distintos del mismo bloque. Sin esto, la forma mas cara
// —la frase que se dice en una demo— pasaba verde.
test("la ventana toma el bloque entero, no el renglon", () => {
  const pitch = [
    "## 4. El pitch de una frase contra Sendy",
    "",
    '> **"Sendy te alquila un vendedor que anota en un cuaderno aparte; en Onia son Bs 390',
    "> con la IA adentro, sin límite de chats, y la bandeja adentro del mismo sistema.\"**",
    "",
  ].join("\n");
  assert.deepEqual(ofensoresEn(pitch, { esCatalogo: false }), [4], "perdio el pitch multi-renglon");

  // Y la direccion contraria: en una TABLA la ventana NO puede derramarse a la fila
  // vecina, o la fila de Onia contagiaria a la de Sendy y al reves.
  const tabla = [
    "| Competidor | Plan |",
    "|---|---|",
    "| **Sendy** | $39/mes, chats ilimitados |",
    "| **Onia — add-on** | Bs 390, atiende 500 conversaciones al mes |",
  ].join("\n");
  assert.deepEqual(ofensoresEn(tabla, { esCatalogo: false }), [], "la fila de Sendy se contagio de la nuestra");

  // Un parrafo que refuta la promesa ajena y nombra nuestro tope no es un ofensor,
  // aunque diga "Onia" y "ilimitado" en el mismo bloque.
  const refutacion = [
    '3. **"Chats ilimitados" / "sin pagar por mensaje".** Prometer ilimitado sobre un costo',
    "   variable que sube es firmar un pasivo abierto. Nuestro modelo de 500 conversaciones",
    "   + Meta al costo es más feo de vender y más honesto de sostener.",
  ].join("\n");
  assert.deepEqual(ofensoresEn(refutacion, { esCatalogo: false }), [], "acuso a la refutacion honesta");
});

test("los sujetos salen del disco y las exenciones no estan vencidas", () => {
  const vivos = materialesVivosDelKit();
  // El universo de venta se camina del disco: un doc nuevo nace cubierto. Con el ancla de
  // abajo, romper el recorrido se ve — sin ella, el barrido vacio firmaria verde.
  const venta = materialesDeVenta();
  assert.ok(venta.length > 50, `el barrido de venta encontro ${venta.length} archivos: se rompio`);
  assert.ok(venta.includes(CATALOGO), "el catalogo salio del universo: es el sujeto que mas importa");
  assert.ok(cupoMensualDeLaFuente() > 0, `no pude leer el cupo en ${CHATBOT_PRECIOS}: cambio de forma`);
  assert.ok(vivos.length >= 3, `el kit deberia tener material vivo, encontre ${vivos.length}`);
  assert.ok(
    vivos.some((r) => r.includes("03-SCRIPTS-WHATSAPP")),
    "el barrido dejo de ver los scripts de WhatsApp: el recorrido del disco se rompio"
  );
  for (const exento of EXENTOS_HISTORICOS) {
    assert.ok(
      readdirSync(path.join(RAIZ, KIT)).includes(exento),
      `la exencion "${exento}" ya no existe: borrala en vez de dejarla tapando material nuevo`
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PRECIOS, PLANES Y MARCA DEL KIT — atados al CODIGO de onia-platform.
//
// Origen (2026-09-28): el kit seguia cotizando los planes viejos (Pro y Full, con sus montos
// de julio) dos semanas despues de la escalera C, vendia "DentalGest" —el nombre viejo del
// pack dental— y prometia la factura "sin re-tipear" con la emision SIAT apagada. Ningun gate
// lo veia: el de SIAT de arriba pide "incluye" en la misma linea, el de volumen mira el cupo,
// y los cruces de precio miran el bot y el sitio, no el kit que Sergio Urcullo manda por
// WhatsApp.
//
// La regla: todo "Bs <numero>" del kit es un monto que el codigo COBRA (planes en todos sus
// ciclos, add-ons, recarga) o la tarifa de Meta que pricing.ts deriva. Un ticket de mercado
// no va en el kit: la cuenta se hace con el del prospecto. Los montos se leen del ref
// PUBLICADO de onia-platform (fuente-plataforma.mjs explica por que no el working tree).
import { fuenteDePlataforma, repoPlataforma } from "../hermes-content/deploy/vps-ops/bot/fuente-plataforma.mjs";

/** El numero de `hoja` dentro del bloque `export const RAIZ` (hasta el proximo export). */
function numeroDe(fuente, raiz, hoja) {
  const desde = fuente.indexOf(`export const ${raiz}`);
  assert.notEqual(desde, -1, `no existe "export const ${raiz}" en onia-platform: lo renombraron`);
  const hasta = fuente.indexOf("\nexport const ", desde + 1);
  const m = new RegExp(String.raw`\b${hoja}\s*[:=]\s*([\d.]+)`).exec(fuente.slice(desde, hasta === -1 ? undefined : hasta));
  assert.ok(m, `no encontre ${hoja} en ${raiz}`);
  return Number(m[1]);
}

/** Montos que el kit puede citar y nombres de plan que existen, leidos del codigo. */
function preciosDelCodigo() {
  const repo = repoPlataforma();
  const planes = fuenteDePlataforma(repo, "subscription-plans.ts");
  const pricing = fuenteDePlataforma(repo, "pricing.ts");
  const montos = new Set();
  const desde = planes.indexOf("export const DEFAULT_PLAN_AMOUNTS");
  assert.notEqual(desde, -1, "no existe DEFAULT_PLAN_AMOUNTS en subscription-plans.ts");
  for (const [, n] of planes.slice(desde, planes.indexOf("};", desde)).matchAll(/:\s*(\d+)/g)) montos.add(Number(n));
  for (const [raiz, hoja] of [
    ["WHATSAPP_ADDON", "entryMonthly"],
    ["WHATSAPP_ADDON", "annualTotal"],
    ["RECARGA_CONVERSACIONES", "precio"],
    ["BOOKING_ADDON_PRICE", "monthly"],
    ["EXTRA_USER_ADDON_PRICE", "monthly"],
  ]) montos.add(numeroDe(pricing, raiz, hoja));
  const bsPorMensaje = numeroDe(pricing, "WHATSAPP_ADDON", "utilityUsd") * numeroDe(pricing, "TIPO_CAMBIO_REFERENCIA_BS_POR_USD", "TIPO_CAMBIO_REFERENCIA_BS_POR_USD");
  montos.add(Math.round(bsPorMensaje * 100) / 100);
  const desdeLabels = pricing.indexOf("export const PLAN_LABELS");
  assert.notEqual(desdeLabels, -1, "no existe PLAN_LABELS en pricing.ts");
  const labels = pricing.slice(desdeLabels, pricing.indexOf("} as const", desdeLabels));
  const nombres = new Set([...labels.matchAll(/:\s*"([^"]+)"/g)].map((m) => m[1]));
  return { montos, nombres };
}

/** "Bs 1.290" -> 1290, "Bs 0,13" -> 0.13. Los [corchetes] del guion no son montos. */
function montosEnBs(linea) {
  return [...linea.matchAll(/\bBs\.?\s*(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?/g)].map(
    ([, entero, dec]) => Number(`${entero.replaceAll(".", "")}${dec ? `.${dec}` : ""}`),
  );
}

/** Los nombres propios que siguen a "plan"/"planes" ("plan Crece", "el plan **Pro**"). */
function planesNombrados(linea) {
  return [...linea.matchAll(/\bplan(?:es)?\s+\**([A-ZÁÉÍÓÚ][a-záéíóúñ]+)/g)].map((m) => m[1]);
}

/** Vende la marca vieja. Perdona la linea que cuenta que es vieja o la prohibe. */
function venderMarcaVieja(linea) {
  return /dental\s*gest/i.test(linea) && !/nombre viejo|marca vieja|no es (una )?marca|❌/i.test(linea);
}

/** Promete que la factura sale del sistema sin tipear. Perdona la regla que lo prohibe y la
 *  prosa que cuenta el defecto ("el kit prometia..."): la copia de venta no dice "promete". */
function prometeSinRetipeo(linea) {
  if (/❌|prohibid|\bnunca\b|promet/i.test(linea)) return false;
  return /re-?tipe|no\s+(tengas|vas\s+a\s+tener)\s+que\s+tipear|sin\s+tipear|factura\s+(sale|salga)\s+sola|sale\s+del\s+mismo\s+sistema/i.test(linea);
}

test("el kit cita solo precios, planes y marca que el codigo sostiene", () => {
  const { montos, nombres } = preciosDelCodigo();
  const siatVivo = estadoSiatDeLaFuente() === "si";
  const ofensores = [];
  for (const rel of materialesVivosDelKit()) {
    leer(rel).split("\n").forEach((linea, i) => {
      const donde = `${rel}:${i + 1}`;
      for (const monto of montosEnBs(linea)) if (!montos.has(monto)) ofensores.push(`${donde}  Bs ${monto} no lo cobra el codigo`);
      for (const plan of planesNombrados(linea)) if (!nombres.has(plan)) ofensores.push(`${donde}  plan "${plan}" no existe`);
      if (venderMarcaVieja(linea)) ofensores.push(`${donde}  marca vieja DentalGest (la marca es Onia)`);
      if (!siatVivo && prometeSinRetipeo(linea)) ofensores.push(`${donde}  promete la factura sin tipear con el emisor apagado`);
    });
  }
  assert.deepEqual(
    ofensores,
    [],
    `El kit se despego del producto. Precios: onia-platform lib/subscription-plans.ts y lib/pricing.ts\n` +
      `(montos validos: ${[...montos].sort((a, b) => a - b).join(", ")}; planes: ${[...nombres].join(", ")}).\n` +
      ofensores.join("\n"),
  );
});

test("los detectores del kit andan en las dos direcciones", () => {
  assert.deepEqual(montosEnBs("Profesional Bs 890/mes · anual Bs 8.900 · Meta Bs 0,13 c/u · Bs [total]"), [890, 8900, 0.13]);
  assert.deepEqual(montosEnBs("| **Precio** | Bs 320/mes | **Bs 750/mes** | Bs 1.500/mes |"), [320, 750, 1500]);
  assert.deepEqual(planesNombrados("cotizá el plan Crece, nunca el plan **Pro** ni el plan Full"), ["Crece", "Pro", "Full"]);
  assert.deepEqual(planesNombrados("un plan de trabajo, el plan que te calza"), []);
  assert.ok(venderMarcaVieja("# DentalGest — La clínica ordenada"));
  assert.ok(!venderMarcaVieja("El kit vendía DentalGest, que era el nombre viejo del pack dental."));
  assert.ok(prometeSinRetipeo("Factura SIAT en línea sin re-tipear: la factura sale del mismo sistema"));
  assert.ok(prometeSinRetipeo("o hacer que la factura salga sola del mismo sistema"));
  assert.ok(!prometeSinRetipeo("- ❌ \"Onia emite tu factura\" / \"no vas a tener que tipear\""));
  assert.ok(!prometeSinRetipeo("Cada venta queda lista para cargar en el Portal Web gratuito del SIN."));
  assert.ok(!prometeSinRetipeo("- **Facturación**: el kit prometía la factura \"sin re-tipear\"."));
});
