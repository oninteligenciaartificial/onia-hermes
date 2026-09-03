#!/usr/bin/env node
/**
 * sonda_widget.mjs — EJECUTA la definicion de "hecho" del carril chatbot.
 *
 * El objetivo del carril es "que un desconocido escriba y esa conversacion se vea en la
 * bandeja", y desde el 2026-09-02 su forma medible es mas dura: **un desconocido escribe DOS
 * veces y el bot le contesta las DOS**. Hasta hoy eso era una frase. Nadie escribia nunca, y el
 * bot paso una semana contestando el saludo y callandose en el segundo mensaje con cinco
 * personas reales del otro lado, mientras el loop reportaba —con razon, segun lo que podia
 * ver— "no encontre nada roto".
 *
 *   node scripts/sonda_widget.mjs        (o `npm run sonda:widget`)
 *   node scripts/sonda_widget.mjs --self-check
 *
 * CODIGOS DE SALIDA
 *   0  el bot contesto los DOS mensajes            → el carril esta cumpliendo su objetivo
 *   1  contesto uno o ninguno                      → es EL bug, no un exito parcial
 *   2  no se pudo medir                            → no medir NO es estar bien
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * POR QUE NO ALCANZA CON `curl`, Y POR QUE TAMPOCO ALCANZA CON ABRIR EL WIDGET
 *
 * `curl` contra `/api/v1/widget/messages` devuelve `Resource could not be found`: la sesion
 * del widget se arma con JS. Por eso esto maneja un Chromium de verdad.
 *
 * Pero la sonda anterior moria igual, y su diagnostico escrito era FALSO. La cola decia que el
 * localizador expiraba a los 30 s porque la caja de texto estaria *"probablemente dentro de un
 * iframe, o montada recien al abrir el panel"*. Medido el 2026-09-02: no hay iframe y el
 * selector correcto es `#chat-input`. Lo que pasaba es que la pagina **nunca cargaba**:
 *
 *     GET /widget?website_token=… → HTTP 429 "Retry later"
 *
 * `config/initializers/rack_attack.rb` de Chatwoot, textual:
 *
 *     throttle('widget?website_token={website_token}&cw_conversation={x-auth-token}',
 *              limit: 5, period: 1.hour) do |req|
 *       req.ip if req.path_without_extentions == '/widget' &&
 *                 ActionDispatch::Request.new(req.env).params['cw_conversation'].blank?
 *     end
 *
 * O sea: **abrir el widget SIN traer conversacion se puede 5 veces por hora y por IP.** Una
 * sonda horaria que abre limpio cada vuelta se apaga sola, y encima se lleva puesto el cupo. La
 * hipotesis del iframe no era solo inutil: mandaba a arreglar el archivo equivocado.
 *
 * ⚠️ **Esto NO afecta a los leads reales, y se verifico en vez de suponerlo.** El contador es
 * por IP y Chatwoot ve la IP real de cada visitante: en su log conviven `181.115.161.191`,
 * `189.28.94.168`, `181.188.170.59` (ISPs bolivianos) y `187.77.16.63`, que es este VPS. El
 * unico bloqueado era el bloqueador: nosotros.
 *
 * LA SALIDA, que es lo que hace sostenible correr esto cada hora: `cw_conversation`.
 * `WidgetsController#set_token` decodifica ese parametro, busca el `ContactInbox` por su
 * `source_id` y **reusa el contacto**; y el throttle no aplica cuando el parametro viene. Asi
 * que la sonda guarda su token la primera vez y despues entra siempre por la puerta libre.
 * Efecto de borde deseado: hay UNA sola conversacion de sonda, no una por hora ensuciando la
 * bandeja donde viven los leads de verdad.
 *
 * ⚠️ El contacto se llama `Sonda QA` A PROPOSITO. `objetivo_visible.mjs` excluye a los que
 * somos nosotros con `NOMBRE_DE_PRUEBA = /\b(prueba|qa|test)\b/i`; si esta sonda entrara sin
 * nombre, el otro gate la contaria como "un desconocido escribio" y el carril se declararia
 * cumplido **por su propia sonda**. Un gate que se satisface a si mismo es peor que no tenerlo.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * COMO SE JUZGA, que es donde estan los tres falsos verdes
 *
 * 1. **Solo `message_type = 1` es una respuesta del bot.** Los `message_type = 3` son los
 *    mensajes enlatados del pre-chat ("¡Hola! Soy el asistente automatico…", "Dale al equipo
 *    una forma de llegar a ti"): salen en el MISMO milisegundo que el entrante y salen siempre,
 *    tambien cuando el bot esta mudo. Contarlos pinta de verde exactamente el bug.
 * 2. **Se cuenta por TURNO, no en total.** "Hubo 2 salientes" es verde con dos respuestas al
 *    primer mensaje y cero al segundo — que es, literalmente, el bug de la semana.
 * 3. **La respuesta tiene que venir DESPUES de su entrante.** Sin eso, el saludo enlatado del
 *    turno anterior alcanza para dar por contestado el turno siguiente.
 *
 * Las tres son casos del `--self-check`, y las tres se probaron como mutacion.
 *
 * Env opcionales: ONIA_CHATWOOT_DB_CONTAINER, ONIA_WIDGET_URL, ONIA_WIDGET_TOKEN,
 * ONIA_SONDA_ESTADO (donde se guarda el `cw_conversation`).
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const HOST = process.env.ONIA_WIDGET_URL || 'https://onia-chatbot-chatwoot.hqdqgh.easypanel.host';
const WEBSITE_TOKEN = process.env.ONIA_WIDGET_TOKEN || '9k5i7xnAgCbSse1EZwVChZLw';
const DB = process.env.ONIA_CHATWOOT_DB_CONTAINER || 'onia-chatbot_chatwoot-db';
const APP = process.env.ONIA_CHATWOOT_APP_CONTAINER || 'onia-chatbot_chatwoot';
const ESTADO = process.env.ONIA_SONDA_ESTADO || '/root/.onia/sonda-widget.json';
// La base del MOTOR del bot, que NO es la de Chatwoot: `onia_center.bot_conversations` vive en
// el Supabase self-hosted del VPS. Es donde se ve si el bot esta callado por diseno.
const ESTADO_DB = process.env.ONIA_BOT_ESTADO_DB || 'supabase-db';
const NOMBRE_SONDA = 'Sonda QA carril chatbot';

/** Los dos mensajes del chequeo, tal cual los fija el prompt del loop. */
export const MENSAJES = [
  'Hola, quiero informacion sobre el sistema',
  'Tengo una clinica dental en Santa Cruz, somos 4 personas',
];

/** Chatwoot: 0 entrante · 1 saliente (respuesta de verdad) · 2 actividad · 3 enlatado del pre-chat. */
export const ENTRANTE = 0;
export const RESPUESTA = 1;

/**
 * Parte los mensajes de la conversacion en turnos: cada entrante abre uno, y ese turno esta
 * contestado si hay al menos un `message_type = 1` DESPUES de el y ANTES del proximo entrante.
 *
 * Se separa de `juzgar()` a proposito: es la pieza que concentra los tres falsos verdes y se
 * puede afirmar sola, turno por turno, sin pasar por el veredicto.
 */
export function turnos(mensajes) {
  const ordenados = [...mensajes].sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
  const out = [];
  for (const m of ordenados) {
    if (Number(m.message_type) === ENTRANTE) {
      out.push({ entrante: m.content, respuestas: [] });
    } else if (Number(m.message_type) === RESPUESTA && out.length > 0) {
      out[out.length - 1].respuestas.push(m.content);
    }
  }
  return out;
}

/**
 * El veredicto. `enviados` es cuantos mensajes logro mandar la sonda por el navegador; si no
 * logro mandar los dos, no hay nada que juzgar y eso es 2, no 1: culpar al bot de un mensaje
 * que nunca salio manda a mirar el archivo equivocado.
 */
export function juzgar({ enviados, mensajes, conversacionId }) {
  if (enviados < MENSAJES.length) {
    return { codigo: 2, texto: `NO SE PUDO MEDIR — la sonda mando ${enviados} de ${MENSAJES.length} mensajes` };
  }
  if (!Array.isArray(mensajes) || mensajes.length === 0) {
    return { codigo: 2, texto: `NO SE PUDO MEDIR — la conversacion ${conversacionId ?? '?'} no devolvio ni un mensaje` };
  }

  const todos = turnos(mensajes);
  // Solo los turnos de ESTA vuelta: la conversacion de sonda se reusa, asi que arrastra los
  // turnos de todas las anteriores. Juzgar sobre el historico dejaria verde para siempre una
  // sonda que hoy no obtiene respuesta.
  const mios = todos.slice(-MENSAJES.length);
  if (mios.length < MENSAJES.length) {
    return { codigo: 2, texto: `NO SE PUDO MEDIR — se esperaban ${MENSAJES.length} turnos y la base tiene ${mios.length}` };
  }

  const mudos = mios.filter((t) => t.respuestas.length === 0);
  const detalle = mios
    .map((t, i) => `#${i + 1} "${String(t.entrante).slice(0, 40)}" → ${t.respuestas.length} respuesta(s)`)
    .join(' · ');

  if (mudos.length > 0) {
    return {
      codigo: 1,
      texto:
        `EL BOT SE QUEDO MUDO — conversacion ${conversacionId ?? '?'}: ${detalle}. ` +
        `${mudos.length} de ${MENSAJES.length} turnos sin respuesta. Una sola respuesta es EL bug, ` +
        `no un exito parcial: es como el bot paso una semana con gente real del otro lado.`,
    };
  }

  // Contestar no es contestar BIEN. Al primer "hola, quiero informacion" de alguien que todavia
  // no conto nada, derivar a un humano es la respuesta equivocada — y con el conteo solo, esa
  // vuelta es indistinguible de una sana. Ver el comentario largo de `esExtrano`.
  if (mios[0].respuestas.some(esDerivacion)) {
    return {
      codigo: 1,
      texto:
        `EL BOT DERIVO EN EL PRIMER TURNO — conversacion ${conversacionId ?? '?'}: ${detalle}. ` +
        `A "${String(mios[0].entrante).slice(0, 40)}" contesto "${normalizar(mios[0].respuestas[0]).slice(0, 60)}...", ` +
        'que es la derivacion a un humano. Un desconocido que recien saluda no tiene nada que ' +
        'derivar: o el motor arranco con el embudo cargado (mirar `esExtrano` sobre ' +
        '`onia_center.bot_conversations`), o el bot deriva de una a todo el mundo.',
    };
  }

  return {
    codigo: 0,
    texto: `EL BOT CONTESTO LOS ${MENSAJES.length} — conversacion ${conversacionId ?? '?'}: ${detalle}.`,
  };
}

// ───────────────────────── el arranque que NO pasa por `/widget` ─────────────────────────
//
// El cupo de 5 aperturas por hora se agota con la sonda misma, y entonces la sonda no puede
// sacar su primer token — el unico estado del que no se sale sola. Medido el 2026-09-02 20:13:
// la vuelta anterior habia gastado las 5 del bucket probando, y esta vuelta ya no tenia como
// medir hasta las 21:00. Un chequeo de "hecho" que depende de que nadie lo haya corrido hace
// poco no es un chequeo: es una moneda.
//
// La salida es que el token NO nace en el navegador. `Widget::TokenService` lo firma dentro de
// Chatwoot, y `rails runner` esta a un `docker exec` (11 s medidos). Desde ese token la sonda
// entra siempre por `cw_conversation`, que rack_attack no cuenta.
//
// Efecto de borde que importa igual de mucho: el contacto se crea YA con su nombre. Antes el
// nombre se ponia por SQL al final, solo si la vuelta llegaba viva hasta ahi — y cada arranque
// fallido dejaba un contacto anonimo (`misty-leaf-844`) en el inbox 4, el de los leads de
// verdad. Habia 12 de esos solo el 2026-09-02.

/** Con esta marca el runner delata el token entre su propio ruido de WARN e INFO. */
export const MARCA_BOOTSTRAP = 'ONIA_SONDA_TOKEN=';

// ─────────────────────────── EL DESARME, o por que la sonda se envenenaba sola ────────────
// Reusar UNA sola conversacion es lo que hace sostenible medir cada hora (esquiva el cupo de
// 5/hora de rack_attack y no ensucia con 24 conversaciones diarias la bandeja donde viven los
// leads de verdad). Su costo, que no estaba visto: esa conversacion ACUMULA estado.
//
// Medido el 2026-09-02: a las 20:19 y a las 21:09 el bot contesto los DOS turnos. En la tercera
// vuelta la conversacion llego a `handoff_humano` —el bot derivo a Sergio, que es EXACTAMENTE lo
// que tiene que hacer— y ahi el motor calla por diseno (`bot-engine.mjs:459`, y el
// `case "handoff_humano"` de la 591). La sonda midio 0 de 2 y grito "EL BOT SE QUEDO MUDO"
// con el bot sano.
//
// Sin este desarme la sonda miente UNA VEZ POR HORA para siempre, y cada vuelta del loop se
// quema en su propia falsa alarma en vez de mirar la cola. Es el caso exacto del instrumento
// que se da la razon a si mismo.
//
// El desarme NO es un truco: es la semantica que el propio producto define. `clearHumanTakeover`
// (bot-engine.mjs:117) dice "resolver significa termine" y devuelve `handoff_humano` a `nuevo`.
// Resolvemos por Rails para que el camino real se ejecute entero — Chatwoot emite
// `conversation_status_changed`, el adapter lo traduce y el estado vuelve. Efecto de borde
// deseado: cada vuelta verifica ademas que ese desarme sigue vivo.

/** Estados del motor en los que el bot calla por diseno. Medir ahi no mide al bot. */
export const ESTADOS_QUE_CALLAN = new Set(['handoff_humano']);

/**
 * ¿Esta conversacion esta en un estado donde el silencio es CORRECTO?
 * Sin fila todavia no hay nada que desarmar; desarmar de mas tampoco es gratis (resolver
 * reinicia el embudo), asi que solo se toca lo que efectivamente calla.
 */
export function necesitaDesarme(fila) {
  if (!fila) return false;
  if (fila.humanTookOver === true) return true;
  return ESTADOS_QUE_CALLAN.has(String(fila.botStage || ''));
}

// ────────────── Y por que el desarme SOLO no alcanzaba: la sonda seguia envenenada ──────────────
//
// Medido el 2026-09-03 sobre la conversacion 49, con los MISMOS dos mensajes, en tres vueltas
// consecutivas del loop. Las tres salieron "EL BOT CONTESTO LOS 2", exit 0, verde:
//
//   03:04  #1 → "¡Hola! Soy el asistente automatico de Onia. Si, un bot."   ← lo que ve un extrano
//   04:03  #1 → "¿Queres que te reserve para el viernes 4 de septiembre?"   ← ya le ofrece hora
//   05:03  #1 → "Eso lo tiene que ver Sergio, no yo" (M5)                   ← lo deriva de una
//
// El bot no se rompio: la SONDA se degrado. `clearHumanTakeover` (bot-engine.mjs:121) devuelve
// `bot_stage` a "nuevo" y nada mas — y hace bien, porque para un lead de verdad olvidarle el
// rubro seria el bug. Pero la fila de la sonda seguia con `qualification={city,industry,teamSize}`,
// dos `slots_offered` y `off_script_count=2`: el motor arrancaba cada vuelta con el embudo YA
// completo y derivaba en el primer turno. Un desconocido nunca recibe eso.
//
// La sonda no lo podia ver porque CONTABA las respuestas sin LEERLAS. Es el defecto exacto que
// el carril tiene escrito —"un test que mira el primer paso no ve un sistema que muere en el
// segundo"— una vuelta mas adentro: un test que cuenta no ve un sistema que contesta cualquier cosa.

/**
 * ¿Esta fila es la de alguien que escribe por PRIMERA vez?
 *
 * Es la precondicion de toda la medicion: la sonda dice medir "un desconocido escribe dos veces",
 * y si el motor ya sabe el rubro, el tamano y la ciudad, lo que se mide es otra cosa. Sin fila
 * es el caso mas extrano de todos (conversacion recien creada), no un error.
 */
export function esExtrano(fila) {
  if (!fila) return true;
  if (fila.humanTookOver === true) return false;
  if (String(fila.botStage || 'nuevo') !== 'nuevo') return false;
  if (Object.keys(fila.qualification || {}).length > 0) return false;
  if ((fila.slotsOffered || []).length > 0) return false;
  if (Number(fila.offScriptCount || 0) !== 0) return false;
  if (fila.scheduledAt) return false;
  if (fila.optOutAt) return false;
  return true;
}

/** Lo que hay que blanquear para que el motor vuelva a ver a un desconocido. */
export function guionBlanqueo(conversacionId) {
  return (
    'update onia_center.bot_conversations set ' +
    "bot_stage = 'nuevo', human_took_over = false, human_took_over_at = null, " +
    "qualification = '{}'::jsonb, slots_offered = '[]'::jsonb, scheduled_at = null, " +
    'calendar_event_id = null, off_script_count = 0, followup_step = 0, opt_out_at = null, ' +
    'updated_at = now() ' +
    `where conversation_key = 'chatwoot:${Number(conversacionId)}';`
  );
}

/**
 * Las frases con las que el bot DERIVA a un humano, tal como las fija `config.mjs` del bot
 * (M5, M5_ACUSE y M8_SOPORTE). Normalizadas: sin acentos de dibujo, en minuscula y con los
 * guiones largos vueltos guion comun, que es donde estas comparaciones se rompen.
 *
 * Recibir esto en el PRIMER turno es el bug: el prospecto todavia no conto nada, asi que no hay
 * nada que derivar. En el segundo puede ser exactamente lo correcto y por eso no se mira.
 */
export const CONFIG_DEL_BOT =
  process.env.ONIA_BOT_CONFIG || new URL('../hermes-content/deploy/vps-ops/bot/config.mjs', import.meta.url).pathname;

export const FRASES_DE_DERIVACION = [
  'no yo - soy un bot',
  'sigo siendo el bot',
  'esto no es una demo de venta: es soporte',
];

/** Minuscula, guiones largos a guion comun y espacios colapsados. */
export function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

/** ¿Este texto es una derivacion a un humano? */
export function esDerivacion(texto) {
  const t = normalizar(texto);
  return FRASES_DE_DERIVACION.some((f) => t.includes(f));
}

/** El guion de Rails. Separado y exportado para poder afirmarlo sin levantar un contenedor. */
export function guionBootstrap({ websiteToken, nombre }) {
  const rb = (s) => JSON.stringify(String(s)); // comillas de Ruby y de JSON coinciden para esto
  return [
    `canal = Channel::WebWidget.find_by(website_token: ${rb(websiteToken)})`,
    `raise "no hay WebWidget con ese website_token" if canal.nil?`,
    `inbox = canal.inbox`,
    `ci = inbox.contact_inboxes.joins(:contact).where(contacts: { name: ${rb(nombre)} }).order(:id).first`,
    `if ci.nil?`,
    `  contacto = inbox.account.contacts.create!(name: ${rb(nombre)})`,
    `  ci = inbox.contact_inboxes.create!(contact: contacto, source_id: SecureRandom.uuid)`,
    `end`,
    `carga = { source_id: ci.source_id, inbox_id: inbox.id }`,
    `puts "${MARCA_BOOTSTRAP}" + Widget::TokenService.new(payload: carga).generate_token`,
  ].join('\n');
}

/** Saca el token de la salida del runner, que viene envuelta en WARN de deprecacion e INFO. */
export function tokenDeSalida(salida) {
  const linea = String(salida)
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith(MARCA_BOOTSTRAP))
    .pop();
  if (!linea) {
    throw new Error(`el runner de Rails no imprimio ${MARCA_BOOTSTRAP} — salida: ${String(salida).slice(-300)}`);
  }
  const token = linea.slice(MARCA_BOOTSTRAP.length).trim();
  // Tres partes separadas por punto. Sin esto, un `nil` o un source_id suelto se guardarian
  // igual de bien y el error recien aparecería al abrir el widget, lejos de su causa.
  if (token.split('.').length !== 3 || token.split('.').some((p) => p === '')) {
    throw new Error(`el runner devolvio algo que no parece un JWT: ${JSON.stringify(token)}`);
  }
  return token;
}

// ───────────────────── el boton que abre el chat, y por que NO es un texto ─────────────────────
//
// El widget no abre en la caja de texto: abre en una pantalla de bienvenida con UN boton, y
// `#chat-input` recien se monta despues de tocarlo. Hasta el 2026-09-02 ese boton se buscaba por
// su texto, `/iniciar conversaci/i` — y eso hizo que la sonda funcionara UNA sola vez en su vida.
//
// El motivo es que el arreglo anterior se saboteo a si mismo: para esquivar el tope de 5
// aperturas/hora, la sonda entra con `cw_conversation` y REUSA su conversacion. Con conversacion
// ya empezada, Chatwoot rotula ese mismo boton **"Continuar conversacion"**. O sea que la primera
// vuelta (contacto recien creado, sin conversacion) decia "Iniciar" y andaba, y **todas las
// siguientes decian "Continuar" y morian** con `Timeout … waiting for locator('#chat-input')`.
// MIRADO renderizado hoy, no supuesto: el `body` decia "Estamos en linea / OB / Continuar
// conversacion / Desarrollado por Onia" y los <button> eran `["…close-button", "Continuar
// conversacion"]`. Es el modo de falla que el propio carril tiene escrito — un chequeo que mira
// el primer paso no ve un sistema que muere en el segundo.
//
// Por eso ahora se elige por ESTRUCTURA, no por rotulo: de los botones de la pantalla se descarta
// el de cerrar y los que no tienen texto, y queda el unico que abre el chat. Sobrevive a
// "Continuar", a un cambio de idioma y a que Chatwoot le cambie el copy otra vez.

/** El boton de cerrar del widget. Es el unico que NO hay que tocar: cierra el panel. */
const CERRAR = /close-button/;

/**
 * Elige cual de los botones de la pantalla de bienvenida abre el chat. Devuelve el indice, o
 * -1 si no hay ninguno. Pura y exportada a proposito: es la pieza donde vivio el bug y se puede
 * afirmar contra el DOM real sin levantar un navegador.
 *
 * `botones` son `{ texto, clase }` tal como salen del `page.evaluate` de abajo.
 */
export function elegirArranque(botones) {
  const candidatos = (botones || [])
    .map((b, i) => ({ texto: String(b?.texto ?? '').trim(), clase: String(b?.clase ?? ''), i }))
    .filter((b) => !CERRAR.test(b.clase) && b.texto !== '');
  if (candidatos.length === 0) return -1;
  // Con varios botones se prefiere el que habla de la conversacion; con uno solo, ese.
  const conversacional = candidatos.find((b) => /conversaci|conversation|chat/i.test(b.texto));
  return (conversacional ?? candidatos[0]).i;
}

/** Lee el `source_id` del JWT del widget sin la clave: solo se necesita leerlo, no validarlo. */
export function sourceIdDelToken(token) {
  const partes = String(token).split('.');
  if (partes.length < 2) throw new Error('el cw_conversation guardado no parece un JWT');
  const payload = JSON.parse(Buffer.from(partes[1], 'base64url').toString('utf8'));
  if (!payload.source_id) throw new Error('el cw_conversation guardado no trae source_id');
  return payload.source_id;
}

// ─────────────────────────────── lo que toca el mundo real ───────────────────────────────

/**
 * En Swarm los contenedores NO se llaman como su servicio: `onia-chatbot_chatwoot-db` es en
 * realidad `onia-chatbot_chatwoot-db.1.nhgizxt2v01lnhebx9jtdwm5q`, con un sufijo de replica que
 * cambia en cada redeploy. Hardcodear el nombre corto daba `No such container` — y encima
 * DESPUES de haber mandado los dos mensajes, o sea gastando la medicion para no medir nada.
 */
function contenedor(prefijo, excluir = []) {
  const encontrado = execFileSync('docker', ['ps', '--filter', `name=${prefijo}`, '--format', '{{.Names}}'], {
    encoding: 'utf8',
    timeout: 30_000,
  })
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !excluir.some((x) => l.includes(x)))[0];
  if (!encontrado) throw new Error(`no encontre el contenedor "${prefijo}" en docker ps`);
  return encontrado;
}

const sql = (q) =>
  execFileSync('docker', ['exec', contenedor(DB), 'psql', '-U', 'postgres', '-d', 'onia-chatbot', '-tAc', q], {
    encoding: 'utf8',
    timeout: 30_000,
  }).trim();

/** La conversacion que le corresponde al token guardado, o null si todavia no existe. */
function conversacionDelToken(token) {
  const sid = sourceIdDelToken(token);
  const id = sql(
    `select c.id from conversations c join contact_inboxes ci on ci.id = c.contact_inbox_id ` +
      `where ci.source_id = '${sid.replace(/'/g, "''")}' order by c.id desc limit 1;`,
  );
  return id ? Number(id) : null;
}

/**
 * El estado del MOTOR (no el de Chatwoot). Vive en otra base: `onia_center.bot_conversations`
 * del `supabase-db` self-hosted. Mirar solo Chatwoot fue lo que hizo invisible este bug: alli
 * la conversacion figura `open` y perfectamente sana.
 */
function psqlMotor(sql) {
  return execFileSync('docker', ['exec', ESTADO_DB, 'psql', '-U', 'postgres', '-d', 'postgres', '-tAc', sql], {
    encoding: 'utf8',
    timeout: 30_000,
  }).trim();
}

function estadoDelBot(conversacionId) {
  // Por JSON y no por `||'|'||`: `qualification` trae texto libre del prospecto (ciudad, rubro)
  // y cualquier separador que se elija puede aparecer adentro.
  const fila = psqlMotor(
    `select json_build_object('botStage', bot_stage, 'humanTookOver', human_took_over, ` +
      `'qualification', qualification, 'slotsOffered', slots_offered, 'offScriptCount', off_script_count, ` +
      `'scheduledAt', scheduled_at, 'optOutAt', opt_out_at)::text ` +
      `from onia_center.bot_conversations where conversation_key = 'chatwoot:${Number(conversacionId)}';`,
  );
  if (!fila) return null;
  return JSON.parse(fila);
}

/**
 * Deja la conversacion de sonda como la de alguien que nunca escribio.
 *
 * DOS pasos, y el orden importa. Primero el desarme por Rails, que es la semantica del propio
 * producto y de paso verifica cada vuelta que ese camino siga vivo. Despues el blanqueo del
 * embudo por SQL — y esto SI es escribir la base a mano, a falta de camino de producto: el bot
 * no tiene (ni debe tener) un "olvidate de este lead". Al reves de lo que se dio por bueno el
 * 2026-09-02, resetear el estado del motor NO alcanzaba: lo que envenenaba la medicion no era
 * `bot_stage` sino el embudo que sobrevive intacto al desarme.
 *
 * Blanquear DESPUES del desarme y no antes: resolver viaja por Sidekiq y el adapter reescribe
 * la fila al llegar, asi que un blanqueo previo se lo lleva puesto.
 */
function dejarComoExtrano(conversacionId) {
  if (necesitaDesarme(estadoDelBot(conversacionId)) && !desarmar(conversacionId)) return false;
  psqlMotor(guionBlanqueo(conversacionId));
  return esExtrano(estadoDelBot(conversacionId));
}

/**
 * Devuelve la conversacion al bot resolviendola, que es lo que el producto define como
 * "termine" (`clearHumanTakeover`). Va por Rails a proposito: asi se ejecuta el camino real
 * —Chatwoot emite `conversation_status_changed`, el adapter lo traduce— y cada vuelta verifica
 * de paso que ese desarme sigue vivo. Escribir la base a mano lo daria por bueno sin probarlo.
 */
function desarmar(conversacionId) {
  const app = contenedor(APP, ['sidekiq', '-db', 'redis']);
  execFileSync(
    'docker',
    [
      'exec',
      app,
      'sh',
      '-lc',
      `RAILS_ENV=production bundle exec rails runner "Conversation.find(${Number(conversacionId)}).resolved!" 2>&1`,
    ],
    { encoding: 'utf8', timeout: 180_000 },
  );
  // El webhook viaja por Sidekiq: es rapido pero no instantaneo. Se espera al EFECTO
  // (`bot_stage` de vuelta en algo que habla), no a un plazo fijo.
  for (let i = 0; i < 10; i += 1) {
    if (!necesitaDesarme(estadoDelBot(conversacionId))) return true;
    execFileSync('sleep', ['2']);
  }
  return false;
}

function leerEstado() {
  try {
    return JSON.parse(readFileSync(ESTADO, 'utf8'));
  } catch {
    return {};
  }
}

function guardarEstado(estado) {
  mkdirSync(dirname(ESTADO), { recursive: true });
  writeFileSync(ESTADO, JSON.stringify(estado, null, 2));
}

/** Mint del `cw_conversation` con el propio Rails de Chatwoot. Tarda ~11 s y corre UNA vez. */
function bootstrapear() {
  const app = contenedor(APP, ['sidekiq', '-db', 'redis']);
  const guion = guionBootstrap({ websiteToken: WEBSITE_TOKEN, nombre: NOMBRE_SONDA });
  // Por stdin y no por argumento: el guion trae comillas, llaves y saltos de linea, y armarlo
  // dentro de un `sh -lc` es exactamente donde se rompen estas cosas.
  execFileSync('docker', ['exec', '-i', app, 'sh', '-c', 'cat > /tmp/onia_sonda_bootstrap.rb'], {
    input: guion,
    timeout: 30_000,
  });
  const salida = execFileSync(
    'docker',
    ['exec', app, 'sh', '-lc', 'RAILS_ENV=production bundle exec rails runner /tmp/onia_sonda_bootstrap.rb 2>&1'],
    { encoding: 'utf8', timeout: 180_000 },
  );
  return tokenDeSalida(salida);
}

async function correr() {
  const { chromium } = await import('/root/node_modules/playwright/index.mjs');
  const estado = leerEstado();

  // Sin token guardado se arranca por Rails, NO abriendo `/widget` limpio: esa puerta tiene
  // cupo de 5/hora y es la que dejaba a la sonda sin forma de medir.
  if (!estado.cw_conversation) {
    try {
      const token = bootstrapear();
      guardarEstado({ ...estado, cw_conversation: token, arrancada: new Date().toISOString() });
      estado.cw_conversation = token;
    } catch (e) {
      return { codigo: 2, texto: `NO SE PUDO MEDIR — fallo el arranque por Rails: ${e.message}` };
    }
  }

  // DESARMAR ANTES DE MEDIR. Ver el comentario largo de `necesitaDesarme`: la conversacion
  // reusada acumula estado y termina en `handoff_humano`, donde el silencio es CORRECTO. Medir
  // ahi no mide al bot — grita que esta mudo con el bot sano, una vez por hora, para siempre.
  try {
    const previa = conversacionDelToken(estado.cw_conversation);
    if (previa && !dejarComoExtrano(previa)) {
      // Fallar hacia "no se pudo medir" (2) y NUNCA hacia "el bot esta mudo" (1): no medir
      // no es estar roto, y confundirlos es como este carril perdio una vuelta entera.
      const fila = estadoDelBot(previa);
      return {
        codigo: 2,
        texto:
          `NO SE PUDO MEDIR — la conversacion ${previa} no quedo como la de un desconocido: ` +
          `${JSON.stringify(fila)}. Si sigue en "handoff_humano", revisar que Chatwoot emita ` +
          '`conversation_status_changed` y que el adapter lo traduzca; si lo que quedo cargado es ' +
          'el embudo (`qualification`, `slots_offered`), revisar `guionBlanqueo`.',
      };
    }
  } catch (e) {
    return { codigo: 2, texto: `NO SE PUDO MEDIR — fallo dejar la conversacion como nueva: ${e.message}` };
  }

  const url = `${HOST}/widget?website_token=${WEBSITE_TOKEN}&cw_conversation=${encodeURIComponent(estado.cw_conversation)}`;

  const navegador = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  let enviados = 0;
  let token = estado.cw_conversation;
  try {
    const pagina = await (await navegador.newContext()).newPage();
    const respuesta = await pagina.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });

    if (respuesta && respuesta.status() === 429) {
      return {
        codigo: 2,
        texto:
          'NO SE PUDO MEDIR — HTTP 429 aun mandando `cw_conversation`, que es la puerta que ' +
          'rack_attack NO cuenta. O sea que lo que se agoto es otro tope (`req/ip`, 3000/min) ' +
          'o el token guardado dejo de ser valido y Chatwoot lo trata como apertura limpia. ' +
          `Mirar ${ESTADO}.`,
      };
    }
    if (!respuesta || !respuesta.ok()) {
      return { codigo: 2, texto: `NO SE PUDO MEDIR — el widget respondio HTTP ${respuesta ? respuesta.status() : '?'}` };
    }

    const nuevo = await pagina.evaluate(() => window.authToken).catch(() => null);
    if (nuevo && nuevo !== token) {
      token = nuevo;
      guardarEstado({ ...estado, cw_conversation: token, visto: new Date().toISOString() });
    }
    if (!token) return { codigo: 2, texto: 'NO SE PUDO MEDIR — la pagina no expuso `window.authToken`' };

    // El widget no abre en la caja de texto: abre en una pantalla de bienvenida con un boton, y
    // `#chat-input` recien se monta despues de tocarlo. Cual es ese boton lo decide
    // `elegirArranque` por estructura y no por rotulo — ver el comentario largo alla arriba.
    const caja = pagina.locator('#chat-input');
    const botones = () =>
      pagina.evaluate(() =>
        [...document.querySelectorAll('button')].map((b) => ({ texto: b.innerText || '', clase: b.className || '' })),
      );

    // Hay que ESPERAR a que el widget monte antes de mirarle los botones. `goto` vuelve con
    // `domcontentloaded` y en ese instante el Vue del widget todavia no dibujo nada: la lista de
    // botones sale vacia, `elegirArranque` devuelve -1 con razon, no se clickea, y la sonda se
    // queda 30 s esperando una caja que nunca se iba a montar. Medido hoy: con 6 s de espera los
    // dos botones estan y el clic funciona; sin espera, cero botones.
    const limite = Date.now() + 30_000;
    while (Date.now() < limite) {
      if (await caja.isVisible().catch(() => false)) break;
      if (elegirArranque(await botones()) >= 0) break;
      await pagina.waitForTimeout(500);
    }

    if (!(await caja.isVisible().catch(() => false))) {
      const cual = elegirArranque(await botones());
      if (cual >= 0) await pagina.locator('button').nth(cual).click();
    }

    try {
      await caja.waitFor({ state: 'visible', timeout: 30_000 });
    } catch {
      // El mensaje de Playwright es `Timeout … waiting for locator('#chat-input')` y no dice NADA
      // de lo que habia en pantalla: con el solo, esta misma falla costo una vuelta entera de
      // diagnostico a ciegas (se supuso un iframe que no existe, y despues un rotulo que habia
      // cambiado). Si la sonda no encuentra su caja, que al menos diga que SI vio.
      const vistos = await botones().catch(() => []);
      const texto = await pagina.evaluate(() => document.body.innerText).catch(() => '');
      return {
        codigo: 2,
        texto:
          'NO SE PUDO MEDIR — el widget cargo pero nunca aparecio `#chat-input`. ' +
          `Botones en pantalla: ${JSON.stringify(vistos.map((b) => b.texto.trim() || `.${b.clase}`))}. ` +
          `Pantalla: ${JSON.stringify(String(texto).replace(/\s+/g, ' ').trim().slice(0, 300))}`,
      };
    }
    for (const texto of MENSAJES) {
      await caja.click();
      await caja.fill(texto);
      await pagina.keyboard.press('Enter');
      enviados += 1;
      await pagina.waitForTimeout(15_000);
    }
  } catch (e) {
    return { codigo: 2, texto: `NO SE PUDO MEDIR — ${e.message}` };
  } finally {
    await navegador.close();
  }

  // El conversation_id sale del `source_id` del propio token, NO de "la conversacion mas nueva
  // del inbox": adivinarla haria que la sonda juzgue la conversacion de un lead de verdad.
  let conversacionId;
  try {
    const sid = sourceIdDelToken(token);
    conversacionId = sql(
      `select c.id from conversations c join contact_inboxes ci on ci.id = c.contact_inbox_id ` +
        `where ci.source_id = '${sid.replace(/'/g, "''")}' order by c.id desc limit 1;`,
    );
    if (!conversacionId) return { codigo: 2, texto: `NO SE PUDO MEDIR — no hay conversacion para source_id ${sid}` };
    // El nombre es lo que evita que `objetivo:visible` cuente a esta sonda como un desconocido.
    sql(
      `update contacts set name = '${NOMBRE_SONDA}' where id = (select contact_id from contact_inboxes ` +
        `where source_id = '${sid.replace(/'/g, "''")}') and coalesce(name,'') <> '${NOMBRE_SONDA}';`,
    );
  } catch (e) {
    return { codigo: 2, texto: `NO SE PUDO MEDIR — ${e.message}` };
  }

  const filas = sql(
    `select message_type || '|' || created_at || '|' || replace(coalesce(content,''), '|', ' ') ` +
      `from messages where conversation_id = ${Number(conversacionId)} order by created_at;`,
  );
  const mensajes = filas
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      const [message_type, created_at, ...resto] = l.split('|');
      return { message_type: Number(message_type), created_at, content: resto.join('|') };
    });

  return juzgar({ enviados, mensajes, conversacionId });
}

// ────────────────────────────────────── self-check ──────────────────────────────────────

function selfCheck() {
  const assert = require('node:assert');
  const casos = [];
  const caso = (nombre, fn) => casos.push([nombre, fn]);
  const m = (message_type, created_at, content) => ({ message_type, created_at, content });

  // Los dos primeros son filas REALES de produccion del 2026-09-02: la conversacion 47 es el bug
  // (murio en el segundo mensaje) y la 48 es la misma prueba despues del arreglo de las 17:19.
  const CONV_47 = [
    m(0, '2026-09-02 17:01:27', 'Hola, quiero informacion sobre el sistema'),
    m(3, '2026-09-02 17:01:28', '¡Hola! Soy el asistente automatico de Onia.'),
    m(3, '2026-09-02 17:01:28', 'Dale al equipo una forma de llegar a ti.'),
    m(1, '2026-09-02 17:01:33', '¡Hola! Te escribe el asistente automatico de Onia'),
    m(0, '2026-09-02 17:01:49', 'Tengo una clinica dental en Santa Cruz, somos 4 personas'),
  ];
  const CONV_48 = [
    ...CONV_47.slice(0, 5),
    m(1, '2026-09-02 17:21:58', 'Perfecto, anotado que te dedicas a odontologia'),
  ];

  caso('los dos turnos contestados → 0', () => {
    const v = juzgar({ enviados: 2, mensajes: CONV_48, conversacionId: 48 });
    assert.strictEqual(v.codigo, 0, `deberia ser 0 y fue ${v.codigo}: ${v.texto}`);
  });

  caso('el bug real: mudo en el SEGUNDO mensaje → 1', () => {
    const v = juzgar({ enviados: 2, mensajes: CONV_47, conversacionId: 47 });
    assert.strictEqual(v.codigo, 1, `el bug de la semana tiene que salir 1 y salio ${v.codigo}: ${v.texto}`);
    assert.match(v.texto, /1 de 2 turnos sin respuesta/);
  });

  caso('los enlatados del pre-chat (type 3) NO son una respuesta', () => {
    const solo3 = [
      m(0, '2026-09-02 10:00:00', 'Hola, quiero informacion sobre el sistema'),
      m(3, '2026-09-02 10:00:00', '¡Hola! Soy el asistente automatico de Onia.'),
      m(0, '2026-09-02 10:00:15', 'Tengo una clinica dental en Santa Cruz, somos 4 personas'),
      m(3, '2026-09-02 10:00:15', 'Dale al equipo una forma de llegar a ti.'),
    ];
    const v = juzgar({ enviados: 2, mensajes: solo3, conversacionId: 90 });
    assert.strictEqual(v.codigo, 1, `type 3 no puede contar como respuesta; salio ${v.codigo}: ${v.texto}`);
  });

  caso('dos respuestas al PRIMER turno y cero al segundo → 1, no 0', () => {
    const cargado = [
      m(0, '2026-09-02 11:00:00', 'Hola, quiero informacion sobre el sistema'),
      m(1, '2026-09-02 11:00:05', 'primera'),
      m(1, '2026-09-02 11:00:06', 'segunda'),
      m(0, '2026-09-02 11:00:15', 'Tengo una clinica dental en Santa Cruz, somos 4 personas'),
    ];
    const v = juzgar({ enviados: 2, mensajes: cargado, conversacionId: 91 });
    assert.strictEqual(v.codigo, 1, `contar el TOTAL de salientes da 0 en falso; salio ${v.codigo}: ${v.texto}`);
  });

  caso('UNA respuesta no alcanza para DOS entrantes seguidos', () => {
    // La persona manda los dos mensajes casi pegados y el bot contesta una sola vez. La unica
    // lectura correcta es que el turno 1 quedo mudo: la respuesta contesta al entrante MAS
    // RECIENTE, no a todos los que haya abiertos. Sin este caso, pegar la saliente a todos los
    // turnos abiertos pasa desapercibido — y esa es justo la forma del bug de la semana.
    const dosSeguidos = [
      m(0, '2026-09-02 12:00:10', 'Hola, quiero informacion sobre el sistema'),
      m(0, '2026-09-02 12:00:12', 'Tengo una clinica dental en Santa Cruz, somos 4 personas'),
      m(1, '2026-09-02 12:00:20', 'una sola respuesta para los dos'),
    ];
    const v = juzgar({ enviados: 2, mensajes: dosSeguidos, conversacionId: 92 });
    assert.strictEqual(v.codigo, 1, `una respuesta no contesta dos entrantes; salio ${v.codigo}: ${v.texto}`);
  });

  caso('un mudo de una vuelta VIEJA no deja el gate rojo para siempre', () => {
    // La conversacion de sonda se reusa, asi que arrastra todo lo anterior. Juzgar el historico
    // entero dejaria el gate rojo eternamente por un turno que fallo una vez, y un gate que no
    // puede volver a verde deja de informar: se lo ignora igual que a uno que nunca falla.
    const historico = [m(0, '2026-09-01 09:00:00', 'vuelta vieja que quedo muda'), ...CONV_48];
    const v = juzgar({ enviados: 2, mensajes: historico, conversacionId: 93 });
    assert.strictEqual(v.codigo, 0, `solo se juzgan los dos turnos de HOY; salio ${v.codigo}: ${v.texto}`);
  });

  caso('mandar menos de dos mensajes es 2, no 1', () => {
    const v = juzgar({ enviados: 1, mensajes: CONV_48, conversacionId: 48 });
    assert.strictEqual(v.codigo, 2, `si la sonda no mando los dos, no se puede culpar al bot; salio ${v.codigo}`);
  });

  caso('conversacion sin ningun mensaje → 2', () => {
    const v = juzgar({ enviados: 2, mensajes: [], conversacionId: 94 });
    assert.strictEqual(v.codigo, 2, `salio ${v.codigo}`);
  });

  caso('el orden lo pone el script, no la base', () => {
    const desordenado = [CONV_48[5], CONV_48[4], CONV_48[3], CONV_48[0]];
    const v = juzgar({ enviados: 2, mensajes: desordenado, conversacionId: 48 });
    assert.strictEqual(v.codigo, 0, `con las filas desordenadas tiene que dar 0 igual; salio ${v.codigo}: ${v.texto}`);
  });

  // ── el boton que abre el chat: donde la sonda funcionaba UNA sola vez ──

  // Los dos DOM son REALES, leidos del widget de produccion el 2026-09-02 con Chromium: el
  // primero es el de una vuelta cualquiera (conversacion ya empezada) y el segundo el de la
  // primerisima (contacto recien creado por el runner de Rails, todavia sin conversacion).
  const DOM_CON_CONVERSACION = [
    { texto: '', clase: 'button transparent compact close-button' },
    { texto: 'Continuar conversación', clase: '' },
  ];
  const DOM_PRIMERA_VEZ = [
    { texto: '', clase: 'button transparent compact close-button' },
    { texto: 'Iniciar conversación', clase: '' },
  ];

  caso('EL BUG: con la conversacion ya empezada el boton dice "Continuar", no "Iniciar"', () => {
    // Este es el caso que la sonda no tenia y que la dejo muerta desde su segunda corrida. Buscar
    // el rotulo "Iniciar" no encuentra nada aca, no se hace clic, `#chat-input` no se monta nunca
    // y el veredicto sale 2 para siempre: el carril deja de poder medirse a si mismo.
    assert.strictEqual(
      elegirArranque(DOM_CON_CONVERSACION),
      1,
      'con "Continuar conversación" hay que clickear igual: es el mismo boton con otro rotulo',
    );
  });

  caso('la primera vuelta ("Iniciar conversación") sigue andando', () => {
    assert.strictEqual(elegirArranque(DOM_PRIMERA_VEZ), 1, 'no se puede arreglar el caso 2 rompiendo el 1');
  });

  caso('el boton de CERRAR no se toca nunca', () => {
    // Clickearlo cierra el panel: la sonda se quedaria sin caja de texto por su propia mano, y el
    // sintoma seria identico al del bug de hoy (timeout esperando `#chat-input`).
    assert.notStrictEqual(elegirArranque(DOM_CON_CONVERSACION), 0, 'el indice 0 es el boton de cerrar');
    assert.strictEqual(elegirArranque([DOM_CON_CONVERSACION[0]]), -1, 'si SOLO esta el de cerrar, no hay a que entrar');
  });

  caso('widget todavia sin montar → -1, que significa ESPERAR y no clickear a ciegas', () => {
    // `goto` vuelve con `domcontentloaded` y ahi el Vue del widget no dibujo nada todavia. Este
    // -1 es la senal de "todavia no", no de "no hay boton": quien llama tiene que reintentar.
    // Sin esa distincion la sonda no clickeaba nunca y moria esperando `#chat-input`.
    assert.strictEqual(elegirArranque([]), -1, 'sin botones no hay nada que clickear');
    assert.strictEqual(elegirArranque(undefined), -1, 'ni siquiera con la lista sin llegar');
  });

  caso('sobrevive a un cambio de idioma o de copy', () => {
    // Se elige por estructura, no por rotulo: si Chatwoot vuelve a cambiarle el texto —ya lo
    // hizo una vez y costo la sonda entera— la sonda no se entera.
    assert.strictEqual(
      elegirArranque([
        { texto: '', clase: 'button transparent compact close-button' },
        { texto: 'Start conversation', clase: '' },
      ]),
      1,
    );
    assert.strictEqual(
      elegirArranque([
        { texto: '', clase: 'button transparent compact close-button' },
        { texto: 'Escribinos', clase: '' },
      ]),
      1,
      'con un solo boton util no hace falta que el rotulo hable de conversaciones',
    );
  });

  caso('con varios botones gana el de la conversacion, no el primero cualquiera', () => {
    assert.strictEqual(
      elegirArranque([
        { texto: '', clase: 'button transparent compact close-button' },
        { texto: 'Ver artículos de ayuda', clase: '' },
        { texto: 'Continuar conversación', clase: '' },
      ]),
      2,
    );
  });

  caso('source_id sale del JWT sin la clave', () => {
    const payload = Buffer.from(JSON.stringify({ source_id: 'abc-123' })).toString('base64url');
    assert.strictEqual(sourceIdDelToken(`x.${payload}.y`), 'abc-123');
    assert.throws(() => sourceIdDelToken('no-es-jwt'), /no parece un JWT/);
    const sinSid = Buffer.from(JSON.stringify({ exp: 1 })).toString('base64url');
    assert.throws(() => sourceIdDelToken(`x.${sinSid}.y`), /no trae source_id/);
  });

  caso('el nombre de la sonda lo excluye del gate `objetivo:visible`', () => {
    // Si esta sonda entrara sin nombre, `objetivo_visible.mjs` la contaria como "un desconocido
    // escribio" y el carril se declararia cumplido por su propia sonda.
    assert.match(NOMBRE_SONDA, /\b(prueba|qa|test)\b/i, `"${NOMBRE_SONDA}" no lo excluye`);
  });

  // ── el arranque sin `/widget`, que es lo que destraba la sonda cuando el cupo esta quemado ──

  caso('el token se saca de entre el ruido del runner de Rails', () => {
    // `rails runner` escupe WARN de deprecacion y INFO de geoip ANTES de lo nuestro. Tomar "la
    // ultima linea" o regexear el bulto entero devuelve ruido con cara de token.
    const salida = [
      "W, [2026-09-02T20:16:16] WARN -- : RubyLLM's legacy acts_as API is deprecated",
      'I, [2026-09-02T20:16:20] INFO -- : [rake ip_lookup:setup] IP_LOOKUP_API_KEY empty.',
      `${MARCA_BOOTSTRAP}aaa.bbb.ccc`,
      'I, [2026-09-02T20:16:21] INFO -- : algo mas despues',
    ].join('\n');
    assert.strictEqual(tokenDeSalida(salida), 'aaa.bbb.ccc');
  });

  caso('si el runner reventó y no imprimio la marca, THROW — no devolver ruido', () => {
    // El modo de falla caro: el runner falla, la sonda guarda una linea de log como si fuera el
    // token, y a partir de ahi cada vuelta muere con un error que no dice nada del origen.
    assert.throws(
      () => tokenDeSalida('W, [..] WARN -- : algo\nI, [..] INFO -- : otra cosa'),
      /no imprimio/i,
      'sin la marca tiene que explotar, no inventar un token',
    );
  });

  caso('la marca con algo que no es un JWT tampoco pasa', () => {
    // `puts` de un `nil` deja la marca vacia, y un source_id suelto no es un JWT. Las dos cosas
    // se guardarian igual de bien y recien se verian al fallar el widget una hora despues.
    assert.throws(() => tokenDeSalida(`${MARCA_BOOTSTRAP}`), /no parece un JWT/);
    assert.throws(() => tokenDeSalida(`${MARCA_BOOTSTRAP}29a25aec-b51b`), /no parece un JWT/);
  });

  caso('el guion nombra a la sonda al CREARLA, no despues', () => {
    // Antes el nombre se ponia al final, por SQL, y solo si la vuelta llegaba viva hasta ahi.
    // Cada arranque fallido dejaba un contacto anonimo mas en el inbox de los leads de verdad.
    const guion = guionBootstrap({ websiteToken: 'TOK123', nombre: NOMBRE_SONDA });
    assert.match(guion, /TOK123/, 'el guion tiene que buscar el inbox por su website_token');
    assert.ok(guion.includes(NOMBRE_SONDA), 'el guion tiene que nombrar la sonda');
    assert.match(guion, new RegExp(MARCA_BOOTSTRAP), 'sin la marca no hay como leer el token');
  });

  // ── El desarme: por que la sonda se envenenaba sola ───────────────────────────────────
  // La sonda reusa UNA conversacion para siempre (el `cw_conversation` evita el cupo de
  // 5/hora). El efecto de borde que nadie vio: esa conversacion ACUMULA estado. El 2026-09-02
  // llego a `handoff_humano` —el bot derivo a Sergio, que es lo correcto— y desde ahi el motor
  // calla POR DISENO (`bot-engine.mjs:459` y el `case "handoff_humano"` de la 591). La sonda
  // midio 0 de 2 y grito "EL BOT SE QUEDO MUDO" con el bot sano: 20:19 y 21:09 del mismo dia
  // habia contestado los dos turnos. Sin esto la sonda miente UNA VEZ POR HORA, para siempre,
  // y cada vuelta del loop se quema en una falsa alarma en vez de mirar la cola.
  caso('derivada a humano → hay que desarmar antes de medir', () => {
    assert.strictEqual(necesitaDesarme({ botStage: 'handoff_humano', humanTookOver: false }), true);
  });

  caso('el takeover humano tambien calla al bot', () => {
    assert.strictEqual(necesitaDesarme({ botStage: 'calificando', humanTookOver: true }), true);
  });

  caso('una conversacion en curso NO se toca', () => {
    // Desarmar de mas tampoco es gratis: resolver reinicia el embudo y borraria el estado que
    // la sonda quiere medir. Solo se desarma lo que efectivamente calla.
    assert.strictEqual(necesitaDesarme({ botStage: 'calificando', humanTookOver: false }), false);
    assert.strictEqual(necesitaDesarme({ botStage: 'nuevo', humanTookOver: false }), false);
  });

  caso('sin fila todavia no hay nada que desarmar', () => {
    assert.strictEqual(necesitaDesarme(null), false);
  });

  // ── El desarme NO alcanzaba, y la sonda lo tapaba contando ────────────────────────────
  // Medido el 2026-09-03 sobre la conversacion 49, con los MISMOS dos mensajes, tres vueltas
  // seguidas del propio loop — y las tres salieron "EL BOT CONTESTO LOS 2", exit 0:
  //
  //   03:04  #1 → "¡Hola! Soy el asistente automatico de Onia. Si, un bot."   ← un desconocido
  //   04:03  #1 → "¿Queres que te reserve para el viernes 4 de septiembre?"   ← ya le ofrece hora
  //   05:03  #1 → "Eso lo tiene que ver Sergio, no yo" (M5, handoff)          ← lo derivo de una
  //
  // La causa: `clearHumanTakeover` (bot-engine.mjs:121) devuelve `bot_stage` a "nuevo" y NADA
  // mas — a proposito, porque para un lead de verdad olvidarle el rubro seria el bug. La fila
  // seguia con `qualification={city,industry,teamSize}`, dos `slots_offered` y
  // `off_script_count=2`, asi que el motor arrancaba cada vuelta con el embudo YA completo y
  // derivaba en el primer turno. La sonda contaba 2 respuestas y daba verde.
  caso('la fila con el embudo cargado NO es la de un desconocido', () => {
    assert.strictEqual(
      esExtrano({
        botStage: 'nuevo',
        humanTookOver: false,
        qualification: { city: 'Santa Cruz', industry: 'dental', teamSize: 4 },
        slotsOffered: [{ key: 'A' }, { key: 'B' }],
        offScriptCount: 2,
      }),
      false,
    );
  });

  caso('la fila en blanco SI es la de un desconocido', () => {
    assert.strictEqual(
      esExtrano({ botStage: 'nuevo', humanTookOver: false, qualification: {}, slotsOffered: [], offScriptCount: 0 }),
      true,
    );
  });

  caso('sin fila todavia, el desconocido es de verdad desconocido', () => {
    // Primera vuelta de una conversacion recien creada: no hay fila, y eso es lo mas extrano
    // que puede haber. Devolver false aca frenaria la sonda para siempre en su primer arranque.
    assert.strictEqual(esExtrano(null), true);
  });

  caso('"nuevo" con hora ya reservada tampoco es un desconocido', () => {
    assert.strictEqual(
      esExtrano({
        botStage: 'nuevo',
        humanTookOver: false,
        qualification: {},
        slotsOffered: [],
        offScriptCount: 0,
        scheduledAt: '2026-09-04T18:00:00Z',
      }),
      false,
    );
  });

  // El otro medio arreglo: el veredicto tiene que LEER la respuesta, no contarla. Con el
  // conteo solo, las tres vueltas de arriba son indistinguibles.
  caso('derivar a un humano en el PRIMER turno es el bug, aunque haya contestado los dos', () => {
    const DERIVADA_EN_EL_PRIMERO = [
      m(0, '2026-09-03 05:03:57', 'Hola, quiero informacion sobre el sistema'),
      m(1, '2026-09-03 05:03:57', 'Eso lo tiene que ver Sergio, no yo — soy un bot y no quiero inventarte una respuesta.'),
      m(0, '2026-09-03 05:04:12', 'Tengo una clinica dental en Santa Cruz, somos 4 personas'),
      m(1, '2026-09-03 05:04:12', 'Te leo, y esto tambien se lo paso a Sergio — sigo siendo el bot.'),
    ];
    const v = juzgar({ enviados: 2, mensajes: DERIVADA_EN_EL_PRIMERO, conversacionId: 49 });
    assert.strictEqual(v.codigo, 1, `deberia ser 1 y fue ${v.codigo}: ${v.texto}`);
    assert.match(v.texto, /primer/i, 'el texto tiene que decir que el problema es el PRIMER turno');
  });

  caso('el saludo de bienvenida en el primer turno sigue siendo verde', () => {
    const SANA = [
      m(0, '2026-09-03 03:04:31', 'Hola, quiero informacion sobre el sistema'),
      m(1, '2026-09-03 03:04:32', '¡Hola! Soy el asistente automatico de Onia. Si, un bot. Y estoy para ayudarte.'),
      m(0, '2026-09-03 03:04:46', 'Tengo una clinica dental en Santa Cruz, somos 4 personas'),
      m(1, '2026-09-03 03:04:47', 'Perfecto, anotado que te dedicas a odontologia, que son 4 personas.'),
    ];
    const v = juzgar({ enviados: 2, mensajes: SANA, conversacionId: 49 });
    assert.strictEqual(v.codigo, 0, `deberia ser 0 y fue ${v.codigo}: ${v.texto}`);
  });

  // Sin esto las huellas se vuelven ciegas en silencio el dia que alguien retoque el copy del
  // bot: el guardia seguiria en verde sin poder detectar nada, que es el peor estado posible
  // para un guardia. Se afirma contra el config REAL del bot, no contra una copia de aca.
  caso('las frases de derivacion siguen existiendo en el config del bot', () => {
    const config = require('node:fs').readFileSync(CONFIG_DEL_BOT, 'utf8');
    const vivo = normalizar(config);
    const perdidas = FRASES_DE_DERIVACION.filter((f) => !vivo.includes(f));
    assert.deepStrictEqual(
      perdidas,
      [],
      `estas frases ya no estan en ${CONFIG_DEL_BOT}: el guardia del primer turno quedo ciego. ` +
        'Actualizar FRASES_DE_DERIVACION con el texto nuevo de M5 / M5_ACUSE / M8_SOPORTE.',
    );
  });

  caso('derivar en el SEGUNDO turno no es el bug: ahi puede ser lo correcto', () => {
    // El prospecto ya conto rubro y tamano; derivar entonces es exactamente lo que el bot
    // tiene que hacer. Marcarlo rojo convertiria a la sonda en el falso rojo de la otra punta.
    const DERIVA_TARDE = [
      m(0, '2026-09-03 03:04:31', 'Hola, quiero informacion sobre el sistema'),
      m(1, '2026-09-03 03:04:32', '¡Hola! Soy el asistente automatico de Onia.'),
      m(0, '2026-09-03 03:04:46', 'Tengo una clinica dental en Santa Cruz, somos 4 personas'),
      m(1, '2026-09-03 03:04:47', 'Eso lo tiene que ver Sergio, no yo — soy un bot y no quiero inventarte nada.'),
    ];
    const v = juzgar({ enviados: 2, mensajes: DERIVA_TARDE, conversacionId: 49 });
    assert.strictEqual(v.codigo, 0, `deberia ser 0 y fue ${v.codigo}: ${v.texto}`);
  });

  let fallados = 0;
  for (const [nombre, fn] of casos) {
    try {
      fn();
      console.log(`  ok  ${nombre}`);
    } catch (e) {
      fallados += 1;
      console.log(`FALLA  ${nombre}\n       ${e.message}`);
    }
  }
  console.log(`\n${casos.length - fallados}/${casos.length} casos en verde`);
  return fallados === 0 ? 0 : 1;
}

// ──────────────────────────────────────── main ────────────────────────────────────────

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

if (process.argv.includes('--self-check')) {
  process.exit(selfCheck());
} else {
  const v = await correr();
  console.log(v.texto);
  process.exit(v.codigo);
}
