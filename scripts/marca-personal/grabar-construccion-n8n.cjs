'use strict';

// Native n8n UI construction; no clipboard imports, API calls or simulated data.
// Every recording stays as an unpublished draft with TU_CHAT_ID. n8n may
// autoassign an existing credential; this script never opens or uses it.
// Run: node scripts/marca-personal/grabar-construccion-n8n.cjs mensaje|monitor
const fs = require('node:fs');
const { createRequire } = require('node:module');
const cap = require('./screencast-session.cjs');
const runtime = createRequire(process.env.SAMUEL_RUNTIME_PACKAGE || 'C:/dev/proyectos/onia-hermes/package.json');
cap.configure({ chromium: runtime('playwright').chromium });

const outputDir = 'E:/ONIA-YouTube/grabaciones/samuel';
const origin = 'https://n8n-sergio-n8n.hqdqgh.easypanel.host';
const configurations = {
  mensaje: {
    id: 'XhA3Z2BE6X8LmFEy',
    title: 'Samuel - Construccion mensaje (demo)',
    output: 'n8n-03-construccion-paso-a-paso',
  },
  monitor: {
    id: 'ZPDOxyNmQHotEJ3j',
    title: 'Samuel - Construccion monitor (demo)',
    output: 'n8n-04-construccion-monitor',
  },
};

async function main() {
  const mode = process.argv[2] || 'mensaje';
  const demo = configurations[mode];
  if (!demo) throw new Error('Modos permitidos: mensaje o monitor');
  if (fs.existsSync(`${outputDir}/${demo.output}.mp4`)) throw new Error('La toma ya existe; no se sobrescribe ni se modifica el borrador.');
  const s = await cap.launch('n8n', { record: true, outputDir });
  const started = Date.now();
  const p = s.page;
  const control = suffix => s.run(() => p.screenshot({ path: `${outputDir}/${demo.output}-${suffix}.png` }));
  const click = (locator, settle = 1000) => s.moveClick(locator, { duration: 650, settle });
  const parameter = name => p.locator(`[data-test-id="parameter-input-${name}"] input`).first();
  const closeNode = () => click(p.locator('[data-test-id="ndv-close-button"]'), 1200);
  const fit = () => click(p.getByRole('button', { name: 'Zoom to Fit', exact: true }));
  async function addNext(from, search, name, action, output = 0) {
    await fit();
    await click(p.locator(`[data-test-id="canvas-node"][data-node-name="${from}"] [data-test-id="canvas-node-output-handle"][data-index="${output}"] [data-test-id="canvas-handle-plus"]`));
    await s.type(p.getByPlaceholder('Search nodes...'), search, { delay: 110, settle: 1400 });
    await click(p.getByText(name, { exact: true }));
    if (action) await click(p.getByText(action, { exact: true }), 1800);
    await s.run(() => p.locator('[data-test-id="ndv-close-button"]').waitFor({ state: 'visible' }));
  }

  try {
    await s.run(() => p.goto(`${origin}/workflow/${demo.id}`, { waitUntil: 'domcontentloaded' }));
    await s.run(() => p.locator('[data-test-id="workflow-name-input"]').waitFor({ state: 'visible', timeout: 30000 }));
    await s.pause(1600);
    if ((await p.locator('[data-test-id="workflow-name-input"]').innerText()).trim() !== demo.title) {
      throw new Error('El workflow no es el borrador propio esperado.');
    }
    if (await p.getByRole('button', { name: 'Edit here', exact: true }).isVisible()) {
      await click(p.getByRole('button', { name: 'Edit here', exact: true }));
    }
    if (await p.locator('[data-test-id="canvas-node"]').count()) {
      throw new Error('El borrador debe estar vacio. No se eliminan nodos automaticamente.');
    }
    await s.run(() => p.locator('[data-test-id="canvas-plus-button"]').waitFor({ state: 'visible' }));
    const trimStart = Math.max(0, (Date.now() - started) / 1000 - 1);
    await s.pause(2200);

    // 1. Create the actual trigger through n8n's node picker.
    await click(p.locator('[data-test-id="canvas-plus-button"]'));
    await click(p.getByText('On a schedule', { exact: true }), 1800);
    await s.run(() => p.locator('[data-test-id="ndv-close-button"]').waitFor({ state: 'visible' }));
    await s.pause(1600);
    if (mode === 'mensaje') {
      await click(parameter('triggerAtHour'));
      await click(p.getByRole('option', { name: '9am', exact: true }));
    } else {
      await click(parameter('field'));
      await click(p.getByRole('option', { name: 'Minutes', exact: true }));
      await s.type(parameter('minutesInterval'), '5', { delay: 100, settle: 700 });
      await s.run(() => parameter('minutesInterval').press('Tab'));
    }
    await s.pause(2800);
    await control('1-horario');
    await closeNode();
    await fit();
    await s.pause(1700);

    if (mode === 'monitor') {
      // HTTP failures become data; network errors also continue to the IF node.
      await addNext('Schedule Trigger', 'HTTP Request', 'HTTP Request');
      await s.type(parameter('url'), 'https://example.com', { delay: 70, settle: 1000 });
      await click(p.getByText('Add option', { exact: true }));
      await click(p.getByText('Response', { exact: true }));
      await click(p.locator('[data-test-id="parameter-input-fullResponse"] [role="switch"]'));
      await click(p.locator('[data-test-id="parameter-input-neverError"] [role="switch"]'));
      await click(parameter('responseFormat'));
      await click(p.getByRole('option', { name: 'Text', exact: true }));
      await click(p.getByText('Add option', { exact: true }));
      await click(p.getByText('Timeout', { exact: true }));
      await s.type(parameter('timeout'), '10000', { delay: 75, settle: 1000 });
      await s.run(() => parameter('timeout').press('Tab'));
      await s.pause(2500);
      await control('2-http');
      await click(p.getByText('Settings', { exact: true }));
      await click(parameter('onError'));
      await click(p.getByRole('option', { name: /^Continue.*regular output$/ }));
      await s.pause(2200);
      await control('3-error');
      await closeNode();

      // One explicit boolean expression covers HTTP status errors and timeouts.
      await addNext('HTTP Request', 'If', 'If');
      await click(p.locator('[data-test-id="filter-operator-select"] button'));
      await click(p.getByRole('menuitem', { name: 'Boolean', exact: true }));
      await click(p.getByRole('menuitem', { name: 'is true', exact: true }));
      const left = p.locator('[data-test-id="filter-condition-left"]');
      await s.run(() => left.hover());
      await click(left.getByRole('radio', { name: 'Expression', exact: true }));
      const expression = left.locator('[contenteditable="true"]');
      await click(expression, 250);
      // Fill is a real paste into CodeMirror; it avoids auto-paired brace typing.
      await s.run(() => expression.fill('{{ !!$json.error || Number($json.statusCode) >= 400 }}'));
      await click(p.getByText('Conditions', { exact: true }));
      await s.pause(3200);
      await control('4-condicion');
      await closeNode();
    }

    // Telegram is added from the actual true output (index 0) of IF in monitor mode.
    await addNext(mode === 'monitor' ? 'If' : 'Schedule Trigger', 'Telegram', 'Telegram', 'Send a text message', 0);
    await s.type(parameter('chatId'), 'TU_CHAT_ID', { delay: 100, settle: 1000 });
    const message = mode === 'monitor'
      ? 'Alerta: mi web no responde correctamente. Revisa el servicio.'
      : 'Buenos dias. Revisa tus pendientes y define la tarea mas importante de hoy.';
    await s.type(parameter('text'), message, { delay: 35, settle: 2500 });
    await click(p.getByText('Text', { exact: true }), 400);
    await control(mode === 'monitor' ? '5-aviso' : '2-mensaje');
    await closeNode();
    await fit();

    // Saving a draft never presses Execute, Publish, Connect or Send.
    await s.run(() => p.keyboard.press('Control+s'));
    await s.pause(4500);
    await s.run(async () => {
      const expectedNodes = mode === 'monitor' ? 4 : 2;
      if (await p.locator('[data-test-id="canvas-node"]').count() !== expectedNodes) throw new Error('El lienzo no contiene todos los nodos esperados.');
      if (await p.locator('.vue-flow__edge').count() !== expectedNodes - 1) throw new Error('Faltan conexiones en el lienzo.');
      if (!(await p.getByRole('button', { name: 'Publish', exact: true }).isVisible())) throw new Error('No se pudo comprobar el estado de borrador.');
    });
    await control(mode === 'monitor' ? '6-final' : '3-final');
    await s.pause(2600);
    const result = await s.finish(demo.output, { trimStart });
    const report = { ...result, draftId: demo.id, draftUrl: `${origin}/workflow/${demo.id}`, construction: 'native UI', execution: 'not run', publication: 'not published', credential: 'not opened or used; check export for automatic assignment', chatId: 'TU_CHAT_ID' };
    fs.writeFileSync(`${outputDir}/${demo.output}.metadata.json`, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report));
  } catch (error) {
    await s.abort(error.message);
    throw error;
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
