// ONIA — VIGIA DEL DESCONOCIDO COLGADO: alguien escribio y nadie le contesto, y NADIE SE ENTERA.
//
// POR QUE EXISTE, medido en vivo el 2026-09-03 y no supuesto. Esta consulta a la base de
// Chatwoot (inboxes 4 = widget de la web y 5 = WhatsApp, los dos del bot) devolvio NUEVE
// conversaciones cuyo ultimo mensaje es de la persona y nunca tuvo respuesta:
//
//   conv 37  inbox 5  hace 148 h  "Hola, vengo de la web de Onia. Quiero saber si me sirve..."
//   conv 35  inbox 5  hace 201 h  "Hola, estoy evaluando un sistema de gestion para una clinica"
//   conv 36  inbox 4  hace 156 h  "Saguilera@ds-santacruz.bo"
//   conv 34  inbox 4  hace 223 h  "hola"                                   (+ 5 mas)
//
// Las dos de WhatsApp NUNCA recibieron un solo mensaje saliente. Nueve dias.
//
// EL AGUJERO NO ES QUE EL BOT SE CALLE — es que callarse no dispara nada. Se reviso qué
// vigila hoy el VPS, uno por uno:
//   · `onia-leads-vigia.sh`  mira `access_requests` (el formulario de /empezar), NO Chatwoot.
//   · `onia-vigia-embudo.sh` mira que la landing, Cal.com y Postiz respondan por HTTP.
//   · `webhook-watchdog.sh`  mira que el puerto 3020 este vivo.
//   · `rescate-run.mjs`      reinyecta el mensaje perdido — pero solo entre 3 min y 12 h, y
//                            hoy NO esta desplegado ni tiene cron.
// Ninguno de los cuatro puede ver a una persona esperando. El propio item de la cola lo dice
// con todas las letras: *"ese mensaje no se contesta nunca **y nadie se entera**"*. El rescate
// resuelve "no se contesta" para una ventana de 12 h; esto resuelve "nadie se entera" para
// todo lo demas — el >12 h, el derivado a humano, y el rato en que el rescate no este puesto.
//
// POR QUE AVISA DE `handoff_humano` EN VEZ DE CALLARSE: cuando el bot deriva a un humano, el
// silencio del bot es correcto. Lo que NO es correcto es que el humano no llegue nunca. Ese es
// justo el caso del huerfano real de hoy (conv 47): el rescate lo cuenta y no lo salva, a
// proposito. Sin este aviso, esa persona espera para siempre y el tablero dice verde.
//
// POR QUE NO TIENE TECHO DE EDAD, al reves que el rescate: el rescate ESCRIBE (contestarle a
// alguien de hace tres dias llega fuera de contexto y fuera de la ventana de 24 h de Meta),
// este solo AVISA. Avisar de un lead viejo no puede danar a nadie: el que decide es Sergio.
//
// SOLO LECTURA sobre Chatwoot y sobre el motor. Seco por defecto, como todo barrido del carril:
// sin `--emit` no manda Telegram ni escribe el estado.
//
//   node scripts/vigia_sin_respuesta.mjs [--emit] [--umbral-min 30]

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { esNuestra } from './objetivo_visible.mjs';

const run = promisify(execFile);

/**
 * Por debajo de esto no se avisa: el webhook en vivo todavia puede estar contestando, y el
 * rescate recien mira a partir de los 3 min. Avisar antes seria correr una carrera contra el
 * propio bot y llenar Telegram de falsos rojos.
 */
export const UMBRAL_MS = 30 * 60 * 1000;

/** Inboxes donde atiende el bot: 4 = Onia Web (widget), 5 = Onia WhatsApp. */
export const INBOXES_BOT = [4, 5];

const ENTRANTE = 0;
const SALIENTE = 1;

/** El guion del propio bot: de ahi sale la frase con la que promete un humano, no de aca. */
export const CONFIG_DEL_BOT =
  process.env.ONIA_BOT_CONFIG || new URL('../hermes-content/deploy/vps-ops/bot/config.mjs', import.meta.url).pathname;

/**
 * La frase con la que el bot PROMETE que una persona va a escribir, sacada de `M5` del guion
 * (`config.mjs`) y no escrita aca — mismo motivo que en `demo_agendada_real.mjs`: un literal
 * pegado en este archivo seguiria buscando un texto que ya nadie manda el dia que alguien
 * reescriba M5, y el vigia se quedaria ciego sin que nadie lo tocara.
 *
 * De las lineas de M5 se queda con **la mas larga**: la primera ("Eso lo tiene que ver …") es
 * corta y generica, y buscar por ella marcaria como handoff cualquier mensaje parecido.
 * Se corta en el primer `{{` porque lo que sigue cambia en cada conversacion.
 *
 * @param {string} textoConfig  el contenido de `config.mjs`
 * @returns {string|null} el prefijo literal de la promesa, o null si el guion no la trae
 */
export function frasePromesaHandoff(textoConfig) {
  const bloque = /M5:\s*\[([\s\S]*?)\]/.exec(String(textoConfig || ''));
  if (!bloque) return null;
  const candidatos = [...bloque[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)]
    .map((m) => m[1].split('{{')[0].replace(/\*/g, '').replace(/[\s(]+$/, '').trim())
    .filter((l) => l.length >= 20)
    .sort((a, b) => b.length - a.length);
  return candidatos[0] || null;
}

/** El texto tal como se compara: sin negritas, que el guion pone y Chatwoot guarda distinto. */
const sinAdornos = (t) => String(t ?? '').replace(/\*/g, '');

const ESTADO_POR_DEFECTO = '/root/loops/estado/vigia-sin-respuesta.json';

/**
 * Los mensajes publicos de los inboxes del bot, por conversacion y en orden.
 *
 * Orden estable: por fecha, y a igual fecha por id — dos mensajes pueden compartir segundo.
 * `message_type = 2` (actividad del sistema) y las notas privadas quedan afuera para las dos
 * miradas: ni tapan a un entrante ni cuentan como que un humano aparecio.
 */
function agruparPorConversacion(filas) {
  const porConversacion = new Map();
  for (const fila of Array.isArray(filas) ? filas : []) {
    if (!fila || fila.private === true) continue;
    if (!INBOXES_BOT.includes(Number(fila.inboxId))) continue;
    const tipo = Number(fila.messageType);
    if (tipo !== ENTRANTE && tipo !== SALIENTE) continue;
    const lista = porConversacion.get(fila.conversationId) || [];
    lista.push(fila);
    porConversacion.set(fila.conversationId, lista);
  }
  for (const lista of porConversacion.values()) {
    lista.sort((a, b) => a.createdAtMs - b.createdAtMs || a.messageId - b.messageId);
  }
  return porConversacion;
}

/**
 * De todas las filas de mensajes, quien quedo esperando.
 *
 * Pura y sin I/O. Devuelve un entrante por conversacion — el ultimo — solo si NO hay ningun
 * saliente publico posterior, ya paso el umbral, y la persona no somos nosotros.
 *
 * `message_type = 2` (actividad del sistema: "marked resolved", cambios de estado) y las notas
 * privadas del agente NO cuentan como respuesta: resolver una conversacion no es haberle
 * contestado a nadie. Es el mismo criterio que usa `rescate-run.mjs`, y a proposito: dos
 * definiciones distintas de "sin respuesta" en el mismo carril envejecen en direcciones
 * distintas y un dia se contradicen.
 */
export function seleccionarColgados(filas, { ahoraMs, umbralMs = UMBRAL_MS } = {}) {
  const porConversacion = agruparPorConversacion(filas);

  const colgados = [];
  for (const lista of porConversacion.values()) {
    const ultimo = lista[lista.length - 1];
    if (Number(ultimo.messageType) !== ENTRANTE) continue; // ya le contestaron
    if (ahoraMs - ultimo.createdAtMs < umbralMs) continue;
    if (esNuestra({ contacto: ultimo.contacto, telefono: ultimo.telefono })) continue;
    colgados.push({ ...ultimo, esperaMin: Math.round((ahoraMs - ultimo.createdAtMs) / 60000) });
  }
  return colgados.sort((a, b) => a.esperaMin - b.esperaMin);
}

/**
 * Quien espera a un humano que el bot le PROMETIO y nunca llego.
 *
 * Pura y sin I/O. Es el agujero de `seleccionarColgados`, medido el 2026-09-03: esa funcion
 * descarta toda conversacion cuyo ultimo mensaje sea saliente con un `// ya le contestaron`
 * que en un handoff es MENTIRA — el ultimo mensaje es el del bot diciendo *"ya le pase tu
 * consulta, te escribe el"*, y la persona que hizo bien en esperar se vuelve invisible. El
 * vigia recien la veia si volvia a insistir; si se cansaba y no escribia mas, nadie se
 * enteraba nunca.
 *
 * Como se decide que "no llego el humano", y por que asi: el bot es **el sender de la propia
 * promesa**, no un id escrito aca. Cualquier saliente posterior de OTRO sender es una persona
 * y cierra el caso. Derivarlo del mensaje evita el hardcodeo del agente (hoy `Onia Bot`, id 3)
 * y hace que el criterio siga siendo cierto si mañana el bot cambia de token.
 *
 * Un entrante posterior lo saca de aca a proposito: ese caso ya es del vigia de arriba, y dos
 * avisos por la misma conversacion es como se le deja de creer a un vigia.
 *
 * @param {object[]} filas
 * @param {{ahoraMs:number, umbralMs?:number, frase:string|null}} opciones  `frase` sale de
 *   `frasePromesaHandoff()`; sin ella no se mira nada — pero el resto del vigia sigue vivo.
 */
export function seleccionarEsperandoHumano(filas, { ahoraMs, umbralMs = UMBRAL_MS, frase } = {}) {
  const buscada = sinAdornos(frase).trim();
  if (buscada.length < 20) return [];

  const esperando = [];
  for (const lista of agruparPorConversacion(filas).values()) {
    const iPromesa = lista.findLastIndex(
      (m) => Number(m.messageType) === SALIENTE && sinAdornos(m.content).includes(buscada),
    );
    if (iPromesa < 0) continue;

    const promesa = lista[iPromesa];
    const posteriores = lista.slice(iPromesa + 1);
    if (posteriores.some((m) => Number(m.messageType) === ENTRANTE)) continue; // es del vigia de arriba
    if (posteriores.some((m) => Number(m.senderId) !== Number(promesa.senderId))) continue; // llego una persona
    if (ahoraMs - promesa.createdAtMs < umbralMs) continue;
    if (esNuestra({ contacto: promesa.contacto, telefono: promesa.telefono })) continue;

    // Lo que se muestra es lo ULTIMO QUE DIJO LA PERSONA, no el texto del bot: Sergio necesita
    // saber a que le tiene que contestar, y su propia promesa no se lo dice.
    const suyo = lista.slice(0, iPromesa).findLast((m) => Number(m.messageType) === ENTRANTE);
    esperando.push({
      ...promesa,
      content: suyo?.content || promesa.content,
      esperandoHumano: true,
      esperaMin: Math.round((ahoraMs - promesa.createdAtMs) / 60000),
    });
  }
  return esperando.sort((a, b) => a.esperaMin - b.esperaMin);
}

/**
 * Los que todavia no se avisaron.
 *
 * La clave es la conversacion + el id del ULTIMO mensaje, no la conversacion sola: si la
 * persona vuelve a insistir hay que volver a avisar, porque cada insistencia es un lead mas
 * caliente y mas cerca de irse. Un vigia que avisa una vez por conversacion y calla para
 * siempre repite el bug que vino a vigilar.
 */
export function nuevosParaAvisar(colgados, estadoPrevio) {
  const avisados = estadoPrevio?.avisados || {};
  return (colgados || []).filter((c) => Number(avisados[String(c.conversationId)] || 0) < Number(c.messageId));
}

/** El estado nuevo, conservando lo que ya habia de otras conversaciones. */
export function armarEstado(estadoPrevio, colgados) {
  const avisados = { ...(estadoPrevio?.avisados || {}) };
  for (const c of colgados || []) avisados[String(c.conversationId)] = Number(c.messageId);
  return { ...(estadoPrevio || {}), avisados };
}

/** Telegram va en HTML (`onia-tg.sh`), asi que el texto de la persona se escapa siempre. */
function escapar(t) {
  return String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function espera(min) {
  if (min < 90) return `${min} min`;
  if (min < 48 * 60) return `${Math.round(min / 60)} h`;
  return `${Math.round(min / (60 * 24))} d`;
}

/**
 * El aviso: cuantos son, quien, hace cuanto y por donde entro.
 *
 * Los dos casos van SEPARADOS porque piden cosas distintas de Sergio: al que nadie contesto hay
 * que contestarle, y al que espera un humano el bot YA le prometio que le escriben. Sumarlos
 * bajo el mismo titulo ("escribieron y nadie contesto") diria algo falso del segundo grupo, y un
 * vigia que grita mal no molesta: inutiliza.
 */
export function armarAviso(colgados) {
  const linea = (c) => {
    const canal = Number(c.inboxId) === 5 ? 'WhatsApp' : 'web';
    const derivado = !c.esperandoHumano && String(c.botStage || '') === 'handoff_humano' ? ' · derivado a humano' : '';
    return `conv ${c.conversationId} (${canal}${derivado}) — ${espera(c.esperaMin)} esperando — ${escapar(c.contacto || 'sin nombre')}: ${escapar(String(c.content || '').slice(0, 70))}`;
  };

  const sinRespuesta = (colgados || []).filter((c) => !c.esperandoHumano);
  const esperanHumano = (colgados || []).filter((c) => c.esperandoHumano);
  const bloques = [];
  if (sinRespuesta.length) {
    bloques.push(`🔴 <b>${sinRespuesta.length} desconocido(s) escribieron y nadie contesto</b>\n<pre>${sinRespuesta.map(linea).join('\n')}</pre>`);
  }
  if (esperanHumano.length) {
    bloques.push(`🔴 <b>${esperanHumano.length} espera(n) que le escribas vos — el bot ya se lo prometio</b>\n<pre>${esperanHumano.map(linea).join('\n')}</pre>`);
  }
  return bloques.join('\n');
}

/**
 * Lee de la base de Chatwoot los mensajes de los inboxes del bot, con el nombre y el telefono
 * del contacto — que es lo unico con lo que se distingue un desconocido de la sonda.
 * Va por `docker exec psql` porque la base de Chatwoot no esta expuesta al host.
 */
export async function leerFilasDeChatwoot() {
  const contenedor = process.env.ONIA_CHATWOOT_DB_CONTAINER
    || (await run('sh', ['-c', "docker ps --format '{{.Names}}' | grep chatwoot-db | head -1"])).stdout.trim();
  if (!contenedor) throw new Error('no encontre el contenedor de la base de Chatwoot');

  // `sender_id` es lo que distingue al bot de una persona sin hardcodear ningun agente: el bot
  // es quien firmo la promesa, y cualquier otro sender posterior es un humano de verdad.
  const sql = `select m.conversation_id, m.id, m.message_type, extract(epoch from m.created_at)*1000,
      coalesce(m.private,false), c.inbox_id,
      replace(coalesce(ct.name,''), E'\\t', ' '), coalesce(ct.phone_number,''),
      replace(replace(coalesce(m.content,''), E'\\t', ' '), E'\\n', ' '), coalesce(m.sender_id,0)
    from messages m
    join conversations c on c.id = m.conversation_id
    left join contacts ct on ct.id = c.contact_id
    where c.inbox_id in (${INBOXES_BOT.join(',')})
    order by m.conversation_id, m.created_at;`;

  const { stdout } = await run('docker', [
    'exec', contenedor, 'psql', '-U', 'postgres', '-d', 'onia-chatbot', '-tAF\t', '-c', sql,
  ], { maxBuffer: 32 * 1024 * 1024 });

  return stdout
    .split('\n')
    .map((l) => l.split('\t'))
    .filter((c) => c.length >= 10)
    .map((c) => ({
      conversationId: Number(c[0]),
      messageId: Number(c[1]),
      messageType: Number(c[2]),
      createdAtMs: Math.round(Number(c[3])),
      private: c[4] === 't',
      inboxId: Number(c[5]),
      contacto: c[6],
      telefono: c[7],
      content: c[8],
      senderId: Number(c[9]),
    }));
}

/**
 * El `bot_stage` vive en OTRA base (`onia_center.bot_conversations` del `supabase-db`), no en
 * Chatwoot: alli la conversacion figura `open` y perfectamente sana. Es contexto para el aviso,
 * no un filtro — si esta consulta falla, el aviso sale igual sin esa columna. Un vigia que se
 * cae porque no pudo adornar el mensaje es un vigia que no avisa.
 */
async function enriquecerConEstadoDelBot(colgados) {
  if (!colgados.length) return colgados;
  const claves = colgados.map((c) => `'chatwoot:${Number(c.conversationId)}'`).join(',');
  try {
    const { stdout } = await run('docker', [
      'exec', process.env.ONIA_BOT_ESTADO_DB || 'supabase-db',
      'psql', '-U', 'postgres', '-d', 'postgres', '-tAF\t', '-c',
      `select conversation_key, coalesce(bot_stage,'') from onia_center.bot_conversations where conversation_key in (${claves});`,
    ]);
    const porClave = new Map(stdout.split('\n').map((l) => l.split('\t')).filter((c) => c.length >= 2).map((c) => [c[0], c[1]]));
    for (const c of colgados) c.botStage = porClave.get(`chatwoot:${c.conversationId}`) || '';
  } catch {
    // sin estado del motor el aviso sigue siendo cierto, solo menos detallado
  }
  return colgados;
}

function leerEstado(ruta) {
  try {
    return JSON.parse(readFileSync(ruta, 'utf8'));
  } catch {
    return {};
  }
}

export async function correrVigia(opciones = {}, deps = {}) {
  const ahoraMs = Number.isFinite(opciones.ahoraMs) ? opciones.ahoraMs : Date.now();
  const rutaEstado = opciones.estado || process.env.ONIA_VIGIA_ESTADO || ESTADO_POR_DEFECTO;
  const leerFilas = deps.leerFilas || leerFilasDeChatwoot;
  const avisar = deps.avisar || (async (texto) => { await run('/root/bin/onia-tg.sh', [texto]); });

  const filas = await leerFilas();
  // Si el guion no se puede leer, el vigia sigue mirando a los que nadie contesto: perder una
  // mitad no puede apagar la otra. Lo que grita cuando M5 cambia es el caso del `npm test`.
  let frase = null;
  try {
    frase = frasePromesaHandoff(readFileSync(deps.configDelBot || CONFIG_DEL_BOT, 'utf8'));
  } catch { /* sin guion legible no se miran los handoff */ }

  const colgados = await (deps.enriquecer || enriquecerConEstadoDelBot)([
    ...seleccionarColgados(filas, { ahoraMs, umbralMs: opciones.umbralMs }),
    ...seleccionarEsperandoHumano(filas, { ahoraMs, umbralMs: opciones.umbralMs, frase }),
  ]);
  const estadoPrevio = leerEstado(rutaEstado);
  const nuevos = nuevosParaAvisar(colgados, estadoPrevio);

  if (opciones.emitir && nuevos.length) {
    await avisar(armarAviso(nuevos));
    mkdirSync(dirname(rutaEstado), { recursive: true });
    writeFileSync(rutaEstado, JSON.stringify(armarEstado(estadoPrevio, nuevos), null, 2));
  }
  return { colgados, nuevos };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const argv = process.argv.slice(2);
  const valor = (bandera) => {
    const i = argv.indexOf(bandera);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const umbralMin = Number(valor('--umbral-min'));
  correrVigia({
    emitir: argv.includes('--emit'),
    umbralMs: Number.isFinite(umbralMin) && umbralMin > 0 ? umbralMin * 60000 : undefined,
  })
    .then(({ colgados, nuevos }) => {
      for (const c of colgados) {
        const canal = Number(c.inboxId) === 5 ? 'WhatsApp' : 'web';
        const que = c.esperandoHumano ? 'esperando que le escriba una persona' : 'esperando respuesta';
        console.log(`conv ${c.conversationId} (${canal}) — ${espera(c.esperaMin)} ${que} — ${c.contacto || 'sin nombre'}: ${String(c.content || '').slice(0, 60)}`);
      }
      const conHumano = colgados.filter((c) => c.esperandoHumano).length;
      console.log(`${colgados.length} colgado(s) — ${colgados.length - conHumano} sin respuesta · ${conHumano} esperando a un humano prometido · ${nuevos.length} sin avisar${argv.includes('--emit') ? '' : ' (SECO — agregar --emit)'}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`vigia-sin-respuesta: ${String(error?.message || error)}`);
      process.exit(2);
    });
}
