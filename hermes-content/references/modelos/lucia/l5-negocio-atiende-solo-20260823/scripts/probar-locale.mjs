import { chromium } from 'playwright';
const URL='https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget?website_token=9k5i7xnAgCbSse1EZwVChZLw&locale=es';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:620,height:1100}, deviceScaleFactor:2, locale:'es-BO' });
await p.goto(URL,{waitUntil:'networkidle',timeout:60000});
await p.waitForTimeout(5000);
const start = p.getByRole('button', { name:/Iniciar conversaci/i });
if (await start.count()) { await start.first().click(); await p.waitForTimeout(3500); }
await p.screenshot({ path:'capturas/05-locale-es.png' });
console.log(await p.evaluate(()=>document.body.innerText.slice(0,400)));
await b.close();
