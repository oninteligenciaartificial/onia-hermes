import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  CHATBOT_SITIO,
  CIFRAS,
  PRECIOS_SITIO,
  cifrasDelProducto,
  cifrasDelSitio,
  comparar,
  planesDelProducto,
  planesDelSitio,
} from "./precios-fuente.mjs";

/**
 * El guard de `precios-fuente.mjs`, el cruce que compara lo que el sitio
 * PUBLICA contra lo que el producto COBRA.
 *
 * Este archivo NO mide precios: los mide el script, contra el repo del producto,
 * cada vuelta. Acá se vigila lo único que puede dejar ciego a ese cruce sin que
 * nada se ponga rojo — **que sus patrones dejen de leer el lado del sitio**.
 *
 * Es la trampa de esta familia y en este carril ya costó cuatro veces: un gate
 * que no encuentra a su sujeto no grita, se calla. Si mañana alguien renombra
 * `mensualAddon` o convierte `PLANES` en otra forma, el script pasaría a leer
 * `null` de ese lado y —de no ser por su guarda de ilegibles— cantaría "ninguna
 * cifra difiere". Acá se ancla el parser a los archivos REALES del sitio: el
 * refactor rompe este test, que corre en `prebuild`, antes de romper el cruce.
 *
 * El lado del producto no se puede anclar igual: vive en otro repo
 * (`/root/loops/onia-platform`) que no está en este worktree, y exigirlo pondría
 * rojo por AMBIENTE toda máquina que no lo tenga. Se prueba con fixtures que
 * copian su forma literal.
 */

/** `precios-fuente.mjs` es JS: los mapas llegan sin firma de índice. */
type Cifras = Record<string, number | string | null | undefined>;
type Planes = Record<
  string,
  { mensual: number | null; semanal: number | null; anual: number | null }
>;

describe("el cruce lee de verdad el lado del SITIO", () => {
  const delSitio: Cifras = cifrasDelSitio({
    precios: readFileSync(PRECIOS_SITIO, "utf8"),
    chatbot: readFileSync(CHATBOT_SITIO, "utf8"),
  });

  it("encuentra las 18 cifras en los archivos vivos del sitio", () => {
    const ilegibles = CIFRAS.filter((c) => delSitio[c] === null);
    expect(
      ilegibles,
      `No pude leer estas cifras de ${PRECIOS_SITIO} / ${CHATBOT_SITIO}. ` +
        `Si acabás de renombrar una constante o cambiar la forma de PLANES, ` +
        `actualizá los patrones de precios-fuente.mjs: sin eso el cruce contra ` +
        `el producto queda ciego justo en esa cifra.`,
    ).toEqual([]);
  });

  it("los tres planes salen del array PLANES, no de un literal suelto", () => {
    const planes = planesDelSitio(readFileSync(PRECIOS_SITIO, "utf8")) as Planes;
    expect(Object.keys(planes).sort()).toEqual(["basico", "full", "pro"]);
    // El Full no se fracciona: si algún día tuviera semanal, el cruce lo compara igual.
    expect(planes.full.semanal).toBeNull();
    for (const p of Object.values(planes)) {
      expect(p.mensual).toBeGreaterThan(0);
      expect(p.anual).toBeGreaterThan(0);
    }
  });
});

describe("el cruce lee la forma literal del PRODUCTO", () => {
  /** Copia textual de `onia-platform/lib/subscription-plans.ts`. */
  const PLANES_FIXTURE = `
export const DEFAULT_PLAN_AMOUNTS: Record<SubscriptionPlan, PlanPriceTable> = {
  basic: { monthly: 320, weekly: 89, annual: 3200 },
  professional: { monthly: 750, weekly: 199, annual: 7500 },
  clinic: { monthly: 1500, annual: 15000 },
  enterprise: { monthly: 2900, annual: 29000 },
};
`;

  it("saca los cuatro planes con sus tres ciclos", () => {
    const p = planesDelProducto(PLANES_FIXTURE) as Planes;
    expect(p.basic).toEqual({ mensual: 320, semanal: 89, anual: 3200 });
    // `clinic` no declara semanal: ausente es `null`, no un cero que compare mal.
    expect(p.clinic).toEqual({ mensual: 1500, semanal: null, anual: 15000 });
    expect(p.enterprise.mensual).toBe(2900);
  });
});

describe("el veredicto", () => {
  const iguales = { "plan Básico · mensual": 320, "add-on chatbot · mensual": 390 };

  it("difieren nombra la cifra, no sólo que algo cambió", () => {
    const { difieren, ilegibles } = comparar(
      { ...iguales, "plan Básico · mensual": 350 },
      iguales,
    );
    expect(ilegibles).toContain("plan Pro · mensual"); // las que no vinieron
    expect(difieren).toContainEqual({
      cifra: "plan Básico · mensual",
      producto: 350,
      sitio: 320,
    });
  });

  it("una cifra ilegible NO se cuenta como coincidencia", () => {
    // Es el modo de fallo caro: sin esto, un parser roto se lee como sitio sano.
    const { difieren, ilegibles } = comparar(
      { "plan Básico · mensual": null },
      { "plan Básico · mensual": 320 },
    );
    expect(difieren).toEqual([]);
    expect(ilegibles).toContain("plan Básico · mensual");
  });

  it("con las dos fuentes vacías nada se declara coincidente", () => {
    const vacio = cifrasDelProducto({ planes: "", addons: "", prueba: "" });
    const { difieren, ilegibles } = comparar(vacio, vacio);
    expect(difieren).toEqual([]);
    expect(ilegibles).toEqual(CIFRAS);
  });
});
