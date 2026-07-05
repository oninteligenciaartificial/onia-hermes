import { expect, test } from "@playwright/test";

test.describe("store preview (skincare-demo)", () => {
  test("renders the catalog and a working add-to-cart flow", async ({ page }) => {
    await page.goto("/skincare-demo/");

    // Catalog: at least one product with an add-to-cart hook.
    const addButtons = page.locator("[data-cart-add]");
    await expect(addButtons.first()).toBeVisible();
    const productCount = await addButtons.count();
    expect(productCount).toBeGreaterThan(0);

    // Cart starts empty.
    const cartCount = page.locator("[data-cart-count]").first();
    await expect(cartCount).toHaveText("0");

    // Add the first product; the counter must increment.
    await addButtons.first().click();
    await expect(cartCount).toHaveText("1");

    // State must persist in localStorage (cart survives reloads).
    const stored = await page.evaluate(() =>
      Object.keys(window.localStorage).some((key) => key.toLowerCase().includes("cart")),
    );
    expect(stored, "cart state should be persisted to localStorage").toBe(true);

    await page.reload();
    await expect(page.locator("[data-cart-count]").first()).toHaveText("1");
  });

  test("navigates to a product detail page from the catalog", async ({ page }) => {
    await page.goto("/skincare-demo/");

    const productLink = page.locator('a[href*="productos/"]').first();
    await expect(productLink).toBeVisible();
    await productLink.click();

    await expect(page).toHaveURL(/productos\//);
    await expect(page.locator("h1")).toBeVisible();
    // Product page must also expose an add-to-cart action.
    await expect(page.locator("[data-cart-add]").first()).toBeVisible();
  });
});
