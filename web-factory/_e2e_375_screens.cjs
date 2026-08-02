const { chromium } = require('@playwright/test');
const OUT = 'C:\\Users\\PC\\AppData\\Local\\Temp\\claude\\C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674\\03ac0c13-5c3c-47d8-8bb1-f0a99d9dd8a5\\scratchpad';
const DEMO = OUT + '\\dashboard-demo';
const fs = require('fs');

const ROUTES = [
  ['/dashboard', 'dashboard-375.png'],
  ['/comercio', 'catalogo-375.png'],
  ['/comercio/inventario', 'inventario-375.png'],
  ['/comercio/caja', 'caja-375.png'],
  ['/contabilidad', 'contabilidad-375.png'],
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: OUT + '\\storage-state.json', viewport: { width: 375, height: 812 } });
  const page = await context.newPage();

  for (const [route, filename] of ROUTES) {
    await page.goto('https://app.onia.com.bo' + route, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(1800);
    const skipBtn = page.getByRole('button', { name: 'Saltar tutorial' });
    if (await skipBtn.isVisible().catch(() => false)) {
      await skipBtn.click();
      await page.waitForTimeout(400);
    }
    await page.screenshot({ path: DEMO + '\\' + filename, fullPage: true });
    console.log('captured', route);
  }

  // Mobile nav: open hamburger menu on dashboard
  await page.goto('https://app.onia.com.bo/dashboard', { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(1200);
  await page.getByLabel('Abrir menu').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: DEMO + '\\nav-mobile-375.png', fullPage: true });

  await browser.close();
  console.log('DONE 375');
})();
