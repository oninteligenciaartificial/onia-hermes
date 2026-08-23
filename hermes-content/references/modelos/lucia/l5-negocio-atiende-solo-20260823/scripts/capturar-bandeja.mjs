import { chromium } from 'playwright';
const HOST='https://onia-chatbot-chatwoot.hqdqgh.easypanel.host';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1600,height:1000}, deviceScaleFactor:2, locale:'es-BO', storageState:'.sesion-chatwoot.json' });
const p = await ctx.newPage();
await p.goto(`${HOST}/app/accounts/2/conversations/29`, { waitUntil:'networkidle', timeout:60000 });
await p.waitForTimeout(9000);
const desc = p.getByText(/Descartar/i).first();
if (await desc.count()) { await desc.click({force:true}); await p.waitForTimeout(1500); }
await p.mouse.click(398, 69);          // pestana "Todos"
await p.waitForTimeout(6000);
await p.screenshot({ path:'capturas/10-bandeja-todos.png' });
console.log((await p.evaluate(()=>document.body.innerText)).slice(0,400));
await b.close();
