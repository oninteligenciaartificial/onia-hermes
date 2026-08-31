// Solo MIRA: abre onia.com.bo, busca el widget del bot y captura lo que hay.
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('https://onia.com.bo/', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(6000);
await p.screenshot({ path: 'capturas/00-landing.png' });
const frames = p.frames().map(f => f.url()).filter(u => u && u !== 'about:blank');
console.log('FRAMES:\n' + frames.join('\n'));
const buttons = await p.evaluate(() => Array.from(document.querySelectorAll('button,[role=button],div[class*=widget],div[id*=chat],div[id*=woot]')).slice(0,40).map(e => (e.id||'') + '|' + (e.className||'').toString().slice(0,60)));
console.log('CANDIDATOS:\n' + buttons.join('\n'));
await b.close();
