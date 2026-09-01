import { describe, expect, it } from "vitest";

import { clinicCss } from "./clinic-css.js";

/**
 * A7 midio que `.wf-hover-lift` estaba en CERO uso real: su CSS solo viajaba en
 * logistics/realestate, que no dibujan tarjetas, y la pagina que SI las dibuja
 * (clinic) no lo emitia. Cablear la clase ahi habria agregado un atributo inerte
 * sobre una tarjeta que YA se levanta sola. Lo unico que la primitiva traia y a
 * la tarjeta le faltaba era su PUERTA: neutralizar el hover bajo reduced-motion.
 * A8 borro la primitiva por eso mismo, asi que este test es hoy el UNICO lugar
 * que guarda esa puerta -- no busques `.wf-hover-lift` en motion.ts, ya no esta.
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
