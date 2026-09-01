import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('https://onia.com.bo/', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(12000);
await p.screenshot({ path: 'capturas/00b-hero-zoom.png', clip: { x: 660, y: 270, width: 580, height: 430 } });
await b.close();
