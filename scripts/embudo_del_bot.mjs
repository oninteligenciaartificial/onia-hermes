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
 *
 * 🔴 **Ese 7 lo escribio un humano a mano y el CODIGO contaba 3, durante un dia entero, sin que
 * nada se pusiera rojo — corregido el 2026-09-25.** La cabecera tenia razon y la funcion no: solo
 * 3 de esos 7 (38, 40, 58) tienen fila en `bot_conversations`, y los otros CUATRO (34, 35, 36, 37)
 * caian en `sinteticas`, que se lee como "no existen". Peor: esos cuatro escribieron entre el 24 y
 * el 28 de agosto y **no recibieron una sola respuesta**, ni del bot ni de una persona
 * (`count(*) filter (where message_type=1)` = 0 en los cuatro). O sea que el descarte mudo que
 * este archivo promete evitar se estaba comiendo justo a los leads sin contestar. Hoy salen en su
 * propia linea del informe, con 🔴. Leccion que sobrevive al arreglo: **cuando el comentario de un
 * instrumento y su codigo dan numeros distintos, el rojo no existe — alguien tiene que restar.**
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

  // ⚠️ LA OTRA DIRECCION DEL CRUCE. El bucle de arriba recorre las filas del motor, asi que una
  // conversacion que existe en Chatwoot y NO tiene fila no entra nunca: no se contaba mal,
  // DESAPARECIA. Ojo con la tentacion de agrandarlo: NO quedan sin rescatar por esto —
  // `vigia_sin_respuesta.mjs` arranca de `messages join conversations` de Chatwoot y si los ve
  // (corrido el 2026-09-25: nombra a los 7, los 4 incluidos). Lo que se rompia era la MEDIDA del
  // objetivo de este carril, que decia 3 desconocidos reales cuando son 7.
  // Se aplican los MISMOS dos filtros (inbox del objetivo + no somos nosotros) para que este
  // numero no se infle con sondas propias.
  const clavesDelMotor = new Set(filas.map((f) => idDeChatwoot(f?.conversationKey)).filter(Boolean));
  const perdidas = conversaciones
    .filter((c) => !clavesDelMotor.has(String(c.id)))
    .filter((c) => INBOXES_DEL_OBJETIVO.map(Number).includes(Number(c.inboxId)))
    .filter((c) => !esNuestra({ contacto: c.contacto, telefono: c.telefono }));

  // ⚠️ CICATRIZ vs HERIDA. Las perdidas de produccion son las cuatro del 24 al 28 de agosto
  // (chatwoot:34/35/36/37), y caen en un hueco del motor que YA CERRO: medido el 2026-09-25, de
  // la 38 en adelante el motor registro 9 de 9 conversaciones de los inboxes 4 y 5. Un numero que
  // no puede bajar nunca no es una alarma: manda a re-investigar historia curada cada vuelta, y
  // el dia que el motor pierda una de verdad el rojo ya esta encendido y nadie lo nota.
  // El corte se deriva SIN traer fechas: el id de Chatwoot es un contador, asi que el id mas alto
  // que el motor registro dice hasta donde estuvo escribiendo. Solo entran claves que existen de
  // los DOS lados — una clave sintetica como `chatwoot:999999` correria el corte al infinito y
  // dejaria el 🔴 apagado para siempre, que es el fallo opuesto y peor.
  const idsEnChatwoot = new Set(conversaciones.map((c) => String(c.id)));
  const ultimoRegistrado = Math.max(
    0,
    ...filas
      .map((f) => idDeChatwoot(f?.conversationKey))
      .filter((id) => id && idsEnChatwoot.has(id))
      .map(Number),
  );
  const clave = (c) => `chatwoot:${c.id}`;
  const perdidasNuevas = perdidas.filter((c) => Number(c.id) > ultimoRegistrado).map(clave);
  const perdidasAnteriores = perdidas.filter((c) => Number(c.id) <= ultimoRegistrado).map(clave);
  const sinRegistrarEnElMotor = perdidas.map(clave);

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
    sinRegistrarEnElMotor,
    perdidasNuevas,
    perdidasAnteriores,
    ultimoRegistrado,
  };
}

/** El texto de una vuelta: corto, en castellano llano, con los descartes nombrados. */
export function informe(resumen) {
  const r = resumen.reales;
  const d = resumen.descartadas;
  const nuevas = resumen.perdidasNuevas || [];
  const anteriores = resumen.perdidasAnteriores || [];
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
    // DOS lineas, no una, y el 🔴 va SOLO en la primera. Las dos son gente que escribio y el
    // sistema perdio —por eso ninguna vuelve a "sinteticas", que se lee como "no existen"— pero
    // solo una pide trabajo: si hay perdidas mas nuevas que el ultimo registro del motor, el
    // motor dejo de escribir y el proximo lead tambien se pierde. La otra es una caida vieja que
    // ya cerro: nombrarla en rojo cada vuelta gasta la senal que hace falta para la primera.
    `  ${nuevas.length ? '🔴 escribieron y el motor dejo de registrar' : 'el motor registro a todos los que escribieron despues de chatwoot:' + resumen.ultimoRegistrado}${nuevas.length ? `: ${nuevas.length} (${nuevas.join(', ')}) — el motor no esta escribiendo: revisar el webhook ANTES que nada` : ''}`,
    ...(anteriores.length
      ? [
          `  ya perdidas antes de chatwoot:${resumen.ultimoRegistrado} (caida ya curada): ${anteriores.length} (${anteriores.join(', ')})`,
          '     no es trabajo de este medidor: el vigia de leads sin respuesta si las ve (arranca de Chatwoot)',
        ]
      : []),
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
    // ─── LA OTRA MITAD DEL CRUCE: escribieron y el motor NO los registro ───
    // Medido en produccion el 2026-09-25: chatwoot 34/35/36/37 son cuatro desconocidos que
    // escribieron entre el 24 y el 28 de agosto y NO tienen fila en `bot_conversations`.
    { id: '36', inboxId: 4, contacto: 'icy-lake-546', telefono: '' }, // desconocido real (web), SIN fila
    { id: '37', inboxId: 5, contacto: 'mariohassen', telefono: '' }, // desconocido real (WhatsApp), SIN fila
    { id: '12', inboxId: 5, contacto: 'Prueba Texto', telefono: '' }, // NOSOTROS y sin fila: no es un lead
    { id: '53', inboxId: 7, contacto: 'dry-dawn-527', telefono: '' }, // banco de pruebas y sin fila
    // ─── CICATRIZ vs HERIDA: este es POSTERIOR al ultimo que el motor registro (58) ───
    // O sea el motor dejo de escribir y todo lead que entre ahora se pierde en silencio. Ese es
    // el unico caso que merece 🔴; los de arriba (36/37) son de una caida ya curada.
    { id: '60', inboxId: 4, contacto: 'quiet-river-100', telefono: '' }, // desconocido real, SIN fila y NUEVO
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

  // ⚠️ EL CRUCE TIENE DOS DIRECCIONES Y ESTE GATE SOLO MIRABA UNA (arreglado 2026-09-25).
  // `resumirEmbudo` recorria las filas del motor, asi que una conversacion que existe en Chatwoot
  // y NO tiene fila no entraba nunca al bucle: no salia ni como real ni como descartada. No se
  // contaba mal — desaparecia. Medido en produccion ese dia: de los 7 desconocidos reales que la
  // cabecera de este archivo nombra, solo 3 tenian fila, y los otros 4 (34/35/36/37) habian
  // escrito SIN recibir una sola respuesta, ni del bot ni de una persona. O sea que el descarte
  // mudo que esta cabecera promete evitar se estaba comiendo justo a los leads sin contestar.
  a(
    'un desconocido que escribio y el motor NO registro se ve (web)',
    r.sinRegistrarEnElMotor.includes('chatwoot:36'),
  );
  a(
    'un desconocido que escribio y el motor NO registro se ve (WhatsApp)',
    r.sinRegistrarEnElMotor.includes('chatwoot:37'),
  );
  a('y son exactamente esos tres, no una lista inflada', r.sinRegistrarEnElMotor.length === 3);

  // ⚠️ UN 🔴 QUE NO PUEDE BAJAR NUNCA DEJA DE SER UNA ALARMA (arreglado 2026-09-25).
  // Las cuatro perdidas de produccion (chatwoot:34/35/36/37) son del 24 al 28 de agosto y caen
  // en un hueco del motor que ya esta CERRADO: medido ese dia, de la 38 en adelante el motor
  // registro 9 de 9 conversaciones de los inboxes 4 y 5. O sea es una cicatriz — no puede
  // cambiar y no hay nada que hacer con ella. Imprimirla en 🔴 cada vuelta gasta la senal dos
  // veces: manda a re-investigar historia curada, y el dia que el motor pierda una de VERDAD el
  // rojo ya va a estar encendido. Esta es la regla que el carril ya tenia escrita —"toda alerta
  // mira la FECHA del fallo"— aplicada al unico reloj que el cruce tiene a mano: el id de
  // Chatwoot, que es un contador.
  a('una perdida ANTERIOR al ultimo registro del motor es cicatriz, no herida', r.perdidasAnteriores.join() === 'chatwoot:36,chatwoot:37');
  a('una perdida POSTERIOR al ultimo registro del motor SI es herida abierta', r.perdidasNuevas.join() === 'chatwoot:60');
  a('el 🔴 va solo en la herida', /🔴 escribieron y el motor dejo de registrar: 1 \(chatwoot:60\)/.test(informe(r)));
  // Y la cicatriz se nombra ENTERA, con su corte y sin 🔴: esconderla seria el error opuesto
  // —son personas que escribieron— pero llevarla en rojo es lo que gasta la senal.
  const lineaCicatriz = informe(r).split('\n').find((l) => l.includes('ya perdidas antes de')) || '';
  a('la cicatriz se nombra con su corte y sus claves', /ya perdidas antes de chatwoot:58 \(caida ya curada\): 2 \(chatwoot:36, chatwoot:37\)/.test(lineaCicatriz));
  a('y la cicatriz NO lleva 🔴', !lineaCicatriz.includes('🔴'));

  // LA TRAMPA QUE HARIA FALLAR ABIERTO A TODO ESTO: `chatwoot:999999` es una clave del motor sin
  // conversacion en Chatwoot. Si entrara al corte, el "ultimo registrado" seria 999999 y NINGUNA
  // perdida podria ser nunca mas nueva que el — el 🔴 quedaria apagado para siempre, que es peor
  // que el 🔴 permanente que este arreglo viene a sacar. El corte solo mira claves que existen
  // de los dos lados.
  a('una clave sintetica no puede correr el corte al infinito', r.ultimoRegistrado === 58);
  // ANTI-INFLADO, el espejo del anti-tautologia de arriba: el contador nuevo aplica los MISMOS
  // dos filtros que el viejo. Si no, "sin registrar" se llena de sondas nuestras y del banco de
  // pruebas, y un numero que sube por nuestra culpa se lee como prospectos abandonados.
  a('una sonda nuestra sin fila no es un lead abandonado', !r.sinRegistrarEnElMotor.includes('chatwoot:12'));
  a('el banco de pruebas sin fila tampoco', !r.sinRegistrarEnElMotor.includes('chatwoot:53'));
  // El proposito de este caso no cambio al partirse la linea en dos: NINGUNA de las perdidas
  // puede quedar fuera del texto. Separar cicatriz de herida es para ordenar la senal, no para
  // esconder a la mitad — y ese es justo el error que seria facil cometer aca.
  a(
    'el informe nombra a TODAS las perdidas, no solo a las nuevas',
    r.sinRegistrarEnElMotor.every((k) => informe(r).includes(k)),
  );

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
