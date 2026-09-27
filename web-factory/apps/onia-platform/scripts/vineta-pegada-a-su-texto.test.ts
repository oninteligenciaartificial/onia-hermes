import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  TOPE_HUECO,
  declaraSuAlineacion,
  fallasDeVinetaSuelta,
} from "./vineta-pegada-a-su-texto.mjs";

/**
 * El self-check del gate de la viñeta suelta.
 *
 * El SINTOMA (cuánto aire hay entre el punto y su texto) sólo se mide con un navegador, así
 * que eso corre como alias suelto contra producción. Acá viven las dos mitades que SI
 * entran a `npm test`, y cada una tapa una forma distinta de que esto vuelva:
 *
 *  1. el CRITERIO — dado lo que se vio, ¿acusa lo que tiene que acusar y calla lo sano?
 *     Un gate que sólo sabe decir "verde" es indistinguible de uno que no mide.
 *  2. la CAUSA en el disco — que `.planList` siga DECLARANDO su alineación. Si alguien borra
 *     esa línea, el envoltorio centrado de la portada vuelve a decidir por la lista y el
 *     defecto renace sin que nadie abra un navegador. Este caso lo pone rojo en el build.
 */
describe("la viñeta pegada a su texto", () => {
  const sano = [
    { ruta: "/precios", texto: "Fichas, caja y cobros", align: "start", hueco: -1 },
    { ruta: "/chatbot", texto: "Contesta al instante", align: "start", hueco: 0.4 },
  ];

  it("calla cuando el texto arranca donde arranca su columna", () => {
    expect(fallasDeVinetaSuelta(sano)).toEqual([]);
  });

  /**
   * El defecto REAL del 2026-09-27, con sus números medidos en producción. Si el criterio se
   * afloja, este caso deja de acusar y el gate se vuelve decorativo.
   */
  it("acusa el defecto que lo hizo nacer, con el renglón peor y su hueco", () => {
    const fallas = fallasDeVinetaSuelta([
      ...sano,
      { ruta: "/", texto: "Todo lo del Básico", align: "center", hueco: 73 },
      { ruta: "/", texto: "Todo lo del Crece", align: "center", hueco: 76 },
      { ruta: "/", texto: "Exportás tus datos en CSV", align: "center", hueco: 17 },
    ]);
    expect(fallas).toHaveLength(1);
    expect(fallas[0]).toContain("/:");
    expect(fallas[0]).toContain("3 viñeta(s)");
    expect(fallas[0]).toContain("Todo lo del Crece");
    expect(fallas[0]).toContain("76px");
  });

  /**
   * Un negativo chico es SANO: el primer glifo monta sobre el borde de su columna y las
   * columnas en `em` caen en fracciones de pixel. Las dos pantallas sanas medidas dan −1.
   * Sin este caso, alguien "endurece" el tope a 0 y las 116 viñetas buenas se ponen rojas.
   */
  it("no confunde un sub-pixel con una viñeta suelta", () => {
    expect(fallasDeVinetaSuelta([{ ruta: "/", texto: "x", align: "start", hueco: -1.4 }])).toEqual([]);
    expect(fallasDeVinetaSuelta([{ ruta: "/", texto: "x", align: "start", hueco: TOPE_HUECO }])).toEqual([]);
    expect(
      fallasDeVinetaSuelta([{ ruta: "/", texto: "x", align: "center", hueco: TOPE_HUECO + 0.1 }]),
    ).toHaveLength(1);
  });

  it("agrupa por pantalla: un ítem por ruta, no uno por renglón", () => {
    const fallas = fallasDeVinetaSuelta([
      { ruta: "/", texto: "a", align: "center", hueco: 40 },
      { ruta: "/", texto: "b", align: "center", hueco: 50 },
      { ruta: "/empezar", texto: "c", align: "center", hueco: 30 },
    ]);
    expect(fallas.map((f) => f.split(":")[0])).toEqual(["/", "/empezar"]);
  });

  it("ignora lo que no pudo medirse en vez de darlo por sano o por roto", () => {
    expect(fallasDeVinetaSuelta([{ ruta: "/", texto: "x", align: "center", hueco: NaN }])).toEqual([]);
  });

  describe("la causa, leída del disco", () => {
    const css = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "..", "src", "app", "(sitio)", "sitio.module.css"),
      "utf8",
    );

    it("`.planList` declara su alineación y no la hereda del envoltorio", () => {
      const r = declaraSuAlineacion(css, ".planList");
      expect(r.declarada, r.motivo).toBe(true);
    });

    it("la lista sigue reservando una columna para el marcador (si no, esto ya no aplica)", () => {
      expect(css).toContain("grid-template-columns: 1.1em 1fr");
    });

    it("sabe decir que NO cuando la declaración no está", () => {
      expect(declaraSuAlineacion(".planList {\n  display: grid;\n}", ".planList").declarada).toBe(false);
      expect(declaraSuAlineacion(".otra { text-align: left; }", ".planList").declarada).toBe(false);
      expect(declaraSuAlineacion(".planList {\n  text-align: center;\n}", ".planList").declarada).toBe(false);
    });

    /**
     * Se ganó su caso solo: la primera versión partía el bloque por la primera `}` del
     * archivo crudo, y el comentario de esa misma regla nombra su gate como
     * `vineta-pegada-a-su-texto.{mjs,test.ts}` — esa llave cerraba el bloque en la
     * EXPLICACIÓN y dejaba la declaración afuera. Rojo por el motivo equivocado, que es
     * un verde futuro: si se lee la prosa en vez del código, cualquier cosa puede pasar.
     */
    it("no corta el bloque en una llave que estaba dentro de un comentario", () => {
      const conLlaveEnProsa = `.planList {\n  /* gate: vineta.{mjs,test.ts} */\n  text-align: left;\n}`;
      expect(declaraSuAlineacion(conLlaveEnProsa, ".planList").declarada).toBe(true);
      const soloEnProsa = `.planList {\n  /* antes decía text-align: left */\n  display: grid;\n}`;
      expect(declaraSuAlineacion(soloEnProsa, ".planList").declarada).toBe(false);
    });
  });
});
