// Prueba el bot de la ferreteria: contesta con SU conocimiento?
import { chromium } from 'playwright';
const TOKEN='tiXym8tmNL2drsZb4WUnn1av';
const URL=`https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget?website_token=${TOKEN}&locale=es`;
const MSG = process.argv[2] || '¿A qué hora abren?';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:810,height:1440}, deviceScaleFactor:2, locale:'es-BO' });
await p.goto(URL,{waitUntil:'networkidle',timeout:60000});
await p.waitForTimeout(5000);
const start = p.getByRole('button', { name:/Iniciar conversaci/i });
if (await start.count()) { await start.first().click(); await p.waitForTimeout(3500); }
const ta = p.locator('textarea, [contenteditable="true"], input[type=text]');
if (await ta.count()) {
  await ta.first().click();
  await p.keyboard.type(MSG, { delay: 45 });
  await p.waitForTimeout(600);
  await p.keyboard.press('Enter');
  await p.waitForTimeout(14000);
}
await p.screenshot({ path:'capturas/12-ferreteria.png' });
console.log(await p.evaluate(()=>document.body.innerText.slice(0,900)));
await b.close();
