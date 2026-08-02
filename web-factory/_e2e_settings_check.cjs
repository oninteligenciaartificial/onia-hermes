const { chromium } = require('@playwright/test');
const OUT = 'C:\\Users\\PC\\AppData\\Local\\Temp\\claude\\C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674\\03ac0c13-5c3c-47d8-8bb1-f0a99d9dd8a5\\scratchpad';
const DEMO = OUT + '\\dashboard-demo';
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: OUT + '\\storage-state.json', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('https://app.onia.com.bo/settings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: DEMO + '\\_diag-settings.png', fullPage: true });
  fs.writeFileSync(OUT + '\\_diag-settings.html', await page.content());

  // Try clicking a product row/table if any addable UI in inventario
  await page.goto('https://app.onia.com.bo/comercio/inventario', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.locator('button:has(span:text-is("add"))').last().click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(600);
  await page.screenshot({ path: DEMO + '\\_diag-inventario-fab.png', fullPage: true });

  await browser.close();
})();
