#!/usr/bin/env node
// ONIA — el Hermes de la PC carga una tarea en la cola de la orquesta (un issue de GitHub), con barandas.
//
// POR QUÉ (26-oct-2026). Desde hoy planifica el Hermes Agent de la PC de Sergio Urcullo. Un «gh issue create»
// suelto deja pasar todo: un issue `orquesta` sin `necesita-ok` lo toma el workflow al instante (el autor es la
// cuenta de Sergio Urcullo, `autores` de carriles.json) y su «check: cmd …» corre con shell y sin sandbox
// (orquesta.mjs). Por eso «gh issue create*» está bloqueado en la config de Hermes y carga SOLO con esto.
// Es el port de --crear de scripts/loops/orquesta-hermes.sh (el del VPS: bash + python + curl) con las mismas
// validaciones, salvo a propósito: `necesita-ok` va SIEMPRE, los carriles salen de carriles.json y el tope y
// las repetidas se cuentan en GitHub (no en un registro local).
//
// Uso (el pedido entra SOLO por --archivo, en UTF-8; nunca como argumento ni por la entrada estándar):
//   node scripts/orquesta/cargar-issue.mjs --archivo pedido.txt [--titulo "Título"] [--dry]
// La entrada estándar no se lee: en Windows PowerShell 5.1 la tubería cambia cada tilde por «?» (con el
// $OutputEncoding de fábrica) y eso no se puede detectar; la tarea se cargaba desfigurada con salida 0.
// Sin --titulo, la primera línea del pedido es el título («titulo:» delante es opcional). Formato completo:
// scripts/orquesta/README.md §«Cómo carga Hermes de la PC (26-oct)».
// Con `opciones: si` y una sección «## Opciones» (2 o 3 renglones, una «(recomendada)»), un pedido del nivel B suma el
// label `ok-por-silencio`: si Sergio Urcullo no contesta en 6 h o más, sale la recomendada (README §«Opciones…», 27-oct).
//
// Salidas: 0 cargada (o --dry) · 64 uso · 65 pedido inválido · 75 tope del día, repetida u otra carga en curso
// · 1 gh falló o no se sabe.
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esNivelB, horasDeSilencio, opcionesDe } from './orquesta.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const CONF = JSON.parse(fs.readFileSync(path.join(AQUI, 'carriles.json'), 'utf8'));
export const REPO = CONF.repo_cola;
export const CARRILES = Object.keys(CONF.carriles);
export const TOPE = 10; // tareas origen:hermes por día de La Paz, las del VPS y las de la PC juntas
const PERMITIDOS = ['carril', 'nivel', 'donde', 'check', 'necesita-ok', 'motor', 'salida', 'base', 'ok', 'opciones'];
const OBLIGATORIOS = ['carril', 'nivel', 'donde', 'check'];
const ORDEN = ['nivel', 'check', 'motor', 'donde', 'salida', 'base', 'ok']; // cabecera del issue (la lee leerPedido)
const DIA = 86_400_000;
const CANDADO = path.join(os.tmpdir(), 'onia-cargar-issue.lock');
const CANDADO_VIEJO = 2 * 60_000;
const USO = `Uso:
  node scripts/orquesta/cargar-issue.mjs --archivo pedido.txt [--titulo "Título"] [--dry]
El pedido va SOLO en un archivo UTF-8 con --archivo: ni como argumento ni por la entrada estándar
(en PowerShell la tubería cambia las tildes por «?»).`;

export class Rechazo extends Error {
  constructor(mensaje, codigo = 65) { super(mensaje); this.codigo = codigo; }
}
const no = (mensaje, codigo) => { throw new Rechazo(mensaje, codigo); };
const sinTildes = (s) => s.normalize('NFKD').replace(/\p{M}/gu, '');

// Solo texto que se lee igual que se ve (revisión de seguridad del 20-oct, igual que en el VPS): sin invisibles
// (Pub<U+200B>licar), sin controles y sin letras de otros alfabetos (la «р» cirílica de рublicar) ni de ancho
// completo («ＡＢＣ»). Letras modificadoras (ᴬ) tampoco: el VPS las rechaza por nombre.
export function revisarCaracteres(texto) {
  // Medido el 26-oct: un UTF-8 leído como ANSI (Get-Content de PowerShell 5.1) trae «acciÃ³n», que pasa por latino.
  if (/[ÃÂ][\u0080-\u00BF]/u.test(texto)) no('el pedido llegó mal codificado («Ã³» en vez de «ó»): guardá el archivo en UTF-8');
  // GitHub no muestra HTML ni <!-- comentarios -->, pero el trabajador lee el texto crudo: lo que Sergio Urcullo
  // no ve no entra. «<?» también: CommonMark lo trata como bloque HTML.
  if (/<[\p{L}/!?]/u.test(texto)) no('el pedido trae HTML o un comentario <!-- --> («<» pegado a una letra, «/», «!» o «?»): GitHub lo esconde y el trabajador lo leería. Escribilo sin «<» o con un espacio después');
  for (const ch of texto) {
    if (ch === '\n' || ch === '\t') continue;
    if (ch === '\uFFFD') no('el pedido no está en UTF-8 (trae U+FFFD): guardá el archivo en UTF-8');
    const ajena = /\p{L}/u.test(ch) && ch.codePointAt(0) > 0x7f
      && !(/\p{Script=Latin}/u.test(ch) && !/\p{Lm}/u.test(ch) && !/[\uFF21-\uFF3A\uFF41-\uFF5A]/u.test(ch));
    if (ajena || /[\p{C}\p{Zl}\p{Zp}]/u.test(ch)) {
      const cp = ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
      no(`la tarea trae un caracter que no se ve o no es del alfabeto latino (U+${cp}): escribila en texto común`);
    }
  }
}

const CAMPO = /^(\p{L}[\p{L}\p{M}\p{N}_-]*)\s*:\s*(.*)$/u;
function campoDe(linea) {
  const m = linea.match(CAMPO);
  return m && { clave: sinTildes(m[1]).toLowerCase(), valor: m[2].trim() };
}

// El check corre FUERA de todo sandbox, con shell, en la PC de Sergio Urcullo o en Actions (orquesta.mjs,
// «check: cmd»). Solo comandos de PRUEBA, sin un caracter que la shell interprete, sin opciones propias (un
// «--require=» carga lo que sea) y sin salir de la carpeta de la tarea (ni «/» al principio, ni «..», ni
// «C:» en Windows). `npm run` solo con scripts `test…`: el package.json también tiene `deploy:*`.
const TOK = '[A-Za-z0-9_.][A-Za-z0-9._/:@=+-]*';
const CHECK = new RegExp(`^(urls|cmd npm test|cmd npm run test(:[A-Za-z0-9._-]+)*|cmd node --test( ${TOK})+)$`);

export function validarPedido(entradaCruda, { titulo: tituloArg } = {}) {
  const entrada = String(entradaCruda).replace(/\r/g, '').normalize('NFC').trim(); // trim también saca el BOM
  if (!entrada) no('Falta el pedido (por la entrada estándar o con --archivo).');
  revisarCaracteres(entrada);
  let lineas = entrada.split('\n');
  let titulo;
  if (tituloArg == null) {
    titulo = lineas[0].replace(/^t[ií]tulo\s*:\s*/i, '').trim();
    lineas = lineas.slice(1);
    if (PERMITIDOS.includes(campoDe(titulo)?.clave)) no('falta el título: va en --titulo o en la primera línea del pedido');
  } else {
    titulo = String(tituloArg).normalize('NFC').trim();
    revisarCaracteres(titulo);
  }
  if (!titulo || [...titulo].length > 120 || /\p{C}/u.test(titulo)) no('el título tiene que ser una línea de hasta 120 caracteres');

  const campos = {};
  let i = 0;
  while (i < lineas.length && !lineas[i].trim()) i++;
  for (; i < lineas.length; i++) {
    const c = campoDe(lineas[i]);
    if (!c) break;
    if (c.clave === 'titulo') no('el título va una sola vez: en --titulo o en la primera línea del pedido');
    if (!PERMITIDOS.includes(c.clave)) no(`campo desconocido «${c.clave}:». Van solo: ${PERMITIDOS.join(', ')} (el modelo lo elige el nivel)`);
    if (c.clave in campos) no(`«${c.clave}:» está dos veces`);
    campos[c.clave] = c.valor;
  }
  const texto = lineas.slice(i).join('\n').trim();

  for (const c of OBLIGATORIOS) if (!campos[c]) no(`falta «${c}:» (formato en scripts/orquesta/README.md)`);
  const { carril, nivel, donde, check } = campos;
  if (!CARRILES.includes(carril)) no(`carril desconocido «${carril}». Válidos: ${CARRILES.join(' ')}`);
  if (!['rapido', 'normal', 'profundo'].includes(nivel)) no('nivel: rapido, normal o profundo');
  if (!['pc', 'nube'].includes(donde)) no('donde: pc o nube');
  const conUnidad = check.startsWith('cmd node --test ') && check.split(' ').slice(3).some((t) => /^[A-Za-z]:/.test(t));
  if (check.includes('..') || conUnidad || !CHECK.test(check)) {
    no('check: «urls», «cmd npm run test:<x>», «cmd npm test» o «cmd node --test <ruta>», sin opciones (nada más: corre sin sandbox)');
  }
  // Se acepta por compatibilidad con el formato del VPS, pero no cambia nada: acá `necesita-ok` va siempre.
  if ('necesita-ok' in campos && !['si', 'sí', 'no'].includes(campos['necesita-ok'])) no('necesita-ok: si o no (igual va siempre)');
  if ('motor' in campos && !['claude', 'codex'].includes(campos.motor)) no('motor: claude o codex (o sin esa línea: va el del carril)');
  // La salida es un documento: con `salida: scripts/loops/…` un trabajador escribiría lo que el VPS copia como root.
  if ('salida' in campos && (!/^(hermes-content\/)?docs\/[A-Za-z0-9._/-]+$/.test(campos.salida) || campos.salida.split('/').includes('..'))) {
    no('salida: una ruta dentro de hermes-content/docs/ (docs/ en plataforma), o sin esa línea: va la del carril');
  }
  if ('base' in campos && (!/^[A-Za-z0-9_][A-Za-z0-9_./-]*$/.test(campos.base) || campos.base.includes('..'))) no('base: un nombre de rama');
  if ('ok' in campos && campos.ok !== 'sergio') no('ok: sergio (o sin esa línea)');
  if (!texto) no('falta qué hay que hacer (después de la cabecera)');
  const largo = [...texto].length;
  if (largo > 4000) no(`la tarea es muy larga (${largo} > 4000 caracteres): partila`);
  if (!/^\s*hecho cuando\s*:\s*\S/im.test(texto)) no('falta «Hecho cuando: …» (cómo se comprueba). Sin eso el revisor no puede juzgar');

  // `opciones: si` es una orden para este comando: la sección «## Opciones» viaja en el texto y orquesta.mjs la lee de ahí.
  let recomendada = null;
  if ('opciones' in campos) {
    if (!['si', 'sí'].includes(campos.opciones)) no('opciones: si (o sin esa línea). Con «si», el texto trae la sección «## Opciones»');
    const o = opcionesDe(texto);
    if (!o.ok) no(o.motivo);
    recomendada = o.recomendada;
  }
  // Nivel B (AGENTS.md §1): lo calcula el código, Hermes no lo elige ni lo pide con un campo. Solo ahí suma ok-por-silencio.
  const nivelB = recomendada !== null && esNivelB({ carril, donde, check, ok: campos.ok });

  const cuerpo = `${ORDEN.filter((c) => c in campos).map((c) => `${c}: ${campos[c]}`).join('\n')}\n\n${texto}`;
  const labels = ['orquesta', `carril:${carril}`, 'origen:hermes', 'necesita-ok', ...(nivelB ? ['ok-por-silencio'] : [])];
  return { titulo, carril, texto, cuerpo, labels, nivelB, recomendada };
}

// Bolivia es UTC-4 todo el año. «26/10 17:00», en hora de La Paz.
export function horaLaPaz(ms) {
  const d = new Date(ms - 4 * 3_600_000).toISOString();
  return `${d.slice(8, 10)}/${d.slice(5, 7)} ${d.slice(11, 16)}`;
}

// silencio_horas inválido (menos de 6) en carriles.json: no se carga nada, ni siquiera --dry.
function horasConfiguradas(conf) {
  try { return horasDeSilencio(conf); } catch (e) { return no(e.message, 1); }
}

const avisoSilencio = (pedido, limite) => `Sale la recomendada (${pedido.recomendada}) por silencio a partir de ${horaLaPaz(limite)} (hora de La Paz) si Sergio Urcullo no elige otra letra; para frenarla tiene que contestar «no» en el issue. La toma la próxima pasada de la nube (cada 3 h, de 8 a 23).`;

// Bolivia es UTC-4 todo el año: el día de La Paz empieza a las 04:00 UTC.
export const inicioDelDia = (ms) => Math.floor((ms - 4 * 3_600_000) / DIA) * DIA + 4 * 3_600_000;

const detalle = (r) => (r.stderr || r.stdout || '').trim().split('\n').slice(-2).join(' ').slice(0, 300) || `código ${r.code}`;

// Cuenta en GitHub, no en un registro local: así entran también las del Hermes del VPS. `since` filtra por
// actualización (un superconjunto de las creadas desde entonces); la fecha de creación se mira acá.
export async function revisarCupo(gh, pedido, ahora) {
  const desde = encodeURIComponent(new Date(ahora - DIA).toISOString());
  const r = await gh(['api', `repos/${REPO}/issues?labels=origen%3Ahermes&state=all&sort=created&direction=desc&per_page=100&since=${desde}`]);
  let lista = null;
  try { if (r.code === 0) lista = JSON.parse(r.stdout); } catch { /* abajo */ }
  if (!Array.isArray(lista) || lista.some((it) => Number.isNaN(Date.parse(it?.created_at)))) {
    no(`No pude contar las tareas de hoy (${detalle(r)}): sin contar no cargo nada.`, 1);
  }
  const tareas = lista.filter((it) => !it.pull_request);
  const repe = tareas.find((it) => Date.parse(it.created_at) >= ahora - DIA && it.title === pedido.titulo
    && (it.labels || []).some((l) => (l?.name ?? l) === `carril:${pedido.carril}`)
    && String(it.body ?? '').replace(/\r/g, '').trim().endsWith(pedido.texto));
  if (repe) no(`Esa misma tarea ya se cargó en las últimas 24 h: ${repe.html_url}. No la repito.`, 75);
  const hoy = tareas.filter((it) => Date.parse(it.created_at) >= inicioDelDia(ahora)).length;
  if (hoy >= TOPE) no(`Ya hay ${hoy} tareas de Hermes hoy (tope ${TOPE}). Lo demás, mañana o que lo cargue Sergio Urcullo.`, 75);
  return hoy;
}

// Argumentos en array y sin shell; el cuerpo por archivo: ningún texto del pedido se interpreta.
export async function crearIssue(gh, pedido) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'onia-carga-'));
  let r;
  try {
    const archivo = path.join(dir, 'cuerpo.md');
    fs.writeFileSync(archivo, pedido.cuerpo, 'utf8');
    r = await gh(['issue', 'create', `--repo=${REPO}`, `--title=${pedido.titulo}`, `--body-file=${archivo}`,
      ...pedido.labels.map((l) => `--label=${l}`)]);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  if (r.code !== 0) no(`La tarea NO se cargó (gh: ${detalle(r)}). Se puede reintentar: si hubiera llegado a crearse, el reintento la ve como repetida.`, 1);
  const m = r.stdout.match(/https:\/\/github\.com\/\S+\/issues\/(\d+)/);
  if (!m) no(`Puede haberse cargado (gh no devolvió el enlace: ${detalle(r)}). Mirá la cola antes de reintentar.`, 1);
  return { numero: Number(m[1]), url: m[0] };
}

// GitHub no debería crearla sin un label, pero sin `necesita-ok` arrancaría sin su ok: eso no se deja abierto.
export async function confirmarLabels(gh, { numero, url }, labels) {
  const r = await gh(['issue', 'view', String(numero), `--repo=${REPO}`, '--json', 'labels']);
  let pegados = null;
  try { if (r.code === 0) pegados = JSON.parse(r.stdout).labels.map((l) => l.name); } catch { /* abajo */ }
  if (!Array.isArray(pegados)) no(`La tarea #${numero} se creó pero no pude confirmar sus labels: mirá ya que tenga «necesita-ok»: ${url}`, 1);
  const faltan = labels.filter((l) => !pegados.includes(l));
  if (!faltan.length) return;
  if (faltan.includes('necesita-ok')) {
    const c = await gh(['issue', 'close', String(numero), `--repo=${REPO}`, '--reason=not planned']);
    no(c.code === 0
      ? `La tarea #${numero} quedó sin «necesita-ok» y la cerré antes de que arranque: ${url}`
      : `La tarea #${numero} quedó SIN «necesita-ok» y no la pude cerrar: puede arrancar sin su ok. Avisale ya a Sergio Urcullo: ${url}`, 1);
  }
  no(`La tarea #${numero} se creó sin los labels: ${faltan.join(' ')} (no entra a la cola así): ${url}`, 1);
}

export function leerArgs(argv) {
  const o = { dry: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const clave = a.slice(2);
    if (a === '--dry') o.dry = true;
    else if ((a === '--titulo' || a === '--archivo') && i + 1 < argv.length && !(clave in o)) o[clave] = argv[++i];
    else no(USO, 64);
  }
  if (o.archivo == null) no(USO, 64);
  return o;
}

function leerArchivo(ruta) {
  try { return fs.readFileSync(ruta).toString('utf8'); } catch (e) { return no(`No pude leer ${ruta} (${e.code || e.message}).`, 64); }
}

function crearCandado(ruta) {
  try { fs.closeSync(fs.openSync(ruta, 'wx')); return true; } catch (e) {
    if (e.code === 'EEXIST') return false;
    return no(`No pude crear el candado ${ruta} (${e.code || e.message}): no hice nada.`, 1);
  }
}

// Dos cargas a la vez pasarían las dos el control del tope y de repetidas: contar, crear y confirmar van de a una.
// shortcut: un candado de más de 2 min se toma sin mirar de quién es; si gh tardara más que eso, dos cargas se cruzarían.
async function conCandado(ruta, trabajo) {
  if (!crearCandado(ruta)) {
    let edad = Infinity;
    try { edad = Date.now() - fs.statSync(ruta).mtimeMs; } catch { /* se soltó recién */ }
    if (edad >= CANDADO_VIEJO) fs.rmSync(ruta, { force: true }); // la carga que lo tenía murió sin soltarlo
    if (edad < CANDADO_VIEJO || !crearCandado(ruta)) {
      no('Otra carga en curso (hay un candado de menos de 2 min): no hice nada. Probá de nuevo en un rato.', 75);
    }
  }
  try {
    return await trabajo();
  } finally {
    try { fs.rmSync(ruta, { force: true }); } catch { /* si queda, a los 2 min se toma igual */ }
  }
}

function ghReal(args) {
  return new Promise((ok) => {
    execFile('gh', args, { windowsHide: true, timeout: 60_000, maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' }, (e, stdout, stderr) => {
      ok({ code: e ? (typeof e.code === 'number' ? e.code : 1) : 0, stdout: stdout || '', stderr: stderr || (e ? e.message : '') });
    });
  });
}

export async function main(argv, { gh = ghReal, leer = leerArchivo, candado = CANDADO, ahora = Date.now(), log = console.log, error = console.error, conf = CONF } = {}) {
  try {
    const args = leerArgs(argv);
    const pedido = validarPedido(leer(args.archivo), { titulo: args.titulo });
    const limite = pedido.nivelB ? ahora + horasConfiguradas(conf) * 3_600_000 : null;
    if (args.dry) {
      log(`[--dry] No creé nada. Esto cargaría en ${REPO}:\nTítulo: ${pedido.titulo}\nLabels: ${pedido.labels.join(', ')}\n${pedido.nivelB ? `${avisoSilencio(pedido, limite)}\n` : ''}Cuerpo:\n${pedido.cuerpo}`);
      return 0;
    }
    const { hoy, issue } = await conCandado(candado, async () => {
      const cuantas = await revisarCupo(gh, pedido, ahora);
      const creado = await crearIssue(gh, pedido);
      await confirmarLabels(gh, creado, pedido.labels);
      return { hoy: cuantas, issue: creado };
    });
    log(`Tarea #${issue.numero} cargada (carril ${pedido.carril}; ${hoy + 1} de ${TOPE} hoy): ${issue.url}`);
    log(`${pedido.nivelB ? avisoSilencio(pedido, limite) : 'No arranca hasta que Sergio Urcullo le quite «necesita-ok».'} Vos no la das por hecha: la cierran el check y el revisor.`);
    return 0;
  } catch (e) {
    error(e instanceof Rechazo ? e.message : `Falla inesperada, no sé si se cargó: ${e?.stack || e}`);
    return e instanceof Rechazo ? e.codigo : 1;
  }
}

// realpath: corrido por una junction o un symlink (E:/onia-wt/…), argv[1] no es la ruta real del módulo.
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then((codigo) => { process.exitCode = codigo; });
}
