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
import { readFileSync } from 'node:fs';

const DOC = 'hermes-content/docs/cola/loops.md';

// --- parseo -----------------------------------------------------------------

// Filas de la tabla de activos marcadas **VPS**: | `id` | **VPS** | `cron` (UTC) | para que |
// Se limita a la seccion de activos: la tabla de "Apagados a proposito" tiene otra forma
// (3 columnas, sin **VPS**) y no debe contarse como registro vigente.
export function loopsDelDoc(markdown) {
  const inicio = markdown.indexOf('## Deben existir y estar activos');
  if (inicio === -1) throw new Error(`no encuentro la seccion de activos en ${DOC}`);
  const resto = markdown.slice(inicio + 1);
  const fin = resto.indexOf('\n## ');
  const seccion = fin === -1 ? resto : resto.slice(0, fin);

  const filas = new Map();
  const re = /^\|\s*`([a-z0-9-]+)`\s*\|\s*\*\*VPS\*\*\s*\|\s*`([^`]+)`/gm;
  let m;
  while ((m = re.exec(seccion)) !== null) {
    // El doc escribe el horario como `3 * * * *` (UTC): el sufijo no es parte del cron.
    filas.set(m[1], m[2].trim());
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

  esperar(d.size === 2, 'la tabla aporta solo las filas **VPS** (Windows afuera)');
  esperar(!d.has('web-factory-salud'), 'la tabla de apagados NO cuenta como registro vigente');
  esperar(d.get('onia-cola') === '33 * * * *', 'el sufijo "(UTC)" no se cuela en el horario');
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
  let salida;
  try {
    salida = execFileSync('crontab', ['-l'], { encoding: 'utf8' });
  } catch {
    console.log('sin `crontab -l` disponible: no se puede medir acá (esto NO es una falla).');
    console.log('El registro de los loops vive en el VPS 187.77.16.63 — corré esto ahí.');
    return;
  }

  const doc = loopsDelDoc(readFileSync(DOC, 'utf8'));
  const cron = loopsDelCron(salida);
  const problemas = comparar(doc, cron);

  console.log(`loops en cron: ${cron.size} · filas VPS en ${DOC}: ${doc.size}`);
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
