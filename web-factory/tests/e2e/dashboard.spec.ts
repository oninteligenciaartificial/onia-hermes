import { expect, test } from "@playwright/test";

import demo from "../../data/clients/dashboard-demo.json" with { type: "json" };

test.describe("dashboard preview (dashboard-demo)", () => {
  test("renders shell, KPIs, charts and a data table", async ({ page }) => {
    await page.goto("/dashboard-demo/");

    // App shell + heading.
    await expect(page.locator(".wf-dash-side")).toBeVisible();
    // El titulo sale del JSON del cliente: fijarlo como string congelaba el
    // dato en el test. W7 lo cambio a "Hoy en la clinica" y este gate quedo
    // ROJO durante toda una sesion sin que nadie lo viera — un gate que falla
    // por drift de copy entrena a ignorar el rojo.
    await expect(page.locator("h1")).toContainText(demo.dashboard.title);

    // KPI row with at least one metric and a delta pill.
    const kpis = page.locator(".wf-kpi");
    expect(await kpis.count()).toBeGreaterThan(0);
    await expect(page.locator(".wf-kpi-delta").first()).toBeVisible();

    // Charts render as inline SVG (bars + a line).
    await expect(page.locator("svg.wf-chart").first()).toBeVisible();
    // W4 cambio las barras de <rect rx> a <path>: el rx redondeaba las cuatro
    // esquinas y la barra flotaba sobre el cero. Este gate seguia contando
    // `rect` — se quedo en 0 y solo se noto ahora, porque antes fallaba una
    // linea mas arriba y nunca llegaba aca.
    expect(await page.locator("svg.wf-chart path").count()).toBeGreaterThan(0);
    await expect(page.locator("svg.wf-chart polyline").first()).toBeVisible();

    // Data table with rows.
    await expect(page.locator(".wf-dash-table table")).toBeVisible();
    expect(await page.locator(".wf-dash-table tbody tr").count()).toBeGreaterThan(0);
  });

  test("time-range filter toggles active state", async ({ page }) => {
    await page.goto("/dashboard-demo/");

    const filters = page.locator("[data-dash-filter]");
    const count = await filters.count();
    test.skip(count < 2, "demo has no multi-option filter");

    const second = filters.nth(1);
    await second.click();
    await expect(second).toHaveClass(/is-active/);
    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect(filters.first()).toHaveAttribute("aria-pressed", "false");
  });

  test("no broken same-origin assets", async ({ page }) => {
    const failed: string[] = [];
    page.on("requestfailed", (request) => {
      const kind = request.resourceType();
      if (kind === "image" || kind === "stylesheet") {
        failed.push(`${kind} ${request.url()}`);
      }
    });

    const response = await page.goto("/dashboard-demo/");
    expect(response?.ok()).toBeTruthy();
    await page.waitForLoadState("networkidle");
    expect(failed, `broken assets: ${failed.join(", ")}`).toEqual([]);
  });
});
