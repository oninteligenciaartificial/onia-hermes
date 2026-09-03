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
 *
 * LO QUE ESTA CAPTURA NO PUEDE VER: `fullPage` pinta los elementos `position:
 * sticky` en su posicion ESTATICA. Por eso el bloque oscuro de `.wf-dash-side`
 * termina a ~895px en la baseline y debajo queda fondo de pagina: en el
 * navegador la barra sigue pegada y tapa la ventana entera a cualquier scroll
 * (medido). Es un artefacto de la captura, no un defecto — se abrio como la
 * tarea A5 y resulto fantasma. Lo sticky se verifica MIDIENDO en el navegador
 * (`dashboard.spec.ts`, "el sidebar cubre la ventana tambien al pie"), porque
 * aca la baseline se ve igual con el sticky puesto que con el sticky roto.
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
          //
          // 400 tampoco alcanzaba (A10, 2026-09-02). A9 llevo 4 marcadores de
          // 5,03 a 8,05px de diametro y movio la polilinea de los 4 sparks: la
          // suite paso 8/8 EN VERDE sin tocar una baseline. Bajando el tope a 0
          // el gate reporto la cifra real, 81 a 184 pixeles por captura — o sea
          // que 400 era 2-5x mas grande que un cambio que casi duplica un
          // marcador. Un tope generoso sobre una captura fullPage no protege un
          // defecto LOCALIZADO: lo unico que caza es un corrimiento de toda la
          // pagina, que es contra lo que W6 lo habia validado (`PAD_L` 34->44).
          //
          // El piso se MIDIO, no se estimo: con las baselines al dia y el tope
          // en 0, cuatro corridas limpias seguidas dieron 8/8 verde — el ruido
          // real entre corridas es CERO, y el flap de alto 1840<->1839 que
          // anoto A10 no reaparecio (y de todos modos un alto distinto es un
          // size mismatch, que ningun presupuesto de pixeles tapa).
          // 20 deja aire para el antialiasing de un Chromium futuro y sigue 4x
          // por debajo del defecto real mas chico jamas medido aca (81px).
          // Verificado MUTANDO: con `dotR` de vuelta en 3 (el estado pre-A9) el
          // gate cae 8/8; con 400 pasaba en verde.
          maxDiffPixels: 20,
        });
      });
    }
  }
}
