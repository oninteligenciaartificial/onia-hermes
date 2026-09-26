// La receta de «dónde está el build que produccion sirve» vive en UN solo lugar.
//
// ORIGEN (medido el 2026-09-26, carril onia-cola, tarea t_66d7e2f6). `pedido:entregado` —el gate
// que decide si un pedido de deploy ya se cumplio— tenia la receta copiada adentro:
// `shaVivoPlataforma()` casaba el `BUILD_ID` vivo SOLO contra `/opt/onia-platform/build-*`, que es
// STAGING. Desde el 2026-09-24 produccion se publica por imagen y el arbol vivo queda bajo
// `releases/<sha8>-<fecha>/`, con el `BUILD_ID` en la RAIZ; encima `limpiar-builds-staging.sh`
// borra los `build-*`. O sea que despues de cada swap el `BUILD_ID` vivo legitimamente NO tiene
// par en `build-*` -> `shaVivoPlataforma()` devolvia `null` -> `puedePlataforma = false` -> el
// gate DEJABA DE JUZGAR los pedidos de plataforma, y salia EN VERDE igual.
//
// ⚠️ POR QUE ESTE GATE MIRA LA FAMILIA Y NO ESE ARCHIVO. El punto ciego no era de un
// instrumento: era de la RECETA, que estaba copiada en cuatro lugares (`puerta-del-alta.mjs`,
// `addon_canal_vivo.mjs`, `deploy-vivo.mjs`, `pedido_deploy_entregado.mjs`). Arreglar el que
// salto deja viva a la familia — y el proximo layout vuelve a cegar a todos los que se olvidaron.
// Por eso el sujeto se DERIVA DEL DISCO: quien reimplemente la receta manana aparece solo, sin
// que nadie tenga que acordarse de sumarlo a una lista.
//
// ⚠️ Y POR ESO SE QUITAN LOS COMENTARIOS ANTES DE MEDIR. Los archivos de esta familia explican
// los dos layouts en prosa —este mismo archivo lo hace arriba—, asi que un `grep` crudo acusa a
// quien solo lo DOCUMENTA y deja pasar al que lo ejecuta. Un gate que corta en la explicacion en
// vez del codigo mide el pedazo equivocado en verde (medido el 2026-09-24 en `web-factory`).

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

/** El unico archivo al que le corresponde conocer los layouts: es la tabla, no una copia. */
const DUENO_DE_LA_RECETA = 'scripts/lib/arbol-del-build-vivo.mjs';

/**
 * Literales que sólo aparecen cuando alguien está DERIVANDO el build vivo a mano. No se busca
 * `build-` pelado a proposito: es demasiado comun (`build-and-stage`, nombres de script) y un
 * gate que grita de mas se archiva como ruido.
 */
const HUELLAS = [
  { patron: '/app/.next/BUILD_ID', porque: 'lee el BUILD_ID vivo del contenedor por su cuenta' },
  { patron: '.next/standalone/.next/BUILD_ID', porque: 'conoce la ruta del BUILD_ID del layout staging' },
  { patron: '/opt/onia-platform/releases', porque: 'conoce la ruta del layout release' },
];

/**
 * Exentos: archivos a los que se les permite la huella, con su motivo. Cada uno se RE-MIDE en
 * cada corrida (abajo): si el archivo dejo de tener la huella, el exento caduco y este gate lo
 * dice — un exento eterno es como una lista escrita a mano se vuelve mentira sin que nadie mire.
 *
 * ⚠️ Lo que NO esta aca, a proposito: los archivos que YA IMPORTAN el modulo dueño. Esos se
 * eximen DERIVANDO (`importaElDueno`), porque estan cableados y sus literales son fixtures de su
 * propio self-check. Anotarlos a mano seria una lista que envejece sola.
 */
const EXENTOS = new Map([
  [
    'scripts/build-vivo-una-sola-receta.test.mjs',
    'es este gate: nombra las huellas que busca',
  ],
  [
    'scripts/objetivo_visible.mjs',
    'lo nombra en PROSA impresa (una instruccion para el humano que lee la salida), no deriva nada',
  ],
  [
    'hermes-content/deploy/onia-platform/deploy-vivo.mjs',
    'tiene la receta copiada PERO no esta ciego: su fuente primaria es la etiqueta de la imagen ' +
      '(`onia-platform:release-<sha8>`) y el BUILD_ID es respaldo, asi que hoy contesta. Migrarlo ' +
      'al modulo es trabajo declarado, no un perdon: tarea t_4ae98f29.',
  ],
]);

/**
 * Archivos versionados de la familia, derivados de git — no una lista escrita a mano.
 *
 * Los `*.test.mjs` quedan fuera del universo: no son instrumentos, son sus pruebas, y un fixture
 * que nombra la ruta de un layout es legitimo. Lo que este gate cuida es que ningun instrumento
 * DERIVE el build vivo por su cuenta.
 */
function sujetos() {
  const salida = execFileSync(
    'git',
    ['ls-files', '--', 'scripts/*.mjs', 'scripts/*.js', 'scripts/**/*.mjs', 'hermes-content/deploy/**/*.mjs'],
    { encoding: 'utf8', timeout: 60_000 },
  );
  return salida
    .split('\n')
    .filter(Boolean)
    .filter((f) => f !== DUENO_DE_LA_RECETA)
    .filter((f) => !f.endsWith('.test.mjs') && !f.endsWith('.test.js'));
}

/** ¿Este archivo ya está cableado al módulo dueño? Entonces sus literales son fixtures suyos. */
export function importaElDueno(fuente) {
  return sinComentarios(fuente).includes('arbol-del-build-vivo.mjs');
}

/**
 * El codigo de un archivo JS, sin comentarios. Escanea por estado para no confundir un `//`
 * dentro de una cadena (`https://…`) con el arranque de un comentario, que es exactamente como
 * un gate de esta clase se vuelve ciego o histerico.
 */
export function sinComentarios(fuente) {
  let fuera = '';
  let i = 0;
  const n = fuente.length;
  while (i < n) {
    const c = fuente[i];
    const d = fuente[i + 1];
    if (c === '/' && d === '/') {
      while (i < n && fuente[i] !== '\n') i += 1;
      continue;
    }
    if (c === '/' && d === '*') {
      i += 2;
      while (i < n && !(fuente[i] === '*' && fuente[i + 1] === '/')) i += 1;
      i += 2;
      // Se deja un espacio para que `a/*x*/b` no se pegue en `ab`.
      fuera += ' ';
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      const cierre = c;
      fuera += c;
      i += 1;
      while (i < n) {
        if (fuente[i] === '\\') {
          fuera += fuente[i] + (fuente[i + 1] ?? '');
          i += 2;
          continue;
        }
        fuera += fuente[i];
        if (fuente[i] === cierre) {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }
    fuera += c;
    i += 1;
  }
  return fuera;
}

/** Qué huellas tiene un archivo EN CODIGO. */
export function huellasEnCodigo(fuente) {
  const codigo = sinComentarios(fuente);
  return HUELLAS.filter((h) => codigo.includes(h.patron));
}

test('sinComentarios: no confunde una cadena con un comentario', () => {
  assert.equal(sinComentarios('const u = "https://a.b/c";').includes('https://a.b/c'), true);
  assert.equal(sinComentarios("const u = 'x//y';").includes('x//y'), true);
  assert.equal(sinComentarios('const u = `a//b`;').includes('a//b'), true);
});

test('sinComentarios: saca comentarios de linea y de bloque', () => {
  assert.equal(sinComentarios('a // /app/.next/BUILD_ID\nb').includes('BUILD_ID'), false);
  assert.equal(sinComentarios('a /* /app/.next/BUILD_ID */ b').includes('BUILD_ID'), false);
  assert.equal(sinComentarios('a /* x */ b').replace(/\s+/g, ''), 'ab');
});

test('sinComentarios: una barra escapada dentro de una cadena no abre comentario', () => {
  assert.equal(sinComentarios('const r = "a\\\\"; // x\nconst y = 1;').includes('const y'), true);
});

test('huellasEnCodigo: acusa al que la ejecuta, no al que la explica', () => {
  const explica = '// el BUILD_ID vive en /opt/onia-platform/releases/<sha>/BUILD_ID\nconst a = 1;';
  assert.deepEqual(huellasEnCodigo(explica), []);
  const ejecuta = "const p = `/opt/onia-platform/releases/${s}/BUILD_ID`;";
  assert.equal(huellasEnCodigo(ejecuta).length, 1);
});

test('cada EXENTO sigue teniendo su huella: un exento que caduco es una mentira', () => {
  for (const [ruta, motivo] of EXENTOS) {
    const fuente = readFileSync(ruta, 'utf8');
    assert.ok(
      huellasEnCodigo(fuente).length > 0,
      `${ruta} esta exento («${motivo}») pero ya no tiene la huella: sacalo de EXENTOS`,
    );
  }
});

test('un archivo cableado al dueno se exime solo, sin figurar en ninguna lista', () => {
  const cableado = "import { buildQueCorre } from './lib/arbol-del-build-vivo.mjs';\nconst p = '/app/.next/BUILD_ID';";
  assert.equal(importaElDueno(cableado), true);
  // Nombrarlo en un comentario NO cablea nada: es justo la trampa que este gate existe para cazar.
  assert.equal(importaElDueno('// ver arbol-del-build-vivo.mjs\nconst a = 1;'), false);
});

test('la receta del build vivo no esta copiada en ningun instrumento', () => {
  const culpables = [];
  for (const ruta of sujetos()) {
    if (EXENTOS.has(ruta)) continue;
    let fuente;
    try {
      fuente = readFileSync(ruta, 'utf8');
    } catch {
      continue; // borrado entre el ls-files y el read: no es un culpable
    }
    if (importaElDueno(fuente)) continue; // cableado: sus literales son fixtures de su self-check
    const halladas = huellasEnCodigo(fuente);
    if (halladas.length > 0) culpables.push(`${ruta} — ${halladas.map((h) => h.porque).join(' · ')}`);
  }
  assert.deepEqual(
    culpables,
    [],
    `estos instrumentos derivan el build vivo a mano en vez de importar ${DUENO_DE_LA_RECETA}:\n  ${culpables.join('\n  ')}\n` +
      'Un layout nuevo los ciega a todos a la vez, y salen EN VERDE porque devuelven null.',
  );
});
