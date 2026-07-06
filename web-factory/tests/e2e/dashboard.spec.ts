import { expect, test } from "@playwright/test";

test.describe("dashboard preview (dashboard-demo)", () => {
  test("renders shell, hero panel, KPIs, charts and a data table", async ({ page }) => {
    await page.goto("/dashboard-demo/");

    // App shell + heading.
    await expect(page.locator(".wf-dash-side")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Panel operativo");

    // Grouped nav shows section headers, not a flat list.
    await expect(page.locator(".wf-dash-nav-group").first()).toBeVisible();

    // Hero panel (Tier 1): queue variant for this ops-profile reference.
    await expect(page.locator(".wf-dash-hero--queue")).toBeVisible();
    expect(await page.locator(".wf-dash-queue-row").count()).toBeGreaterThan(0);

    // KPI row with at least one metric and a delta pill.
    const kpis = page.locator(".wf-kpi");
    expect(await kpis.count()).toBeGreaterThan(0);
    await expect(page.locator(".wf-kpi-delta").first()).toBeVisible();

    // Charts render as inline SVG (bar + donut in the reference data).
    await expect(page.locator("svg.wf-chart").first()).toBeVisible();
    expect(await page.locator("svg.wf-chart rect").count()).toBeGreaterThan(0);

    // Data table with filter chips and at least one status pill.
    await expect(page.locator(".wf-dash-table table")).toBeVisible();
    expect(await page.locator(".wf-dash-table tbody tr").count()).toBeGreaterThan(0);
    await expect(page.locator(".wf-dash-chip").first()).toBeVisible();
    await expect(page.locator(".wf-dash-pill").first()).toBeVisible();

    // Side panel sits next to the table in the asymmetric detail row.
    await expect(page.locator(".wf-dash-side-panel")).toBeVisible();
  });

  test("status pills carry a glyph, not color alone", async ({ page }) => {
    await page.goto("/dashboard-demo/");
    const glyph = page.locator(".wf-dash-pill-glyph").first();
    await expect(glyph).toBeVisible();
    const text = await glyph.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test("states showcase is always visible, no interaction required", async ({ page }) => {
    await page.goto("/dashboard-demo/");
    const states = page.locator("#estados");
    await expect(states).toBeVisible();
    await expect(states.locator(".wf-dash-card--loading")).toBeVisible();
    await expect(states.locator(".wf-dash-empty")).toBeVisible();
    await expect(states.locator(".wf-dash-error")).toBeVisible();
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
