const { chromium } = require('C:/dev/proyectos/onia-hermes/web-factory/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');
(async () => {
  const folder = path.join(__dirname, 'panel-ejecucion');
  const data = JSON.parse(fs.readFileSync(path.join(folder, 'estado.json'), 'utf8'));
  const expected = data.todo_snapshot.todos.reduce((acc, task) => { acc[task.status] = (acc[task.status] || 0) + 1; return acc; }, {});
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const errors = [], externalRequests = [];
      page.on('pageerror', error => errors.push(String(error)));
      page.on('request', request => { if (/^https?:/.test(request.url())) externalRequests.push(request.url()); });
      await page.goto(pathToFileURL(path.join(folder, 'PANEL.html')).href, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const proof = await page.evaluate(() => window.__panelProof);
      assert.equal(proof.taskCount, data.todo_snapshot.todos.length);
      assert.equal(proof.revision, data.todo_snapshot.revision);
      assert.deepEqual(proof.counts, expected);
      assert.equal(proof.activeWorkers, data.children.filter(worker => worker.status === 'running').length);
      assert.equal(proof.readonly, true);
      const geometry = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
      assert.ok(geometry.scroll <= geometry.width, JSON.stringify(geometry));
      await page.locator('#search').fill('orca-codex-hooks');
      assert.equal(await page.locator('.task').count(), 1);
      await page.getByRole('button', { name: 'Ver detalle', exact: true }).click();
      await page.locator('#task-dialog').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#dialog-id').textContent(), 'orca-codex-hooks');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#task-dialog').isVisible(), false);
      assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Ver detalle');
      await page.locator('#search').fill('');
      await page.locator('#filter').selectOption('pending');
      assert.equal(await page.locator('.task').count(), expected.pending || 0);
      await page.locator('#filter').selectOption('all');
      const screenshot = path.join(folder, `panel-${viewport.width}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      assert.equal(errors.length, 0, errors.join('\n'));
      assert.equal(externalRequests.length, 0, externalRequests.join('\n'));
      results.push({ viewport, geometry, proof, dialogAndEscape: 'pass', searchAndFilter: 'pass', errors, externalRequests, screenshot });
      await page.close();
    }
  } finally { await browser.close(); }
  const qa = { scope: 'read-only local snapshot; desktop and narrow viewport, not a physical mobile device or continuous monitor', results };
  fs.writeFileSync(path.join(folder, 'qa-panel.json'), JSON.stringify(qa, null, 2));
  console.log(JSON.stringify(qa));
})().catch(error => { console.error(error); process.exit(1); });
