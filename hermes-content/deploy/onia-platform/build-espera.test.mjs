import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, delimiter } from 'node:path';
import { fileURLToPath } from 'node:url';

const BUILD = fileURLToPath(new URL('./build-and-stage.sh', import.meta.url));
const barra = (p) => p.replaceAll('\\', '/');
const FATAL = 'FATAL: hay otro build corriendo (next build / npm ci / docker build): no encimo otro';

// Estado: 0 = libre, 1 = ocupado una vez, -1 = siempre ocupado.
function comprobar(t, estado, extra = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'onia-espera-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(join(dir, 'estado'), String(estado));
  writeFileSync(join(dir, 'intentos'), '');
  // Sustituye ps solo en el PATH del proceso de prueba.
  writeFileSync(join(dir, 'ps'), `#!/usr/bin/env bash
[ "$*" = '-eo args' ] || exit 2
read -r estado < "$ESTADO/estado"
echo intento >> "$ESTADO/intentos"
if [ "$estado" != 0 ]; then
  echo "$STUB_PROCESO"
  if [ "$estado" -gt 0 ]; then echo "$((estado - 1))" > "$ESTADO/estado"; fi
fi
exit 0
`, { mode: 0o755 });
  const resultado = spawnSync('bash', ['-c', 'set -uo pipefail; source "$1"; esperar_otro_build', 'test-espera', barra(BUILD)], {
    encoding: 'utf8',
    timeout: 10000,
    env: {
      ...process.env,
      PATH: `${dir}${delimiter}${process.env.PATH}`,
      ESTADO: barra(dir),
      STUB_PROCESO: 'node next build',
      DRY: '',
      ONIA_BUILD_ESPERA_SEG: '2',
      ONIA_BUILD_INTERVALO_SEG: '1',
      // Si source llega al flujo normal, falla antes de tocar ningun servicio.
      ONIA_PLATFORM_BASE: barra(join(dir, 'no-existe')),
      ...extra,
    },
  });
  assert.ifError(resultado.error);
  const intentos = readFileSync(join(dir, 'intentos'), 'utf8').split('\n').filter(Boolean).length;
  return { ...resultado, intentos };
}

test('sin build ajeno sale 0 en el primer chequeo, sin esperar', (t) => {
  const r = comprobar(t, 0);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.intentos, 1);
  assert.equal(r.stdout, '');
});

test('el build ajeno termina al segundo intento y permite continuar', (t) => {
  const r = comprobar(t, 1);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.intentos, 2);
  assert.match(r.stdout, /espero a que termine otro build: \d+ s/);
});

test('al agotar 2 segundos conserva el fatal original sin loguear cada sondeo', (t) => {
  const r = comprobar(t, -1);
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.ok(r.intentos >= 2);
  assert.equal(r.stdout.trim().split('\n').at(-1), FATAL);
  assert.equal(r.stdout.match(/espero a que termine otro build:/g)?.length, 1);
});

test('Runner.Worker mantiene la espera aunque no haya un comando de build visible', (t) => {
  const r = comprobar(t, 1, { STUB_PROCESO: '/opt/actions-runner/bin/Runner.Worker spawnclient' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.intentos, 2);
  assert.match(r.stdout, /espero a que termine otro build: \d+ s/);
});

test('Runner.Listener permanente no bloquea el build', (t) => {
  const r = comprobar(t, -1, { STUB_PROCESO: '/opt/actions-runner/bin/Runner.Listener run' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.intentos, 1);
  assert.equal(r.stdout, '');
});

test('rechaza una espera mayor a 3600 segundos antes de listar procesos', (t) => {
  const r = comprobar(t, -1, { ONIA_BUILD_ESPERA_SEG: '3601' });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.equal(r.intentos, 0);
  assert.equal(r.stdout.trim(), 'FATAL: ONIA_BUILD_ESPERA_SEG no puede superar 3600 segundos');
});

test('permite el limite de 3600 segundos', (t) => {
  const r = comprobar(t, 0, { ONIA_BUILD_ESPERA_SEG: '3600' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.intentos, 1);
});

test('DRY con build ajeno falla en el primer chequeo, sin esperar', (t) => {
  const r = comprobar(t, -1, { DRY: '1', ONIA_BUILD_ESPERA_SEG: '1200', ONIA_BUILD_INTERVALO_SEG: '30' });
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.equal(r.intentos, 1);
  assert.equal(r.stdout.trim(), FATAL);
});

test('DRY sin build ajeno permite continuar en el primer chequeo', (t) => {
  const r = comprobar(t, 0, { DRY: '1' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.intentos, 1);
  assert.equal(r.stdout, '');
});
