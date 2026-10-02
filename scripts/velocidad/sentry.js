const { chromium } = require('C:/dev/proyectos/onia-platform-v1-integracion-20260927/node_modules/playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('https://app.onia.com.bo/login', { waitUntil: 'load' }); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => { const c = window.__SENTRY__; if (!c) return 'no __SENTRY__'; const out = {}; for (const k of Object.keys(c)) { const v = c[k]; const sc = v && (v.defaultCurrentScope || (v.stack && v.stack.getStackTop && v.stack.getStackTop())); const cl = sc && (sc._client || sc.client || (sc.getClient && sc.getClient())); out[k] = cl ? { hasDsn: !!(cl.getOptions().dsn), enabled: cl.getOptions().enabled } : 'no client'; } return out; });
  console.log(JSON.stringify(r)); await b.close(); })();
