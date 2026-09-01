import { chromium } from 'playwright';

const URL = 'http://127.0.0.1:8777/index.html';
const OUT = 'C:/dev/proyectos/onia-hermes/.claude/worktrees/hero-mecanica/hermes-content/references/ui-patterns/hero-onia/mecanica/capturas';

const shots = [
  { file: 'hero-1440.png', w: 1440, h: 900, motion: 'no-preference', wait: 0 },
  { file: 'hero-375.png',  w: 375,  h: 812, motion: 'no-preference', wait: 0 },
  { file: 'diag-1440-mid.png', w: 1440, h: 900, motion: 'no-preference', wait: 3600 },
  { file: 'diag-1440-reducido.png', w: 1440, h: 900, motion: 'reduce', wait: 0 },
];

const browser = await chromium.launch();
for (const s of shots) {
  const ctx = await browser.newContext({
    viewport: { width: s.w, height: s.h },
    deviceScaleFactor: 2,
    reducedMotion: s.motion,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (s.wait) {
    await page.waitForTimeout(s.wait);
    await page.evaluate(() => document.getAnimations().forEach(a => a.pause()));
  } else {
    // congelar en el primer fotograma: asi lo va a ver mucha gente
    await page.evaluate(() => document.getAnimations().forEach(a => { a.currentTime = 0; a.pause(); }));
  }
  await page.screenshot({ path: `${OUT}/${s.file}`, fullPage: false });
  const h = await page.evaluate(() => document.body.scrollHeight);
  console.log(`${s.file}  viewport=${s.w}x${s.h}  bodyH=${h}`);
  await ctx.close();
}
await browser.close();
