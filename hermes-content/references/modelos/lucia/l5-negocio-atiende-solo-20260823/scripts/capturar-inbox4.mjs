import { chromium } from 'playwright';
const HOST='https://onia-chatbot-chatwoot.hqdqgh.easypanel.host';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1600,height:1000}, deviceScaleFactor:2, locale:'es-BO', storageState:'.sesion-chatwoot.json' });
const p = await ctx.newPage();
await p.goto(`${HOST}/app/accounts/2/inbox/4`, { waitUntil:'networkidle', timeout:60000 });
await p.waitForTimeout(9000);
const desc = p.getByText(/Descartar/i).first();
if (await desc.count()) { await desc.click({force:true}); await p.waitForTimeout(2000); }
await p.mouse.click(398, 69);
await p.waitForTimeout(6000);
await p.screenshot({ path:'capturas/11-inbox4-todos.png' });
console.log((await p.evaluate(()=>document.body.innerText)).slice(0,500));
await b.close();
