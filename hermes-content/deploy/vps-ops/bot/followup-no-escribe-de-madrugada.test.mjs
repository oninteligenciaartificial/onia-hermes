// ---------------------------------------------------------------------------
// followup-no-escribe-de-madrugada.test.mjs
//
// QUE FIJA. El follow-up M3 no le escribe a un prospecto en hora silenciosa, y
// cuando la hora no da NO quema la reserva: el motivo es transitorio y la fila
// sale en el primer barrido de la mañana.
//
// POR QUE EXISTE, y por que ahora. El follow-up elige a quien escribirle por el
// SILENCIO del prospecto (`followUp.afterHours` = 20 h desde su ultimo mensaje),
// asi que la hora de salida es la de entrada corrida 20 h: quien escribe a las
// 10:00 —la hora mas comun de un negocio— recibe el seguimiento a las 06:00. El
// cron del VPS corre `17 * * * *`, las 24 horas, sin franja.
//
// Hasta el 2026-09-17 eso era inofensivo por la peor de las razones: el barrido
// corria en dry-run desde siempre (667 corridas, cero envios), asi que la
// madrugada nunca llego a pasar. Al encenderlo —mismo commit, wrapper derivando
// `--emit` del interruptor— el defecto dejaria de ser teorico. Cerrar una puerta
// puede abrir la de al lado: el mensaje de madrugada se paga con lo unico que no
// se repone, que es el quality rating de la linea de WhatsApp.
//
// SU HERMANO YA LO SABIA, y por eso esto es un olvido y no una decision:
// `reminder` frena antes de las 08:00 con `reminder.quietBeforeHour` ("un
// WhatsApp a esa hora molesta y castiga el quality rating", dice su config).
//
// ⚠️ CORREGIDO el 2026-09-18. Aca decia ademas que `insistencia` "queda acotado
// por la franja de SU cron (*/30 12-23 UTC = 08:00-19:59 de Bolivia)", y con eso
// lo daba por cubierto. La frase era cierta y absolvio al sujeto equivocado:
// medido al dia siguiente, `insistencia-run.mjs` no llamaba a `localHour` ni una
// vez, y su unica franja vivia en el crontab del VPS — fuera de git, de arranque
// y no de decision, y ciega al huso del negocio siendo el UNICO barrido
// multi-org. Enumerar a los hermanos en el comentario del propio arreglo es
// escribir una lista de INCLUSION, y el que la lee despues la toma por
// verificada. La clase la cierra ahora `barridos-no-escriben-de-madrugada`, que
// camina el disco en vez de citar esta lista.
//
// QUE CUESTA ESPERAR, dicho de frente: posponer puede cerrar la ventana de
// servicio de 24 h de Meta, y entonces el mensaje sale por la plantilla aprobada
// `seguimiento_demo` (~0,074 USD) en vez de texto libre. No se pierde ningun
// follow-up: se encarece el caso peor en medio boliviano. La alternativa era
// escribirle a las 5 de la mañana.
// ---------------------------------------------------------------------------

import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_CONFIG } from "./config.mjs";
import { skipReason } from "./followup-run.mjs";

/** Fila que YA cumple todo lo demas: solo la hora puede descartarla. */
function filaElegible(lastInboundAt) {
  return {
    conversationKey: "chatwoot:4242",
    botStage: "esperando_horario",
    followupStep: 0,
    humanTookOver: false,
    optOutAt: null,
    lastInboundAt,
  };
}

/** ISO del instante en que la fila cumple exactamente las 20 h de silencio. */
function veinteHorasDespues(iso) {
  return new Date(Date.parse(iso) + DEFAULT_CONFIG.followUp.afterHours * 3600000).toISOString();
}

test("la ventana silenciosa esta declarada en la config, no tipeada en el barrido", () => {
  const { quietBeforeHour, quietAfterHour } = DEFAULT_CONFIG.followUp;
  assert.equal(typeof quietBeforeHour, "number", "followUp.quietBeforeHour tiene que existir");
  assert.equal(typeof quietAfterHour, "number", "followUp.quietAfterHour tiene que existir");
  assert.ok(quietBeforeHour < quietAfterHour, "la franja en que SI se escribe no puede estar vacia");
  // El recordatorio ya declaro su piso: dos numeros distintos para "no molestar a esta hora"
  // serian dos politicas para el mismo hecho, que es justo lo que este archivo evita.
  assert.equal(quietBeforeHour, DEFAULT_CONFIG.reminder.quietBeforeHour, "mismo piso que el recordatorio M9");
});

test("un prospecto que escribio a las 10:00 NO recibe el seguimiento a las 06:00", () => {
  // 14:00Z = 10:00 de Bolivia. A las 20 h son las 10:00Z del dia siguiente = 06:00 local.
  const entrada = "2026-09-16T14:00:00Z";
  const ahora = veinteHorasDespues(entrada);
  const motivo = skipReason(filaElegible(entrada), ahora, DEFAULT_CONFIG);
  assert.match(String(motivo), /^horario_silencioso:6h$/, `a las 06:00 no se escribe (motivo: ${motivo})`);
});

test("tampoco de noche: las 22:00 locales caen del otro lado de la franja", () => {
  // 06:00Z = 02:00 local; +20 h = 02:00Z del dia siguiente = 22:00 local.
  const entrada = "2026-09-16T06:00:00Z";
  const ahora = veinteHorasDespues(entrada);
  const motivo = skipReason(filaElegible(entrada), ahora, DEFAULT_CONFIG);
  assert.match(String(motivo), /^horario_silencioso:22h$/, `a las 22:00 no se escribe (motivo: ${motivo})`);
});

test("en horario decente el follow-up sale (la guarda no apaga el barrido)", () => {
  // 16:00Z = 12:00 local; +20 h = 12:00Z = 08:00 local, primera hora habil.
  const entrada = "2026-09-16T16:00:00Z";
  assert.equal(skipReason(filaElegible(entrada), veinteHorasDespues(entrada), DEFAULT_CONFIG), null);
  // Y en plena tarde, obvio.
  const tarde = "2026-09-16T21:00:00Z"; // 17:00 local; +20 h = 13:00 local
  assert.equal(skipReason(filaElegible(tarde), veinteHorasDespues(tarde), DEFAULT_CONFIG), null);
});

test("la hora silenciosa es lo ULTIMO que se pregunta: no tapa un descarte definitivo", () => {
  // Misma hora mala, pero la conversacion ya tiene su follow-up: eso no se arregla esperando,
  // y confundirlo con "vuelvo a la mañana" haria que el barrido la mire para siempre.
  const entrada = "2026-09-16T14:00:00Z";
  const fila = { ...filaElegible(entrada), followupStep: 1 };
  assert.equal(skipReason(fila, veinteHorasDespues(entrada), DEFAULT_CONFIG), "ya_tiene_followup");

  // Y un humano a cargo gana sobre todo lo demas, a cualquier hora.
  const conHumano = { ...filaElegible(entrada), humanTookOver: true };
  assert.equal(skipReason(conHumano, veinteHorasDespues(entrada), DEFAULT_CONFIG), "humano_a_cargo");
});

test("esperar a la mañana no pierde el follow-up: a las 08:00 la fila sigue elegible", () => {
  const entrada = "2026-09-16T14:00:00Z"; // 10:00 local
  const alAmanecer = "2026-09-17T12:00:00Z"; // 08:00 local, 22 h de silencio
  assert.equal(skipReason(filaElegible(entrada), alAmanecer, DEFAULT_CONFIG), null);
  // Lo que sigue cortando es la vejez, no la hora: a los 8 dias no se escribe ni con plantilla.
  const muyViejo = "2026-09-25T12:00:00Z";
  assert.match(String(skipReason(filaElegible(entrada), muyViejo, DEFAULT_CONFIG)), /^conversacion_muerta:/);
});
