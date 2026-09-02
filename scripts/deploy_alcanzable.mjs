#!/usr/bin/env node
/**
 * deploy_alcanzable.mjs — un commit que la cola manda desplegar tiene que estar donde el
 * deploy lo pueda alcanzar.
 *
 * Nace de que la MISMA instruccion fallo tres veces seguidas en el carril chatbot, cada vez
 * un escalon mas adentro:
 *
 *   1. 2026-09-02 — S11 mandaba desplegar el commit `4f86381` de la rama
 *      `carril/chatbot-v68-friccion`. Ninguno de los dos existia: el trabajo quedo en el disco
 *      de Windows y nunca se pusheo. El bloqueo le pedia a Sergio desplegar la nada.
 *   2. Se rehizo en `22fd088`, commiteado Y pusheado, y S11 quedo escrito como
 *      "commiteado y pusheado, NO desplegado" — como si lo unico que faltara fuera su OK.
 *   3. Medido: `22fd088` vive en `origin/claude/chatbots-platform-review-0d1d09` y **no** en
 *      `origin/master`, que es de donde se despliega `onia-platform`. Con el OK dado, el
 *      deploy buildea `master` y el defecto sigue vivo.
 *
 * Las tres veces la lista la mantenia un parrafo a mano, y un parrafo envejece. Este gate no:
 * lee la cola, saca los commits que declara, y le pregunta a git si el deploy los alcanza.
 *
 *   node scripts/deploy_alcanzable.mjs hermes-content/docs/cola/chatbot.md
 *   node scripts/deploy_alcanzable.mjs --self-check
 *
 * QUE MIDE. Cada `commit \`<sha>\` de \`onia-platform\`` que la cola nombre, en cualquier
 * seccion. Tres veredictos, y los dos malos son los dos modos de falla ya vistos:
 *   - `no-existe`  — el repo no conoce ese sha (modo de falla 1).
 *   - `no-llega`   — existe, pero la rama de deploy no lo alcanza (modo de falla 3).
 *   - `ok`         — alcanzable desde la rama de deploy.
 *
 * POR QUE `origin/master` Y NO `main`. `onia-platform` es OTRO repo y su rama por defecto es
 * `master`. Escribir `main` aca seria medir contra una rama que no existe, que es la misma
 * trampa de "verificar contra el sistema correcto" que este carril ya pago una vez.
 *
 * QUE NO MIDE. Que el deploy se haya hecho. Un commit en `master` sigue sin estar en
 * produccion hasta que alguien buildea: esto mata el fantasma de ANTES del deploy, no el de
 * despues.
 */

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

// `de \`onia-platform\`` es el discriminador y no es adorno: la cola nombra tambien commits
// del bot y de onia-hermes (`e5c1ad3`, `994eb42d`, `ab9e0de`...). Sin exigir el repo, el gate
// mediria shas de otro repositorio contra `master` y los reportaria a todos como `no-existe`.
const CLAIM = /commit\s+\*{0,2}`([0-9a-f]{7,40})`\*{0,2}\s+de\s+`onia-platform`/g;

const RAMA_DEPLOY = process.env.ONIA_PLATFORM_RAMA || 'origin/master';

// El clon del VPS y el worktree del carril sirven igual: los dos tienen los refs remotos.
const CANDIDATOS = [
  process.env.ONIA_PLATFORM_DIR,
  '/root/loops/onia-platform-chatbot',
  '/root/loops/onia-platform',
].filter(Boolean);

/**
 * Saca los commits que la cola declara, con su linea. Devuelve uno por sha (la cola repite el
 * mismo commit en la fila del bloqueo y en el item cerrado; es el mismo hecho, no dos).
 */
export function extraerCommits(md) {
  const porSha = new Map();
  const lineas = md.split(/\r?\n/);
  for (let i = 0; i < lineas.length; i++) {
    for (const m of lineas[i].matchAll(CLAIM)) {
      const sha = m[1];
      if (!porSha.has(sha)) porSha.set(sha, { sha, lineas: [] });
      porSha.get(sha).lineas.push(i + 1);
    }
  }
  return [...porSha.values()];
}

/**
 * Traduce los veredictos a los motivos por los que ESTO es un item. Separado de git a
 * proposito: es la parte que decide, y la parte que decide se prueba sin red.
 */
export function juzgar(estados, rama = RAMA_DEPLOY) {
  const motivos = [];
  for (const { sha, estado, lineas } of estados) {
    const donde = `linea ${lineas.join(', ')}`;
    if (estado === 'no-existe') {
      motivos.push(`${sha} NO EXISTE en onia-platform — la cola manda desplegar la nada (${donde})`);
    } else if (estado === 'no-llega') {
      motivos.push(`${sha} existe pero ${rama} NO lo alcanza — el deploy buildea ${rama} y no lo trae (${donde})`);
    }
  }
  return motivos;
}

function git(dir, args) {
  return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function estadoDe(dir, sha, rama) {
  try { git(dir, ['cat-file', '-e', `${sha}^{commit}`]); }
  catch { return 'no-existe'; }
  try { git(dir, ['merge-base', '--is-ancestor', sha, rama]); return 'ok'; }
  catch { return 'no-llega'; }
}

// En un worktree `.git` es un ARCHIVO, no un directorio: `existsSync` sirve para los dos, y
// `rev-parse` confirma que git de verdad lo reconoce.
function clon() {
  return CANDIDATOS.find((d) => {
    if (!existsSync(`${d}/.git`)) return false;
    try { git(d, ['rev-parse', '--git-dir']); return true; } catch { return false; }
  }) || null;
}

if (process.argv.includes('--self-check')) {
  // Contados por el script, no escritos a mano: un conteo hardcodeado deja de coincidir en
  // cuanto se agrega un caso, y un gate que miente en su propio numero ya no es un gate.
  let casos = 0;
  const afirmar = (cond, que) => { casos++; if (!cond) { console.error('FALLO:', que); process.exitCode = 1; } };

  const uno = extraerCommits('el commit `22fd088` de `onia-platform`, rama x');
  afirmar(uno.length === 1 && uno[0].sha === '22fd088', 'saca un commit simple');
  afirmar(uno[0].lineas[0] === 1, 'reporta la linea donde lo encontro');

  afirmar(extraerCommits('commit **`675541b`** de `onia-platform`').length === 1, 'las negritas no lo esconden');
  afirmar(extraerCommits('commit `e5c1ad3` de `onia-hermes`').length === 0, 'un commit de OTRO repo no se mide contra master');
  afirmar(extraerCommits('deployadas en el commit `e5c1ad3`').length === 0, 'un commit sin repo declarado no se mide');
  afirmar(extraerCommits('`22fd088` a secas').length === 0, 'un sha suelto en backticks no es una declaracion de deploy');
  afirmar(extraerCommits('commit `nomeunsha` de `onia-platform`').length === 0, 'lo que no es hexadecimal no es un sha');

  const dos = extraerCommits('commit `22fd088` de `onia-platform`\ny otra vez commit `22fd088` de `onia-platform`');
  afirmar(dos.length === 1, 'el mismo commit nombrado dos veces es UN hecho, no dos');
  afirmar(dos[0].lineas.length === 2, 'pero conserva las dos lineas para poder corregir las dos');

  // Los dos modos de falla que ya se pagaron, uno por uno.
  afirmar(juzgar([{ sha: 'a1b2c3d', estado: 'ok', lineas: [1] }]).length === 0, 'un commit alcanzable no es un item');
  const noExiste = juzgar([{ sha: 'a1b2c3d', estado: 'no-existe', lineas: [1] }]);
  afirmar(noExiste.length === 1 && noExiste[0].includes('NO EXISTE'), 'el commit inexistente SI es un item (modo de falla 1)');
  const noLlega = juzgar([{ sha: 'a1b2c3d', estado: 'no-llega', lineas: [7] }], 'origin/master');
  afirmar(noLlega.length === 1 && noLlega[0].includes('origin/master'), 'el commit que el deploy no alcanza SI es un item (modo de falla 3)');
  afirmar(noLlega[0].includes('linea 7'), 'el motivo dice DONDE corregir la cola');

  if (!process.exitCode) console.log(`self-check: ok — ${casos} casos`);
  process.exit(process.exitCode || 0);
}

const ruta = process.argv[2];
if (!ruta) {
  console.error('uso: node scripts/deploy_alcanzable.mjs <cola.md> | --self-check');
  process.exit(2);
}

const dir = clon();
if (!dir) {
  // No poder medir NO es verde. La leccion del canario: un veredicto tibio con cara de exito
  // es peor que un rojo, porque nadie lo mira.
  console.error(`NO MEDIDO — no encontre un clon de onia-platform (probe: ${CANDIDATOS.join(', ')}).`);
  console.error('Pone ONIA_PLATFORM_DIR con la ruta del clon. Sin eso este gate no dice nada.');
  process.exit(1);
}

const declarados = extraerCommits(await readFile(ruta, 'utf8'));
if (!declarados.length) {
  console.log(`deploy alcanzable: la cola no declara ningun commit de onia-platform (${ruta})`);
  process.exit(0);
}

const estados = declarados.map((d) => ({ ...d, estado: estadoDe(dir, d.sha, RAMA_DEPLOY) }));
const motivos = juzgar(estados, RAMA_DEPLOY);

for (const { sha, estado, lineas } of estados) {
  console.log(`  ${estado === 'ok' ? 'OK      ' : 'ITEM    '} ${sha}  ${estado.padEnd(9)} linea ${lineas.join(', ')}`);
}

if (!motivos.length) {
  console.log(`deploy alcanzable: ${estados.length} commit(s) declarado(s), los ${estados.length} llegan a ${RAMA_DEPLOY}`);
  process.exit(0);
}

console.error(`\nDEPLOY INALCANZABLE — ${ruta} contra ${RAMA_DEPLOY} en ${dir}`);
for (const m of motivos) console.error(`  - ${m}`);
console.error('\nUn bloqueo que le pide a Sergio desplegar algo que el deploy no alcanza no se destraba nunca.');
process.exit(1);
