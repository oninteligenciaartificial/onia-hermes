import { defineConfig, devices } from "@playwright/test";

const PORT = 4319;

// The measurement-sensitive specs (LCP via PerformanceObserver, axe scans +
// networkidle waits) flake under CPU contention when ~6 workers hammer the
// single static server. They live in their own projects with fullyParallel
// disabled so they run one test at a time, while the functional specs stay
// parallel for speed. A capped worker count keeps the measurement projects from
// overlapping each other. See tests/e2e/{perf,a11y}.spec.ts (mode: "serial").
const MEASUREMENT_SPECS = /(perf|a11y)\.spec\.ts$/;

// El gate visual fija su propio viewport (1440 y 375) y corre una sola vez: en
// el proyecto mobile capturaria lo mismo con otro device y duplicaria baselines.
const DESKTOP_ONLY_SPECS = /visual\.spec\.ts$/;

/**
 * E2E for the static previews produced by the factory (out/<slug>). This is the
 * client-facing artifact, so smoke-testing it guards the real deliverable
 * (home, hero, CTA, catalog, product page and cart) without depending on the
 * Next runtime or payment credentials.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Local safety net for the rare residual timing spike; the real fix is the
  // serialized measurement projects below, not retries.
  retries: process.env.CI ? 2 : 1,
  // Cap concurrency so the serialized measurement projects don't run at the same
  // time as each other (and starve the LCP/axe measurements). Functional specs
  // still parallelize across these workers.
  //
  // Local baja de 3 a 2 el 2026-09-01. Con 3 la corrida dejaba 3 rojos y 2 flaky
  // que NO eran regresiones: los tres morian con "Target page, context or browser
  // has been closed", o sea el navegador se caia, no fallaba una asercion. Es el
  // mismo cuadro que tiraba `pnpm test` el mismo dia (ver vitest.config.ts): la
  // maquina tiene 12 nucleos pero ~3,3 GB libres, y los loops corren en paralelo.
  // Medido: 1 worker → 49 verdes, 0 rojos · 2 workers → 103 verdes, 0 rojos en
  // 1,2 min (con 3 tardaba 1,3 min). El paralelismo perdido no cuesta nada y el
  // gate deja de mentir. Un gate que da rojo por contencion se termina ignorando.
  workers: process.env.CI ? 4 : 2,
  reporter: process.env.CI ? "line" : "list",
  globalSetup: "./tests/e2e/global-setup.ts",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    // Functional specs: parallel for speed (landing, store, dashboard).
    {
      name: "chromium",
      testIgnore: MEASUREMENT_SPECS,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testIgnore: [MEASUREMENT_SPECS, DESKTOP_ONLY_SPECS],
      use: { ...devices["Pixel 7"] },
    },
    // Measurement specs: serialized (fullyParallel: false) so timing-sensitive
    // measurements never compete for CPU. perf skips itself on mobile.
    {
      name: "chromium-measure",
      testMatch: MEASUREMENT_SPECS,
      fullyParallel: false,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-measure",
      testMatch: MEASUREMENT_SPECS,
      fullyParallel: false,
      // Run after chromium-measure (not alongside it) so the two measurement
      // projects never contend for CPU — at most one measurement test runs at a
      // time across the whole suite.
      dependencies: ["chromium-measure"],
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: `node scripts/serve-out.mjs ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
