/**
 * CUANDO ESTA SERGIO URCULLO — una sola vez, para el que OFRECE y para el que PROMETE.
 *
 * El bot hace dos cosas con este dato y hasta el 2026-09-13 las hacia con dos fuentes:
 * ofrecia los horarios de demo calculados por `scripts/loops/renovar-slots-bot.py` (que lleva
 * la cita textual de Sergio Urcullo del 2026-09-02) y prometia la respuesta del humano con un
 * `businessHours` tipeado a mano en `config.mjs` que decia "lun-vie, 9:00-18:00". Un mismo
 * mensaje podia ofrecer "martes 15, 14:00" y prometer atencion desde las 9:00.
 *
 * Ventanas, en hora de La Paz (UTC-4, sin horario de verano):
 *
 *     lunes a viernes  14:00-17:00 y 20:00-22:00
 *     sabado           09:00-15:00
 *     domingo          no trabaja  (ausente a proposito, no es un olvido)
 *
 * Las claves son el dia como lo numera `Date#getUTCDay` (domingo = 0), que es con lo que
 * compara el motor. El .py numera lunes = 0 (`datetime.weekday`) y su gate traduce.
 */

/** dia (domingo = 0) -> franjas [horaDesde, horaHasta) en hora local de La Paz. */
export const VENTANAS_ATENCION = Object.freeze({
  1: Object.freeze([Object.freeze([14, 17]), Object.freeze([20, 22])]),
  2: Object.freeze([Object.freeze([14, 17]), Object.freeze([20, 22])]),
  3: Object.freeze([Object.freeze([14, 17]), Object.freeze([20, 22])]),
  4: Object.freeze([Object.freeze([14, 17]), Object.freeze([20, 22])]),
  5: Object.freeze([Object.freeze([14, 17]), Object.freeze([20, 22])]),
  6: Object.freeze([Object.freeze([9, 15])]),
});

const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

/** Copia mutable de las ventanas, para que un consumidor no congele al de al lado. */
export function franjasDeAtencion(ventanas = VENTANAS_ATENCION) {
  const salida = {};
  for (const [dia, franjas] of Object.entries(ventanas)) {
    salida[Number(dia)] = franjas.map(([desde, hasta]) => [desde, hasta]);
  }
  return salida;
}

/** Los dias con atencion, ordenados. Es lo que `businessHours.days` tiene que decir. */
export function diasDeAtencion(ventanas = VENTANAS_ATENCION) {
  return Object.keys(ventanas)
    .map(Number)
    .sort((a, b) => a - b);
}

/**
 * La ENVOLVENTE de la semana: la hora mas temprana que abre y la mas tarde que cierra.
 * NO es el horario de atencion —entre las dos hay huecos— y por eso no se usa para decidir:
 * existe para los consumidores que solo saben leer un rango (el horario propio de un CLIENTE,
 * que se declara asi). Mismo malentendido que `clinicSettings.openTime` en el producto.
 */
export function envolventeDeAtencion(ventanas = VENTANAS_ATENCION) {
  const todas = Object.values(ventanas).flat();
  return {
    startHour: Math.min(...todas.map(([desde]) => desde)),
    endHour: Math.max(...todas.map(([, hasta]) => hasta)),
  };
}

function fraseDeFranjas(franjas) {
  return franjas.map(([desde, hasta]) => `${desde}:00-${hasta}:00`).join(" y ");
}

/**
 * Como se le DICE al lead, derivado de las ventanas de arriba. Agrupa los dias contiguos que
 * comparten franjas ("lun-vie 14:00-17:00 y 20:00-22:00, sáb 9:00-15:00") para que agregar o
 * mover una ventana cambie la promesa sola, sin que nadie tenga que acordarse de reescribirla.
 */
export function fraseDeAtencion(ventanas = VENTANAS_ATENCION) {
  const dias = diasDeAtencion(ventanas);
  const grupos = [];
  for (const dia of dias) {
    const firma = fraseDeFranjas(ventanas[dia]);
    const ultimo = grupos.at(-1);
    if (ultimo && ultimo.firma === firma && ultimo.hasta === dia - 1) ultimo.hasta = dia;
    else grupos.push({ desde: dia, hasta: dia, firma });
  }
  return grupos
    .map(({ desde, hasta, firma }) => {
      const cuando =
        desde === hasta
          ? DIAS_CORTOS[desde]
          : hasta === desde + 1
            ? `${DIAS_CORTOS[desde]} y ${DIAS_CORTOS[hasta]}`
            : `${DIAS_CORTOS[desde]}-${DIAS_CORTOS[hasta]}`;
      return `${cuando} ${firma}`;
    })
    .join(", ");
}

/**
 * ¿Ese instante cae FUERA de atencion? Determinista: solo lee el ISO que le pasan.
 * `franjas` es el mapa de arriba; `tzOffsetMinutes` la zona en la que estan escritas.
 */
export function fueraDeAtencion(isoInstant, config) {
  const ms = Date.parse(isoInstant);
  if (Number.isNaN(ms)) return false;
  const franjas = config?.businessHours?.franjas ?? VENTANAS_ATENCION;
  const offset = config?.businessHours?.tzOffsetMinutes ?? -240;
  const local = new Date(ms + offset * 60000);
  const delDia = franjas[local.getUTCDay()];
  if (!delDia || delDia.length === 0) return true;
  const hora = local.getUTCHours() + local.getUTCMinutes() / 60;
  return !delDia.some(([desde, hasta]) => hora >= desde && hora < hasta);
}
