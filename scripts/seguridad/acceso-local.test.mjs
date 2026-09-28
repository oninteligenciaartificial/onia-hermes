import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, stat, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { preflight, parseArgs, loadRegistry, runCli, formatReport } from './acceso-local.mjs';

async function temporaryHome(t) {
  const tempRoot = await realpath(tmpdir());
  const created = await mkdtemp(path.join(tempRoot, 'onia-access-test-'));
  const resolved = await realpath(created);
  t.after(async () => {
    const relative = path.relative(tempRoot, resolved);
    assert.ok(relative && !relative.startsWith('..') && !path.isAbsolute(relative));
    assert.equal(await realpath(created), resolved);
    assert.ok(path.basename(resolved).startsWith('onia-access-test-'));
    await rm(resolved, { recursive: true });
    await assert.rejects(stat(resolved), { code: 'ENOENT' });
  });
  return resolved;
}

async function fixture(home, relative) {
  const target = path.join(home, ...relative);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, 'FAKE_VAULT_CONTENT_MUST_NEVER_BE_RETURNED');
  return target;
}

test('sin bóveda sólo informa ausencia en rutas conocidas', async (t) => {
  const homeDir = await temporaryHome(t);
  const result = await preflight({ homeDir });
  assert.equal(result.vault.status, 'not_found_at_known_paths');
  assert.equal(result.vault.expected.exists, false);
  assert.equal(result.vault.fallback.exists, false);
  assert.equal(result.runtimeAccess, 'not_tested');
  assert.equal(result.runtimeCheckRequired, true);
  assert.equal(result.evidenceReport.type, 'historical_record_not_runtime_verification');
});

test('bóveda prevista: únicamente stat en las dos rutas fijas', async (t) => {
  const homeDir = await temporaryHome(t);
  const target = await fixture(homeDir, ['BovedaPrivada', 'Agentes.kdbx']);
  const inspected = [];
  const result = await preflight({ homeDir, inspect: async (file) => { inspected.push(file); return stat(file); } });
  assert.equal(result.vault.status, 'expected_present');
  assert.equal(result.vault.expected.path, target);
  assert.equal(result.vault.expected.sizeBytes, Buffer.byteLength('FAKE_VAULT_CONTENT_MUST_NEVER_BE_RETURNED'));
  assert.deepEqual(inspected, [target, path.join(homeDir, 'OneDrive', 'Escritorio', 'Contraseñas.kdbx')]);
  assert.equal(JSON.stringify(result).includes('FAKE_VAULT_CONTENT'), false);
  assert.equal(formatReport(result).includes('FAKE_VAULT_CONTENT'), false);
});

test('fallback informa ubicación fuera de la prevista sin moverla', async (t) => {
  const homeDir = await temporaryHome(t);
  const target = await fixture(homeDir, ['OneDrive', 'Escritorio', 'Contraseñas.kdbx']);
  const result = await preflight({ homeDir });
  assert.equal(result.vault.status, 'outside_expected_path');
  assert.equal(result.vault.fallback.path, target);
  assert.equal(result.vault.expected.exists, false);
  assert.equal((await stat(target)).isFile(), true);
  assert.equal(JSON.stringify(result).includes('FAKE_VAULT_CONTENT'), false);
});

test('si están ambas bases devuelve ambos metadatos sin decidir cuál está activa', async (t) => {
  const homeDir = await temporaryHome(t);
  await fixture(homeDir, ['BovedaPrivada', 'Agentes.kdbx']);
  await fixture(homeDir, ['OneDrive', 'Escritorio', 'Contraseñas.kdbx']);
  const result = await preflight({ homeDir });
  assert.equal(result.vault.expected.isFile, true);
  assert.equal(result.vault.fallback.isFile, true);
  assert.equal(result.runtimeAccess, 'not_tested');
});

test('un directorio con extensión kdbx no cuenta como bóveda', async (t) => {
  const homeDir = await temporaryHome(t);
  await mkdir(path.join(homeDir, 'BovedaPrivada', 'Agentes.kdbx'), { recursive: true });
  const result = await preflight({ homeDir });
  assert.equal(result.vault.expected.status, 'not_a_file');
  assert.equal(result.vault.status, 'not_found_at_known_paths');
});

test('errores de metadatos no se confunden con ausencia ni muestran datos', async (t) => {
  const homeDir = await temporaryHome(t);
  const result = await preflight({ homeDir, inspect: async () => { throw Object.assign(new Error('FAKE_PRIVATE_ERROR'), { code: 'EACCES' }); } });
  assert.equal(result.vault.status, 'metadata_unavailable');
  assert.equal(result.vault.expected.exists, null);
  assert.equal(JSON.stringify(result).includes('FAKE_PRIVATE_ERROR'), false);
});

test('filtro válido y app desconocida no inspeccionan credenciales', async (t) => {
  const homeDir = await temporaryHome(t);
  const result = await preflight({ homeDir, app: 'higgsfield' });
  assert.deepEqual(result.apps.map((app) => app.id), ['higgsfield']);
  await assert.rejects(preflight({ homeDir, app: 'unknown', inspect: () => { assert.fail('No debe hacer stat para filtro desconocido'); } }), { message: 'App desconocida. Consulte los ids del registro sin --app.' });
});

test('argumentos y errores CLI no reflejan valores arbitrarios', async () => {
  assert.deepEqual(parseArgs(['--app', 'google', '--json']), { app: 'google', json: true, help: false });
  let output = '';
  const sink = { write: (value) => { output += value; } };
  assert.equal(await runCli(['--app', 'FAKE_SECRET_INPUT', '--json'], { stdout: sink, stderr: sink }), 1);
  assert.equal(output.includes('FAKE_SECRET_INPUT'), false);
  assert.ok(JSON.parse(output).error);
  output = '';
  assert.equal(await runCli(['--help'], { stdout: sink, stderr: sink }), 0);
  assert.match(output, /Uso:/);
});

test('registro enumera apps únicas, URLs públicas sin queries y estados históricos', async () => {
  const registry = await loadRegistry();
  assert.equal(registry.evidenceDate, '2026-09-28');
  assert.equal(new Set(registry.apps.map((app) => app.id)).size, registry.apps.length);
  assert.equal(registry.apps.length, 11);
  assert.equal(registry.apps.filter((app) => app.id === 'google').length, 1);
  for (const app of registry.apps) {
    for (const value of app.urls) {
      const url = new URL(value);
      assert.equal(url.protocol, 'https:');
      assert.equal(url.search + url.hash + url.username + url.password, '');
      assert.notEqual(url.hostname, 'chromewebstore.google.com');
    }
    if (!['google', 'higgsfield'].includes(app.id)) {
      assert.equal(app.status, 'observed_not_verified');
      assert.equal(app.method, 'not_verified');
    }
  }
  assert.equal(registry.mechanisms.directVaultApiCli.status, 'not_configured');
});
