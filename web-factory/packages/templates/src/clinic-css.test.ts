import { describe, expect, it } from "vitest";

import { clinicCss } from "./clinic-css.js";

/**
 * A7 midio que `.wf-hover-lift` (packages/blocks/src/motion.ts) esta en CERO uso
 * real: su CSS solo viaja en logistics/realestate, que no dibujan tarjetas, y la
 * pagina que SI las dibuja (clinic) no lo emite. Cablear la clase ahi habria
 * agregado un atributo inerte sobre una tarjeta que YA se levanta sola.
 * Lo que la primitiva si traia y a la tarjeta le faltaba es su PUERTA:
 * `.wf-hover-lift:hover{transform:none}` bajo reduced-motion (motion.ts:77).
 */
describe("clinicCss y prefers-reduced-motion", () => {
  it("apaga el desplazamiento de la tarjeta, sin apagar el borde ni la sombra", () => {
    const reduce = clinicCss.slice(clinicCss.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reduce).toContain(".wf-clinic-card:hover { transform: none; }");
    // el hover pleno sigue existiendo: la puerta quita el movimiento, no la respuesta
    expect(clinicCss).toContain("transform: translateY(-4px)");
  });

  it("ningun :hover mueve algo sin puerta de reduced-motion", () => {
    // El gate que hace imposible saltearlo: cualquier :hover nuevo con translate
    // cae aca hasta que se lo neutralice o se lo meta en un no-preference.
    const conMovimiento = [...clinicCss.matchAll(/([^{}]*:hover[^{}]*)\{([^}]*)\}/g)]
      .filter(([, , cuerpo]) => /transform:\s*(translate|scale|rotate)/.test(cuerpo))
      .map(([, selector]) => selector.trim());
    expect(conMovimiento).toEqual([
      ".wf-clinic-card:hover",
      ".wf-clinic-btn:hover, .wf-clinic-nav-cta:hover, .wf-sticky-cta:hover",
    ]);
  });
});
