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

import { execFileSync, spawn } from 'node:child_process';
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

function cuerpoDeTarea(tid) {
  const py = process.env.PY_HERMES || '/usr/local/lib/hermes-agent/venv/bin/python';
  const salida = execFileSync(
    py,
    ['-m', 'hermes_cli.main', 'kanban', '--board', process.env.ONIA_TABLERO || 'onia', 'show', tid, '--json'],
    { encoding: 'utf8', env: { ...process.env, HOME: '/root' }, timeout: 120000 },
  );
  return JSON.parse(salida).task?.body || '';
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
  console.log('autotest OK');
}

const main = () => {
  const arg = process.argv[2];
  if (arg === '--autotest') return autotest();
  if (!arg) throw new Error('uso: publicar-aprobado.mjs <id-de-tarea>');

  const cuerpo = cuerpoDeTarea(arg);
  const pieza = parsearLinea(cuerpo);
  if (!pieza) {
    // Antes de rendirse: la otra cosa que Sergio aprueba por Telegram es un
    // DEPLOY. Sin esto, `ok <id>` sobre un pedido de publicar el sitio desbloquea
    // la tarea y no despliega nada.
    const deploy = parsearDespliegue(cuerpo);
    if (deploy) {
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
