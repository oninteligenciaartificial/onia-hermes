const { chromium } = require('@playwright/test');
const OUT = 'C:\\Users\\PC\\AppData\\Local\\Temp\\claude\\C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674\\03ac0c13-5c3c-47d8-8bb1-f0a99d9dd8a5\\scratchpad';
const DEMO = OUT + '\\dashboard-demo';
const fs = require('fs');

const EMAIL = 'demo-ferreteria@onia.com.bo';
const PASSWORD = 'OniaDemo!Ferreteria2026#Bo';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://app.onia.com.bo/register', { waitUntil: 'networkidle' });

  await page.click('[data-testid="rubro-gestios-general"]');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300);

  await page.fill('input[placeholder="Maria Perez"]', 'Equipo Onia (DEMO)');
  await page.fill('input[placeholder="dueno@negocio.bo"]', EMAIL);
  await page.fill('input[placeholder="+591 70000000"] >> nth=0', '+591 70000000');
  await page.fill('input[placeholder="Minimo 8 caracteres"]', PASSWORD);
  await page.fill('input[placeholder="Ferreteria El Tornillo"]', 'DEMO Ferreteria Onia');
  await page.fill('input[placeholder="123456789"]', '123456789');
  await page.fill('input[placeholder="+591 70000000"] >> nth=1', '+591 33456789');
  await page.fill('input[placeholder="La Paz"]', 'Santa Cruz de la Sierra');

  const selects = await page.locator('select').all();
  console.log('selects found:', selects.length);
  await selects[0].selectOption('Propietario/a'); // cargo o rol
  await selects[1].selectOption('Santa Cruz'); // departamento
  await selects[2].selectOption('1-50 clientes/mes'); // volumen
  await selects[3].selectOption('Otro'); // como nos encontraste

  const checkboxes = await page.locator('input[type="checkbox"]').all();
  console.log('checkboxes found:', checkboxes.length);
  await checkboxes[0].check(); // terminos
  await checkboxes[1].check(); // privacidad

  await page.screenshot({ path: DEMO + '\\03-register-form-filled.png', fullPage: true });

  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(1000);

  await page.screenshot({ path: DEMO + '\\04-register-submitted.png', fullPage: true });
  fs.writeFileSync(OUT + '\\after-submit.html', await page.content());
  fs.writeFileSync(OUT + '\\after-submit-url.txt', page.url());

  await page.context().storageState({ path: OUT + '\\storage-state.json' });

  await browser.close();
  console.log('DONE');
})();
