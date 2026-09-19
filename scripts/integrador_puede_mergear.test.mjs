// Gate del INTEGRADOR: que pueda llegar a los DOS repos que le tocan.
//
// POR QUE EXISTE, medido el 2026-09-07 05:40 UTC por onia-cola:
// el VPS quedo con CERO loops (`crontab -l | grep onia-loop.sh` vacio) y los cuatro
// se mudaron a nodo-casa. En casa, `/root/loops/onia-platform` tiene la url de push
// puesta a mano en `DESHABILITADO-NODO-DE-DESARROLLO` — a proposito, es un seguro.
// Resultado: el unico loop autorizado a mergear a `master` corre en una maquina desde
// la que ese `git push` es imposible.
//
// Hoy no muerde porque `onia-platform` no tiene ni una rama de carril sin mergear. Por
// eso es peligroso: es un gate que falla ABIERTO. El dia que un carril pushee alla, el
// `--no-merged` del integrador crece y NADA se pone rojo — la unica senal seria que sus
// vueltas digan "no puedo", que se lee igual que "no habia nada que hacer".
//
// La via que SI funciona existe y esta comprobada: el clon del VPS
// (`/root/loops/onia-platform`, remoto `gh-platform:`) esta en `master`, limpio y con
// `git push --dry-run` -> "Everything up-to-date", y se lo alcanza desde casa con el
// shim `/root/bin/onia-vps.sh`. Lo que faltaba no era la capacidad: era MEDIRLA.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  urlDePush,
  viasDeclaradas,
  veredicto,
  viaConFuente,
  rutasCitadas,
} from './integrador_puede_mergear.mjs';

// --- leer la url de push de `git remote -v` ---------------------------------

test('urlDePush toma la linea (push), no la de (fetch)', () => {
  const salida = [
    'origin\tgit@github.com:x/onia-platform.git (fetch) [blob:none]',
    'origin\tDESHABILITADO-NODO-DE-DESARROLLO (push)',
  ].join('\n');
  assert.equal(urlDePush(salida), 'DESHABILITADO-NODO-DE-DESARROLLO');
});

test('urlDePush no confunde un remoto ajeno con origin', () => {
  const salida = [
    'upstream\tgit@github.com:otro/repo.git (push)',
    'origin\tgh-platform:x/onia-platform.git (fetch)',
    'origin\tgh-platform:x/onia-platform.git (push)',
  ].join('\n');
  assert.equal(urlDePush(salida), 'gh-platform:x/onia-platform.git');
});

test('urlDePush devuelve null si no hay linea de push', () => {
  assert.equal(urlDePush('origin\tgit@github.com:x/y.git (fetch)'), null);
});

// --- declarar la via alternativa en un doc que ya existe --------------------

test('viasDeclaradas lee la marca del doc y la indexa por repo', () => {
  const doc = [
    '# Los loops',
    'texto cualquiera',
    'VIA-INTEGRADOR onia-platform casa: /root/bin/onia-vps.sh bash -lc "cd /root/loops/onia-platform && git merge ..."',
    'mas texto',
  ].join('\n');
  const vias = viasDeclaradas(doc);
  assert.equal(vias.get('onia-platform|casa').comando.startsWith('/root/bin/onia-vps.sh'), true);
});

test('viasDeclaradas NO cuenta una via de otra maquina', () => {
  const doc = 'VIA-INTEGRADOR onia-platform VPS: git push origin master';
  const vias = viasDeclaradas(doc);
  assert.equal(vias.has('onia-platform|casa'), false);
  assert.equal(vias.has('onia-platform|VPS'), true);
});

test('viasDeclaradas ignora una marca sin comando', () => {
  const doc = 'VIA-INTEGRADOR onia-platform casa:';
  assert.equal(viasDeclaradas(doc).size, 0);
});

// --- el veredicto ------------------------------------------------------------

const sano = { nombre: 'onia-hermes', varadas: 0, push: 'git@github.com:x/onia-hermes.git' };

test('un repo con push propio y sin ramas varadas es OK', () => {
  const v = veredicto([sano], { maquina: 'casa', vias: new Map() });
  assert.equal(v.codigo, 0);
  assert.equal(v.rojos.length, 0);
});

test('un repo con push propio Y ramas varadas sigue siendo OK: puede mergearlas', () => {
  const v = veredicto([{ ...sano, varadas: 6 }], { maquina: 'casa', vias: new Map() });
  assert.equal(v.codigo, 0);
});

// El caso REAL del 2026-09-07, y el unico que este guardia puede ver:
// push deshabilitado, sin via escrita. Hoy da rojo aunque varadas sea 0 — a proposito:
// esperar a que haya trabajo varado para avisar es avisar tarde, y el aviso llegaria
// como "no puedo", que se lee igual que "no habia nada que hacer".
test('ROJO: push deshabilitado y NINGUNA via declarada para esta maquina', () => {
  const v = veredicto(
    [{ nombre: 'onia-platform', varadas: 0, push: 'DESHABILITADO-NODO-DE-DESARROLLO' }],
    { maquina: 'casa', vias: new Map() },
  );
  assert.equal(v.codigo, 1);
  assert.match(v.rojos[0], /onia-platform/);
});

test('con la via declarada para ESTA maquina, el mismo repo pasa a aviso', () => {
  const vias = new Map([
    [
      'onia-platform|casa',
      { comando: '/root/bin/onia-vps.sh bash -lc "bash scripts/integrar-onia-platform.sh claude/x"' },
    ],
  ]);
  const v = veredicto(
    [{ nombre: 'onia-platform', varadas: 3, push: 'DESHABILITADO-NODO-DE-DESARROLLO' }],
    { maquina: 'casa', vias, archivosDelRepo: ['scripts/integrar-onia-platform.sh'] },
  );
  assert.equal(v.codigo, 0);
  assert.equal(v.avisos.length, 1);
  assert.match(v.avisos[0], /onia-vps\.sh/);
});

// La via es POR MAQUINA: una escrita para el VPS no salva al nodo de casa. Sin este
// caso, indexar las vias por repo a secas pasaria igual y el gate absolveria a casa
// leyendo una via que alla no se puede correr.
test('ROJO: la via declarada es de OTRA maquina', () => {
  const vias = new Map([['onia-platform|VPS', { comando: 'git push origin master' }]]);
  const v = veredicto(
    [{ nombre: 'onia-platform', varadas: 0, push: 'DESHABILITADO-NODO-DE-DESARROLLO' }],
    { maquina: 'casa', vias },
  );
  assert.equal(v.codigo, 1);
});

// Sin saber que maquina es, NO se mide: un gate que miente es peor que uno ausente.
test('maquina desconocida sale NO MEDIDO (2), nunca verde', () => {
  const v = veredicto(
    [{ nombre: 'onia-platform', varadas: 0, push: 'DESHABILITADO-NODO-DE-DESARROLLO' }],
    { maquina: null, vias: new Map() },
  );
  assert.equal(v.codigo, 2);
});

// Un remoto que no se pudo leer tampoco puede dar verde por omision.
test('sin url de push legible sale NO MEDIDO (2)', () => {
  const v = veredicto([{ nombre: 'onia-hermes', varadas: 0, push: null }], {
    maquina: 'casa',
    vias: new Map(),
  });
  assert.equal(v.codigo, 2);
});

// --- el doc vivo tiene que declarar la via que hoy hace falta ----------------
//
// Este es el caso que ata el gate a la realidad: si alguien borra la marca de
// loops.md, el gate se pone rojo y dice donde. Se prueba contra el archivo REAL,
// no contra un fixture, porque lo que custodia es justamente ese archivo.
test('loops.md declara la via del integrador para onia-platform desde casa', async () => {
  const { readFileSync } = await import('node:fs');
  const doc = readFileSync('hermes-content/docs/cola/loops.md', 'utf8');
  const vias = viasDeclaradas(doc);
  assert.equal(
    vias.has('onia-platform|casa'),
    true,
    'falta la marca VIA-INTEGRADOR de onia-platform para casa en hermes-content/docs/cola/loops.md',
  );
});

// --- la via declarada tiene que tener FUENTE en el repo ----------------------
//
// POR QUE, medido el 2026-09-19 por onia-cola auditando los [x] (escalon 2):
// hasta hoy la marca VIA-INTEGRADOR era una cadena LIBRE: alcanzaba con que
// existiera para que el gate firmara "via declarada OK". O sea el gate no medía
// la via, medía que alguien la hubiera escrito alguna vez — y una via se vence.
//
// La que estaba escrita para `onia-platform|casa` era una receta INLINE
// (`cd /root/loops/onia-platform && git merge ... && git push origin master`) y
// estaba ROTA, medido en vivo ese dia: ese arbol del VPS esta en la rama
// `claude/chatbots-platform-review-0d1d09` con 106 archivos sucios, o sea el
// merge caeria sobre el carril en vuelo de `chatbot-cola` — el unico loop que
// escribe en ese repo — y el `git push origin master` empujaria una rama local
// que no es donde se mergeo. Ademas corre 3 de los 5 gates del CI y no tiene
// reintento, asi que rebota si `master` se movio (rebotó DOS veces el 18-sep).
//
// La via que SI funciona quedo versionada el 18-sep en
// `scripts/integrar-onia-platform.sh` (publico 5ed97b0 con 5.704 tests verdes),
// y NADIE la nombraba: `grep -rl integrar-onia-platform` daba solo COLA.md y el
// propio script. O sea la proxima vuelta del integrador, que arranca sin
// memoria, leia la receta vencida y no tenia como enterarse de la buena.
//
// La regla es "al menos UNA ruta citada vive en el repo", no "todas": una via
// legitima nombra tambien shims de `/root/bin` (`onia-vps.sh`), que no estan
// versionados con ese nombre a proposito. Lo que tiene que ser imposible es una
// via SIN una sola pieza auditable.

test('rutasCitadas saca el script de una via con ruta absoluta del VPS', () => {
  const rutas = rutasCitadas(
    "/root/bin/onia-vps.sh bash -lc 'bash /root/loops/onia-hermes/scripts/integrar-onia-platform.sh claude/x'",
  );
  assert.equal(rutas.includes('/root/loops/onia-hermes/scripts/integrar-onia-platform.sh'), true);
  // `claude/x` es una RAMA, no un archivo: no tiene extension y no se cuenta.
  assert.equal(rutas.some((r) => r.includes('claude/x')), false);
});

test('ROJO: una via inline no nombra NINGUN script del repo', () => {
  const vias = new Map([
    [
      'onia-platform|casa',
      {
        comando:
          "/root/bin/onia-vps.sh bash -lc 'cd /root/loops/onia-platform && git merge --no-ff origin/<rama> && npx tsc --noEmit && git push origin master'",
      },
    ],
  ]);
  const v = veredicto(
    [{ nombre: 'onia-platform', varadas: 2, push: 'DESHABILITADO-NODO-DE-DESARROLLO' }],
    { maquina: 'casa', vias, archivosDelRepo: ['scripts/integrar-onia-platform.sh'] },
  );
  assert.equal(v.codigo, 1);
  assert.match(v.rojos.join(' '), /sin fuente|no nombra/i);
});

test('ROJO: la via cita un script que NO existe en el repo', () => {
  const vias = new Map([
    ['onia-platform|casa', { comando: 'bash /root/loops/onia-hermes/scripts/borrado-hace-meses.sh' }],
  ]);
  const v = veredicto(
    [{ nombre: 'onia-platform', varadas: 0, push: 'DESHABILITADO-NODO-DE-DESARROLLO' }],
    { maquina: 'casa', vias, archivosDelRepo: ['scripts/integrar-onia-platform.sh'] },
  );
  assert.equal(v.codigo, 1);
  assert.match(v.rojos.join(' '), /borrado-hace-meses\.sh/);
});

// El reciproco, que es lo que impide que cerrar el ruido afloje el gate: una via
// que SI nombra su fuente sigue pasando, aunque cite ademas un shim sin versionar.
test('una via que nombra su fuente versionada pasa, aunque cite tambien un shim', () => {
  const vias = new Map([
    [
      'onia-platform|casa',
      {
        comando:
          '/root/bin/onia-vps.sh bash -lc "bash /root/loops/onia-hermes/scripts/integrar-onia-platform.sh claude/x"',
      },
    ],
  ]);
  const v = veredicto(
    [{ nombre: 'onia-platform', varadas: 3, push: 'DESHABILITADO-NODO-DE-DESARROLLO' }],
    { maquina: 'casa', vias, archivosDelRepo: ['scripts/integrar-onia-platform.sh'] },
  );
  assert.equal(v.codigo, 0);
  assert.equal(v.avisos.length, 1);
});

// Tri-estado: no poder listar el repo NO es "la via esta bien". Un gate que
// confunde "no pude preguntar" con "me dijeron que si" falla al lado caro.
test('sin poder listar el repo, la via sale NO MEDIDO (2), nunca verde', () => {
  const vias = new Map([['onia-platform|casa', { comando: 'bash algo.sh' }]]);
  const v = veredicto(
    [{ nombre: 'onia-platform', varadas: 0, push: 'DESHABILITADO-NODO-DE-DESARROLLO' }],
    { maquina: 'casa', vias, archivosDelRepo: null },
  );
  assert.equal(v.codigo, 2);
});

// EL CASO ANCLA: se prueba contra el doc REAL y el disco REAL, porque lo que este
// gate custodia es justamente que el integrador de la proxima vuelta pueda
// encontrar su camino. Un fixture no puede afirmar eso.
test('la via viva de loops.md nombra un script que existe en el repo', async () => {
  const { readFileSync, existsSync } = await import('node:fs');
  const doc = readFileSync('hermes-content/docs/cola/loops.md', 'utf8');
  const via = viasDeclaradas(doc).get('onia-platform|casa');
  assert.ok(via, 'falta la marca VIA-INTEGRADOR de onia-platform para casa');
  // El universo sale de git, que es justo lo que este caso afirma: la via tiene que
  // apoyarse en algo VERSIONADO. Y se juzga con la funcion del PRODUCTO, no con una
  // copia: un test con su propia copia de la regla nunca toca el producto.
  const { execFileSync } = await import('node:child_process');
  const archivos = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
  const fuente = viaConFuente(via.comando, archivos);
  assert.ok(
    fuente.ok,
    `la via declarada para onia-platform desde casa esta sin fuente: ${fuente.motivo}. ` +
      'Una via sin script versionado no se puede auditar ni arreglar, y la proxima vuelta del ' +
      'integrador no tiene como saber cual es el camino bueno.',
  );
  // Y el archivo que nombra tiene que existir DE VERDAD en el arbol, no solo en el indice.
  for (const r of fuente.rutas) {
    const rel = archivos.find((f) => r === f || r.endsWith(`/${f}`));
    assert.equal(existsSync(rel), true, `${rel} esta en el indice pero no en el arbol`);
  }
});
