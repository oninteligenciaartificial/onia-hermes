const { chromium } = require('@playwright/test');
const OUT = 'C:\\Users\\PC\\AppData\\Local\\Temp\\claude\\C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674\\03ac0c13-5c3c-47d8-8bb1-f0a99d9dd8a5\\scratchpad';
const DEMO = OUT + '\\dashboard-demo';
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: OUT + '\\storage-state.json', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('https://app.onia.com.bo/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const skipBtn = page.getByRole('button', { name: 'Saltar tutorial' });
  if (await skipBtn.isVisible().catch(() => false)) {
    await skipBtn.click();
    await page.waitForTimeout(500);
  }

  await page.screenshot({ path: DEMO + '\\dashboard-1440.png', fullPage: true });

  await context.storageState({ path: OUT + '\\storage-state.json' });
  await browser.close();
  console.log('DONE clean dashboard');
})();
