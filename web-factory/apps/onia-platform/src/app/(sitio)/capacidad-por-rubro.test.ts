import { describe, expect, it } from "vitest";

import {
  ALCANCE_CLINICO,
  ALCANCE_CON_FICHA,
  ALCANCE_POR_DATOS,
  ALCANCE_POR_RUBRO,
  PLANES,
} from "@/lib/pricing";

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

  /**
   * LA DIRECCIÓN SIMÉTRICA, y la que ningún instrumento de esta familia miraba.
   *
   * Los tres casos de arriba y `scripts/capacidad-por-rubro.mjs` preguntan lo
   * mismo en dos formas: «¿la capacidad acotada dice a qué rubros llega?». La
   * pregunta de enfrente —«¿la salvedad se está comiendo a la de al lado?»— no
   * la puede expresar ninguno: el script deriva su universo de las PANTALLAS
   * declaradas en `ALCANCE_POR_RUBRO`, así que una capacidad que nadie declaró
   * acotada (porque no lo está) no es sujeto suyo; y el caso hermano de acá
   * arriba sólo exige que el alcance ESTÉ, nunca que no sobre.
   *
   * MEDIDO EL 2026-09-19 en `onia.com.bo/precios`, vivo. El `sinEsto` del Crece
   * decía «Reportes completos, facturas recurrentes y contabilidad completa
   * (solo en clínicas dentales y estética) — vienen en Profesional»: el
   * paréntesis cerraba DESPUÉS de la enumeración entera, así que el alcance de
   * las dos primeras se derramaba sobre la tercera. Y la contabilidad NO está
   * acotada por rubro — `/contabilidad` es segmento COMÚN en el producto
   * (`onia-platform/lib/platform/contabilidad-transversal.test.ts`, leído de
   * `origin/master`: entra un tenant dental y entra uno de comercio; el corte es
   * por PLAN, «resumen básico desde Básico, contabilidad completa desde
   * Profesional»). O sea que a comercio, importadora y servicios profesionales
   * —3 de los 5 rubros del alta— se les decía que la contabilidad completa no
   * les llega NI subiendo a Profesional, borrándoles el motivo más caro del
   * salto de Bs 550 a Bs 890. La misma pantalla se desmentía veinte líneas más
   * abajo, donde el Profesional la lista sin ningún alcance.
   *
   * Es la dirección que la casa no persigue: los gates buscan lo que promete de
   * MÁS, y esto ofrece de MENOS. Ya costó quince días una vez (el IVA/IT borrado
   * del panel de Servicios el 02-sep por «fabricado», con el motor armándolo
   * desde el plan más barato).
   *
   * EL INVARIANTE, para que cierre la clase y no la instancia: si la cláusula
   * que una salvedad de rubro acota ENUMERA varias cosas y sólo algunas están
   * declaradas acotadas, la salvedad está mintiendo sobre las otras. El universo
   * sale de los datos de alcance que existen (`ALCANCE_POR_RUBRO`,
   * `ALCANCE_POR_DATOS`), no de una lista de frases: el alcance que se agregue
   * mañana con esa misma forma nace vigilado. `ALCANCE_CON_AGENDA` queda fuera a
   * propósito — no es un alcance por rubro sino una condición del negocio («si
   * trabajás con citas») y no tiene tabla de capacidades que cruzar.
   */
  const ALCANCES = [
    { frase: ALCANCE_CLINICO, dato: "ALCANCE_POR_RUBRO", capacidades: ALCANCE_POR_RUBRO },
    { frase: ALCANCE_CON_FICHA, dato: "ALCANCE_POR_DATOS", capacidades: ALCANCE_POR_DATOS },
  ];

  /**
   * El tramo que la salvedad acota: lo que viene ANTES de ella en la misma
   * línea. No se corta en `:` ni en `—` a propósito — el nombre de la capacidad
   * suele vivir en el prefijo («Agente Recall: te propone…»), y cortarlo lo
   * dejaría fuera de su propia cláusula.
   */
  function clausulaAcotada(texto: string, frase: string): string | null {
    const i = normalizar(texto).indexOf(normalizar(frase));
    if (i < 0) return null;
    return texto.slice(0, i).replace(/[(\s]+$/, "").trim();
  }

  /** «a, b y c» → [a, b, c]. La enumeración es la unidad que el lead lee de corrido. */
  const itemsDe = (clausula: string) =>
    clausula
      .split(/,\s*|\s+y\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

  it("una salvedad de rubro no se derrama sobre la capacidad de al lado", () => {
    const derrames: string[] = [];

    for (const { frase, dato, capacidades } of ALCANCES) {
      for (const linea of LINEAS) {
        const clausula = clausulaAcotada(linea.texto, frase);
        if (!clausula) continue;

        const items = itemsDe(clausula);
        const declarada = (item: string) =>
          capacidades.some(({ capacidad }) => normalizar(item).includes(normalizar(capacidad)));

        // Sujeto: la cláusula MEZCLA. Si ningún ítem está declarado acotado, la
        // salvedad no habla de estas capacidades y el caso hermano ya la cubre;
        // si TODOS lo están, la salvedad es cierta para la enumeración entera.
        const acotados = items.filter(declarada);
        const intrusos = items.filter((i) => !declarada(i));
        if (acotados.length === 0 || intrusos.length === 0) continue;

        derrames.push(
          `${linea.plan} · ${linea.campo}: «${frase}» acota a ${acotados
            .map((i) => `«${i}»`)
            .join(" y ")} y se lleva puesta${intrusos.length > 1 ? "s" : ""} a ${intrusos
            .map((i) => `«${i}»`)
            .join(" y ")} — línea completa: "${linea.texto}"`,
        );
      }
    }

    expect(
      derrames,
      `La salvedad de rubro está acotando capacidades que ${ALCANCES.map((a) => a.dato).join(
        " ni ",
      )} declaran. Al lead de un rubro que SÍ la tiene se le está diciendo que no le ` +
        `llega: ofrecer de menos le borra el motivo para pagar el escalón de arriba, y ` +
        `ningún otro gate mira esa dirección. Cerrá el paréntesis ANTES de la capacidad ` +
        `que no está acotada y dejala en su propia cláusula (así está la línea del Profesional).`,
    ).toEqual([]);
  });
});
