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
  const vias = new Map([['onia-platform|casa', { comando: '/root/bin/onia-vps.sh bash -lc "..."' }]]);
  const v = veredicto(
    [{ nombre: 'onia-platform', varadas: 3, push: 'DESHABILITADO-NODO-DE-DESARROLLO' }],
    { maquina: 'casa', vias },
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
