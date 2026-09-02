import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { viewportOnce } from "./tokens";

/**
 * Un reveal no puede dejar contenido invisible EN PANTALLA.
 *
 * `whileInView` de motion dispara segun `viewport.amount`, y ese numero se mide
 * sobre el ALTO DEL ELEMENTO, no sobre lo que se ve. Con una fraccion, un
 * bloque alto que asoma por abajo puede estar dentro de la pantalla y no llegar
 * nunca al umbral: se queda en `opacity: 0` hasta que el visitante scrollee, y
 * si el bloque es mas alto que ~1/amount pantallas, para siempre.
 *
 * Ya mordio DOS veces en este repo, las dos en la superficie de venta:
 *   1. `/servicios/webs`: el punto de compra (~5.000px a 390 de ancho) quedaba
 *      invisible. Se parcheo achicando ESE Reveal — la causa quedo viva aca.
 *   2. `onia.com.bo/`, medido el 2026-09-02 con Playwright a tamanos reales de
 *      telefono: el panel del dia (512px de alto) asoma 148px en la primera
 *      pantalla de un iPhone 12-16 (390x844) = 29%, contra un umbral de 30%.
 *      La home —la PRIMERA pantalla que ve un lead que llega por WhatsApp—
 *      abria con una franja de 148px en blanco. En Galaxy S20/S23 (360x800),
 *      53px. A 393x852 y mas alto entraba justo al 35% y se veia bien, que es
 *      por que ninguna revision a 1440x900 lo agarro nunca.
 *
 * Arreglar la instancia y dejar la causa es como llego de una pagina a la home.
 * Por eso el guard es sobre el TOKEN: la invariante es "nada que toque la
 * pantalla queda invisible", y con una fraccion no se cumple para bloques
 * altos. Con "some" (cualquier pixel dentro) se cumple por definicion.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));

describe("viewportOnce — nada que toque la pantalla queda invisible", () => {
  it("no usa una fraccion como umbral: se mide sobre el alto del elemento", () => {
    expect(
      typeof viewportOnce.amount,
      'viewport.amount volvio a ser un numero. Una fraccion deja bloques altos en opacity 0 dentro de la pantalla — paso en onia.com.bo/ a 390x844 (148px en blanco en la primera pantalla del telefono). Usar "some".',
    ).toBe("string");
    expect(viewportOnce.amount).toBe("some");
  });

  it("anima una sola vez: re-animar en cada scroll marea", () => {
    expect(viewportOnce.once).toBe(true);
  });

  /*
   * El token no sirve de nada si un componente se escribe su propio umbral al
   * lado. Se mira SOLO el `viewport={{…}}` de `whileInView`, que es la clase
   * que esconde: el elemento arranca en `opacity: 0` y el umbral decide si
   * alguna vez vuelve. `useInView(ref, {amount})` NO entra —lo usan `CountUp`
   * y `AgentScene`, que renderizan su contenido igual (CountUp incluso sirve
   * el valor final desde el server) y solo demoran una animacion de pasos.
   *
   * Excepcion por nombre: `stagger-grid.tsx` con `once: false` es de
   * `landing-v1/`, el archivo de la web publicada hasta el 2026-08-21 (noindex
   * + disallow). Vuelve a disparar en cada pasada, asi que no deja nada
   * colgado, y ese archivo se conserva tal cual se publico.
   */
  it("ningun whileInView se escribe su propio amount fraccionario", () => {
    const infractores: string[] = [];
    for (const archivo of readdirSync(AQUI)) {
      if (!archivo.endsWith(".tsx")) continue;
      const lineas = readFileSync(join(AQUI, archivo), "utf8").split("\n");
      lineas.forEach((linea, i) => {
        if (!/viewport=\{/.test(linea)) return;
        const m = linea.match(/amount:\s*(0?\.\d+|1(?:\.0+)?)\b/);
        if (!m) return;
        if (archivo === "stagger-grid.tsx" && /once:\s*false/.test(linea)) return;
        infractores.push(`${archivo}:${i + 1} → amount: ${m[1]}`);
      });
    }
    expect(
      infractores,
      `Umbral fraccionario suelto: ${infractores.join(", ")}. Se mide sobre el alto del elemento y deja bloques altos invisibles dentro de la pantalla. Usar viewportOnce.`,
    ).toEqual([]);
  });
});
