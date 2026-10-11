import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { armarTabla } from './lucia-qa-tabla.mjs';

const cli = fileURLToPath(new URL('./lucia-qa-tabla.mjs', import.meta.url));
function fixture(tests = [0.79], refs = [0.85]) {
  const json = {
    model: 'modelo-inventado', arcface_mean_std: [0.5, 0.2],
    refs_internal: { pairwise_mean: 0.8, pairwise_min: 0.7, leave_one_out_min: 0.698, matrix: [] },
    negatives_max: 0.2, images: {}, scores: {},
  };
  for (const [group, valores] of [['tests', tests], ['refs', refs]]) {
    valores.forEach((centroid, i) => {
      const nombre = `${group}-${i + 1}`;
      json.images[nombre] = { group, faces: 1, det_score: 0.9, face_px: 250, img: [512, 512], flip_self: 0.9 };
      json.scores[nombre] = { centroid, mean_ref: 0.8, min_ref: 0.7, max_ref: 0.9 };
    });
  }
  return json;
}
function ejecutar(args, input) {
  const resultado = spawnSync(process.execPath, [cli, ...args], { input, encoding: 'utf8' });
  assert.ifError(resultado.error);
  return resultado;
}

test('1. Dos tests OK y una referencia; entrada por archivo', () => {
  const json = fixture([0.79, 0.82]);
  const { markdown, codigo } = armarTabla(json);
  assert.equal(codigo, 0);
  assert.match(markdown, /\| tests-1 \| 0\.790 \| 250 \| OK \|/);
  assert.match(markdown, /\| tests-2 \| 0\.820 \| 250 \| OK \|/);
  assert.ok(markdown.indexOf('| tests-1') < markdown.indexOf('| tests-2'));
  assert.match(markdown, /leave_one_out_min: 0\.698/);
  assert.match(markdown, /negatives_max: 0\.200/);
  const dir = mkdtempSync(join(tmpdir(), 'lucia-qa-'));
  try {
    const archivo = join(dir, 'fixture.json');
    writeFileSync(archivo, JSON.stringify(json));
    const resultado = ejecutar([archivo]);
    assert.equal(resultado.status, 0);
    assert.equal(resultado.stdout, markdown);
    assert.equal(resultado.stderr, '');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('2. Test bajo el piso', () => {
  const json = fixture([0.356]);
  const { markdown, codigo } = armarTabla(json);
  assert.equal(codigo, 1);
  assert.match(markdown, /0\.356 \| 250 \| BAJO/);
  assert.match(markdown, /1 tests · 1 bajo el piso · 0 sin cara/);
  assert.equal(ejecutar(['-'], JSON.stringify(json)).status, 1);
});

test('3. Cara chica conserva OK', () => {
  const json = fixture([0.78]);
  json.images['tests-1'].face_px = 150;
  const { markdown, codigo } = armarTabla(json);
  assert.equal(codigo, 0);
  assert.match(markdown, /OK · cara < 200 px: poco confiable/);
});

test('3b. Los píxeles salen enteros hacia abajo: 199,9 se ve 199 y sigue avisando', () => {
  const json = fixture([0.78]);
  json.images['tests-1'].face_px = 199.9;
  const { markdown } = armarTabla(json);
  assert.match(markdown, /\| 199 \| OK · cara < 200 px: poco confiable/);
  json.images['tests-1'].face_px = 200.4;
  assert.doesNotMatch(armarTabla(json).markdown, /poco confiable/);
  assert.match(armarTabla(json).markdown, /\| 200 \|/);
});

test('4. Sin scores o con error significa SIN CARA', () => {
  for (const conError of [false, true]) {
    const json = fixture();
    if (conError) json.images['tests-1'].error = 'cara no detectada';
    else delete json.scores['tests-1'];
    const { markdown, codigo } = armarTabla(json);
    assert.equal(codigo, 1);
    assert.match(markdown, /\| tests-1 \| — \| 250 \| SIN CARA/);
    assert.match(markdown, /1 tests · 0 bajo el piso · 1 sin cara/);
  }
});

test('5. Referencia bajo el piso es informativa', () => {
  const { markdown, codigo } = armarTabla(fixture([0.79], [0.698]));
  assert.equal(codigo, 0);
  assert.match(markdown, /centroid leave-one-out/);
  assert.match(markdown, /\| refs-1 \| 0\.698 \| 250 \| ref bajo el piso/);
  assert.match(markdown, /1 tests · 0 bajo el piso · 0 sin cara/);
});

test('6. Sin negativas es válido', () => {
  const json = fixture();
  json.negatives_max = null;
  const { markdown, codigo } = armarTabla(json);
  assert.equal(codigo, 0);
  assert.match(markdown, /negatives_max: sin negativas/);
});

test('7. Exactamente 0.700 es OK', () => {
  const { markdown, codigo } = armarTabla(fixture([0.700]));
  assert.equal(codigo, 0);
  assert.match(markdown, /0\.700 \| 250 \| OK/);
});

test('8. JSON inválido y claves faltantes producen código 2 en stderr', () => {
  const invalido = ejecutar(['-'], '{');
  assert.equal(invalido.status, 2);
  assert.equal(invalido.stdout, '');
  assert.match(invalido.stderr, /JSON inválido/);
  for (const clave of ['scores', 'images']) {
    const json = fixture();
    delete json[clave];
    const resultado = ejecutar(['-'], JSON.stringify(json));
    assert.equal(resultado.status, 2);
    assert.equal(resultado.stdout, '');
    assert.match(resultado.stderr, new RegExp(`Falta la clave ${clave}`));
  }
});

test('9. CLI lee stdin sin argumento y con guion', () => {
  const json = fixture();
  for (const args of [[], ['-']]) {
    const resultado = ejecutar(args, JSON.stringify(json));
    assert.equal(resultado.status, 0);
    assert.equal(resultado.stdout, armarTabla(json).markdown);
    assert.equal(resultado.stderr, '');
  }
});
