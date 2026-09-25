#!/usr/bin/env node
/**
 * bloqueos_vencidos.mjs — un bloqueo que ya se puede comprobar solo no puede seguir
 * pidiendole una decision a Sergio.
 *
 * Nace del 2026-09-02, y del modo de falla que el propio loop llama "peor que un fantasma":
 *
 *   S16 declaraba su verificador (`npm run deploy:alcanzable` → 0) y NADIE lo corria como
 *   paso propio. Cuando el integrador mergeo el carril a `master`, el verificador paso a
 *   verde y la fila siguio pidiendo la decision. Se destapo de casualidad, adentro de una
 *   auditoria de los `[x]`, ya vencido.
 *
 *   Y un bloqueo vencido no se queda quieto: **le presta su motivo falso al de al lado**.
 *   S11 abria con "commiteado y pusheado, pero NO llega a `master`: ver S16" — con el commit
 *   ya en `master`. Esa frase es justo la que le dice a Sergio que dar el OK del deploy no
 *   sirve de nada, o sea que el bloqueo vencido bloqueaba a su vecino.
 *
 *   node scripts/bloqueos_vencidos.mjs hermes-content/docs/cola/chatbot.md
 *   node scripts/bloqueos_vencidos.mjs --self-check
 *
 * QUE MIDE. Las filas VIVAS de la tabla "Bloqueado en Sergio" que declaran su verificador
 * con la marca `**Verificador:** \`<comando>\` → <codigo>`. Corre cada comando y compara su
 * codigo de salida:
 *   - sale `<codigo>`  → el bloqueo ESTA SATISFECHO: es un ITEM, la fila hay que cerrarla.
 *   - sale otra cosa   → sigue bloqueado, nada que hacer.
 *
 * POR QUE LA DECLARACION ES EXPLICITA Y NO SE DEDUCE DEL TEXTO. La tabla nombra decenas de
 * comandos entre backticks que NO son su verificador, y uno de ellos ya engañaria: el
 * verificador de S16 (`deploy:alcanzable`) sale 0 hoy, pero S11 —que habla del mismo
 * commit— NO esta resuelto, porque le falta el swap en produccion. Deducir el verificador
 * del texto cerraria S11 en falso. La fila lo declara o no se mide.
 *
 * LAS FILAS TACHADAS NO SE MIDEN. `| ~~S16~~ |` ya esta cerrada; volver a nombrarla seria
 * el gate gritando en falso, que es como se apaga un gate.
 *
 * ⚠️ GUARDA DE EJECUCION. Solo corre dos formas, y las dos se validan ANTES de ejecutar:
 *   1. `npm run <script>` donde `<script>` es una clave real de `package.json`.
 *   2. `node <ruta>` donde `<ruta>` es relativa, sin `..`, cae dentro del repo y existe.
 * Todo lo demas se reporta como NO EJECUTABLE y no se corre. Ademas se ejecuta siempre con
 * `execFileSync` y argumentos como array —nunca con shell—, asi que el texto del documento
 * jamas se interpreta como comando. Un gate que ejecuta texto arbitrario sacado de un
 * documento es peor que el problema que tapa.
 *
 * QUE NO MIDE. Las filas sin verificador mecanico (hoy la mayoria: son chips, tramites de
 * banco y horas de la agenda de Sergio). Las lista igual al final, porque un gate que no
 * dice lo que dejo afuera se lee como "revise todo".
 *
 * FALLO CONSERVADOR. Si el verificador no se puede correr (timeout, SSH caido), se lee como
 * "sigue bloqueado", no como vencido: dejar un bloqueo de mas cuesta una vuelta, cerrarlo de
 * menos le pide a Sergio algo que ya hizo.
 */

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative, isAbsolute } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const SECCION = /^##\s+Bloqueado en Sergio\s*$/;
const OTRO_TITULO = /^#{2,6}\s+/;
// Arranque de fila: `| S9 |` o `| ~~S16~~ |`. El `~~` es como la cola marca lo ya cerrado.
const FILA = /^\|\s*(~~)?\s*(S\d+)\s*(~~)?\s*\|/;
const VERIFICADOR = /\*\*Verificador:\*\*\s*`([^`]+)`\s*(?:→|->)\s*(\d+)/;

const TIMEOUT_MS = Number(process.env.ONIA_BLOQUEOS_TIMEOUT_MS || 120000);

/**
 * Saca las filas de la tabla "Bloqueado en Sergio". Una fila puede ocupar VARIAS lineas
 * fisicas —S9 tiene un bloque de codigo indentado adentro— asi que el corte no es el salto
 * de linea sino el arranque de la fila siguiente.
 */
export function extraerBloqueos(md) {
  const lineas = md.split(/\r?\n/);
  const inicio = lineas.findIndex((l) => SECCION.test(l));
  if (inicio === -1) return [];

  let fin = lineas.length;
  for (let i = inicio + 1; i < lineas.length; i++) {
    if (OTRO_TITULO.test(lineas[i])) { fin = i; break; }
  }

  const filas = [];
  for (let i = inicio + 1; i < fin; i++) {
    const m = FILA.exec(lineas[i]);
    if (!m) continue;
    if (filas.length) filas[filas.length - 1].fin = i;
    filas.push({ id: m[2], cerrado: Boolean(m[1] && m[3]), linea: i + 1, inicio: i, fin });
  }

  return filas.map((f) => {
    const texto = lineas.slice(f.inicio, f.fin).join('\n');
    const v = VERIFICADOR.exec(texto);
    return {
      id: f.id,
      linea: f.linea,
      cerrado: f.cerrado,
      comando: v ? v[1].trim() : null,
      esperado: v ? Number(v[2]) : null,
    };
  });
}

/**
 * La guarda, separada de la ejecucion a proposito: es la parte que decide si algo se corre,
 * y esa parte se prueba sin correr nada.
 */
export function validarComando(comando, scripts, existe = (p) => existsSync(join(RAIZ, p))) {
  const npm = /^npm run ([\w:.-]+)$/.exec(comando);
  if (npm) {
    if (!(npm[1] in scripts)) return { error: `\`npm run ${npm[1]}\` no existe en package.json` };
    return { bin: 'npm', args: ['run', '--silent', npm[1]] };
  }

  const nodo = /^node ([\w./-]+)$/.exec(comando);
  if (nodo) {
    const ruta = nodo[1];
    if (isAbsolute(ruta) || ruta.split('/').includes('..')) return { error: `la ruta \`${ruta}\` se sale del repo` };
    const abs = resolve(RAIZ, ruta);
    const dentro = relative(RAIZ, abs);
    if (dentro.startsWith('..')) return { error: `la ruta \`${ruta}\` se sale del repo` };
    if (!/\.(mjs|js)$/.test(ruta)) return { error: `\`${ruta}\` no es un script de node` };
    if (!existe(ruta)) return { error: `\`${ruta}\` no existe en el repo` };
    return { bin: 'node', args: [abs] };
  }

  return { error: 'solo se aceptan `npm run <script>` y `node <ruta del repo>`' };
}

/**
 * Traduce el plan validado a algo que ESTA plataforma pueda spawnear sin shell.
 *
 * En Windows `npm` es `npm.cmd`, y Node se niega a spawnear `.cmd`/`.bat` sin shell
 * (CVE-2024-27980). Con `bin: 'npm'` pelado, en win32 TODOS los verificadores npm morian en el
 * spawn → `status` null → `no-medido`, y un bloqueo ya satisfecho (S17, 2026-09-12) quedaba
 * invisible — el molde exacto por el que S16 vencio en silencio. Se corre el JS de npm con
 * este MISMO node: sin shell, sin cmd.exe, la guarda de `validarComando` intacta.
 */
export function resolverBin(plan, plataforma = process.platform, existe = existsSync) {
  if (plan.error || plan.bin !== 'npm' || plataforma !== 'win32') return plan;
  const cli = join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
  if (!existe(cli)) return plan; // sin npm-cli.js a la vista, el intento directo al menos avisa
  return { bin: process.execPath, args: [cli, ...plan.args] };
}

/**
 * Traduce los resultados a los motivos por los que ESTO es un item. Sin red y sin disco: es
 * lo que se prueba en `--self-check`.
 */
export function juzgar(resultados) {
  const motivos = [];
  for (const r of resultados) {
    const donde = `linea ${r.linea}`;
    if (r.estado === 'vencido') {
      motivos.push(
        `${r.id} YA ESTA SATISFECHO — su verificador \`${r.comando}\` sale ${r.esperado}, ` +
          `que es lo que la propia fila declara como resuelto. Cerrala y revisa a quien nombra (${donde})`,
      );
    } else if (r.estado === 'no-ejecutable') {
      motivos.push(
        `${r.id} declara un verificador que no se puede correr: ${r.error}. ` +
          `Una fila que no se puede comprobar sola no vence nunca (${donde})`,
      );
    }
  }
  return motivos;
}

/**
 * Un id repetido entre filas VIVAS vuelve ambigua toda referencia a esa fila — empezando por
 * el `ok <id>` que Sergio Urcullo tipea, que es la unica forma de destrabar un deploy.
 *
 * ESTO YA PASO DOS VECES Y EL GATE LO VIO LAS DOS. El 2026-09-02 la tabla tenia dos `S12` (los
 * horarios de demo y "¿sigue en pie la opcion 1 de §9?") y se fusionaron a mano; el 2026-09-24
 * volvio a haber dos, porque una fila NUEVA ("Publicar el bot") reuso el numero. Las dos veces
 * la salida de este mismo script IMPRIMIO `S12, S12` en la linea de "sin verificador mecanico"
 * — y siguio saliendo 0 por ese motivo. **Un sintoma a la vista que no pone rojo se lee como
 * decoracion**: por eso la deteccion va aca y no en el ojo del que lea la salida.
 *
 * Solo mira las VIVAS a proposito: las filas cerradas (`~~S8~~`) son historia y comparten
 * numero con sus propias menciones viejas sin ambiguedad para nadie.
 */
export function idsDuplicados(filas) {
  const porId = new Map();
  for (const f of filas.filter((f) => !f.cerrado)) {
    if (!porId.has(f.id)) porId.set(f.id, []);
    porId.get(f.id).push(f.linea);
  }

  const motivos = [];
  for (const [id, lineas] of porId) {
    if (lineas.length < 2) continue;
    motivos.push(
      `${id} nombra ${lineas.length} filas VIVAS (lineas ${lineas.join(', ')}) — toda referencia a ` +
        `${id} es ambigua, incluido el \`ok ${id}\` de Sergio Urcullo. Renumera una con un id libre`,
    );
  }
  return motivos;
}

if (process.argv.includes('--self-check')) {
  // Contados por el script, no escritos a mano: un conteo hardcodeado deja de coincidir en
  // cuanto se agrega un caso, y un gate que miente en su propio numero ya no es un gate.
  let casos = 0;
  const afirmar = (cond, que) => { casos++; if (!cond) { console.error('FALLO:', que); process.exitCode = 1; } };

  const tabla = [
    '## Bloqueado en Sergio',
    '',
    '| # | Que | Por que solo el | Que desbloquea |',
    '|---|---|---|---|',
    '| S9 | copiar cosas. **Verificador:** `node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` → 0 | infra | el item 2 |',
    '| ~~S16~~ | VENCIDO, ya cerrado. **Verificador:** `npm run deploy:alcanzable` → 0 | — | — |',
    '| S2 | credenciales del BCP | tramite | el QR |',
    '',
    '### S9 — el item completo',
    '| S99 | esta fila esta FUERA de la seccion | x | y |',
  ].join('\n');

  const filas = extraerBloqueos(tabla);
  afirmar(filas.length === 3, 'saca las 3 filas de la seccion y ninguna de afuera');
  afirmar(!filas.some((f) => f.id === 'S99'), 'una fila despues del proximo titulo NO es de esta tabla');
  afirmar(filas[0].id === 'S9' && filas[0].esperado === 0, 'saca el id y el codigo esperado');
  afirmar(filas[0].comando === 'node hermes-content/deploy/vps-ops/bot/espejo-check.mjs', 'saca el comando declarado');
  afirmar(filas[0].linea === 5, 'reporta la linea donde esta la fila');
  afirmar(filas[1].cerrado === true, 'una fila tachada se reconoce como cerrada');
  afirmar(filas[0].cerrado === false, 'una fila viva no se confunde con una cerrada');
  afirmar(filas[2].comando === null, 'una fila sin verificador no inventa uno');

  // Una fila puede ocupar varias lineas fisicas: S9 tiene un bloque de codigo adentro.
  const multi = extraerBloqueos([
    '## Bloqueado en Sergio',
    '| # | Que |',
    '|---|---|',
    '| S9 | primero esto:',
    '  ```bash',
    '  ssh root@vps "docker exec ..."',
    '  ```',
    '  y **Verificador:** `npm run marca:chatwoot` → 0 |',
    '| S10 | otra |',
  ].join('\n'));
  afirmar(multi.length === 2, 'un bloque de codigo adentro de una fila no la parte en dos');
  afirmar(multi[0].comando === 'npm run marca:chatwoot', 'encuentra el verificador en la continuacion de la fila');

  // La guarda de ejecucion, que es la parte peligrosa.
  const scripts = { 'marca:chatwoot': 'node x.mjs' };
  const existe = (p) => p === 'scripts/ok.mjs';
  afirmar(validarComando('npm run marca:chatwoot', scripts).bin === 'npm', 'un npm script declarado se corre');
  afirmar(validarComando('npm run no-existe', scripts).error, 'un npm script inexistente NO se corre');
  afirmar(validarComando('node scripts/ok.mjs', scripts, existe).bin === 'node', 'un script del repo se corre');
  afirmar(validarComando('node scripts/fantasma.mjs', scripts, existe).error, 'un archivo inexistente NO se corre');
  afirmar(validarComando('node ../../etc/passwd.js', scripts, existe).error, 'una ruta que sale del repo NO se corre');
  afirmar(validarComando('node /etc/malo.js', scripts, existe).error, 'una ruta absoluta NO se corre');
  afirmar(validarComando('node scripts/ok.sh', scripts, existe).error, 'lo que no es .mjs/.js NO se corre');
  afirmar(validarComando('rm -rf /', scripts, existe).error, 'un comando arbitrario del documento NO se corre');
  afirmar(validarComando('npm run marca:chatwoot; rm -rf /', scripts).error, 'no se puede encadenar otro comando');
  afirmar(validarComando('node scripts/ok.mjs && curl evil', scripts, existe).error, 'no se puede encadenar despues de node');
  afirmar(validarComando('npm run marca:chatwoot', scripts).args.includes('--silent'), 'npm corre en silencio');

  // La traduccion por plataforma: sin ella, en win32 todo `npm run` salia `no-medido`.
  const planNpm = { bin: 'npm', args: ['run', '--silent', 'x'] };
  afirmar(resolverBin(planNpm, 'linux').bin === 'npm', 'en POSIX npm se corre directo');
  afirmar(resolverBin(planNpm, 'win32', () => true).bin === process.execPath, 'en win32 npm corre via node: .cmd sin shell no spawnea');
  afirmar(resolverBin(planNpm, 'win32', () => true).args.slice(1).join(' ') === 'run --silent x', 'la traduccion conserva los args validados');
  afirmar(resolverBin(planNpm, 'win32', () => false).bin === 'npm', 'sin npm-cli.js a la vista se intenta directo, no se inventa ruta');
  afirmar(resolverBin({ bin: 'node', args: ['x'] }, 'win32', () => true).bin === 'node', 'node no se traduce: ya es spawneable');

  // Que MUERDE: es la razon de existir del gate.
  afirmar(juzgar([{ id: 'S9', estado: 'bloqueado', linea: 1 }]).length === 0, 'un bloqueo que sigue vivo NO es un item');
  const vencido = juzgar([{ id: 'S16', estado: 'vencido', comando: 'npm run deploy:alcanzable', esperado: 0, linea: 220 }]);
  afirmar(vencido.length === 1 && vencido[0].includes('S16'), 'un bloqueo satisfecho SI es un item, y se nombra');
  afirmar(vencido[0].includes('linea 220'), 'el motivo dice DONDE esta la fila que hay que cerrar');
  afirmar(vencido[0].includes('a quien nombra'), 'y recuerda revisar al vecino, que es el daño real (S11 por S16)');
  const roto = juzgar([{ id: 'S9', estado: 'no-ejecutable', error: 'no existe', linea: 3 }]);
  afirmar(roto.length === 1 && roto[0].includes('no vence nunca'), 'un verificador que no corre SI es un item');
  afirmar(juzgar([{ id: 'S2', estado: 'sin-verificador', linea: 4 }]).length === 0, 'una fila sin verificador no es un item: se re-mide a mano');

  // Ids duplicados. El caso real que lo motiva: dos filas vivas `S12` el 2026-09-24, una de
  // ellas con el `ok` que Sergio Urcullo tiene que tipear para publicar el bot.
  const dupe = idsDuplicados([
    { id: 'S12', linea: 10, cerrado: false },
    { id: 'S13', linea: 11, cerrado: false },
    { id: 'S12', linea: 12, cerrado: false },
  ]);
  afirmar(dupe.length === 1, 'dos filas vivas con el mismo id son UN item, no dos');
  afirmar(/S12/.test(dupe[0]) && /10, 12/.test(dupe[0]), 'nombra el id repetido y las DOS lineas, para poder renumerar');
  afirmar(
    idsDuplicados([{ id: 'S1', linea: 1, cerrado: false }, { id: 'S2', linea: 2, cerrado: false }]).length === 0,
    'ids distintos no son un item',
  );
  afirmar(
    idsDuplicados([{ id: 'S8', linea: 1, cerrado: true }, { id: 'S8', linea: 2, cerrado: false }]).length === 0,
    'una fila CERRADA que comparte numero con una viva es historia, no ambiguedad',
  );
  afirmar(
    idsDuplicados([{ id: 'S8', linea: 1, cerrado: true }, { id: 'S8', linea: 2, cerrado: true }]).length === 0,
    'dos filas cerradas con el mismo id tampoco: nadie les tipea un ok',
  );

  if (!process.exitCode) console.log(`self-check: ok — ${casos} casos`);
  process.exit(process.exitCode || 0);
}

const ruta = process.argv[2];
if (!ruta) {
  console.error('uso: node scripts/bloqueos_vencidos.mjs <cola.md> | --self-check');
  process.exit(2);
}

const scripts = JSON.parse(await readFile(join(RAIZ, 'package.json'), 'utf8')).scripts ?? {};
const filas = extraerBloqueos(await readFile(ruta, 'utf8'));

if (!filas.length) {
  console.error(`NO MEDIDO — ${ruta} no tiene una tabla "Bloqueado en Sergio" que leer.`);
  process.exit(1);
}

const vivas = filas.filter((f) => !f.cerrado);
const conVerificador = vivas.filter((f) => f.comando);
const sinVerificador = vivas.filter((f) => !f.comando);

const resultados = [];
for (const f of conVerificador) {
  const plan = resolverBin(validarComando(f.comando, scripts));
  if (plan.error) { resultados.push({ ...f, estado: 'no-ejecutable', error: plan.error }); continue; }

  let salida = null;
  try {
    execFileSync(plan.bin, plan.args, { cwd: RAIZ, encoding: 'utf8', stdio: 'ignore', timeout: TIMEOUT_MS });
    salida = 0;
  } catch (e) {
    // `status` null = murio por señal o timeout: no se pudo medir, y no medir NO es vencido.
    salida = typeof e.status === 'number' ? e.status : null;
  }

  if (salida === null) resultados.push({ ...f, estado: 'no-medido', salida });
  else resultados.push({ ...f, estado: salida === f.esperado ? 'vencido' : 'bloqueado', salida });
}

for (const r of resultados) {
  const etiqueta = r.estado === 'vencido' || r.estado === 'no-ejecutable' ? 'ITEM    ' : 'OK      ';
  const detalle = r.estado === 'no-ejecutable' ? r.error : `salio ${r.salida}, la fila espera ${r.esperado}`;
  console.log(`  ${etiqueta} ${r.id.padEnd(4)} ${r.estado.padEnd(14)} ${detalle}`);
}

if (sinVerificador.length) {
  console.log(
    `  (${sinVerificador.length} fila(s) sin verificador mecanico, se re-miden a mano: ` +
      `${sinVerificador.map((f) => f.id).join(', ')})`,
  );
}

const motivos = [...juzgar(resultados), ...idsDuplicados(filas)];
if (!motivos.length) {
  console.log(`bloqueos vencidos: ${conVerificador.length} verificador(es) corrido(s), ninguno satisfecho — todos siguen bloqueados`);
  process.exit(0);
}

console.error(`\nBLOQUEO VENCIDO — ${ruta}`);
for (const m of motivos) console.error(`  - ${m}`);
console.error('\nUn bloqueo vencido le pide a Sergio una decision que ya tomo, y le presta su motivo falso al de al lado.');
process.exit(1);
