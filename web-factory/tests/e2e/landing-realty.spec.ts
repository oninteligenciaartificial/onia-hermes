import { expect, test } from "@playwright/test";

test.describe("landing-realty preview (realty-demo)", () => {
  test("shows the hero with a search panel and a real WhatsApp CTA", async ({ page }) => {
    await page.goto("/realty-demo/");
    await expect(page.locator(".wf-realty-hero")).toBeVisible();
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();

    await expect(page.locator(".wf-realty-search")).toBeVisible();
    await expect(page.locator(".wf-realty-search select[name='zona']")).toBeVisible();

    const cta = page.locator(".wf-realty-hero a[href]").first();
    const href = await cta.getAttribute("href");
    expect(href).toContain("wa.me");
  });

  test("renders the wordmark break, listings with a featured card, process and zones", async ({ page }) => {
    await page.goto("/realty-demo/");
    await expect(page.locator(".wf-realty-wordmark")).toBeVisible();
    await expect(page.locator(".wf-realty-listing--featured")).toBeVisible();
    expect(await page.locator(".wf-realty-listing-card").count()).toBeGreaterThan(1);
    await expect(page.locator("#proceso")).toBeVisible();
    await expect(page.locator(".wf-realty-zone-chip").first()).toBeVisible();
  });

  test("keeps a persistent whatsapp cta", async ({ page }) => {
    await page.goto("/realty-demo/");
    const sticky = page.locator(".wf-sticky-cta");
    await expect(sticky).toBeVisible();
    const href = await sticky.getAttribute("href");
    expect(href).toContain("wa.me");
  });

  test("no broken same-origin assets", async ({ page }) => {
    const failed: string[] = [];
    page.on("requestfailed", (request) => {
      const kind = request.resourceType();
      if (kind === "image" || kind === "stylesheet") failed.push(`${kind} ${request.url()}`);
    });
    const response = await page.goto("/realty-demo/");
    expect(response?.ok()).toBeTruthy();
    await page.waitForLoadState("networkidle");
    expect(failed, `broken assets: ${failed.join(", ")}`).toEqual([]);
  });
});
