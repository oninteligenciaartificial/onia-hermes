import { describe, expect, it } from "vitest";

import { PAGINAS, archivoDe, cadenaHastaTexto } from "./rutas";

/**
 * Ninguna página del sitio ADMITE que una función del producto no existe.
 *
 * Es la misma regla de Sergio del 2026-08-20 que persigue `obra-en-el-cuerpo`
 * —*"no entiendo por qué dices si es que estamos construyendo algo que aún no
 * está listo… hace escapar a los clientes"*—, pero por el lado que aquel gate
 * no puede ver, y que es el que sobrevive.
 *
 * **Lo que se escapaba, medido el 2026-09-06 en `onia.com.bo/servicios/webs`
 * (HTTP 200, renderizado en un `<li>`):** el ítem *"Cobro con tarjeta: NO hay
 * pasarela online. **Esto no existe en el sistema todavía**"*, vivo dentro de
 * `WEB_STACKS.noIncluye` en `content/webs.ts`. Le decía a un lead que le
 * estamos cobrando por un producto al que —dicho por nosotros— le falta algo, y
 * encima generalizaba a *"el sistema"*, que es lo que vendemos, cuando el hueco
 * era del servicio de tienda.
 *
 * **Por qué ningún instrumento lo veía, que es lo que hace a esto una clase y
 * no un typo.** Son cuatro cortes y el defecto pasaba por los cuatro:
 *
 * 1. El barrido de literales prohibidos (`muy pronto`, `próximamente`, `en
 *    construcción`, `beta`) es una lista de INCLUSIÓN de palabras: exhibir obra
 *    sin usar ninguna de ellas le sale gratis. Ésta no usa ni una.
 * 2. `obra-en-el-cuerpo.test.ts` persigue el símbolo `TODAVIA_NO` — la forma
 *    CÓMODA del defecto: la lista de huecos puesta como sección, con título. La
 *    forma que se escapa es UNA línea suelta metida en otro dato.
 * 3. Su otra mitad lee el texto del `page.tsx`, y esto se importa: `grep` sobre
 *    `servicios/webs/page.tsx` da CERO sobre la página que ES el defecto.
 * 4. El grep sobre la URL tampoco: React parte el texto y produce
 *    `<!-- -->`. (Acá no llegó a importar, pero es el cuarto ciego de la fila.)
 *
 * ⚠️ **Lo que este gate NO prohíbe, a propósito, y por qué el corte está donde
 * está.** La firma que persigue es *negar la EXISTENCIA de algo nuestro con un
 * adverbio de futuro*. NO alcanza a:
 *
 * - **La advertencia fiscal.** *"nuestro emisor está en trámite … y todavía no
 *   emite factura con valor fiscal"* niega una CAPACIDAD en trámite ante un
 *   tercero (el SIN), no la existencia de una función, y sacarla convertiría
 *   una honestidad obligatoria en una promesa falsa. `promesa-fiscal.test.ts`
 *   existe justamente para exigirla.
 * - **Acotar el alcance de un servicio.** *"Tienda, carrito ni pasarela de
 *   pago"* dentro de un `noIncluye` es alcance comercial, y es lo que evita
 *   vender humo. Lo que sobraba en el caso vivo no era decir que el cobro con
 *   tarjeta queda afuera: era el *"no existe … todavía"* pegado atrás.
 * - **Hablar del LEAD.** *"El que no tiene nada todavía"* (a quién le sirve una
 *   landing) niega algo del cliente, no del producto. Por eso la condición no
 *   es la negación sola: la oración tiene que nombrar además lo que vendemos.
 */

/** No cruza fin de oración ni de literal: una persona lee una frase, no un archivo. */
const SEP = '[^.;!?"]';
/** Lo que vendemos. Sin esto, el gate se comería frases sobre el propio lead. */
const NOMBRA_LO_NUESTRO = "\\b(?:sistema|onia|plataforma|m[oó]dulo|panel)\\b";
/** Negar que algo EXISTE — no que ande, no que esté en trámite. */
const NO_EXISTE =
  "\\bno (?:lo |la |los |las )?(?:existe|existen|hay|est[aá] (?:disponible|listo|lista|hecho)|tenemos|ten[ée]s|tiene|tienen)\\b";
const EN_EL_FUTURO = "\\b(?:todav[ií]a|a[uú]n|por ahora|por el momento)\\b";

/*
 * La oración que contiene, a la vez, la negación con futuro y el nombre de lo
 * que vendemos — en cualquiera de los dos órdenes, porque cubrir uno solo es
 * medio barrido: ya pasó con «Bs 320» / «320 Bs» en `precios.test.ts`, donde la
 * mitad no cubierta era justo la que se había despegado.
 */
const HUECO_DECLARADO = new RegExp(
  `(?:^|["\\.;!?]\\s*)((?=${SEP}*?${NOMBRA_LO_NUESTRO})` +
    `(?=${SEP}*?(?:${NO_EXISTE}${SEP}{0,60}?${EN_EL_FUTURO}|${EN_EL_FUTURO}${SEP}{0,60}?${NO_EXISTE}))${SEP}+)`,
  "i",
);

describe("ninguna página admite que al producto le falta una función", () => {
  /*
   * El ancla del recorredor. Sin esto el gate falla ABIERTO: si el resolver de
   * imports se rompe —un alias nuevo, una extensión que no contempla—, el
   * recorrido no visita nada, el patrón no matchea y todo queda en verde sobre
   * un sitio sin vigilancia.
   *
   * Se ancla en `/v1/empezar` y no en la página donde saltó el defecto:
   * `servicios/webs/page.tsx` importa `@/content/webs` DERECHO, así que
   * encontrarlo ahí no probaría nada. La del wizard llega en dos saltos
   * (`page.tsx` → `wizard` → `data.ts` → `content/webs.ts`), que es el caso
   * difícil y el único que distingue esto de un `grep`.
   */
  it("el recorredor llega a content/webs.ts en dos saltos", () => {
    const wizard = PAGINAS.find((p) => p.ruta === "/v1/empezar");
    expect(wizard, "no existe la página /v1/empezar").toBeDefined();
    const hallado = cadenaHastaTexto(
      archivoDe(wizard!),
      /Carrito que guarda la selecci[oó]n/i,
    );
    expect(hallado, "el recorredor no llegó a content/webs.ts: mide en falso").not.toBeNull();
    expect(hallado!.cadena.length).toBeGreaterThan(2);
  });

  it("el patrón reconoce el hueco vivo y sus dos órdenes", () => {
    // El primero es el texto REAL que producción servía, con su contexto: sin
    // el punto de «online.» delante, la oración empieza en otro lado.
    for (const vivo of [
      'noIncluye: [ "Cobro con tarjeta: NO hay pasarela online. Esto no existe en el sistema todavía", "Cuenta para que cargues productos vos mismo"',
      "El sistema todavía no tiene esa pantalla",
      "por ahora no hay módulo de nada",
    ]) {
      expect(
        HUECO_DECLARADO.test(vivo),
        `el gate dejó de reconocer un hueco declarado: «${vivo}»`,
      ).toBe(true);
    }
  });

  it("el patrón perdona la advertencia fiscal, el alcance y al lead", () => {
    for (const [texto, porque] of [
      [
        "Facturación fiscal, de frente: nuestro emisor está en trámite de homologación ante el " +
          "SIN y todavía no emite factura con valor fiscal. No es algo que se destrabe pagando " +
          "un plan más caro — no depende del plan.",
        "la advertencia fiscal SÍ tiene que poder escribirse: promesa-fiscal.test.ts la exige",
      ],
      [
        'noIncluye: [ "Tienda, carrito ni pasarela de pago", "Textos e imágenes nuevos" ]',
        "acotar el alcance de un servicio no es exhibir obra: es lo que evita vender humo",
      ],
      [
        'paraQuien: "El que no tiene nada todavía, o el que va a hacer pauta y necesita un solo lugar donde caer."',
        "niega algo del LEAD, no del producto",
      ],
    ] as const) {
      expect(HUECO_DECLARADO.test(texto), `el patrón se comió algo legítimo: ${porque}`).toBe(
        false,
      );
    }
  });

  it("ninguna página servida puede pintar un hueco declarado", () => {
    /*
     * Un solo `it` y no un `it.each` por página, a propósito: el texto vive en
     * un dato compartido, así que UN defecto pone rojas a todas las que lo
     * alcanzan y el `it.each` lo reportaría decenas de veces. Acá se nombra el
     * texto, la cadena por donde entra y cuántas pantallas lo sirven.
     */
    const tocadas = PAGINAS.map((p) => ({ p, hallado: cadenaHastaTexto(archivoDe(p), HUECO_DECLARADO) }))
      .filter((x) => x.hallado !== null);

    const primera = tocadas[0];
    expect(
      primera ? `«${primera.hallado!.encontrado.trim()}»` : null,
      primera
        ? `esta frase admite que a lo que vendemos le falta algo, y la sirven ` +
          `${tocadas.length} pantalla(s). Entra por ${primera.hallado!.cadena.join(" → ")}. ` +
          `Acotá el alcance sin prometer futuro: lo que no está listo no se nombra.`
        : "",
    ).toBeNull();
  });
});
