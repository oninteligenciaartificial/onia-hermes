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
import { guardaDeEfectoReal } from './lib/guarda-efecto-real.mjs';

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
 * Quien escribio, fue atendido SOLO POR LA MAQUINA, y no volvio — y nadie de Onia se entero.
 *
 * Pura y sin I/O. Es el agujero que comparten las dos miradas de arriba, y las dos lo tienen
 * por el mismo motivo: ambas exigen que el bot se haya CALLADO. `seleccionarColgados` descarta
 * toda conversacion cuyo ultimo mensaje sea saliente, y `seleccionarEsperandoHumano` solo mira
 * las que traen la promesa de M5. Una conversacion en la que el bot hizo bien su trabajo
 * —contesto, ofrecio dos horarios— y la persona no eligio ninguno no la ve NINGUNA de las dos.
 *
 * MEDIDO el 2026-09-17 contra la base de Chatwoot, con dos desconocidos reales:
 *   conv 58 (WhatsApp, 3 h) entro por el boton `wa.me` de onia.com.bo; conv 38 (web, 20 DIAS)
 *   escribio "hola" el 29-ago. De ninguna de las dos se entero nadie jamas.
 *
 * Y lo que lo vuelve grave es la direccion del cambio: **el bot apago el unico aviso de lead
 * nuevo que habia**. Antes de que contestara, ese desconocido quedaba sin respuesta y disparaba
 * el vigia de arriba. Ahora el bot contesta SIEMPRE, asi que ese vigia no se dispara NUNCA. Una
 * capacidad nueva se llevo puesta la cobertura de la superficie que ya existia, en silencio.
 *
 * No hay techo de edad ni piso de "ya es tarde": con cero clientes pagando, el unico que vende
 * quiere saber que alguien apreto el boton de WhatsApp en su web. Quien decide es Sergio Urcullo.
 *
 * @param {object[]} filas
 * @param {{ahoraMs:number, umbralMs?:number, frase:string|null}} opciones  `frase` sale de
 *   `frasePromesaHandoff()` y aca se usa al reves que en la mirada de al lado: para EXCLUIR lo
 *   que ya es de ella. Sin guion legible se mira igual — perder el guion no puede apagar esto.
 */
export function seleccionarEsperandoDecision(filas, { ahoraMs, umbralMs = UMBRAL_MS, frase } = {}) {
  const buscada = sinAdornos(frase).trim();
  const esperando = [];

  for (const lista of agruparPorConversacion(filas).values()) {
    const ultimo = lista[lista.length - 1];
    if (Number(ultimo.messageType) !== ENTRANTE) {
      // El ultimo es saliente: el bot (o alguien) hablo ultimo. Ese es el caso de esta mirada.
    } else continue; // le toca contestar a Onia: es del vigia de arriba

    const iSuyo = lista.findLastIndex((m) => Number(m.messageType) === ENTRANTE);
    if (iSuyo < 0) continue; // nunca escribio nadie: es un saliente que arrancamos nosotros

    // Todo lo que se dijo DESPUES de que la persona hablo por ultima vez. Si ahi hay una
    // promesa de humano, la conversacion es de `seleccionarEsperandoHumano` y no se duplica:
    // dos avisos por la misma conversacion es como se le deja de creer a un vigia.
    const atencion = lista.slice(iSuyo + 1);
    if (buscada.length >= 20 && atencion.some((m) => sinAdornos(m.content).includes(buscada))) continue;

    if (ahoraMs - ultimo.createdAtMs < umbralMs) continue; // todavia lo esta leyendo
    if (esNuestra({ contacto: ultimo.contacto, telefono: ultimo.telefono })) continue;

    // Lo que se muestra es lo ULTIMO QUE DIJO LA PERSONA, por el mismo motivo que arriba: la
    // oferta del bot no le dice a Sergio Urcullo a que le tiene que contestar.
    esperando.push({
      ...ultimo,
      content: lista[iSuyo].content,
      esperandoDecision: true,
      esperaMin: Math.round((ahoraMs - ultimo.createdAtMs) / 60000),
    });
  }
  return esperando.sort((a, b) => a.esperaMin - b.esperaMin);
}

/**
 * Los escalones de antiguedad, en dias. Pasado el mes se re-avisa una vez por mes.
 *
 * No son "cada cuanto se mira" (eso lo manda el cron, cada 2 h): son los momentos en que un
 * colgado YA avisado vuelve a valer un mensaje. Estan espaciados a proposito — un lead que lleva
 * 20 dias no mejora porque se lo repitan 12 veces por dia, y saturar el canal de Sergio Urcullo
 * es la forma conocida de apagarlo.
 */
const ESCALONES_DIAS = [0, 1, 3, 7, 14, 30];

/** El mayor escalon que un colgado ya cruzo. Despues del mes, multiplos de 30. */
export function escalonDe(esperaMin) {
  const dias = Number(esperaMin) / (60 * 24);
  if (!Number.isFinite(dias) || dias <= 0) return 0;
  if (dias >= 30) return Math.floor(dias / 30) * 30;
  let mayor = 0;
  for (const e of ESCALONES_DIAS) if (dias >= e) mayor = e;
  return mayor;
}

/**
 * El estado guardado por conversacion fue un numero plano (el `messageId`) hasta el 13-sep.
 * Estas dos lo leen en los DOS formatos: el archivo vivo del VPS tiene el viejo, y si el codigo
 * nuevo no lo entiende, o se cree que nunca aviso a nadie, o tira. Ninguna de las dos es
 * aceptable sobre un vigia cuyo trabajo es que no se pierda una persona.
 */
export function mensajeAvisado(valor) {
  if (valor && typeof valor === 'object') return Number(valor.mensaje || 0);
  return Number(valor || 0);
}

export function escalonAvisado(valor) {
  if (valor && typeof valor === 'object') return Number(valor.escalon || 0);
  return 0; // formato viejo: no sabemos en que escalon aviso, y suponer el peor lo dejaria mudo
}

/**
 * Los que todavia no se avisaron.
 *
 * Dos motivos para volver a avisar, y el segundo nacio de un fallo medido:
 *
 * 1. **Insistio.** Llego un `messageId` mas nuevo: cada insistencia es un lead mas caliente.
 * 2. **Se pudrio mas.** Cruzo un escalon de antiguedad (`escalonDe`) que todavia no se aviso.
 *
 * El (2) falta hasta el 2026-09-13 y por eso el vigia paso 10 dias mudo con CINCO personas
 * esperando: medido en `/var/log/onia-vigia-sin-respuesta.log`, detectaba a los 5 en cada
 * corrida, el contador de dias subia (14, 16, 17, 19, 20 d) y firmaba `0 sin avisar` siempre.
 * Con la clave puesta solo en el mensaje, el UNICO evento capaz de reactivar el aviso es que el
 * prospecto escriba de nuevo — y al que ignoras deja de escribir. El vigia se volvia mas
 * silencioso cuanto peor estaba la situacion.
 */
export function nuevosParaAvisar(colgados, estadoPrevio) {
  const avisados = estadoPrevio?.avisados || {};
  const nuevos = [];
  for (const c of colgados || []) {
    const previo = avisados[String(c.conversationId)];
    const visto = previo !== undefined && previo !== null;
    const insistio = mensajeAvisado(previo) < Number(c.messageId);
    const sePudrio = escalonDe(c.esperaMin) > escalonAvisado(previo);
    if (!insistio && !sePudrio) continue;
    // `reaviso` es lo que deja que el texto no lo presente como un lead que acaba de entrar.
    nuevos.push(visto ? { ...c, reaviso: true } : c);
  }
  return nuevos;
}

/**
 * El estado nuevo, conservando lo que ya habia de otras conversaciones.
 *
 * `idTarea` es la tarea que el aviso acaba de dejar viva. Se anota porque el barrido de la
 * corrida siguiente la tiene que poder encontrar aunque para entonces el titulo se escriba de
 * otra forma: el id es lo unico del aviso que no cambia. Las anteriores ya se archivaron en
 * esta misma corrida, asi que la lista queda con una sola.
 */
export function armarEstado(estadoPrevio, colgados, idTarea) {
  const avisados = { ...(estadoPrevio?.avisados || {}) };
  for (const c of colgados || []) {
    avisados[String(c.conversationId)] = {
      mensaje: Number(c.messageId),
      escalon: escalonDe(c.esperaMin),
    };
  }
  const tareas = idTarea ? [String(idTarea)] : estadoPrevio?.tareas;
  return { ...(estadoPrevio || {}), avisados, ...(tareas ? { tareas } : {}) };
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
 * Los TRES casos van SEPARADOS porque piden cosas distintas de Sergio: al que nadie contesto hay
 * que contestarle, al que espera un humano el bot YA le prometio que le escriben, y al que el bot
 * atendio bien nadie le debe nada — lo unico que pasa es que Sergio Urcullo no sabia que existia.
 * Sumarlos bajo el mismo titulo ("escribieron y nadie contesto") diria algo falso de dos de los
 * tres grupos, y un vigia que grita mal no molesta: inutiliza.
 */
/**
 * Con QUE contestarle a esta persona.
 *
 * Medido el 2026-09-19 contra la base de Chatwoot: los tres leads de WhatsApp colgados tienen
 * telefono (`conv 35 +59173232758` hace 24 d, `conv 37 +59173021804` hace 22 d, `conv 58
 * +59175755019`) y el aviso salia sin el — el contacto de la 58 se llama literalmente `.`, asi que
 * el mensaje que le pedia a Sergio Urcullo contestarle no nombraba a nadie con quien actuar.
 * El dato ya estaba leido: `esNuestra({contacto, telefono})` es lo unico que separa a un
 * desconocido de una sonda. **Un dato que ya se consulta para DECIDIR tiene que viajar al texto
 * que pide ACTUAR** — y fallaba hacia el lado caro, porque WhatsApp es el canal donde contestar
 * es UN CLIC y era justo el que llegaba sin con que hacerlo.
 *
 * El enlace va DESNUDO (`wa.me/<digitos>`) y no como `<a href>`: este texto viaja a Telegram en
 * HTML y tambien al cuerpo de la tarea del tablero. Telegram lo autolinkea, el tablero lo muestra
 * copiable, y ninguna de las dos puede romperse por el marcado — que es el modo de falla conocido
 * de ese canal (un `<` suelto y el mensaje NO llega).
 *
 * Los digitos de la URL se DERIVAN del telefono, nunca se interpolan crudos: un numero con
 * marcado adentro ensuciaria el enlace ademas del texto. Menos de 8 digitos no es un telefono
 * con el que se pueda escribir, asi que se muestra el nombre y nada mas — inventar un enlace
 * roto es peor que no ponerlo.
 *
 * El escapador se INYECTA porque hay DOS consumidores y uno solo es HTML: el aviso de Telegram
 * escapa, la CLI no (escapar ahi imprimiria `&lt;` en la pantalla del que diagnostica). El
 * archivo ya declara el invariante abajo — «la CLI dice lo MISMO que el Telegram» — y ya
 * envejecio una vez por su cuenta: cuando el aviso gano la tercera categoria, la CLI se quedo
 * con dos y llamaba «esperando respuesta» a alguien a quien el bot SI le habia contestado. Un
 * helper compartido es lo unico que impide que las dos vias vuelvan a separarse.
 */
export function quien(c, esc = escapar) {
  const nombre = esc(c.contacto || 'sin nombre');
  const digitos = String(c.telefono || '').replace(/\D/g, '');
  if (digitos.length < 8) return nombre;
  return `${nombre} (${esc(c.telefono)} · wa.me/${digitos})`;
}

export function armarAviso(colgados) {
  const linea = (c) => {
    const canal = Number(c.inboxId) === 5 ? 'WhatsApp' : 'web';
    const derivado = !c.esperandoHumano && String(c.botStage || '') === 'handoff_humano' ? ' · derivado a humano' : '';
    // Un re-aviso se nombra: Sergio Urcullo lee esto en el telefono entre decenas de tareas, y si
    // el que lleva 20 dias se ve igual que uno que entro recien, le hace creer que hoy llegaron
    // cinco desconocidos nuevos — y actua sobre un hecho falso.
    const cuanto = c.reaviso ? `${espera(c.esperaMin)} y sigue esperando` : `${espera(c.esperaMin)} esperando`;
    // La salvedad va PEGADA a la linea del sujeto que no se pudo medir, no en el titulo: una
    // salvedad suelta arriba absuelve al grupo entero y deja de decir de QUIEN no se sabe.
    const sinMedir = c.esperandoDecision && c.humanoTomo === null ? ' · no pude confirmar si ya le escribiste' : '';
    return `conv ${c.conversationId} (${canal}${derivado}) — ${cuanto}${sinMedir} — ${quien(c)}: ${escapar(String(c.content || '').slice(0, 70))}`;
  };

  const sinRespuesta = (colgados || []).filter((c) => !c.esperandoHumano && !c.esperandoDecision);
  const esperanHumano = (colgados || []).filter((c) => c.esperandoHumano);
  const sinQueSepas = (colgados || []).filter((c) => c.esperandoDecision);
  const bloques = [];
  if (sinRespuesta.length) {
    bloques.push(`🔴 <b>${sinRespuesta.length} desconocido(s) escribieron y nadie contesto</b>\n<pre>${sinRespuesta.map(linea).join('\n')}</pre>`);
  }
  if (esperanHumano.length) {
    bloques.push(`🔴 <b>${esperanHumano.length} espera(n) que le escribas vos — el bot ya se lo prometio</b>\n<pre>${esperanHumano.map(linea).join('\n')}</pre>`);
  }
  if (sinQueSepas.length) {
    bloques.push(`🔴 <b>${sinQueSepas.length} escribio(eron), el bot lo(s) atendio y no volvio(eron) — no lo sabia nadie mas</b>\n<pre>${sinQueSepas.map(linea).join('\n')}</pre>`);
  }
  return bloques.join('\n');
}

/**
 * Lee de la base de Chatwoot los mensajes de los inboxes del bot, con el nombre y el telefono
 * del contacto — que es lo unico con lo que se distingue un desconocido de la sonda.
 * Va por `docker exec psql` porque la base de Chatwoot no esta expuesta al host.
 */
export async function leerFilasDeChatwoot() {
  guardaDeEfectoReal('psql contra la base de Chatwoot', 'Inyectale deps.leerFilas al vigia');
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
  // ANTES del `try`, no adentro: ese catch es pelado y existe para que la falta del motor no
  // tumbe un aviso que ya es cierto. Adentro, se tragaria la baranda y la haria fallar ABIERTA.
  guardaDeEfectoReal('motor en supabase-db', 'Inyectale deps.enriquecer al vigia');
  const claves = colgados.map((c) => `'chatwoot:${Number(c.conversationId)}'`).join(',');
  try {
    const { stdout } = await run('docker', [
      'exec', process.env.ONIA_BOT_ESTADO_DB || 'supabase-db',
      'psql', '-U', 'postgres', '-d', 'postgres', '-tAF\t', '-c',
      `select conversation_key, coalesce(bot_stage,''), coalesce(human_took_over,false) from onia_center.bot_conversations where conversation_key in (${claves});`,
    ]);
    const porClave = new Map(stdout.split('\n').map((l) => l.split('\t')).filter((c) => c.length >= 3).map((c) => [c[0], c]));
    for (const c of colgados) {
      const fila = porClave.get(`chatwoot:${c.conversationId}`);
      c.botStage = fila?.[1] || '';
      // `humanoTomo` es TRI-ESTADO y su `null` decide un aviso, asi que no puede aplanarse a
      // `false`: una conversacion que el motor no conoce (no hay fila) tampoco es "nadie la
      // tomo" — es "no se sabe". Aplanarla diria que Sergio Urcullo nunca la vio, que es
      // exactamente la afirmacion que este vigia existe para no inventar.
      c.humanoTomo = fila ? fila[2] === 't' : null;
    }
  } catch {
    // Sin estado del motor los dos primeros avisos siguen siendo ciertos, solo menos
    // detallados; el tercero sale con su salvedad. `humanoTomo` queda undefined -> se
    // normaliza a null abajo, nunca a false.
  }
  for (const c of colgados) if (c.humanoTomo === undefined) c.humanoTomo = null;
  return colgados;
}

function leerEstado(ruta) {
  try {
    return JSON.parse(readFileSync(ruta, 'utf8'));
  } catch {
    return {};
  }
}

/** Marcador propio de LA tarea de este vigia. Nunca el titulo: el titulo nombra a la gente. */
export const MARCA_LEADS = '[leads-esperando]';

const MOTIVO_BLOQUEO =
  'Desconocidos esperando una respuesta. Contactar a un prospecto es decision de Sergio Urcullo.';

/** Una tarea del tablero sigue viva mientras no haya terminado. */
const ESTADOS_TERMINALES = new Set(['done', 'archived', 'cancelled', 'canceled']);

/**
 * Las tareas que este vigia ya dejo y siguen vivas. Se buscan por dos caminos, y hacen falta
 * los dos:
 *
 *   · la MARCA en el titulo, que alcanza a lo que cualquier corrida haya creado;
 *   · los ids que el vigia ANOTO al crearlos (`estado.tareas`), que es lo unico que sobrevive
 *     a un cambio de titulo.
 *
 * El segundo camino nace de un caso medido el 2026-09-24: cuatro tareas sobre las MISMAS siete
 * personas seguian vivas con cuentas de hace 11 dias, dos de ellas creadas antes de que
 * existiera la MARCA. Una clave puesta sobre el titulo se rompe sola el dia que el titulo
 * cambia, y el que la cambia no se entera — la tarea vieja no falla, simplemente se queda.
 */
export function tareasViejasDelVigia(tareas, idsRecordados = []) {
  const recordados = new Set((idsRecordados || []).map((id) => String(id)));
  return (Array.isArray(tareas) ? tareas : [])
    .filter((t) => String(t?.title || '').includes(MARCA_LEADS) || recordados.has(String(t?.id)))
    .filter((t) => !ESTADOS_TERMINALES.has(String(t?.status || '').toLowerCase()))
    .map((t) => String(t.id));
}

/** El titulo que ve Sergio Urcullo en el telefono: corto y con la cuenta de hoy. */
export function tituloDelAviso(colgados) {
  return `${MARCA_LEADS} ${(colgados || []).length} desconocido(s) esperando una respuesta tuya`;
}

/** El estado que el tablero declara para una tarea, leido de la salida de `show`. */
export function estadoDeLaTarea(salida) {
  const encontrado = String(salida || '').match(/^\s*status:\s*(\S+)/m);
  return encontrado ? encontrado[1] : null;
}

/**
 * El aviso de verdad. NO va por `onia-tg.sh`: ese enrutador crea la tarea en `ready` y la
 * dedupea por el titulo con los DIGITOS COLAPSADOS A `N`. Las dos mitades hacen dano y las
 * dos se midieron el 2026-09-18 con dos desconocidos reales esperando:
 *
 *   · `ready` es de donde los carriles sacan trabajo. Contactar a un prospecto NO es trabajo
 *     de un carril, es decision de Sergio Urcullo, y lo unico que le llega como decision es
 *     `blocked --kind needs_input`. La tarea `t_3b9d0ded` quedo `ready` entre 262.
 *   · Mientras esa tarea siga viva, «3 escribieron» normaliza al mismo titulo que
 *     «2 escribieron»: `TAREA-YA-EXISTE`, exit 0, aviso tirado en silencio. El lead nuevo
 *     desaparece y el que llama no se entera.
 *
 * Por eso el vigia es dueño de su tarea: archiva la anterior, crea la de hoy y la bloquea.
 * Devuelve SI se entrego, porque anotar «ya le avise» sobre un aviso que nadie recibio es
 * como este vigia se apaga solo.
 */
export async function entregarComoDecision(texto, colgados, deps = {}, opciones = {}) {
  const tablero = deps.tablero || ejecutarTablero;
  // La guarda va ACA, fuera del try: adentro se la come el catch que existe para no romper
  // la vuelta cuando el tablero no contesta, y el vigia terminaria avisando de verdad.
  if (!deps.tablero) {
    guardaDeEfectoReal('canal de avisos de Sergio Urcullo', 'Inyectale deps.avisar al vigia');
  }

  let vivas;
  try {
    vivas = tareasViejasDelVigia(JSON.parse(await tablero(['list', '--json'])), opciones.tareasPrevias);
  } catch (error) {
    return { entregado: false, motivo: `no pude leer el tablero: ${String(error?.message || error)}` };
  }
  for (const id of vivas) await tablero(['archive', id]);

  const salida = await tablero(['create', tituloDelAviso(colgados), '--body', texto, '--priority', '1']);
  const id = (String(salida).match(/t_[0-9a-f]{8}/) || [])[0];
  if (!id) return { entregado: false, motivo: 'el tablero no devolvio el id de la tarea' };

  // El motivo va ANTES de `--kind`: con la opcion en el medio el tablero muere con
  // `unrecognized arguments` y la tarea se queda `ready`, o sea sin avisarle a nadie.
  await tablero(['block', id, MOTIVO_BLOQUEO, '--kind', 'needs_input']);

  // `block` sale 0 SIN bloquear cuando el tablero detecta un bucle de bloqueos: el exit no
  // prueba nada y el estado se MIRA.
  const estado = estadoDeLaTarea(await tablero(['show', id]));
  if (estado !== 'blocked') {
    return { entregado: false, id, motivo: `la tarea quedo en "${estado}", no en blocked` };
  }
  return { entregado: true, id };
}

async function ejecutarTablero(args) {
  const { stdout } = await run('/root/bin/onia-tablero.sh', args);
  return stdout;
}

/**
 * El estado dice a quien ya se le aviso. Escribirlo desde la suite es PEOR que mandar un
 * Telegram de mas: es UN solo JSON con todas las conversaciones, asi que una corrida de test
 * puede marcar como «ya avisado» a cada lead que estaba esperando y apagar el vigia entero
 * sin dejar rastro. Por eso el default se guarda igual que el canal.
 *
 * Una ruta explicita —o `ONIA_VIGIA_ESTADO`— es hermetica y se deja pasar: la baranda no puede
 * volver intesteable a la parte que SI hay que probar.
 */
export function rutaDeEstado(explicita) {
  const elegida = explicita || process.env.ONIA_VIGIA_ESTADO;
  if (!elegida) guardaDeEfectoReal('estado de produccion del vigia', 'Pasale opciones.estado (o ONIA_VIGIA_ESTADO)');
  return elegida || ESTADO_POR_DEFECTO;
}

export async function correrVigia(opciones = {}, deps = {}) {
  const ahoraMs = Number.isFinite(opciones.ahoraMs) ? opciones.ahoraMs : Date.now();
  const rutaEstado = rutaDeEstado(opciones.estado);
  const leerFilas = deps.leerFilas || leerFilasDeChatwoot;
  const avisar = deps.avisar || entregarComoDecision;

  const filas = await leerFilas();
  // Si el guion no se puede leer, el vigia sigue mirando a los que nadie contesto: perder una
  // mitad no puede apagar la otra. Lo que grita cuando M5 cambia es el caso del `npm test`.
  let frase = null;
  try {
    frase = frasePromesaHandoff(readFileSync(deps.configDelBot || CONFIG_DEL_BOT, 'utf8'));
  } catch { /* sin guion legible no se miran los handoff */ }

  const vistos = await (deps.enriquecer || enriquecerConEstadoDelBot)([
    ...seleccionarColgados(filas, { ahoraMs, umbralMs: opciones.umbralMs }),
    ...seleccionarEsperandoHumano(filas, { ahoraMs, umbralMs: opciones.umbralMs, frase }),
    ...seleccionarEsperandoDecision(filas, { ahoraMs, umbralMs: opciones.umbralMs, frase }),
  ]);

  // El filtro de la tercera mirada corre DESPUES de enriquecer porque `human_took_over` lo
  // escribe el motor, no Chatwoot: es el unico dato que sabe si una PERSONA de Onia tomo la
  // conversacion. Reclamarle un lead que el ya contesto es como se apaga un vigia.
  //
  // Los otros dos grupos NO se filtran por esto a proposito: en ellos el silencio es del lado
  // de Onia, asi que un humano que paso por ahi y aun asi dejo a la persona esperando sigue
  // siendo el aviso. Y el `null` (no se pudo preguntar) avisa igual, con la salvedad escrita en
  // su linea: callarse por no haber podido medir es perder el lead, que es el lado caro.
  const colgados = vistos.filter((c) => !(c.esperandoDecision && c.humanoTomo === true));
  const estadoPrevio = leerEstado(rutaEstado);
  const nuevos = nuevosParaAvisar(colgados, estadoPrevio);

  let entrega = null;
  if (opciones.emitir && nuevos.length) {
    // `tareasPrevias` es lo que este vigia recuerda haber creado: sin eso, el barrido solo
    // reconoce sus avisos por el titulo y una tarea vieja sobrevive para siempre en la hoja de
    // decisiones que Sergio Urcullo recibe cada manana.
    entrega =
      (await avisar(armarAviso(nuevos), nuevos, {}, { tareasPrevias: estadoPrevio?.tareas || [] })) || {};
    // El estado dice «a este ya le avise». Anotarlo cuando el aviso NO llego es como este
    // vigia se apaga solo: la persona queda marcada como avisada sin que nadie la haya
    // visto, y no se la vuelve a nombrar hasta el escalon siguiente — o nunca.
    if (entrega.entregado) {
      mkdirSync(dirname(rutaEstado), { recursive: true });
      writeFileSync(rutaEstado, JSON.stringify(armarEstado(estadoPrevio, nuevos, entrega.id), null, 2));
    }
  }
  return { colgados, nuevos, entrega };
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
    .then(({ colgados, nuevos, entrega }) => {
      // La CLI dice lo MISMO que el Telegram, y con las mismas tres categorias. Cuando el
      // aviso gano la tercera mirada esta salida se quedo con dos y llamaba «esperando
      // respuesta» a alguien a quien el bot SI le habia contestado: quien lee la CLI para
      // diagnosticar se lleva un hecho falso, que es justo lo que el aviso evita.
      for (const c of colgados) {
        const canal = Number(c.inboxId) === 5 ? 'WhatsApp' : 'web';
        const que = c.esperandoHumano ? 'esperando que le escriba una persona'
          : c.esperandoDecision ? 'atendido por el bot y no volvio — no lo sabe nadie'
            : 'esperando respuesta';
        console.log(`conv ${c.conversationId} (${canal}) — ${espera(c.esperaMin)} ${que} — ${quien(c, (t) => t)}: ${String(c.content || '').slice(0, 60)}`);
      }
      const conHumano = colgados.filter((c) => c.esperandoHumano).length;
      const sinQueSepas = colgados.filter((c) => c.esperandoDecision).length;
      console.log(`${colgados.length} colgado(s) — ${colgados.length - conHumano - sinQueSepas} sin respuesta · ${conHumano} esperando a un humano prometido · ${sinQueSepas} atendido(s) por el bot que nadie mas vio · ${nuevos.length} sin avisar${argv.includes('--emit') ? '' : ' (SECO — agregar --emit)'}`);
      // Un aviso que no llego es el fallo que este vigia existe para no tener: se dice, y con
      // codigo distinto de 0, porque el cron lo unico que mira es el codigo.
      if (entrega && !entrega.entregado) {
        console.error(`vigia-sin-respuesta: NO pude avisarle a Sergio Urcullo — ${entrega.motivo}`);
        process.exit(2);
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error(`vigia-sin-respuesta: ${String(error?.message || error)}`);
      process.exit(2);
    });
}
