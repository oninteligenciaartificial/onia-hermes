import { expect, test } from "@playwright/test";

// Lightweight Core Web Vitals gate for the static previews. It measures LCP,
// CLS and FCP plus same-origin transfer weight, and blocks third-party requests
// (fonts/CDNs) so the numbers reflect OUR output, not network flakiness. This is
// a regression guard: budgets sit well above current measured values.
const CWV = { lcpMs: 2500, fcpMs: 1800, cls: 0.1 };
const MAX_SCRIPT_KB = 60;

const PAGES = [
  { name: "landing (demo)", url: "/demo/", maxBytesKb: 60 },
  { name: "store (skincare-demo)", url: "/skincare-demo/", maxBytesKb: 150 },
  { name: "dashboard (dashboard-demo)", url: "/dashboard-demo/", maxBytesKb: 60 },
];

for (const target of PAGES) {
  test(`performance: ${target.name} meets the CWV + weight budget`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "perf is measured on chromium only");

    // Deterministic: third-party origins do not count against our budget.
    await page.route("**/*", (route) => {
      const host = new URL(route.request().url()).hostname;
      if (host === "localhost" || host === "127.0.0.1") {
        route.continue();
      } else {
        route.abort();
      }
    });

    const bytes: Record<string, number> = { document: 0, stylesheet: 0, script: 0, image: 0, font: 0, other: 0 };
    page.on("response", async (response) => {
      try {
        const body = await response.body();
        const type = response.request().resourceType();
        bytes[type in bytes ? type : "other"] += body.length;
      } catch {
        /* aborted / no body */
      }
    });

    await page.goto(target.url, { waitUntil: "load" });
    await page.waitForTimeout(700);

    const metrics = await page.evaluate(
      () =>
        new Promise<{ lcp: number; cls: number; fcp: number }>((resolve) => {
          let cls = 0;
          let lcp = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as unknown as Array<{ value: number; hadRecentInput: boolean }>) {
              if (!entry.hadRecentInput) {
                cls += entry.value;
              }
            }
          }).observe({ type: "layout-shift", buffered: true });
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            lcp = entries[entries.length - 1].startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });
          const fcp = performance.getEntriesByName("first-contentful-paint")[0];
          setTimeout(() => resolve({ lcp: Math.round(lcp), cls: Number(cls.toFixed(4)), fcp: Math.round(fcp?.startTime ?? 0) }), 300);
        }),
    );

    const totalKb = Object.values(bytes).reduce((sum, value) => sum + value, 0) / 1024;
    const scriptKb = bytes.script / 1024;

    console.log(
      `[perf] ${target.name}: LCP ${metrics.lcp}ms FCP ${metrics.fcp}ms CLS ${metrics.cls} | ${totalKb.toFixed(1)}kb (js ${scriptKb.toFixed(1)}kb)`,
    );

    expect(metrics.cls, "CLS").toBeLessThan(CWV.cls);
    expect(metrics.lcp, "LCP").toBeLessThan(CWV.lcpMs);
    expect(metrics.fcp, "FCP").toBeLessThan(CWV.fcpMs);
    expect(totalKb, "same-origin transfer weight").toBeLessThan(target.maxBytesKb);
    expect(scriptKb, "external script weight").toBeLessThan(MAX_SCRIPT_KB);
  });
}
