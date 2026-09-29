const { chromium } = require('C:/dev/proyectos/onia-platform-v1-integracion-20260927/node_modules/playwright');
(async () => {
  const url = process.argv[2]; const runs = +process.argv[3] || 2;
  const b = await chromium.launch();
  for (let r = 0; r < runs; r++) {
    const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    await p.route(u => !/onia\.com\.bo/.test(new URL(u).hostname), rt => rt.abort());
    if (process.argv[4]) await p.route(u => u.href.includes(process.argv[4]), rt => rt.abort());
    const c = await ctx.newCDPSession(p);
    await c.send('Network.enable');
    await c.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6/8, uploadThroughput: 750e3/8 });
    await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await p.addInitScript(() => { window.__lt = []; window.__lcp = 0; new PerformanceObserver(l => l.getEntries().forEach(e => window.__lt.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: 'longtask', buffered: true }); new PerformanceObserver(l => { const e = l.getEntries(); window.__lcp = Math.round(e[e.length-1].startTime); }).observe({ type: 'largest-contentful-paint', buffered: true }); });
    await p.goto(url, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(4000);
    const d = await p.evaluate(() => { const fcp = performance.getEntriesByName('first-contentful-paint')[0]; const f = fcp ? fcp.startTime : 0; const tbt = window.__lt.filter(([s]) => s >= f).reduce((a, [, dur]) => a + Math.max(0, dur - 50), 0); const nav = performance.getEntriesByType('navigation')[0]; return { fcp: Math.round(f), lcp: window.__lcp, tbt, lt: window.__lt, load: Math.round(nav.loadEventEnd), bytes: performance.getEntriesByType('resource').reduce((a, e) => a + (e.transferSize || 0), 0) + nav.transferSize }; });
    console.log(url, JSON.stringify(d));
    await ctx.close();
  }
  await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
