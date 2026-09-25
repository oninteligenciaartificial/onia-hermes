#!/usr/bin/env node
/**
 * bloqueo_citado_vivo.mjs — una cola que dice "esto depende de Sergio Urcullo (tarea t_XXX)"
 * tiene que citar una tarea que SIGA VIVA.
 *
 * Nace del 2026-09-25, midiendo `plataforma-v1.md:267`:
 *
 *   "No se pudo mirar renderizado con sesión real — sigue vivo el corte de 2FA que manda
 *    toda ruta del panel a /profile?mfa=obligatorio (tarea `t_3bb6b9ee`, depende de Sergio
 *    Urcullo)."
 *
 *   Las dos mitades de esa frase estaban vencidas: la tarea `t_3bb6b9ee` estaba ARCHIVADA
 *   desde el 2026-09-18, y el corte de 2FA se habia resuelto el 2026-09-24 cableando TOTP en
 *   `scripts/lib/sesion_dueno.mjs`. Medido ese dia: `mirar_bandeja_dueno.mjs --ruta /inbox`
 *   sale 0, con sesion aal2 y URL final `/inbox`. O sea la linea le pedia a Sergio Urcullo una
 *   decision que ya habia tomado, y de paso declaraba imposible la unica verificacion que este
 *   carril necesita — MIRAR una pantalla con sesion real.
 *
 *   node scripts/bloqueo_citado_vivo.mjs hermes-content/docs/cola/plataforma-v1.md
 *   node scripts/bloqueo_citado_vivo.mjs --self-check
 *
 * POR QUE NO LO AGARRABA `bloqueos_vencidos.mjs`. Ese gate mide las filas de la tabla
 * "Bloqueado en Sergio" que declaran su `**Verificador:**`. Este bloqueo no estaba en ninguna
 * tabla —vivia en el cuerpo de un item— y `plataforma-v1.md` NO TIENE esa tabla, asi que el
 * gate sale "NO MEDIDO" para esa cola entera. Los dos gates son complementarios y ninguno
 * reemplaza al otro: aquel pregunta "¿el verificador ya sale verde?", este pregunta "¿la
 * tarea que esta linea nombra como freno sigue existiendo?".
 *
 * QUE MIDE. Lineas que nombran un id del tablero (`t_` + 8 hex) Y ADEMAS hablan en PRESENTE de
 * estar esperando algo ("depende de Sergio", "espera decision", "sigue bloqueado"...). De cada
 * id citado asi se le pregunta al tablero su estado:
 *   - vivo (`ready`/`todo`/`blocked`/`in_progress`) → OK, la linea dice la verdad.
 *   - `done` / `archived` / inexistente              → ITEM: la linea cita un freno que ya no existe.
 *
 * POR QUE SE PREGUNTA POR EL ID Y NO SE LISTA TODO. `onia-tablero.sh list` no devuelve las
 * ARCHIVADAS, asi que "no esta en la lista" mezcla archivada con inexistente... y tambien con
 * "la lista vino truncada". Un gate que concluye ROJO desde una lista incompleta traba el
 * merge de TODOS los carriles por un problema de paginado. `show <id>` es la respuesta
 * autoritativa sobre UN id, y los ids que importan son poquitos (los de lineas con lenguaje de
 * bloqueo), asi que preguntar de a uno es barato y no se apoya en la completitud de nada.
 *
 * FALLO CONSERVADOR, igual que `bloqueos_vencidos.mjs`. Si el tablero no se puede consultar
 * (no existe el shim, timeout, salida sin `status:`), el id sale NO MEDIDO y el gate termina
 * en 2, no en 1. No medir NO es "esta vencido": cerrar un bloqueo de menos le pide a Sergio
 * Urcullo algo que ya hizo, pero inventarle un rojo a la cadena deja a todos sin mergear.
 */

import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const TABLERO = process.env.ONIA_TABLERO || '/root/bin/onia-tablero.sh';
const TIMEOUT_MS = Number(process.env.ONIA_BLOQUEO_CITADO_TIMEOUT_MS || 60000);

const ID = /t_[0-9a-f]{8}/g;

/**
 * Los estados en los que una tarea todavia puede frenar algo. Cualquier otro (`done`,
 * `archived`, y lo que el tablero invente despues) NO frena: por eso la lista blanca es de lo
 * VIVO y no una lista negra de lo muerto — un estado nuevo tiene que entrar a mano, y mientras
 * tanto se lee como muerto, que es el lado barato de equivocarse.
 */
export const ESTADOS_VIVOS = new Set(['ready', 'todo', 'blocked', 'in_progress', 'doing']);

/**
 * El lenguaje que hace que una cita sea un FRENO y no una nota historica.
 *
 * Es deliberadamente corto. Las colas nombran decenas de tareas como historia ("cerrado en
 * t_XXX", "lo midio t_XXX") y esas citas SON correctas apuntando a una tarea done — marcarlas
 * seria el gate gritando en falso, que es como se apaga un gate. Solo muerde el presente:
 * la linea tiene que decir que algo ESTA esperando.
 */
export const LENGUAJE_DE_FRENO =
  /depende de Sergio|espera (?:la )?decisi|esperando (?:el |su )?ok|sigue (?:vivo el |sin )?bloquead|sigue bloqueado|bloqueado en Sergio|pendiente de Sergio|necesita el ok de Sergio|sigue vivo el corte/i;

/**
 * Saca las citas que afirman un freno vigente. Sin red y sin disco: es lo que se prueba en
 * `--self-check`.
 */
export function citasDeBloqueo(md) {
  const citas = [];
  md.split(/\r?\n/).forEach((linea, i) => {
    if (!LENGUAJE_DE_FRENO.test(linea)) return;
    const ids = [...new Set(linea.match(ID) ?? [])];
    for (const id of ids) citas.push({ id, linea: i + 1, texto: linea.trim() });
  });
  return citas;
}

/** Traduce la salida de `onia-tablero.sh show` a un estado. Pura: se le pasa el texto. */
export function estadoDesdeShow(salida) {
  const m = /^\s*status:\s*(\S+)\s*$/m.exec(salida ?? '');
  return m ? m[1] : null;
}

/**
 * Traduce los estados a los motivos por los que ESTO es un item. Pura, como en
 * `bloqueos_vencidos.mjs`: la parte que decide se prueba sin consultar nada.
 */
export function juzgar(resultados) {
  const motivos = [];
  for (const r of resultados) {
    if (r.estado === null) continue; // no medido: no es un item, es un aviso
    if (ESTADOS_VIVOS.has(r.estado)) continue;
    motivos.push(
      `${r.archivo}:${r.linea} cita \`${r.id}\` como freno vigente y esa tarea esta ${r.estado}. ` +
        `La linea le pide a Sergio Urcullo una decision que ya tomo — reescribila con lo que se ` +
        `midio, o nombra la tarea VIVA que de verdad frena`,
    );
  }
  return motivos;
}

/** Consulta un id. Devuelve null cuando NO SE PUDO medir (que no es lo mismo que muerto). */
function consultar(id) {
  try {
    const salida = execFileSync(TABLERO, ['show', id], {
      cwd: RAIZ,
      encoding: 'utf8',
      timeout: TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return estadoDesdeShow(salida);
  } catch (e) {
    // Una tarea inexistente puede salir por error; su texto igual puede traer el status.
    return estadoDesdeShow(e?.stdout);
  }
}

if (process.argv.includes('--self-check')) {
  let casos = 0;
  const afirmar = (cond, que) => { casos++; if (!cond) { console.error('FALLO:', que); process.exitCode = 1; } };

  const md = [
    'Una linea cualquiera sin ids.',
    'ruta del panel a `/profile?mfa=obligatorio` (tarea `t_3bb6b9ee`, depende de Sergio Urcullo).',
    'CERRADO el 2026-09-18 por la tarea `t_82251f19` — historia, no freno.',
    'El pedido `t_aaaaaaa1` espera decision de Sergio Urcullo.',
    'Lo midio t_bbbbbbb2 y quedo hecho.',
  ].join('\n');

  const citas = citasDeBloqueo(md);
  afirmar(citas.length === 2, 'solo las lineas con lenguaje de freno son citas');
  afirmar(citas[0].id === 't_3bb6b9ee' && citas[0].linea === 2, 'saca el id y la linea del caso real');
  afirmar(!citas.some((c) => c.id === 't_82251f19'), 'una cita historica (CERRADO en t_X) NO es un freno');
  afirmar(!citas.some((c) => c.id === 't_bbbbbbb2'), '"lo midio t_X" tampoco: habla en pasado');

  const dos = citasDeBloqueo('depende de Sergio Urcullo: t_aaaaaaa1 y t_aaaaaaa2 frenan esto');
  afirmar(dos.length === 2, 'una linea puede citar dos frenos');
  const repe = citasDeBloqueo('depende de Sergio Urcullo: t_aaaaaaa1, ver t_aaaaaaa1');
  afirmar(repe.length === 1, 'el mismo id repetido en la linea se cuenta una vez');

  // El parseo del tablero.
  afirmar(estadoDesdeShow('Task t_x: hola\n  status:    archived\n  assignee:  -') === 'archived', 'lee el status de show');
  afirmar(estadoDesdeShow('Task t_x: hola\n  status:    ready\n') === 'ready', 'lee un status vivo');
  afirmar(estadoDesdeShow('no such task') === null, 'sin linea de status no inventa estado');
  afirmar(estadoDesdeShow(undefined) === null, 'una salida vacia no rompe el parseo');

  // Lo que MUERDE.
  const vivo = juzgar([{ id: 't_1', estado: 'blocked', archivo: 'c.md', linea: 1 }]);
  afirmar(vivo.length === 0, 'un freno que cita una tarea VIVA no es un item');
  afirmar(juzgar([{ id: 't_1', estado: 'ready', archivo: 'c.md', linea: 1 }]).length === 0, 'ready tambien es vivo');
  const muerto = juzgar([{ id: 't_3bb6b9ee', estado: 'archived', archivo: 'hermes-content/docs/cola/plataforma-v1.md', linea: 267 }]);
  afirmar(muerto.length === 1, 'un freno que cita una tarea ARCHIVADA si es un item');
  afirmar(muerto[0].includes('t_3bb6b9ee') && muerto[0].includes(':267'), 'el motivo dice QUE id y DONDE esta la linea');
  afirmar(muerto[0].includes('ya tomo'), 'y dice por que importa: le pide una decision ya tomada');
  afirmar(juzgar([{ id: 't_1', estado: 'done', archivo: 'c.md', linea: 1 }]).length === 1, 'done tampoco frena');
  afirmar(juzgar([{ id: 't_1', estado: 'inexistente', archivo: 'c.md', linea: 1 }]).length === 1, 'un id que no existe tampoco frena');
  afirmar(juzgar([{ id: 't_1', estado: null, archivo: 'c.md', linea: 1 }]).length === 0, 'NO MEDIDO no es un item: fallo conservador');

  if (!process.exitCode) console.log(`self-check: ok — ${casos} casos`);
  process.exit(process.exitCode || 0);
}

const rutas = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!rutas.length) {
  console.error('uso: node scripts/bloqueo_citado_vivo.mjs <cola.md> [<cola.md>...] | --self-check');
  process.exit(2);
}

const resultados = [];
for (const ruta of rutas) {
  for (const cita of citasDeBloqueo(await readFile(ruta, 'utf8'))) {
    resultados.push({ ...cita, archivo: ruta, estado: consultar(cita.id) });
  }
}

if (!resultados.length) {
  console.log(`bloqueos citados: ninguna linea afirma un freno vigente en ${rutas.join(', ')}`);
  process.exit(0);
}

for (const r of resultados) {
  const vivo = r.estado !== null && ESTADOS_VIVOS.has(r.estado);
  const etiqueta = r.estado === null ? 'NO MEDIDO' : vivo ? 'OK       ' : 'ITEM     ';
  console.log(`  ${etiqueta} ${r.id} ${String(r.estado ?? 'no se pudo consultar').padEnd(12)} ${r.archivo}:${r.linea}`);
}

const noMedidos = resultados.filter((r) => r.estado === null);
const motivos = juzgar(resultados);

if (motivos.length) {
  console.error(`\nBLOQUEO CITADO QUE YA NO EXISTE`);
  for (const m of motivos) console.error(`  - ${m}`);
  console.error(
    '\nUn bloqueo vencido es peor que un fantasma: le presta su motivo falso al de al lado y ' +
      'declara imposible una verificacion que hoy se puede hacer.',
  );
  process.exit(1);
}

if (noMedidos.length) {
  console.error(
    `\nNO MEDIDO — ${noMedidos.length} de ${resultados.length} cita(s) no se pudieron consultar ` +
      `(${TABLERO}). No medir no es "esta vencido", asi que esto no es rojo: es que falta el instrumento.`,
  );
  process.exit(2);
}

console.log(`bloqueos citados: ${resultados.length} cita(s), todas nombran una tarea VIVA`);
process.exit(0);
