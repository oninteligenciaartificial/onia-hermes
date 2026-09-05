import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  AL_DIA,
  ARREGLOS_VARADOS,
  NO_PUDE_MEDIR,
  RETROCEDE,
  CUBRE,
  VIEJO,
  NINGUNO,
  shaQueCorre,
  llegaAlCliente,
  diagnosticar,
  evaluarStaged,
} from './deploy-vivo.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));

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

// ── el instrumento no se dispara solo ───────────────────────────────────────
// Un gate .mjs que corre su medición en el top-level la dispara al ser
// IMPORTADO: medido el 2026-09-03 en demo_agendada_real.mjs, un import lanzó
// dos docker exec contra producción y un process.exit() que mató al proceso
// importador. El test corre en un proceso HIJO a propósito: en el propio
// proceso el módulo ya está cacheado y el caso pasa en falso.

test('importar el módulo NO mide contra producción ni sale del proceso', () => {
  const salida = execFileSync(
    process.execPath,
    ['--input-type=module', '-e', `await import(${JSON.stringify(join(AQUI, 'deploy-vivo.mjs'))}); console.log('VIVO');`],
    { encoding: 'utf8', timeout: 20000 },
  );
  assert.match(salida, /VIVO/);
});
