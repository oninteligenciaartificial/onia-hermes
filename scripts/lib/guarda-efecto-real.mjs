// ONIA — BARANDA ANTI-EFECTO: la suite NO puede tocar produccion.
//
// POR QUE EXISTE, medido y no supuesto. El 2026-09-11 a las 05:16 UTC, doce casos nuevos de
// `rescate-run.test.mjs` llamaron al barrido con `emitir:true` y SIN inyectarle `deps.avisar`.
// El default de esa dependencia era el efecto real, asi que los casos:
//   · mandaron 18 Telegram reales en 50 s,
//   · le crearon a Sergio Urcullo una tarea 🔴 «Un mensaje quedo SIN contestar» — falsa: la
//     conversacion que nombraba estaba contestada hacia 3,7 h,
//   · y —lo caro— dejaron tres marcas en el directorio de produccion, una de ellas
//     `chatwoot-11-873`, que es el lead REAL de WhatsApp del 10-sep: su aviso quedo
//     silenciado por el test que creia estar probandolo.
// A las 06:05 se repitio entero, esta vez disparado por el integrador al correr `npm test`.
//
// LA FORMA DEL DEFECTO, que es lo reusable: `deps.x || <efecto real>`. El caso que se olvida
// de inyectar la dependencia NO FALLA — hace el efecto y pasa en VERDE, asi que nadie lo
// audita. Y un comentario que declara la hermeticidad («sin docker, sin red, sin Telegram»)
// no la obliga: es una hipotesis con fecha, y la desactiva justo cuando deja de ser cierta.
//
// POR QUE TIRA EN VEZ DE SER UN NO-OP: un no-op deja en VERDE al caso que cree estar probando
// el efecto, o sea cambia un test roto por un test inutil. El que se olvido de inyectar tiene
// que enterarse, y el mensaje le dice exactamente como arreglarlo.
//
// POR QUE VA EN EL PRODUCTO Y NO EN EL TEST: el test que hay que cuidar es el que todavia no
// esta escrito. Una baranda en los casos de hoy no protege del caso de manana.

/**
 * Corta cuando un default de efecto real se alcanza desde `node --test`.
 *
 * `NODE_TEST_CONTEXT` lo define el propio corredor (medido el 2026-09-11: vale `child-v8`),
 * asi que fuera de la suite esta funcion no hace nada y el camino de produccion queda intacto.
 *
 * @param {string} que        Que efecto se intento, para nombrarlo en el error.
 * @param {string} comoEvitar La inyeccion concreta que arregla el caso.
 */
export function guardaDeEfectoReal(que, comoEvitar) {
  if (!process.env.NODE_TEST_CONTEXT) return;
  const error = new Error(
    `hermetismo: un test llego al ${que} REAL. ${comoEvitar} — tocar produccion desde la suite ` +
      `manda avisos falsos y, peor, deja estado que silencia el aviso de un lead de verdad.`,
  );
  // Marcado para que un `try/catch` de resiliencia —de los que existen para que un canal caido
  // no tumbe un barrido ya hecho— no se lo trague. Sin esta marca la baranda falla ABIERTA
  // justo en el caso que viene a cuidar: el efecto queda silenciado y el test pasa en VERDE
  // creyendo que lo probo. Un canal caido se aguanta; un test escrito mal, no.
  error.hermetismo = true;
  throw error;
}
