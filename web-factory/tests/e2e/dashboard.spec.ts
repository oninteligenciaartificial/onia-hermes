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

  // La barra lateral es `position: sticky` a 100vh: tiene que tapar el alto de
  // la ventana en CUALQUIER scroll, no solo arriba. El gate visual no puede ver
  // esto — una captura `fullPage` pinta lo sticky en su posicion ESTATICA, asi
  // que la baseline se ve igual con el sticky puesto que con el sticky roto.
  // Por eso se mide en el navegador y no por captura: A5 se abrio como defecto
  // ("el bloque oscuro corta a ~895px") leyendo justamente ese artefacto.
  test("el sidebar cubre la ventana tambien al pie de la pagina", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/dashboard-demo/");
    await page.waitForLoadState("networkidle");

    for (const fraccion of [0, 0.5, 1]) {
      await page.evaluate((f) => {
        window.scrollTo(0, document.documentElement.scrollHeight * f);
      }, fraccion);

      const caja = await page.evaluate(() => {
        const lado = document.querySelector(".wf-dash-side");
        if (!lado) return null;
        const r = lado.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, alto: window.innerHeight, y: window.scrollY };
      });

      expect(caja, ".wf-dash-side no existe").not.toBeNull();
      // 1px de tolerancia: al final del scroll el sticky se suelta por el
      // sobrante fraccionario (medido: top -0.23, bottom 899.77 contra 900).
      expect(caja!.top, `asoma fondo de pagina ARRIBA en scrollY=${caja!.y}`).toBeLessThanOrEqual(1);
      expect(
        caja!.bottom,
        `asoma fondo de pagina ABAJO en scrollY=${caja!.y}`,
      ).toBeGreaterThanOrEqual(caja!.alto - 1);
    }
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
