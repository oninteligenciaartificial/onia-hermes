import { chromium } from 'playwright';
const [,, input, output, w] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: Number(w)||900, height: 900 }, deviceScaleFactor: 2 });
await p.goto('file:///' + input.split(String.fromCharCode(92)).join('/'));
await p.waitForTimeout(700);
await p.screenshot({ path: output, fullPage: true });
await b.close(); console.log('ok');