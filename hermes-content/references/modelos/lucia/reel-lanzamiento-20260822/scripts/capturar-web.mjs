// Captura la web REAL de Onia en 9:16 para usarla como PLANO COMPLETO del reel.
// Cero generacion: es el producto de verdad, no un mockup inventado.
import { chromium } from 'playwright';
const OUT = process.argv[2] || 'apoyos/pantalla-onia.png';
const URL = process.argv[3] || 'https://onia.com.bo/';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await p.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(7000);
await p.screenshot({ path: OUT });
await b.close();
console.log('captura ok ->', OUT);
