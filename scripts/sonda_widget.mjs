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
import { fileURLToPath } from 'node:url';
// El criterio "¿esta conversacion somos nosotros?" se IMPORTA del otro instrumento del carril en
// vez de reescribirse. Son los dos lados de la misma pregunta —`objetivo_visible` la LEE para
// contar desconocidos, la sonda la usa para no ensuciar esa cuenta— y dos copias del criterio es
// exactamente como se separan.
import { esNuestra } from './objetivo_visible.mjs';
// El motor es la fuente de que significa "volver al saludo" y de que campo vive en `raw`.
// Importarlo (en vez de copiar sus listas) es lo que hace que un campo de estado nuevo lo
// blanquee la sonda sola: ver el comentario de `planDeBlanqueo`.
import {
  createState,
  toConversationRow,
  reiniciarConversacionVencida,
} from '../hermes-content/deploy/vps-ops/bot/bot-engine.mjs';
// Los montos legitimos y el normalizador son los MISMOS que usa el guardrail del motor. Se
// importan, no se copian: el dia que cambie la escalera, esta sonda se entera sola. Una lista
// propia de precios es como el bot vivo cotizo Bs 750 durante dias con todo en verde.
import { MONTOS_PERMITIDOS, soloPreciosPublicos } from '../hermes-content/deploy/vps-ops/bot/precios-publicos.mjs';
import { normalize } from '../hermes-content/deploy/vps-ops/bot/guardrails.mjs';

const HOST = process.env.ONIA_WIDGET_URL || 'https://onia-chatbot-chatwoot.hqdqgh.easypanel.host';
const WEBSITE_TOKEN = process.env.ONIA_WIDGET_TOKEN || '9k5i7xnAgCbSse1EZwVChZLw';
const DB = process.env.ONIA_CHATWOOT_DB_CONTAINER || 'onia-chatbot_chatwoot-db';
const APP = process.env.ONIA_CHATWOOT_APP_CONTAINER || 'onia-chatbot_chatwoot';
const ESTADO = process.env.ONIA_SONDA_ESTADO || '/root/.onia/sonda-widget.json';
// La base del MOTOR del bot, que NO es la de Chatwoot: `onia_center.bot_conversations` vive en
// el Supabase self-hosted del VPS. Es donde se ve si el bot esta callado por diseno.
const ESTADO_DB = process.env.ONIA_BOT_ESTADO_DB || 'supabase-db';
const NOMBRE_SONDA = 'Sonda QA carril chatbot';

/**
 * Los mensajes del chequeo. Los dos primeros son los que fija el prompt del loop; el TERCERO
 * existe porque el objetivo del carril nombra el 2.o y el 3.er turno, y el gate horario medía
 * solo dos. La costura (`ONIA_SONDA_GUION`) se escribio el 2026-09-03 y no la corrio NADIE en
 * tres semanas: un env suelto no lo corre nadie, asi que el turno tenia que entrar al default.
 *
 * ⚠️ **El tercer mensaje era `'A'` —elegir el horario— y eso se revirtio el 2026-09-27, con el
 * costo medido.** Elegir un horario no es LEER el bot: es ESCRIBIR en el embudo. El motor marca
 * `demo_agendada` y le manda a Sergio Urcullo un Telegram que dice "DEMO AGENDADA — anotala".
 * Contado con `npm run demo:agendada`: **28 de 29 avisos eran de esta sonda y UNO de un
 * prospecto**. A dos corridas por hora son ~48 por dia sobre el canal que el pidio limpio
 * (2026-09-05), cada uno con una instruccion falsa: no hay ninguna demo que anotar. Una senal
 * real enterrada 28 a 1 esta apagada, y apagarla es exactamente lo que este carril viene a
 * evitar.
 *
 * Lo que se conserva y lo que se cambia: se conserva el 3.er turno, que es donde el bot murio
 * dos veces. Cambia QUE se pregunta ahi. `'¿Cuánto cuesta?'` lo contesta el motor en el mismo
 * estado `esperando_horario` (verificado en el simulador: `[notas] pregunta_precio`, sin pasar a
 * `demo_agendada`) y de paso mide **el precio contra el widget real** — la primera mitad del
 * objetivo del carril, que hasta hoy solo se medía en seco. El juez ya sabe juzgarlo: ver el caso
 * «el precio que el bot vivo contesta hoy → 0».
 *
 * Para medir el cierre de demo en vivo sigue estando la costura, ahora con un motivo para usarla
 * a mano y no cada hora: `ONIA_SONDA_GUION='…|…|A'`.
 */
export const GUION_POR_DEFECTO = Object.freeze([
  'Hola, quiero informacion sobre el sistema',
  'Tengo una clinica dental en Santa Cruz, somos 4 personas',
  '¿Cuánto cuesta?',
]);

/**
 * Guiones que la sonda uso ANTES, para que sus rastros sigan siendo reconocibles.
 *
 * `esRastroDeSonda` exige el guion COMPLETO, asi que el dia que el default crece las sondas ya
 * escritas dejan de calificar y `objetivo_visible.mjs` las vuelve a contar como "un desconocido
 * escribio" — el falso verde que ese predicado existe para evitar, y que no se puede deshacer
 * porque el contacto quedo con nombre anonimo. Pasa con las conversaciones 48 y 50 del inbox 4.
 *
 * Es una lista EXPLICITA y no "cualquier prefijo del guion" a proposito: el sesgo tiene que
 * quedar del lado seguro. Reclamar de menos deja un falso verde viejo; reclamar de mas borraria
 * un lead de verdad. Al crecer el guion otra vez, el guion anterior se agrega ACA.
 */
export const GUIONES_HISTORICOS = Object.freeze([
  Object.freeze([
    'Hola, quiero informacion sobre el sistema',
    'Tengo una clinica dental en Santa Cruz, somos 4 personas',
  ]),
  // El guion del 2026-09-26 al 2026-09-27: el que cerraba la demo con 'A'. Son las 28 demos que
  // `npm run demo:agendada` cuenta como nuestras; sin esta fila vuelven a leerse como prospectos.
  Object.freeze([
    'Hola, quiero informacion sobre el sistema',
    'Tengo una clinica dental en Santa Cruz, somos 4 personas',
    'A',
  ]),
]);

/**
 * El guion, con una COSTURA para medir un turno que el guion fijo no cubre.
 *
 * Nace del 2026-09-03: el gate declaraba el carril cumplido con DOS turnos, y el turno que vale
 * plata es el TERCERO — el prospecto elige uno de los dos horarios. Sin costura no habia forma de
 * llegar hasta ahi sin editar este archivo, o sea sin medir el mismo artefacto que corre cada hora.
 * Mismo patron que `ONIA_RESCATE_CANDIDATOS` en el rescate: seam por env, default = produccion.
 *
 * El default NO cambia: sin `ONIA_SONDA_GUION`, la sonda manda exactamente los dos del prompt.
 */
export function leerGuion(crudo, porDefecto = GUION_POR_DEFECTO) {
  const partes = String(crudo ?? '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
  return partes.length > 0 ? partes : [...porDefecto];
}

export const MENSAJES = leerGuion(process.env.ONIA_SONDA_GUION);

/**
 * ¿Los mensajes de cliente de esta conversacion son EL GUION de la sonda, y nada mas?
 *
 * Nace del 2026-09-13, medido en produccion: la conversacion 48 del inbox 4 (`cold-pond-731`,
 * 2-sep 17:21) son **nuestros dos mensajes textuales**, pero su contacto quedo con el nombre
 * anonimo que Chatwoot le pone a cualquier visitante. Desde ahi es INDISTINGUIBLE de un lead: el
 * inbox 4 es el de los leads de verdad, y los desconocidos reales (`delicate-glitter-674`,
 * `icy-lake-546`) llegan con nombres de la misma forma y tampoco traen telefono. O sea que
 * `objetivo_visible.mjs` —el instrumento que declara cumplido el objetivo del carril— la cuenta
 * como "un desconocido escribio", para siempre. Un falso verde que nada puede deshacer.
 *
 * La marca no puede ponerse al LEER (la bandeja solo entrega `ultimoMensaje`, que es la respuesta
 * del bot): tiene que ponerse en el dato. Por eso la sonda barre sus propios rastros.
 *
 * Se exige el guion COMPLETO y EXACTO, no "contiene": una persona de verdad que siga escribiendo
 * despues del segundo mensaje deja de calificar, y el sesgo queda del lado seguro — reclamar de
 * menos deja un falso verde viejo, reclamar de mas borraria un lead.
 */
export function esRastroDeSonda(mensajesDelCliente, guion = MENSAJES) {
  const limpiar = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
  const mios = Array.isArray(mensajesDelCliente) ? mensajesDelCliente : null;
  if (!mios || mios.length === 0) return false;
  const calza = (esperados) =>
    mios.length === esperados.length &&
    esperados.every((esperado, i) => limpiar(mios[i]) === limpiar(esperado) && limpiar(esperado) !== '');
  if (calza(guion)) return true;
  // Los historicos solo cuentan cuando se esta midiendo con el guion POR DEFECTO. Con
  // `ONIA_SONDA_GUION` puesto, quien lo puso decide el universo entero y no hereda rastros
  // ajenos. Se compara por CONTENIDO porque `leerGuion` devuelve una copia, no la referencia.
  const esElDefault =
    guion.length === GUION_POR_DEFECTO.length &&
    guion.every((m, i) => limpiar(m) === limpiar(GUION_POR_DEFECTO[i]));
  if (!esElDefault) return false;
  return GUIONES_HISTORICOS.some(calza);
}

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
export function juzgar({ enviados, mensajes, conversacionId, guion = MENSAJES }) {
  const esperados = guion.length;
  if (enviados < esperados) {
    return { codigo: 2, texto: `NO SE PUDO MEDIR — la sonda mando ${enviados} de ${esperados} mensajes` };
  }
  if (!Array.isArray(mensajes) || mensajes.length === 0) {
    return { codigo: 2, texto: `NO SE PUDO MEDIR — la conversacion ${conversacionId ?? '?'} no devolvio ni un mensaje` };
  }

  const todos = turnos(mensajes);
  // Solo los turnos de ESTA vuelta: la conversacion de sonda se reusa, asi que arrastra los
  // turnos de todas las anteriores. Juzgar sobre el historico dejaria verde para siempre una
  // sonda que hoy no obtiene respuesta.
  const mios = todos.slice(-esperados);
  if (mios.length < esperados) {
    return { codigo: 2, texto: `NO SE PUDO MEDIR — se esperaban ${esperados} turnos y la base tiene ${mios.length}` };
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
        `${mudos.length} de ${esperados} turnos sin respuesta. Una sola respuesta es EL bug, ` +
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

  // Contestar no es contestar el PRECIO REAL, y esa diferencia es plata. Medido el 2026-09-12: el
  // bot vivo cotizaba "Bs 320 / Bs 750 / Bs 1.500" —se salteaba el plan Crece entero y cobraba
  // aparte un chatbot que el Completo ya incluye— con `simulate.mjs` 3/3 y el gate de precios
  // verde, porque los dos leen el REPO y el bot lee su `knowledge.json`, que se publica a mano y
  // no esta en git. Esta sonda es el unico instrumento que mira el texto que un visitante RECIBIO,
  // asi que es el unico lugar desde donde ese falso verde se ve.
  const ajenos = montosAjenos(mios.flatMap((t) => t.respuestas));
  if (ajenos.length > 0) {
    return {
      codigo: 1,
      texto:
        `EL BOT COTIZO UN PRECIO QUE NO EXISTE — conversacion ${conversacionId ?? '?'}: ${detalle}. ` +
        `Monto(s) ajeno(s) a la fuente unica: ${ajenos.map((monto) => `Bs ${monto}`).join(', ')}. ` +
        'Los legitimos salen de `precios-publicos.mjs` (subscription-plans.ts + pricing.ts). ' +
        'Arreglar el repo NO lo cura: el conocimiento vivo se instala con `deploy-bot.sh`, que ' +
        'corre `webhook-server.sh knowledge` — mirar `npm run bot:precios-vivos`, que mide las ' +
        'DOS capas (la fila del panel le gana al archivo).',
    };
  }

  return {
    codigo: 0,
    texto: `EL BOT CONTESTO LOS ${esperados} — conversacion ${conversacionId ?? '?'}: ${detalle}.`,
  };
}

/**
 * Los montos que el bot cotizo y que NO estan en la fuente unica de precios.
 *
 * Devuelve `[]` cuando no hay ninguna cifra, a proposito: la mayoria de los turnos no cotizan
 * nada, y exigirle un precio al saludo seria un rojo permanente. Lo que se juzga es la cifra que
 * SI aparecio. El criterio es el del guardrail del motor (`soloPreciosPublicos`), no uno propio.
 */
export function montosAjenos(respuestas) {
  const ajenos = [];
  for (const texto of Array.isArray(respuestas) ? respuestas : []) {
    const { intrusos } = soloPreciosPublicos(normalize(String(texto ?? '')));
    for (const monto of intrusos) if (!ajenos.includes(monto)) ajenos.push(monto);
  }
  return ajenos;
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
// dice "resolver significa termine". Resolvemos por Rails para que el camino real se ejecute
// entero — Chatwoot emite `conversation_status_changed`, el adapter lo traduce y el candado se
// suelta. Efecto de borde deseado: cada vuelta verifica ademas que ese desarme sigue vivo.
//
// ⚠️ CORREGIDO el 2026-09-24. Aca decia que `clearHumanTakeover` "devuelve `handoff_humano` a
// `nuevo`", y eso dejo de ser cierto: el producto lo APRETO a proposito (bot-engine.mjs:152 —
// "el stage solo se libera cuando un humano REALMENTE escribio"), porque `handoff_humano` lo
// prende el BOT al derivar y olvidarlo seria perderle el hilo a un lead que nadie atendio.
// La sonda siguio esperando el efecto viejo y se colgo sola: ver el caso del INTERBLOQUEO en el
// self-check. Una premisa del producto citada en un instrumento caduca sin avisar, y un
// instrumento que espera un efecto que ya nadie promete no falla ruidoso: deja de medir.

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

/**
 * ¿Queda algo que el desarme por Rails PUEDA deshacer?
 *
 * Es una pregunta DISTINTA de `necesitaDesarme`, y colapsarlas colgo esta sonda. Una decide si
 * vale la pena tocar ("¿el bot calla aca?"); esta decide si el desarme FUNCIONO, y para eso solo
 * puede exigir lo que el producto promete: soltar el candado del humano (`humanTookOver`).
 *
 * `bot_stage` queda deliberadamente afuera. Si el handoff lo prendio el bot al derivar,
 * `clearHumanTakeover` NO lo mueve —y hace bien—, asi que esperarlo es esperar para siempre.
 * Eso se limpia con `guionBlanqueo`, que es el otro paso y no depende de este.
 */
export function desarmePendiente(fila) {
  if (!fila) return false;
  return fila.humanTookOver === true;
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

// ────────── Y la mitad que faltaba: los campos de estado que NO tienen columna ──────────
//
// Medido el 2026-09-19 sobre la MISMA conversacion 49, esta vez leyendo la fila entera:
//
//   raw = {"inboxId":"4", "outboundSeq":539, "branchAsked":false, "qualifyAsks":0,
//          "handoffAckAt":null, "urgenteAvisadoAt":null, "publicContact":null,
//          "scheduledLabel":"viernes 4 de septiembre, 14:00"}   ← de hace DOS SEMANAS
//
// El arreglo del 3-sep cerro el embudo que vive en COLUMNAS y dejo abierto el que vive en
// `raw`: `toConversationRow` (bot-engine.mjs) manda ahi seis campos de estado sin columna
// propia, y de ellos CINCO son parte de "volver al saludo" — `scheduledLabel`, `branchAsked`,
// `qualifyAsks`, `handoffAckAt`, `urgenteAvisadoAt`. Ninguna de las tres listas de esta sonda
// los nombraba: ni el SELECT de `estadoDelBot`, ni el UPDATE de `guionBlanqueo`, ni el chequeo
// de `esExtrano`. Con `handoffAckAt` o `branchAsked` sucios el motor arranca creyendo que ya
// acuso el traspaso o que ya pregunto la rama, y la sonda firma 2/2 igual: el falso verde de
// siempre, un carril mas adentro.
//
// Por eso ninguna de las tres vuelve a enumerar nada. El producto YA tiene la definicion de
// "volver al saludo" —`reiniciarConversacionVencida`, la que corre sola a los 14 dias— y
// `toConversationRow` YA sabe que campo va a columna y cual va dentro de `raw`. El plan se
// DERIVA de esas dos: el dia que el motor gane un campo de estado, la sonda lo blanquea sin
// que nadie la toque. Una lista a mano aca no falla ruidosa, falla en verde.

/** Un estado con TODOS los campos del reinicio ensuciados, para que la resta los revele. */
function estadoSucio() {
  return createState({
    conversationKey: 'chatwoot:0',
    botStage: 'esperando_horario',
    humanTookOver: true,
    humanTookOverAt: '2026-09-04T18:00:00.000Z',
    handoffAckAt: '2026-09-04T18:00:00.000Z',
    urgenteAvisadoAt: '2026-09-04T18:00:00.000Z',
    slotsOffered: [{ label: 'viernes 4 de septiembre, 14:00', startsAt: '2026-09-04T18:00:00.000Z' }],
    scheduledAt: '2026-09-04T18:00:00.000Z',
    scheduledLabel: 'viernes 4 de septiembre, 14:00',
    calendarEventId: 'evt_viejo',
    offScriptCount: 3,
    qualifyAsks: 2,
    followupStep: 1,
    branchAsked: true,
    optOutAt: '2026-09-04T18:00:00.000Z',
    qualification: { city: 'La Paz', industry: 'odontologia', teamSize: '4' },
  });
}

/**
 * Que hay que dejar en su valor de desconocido, derivado del producto y NO enumerado aca.
 *
 * Son dos aportes y conviene no confundirlos:
 *  - lo que `reiniciarConversacionVencida` limpia: la definicion del producto, la que manda;
 *  - `qualification` y `optOutAt`, que el producto CONSERVA a proposito (el rubro de hace un
 *    mes sigue siendo el rubro, y un "no me escribas" no se olvida nunca) y la sonda necesita
 *    borrar igual, porque su sujeto no es un lead que vuelve sino uno que nunca escribio.
 *    Es la unica diferencia legitima, y por eso va nombrada y aparte.
 */
export function planDeBlanqueo() {
  const sucio = estadoSucio();
  const limpio = { ...reiniciarConversacionVencida(sucio), qualification: {}, optOutAt: null };
  const antes = toConversationRow(sucio);
  const despues = toConversationRow(limpio);
  const cambio = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

  const columnas = {};
  for (const [col, valor] of Object.entries(despues)) {
    if (col === 'raw') continue;
    if (cambio(valor, antes[col])) columnas[col] = valor;
  }
  const raw = {};
  for (const [clave, valor] of Object.entries(despues.raw)) {
    if (cambio(valor, antes.raw[clave])) raw[clave] = valor;
  }
  return { columnas, raw };
}

/** Cita para SQL. Los valores del plan son nulos, booleanos, enteros o texto corto del motor. */
function lit(valor) {
  if (valor === null || valor === undefined) return 'null';
  if (typeof valor === 'boolean') return valor ? 'true' : 'false';
  if (typeof valor === 'number') return String(valor);
  if (typeof valor === 'object') return `'${JSON.stringify(valor).replace(/'/g, "''")}'::jsonb`;
  return `'${String(valor).replace(/'/g, "''")}'`;
}

/**
 * ¿Esta fila es la de alguien que escribe por PRIMERA vez?
 *
 * Es la precondicion de toda la medicion: la sonda dice medir "un desconocido escribe dos veces",
 * y si el motor ya sabe el rubro, el tamano y la ciudad, lo que se mide es otra cosa. Sin fila
 * es el caso mas extrano de todos (conversacion recien creada), no un error.
 *
 * Pregunta por los MISMOS campos que blanquea `guionBlanqueo` —los dos salen de `planDeBlanqueo`—
 * porque un chequeo que mira menos que el blanqueo no puede ver que el blanqueo se quedo corto.
 */
export function esExtrano(fila) {
  if (!fila) return true;
  const { columnas, raw } = planDeBlanqueo();
  const esperado = { ...columnas, ...raw };
  for (const [campo, valorLimpio] of Object.entries(esperado)) {
    if (campo === 'updated_at') continue;
    const actual = fila[COLUMNA_A_ESTADO[campo] || campo];
    if (actual === undefined) continue; // lo que el lector no trajo se juzga aparte, no se absuelve aca
    const vacio = actual === null || actual === false || actual === 0 ||
      (Array.isArray(actual) && actual.length === 0) ||
      (actual && typeof actual === 'object' && !Array.isArray(actual) && Object.keys(actual).length === 0);
    if (vacio && (valorLimpio === null || valorLimpio === false || valorLimpio === 0 ||
      (Array.isArray(valorLimpio) && valorLimpio.length === 0) ||
      (valorLimpio && typeof valorLimpio === 'object' && !Array.isArray(valorLimpio)))) continue;
    if (JSON.stringify(actual) !== JSON.stringify(valorLimpio)) return false;
  }
  return true;
}

/** Nombre de columna → nombre del campo de estado, para leer la fila que trae `estadoDelBot`. */
const COLUMNA_A_ESTADO = Object.freeze({
  bot_stage: 'botStage',
  human_took_over: 'humanTookOver',
  human_took_over_at: 'humanTookOverAt',
  slots_offered: 'slotsOffered',
  scheduled_at: 'scheduledAt',
  calendar_event_id: 'calendarEventId',
  off_script_count: 'offScriptCount',
  followup_step: 'followupStep',
  opt_out_at: 'optOutAt',
});

/**
 * Lo que hay que blanquear para que el motor vuelva a ver a un desconocido.
 *
 * `raw` se MEZCLA (`||`) en vez de pisarse: ahi viven tambien `inboxId`, `publicContact` y
 * `outboundSeq`, que el producto conserva al reiniciar y que la sonda no tiene por que perder
 * (el inbox y el telefono no cambian porque el lead vuelva a escribir).
 */
export function guionBlanqueo(conversacionId) {
  const { columnas, raw } = planDeBlanqueo();
  const sets = Object.entries(columnas).map(([col, valor]) => `${col} = ${lit(valor)}`);
  if (Object.keys(raw).length > 0) sets.push(`raw = coalesce(raw, '{}'::jsonb) || ${lit(raw)}`);
  sets.push('updated_at = now()');
  return (
    `update onia_center.bot_conversations set ${sets.join(', ')} ` +
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
  // `fileURLToPath`, no `.pathname`: en Windows `.pathname` da `/C:/...` y leerlo termina en
  // `C:\C:\...` (ENOENT) — el self-check estuvo rojo en el nodo-casa por esto.
  process.env.ONIA_BOT_CONFIG ||
  fileURLToPath(new URL('../hermes-content/deploy/vps-ops/bot/config.mjs', import.meta.url));

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

/**
 * La OTRA base: el estado del bot (`onia_center`) vive en `supabase-db`, no en la de Chatwoot.
 * Son dos motores distintos, asi que no hay JOIN posible y el sello tiene que ir por separado.
 */
const sqlBot = (q) =>
  execFileSync('docker', ['exec', process.env.ONIA_BOT_DB_CONTAINER || 'supabase-db', 'psql', '-U', 'postgres', '-tAc', q], {
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
  // Las claves las pide `planDeBlanqueo`, no una lista escrita aca: un lector que trae MENOS
  // campos que los que el chequeo juzga lo deja absolviendo por ausencia, que es como
  // `scheduledLabel` sobrevivio dos semanas dentro de `raw` sin que nada se pusiera rojo.
  const { columnas, raw } = planDeBlanqueo();
  const pares = [];
  for (const col of Object.keys(columnas)) {
    if (col === 'updated_at') continue;
    pares.push(`'${COLUMNA_A_ESTADO[col] || col}', ${col}`);
  }
  for (const clave of Object.keys(raw)) pares.push(`'${clave}', raw -> '${clave}'`);
  pares.push("'qualification', qualification");
  const fila = psqlMotor(
    `select json_build_object(${pares.join(', ')})::text ` +
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
export function dejarComoExtrano(conversacionId, deps) {
  const falta = ['leer', 'resolver', 'blanquear'].filter((k) => typeof deps?.[k] !== 'function');
  if (falta.length) {
    // Misma doctrina que `cerrarSujeto`: sin default, porque el default de una dep inyectable es
    // el efecto real y un caso que se la olvide correria `rails runner` contra produccion EN VERDE.
    throw new Error(`dejarComoExtrano exige { leer, resolver, blanquear }; falta: ${falta.join(', ')}`);
  }
  // El desarme se INTENTA, pero su resultado no puede saltearse el blanqueo: el blanqueo es el
  // UNICO que saca del `handoff_humano` que prendio el bot. Con esto detras de un `&&`, la sonda
  // paso a "NO SE PUDO MEDIR" en cada vuelta y encima acusaba al blanqueo, que nunca corria.
  const desarmado = !necesitaDesarme(deps.leer(conversacionId)) || deps.resolver(conversacionId);
  deps.blanquear(conversacionId);
  // El veredicto sale de la fila DESPUES del blanqueo, no de si el desarme anduvo: lo que
  // habilita la medicion es que el sujeto sea un desconocido, venga por donde venga.
  return desarmado && esExtrano(deps.leer(conversacionId));
}

/**
 * Devuelve la conversacion al bot resolviendola, que es lo que el producto define como
 * "termine" (`clearHumanTakeover`). Va por Rails a proposito: asi se ejecuta el camino real
 * —Chatwoot emite `conversation_status_changed`, el adapter lo traduce— y cada vuelta verifica
 * de paso que ese desarme sigue vivo. Escribir la base a mano lo daria por bueno sin probarlo.
 *
 * ⚠️ ESTA linea es la que deja el rastro "Conversation was marked resolved by system due to
 * 0 minutes of inactivity" en el historial. `rails runner` no tiene `Current.user` ni
 * `Current.contact`, y Chatwoot firma "by system" toda resolucion sin ellos; el "0 minutes"
 * sale de `auto_resolve_after || 0`, que es 0 porque el barrendero por inactividad esta
 * APAGADO (`accounts.settings` = `{}`, y sin el los scopes `resolvable_*` devuelven `none`).
 * O sea: el cartel parece un auto-resolve de Chatwoot y lo escribimos nosotros. Ya costo
 * media vuelta de este carril el 2026-09-04 y una entrada equivocada en la memoria
 * compartida. Si aparece en una conversacion, mirar primero si el contacto es una sonda
 * ("Sonda QA...") antes de tocar la configuracion de Chatwoot: configurar
 * `auto_resolve_after` para "arreglarlo" ENCIENDE un barrendero que hoy no corre.
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
  // El webhook viaja por Sidekiq: es rapido pero no instantaneo. Se espera al EFECTO, no a un
  // plazo fijo — y el efecto es el que el producto promete (`desarmePendiente`: soltar el candado
  // del humano), NO que el stage vuelva a hablar. Esperar el stage era esperar lo que
  // `clearHumanTakeover` decidio no hacer, y agotaba las 10 vueltas para devolver false.
  for (let i = 0; i < 10; i += 1) {
    if (!desarmePendiente(estadoDelBot(conversacionId))) return true;
    execFileSync('sleep', ['2']);
  }
  return false;
}

/**
 * Cierra la conversacion de la sonda AL TERMINAR. Siempre, gane o pierda la medicion.
 *
 * POR QUE EXISTE (medido el 2026-09-12 sobre el inbox 4, el de los leads REALES):
 *
 *     49 | 2026-09-12 | Sonda QA carril chatbot   ← nosotros, status=0 (abierta)
 *     48 | 2026-09-02 | cold-pond-731             ← desconocido de verdad
 *     40 | 2026-08-29 | lively-night-474
 *     36 | 2026-08-27 | icy-lake-546
 *     34 | 2026-08-24 | delicate-glitter-674
 *
 * La sonda corre cada 30 min y Chatwoot ordena por actividad, asi que su conversacion
 * encabezaba la bandeja **para siempre**, empujando abajo a los cuatro desconocidos que este
 * carril existe para que se vean. El objetivo del carril es "que un desconocido escriba y esa
 * conversacion SE VEA en la bandeja": el instrumento estaba tapando justo lo que mide.
 *
 * Habia limpieza, pero solo al ARRANCAR y solo a medias: `dejarComoExtrano` resolvia por Rails
 * unicamente si `necesitaDesarme` era true, o sea si el bot habia quedado en `handoff_humano`.
 * En la vuelta normal el bot queda en `nuevo`, `necesitaDesarme` da false, no se resolvia nada
 * y la conversacion quedaba abierta. Preparar el sujeto no es lo mismo que devolverlo.
 *
 * `resolver` va INYECTADO y sin default: el default de una dep inyectable es el efecto real, y
 * un caso que se lo olvide correria el `docker exec … rails runner` contra produccion y pasaria
 * verde. Sin la dep, esto tira.
 */
/**
 * Barre los rastros que dejo la propia sonda en el inbox de los leads reales y los MARCA como
 * nuestros. Corre ANTES de medir, no despues: el rastro nace cuando una corrida muere entre el
 * primer mensaje y el `update contacts set name` del final, asi que la corrida que lo dejo no
 * puede ser la que lo limpie — es la SIGUIENTE.
 *
 * Reclama solo lo que cumple las DOS: que el criterio compartido con `objetivo_visible.mjs`
 * todavia NO lo reconozca como nuestro, y que sus mensajes de cliente sean el guion exacto. Las
 * dos preguntas vienen de fuentes distintas (nombre/telefono una, texto la otra), asi que el
 * gate no se puede contestar solo.
 *
 * Un fallo barriendo NO tumba la medicion: avisa y sigue. La medicion es lo que el carril
 * necesita; tragarse el aviso, en cambio, es como nacio este bug.
 */
export function reclamarRastros({ listar, renombrar, avisar = console.error } = {}) {
  if (typeof listar !== 'function' || typeof renombrar !== 'function') {
    throw new TypeError(
      'reclamarRastros() exige `listar` y `renombrar` inyectados: un default al efecto real haria ' +
        'que un caso distraido renombre contactos en la Chatwoot de produccion y pase en verde.',
    );
  }
  let candidatas;
  try {
    candidatas = listar();
  } catch (e) {
    avisar(`AVISO — no se pudo barrer los rastros de la sonda: ${e.message}`);
    return [];
  }
  const reclamadas = [];
  for (const c of Array.isArray(candidatas) ? candidatas : []) {
    if (esNuestra(c)) continue;
    if (!esRastroDeSonda(c?.mensajesDelCliente)) continue;
    try {
      renombrar(c.id);
      reclamadas.push(c.id);
    } catch (e) {
      avisar(`AVISO — la conversacion ${c?.id} es un rastro de la sonda y sigue contando como lead: ${e.message}`);
    }
  }
  return reclamadas;
}

export function cerrarSujeto({ resolver, conversacion, avisar = console.error } = {}) {
  if (typeof resolver !== 'function' || typeof conversacion !== 'function') {
    throw new TypeError(
      'cerrarSujeto() exige `resolver` y `conversacion` inyectados: un default al efecto real ' +
        'haria que un caso distraido escriba en la Chatwoot de produccion y pase en verde.',
    );
  }
  let id;
  try {
    id = conversacion();
  } catch (e) {
    avisar(`AVISO — no se pudo saber cual conversacion cerrar: ${e.message}`);
    return false;
  }
  // Sin conversacion todavia (primerisima vuelta que murio antes del bootstrap) no hay nada que
  // devolver. Cerrar "por las dudas" con un id adivinado resolveria la conversacion de un lead.
  if (!id) return false;
  try {
    resolver(id);
    return true;
  } catch (e) {
    // Un fallo de limpieza NO puede convertir un veredicto valido en un crash: la medicion ya
    // esta hecha y es lo que el carril necesita. Pero tampoco se traga en silencio, porque el
    // sintoma de tragarselo es exactamente el bug que esto arregla.
    avisar(`AVISO — la conversacion ${id} quedo ABIERTA en la bandeja de leads reales: ${e.message}`);
    return false;
  }
}

/**
 * Mide y despues devuelve la bandeja como estaba. El cierre va en `finally` a proposito: tiene
 * que correr con veredicto 0, con veredicto 1 (bot mudo) y tambien si la medicion TIRA — en los
 * tres casos la sonda ya escribio en el inbox de leads reales y ya reabrio su conversacion.
 *
 * Las dos deps son obligatorias por el mismo motivo que en `cerrarSujeto`.
 */
export async function correrConCierre({ medir, cerrar } = {}) {
  if (typeof medir !== 'function' || typeof cerrar !== 'function') {
    throw new TypeError('correrConCierre() exige `medir` y `cerrar` inyectados.');
  }
  try {
    return await medir();
  } finally {
    cerrar();
  }
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

/** El inbox de la sonda, DERIVADO del website token — no un `4` escrito a mano. */
function inboxDeLaSonda() {
  const id = sql(
    `select i.id from inboxes i join channel_web_widgets w on w.id = i.channel_id ` +
      `and i.channel_type = 'Channel::WebWidget' where w.website_token = '${WEBSITE_TOKEN.replace(/'/g, "''")}';`,
  );
  if (!id) throw new Error(`no hay inbox para el website_token ${WEBSITE_TOKEN}`);
  return Number(id);
}

/**
 * Las conversaciones del inbox de la sonda con sus mensajes de cliente, para el barrido.
 * Los saltos de linea se aplanan EN EL SQL: `psql -tAc` separa filas por `\n`, asi que un mensaje
 * multilinea parte la fila y corre los campos.
 */
function candidatasABarrer() {
  const inbox = inboxDeLaSonda();
  const filas = sql(
    `select c.id || E'\\x02' || coalesce(ct.name, '') || E'\\x02' || coalesce(ct.phone_number, '') ` +
      `|| E'\\x02' || coalesce(string_agg(replace(m.content, E'\\n', ' '), E'\\x01' order by m.id), '') ` +
      `from conversations c join contacts ct on ct.id = c.contact_id ` +
      `left join messages m on m.conversation_id = c.id and m.message_type = ${ENTRANTE} ` +
      `where c.inbox_id = ${inbox} group by c.id, ct.name, ct.phone_number order by c.id;`,
  );
  return filas
    .split('\n')
    .filter(Boolean)
    .map((linea) => {
      const [id, contacto, telefono, cuerpo] = linea.split('\x02');
      return {
        id: Number(id),
        contacto,
        telefono: telefono || null,
        mensajesDelCliente: cuerpo ? cuerpo.split('\x01') : [],
      };
    });
}

/**
 * Las DOS sentencias que sellan una conversacion como nuestra — una por cada base que guarda la
 * identidad. Pura y exportada para que el caso pueda exigir las dos sin tocar produccion.
 *
 * LA IDENTIDAD VIVE EN DOS LADOS Y SOLO UNO LO MIRA EL PRODUCTO. Chatwoot tiene el nombre
 * VIGENTE (`contacts.name`, mutable), pero los cuatro barridos del embudo deciden con
 * `esConversacionNuestra()`, que lee `onia_center.bot_conversations.display_name` — una FOTO del
 * nombre tomada cuando el bot creo la fila, y que nadie vuelve a tocar. Como esta sonda se
 * renombra DESPUES de escribir sus mensajes, entre las dos cosas hay una carrera, y perderla deja
 * una sonda indistinguible de un lead para el circuito que ACTUA.
 *
 * Ya se perdio DOS veces, medido el 2026-09-18 contra produccion: `chatwoot:48` y `chatwoot:50`
 * eran "Sonda QA carril chatbot" en Chatwoot y `cold-pond-731` / `quiet-shape-612` del lado del
 * bot. `contarColgadas` los reportaba como dos leads perdidos hace 15 dias — ruido que apaga el
 * instrumento — y, con el circuito en `emit` desde el 2026-09-17, una sonda cuyo
 * `last_inbound_at` cae dentro de la ventana de 20 h recibe el follow-up M3 en el inbox 4, el de
 * leads REALES. No alcanza con sellar antes de trabajar: la fila del bot todavia no existe
 * cuando la sonda arranca, asi que el sello llega siempre despues y tiene que alcanzar a las dos.
 */
export function sentenciasDeSellado(conversacionId, nombre = NOMBRE_SONDA) {
  const id = Number(conversacionId);
  const seguro = String(nombre).replace(/'/g, "''");
  return [
    {
      base: 'chatwoot',
      sql:
        `update contacts set name = '${seguro}' where id = ` +
        `(select contact_id from conversations where id = ${id});`,
    },
    {
      // `conversation_key` es la clave con la que el bot cruza las dos bases (`chatwoot:<id>`).
      base: 'bot',
      sql:
        `update onia_center.bot_conversations set display_name = '${seguro}' ` +
        `where conversation_key = 'chatwoot:${id}' and coalesce(display_name, '') <> '${seguro}';`,
    },
  ];
}

/** Le pone el nombre de la sonda a una conversacion que resulto ser un rastro, en las DOS bases. */
function marcarComoNuestra(conversacionId) {
  for (const { base, sql: q } of sentenciasDeSellado(conversacionId)) {
    if (base === 'chatwoot') sql(q);
    else sqlBot(q);
  }
}

async function correr() {
  // BARRER LO PROPIO ANTES DE MEDIR (ver `reclamarRastros`): el rastro lo deja una corrida que
  // murio a mitad, asi que solo la SIGUIENTE puede limpiarlo.
  const reclamadas = reclamarRastros({ listar: candidatasABarrer, renombrar: marcarComoNuestra });
  if (reclamadas.length > 0) {
    console.error(
      `AVISO — ${reclamadas.length} rastro(s) de esta sonda estaban contando como leads reales en ` +
        `\`objetivo:visible\` y quedaron marcados como nuestros: ${reclamadas.join(', ')}`,
    );
  }

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
    const comoExtrano = (id) =>
      dejarComoExtrano(id, {
        leer: estadoDelBot,
        resolver: desarmar,
        blanquear: (n) => psqlMotor(guionBlanqueo(n)),
      });
    if (previa && !comoExtrano(previa)) {
      // Fallar hacia "no se pudo medir" (2) y NUNCA hacia "el bot esta mudo" (1): no medir
      // no es estar roto, y confundirlos es como este carril perdio una vuelta entera.
      const fila = estadoDelBot(previa);
      return {
        codigo: 2,
        texto:
          `NO SE PUDO MEDIR — la conversacion ${previa} no quedo como la de un desconocido: ` +
          `${JSON.stringify(fila)}. El blanqueo YA corrio (desde el 2026-09-24 corre aunque el ` +
          'desarme falle), asi que lo que sobrevivio lo esta REESCRIBIENDO alguien: mirar si el ' +
          'webhook del `resolved!` llego tarde y piso la fila, y si `planDeBlanqueo` cubre el ' +
          'campo que quedo cargado (deriva de `reiniciarConversacionVencida`: un campo de estado ' +
          'que el producto no reinicie no lo blanquea nadie).',
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

async function selfCheck() {
  const assert = require('node:assert');
  const casos = [];
  const caso = (nombre, fn) => casos.push([nombre, fn]);
  const m = (message_type, created_at, content) => ({ message_type, created_at, content });

  // Los casos de `juzgar` de abajo son filas REALES de produccion de cuando el guion tenia DOS
  // turnos, y siguen valiendo tal cual: lo que afirman (mudo en el 2.o, precio ajeno, derivacion
  // en el 1.er turno) no depende de cuantos turnos mida el guion de hoy. Se les pasa su guion en
  // vez de reescribir los fixtures — si leyeran el global, subir el default los volveria "NO SE
  // PUDO MEDIR" en bloque y el carril perderia de golpe los tres falsos verdes que cubren.
  const DOS_TURNOS = GUIONES_HISTORICOS[0];

  // La costura del guion. Lo que se afirma NO es que se pueda cambiar el guion: es que el
  // default siga siendo EXACTAMENTE el del prompt del loop. Una costura que corre el default
  // convierte el gate horario en otra medicion sin que nadie se entere.
  caso('sin la variable, el guion es el del prompt', () => {
    assert.deepStrictEqual(leerGuion(undefined), [...GUION_POR_DEFECTO]);
    assert.deepStrictEqual(leerGuion(''), [...GUION_POR_DEFECTO]);
    assert.deepStrictEqual(leerGuion('   |  | '), [...GUION_POR_DEFECTO]);
  });
  caso('la costura parte por | y limpia los bordes', () => {
    assert.deepStrictEqual(leerGuion(' uno | dos |tres '), ['uno', 'dos', 'tres']);
  });
  caso('el guion por defecto es inmutable', () => {
    const copia = leerGuion(undefined);
    copia.push('cuarto mensaje');
    assert.strictEqual(GUION_POR_DEFECTO.length, 3, 'mutar lo devuelto no puede tocar el default');
  });

  // EL COSTO QUE NADIE CONTO al meter el tercer turno en el default (2026-09-26): elegir un
  // horario no es leer, es ESCRIBIR en el embudo. El motor marca `demo_agendada` y le manda a
  // Sergio Urcullo un Telegram que dice "DEMO AGENDADA — anotala". Medido el 2026-09-27 con
  // `npm run demo:agendada`: 28 de 29 avisos eran de esta sonda y UNO de un prospecto. A dos
  // corridas por hora eso son ~48 por dia sobre el canal que el pidio limpio, cada uno con una
  // instruccion FALSA: no hay nada que anotar. Una senal real enterrada 28 a 1 esta apagada.
  //
  // Por que el default y no un env: un interruptor suelto no lo corre nadie (es el mismo motivo
  // por el que el tercer turno entro al default). El tercer turno se SIGUE midiendo — que es lo
  // que valia — con una pregunta que el bot contesta en el mismo estado sin cerrar la demo.
  caso('el guion por defecto NO cierra una demo en el inbox de leads reales', () => {
    const eligeHorario = (m) => /^[ab]$/i.test(String(m).trim());
    const culpable = GUION_POR_DEFECTO.find(eligeHorario);
    assert.strictEqual(
      culpable,
      undefined,
      `el guion manda "${culpable}", que el motor lee como elegir horario: escribe demo_agendada ` +
        'y dispara un "DEMO AGENDADA — anotala" falso a Sergio Urcullo en cada corrida',
    );
  });
  caso('el tercer turno se sigue midiendo, y ahora verifica el precio en vivo', () => {
    assert.strictEqual(GUION_POR_DEFECTO.length, 3, 'el 3.er turno es donde el bot murio dos veces');
    assert.match(
      GUION_POR_DEFECTO[2],
      /cu[aá]nto|precio|cuesta/i,
      'el 3.er turno pregunta el precio: lo unico del objetivo que solo se medía en seco',
    );
  });
  caso('el guion viejo sigue reconociendose como rastro nuestro', () => {
    // Si no, `objetivo_visible.mjs` vuelve a contar las conversaciones ya escritas como "un
    // desconocido escribio" — el falso verde que `esRastroDeSonda` existe para evitar, y que no
    // se puede deshacer porque el contacto quedo con nombre anonimo.
    const conTresYLaLetra = GUIONES_HISTORICOS.some(
      (g) => g.length === 3 && /^[ab]$/i.test(String(g[2]).trim()),
    );
    assert.ok(conTresYLaLetra, 'el guion que se acaba de jubilar tiene que quedar en GUIONES_HISTORICOS');
  });

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
    const v = juzgar({ enviados: 2, guion: DOS_TURNOS, mensajes: CONV_48, conversacionId: 48 });
    assert.strictEqual(v.codigo, 0, `deberia ser 0 y fue ${v.codigo}: ${v.texto}`);
  });

  caso('el bug real: mudo en el SEGUNDO mensaje → 1', () => {
    const v = juzgar({ enviados: 2, guion: DOS_TURNOS, mensajes: CONV_47, conversacionId: 47 });
    assert.strictEqual(v.codigo, 1, `el bug de la semana tiene que salir 1 y salio ${v.codigo}: ${v.texto}`);
    assert.match(v.texto, /1 de 2 turnos sin respuesta/);
  });

  // ── el precio que el bot DICE ──
  // El texto de la respuesta vieja es el REAL que el bot vivo servia el 2026-09-12 (esta citado
  // textual en la cabecera de `precios-vivos.mjs`, leido de su `knowledge.json` dentro del
  // contenedor). Inventar uno mediria el caso que uno previo; este ya le llego a leads.
  const PRECIO_VIEJO =
    'Te los paso derecho, son publicos: el sistema arranca en Bs 320 al mes con el plan Basico, ' +
    'Bs 750 el Profesional y Bs 1.500 el Completo. El chatbot de WhatsApp va aparte, Bs 390 al mes.';
  // Y este es el que el bot vivo contesto por el widget el 2026-09-24 (conversacion 49, mensaje
  // 1709), medido leyendo `messages` de Chatwoot. Es el que NO puede dar rojo.
  const PRECIO_DE_HOY =
    'Te los paso derecho, son publicos: el sistema arranca en Bs 320 al mes con el plan Basico, ' +
    'Bs 550 el Crece, Bs 890 el Profesional y Bs 1.290 el Completo, que ya trae el chatbot de ' +
    'WhatsApp adentro. En el Basico, el Crece y el Profesional el chatbot va aparte, Bs 390 al mes.';
  const conPrecio = (respuesta) => [
    m(0, '2026-09-24 21:00:00', 'Hola, quiero informacion sobre el sistema'),
    m(1, '2026-09-24 21:00:05', '¡Hola! Soy el asistente automatico de Onia.'),
    m(0, '2026-09-24 21:00:20', 'Cuanto cuesta el sistema al mes?'),
    m(1, '2026-09-24 21:00:25', respuesta),
  ];

  caso('un monto que ya no existe en la escalera → 1, aunque haya contestado los dos', () => {
    const v = juzgar({ enviados: 2, guion: DOS_TURNOS, mensajes: conPrecio(PRECIO_VIEJO), conversacionId: 49 });
    assert.strictEqual(v.codigo, 1, `cotizar Bs 750 tiene que salir 1 y salio ${v.codigo}: ${v.texto}`);
    assert.match(v.texto, /750/, 'el veredicto tiene que NOMBRAR el monto ajeno');
    assert.match(v.texto, /1500|1\.500/, 'y los dos, no solo el primero');
  });

  caso('el precio que el bot vivo contesta hoy → 0', () => {
    const v = juzgar({ enviados: 2, guion: DOS_TURNOS, mensajes: conPrecio(PRECIO_DE_HOY), conversacionId: 49 });
    assert.strictEqual(v.codigo, 0, `la escalera vigente no puede dar rojo y dio ${v.codigo}: ${v.texto}`);
  });

  caso('un turno sin ninguna cifra no se juzga por precio', () => {
    // Sin esto el gate exigiria que toda respuesta cotice, y el saludo no cotiza nada.
    assert.deepStrictEqual(montosAjenos(['Perfecto, anotado que te dedicas a odontologia']), []);
    assert.deepStrictEqual(montosAjenos([]), []);
  });

  caso('los montos ajenos se derivan de la FUENTE, no de una lista propia', () => {
    // Si alguien agrega un monto a `precios-publicos.mjs` que no esta en la fuente, lo pone rojo
    // su propio gate; lo que esta sonda no puede hacer es tener su copia y divergir en silencio.
    assert.ok(MONTOS_PERMITIDOS.has(890) && MONTOS_PERMITIDOS.has(390), 'la escalera vigente');
    assert.ok(!MONTOS_PERMITIDOS.has(750), 'Bs 750 salio de la escalera el 2026-09-12');
  });

  caso('los enlatados del pre-chat (type 3) NO son una respuesta', () => {
    const solo3 = [
      m(0, '2026-09-02 10:00:00', 'Hola, quiero informacion sobre el sistema'),
      m(3, '2026-09-02 10:00:00', '¡Hola! Soy el asistente automatico de Onia.'),
      m(0, '2026-09-02 10:00:15', 'Tengo una clinica dental en Santa Cruz, somos 4 personas'),
      m(3, '2026-09-02 10:00:15', 'Dale al equipo una forma de llegar a ti.'),
    ];
    const v = juzgar({ enviados: 2, guion: DOS_TURNOS, mensajes: solo3, conversacionId: 90 });
    assert.strictEqual(v.codigo, 1, `type 3 no puede contar como respuesta; salio ${v.codigo}: ${v.texto}`);
  });

  caso('dos respuestas al PRIMER turno y cero al segundo → 1, no 0', () => {
    const cargado = [
      m(0, '2026-09-02 11:00:00', 'Hola, quiero informacion sobre el sistema'),
      m(1, '2026-09-02 11:00:05', 'primera'),
      m(1, '2026-09-02 11:00:06', 'segunda'),
      m(0, '2026-09-02 11:00:15', 'Tengo una clinica dental en Santa Cruz, somos 4 personas'),
    ];
    const v = juzgar({ enviados: 2, guion: DOS_TURNOS, mensajes: cargado, conversacionId: 91 });
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
    const v = juzgar({ enviados: 2, guion: DOS_TURNOS, mensajes: dosSeguidos, conversacionId: 92 });
    assert.strictEqual(v.codigo, 1, `una respuesta no contesta dos entrantes; salio ${v.codigo}: ${v.texto}`);
  });

  caso('un mudo de una vuelta VIEJA no deja el gate rojo para siempre', () => {
    // La conversacion de sonda se reusa, asi que arrastra todo lo anterior. Juzgar el historico
    // entero dejaria el gate rojo eternamente por un turno que fallo una vez, y un gate que no
    // puede volver a verde deja de informar: se lo ignora igual que a uno que nunca falla.
    const historico = [m(0, '2026-09-01 09:00:00', 'vuelta vieja que quedo muda'), ...CONV_48];
    const v = juzgar({ enviados: 2, guion: DOS_TURNOS, mensajes: historico, conversacionId: 93 });
    assert.strictEqual(v.codigo, 0, `solo se juzgan los dos turnos de HOY; salio ${v.codigo}: ${v.texto}`);
  });

  caso('mandar menos de dos mensajes es 2, no 1', () => {
    const v = juzgar({ enviados: 1, guion: DOS_TURNOS, mensajes: CONV_48, conversacionId: 48 });
    assert.strictEqual(v.codigo, 2, `si la sonda no mando los dos, no se puede culpar al bot; salio ${v.codigo}`);
  });

  caso('conversacion sin ningun mensaje → 2', () => {
    const v = juzgar({ enviados: 2, guion: DOS_TURNOS, mensajes: [], conversacionId: 94 });
    assert.strictEqual(v.codigo, 2, `salio ${v.codigo}`);
  });

  caso('el orden lo pone el script, no la base', () => {
    const desordenado = [CONV_48[5], CONV_48[4], CONV_48[3], CONV_48[0]];
    const v = juzgar({ enviados: 2, guion: DOS_TURNOS, mensajes: desordenado, conversacionId: 48 });
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

  // ── El INTERBLOQUEO: la sonda esperaba un efecto que el producto ya no promete ──────────
  // Medido el 2026-09-24 sobre la conversacion 49: `NO SE PUDO MEDIR` en cada vuelta, con el
  // bot sano y con el blanqueo sano — porque el blanqueo NUNCA CORRIA.
  //
  // `clearHumanTakeover` se APRETO a proposito (bot-engine.mjs:152, "el stage solo se libera
  // cuando un humano REALMENTE escribio"): si el handoff lo prendio el BOT al derivar,
  // `humanTookOver` es false y `bot_stage` se queda en `handoff_humano` para siempre. Pero
  // `desarmar` seguia esperando el efecto viejo —`necesitaDesarme` en false, que incluye el
  // stage— asi que agotaba sus 10 vueltas de 2 s y devolvia false; y `dejarComoExtrano` tenia
  // ese false detrás de un `&&`, asi que salia ANTES del blanqueo. El mensaje de error remataba
  // mandando a "revisar `guionBlanqueo`", que era lo unico que no habia corrido.
  //
  // Son dos preguntas distintas y estaban colapsadas en una: "¿el bot calla aca?" (para decidir
  // si vale la pena tocar) NO es "¿que promete deshacer el desarme?" (para decidir si funciono).
  caso('el desarme por Rails solo promete lo que clearHumanTakeover promete', () => {
    // Lo que el producto SI deshace al resolver: el candado del humano.
    assert.strictEqual(desarmePendiente({ botStage: 'calificando', humanTookOver: true }), true);
    // Lo que el producto deliberadamente NO deshace: el stage que prendio el bot al derivar.
    // Exigirlo es esperar para siempre, que es como esta sonda se colgo.
    assert.strictEqual(desarmePendiente({ botStage: 'handoff_humano', humanTookOver: false }), false);
    assert.strictEqual(desarmePendiente(null), false);
  });

  caso('el blanqueo corre AUNQUE el desarme falle: es el unico que limpia el stage', () => {
    // `guionBlanqueo` deriva de `reiniciarConversacionVencida`, que pone `botStage: "nuevo"` sin
    // condicion. Es el unico camino que saca del `handoff_humano` que prendio el bot, asi que un
    // desarme fallido no puede saltearlo: ahi se pierde la medicion entera.
    const llamadas = [];
    const sucia = { botStage: 'handoff_humano', humanTookOver: false, qualification: { city: 'Santa Cruz' } };
    const veredicto = dejarComoExtrano(49, {
      leer: () => sucia,
      resolver: () => { llamadas.push('resolver'); return false; },
      blanquear: () => { llamadas.push('blanquear'); },
    });
    assert.ok(llamadas.includes('blanquear'), 'el blanqueo tiene que correr aunque el desarme falle');
    assert.strictEqual(veredicto, false, 'con la fila todavia sucia el veredicto es "no se pudo medir"');
  });

  caso('dejarComoExtrano exige sus deps: un default aca escribe en produccion', () => {
    // Misma doctrina que `cerrarSujeto`: el default de una dep inyectable es el efecto real, y un
    // caso que se la olvide correria `docker exec … rails runner` contra produccion EN VERDE.
    assert.throws(() => dejarComoExtrano(49), /exige/);
    assert.throws(() => dejarComoExtrano(49, { leer: () => null }), /exige/);
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
    const v = juzgar({ enviados: 2, guion: DOS_TURNOS, mensajes: DERIVADA_EN_EL_PRIMERO, conversacionId: 49 });
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
    const v = juzgar({ enviados: 2, guion: DOS_TURNOS, mensajes: SANA, conversacionId: 49 });
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
    const v = juzgar({ enviados: 2, guion: DOS_TURNOS, mensajes: DERIVA_TARDE, conversacionId: 49 });
    assert.strictEqual(v.codigo, 0, `deberia ser 0 y fue ${v.codigo}: ${v.texto}`);
  });

  // ── el blanqueo alcanza a TODO lo que el producto llama "volver al saludo" ──
  //
  // EL BUG (medido el 2026-09-19 en la fila viva de la conversacion 49): las tres listas de la
  // sonda enumeraban solo columnas, y cinco campos del reinicio viven dentro de `raw`. La fila
  // llevaba `scheduledLabel:"viernes 4 de septiembre, 14:00"` de dos semanas antes y la sonda
  // firmaba 2/2. El caso no fija una lista: le pregunta al motor cual es el universo.

  caso('el blanqueo cubre TODO lo que el producto limpia al volver al saludo', () => {
    const sucio = estadoSucio();
    const limpio = reiniciarConversacionVencida(sucio);
    const antes = toConversationRow(sucio);
    const despues = toConversationRow(limpio);
    const sql = guionBlanqueo(49);

    const faltan = [];
    for (const [col, valor] of Object.entries(despues)) {
      if (col === 'raw') continue;
      if (JSON.stringify(valor) !== JSON.stringify(antes[col]) && !sql.includes(`${col} =`)) faltan.push(col);
    }
    for (const [clave, valor] of Object.entries(despues.raw)) {
      if (JSON.stringify(valor) !== JSON.stringify(antes.raw[clave]) && !sql.includes(clave)) faltan.push(`raw.${clave}`);
    }
    assert.deepStrictEqual(faltan, [], `el blanqueo no toca: ${faltan.join(', ')}`);
  });

  caso('los cinco campos de `raw` del reinicio son sujetos de verdad (si no, el caso de arriba es decorativo)', () => {
    // Ancla: si el motor dejara de mandar estos campos a `raw`, el caso anterior seguiria verde
    // sin medir nada. Esto exige que el universo NO este vacio y que incluya a los conocidos.
    const { raw } = planDeBlanqueo();
    for (const clave of ['scheduledLabel', 'branchAsked', 'qualifyAsks', 'handoffAckAt', 'urgenteAvisadoAt']) {
      assert.ok(clave in raw, `${clave} tiene que entrar al plan de blanqueo`);
    }
  });

  caso('`raw` se mezcla y no se pisa: el inbox y el telefono sobreviven', () => {
    const sql = guionBlanqueo(49);
    assert.ok(/raw = coalesce\(raw, '\{\}'::jsonb\) \|\|/.test(sql), `tiene que mezclar, no pisar: ${sql}`);
    assert.ok(!sql.includes('inboxId') && !sql.includes('publicContact'), 'no toca lo que el producto conserva');
  });

  caso('una fila con `scheduledLabel` viejo NO es la de un desconocido', () => {
    const base = { botStage: 'nuevo', humanTookOver: false, qualification: {}, slotsOffered: [], offScriptCount: 0 };
    assert.strictEqual(esExtrano({ ...base }), true, 'la fila limpia si es de un desconocido');
    assert.strictEqual(
      esExtrano({ ...base, scheduledLabel: 'viernes 4 de septiembre, 14:00' }),
      false,
      'con una demo de otra semana en `raw` el motor no arranca como con un desconocido',
    );
    assert.strictEqual(esExtrano({ ...base, branchAsked: true }), false, 'ya pregunto la rama');
    assert.strictEqual(esExtrano({ ...base, handoffAckAt: '2026-09-04T18:00:00.000Z' }), false, 'ya acuso el traspaso');
  });

  // ── devolver la bandeja: la sonda no puede quedarse arriba de los leads reales ──
  //
  // El bug que fijan estos casos se midio el 2026-09-12 en el inbox 4: la conversacion 49 de la
  // sonda, abierta y con la actividad mas fresca, encima de CUATRO desconocidos reales. Ver el
  // comentario largo de `cerrarSujeto`.

  const sonda = (extra = {}) => {
    const resueltas = [];
    const avisos = [];
    return {
      resueltas,
      avisos,
      deps: {
        resolver: (id) => resueltas.push(id),
        conversacion: () => 49,
        avisar: (m) => avisos.push(m),
        ...extra,
      },
    };
  };

  caso('EL BUG: con el bot en `nuevo` no habia NINGUN camino que cerrara', () => {
    // `dejarComoExtrano` solo resolvia por Rails cuando `necesitaDesarme` daba true. Esta es la
    // fila de una vuelta normal — la del 99% de las corridas — y da false: no se cerraba nada.
    assert.strictEqual(necesitaDesarme({ botStage: 'nuevo', humanTookOver: false }), false);
    const s = sonda();
    cerrarSujeto(s.deps);
    assert.deepStrictEqual(s.resueltas, [49], 'el cierre no puede depender del estado del embudo');
  });

  caso('cierra aunque el veredicto sea 1 (bot mudo)', async () => {
    const s = sonda();
    const v = await correrConCierre({
      medir: async () => ({ codigo: 1, texto: 'EL BOT NO CONTESTO' }),
      cerrar: () => cerrarSujeto(s.deps),
    });
    assert.strictEqual(v.codigo, 1, 'el cierre no puede cambiar el veredicto');
    assert.deepStrictEqual(s.resueltas, [49], 'un rojo tambien dejo la conversacion abierta');
  });

  caso('cierra aunque la medicion TIRE, y la excepcion sigue viajando', async () => {
    const s = sonda();
    await assert.rejects(
      () =>
        correrConCierre({
          medir: async () => {
            throw new Error('Chromium murio');
          },
          cerrar: () => cerrarSujeto(s.deps),
        }),
      /Chromium murio/,
      'tragarse el error de medicion seria peor que no cerrar',
    );
    assert.deepStrictEqual(s.resueltas, [49], 'si reventó despues de mandar, la conversacion quedo abierta igual');
  });

  caso('sin conversacion todavia no se cierra nada', () => {
    // Adivinar un id aca resolveria la conversacion de un lead de verdad.
    const s = sonda({ conversacion: () => null });
    assert.strictEqual(cerrarSujeto(s.deps), false);
    assert.deepStrictEqual(s.resueltas, []);
  });

  caso('si el cierre falla, avisa y NO tira: la medicion ya vale', () => {
    const s = sonda({
      resolver: () => {
        throw new Error('rails runner se cayo');
      },
    });
    assert.strictEqual(cerrarSujeto(s.deps), false);
    assert.strictEqual(s.avisos.length, 1, 'tragarselo en silencio es el bug que esto arregla');
    assert.match(s.avisos[0], /ABIERTA/, `el aviso tiene que decir que quedo abierta; dijo: ${s.avisos[0]}`);
  });

  caso('sin deps inyectadas TIRA, en vez de escribir en produccion', () => {
    // Un default al efecto real hace que un caso distraido corra `docker exec … rails runner`
    // contra la Chatwoot viva y pase en verde.
    assert.throws(() => cerrarSujeto(), /exige/);
    assert.throws(() => cerrarSujeto({ resolver: () => {} }), /exige/);
    assert.rejects(() => correrConCierre({ medir: async () => ({}) }), /exige/);
  });

  // ── el barrido de los rastros propios ──
  // Los fixtures son las filas REALES del inbox 4 el 2026-09-13, copiadas de la consulta del
  // barrido. Inventarlas seria medir el caso que uno previo; estas son las que ya estaban ahi.
  const CONV48 = {
    id: 48,
    contacto: 'cold-pond-731',
    telefono: null,
    mensajesDelCliente: ['Hola, quiero informacion sobre el sistema', 'Tengo una clinica dental en Santa Cruz, somos 4 personas'],
  };
  const CONV36 = {
    id: 36,
    contacto: 'icy-lake-546',
    telefono: null,
    mensajesDelCliente: ['Quiero información ', 'Saguilera@ds-santacruz.bo'],
  };

  caso('el guion exacto es un rastro de la sonda', () => {
    assert.strictEqual(esRastroDeSonda(CONV48.mensajesDelCliente), true);
  });
  caso('un desconocido real con la MISMA cantidad de mensajes NO es un rastro', () => {
    // Conv 36 manda dos mensajes, igual que el guion. Si el predicado contara turnos en vez de
    // leer el texto, este lead se perderia — y es el unico de los mudos al que se le puede
    // escribir hoy, porque dejo su correo.
    assert.strictEqual(esRastroDeSonda(CONV36.mensajesDelCliente), false);
  });
  caso('una conversacion que SIGUIO despues del guion ya no es un rastro', () => {
    assert.strictEqual(esRastroDeSonda([...CONV48.mensajesDelCliente, 'y cuanto sale?']), false);
  });
  caso('sin mensajes de cliente no hay rastro', () => {
    assert.strictEqual(esRastroDeSonda([]), false);
    assert.strictEqual(esRastroDeSonda(null), false);
  });
  caso('el rastro se reconoce aunque el SQL haya aplanado saltos de linea', () => {
    assert.strictEqual(esRastroDeSonda(['Hola, quiero  informacion sobre el sistema ', ' Tengo una clinica dental en Santa Cruz, somos 4 personas']), true);
  });
  caso('un guion vacio no convierte a todos en rastro', () => {
    assert.strictEqual(esRastroDeSonda([''], ['']), false);
  });

  caso('el default llega al TERCER turno, que es donde el bot murio dos veces', () => {
    // El carril media "widget 2/2" y su OBJETIVO nombra tres turnos. La costura
    // `ONIA_SONDA_GUION` existe desde el 2026-09-03 para llegar ahi y NADIE la corrio nunca:
    // un env suelto no lo corre nadie, asi que el tercer turno tenia que entrar al default.
    //
    // ⚠️ Este caso exigia `GUION_POR_DEFECTO[2] === 'A'` y por eso la sonda cerraba una demo de
    // mentira cada media hora. El 3.er turno se conserva —es lo que valia—; lo que cambio es que
    // ya no ESCRIBE en el embudo. El por que, medido, esta arriba en `GUION_POR_DEFECTO` y en el
    // caso «el guion por defecto NO cierra una demo en el inbox de leads reales».
    assert.strictEqual(GUION_POR_DEFECTO.length, 3, 'el default mide los tres turnos');
    assert.ok(
      !/^[ab]$/i.test(GUION_POR_DEFECTO[2].trim()),
      'el tercero pregunta, no elige horario: elegirlo marca demo_agendada y avisa a Sergio Urcullo',
    );
  });

  caso('los rastros VIEJOS de dos mensajes siguen reconociendose', () => {
    // La trampa de subir el default: `esRastroDeSonda` exige el guion COMPLETO, asi que al pasar
    // a tres turnos las sondas ya escritas (conv 48 y 50 del inbox 4, dos mensajes) dejaban de
    // calificar — y `objetivo_visible.mjs` las volvia a contar como "un desconocido escribio".
    // Un falso verde que nada puede deshacer, que es exactamente lo que ese predicado existe
    // para evitar. Los guiones historicos se reconocen por lista EXPLICITA, no por prefijo:
    // aceptar prefijos arbitrarios si podria tragarse un lead real.
    assert.strictEqual(esRastroDeSonda(CONV48.mensajesDelCliente), true);
    assert.strictEqual(esRastroDeSonda([...CONV48.mensajesDelCliente, 'A']), true);
    // Y el sesgo sigue del lado seguro: un desconocido real no se vuelve rastro por la lista.
    assert.strictEqual(esRastroDeSonda(CONV36.mensajesDelCliente), false);
    assert.strictEqual(esRastroDeSonda([...CONV48.mensajesDelCliente, 'y cuanto sale?']), false);
  });

  caso('el sellado alcanza la tabla que lee el PRODUCTO, no solo la que ve el humano', () => {
    // MEDIDO EL 2026-09-18 EN PRODUCCION, y es el motivo entero de este caso: renombrar el
    // contacto SOLO en Chatwoot deja la identidad congelada del lado del bot. Las conversaciones
    // 48 y 50 son sondas nuestras que Chatwoot ya llama "Sonda QA carril chatbot", y
    // `onia_center.bot_conversations.display_name` seguia diciendo `cold-pond-731` y
    // `quiet-shape-612` — la FOTO del nombre anonimo del instante en que nacio la fila.
    // `esConversacionNuestra()` (el criterio del PRODUCTO) lee esa columna, asi que los cuatro
    // barridos del embudo las tomaban por desconocidas: `contarColgadas` las reportaba como dos
    // leads perdidos hace 15 dias, y con el circuito en `emit` desde el 2026-09-17 una sonda
    // dentro de la ventana de 20 h recibe el follow-up M3 en el inbox de leads REALES.
    const sentencias = sentenciasDeSellado(48, NOMBRE_SONDA);
    const texto = sentencias.map((s) => `${s.base} ${s.sql}`).join(' | ');
    assert.ok(
      sentencias.some((s) => s.base === 'chatwoot' && /update\s+contacts/i.test(s.sql)),
      `falta el sellado en Chatwoot: ${texto}`,
    );
    assert.ok(
      sentencias.some((s) => s.base === 'bot' && /bot_conversations/i.test(s.sql) && /display_name/i.test(s.sql)),
      `falta el sellado en la tabla que lee el producto: ${texto}`,
    );
    // El nombre sellado tiene que ser el que el criterio del producto reconoce, no uno cualquiera:
    // `esConversacionNuestra()` decide con /\b(prueba|qa|test)\b/i sobre `display_name`.
    for (const s of sentencias) assert.match(s.sql, /Sonda QA carril chatbot/, `sella otro nombre: ${s.sql}`);
  });

  caso('el barrido reclama el rastro anonimo y deja en paz al lead', () => {
    const renombradas = [];
    const reclamadas = reclamarRastros({
      listar: () => [CONV36, CONV48],
      renombrar: (id) => renombradas.push(id),
    });
    assert.deepStrictEqual(reclamadas, [48], 'solo la 48 es nuestra');
    assert.deepStrictEqual(renombradas, [48], 'y el efecto cayo solo sobre ella');
  });
  caso('el barrido NO re-reclama lo que el criterio compartido ya da por nuestro', () => {
    // Mismo guion que la 48, pero ya bautizada. Si esto reclamara, el barrido escribiria en
    // produccion una vez por hora, para siempre, sin cambiar nada.
    const renombradas = [];
    reclamarRastros({
      listar: () => [{ ...CONV48, id: 47, contacto: 'Sonda QA' }],
      renombrar: (id) => renombradas.push(id),
    });
    assert.deepStrictEqual(renombradas, [], 'el nombre de prueba ya lo excluia');
  });
  caso('un fallo renombrando avisa y sigue con las demas', () => {
    const avisos = [];
    const renombradas = [];
    const reclamadas = reclamarRastros({
      listar: () => [{ ...CONV48, id: 48 }, { ...CONV48, id: 99 }],
      renombrar: (id) => {
        if (id === 48) throw new Error('psql se cayo');
        renombradas.push(id);
      },
      avisar: (m) => avisos.push(m),
    });
    assert.deepStrictEqual(reclamadas, [99], 'la que si se pudo marcar cuenta');
    assert.strictEqual(avisos.length, 1, 'y la que no, avisa');
    assert.match(avisos[0], /48/);
  });
  caso('si no se puede listar, el barrido avisa y NO tumba la medicion', () => {
    const avisos = [];
    const reclamadas = reclamarRastros({
      listar: () => {
        throw new Error('docker no responde');
      },
      renombrar: () => assert.fail('no deberia renombrar nada'),
      avisar: (m) => avisos.push(m),
    });
    assert.deepStrictEqual(reclamadas, []);
    assert.strictEqual(avisos.length, 1);
  });
  caso('el barrido sin deps inyectadas TIRA, en vez de escribir en produccion', () => {
    assert.throws(() => reclamarRastros(), /exige/);
    assert.throws(() => reclamarRastros({ listar: () => [] }), /exige/);
  });

  let fallados = 0;
  for (const [nombre, fn] of casos) {
    try {
      // `await` aunque el caso sea sincrono: sin el, un caso `async` devuelve una promesa que
      // este try NO puede atrapar, imprime "ok" y su assert se pierde. Un caso que no puede
      // fallar es peor que uno ausente, porque cuenta como cobertura.
      await fn();
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
  process.exit(await selfCheck());
} else {
  const v = await correrConCierre({
    medir: correr,
    // `desarmar` es el que hace el `resolved!` por Rails — el camino del producto, no un UPDATE
    // a mano. Con el bot ya en `nuevo` su espera del efecto sale en la primera pasada.
    cerrar: () =>
      cerrarSujeto({
        resolver: desarmar,
        conversacion: () => {
          const token = leerEstado().cw_conversation;
          return token ? conversacionDelToken(token) : null;
        },
      }),
  });
  console.log(v.texto);
  process.exit(v.codigo);
}
