const { chromium } = require('@playwright/test');
const OUT = 'C:\\Users\\PC\\AppData\\Local\\Temp\\claude\\C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674\\03ac0c13-5c3c-47d8-8bb1-f0a99d9dd8a5\\scratchpad';
const DEMO = OUT + '\\dashboard-demo';
const fs = require('fs');

const ROUTES = [
  ['/comercio', 'catalogo-1440.png'],
  ['/comercio/inventario', 'inventario-1440.png'],
  ['/comercio/caja', 'caja-1440.png'],
  ['/contabilidad', 'contabilidad-1440.png'],
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: OUT + '\\storage-state.json', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const [route, filename] of ROUTES) {
    await page.goto('https://app.onia.com.bo' + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: DEMO + '\\' + filename, fullPage: true });
    fs.writeFileSync(OUT + '\\' + filename.replace('.png', '.html'), await page.content());
    console.log('captured', route);
  }

  await browser.close();
})();
