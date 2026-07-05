#!/usr/bin/env node
/* Smoke test del bridge DentalGest en hermes-command.
   Cubre: ruteo /tarea y /dentalgest, errores amables sin config,
   GET pendientes y POST intake contra un mock HTTP local (sin red).
   Run: node scripts/hermes_command_dentalgest.test.js */
const assert = require('node:assert');
const { spawn } = require('node:child_process');
const http = require('node:http');
const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

const SCRIPT = path.join(__dirname, 'hermes_command_center.py');
const PYTHON = process.env.HERMES_TEST_PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const SECRET = 'test-secret-123';
const ORG_ID = 'org-test-1';

function makeEnv(overrides = {}) {
  const env = { ...process.env };
  delete env.DENTALGEST_BRIDGE_URL;
  delete env.DENTALGEST_BRIDGE_SECRET;
  delete env.DENTALGEST_ORG_ID;
  // HERMES_HOME temporal: que el event-log del router no ensucie el repo.
  env.HERMES_HOME = fs.mkdtempSync(path.join(os.tmpdir(), 'hermes-test-'));
  env.PYTHONIOENCODING = 'utf-8';
  return Object.assign(env, overrides);
}

function runCommand(message, env) {
  return new Promise((resolve, reject) => {
    const proc = spawn(PYTHON, [SCRIPT, 'telegram', '--message', message], {
      env,
      windowsHide: true,
    });
    let out = '';
    let err = '';
    proc.stdout.on('data', (chunk) => (out += chunk));
    proc.stderr.on('data', (chunk) => (err += chunk));
    proc.on('error', reject);
    proc.on('close', (code) => {
      try {
        resolve({ code, json: JSON.parse(out) });
      } catch (parseError) {
        reject(new Error(`stdout no fue JSON (exit ${code}):\n${out}\n${err}`));
      }
    });
  });
}

function startMockServer(handler) {
  return new Promise((resolve) => {
    const requests = [];
    const server = http.createServer((req, res) => {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        const record = {
          method: req.method,
          url: req.url,
          secret: req.headers['x-intake-secret'],
          body: body ? JSON.parse(body) : null,
        };
        requests.push(record);
        const { status, payload } = handler(record);
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(payload));
      });
    });
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, requests, url: `http://127.0.0.1:${server.address().port}` });
    });
  });
}

let passed = 0;
async function test(name, fn) {
  await fn();
  passed++;
  console.log(`  ok - ${name}`);
}

async function main() {
  await test('/tarea sin texto devuelve formato de uso', async () => {
    const { code, json } = await runCommand('/tarea', makeEnv());
    assert.strictEqual(json.ok, false);
    assert.strictEqual(json.action, 'dentalgest_create_task');
    assert.match(json.telegram_reply, /Formato: \/tarea/);
    assert.strictEqual(code, 2);
  });

  await test('/dentalgest sin config pide las claves exactas', async () => {
    const { json } = await runCommand('/dentalgest', makeEnv());
    assert.strictEqual(json.ok, false);
    assert.match(json.telegram_reply, /DENTALGEST_BRIDGE_SECRET/);
    assert.match(json.telegram_reply, /DENTALGEST_ORG_ID/);
    assert.match(json.telegram_reply, /HERMES_PRODUCT_BRIDGE_2026/);
  });

  await test('/tarea con texto y sin config pide las claves exactas', async () => {
    const { json } = await runCommand('/tarea llamar al laboratorio', makeEnv());
    assert.strictEqual(json.ok, false);
    assert.match(json.telegram_reply, /DENTALGEST_BRIDGE_SECRET/);
  });

  await test('/dentalgest <subcomando desconocido> muestra ayuda', async () => {
    const { json } = await runCommand('/dentalgest aprobar', makeEnv());
    assert.strictEqual(json.ok, false);
    assert.match(json.telegram_reply, /Comandos DentalGest/);
  });

  await test('/dentalgest pendientes: GET al bridge con secret y organizationId', async () => {
    const fixture = {
      ok: true,
      counts: { open: 12, overdue: 3, pendingApprovals: 2 },
      items: [
        {
          title: 'Cobrar saldo de Maria (Bs. 350.00)',
          owner: 'Rocio',
          priority: 'high',
          dueAt: '2026-07-04T14:00:00.000Z',
          overdue: true,
        },
        {
          title: 'Confirmar cita de Juan',
          owner: null,
          priority: 'normal',
          dueAt: null,
          overdue: false,
        },
      ],
    };
    const mock = await startMockServer(() => ({ status: 200, payload: fixture }));
    try {
      const env = makeEnv({
        DENTALGEST_BRIDGE_URL: mock.url,
        DENTALGEST_BRIDGE_SECRET: SECRET,
        DENTALGEST_ORG_ID: ORG_ID,
      });
      const { json } = await runCommand('/dentalgest pendientes', env);
      assert.strictEqual(json.ok, true);
      assert.strictEqual(json.action, 'dentalgest_pending');
      assert.strictEqual(mock.requests.length, 1);
      assert.strictEqual(mock.requests[0].method, 'GET');
      assert.strictEqual(mock.requests[0].secret, SECRET);
      assert.match(mock.requests[0].url, /^\/api\/onia-core\/bridge\/pending\?organizationId=org-test-1$/);
      assert.match(json.telegram_reply, /Abiertos: 12 \| Vencidos: 3 \| Aprobaciones pendientes: 2/);
      assert.match(json.telegram_reply, /Cobrar saldo de Maria .* \[VENCIDO\]/);
      assert.match(json.telegram_reply, /Resp: Rocio \| Prioridad: high/);
      assert.match(json.telegram_reply, /Resp: sin asignar \| Prioridad: normal \| Vence: sin fecha/);
      assert.ok(json.telegram_reply.length <= 3500, 'la respuesta respeta el tope de 3500 chars');
    } finally {
      mock.server.close();
    }
  });

  await test('/dentalgest con endpoint devolviendo 401 responde amable', async () => {
    const mock = await startMockServer(() => ({ status: 401, payload: { error: 'No autorizado' } }));
    try {
      const env = makeEnv({
        DENTALGEST_BRIDGE_URL: mock.url,
        DENTALGEST_BRIDGE_SECRET: 'secreto-equivocado',
        DENTALGEST_ORG_ID: ORG_ID,
      });
      const { json } = await runCommand('/dentalgest', env);
      assert.strictEqual(json.ok, false);
      assert.match(json.telegram_reply, /No pude leer los pendientes/);
      assert.match(json.telegram_reply, /HTTP 401/);
      assert.match(json.telegram_reply, /ONIA_INTAKE_SECRET/);
    } finally {
      mock.server.close();
    }
  });

  await test('/dentalgest con endpoint caido responde amable', async () => {
    const env = makeEnv({
      DENTALGEST_BRIDGE_URL: 'http://127.0.0.1:9', // puerto discard: conexion rechazada
      DENTALGEST_BRIDGE_SECRET: SECRET,
      DENTALGEST_ORG_ID: ORG_ID,
    });
    const { json } = await runCommand('/dentalgest', env);
    assert.strictEqual(json.ok, false);
    assert.match(json.telegram_reply, /No pude leer los pendientes/);
  });

  await test('/tarea <texto>: POST al intake y confirma titulo → responsable', async () => {
    const mock = await startMockServer(() => ({
      status: 200,
      payload: {
        ok: true,
        workItemId: 'wi_123',
        title: 'solicitud_manual: Sergio via Telegram',
        ownerName: 'Rocio',
        deduped: false,
        patientMatched: false,
        ownerProfileId: 'prof_1',
      },
    }));
    try {
      const env = makeEnv({
        DENTALGEST_BRIDGE_URL: mock.url,
        DENTALGEST_BRIDGE_SECRET: SECRET,
        DENTALGEST_ORG_ID: ORG_ID,
      });
      const { json } = await runCommand('/tarea Llamar al laboratorio por la protesis', env);
      assert.strictEqual(json.ok, true);
      assert.strictEqual(json.action, 'dentalgest_create_task');
      assert.strictEqual(mock.requests.length, 1);
      const req = mock.requests[0];
      assert.strictEqual(req.method, 'POST');
      assert.strictEqual(req.url, '/api/onia-core/intake');
      assert.strictEqual(req.secret, SECRET);
      assert.deepStrictEqual(req.body, {
        organizationId: ORG_ID,
        channel: 'phone_walkin',
        message: 'Llamar al laboratorio por la protesis',
        contact: { name: 'Sergio via Telegram' },
      });
      assert.strictEqual(
        json.telegram_reply,
        'Pendiente creado: solicitud_manual: Sergio via Telegram → Rocio',
      );
    } finally {
      mock.server.close();
    }
  });

  await test('/tarea con intake devolviendo 422 responde amable', async () => {
    const mock = await startMockServer(() => ({
      status: 422,
      payload: { error: 'Canal de intake no registrado: (vacio)' },
    }));
    try {
      const env = makeEnv({
        DENTALGEST_BRIDGE_URL: mock.url,
        DENTALGEST_BRIDGE_SECRET: SECRET,
        DENTALGEST_ORG_ID: ORG_ID,
      });
      const { json } = await runCommand('/tarea algo', env);
      assert.strictEqual(json.ok, false);
      assert.match(json.telegram_reply, /No pude crear el pendiente/);
      assert.match(json.telegram_reply, /HTTP 422/);
    } finally {
      mock.server.close();
    }
  });

  await test('la ayuda lista /dentalgest y /tarea', async () => {
    const { json } = await runCommand('ayuda hermes', makeEnv());
    assert.match(json.telegram_reply, /\/dentalgest/);
    assert.match(json.telegram_reply, /\/tarea <texto>/);
  });

  console.log(`\n${passed} tests passed`);
}

main().catch((error) => {
  console.error(`\nFAILED after ${passed} passing tests:`);
  console.error(error);
  process.exit(1);
});
