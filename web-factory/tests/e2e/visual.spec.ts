import { expect, test } from "@playwright/test";

/**
 * Gate visual del panel: compara el render contra una baseline commiteada.
 *
 * Por que existe: los diez defectos que W1-W5 arreglaron (la fuente que nunca
 * cargaba, la tarjeta invisible, el negativo aplastado contra el piso, el aire
 * muerto al pie, el skeleton con la forma equivocada) pasaban TODOS los gates en
 * verde. Los tests eran `toBeVisible` y `count > 0`: ninguno mira. Cada uno se
 * encontro abriendo una captura a mano, que es exactamente lo que un humano deja
 * de hacer despues de la tercera vuelta.
 *
 * Se corre sobre `dashboard-edge`, el fixture con los datos que rompen, ademas
 * del demo: una baseline de datos lindos no habria detectado ninguno de los
 * cuatro bugs de dato de W3.
 */

// reduce: los templates cortocircuitan reduced-motion al estado final, asi que
// la captura sale determinista Y con todo revelado. Sin esto, la mitad del panel
// se captura en `opacity: 0` — el defecto de metodo que anoto W7.
const PAGES = [
  { slug: "dashboard-demo", name: "panel (demo)" },
  { slug: "dashboard-edge", name: "panel (casos borde)" },
];

// 1440: el ancho de trabajo real del panel. 375: el mas chico que servimos.
const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "375", width: 375, height: 812 },
];

const SCHEMES = ["light", "dark"] as const;

for (const target of PAGES) {
  for (const viewport of VIEWPORTS) {
    for (const scheme of SCHEMES) {
      test(`visual: ${target.name} — ${viewport.name} — ${scheme}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
        await page.goto(`/${target.slug}/`);
        await page.waitForLoadState("networkidle");
        // Las familias vienen de Google Fonts: capturar antes de que resuelvan
        // deja el panel en la fuente del sistema y la baseline queda podrida.
        await page.evaluate(() => document.fonts.ready);

        await expect(page).toHaveScreenshot(`${target.slug}-${viewport.name}-${scheme}.png`, {
          fullPage: true,
          // Tope ABSOLUTO, no ratio. Con `maxDiffPixelRatio: 0.002` sobre una
          // captura fullPage de 1440x1700 el presupuesto era de ~4.900 pixeles:
          // suficiente para tragarse un marcador que duplica su radio (lo medi,
          // pasaba en verde). En absoluto, el ruido de antialiasing entra y un
          // elemento que cambia de tamanio, no.
          maxDiffPixels: 400,
        });
      });
    }
  }
}
