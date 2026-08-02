const { chromium } = require('@playwright/test');
const OUT = 'C:\\Users\\PC\\AppData\\Local\\Temp\\claude\\C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674\\03ac0c13-5c3c-47d8-8bb1-f0a99d9dd8a5\\scratchpad';
const DEMO = OUT + '\\dashboard-demo';
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: OUT + '\\storage-state.json', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('https://app.onia.com.bo/onboarding', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.click('text=Completar el formulario');
  await page.waitForTimeout(800);
  await page.fill('input[placeholder="Av. Banzer 4to anillo #128"]', 'Av. Demo #123 (DEMO)');
  await page.click('text=Continuar');
  await page.waitForTimeout(1000);

  // now on horarios step
  const lunesRow = page.locator('div', { hasText: 'Lunes' }).first();
  await page.getByText('Agregar horario').first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: DEMO + '\\09-onboarding-horario-open.png', fullPage: true });
  fs.writeFileSync(OUT + '\\onboarding-horario.html', await page.content());

  await browser.close();
})();
