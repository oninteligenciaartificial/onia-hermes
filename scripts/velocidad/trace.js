const { chromium } = require('C:/dev/proyectos/onia-platform-v1-integracion-20260927/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.route(u => !/onia\.com\.bo/.test(new URL(u).hostname), rt => rt.abort());
  const c = await ctx.newCDPSession(p);
  await c.send('Network.enable');
  await c.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6/8, uploadThroughput: 750e3/8 });
  await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await b.startTracing(p, { categories: ['devtools.timeline','disabled-by-default-devtools.timeline','v8.execute'] });
  await p.goto(process.argv[2], { waitUntil: 'load' }); await p.waitForTimeout(3000);
  const buf = await b.stopTracing();
  const ev = JSON.parse(buf.toString()).traceEvents;
  const tasks = ev.filter(e => e.name === 'RunTask' && e.dur > 150000);
  for (const t of tasks) {
    const kids = ev.filter(e => e.ts >= t.ts && e.ts <= t.ts + t.dur && e.tid === t.tid && e.dur > 30000 && e.name !== 'RunTask');
    const agg = {};
    kids.forEach(k => { const n = k.name + (k.args && k.args.data && k.args.data.url ? ' ' + k.args.data.url.split('/').pop().slice(0,40) : ''); agg[n] = Math.max(agg[n] || 0, Math.round(k.dur / 1000)); });
    console.log('task', Math.round(t.dur / 1000), 'ms', JSON.stringify(Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 8)));
  }
  await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
