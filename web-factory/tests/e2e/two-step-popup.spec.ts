import { expect, test } from "@playwright/test";

const URL = "/blocks-demo/popup.html";

/**
 * El popup de 2 pasos, contra el banco de pruebas que emite `pnpm blocks:demo`
 * (packages/blocks/demo.ts → out/blocks-demo/popup.html): ahi el dialogo esta
 * CERRADO y con su runtime, como en produccion — la galeria lo muestra abierto
 * y en flujo, que sirve para verlo y no prueba nada.
 *
 * Lo que se guarda aca es lo que hace que el bloque valga: que el paso 1 GUARDE
 * la respuesta (sin eso es un popup de email con un clic extra de friccion), que
 * la atribucion sobreviva, y que el teclado pueda entrar y salir.
 */

/** El disparo es por scroll: sin esto el popup no existe para el test. */
async function abrir(page: import("@playwright/test").Page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator("dialog#oferta")).toHaveAttribute("open", "");
}

test.describe("two-step-popup", () => {
  test("no aparece al cargar: dispara recien al 40% del scroll", async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator("dialog#oferta")).not.toHaveAttribute("open", "");
    await abrir(page);
  });

  test("paso 1 pide un CLIC, no datos, y el clic guarda la respuesta", async ({ page }) => {
    await page.goto(URL);
    await abrir(page);

    // El paso 1 no tiene un solo campo de texto: ese es el punto entero.
    const paso1 = page.locator('[data-wf-pop-panel="1"]');
    await expect(paso1).toBeVisible();
    await expect(paso1.locator("input, textarea")).toHaveCount(0);
    await expect(paso1.locator("button[data-wf-pop-value]")).toHaveCount(2);

    await page.locator('button[data-wf-pop-value="para-mi-negocio"]').click();

    // La respuesta viaja con el lead. Sin esto no hay personalizacion posible.
    await expect(page.locator("[data-wf-pop-answer]")).toHaveValue("para-mi-negocio");
    await expect(page.locator('[data-wf-pop-panel="2"]')).toBeVisible();
    await expect(page.locator('[data-wf-pop-panel="1"]')).toBeHidden();
    await expect(page.locator("[data-wf-pop-chosen]")).toContainText("Para mi negocio");
  });

  test("paso 2 pide WhatsApp (no SMS) y el foco cae en el campo", async ({ page }) => {
    await page.goto(URL);
    await abrir(page);
    await page.locator('button[data-wf-pop-value="para-mi"]').click();

    const wa = page.locator('input[name="whatsapp"]');
    await expect(wa).toBeFocused();
    await expect(wa).toHaveAttribute("type", "tel");
    await expect(wa).toHaveAttribute("required", "");
    // El correo existe pero no bloquea: dos campos obligatorios tiran abajo el paso 1.
    await expect(page.locator('input[name="email"]')).not.toHaveAttribute("required", "");
  });

  test("el ?src= de la campana pisa la atribucion del bloque", async ({ page }) => {
    await page.goto(`${URL}?src=reel-oferta-01`);
    await abrir(page);
    await expect(page.locator("[data-wf-pop-src]")).toHaveValue("reel-oferta-01");
  });

  test("teclado: Tab llega a las opciones, Enter avanza, Escape cierra", async ({ page }) => {
    await page.goto(URL);
    await abrir(page);

    // showModal() atrapa el foco: el enlace del fondo NUNCA se alcanza tabulando.
    // (Chromium pasa por <body> al dar la vuelta al ciclo — eso no es escaparse;
    // lo que importa es que ningun control de la pagina de atras reciba el foco.)
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press("Tab");
      const foco = await page.evaluate(() => document.activeElement?.id ?? "");
      expect(foco).not.toBe("fondo");
    }

    await page.locator('button[data-wf-pop-value="para-mi"]').focus();
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-wf-pop-panel="2"]')).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("dialog#oferta")).not.toHaveAttribute("open", "");
  });

  test("descartado no vuelve a molestar en la misma visita", async ({ page }) => {
    await page.goto(URL);
    await abrir(page);
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog#oferta")).not.toHaveAttribute("open", "");
    // El descarte queda guardado ANTES de que se pueda navegar: por eso se
    // escribe en 'cancel' (sincrono) y no solo en 'close' (tarea encolada).
    expect(await page.evaluate(() => localStorage.getItem("wf-pop:oferta"))).toBeTruthy();

    await page.reload();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    await expect(page.locator("dialog#oferta")).not.toHaveAttribute("open", "");
  });

  test("lector de pantalla: el dialogo se anuncia y cada opcion dice que elige", async ({ page }) => {
    await page.goto(URL);
    await abrir(page);

    const dlg = page.locator("dialog#oferta");
    const titleId = await dlg.getAttribute("aria-labelledby");
    await expect(page.locator(`#${titleId}`)).toContainText("10%");

    // Sin aria-label, "Para mi" fuera de contexto no dice nada.
    for (const opcion of await page.locator("button[data-wf-pop-value]").all()) {
      await expect(opcion).toHaveAttribute("aria-label", /Que estas buscando/);
    }
    await expect(page.locator("[data-wf-pop-close]").first()).toHaveAttribute("aria-label", "Cerrar");
    await expect(page.locator("#oferta-step")).toHaveAttribute("aria-live", "polite");
  });

  test("reduced-motion: el dialogo se ve, no queda en opacity 0 capturando clics", async ({
    browser,
  }) => {
    // La trampa que ya pagamos: con transition-duration .01ms las propiedades
    // discretas siguen animando y el dialogo queda abierto e INVISIBLE.
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.goto(URL);
    await abrir(page);

    const card = page.locator(".wf-pop-card");
    await expect(card).toBeVisible();
    const opacidad = await card.evaluate((el) => getComputedStyle(el.parentElement!).opacity);
    expect(Number(opacidad)).toBe(1);
    await page.close();
  });
});
