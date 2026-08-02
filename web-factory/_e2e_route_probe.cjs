const { chromium } = require('@playwright/test');
const OUT = 'C:\\Users\\PC\\AppData\\Local\\Temp\\claude\\C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674\\03ac0c13-5c3c-47d8-8bb1-f0a99d9dd8a5\\scratchpad';
const fs = require('fs');

const PROBES = [
  '/comercio/productos/nuevo',
  '/comercio/producto/nuevo',
  '/comercio/caja/venta',
  '/comercio/venta/nueva',
  '/comercio/ventas/nueva',
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: OUT + '\\storage-state.json', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const results = [];
  for (const route of PROBES) {
    const resp = await page.goto('https://app.onia.com.bo' + route, { waitUntil: 'load', timeout: 20000 }).catch((e) => null);
    await page.waitForTimeout(600);
    const heading = await page.locator('h1').first().textContent().catch(() => null);
    results.push({ route, status: resp ? resp.status() : 'nav-error', heading });
  }
  fs.writeFileSync(OUT + '\\route-probe-results.json', JSON.stringify(results, null, 2));
  await browser.close();
})();
