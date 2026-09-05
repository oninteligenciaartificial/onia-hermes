// El catalogo que el bot RECITA contra los rubros que el producto VENDE.
//
// Nace del 2026-09-05: a "¿que hacen?" el bot vivo contestaba
//
//     • *Dental* — agenda, recordatorios y cobros de una clínica.
//     • *Comercio* — stock, ventas y clientes de una tienda.
//     • *Importadora* — importaciones, costos y precios de una distribuidora.
//     • Servicios: en construcción, sin humo.
//
// y eso estaba mal por DOS motivos a la vez, ninguno visible desde las tres cifras del carril
// (simulador 3/3, widget 2/2, avisos) porque todas miran si SALE un mensaje, no si es verdad:
//
//   1. SUBVENDE. `gestios-servicios-profesionales` y `esteticagest-clinical` estan en
//      RUBROS_ACTIVOS de onia-platform — la lista que la pantalla de alta ofrece y que el
//      endpoint acepta — y el build VIVO los sirve (medido el 2026-09-05 con
//      `docker exec onia-platform grep -rl "Servicios profesionales" /app/.next/server`).
//      Un contador que preguntaba se iba con "en construcción" mientras podia registrarse y
//      pagar ese mismo dia. Son 2 de 5 rubros: el 40% de los prospectos.
//
//   2. EXHIBE OBRA. "en construcción, sin humo" es exactamente lo que la regla de Sergio del
//      2026-08-20 prohibe en toda superficie que ve un cliente, y el bot es la mas directa que
//      hay. El comentario que la justificaba ("es la misma frase que usa la web") quedo vencido:
//      el 2026-09-05 ni la home, ni /empezar, ni /rubros dicen "sin humo" ni "en construcción".
//
// Por que no se arreglo antes: intents.mjs:490 decia "NO se agregan a PRODUCTOS ni a
// MODULOS_LISTOS: nombrar un modulo es una promesa comercial y esa decision es de Sergio". Era
// cierto el 2026-08-16 y dejo de serlo cuando Sergio abrio los dos rubros en el alta. La decision
// existe; lo que faltaba era barrerla hasta esta superficie.
//
// VETERINARIA sigue afuera a proposito (la factura toma el CI del paciente y el paciente es el
// animal). El caso que lo ancla es el que evita que este arreglo se pase de largo.

import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_CONFIG, MODULOS_LISTOS, PRODUCTOS } from "./config.mjs";
import { say } from "./reply-builder.mjs";
import { catalogoCliente } from "./recepcionista.mjs";

const OBRA = /en construcci[oó]n|sin humo|muy pronto|pr[oó]ximamente|beta\b|pr[oó]ximo release/i;

/**
 * La respuesta a "¿que hacen?", tal cual la LEE un prospecto.
 *
 * `say()` devuelve `{templateKey, replySource, text}`, no un string: al escribir este archivo el
 * caso "no exhibe obra" paso en VERDE contra el objeto, sobre un texto que decia "en construcción,
 * sin humo". Un regex contra un objeto no matchea nunca — el falso verde es mudo y da por sano
 * justo lo que se estaba cazando. Por eso se saca `.text` acá y en un solo lugar.
 */
function queEsOnia(config = DEFAULT_CONFIG) {
  const dicho = say("M_QUE_ES_ONIA", { qualification: {} }, config);
  const texto = typeof dicho === "string" ? dicho : dicho?.text;
  assert.equal(typeof texto, "string", "say() dejo de devolver texto: el test mide un objeto");
  return texto;
}

const modulos = () => PRODUCTOS.filter((p) => p.tipo !== "servicio");

test("el catalogo del bot no exhibe obra — regla de Sergio 2026-08-20", () => {
  const texto = queEsOnia();
  assert.ok(
    !OBRA.test(texto),
    `el bot le muestra estado de obra a un prospecto:\n${texto}`,
  );
});

test("todo modulo que el bot NOMBRA esta listo — lo que no lo esta, no se nombra", () => {
  // El invariante que reemplaza a la linea de obra: no hay tercera categoria. Un modulo del
  // catalogo o esta listo y se lista, o no esta y no aparece. Asi, agregar un producto futuro al
  // catalogo editable no puede volver a publicar "en construcción" sin que esto se ponga rojo.
  const enObra = modulos().filter((p) => !MODULOS_LISTOS.has(p.key));
  assert.deepEqual(
    enObra.map((p) => p.key),
    [],
    "un modulo del catalogo no esta en MODULOS_LISTOS: o se enciende, o se saca del catalogo",
  );
});

test("el bot nombra los rubros que el alta de produccion vende — servicios y estetica incluidos", () => {
  const texto = queEsOnia();
  // Los cinco de RUBROS_ACTIVOS (onia-platform/lib/platform/rubros-activos.ts). El cruce contra
  // ese archivo lo hace `rubros-vivos.mjs`, que vive aparte porque necesita el OTRO repo: un test
  // de la cadena `npm test` que dependa de un repo vecino da rojo falso en medio worktree.
  for (const nombre of ["Dental", "Comercio", "Importadora", "Servicios", "Estética"]) {
    assert.match(texto, new RegExp(nombre, "i"), `falta el rubro ${nombre}, que produccion vende`);
  }
});

test("veterinaria NO se nombra: la factura toma el CI del paciente y el paciente es el animal", () => {
  const texto = queEsOnia();
  assert.ok(!/veterinari/i.test(texto), "veterinaria no esta en RUBROS_ACTIVOS: no se ofrece");
  assert.ok(
    !modulos().some((p) => p.key === "veterinaria"),
    "tampoco entra al catalogo por la puerta de atras",
  );
});

test("el candado sigue siendo de Onia: el catalogo de un cliente no pasa por MODULOS_LISTOS", () => {
  // El catalogo de una org NO sale por esta lista: sale por `catalogoCliente()`, sin candado,
  // porque son hechos suyos. Vale la pena anclarlo desde acá: al escribir este archivo se intento
  // distinguir los dos casos comparando la identidad del array de productos, y eso hacia que una
  // edicion del knowledge de Onia se saltara la vara entera — el agujero exacto que el CANDADO de
  // knowledge.test.mjs existe para tapar.
  const texto = catalogoCliente({
    productos: [{ nombre: "Tornillería", queResuelve: "al por mayor y menor" }],
  });
  assert.match(texto, /Tornillería/, "lista lo que el cliente vende, sin la vara de Onia");
  assert.ok(!OBRA.test(texto), "y no le inventamos obra a su catalogo");

  // La otra mitad del candado: editar el catalogo de Onia no puede colar un modulo como armado.
  const conVeterinaria = queEsOnia({
    ...DEFAULT_CONFIG,
    productos: [...PRODUCTOS, { key: "veterinaria", nombre: "Veterinaria", queResuelve: "fichas y vacunas" }],
  });
  assert.ok(!/Veterinaria/.test(conVeterinaria), "una edicion no declara armado un modulo");
});
