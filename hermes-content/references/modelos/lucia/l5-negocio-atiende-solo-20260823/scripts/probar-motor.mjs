import { chromium } from 'playwright';
const TOKEN = process.argv[2] || '9k5i7xnAgCbSse1EZwVChZLw';
const M1 = process.argv[3] || 'Hola';
const M2 = process.argv[4] || 'Tengo una ferreteria, que hace el sistema?';
const URL=`https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget?website_token=${TOKEN}&locale=es`;
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:810,height:1440}, deviceScaleFactor:2, locale:'es-BO' });
await p.goto(URL,{waitUntil:'networkidle',timeout:60000});
await p.waitForTimeout(5000);
console.log('=== INICIO ===\n' + (await p.evaluate(()=>document.body.innerText)).slice(0,300));
const s = p.getByRole('button', { name:/Iniciar conversaci/i });
if (await s.count()) { await s.first().click(); await p.waitForTimeout(4000); }
const ta = p.locator('textarea, [contenteditable="true"], input[type=text]').first();
if (await ta.count() === 0) { await p.screenshot({path:'capturas/99-sin-campo.png'}); console.log('SIN CAMPO DE TEXTO'); await b.close(); process.exit(0); }
await ta.click(); await p.keyboard.type(M1,{delay:40}); await p.keyboard.press('Enter');
await p.waitForTimeout(11000);
console.log('=== TRAS MSG 1 ===\n' + (await p.evaluate(()=>document.body.innerText)).slice(0,800));
await ta.click(); await p.keyboard.type(M2,{delay:40}); await p.keyboard.press('Enter');
await p.waitForTimeout(18000);
await p.screenshot({ path:'capturas/13-motor.png' });
console.log('=== TRAS MSG 2 ===\n' + (await p.evaluate(()=>document.body.innerText)).slice(0,1400));
await b.close();
