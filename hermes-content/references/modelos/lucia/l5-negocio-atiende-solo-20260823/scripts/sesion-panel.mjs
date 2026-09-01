// Loguea una vez con SSO y GUARDA la sesion local (gitignored) para poder iterar capturas.
import { chromium } from 'playwright';
const HOST='https://onia-chatbot-chatwoot.hqdqgh.easypanel.host';
const token = process.argv[2];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1600,height:1000}, deviceScaleFactor:2, locale:'es-BO' });
const p = await ctx.newPage();
await p.goto(`${HOST}/app/login?email=${encodeURIComponent('oninteligenciaartificial@gmail.com')}&sso_auth_token=${token}`, { waitUntil:'networkidle', timeout:60000 });
await p.waitForTimeout(8000);
await ctx.storageState({ path: '.sesion-chatwoot.json' });
console.log('sesion guardada');
await b.close();
