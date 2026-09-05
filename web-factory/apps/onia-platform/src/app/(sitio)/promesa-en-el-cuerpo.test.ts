import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { CONTENDIENTES, EJES, HUECO, HUECO_PARTIDO, type EjeId } from "@/lib/proof";

import { PAGINAS_PUBLICAS, archivoDe, cadenaHastaSimbolo, moduloDe } from "../rutas";

/**
 * Ninguna página PROMETE una capacidad que el producto todavía no tiene.
 *
 * Es el simétrico exacto de `obra-en-el-cuerpo.test.ts`, y hasta hoy no lo
 * cubría nadie. Aquél prohíbe **enumerar** lo que falta; éste prohíbe el error
 * contrario, que es el caro: **dar por hecho** lo que falta. Entre los dos
 * queda la única postura que Sergio aceptó — *ni prometer lo inexistente NI
 * exhibir lo incompleto*.
 *
 * El defecto que lo trajo, medido el 2026-09-04 sobre `onia.com.bo` servido:
 * el bloque «El hueco» de la portada usaba `HUECO` como TITULAR —
 *
 *   «No existe un solo software vendido en Bolivia que cruce agenda + ficha
 *    del cliente + factura SIAT.»
 *   «Onia unifica la gestión y los agentes con IA en un solo sistema, hecho
 *    para Bolivia.»
 *
 * — y esas dos frases seguidas, sin la tabla al lado, se leen de una sola
 * manera: que Onia cruza los tres ejes, factura fiscal incluida. **No la
 * cruza.** Nuestra propia fila de `CONTENDIENTES` dice `siat: "tramite"` y su
 * veredicto lo admite: *"la factura fiscal todavía no: nuestro emisor está en
 * trámite de homologación ante el SIN"*. La portada contradecía, en su tercer
 * bloque, el dato que el sitio publica dos clics más adentro.
 *
 * Y es el MISMO barrido a medias del día anterior: el 2026-09-04 se sacó
 * «Facturación SIAT» del pie de las 52 páginas (`198cca363`) porque el emisor
 * está en trámite, y el cuerpo de la portada siguió prometiendo lo mismo. La
 * regla de `CLAUDE.md` —*una promesa que cambia se barre en TODA la
 * superficie*— falló donde siempre: en el hermano que no se estaba tocando.
 *
 * ⚠️ **Lo que se mide es la CAPACIDAD, no la palabra**, así que un patrón de
 * texto sobre el `page.tsx` no puede verlo: la frase no está escrita en la
 * página, se importa de `lib/proof.ts`. Es la trampa ya conocida del grafo de
 * imports (`grep -c Sintic .../comparativa/page.tsx` da 0 sobre la página que
 * renderiza a los seis competidores). Por eso el sujeto es la cadena de
 * imports, igual que `obra-en-el-cuerpo.test.ts` y `header-camino-de-compra`.
 *
 * ⚠️ **El gate se apaga solo el día que la capacidad exista.** No hay lista de
 * frases prohibidas: el sujeto sale de los DATOS — los ejes donde la fila de
 * Onia no está en `"si"`. El día que el emisor se homologue y `siat` pase a
 * `"si"`, la portada puede volver a nombrar la factura sin tocar este archivo.
 * Al revés también: si mañana entra un eje nuevo en trámite, queda cubierto sin
 * que nadie se acuerde de venir a agregarlo.
 *
 * ⚠️ **Lo que este gate NO prohíbe, a propósito:** decirlo donde el lector ve
 * el estado real. `/comparativa` y su teaser traen `CONTENDIENTES`, o sea la
 * tabla con `siat: "tramite"` y el veredicto de Onia a la vista: ahí la misma
 * frase no es una promesa, es el hueco de mercado con su fuente. El corte no es
 * el vocabulario — es afirmar el eje SIN mostrar dónde estamos parados.
 */

/** La fila de Onia: es la única que dice qué tiene el producto de verdad. */
const ONIA = CONTENDIENTES.find((c) => c.esOnia);

/**
 * Cómo se nombra cada eje en el copy de venta. Es lo único escrito a mano acá,
 * y va con su porqué: `label` es la etiqueta de la TABLA ("Factura SIAT
 * boliviana"), que nunca aparece literal en una frase corrida. El gate necesita
 * el término con que el eje se cuela en el copy.
 */
const TERMINO: Record<EjeId, RegExp> = {
  gestion: /\bagenda\b/i,
  siat: /\bSIAT\b|\bfactura\s+fiscal\b/i,
  agentes: /\bagentes\b/i,
};

/** Los ejes que el producto NO cumple hoy — derivados, no listados. */
const NO_CUMPLIDOS = EJES.filter((eje) => ONIA?.estados[eje.id] !== "si");

describe("la portada no promete lo que el producto todavía no hace", () => {
  it("la fila de Onia existe y es la que fija qué se puede prometer", () => {
    expect(ONIA, "CONTENDIENTES perdió la fila con esOnia: sin ella este gate no mide nada").toBeDefined();
  });

  it("hoy la factura fiscal NO está cumplida — si esto falla, el gate se apagó solo y está bien", () => {
    // Ancla viva: el día que el emisor se homologue, este caso falla y avisa
    // que el resto del archivo dejó de aplicar. Un gate que se apaga en
    // silencio es peor que uno que no existe.
    expect(ONIA?.estados.siat).not.toBe("si");
    expect(NO_CUMPLIDOS.map((e) => e.id)).toContain("siat");
  });

  it("HUECO nombra un eje no cumplido, así que es una afirmación restringida", () => {
    // Si esto falla, HUECO dejó de hablar de la factura y el caso de abajo
    // estaría vigilando una frase que ya no promete nada.
    const nombrados = NO_CUMPLIDOS.filter((eje) => TERMINO[eje.id].test(HUECO));
    expect(nombrados.map((e) => e.id)).toContain("siat");
  });

  it("ninguna página afirma un eje no cumplido sin traer la tabla que lo desambigua", () => {
    const proof = moduloDe("@/lib/proof");
    const culpables: string[] = [];

    for (const pagina of PAGINAS_PUBLICAS) {
      const entrada = archivoDe(pagina);
      const afirma = cadenaHastaSimbolo(entrada, "HUECO", proof);
      if (!afirma) continue;

      // La tabla completa es lo que convierte la afirmación en dato: muestra
      // `siat: "tramite"` en la fila de Onia y su veredicto al lado.
      const desambigua = cadenaHastaSimbolo(entrada, "CONTENDIENTES", proof);
      if (desambigua) continue;

      culpables.push(
        `${pagina.ruta || "/"} promete «${NO_CUMPLIDOS.map((e) => e.label).join(", ")}» ` +
          `sin mostrar el estado real — cadena: ${afirma.join(" → ")}`,
      );
    }

    expect(culpables, culpables.join("\n")).toEqual([]);
  });
});

/**
 * La frase que SÍ puede ir sola tiene que seguir siendo cierta.
 *
 * `HUECO_PARTIDO` es una afirmación sobre el mercado —"el que factura no
 * agenda, el que agenda no factura"— publicada como titular de la portada. Una
 * afirmación así no se revisa nunca a mano: se escribe una vez y envejece
 * callada. Acá se comprueba fila por fila contra los mismos datos de los que
 * salió, así que el día que un competidor cruce las dos patas la portada se
 * pone en ROJO en vez de quedar mintiendo.
 */
describe("el hueco de la portada sigue siendo verdad", () => {
  it("nadie que facture en Bolivia tiene agenda y ficha", () => {
    const cruzan = CONTENDIENTES.filter(
      (c) => c.estados.siat === "si" && c.estados.gestion === "si",
    );
    expect(
      cruzan.map((c) => c.quien),
      "alguien cruza las dos patas: la portada dejó de decir la verdad",
    ).toEqual([]);
  });

  it("la frase de la portada no nombra ningún eje que el producto no cumpla", () => {
    const prometidos = NO_CUMPLIDOS.filter((eje) => TERMINO[eje.id].test(HUECO_PARTIDO));
    expect(
      prometidos.map((e) => e.label),
      "la portada volvió a nombrar una capacidad que Onia todavía no tiene",
    ).toEqual([]);
  });

  it("dice el mismo hueco que la forma larga: las dos hablan de las mismas patas", () => {
    // Si alguien reescribe una sola de las dos, esto avisa: son el mismo
    // hallazgo dicho para dos superficies, no dos mensajes distintos.
    for (const eje of ["gestion", "siat"] as const) {
      expect(TERMINO[eje].test(HUECO), `HUECO dejó de hablar de ${eje}`).toBe(true);
    }
    expect(TERMINO.gestion.test(HUECO_PARTIDO)).toBe(true);
  });
});
