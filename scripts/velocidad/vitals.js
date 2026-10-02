// Mide FCP/LCP/CLS/bytes en paginas publicas. Cache fria por corrida. Terceros bloqueados (no ensuciar GA).
const { chromium } = require('C:/dev/proyectos/onia-platform-v1-integracion-20260927/node_modules/playwright');
const URLS = process.argv.slice(2);
const RUNS = 3;
const PROFILES = {
  movil_4g: { viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.6,
    net: { latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 }, cpu: 4 },
  escritorio: { viewport: { width: 1366, height: 768 }, isMobile: false, hasTouch: false, deviceScaleFactor: 1, net: null, cpu: 1 },
};
const BLOCK = /googletagmanager|google-analytics|cloudflareinsights|connect\.facebook|doubleclick/;

(async () => {
  const browser = await chromium.launch();
  for (const [pname, p] of Object.entries(PROFILES)) {
    for (const url of URLS) {
      const rs = [];
      for (let i = 0; i < RUNS; i++) {
        const ctx = await browser.newContext({ viewport: p.viewport, isMobile: p.isMobile, hasTouch: p.hasTouch, deviceScaleFactor: p.deviceScaleFactor });
        await ctx.route(BLOCK, r => r.abort());
        const page = await ctx.newPage();
        const cdp = await ctx.newCDPSession(page);
        await cdp.send('Network.enable');
        await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
        if (p.net) await cdp.send('Network.emulateNetworkConditions', { offline: false, ...p.net });
        if (p.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: p.cpu });
        let bytes = 0, reqs = 0; const byType = {};
        cdp.on('Network.loadingFinished', e => { bytes += e.encodedDataLength; reqs++; });
        cdp.on('Network.responseReceived', e => { byType[e.type] = (byType[e.type] || 0) + 1; });
        await page.addInitScript(() => {
          window.__v = { lcp: 0, cls: 0, lcpEl: '' };
          new PerformanceObserver(l => { for (const e of l.getEntries()) { window.__v.lcp = e.startTime; window.__v.lcpEl = (e.element && (e.element.tagName + '.' + (e.element.className || '').toString().slice(0, 40))) || e.url || ''; } }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__v.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
        });
        const t0 = Date.now();
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        const load = Date.now() - t0;
        await page.waitForTimeout(2500);
        const m = await page.evaluate(() => {
          const n = performance.getEntriesByType('navigation')[0];
          const fcp = performance.getEntriesByName('first-contentful-paint')[0];
          return { ttfb: Math.round(n.responseStart), fcp: fcp ? Math.round(fcp.startTime) : null, lcp: Math.round(window.__v.lcp), lcpEl: window.__v.lcpEl, cls: +window.__v.cls.toFixed(3), dcl: Math.round(n.domContentLoadedEventEnd) };
        });
        rs.push({ ...m, load, kb: Math.round(bytes / 1024), reqs });
        await ctx.close();
      }
      const med = k => { const v = rs.map(r => r[k]).filter(x => x != null).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
      console.log(`${pname}\t${url}\tTTFB=${med('ttfb')}ms FCP=${med('fcp')}ms LCP=${med('lcp')}ms CLS=${med('cls')} load=${med('load')}ms transfer=${med('kb')}KB reqs=${med('reqs')} lcpEl=${rs[0].lcpEl}`);
    }
  }
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
