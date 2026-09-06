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
  const culpables = bloque(leer(PRICING), "PLANES")
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
  const planes = bloque(leer(PRICING), "PLANES");
  for (const termino of [/\bexistencias\b/i, /\bcosto\b/i, /\bproveedor/i, /stock m[ií]nimo/i]) {
    assert.match(planes, termino, `el \`incluye\` del plan dejo de nombrar ${termino}`);
  }
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
const EXENTOS_HISTORICOS = ["presentacion-scz-20260801"];

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

test("los sujetos salen del disco y las exenciones no estan vencidas", () => {
  const vivos = materialesVivosDelKit();
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
