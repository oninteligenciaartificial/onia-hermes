const { chromium } = require('@playwright/test');
const OUT = 'C:\\Users\\PC\\AppData\\Local\\Temp\\claude\\C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674\\03ac0c13-5c3c-47d8-8bb1-f0a99d9dd8a5\\scratchpad';
const DEMO = OUT + '\\dashboard-demo';
const fs = require('fs');

const PRODUCTS = [
  ['Martillo carpintero (DEMO)', '45'],
  ['Set de herramientas (DEMO)', '150'],
  ['Caja de tornillos (DEMO)', '15'],
];

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
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: 'add Agregar horario' }).first().click();
    await page.waitForTimeout(150);
  }
  await page.click('text=Continuar');
  await page.waitForTimeout(1000);
  for (const [name, price] of PRODUCTS) {
    await page.fill('input[placeholder="Ej: Cables y conductores"]', name);
    await page.fill('input[placeholder="Bs."]', price);
    await page.click('text=Agregar');
    await page.waitForTimeout(300);
  }
  await page.click('text=Continuar');
  await page.waitForTimeout(1000);

  // Paso 4: equipo
  await page.fill('input[placeholder="Dra. Ana Rios"]', 'Juan Perez (DEMO)');
  await page.click('text=Recepción'); // cashier-like role fits comercio better than "Profesional"
  await page.screenshot({ path: DEMO + '\\14-onboarding-step4-filled.png', fullPage: true });

  await page.click('text=Terminar');
  await page.waitForTimeout(2500);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: DEMO + '\\15-onboarding-finished.png', fullPage: true });
  fs.writeFileSync(OUT + '\\onboarding-finished.html', await page.content());
  fs.writeFileSync(OUT + '\\onboarding-finished-url.txt', page.url());

  await context.storageState({ path: OUT + '\\storage-state.json' });
  await browser.close();
  console.log('DONE finish');
})();
