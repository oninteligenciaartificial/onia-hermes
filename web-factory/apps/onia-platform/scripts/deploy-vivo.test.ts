import { describe, expect, it } from "vitest";

import {
  AL_DIA,
  ARREGLOS_VARADOS,
  NO_PUDE_MEDIR,
  ZONA,
  diagnosticar,
} from "./deploy-vivo.mjs";

/**
 * El gate del gate: que `deploy-vivo.mjs` no pueda fallar ABIERTO.
 *
 * Todo lo que este archivo comprueba nace del mismo suceso, medido el
 * 2026-09-04: los cuatro números del objetivo de este carril daban verde
 * —prohibidos 0, precios fuera de fuente 0, CTA rotos 0, favicon 200— mientras
 * SEIS arreglos ya mergeados a `main` no llegaban al cliente. Entre ellos, los
 * nueve botones «Creá tu cuenta» que seguían abriendo otra página de venta.
 *
 * El termómetro era el favicon, y el favicon no puede detectar esto: una vez
 * que un deploy lo trae, da 200 para siempre. Queda clavado en verde y firma
 * "el deploy está al día" sobre un sitio de ocho horas de antigüedad.
 */
describe("deploy-vivo: el diagnóstico", () => {
  /**
   * Las dos entradas vienen en unidades distintas —git da segundos, `statSync`
   * da milisegundos— y confundirlas invierte el veredicto en silencio. Se
   * escriben con nombre para que el test no pueda mentir por un factor de mil.
   */
  const seg = (s: number) => s;
  const ms = (s: number) => s * 1000;
  const commit = (ct: number, subject = "fix: algo") => ({
    sha: `sha${ct}`,
    ct,
    subject,
  });

  it("da ROJO cuando main tiene commits de la zona posteriores al build vivo", () => {
    const r = diagnosticar({
      buildIdMtimeMs: ms(1_000),
      commits: [commit(seg(2_000), "fix: el CTA no creaba la cuenta")],
      homeStatus: 200,
    });

    expect(r.codigo).toBe(ARREGLOS_VARADOS);
    expect(r.varados).toHaveLength(1);
    expect(r.varados[0].subject).toContain("CTA");
  });

  it("da VERDE cuando el build vivo es posterior a todo commit de la zona", () => {
    const r = diagnosticar({
      buildIdMtimeMs: ms(3_000),
      commits: [commit(seg(1_000)), commit(seg(2_000))],
      homeStatus: 200,
    });

    expect(r.codigo).toBe(AL_DIA);
    expect(r.varados).toHaveLength(0);
  });

  /**
   * El modo de fallo que este gate existe para no repetir. Cada rama que no
   * puede medir tiene que salir por NO_PUDE_MEDIR, nunca por AL_DIA: un gate
   * que no corrió no es un gate que pasó.
   */
  describe("no puede fallar en verde", () => {
    it("sin fecha del build vivo NO dice «al día»", () => {
      const r = diagnosticar({
        buildIdMtimeMs: null,
        commits: [],
        homeStatus: 200,
      });
      expect(r.codigo).toBe(NO_PUDE_MEDIR);
      expect(r.codigo).not.toBe(AL_DIA);
    });

    it("sin respuesta de git NO dice «al día»", () => {
      const r = diagnosticar({
        buildIdMtimeMs: ms(1_000),
        commits: null,
        homeStatus: 200,
      });
      expect(r.codigo).toBe(NO_PUDE_MEDIR);
    });

    it("si la home no responde 200 NO dice «al día»", () => {
      const r = diagnosticar({
        buildIdMtimeMs: ms(3_000),
        commits: [commit(seg(1_000))],
        homeStatus: 502,
      });
      expect(r.codigo).toBe(NO_PUDE_MEDIR);
    });

    /**
     * Un `git log` vacío tiene DOS causas opuestas —no hay nada varado, o el
     * comando falló— y confundirlas es exactamente cómo esta familia de gates
     * se rinde en verde. Por eso la lista vacía sólo vale si el llamador la
     * midió: `[]` es un dato, `null` es la ausencia de dato.
     */
    it("distingue «cero varados» de «no pude preguntar»", () => {
      expect(
        diagnosticar({ buildIdMtimeMs: ms(9), commits: [], homeStatus: 200 })
          .codigo,
      ).toBe(AL_DIA);
      expect(
        diagnosticar({ buildIdMtimeMs: ms(9), commits: null, homeStatus: 200 })
          .codigo,
      ).toBe(NO_PUDE_MEDIR);
    });
  });

  /**
   * El empate importa: `next build` escribe el BUILD_ID cuando TERMINA, así que
   * un commit con el mismo segundo ya está adentro. Tratarlo como varado haría
   * pedir un deploy que no hace falta — y un pedido de deploy inventado le
   * llega a Sergio igual que uno real.
   */
  it("un commit del mismo segundo que el build NO está varado", () => {
    const r = diagnosticar({
      buildIdMtimeMs: ms(5_000),
      commits: [commit(seg(5_000))],
      homeStatus: 200,
    });
    expect(r.codigo).toBe(AL_DIA);
  });
});

/**
 * El ancla contra el recorte del árbol. Ya pasó dos veces en este carril con
 * otros gates: la cobertura se declara con una lista de raíces escritas a mano
 * y el día que algo queda fuera de esa lista, deja de tener gate sin que nada
 * se ponga rojo. Acá la zona es UNA y es la del carril entera.
 */
describe("deploy-vivo: la zona que vigila", () => {
  it("vigila la app completa, no una lista de subcarpetas", () => {
    expect(ZONA).toBe("web-factory/apps/onia-platform");
  });
});
