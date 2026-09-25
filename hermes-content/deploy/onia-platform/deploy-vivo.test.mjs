import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, delimiter } from 'node:path';

import {
  AL_DIA,
  ARREGLOS_VARADOS,
  NO_PUDE_MEDIR,
  RETROCEDE,
  CUBRE,
  VIEJO,
  NINGUNO,
  shaQueCorre,
  shaDeEtiqueta,
  shaVivoConciliado,
  llegaAlCliente,
  diagnosticar,
  evaluarStaged,
  varadosDesde,
  parsearBuildsSsh,
  buildsDeProduccion,
  buildsEnDisco,
  guionBuildsSsh,
  shaDeImagen,
  stagedPara,
  medir,
  REPO,
  RAMA_DEPLOY,
} from './deploy-vivo.mjs';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const AQUI = dirname(fileURLToPath(import.meta.url));

// ── la receta por IMAGEN (2026-09-24) ───────────────────────────────────────
// Desde el 24-sep producción es una imagen autocontenida `onia-platform:release-<sha8>`
// y lo armado vive en `/opt/onia-platform/releases/<sha8>-<yyyymmdd>/` con sus archivos
// BUILD_ID y SHA. Sin esto el medidor sólo conocía los `build-<sha>` y el publicador
// salía cerrado con «BUILD_ID vivo sin par en disco» — honesto, pero sin publicar nunca.

test('casa el BUILD_ID vivo contra un release (receta por imagen)', () => {
  const builds = [
    { sha: 'abcdef12', buildId: 'IdDelRelease', tipo: 'release', integro: true },
    { sha: 'b54a148', buildId: 'IdViejo', tipo: 'legacy', integro: true },
  ];
  assert.equal(shaQueCorre({ buildIdVivo: 'IdDelRelease', builds }), 'abcdef12');
});

// El par de HOY: el release 7bcd0a83-20260924 se armó a mano y no tiene BUILD_ID ni SHA
// escritos. El sha sale del nombre de la imagen que corre el contenedor vivo.
test('el par del 24-sep: FU8j… corre la imagen release-7bcd0a83 aunque su release no tenga BUILD_ID', () => {
  const builds = [
    { sha: '7bcd0a83', buildId: null, tipo: 'release', integro: false },
    { sha: 'b54a148', buildId: 'sNMW9rcT8D15GNP2qKYlm', tipo: 'legacy', integro: true },
  ];
  const sha = shaQueCorre({
    buildIdVivo: 'FU8j_OHPyRH1XCCr6-0uY',
    builds,
    imagenViva: 'onia-platform:release-7bcd0a83',
  });
  assert.equal(sha, '7bcd0a83');
});

test('el nombre de la imagen sólo dice un sha si es un release de onia-platform', () => {
  assert.equal(shaDeImagen('onia-platform:release-7bcd0a83'), '7bcd0a83');
  assert.equal(shaDeImagen('node:20-alpine'), null);
  assert.equal(shaDeImagen('sha256:0123456789abcdef'), null);
  assert.equal(shaDeImagen('otra-app:release-7bcd0a83'), null);
  assert.equal(shaDeImagen(null), null);
});

// La receta vieja: node:20-alpine con el bind de runtime-next. Su imagen no dice nada, y
// el sha sale —como siempre— de casar el BUILD_ID contra los build-<sha>.
test('fallback legado: contenedor node:20 casa por BUILD_ID contra build-<sha>', () => {
  const builds = [{ sha: 'b54a148', buildId: 'sNMW9rcT8D15GNP2qKYlm', tipo: 'legacy', integro: true }];
  assert.equal(
    shaQueCorre({ buildIdVivo: 'sNMW9rcT8D15GNP2qKYlm', builds, imagenViva: 'node:20-alpine' }),
    'b54a148',
  );
});

test('sin par en disco y con una imagen que no es release: null, jamás un sha inventado', () => {
  const builds = [{ sha: 'b54a148', buildId: 'otro', tipo: 'legacy', integro: true }];
  assert.equal(shaQueCorre({ buildIdVivo: 'X', builds, imagenViva: 'node:20-alpine' }), null);
});

test('sin poder listar el disco (builds null) no se mide por el nombre de la imagen', () => {
  assert.equal(shaQueCorre({ buildIdVivo: 'X', builds: null, imagenViva: 'onia-platform:release-7bcd0a83' }), null);
});

// El swap nuevo necesita una IMAGEN. Un build-<sha> legado del HEAD, aunque esté íntegro,
// no se puede publicar: contarlo como staged deja al publicador llamando al swap para
// siempre sin imagen, en rojo cada 3 horas.
test('un build-<sha> legado del HEAD NO es staged: el swap por imagen no lo puede publicar', () => {
  const builds = [{ sha: '0db6549', buildId: 'x', tipo: 'legacy', integro: true }];
  assert.equal(stagedPara(builds, '0db6549'), null);
  assert.equal(evaluarStaged({ staged: stagedPara(builds, '0db6549'), headSha: '0db6549' }).estado, NINGUNO);
});

test('el release del HEAD sí es staged, aunque git abrevie el HEAD a 7 y el release use 8', () => {
  const rel = { sha: '0db6549a', buildId: 'x', tipo: 'release', integro: true, ruta: '/opt/onia-platform/releases/0db6549a-20260925' };
  assert.equal(stagedPara([rel], '0db6549'), rel);
  assert.equal(evaluarStaged({ staged: rel, headSha: '0db6549' }).estado, CUBRE);
});

test('un release del HEAD sin imagen o sin BUILD_ID (integro=false) NO cubre', () => {
  const rel = { sha: '0db6549a', buildId: null, tipo: 'release', integro: false };
  assert.notEqual(evaluarStaged({ staged: stagedPara([rel], '0db6549a'), headSha: '0db6549a' }).estado, CUBRE);
});

// medir() es lo que corre publicar.sh. Probar sus piezas sueltas no alcanza: si medir()
// deja de pasarle la imagen viva a shaQueCorre, el par de hoy sale NO_PUDE_MEDIR, el
// publicador se corta ANTES de armar un release con BUILD_ID y queda trabado para
// siempre con la suite en verde. Los lectores se inyectan: nada toca docker ni git.
const mundoMedir = (extra = {}) => ({
  builds: () => [
    { sha: '7bcd0a83', buildId: null, tipo: 'release', integro: false, ruta: '/opt/onia-platform/releases/7bcd0a83-20260924' },
  ],
  buildIdVivo: () => 'FU8j_OHPyRH1XCCr6-0uY',
  imagenViva: () => 'onia-platform:release-7bcd0a83',
  headDeploy: () => '7bcd0a8',
  varadosDesde: () => [],
  desciendeDe: () => true,
  ...extra,
});

test('medir(): el par de hoy (FU8j… sobre release-7bcd0a83 sin BUILD_ID) corre 7bcd0a83 y está al día', () => {
  const r = medir(mundoMedir());
  assert.equal(r.shaVivo, '7bcd0a83');
  assert.equal(r.codigo, AL_DIA, r.motivo);
});

test('medir(): el staged es el release de 8 del HEAD de 7, no un build-<sha> legado que casa exacto', () => {
  const release = { sha: 'abcdef12', buildId: 'IdNuevo', tipo: 'release', integro: true, ruta: '/opt/onia-platform/releases/abcdef12-20260925' };
  const legado = { sha: 'abcdef1', buildId: 'IdLegado', tipo: 'legacy', integro: true, ruta: '/opt/onia-platform/build-abcdef1' };
  const r = medir(
    mundoMedir({
      builds: () => [release, legado],
      headDeploy: () => 'abcdef1',
      varadosDesde: () => [{ sha: 'abcdef1', asunto: 'fix: algo que el cliente ve' }],
    }),
  );
  assert.equal(r.codigo, ARREGLOS_VARADOS, r.motivo);
  assert.equal(r.staged.estado, CUBRE, r.staged.motivo);
  assert.equal(r.staged.ruta, release.ruta);
});

test('lee releases y build-<sha> del disco, con su sha, BUILD_ID e integridad', () => {
  const base = mkdtempSync(join(tmpdir(), 'onia-releases-'));
  try {
    mkdirSync(join(base, 'releases', '7bcd0a83-20260924', 'src'), { recursive: true });
    const nuevo = join(base, 'releases', 'abcdef12-20260925');
    mkdirSync(nuevo, { recursive: true });
    writeFileSync(join(nuevo, 'SHA'), 'abcdef1234567890abcdef1234567890abcdef12\n');
    writeFileSync(join(nuevo, 'BUILD_ID'), 'IdNuevo\n');
    const sinImagen = join(base, 'releases', '11112222-20260925');
    mkdirSync(sinImagen, { recursive: true });
    writeFileSync(join(sinImagen, 'SHA'), '1111222233334444555566667777888899990000\n');
    writeFileSync(join(sinImagen, 'BUILD_ID'), 'IdSinImagen\n');
    const legado = join(base, 'build-b54a148', '.next', 'standalone');
    mkdirSync(join(legado, '.next', 'static'), { recursive: true });
    mkdirSync(join(legado, 'node_modules'), { recursive: true });
    writeFileSync(join(legado, '.next', 'BUILD_ID'), 'sNMW9rcT8D15GNP2qKYlm');
    writeFileSync(join(legado, 'server.js'), '');

    const preguntadas = [];
    const builds = buildsEnDisco(base, {
      imagenExiste: (tag) => {
        preguntadas.push(tag);
        return tag !== 'onia-platform:release-11112222';
      },
    });
    const por = Object.fromEntries(builds.map((b) => [b.sha, b]));

    const { ruta, ...hoy } = por['7bcd0a83'];
    assert.deepEqual(hoy, { sha: '7bcd0a83', buildId: null, tipo: 'release', integro: false });
    assert.match(ruta, /releases\/7bcd0a83-20260924$/);
    assert.equal(por.abcdef12.buildId, 'IdNuevo');
    assert.equal(por.abcdef12.integro, true);
    assert.equal(por['11112222'].integro, false, 'sin la imagen no se puede publicar: no está íntegro');
    assert.equal(por.b54a148.tipo, 'legacy');
    assert.equal(por.b54a148.integro, true);
    assert.ok(preguntadas.includes('onia-platform:release-abcdef12'));

    // Y el par de hoy, contra lo leído del disco.
    assert.equal(shaQueCorre({ buildIdVivo: 'IdNuevo', builds }), 'abcdef12');
    assert.equal(shaQueCorre({ buildIdVivo: 'FU8j_OHPyRH1XCCr6-0uY', builds, imagenViva: 'onia-platform:release-7bcd0a83' }), '7bcd0a83');
    assert.equal(shaQueCorre({ buildIdVivo: 'sNMW9rcT8D15GNP2qKYlm', builds, imagenViva: 'node:20-alpine' }), 'b54a148');
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

// El guion que corre ALLÁ se ejecuta de verdad acá, contra un disco de mentira y con un
// `docker` falso en el PATH: un guion remoto que no se ejecuta en ningún test se rompe
// en silencio y el medidor queda ciego por SSH.
test('el guion remoto lista releases y build-<sha> en el formato que se parsea', () => {
  const base = mkdtempSync(join(tmpdir(), 'onia-guion-')).replaceAll('\\', '/');
  try {
    mkdirSync(`${base}/releases/7bcd0a83-20260924/src`, { recursive: true });
    mkdirSync(`${base}/releases/abcdef12-20260925`, { recursive: true });
    writeFileSync(`${base}/releases/abcdef12-20260925/SHA`, 'abcdef1234567890abcdef1234567890abcdef12\n');
    writeFileSync(`${base}/releases/abcdef12-20260925/BUILD_ID`, 'IdNuevo\n');
    mkdirSync(`${base}/build-b54a148/.next/standalone/.next/static`, { recursive: true });
    mkdirSync(`${base}/build-b54a148/.next/standalone/node_modules`, { recursive: true });
    writeFileSync(`${base}/build-b54a148/.next/standalone/.next/BUILD_ID`, 'sNMW9');
    writeFileSync(`${base}/build-b54a148/.next/standalone/server.js`, '');
    mkdirSync(`${base}/bin`);
    // Sólo la imagen de abcdef12 existe.
    writeFileSync(`${base}/bin/docker`, '#!/usr/bin/env bash\n[ "$*" = "image inspect onia-platform:release-abcdef12" ]\n', { mode: 0o755 });

    const salida = execFileSync('bash', ['-c', guionBuildsSsh(base)], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${join(base, 'bin')}${delimiter}${process.env.PATH}` },
    });
    const por = Object.fromEntries(parsearBuildsSsh(salida, base).map((b) => [b.sha, b]));
    assert.deepEqual(
      [por['7bcd0a83']?.tipo, por['7bcd0a83']?.buildId, por['7bcd0a83']?.integro],
      ['release', null, false],
    );
    assert.deepEqual([por.abcdef12?.buildId, por.abcdef12?.integro], ['IdNuevo', true]);
    assert.deepEqual([por.b54a148?.tipo, por.b54a148?.integro], ['legacy', true]);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test('el VPS contesta un release por SSH con la misma forma que el disco', () => {
  const builds = parsearBuildsSsh(
    '7bcd0a83||no|release|7bcd0a83-20260924\nabcdef12|IdNuevo|si|release|abcdef12-20260925\nb54a148|sNMW9|si\n',
    '/opt/onia-platform',
  );
  assert.deepEqual(builds[0], {
    sha: '7bcd0a83', buildId: null, integro: false, tipo: 'release', ruta: '/opt/onia-platform/releases/7bcd0a83-20260924',
  });
  assert.equal(builds[1].integro, true);
  assert.equal(builds[2].tipo, 'legacy');
  assert.equal(stagedPara(builds, 'abcdef12').sha, 'abcdef12');
});

// ── qué sha corre ───────────────────────────────────────────────────────────
// El BUILD_ID vivo se casa contra los build-<sha> del disco. Es la ÚNICA forma
// de saber qué código corre: `docker inspect --format {{.Created}}` no sirve
// porque el swap reinicia y no recrea, así que Created queda anclado al día que
// se levantó el contenedor (medido el 2026-09-04: decía "17 commits sin
// desplegar" sobre un deploy que estaba al día).

test('casa el BUILD_ID vivo contra los build-<sha> del disco', () => {
  const builds = [
    { sha: '443e3e7', buildId: '-en0j_tAYbfor2oQ0DnbB' },
    { sha: 'b5e23d4', buildId: 'otroBuildIdCualquiera' },
  ];
  assert.equal(shaQueCorre({ buildIdVivo: '-en0j_tAYbfor2oQ0DnbB', builds }), '443e3e7');
});

test('BUILD_ID que no casa con ningún build en disco devuelve null, NO un sha inventado', () => {
  const builds = [{ sha: '443e3e7', buildId: 'unBuildId' }];
  assert.equal(shaQueCorre({ buildIdVivo: 'idDesconocido', builds }), null);
});

test('sin BUILD_ID vivo devuelve null (no se sabe), nunca un sha', () => {
  assert.equal(shaQueCorre({ buildIdVivo: null, builds: [{ sha: 'a', buildId: 'x' }] }), null);
  assert.equal(shaQueCorre({ buildIdVivo: '', builds: [{ sha: 'a', buildId: 'x' }] }), null);
});

// ── qué viaja al cliente ────────────────────────────────────────────────────
// Un commit que sólo toca gates o scripts NO cambia lo que el navegador recibe.
// Contarlo como varado se autobloquea: cada vuelta del carril invalida el build
// ya armado y el pedido de deploy no se estabiliza nunca (medido el 2026-09-04
// en web-venta, donde "8 arreglos varados" eran 5 reales y 2 scripts propios).
// Por defecto un archivo SÍ viaja: el error posible es pedir un deploy de más,
// nunca declarar al día algo que no lo está.

test('un commit que sólo toca tests o scripts no llega al cliente', () => {
  assert.equal(llegaAlCliente(['src/app/page.test.ts']), false);
  assert.equal(llegaAlCliente(['scripts/deploy-vivo.mjs', 'vitest.config.ts']), false);
  assert.equal(llegaAlCliente(['__tests__/algo.ts']), false);
});

test('un archivo de la app sí llega al cliente, y basta uno para que el commit cuente', () => {
  assert.equal(llegaAlCliente(['src/app/page.tsx']), true);
  assert.equal(llegaAlCliente(['src/app/page.test.ts', 'src/lib/plan-limits.ts']), true);
});

test('un commit sin archivos legibles cuenta como que viaja (no se descarta a ciegas)', () => {
  assert.equal(llegaAlCliente([]), true);
  assert.equal(llegaAlCliente(null), true);
});

// ── el diagnóstico ──────────────────────────────────────────────────────────

test('AL_DIA cuando el sha que corre es el HEAD de la rama de deploy', () => {
  const d = diagnosticar({ shaVivo: '443e3e7', headSha: '443e3e7', varados: [], desciende: true });
  assert.equal(d.codigo, AL_DIA);
});

test('ARREGLOS_VARADOS cuando hay commits posteriores que el cliente no ve', () => {
  const varados = [
    { sha: '8a67c0c', asunto: 'la misma pantalla decia "3 de 500" y "Contratar"' },
    { sha: '7599b5d', asunto: 'el dueño con el add-on no podia conectar su WhatsApp' },
  ];
  const d = diagnosticar({ shaVivo: '443e3e7', headSha: '0db6549', varados, desciende: true });
  assert.equal(d.codigo, ARREGLOS_VARADOS);
  assert.equal(d.varados.length, 2);
});

test('AL_DIA también cuando lo posterior existe pero nada de eso viaja al cliente', () => {
  const d = diagnosticar({ shaVivo: '443e3e7', headSha: '0db6549', varados: [], desciende: true });
  assert.equal(d.codigo, AL_DIA);
});

// ── cómo NO falla en verde ──────────────────────────────────────────────────
// Un `git log` vacío tiene dos causas opuestas —no hay nada varado, o el
// comando falló— y confundirlas es como esta familia de gates se rinde en
// verde. Por eso `[]` es un dato y `null` es la ausencia de dato.

test('sin saber qué sha corre sale NO_PUDE_MEDIR, jamás AL_DIA', () => {
  const d = diagnosticar({ shaVivo: null, headSha: '0db6549', varados: [], desciende: true });
  assert.equal(d.codigo, NO_PUDE_MEDIR);
});

test('varados null (git no contestó) es NO_PUDE_MEDIR, distinto de [] que es "no hay nada"', () => {
  const roto = diagnosticar({ shaVivo: '443e3e7', headSha: '0db6549', varados: null, desciende: true });
  assert.equal(roto.codigo, NO_PUDE_MEDIR);
  const sano = diagnosticar({ shaVivo: '443e3e7', headSha: '0db6549', varados: [], desciende: true });
  assert.equal(sano.codigo, AL_DIA);
});

test('sin HEAD de la rama de deploy sale NO_PUDE_MEDIR', () => {
  const d = diagnosticar({ shaVivo: '443e3e7', headSha: null, varados: [], desciende: true });
  assert.equal(d.codigo, NO_PUDE_MEDIR);
});

// ── la guarda que evita el daño ─────────────────────────────────────────────
// Un pedido de deploy heredado puede pedir publicar un build ANTERIOR al que ya
// corre, y obedecerlo RETROCEDE producción. Medido el 2026-09-04 en t_18ea4aff:
// pedía publicar build-a4b1d97 cuando ya corría build-b5e23d4, que lo incluye —
// el swap habría apagado el fix de la CSP del add-on de WhatsApp.

test('si lo que se publicaría no desciende de lo que ya corre, RETROCEDE y no se publica', () => {
  const varados = [{ sha: 'viejo01', asunto: 'algo' }];
  const d = diagnosticar({ shaVivo: 'b5e23d4', headSha: 'a4b1d97', varados, desciende: false });
  assert.equal(d.codigo, RETROCEDE);
  assert.notEqual(d.codigo, ARREGLOS_VARADOS);
});

test('desciende null (no se pudo preguntar) NO se asume verdadero', () => {
  const varados = [{ sha: 'x', asunto: 'algo' }];
  const d = diagnosticar({ shaVivo: 'b5e23d4', headSha: 'a4b1d97', varados, desciende: null });
  assert.equal(d.codigo, NO_PUDE_MEDIR);
});

// ── el staged ───────────────────────────────────────────────────────────────

test('CUBRE sólo si el staged es del HEAD y está íntegro', () => {
  const staged = { sha: '0db6549', integro: true };
  assert.equal(evaluarStaged({ staged, headSha: '0db6549' }).estado, CUBRE);
});

test('un staged de otro sha es VIEJO — publicarlo dejaría arreglos afuera', () => {
  const staged = { sha: '443e3e7', integro: true };
  assert.equal(evaluarStaged({ staged, headSha: '0db6549' }).estado, VIEJO);
});

test('un staged del HEAD pero incompleto NO cubre: el swap dejaría producción sin server.js', () => {
  const staged = { sha: '0db6549', integro: false };
  assert.notEqual(evaluarStaged({ staged, headSha: '0db6549' }).estado, CUBRE);
});

test('sin staged es NINGUNO, y hay que armar antes de publicar', () => {
  assert.equal(evaluarStaged({ staged: null, headSha: '0db6549' }).estado, NINGUNO);
});

// ── los builds, vengan del disco de acá o del VPS ───────────────────────────
// Este gate mide PRODUCCIÓN, y producción vive en `/opt/onia-platform` del VPS.
// Cuando el loop se mudó a nodo-casa esa ruta dejó de existir en el disco local
// y el gate quedó CIEGO: salía `NO PUDE MEDIR` (exit 2, que es honesto) y nadie
// lo notaba, porque el pedido de deploy que le llega a Sergio Urcullo se sostiene
// con OTRAS cifras que seguían en meta. Lo tramposo es que la mitad barata sí
// contestaba —`docker exec` es un shim que delega en el VPS—, y un gate que
// contesta a medias se lee como un gate que anda.

test('parsea los builds que contestó el VPS a la misma forma que los del disco', () => {
  const builds = parsearBuildsSsh('b54a148|sNMW9rcT8D15GNP2qKYlm|si\n3d1dabb|J4LFta9YhYnlO3QAbJJZ8|si\n', '/opt/onia-platform');
  assert.equal(builds.length, 2);
  assert.deepEqual(builds[0], {
    sha: 'b54a148',
    buildId: 'sNMW9rcT8D15GNP2qKYlm',
    ruta: '/opt/onia-platform/build-b54a148',
    integro: true,
    tipo: 'legacy',
  });
  // Y sirve para lo único que importa: saber qué sha corre.
  assert.equal(shaQueCorre({ buildIdVivo: 'sNMW9rcT8D15GNP2qKYlm', builds }), 'b54a148');
});

// El caso caro, y el único que ningún otro guardia puede ver: si el parseo
// leyera «tiene BUILD_ID» como «está íntegro», `evaluarStaged` diría CUBRE sobre
// un build a medio armar y el swap dejaría producción sin `server.js`.
test('un build remoto a medio armar llega íntegro=false aunque tenga BUILD_ID', () => {
  const [build] = parsearBuildsSsh('5a49a68|VI4689QnCLCVqolkhDrY|no\n', '/opt/onia-platform');
  assert.equal(build.integro, false);
  assert.notEqual(evaluarStaged({ staged: build, headSha: '5a49a68' }).estado, CUBRE);
});

test('una línea sin BUILD_ID no inventa uno: queda null y nunca casa con el vivo', () => {
  const [build] = parsearBuildsSsh('5a49a68||no\n', '/opt/onia-platform');
  assert.equal(build.buildId, null);
  assert.equal(shaQueCorre({ buildIdVivo: 'sNMW9rcT8D15GNP2qKYlm', builds: [build] }), null);
});

test('el disco local contesta: no se le pregunta al VPS', () => {
  let preguntas = 0;
  const r = buildsDeProduccion('/opt/onia-platform', {
    local: () => [{ sha: 'b54a148', buildId: 'X', ruta: '/opt/onia-platform/build-b54a148', integro: true }],
    remoto: () => {
      preguntas += 1;
      return [];
    },
  });
  assert.equal(preguntas, 0);
  assert.equal(r.origen, 'local');
});

test('el disco local no está (null): cae al VPS y lo dice', () => {
  const r = buildsDeProduccion('/opt/onia-platform', {
    local: () => null,
    remoto: () => [{ sha: 'b54a148', buildId: 'X', ruta: '/opt/onia-platform/build-b54a148', integro: true }],
  });
  assert.equal(r.origen, 'remoto');
  assert.equal(r.builds[0].sha, 'b54a148');
});

// La distinción que cuesta cara, y va en las dos direcciones: una lista VACÍA es
// una respuesta REAL («no hay ningún build armado») y `null` es «no pude
// preguntar». Meterlas en la misma bolsa es exactamente cómo un gate declara
// «al día» sobre algo que no midió.
test('el VPS contesta que no hay builds: eso es [] (respuesta), no null', () => {
  const r = buildsDeProduccion('/opt/onia-platform', { local: () => null, remoto: () => [] });
  assert.notEqual(r, null);
  assert.deepEqual(r.builds, []);
});

test('ninguna de las dos vías contestó: devuelve null, JAMÁS []', () => {
  const r = buildsDeProduccion('/opt/onia-platform', { local: () => null, remoto: () => null });
  assert.equal(r, null);
});

// La dirección que importa de verdad: con las dos vías mudas el gate no puede
// decir «al día». Sin este caso, un arreglo que rompa la vía remota deja el gate
// callado y el trabajo varado sin que nada se ponga rojo.
test('con las dos vías mudas el veredicto es NO_PUDE_MEDIR, nunca AL_DIA', () => {
  const r = buildsDeProduccion('/opt/onia-platform', { local: () => null, remoto: () => null });
  const sha = shaQueCorre({ buildIdVivo: 'sNMW9rcT8D15GNP2qKYlm', builds: r?.builds });
  const veredicto = diagnosticar({ shaVivo: sha, headSha: '5a49a68', varados: [], desciende: true });
  assert.equal(veredicto.codigo, NO_PUDE_MEDIR);
  assert.notEqual(veredicto.codigo, AL_DIA);
});

// ── un merge no es un arreglo ───────────────────────────────────────────────
// El número que sale de acá es el que se cita en el pedido de deploy, o sea lo
// ÚNICO que Sergio Urcullo lee antes de contestar «ok». Contando los merges se
// infla: el 2026-09-06 el publicador dijo «4 arreglos» sobre 2 reales (la
// pantalla de gastos y la de créditos), porque los dos merges que los trajeron
// contaban de nuevo el mismo trabajo.
//
// La causa es que `git log --name-only` NO lista los archivos de un merge (no
// muestra su diff salvo con `-m`/`-c`), así que todo merge llega con
// `archivos: []` — y `llegaAlCliente([])` responde `true` A PROPÓSITO, porque
// «no sé qué tocó» tiene que pedir un deploy de más y nunca declarar al día lo
// que no lo está. Ese sesgo hay que CONSERVARLO: el arreglo va en la consulta,
// sacando los merges antes de clasificar, y no tocando `llegaAlCliente`.
//
// Es el mismo defecto que su gemelo de landing ya tenía arreglado esta mañana
// (`web-factory/apps/onia-platform/scripts/deploy-vivo.mjs`, 16 % inflado). El
// arreglo no viajó al hermano: por eso el caso vive acá y no sólo allá.

/** Los merges de la misma ventana, preguntados aparte del instrumento. */
function shasDeMerges(desde) {
  try {
    return execFileSync('git', ['-C', REPO, 'log', '--merges', '--format=%h', `${desde}..${RAMA_DEPLOY}`], {
      encoding: 'utf8',
      timeout: 30000,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return null;
  }
}

/**
 * Dónde ARRANCA la ventana ancha, derivado del último merge de la rama.
 *
 * ⚠️ Acá había un `${RAMA_DEPLOY}~40` fijo, y una ventana fija sobre una rama
 * que avanza se queda corta SOLA. Medido el 2026-09-25: el último merge de
 * `origin/master` quedó a **46** commits de la punta, o sea fuera de los 40, y
 * el centinela de abajo se puso rojo sin que nadie tocara nada. Ese rojo no
 * dice «el instrumento cuenta mal», dice «pasaron muchos commits sin mergear»
 * — un dato sobre el calendario disfrazado de defecto. Y sale caro: este
 * archivo corre en la cadena `npm test` de la raíz, así que traba el merge de
 * los quince carriles hasta que alguien lo mire.
 *
 * Devuelve `null` si la rama no tiene NINGÚN merge: ahí el caso de abajo no
 * puede concluir y se salta, que no es lo mismo que fallar.
 */
function inicioDeVentana(git) {
  const ultimoMerge = git(['log', '--merges', '-1', '--format=%H', RAMA_DEPLOY]);
  if (!ultimoMerge) return null;
  // El PRIMER padre: la punta de la rama justo antes de ese merge, para que el
  // rango `inicio..RAMA_DEPLOY` lo CONTENGA en vez de dejarlo justo al borde.
  return git(['rev-parse', '--short', `${ultimoMerge}^1`]) || null;
}

/** El `git` de verdad. `null` cuando no contesta, nunca cadena vacía. */
function gitDelRepo(args) {
  try {
    const salida = execFileSync('git', ['-C', REPO, ...args], {
      encoding: 'utf8',
      timeout: 30000,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return salida || null;
  } catch {
    return null;
  }
}

/**
 * Ventana ancha del repo real. Se salta si el clon no está: este archivo corre
 * en la cadena `npm test` de la raíz, y un rojo por AMBIENTE traba el merge de
 * los quince carriles.
 */
function ventana() {
  return inicioDeVentana(gitDelRepo);
}

// Los tres casos de abajo son puros —no tocan el clon— y son los que atan el
// arreglo: sin ellos, volver a escribir un `~N` fijo no pondría nada en rojo
// hasta el día que la rama lo pasara de largo, que es como nació el defecto.
test('la ventana se deriva del ÚLTIMO MERGE, no de un ~N fijo que la rama pasa de largo', () => {
  const pedidos = [];
  const inicio = inicioDeVentana((args) => {
    pedidos.push(args.join(' '));
    return args.includes('--merges') ? 'ffffffffffffffff' : 'abc1234';
  });

  assert.equal(inicio, 'abc1234');
  const pedidoDeRevParse = pedidos.find((p) => p.startsWith('rev-parse'));
  assert.ok(
    pedidoDeRevParse.includes('^1'),
    'la ventana tiene que arrancar en el PADRE del merge, para contenerlo',
  );
  assert.ok(
    !pedidoDeRevParse.includes('~'),
    'un `~N` fijo vuelve a poner el centinela rojo solo el día que la rama lo pasa (46 > 40 el 2026-09-25)',
  );
});

test('sin ningún merge en la rama, la ventana no existe y el caso se SALTA en vez de fallar', () => {
  assert.equal(inicioDeVentana(() => null), null);
});

test('si git no contesta el padre, la ventana es null y no una cadena vacía que parezca un sha', () => {
  const inicio = inicioDeVentana((args) => (args.includes('--merges') ? 'ffffffffffffffff' : ''));
  assert.equal(inicio, null);
});

// Sin este caso, el de abajo pasaría en verde el día que la ventana no tuviera
// merges — y entonces `--no-merges` se podría borrar del script sin que nada se
// pusiera rojo. Es la dirección que nadie audita.
test('la ventana elegida CONTIENE merges (si no, el caso siguiente no prueba nada)', (t) => {
  const desde = ventana();
  if (!desde) return t.skip('sin el clon de onia-platform: ambiental, no es un defecto');
  const merges = shasDeMerges(desde);
  assert.notEqual(merges, null, 'git no contestó: el caso siguiente no puede concluir');
  assert.ok(merges.length > 0, 'la ventana se deriva del último merge: si no lo contiene, la derivación está rota');
});

test('no devuelve ni un merge, así que el pedido no cuenta dos veces el mismo arreglo', (t) => {
  const desde = ventana();
  if (!desde) return t.skip('sin el clon de onia-platform: ambiental, no es un defecto');
  const merges = shasDeMerges(desde);
  if (merges === null || merges.length === 0) return t.skip('sin merges en la ventana: ver el caso de arriba');

  const varados = varadosDesde(desde);
  assert.notEqual(varados, null, 'git no contestó');
  const colados = varados.filter((c) => merges.includes(c.sha));
  assert.deepEqual(
    colados.map((c) => `${c.sha} ${c.asunto}`),
    [],
    'un merge se coló en el recuento: el pedido le muestra a Sergio Urcullo más arreglos de los que hay',
  );
});

// ── el instrumento no se dispara solo ───────────────────────────────────────
// Un gate .mjs que corre su medición en el top-level la dispara al ser
// IMPORTADO: medido el 2026-09-03 en demo_agendada_real.mjs, un import lanzó
// dos docker exec contra producción y un process.exit() que mató al proceso
// importador. El test corre en un proceso HIJO a propósito: en el propio
// proceso el módulo ya está cacheado y el caso pasa en falso.

test('importar el módulo NO mide contra producción ni sale del proceso', () => {
  const salida = execFileSync(
    process.execPath,
    ['--input-type=module', '-e', `await import(${JSON.stringify(pathToFileURL(join(AQUI, 'deploy-vivo.mjs')).href)}); console.log('VIVO');`],
    { encoding: 'utf8', timeout: 20000 },
  );
  assert.match(salida, /VIVO/);
});

// ── el deploy cambió de forma: ahora el sha viaja en la ETIQUETA de la imagen ─
// Medido el 2026-09-24 13:45 La Paz. El contenedor corría
// `onia-platform:release-7bcd0a83` —el HEAD exacto de origin/master, o sea AL
// DIA— y este módulo decía NO PUDE MEDIR: su BUILD_ID (FU8j_OHPyRH1XCCr6-0uY)
// no casaba contra NINGUN /opt/onia-platform/build-*/ porque el deploy dejó de
// swapear runtime-next y pasó a construir una imagen `release-<sha>`. Los
// build-<sha> de staging además se BORRAN a propósito (limpiar-builds-staging.sh
// se llevó 92 para liberar disco), así que la vía vieja no es que falle hoy:
// se apaga sola cada vez que alguien limpia.
//
// Un NO PUDE MEDIR permanente es el peor de los rojos: se lee como "el
// ambiental de siempre" y se saltea, y con él se saltea la única pregunta que
// este gate existe para contestar.

test('saca el sha del commit de la etiqueta release-<sha> de la imagen', () => {
  assert.equal(shaDeEtiqueta('onia-platform:release-7bcd0a83'), '7bcd0a83');
  assert.equal(shaDeEtiqueta('onia-platform:release-3606c46'), '3606c46');
});

test('una etiqueta que no nombra un commit no inventa uno', () => {
  for (const imagen of ['onia-platform:latest', 'onia-platform', 'onia-platform:release-', 'onia-platform:release-zzzz', null, undefined, 42]) {
    assert.equal(shaDeEtiqueta(imagen), null, `${imagen} no nombra ningún commit y salió un sha igual`);
  }
});

// La etiqueta manda porque es lo que el deploy ESCRIBE hoy; el BUILD_ID queda
// de respaldo para los swaps viejos que todavía puedan quedar en disco.
test('con la etiqueta viva, ya no hace falta que sobreviva el build en disco', () => {
  const r = shaVivoConciliado({ shaEtiqueta: '7bcd0a83', shaBuildId: null });
  assert.equal(r.sha, '7bcd0a83');
  assert.equal(r.motivo, null);
});

test('sin etiqueta, sigue valiendo el BUILD_ID casado contra el disco', () => {
  assert.equal(shaVivoConciliado({ shaEtiqueta: null, shaBuildId: '443e3e7' }).sha, '443e3e7');
});

// Los dos largos conviven: la etiqueta trae 8 caracteres y los build-<sha> de
// disco 7. Compararlos crudos haría discrepar a dos nombres del MISMO commit.
test('la etiqueta y el BUILD_ID del mismo commit no se pelean por el largo', () => {
  assert.equal(shaVivoConciliado({ shaEtiqueta: '7bcd0a83', shaBuildId: '7bcd0a8' }).sha, '7bcd0a83');
});

// Si las dos vías contestan cosas distintas, NO se elige la que nos gusta: no
// saber es un dato, y un veredicto inventado acá publica o retiene producción.
test('si la etiqueta y el BUILD_ID discrepan, no se elige ninguna', () => {
  const r = shaVivoConciliado({ shaEtiqueta: '7bcd0a83', shaBuildId: 'b5e23d4' });
  assert.equal(r.sha, null);
  assert.match(r.motivo, /7bcd0a83/);
  assert.match(r.motivo, /b5e23d4/);
});

test('sin ninguna de las dos vías, el motivo lo dice y no hay sha', () => {
  const r = shaVivoConciliado({ shaEtiqueta: null, shaBuildId: null });
  assert.equal(r.sha, null);
  assert.match(r.motivo, /etiqueta|BUILD_ID/);
});

// El motivo del NO PUDE MEDIR tiene que nombrar la causa REAL. El que había
// decía siempre "BUILD_ID vivo sin par en disco", que hoy es falso y manda a
// buscar el problema donde no está.
test('diagnosticar cuenta POR QUÉ no sabe qué corre, sin suponer la causa', () => {
  const d = diagnosticar({
    shaVivo: null,
    headSha: '7bcd0a83',
    varados: [],
    desciende: true,
    motivoSinSha: 'la imagen dice 7bcd0a83 y el BUILD_ID casa con b5e23d4: no elijo',
  });
  assert.equal(d.codigo, NO_PUDE_MEDIR);
  assert.match(d.motivo, /no elijo/);
});
