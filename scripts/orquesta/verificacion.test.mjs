import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { verificar } from './orquesta.mjs';

function fixture(t, texto = 'x'.repeat(400)) {
  const wt = fs.mkdtempSync(path.join(os.tmpdir(), 'orquesta-check-'));
  t.after(() => fs.rmSync(wt, { recursive: true, force: true }));
  const g = (...a) => execFileSync('git', ['-C', wt, '-c', 'core.hooksPath=' + os.devNull,
    '-c', 'user.name=fixture', '-c', 'user.email=fixture@example.invalid', ...a], { encoding: 'utf8' }).trim();
  g('init', '-q', '-b', 'main');
  fs.writeFileSync(path.join(wt, 'base.txt'), 'base');
  g('add', '.');
  g('commit', '-qm', 'fixture');
  const inicio = g('rev-parse', 'HEAD');
  g('update-ref', 'refs/remotes/origin/main', inicio);
  fs.writeFileSync(path.join(wt, 'salida.md'), texto);
  return { wt, comprobar: (check, requiere = false) => verificar(wt, 'main', inicio, false, 'salida.md', { check }, { code: 0 }, requiere) };
}

test('check desconocido se rechaza antes de poder entregar', async (t) => {
  const { comprobar } = fixture(t);
  assert.match((await comprobar('urlz')).falla, /desconocido/);
  assert.match((await comprobar('cmd')).falla, /desconocido/);
  assert.match((await comprobar('cmd\tcomando')).falla, /desconocido/);
  assert.equal((await comprobar(undefined)).falla, null);
});

for (const [status, estado] of [[200, 'comprobada'], [204, 'comprobada'], [403, 'no-verificable'],
  [429, 'no-verificable'], [404, 'fallida'], [410, 'fallida'], [500, 'fallida']]) {
  test(`check urls HTTP ${status}: ${estado}`, async (t) => {
    const { comprobar } = fixture(t, 'x'.repeat(400) + '\nhttps://fixture.invalid/fuente');
    t.mock.method(globalThis, 'fetch', async () => ({ status, body: { cancel: async () => {} } }));
    const r = await comprobar('urls');
    assert.equal(r.urls[0].estado, estado);
    assert.equal(Boolean(r.falla), estado !== 'comprobada');
  });
}

for (const name of ['TimeoutError', 'AbortError', 'TypeError']) {
  test(`check urls ${name} no es éxito`, async (t) => {
    const { comprobar } = fixture(t, 'x'.repeat(400) + '\nhttps://fixture.invalid/fuente');
    t.mock.method(globalThis, 'fetch', async () => { throw Object.assign(new Error('fixture'), { name }); });
    const r = await comprobar('urls');
    assert.equal(r.urls[0].estado, 'no-verificable');
    assert.match(r.falla, /no-verificable/);
  });
}

test('check urls sin enlaces no acredita verificación', async (t) => {
  const { comprobar } = fixture(t);
  assert.match((await comprobar('urls')).falla, /sin enlaces/);
});

test('check urls no trunca silenciosamente después de 60', async (t) => {
  const { comprobar } = fixture(t, 'x'.repeat(400) + '\n' + Array.from({ length: 61 }, (_, i) => `https://fixture.invalid/${i}`).join('\n'));
  t.mock.method(globalThis, 'fetch', async () => ({ status: 200 }));
  assert.match((await comprobar('urls')).falla, /60/);
});

test('preview ignorado por git no es una entrega accesible; paquete versionado sí', async (t) => {
  const { wt, comprobar } = fixture(t);
  execFileSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'color=c=blue:s=32x32:d=0.2', '-an', '-c:v', 'mpeg4', path.join(wt, 'preview.mp4')], { timeout: 15000 });
  const datos = fs.readFileSync(path.join(wt, 'preview.mp4'));
  fs.writeFileSync(path.join(wt, '.gitignore'), 'preview.mp4\n');
  fs.writeFileSync(path.join(wt, 'salida.md.evidencias.json'), JSON.stringify({ version: 1,
    archivos: [{ ruta: 'preview.mp4', bytes: datos.length, sha256: createHash('sha256').update(datos).digest('hex') }] }));
  assert.match((await comprobar(undefined, true)).falla, /no versionada/);
  fs.writeFileSync(path.join(wt, '.gitignore'), '');
  assert.equal((await comprobar(undefined, true)).falla, null);
  // El pathspec no debe acreditar otro archivo: [] es válido en nombres Windows.
  fs.copyFileSync(path.join(wt, 'preview.mp4'), path.join(wt, 'preview[1].mp4'));
  fs.copyFileSync(path.join(wt, 'preview.mp4'), path.join(wt, 'preview1.mp4'));
  fs.writeFileSync(path.join(wt, '.gitignore'), 'preview\\[1\\].mp4\n');
  fs.writeFileSync(path.join(wt, 'salida.md.evidencias.json'), JSON.stringify({ version: 1,
    archivos: [{ ruta: 'preview[1].mp4', bytes: datos.length, sha256: createHash('sha256').update(datos).digest('hex') }] }));
  assert.match((await comprobar(undefined, true)).falla, /no versionada/, 'se exige el archivo literal, no otro que coincide con un glob');
});
