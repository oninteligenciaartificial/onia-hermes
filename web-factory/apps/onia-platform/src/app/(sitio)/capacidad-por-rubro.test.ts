import { describe, expect, it } from "vitest";

import { ALCANCE_CLINICO, ALCANCE_POR_RUBRO, PLANES } from "@/lib/pricing";

/**
 * El eje (capacidad, RUBRO). Una capacidad que el plan enciende para todos y que
 * el producto entrega solo a algunos rubros tiene que decir a cuáles, PEGADO a
 * donde se la nombra.
 *
 * El defecto que lo motiva está medido en el comentario de `ALCANCE_POR_RUBRO`
 * (`lib/pricing.ts`): «Reportes completos y facturas recurrentes» viajaba plano
 * en el `incluye` del Pro y en el `sinEsto` del Básico, y son dos pantallas a
 * las que comercio, importadora y servicios profesionales —3 de los 5 rubros que
 * el alta ofrece— no llegan; con `PLATFORM_LAYER=1` el layout los devuelve a
 * `/dashboard` sin decir por qué. Es el gancho del salto de Bs 320 a Bs 750.
 *
 * POR QUÉ ES UNA CLASE Y NO UNA INSTANCIA: el sujeto se deriva de las líneas
 * REALES de `PLANES` —no de una lista de frases escrita al lado—, así que una
 * capacidad acotada que alguien mueva, duplique o reescriba sigue siendo sujeto.
 * Lo que este archivo NO puede ver es una capacidad acotada que nadie declaró en
 * `ALCANCE_POR_RUBRO`: ese hueco es de `scripts/capacidad-por-rubro.mjs`, que
 * cruza contra el pack real del producto. Los dos juntos, no uno solo.
 *
 * VENTANA, NO DOCUMENTO: la salvedad se exige en la MISMA línea, que es la
 * unidad que el lead lee (un ítem de una lista con viñetas). Buscarla en todo el
 * array la daría por puesta desde otra tarjeta, que es cómo
 * `promesa-fiscal.test.ts` descubrió que un gate se apaga con su propia
 * vecindad.
 */

/** Toda línea de venta de los planes, con su origen para poder nombrarlo. */
const LINEAS = PLANES.flatMap((plan) => [
  ...plan.incluye.map((texto) => ({ plan: plan.nombre, campo: "incluye", texto })),
  ...plan.sinEsto.map((texto) => ({ plan: plan.nombre, campo: "sinEsto", texto })),
]);

/** ¿La línea trae su alcance? Se compara sin acentos ni mayúsculas. */
const normalizar = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const traeElAlcance = (texto: string) => normalizar(texto).includes(normalizar(ALCANCE_CLINICO));

describe("una capacidad acotada por rubro dice a qué rubros llega", () => {
  it("hay algo que vigilar: el dato declara capacidades acotadas y los planes las nombran", () => {
    // Ancla. Sin esto, vaciar ALCANCE_POR_RUBRO —o dejar de nombrar la capacidad
    // en los planes— apagaría el gate entero en verde, que es como se pudre esta
    // familia: el caso sigue pasando y ya no mide nada.
    expect(ALCANCE_POR_RUBRO.length).toBeGreaterThan(0);
    for (const { capacidad } of ALCANCE_POR_RUBRO) {
      const nombrada = LINEAS.filter((l) => l.texto.includes(capacidad));
      expect(
        nombrada.length,
        `Ningún plan nombra «${capacidad}», que ALCANCE_POR_RUBRO declara acotada. ` +
          `O el copy dejó de venderla (sacala del dato) o la renombraron (actualizá el dato).`,
      ).toBeGreaterThan(0);
    }
  });

  it("ninguna capacidad acotada se ofrece sin decir su alcance", () => {
    const sinAlcance = LINEAS.filter(
      (l) =>
        ALCANCE_POR_RUBRO.some(({ capacidad }) => l.texto.includes(capacidad)) &&
        !traeElAlcance(l.texto),
    );

    expect(
      sinAlcance.map((l) => `${l.plan} · ${l.campo}: "${l.texto}"`),
      `Estas líneas ofrecen una capacidad que el producto entrega solo a algunos ` +
        `rubros y no dicen a cuáles. Un comercio, una importadora o un estudio ` +
        `profesional la lee como incluida, paga, y el panel lo devuelve a /dashboard ` +
        `sin decir por qué. Agregá «${ALCANCE_CLINICO}» en la MISMA línea.`,
    ).toEqual([]);
  });

  it("el alcance que se dice es el que declara el dato, no uno tipeado al lado", () => {
    // Si mañana una de estas capacidades llega a un rubro más, la frase única
    // deja de ser cierta para las dos y hay que partirla. Este caso lo fuerza.
    const alcances = new Set(ALCANCE_POR_RUBRO.map((c) => [...c.rubros].sort().join(" + ")));
    expect(
      [...alcances],
      `ALCANCE_POR_RUBRO ya no describe UN solo alcance, así que la frase única ` +
        `«${ALCANCE_CLINICO}» miente para alguna. Partí la línea del plan y dale a ` +
        `cada capacidad la suya.`,
    ).toHaveLength(1);
  });

  it("cada rubro del alcance se nombra en singular y plural sin inventar rubros", () => {
    // El alcance se escribe una vez y se lee; que mencione rubros que no existen
    // en el dato sería inventar cobertura.
    const declarados = new Set(ALCANCE_POR_RUBRO.flatMap((c) => c.rubros));
    expect(declarados.size).toBeGreaterThan(0);
    for (const rubro of declarados) {
      const primeraPalabra = normalizar(rubro).split(/[\s/]+/)[0];
      expect(
        normalizar(ALCANCE_CLINICO).includes(primeraPalabra),
        `ALCANCE_CLINICO no nombra a «${rubro}», que sí está en el alcance del dato.`,
      ).toBe(true);
    }
  });
});
