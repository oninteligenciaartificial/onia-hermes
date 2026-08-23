// Prueba REAL: abre el widget, manda un mensaje y espera la respuesta del bot.
// Graba video para ver el movimiento real.
import { chromium } from 'playwright';
const URL='https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget?website_token=9k5i7xnAgCbSse1EZwVChZLw';
const MSG = process.argv[2] || 'Hola, tengo una ferreteria en Santa Cruz. Que hace el sistema?';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:620,height:1100}, deviceScaleFactor:2, locale:'es-BO',
  recordVideo:{ dir:'capturas/video-crudo', size:{width:620,height:1100} } });
const p = await ctx.newPage();
await p.goto(URL, { waitUntil:'networkidle', timeout:60000 });
await p.waitForTimeout(4000);
const start = p.getByRole('button', { name:/Iniciar conversaci/i });
if (await start.count()) { await start.first().click(); await p.waitForTimeout(3000); }
await p.screenshot({ path:'capturas/02-tras-iniciar.png' });
// buscar el campo de texto
const ta = p.locator('textarea, [contenteditable="true"], input[type=text]');
console.log('campos encontrados:', await ta.count());
if (await ta.count()) {
  await ta.first().click();
  for (const ch of MSG) { await p.keyboard.type(ch); await p.waitForTimeout(28); }
  await p.waitForTimeout(700);
  await p.screenshot({ path:'capturas/03-escrito.png' });
  await p.keyboard.press('Enter');
  await p.waitForTimeout(12000);   // esperar la respuesta del bot
  await p.screenshot({ path:'capturas/04-respuesta.png' });
}
const txt = await p.evaluate(()=>document.body.innerText.slice(0,1500));
console.log('--- TEXTO EN PANTALLA ---\n'+txt);
await ctx.close(); await b.close();
