#!/usr/bin/env node
/**
 * embudo_del_bot.mjs — EL EMBUDO DEL BOT, CONTADO SOBRE DESCONOCIDOS REALES.
 *
 *   node scripts/embudo_del_bot.mjs            (o `npm run embudo:bot`)
 *   node scripts/embudo_del_bot.mjs --self-check
 *
 * CODIGOS DE SALIDA
 *   0  se midio                                 → el numero de abajo es el embudo real
 *   2  no se pudo medir                         → no medir NO es estar bien
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * POR QUE EXISTE, medido en produccion el 2026-09-24 y no supuesto.
 *
 * El carril `chatbot` viene reportando su objetivo con un `select count(*)` pelado sobre
 * `onia_center.bot_conversations`, y ese numero entro en la memoria compartida, en la cola y en
 * el CUERPO del pedido de deploy que espera el `ok` de Sergio Urcullo:
 *
 *     "43 conversaciones, 0 agendadas, 18 paradas en esperando_horario"
 *
 * Contado con este instrumento el mismo dia, las 43 filas se reparten asi:
 *
 *     desconocidos REALES ....  7   (inbox 4 web: 34, 36, 38, 40 · inbox 5 WhatsApp: 35, 37, 58)
 *     nuestras ...............  ~12 (sondas `Sonda QA …`, `Prueba …`, y el celular de Sergio)
 *     sinteticas .............  ~9  (`chatwoot:999999`, `chatwoot:990777`, `chatwoot:13..19`:
 *                                    filas del motor SIN conversacion detras en Chatwoot)
 *     fuera de los inboxes ...  el resto (inbox 3 y el banco de pruebas 7)
 *
 * Y de las **18 paradas en `esperando_horario`, UNA sola es una persona** (`chatwoot:58`, inbox 5,
 * parada desde el 17-sep). Las otras 17 son datos nuestros.
 *
 * O sea que el numero con el que se le pide una decision a Sergio Urcullo estaba compuesto en un
 * ~84% por nuestras propias pruebas. No exagera el problema por maldad: lo exagera porque el
 * instrumento no sabia distinguir. Es el modo de falla que el carril ya tiene escrito —*"medi con
 * el instrumento correcto, y desconfia del que te da la razon"*— con el agravante de que este le
 * daba la razon en la direccion alarmante, que es la que nadie audita.
 *
 * ⚠️ EL EXITO NO SE MIDE CON `calendar_event_id`, Y ESTO NO ES UN ATAJO.
 * Sergio Urcullo decidio la opcion sin calendario (tablero `t_b18ca430`, 2026-09-03: *"Telegram
 * YA, y Cal.com cuando moleste anotar a mano"*), asi que `calendar_event_id` va a quedar NULL
 * **POR DISENO** mientras esa decision siga en pie. Contar demos por esa columna da CERO para
 * siempre contra un mecanismo que se descarto a proposito, y manda a cada vuelta a "arreglar" un
 * bot que hace exactamente lo que se le pidio. El evento que la decision SI produce es el horario
 * elegido, `scheduled_at` — que es ademas el contador que la propia cola fijo como condicion de
 * vencimiento de esa decision (*"mas de ~1 demo agendada por semana"*).
 * Si alguien vuelve a anclar el exito en `calendar_event_id`, el caso ancla del self-check se cae.
 *
 * ⚠️ UNA FILA SIN CONVERSACION DETRAS NO ES UN DESCONOCIDO — es la trampa que inflo el 43.
 * `esNuestra()` reconoce a los nuestros por NOMBRE y TELEFONO, y de una fila sintetica como
 * `chatwoot:999999` no hay ni nombre ni telefono que mirar: sin este corte cae del lado "real" y
 * suma al embudo como si fuera una persona. Por eso la ausencia se clasifica explicitamente
 * (`sinteticas`) en vez de caer al default. Hay caso ancla.
 *
 * ⚠️ EL SESGO ESTA ELEGIDO Y ES EL CONTRARIO AL DE UN GATE. Un vigia prefiere contarnos a
 * nosotros como desconocidos (rojo de mas, barato). Este instrumento informa el TAMANO del
 * embudo: inflarlo con nuestras pruebas hace tomar decisiones de producto sobre gente que no
 * existe. Por eso acá lo dudoso se descarta, y **cada descarte se nombra con su motivo** — un
 * descarte mudo es como se pierde un prospecto real.
 *
 * SOLO LECTURA sobre las dos bases. No escribe, no manda Telegram, no toca produccion.
 */

import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// ⚠️ Se IMPORTA, no se copia. "Quienes somos nosotros" y "cuales son los inboxes del bot" ya estan
// decididos y probados en `objetivo_visible.mjs`, que es el criterio unico del repo. CLAUDE.md
// pide una sola fuente por tema: dos listas de lo mismo divergen el dia que alguien agrega un
// numero a una. Ese modulo no dispara nada al importarlo (su `main` esta detras de `argv[1]`).
import { esNuestra, INBOXES_DEL_OBJETIVO } from './objetivo_visible.mjs';

/** La base del MOTOR del bot, que NO es la de Chatwoot: `onia_center.bot_conversations`. */
const ESTADO_DB = process.env.ONIA_BOT_ESTADO_DB || 'supabase-db';

/** La base de CHATWOOT, donde viven las conversaciones con su inbox y su contacto. */
const CHATWOOT_DB = process.env.ONIA_CHATWOOT_DB_CONTAINER || 'onia-chatbot_chatwoot-db';

/** Las etapas en las que el prospecto quedo ESPERANDO algo nuestro (no es un final). */
export const ETAPAS_PARADAS = ['esperando_horario', 'esperando_calificacion', 'nuevo'];

/**
 * El id de Chatwoot que hay detras de una clave del motor. `chatwoot:58` → `"58"`.
 * Cualquier otra forma devuelve `null`: una clave que no nombra una conversacion de Chatwoot no
 * se puede cruzar con nadie, y adivinarla es como entraron las filas sinteticas al conteo.
 */
export function idDeChatwoot(clave) {
  const m = /^chatwoot:(\d+)$/.exec(String(clave ?? '').trim());
  return m ? m[1] : null;
}

/**
 * El veredicto. Puro: mismas filas, mismo resumen. Sin red, sin `docker`, sin reloj.
 *
 * @param {object} entrada
 * @param {Array<{conversationKey:string, botStage:string, scheduledAt:string|null}>} entrada.filas
 *        las filas de `onia_center.bot_conversations`
 * @param {Array<{id:string, inboxId:number, contacto:string, telefono:string}>} entrada.conversaciones
 *        las conversaciones de Chatwoot (universo contra el que se cruza)
 */
export function resumirEmbudo({ filas = [], conversaciones = [] } = {}) {
  const porId = new Map(conversaciones.map((c) => [String(c.id), c]));
  const reales = [];
  const descartadas = { sinteticas: [], nuestras: [], fueraDeLosInboxesDelBot: [] };

  for (const fila of filas) {
    const id = idDeChatwoot(fila?.conversationKey);
    const conv = id ? porId.get(id) : null;
    // La AUSENCIA se clasifica, no cae al default. Ver el aviso de arriba.
    if (!conv) {
      descartadas.sinteticas.push(fila?.conversationKey ?? '(sin clave)');
      continue;
    }
    if (!INBOXES_DEL_OBJETIVO.map(Number).includes(Number(conv.inboxId))) {
      descartadas.fueraDeLosInboxesDelBot.push(fila.conversationKey);
      continue;
    }
    if (esNuestra({ contacto: conv.contacto, telefono: conv.telefono })) {
      descartadas.nuestras.push(fila.conversationKey);
      continue;
    }
    reales.push({ ...fila, inboxId: Number(conv.inboxId), contacto: conv.contacto });
  }

  const porEtapa = {};
  for (const r of reales) porEtapa[r.botStage || '(sin etapa)'] = (porEtapa[r.botStage || '(sin etapa)'] || 0) + 1;

  // EL EXITO: el horario elegido, NO la reserva de calendario. Ver el aviso de arriba.
  const conHorario = reales.filter((r) => r.scheduledAt);
  const paradas = reales.filter((r) => ETAPAS_PARADAS.includes(r.botStage) && !r.scheduledAt);

  return {
    total: filas.length,
    reales: {
      total: reales.length,
      porEtapa,
      conHorario: conHorario.length,
      clavesConHorario: conHorario.map((r) => r.conversationKey),
      paradas: paradas.length,
      clavesParadas: paradas.map((r) => r.conversationKey),
    },
    descartadas,
  };
}

/** El texto de una vuelta: corto, en castellano llano, con los descartes nombrados. */
export function informe(resumen) {
  const r = resumen.reales;
  const d = resumen.descartadas;
  const etapas = Object.entries(r.porEtapa)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${v}`)
    .join(' · ');
  return [
    `EMBUDO DEL BOT — ${r.total} desconocido(s) real(es) de ${resumen.total} fila(s) del motor.`,
    `  etapas: ${etapas || '(ninguna)'}`,
    `  eligieron horario: ${r.conHorario}${r.clavesConHorario.length ? ` (${r.clavesConHorario.join(', ')})` : ''}`,
    `  esperando algo nuestro: ${r.paradas}${r.clavesParadas.length ? ` (${r.clavesParadas.join(', ')})` : ''}`,
    `  descartadas: ${d.nuestras.length} nuestras · ${d.sinteticas.length} sinteticas (sin conversacion en Chatwoot) · ${d.fueraDeLosInboxesDelBot.length} fuera de los inboxes ${INBOXES_DEL_OBJETIVO.join('/')}`,
  ].join('\n');
}

// ─────────────────────────────── lectura viva ───────────────────────────────

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
  return execFileSync('docker', ['exec', '-i', contenedor(ESTADO_DB), 'psql', '-U', 'postgres', '-d', 'postgres', '-tAc', sql], {
    encoding: 'utf8',
    timeout: 30_000,
  });
}

function ejecutarSqlChatwoot(sql) {
  return execFileSync('docker', ['exec', '-i', contenedor(CHATWOOT_DB), 'psql', '-U', 'postgres', '-d', 'onia-chatbot', '-tAc', sql], {
    encoding: 'utf8',
    timeout: 30_000,
  });
}

/** Las filas del motor. `-tA` separa por `|`; no se piden columnas que puedan traer saltos. */
export function leerFilas(exec = ejecutarSqlMotor) {
  const crudo = exec(
    "select conversation_key || '|' || coalesce(bot_stage,'') || '|' || coalesce(scheduled_at::text,'') from onia_center.bot_conversations;",
  );
  return String(crudo)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [conversationKey, botStage, scheduledAt] = l.split('|');
      return { conversationKey, botStage, scheduledAt: scheduledAt || null };
    });
}

/**
 * Las conversaciones de Chatwoot. El nombre del contacto se APLANA en el SQL: un salto de linea
 * adentro parte el `split('\n')` y corre todas las columnas una posicion — trampa ya medida.
 */
export function leerConversaciones(exec = ejecutarSqlChatwoot) {
  const crudo = exec(
    "select c.id || '|' || c.inbox_id || '|' || replace(coalesce(ct.name,''), E'\\n', ' ') || '|' || coalesce(ct.phone_number,'') " +
      'from conversations c left join contacts ct on ct.id = c.contact_id;',
  );
  return String(crudo)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [id, inboxId, contacto, telefono] = l.split('|');
      return { id, inboxId: Number(inboxId), contacto: contacto || '', telefono: telefono || '' };
    });
}

// ─────────────────────────────── self-check ───────────────────────────────

function afirmarFactory() {
  let fallas = 0;
  return {
    afirmar(nombre, condicion) {
      if (condicion) return;
      fallas += 1;
      console.error(`  ✗ ${nombre}`);
    },
    get fallas() {
      return fallas;
    },
  };
}

function selfCheck() {
  // ⚠️ NO se desestructura. `fallas` es un getter, y el rest-spread (`const {afirmar, ...caja}`)
  // copia su VALOR del momento —0— en vez de la propiedad viva: el self-check imprimia sus `✗` y
  // salia 0 igual. Lo cazo la validacion por mutacion de este mismo archivo, el 2026-09-24; sin
  // ella habria entrado a la cadena un gate incapaz de ponerse rojo.
  const caja = afirmarFactory();
  const a = caja.afirmar;

  const conversaciones = [
    { id: '58', inboxId: 5, contacto: '.', telefono: '+59175755019' }, // desconocido real (WhatsApp)
    { id: '34', inboxId: 4, contacto: 'delicate-glitter-674', telefono: '' }, // desconocido real (web)
    { id: '11', inboxId: 5, contacto: 'Sergio', telefono: '+59171654992' }, // NOSOTROS (telefono)
    { id: '49', inboxId: 4, contacto: 'Sonda QA carril chatbot', telefono: '' }, // NOSOTROS (nombre)
    { id: '52', inboxId: 7, contacto: 'purple-bush-931', telefono: '' }, // banco de pruebas
  ];
  const filas = [
    { conversationKey: 'chatwoot:58', botStage: 'esperando_horario', scheduledAt: null },
    { conversationKey: 'chatwoot:34', botStage: 'demo_agendada', scheduledAt: '2026-09-12 13:00:00+00' },
    { conversationKey: 'chatwoot:11', botStage: 'handoff_humano', scheduledAt: '2026-09-12 13:00:00+00' },
    { conversationKey: 'chatwoot:49', botStage: 'esperando_horario', scheduledAt: null },
    { conversationKey: 'chatwoot:52', botStage: 'nuevo', scheduledAt: null },
    { conversationKey: 'chatwoot:999999', botStage: 'esperando_horario', scheduledAt: null },
    { conversationKey: 'raro-sin-forma', botStage: 'nuevo', scheduledAt: null },
  ];
  const r = resumirEmbudo({ filas, conversaciones });

  // ANTI-TAUTOLOGIA: si el filtro se pasara de estricto y descartara a todos, todo lo de abajo
  // seguiria dando "0 == 0". Este caso exige que al menos un desconocido SOBREVIVA al filtro.
  a('cuenta a los desconocidos reales (si no, el filtro se comio el embudo)', r.reales.total === 2);

  // LA TRAMPA QUE INFLO EL 43: una fila del motor sin conversacion en Chatwoot no es una persona.
  a('una clave sin conversacion en Chatwoot NO cuenta como desconocido', r.descartadas.sinteticas.includes('chatwoot:999999'));
  a('una clave con forma rara tampoco cuenta como desconocido', r.descartadas.sinteticas.includes('raro-sin-forma'));

  a('el celular de Sergio Urcullo no es un prospecto', r.descartadas.nuestras.includes('chatwoot:11'));
  a('una sonda QA no es un prospecto', r.descartadas.nuestras.includes('chatwoot:49'));
  a('el banco de pruebas (inbox 7) queda fuera', r.descartadas.fueraDeLosInboxesDelBot.includes('chatwoot:52'));

  // EL CASO QUE DEFIENDE LA DECISION (c): el exito se cuenta por `scheduled_at`, y ninguna de
  // estas filas tiene `calendar_event_id` — la columna ni siquiera se lee. Si alguien vuelve a
  // anclar el exito en el calendario, este caso se cae.
  a('el horario elegido cuenta como demo, sin reserva de calendario', r.reales.conHorario === 1);
  a('la demo contada es la del desconocido, no la nuestra', r.reales.clavesConHorario.join() === 'chatwoot:34');

  // Una fila que YA eligio horario no esta "esperando algo nuestro".
  a('el que ya eligio horario no se cuenta como parado', r.reales.paradas === 1 && r.reales.clavesParadas.join() === 'chatwoot:58');

  a('el total crudo se informa igual, para poder comparar con el conteo pelado', r.total === 7);
  a('idDeChatwoot solo acepta la forma exacta', idDeChatwoot('chatwoot:58') === '58' && idDeChatwoot('chatwoot:') === null);
  a('el informe nombra los descartes', /descartadas: 2 nuestras/.test(informe(r)));

  if (caja.fallas > 0) {
    console.error(`self-check: ${caja.fallas} falla(s)`);
    return 1;
  }
  console.log('self-check embudo_del_bot: OK');
  return 0;
}

// ⚠️ La guarda de `argv[1]` no es decorativa: sin ella, IMPORTAR este modulo desde otro gate
// dispararia dos `docker exec` contra produccion y un `process.exit()` como efecto de cargarlo.
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  if (process.argv.includes('--self-check')) {
    process.exit(selfCheck());
  }
  try {
    const resumen = resumirEmbudo({ filas: leerFilas(), conversaciones: leerConversaciones() });
    console.log(informe(resumen));
    process.exit(0);
  } catch (e) {
    // NO MEDIDO es un tercer estado, y se dice. Un catch que devuelve "0 desconocidos" contesta
    // la pregunta con una cifra inventada, que es peor que no contestarla.
    console.error(`NO MEDIDO — no pude leer las dos bases: ${e.message}`);
    process.exit(2);
  }
}
