const { chromium } = require('@playwright/test');
const OUT = 'C:\\Users\\PC\\AppData\\Local\\Temp\\claude\\C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674\\03ac0c13-5c3c-47d8-8bb1-f0a99d9dd8a5\\scratchpad';
const DEMO = OUT + '\\dashboard-demo';
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://app.onia.com.bo/register', { waitUntil: 'networkidle' });
  await page.screenshot({ path: DEMO + '\\01-register-step0-rubro.png', fullPage: true });

  await page.click('[data-testid="rubro-gestios-general"]');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
  await page.screenshot({ path: DEMO + '\\02-register-step1.png', fullPage: true });

  const html = await page.content();
  fs.writeFileSync(OUT + '\\step1.html', html);

  await browser.close();
})();
