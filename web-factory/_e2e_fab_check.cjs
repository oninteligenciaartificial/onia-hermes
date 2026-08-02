const { chromium } = require('@playwright/test');
const OUT = 'C:\\Users\\PC\\AppData\\Local\\Temp\\claude\\C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674\\03ac0c13-5c3c-47d8-8bb1-f0a99d9dd8a5\\scratchpad';
const DEMO = OUT + '\\dashboard-demo';
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: OUT + '\\storage-state.json', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('https://app.onia.com.bo/comercio', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.locator('button:has(span:text-is("add"))').last().click({ timeout: 5000 }).catch(async (e) => {
    console.log('catalog fab click err', e.message);
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: DEMO + '\\_diag-catalogo-fab.png', fullPage: true });
  fs.writeFileSync(OUT + '\\_diag-catalogo-fab-url.txt', page.url());
  fs.writeFileSync(OUT + '\\_diag-catalogo-fab.html', await page.content());

  await page.goto('https://app.onia.com.bo/comercio/caja', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.locator('button:has(span:text-is("add"))').last().click({ timeout: 5000 }).catch(async (e) => {
    console.log('caja fab click err', e.message);
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: DEMO + '\\_diag-caja-fab.png', fullPage: true });
  fs.writeFileSync(OUT + '\\_diag-caja-fab-url.txt', page.url());
  fs.writeFileSync(OUT + '\\_diag-caja-fab.html', await page.content());

  await browser.close();
})();
