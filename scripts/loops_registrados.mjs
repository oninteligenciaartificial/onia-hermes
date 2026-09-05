#!/usr/bin/env node
// Compara `crontab -l` contra la tabla "Deben existir y estar activos" de
// hermes-content/docs/cola/loops.md — EN LAS DOS DIRECCIONES.
//
// POR QUE EXISTE: el chequeo de arranque que llevan pegado todos los loops busca filas
// de la tabla que falten en el cron, y asi NUNCA ve una linea de cron que falte en la
// tabla. Ese sentido unico dejo cinco loops invisibles el 2026-09-02 (recorrido-cliente,
// web-factory-dev, tendencias, calidad-generado, supervisor): corriendo, gastando, y sin
// figurar en la lista contra la que el conjunto se auto-cura. Comparar a ojo ya fallo
// tres veces en un solo dia; por eso ahora es un comando.
//
//   node scripts/loops_registrados.mjs               -> mide contra el crontab real
//   node scripts/loops_registrados.mjs --self-check  -> prueba el parseo, sin tocar el sistema
//
// Sale != 0 si un id o un horario difieren. Fuera del VPS (sin crontab) NO falla: avisa
// que no puede medir, porque un gate que miente es peor que uno ausente.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const DOC = 'hermes-content/docs/cola/loops.md';

// 🔴 EL GATE MIDE CONTRA LOS LOOPS DE **SU** MAQUINA, no contra los del VPS siempre.
//
// Hasta el 2026-09-05 comparaba el `crontab -l` de donde corriera contra las filas
// **VPS** de la tabla. Con una sola maquina eso era correcto. Con dos, miente: en el
// nodo de casa reportaba los 7 loops del VPS como "faltan en el cron" y dejaba `main`
// en ROJO para los quince carriles — el integrador corre la cadena entera antes de
// tocar `main`, asi que ningun carril podia mergear.
//
// Peor: el "Chequeo de arranque" pegado en los 15 prompts dice "si una fila de la
// tabla no tiene su linea en crontab -l, volve a ponerla". Con este gate mintiendo,
// el primer loop que corriera en casa instalaba ahi los 10 crons del VPS, apuntando a
// worktrees que no existen. Lo diagnostico el propio loop `web-venta` (tarea
// t_812bd90a) y no lo toco porque no era su carril.
//
// QUE MAQUINA SOY se resuelve preguntando por ARTEFACTOS, nunca por hostname ni IP.
// Es la misma prueba que ya usan scripts/kanban/tablero.sh e instalar-homelab.sh:
// "una IP se mueve, un hostname se renombra".
const CLI_HERMES = '/usr/local/lib/hermes-agent/venv/bin/python'; // solo existe en el VPS
const MARCA_NODO = '/root/.onia-nodo';                            // lo escribe instalar-homelab.sh

export function maquinaActual({ existe = existsSync, leer = readFileSync } = {}) {
  // La marca explicita gana: si alguien la puso, sabe mas que cualquier heuristica.
  if (existe(MARCA_NODO)) {
    const v = String(leer(MARCA_NODO, 'utf8')).trim();
    if (v) return v;
  }
  if (existe(CLI_HERMES)) return 'VPS';
  return null; // no se sabe: NO se mide, que es distinto de medir mal
}

// --- parseo -----------------------------------------------------------------

// Filas de la tabla de activos de UNA maquina: | `id` | **VPS** | `cron` (UTC) | para que |
// La columna "donde corre" puede venir en negrita (**VPS**, **casa**) o pelada (Windows):
// se captura igual y se filtra despues, asi agregar una maquina no toca esta expresion.
// Se limita a la seccion de activos: la tabla de "Apagados a proposito" tiene otra forma
// (3 columnas, sin la columna de maquina) y no debe contarse como registro vigente.
export function loopsDelDoc(markdown, maquina = 'VPS') {
  const inicio = markdown.indexOf('## Deben existir y estar activos');
  if (inicio === -1) throw new Error(`no encuentro la seccion de activos en ${DOC}`);
  const resto = markdown.slice(inicio + 1);
  const fin = resto.indexOf('\n## ');
  const seccion = fin === -1 ? resto : resto.slice(0, fin);

  const filas = new Map();
  const re = /^\|\s*`([a-z0-9-]+)`\s*\|\s*\**\s*([A-Za-z][A-Za-z0-9_-]*)\s*\**\s*\|\s*`([^`]+)`/gm;
  let m;
  while ((m = re.exec(seccion)) !== null) {
    if (m[2].toLowerCase() !== String(maquina).toLowerCase()) continue;
    // El doc escribe el horario como `3 * * * *` (UTC): el sufijo no es parte del cron.
    filas.set(m[1], m[3].trim());
  }
  return filas;
}

// Lineas del crontab que invocan el corredor: <cron> /root/bin/onia-loop.sh <id> >> ...
export function loopsDelCron(salidaCrontab) {
  const filas = new Map();
  for (const linea of salidaCrontab.split('\n')) {
    if (linea.trimStart().startsWith('#')) continue; // comentada = apagada
    const m = linea.match(/^(.+?)\s+\S*onia-loop\.sh\s+([a-z0-9-]+)/);
    if (m) filas.set(m[2], m[1].trim());
  }
  return filas;
}

export function comparar(doc, cron) {
  const problemas = [];
  for (const id of cron.keys()) {
    if (!doc.has(id)) problemas.push(`${id}: corre en cron y NO esta en la tabla de ${DOC}`);
  }
  for (const id of doc.keys()) {
    if (!cron.has(id)) problemas.push(`${id}: esta en la tabla y NO tiene linea de cron`);
  }
  for (const [id, horario] of cron) {
    if (doc.has(id) && doc.get(id) !== horario) {
      problemas.push(`${id}: horario distinto — cron=[${horario}] doc=[${doc.get(id)}]`);
    }
  }
  return problemas;
}

// Un worktree de carril lee SU copia de la tabla, que puede estar atrás de main.
// Con esa copia vieja el veredicto se invierte: el gate señala "horario distinto" y el
// consejo de siempre ("editá la tabla o el crontab") manda a tocar el crontab — que es
// como el 2026-09-04 se revirtió sola una baja de cadencia ya decidida (23 vueltas/día
// de más, 5 loops). Si la tabla local no es la de origin/main, el veredicto no se toca.
export function consejoDeArreglo({ tablaDesincronizada }) {
  if (tablaDesincronizada) {
    return [
      `\nOJO: tu copia de ${DOC} NO es la de origin/main — estás midiendo contra una tabla vieja.`,
      'NO toques el crontab con este veredicto: así se revirtió sola, el 2026-09-04, una baja',
      'de cadencia ya decidida (5 loops, 23 vueltas/día de más).',
      'Primero: `git merge origin/main` y volvé a medir.',
    ];
  }
  return [
    `\nArreglo: editá la tabla de ${DOC} o la línea del crontab, la que esté mal.`,
    'Antes de "rearmar" una línea, listá el cron ENTERO (`crontab -l | grep onia-loop.sh`):',
    'un `head` corta la lista y rearmar algo ya registrado lo DUPLICA.',
  ];
}

// Falla cerrado: si no hay git o no hay ref de origin/main, no inventa una desincronía.
function tablaDesincronizadaConMain() {
  try {
    const enMain = execFileSync('git', ['show', `origin/main:${DOC}`], { encoding: 'utf8' });
    return enMain !== readFileSync(DOC, 'utf8');
  } catch {
    return false;
  }
}

// --- self-check -------------------------------------------------------------

function selfCheck() {
  const doc = `## Deben existir y estar activos

| id | dónde corre | cron | para qué sirve |
|---|---|---|---|
| \`onia-cola\` | **VPS** | \`33 * * * *\` (UTC) | el integrador |
| \`solo-en-doc\` | **VPS** | \`0 5 * * *\` (UTC) | no tiene cron |
| \`contenido-cola\` | Windows | \`31 */3 * * *\` | no es del VPS |
| \`recorrido-cliente\` | **casa** | \`9 1,4 * * *\` (UTC) | corre en el nodo de casa |

## Apagados a propósito el 2026-08-31 — NO rearmar

| id | cron que tenía | por qué se apagó |
|---|---|---|
| \`web-factory-salud\` | \`21 * * * *\` | no-ops |
`;
  const cron = `# un comentario
33 * * * * /root/bin/onia-loop.sh onia-cola >> /var/log/x.log 2>&1
9 1,4 * * * /root/bin/onia-loop.sh solo-en-cron >> /var/log/y.log 2>&1
# 41 0 * * * /root/bin/onia-loop.sh apagado >> /var/log/z.log 2>&1
0 7 * * * /root/bin/backup-onia-db.sh
`;

  const d = loopsDelDoc(doc);
  const c = loopsDelCron(cron);
  const fallos = [];
  let totalCasos = 0;
  const esperar = (cond, que) => { totalCasos++; if (!cond) fallos.push(que); else console.log(`  ok - ${que}`); };

  esperar(d.size === 2, 'la tabla aporta solo las filas de MI maquina (Windows y casa afuera)');
  esperar(!d.has('web-factory-salud'), 'la tabla de apagados NO cuenta como registro vigente');
  esperar(d.get('onia-cola') === '33 * * * *', 'el sufijo "(UTC)" no se cuela en el horario');

  // --- una tabla, TRES maquinas -------------------------------------------
  // Sin esto, el gate del nodo de casa reportaba los 7 loops del VPS como faltantes
  // y dejaba `main` en rojo para los quince carriles (medido 2026-09-05).
  const dCasa = loopsDelDoc(doc, 'casa');
  esperar(dCasa.size === 1 && dCasa.has('recorrido-cliente'),
    'pidiendo "casa" salen SOLO las filas de casa, no las del VPS');
  esperar(dCasa.get('recorrido-cliente') === '9 1,4 * * *',
    'la fila de casa tambien le saca el sufijo "(UTC)" al horario');
  const dWin = loopsDelDoc(doc, 'Windows');
  esperar(dWin.size === 1 && dWin.has('contenido-cola'),
    'la columna sin negrita (Windows) se lee igual que la que la tiene');
  esperar(loopsDelDoc(doc, 'no-existe').size === 0,
    'una maquina sin filas da CERO, no la tabla entera');

  // --- que maquina soy ------------------------------------------------------
  // Se pregunta por artefactos, nunca por hostname: "una IP se mueve, un hostname
  // se renombra". La marca explicita le gana a la heuristica del VPS.
  esperar(maquinaActual({ existe: () => false }) === null,
    'sin marca y sin CLI de Hermes: NO se adivina la maquina, se devuelve null');
  esperar(maquinaActual({ existe: (p) => p === CLI_HERMES }) === 'VPS',
    'el CLI de Hermes identifica al VPS');
  esperar(maquinaActual({ existe: (p) => p === MARCA_NODO, leer: () => 'casa\n' }) === 'casa',
    'la marca del nodo manda, y se le limpia el salto de linea');
  esperar(maquinaActual({ existe: () => true, leer: () => 'casa' }) === 'casa',
    'con marca Y CLI presentes gana la marca explicita');
  esperar(maquinaActual({ existe: (p) => p === MARCA_NODO, leer: () => '  \n' }) === null,
    'una marca vacia no cuenta: es lo mismo que no saber');
  esperar(c.size === 2, 'del crontab salen solo los onia-loop.sh, y no los otros crons');
  esperar(!c.has('apagado'), 'una linea comentada con # NO cuenta como registrada');

  const p = comparar(d, c);
  esperar(p.some((x) => x.startsWith('solo-en-cron:')), 'DETECTA el loop que corre y no esta en la tabla');
  esperar(p.some((x) => x.startsWith('solo-en-doc:')), 'DETECTA la fila de la tabla sin linea de cron');
  esperar(comparar(new Map([['a', '1 * * * *']]), new Map([['a', '2 * * * *']])).length === 1,
    'DETECTA el horario que difiere aunque el id este en los dos lados');
  esperar(comparar(new Map([['a', '1 * * * *']]), new Map([['a', '1 * * * *']])).length === 0,
    'no inventa problemas cuando coinciden');

  const viejo = consejoDeArreglo({ tablaDesincronizada: true }).join('\n');
  const sano = consejoDeArreglo({ tablaDesincronizada: false }).join('\n');
  esperar(/origin\/main/.test(viejo) && /git merge origin\/main/.test(viejo),
    'tabla atrasada: el consejo manda a MERGEAR main antes de nada');
  esperar(!/la que esté mal/.test(viejo),
    'tabla atrasada: NO repite el consejo ambiguo que hace tocar el crontab');
  esperar(/la que esté mal/.test(sano),
    'tabla al dia: el consejo de siempre queda igual');

  if (fallos.length) {
    console.error('\nself-check ROJO:');
    for (const f of fallos) console.error(`  not ok - ${f}`);
    process.exit(1);
  }
  console.log(`\nself-check verde (${totalCasos - fallos.length}/${totalCasos})`);
}

// --- medicion real ----------------------------------------------------------

function medir() {
  // Primero QUE MAQUINA SOY. Sin eso no se mide: comparar el cron de una maquina
  // contra las filas de otra es exactamente como este gate dejaba `main` en rojo.
  const maquina = maquinaActual();
  if (!maquina) {
    console.log('no se cual maquina es esta: no se puede medir aca (esto NO es una falla).');
    console.log(`Se reconoce el VPS por ${CLI_HERMES}, y cualquier otro nodo por ${MARCA_NODO}.`);
    console.log('Si esta maquina corre loops, el instalador tiene que dejar esa marca.');
    return;
  }

  let salida;
  try {
    salida = execFileSync('crontab', ['-l'], { encoding: 'utf8' });
  } catch {
    console.log('sin `crontab -l` disponible: no se puede medir acá (esto NO es una falla).');
    console.log(`Esta maquina se identifica como "${maquina}"; el registro vive en su crontab.`);
    return;
  }

  const doc = loopsDelDoc(readFileSync(DOC, 'utf8'), maquina);
  const cron = loopsDelCron(salida);
  const problemas = comparar(doc, cron);

  console.log(`maquina: ${maquina} · loops en su cron: ${cron.size} · filas "${maquina}" en ${DOC}: ${doc.size}`);
  if (problemas.length === 0) {
    console.log('OK: la tabla y el crontab coinciden en id y horario, en las dos direcciones.');
    return;
  }
  console.error('\nDIFERENCIAS:');
  for (const p of problemas) console.error(`  - ${p}`);
  for (const linea of consejoDeArreglo({ tablaDesincronizada: tablaDesincronizadaConMain() })) {
    console.error(linea);
  }
  process.exit(1);
}

process.argv.includes('--self-check') ? selfCheck() : medir();
