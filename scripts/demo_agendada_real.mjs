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
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// ⚠️ Se IMPORTA, no se copia. "Quienes somos nosotros" (el celular de Sergio, los contactos de
// prueba) ya esta decidido y probado en `objetivo_visible.mjs`, y CLAUDE.md pide una sola fuente
// de verdad por tema: dos listas de lo mismo divergen el dia que alguien agrega un numero a una.
// Ese modulo no dispara nada al importarlo — su `main` esta detras de la guarda de `argv[1]`.
import { esNuestra } from './objetivo_visible.mjs';

/** La base del MOTOR del bot, que NO es la de Chatwoot: `onia_center.bot_conversations`. */
const ESTADO_DB = process.env.ONIA_BOT_ESTADO_DB || 'supabase-db';

/** La base de CHATWOOT, donde viven los mensajes que el bot mando de verdad. */
const CHATWOOT_DB = process.env.ONIA_CHATWOOT_DB_CONTAINER || 'onia-chatbot_chatwoot-db';

/** El contenedor donde CORRE el webhook del bot (no es donde vive el repo: `/opt` es el origen). */
const BOT_CONTENEDOR = process.env.ONIA_BOT_CONTENEDOR || 'onia-center';

/** El log del webhook. Se abre con `>>`, asi que sobrevive a los reinicios del proceso. */
const BOT_LOG = process.env.ONIA_BOT_LOG || '/tmp/onia-bot-webhook.log';

/** El guion del bot: de ahi sale la frase de la promesa, para no hardcodearla. */
const CONFIG_DEL_BOT =
  process.env.ONIA_BOT_CONFIG || new URL('../hermes-content/deploy/vps-ops/bot/config.mjs', import.meta.url).pathname;

/**
 * La frase con la que el bot PROMETE la reserva, sacada del guion del propio bot (`config.mjs`,
 * mensaje `M2`) y no escrita aca.
 *
 * Por que no va hardcodeada: el dia que alguien reescriba M2, un literal pegado en este archivo
 * seguiria buscando un texto que ya nadie manda — el gate quedaria verde para siempre sin que
 * nadie lo tocara. Es el mismo modo de falla que este archivo existe para cerrar, un piso mas
 * abajo. Si el guion no trae M2, devuelve `null` y el gate sale 2: **no medir no es estar bien.**
 *
 * Se corta en el primer `{{`: lo que sigue es el dia y la hora, distintos en cada conversacion.
 *
 * @param {string} textoConfig  el contenido de `config.mjs`
 * @returns {string|null} el prefijo literal de la promesa, o null si el guion no la tiene
 */
/**
 * Un instante en milisegundos, tolerando el formato que devuelve Postgres.
 *
 * ⚠️ Existe por una trampa medida el 2026-09-04: `psql` imprime `2026-09-03 15:09:34+00` y
 * `Date.parse` devuelve **NaN** con ese offset de dos digitos (necesita `+00:00` o `Z`). Sin
 * esto, toda comparacion de fechas de este gate era `NaN < corte` = false, o sea que ninguna
 * promesa podia clasificarse nunca como historica. Fallaba del lado seguro —rojo de mas, no de
 * menos— y por eso no se veia: el veredicto seguia pareciendo razonable.
 *
 * @param {string} valor  `2026-09-03 15:09:34+00`, ISO, o cualquier cosa parseable
 * @returns {number} milisegundos, o NaN si no se pudo leer
 */
export function instante(valor) {
  const crudo = String(valor || '').trim().replace(' ', 'T');
  // `+00` / `-04` → `+00:00` / `-04:00`. Los que ya traen minutos o `Z` no se tocan.
  return Date.parse(crudo.replace(/([+-]\d{2})$/, '$1:00'));
}

export function frasePromesa(textoConfig) {
  const m2 = /M2:\s*\[\s*"([^"]*)"/.exec(String(textoConfig || ''));
  if (!m2) return null;
  const literal = m2[1].split('{{')[0].replace(/\*/g, '').trim();
  return literal.length >= 8 ? literal : null;
}

/**
 * El veredicto. Puro: mismas promesas, mismo texto.
 *
 * ⚠️ Los SUJETOS son las promesas dichas, no las filas del motor — y esa es toda la diferencia.
 * La version anterior preguntaba "¿que conversaciones estan hoy en `bot_stage='demo_agendada'`?",
 * o sea que sacaba su lista de sujetos de un estado MUTABLE, y `sonda_widget.mjs` lo blanquea
 * cada hora sobre la misma conversacion que mide. Un gate cuya evidencia puede desaparecer sola
 * no es un gate: es un permiso. Ahora la lista sale de `messages` de Chatwoot, que es append-only.
 *
 * ⚠️ "Le llego a Sergio" tiene DOS caminos, y el gate mide los dos porque Sergio eligio uno de
 * ellos a proposito. En t_b18ca430 decidio la opcion (a) —aviso por Telegram, SIN calendario— y
 * dejo Cal.com para cuando moleste anotar a mano. O sea que `calendar_event_id` va a quedar NULL
 * POR DISENO: exigir la reserva como unica prueba deja este gate rojo para siempre contra un
 * mecanismo que se descarto. Una promesa esta cumplida si tiene reserva **o** si salio su aviso.
 *
 * ⚠️ Y se mira la FECHA del fallo, no solo su existencia. Los sujetos salen de `messages`, que es
 * append-only: eso cerro un gate que fallaba abierto, pero abrio el defecto simetrico — una
 * promesa hueca de hace seis dias no se puede desdecir, asi que el veredicto quedaba ROJO PARA
 * SIEMPRE por algo que ya no esta pasando. Es como se dejo de creer al vigia del embudo, que
 * reportaba como incidente activo errores de seis dias antes. Lo viejo se NOMBRA igual (callarlo
 * seria volver a fallar abierto), pero no enrojece: el corte es si el canal de aviso ya existia
 * cuando se hizo la promesa.
 *
 * @param {Array<{conversationId:number, texto:string, creado:string}>} promesas  lo que el bot dijo
 * @param {Record<string,string>} reservas  conversation_key → calendar_event_id del motor
 * @param {Record<number,boolean>} avisos   conversationId → salio el aviso a Sergio
 * @param {string|null} avisoDesde          desde cuando existe el canal de aviso; null = no hay
 */
/**
 * ¿La promesa se la hizo el bot a una sonda NUESTRA, o a alguien de afuera?
 *
 * Los nombres salen de lo que hay hoy en `contacts` de Chatwoot (medido el 2026-09-26): las
 * sondas se llaman `Sonda QA…` a proposito (lo dice `sonda_widget.mjs`, que lo eligio asi para
 * que `objetivo_visible.mjs` no las cuente como desconocidos), y las pruebas viejas quedaron
 * como `Prueba …`, `Cliente Prueba …`, `Prospecto Prueba …`, `Visitante Prueba …`.
 *
 * ⚠️ El criterio es ESTRECHO y la duda se resuelve hacia "es un prospecto", a proposito. Los dos
 * errores posibles no cuestan lo mismo: contar una sonda como prospecto infla la demanda y manda
 * a gastar en Cal.com; contar un prospecto como sonda ESCONDE la unica demanda que hay, que es lo
 * que este carril existe para encontrar. Por eso un nombre generado por Chatwoot
 * (`delicate-glitter-674`) cuenta como persona, y por eso quedan afuera `Cliente Insistencia Dos`
 * y `Cliente Comprobante` —que SI son nuestras, pero viven en el inbox 7 de QA y esta fila no
 * trae `inbox_id`—: de menos y nombradas, nunca de mas y mudas.
 */
export function esSondaNuestra(contacto) {
  const n = String(contacto || '').trim().toLowerCase();
  if (!n) return false; // sin nombre no se puede afirmar que sea nuestra
  return /^sonda\b/.test(n) || /^(prueba|cliente prueba|prospecto prueba|visitante prueba)\b/.test(n);
}

export function juzgar(promesas, reservas, avisos = {}, avisoDesde = null) {
  if (!Array.isArray(promesas) || !reservas || typeof reservas !== 'object') {
    return { codigo: 2, texto: 'NO SE PUDO MEDIR — la consulta no devolvio lo que se esperaba' };
  }
  if (promesas.length === 0) {
    // Cero promesas NO es un exito: es que todavia nadie llego al turno que vale plata.
    // Decir "OK" aca seria el gate dandose la razon a si mismo con una base vacia.
    return { codigo: 0, texto: 'SIN DEMOS AGENDADAS — nadie llego todavia al turno de elegir horario. Nada que verificar, y tampoco nada que festejar.' };
  }

  // Sin reserva NI aviso a nombre de esa conversacion, la promesa esta hueca. Que la fila no
  // exista pesa igual que que exista vacia: en los dos casos no hay nada reservado y alguien fue
  // invitado. El aviso cuenta como cumplimiento porque es el canal que Sergio eligio (opcion a).
  const reservada = (p) => Boolean(String(reservas[`chatwoot:${p.conversationId}`] || '').trim());
  const avisada = (p) => Boolean(avisos && avisos[p.conversationId]);
  const huecas = promesas.filter((p) => !reservada(p) && !avisada(p));
  if (huecas.length === 0) {
    // El JUICIO es sobre todas (una promesa hueca de una sonda delata el mismo defecto), pero el
    // NUMERO que se publica separa quien la pidio. Ver el caso del 2026-09-26 en `selfCheck`.
    const deSondas = promesas.filter((p) => esSondaNuestra(p.contacto)).length;
    const dePersonas = promesas.length - deSondas;
    if (dePersonas === 0) {
      return {
        codigo: 0,
        texto:
          `DEMOS QUE LLEGARON A SERGIO: ${promesas.length} en total, pero ninguna es de un prospecto — ` +
          'son todas sondas nuestras. Nada que festejar: nadie pidio una demo todavia.',
      };
    }
    const cuenta = dePersonas === 1 ? '1 de un prospecto' : `${dePersonas} de prospectos`;
    const sondas = deSondas > 0 ? `, ${deSondas} de sondas nuestras (${promesas.length} en total)` : '';
    return {
      codigo: 0,
      texto: `DEMOS QUE LLEGARON A SERGIO: ${cuenta}${sondas} — cada una tiene su reserva o su aviso.`,
    };
  }

  const describir = (p) =>
    `conv ${p.conversationId} «${String(p.contacto || '').trim() || 'sin nombre'}» ` +
    `("${String(p.texto || '').replace(/\*/g, '').trim()}")`;

  // ── La fecha del fallo ──────────────────────────────────────────────────────────────────────
  // Sin canal de aviso no se puede declarar nada "historico": ese es el PEOR estado posible, no
  // uno tolerable — significa que ninguna demo puede llegar a Sergio por ningun camino. Ahi todas
  // las huecas cuentan como activas y se dice por que.
  const corte = avisoDesde ? instante(avisoDesde) : NaN;
  const esHistorica = (p) =>
    Number.isFinite(corte) && Number.isFinite(instante(p.creado)) && instante(p.creado) < corte;

  const activas = huecas.filter((p) => !esHistorica(p));
  const historicas = huecas.filter(esHistorica);

  // Lo viejo se nombra SIEMPRE, salga verde o rojo: un gate que se calla sobre lo que decidio no
  // contar es el mismo fallo abierto que este archivo vino a cerrar, con mejor presentacion.
  const colaHistorica = historicas.length
    ? ` No cuento como incidente activo ${historicas.length} promesa(s) anteriores al canal de aviso ` +
      `(${historicas.map(describir).join(' · ')}): es historia, ya no se puede rescatar y repetirla ` +
      `como alarma es como se deja de creer a un vigia.`
    : '';

  if (activas.length === 0) {
    return {
      codigo: 0,
      texto:
        `SIN DEMOS HUECAS NUEVAS — desde que existe el aviso a Sergio, toda promesa tuvo su ` +
        `reserva o su aviso.${colaHistorica}`,
    };
  }

  const detalle = activas.map(describir).join(' · ');

  // QUIEN esta del otro lado. Un rojo de la sonda de QA y un rojo de un lead real valen distinto
  // para el que lo lee, y hasta hoy se leian igual: el gate cerraba SIEMPRE con "alguien va a
  // llegar a una reunion vacia", frase que el 2026-09-03 era falsa (la unica hueca era la sonda).
  // Un vigia que grita mal no molesta: INUTILIZA, y a este ya se le habia dejado de creer una vez.
  //
  // ⚠️ Se informa, NO se filtra: el codigo es 1 en los dos casos. Sacar a la sonda de los sujetos
  // devolveria el gate a fallar abierto — el bug que la vuelta anterior cerro.
  const humanas = activas.filter((p) => !esNuestra(p));
  const cierre = humanas.length
    ? 'El bot lo dijo y no hay reserva ni aviso a Sergio. ' +
      'Del otro lado hay alguien que va a llegar a una reunion vacia.'
    : 'El bot lo dijo y no hay reserva ni aviso a Sergio. Hoy son TODAS de la sonda QA de este ' +
      'carril, asi que no hay nadie plantado — pero el motor prometio exactamente lo mismo que le ' +
      'prometeria a un lead, y por eso sigue en rojo.';

  // Que NO haya canal es una causa distinta de que el canal haya fallado, y se arreglan en
  // lugares opuestos: una se arregla encendiendo el aviso, la otra mirando por que no salio.
  const sinCanal = avisoDesde
    ? ''
    : ' Y no hay NINGUN canal de aviso activo: ni calendario ni Telegram, asi que hoy ninguna ' +
      'demo puede llegar a Sergio por ningun camino.';

  return {
    codigo: 1,
    texto: `${activas.length} de ${promesas.length} DEMO(S) PROMETIDAS QUE NO EXISTEN: ${detalle}. ${cierre}${sinCanal}${colaHistorica}`,
  };
}

/**
 * Las promesas que el bot MANDO, leidas de Chatwoot (`message_type=1` es saliente).
 *
 * Append-only por diseno de Chatwoot: una promesa dicha no se puede desdecir borrando una fila.
 */
export function leerPromesas(frase, exec = ejecutarSqlChatwoot) {
  if (!frase) throw new Error('no encontre la promesa de reserva (M2) en el guion del bot');
  // El contacto va ANTES del texto libre a proposito: `-tA` separa con `|` y no escapa nada, asi
  // que un `|` dentro del mensaje del bot correria las columnas y le atribuiria la promesa a otro.
  // Con el texto ultimo, lo que sobre se vuelve a pegar y ningun campo se contamina.
  const crudo = exec(
    `select m.conversation_id, m.created_at, coalesce(ct.name, ''), coalesce(ct.phone_number, ''), ` +
      `replace(left(m.content, 120), '\n', ' ') ` +
      `from messages m join conversations c on c.id = m.conversation_id ` +
      `left join contacts ct on ct.id = c.contact_id ` +
      `where m.message_type = 1 and m.content like '%${frase.replace(/'/g, "''")}%' order by m.created_at;`,
  );
  return String(crudo)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((linea) => {
      const [conversationId, creado, contacto, telefono, ...resto] = linea.split('|');
      return { conversationId: Number(conversationId), creado, contacto, telefono, texto: resto.join('|') };
    });
}

/**
 * Las reservas que el motor tiene anotadas, por conversacion. TODAS las filas: filtrar por
 * `bot_stage` es justamente lo que dejaba pasar a las conversaciones rebobinadas.
 */
export function leerReservas(exec = ejecutarSqlMotor) {
  const crudo = exec(
    "select conversation_key, coalesce(calendar_event_id,'') from onia_center.bot_conversations;",
  );
  const mapa = {};
  for (const linea of String(crudo).split('\n').map((l) => l.trim()).filter(Boolean)) {
    const [clave, uid] = linea.split('|');
    mapa[clave] = uid || '';
  }
  return mapa;
}

/**
 * En Swarm los contenedores NO se llaman como su servicio: `onia-chatbot_chatwoot-db` es en
 * realidad `onia-chatbot_chatwoot-db.1.<sufijo>`, y el sufijo cambia en cada redeploy.
 */
function contenedor(prefijo) {
  const encontrado = execFileSync('docker', ['ps', '--filter', `name=${prefijo}`, '--format', '{{.Names}}'], {
    encoding: 'utf8',
    timeout: 30_000,
  })
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)[0];
  if (!encontrado) throw new Error(`no encontre el contenedor "${prefijo}" en docker ps`);
  return encontrado;
}

function ejecutarSqlMotor(sql) {
  // `-i` NO es opcional: sin el, el heredoc no llega a psql, no devuelve nada y sale con exito.
  return execFileSync('docker', ['exec', '-i', ESTADO_DB, 'psql', '-U', 'postgres', '-d', 'postgres', '-tAc', sql], {
    encoding: 'utf8',
    timeout: 30_000,
  });
}

/**
 * Los avisos a Sergio que SALIERON, leidos del log del webhook.
 *
 * ⚠️ Las lineas `[aviso]` NO llevan fecha propia: la sacan de la linea `[onia-webhook]` que las
 * precede, que es el turno que las produjo. Por eso se recorre el log en orden y se arrastra la
 * ultima fecha vista, en vez de intentar parsear cada linea sola.
 *
 * `desde` es la fecha del primer aviso que se ENVIO de verdad, y no la del primer `[aviso]` de
 * cualquier tipo, a proposito: las primeras lineas del log son `skipped ... apagado
 * (ONIA_BOT_TG_AVISO)`, que prueban que el codigo corria pero el canal estaba CERRADO. Tomar
 * esas como "desde aca hay canal" excusaria como historicas promesas que de verdad no le
 * llegaron a nadie. Si nunca salio ninguno, `desde` es null y el gate no excusa nada.
 *
 * @param {string[]} lineas  el log, en orden
 * @returns {{avisos: Record<number, boolean>, desde: string|null}}
 */
export function leerAvisos(lineas) {
  const avisos = {};
  let ultimaFecha = null;
  let desde = null;
  for (const linea of Array.isArray(lineas) ? lineas : []) {
    const fecha = /(\d{4}-\d{2}-\d{2}T[\d:.]+Z)/.exec(linea);
    if (fecha) ultimaFecha = fecha[1];
    if (!String(linea).startsWith('[aviso]')) continue;
    if (!/\bsent\b/.test(linea)) continue;
    if (!desde) desde = ultimaFecha;
    const conv = /conv=(\d+)/.exec(linea);
    if (conv) avisos[Number(conv[1])] = true;
  }
  return { avisos, desde };
}

/** El log del webhook vivo. Solo lectura: `grep` dentro del contenedor, no toca nada. */
function leerLogDelBot() {
  const crudo = execFileSync(
    'docker',
    ['exec', BOT_CONTENEDOR, 'sh', '-c', `grep -E '^\\[aviso\\]|^\\[onia-webhook\\]' ${BOT_LOG} 2>/dev/null || true`],
    { encoding: 'utf8', timeout: 30_000, maxBuffer: 32 * 1024 * 1024 },
  );
  return String(crudo).split('\n');
}

function ejecutarSqlChatwoot(sql) {
  return execFileSync('docker', ['exec', '-i', contenedor(CHATWOOT_DB), 'psql', '-U', 'postgres', '-d', 'onia-chatbot', '-tAc', sql], {
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
  const real = juzgar(
    [{ conversationId: 49, texto: 'Listo, agendado: **viernes 4 de septiembre, 14:00**.', creado: '2026-09-03 15:09:34+00' }],
    { 'chatwoot:49': '' },
  );
  afirmar('la demo prometida sin reserva sale 1', real.codigo === 1);
  afirmar('nombra la conversacion', real.texto.includes('conv 49'));
  afirmar('nombra el horario que le prometio', real.texto.includes('viernes 4 de septiembre, 14:00'));

  // null y espacios cuentan como SIN reserva: un uid en blanco no es un uid.
  afirmar('null cuenta como sin reserva', juzgar([{ conversationId: 7 }], { 'chatwoot:7': null }).codigo === 1);
  afirmar('espacios cuentan como sin reserva', juzgar([{ conversationId: 7 }], { 'chatwoot:7': '   ' }).codigo === 1);

  // Mezcla: una buena y una hueca. El gate tiene que fallar por la hueca, no promediar.
  const mezcla = juzgar(
    [{ conversationId: 1, texto: 'buena' }, { conversationId: 2, texto: 'hueca' }],
    { 'chatwoot:1': 'uid', 'chatwoot:2': '' },
  );
  afirmar('una hueca entre varias hace fallar igual', mezcla.codigo === 1);
  afirmar('no acusa a la que si tiene reserva', mezcla.texto.includes('conv 2') && !mezcla.texto.includes('conv 1'));

  // ── El numero que este gate PUBLICA se lee como demanda comercial ───────────────────────────
  // Medido el 2026-09-26: en verde decia "LAS 13 DEMOS PROMETIDAS LLEGARON A SERGIO" y de esas 13
  // casi todas eran `sonda_widget.mjs` corriendo sobre la conv 49. Los sujetos salen de `messages`
  // (append-only, y esta BIEN asi: es lo que arreglo el gate anterior), pero eso significa que cada
  // corrida horaria de nuestra propia sonda suma una promesa para siempre. El total es correcto
  // para lo que el gate juzga —¿toda promesa tiene reserva o aviso?— y ENGAÑOSO en cuanto se lee
  // como cuantas demos pidio gente. Quien lo lee asi es la condicion de vencimiento de Cal.com
  // (cola/chatbot.md, item cerrado del 13-sep): *"mas de ~1 demo agendada por semana"* reabre
  // redesplegar Cal.com o abrir una cuenta cloud. O sea que el numero inflado por nuestras sondas
  // manda a gastar por demanda que no existe. El contacto ya venia en la fila (`p.contacto`);
  // lo unico que faltaba era no sumar sondas y prospectos en el mismo numero.
  const conSonda = juzgar(
    [
      { conversationId: 49, texto: 'Listo, agendado: **lunes**', contacto: 'Sonda QA carril chatbot' },
      { conversationId: 50, texto: 'Listo, agendado: **lunes**', contacto: 'Sonda QA' },
      { conversationId: 9, texto: 'Listo, agendado: **sabado**', contacto: 'Mario Hassen' },
    ],
    { 'chatwoot:49': 'uid', 'chatwoot:50': 'uid', 'chatwoot:9': 'uid' },
  );
  afirmar('el verde cuenta las demos de PROSPECTOS, no el total', /\b1 de un prospecto\b/.test(conSonda.texto));
  afirmar('el verde no publica el total como si fuera demanda', !/^LAS 3 DEMOS PROMETIDAS/.test(conSonda.texto));
  afirmar('el verde nombra las sondas igual, no las esconde', /2 de sondas nuestras/.test(conSonda.texto));

  // Todas nuestras: el peor caso para la condicion de vencimiento, porque es el que mas se parece
  // a "hay demanda" y es exactamente lo contrario. Tiene que decir CERO prospectos, no tres demos.
  const todasSondas = juzgar(
    [
      { conversationId: 49, texto: 'a', contacto: 'Sonda QA carril chatbot' },
      { conversationId: 45, texto: 'b', contacto: 'Sonda QA' },
      { conversationId: 39, texto: 'c', contacto: 'Cliente Prueba Bandeja' },
    ],
    { 'chatwoot:49': 'uid', 'chatwoot:45': 'uid', 'chatwoot:39': 'uid' },
  );
  afirmar('sin un solo prospecto lo dice, no festeja 3 demos', /ninguna es de un prospecto/.test(todasSondas.texto));
  afirmar('sigue saliendo 0: no es un fallo, es que nadie pidio demo', todasSondas.codigo === 0);

  // Un nombre raro de visitante real (Chatwoot los genera asi) NO es una sonda: si la duda se
  // resolviera hacia "es nuestra", el gate esconderia demanda real, que es el error caro.
  const visitante = juzgar(
    [{ conversationId: 34, texto: 'Listo, agendado: **martes**', contacto: 'delicate-glitter-674' }],
    { 'chatwoot:34': 'uid' },
  );
  afirmar('un visitante con nombre generado cuenta como prospecto', /\b1 de un prospecto\b/.test(visitante.texto));

  // No medir no es estar bien.
  afirmar('una consulta rota sale 2', juzgar(null, {}).codigo === 2);
  afirmar('sin mapa de reservas sale 2', juzgar([], null).codigo === 2);

  // El parseo de los mensajes, con el separador de psql `-tA`.
  const proms = leerPromesas(
    'Listo, agendado:',
    () =>
      '49|2026-09-04 18:00:00+00|Sonda QA carril chatbot||Listo, agendado: **viernes 4**.\n' +
      '9|2026-09-05 13:00:00+00|Mario Hassen|+59173021804|Listo, agendado: **sabado 5**.\n',
  );
  afirmar('parsea las dos promesas', proms.length === 2);
  afirmar('la primera es la conv 49', proms[0].conversationId === 49);
  afirmar('conserva el texto prometido', proms[1].texto.includes('sabado 5'));
  afirmar('lee el nombre del contacto', proms[0].contacto === 'Sonda QA carril chatbot');
  afirmar('lee el telefono del contacto', proms[1].telefono === '+59173021804');
  afirmar('un contacto sin nombre queda vacio, no undefined', proms[1].contacto === 'Mario Hassen' && proms[0].telefono === '');
  // `-tA` no escapa NADA: un `|` dentro del mensaje partiria la fila y le colgaria la promesa a
  // otro contacto. Por eso el texto es la ULTIMA columna y lo que sobra se vuelve a pegar.
  const conBarra = leerPromesas('Listo, agendado:', () => '5|2026-09-06 12:00:00+00|Ana|+591700|Listo, agendado: **lunes** | confirmo con Sergio\n');
  afirmar('un `|` en el mensaje no corre las columnas', conBarra[0].contacto === 'Ana');
  afirmar('un `|` en el mensaje no se pierde del texto', conBarra[0].texto === 'Listo, agendado: **lunes** | confirmo con Sergio');
  afirmar('sin frase no consulta nada', (() => { try { leerPromesas(null, () => ''); return false; } catch { return true; } })());

  // El parseo del mapa de reservas.
  const res = leerReservas(() => 'chatwoot:49|\nchatwoot:9|uid-9\n');
  afirmar('la conv 49 queda sin reserva', res['chatwoot:49'] === '');
  afirmar('la conv 9 conserva su uid', res['chatwoot:9'] === 'uid-9');
  afirmar('el juicio sobre lo parseado es 1', juzgar(proms, res).codigo === 1);

  // ⚠️ Guardia contra el guion REAL, no contra un string de mentira: si `config.mjs` deja de
  // traer M2, este gate se queda ciego y hay que enterarse aca y no en produccion.
  try {
    const m2Real = frasePromesa(readFileSync(CONFIG_DEL_BOT, 'utf8'));
    afirmar('el guion real todavia trae la promesa', typeof m2Real === 'string' && m2Real.length >= 8);
  } catch {
    console.error('AVISO: no pude leer el guion del bot; me salteo el guardia contra disco');
  }

  // ── El agujero del 2026-09-03 tarde: la SONDA BORRA la fila que este gate lee ──────────────
  //
  // `sonda_widget.mjs` corre cada hora en el chequeo de arranque del carril y, para que el motor
  // vuelva a ver a un desconocido, ejecuta `guionBlanqueo()`, que sobre la MISMA conversacion 49
  // hace `bot_stage='nuevo', scheduled_at=null, calendar_event_id=null`. O sea que la unica fila
  // que podia poner este gate en rojo se blanquea sesenta minutos despues de nacer. Medido:
  //   15:09Z conv 49 → demo_agendada · calendar_event_id NULL   → gate exit 1 (correcto)
  //   16:04Z corre la sonda (msgs 372-375) → esperando_horario · scheduled_at NULL
  //   16:05Z `npm run demo:agendada` → exit 0 "SIN DEMOS AGENDADAS"
  // La promesa de "viernes 4 de septiembre, 14:00" sigue dicha y sigue sin existir; lo unico que
  // desaparecio es la evidencia. Es el modo de falla que el carril ya tiene escrito para otro
  // gate —"sacar la LISTA DE SUJETOS de una lista de inclusion falla ABIERTO"— con la vuelta de
  // tuerca de que aca el que vacia la lista es el propio instrumento del carril.
  //
  // El arreglo es leer el lado APPEND-ONLY: el mensaje que el bot mando. Chatwoot no reescribe
  // `messages`, asi que una promesa dicha no se puede desdecir. Una promesa sin reserva a nombre
  // de su conversacion es el fallo, y una fila blanqueada ya no lo tapa: lo DESTAPA.
  const promesa = { conversationId: 49, texto: 'Listo, agendado: **viernes 4 de septiembre, 14:00**.', creado: '2026-09-03 15:09:34+00' };

  const blanqueada = juzgar([promesa], { 'chatwoot:49': '' });
  afirmar('promesa dicha con la fila blanqueada sale 1', blanqueada.codigo === 1);
  afirmar('la fila blanqueada nombra la conversacion', /49/.test(blanqueada.texto));
  afirmar('la fila blanqueada cita lo que se prometio', blanqueada.texto.includes('viernes 4 de septiembre, 14:00'));

  // La fila directamente NO existe (la sonda pudo borrarla, o el motor todavia no la escribio).
  // Ausencia de reserva es ausencia de reserva: no se le da el beneficio de la duda.
  afirmar('promesa sin fila alguna sale 1', juzgar([promesa], {}).codigo === 1);

  // Con reserva de verdad, verde — aunque el bot_stage ya no diga `demo_agendada`.
  afirmar('promesa con uid sale 0 aunque el stage haya cambiado', juzgar([promesa], { 'chatwoot:49': 'uid-cal' }).codigo === 0);

  // Cero promesas: nadie llego al turno que vale. Sigue sin ser un exito.
  const nadie = juzgar([], {});
  afirmar('sin promesas sale 0', nadie.codigo === 0);
  afirmar('sin promesas NO dice que este todo bien', /nada que festejar/.test(nadie.texto));

  // La frase se saca del guion del BOT, no de este archivo: si Sergio reescribe M2, el gate se
  // entera. Hardcodearla aca lo dejaria buscando para siempre un texto que ya nadie manda.
  afirmar('la frase sale de M2 del guion', frasePromesa('  M2: [\n    "Listo, agendado: **{{dia_hora_elegida}}**.",\n') === 'Listo, agendado:');
  afirmar('un guion sin M2 no se inventa una frase', frasePromesa('M7: ["otra cosa"]') === null);

  // ── QUIEN esta del otro lado: un rojo de QA y un rojo de un lead no se leen igual ──────────
  //
  // El gate salia siempre con la misma frase final —"Del otro lado hay alguien que va a llegar a
  // una reunion vacia"— y el 2026-09-03 esa frase era FALSA: la unica promesa hueca era la conv
  // 49, o sea `Sonda QA carril chatbot`, el instrumento de este mismo carril. Nadie humano iba a
  // ninguna reunion. Un vigia que grita mal no molesta: INUTILIZA — es exactamente como se dejo
  // de creerle al vigia del embudo, que reportaba como incidente activo lo de seis dias antes.
  //
  // ⚠️ Se INFORMA, no se filtra. El codigo de salida es 1 en los dos casos: excluir a la sonda de
  // los sujetos devolveria el gate a fallar ABIERTO, que es el bug que la vuelta anterior cerro.
  // Lo unico que cambia es la frase, que es lo que decide si Sergio deja todo y actua.
  const sonda = { conversationId: 49, texto: 'Listo, agendado: **viernes 4**.', contacto: 'Sonda QA carril chatbot' };
  const lead = { conversationId: 51, texto: 'Listo, agendado: **sabado 5**.', contacto: 'Mario Hassen', telefono: '+59173021804' };

  const soloQa = juzgar([sonda], { 'chatwoot:49': '' });
  afirmar('la hueca de QA sigue siendo rojo', soloQa.codigo === 1);
  afirmar('nombra al contacto de la promesa hueca', soloQa.texto.includes('Sonda QA carril chatbot'));
  afirmar('no inventa un humano esperando cuando es la sonda', !/reunion vacia/i.test(soloQa.texto));
  afirmar('dice que el motor hizo lo incorrecto igual', /sonda|QA/i.test(soloQa.texto));

  const soloLead = juzgar([lead], { 'chatwoot:51': '' });
  afirmar('la hueca de un desconocido es rojo', soloLead.codigo === 1);
  afirmar('nombra al desconocido', soloLead.texto.includes('Mario Hassen'));
  afirmar('con un desconocido SI avisa de la reunion vacia', /reunion vacia/i.test(soloLead.texto));

  // Una sola persona real entre diez de QA tiene que gritar igual de fuerte.
  const mezclada = juzgar([sonda, lead], { 'chatwoot:49': '', 'chatwoot:51': '' });
  afirmar('una real entre varias de QA grita igual', /reunion vacia/i.test(mezclada.texto));
  afirmar('la mezcla nombra a los dos', mezclada.texto.includes('Sonda QA') && mezclada.texto.includes('Mario Hassen'));

  // ⚠️ El sesgo elegido, y va al reves que en `objetivo_visible.mjs` a proposito: alli "parece
  // nuestro" pone el gate MAS rojo; aca bajaria el volumen. Por eso un contacto que no se pudo
  // leer se trata como PERSONA REAL: desconocido = se grita. Equivocarse gritando se investiga
  // en un minuto; equivocarse callando deja a alguien plantado en una reunion que no existe.
  const anonima = juzgar([{ conversationId: 7, texto: 'Listo, agendado: **lunes**.' }], { 'chatwoot:7': '' });
  afirmar('sin nombre de contacto se lee como persona real', /reunion vacia/i.test(anonima.texto));
  afirmar('sin nombre lo dice en vez de inventar uno', /sin nombre/i.test(anonima.texto));

  // El telefono de Sergio tambien somos nosotros: el predicado es el MISMO que usa el otro gate.
  const sergio = juzgar([{ conversationId: 11, texto: 'Listo, agendado: **martes**.', contacto: 'Sergio', telefono: '+591 716-54992' }], {});
  afirmar('el telefono de Sergio no cuenta como lead esperando', !/reunion vacia/i.test(sergio.texto));

  // ── Importar este modulo NO puede tocar produccion ─────────────────────────────────────────
  //
  // Sin la guarda de `argv[1]`, cargar el archivo corria el gate entero (dos `docker exec`) y
  // llamaba a `process.exit()`, matando al proceso que importaba antes de su primera linea.
  // Se prueba en un hijo porque en este proceso el modulo ya esta cargado y cacheado.
  {
    const hijo = execFileSync(
      process.execPath,
      ['-e', `import(${JSON.stringify(import.meta.url)}).then(() => console.log('IMPORTADO'))`],
      { encoding: 'utf8', timeout: 60_000 },
    );
    afirmar('importar el modulo no dispara la medicion contra produccion', hijo.includes('IMPORTADO'));
  }

  // ── El aviso a Sergio: el gate lo AFIRMABA sin medirlo nunca ───────────────────────────────
  //
  // Medido el 2026-09-04: el cierre del veredicto decia "no hay reserva ni aviso a Sergio" en
  // TODOS los casos, y este archivo no leia el aviso por ningun lado. Cuando se escribio era
  // cierto por accidente (`ONIA_N8N_ENABLED=false`, no habia canal). Ya no: `aviso-telegram.mjs`
  // esta desplegado, `ONIA_BOT_TG_AVISO=true` en el proceso vivo, y el log tiene
  // `[aviso] sent conv=57`. Un gate que asegura como hecho algo que no mide miente en la
  // direccion cara: manda a arreglar un canal que YA funciona.
  //
  // Y hay una decision de por medio que el gate no habia incorporado: Sergio eligio la opcion
  // (a) —aviso por Telegram, SIN calendario— y dejo Cal.com para despues (t_b18ca430). O sea que
  // `calendar_event_id` va a ser NULL POR DISENO. Exigir la reserva como unica prueba deja al
  // gate rojo para siempre contra un mecanismo que se descarto a proposito.
  const conAviso = juzgar([promesa], { 'chatwoot:49': '' }, { 49: true }, '2026-09-01T00:00:00Z');
  afirmar('una promesa avisada por Telegram NO es una promesa hueca', conAviso.codigo === 0);
  afirmar('el verde por aviso lo dice explicito', /aviso/i.test(conAviso.texto));

  const sinNada = juzgar([promesa], { 'chatwoot:49': '' }, {}, '2026-09-01T00:00:00Z');
  afirmar('sin reserva Y sin aviso sigue siendo rojo', sinNada.codigo === 1);

  // ── La FECHA del fallo, no solo su existencia ──────────────────────────────────────────────
  //
  // Los sujetos salen de `messages`, que es append-only — eso arreglo un gate que fallaba
  // abierto, pero introdujo el defecto simetrico: una promesa hueca de hace seis dias NO se
  // puede desdecir, asi que el gate queda ROJO PARA SIEMPRE por algo que ya no esta pasando.
  // Es exactamente como se dejo de creer al vigia del embudo, que reportaba como incidente
  // activo errores de hasta seis dias antes: un vigia que grita mal no molesta, INUTILIZA.
  //
  // La linea no es arbitraria: una promesa hecha ANTES de que existiera el canal de aviso no
  // prueba nada sobre el sistema de hoy. Una hecha DESPUES, sin reserva y sin aviso, si.
  const vieja = { conversationId: 49, texto: 'Listo, agendado: **viernes 4**.', creado: '2026-09-03 15:09:34+00', contacto: 'Sonda QA carril chatbot' };
  const historica = juzgar([vieja], { 'chatwoot:49': '' }, {}, '2026-09-04T14:36:00Z');
  afirmar('una promesa anterior al canal de aviso no es un incidente activo', historica.codigo === 0);
  afirmar('pero NO se la silencia: se la nombra igual', /49/.test(historica.texto));
  afirmar('y dice que es historia, no que este todo bien', /histori|antes de/i.test(historica.texto));

  const nueva = { conversationId: 60, texto: 'Listo, agendado: **lunes 7**.', creado: '2026-09-04T16:00:00+00', contacto: 'Mario Hassen' };
  const activa = juzgar([nueva], { 'chatwoot:60': '' }, {}, '2026-09-04T14:36:00Z');
  afirmar('una promesa posterior al canal, sin aviso, es rojo', activa.codigo === 1);
  afirmar('la activa avisa de la reunion vacia', /reunion vacia/i.test(activa.texto));

  // ⚠️ El caso que NO puede fallar abierto: si no hay NINGUN canal (ni calendario ni aviso),
  // no alcanza con declarar todo "historico" y salir verde — ese es el peor estado posible,
  // porque significa que ninguna demo puede llegar a Sergio por ningun camino.
  const sinCanal = juzgar([vieja], { 'chatwoot:49': '' }, {}, null);
  afirmar('sin canal de aviso alguno el gate NO se pone verde', sinCanal.codigo === 1);
  afirmar('y dice que el problema es que no hay canal', /canal/i.test(sinCanal.texto));

  // ── Leer el aviso del log, que es de donde sale la evidencia de verdad ─────────────────────
  //
  // Las lineas reales del 2026-09-04, con su forma exacta: el `[aviso]` va SIN fecha propia y
  // hereda la del turno que lo produjo. Pegar aca lineas inventadas dejaria el parser probado
  // contra un formato que el bot no escribe.
  const log = [
    '[onia-webhook] 2026-09-04T06:38:24.196Z conv=55 msg=438 estado=200 rama=respondio etapa=nuevo->handoff_humano enviados=1/1',
    '[aviso] skipped (pregunta_precio_recepcion): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)',
    '[onia-webhook] 2026-09-04T14:38:10.922Z conv=57 msg=458 estado=200 rama=respondio etapa=nuevo->handoff_humano enviados=2/2',
    '[aviso] sent conv=57 (pidio_humano_recepcion): aviso enviado',
  ];
  const leido = leerAvisos(log);
  afirmar('el aviso enviado queda registrado por conversacion', leido.avisos[57] === true);
  afirmar('un aviso SALTEADO no cuenta como enviado', leido.avisos[55] !== true);
  afirmar('el aviso hereda la fecha de su turno', leido.desde === '2026-09-04T14:38:10.922Z');

  // ⚠️ El caso que decide si el gate excusa de mas: mientras el canal estuvo APAGADO, sus lineas
  // dicen `skipped ... apagado`. Si esas contaran como "desde aca hay canal", toda promesa
  // posterior al primer skipped quedaria excusada como historica sin que nadie la avisara nunca.
  const soloApagado = leerAvisos([
    '[onia-webhook] 2026-09-03T10:00:00.000Z conv=49 estado=200',
    '[aviso] skipped (cuota_agotada): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)',
  ]);
  afirmar('con el canal apagado no hay fecha de canal', soloApagado.desde === null);
  afirmar('y sin fecha de canal nada se excusa como historico', juzgar([vieja], { 'chatwoot:49': '' }, soloApagado.avisos, soloApagado.desde).codigo === 1);
  afirmar('un log vacio no inventa un canal', leerAvisos([]).desde === null);

  // La fecha de Postgres, que es la que este gate lee de verdad. `Date.parse` da NaN con `+00`:
  // sin normalizarla, NINGUNA promesa podia clasificarse como historica y el corte por fecha era
  // codigo muerto que parecia vivo.
  afirmar('la fecha de psql (+00) se parsea', Number.isFinite(instante('2026-09-03 15:09:34+00')));
  afirmar('el ISO con Z se sigue parseando', Number.isFinite(instante('2026-09-04T14:36:00Z')));
  afirmar('+00 y +00:00 son el mismo instante', instante('2026-09-03 15:09:34+00') === instante('2026-09-03T15:09:34+00:00'));
  afirmar('una fecha ilegible es NaN, no cero', !Number.isFinite(instante('cuando sea')));

  // Compatibilidad: los llamadores viejos (3 argumentos o menos) no pueden quedar en verde falso.
  afirmar('sin argumentos de aviso se comporta como antes', juzgar([promesa], { 'chatwoot:49': '' }).codigo === 1);

  const fallados = casos.filter((c) => !c.ok);
  for (const c of fallados) console.error(`FALLO: ${c.nombre}`);
  console.log(`${casos.length - fallados.length}/${casos.length} casos`);
  return fallados.length === 0 ? 0 : 1;
}

// ---------------------------------------------------------------------------

// ⚠️ Solo mide en VIVO si se lo invoca como programa. Sin esta guarda, un `import` de `juzgar`
// —para probar el veredicto con datos reales, o desde otro gate— dispara dos `docker exec`
// contra produccion y un `process.exit()` como efecto de CARGAR el modulo: el proceso que
// importa se muere antes de correr su propia linea. Medido el 2026-09-03 intentando justamente
// eso. `objetivo_visible.mjs` ya tenia la guarda y este archivo la copio sin ella.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--self-check')) {
    process.exit(selfCheck());
  }

  let veredicto;
  try {
    const frase = frasePromesa(readFileSync(CONFIG_DEL_BOT, 'utf8'));
    const { avisos, desde } = leerAvisos(leerLogDelBot());
    veredicto = juzgar(leerPromesas(frase), leerReservas(), avisos, desde);
  } catch (e) {
    veredicto = { codigo: 2, texto: `NO SE PUDO MEDIR — ${e.message}` };
  }
  console.log(veredicto.texto);
  process.exit(veredicto.codigo);
}
