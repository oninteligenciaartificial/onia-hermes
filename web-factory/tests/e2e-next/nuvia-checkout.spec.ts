import { expect, test } from "@playwright/test";

const PRODUCT_ID = "isdin-fusion-water-magic-spf-50";

test.describe("Nuvia checkout", () => {
  test.beforeEach(async ({ page }) => {
    // Evita que el popup de WhatsApp navegue fuera durante el test.
    await page.addInitScript(() => {
      window.open = () => null;
    });
  });

  test("captura datos y arma el link de WhatsApp con el marcador Nuvia", async ({ page }) => {
    // Sembrar el carrito directamente en localStorage (determinista).
    await page.goto("/nuvia");
    await page.evaluate((id) => {
      window.localStorage.setItem("nuvia-next-cart-v1", JSON.stringify([{ id, qty: 2 }]));
    }, PRODUCT_ID);

    await page.goto("/nuvia/checkout");

    // El resumen muestra un total de productos.
    await expect(page.getByText("Total productos")).toBeVisible();

    // Completar el formulario.
    await page.getByLabel("Nombre completo").fill("Ana Perez");
    await page.getByLabel("Teléfono / WhatsApp").fill("70000000");
    await page.getByLabel("Dirección exacta").fill("Av. San Martin 123, Equipetrol");

    await page.getByRole("button", { name: /enviar pedido por whatsapp/i }).click();

    // Confirmación con link de WhatsApp al número configurado y el marcador.
    const waLink = page.getByTestId("nuvia-wa-link");
    await expect(waLink).toBeVisible();
    const href = await waLink.getAttribute("href");
    expect(href).toContain("wa.me/59175470140");
    expect(href).toContain("%23NuviaPedido");
  });

  test("muestra estado vacío sin carrito", async ({ page }) => {
    await page.goto("/nuvia");
    await page.evaluate(() => window.localStorage.removeItem("nuvia-next-cart-v1"));
    await page.goto("/nuvia/checkout");
    await expect(page.getByText("Tu carrito está vacío")).toBeVisible();
  });
});
