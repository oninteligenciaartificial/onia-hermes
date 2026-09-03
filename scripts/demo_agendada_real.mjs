#!/usr/bin/env node
/**
 * demo_agendada_real.mjs — LA DEMO QUE EL BOT PROMETIO, ¿EXISTE?
 *
 *   node scripts/demo_agendada_real.mjs           (o `npm run demo:agendada`)
 *   node scripts/demo_agendada_real.mjs --self-check
 *
 * CODIGOS DE SALIDA
 *   0  toda demo agendada tiene su reserva            → la promesa se cumple
 *   1  hay demos prometidas que NO existen            → alguien va a llegar a una reunion vacia
 *   2  no se pudo medir                               → no medir NO es estar bien
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * POR QUE EXISTE, medido en produccion el 2026-09-03 y no supuesto.
 *
 * El carril tenia TRES gates en verde al mismo tiempo que perdia la unica venta que llego:
 *
 *   · `sonda_widget.mjs`        → "EL BOT CONTESTO LOS 3"
 *   · `vigia_sin_respuesta.mjs` → no dispara: el bot SI contesto
 *   · `objetivo_visible.mjs`    → la conversacion se ve en la bandeja
 *
 * Y sin embargo, conversacion 49 del widget, mensajes 370-371:
 *
 *   persona → "Dale, reservame el viernes 4 a las 14:00"
 *   bot     → "Listo, agendado: **viernes 4 de septiembre, 14:00**."
 *
 * En la base del motor esa misma conversacion quedo asi:
 *
 *   bot_stage = demo_agendada · scheduled_at = 2026-09-04 18:00Z · calendar_event_id = NULL
 *
 * O sea: **la demo no existe en ningun lado.** Dos causas, las dos verificadas contra el VPS y
 * no leidas de un doc:
 *   1. `/opt/onia/bot/webhook.env` NO tiene `CALCOM_BASE_URL`, asi que `createBooking` sale por
 *      `reason: "sin_config"` antes de intentar nada (`calcom-booking.mjs`). Y Cal.com esta
 *      muerto igual: no hay contenedor y `cal.onia.com.bo` responde 302 a `/empezar`.
 *   2. `ONIA_N8N_ENABLED=false` y `ONIA_N8N_EVENT_URL` vacio, asi que el efecto `notify_sergio`
 *      no llega a ningun lado. El aviso es fire-and-forget a proposito: nadie se entera de que
 *      no se entero nadie.
 *
 * El prospecto se lleva "Listo, agendado" y una linea que dice "estoy confirmando ese horario
 * con Sergio". Sergio no sabe que existe. El viernes a las 14:00 no va nadie.
 *
 * ⚠️ POR QUE NINGUN GATE VIEJO LO VE, y es la leccion que vale mas que este archivo:
 * **"contesto" no es "agendo".** Los tres gates miden que salga un mensaje. El turno 3 SALE, y
 * sale entusiasta. Es el mismo modo de falla que el carril ya tiene escrito —*"un test que mira
 * el primer paso no ve un sistema que muere en el segundo"*— corrido un piso mas arriba: ahora
 * el sistema muere en el turno que vale plata, con todos los turnos anteriores en verde.
 *
 * Este gate no mide mensajes: mide el ESTADO que el motor dejo escrito de si mismo.
 *
 * ⚠️ NO arregla la reserva — a proposito. Desplegar el bot necesita OK de Sergio y lo hace
 * `onia-cola`; este carril no despliega. Lo que faltaba no era el arreglo, era que se VIERA:
 * hasta hoy una demo prometida y inexistente no disparaba absolutamente nada.
 *
 * SOLO LECTURA sobre la base del motor. No escribe, no manda Telegram, no toca produccion.
 */

import { execFileSync } from 'node:child_process';

/** La base del MOTOR del bot, que NO es la de Chatwoot: `onia_center.bot_conversations`. */
const ESTADO_DB = process.env.ONIA_BOT_ESTADO_DB || 'supabase-db';

/**
 * El veredicto. Puro: mismas filas, mismo texto. Se separa de la consulta a proposito — es la
 * pieza que decide si el carril esta perdiendo ventas y se puede afirmar sin base de datos.
 *
 * @param {Array<{conversation_key:string, scheduled_label:string, scheduled_at:string,
 *                calendar_event_id:string|null}>} filas  las que ya estan en `demo_agendada`
 */
export function juzgar(filas) {
  if (!Array.isArray(filas)) {
    return { codigo: 2, texto: 'NO SE PUDO MEDIR — la consulta no devolvio una lista' };
  }
  if (filas.length === 0) {
    // Cero demos agendadas NO es un exito: es que todavia nadie llego al turno que vale plata.
    // Decir "OK" aca seria el gate dandose la razon a si mismo con una base vacia.
    return { codigo: 0, texto: 'SIN DEMOS AGENDADAS — nadie llego todavia al turno de elegir horario. Nada que verificar, y tampoco nada que festejar.' };
  }

  const huecas = filas.filter((f) => !String(f?.calendar_event_id || '').trim());
  if (huecas.length === 0) {
    return {
      codigo: 0,
      texto: `LAS ${filas.length} DEMOS AGENDADAS EXISTEN — todas tienen su reserva.`,
    };
  }

  const detalle = huecas
    .map((f) => `${f.conversation_key} (${String(f.scheduled_label || f.scheduled_at || 'sin fecha').trim()})`)
    .join(' · ');
  return {
    codigo: 1,
    texto:
      `${huecas.length} de ${filas.length} DEMO(S) PROMETIDAS QUE NO EXISTEN: ${detalle}. ` +
      'El bot dijo "Listo, agendado" y no hay reserva ni aviso a Sergio. ' +
      'Del otro lado hay alguien que va a llegar a una reunion vacia.',
  };
}

/** Lee las conversaciones que el motor dejo en `demo_agendada`. Solo lectura. */
export function leerFilas(exec = ejecutarSql) {
  // Las columnas se nombran una por una y NO con `*`: la tabla no tiene `scheduled_label` (el
  // texto "viernes 4 a las 14:00" lo arma el motor, no la base), y pedirla hacia salir 2 con
  // `column ... does not exist`. Se descubrio corriendo esto contra produccion, no leyendo.
  const crudo = exec(
    "select conversation_key, coalesce(scheduled_at::text,''), coalesce(calendar_event_id,'') " +
      "from onia_center.bot_conversations where bot_stage = 'demo_agendada' order by updated_at desc;",
  );
  return String(crudo)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((linea) => {
      const [conversation_key, scheduled_at, calendar_event_id] = linea.split('|');
      return { conversation_key, scheduled_at, calendar_event_id };
    });
}

function ejecutarSql(sql) {
  // `-i` NO es opcional: sin el, el heredoc no llega a psql, no devuelve nada y sale con exito.
  return execFileSync('docker', ['exec', '-i', ESTADO_DB, 'psql', '-U', 'postgres', '-d', 'postgres', '-tAc', sql], {
    encoding: 'utf8',
    timeout: 30_000,
  });
}

// ---------------------------------------------------------------------------
// Self-check: los casos que hacen fallar a este gate, sin base de datos.
// ---------------------------------------------------------------------------

function selfCheck() {
  const casos = [];
  const afirmar = (nombre, ok) => casos.push({ nombre, ok });

  // El caso REAL del 2026-09-03: la conversacion 49, prometida y sin reserva.
  const real = juzgar([
    { conversation_key: 'chatwoot:49', scheduled_label: 'viernes 4 de septiembre, 14:00', scheduled_at: '2026-09-04 18:00:00+00', calendar_event_id: '' },
  ]);
  afirmar('la demo prometida sin reserva sale 1', real.codigo === 1);
  afirmar('nombra la conversacion', real.texto.includes('chatwoot:49'));
  afirmar('nombra el horario que le prometio', real.texto.includes('viernes 4 de septiembre, 14:00'));

  // Con reserva de verdad: verde.
  afirmar(
    'con calendar_event_id sale 0',
    juzgar([{ conversation_key: 'chatwoot:49', scheduled_label: 'x', scheduled_at: 'y', calendar_event_id: 'abc123' }]).codigo === 0,
  );

  // null y espacios cuentan como SIN reserva: un uid en blanco no es un uid.
  afirmar('null cuenta como sin reserva', juzgar([{ conversation_key: 'k', calendar_event_id: null }]).codigo === 1);
  afirmar('espacios cuentan como sin reserva', juzgar([{ conversation_key: 'k', calendar_event_id: '   ' }]).codigo === 1);

  // Mezcla: una buena y una hueca. El gate tiene que fallar por la hueca, no promediar.
  const mezcla = juzgar([
    { conversation_key: 'ok', calendar_event_id: 'uid' },
    { conversation_key: 'hueca', calendar_event_id: '' },
  ]);
  afirmar('una hueca entre varias hace fallar igual', mezcla.codigo === 1);
  afirmar('no acusa a la que si tiene reserva', mezcla.texto.includes('hueca') && !mezcla.texto.includes('ok ('));

  // Base vacia: NO es un exito disfrazado. Sale 0 pero lo dice con todas las letras.
  const vacia = juzgar([]);
  afirmar('sin demos sale 0', vacia.codigo === 0);
  afirmar('sin demos NO dice que este todo bien', /nada que festejar/.test(vacia.texto));

  // No medir no es estar bien.
  afirmar('una consulta rota sale 2', juzgar(null).codigo === 2);

  // El parseo de las filas, con el separador de psql `-tA`.
  const filas = leerFilas(() => 'chatwoot:49|2026-09-04 18:00:00+00|\nchatwoot:9|2026-09-05 13:00:00+00|uid-9\n');
  afirmar('parsea las dos filas', filas.length === 2);
  afirmar('la primera queda sin reserva', filas[0].calendar_event_id === '' && filas[0].conversation_key === 'chatwoot:49');
  afirmar('la segunda conserva su uid', filas[1].calendar_event_id === 'uid-9');
  afirmar('sin scheduled_label cae a la fecha', juzgar(filas).texto.includes('2026-09-04 18:00:00+00'));
  afirmar('el juicio sobre lo parseado es 1', juzgar(filas).codigo === 1);

  const fallados = casos.filter((c) => !c.ok);
  for (const c of fallados) console.error(`FALLO: ${c.nombre}`);
  console.log(`${casos.length - fallados.length}/${casos.length} casos`);
  return fallados.length === 0 ? 0 : 1;
}

// ---------------------------------------------------------------------------

if (process.argv.includes('--self-check')) {
  process.exit(selfCheck());
}

let veredicto;
try {
  veredicto = juzgar(leerFilas());
} catch (e) {
  veredicto = { codigo: 2, texto: `NO SE PUDO MEDIR — ${e.message}` };
}
console.log(veredicto.texto);
process.exit(veredicto.codigo);
