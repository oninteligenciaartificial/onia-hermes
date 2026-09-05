/**
 * ultima-vuelta-visible.test.mjs — el loop TIENE que ver su propia medicion anterior.
 *
 * Desde el 2026-09-03 cada loop escribe una linea `OBJETIVO:` con su medida, y el corredor
 * (`scripts/loops/onia-loop.sh`) le pega arriba del prompt su ULTIMA vuelta para que pueda
 * compararse consigo mismo. De ahi sale la regla del sistema: *"si la medida no se movio desde
 * entonces, esta vuelta cambia de metodo, no lo repite"*.
 *
 * Ese mecanismo entero se apoya en UN filtro (el bloque "TU ULTIMA VUELTA" del corredor). Si el
 * filtro no reconoce la linea, el loop arranca creyendo que no midio nada.
 *
 * ⚠️ EL DEFECTO QUE ESTE TEST BLINDA, medido el 2026-09-04 (tarea t_0314b1bb):
 * el filtro exigia que la linea EMPEZARA con `OBJETIVO:`, y los loops escriben markdown. Dos
 * de los quince la escribieron en negrita y su medicion se volvio invisible:
 *
 *   contenido-cola  linea 217 de su log: `**OBJETIVO:** publicadas 2 ... 2026-09-04 02:22 La Paz`
 *   lucia           linea 265 de su log: `**OBJETIVO:** piezas esperando OK **2** ...`
 *
 * El dano no es cosmetico y no es "le falta un dato": a contenido-cola el corredor le mostro la
 * medicion ANTERIOR (`publicadas 1`, del 03-sep) como si fuera la ultima. O sea que un carril
 * que avanzo de 1 a 2 se lee a si mismo como estancado — y la regla le ordena tirar un metodo
 * que estaba funcionando. Un vigia que hace cambiar lo que anda es peor que uno que calla.
 *
 * La inconsistencia estaba DENTRO del mismo archivo: la linea que manda las `LECCION:` a la
 * memoria compartida si limpia el markdown con el sed que borra el prefijo de simbolos, y esta
 * no. Por eso el caso 3 afirma que las dos usan la misma limpieza: es la causa raiz, no el
 * sintoma. (La constante `LIMPIEZA`, mas abajo, es el sed exacto; no se escribe en este
 * comentario porque contiene la secuencia que cierra un comentario de bloque.)
 *
 * COMO se prueba: no se copia el filtro aca —una copia se queda vieja y aprueba un corredor
 * roto—. Se EXTRAE la linea real del `.sh` y se ejecuta sobre un log sintetico.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const CORREDOR = join(RAIZ, 'scripts/loops/onia-loop.sh');

/** El texto del corredor, leido una vez. */
const FUENTE = readFileSync(CORREDOR, 'utf8');

/**
 * La linea REAL que arma el bloque "TU ULTIMA VUELTA". Se la reconoce por el recorte del log
 * entre las dos ARRANCA (`${PREV_INI},${PREV_FIN}p`), que es lo unico que solo hace ella.
 * Si alguien la renombra, este test se pone rojo pidiendo que lo actualicen — que es correcto:
 * el filtro es el contrato, y un test que no lo encuentra no puede decir que esta bien.
 */
function lineaDelFiltro() {
  const linea = FUENTE.split('\n').find((l) => l.includes('${PREV_INI},${PREV_FIN}p'));
  assert.ok(
    linea,
    `no encontre en ${CORREDOR} la linea que recorta la vuelta anterior (\${PREV_INI},\${PREV_FIN}p). ` +
      'Si se renombro, actualiza este test: sin esa linea no hay nada que verificar.',
  );
  return linea;
}

/**
 * Corre el filtro real del corredor sobre un log de mentira y devuelve lo que el loop VERIA.
 * PREV_INI/PREV_FIN se calculan igual que en el corredor: las dos ultimas `ARRANCA`.
 */
function loQueVeElLoop(contenidoDelLog, nombre = 'ejemplo') {
  const dir = mkdtempSync(join(tmpdir(), 'ultima-vuelta-'));
  const log = join(dir, 'loop.log');
  writeFileSync(log, contenidoDelLog);

  const guion = `
    set -u
    LOG=${JSON.stringify(log)}
    NOMBRE=${JSON.stringify(nombre)}
    PREV_INI=$(grep -n "===== ARRANCA $NOMBRE" "$LOG" | tail -2 | head -1 | cut -d: -f1)
    PREV_FIN=$(grep -n "===== ARRANCA $NOMBRE" "$LOG" | tail -1 | cut -d: -f1)
${lineaDelFiltro()}
  `;
  return execFileSync('bash', ['-c', guion], { encoding: 'utf8' });
}

/** Un log con dos vueltas: la vieja midio y la nueva recien arranca. */
function logCon(medicionDeLaVueltaVieja, nombre = 'ejemplo') {
  return [
    `2026-09-03T20:00:00Z ===== ARRANCA ${nombre} — rama claude/${nombre} — HEAD aaaaaaa — tope 2400s =====`,
    'Una linea cualquiera de prosa que el loop escribio.',
    medicionDeLaVueltaVieja,
    `2026-09-03T20:10:00Z ===== TERMINA ${nombre} — 600s — exit 0 — sin commit =====`,
    `2026-09-04T02:00:00Z ===== ARRANCA ${nombre} — rama claude/${nombre} — HEAD aaaaaaa — tope 2400s =====`,
    '',
  ].join('\n');
}

test('la medicion escrita en NEGRITA le llega igual al loop', () => {
  // El caso exacto de contenido-cola y lucia el 2026-09-04. Es el unico que fallaba.
  const visto = loQueVeElLoop(logCon('**OBJETIVO:** publicadas 2 · entregadas hoy 1 — 2026-09-04 02:22 La Paz'));
  assert.match(
    visto,
    /OBJETIVO:.*publicadas 2/,
    'el loop NO ve su propia medicion si la escribio en negrita: arranca la vuelta creyendo que no midio, ' +
      'y compara contra una medida vieja. Falta `s/^[*_#> -]*//` en el sed del bloque "TU ULTIMA VUELTA".',
  );
});

test('y tambien la RAZON y la LECCION en negrita', () => {
  // Sin la RAZON, un loop parado por una decision de Sergio se lee como un loop que no avanzo
  // porque si, y "cambia de metodo" sobre algo que no depende de el.
  // Las dos van DENTRO de la vuelta vieja: pegarlas al final del log las dejaria despues de la
  // ultima ARRANCA, o sea fuera del recorte, y el caso pasaria a probar otra cosa.
  const visto = loQueVeElLoop(
    logCon(
      '**RAZÓN:** la medida depende del dedo de Sergio, no de este carril\n' +
        '**LECCIÓN:** se descarta medir por HTTP; va con Playwright',
    ),
  );
  assert.match(visto, /RAZÓN:.*dedo de Sergio/, 'la RAZÓN en negrita tiene que llegar');
  assert.match(visto, /LECCIÓN:.*Playwright/, 'la LECCIÓN en negrita tambien');
});

test('la limpieza de markdown es la MISMA que usa la memoria compartida', () => {
  // La causa raiz del defecto fue la asimetria: la linea que manda las LECCION: a
  // onia-aprender.sh limpiaba el markdown y la del bloque "TU ULTIMA VUELTA" no. Dos filtros
  // que leen las mismas lineas con reglas distintas vuelven a divergir solos.
  const LIMPIEZA = "s/^[*_#> -]*//";
  const memoria = FUENTE.split('\n').find((l) => l.includes('onia-aprender.sh') && l.includes('LECCI'));
  assert.ok(memoria, 'no encontre la linea que manda las LECCION: a la memoria compartida');
  assert.ok(memoria.includes(LIMPIEZA), `la linea de la memoria dejo de limpiar markdown (${LIMPIEZA})`);
  assert.ok(
    lineaDelFiltro().includes(LIMPIEZA),
    `el bloque "TU ULTIMA VUELTA" no limpia markdown y la linea de la memoria si. Esa asimetria ES el ` +
      'defecto: agregar `' + LIMPIEZA + '` al sed del filtro.',
  );
});

test('sin negrita sigue funcionando, y el marco de la vuelta se conserva', () => {
  // La guarda de no-romper: el formato que YA usaban 13 de los 15 loops.
  const visto = loQueVeElLoop(logCon('OBJETIVO: ramas varadas 5 · commits sin desplegar 8 — 2026-09-04 03:33 La Paz'));
  assert.match(visto, /OBJETIVO: ramas varadas 5/, 'la linea sin markdown tiene que seguir llegando');
  assert.match(visto, /===== ARRANCA/, 'y el loop tiene que ver como arranco la vuelta anterior');
  assert.match(visto, /===== TERMINA .* exit 0/, 'y como termino: sin eso no distingue una vuelta muerta de una honesta');
});

test('la prosa comun NO se cuela: el bloque es un resumen, no el log entero', () => {
  // Si el filtro se aflojara de mas, el loop recibiria su vuelta anterior COMPLETA y el
  // mecanismo dejaria de ser un resumen comparable.
  const visto = loQueVeElLoop(logCon('OBJETIVO: algo — 2026-09-04 03:33 La Paz'));
  assert.doesNotMatch(visto, /prosa que el loop escribio/, 'la prosa de la vuelta anterior no va en el bloque');
});
