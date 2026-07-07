import { expect, test } from "@playwright/test";

test.describe("landing-clinic preview (dental-demo)", () => {
  test("shows business, offer and a real booking CTA in the hero", async ({ page }) => {
    await page.goto("/dental-demo/");
    await expect(page.locator(".wf-clinic-hero")).toBeVisible();
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();

    const cta = page.locator(".wf-clinic-hero a[href]").first();
    const href = await cta.getAttribute("href");
    expect(href).toContain("wa.me");
  });

  test("renders trust, services, process and faq sections", async ({ page }) => {
    await page.goto("/dental-demo/");
    await expect(page.locator(".wf-clinic-strip")).toBeVisible();
    await expect(page.locator("#servicios")).toBeVisible();
    await expect(page.locator("#proceso")).toBeVisible();
    await expect(page.locator(".wf-clinic-faq-item").first()).toBeVisible();
  });

  test("keeps a persistent whatsapp cta", async ({ page }) => {
    await page.goto("/dental-demo/");
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
    const response = await page.goto("/dental-demo/");
    expect(response?.ok()).toBeTruthy();
    await page.waitForLoadState("networkidle");
    expect(failed, `broken assets: ${failed.join(", ")}`).toEqual([]);
  });
});
