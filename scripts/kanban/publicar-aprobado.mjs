#!/usr/bin/env node
// Publica la pieza de una tarea APROBADA. Es el cable que faltaba entre
// "Sergio contesta `ok <id>`" y que la pieza salga de verdad.
//
//   node scripts/kanban/publicar-aprobado.mjs t_ab12cd34
//   node scripts/kanban/publicar-aprobado.mjs --autotest
//
// POR QUE EXISTE. Medido el 2026-09-04: `ok <id>` corria `kanban unblock` y NADA
// mas. La tarea quedaba desbloqueada y la pieza se quedaba en el disco. Peor: los
// loops habian aprendido a pedirle a Sergio que publicara A MANO desde el
// telefono ("descargalas en orden, guardalas en la galeria y subilas"), asi que
// el circuito entero terminaba en una tarea manual que no ocurre. Resultado
// medido: 1.196 imagenes generadas en 3 dias, 0 publicadas.
//
// COMO SE USA DESDE UN LOOP. La tarea que pide el OK lleva UNA linea asi en el
// cuerpo (y solo una):
//
//   PUBLICAR: cuenta=lucia imagenes=/ruta/al/dir-o-archivo.png texto=/ruta/brief.json
//
// Sin esa linea esto no publica nada y sale con codigo 2 — que NO es un fallo:
// la mayoria de las tareas del tablero no son piezas.
//
// 🔴 LA LINEA ES DATOS, NO UN COMANDO. El cuerpo de la tarea lo escribe un loop
// (un LLM). Ejecutar texto que viene de ahi seria darle una shell. Por eso se
// parsean TRES campos, se validan contra una lista blanca de cuentas y contra el
// disco, y se invoca el publicador con execFile (sin shell, sin interpolacion).

import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync, readdirSync } from 'node:fs';
import { isAbsolute, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
// Este archivo vive en DOS layouts: `scripts/kanban/` en el repo y, desplegado
// por sincronizar.sh, plano en /root/bin. Resolver solo con '..' funcionaba en
// el repo y apuntaba a /root/postiz_schedule.mjs en el VPS — o sea andaba en la
// laptop y fallaba justo donde importa.
const CANDIDATOS = [
  process.env.POSTIZ_SCHEDULE,
  join(AQUI, '..', 'postiz_schedule.mjs'),
  join(AQUI, 'onia-postiz-schedule.mjs'),
].filter(Boolean);
const PUBLICADOR = CANDIDATOS.find((p) => existsSync(p)) || CANDIDATOS[CANDIDATOS.length - 1];
const KEY_FILE = process.env.POSTIZ_KEY_FILE || '/root/.postiz-api-key';

// Lista blanca. Los ids salen de la API de Postiz
// (GET /public/v1/integrations), verificados el 2026-09-04. Un nombre que no
// este aca no se publica: asi una tarea no puede mandar una pieza de Lucia a la
// cuenta de la marca por un typo, ni inventar una cuenta.
const CUENTAS = {
  oniahq: 'cmsw091nx0001lq9c8kr6dsg8', // Onia | Sistemas con IA
  sergio: 'cmt39kug00022lq9cnw5z12wb', // Sergio Urcullo (marca personal)
  lucia: 'cmt1sv4eh001alq9cl3y6q7es', // Lucia Antelo
};

const IMAGEN = /\.(png|jpe?g)$/i;

// Lista blanca de destinos de DEPLOY. Mismo criterio que CUENTAS: el cuerpo de
// la tarea elige un NOMBRE, nunca una ruta ni un comando. La ruta vive aca, en
// el codigo, asi una tarea no puede hacer correr cualquier cosa como root.
//
// POR QUE EXISTE, y es el mismo agujero que las 1.196 imagenes sin publicar, un
// escalon mas abajo. El arreglo del 2026-09-04 cableo `ok <id>` -> publicar una
// PIEZA, y dejo afuera la otra cosa que Sergio aprueba por Telegram: un DEPLOY.
// Medido el 2026-09-05 14:4x UTC sobre t_4cd13524 (el pedido de publicar
// onia.com.bo, avisado y esperando desde las 02:59):
//
//   node /root/bin/onia-publicar-aprobado.mjs t_4cd13524  ->  codigo 2
//   {"publicable":false,"motivo":"la tarea no trae linea PUBLICAR:"}
//
// y SOUL.md ensena que el 2 "es lo normal: segui". O sea: Sergio contesta `ok`,
// ve el tilde verde de "desbloqueada", y onia.com.bo NO se publica. La tarea
// queda en `ready` y ningun loop la ejecuta, porque desplegar es decision suya.
// Resultado: 30 arreglos de la landing y 5 de la plataforma sin llegar al
// cliente, con el pedido escrito, el aviso entregado y el comando listo.
// El BOT entro el 2026-09-05, y su ausencia era el mismo agujero un escalon mas
// abajo: se cablearon landing y plataforma, y la tercera cosa que Sergio aprueba
// por Telegram quedo afuera. Ese dia habia DOS tareas `ready` pidiendo el mismo
// swap sobre un bot que le decia "en construccion" a 2 de los 5 rubros que se
// venden. Los tres publicadores comparten la propiedad que los hace no caducar:
// no reciben argumentos y derivan que desplegar al ejecutarse.
// Exportada a propósito: es la lista blanca de destinos, y `deploy_sin_pedido.mjs` deriva de
// ella el universo de destinos que tiene que vigilar. Copiarla allá la volvería una segunda
// fuente que coincide por diligencia y no por construcción — el día que entre un destino
// nuevo acá, el otro gate no lo pediría y nadie se enteraría.
export const DESTINOS = {
  landing: '/opt/onia-landing/_deploy/publicar.sh',
  plataforma: '/opt/onia-platform/_deploy/publicar.sh',
  bot: '/opt/onia/bot/_deploy/publicar.sh',
  // El EMISOR SIAT, el cuarto y el que faltaba. Agregado el 2026-09-08: era el
  // unico destino de produccion sin circuito, asi que `DESPLEGAR: siat` moria
  // aca con "destino desconocido" y el `ok` de Sergio Urcullo devolvia tilde
  // verde sin desplegar nada. Costo medido: el arreglo del CUFD (a28b3689)
  // llevaba CUATRO DIAS en main sin llegar al archivo que el VPS ejecuta, y con
  // el emisor viejo las etapas VI y IX de la Fase 1 vuelven a fallar.
  // Las DOS listas blancas van juntas: esta y la del ejecutor
  // (scripts/kanban/desplegar-en-segundo-plano.sh). Cablear solo esta deja el
  // fallo peor de los dos — la primera contesta exito y la segunda rechaza
  // despues, asi que el aviso dice "arranco el deploy" y no arranca nada.
  siat: '/opt/onia-siat/_deploy/publicar.sh',
};

// El deploy corre en SEGUNDO PLANO a proposito. Un build de Next tarda minutos y
// el que nos llama corta antes (telegram-entrada.py mata a los 360 s): matar un
// swap a mitad deja produccion en un estado que nadie pidio. Se lanza suelto, se
// contesta "arranco", y el runner avisa por Telegram como termino.
// Mismos dos layouts que PUBLICADOR: `scripts/kanban/` en el repo, y plano en
// /root/bin cuando lo despliega sincronizar.sh (que lo renombra, como a todos).
const RUNNER = [
  join(AQUI, 'desplegar-en-segundo-plano.sh'),
  join(AQUI, 'onia-desplegar-fondo.sh'),
].find((p) => existsSync(p));

export function parsearDespliegue(cuerpo) {
  const lineas = String(cuerpo || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^DESPLEGAR:/i.test(l));
  if (!lineas.length) return null;

  const destino = (lineas[0].slice(lineas[0].indexOf(':') + 1).trim().split(/\s+/)[0] || '').toLowerCase();
  if (!DESTINOS[destino]) {
    throw new Error(`destino desconocido "${destino}" (validos: ${Object.keys(DESTINOS).join(', ')})`);
  }
  return { destino, script: DESTINOS[destino], varias: lineas.length > 1 };
}

export function parsearLinea(cuerpo) {
  // La primera linea PUBLICAR: gana. Dos lineas serian dos publicaciones y
  // ninguna forma de saber cual quiso el loop — se toma una y se avisa.
  const lineas = String(cuerpo || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^PUBLICAR:/i.test(l));
  if (!lineas.length) return null;

  const campos = {};
  for (const m of lineas[0].slice(lineas[0].indexOf(':') + 1).matchAll(/(\w+)=(\S+)/g)) {
    campos[m[1].toLowerCase()] = m[2];
  }
  const faltan = ['cuenta', 'imagenes', 'texto'].filter((k) => !campos[k]);
  if (faltan.length) throw new Error(`la linea PUBLICAR: no trae ${faltan.join(', ')}`);
  if (!CUENTAS[campos.cuenta]) {
    throw new Error(`cuenta desconocida "${campos.cuenta}" (validas: ${Object.keys(CUENTAS).join(', ')})`);
  }
  for (const k of ['imagenes', 'texto']) {
    // Rutas absolutas y sin "..": una relativa depende del cwd del que llame y
    // un ".." sale del arbol de trabajo.
    if (!isAbsolute(campos[k]) || campos[k].includes('..')) {
      throw new Error(`${k} tiene que ser una ruta absoluta sin ".." (vino "${campos[k]}")`);
    }
  }
  if (!/\.json$/i.test(campos.texto)) throw new Error('texto tiene que ser un .json con el caption');
  return { cuenta: campos.cuenta, integracion: CUENTAS[campos.cuenta], imagenes: campos.imagenes, texto: campos.texto, varias: lineas.length > 1 };
}

/**
 * Elige QUÉ hace el `ok`: publicar una pieza, desplegar un destino, o nada.
 *
 * Vive aparte de `main()` porque la decisión es lo único que se puede probar sin
 * tocar producción: `main()` spawnea el deploy o sube láminas de verdad.
 */
export function elegirCamino(cuerpo) {
  // Las DOS se preguntan antes de decidir. Hasta el 2026-09-12 esto era
  // `parsearLinea()` a secas y su excepcion se llevaba puesto el deploy: una CITA
  // del recuento envuelta ("hay que\npublicar: 3 arreglo(s)") entraba por el
  // filtro /^PUBLICAR:/i y el `ok` de Sergio Urcullo no publicaba nada. Ver el
  // autotest "UNA CITA NO ES UNA ORDEN".
  let pieza = null;
  let errPieza = null;
  try { pieza = parsearLinea(cuerpo); } catch (e) { errPieza = e; }

  let deploy = null;
  let errDeploy = null;
  try { deploy = parsearDespliegue(cuerpo); } catch (e) { errDeploy = e; }

  // Una PUBLICAR: bien formada es deliberada: nadie cita por accidente una linea
  // con cuenta=, imagenes= y texto=. Gana, como siempre.
  if (pieza) return { modo: 'pieza', pieza };

  // Una PUBLICAR: que NO parsea, con una orden de destino valida al lado, es una
  // cita. La orden explicita gana — pero el descarte se DEVUELVE, para que quien
  // si quiso publicar una pieza y la escribio mal lo lea en la salida.
  if (deploy) return { modo: 'deploy', deploy, citaIgnorada: errPieza?.message || null };

  // Sin destino que atender, una orden mal escrita vuelve a ser un error ruidoso.
  if (errPieza) throw errPieza;
  if (errDeploy) throw errDeploy;
  return { modo: 'nada' };
}

export function validarEnDisco(pieza) {
  if (!existsSync(pieza.texto)) throw new Error(`no existe el brief ${pieza.texto}`);
  const brief = JSON.parse(readFileSync(pieza.texto, 'utf8'));
  if (!brief.caption || !String(brief.caption).trim()) throw new Error(`${pieza.texto} no trae "caption"`);
  if (!existsSync(pieza.imagenes)) throw new Error(`no existe ${pieza.imagenes}`);

  if (statSync(pieza.imagenes).isDirectory()) {
    const slides = readdirSync(pieza.imagenes).filter((f) => /^slide-\d+\.png$/.test(f));
    if (!slides.length) throw new Error(`${pieza.imagenes} no tiene slide-N.png`);
    return { modo: '--slides', laminas: slides.length, caption: brief.caption };
  }
  if (!IMAGEN.test(pieza.imagenes)) throw new Error(`${pieza.imagenes} no es png/jpg`);
  // Un PNG de 0 bytes es el fallo tipico de un render a medias, y publicado se
  // ve como una pieza rota en el feed.
  if (statSync(pieza.imagenes).size < 1024) throw new Error(`${pieza.imagenes} pesa menos de 1 KB (render a medias?)`);
  return { modo: '--image', laminas: 1, caption: brief.caption };
}

// Estados en los que una tarea sigue VIVA y su `ok` puede ejecutar algo.
//
// 🔴 LISTA BLANCA A PROPOSITO, y la direccion importa. Enumerar los estados
// CERRADOS (archived, done) falla ABIERTO: el dia que el tablero agregue
// "cancelled" o "expired", el boton del telefono de Sergio Urcullo lo trataria
// como vivo y desplegaria. Enumerando los VIVOS, un estado que no conozco se
// RECHAZA — y ese fallo es visible (sale un motivo por pantalla) en vez de mudo.
// Sacados del propio tablero el 2026-09-11:
//   grep -rhoE 'status *(==|in) *[^)]*' plugins/kanban/ | grep -oE '"[a-z_]+"'
export const ESTADOS_VIVOS = new Set([
  'ready', 'blocked', 'todo', 'triage', 'review', 'running', 'scheduled',
]);

// Devuelve null si la tarea puede ejecutar, o el MOTIVO si no.
// Pura a proposito: es lo unico que el autotest puede clavar sin tocar el tablero.
export function motivoParaNoEjecutar(estado) {
  const e = String(estado ?? '').trim().toLowerCase();
  // Sin estado no es "seguí": es "no pude preguntar". Un deploy a produccion no
  // se dispara sobre una duda.
  if (!e) return 'la tarea no dice en que estado esta (no pude leer "status" del tablero)';
  if (ESTADOS_VIVOS.has(e)) return null;
  if (e === 'archived' || e === 'done') {
    return `la tarea esta ${e === 'archived' ? 'ARCHIVADA' : 'CERRADA'} (status=${e}): su "ok" ya no vale`;
  }
  return `no conozco el estado "${e}", asi que no ejecuto nada (estados vivos: ${[...ESTADOS_VIVOS].join(', ')})`;
}

// El interprete que habla con el tablero. Vive SOLO en el VPS: es el MISMO
// archivo con el que el chequeo de arranque de los loops identifica a esa
// maquina, asi que por construccion no existe en nodo-casa — donde corren los
// cuatro loops desde el 07-sep.
export const PY_TABLERO = process.env.PY_HERMES || '/usr/local/lib/hermes-agent/venv/bin/python';

// NO MEDIDO. Tiene codigo propio a proposito: 2 es "no habia nada que hacer" y 3
// es "la tarea esta cerrada" — las dos son respuestas REALES del tablero, y esta
// no lo es. Fundirla con cualquiera de ellas seria el mismo bug con otro
// disfraz.
export const NO_MEDIDO = 4;

/**
 * `null` = puedo preguntarle al tablero. Un string = NO pude preguntar, y ese
 * string trae el remedio.
 *
 * POR QUE EXISTE. Medido el 2026-09-27 desde nodo-casa: `ONIA_DESPLEGAR_DRY=1
 * node /root/bin/onia-publicar-aprobado.mjs t_60df5009` moria con `spawnSync
 * /usr/local/lib/hermes-agent/venv/bin/python ENOENT` y exit 1 — un ENOENT
 * pelado, sin nombrar la maquina ni el remedio; el mismo comando en el VPS
 * contestaba `{"desplegando":true,"destino":"bot","seco":true}`.
 *
 * El simulacro en seco es el UNICO metodo para saber si un pedido de deploy es
 * accionable ANTES de que Sergio Urcullo firme. Un loop que lo corre desde casa
 * lee exit 1 y puede concluir que su `ok` no publicaria — cuando el circuito
 * esta sano. Es "no pude preguntar" leido como "me dijeron que no", sobre el
 * unico camino que decide si algo sale a produccion.
 *
 * Se queda en NO MEDIDO en vez de delegar la consulta por SSH: este script
 * PUBLICA A PRODUCCION, y ensenarle a operar desde otra maquina agranda esa
 * superficie por una comodidad de diagnostico. El comando remoto se NOMBRA para
 * que lo corra quien lo necesite, con su propio SSH.
 */
export function motivoSinTablero(py, hayInterprete) {
  if (hayInterprete) return null;
  return `no pude preguntarle al tablero desde esta maquina: no existe el interprete ${py}. `
    + 'Esto NO dice que el pedido este roto ni que el "ok" no publicaria: dice que aca no se puede medir. '
    + `Lo que si contesta: /root/bin/onia-vps.sh bash -lc 'ONIA_DESPLEGAR_DRY=1 node /root/bin/onia-publicar-aprobado.mjs <id>'`
    + ' — o exporta PY_HERMES si tenes el interprete en otra ruta.';
}

function tareaDelTablero(tid) {
  const py = PY_TABLERO;
  const salida = execFileSync(
    py,
    ['-m', 'hermes_cli.main', 'kanban', '--board', process.env.ONIA_TABLERO || 'onia', 'show', tid, '--json'],
    { encoding: 'utf8', env: { ...process.env, HOME: '/root' }, timeout: 120000 },
  );
  const t = JSON.parse(salida).task || {};
  return { cuerpo: t.body || '', estado: t.status };
}

// Busca el pedido VIVO de un destino, para que el rechazo diga que apretar en vez
// de dejar a Sergio Urcullo con un "no" y nada mas.
//
// TRI-ESTADO a proposito: `null` es "no pude preguntar" y NO se puede leer como
// "no hay ninguno" — son respuestas opuestas y confundirlas manda a abrir un
// pedido duplicado, que es el ruido que hace que el deje de creerle a los avisos.
// La seleccion, aparte de la consulta, para que el autotest la pueda clavar sin
// tocar el tablero. Devuelve null = "no pude leer la lista", [] = "la lei y no
// hay ninguno": son respuestas OPUESTAS y el llamador las dice distinto.
export function pedidosVivosEn(lista, destino) {
  // El `list --json` del tablero devuelve un ARRAY PELADO. Se acepta tambien
  // `{tasks:[...]}` porque la primera version dio por hecho esa forma, salio
  // siempre "no pude consultar" y el consejo quedo mudo sin que nada fallara:
  // un lector que solo entiende UNA forma degrada en silencio.
  const tareas = Array.isArray(lista) ? lista : (Array.isArray(lista?.tasks) ? lista.tasks : null);
  if (!tareas) return null;
  const re = new RegExp(`^DESPLEGAR:\\s*${destino}\\b`, 'im');
  return tareas
    .filter((t) => ESTADOS_VIVOS.has(String(t?.status || '').toLowerCase()) && re.test(String(t?.body || '')))
    .map((t) => t.id);
}

// DEPLOYS ACOPLADOS: `DESPUES-DE: <destino>` en el cuerpo dice "no ejecutes este
// deploy mientras el hermano siga esperando un ok". El caso que lo motivo esta
// contado en el autotest; la forma corta es que dos destinos pueden publicar
// mitades de UNA sola promesa —la vidriera y la caja— y publicar una sola deja
// al cliente mirando un precio que el sistema no le va a cobrar.
//
// Mide una cosa y dice esa: que el pedido hermano sigue VIVO. No afirma "el
// hermano ya esta publicado en produccion" — para saberlo habria que correr su
// publicador en seco, que tarda y vive del otro lado del SSH. La aproximacion es
// honesta porque el acople se rompe en el momento del ok, que es justo lo que
// esto mira.
//
// `lista` se recibe (no se consulta acá) para que el autotest la pueda clavar
// sin tocar el tablero, igual que `pedidosVivosEn`.
export function precondicionPendiente(cuerpo, lista) {
  const linea = String(cuerpo || '')
    .split('\n')
    .map((l) => l.trim())
    .find((l) => /^DESPUES-DE:/i.test(l));
  if (!linea) return null;

  const destino = (linea.slice(linea.indexOf(':') + 1).trim().split(/\s+/)[0] || '').toLowerCase();
  if (!DESTINOS[destino]) {
    throw new Error(`destino desconocido "${destino}" (validos: ${Object.keys(DESTINOS).join(', ')})`);
  }
  const pedidos = pedidosVivosEn(lista, destino);
  // null = no pude leer el tablero. Se CORTA igual: ante un deploy acoplado, la
  // equivocacion barata es no publicar, y la cara es publicar media promesa.
  if (pedidos === null) return { destino, pedidos: null };
  return pedidos.length ? { destino, pedidos } : null;
}

function listaDelTablero() {
  try {
    const py = PY_TABLERO;
    const salida = execFileSync(
      py,
      ['-m', 'hermes_cli.main', 'kanban', '--board', process.env.ONIA_TABLERO || 'onia', 'list', '--json'],
      { encoding: 'utf8', env: { ...process.env, HOME: '/root' }, timeout: 120000 },
    );
    return JSON.parse(salida);
  } catch {
    return null;
  }
}

function pedidoVivoDe(destino) {
  try {
    const py = PY_TABLERO;
    const salida = execFileSync(
      py,
      ['-m', 'hermes_cli.main', 'kanban', '--board', process.env.ONIA_TABLERO || 'onia', 'list', '--json'],
      { encoding: 'utf8', env: { ...process.env, HOME: '/root' }, timeout: 120000 },
    );
    return pedidosVivosEn(JSON.parse(salida), destino);
  } catch {
    return null;
  }
}

function autotest() {
  const ok = (c, m) => { if (!c) throw new Error('AUTOTEST: ' + m); };
  ok(parsearLinea('sin nada aca') === null, 'sin linea PUBLICAR debe dar null');
  const p = parsearLinea('bla\nPUBLICAR: cuenta=lucia imagenes=/tmp/a.png texto=/tmp/b.json\nbla');
  ok(p.integracion === CUENTAS.lucia, 'no resolvio la integracion de lucia');
  ok(p.imagenes === '/tmp/a.png', 'no leyo imagenes');
  const cae = (t, frag) => {
    try { parsearLinea(t); } catch (e) { ok(String(e.message).includes(frag), `esperaba "${frag}", dio "${e.message}"`); return; }
    throw new Error(`AUTOTEST: "${t}" tenia que fallar por ${frag}`);
  };
  cae('PUBLICAR: cuenta=elonmusk imagenes=/tmp/a.png texto=/tmp/b.json', 'cuenta desconocida');
  cae('PUBLICAR: cuenta=lucia imagenes=../../etc/passwd texto=/tmp/b.json', 'absoluta');
  cae('PUBLICAR: cuenta=lucia imagenes=/tmp/a.png texto=/tmp/b.txt', '.json');
  cae('PUBLICAR: cuenta=lucia texto=/tmp/b.json', 'imagenes');
  // El payload con shell adentro se parsea como DATO y muere en la lista blanca,
  // no se ejecuta.
  cae('PUBLICAR: cuenta=$(rm -rf /) imagenes=/tmp/a.png texto=/tmp/b.json', 'cuenta desconocida');

  // ── DESPLEGAR: ────────────────────────────────────────────────────────────
  ok(parsearDespliegue('sin nada aca') === null, 'sin linea DESPLEGAR debe dar null');
  const d = parsearDespliegue('bla\nDESPLEGAR: landing\nbla');
  ok(d.destino === 'landing', 'no leyo el destino landing');
  ok(d.script === DESTINOS.landing, 'no resolvio la ruta del publicador de landing');
  ok(parsearDespliegue('DESPLEGAR: Plataforma').destino === 'plataforma', 'el destino tiene que ser insensible a mayusculas');
  const caeD = (t, frag) => {
    try { parsearDespliegue(t); } catch (e) { ok(String(e.message).includes(frag), `esperaba "${frag}", dio "${e.message}"`); return; }
    throw new Error(`AUTOTEST: "${t}" tenia que fallar por ${frag}`);
  };
  // EL BOT. Es el tercer destino que Sergio aprueba por Telegram, y hasta el
// 2026-09-05 no estaba en la lista blanca: `ok <id>` sobre un pedido de deploy
// del bot devolvia "destino desconocido" y NO desplegaba nada. Ese dia habia
// DOS tareas `ready` pidiendo el mismo swap (t_7340fb5b, t_43e4b9ec) sobre un
// bot que le decia "en construccion" a 2 de los 5 rubros que se venden — el
// 40% de los prospectos — y que ofrecia demos para dentro de 4 h contra la
// regla de "un dia antes". La propia t_7340fb5b lo dejo escrito: "el bot NO
// esta en la lista blanca, asi que un `ok <id>` sobre esta tarea no despliega
// nada". Es el mismo agujero de PIEZA/DEPLOY un escalon mas abajo: se cableo
// la instancia landing/plataforma y se dejo afuera la hermana.
  ok(parsearDespliegue('DESPLEGAR: bot').destino === 'bot', 'el bot tiene que ser un destino valido');
  ok(parsearDespliegue('DESPLEGAR: bot').script === DESTINOS.bot, 'no resolvio la ruta del publicador del bot');
  caeD('DESPLEGAR: produccion', 'destino desconocido');
  // Igual que arriba: el cuerpo lo escribe un LLM. Una ruta o un comando en vez
  // de un nombre muere en la lista blanca, no se ejecuta.
  caeD('DESPLEGAR: /opt/loquesea/publicar.sh', 'destino desconocido');
  caeD('DESPLEGAR: landing; rm -rf /', 'destino desconocido');
  caeD('DESPLEGAR:', 'destino desconocido');
  // El caso que motivo todo esto: un cuerpo con PUBLICAR gana, pero uno SIN
  // PUBLICAR y CON DESPLEGAR ya no se cae al codigo 2.
  ok(parsearLinea('DESPLEGAR: landing') === null, 'DESPLEGAR no es una pieza');
  ok(parsearDespliegue('DESPLEGAR: landing') !== null, 'DESPLEGAR: landing tenia que parsear');

  // ── UNA CITA NO ES UNA ORDEN ───────────────────────────────────────────────
  // Medido el 2026-09-12 sobre el pedido de la plataforma (t_60c884c6, archivado).
  // El metodo vigente de pedidos de deploy EXIGE citar textual el recuento del
  // publicador, y ese recuento dice "hay que publicar: N arreglo(s)...". Al
  // envolver el parrafo, "publicar:" cae al principio de un renglon — y el filtro
  // /^PUBLICAR:/i no distingue una cita envuelta de una orden. Resultado: el
  // camino de piezas ganaba, moria con "no trae cuenta, imagenes, texto" y el
  // deploy NUNCA se intentaba. Nadie escribio una linea PUBLICAR: a proposito:
  // alcanzo con obedecer el metodo y que el wrap cayera mal.
  //
  // Es caro porque falla EN VERDE hacia arriba: `npm run pedido:entregado` da el
  // pedido por vigente y completo (mide el CUERPO, no lo que el brazo ejecuta),
  // Sergio Urcullo aprieta el ok, no pasa nada — y los pedidos que lo esperan por
  // DESPUES-DE quedan trabados detras de un paso que el cree dado.
  const conCita = [
    'Pedido de deploy de la plataforma.',
    '',
    'Recuento citado del publicador: hay que',
    'publicar: 3 arreglo(s) que el cliente ve.',
    '',
    'DESPLEGAR: plataforma',
  ].join('\n');
  ok(parsearDespliegue(conCita)?.destino === 'plataforma', 'la orden DESPLEGAR: estaba y era valida');
  const camino = elegirCamino(conCita);
  ok(camino.modo === 'deploy', `una cita "publicar:" no puede secuestrar un DESPLEGAR: valido (dio "${camino.modo}")`);
  ok(camino.deploy.destino === 'plataforma', 'tenia que desplegar la plataforma');
  // Y la cita ignorada se DICE, no se traga en silencio: si alguien de verdad
  // quiso publicar una pieza y la escribio mal, tiene que enterarse.
  ok(/cuenta, imagenes, texto/.test(camino.citaIgnorada || ''), 'tenia que reportar por que descarto la linea PUBLICAR:');

  // La simetrica, que es la que evita curar de mas: una PUBLICAR: bien formada
  // SIGUE ganando. Nadie cita por accidente una linea con cuenta=, imagenes= y
  // texto= — eso es una orden deliberada.
  const lasDos = 'PUBLICAR: cuenta=lucia imagenes=/tmp/a.png texto=/tmp/b.json\nDESPLEGAR: landing';
  ok(elegirCamino(lasDos).modo === 'pieza', 'una PUBLICAR: bien formada le gana a DESPLEGAR:');

  // Y sin DESPLEGAR: al lado, una PUBLICAR: rota sigue siendo un error ruidoso:
  // curar el secuestro no puede volver mudo el caso de la orden mal escrita.
  try {
    elegirCamino('PUBLICAR: cuenta=lucia texto=/tmp/b.json');
    throw new Error('AUTOTEST: una PUBLICAR: rota SIN deploy al lado tenia que tirar');
  } catch (e) {
    ok(String(e.message).includes('imagenes'), `esperaba el error de imagenes, dio "${e.message}"`);
  }
  ok(elegirCamino('sin nada aca').modo === 'nada', 'un cuerpo sin ordenes no elige ningun camino');

  // ── GUARDA DE ESTADO: el `ok` de una tarea CERRADA no ejecuta nada ─────────
  // El caso que importa: una tarea archivada cuyo Telegram sigue en el telefono.
  ok(motivoParaNoEjecutar('archived') !== null, 'una tarea ARCHIVADA no puede ejecutar su ok');
  ok(/ARCHIVADA/.test(motivoParaNoEjecutar('archived')), 'el motivo tiene que decir que esta archivada');
  ok(motivoParaNoEjecutar('done') !== null, 'una tarea CERRADA no puede ejecutar su ok');

  // Los vivos siguen pasando. Sin estos, la guarda se "arregla" rechazando todo
  // y rompe el unico camino por el que Sergio Urcullo aprueba algo.
  ok(motivoParaNoEjecutar('blocked') === null, 'blocked es como NACE un pedido: tiene que poder ejecutar');
  ok(motivoParaNoEjecutar('ready') === null, 'ready tiene que poder ejecutar');
  ok(motivoParaNoEjecutar('running') === null, 'running tiene que poder ejecutar');
  ok(motivoParaNoEjecutar('BLOCKED') === null, 'el estado tiene que ser insensible a mayusculas');
  ok(motivoParaNoEjecutar(' ready ') === null, 'el estado tiene que tolerar espacios');

  // Direccion de la falla: lo que NO conozco se rechaza (cerrado), nunca se deja
  // pasar. Si esto se invierte, un estado nuevo del tablero vuelve a abrir el
  // agujero sin que nada se ponga rojo.
  ok(motivoParaNoEjecutar('cancelled') !== null, 'un estado desconocido tiene que RECHAZAR, no dejar pasar');
  ok(motivoParaNoEjecutar('') !== null, 'sin estado NO se ejecuta: es "no pude preguntar", no "seguí"');
  ok(motivoParaNoEjecutar(undefined) !== null, 'un status ausente tiene que rechazar');
  ok(motivoParaNoEjecutar(null) !== null, 'un status null tiene que rechazar');
  ok(/no conozco/.test(motivoParaNoEjecutar('cancelled')), 'el motivo de un estado nuevo tiene que distinguirse del archivado');

  // El consejo que acompana al rechazo: cual es el pedido VIVO de ese destino.
  const lista = [
    { id: 't_vivo', status: 'blocked', body: 'bla\nDESPLEGAR: plataforma\nbla' },
    { id: 't_viejo', status: 'archived', body: 'DESPLEGAR: plataforma' },
    { id: 't_otro', status: 'ready', body: 'DESPLEGAR: landing' },
  ];
  ok(JSON.stringify(pedidosVivosEn(lista, 'plataforma')) === '["t_vivo"]', 'tenia que dar solo el pedido VIVO de plataforma');
  ok(JSON.stringify(pedidosVivosEn(lista, 'landing')) === '["t_otro"]', 'no separo por destino');
  ok(JSON.stringify(pedidosVivosEn(lista, 'bot')) === '[]', 'un destino sin pedido vivo es [], no null');
  // El tablero devuelve un ARRAY PELADO; `{tasks:[...]}` se acepta igual. Sin
  // este caso el lector volvia a decir "no pude consultar" para siempre.
  ok(JSON.stringify(pedidosVivosEn({ tasks: lista }, 'plataforma')) === '["t_vivo"]', 'tiene que leer tambien {tasks:[...]}');
  // null = "no pude leer" y [] = "no hay". Confundirlos manda a abrir un pedido duplicado.
  ok(pedidosVivosEn(null, 'plataforma') === null, 'lo ilegible tiene que dar null, nunca []');
  ok(pedidosVivosEn('{"roto":', 'plataforma') === null, 'una respuesta que no es lista tiene que dar null');

  // DEPLOYS ACOPLADOS. Nace del 2026-09-12: main traia la escalera C de precios
  // en los DOS repos (320/550/890/1290 + el plan Crece) y produccion seguia
  // consistente en la vieja. El pedido vivo de la landing publicaba SOLO la
  // vidriera: el lead habria visto 550/890/1290 y elegido "Crece", un plan que
  // el checkout no conoce, mientras el sistema le cobraba 750/1500. DOS carriles
  // lo midieron y avisaron en COMENTARIOS de la tarea — que el ejecutor no lee:
  // lee el cuerpo, y el cuerpo decia `DESPLEGAR: landing` a secas. Una regla de
  // "los dos en la misma tanda" que el brazo no sabe ejecutar es una regla que
  // solo existe en la cabeza del que la escribio.
  //
  // `DESPUES-DE:` dice lo que MIDE, ni una palabra mas: no afirma que el hermano
  // este publicado —eso no lo sabe—, afirma que su pedido sigue esperando el ok.
  // Por eso no se llama REQUIERE-PUBLICADO.
  ok(precondicionPendiente('DESPLEGAR: landing', lista) === null, 'sin linea DESPUES-DE no hay precondicion');
  const bloqueo = precondicionPendiente('DESPLEGAR: landing\nDESPUES-DE: plataforma', lista);
  ok(bloqueo && bloqueo.destino === 'plataforma', 'no leyo el destino de la precondicion');
  ok(JSON.stringify(bloqueo.pedidos) === '["t_vivo"]', 'tenia que nombrar el pedido hermano que falta apretar');
  // Cumplida = el hermano ya no tiene pedido vivo. Ahi este deploy sale solo.
  ok(precondicionPendiente('DESPLEGAR: landing\nDESPUES-DE: bot', lista) === null,
    'sin pedido vivo del hermano la precondicion esta cumplida y no corta');
  // FAIL-CLOSED. "No pude preguntarle al tablero" NO es "el hermano ya salio":
  // son opuestas, y con un deploy acoplado la barata es negarse. Este es el caso
  // que un `catch { return null }` —la forma natural de escribirlo— invierte.
  const ciego = precondicionPendiente('DESPLEGAR: landing\nDESPUES-DE: plataforma', null);
  ok(ciego && ciego.pedidos === null, 'sin poder leer el tablero tiene que CORTAR, no dejar pasar');
  // Mismo criterio que DESPLEGAR: el destino sale de la lista blanca, nunca del cuerpo.
  const caeP = (t) => {
    try { precondicionPendiente(t, lista); } catch (e) { ok(/destino desconocido/.test(e.message), `dio "${e.message}"`); return; }
    throw new Error(`AUTOTEST: "${t}" tenia que fallar por destino desconocido`);
  };
  caeP('DESPUES-DE: produccion');
  caeP('DESPUES-DE: /opt/loquesea/publicar.sh');
  caeP('DESPUES-DE:');

  // ANCLA DE CABLEADO. Los casos de arriba prueban la funcion pura; este prueba
  // que `main()` la USE y que su resultado CORTE. Sin el, la guarda se esquiva
  // con un `motivoParaNoEjecutar(estado);` suelto —llamarla y tirar el
  // resultado— y los 13 casos anteriores siguen en verde con el agujero abierto.
  const fuente = readFileSync(fileURLToPath(import.meta.url), 'utf8');
  const cuerpoMain = fuente.slice(fuente.indexOf('const main = ()'));
  ok(/const\s+motivo\s*=\s*motivoParaNoEjecutar\(\s*estado\s*\)/.test(cuerpoMain),
    'main() tiene que ASIGNAR el resultado de motivoParaNoEjecutar, no llamarla suelta');
  ok(/if\s*\(\s*motivo\s*\)/.test(cuerpoMain), 'main() tiene que CORTAR con ese motivo');
  // Y que corte ANTES de ejecutar: si la guarda queda debajo del spawn, el deploy
  // ya salio cuando el motivo se mira.
  const iGuarda = cuerpoMain.search(/if\s*\(\s*motivo\s*\)/);
  const iSpawn = cuerpoMain.search(/spawn\(/);
  const iExec = cuerpoMain.search(/execFileSync\(/);
  ok(iGuarda > -1 && iSpawn > -1 && iGuarda < iSpawn, 'la guarda tiene que estar ANTES del spawn del deploy');
  ok(iGuarda > -1 && iExec > -1 && iGuarda < iExec, 'la guarda tiene que estar ANTES de publicar la pieza');
  // Y la misma ancla para la precondicion: los ocho casos de arriba siguen en
  // verde si `main()` nunca la llama, o si la llama DESPUES de lanzar el deploy.
  ok(/const\s+pendiente\s*=\s*precondicionPendiente\(/.test(cuerpoMain),
    'main() tiene que ASIGNAR el resultado de precondicionPendiente, no llamarla suelta');
  const iPre = cuerpoMain.search(/if\s*\(\s*pendiente\s*\)/);
  ok(iPre > -1, 'main() tiene que CORTAR con esa precondicion');
  ok(iPre < iSpawn, 'la precondicion tiene que cortar ANTES del spawn del deploy');

  // ── NO PUDE PREGUNTAR ≠ EL PEDIDO ESTA ROTO ───────────────────────────────
  // El interprete del tablero vive SOLO en el VPS, y los CUATRO loops corren en
  // nodo-casa. Medido el 2026-09-27 en las dos maquinas: desde casa el simulacro
  // —el unico metodo para saber si un pedido es accionable ANTES de que Sergio
  // Urcullo firme— moria con `spawnSync ... ENOENT` y exit 1, sin nombrar la
  // maquina ni el remedio. Un loop que lee ese exit 1 puede concluir que el `ok`
  // no publicaria, cuando el circuito esta sano: es exactamente el error que la
  // casa ya tiene escrito como regla (un catch->false confunde "no pude
  // preguntar" con "me dijeron que no").
  ok(motivoSinTablero('/usr/bin/python3', true) === null, 'con interprete presente no tiene que cortar');
  const sinPy = motivoSinTablero('/no/existe/python', false);
  ok(typeof sinPy === 'string' && sinPy.length > 0, 'sin interprete tiene que dar un motivo');
  ok(sinPy.includes('/no/existe/python'), 'el motivo tiene que NOMBRAR el interprete que falta');
  // Las dos mitades que lo vuelven accionable en vez de un ENOENT pelado: que
  // diga que NO midio, y con que comando se mide.
  ok(/no pude preguntar/i.test(sinPy), 'el motivo tiene que decir que NO MIDIO, no que el pedido este roto');
  ok(sinPy.includes('onia-vps.sh'), 'el motivo tiene que traer el comando que SI contesta');
  ok(sinPy.includes('PY_HERMES'), 'el motivo tiene que nombrar el escape por variable de entorno');

  // ANCLA DE CABLEADO. Los casos de arriba prueban la funcion pura; sin esto la
  // guarda se esquiva no llamandola, y siguen en verde. Tiene que cortar ANTES
  // de `tareaDelTablero`, que es la linea exacta donde hoy explota.
  ok(/const\s+sinTablero\s*=\s*motivoSinTablero\(/.test(cuerpoMain),
    'main() tiene que ASIGNAR el resultado de motivoSinTablero, no llamarla suelta');
  const iSinPy = cuerpoMain.search(/if\s*\(\s*sinTablero\s*\)/);
  ok(iSinPy > -1, 'main() tiene que CORTAR con ese motivo');
  const iTablero = cuerpoMain.search(/tareaDelTablero\(/);
  ok(iTablero > -1 && iSinPy < iTablero, 'la guarda tiene que cortar ANTES de consultar el tablero');

  // PRUEBA DE COMPORTAMIENTO, no de forma: se corre el script de verdad con un
  // interprete que no existe. Es seguro —corta antes de tocar el tablero y antes
  // de cualquier spawn—, y es la unica que probaria el arreglo si alguien
  // reescribe la guarda con otros nombres.
  const yo = fileURLToPath(import.meta.url);
  const corrida = spawnSync(process.execPath, [yo, 't_noexiste'], {
    encoding: 'utf8', timeout: 60000,
    env: { ...process.env, PY_HERMES: '/no/existe/python' },
  });
  ok(corrida.status === NO_MEDIDO,
    `sin interprete tiene que salir ${NO_MEDIDO} (NO MEDIDO), dio ${corrida.status}: ${String(corrida.stderr).slice(0, 200)}`);
  // 2 y 3 ya estan tomados y significan otra cosa ("no habia nada que hacer" y
  // "la tarea esta cerrada"). Reusar uno seria volver a fundir dos respuestas
  // distintas en un solo numero, que es el bug que esto arregla.
  ok(NO_MEDIDO !== 2 && NO_MEDIDO !== 3 && NO_MEDIDO !== 0,
    'NO MEDIDO no puede compartir codigo con "no habia nada que hacer" ni con "tarea cerrada"');
  const dicho = JSON.parse(String(corrida.stdout || '{}'));
  ok(dicho.medido === false, 'la salida tiene que declarar medido:false para que un consumidor lo distinga');
  ok(dicho.desplegando === false && dicho.publicable === false, 'no midio: no puede afirmar que despliega ni que publica');
  console.log('autotest OK');
}

const main = () => {
  const arg = process.argv[2];
  if (arg === '--autotest') return autotest();
  if (!arg) throw new Error('uso: publicar-aprobado.mjs <id-de-tarea>');

  // 🔴 GUARDA DE "NO PUDE PREGUNTAR" — va ANTES de tareaDelTablero, que es la
  // linea exacta donde esto explotaba con un ENOENT pelado. Sin ella, correr el
  // simulacro desde nodo-casa —donde viven los CUATRO loops— sale con exit 1 y
  // se lee igual que "el pedido esta roto".
  //
  // No la cubre el `catch` de abajo: ese traduce cualquier excepcion a exit 1,
  // que es justo el numero que hace indistinguibles las dos respuestas.
  const sinTablero = motivoSinTablero(PY_TABLERO, existsSync(PY_TABLERO));
  if (sinTablero) {
    console.log(JSON.stringify({
      medido: false, publicable: false, desplegando: false, ejecutado: false,
      interprete: PY_TABLERO, motivo: sinTablero,
    }));
    // Tambien por stderr: el brazo de Telegram muestra stderr cuando el codigo
    // no es 0/2/3, asi que asi el remedio llega escrito en vez de un ENOENT.
    console.error(sinTablero);
    process.exit(NO_MEDIDO);
  }

  const { cuerpo, estado } = tareaDelTablero(arg);

  // 🔴 GUARDA DE ESTADO — va ACA, antes de parsear y antes de cualquier spawn o
  // execFile, porque lo unico que la hace valer es que ninguna rama pueda
  // ejecutar sin pasar por ella.
  //
  // POR QUE. El vigia de aprobaciones (*/30) le manda a Sergio Urcullo un
  // Telegram por cada pedido que se bloquea, y ese mensaje queda en su telefono
  // PARA SIEMPRE. Cuando el pedido se archiva —cosa que pasa cada vez que su
  // cuerpo queda corto y hay que rehacerlo— el boton viejo seguia funcionando:
  // medido el 2026-09-11, `ok t_cba4fa74` sobre una tarea `status=archived`
  // contestaba {"desplegando":true} con exit 0. No publicaba algo viejo (el
  // comando deriva el sha al ejecutarse), pero aprobaba lo que ese pedido NUNCA
  // le mostro: describia 24 arreglos y su ok publicaba 31.
  //
  // Y era un camino ciego POR CONSTRUCCION: `npm run pedido:entregado` enumera
  // los pedidos VIVOS para comprobar que su cuerpo alcance, asi que una tarea
  // archivada deja de ser sujeto del gate y sigue siendo un boton en el telefono.
  //
  // Cubre los DOS caminos (pieza y deploy) a proposito: cablear solo el que
  // motivo el arreglo es como nacio este agujero — el circuito supo publicar
  // PIEZAS antes que DEPLOYS, y la hermana quedo muda cuatro dias.
  const motivo = motivoParaNoEjecutar(estado);
  if (motivo) {
    const salida = { publicable: false, desplegando: false, ejecutado: false, estado: estado ?? null, motivo };
    let deploy = null;
    try { deploy = parsearDespliegue(cuerpo); } catch { /* destino invalido: el motivo del estado alcanza */ }
    if (deploy) {
      const vivos = pedidoVivoDe(deploy.destino);
      salida.destino = deploy.destino;
      salida.pedidoVivo = vivos === null
        ? 'no pude consultar el tablero para decirte cual es el pedido vivo'
        : (vivos.length ? vivos.join(', ') : `no hay ningun pedido vivo de ${deploy.destino} ahora mismo`);
    }
    console.log(JSON.stringify(salida));
    process.exit(3); // 3 = "no ejecuto porque la tarea esta cerrada". Distinto del 2 ("no habia nada que hacer").
  }

  // La otra cosa que Sergio Urcullo aprueba por Telegram es un DEPLOY. Sin esto,
  // `ok <id>` sobre un pedido de publicar el sitio desbloquea la tarea y no
  // despliega nada. `elegirCamino` es la que decide, y la que sabe que una CITA
  // del recuento no es una orden de publicar una pieza.
  const camino = elegirCamino(cuerpo);
  const pieza = camino.modo === 'pieza' ? camino.pieza : null;
  if (!pieza) {
    const deploy = camino.modo === 'deploy' ? camino.deploy : null;
    if (deploy) {
      // Acople: si este pedido declara ir DESPUES de otro destino y ese hermano
      // sigue esperando su ok, no se despliega nada. Va ANTES del spawn a
      // proposito — despues del spawn el deploy ya salio y el aviso llega tarde.
      const pendiente = precondicionPendiente(cuerpo, listaDelTablero());
      if (pendiente) {
        console.log(JSON.stringify({
          publicable: false, desplegando: false, destino: deploy.destino,
          motivo: pendiente.pedidos === null
            ? `este deploy va DESPUES de ${pendiente.destino} y no pude consultar el tablero para saber si ya salio: no despliego nada`
            : `este deploy va DESPUES de ${pendiente.destino}, que todavia espera tu ok (${pendiente.pedidos.join(', ')}): apreta ese primero`,
          primero: pendiente.pedidos || undefined,
        }));
        process.exit(2);
      }
      if (!RUNNER) throw new Error('falta desplegar-en-segundo-plano.sh (lo despliega sincronizar.sh)');
      if (!existsSync(deploy.script)) throw new Error(`no existe el publicador ${deploy.script}`);
      const seco = process.env.ONIA_DESPLEGAR_DRY === '1';
      const hijo = spawn('setsid', ['bash', RUNNER, deploy.script, arg, seco ? '--dry-run' : ''].filter(Boolean), {
        detached: true, stdio: 'ignore',
      });
      hijo.unref();
      console.log(JSON.stringify({
        publicable: false, desplegando: true, destino: deploy.destino, seco: seco || undefined,
        motivo: `arranco el deploy de ${deploy.destino} en segundo plano (tarda minutos); te aviso por Telegram como termino`,
        log: '/var/log/onia-deploy-aprobado.log',
        aviso: deploy.varias ? 'la tarea traia mas de una linea DESPLEGAR: se uso la primera' : undefined,
        // El descarte se dice en el canal, no se traga: si alguien quiso publicar
        // una pieza y la escribio mal, esto es lo unico que se lo cuenta.
        citaIgnorada: camino.citaIgnorada
          ? `habia un renglon que empieza con "publicar:" y no es una orden valida (${camino.citaIgnorada}): lo tome como cita y desplegue igual`
          : undefined,
      }));
      return;
    }
    // Codigo 2 = "no habia nada que publicar". Distinto de fallar.
    console.log(JSON.stringify({ publicable: false, motivo: 'la tarea no trae linea PUBLICAR: ni DESPLEGAR:' }));
    process.exit(2);
  }
  const info = validarEnDisco(pieza);

  // ONIA_PUBLICAR_DRY=1 recorre el circuito ENTERO (parseo, validacion, subida
  // de las laminas, POST a la API) pero deja el post como borrador, que no sale.
  // Es como se prueba esto: no hay cuenta de prueba — @oniahq, sergio_urcullo y
  // lucia.antelo son las tres reales.
  const seco = process.env.ONIA_PUBLICAR_DRY === '1';
  const salida = execFileSync(
    process.execPath,
    [PUBLICADOR, info.modo, pieza.imagenes, '--caption-from', pieza.texto,
     '--integration', pieza.integracion, seco ? '--draft' : '--now', '--key-file', KEY_FILE],
    { encoding: 'utf8', timeout: 300000 },
  );
  const out = JSON.parse(salida);
  console.log(JSON.stringify({
    publicable: true, ok: true, seco: seco || undefined, cuenta: pieza.cuenta, laminas: info.laminas,
    postId: out?.out?.[0]?.postId ?? null,
    aviso: pieza.varias ? 'la tarea traia mas de una linea PUBLICAR: se uso la primera' : undefined,
  }));
};

// ⚠️ La guarda no es prolijidad: sin ella, IMPORTAR este archivo ejecuta `main()` con el
// `process.argv` del que importa. `main()` lee `argv[2]` y sale a buscar esa tarea en el
// tablero, así que un gate que sólo quería una constante exportada terminaba consultando
// producción — y un importador arrancado como `node algo.mjs t_deddf471` habría corrido el
// DEPLOY entero. Es la trampa que este proyecto ya pagó en `demo_agendada_real.mjs`, acá
// sobre el script que ejecuta el `ok` de Sergio Urcullo, que es el peor lugar posible.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (e) {
    console.error(String(e?.message || e).slice(0, 800));
    process.exit(1);
  }
}
