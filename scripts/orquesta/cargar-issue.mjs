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
// Uso (el pedido entra SOLO por la entrada estándar o por --archivo, nunca como argumento):
//   Get-Content pedido.txt | node scripts/orquesta/cargar-issue.mjs --titulo "Título"
//   node scripts/orquesta/cargar-issue.mjs --archivo pedido.txt [--titulo "Título"] [--dry]
// Sin --titulo, la primera línea del pedido es el título («titulo:» delante es opcional). Formato completo:
// scripts/orquesta/README.md §«Cómo carga Hermes de la PC (26-oct)».
//
// Salidas: 0 cargada (o --dry) · 64 uso · 65 pedido inválido · 75 tope del día o repetida · 1 gh falló o no se sabe.
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const CONF = JSON.parse(fs.readFileSync(path.join(AQUI, 'carriles.json'), 'utf8'));
export const REPO = CONF.repo_cola;
export const CARRILES = Object.keys(CONF.carriles);
export const TOPE = 10; // tareas origen:hermes por día de La Paz, las del VPS y las de la PC juntas
const PERMITIDOS = ['carril', 'nivel', 'donde', 'check', 'necesita-ok', 'motor', 'salida', 'base', 'ok'];
const OBLIGATORIOS = ['carril', 'nivel', 'donde', 'check'];
const ORDEN = ['nivel', 'check', 'motor', 'donde', 'salida', 'base', 'ok']; // cabecera del issue (la lee leerPedido)
const DIA = 86_400_000;
const USO = `Uso:
  Get-Content pedido.txt | node scripts/orquesta/cargar-issue.mjs [--titulo "Título"] [--dry]
  node scripts/orquesta/cargar-issue.mjs --archivo pedido.txt [--titulo "Título"] [--dry]
El pedido va por la entrada estándar o con --archivo, nunca como argumento.`;

export class Rechazo extends Error {
  constructor(mensaje, codigo = 65) { super(mensaje); this.codigo = codigo; }
}
const no = (mensaje, codigo) => { throw new Rechazo(mensaje, codigo); };
const sinTildes = (s) => s.normalize('NFKD').replace(/\p{M}/gu, '');

// Solo texto que se lee igual que se ve (revisión de seguridad del 20-oct, igual que en el VPS): sin invisibles
// (Pub<U+200B>licar), sin controles y sin letras de otros alfabetos (la «р» cirílica de рublicar) ni de ancho
// completo («ＡＢＣ»). Letras modificadoras (ᴬ) tampoco: el VPS las rechaza por nombre.
export function revisarCaracteres(texto) {
  // Medido el 26-oct: «Get-Content pedido.txt | node …» en Windows PowerShell 5.1 lee el UTF-8 como ANSI y llega
  // «acciÃ³n», que pasa por latino. Se frena acá en vez de cargar la tarea desfigurada.
  if (/[ÃÂ][\u0080-\u00BF]/u.test(texto)) no('la entrada llegó mal codificada («Ã³» en vez de «ó»): usá --archivo o Get-Content -Encoding UTF8');
  for (const ch of texto) {
    if (ch === '\n' || ch === '\t') continue;
    if (ch === '\uFFFD') no('la entrada no llegó en UTF-8 (trae U+FFFD): usá --archivo (README §«Cómo carga Hermes de la PC»)');
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

  const cuerpo = `${ORDEN.filter((c) => c in campos).map((c) => `${c}: ${campos[c]}`).join('\n')}\n\n${texto}`;
  return { titulo, carril, texto, cuerpo, labels: ['orquesta', `carril:${carril}`, 'origen:hermes', 'necesita-ok'] };
}

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
  return o;
}

function leerArchivo(ruta) {
  try { return fs.readFileSync(ruta).toString('utf8'); } catch (e) { return no(`No pude leer ${ruta} (${e.code || e.message}).`, 64); }
}

function leerStdin() {
  if (process.stdin.isTTY) return Promise.resolve('');
  return new Promise((ok, mal) => {
    const partes = [];
    const reloj = setTimeout(() => { process.stdin.destroy(); mal(new Rechazo('No pude leer la entrada completa en 10 s: no hice nada.')); }, 10_000);
    process.stdin.on('data', (d) => partes.push(d));
    process.stdin.on('end', () => { clearTimeout(reloj); ok(Buffer.concat(partes).toString('utf8')); });
    process.stdin.on('error', (e) => { clearTimeout(reloj); mal(new Rechazo(`No pude leer la entrada: ${e.message}`)); });
  });
}

function ghReal(args) {
  return new Promise((ok) => {
    execFile('gh', args, { windowsHide: true, timeout: 60_000, maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' }, (e, stdout, stderr) => {
      ok({ code: e ? (typeof e.code === 'number' ? e.code : 1) : 0, stdout: stdout || '', stderr: stderr || (e ? e.message : '') });
    });
  });
}

export async function main(argv, { gh = ghReal, leerEntrada = leerStdin, ahora = Date.now(), log = console.log, error = console.error } = {}) {
  try {
    const args = leerArgs(argv);
    const pedido = validarPedido(args.archivo != null ? leerArchivo(args.archivo) : await leerEntrada(), { titulo: args.titulo });
    if (args.dry) {
      log(`[--dry] No creé nada. Esto cargaría en ${REPO}:\nTítulo: ${pedido.titulo}\nLabels: ${pedido.labels.join(', ')}\nCuerpo:\n${pedido.cuerpo}`);
      return 0;
    }
    const hoy = await revisarCupo(gh, pedido, ahora);
    const issue = await crearIssue(gh, pedido);
    await confirmarLabels(gh, issue, pedido.labels);
    log(`Tarea #${issue.numero} cargada (carril ${pedido.carril}; ${hoy + 1} de ${TOPE} hoy): ${issue.url}`);
    log('No arranca hasta que Sergio Urcullo le quite «necesita-ok». Vos no la das por hecha: la cierran el check y el revisor.');
    return 0;
  } catch (e) {
    error(e instanceof Rechazo ? e.message : `Falla inesperada, no sé si se cargó: ${e?.stack || e}`);
    return e instanceof Rechazo ? e.codigo : 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main(process.argv.slice(2)).then((codigo) => { process.exitCode = codigo; });
}
