import { expect, test } from "@playwright/test";

test.describe("landing preview (demo)", () => {
  test("loads the hero with a heading and a real CTA", async ({ page }) => {
    await page.goto("/demo/");

    const hero = page.locator(".wf-hero");
    await expect(hero).toBeVisible();

    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();

    // Primary CTA must point at a real channel, not "#".
    const cta = page.locator(".wf-hero a[href]").first();
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute("href");
    expect(href, "hero CTA should target a real destination").toBeTruthy();
    expect(href).not.toBe("#");
  });

  test("ships a stylesheet and no broken same-origin assets", async ({ page }) => {
    const failed: string[] = [];
    page.on("requestfailed", (request) => {
      const kind = request.resourceType();
      if (kind === "image" || kind === "stylesheet") {
        failed.push(`${kind} ${request.url()}`);
      }
    });

    const response = await page.goto("/demo/");
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(1);

    // Give lazy assets a beat to resolve, then assert none failed.
    await page.waitForLoadState("networkidle");
    expect(failed, `broken assets: ${failed.join(", ")}`).toEqual([]);
  });
});
