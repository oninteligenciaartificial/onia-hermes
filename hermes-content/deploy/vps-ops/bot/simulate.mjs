// ONIA — Chatbot propio: SIMULADOR / PROBADOR.
// Corre la conversacion entera por CLI, sin WhatsApp, sin Telegram y sin tocar la base.
// Es el "/probador-bot" de la spec §3.5: mostrale al cliente que responde ANTES de encenderlo.
//
//   node simulate.mjs --all                        los 8 guiones de prueba de la spec (fase 1)
//   node simulate.mjs --script 1-feliz             un guion
//   node simulate.mjs --list                       lista los guiones
//   node simulate.mjs                              modo interactivo (escribis vos, corta con /salir)
//   node simulate.mjs --all --slots "jueves 15:00@2026-07-30T19:00:00Z|viernes 10:00@..."  horarios a mano
//   node simulate.mjs --all --json                 salida maquina (para diffs / CI)
//   node simulate.mjs --sin-conocimiento           el guion PELADO del codigo (sin el documento)
//   ONIA_SIM_WEBHOOK_ENV=/ruta/webhook.env node simulate.mjs ...   lee ESE webhook.env y no sale al VPS
//
// POR DEFECTO corre con `knowledge.onia.json`, el documento publicado que produccion carga para
// los inboxes de venta (4 web, 5 WhatsApp): lo que ves aca es lo que oye un lead. Sin eso el
// simulador contestaba «el número exacto te lo pasa Sergio» mientras el bot vivo daba los precios
// publicos — ver simulate.test.mjs.
//
// Los HORARIOS salen de `ONIA_BOT_SLOTS`, el mismo lugar del que los lee el bot vivo, con el
// formato `etiqueta@ISO` (la etiqueta es lo unico que ve el prospecto). Si no hay ninguno se cae
// al placeholder de config.mjs Y SE AVISA: produccion tiene dos cargados —los repone un cron
// diario—, asi que el guion sin horarios es una rama que ningun lead ve. Para reproducir lo que
// contesta produccion ahora mismo:
//
//   export ONIA_BOT_SLOTS=$(docker exec onia-center sh -c "tr '\0' '\n' < /proc/<pid>/environ" \
//     | sed -n 's/^ONIA_BOT_SLOTS=//p')
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md §6 (via A).

import readline from "node:readline";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import nodePath from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createBotConfig, DEFAULT_CONFIG, parseSlotsSpec, slotsElegibles } from "./config.mjs";
import { createState, step, markHumanTakeover, buildFollowUp, LLM_PENDING } from "./bot-engine.mjs";
import { applyKnowledge, asRecepcionista, readKnowledgeFile } from "./knowledge.mjs";
import { AGENDA_ENV, agendaDelEntorno, motivoEnSeco, reservaQueNoSalio } from "./calcom-booking.mjs";
import { instanteDeAtencion } from "./ventanas-de-atencion.mjs";

/**
 * El documento PUBLICADO del bot de venta de Onia — el mismo `knowledge.onia.json` que se instala
 * con `webhook-server.sh knowledge` y que produccion carga para los inboxes 4 (web) y 5 (WhatsApp).
 *
 * Nace del 2026-09-04: el simulador armaba la config con `DEFAULT_CONFIG` pelado, sin documento, y
 * por eso a "¿cuánto cuesta el sistema?" contestaba «el número exacto te lo pasa Sergio en la demo»
 * mientras el bot vivo, a la misma hora, contestaba los precios publicos (conversacion 49 de
 * Chatwoot, mensaje 418). El instrumento con el que se mide el carril daba ROJO sobre algo que en
 * produccion estaba VERDE — y un rojo falso manda a la vuelta siguiente a reabrir un bug cerrado.
 */
export const CONOCIMIENTO_PUBLICADO = fileURLToPath(new URL("./knowledge.onia.json", import.meta.url));

// Knowledge de UNA org cliente (fila "db" publicada) para el guion recepcionista. Es el mismo
// shape "onia.bot.knowledge/1" que publica el editor del producto.
const CONOCIMIENTO_FERRETERIA = {
  schema: "onia.bot.knowledge/1",
  version: "sim-recepcionista",
  identity: {
    productName: "Ferretería El Tornillo",
    humanName: "doña Marta",
    botName: "el asistente de Ferretería El Tornillo",
  },
  empresa: { horario: { dias: [1, 2, 3, 4, 5, 6], desde: 8, hasta: 19, frase: "lun-sab, 8:00-19:00" } },
  productos: [
    { key: "tornilleria", tipo: "servicio", nombre: "tornillería al por mayor y menor" },
    { key: "herramientas", tipo: "servicio", nombre: "herramientas eléctricas y manuales" },
  ],
};

// ---------------------------------------------------------------------------
// Los 10 guiones de prueba (spec §8, fase 1 + rama por rubro y soporte)
// ---------------------------------------------------------------------------

export const SCRIPTS = {
  "1-feliz": {
    title: "Camino feliz — elige horario, agenda y RECIEN AHI contesta las 3 preguntas",
    horario: "dentro",
    turns: [
      { text: "DEMO" },
      { text: "A" },
      { text: "Tengo una ferreteria, somos 5 y estoy en Santa Cruz" },
      { text: "la agenda" },
    ],
  },
  "2-precio": {
    title: "Pregunta el precio — el bot NUNCA cotiza (M4)",
    horario: "dentro",
    turns: [
      { text: "hola, cuanto cuesta?" },
      { text: "tengo un restaurante, somos 8, cochabamba" },
      { text: "y el precio final cual es? vi los 890 bs" },
      { text: "B" },
    ],
  },
  "3-siat": {
    title: "Pregunta por SIAT/facturacion — respuesta segura + fuera de horario (M7)",
    horario: "fuera",
    turns: [
      { text: "DEMO" },
      { text: "ya emite factura al SIAT?" },
      { text: "tengo una peluqueria, trabajo sola, en tarija" },
    ],
  },
  "4-descalificado": {
    title: "Descarte cortes — no es un negocio (M1c)",
    horario: "dentro",
    turns: [
      { text: "DEMO" },
      { text: "soy estudiante todavia, busco trabajo, les mando mi cv?" },
    ],
  },
  "5-offscript": {
    title: "Dos malentendidos seguidos — el bot entrega la conversacion (M5)",
    horario: "dentro",
    turns: [
      { text: "DEMO" },
      { text: "mmm depende" },
      { text: "y bueno vos que decis" },
    ],
  },
  "6-optout": {
    title: "Opt-out (M6), silencio total, y reapertura solo con DEMO",
    horario: "dentro",
    turns: [
      { text: "DEMO" },
      { text: "STOP" },
      { text: "hola? estas ahi?" },
      { text: "DEMO" },
    ],
  },
  "7-audio": {
    title: "Nota de voz — sin transcripcion pide texto; con transcripcion sigue el embudo",
    horario: "dentro",
    turns: [
      { text: "DEMO" },
      { kind: "voice", transcript: "" },
      { kind: "voice", transcript: "si tenemos una panaderia, somos 3 personas aca en la paz" },
      { text: "opcion A" },
    ],
  },
  "8-humano": {
    title: "Sergio contesta — el bot se calla PARA SIEMPRE en esa conversacion",
    horario: "dentro",
    turns: [
      { text: "DEMO" },
      { op: "human_takeover" },
      { text: "hola? me decias?" },
      { text: "tengo una ferreteria, somos 5, santa cruz" },
    ],
  },
  "9-rama-dental": {
    title: "Ramificacion por rubro — odontologia es el unico que suma la pregunta de los sillones",
    horario: "dentro",
    turns: [
      { text: "DEMO" },
      { text: "A" },
      { text: "soy dentista, somos 4 en la clinica, en cochabamba" },
      { text: "3" },
    ],
  },
  "10-soporte": {
    title: "Segundo camino — YA es cliente: soporte y humano, NUNCA la demo comercial",
    horario: "dentro",
    turns: [
      { text: "DEMO" },
      { text: "ya soy cliente y el sistema no me anda, como configuro los recordatorios?" },
    ],
  },
  "recepcionista-ferreteria": {
    title: "MODO RECEPCIONISTA — el bot de un CLIENTE: saludo del negocio, FAQ del knowledge, pedido -> humano",
    horario: "dentro",
    conocimiento: CONOCIMIENTO_FERRETERIA,
    turns: [
      { text: "hola" }, // M0R con el menu de BOTONES (input_select: Horarios/Servicios/humano)
      // Click del boton: en el canal real llega como message_updated con submitted_values y el
      // adapter lo convierte en un turno con el TITULO como texto — que es esto mismo.
      { text: "Horarios" },
      { text: "que venden?" },
      { text: "quiero comprar 100 tornillos" }, // escala: lo confirma doña Marta
      { text: "cuanto cuestan?" }, // handoff en curso: el bot ya no habla encima del humano
      { text: "Servicios" }, // click de boton EN handoff: la FAQ exacta si se contesta (solo lectura)
    ],
  },
};

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { script: null, all: false, list: false, json: false, slots: null, contact: "test-01" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--all") args.all = true;
    else if (arg === "--list") args.list = true;
    else if (arg === "--json") args.json = true;
    else if (arg === "--script") args.script = argv[++index];
    else if (arg === "--slots") args.slots = argv[++index];
    else if (arg === "--contact") args.contact = argv[++index];
    // Escotilla para comparar los dos guiones: con el documento publicado (lo que oye un lead) y
    // sin el (lo que trae el codigo). El DEFAULT es con documento, o sea produccion.
    else if (arg === "--sin-conocimiento") args.sinConocimiento = true;
  }
  return args;
}

/**
 * Lee el documento publicado con la MISMA validacion que produccion (`parseKnowledge`: todo o
 * nada). Devuelve `{ data, aviso }`: si `aviso` no es null, el simulador se queda con el guion del
 * codigo — igual que el bot vivo — y lo dice en voz alta.
 */
export function cargarConocimientoPublicado(deps = {}) {
  const path = deps.path || CONOCIMIENTO_PUBLICADO;
  const { data, error, missing } = readKnowledgeFile(path, deps);
  if (data) return { data, aviso: null };
  const motivo = missing ? "no existe" : error || "no se pudo leer";
  return { data: null, aviso: `⚠️ sin conocimiento publicado (${path}: ${motivo}) — esto NO es lo que contesta produccion` };
}

/** El archivo de entorno que el bot vivo carga de verdad. NO es una copia: es el que se instala. */
export const WEBHOOK_ENV_DESPLEGADO = "/opt/onia/bot/webhook.env";

/** La maquina donde vive ese archivo. Se pregunta por SSH cuando el disco local no lo tiene. */
export const VPS_DEL_BOT = "root@187.77.16.63";

/** El nombre de la llave. El DIRECTORIO cambia segun la maquina; el nombre no. */
export const NOMBRE_LLAVE_VPS = "onia_hermes_vps_ed25519";

/**
 * Donde buscar la llave, en orden. Que NO sea una ruta fija es toda la gracia.
 *
 * Este escalon remoto nacio el 2026-09-07 para arreglar «el instrumento atado a una ruta absoluta
 * deja de medir cuando el carril se muda de maquina»... y se cableo a OTRA ruta absoluta:
 * `/root/.ssh/`, que es donde vive la llave en nodo-casa (WSL, como root). El 2026-09-21 el carril
 * se abrio en Windows, donde la llave esta en `C:\Users\<usuario>\.ssh\`, y el mismo bug volvio por
 * TERCERA vez: `leerDelEnvRemoto` fallaba en silencio (el `try/catch` existe para sobrevivir a un
 * ssh ausente) y el simulador volvia a la rama `M0_SIN_HORARIOS` con produccion sirviendo dos
 * horarios.
 *
 * La leccion que codifica esta lista: arreglar una ruta absoluta escribiendo otra ruta absoluta no
 * arregla nada, solo corre la fecha en que vuelve a romperse. Lo que corta la cadena es PREGUNTAR
 * donde esta, no declarar donde deberia estar. `ONIA_VPS_KEY` va primero porque es el mismo nombre
 * que ya usa `.claude/skills/ver-videos/scripts/transcribe.sh` para lo mismo.
 */
export function rutasDeLlaveVps(env = process.env, home = homedir()) {
  const rutas = [];
  if (env && env.ONIA_VPS_KEY) rutas.push(env.ONIA_VPS_KEY);
  if (home) rutas.push(nodePath.join(home, ".ssh", NOMBRE_LLAVE_VPS));
  rutas.push(`/root/.ssh/${NOMBRE_LLAVE_VPS}`); // nodo-casa (WSL, root)
  return rutas;
}

/**
 * La primera ruta de `rutasDeLlaveVps` que EXISTE, o null. Null no es un fracaso: se sale a
 * preguntar sin `-i` y ssh resuelve por su `config` o su agente, que es lo que pasa en una maquina
 * bien configurada. Rendirse aca seria volver al silencio que este escalon vino a romper.
 */
export function resolverLlaveVps(deps = {}) {
  const existe = deps.existsSync || existsSync;
  const home = Object.prototype.hasOwnProperty.call(deps, "home") ? deps.home : homedir();
  for (const ruta of rutasDeLlaveVps(deps.env || process.env, home)) {
    try {
      if (existe(ruta)) return ruta;
    } catch {
      /* una ruta ilegible es una ruta que no sirve: seguir con la siguiente */
    }
  }
  return null;
}

/**
 * Saca UNA variable del texto de un `webhook.env`: es `CLAVE=valor` por linea, con el valor
 * entrecomillado (asi lo escribe el lanzador). Las comillas se sacan o se filtran al guion que
 * ve el prospecto. Pura a proposito: la usan el escalon local y el remoto, asi que el valor se
 * interpreta IGUAL venga del disco o del VPS.
 */
function valorDeEnv(texto, clave) {
  for (const linea of String(texto).split("\n")) {
    const limpia = linea.trim();
    if (!limpia || limpia.startsWith("#") || !limpia.startsWith(`${clave}=`)) continue;
    const crudo = limpia.slice(clave.length + 1).trim();
    const sinComillas = crudo.replace(/^(["'])([\s\S]*)\1$/, "$2");
    return sinComillas.trim() || null;
  }
  return null;
}

/** El texto del `webhook.env` desplegado en el disco de ESTA maquina, o null si no se puede leer. */
function leerDelEnvDesplegado(path, deps = {}) {
  const read = deps.readFileSync || readFileSync;
  try {
    return String(read(path, "utf8"));
  } catch {
    return null;
  }
}

/**
 * Lo mismo (el TEXTO entero, o null), pero preguntandole al VPS. Existe porque este carril se mudo a nodo-casa (WSL) el
 * 2026-09-06 y alla `/opt/onia/bot` NO EXISTE: el escalon local devolvia null y el simulador
 * volvia a medir `M0_SIN_HORARIOS` con produccion sirviendo dos horarios. Un instrumento atado a
 * la ruta absoluta de UNA maquina deja de medir el dia que su loop se muda, y el numero que
 * reporta sigue saliendo verde.
 *
 * Solo se intenta sobre la ruta REAL de produccion: preguntarle al VPS por un archivo de prueba
 * no significa nada, y ademas mantiene hermeticos a los casos que inyectan rutas falsas.
 */
function leerDelEnvRemoto(path, deps = {}) {
  const correr = deps.spawnSync || spawnSync;
  // La llave se RESUELVE (ver `rutasDeLlaveVps`): fijarla rompio este escalon en cada mudanza de
  // maquina. Sin llave en disco no se abandona — se sale sin `-i` y ssh usa su config o su agente.
  const llave = resolverLlaveVps(deps);
  const args = ["-o", "BatchMode=yes", "-o", "ConnectTimeout=15"];
  if (llave) args.push("-i", llave);
  args.push(VPS_DEL_BOT, `cat ${path}`);
  let r;
  try {
    r = correr("ssh", args, { encoding: "utf8", timeout: 30_000 });
  } catch {
    return null;
  }
  if (!r || r.status !== 0 || !r.stdout) return null;
  return String(r.stdout);
}

/**
 * Los horarios con los que produccion esta contestando AHORA, por el mismo camino que el bot vivo:
 * `--slots` a mano · si no `ONIA_BOT_SLOTS` del entorno · si no el `webhook.env` DESPLEGADO, que es
 * de donde produccion la saca (el lanzador la pasa con `docker exec -e`). Ese orden es el que
 * resuelve produccion: lo que ya esta en el entorno gana, porque es lo ultimo que se aplica.
 *
 * Sin el ultimo escalon el simulador caia en la rama `M0_SIN_HORARIOS` mientras produccion tenia
 * DOS horarios cargados — o sea que el "3/3" que este carril reporta cada vuelta certificaba un
 * guion que ningun prospecto ve. Medido el 2026-09-04: `webhook.env` y el proceso vivo tenian los
 * dos slots, y el simulador corrido como lo manda el prompt del carril seguia sirviendo la otra
 * rama. La vuelta anterior habia agregado el AVISO y el aviso salio impreso dos veces sin que
 * nadie cambiara de rama: avisar no alcanza cuando el que lee es el mismo que ya confio.
 *
 * Es el mismo eslabon que `knowledge.onia.json`, un escalon mas arriba: ahi el instrumento cargaba
 * otra CONFIG que produccion; aca cargaba bien la config y erraba la entrada que ELIGE LA RAMA.
 * Cuando no hay horarios por ningun lado NO se lo calla: lo dice, igual que con el documento.
 */
export function cargarSlotsPublicados(args = {}, deps = {}) {
  const env = deps.env || process.env;
  // `ONIA_SIM_WEBHOOK_ENV` fija el archivo desde AFUERA del proceso (3-oct): los tests que corren el
  // simulador en un hijo no tienen `deps`, y sin esto el hijo iba a buscar el webhook.env VIVO —por
  // ssh fuera del VPS (30 s), del disco en el VPS— y el resultado del gate dependia de produccion.
  const envFile = deps.envFile || String(env.ONIA_SIM_WEBHOOK_ENV || "").trim() || WEBHOOK_ENV_DESPLEGADO;
  // El cuarto escalon solo aplica a la ruta REAL: ver `leerDelEnvRemoto`.
  const esLaDesplegada = envFile === WEBHOOK_ENV_DESPLEGADO;
  // El reloj se inyecta (`deps.now`): un caso escrito con su propio instante —el `receivedAt` de sus
  // mensajes— tiene que juzgar los horarios contra ESE instante, no contra el dia en que alguien lo
  // corre. Sin esto los horarios fijos de un test vencen solos y lo ponen rojo sin tocar el bot
  // (paso el 2-oct con cinco archivos de la pauta). Sin `now` es el reloj de la maquina, como antes.
  const now = Number.isFinite(deps.now) ? deps.now : Date.now();

  // `--slots` a mano es "simulá como si el bot ofreciera ESTOS": se ofrecen, con la agenda que haya.
  const aMano = String(args.slots || "").trim();
  if (aMano) return { slots: parseSlotsSpec(aMano, { now }), elegibles: slotsElegibles(aMano, { now }), agenda: null, aviso: null };

  // El webhook.env desplegado se lee UNA vez (local, o del VPS si es la ruta real) y de ahi salen
  // las claves que eligen la rama: los horarios Y la agenda. Leer cada clave por separado eran
  // cuatro SSH de 15 s cuando el VPS no contesta.
  let archivo;
  const delArchivo = (clave) => {
    if (archivo === undefined) {
      archivo = leerDelEnvDesplegado(envFile, deps) ?? (esLaDesplegada ? leerDelEnvRemoto(envFile, deps) : null);
    }
    return archivo === null ? null : valorDeEnv(archivo, clave);
  };
  const leer = (clave) => String(env[clave] ?? "").trim() || String(delArchivo(clave) || "").trim();

  // LA AGENDA ELIGE LA RAMA ANTES QUE LOS HORARIOS (2-oct). Sin `ONIA_BOT_AGENDA=calcom` (y Cal.com
  // configurado) produccion no ofrece horarios aunque el cron los deje en webhook.env: el prospecto
  // recibe M0_PERSONA. Medir con horarios seria medir una rama que nadie ve — el falso verde que
  // este archivo ya pago tres veces.
  // Corto circuito: si el entorno YA dice la agenda y no es `calcom`, Cal.com no decide nada y no se
  // va a buscar el archivo (ni el VPS) para leer dos claves que no se usan.
  const agendaPedida = leer(AGENDA_ENV);
  const agenda = agendaDelEntorno(
    agendaPedida.toLowerCase() === "calcom"
      ? { [AGENDA_ENV]: agendaPedida, CALCOM_BASE_URL: leer("CALCOM_BASE_URL"), CALCOM_BOT_EVENT_TYPE_ID: leer("CALCOM_BOT_EVENT_TYPE_ID") }
      : { [AGENDA_ENV]: agendaPedida },
  );
  const raw = agenda.modo === "propia" ? leer("ONIA_BOT_SLOTS") : "";
  const sinFuente = archivo === null && !String(env.ONIA_BOT_SLOTS || env[AGENDA_ENV] || "").trim();

  if (!raw) {
    // Sin poder leer la config desplegada NO se sabe que rama sirve produccion: se dice. Leida y sin
    // agenda propia, la rama sin horarios ES la de produccion y no hay nada que avisar.
    if (!sinFuente && agenda.modo === "persona") return { slots: null, elegibles: null, agenda: "persona", aviso: null };
    // Se nombra TAMBIEN el intento remoto: sin eso el aviso se lee como "esta maquina no tiene el
    // archivo" y manda a arreglarlo copiando un `webhook.env` a mano, que es el lugar equivocado.
    const donde = esLaDesplegada ? `${envFile}, ni ${VPS_DEL_BOT} por ssh` : envFile;
    return {
      slots: null,
      elegibles: null,
      agenda: agenda.modo === "persona" ? "persona" : null,
      aviso: `⚠️ sin horarios (ni --slots, ni ONIA_BOT_SLOTS/${AGENDA_ENV}, ni ${donde}) — corre sin agenda propia; si produccion ofrece horarios, esta es OTRA rama del guion`,
    };
  }
  // Los `elegibles` viajan al lado del par porque el motor acepta MAS de lo que ofrece: el cron
  // publica cinco horarios y el guion nombra dos. Si el simulador cargara solo el par mediria una
  // conversacion que produccion no tiene — y este carril ya pago una vez el instrumento que no
  // mide lo que corre.
  return { slots: parseSlotsSpec(raw, { now }), elegibles: slotsElegibles(raw, { now }), agenda: null, aviso: null };
}

export function buildConfig(args = {}, deps = {}) {
  let base = DEFAULT_CONFIG;
  const { slots, elegibles, agenda, aviso: avisoSlots } = cargarSlotsPublicados(args, deps);
  if (avisoSlots) (deps.warn || console.error)(avisoSlots);
  if (slots) base = createBotConfig({ slots, slotsElegibles: elegibles || [] });
  else if (agenda === "persona") base = createBotConfig({ agenda: { modo: "persona" } });
  if (args.sinConocimiento) return base;

  const { data, aviso } = cargarConocimientoPublicado(deps);
  if (!data) {
    (deps.warn || console.error)(aviso);
    return base;
  }
  return applyKnowledge(base, data);
}

function plusMinutes(iso, minutes) {
  return new Date(Date.parse(iso) + minutes * 60000).toISOString();
}

function describeTurn(turn) {
  if (turn.op === "human_takeover") return "[SERGIO responde por su cuenta]";
  if (turn.kind === "voice") return turn.transcript ? `[audio] ${turn.transcript}` : "[audio ilegible]";
  if (turn.kind === "attachment") return "[archivo adjunto]";
  return turn.text;
}

function indent(text) {
  return String(text)
    .split("\n")
    .map((line) => `      ${line}`)
    .join("\n");
}

/**
 * La config con la que corre cada guion.
 *
 * - Guiones de ONIA: la config de venta, o sea con el documento publicado (`buildConfig`).
 * - Guion de una org CLIENTE: SU knowledge y el modo recepcionista, igual que cuando la fila
 *   publicada llega por la fuente "db".
 */
export function configParaGuion(name, config, configPelado = config) {
  const script = SCRIPTS[name];
  if (!script?.conocimiento) return config;
  // Sobre `configPelado`, NO sobre la de Onia: el conocimiento de una org no BORRA lo que ya
  // estuviera cargado, lo pisa campo por campo. Armado encima del nuestro, la ferreteria se
  // quedaba con nuestro M4_BODY ("Bs 320 … onia.com.bo/precios") esperando la rama de precio.
  return asRecepcionista(applyKnowledge(configPelado, script.conocimiento), script.conocimiento);
}

/**
 * El simulador llama a `step()` directo: NO pasa por `runTurn`, que es donde el producto
 * reemplaza el "Listo, agendado" por la version honesta cuando la reserva no sale. Sin esto el simulador
 * promete MAS que el bot (medido el 2026-09-12 contra los mensajes reales de Chatwoot), y es el
 * instrumento con el que este carril mide su objetivo cada vuelta.
 *
 * Se importa la MISMA decision y el MISMO texto que usa el camino vivo — nunca una copia.
 */
function conElCierreDelProducto(replies, stageBefore, nextState, config) {
  const { motivo } = motivoEnSeco({
    stageBefore,
    stageAfter: nextState.botStage,
    scheduledAt: nextState.scheduledAt,
    calendarEventId: nextState.calendarEventId,
  });
  if (motivo !== "sin_config") return { replies, nextState };
  return reservaQueNoSalio({ replies, nextState, config, reason: "sin_config" });
}

function runScript(name, baseConfig, basePelada) {
  const script = SCRIPTS[name];
  const config = configParaGuion(name, baseConfig, basePelada);
  const events = [];
  let state = createState({ channel: "sim", contactRef: `sim-${name}`, pieceKey: "lucia-d03-reel-siat", sourceCampaign: "lucia-dentalgest-jul2026" });
  // DERIVADO del lado que el guion declara, nunca tipeado: ver `instanteDeAtencion`. Un guion
  // sin `horario` no arranca — asi una rama nueva tiene que decir en cual de las dos corre.
  let clock = instanteDeAtencion(script.horario);

  for (const turn of script.turns) {
    if (turn.op === "human_takeover") {
      state = markHumanTakeover(state, clock);
      events.push({ turn: describeTurn(turn), stageBefore: state.botStage, stageAfter: state.botStage, replies: [], notes: ["human_took_over=true"], sideEffects: [] });
      clock = plusMinutes(clock, 2);
      continue;
    }
    const stageBefore = state.botStage;
    const result = step(state, { ...turn, receivedAt: clock, externalMessageId: `${name}-${events.length}` }, { config });
    // El cierre del producto puede MOVER la conversacion (la reserva que no sale la pasa a la
    // persona): el turno siguiente tiene que correr sobre ese estado, igual que en vivo.
    const cierre = conElCierreDelProducto(result.replies, stageBefore, result.nextState, config);
    state = cierre.nextState;
    events.push({
      turn: describeTurn(turn),
      stageBefore,
      stageAfter: state.botStage,
      replies: cierre.replies,
      notes: result.notes,
      sideEffects: result.sideEffects.map((effect) => effect.type),
    });
    clock = plusMinutes(clock, 2);
  }

  // Al cierre: ¿corresponde el follow-up unico 22 h despues?
  const followUp = buildFollowUp(state, plusMinutes(clock, 22 * 60), config);
  return { name, title: script.title, events, finalState: state, followUp };
}

function printScript(run) {
  console.log(`\n${"=".repeat(78)}`);
  console.log(`GUION ${run.name} — ${run.title}`);
  console.log("=".repeat(78));
  for (const event of run.events) {
    console.log(`\n  > PROSPECTO: ${event.turn}`);
    if (event.stageBefore !== event.stageAfter) console.log(`    [estado] ${event.stageBefore} -> ${event.stageAfter}`);
    if (event.replies.length === 0) console.log("    (el bot NO responde)");
    for (const reply of event.replies) {
      const guardrail = reply.guardrail && !reply.guardrail.ok ? ` guardrail=BLOQUEADO(${reply.guardrail.violations.join(",")})` : "";
      console.log(`    [bot ${reply.templateKey} · ${reply.replySource} · ${reply.deliveryStatus}${guardrail}]`);
      if (reply.text === LLM_PENDING) {
        console.log(indent("(rama LLM: sin cliente de LLM inyectado. El ejecutor llama al modelo,"));
        console.log(indent(" pasa el texto por enforceGuardrails() y si falla usa este fallback:)"));
        console.log(indent(`FALLBACK: ${reply.fallbackText}`));
      } else {
        console.log(indent(reply.text));
      }
      if (reply.options) console.log(indent(`[botones] ${reply.options.map((option) => option.title).join(" · ")}`));
    }
    if (event.sideEffects.length) console.log(`    [efectos] ${event.sideEffects.join(", ")}`);
    if (event.notes.length) console.log(`    [notas] ${event.notes.join(", ")}`);
  }
  const state = run.finalState;
  console.log(`\n  ---- estado final --------------------------------------------------------`);
  console.log(`  bot_stage=${state.botStage} · qualification=${JSON.stringify(state.qualification)}`);
  console.log(`  scheduled_label=${state.scheduledLabel || "null"} · human_took_over=${state.humanTookOver} · opt_out_at=${state.optOutAt || "null"}`);
  console.log(`  off_script_count=${state.offScriptCount} · qualify_asks=${state.qualifyAsks} · followup_step=${state.followupStep}`);
  console.log(`  follow-up 22 h despues: ${run.followUp ? "SI (M3)" : "no corresponde"}`);
}

async function interactive(config, contactRef) {
  let state = createState({ channel: "sim", contactRef });
  // AHORA, no una fecha fija: el modo interactivo es con lo que este carril mira si el bot esta
  // vivo, y un reloj clavado en julio le colgaba "estoy respondiendo fuera de horario" a las
  // respuestas aunque el que mira estuviera sentado adentro de la franja. Ademas convivia con los
  // slots, que SI se calculan contra hoy: dos relojes en la misma pantalla.
  let clock = new Date().toISOString();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: "vos > " });
  console.log("Simulador del chatbot de ONIA. Escribi 'DEMO' para arrancar. '/salir' para terminar,");
  console.log("'/humano' para simular que Sergio contesta, '/estado' para ver la fila.\n");
  rl.prompt();
  for await (const line of rl) {
    const text = line.trim();
    if (text === "/salir") break;
    if (text === "/estado") {
      console.log(JSON.stringify(state, null, 2));
      rl.prompt();
      continue;
    }
    if (text === "/humano") {
      state = markHumanTakeover(state, clock);
      console.log("  [Sergio tomó la conversación: el bot se calla]");
      rl.prompt();
      continue;
    }
    const stageBefore = state.botStage;
    const result = step(state, { text, receivedAt: clock }, { config });
    state = conElCierreDelProducto(result.replies, stageBefore, result.nextState, config).nextState;
    clock = plusMinutes(clock, 2);
    if (result.replies.length === 0) console.log("  (el bot NO responde)");
    for (const reply of result.replies) {
      console.log(`  [${reply.templateKey}]`);
      console.log(indent(reply.text === LLM_PENDING ? reply.fallbackText : reply.text));
    }
    if (result.notes.length) console.log(`  [notas] ${result.notes.join(", ")}`);
    rl.prompt();
  }
  rl.close();
}

// Guarda de import: sin esto, `import ... from "./simulate.mjs"` en un test arrancaba el modo
// interactivo y se colgaba leyendo stdin (la misma trampa que ya costo una vuelta en
// scripts/demo_agendada_real.mjs el 2026-09-03).
const ejecutadoDirecto = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;

if (ejecutadoDirecto) {
  const args = parseArgs(process.argv.slice(2));
  const config = buildConfig(args);
  const configPelado = buildConfig({ ...args, sinConocimiento: true });

  if (args.list) {
    for (const [name, script] of Object.entries(SCRIPTS)) console.log(`${name.padEnd(18)} ${script.title}`);
  } else if (args.all || args.script) {
    const names = args.all ? Object.keys(SCRIPTS) : [args.script];
    const runs = names.map((name) => {
      if (!SCRIPTS[name]) {
        console.error(`guion desconocido: ${name}. Probá --list`);
        process.exit(1);
      }
      return runScript(name, config, configPelado);
    });
    if (args.json) console.log(JSON.stringify(runs, null, 2));
    else runs.forEach(printScript);
  } else {
    await interactive(config, args.contact);
  }
}
