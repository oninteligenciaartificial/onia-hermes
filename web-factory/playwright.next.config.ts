import { defineConfig, devices } from "@playwright/test";

const PORT = 4174;

/**
 * E2E de la app Next real (apps/site), separado del sitio estático (playwright.config.ts).
 * El build se hace en el script `e2e:next`; aquí solo levantamos `next start`.
 */
export default defineConfig({
  testDir: "./tests/e2e-next",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `pnpm --filter site exec next start -p ${PORT} -H 127.0.0.1`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
