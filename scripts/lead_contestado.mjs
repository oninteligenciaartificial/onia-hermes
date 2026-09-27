#!/usr/bin/env node
/**
 * lead_contestado.mjs — ¿ya le contestó un HUMANO a los desconocidos que esperan? (fila S7)
 *
 * POR QUÉ EXISTE. La tabla «Bloqueado en Sergio» de `hermes-content/docs/cola/chatbot.md`
 * tiene su propia lección medida escrita adentro: *«S10, S11, S12 y S13 esperaron hasta 23
 * días con la decisión ya tomada, y las cuatro se cerraron el día que se les cableó un
 * verificador mecánico»*. Al 2026-09-27 quedaban SEIS filas sin uno (S1, S3, S5, S7, S15, S6),
 * y `npm run bloqueos:vencidos` las lista cada vuelta como «se re-miden a mano» — o sea que
 * nadie las re-mide.
 *
 * ⚠️ **S7 estaba excluida por un motivo FALSO, y la corrección es la razón de este archivo.**
 * La cabecera de `credencial_de_bloqueo.mjs` (26-sep) descartó seis filas de un saque diciendo
 * que «no dejan rastro legible o son una decisión sin estado», y puso a S7 entre ellas como
 * *«que él le escriba a cuatro personas»*. Medido el 2026-09-27: **sí deja rastro, y es el más
 * legible de todos** — contestar en Chatwoot escribe una fila en `messages` con
 * `message_type=1`. Lo que pasó es que se fusionaron **dos preguntas distintas**: *«¿por qué
 * esto sólo lo puede hacer Sergio Urcullo?»* (vende él, son personas reales) y *«¿el resultado
 * se puede leer?»*. La primera no implica la segunda, y al mezclarlas el filtro falló CERRADO
 * sobre una fila perfectamente medible. Es el mismo error de unidad que esta cola ya pagó dos
 * veces («medir el archivo en vez de medir la afirmación»).
 *
 * 🔴 LA TRAMPA, medida antes de escribir una línea, y es la que invierte el veredicto.
 * El criterio obvio para «contestó un humano» es `message_type=1 AND sender_type='User'`.
 * **Está mal, y falla en la dirección cara.** En este Chatwoot la tabla `agent_bots` está
 * VACÍA: el bot no postea como `AgentBot`, postea con la cuenta de un agente normal, así que
 * sus respuestas salen `sender_type='User'` igual que las de una persona. Contado el
 * 2026-09-27 sobre los 914 salientes del histórico:
 *
 *     sender_id=3  business+bot@onia.com.bo  «Onia Bot»  → 895   (el bot)
 *     sender_id=2  oninteligenciaartificial@gmail.com    →  19   (la persona)
 *
 * Con el criterio obvio, S7 se declararía SATISFECHO en cuanto el bot conteste solo — que es
 * lo único que sabe hacer— y el gate le diría a este carril «dejá de pedirle esto a Sergio
 * Urcullo» con las cuatro personas sin respuesta. Y la fila existe precisamente porque *«un
 * bot no puede retomar una conversación fría de hace una semana sin que suene a spam»*.
 *
 * CÓMO SE DISTINGUE SIN CLAVAR UN NÚMERO. No por la convención del correo ni por el id 3
 * escrito acá: **el bot vivo DECLARA su cuenta** (`CHATWOOT_BOT_AGENT_ID` en el entorno del
 * proceso que atiende). Se lee de ahí, y si no se puede leer el veredicto es 2 — nunca se
 * adivina, porque sin saber quién es el bot no hay forma de distinguirlo de una persona, y ése
 * es exactamente el bug que este archivo evita.
 *
 * ALCANCE — lo que este instrumento NO contesta, a propósito:
 *   · **«¿cuántos desconocidos esperan HOY?»** es otra pregunta y tiene otro dueño
 *     (`npm run embudo:bot`, y la tarea `[leads-esperando]` del tablero). Acá se mediría
 *     contaminada: los inboxes 4 y 5 son los reales, y nuestra propia sonda del widget
 *     (`npm run sonda:widget`) escribe en el 4 — contado hoy, 13 conversaciones sin respuesta
 *     humana, y varias son sondas nuestras. Un número que uno sabe contaminado no se publica
 *     como veredicto: es el mismo daño que T13, cuando una sonda propia enterró la única demo
 *     real. Este archivo juzga SÓLO los cuatro sujetos que la fila declara.
 *   · **«o descartar»**, la otra mitad del texto de S7: descartar no deja rastro. Si Sergio
 *     Urcullo los descarta en silencio, esto sigue diciendo «bloqueado». Se dice acá en vez de
 *     fingir que el instrumento lo ve.
 *   · 🔴 **EL AGUJERO QUE ESTE GATE PUEDE ABRIR CONTRA SÍ MISMO, y hay que decirlo porque es
 *     el riesgo caro.** Sólo ve lo que se contesta **dentro de Chatwoot**. La tarea del tablero
 *     `t_5ea80f5e` recomienda justamente la otra vía para conv 36 (*«escribirle por correo HOY,
 *     cero costo, cero restricción»*, porque dejó `Saguilera@ds-santacruz.bo`) y los dos de
 *     WhatsApp pasaron la ventana de 24 h, así que la opción B los manda a contestar **desde el
 *     teléfono personal de Sergio Urcullo**. Las dos vías son correctas y **ninguna deja fila en
 *     `messages`**: si contesta así, este gate sigue diciendo «bloqueado» y le vuelve a pedir
 *     trabajo que YA HIZO — que es exactamente el daño que un verificador existe para evitar.
 *     **Por eso su 1 no autoriza a re-pedirle nada por sí solo:** antes de volver a nombrarle
 *     S7 hay que mirar el comentario de esa tarea. Cerrar la fila con su palabra es válido; el
 *     gate mide UNA de las tres vías, no las tres.
 *
 * CÓDIGOS DE SALIDA — el contrato de `credencial_de_bloqueo.mjs` e `inbox_tenencia.mjs`:
 *   0  ya les contestaron a todos  → S7 SATISFECHO, hay que cerrar la fila
 *   1  queda alguno sin respuesta  → sigue bloqueado, y NOMBRA cuáles (para poder achicar la
 *      fila: si contestó dos de cuatro, seguir pidiendo «los cuatro» es pedir trabajo ya hecho)
 *   2  no se pudo medir            → sigue bloqueado (FALLO CONSERVADOR), y lo DICE
 *
 * NO TOCA NADA. Sólo lee. Corre desde el VPS (docker local) y desde nodo-casa (el shim de
 * `docker` delega por SSH).
 *
 *   node scripts/lead_contestado.mjs           (o `npm run lead:contestado`)
 *   node scripts/lead_contestado.mjs --self-check
 */

import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

/**
 * El SERVICIO, no el contenedor. Chatwoot corre en Docker Swarm, así que el nombre real del
 * contenedor lleva un sufijo de tarea —hoy `onia-chatbot_chatwoot-db.1.sddet2j4f4gvnrozj4t5b1850`—
 * que cambia cada vez que la tarea se reprograma. Clavarlo caduca solo, y la primera corrida
 * viva de este archivo lo demostró: `No such container`. Se deriva de `docker ps`.
 */
const SERVICIO_CW_DB = process.env.ONIA_CHATWOOT_DB_SERVICIO ?? 'onia-chatbot_chatwoot-db';
const BASE_CW = process.env.ONIA_CHATWOOT_DB ?? 'onia-chatbot';
const CONTENEDOR_BOT = process.env.ONIA_BOT_CONTAINER ?? 'onia-center';

/**
 * Los cuatro sujetos que la fila S7 declara, con quién es cada uno para que el veredicto se
 * pueda leer sin abrir la cola. `display_id` es el número que la cola y Chatwoot muestran.
 */
export const SUJETOS_DE_S7 = [
  { conversacion: 34, quien: 'widget, sin dato de contacto' },
  { conversacion: 35, quien: '+591 73232758 — clínica dental de 4 doctores' },
  { conversacion: 36, quien: 'Saguilera@ds-santacruz.bo' },
  { conversacion: 37, quien: '+591 73021804' },
];

// --- el veredicto, puro: se prueba sin docker, sin red y sin base -----------------------

/** Un conteo medido es un entero ≥ 0. Cualquier otra forma es «no lo medí». */
export function esConteo(n) {
  return typeof n === 'number' && Number.isInteger(n) && n >= 0;
}

/**
 * `filas` = `[{ conversacion, inbox, entrantes, delBot, deHumano }]` tal como sale de la base,
 * una por conversación ENCONTRADA. `cuentaDelBot` = el id que el bot vivo declara.
 *
 * `cuentaDelBot` null es 2 y no 1: sin saber quién es el bot, `deHumano` no se pudo calcular
 * bien, y un `deHumano` mal calculado es justo el falso 0 que este archivo existe para evitar.
 */
export function veredictoS7({ filas, cuentaDelBot, sujetos = SUJETOS_DE_S7 }) {
  if (!esConteo(cuentaDelBot)) {
    return {
      codigo: 2,
      mensaje:
        'NO MEDIDO — no pude leer qué cuenta de Chatwoot usa el bot vivo ' +
        '(`CHATWOOT_BOT_AGENT_ID`). Sin eso sus respuestas automáticas son indistinguibles de ' +
        'las de una persona, y este gate saldría 0 con las cuatro sin contestar. No medir NO ' +
        'es «ya contestaron».',
    };
  }
  if (!Array.isArray(filas)) {
    return {
      codigo: 2,
      mensaje:
        `NO MEDIDO — no pude leer \`messages\` de Chatwoot (servicio \`${SERVICIO_CW_DB}\`: ` +
        `¿está vivo el contenedor?). No medir NO es «nadie contestó».`,
    };
  }

  const porId = new Map(filas.map((f) => [f.conversacion, f]));
  const faltantes = sujetos.filter((s) => !porId.has(s.conversacion));
  const medidos = sujetos.filter((s) => porId.has(s.conversacion));
  const pendientes = medidos.filter((s) => !(porId.get(s.conversacion).deHumano > 0));
  const contestados = medidos.filter((s) => porId.get(s.conversacion).deHumano > 0);

  const nombrar = (lista) =>
    lista.map((s) => `conv ${s.conversacion} (${s.quien})`).join(' · ');

  if (pendientes.length > 0) {
    const yaEsta = contestados.length
      ? ` Ya contestadas, sacalas de la fila: ${nombrar(contestados)}.`
      : '';
    const noVistas = faltantes.length
      ? ` (${faltantes.length} sin poder juzgar: ${nombrar(faltantes)} — no están en la base.)`
      : '';
    return {
      codigo: 1,
      mensaje:
        `S7 sigue bloqueado — ${pendientes.length} de ${sujetos.length} sin respuesta de una ` +
        `persona: ${nombrar(pendientes)}.${yaEsta}${noVistas} Vende Sergio Urcullo: el bot no ` +
        `puede retomar una conversación fría sin sonar a spam.`,
    };
  }

  // Nadie pendiente entre los medidos. Si alguno no se pudo juzgar, NO se puede afirmar
  // «satisfecho»: eso es la mitad del contrato que separa el 2 del 0.
  if (faltantes.length > 0) {
    return {
      codigo: 2,
      mensaje:
        `NO MEDIDO — le contestaron a las ${contestados.length} que sí pude leer, pero ` +
        `${faltantes.length} no está(n) en la base y no se puede(n) juzgar: ${nombrar(faltantes)}. ` +
        `Una fila no se cierra con la mitad de sus sujetos sin mirar.`,
    };
  }

  return {
    codigo: 0,
    mensaje:
      `S7 SATISFECHO — una persona ya le contestó a las ${contestados.length}: ` +
      `${nombrar(contestados)}. Cerrá la fila: es el primer lead atendido del carril.`,
  };
}

// --- las lecturas, todas tri-estado -----------------------------------------------------

/** `docker exec`; `null` = no medido (ni local ni por el shim/SSH). */
function dockerExec(contenedor, argv) {
  try {
    return execFileSync('docker', ['exec', '-i', contenedor, ...argv], {
      encoding: 'utf8',
      maxBuffer: 4 * 1024 * 1024,
      timeout: 60_000,
    });
  } catch {
    return null;
  }
}

/** `docker ps` crudo; `null` = no medido. */
function dockerPs() {
  try {
    return execFileSync('docker', ['ps', '--format', '{{.Names}}'], { encoding: 'utf8', timeout: 60_000 });
  } catch {
    return null;
  }
}

/**
 * El contenedor vivo del servicio, derivado. `null` = no medido — y eso es un 2 honesto, no
 * «la base dice que nadie contestó».
 */
export function contenedorDelServicio(servicio = SERVICIO_CW_DB, ps = dockerPs) {
  const salida = ps();
  if (salida === null) return null;
  const candidatos = salida
    .split('\n')
    .map((l) => l.trim())
    .filter((n) => n === servicio || n.startsWith(`${servicio}.`));
  if (candidatos.length === 0) return null;
  if (candidatos.length > 1) console.log(`  (${candidatos.length} tareas del servicio ${servicio}; uso ${candidatos[0]})`);
  return candidatos[0];
}

/**
 * Qué cuenta de Chatwoot usa el bot que ESTÁ ATENDIENDO. Se pregunta al proceso vivo
 * (`/proc/<pid>/environ`) y no a un `.env`: la memoria del sistema ya tiene medido que los
 * lanzadores con lista blanca de `-e` descartan variables en silencio, así que el archivo y el
 * proceso pueden discrepar. `null` = no medido, nunca un número inventado.
 */
export function cuentaDelBotVivo(contenedor = CONTENEDOR_BOT, exec = dockerExec) {
  const pids = exec(contenedor, [
    'sh',
    '-c',
    "ps -eo pid,args 2>/dev/null | grep -F webhook-server.mjs | grep -v grep | awk '{print $1}'",
  ]);
  if (pids === null) return null;
  for (const pid of pids.split('\n').map((l) => l.trim()).filter(Boolean)) {
    const env = exec(contenedor, ['sh', '-c', `tr '\\0' '\\n' < /proc/${pid}/environ 2>/dev/null`]);
    if (env === null) continue;
    const m = env.match(/^CHATWOOT_BOT_AGENT_ID=(\d+)$/m);
    if (m) return Number(m[1]);
  }
  return null;
}

/**
 * Los conteos por conversación. `deHumano` excluye la cuenta del bot Y las notas privadas:
 * una nota interna es `message_type=1` y no es una respuesta al cliente — contarla diría
 * «contestado» por un apunte que el desconocido nunca vio.
 */
export function filasDeChatwoot(cuentaDelBot, sujetos = SUJETOS_DE_S7, exec = dockerExec, contenedor = contenedorDelServicio) {
  if (!esConteo(cuentaDelBot)) return null;
  const ids = sujetos.map((s) => s.conversacion);
  if (ids.length === 0) return [];
  const cw = typeof contenedor === 'function' ? contenedor() : contenedor;
  if (!cw) return null;
  const sql = `
    select c.display_id, c.inbox_id,
           count(*) filter (where m.message_type = 0),
           count(*) filter (where m.message_type = 1 and m.sender_id = ${cuentaDelBot}),
           count(*) filter (where m.message_type = 1 and m.sender_type = 'User'
                              and m.sender_id is not null and m.sender_id <> ${cuentaDelBot}
                              and m.private = false)
    from conversations c join messages m on m.conversation_id = c.id
    where c.display_id in (${ids.join(',')})
    group by 1, 2 order by 1;
  `;
  const salida = exec(cw, ['psql', '-U', 'postgres', '-d', BASE_CW, '-tAc', sql]);
  if (salida === null) return null;
  return interpretarFilas(salida);
}

/**
 * `psql -tA` con separador `|`. Una línea que no trae los cinco campos como enteros se
 * DESCARTA en vez de aportar `NaN`: un `NaN` en `deHumano` no es `> 0`, o sea que se leería
 * como «sin contestar» —un rojo plausible por un parseo roto, que es como un instrumento
 * empieza a mentir sin fallar.
 */
export function interpretarFilas(texto) {
  const filas = [];
  for (const linea of texto.split('\n')) {
    if (!linea.trim()) continue;
    const campos = linea.split('|').map((c) => c.trim());
    if (campos.length !== 5) continue;
    const [conversacion, inbox, entrantes, delBot, deHumano] = campos.map(Number);
    if (![conversacion, inbox, entrantes, delBot, deHumano].every(esConteo)) continue;
    filas.push({ conversacion, inbox, entrantes, delBot, deHumano });
  }
  return filas;
}

// --- self-check: puro, sin docker, sin red ----------------------------------------------

function selfCheck() {
  const casos = [];
  const chequear = (nombre, condicion) => casos.push({ nombre, ok: Boolean(condicion) });

  const sujetos = [
    { conversacion: 34, quien: 'widget' },
    { conversacion: 35, quien: 'dental' },
  ];
  const fila = (conversacion, { delBot = 0, deHumano = 0 } = {}) => ({
    conversacion,
    inbox: 4,
    entrantes: 1,
    delBot,
    deHumano,
  });

  // 🔴 EL CASO QUE DA NOMBRE AL ARCHIVO. Las 895 respuestas del bot NO son «contestado».
  // Con el criterio obvio (`sender_type='User'`) este caso saldría 0 y el gate cerraría la
  // fila con las dos personas esperando.
  const soloElBot = veredictoS7({
    filas: [fila(34, { delBot: 12 }), fila(35, { delBot: 895 })],
    cuentaDelBot: 3,
    sujetos,
  });
  chequear('el bot contestó 907 veces y NO alcanza: sigue bloqueado (1)', soloElBot.codigo === 1);
  chequear('y el mensaje nombra a los dos pendientes', /conv 34/.test(soloElBot.mensaje) && /conv 35/.test(soloElBot.mensaje));

  // Una persona contestó las dos → satisfecho.
  chequear(
    'una persona contestó las dos → 0',
    veredictoS7({ filas: [fila(34, { deHumano: 1 }), fila(35, { deHumano: 3, delBot: 40 })], cuentaDelBot: 3, sujetos })
      .codigo === 0,
  );

  // Mitad y mitad: sigue bloqueado, pero NOMBRA la que ya está para poder achicar la fila.
  const mitad = veredictoS7({
    filas: [fila(34, { deHumano: 2 }), fila(35)],
    cuentaDelBot: 3,
    sujetos,
  });
  chequear('dos de cuatro contestadas → 1, no 0', mitad.codigo === 1);
  chequear('y dice cuál sacar de la fila', /sacala|sacalas/i.test(mitad.mensaje) && /conv 34/.test(mitad.mensaje));

  // Sin saber quién es el bot NO se concluye: es el falso 0 que este archivo evita.
  for (const malo of [null, undefined, NaN, '3', 3.5, -1, {}]) {
    chequear(
      `cuentaDelBot ${JSON.stringify(malo) ?? String(malo)} → 2, nunca 0`,
      veredictoS7({ filas: [fila(34, { deHumano: 1 }), fila(35, { deHumano: 1 })], cuentaDelBot: malo, sujetos }).codigo === 2,
    );
  }

  // Base que no contesta → 2, no «nadie contestó».
  for (const malo of [null, undefined, 'error', 0]) {
    chequear(
      `filas ${JSON.stringify(malo) ?? String(malo)} → 2`,
      veredictoS7({ filas: malo, cuentaDelBot: 3, sujetos }).codigo === 2,
    );
  }

  // Un sujeto ausente de la base no se cuenta como contestado NI como pendiente en silencio.
  const faltaUna = veredictoS7({ filas: [fila(34, { deHumano: 1 })], cuentaDelBot: 3, sujetos });
  chequear('sujeto ausente + el resto contestado → 2, no 0', faltaUna.codigo === 2);
  chequear('y nombra al ausente', /conv 35/.test(faltaUna.mensaje));
  chequear(
    'sujeto ausente + otro pendiente → 1 (es cierto igual), y lo dice',
    (() => {
      const v = veredictoS7({ filas: [fila(34)], cuentaDelBot: 3, sujetos });
      return v.codigo === 1 && /sin poder juzgar/.test(v.mensaje);
    })(),
  );

  // El parseo: una línea rota se descarta en vez de aportar NaN.
  chequear(
    'interpretarFilas descarta la línea rota y conserva la buena',
    (() => {
      const filas = interpretarFilas('34|4|1|0|0\nbasura\n|||\n35|5|1|895|2\n36|x|1|0|0\n');
      return filas.length === 2 && filas[0].conversacion === 34 && filas[1].deHumano === 2;
    })(),
  );
  chequear('interpretarFilas de texto vacío es [] y no null', (() => {
    const f = interpretarFilas('\n  \n');
    return Array.isArray(f) && f.length === 0;
  })());

  // La lectura de la cuenta del bot: tri-estado de verdad.
  chequear('cuentaDelBotVivo lee el id del entorno del proceso vivo', cuentaDelBotVivo('x', (_c, argv) =>
    /ps -eo/.test(argv[2]) ? '104755\n' : 'PATH=/usr/bin\nCHATWOOT_BOT_AGENT_ID=3\nTZ=\n') === 3);
  chequear('cuentaDelBotVivo sin proceso → null', cuentaDelBotVivo('x', (_c, argv) => (/ps -eo/.test(argv[2]) ? '\n' : '')) === null);
  chequear('cuentaDelBotVivo si docker no contesta → null', cuentaDelBotVivo('x', () => null) === null);
  chequear(
    'cuentaDelBotVivo si el proceso NO declara la variable → null, no 0',
    cuentaDelBotVivo('x', (_c, argv) => (/ps -eo/.test(argv[2]) ? '104755\n' : 'PATH=/usr/bin\n')) === null,
  );
  chequear('filasDeChatwoot sin cuenta del bot no consulta nada y da null', filasDeChatwoot(null, sujetos, () => {
    throw new Error('no debería consultar');
  }) === null);

  // 🔴 El sufijo de tarea de Swarm: clavar el nombre del contenedor caduca, y la primera
  // corrida viva lo demostró con `No such container`. Se deriva, y no se adivina.
  const psSwarm = () => 'onia-chatbot_chatwoot-redis.1.aaa\nonia-chatbot_chatwoot-db.1.sddet2j4f4gvnrozj4t5b1850\nsupabase-db\n';
  chequear(
    'contenedorDelServicio resuelve el sufijo de tarea de Swarm',
    contenedorDelServicio('onia-chatbot_chatwoot-db', psSwarm) === 'onia-chatbot_chatwoot-db.1.sddet2j4f4gvnrozj4t5b1850',
  );
  chequear(
    'contenedorDelServicio NO confunde un servicio hermano con prefijo compartido',
    contenedorDelServicio('onia-chatbot_chatwoot', psSwarm) === null,
  );
  chequear('contenedorDelServicio acepta el nombre exacto sin sufijo', contenedorDelServicio('supabase-db', psSwarm) === 'supabase-db');
  chequear('contenedorDelServicio si docker no contesta → null', contenedorDelServicio('x', () => null) === null);
  chequear('contenedorDelServicio si no está el servicio → null', contenedorDelServicio('no-existe', psSwarm) === null);
  chequear(
    'filasDeChatwoot sin contenedor derivado → null, y no consulta',
    filasDeChatwoot(3, sujetos, () => {
      throw new Error('no debería consultar');
    }, () => null) === null,
  );
  chequear(
    'filasDeChatwoot consulta al contenedor DERIVADO, no al nombre del servicio',
    (() => {
      let visto = '';
      filasDeChatwoot(3, sujetos, (c) => {
        visto = c;
        return '';
      }, () => 'onia-chatbot_chatwoot-db.1.abc');
      return visto === 'onia-chatbot_chatwoot-db.1.abc';
    })(),
  );
  chequear(
    'la consulta excluye la cuenta del bot y las notas privadas',
    (() => {
      let sql = '';
      // El contenedor se INYECTA: sin esto el caso llamaría a `docker ps` de verdad y el
      // self-check dejaría de ser puro — rojo por ambiente en cualquier máquina sin Chatwoot,
      // que es justo la forma que este repo prohíbe en la cadena raíz.
      filasDeChatwoot(3, sujetos, (_c, argv) => {
        sql = argv[argv.length - 1];
        return '';
      }, () => 'cw-de-prueba');
      return /sender_id <> 3/.test(sql) && /private = false/.test(sql) && /sender_id = 3/.test(sql);
    })(),
  );

  const fallados = casos.filter((c) => !c.ok);
  for (const c of fallados) console.error(`  FALLA  ${c.nombre}`);
  console.log(
    fallados.length === 0
      ? `self-check ok — ${casos.length} caso(s); el central es que las respuestas del BOT no cuentan como atendido.`
      : `self-check ROJO — ${fallados.length}/${casos.length} fallando.`,
  );
  return fallados.length === 0 ? 0 : 1;
}

// --- CLI, detrás de la guarda de `argv[1]` para que el módulo sea importable -------------

function principal() {
  if (process.argv.includes('--self-check')) return selfCheck();
  const cuentaDelBot = cuentaDelBotVivo();
  const filas = filasDeChatwoot(cuentaDelBot);
  const { codigo, mensaje } = veredictoS7({ filas, cuentaDelBot });
  if (esConteo(cuentaDelBot)) {
    console.log(`bot de Chatwoot: cuenta ${cuentaDelBot} (declarada por el proceso vivo)`);
  }
  if (Array.isArray(filas)) {
    for (const s of SUJETOS_DE_S7) {
      const f = filas.find((x) => x.conversacion === s.conversacion);
      console.log(
        f
          ? `  conv ${f.conversacion} (inbox ${f.inbox}) — entrantes ${f.entrantes} · del bot ${f.delBot} · de una persona ${f.deHumano}`
          : `  conv ${s.conversacion} — no está en la base, NO MEDIDA`,
      );
    }
  }
  console.log(`${codigo === 0 ? 'SATISFECHO' : codigo === 1 ? 'BLOQUEADO' : 'NO MEDIDO'}: ${mensaje}`);
  return codigo;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exit(principal());
}
