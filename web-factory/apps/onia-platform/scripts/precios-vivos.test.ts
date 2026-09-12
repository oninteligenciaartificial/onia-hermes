import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { superficiesDeVenta } from "./rutas-de-venta.mjs";

/**
 * QUÉ CUIDA: que el medidor de precios vivos mire TODAS las pantallas donde un lead
 * puede leer un precio, y no una sola.
 *
 * POR QUÉ EXISTE, con el caso que lo originó. El 2026-09-12, a las 02:48 La Paz,
 * `npm run precios:vivos` dio ROJO por **un** monto (Bs 199) y ese rojo se leyó como
 * el diagnóstico completo. No lo era: al mismo tiempo `onia.com.bo/precios` servía
 * **Bs 750 y Bs 1.500** —la escalera vieja, retirada el mismo día— y la portada
 * servía **Bs 15.000**, y el medidor no los vio **nunca**, porque sólo recorre el
 * cuestionario de `/v1/empezar`. La pantalla que un lead abre para ver cuánto cuesta
 * el producto estaba fuera del único gate que mide precios contra producción.
 *
 * Dicho de otra manera: el carril venía reportando «precios fuera de fuente: 0» con
 * la pantalla de precios sin mirar. El verde era cierto sobre una pantalla y se
 * estaba leyendo como cierto sobre el sitio.
 *
 * LA CURA YA EXISTÍA EN EL GEMELO, y es lo que hace a esta familia sobrevivir:
 * `enlaces-vivos.mjs` deriva sus rutas del DISCO desde el 2026-09-05, con su motivo
 * escrito, y esa cura nunca viajó hasta acá. Por eso la derivación vive ahora en
 * `rutas-de-venta.mjs` —una sola fuente, con su lista de exentas nombradas una por
 * una— y los dos medidores la importan.
 *
 * LA INVARIANTE, y por qué está escrita contra la SALIDA del script y no contra su
 * texto: no alcanza con que el archivo importe el símbolo —un `import` sin usar deja
 * el gate igual de ciego y el test igual de verde—. Lo que se le exige es que el
 * medidor, preguntado, ENUMERE las pantallas que va a mirar, y que `/precios` esté
 * entre ellas. Corre en proceso hijo y sin red: `--solo-listar` imprime y sale antes
 * de abrir el navegador.
 */

const AQUI = new URL(".", import.meta.url).pathname;

/**
 * Anclas por literal, no derivadas de la misma función que se está midiendo: si el
 * universo se calculara mal, una comparación `f() ⊆ f()` seguiría en verde. Son las
 * pantallas donde HOY hay un precio impreso en producción, medidas con curl el
 * 2026-09-12: la portada (7.500 · 3.900 · 320), `/precios` (750 · 1.500 · 199 · 89),
 * `/chatbot` (390 · 190) y la de webs.
 */
const PANTALLAS_CON_PRECIO = ["/", "/precios", "/chatbot", "/servicios/webs", "/v1/precios"];

describe("precios-vivos mira todas las superficies de precio", () => {
  it("el universo de venta incluye cada pantalla que hoy imprime un precio", () => {
    const rutas = superficiesDeVenta();
    for (const r of PANTALLAS_CON_PRECIO) {
      expect(rutas, `${r} publica un precio y quedó fuera del universo de venta`).toContain(r);
    }
  });

  it("el universo sale del disco: si no hay sujetos, el gate no puede dar verde", () => {
    // Un barrido de cero pantallas aprueba cualquier cosa. Es el modo de falla de
    // esta familia, y el más silencioso: sale 0 sin mirar nada.
    expect(superficiesDeVenta().length).toBeGreaterThan(10);
  });

  it("el medidor enumera esas pantallas cuando se le pregunta", () => {
    // El producto, no su fuente: se ejecuta y se lee lo que dice que va a mirar.
    const salida = execFileSync("node", [`${AQUI}precios-vivos.mjs`, "--solo-listar"], {
      encoding: "utf8",
      timeout: 60_000,
    });
    const enumeradas = salida
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("/"));

    for (const r of PANTALLAS_CON_PRECIO) {
      expect(
        enumeradas,
        `el medidor no mira ${r}, donde producción imprime precios: un rojo suyo no cubre esa pantalla y su verde tampoco`,
      ).toContain(r);
    }
  });

  it("el recorrido del cuestionario sigue siendo parte de la medición", () => {
    // La superficie que ESTE script existía para cubrir —el precio pintado del lado
    // del cliente al terminar el cuestionario— no se pierde al sumarle el barrido:
    // no está en el HTML servido y ningún curl la ve.
    const fuente = readFileSync(`${AQUI}precios-vivos.mjs`, "utf8");
    expect(fuente).toContain("/v1/empezar");
  });
});
