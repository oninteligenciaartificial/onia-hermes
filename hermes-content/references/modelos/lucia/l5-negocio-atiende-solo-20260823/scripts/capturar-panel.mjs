// Captura el panel REAL de Chatwoot mostrando la conversacion que acaba de entrar sola.
// El SSO token se pasa por argumento (efimero, de un solo uso) — NUNCA se escribe en el repo.
import { chromium } from 'playwright';
const HOST='https://onia-chatbot-chatwoot.hqdqgh.easypanel.host';
const token = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1600,height:1000}, deviceScaleFactor:2, locale:'es-BO' });
await p.goto(`${HOST}/app/login?email=${encodeURIComponent('oninteligenciaartificial@gmail.com')}&sso_auth_token=${token}`, { waitUntil:'networkidle', timeout:60000 });
await p.waitForTimeout(8000);
await p.screenshot({ path:'capturas/06-panel-login.png' });
await p.goto(`${HOST}/app/accounts/2/inbox/4`, { waitUntil:'networkidle', timeout:60000 });
await p.waitForTimeout(8000);
await p.screenshot({ path:'capturas/07-panel-inbox4.png' });
console.log(await p.evaluate(()=>document.body.innerText.slice(0,600)));
await b.close();
