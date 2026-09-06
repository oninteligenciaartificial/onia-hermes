import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  CHATBOT_SITIO,
  CIFRAS,
  PRECIOS_SITIO,
  cifrasDelProducto,
  cifrasDelSitio,
  comparar,
  esPromesa,
  limitesDelProducto,
  limitesDelSitio,
  planesDelProducto,
  planesDelSitio,
  primerPlanCon,
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

  it("encuentra todas las cifras en los archivos vivos del sitio", () => {
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

describe("los TOPES y los TIERS del sitio (la mitad que no se cruzaba)", () => {
  const precios = readFileSync(PRECIOS_SITIO, "utf8");
  type Topes = Record<
    string,
    {
      fichas: number | null;
      usuarios: number | null;
      recordatorios: number | null;
      reservas: boolean | null;
    }
  >;

  it("lee los tres topes del Básico, que están escritos en prosa", () => {
    const l = limitesDelSitio(precios) as Topes;
    expect(l.basico.fichas).toBeGreaterThan(0);
    expect(l.basico.usuarios).toBeGreaterThan(0);
    expect(l.basico.recordatorios).toBeGreaterThan(0);
  });

  it('"ilimitado" se lee como -1, que es como lo escribe el producto', () => {
    // El Full no trae cifra ("Usuarios ilimitados"): sin este caso, el tope
    // saldría `null`, el cruce lo llamaría ilegible y taparía a los otros dos.
    const l = limitesDelSitio(precios) as Topes;
    expect(l.full.fichas).toBe(-1);
    expect(l.full.usuarios).toBe(-1);
    expect(l.full.recordatorios).toBe(-1);
  });

  it("lo que el plan NIEGA no cuenta como que lo incluye", () => {
    // La inversión que dejaría el gate verde al revés: un plan nombra la
    // capacidad en su `sinEsto` justamente para decir que NO la trae. Si el
    // parser leyera el plan entero, ese tier daría `true` y el cruce aprobaría
    // un sitio que promete lo que el producto no da.
    //
    // Va con fixture y no con el archivo vivo A PROPÓSITO: hoy el Básico
    // escribe "Reservas online — se agrega como add-on", sin la palabra
    // "incluidas", así que el patrón no lo matchea ni leyendo el plan entero.
    // Escrito contra el archivo vivo, este caso pasaba en VERDE con la guarda
    // ROTA — medido el 2026-09-06. Un texto que hoy no dispara el patrón no
    // prueba la guarda: lo que se prueba es el CORTE.
    const planQueNiega = `
      { id: "basico",
        incluye: ["2 usuarios", "Hasta 300 fichas", "200 recordatorios por email al mes"],
        sinEsto: ["Reservas online incluidas: no, eso viene desde Pro"] },
    `;
    const l = limitesDelSitio(planQueNiega) as Topes;
    expect(l.basico.usuarios).toBe(2); // el `incluye` sí se leyó
    expect(l.basico.reservas).not.toBe(true); // y el `sinEsto` no se contó
  });
});

describe("el cruce lee la forma literal de PLAN_LIMITS", () => {
  /** Copia textual de `onia-platform/lib/plan-catalogo.ts`. */
  const LIMITES_FIXTURE = `
export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: { patients: 30, users: 1, emailsPerMonth: 0, publicBookingIncluded: false, agentsIncluded: false, reportsEnabled: false },
  basic: { patients: 300, users: 2, emailsPerMonth: 200, publicBookingIncluded: false, agentsIncluded: false, reportsEnabled: false },
  professional: { patients: 1500, users: 5, emailsPerMonth: 800, publicBookingIncluded: true, agentsIncluded: true, reportsEnabled: true },
  clinic: { patients: -1, users: -1, emailsPerMonth: -1, publicBookingIncluded: true, agentsIncluded: true, reportsEnabled: true },
};
`;

  it("saca los topes, incluido el -1 de ilimitado", () => {
    const l = limitesDelProducto(LIMITES_FIXTURE) as Record<
      string,
      { fichas: number; usuarios: number; recordatorios: number }
    >;
    expect(l.basic).toMatchObject({ fichas: 300, usuarios: 2, recordatorios: 200 });
    expect(l.clinic).toMatchObject({ fichas: -1, usuarios: -1, recordatorios: -1 });
  });

  it("el tier es el plan más barato que enciende la capacidad", () => {
    const l = limitesDelProducto(LIMITES_FIXTURE);
    expect(primerPlanCon(l, "reservas")).toBe("professional");
    expect(primerPlanCon(l, "agentes")).toBe("professional");
  });

  it("un tier ilegible no se adivina: devuelve null y el cruce lo canta", () => {
    // Sin esto, una capacidad renombrada en el producto se leería como
    // "ningún plan la tiene" y el gate compararía contra un dato inventado.
    const sinLaClave = LIMITES_FIXTURE.replace(/publicBookingIncluded/g, "otraCosa");
    expect(primerPlanCon(limitesDelProducto(sinLaClave), "reservas")).toBeNull();
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

  it("distingue el monto de la promesa, para no mandar al archivo equivocado", () => {
    expect(esPromesa("plan Básico · mensual")).toBe(false);
    expect(esPromesa("plan Básico · fichas")).toBe(true);
    expect(esPromesa("primer plan con reservas online incluidas")).toBe(true);
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
    const vacio = cifrasDelProducto({
      planes: "",
      addons: "",
      prueba: "",
      limites: "",
    });
    const { difieren, ilegibles } = comparar(vacio, vacio);
    expect(difieren).toEqual([]);
    expect(ilegibles).toEqual(CIFRAS);
  });
});
