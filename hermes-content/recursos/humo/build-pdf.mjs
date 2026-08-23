// HTML de marca -> PDF A4. Se rinde con el chromium de Playwright que ya usa el editor.
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const SRC = resolve(process.argv[2]);
const OUT = resolve(process.argv[3]);
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(pathToFileURL(SRC).href, { waitUntil: 'networkidle' });
await p.waitForTimeout(2000);            // que carguen las fuentes
await p.pdf({ path: OUT, format: 'A4', printBackground: true,
              margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await b.close();
console.log('PDF ->', OUT);
