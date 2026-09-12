/**
 * Leer los montos que un lead ve pintados en una pantalla — en LAS DOS formas en que
 * el sitio los escribe.
 *
 * POR QUE EXISTE, con el caso que lo originó. Hasta el 2026-09-12 `precios-vivos.mjs`
 * buscaba `Bs 750`: la moneda ADELANTE. Y la tarjeta de plan de `/precios` —la
 * pantalla que un lead abre para ver cuánto cuesta— la escribe al revés, y además
 * partida en dos nodos:
 *
 *     <span class="planNum">750</span><span class="planUnit">Bs / mes</span>
 *
 * `innerText` devuelve eso como `750\nBs / mes`. Resultado medido ese día contra
 * producción: el gate de precios leía `/precios` y veía 70, 89, 150, 199, 2.000,
 * 3.300 y 3.900 — **todos los que llevan la moneda adelante**— y no veía ninguno de
 * los tres precios de plan (320, 750, 1.500), que son los únicos que el objetivo del
 * carril nombra. La pantalla estaba medida y los precios no.
 *
 * Vive en su propio módulo, y no dentro del medidor, porque ese corre su medición en
 * el top-level: importarlo para probar esta función dispararía un barrido de 24
 * pantallas contra producción y un `process.exit()` que mata al proceso que lo
 * importó. Acá no hay efectos, y el test está al lado.
 */

/**
 * `Bs 750` · `Bs. 750` · `750 Bs` · `750\nBs / mes` · `7.500 Bs/año` · `199 Bs/sem`.
 *
 * El separador entre el número y la moneda admite salto de línea a propósito: cuando
 * el dato y su unidad viven en spans distintos, `innerText` mete un `\n` en el medio y
 * un `\s` que no lo contemple deja fuera justo a las tarjetas de plan.
 */
const RE_MONTO = /(?:Bs\.?\s*(\d{1,3}(?:\.\d{3})*|\d+)|(\d{1,3}(?:\.\d{3})*|\d+)\s*Bs\b)/g;

/**
 * Lo que sigue a un precio de PLAN: su periodicidad. Es lo que separa «Bs 750 / mes»
 * —un precio nuestro, que tiene que salir de la fuente— de un monto citado en prosa
 * («ahorrás Bs 1.058», «Bs 0 de instalación»), que no es un precio de Onia y que al
 * tratarse como uno convertía el rojo en ruido: la primera corrida del barrido acusó
 * 8 montos y 7 eran prosa, con 52 archivos "culpables". Un vigía que grita mal se
 * deja de mirar, y este gate ya lo dice de sí mismo.
 */
const RE_PERIODO = /^\s*(?:Bs\s*)?(?:\/|al |por |cada )?\s*(?:mes|año|ano|sem(?:ana)?|mensual|anual|semanal)/i;

/**
 * Todos los montos en Bs pintados en `texto`, y cuáles de ellos son precios con
 * periodicidad.
 *
 * @returns {{ todos: Set<number>, periodicos: Set<number> }}
 */
export function montosVisibles(texto) {
  const todos = new Set();
  const periodicos = new Set();
  for (const m of texto.matchAll(RE_MONTO)) {
    const crudo = m[1] ?? m[2];
    const valor = Number(crudo.replace(/\./g, ''));
    todos.add(valor);
    // La ventana es lo que sigue AL MATCH COMPLETO, no al número: en `750 Bs / mes` la
    // moneda ya se consumió y el período arranca después de ella.
    const despues = texto.slice(m.index + m[0].length, m.index + m[0].length + 20);
    if (RE_PERIODO.test(despues)) periodicos.add(valor);
  }
  return { todos, periodicos };
}
