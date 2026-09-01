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
import { fileURLToPath } from "node:url";

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const leer = (rel) => readFileSync(path.join(RAIZ, rel), "utf8");

const MOTOR = "hermes-content/deploy/vps-ops/bot/recepcionista.mjs";
const CATALOGO = "hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md";

test("el motor sigue derivando la cita, no agendandola", () => {
  // Si esto se pone rojo el bot APRENDIO a agendar: no hay que borrar el test de
  // abajo sin mas, hay que verificarlo en vivo y recien ahi cambiar la copia.
  assert.match(leer(MOTOR), /El bot no agenda ni vende solo/);
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
