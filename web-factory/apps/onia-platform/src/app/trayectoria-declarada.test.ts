import { describe, expect, it } from "vitest";

import { PAGINAS, archivoDe, cadenaHastaTexto } from "./rutas";

/**
 * Ninguna página del sitio ADMITE que la EMPRESA no tiene trayectoria.
 *
 * Es la regla vecina de «La venta nunca exhibe obra»: el **«Cero autobombo»** de
 * `CLAUDE.md` —*"nada sobre nosotros, nuestras competencias, nuestro equipo o
 * datos que no le importan al dueño de un negocio"* (Sergio Urcullo,
 * 2026-09-03)— por su lado caro, que es el inverso del que todos miran. El
 * autobombo que se vigila es el que se ELOGIA («líderes», «los mejores»); el que
 * se escapa es el que se DISCULPA, y ése le cuenta al lead, en la pantalla
 * anterior a pedir la propuesta, que nadie nos compró todavía.
 *
 * **Lo que se escapaba, medido el 2026-09-26 en `onia.com.bo/servicios/marketing-ia`
 * (HTTP 200, renderizado):** una sección titulada *"Lo que NO vas a encontrar
 * acá."* cuyo cuerpo decía *"Somos una empresa nueva y lo decimos de frente: no
 * tenemos un muro de logos ni casos de éxito con números espectaculares — y
 * antes que inventarlos, preferimos no tenerlos todavía"*.
 *
 * **Y lo que lo vuelve un defecto y no una decisión de estilo es que la decisión
 * contraria YA estaba tomada y escrita en el repo**, en la cabecera de
 * `TODAVIA_NO` (`lib/proof.ts`): *"Es un ledger de producto, no de la empresa:
 * acá van funciones que faltan, no «somos nuevos» ni «no tenemos clientes»"*. O
 * sea que el criterio existía, estaba redactado con estas dos frases exactas, y
 * la página lo desobedecía igual — el mismo modo de falla que el `/v1/comparativa`
 * de `obra-en-el-cuerpo.test.ts`.
 *
 * **Por qué ninguno de los cinco instrumentos lo veía**, que es lo que hace a
 * esto una clase y no un typo. Cada corte es correcto por separado:
 *
 * 1. El barrido del objetivo del carril (`grep -ciE "muy pronto|…|l[ií]der|el
 *    mejor|…"`) es una lista de INCLUSIÓN: caza el autobombo que se elogia. La
 *    confesión no usa ni una de esas palabras, así que sale gratis — y el gate
 *    firmaba «prohibidos 0» con el texto vivo en producción.
 * 2. `obra-literal.test.ts` tiene el sujeto correcto (disco entero + imports),
 *    pero su patrón es obra FUTURA: «muy pronto», «en construcción». Acá no se
 *    anuncia lo que viene, se confiesa lo que no hubo.
 * 3. `obra-en-el-cuerpo.test.ts` persigue el SÍMBOLO `TODAVIA_NO`. Esta frase
 *    está tipeada a mano en el JSX de la página, sin pasar por ningún dato.
 * 4. `hueco-declarado.test.ts` es el más cerca y falla por una razón que vale
 *    documentar: exige que la oración nombre LO NUESTRO
 *    (`sistema|onia|plataforma|módulo|panel`), porque sin eso se comía frases
 *    sobre el propio lead. La carencia de acá no es de una función — es de la
 *    TRAYECTORIA: logos, casos de éxito, clientes. No nombra el producto, y por
 *    eso pasa por debajo.
 * 5. `imagen-sin-obra.test.ts` mira la metadata y las imágenes, no el cuerpo.
 *
 * O sea que el sujeto estaba bien vigilado y lo que faltaba era la PREGUNTA, un
 * nivel más adentro que `obra-literal`: ahí faltaba preguntar por el literal
 * desnudo; acá falta preguntar por la carencia de la EMPRESA, no la del producto.
 *
 * ⚠️ **Dónde está el corte, y qué NO prohíbe a propósito.** La firma que
 * persigue es *negar en PRIMERA PERSONA la prueba social que un comprador
 * busca*, o *decirse nuevo*. Deliberadamente NO alcanza a:
 *
 * - **La advertencia fiscal.** *"nuestro emisor está en trámite … y todavía no
 *   emite factura con valor fiscal"* es una capacidad en trámite ante un tercero
 *   (el SIN) y `promesa-fiscal.test.ts` la EXIGE: sacarla convertiría una
 *   honestidad obligatoria en una promesa falsa.
 * - **Prometer que no se fabrica prueba.** *"Sin métricas infladas"*, *"sin
 *   maquillaje"*, *"nada se publica sin tu aprobación"* son compromisos sobre el
 *   método, no confesiones de carencia. La página tiene que poder decirlos: son
 *   justamente lo que reemplaza al muro de logos inventado.
 * - **Hablar del LEAD.** *"El que no tiene nada todavía"*, *"tu negocio recién
 *   arranca"* niegan algo del cliente. Por eso toda la mitad de negación exige
 *   primera persona del plural, y no la negación sola.
 *
 * Y lo que este gate NO es: una licencia para INVENTAR la prueba que falta.
 * `CLAUDE.md` prohíbe las dos cosas por separado —*"ni prometer lo inexistente
 * NI exhibir lo incompleto"*—; `cero-prueba-fabricada` cuida la otra mitad. La
 * salida no es un testimonio falso: es no hablar de nosotros.
 */

/** No cruza fin de oración ni de literal: una persona lee una frase, no un archivo. */
const SEP = '[^.;!?"]';

/**
 * Decirse nuevo, en primera persona. Dispara solo: no hay lectura inocente de
 * «somos una empresa nueva» en una pantalla de venta. El sustantivo es opcional
 * porque `lib/proof.ts` nombra la forma desnuda («somos nuevos») como prohibida.
 */
const NOS_DECIMOS_NUEVOS =
  "\\bsomos (?:un[ao]?\\s+)?(?:empresa|marca|agencia|compa[nñ][ií]a|negocio|equipo|proyecto)?\\s*(?:nuev[oa]s?|j[oó]ven(?:es)?)\\b";

/** Lo mismo por el lado del tiempo: «recién empezamos». */
const RECIEN_EMPEZAMOS =
  "\\breci[eé]n (?:empezamos|arrancamos|nacimos|abrimos|comenzamos|lanzamos)\\b";

/**
 * La prueba social que un comprador busca. Se dejan fuera las palabras
 * ambiguas —«referencias», «experiencia»— que aparecen en frases sanas sobre el
 * alcance de un servicio: lo que queda es inequívoco.
 */
const PRUEBA_SOCIAL =
  "(?:muro de logos|logos de clientes|casos de [eé]xito|casos reales|testimonios|cartera de clientes|clientes pagando)";

/**
 * Negarla en PRIMERA PERSONA. La carencia tiene que ser NUESTRA: sin esto el
 * gate se comería *"no hace falta que tengas casos de éxito"* dicho del lead,
 * que es el mismo agujero que `hueco-declarado` tapó exigiendo el nombre del
 * producto.
 */
const NO_LA_TENEMOS =
  "(?:\\b(?:no|a[uú]n|todav[ií]a)\\b[^.;!?\"]{0,20}\\b(?:tenemos|tuvimos|tenerlos|tenerlas|contamos con|podemos mostrar(?:te)?)\\b|\\bno tenemos\\b)";

/**
 * La oración que contiene, a la vez, la negación en primera persona y la prueba
 * social — en cualquiera de los dos órdenes, porque cubrir uno solo es medio
 * barrido (ya pasó con «Bs 320» / «320 Bs» en `precios.test.ts`).
 */
const CARENCIA_DE_TRAYECTORIA = new RegExp(
  [
    NOS_DECIMOS_NUEVOS,
    RECIEN_EMPEZAMOS,
    `(?:^|["\\.;!?]\\s*)(?=${SEP}*?${NO_LA_TENEMOS})(?=${SEP}*?${PRUEBA_SOCIAL})${SEP}+`,
  ].join("|"),
  "i",
);

describe("ninguna página admite que la empresa no tiene trayectoria", () => {
  /*
   * ANCLA DEL RECORREDOR. Sin esto el gate falla ABIERTO: si el resolver de
   * imports se rompe —un alias nuevo, una extensión que no contempla—, el
   * recorrido no visita nada, el patrón no matchea y las 30 aserciones de abajo
   * firman verde sobre un sitio sin vigilancia. Se exige un texto que NO está en
   * el `page.tsx` sino en un módulo importado, así que encontrarlo prueba que el
   * recorrido cruza al menos un salto.
   */
  it("el recorredor cruza imports: encuentra copy que no está en el page.tsx", () => {
    const precios = PAGINAS.find((p) => p.ruta === "/precios");
    expect(precios, "no existe la página /precios").toBeDefined();

    const hallado = cadenaHastaTexto(archivoDe(precios!), /Reservas online/i);
    expect(
      hallado,
      "el recorredor no encontró 'Reservas online', que vive en lib/pricing.ts: " +
        "el resolver de imports está roto y este gate mide en falso",
    ).not.toBeNull();
    expect(
      hallado!.cadena.length,
      "'Reservas online' se encontró en el propio page.tsx: el ancla dejó de " +
        "probar que se cruzan imports",
    ).toBeGreaterThan(1);
  });

  /**
   * ANCLA DEL PATRÓN, mitad que tiene que CAZAR. El primero es el texto REAL que
   * producción servía el 2026-09-26; los dos que siguen son las dos frases que
   * `lib/proof.ts` nombra como prohibidas, o sea el criterio que ya estaba
   * escrito. Un gate cuyo patrón no se prueba contra el defecto vivo es un gate
   * que va a pasar en verde el día que alguien lo toque.
   */
  it("el patrón reconoce la confesión viva y las formas que el repo ya prohibía", () => {
    for (const vivo of [
      "Somos una empresa nueva y lo decimos de frente: no tenemos un muro de logos " +
        "ni casos de éxito con números espectaculares — y antes que inventarlos, " +
        "preferimos no tenerlos todavía.",
      "somos nuevos",
      "Todavía no tenemos casos de éxito que mostrarte.",
      "Recién empezamos, así que no tenemos testimonios.",
      "Aún no podemos mostrarte logos de clientes.",
    ]) {
      expect(
        CARENCIA_DE_TRAYECTORIA.test(vivo),
        `el patrón dejó de reconocer una carencia admitida: «${vivo}»`,
      ).toBe(true);
    }
  });

  /**
   * ANCLA DEL PATRÓN, mitad que tiene que PERDONAR — la que evita que este gate
   * se convierta en una orden de borrar honestidades obligatorias. Cada una está
   * exigida o defendida por otro gate de esta misma carpeta.
   */
  it("el patrón perdona la advertencia fiscal, el compromiso de método y al lead", () => {
    for (const [texto, porque] of [
      [
        "Facturación fiscal, de frente: nuestro emisor está en trámite de homologación " +
          "ante el SIN y todavía no emite factura con valor fiscal.",
        "promesa-fiscal.test.ts EXIGE esa advertencia: cazarla mandaría a borrarla",
      ],
      [
        "Sin métricas infladas: te mostramos el método y decidís.",
        "es un compromiso sobre el método, no una confesión de carencia",
      ],
      [
        "El presupuesto de pauta es tuyo y te reportamos qué se gastó y qué pasó, sin maquillaje.",
        "prometer no maquillar es lo que reemplaza al muro de logos inventado",
      ],
      [
        "Nada se publica sin tu aprobación.",
        "una negación sobre el proceso no es una carencia nuestra",
      ],
      [
        'paraQuien: "El que no tiene nada todavía, o el que recién arranca con su negocio."',
        "niega algo del LEAD, no nuestro: por eso la negación exige primera persona",
      ],
      [
        "No hace falta que tengas casos de éxito ni cartera de clientes para empezar.",
        "la prueba social nombrada es la del lead, y la negación también es suya",
      ],
      [
        "Tu negocio es nuevo y necesita vender desde el primer mes.",
        "«nuevo» dicho del negocio del lead no es decirse nuevo uno mismo",
      ],
    ] as const) {
      expect(
        CARENCIA_DE_TRAYECTORIA.test(texto),
        `el patrón se comió algo legítimo: ${porque} — «${texto}»`,
      ).toBe(false);
    }
  });

  it.each(PAGINAS.map((p) => [p.ruta || "/", p] as const))(
    "%s no admite que no tenemos trayectoria",
    (ruta, pagina) => {
      const hallado = cadenaHastaTexto(archivoDe(pagina), CARENCIA_DE_TRAYECTORIA);
      expect(
        hallado,
        hallado
          ? `${ruta} le confiesa al lead que no tenemos trayectoria: ` +
            `"${hallado.encontrado.trim()}" — llega por ${hallado.cadena.join(" → ")}. ` +
            `Cero autobombo (CLAUDE.md) incluye el autobombo que se disculpa: ` +
            `no se habla de nosotros, y lo que no está no se nombra. La salida no ` +
            `es inventar la prueba que falta — es sacar la frase.`
          : "",
      ).toBeNull();
    },
  );
});
