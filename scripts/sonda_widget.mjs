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
const ESTADO = process.env.ONIA_SONDA_ESTADO || '/root/.onia/sonda-widget.json';
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
  return {
    codigo: 0,
    texto: `EL BOT CONTESTO LOS ${MENSAJES.length} — conversacion ${conversacionId ?? '?'}: ${detalle}.`,
  };
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

const sql = (q) =>
  execFileSync('docker', ['exec', DB, 'psql', '-U', 'postgres', '-d', 'onia-chatbot', '-tAc', q], {
    encoding: 'utf8',
    timeout: 30_000,
  }).trim();

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

async function correr() {
  const { chromium } = await import('/root/node_modules/playwright/index.mjs');
  const estado = leerEstado();
  const url = estado.cw_conversation
    ? `${HOST}/widget?website_token=${WEBSITE_TOKEN}&cw_conversation=${encodeURIComponent(estado.cw_conversation)}`
    : `${HOST}/widget?website_token=${WEBSITE_TOKEN}`;

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
          'NO SE PUDO MEDIR — HTTP 429 al abrir el widget. Chatwoot limita a 5 aperturas por hora ' +
          'y por IP cuando NO se manda `cw_conversation` (rack_attack.rb). ' +
          (estado.cw_conversation
            ? 'La sonda SI mando su token, asi que el limite se agoto por otra via desde esta IP.'
            : 'La sonda todavia no tiene token guardado: se destraba al empezar la proxima hora en punto, ' +
              'y a partir de ahi entra siempre por la puerta libre.'),
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

    const caja = pagina.locator('#chat-input');
    await caja.waitFor({ state: 'visible', timeout: 30_000 });
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
