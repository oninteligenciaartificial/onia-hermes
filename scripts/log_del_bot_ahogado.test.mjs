/**
 * Casos puros de `log_del_bot_ahogado.mjs`. Sin docker, sin ssh, sin reloj.
 *
 * El caso que da nombre a este archivo es `historicas no cuentan`: nace de un error medido, y
 * el error fue MIO (carril chatbot-cola, vuelta del 2026-09-26 17:05). Se reabrio el item T10
 * de `hermes-content/docs/cola/chatbot.md` afirmando «el log sigue ahogado» a partir de
 * `tail -2000 | grep -c knowledge:panel` -> 1.417. El arreglo estaba VIVO y funcionando: se
 * probo golpeando `/health` cinco veces en el bot de produccion y el log no crecio ni una
 * linea. Las 1.417 copias eran de antes del ultimo arranque del proceso, congeladas en un log
 * que nunca se rota.
 *
 * `tail -N` es una ventana de LINEAS, no de TIEMPO, y en un log sin rotar las dos cosas se
 * separan hasta invertir el veredicto: cuanto MAS prolifica es la linea de ruido, mas de la
 * ventana ocupa su propio pasado. El criterio de cierre que T10 traia escrito
 * (`tail -2000` < 50 copias) era inalcanzable por construccion — nunca podia ponerse verde,
 * por perfecto que fuera el emisor.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  colaDejaVerLosEventos,
  juzgarRuidoDelLog,
  quienTapaLaCola,
  RUIDO_CONOCIDO,
} from "./log_del_bot_ahogado.mjs";

const PATRON = RUIDO_CONOCIDO[0].patron;
const AHORA = "2026-09-26T17:16:00";
const VENTANA_H = 2; // la ventana arranca 15:16

/** Una linea de webhook, que SI lleva marca ISO. */
const web = (iso, extra = "conv=49 rama=respondio") => `[onia-webhook] ${iso}.000Z ${extra}`;
/** Una linea de ruido: condicion permanente, y sin hora (asi sale del bot vivo). */
const ruido = () =>
  "[knowledge:panel] ignoro `empresa.horario` de la fila del panel: la disponibilidad de Onia " +
  "la manda ventanas-de-atencion.mjs";

test("historicas no cuentan: miles de copias viejas y cero recientes es SANO", () => {
  // 1.417 copias, todas antes de la ventana, acotadas por una marca posterior que tambien es
  // anterior a la ventana. Es el log real del 2026-09-26.
  const lineas = [
    web("2026-09-26T10:23:04"),
    ...Array.from({ length: 1417 }, ruido),
    web("2026-09-26T10:48:48"),
    web("2026-09-26T16:50:46", "conv=49 rama=respondio etapa=nuevo->esperando_horario"),
    web("2026-09-26T17:15:00", "conv=49 rama=MUDO etapa=demo_agendada->demo_agendada"),
  ];
  const r = juzgarRuidoDelLog({ lineas, ahoraIso: AHORA, ventanaHoras: VENTANA_H, patron: PATRON });
  assert.equal(r.veredicto, "sano");
  assert.equal(r.enVentana, 0);
  assert.equal(r.historicas, 1417);
  assert.equal(r.sinFechar, 0);
});

test("ahogado vivo: las mismas copias, pero DENTRO de la ventana, es ROJO", () => {
  // Mismo volumen y misma ventana de lineas que el caso anterior. Lo unico que cambia es
  // CUANDO se emitieron. Si el veredicto no se mueve, el instrumento mide volumen y no tasa.
  const lineas = [
    web("2026-09-26T15:20:00"),
    ...Array.from({ length: 1417 }, ruido),
    web("2026-09-26T17:15:00"),
  ];
  const r = juzgarRuidoDelLog({ lineas, ahoraIso: AHORA, ventanaHoras: VENTANA_H, patron: PATRON });
  assert.equal(r.veredicto, "ahogado");
  assert.equal(r.enVentana, 1417);
  assert.equal(r.historicas, 0);
});

test("el umbral es una TASA: pocas copias en la ventana siguen siendo sanas", () => {
  const lineas = [
    web("2026-09-26T16:00:00"),
    ruido(),
    web("2026-09-26T16:30:00"),
    ruido(),
    web("2026-09-26T17:00:00"),
  ];
  const r = juzgarRuidoDelLog({ lineas, ahoraIso: AHORA, ventanaHoras: VENTANA_H, patron: PATRON });
  assert.equal(r.veredicto, "sano");
  assert.equal(r.enVentana, 2);
});

test("NO MEDIDO, no verde: ruido que no se puede fechar por ningun lado", () => {
  // El `tail` arranca en medio de un bloque de ruido y no hay ni una marca despues: esas
  // lineas podrian ser de ahora mismo o de anteayer. Un instrumento que llame a eso «sano»
  // repite el falso verde que costo una semana de bot mudo en septiembre.
  const lineas = [ruido(), ruido(), ruido()];
  const r = juzgarRuidoDelLog({ lineas, ahoraIso: AHORA, ventanaHoras: VENTANA_H, patron: PATRON });
  assert.equal(r.veredicto, "no_medido");
  assert.equal(r.sinFechar, 3);
});

test("una marca POSTERIOR alcanza para descartar: sin marca previa, pero acotada al pasado", () => {
  // No hay marca antes del bloque (el tail lo corto), pero la de despues ya es anterior a la
  // ventana: entonces todo el bloque es viejo con CERTEZA, sin necesidad de la marca previa.
  const lineas = [ruido(), ruido(), web("2026-09-26T10:48:48"), web("2026-09-26T17:15:00")];
  const r = juzgarRuidoDelLog({ lineas, ahoraIso: AHORA, ventanaHoras: VENTANA_H, patron: PATRON });
  assert.equal(r.veredicto, "sano");
  assert.equal(r.historicas, 2);
  assert.equal(r.sinFechar, 0);
});

test("sin lineas no hay veredicto: NO MEDIDO", () => {
  for (const lineas of [[], null, undefined]) {
    assert.equal(
      juzgarRuidoDelLog({ lineas, ahoraIso: AHORA, patron: PATRON }).veredicto,
      "no_medido",
    );
  }
});

test("sin reloj no hay ventana: NO MEDIDO", () => {
  const lineas = [web("2026-09-26T17:00:00"), ruido()];
  assert.equal(juzgarRuidoDelLog({ lineas, ahoraIso: null, patron: PATRON }).veredicto, "no_medido");
});

test("cero ruido es sano, y lo dice sin inventar copias", () => {
  const lineas = [web("2026-09-26T17:00:00"), web("2026-09-26T17:15:00")];
  const r = juzgarRuidoDelLog({ lineas, ahoraIso: AHORA, ventanaHoras: VENTANA_H, patron: PATRON });
  assert.equal(r.veredicto, "sano");
  assert.equal(r.enVentana, 0);
  assert.equal(r.historicas, 0);
});

// ---------------------------------------------------------------------------------------------
// El segundo veredicto: que la COLA del log deje ver los eventos que miden el objetivo.
// El conteo de ruido es el diagnostico; esto es el sintoma que de verdad importa, y es el que
// devolvio vacio el 2026-09-24 con 27 eventos adentro del archivo.
// ---------------------------------------------------------------------------------------------

test("la cola tapada por ruido es ROJA aunque el archivo tenga los eventos", () => {
  const cola = Array.from({ length: 80 }, ruido);
  const r = colaDejaVerLosEventos({ cola, lineasDelArchivo: [web("2026-09-26T10:00:00", "demo_agendada")] });
  assert.equal(r.ve, false);
  assert.equal(r.enLaCola, 0);
  assert.equal(r.enElArchivo, 1);
});

test("la cola que muestra los eventos es VERDE", () => {
  const cola = [
    web("2026-09-26T17:15:00", "conv=49 rama=MUDO etapa=demo_agendada->demo_agendada"),
    "[aviso] sent conv=49 (demo_agendada): aviso enviado",
  ];
  const r = colaDejaVerLosEventos({ cola, lineasDelArchivo: cola });
  assert.equal(r.ve, true);
  assert.ok(r.enLaCola >= 1);
});

test("sin eventos en ningun lado NO es rojo de cola: no hay nada que tapar", () => {
  const r = colaDejaVerLosEventos({ cola: [web("2026-09-26T17:15:00")], lineasDelArchivo: [] });
  assert.equal(r.ve, true);
  assert.equal(r.enElArchivo, 0);
});

// ───────────── Y la pregunta que el rojo NO contestaba: QUE tapa la cola ─────────────
//
// Medido el 2026-09-27 08:51 UTC en el bot vivo. El gate salio 1 («AHOGADO — la cola no muestra
// ni un evento») con el ruido conocido SANO (0 en la ventana), o sea que el veredicto era cierto
// y aun asi no decia nada accionable: derivar la causa costo un `tail -80 | grep -oE 'rama='`
// a mano. La composicion real de esas 80 lineas fue 51 `ignorado` + 8 `MUDO` + 21 `respondio`,
// y el ultimo evento habia quedado 133 lineas atras.
//
// La causa importa porque manda a lugares OPUESTOS: si la cola se llena de lineas que declaran
// que el bot NO hizo nada, el defecto es del emisor (loguea no-eventos en el camino caliente);
// si se llena de respuestas reales, no hay defecto de emisor y la ventana es corta. Un rojo que
// no distingue las dos manda a la proxima vuelta a re-derivarlo desde cero.

test("cola tapada por no-eventos: la causa es del EMISOR y se nombra", () => {
  // La composicion exacta del bot vivo el 2026-09-27.
  const cola = [
    ...Array.from({ length: 51 }, () => web("2026-09-27T08:48:06", "conv=49 rama=ignorado motivo=mensaje_no_entrante:outgoing")),
    ...Array.from({ length: 8 }, () => web("2026-09-27T08:49:02", "conv=49 rama=MUDO motivo=evento sin mensaje")),
    ...Array.from({ length: 21 }, () => web("2026-09-27T08:47:51", "conv=49 rama=respondio enviados=1/1")),
  ];
  const r = quienTapaLaCola(cola);
  assert.equal(r.causa, "no_eventos");
  assert.equal(r.noEventos, 59);
  assert.equal(r.utiles, 21);
  // Nombra cada rama con su conteo: una rama nueva no puede quedar invisible.
  assert.deepEqual(
    r.clases.map((c) => `${c.rama}:${c.n}`),
    ["ignorado:51", "respondio:21", "MUDO:8"],
  );
});

test("cola tapada por TRAFICO real: no acusa al emisor", () => {
  const cola = Array.from({ length: 80 }, () => web("2026-09-27T08:47:51", "conv=49 rama=respondio enviados=1/1"));
  const r = quienTapaLaCola(cola);
  assert.equal(r.causa, "trafico");
  assert.equal(r.noEventos, 0);
  assert.equal(r.utiles, 80);
});

test("una rama DESCONOCIDA no se cuenta como no-evento, pero sale nombrada", () => {
  // Falla ABIERTA a proposito: si manana el emisor agrega `rama=descartado`, este gate NO la
  // acusa sola (subestima), pero la imprime con su conteo para que se pueda juzgar a ojo.
  const cola = Array.from({ length: 80 }, () => web("2026-09-27T08:47:51", "conv=49 rama=descartado"));
  const r = quienTapaLaCola(cola);
  assert.equal(r.noEventos, 0);
  assert.equal(r.clases[0].rama, "descartado");
  assert.equal(r.clases[0].n, 80);
});

test("cola sin ninguna rama reconocible: causa desconocida, nunca inventada", () => {
  const r = quienTapaLaCola(["texto suelto", "otra cosa"]);
  assert.equal(r.causa, "desconocida");
  assert.equal(r.clases.length, 0);
});
