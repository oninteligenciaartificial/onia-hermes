import { describe, expect, it } from "vitest";

import { TOPE_RECORTADOS, fallasDeRecortados, textoRecortadoALaVista } from "./recortados.mjs";

/**
 * El sujeto de una falla por texto recortado es el TEXTO, no la vista.
 *
 * Lo que este gate impide está medido, no supuesto. El 2026-09-17
 * `node scripts/mirar-venta.mjs` contra producción escribió en su informe
 * CINCO textos recortados en `home @ tablet-768` y le mostró al carril UNA
 * línea, con el primero:
 *
 *     · home @ tablet-768: texto recortado — "Contabilidad"
 *
 * mientras `informe.json` guardaba, en la misma corrida:
 *
 *     "recortados": [ "Contabilidad", "WhatsApp del negocio", "Para aprobar",
 *                     "Recordar citas de mañana", "Avisar los pagos vencidos" ]
 *
 * Los cuatro de atrás ya tienen su cura escrita y verificada en `main`
 * (7878342f y e96f5e24, esperando el ok del deploy); «Contabilidad» es el
 * residuo de 8px que se deja A PROPÓSITO, con sus tres alternativas probadas y
 * rechazadas anotadas en `(sitio)/sitio.module.css`. O sea que el día que ese
 * deploy salga, la línea que el carril lee va a ser **byte por byte la misma**
 * que hoy — y nadie va a poder decir si la cura llegó.
 */
describe("una falla por texto recortado, no una por vista", () => {
  /** La medición real del 2026-09-17 contra https://onia.com.bo. */
  const PRODUCCION_768 = [
    { tag: "SPAN", txt: "Contabilidad" },
    { tag: "SPAN", txt: "WhatsApp del negocio" },
    { tag: "SPAN", txt: "Para aprobar" },
    { tag: "SPAN", txt: "Recordar citas de mañana" },
    { tag: "SPAN", txt: "Avisar los pagos vencidos" },
  ];

  it("nombra los CINCO textos de la medición real, no sólo el primero", () => {
    const fallas = fallasDeRecortados("home @ tablet-768", PRODUCCION_768);

    expect(fallas).toHaveLength(5);
    for (const { txt } of PRODUCCION_768) {
      expect(
        fallas.some((f: { texto: string }) => f.texto.includes(`"${txt}"`)),
        `«${txt}» está recortado en producción y ninguna falla lo nombra`,
      ).toBe(true);
    }
  });

  it("le da una CLAVE distinta a cada texto — es lo que compara --comparar-con", () => {
    const claves = fallasDeRecortados("home @ tablet-768", PRODUCCION_768).map(
      (f: { clase: string }) => f.clase,
    );
    expect(new Set(claves).size).toBe(claves.length);
  });

  /**
   * El caso que ata la decisión a su ÚNICO consumidor.
   *
   * `--comparar-con` contesta la pregunta que este carril no puede contestar de
   * otra forma: producción está rota, ¿el código está mal o falta el deploy?
   * Lo decide por diferencia de claves entre producción y la rama. Acá se
   * afirma esa diferencia como propiedad — no se reimplementa el comparador,
   * se le exige a la identidad que lo haga posible.
   *
   * Con la clase pelada `recortado` los dos lados comparten UNA clave: la
   * intersección es total, la diferencia es vacía, y el comparador contesta
   * "esto sí es código" sobre una cura ya escrita.
   */
  it("distingue lo que la rama YA arregló de lo que sigue roto en el código", () => {
    const enProduccion = fallasDeRecortados("home @ tablet-768", PRODUCCION_768);
    // La rama con la cura publicada: sobrevive sólo el residuo aceptado.
    const enLaRama = fallasDeRecortados("home @ tablet-768", [
      { tag: "SPAN", txt: "Contabilidad" },
    ]);

    const clavesDeLaRama = new Set(enLaRama.map((f: { clase: string }) => f.clase));
    const yaArregladas = enProduccion.filter(
      (f: { clase: string }) => !clavesDeLaRama.has(f.clase),
    );
    const sigueSiendoCodigo = enProduccion.filter((f: { clase: string }) =>
      clavesDeLaRama.has(f.clase),
    );

    expect(yaArregladas.map((f: { texto: string }) => f.texto).join(" | ")).toContain(
      "WhatsApp del negocio",
    );
    expect(yaArregladas).toHaveLength(4);
    expect(sigueSiendoCodigo).toHaveLength(1);
    expect(sigueSiendoCodigo[0].texto).toContain("Contabilidad");
  });

  /**
   * La clave no puede depender del orden en que el DOM devolvió los nodos: una
   * reordenación del markup inventaría fallas nuevas en cada vuelta y
   * `--comparar-con` dejaría de poder comparar nada.
   */
  it("da la misma clave sin importar el orden del DOM", () => {
    const enOrden = fallasDeRecortados("home @ tablet-768", PRODUCCION_768);
    const alReves = fallasDeRecortados("home @ tablet-768", [...PRODUCCION_768].reverse());
    expect(alReves.map((f: { clase: string }) => f.clase)).toEqual(
      enOrden.map((f: { clase: string }) => f.clase),
    );
  });

  it("no inventa fallas cuando no hay nada recortado", () => {
    expect(fallasDeRecortados("home @ movil-320", [])).toEqual([]);
  });

  /**
   * El tope HABLA. El `slice(0, 5)` mudo que esto reemplaza era la otra mitad
   * del agujero: con seis textos recortados, el sexto no existía para nadie.
   */
  it("declara con su cuenta los que el tope dejó afuera", () => {
    const nombrados = Array.from({ length: TOPE_RECORTADOS }, (_, i) => ({
      tag: "SPAN",
      txt: `texto ${String(i).padStart(2, "0")}`,
    }));
    const fallas = fallasDeRecortados("home @ tablet-768", nombrados, TOPE_RECORTADOS + 3);

    expect(fallas).toHaveLength(TOPE_RECORTADOS + 1);
    const extra = fallas[fallas.length - 1];
    expect(extra.clase).toContain("3");
    expect(extra.texto).toContain("3 texto(s) recortado(s) más");
  });

  it("no declara sobrantes cuando el barrido los nombró a todos", () => {
    const fallas = fallasDeRecortados("home @ tablet-768", PRODUCCION_768, 5);
    expect(fallas.every((f: { clase: string }) => !f.clase.includes("sin nombrar"))).toBe(true);
  });
});

/**
 * Qué cuenta como "texto recortado" — la decisión que antes vivía suelta
 * dentro de la sonda del navegador, donde ningún test la podía mirar.
 *
 * Las cajas de acá no están inventadas: son la medición del 2026-09-17 contra
 * https://onia.com.bo, viewport 320, leyendo `clientWidth`/`scrollWidth` y el
 * `getComputedStyle` de cada elemento que el detector viejo acusaba.
 */
describe("qué cuenta como texto recortado a la vista", () => {
  /** Los tres sr-only reales, con sus tres hashes de CSS module distintos. */
  const SR_ONLY_DE_PRODUCCION = [
    {
      donde: "/v1 · span.landing_srOnly — «Agentes que trabajan solos: no lo tiene»",
      caja: { clientWidth: 1, clientHeight: 1, scrollWidth: 290, overflow: "hidden" },
    },
    {
      donde: "/v1/chatbot · span.configurador_srOnly — «WhatsApp, No pierdo al que escribe…»",
      caja: { clientWidth: 1, clientHeight: 1, scrollWidth: 616, overflow: "hidden" },
    },
    {
      donde: "/v1/empezar · legend.wizard_srOnly — «¿De qué es tu negocio?»",
      caja: { clientWidth: 1, clientHeight: 1, scrollWidth: 173, overflow: "hidden" },
    },
  ];

  it.each(SR_ONLY_DE_PRODUCCION)(
    "no acusa el texto que sólo lee un lector de pantalla: $donde",
    ({ caja }) => {
      expect(textoRecortadoALaVista(caja)).toBe(false);
    },
  );

  /**
   * El caso ancla del sujeto que el gate existe para cazar: «Contabilidad»,
   * los 8px que se pintan fuera de su pastilla en la home a 320px.
   */
  it("acusa el texto que una caja de tamaño real sí corta", () => {
    expect(
      textoRecortadoALaVista({
        clientWidth: 96,
        clientHeight: 20,
        scrollWidth: 104,
        overflow: "hidden",
      }),
    ).toBe(true);
  });

  it("no acusa una caja que muestra su texto entero", () => {
    expect(
      textoRecortadoALaVista({
        clientWidth: 240,
        clientHeight: 20,
        scrollWidth: 240,
        overflow: "hidden",
      }),
    ).toBe(false);
  });

  it("no acusa lo que se desborda con overflow visible: eso se lee igual", () => {
    expect(
      textoRecortadoALaVista({
        clientWidth: 96,
        clientHeight: 20,
        scrollWidth: 300,
        overflow: "visible",
      }),
    ).toBe(false);
  });

  it("deja pasar el subpixel: 2px de diferencia no son un defecto", () => {
    expect(
      textoRecortadoALaVista({
        clientWidth: 200,
        clientHeight: 20,
        scrollWidth: 202,
        overflow: "hidden",
      }),
    ).toBe(false);
  });

  /**
   * La franja de 1px de ALTO es la mitad hermana del sr-only: ancho real,
   * alto colapsado. Tampoco la lee nadie.
   */
  it("no acusa una franja de 1px de alto", () => {
    expect(
      textoRecortadoALaVista({
        clientWidth: 300,
        clientHeight: 1,
        scrollWidth: 480,
        overflow: "hidden",
      }),
    ).toBe(false);
  });

  /**
   * La sonda corre dentro del navegador y no puede importar: el predicado le
   * llega como fuente. Si deja de poder reconstruirse —una arrow asignada a
   * una const, un helper de módulo adentro— el detector se cae en producción y
   * no acá. Esto es esa juntura, probada del mismo modo que `mirar-venta.mjs`
   * la usa.
   */
  it("se puede reconstruir desde su fuente, que es como viaja al navegador", () => {
    const reconstruido = new Function(`return (${textoRecortadoALaVista.toString()})`)();

    expect(reconstruido({ clientWidth: 1, clientHeight: 1, scrollWidth: 290, overflow: "hidden" })).toBe(
      false,
    );
    expect(reconstruido({ clientWidth: 96, clientHeight: 20, scrollWidth: 104, overflow: "hidden" })).toBe(
      true,
    );
  });
});
