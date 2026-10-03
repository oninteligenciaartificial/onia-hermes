import { beforeAll, describe, expect, it } from "vitest";

import * as siat from "@/lib/siat";

import { textoDeHtml } from "../../../scripts/promesa-que-el-producto-cumple.mjs";
import {
  PAGINA_DE_RUTA,
  RUTAS_PUBLICADAS,
  TIEMPO_PARA_RENDERIZAR,
  htmlDe,
  renderizarPublicadas,
} from "../html-servido";

/**
 * Ninguna superficie servida afirma como VIGENTE la obligación del 1 de octubre
 * de 2026 (grupos 9° al 12°, RND 102600000007).
 *
 * **Lo que pasó.** El 30 de septiembre de 2026 la RND 102600000038 abrogó las
 * cuatro RND que designaban a los grupos 9° al 12° (102400000004, 005, 012 y
 * 025) y dejó «sin efecto los plazos de incorporación»; su Par. II dice que el
 * SIN asignará periódicamente una modalidad en línea a los sujetos pasivos del
 * IVA que todavía no tengan ninguna. Tres días después `onia.com.bo/facturacion`
 * seguía titulando *«Desde el 1 de octubre de 2026, miles de negocios en Bolivia
 * facturan únicamente en línea»*, y `/guia-facturacion` prometía decirte *«si te
 * toca el 1 de octubre»*: una afirmación legal falsa en la página que capta la
 * búsqueda más valiosa del sitio, y en su meta description, que es lo que se lee
 * en Google y en la tarjeta de WhatsApp. Lo encontró el crítico de la decisión
 * SIAT leyendo el PDF del SIN (`hermes-content/docs/ONIA_FACTURACION_ESTADO_REAL.md`
 * §2.6), no un gate.
 *
 * **Por qué ningún gate lo veía.** `plazo-que-vence.test.ts` pregunta por el
 * TIEMPO VERBAL y la frase estaba en presente, que era justo lo que pedía. Los
 * barridos de obra, de promesas y de precios miran lo que NOSOTROS controlamos.
 * Esto es una norma de un tercero que cambió por su cuenta: la frase era verdad
 * el 29-sep y mentira el 30, sin que nadie tocara el código.
 *
 * **Lo que mide.** Una oración que nombra el plazo viejo (el 1 de octubre, la
 * RND 102600000007 o los grupos 9° al 12°), habla de facturación y lo AFIRMA en
 * presente («facturan», «deben», «rige», «te toca», «obligado»…) tiene que decir
 * en la misma oración que quedó sin efecto. Las preguntas no afirman nada (la
 * del lead, «¿sigo obligado desde el 1 de octubre?», es justo la que la página
 * tiene que tener). La historia en pasado («la RND 102600000007 lo había movido
 * al 30 de septiembre») tampoco: no afirma la obligación.
 *
 * **Sobre qué.** Lo que se SIRVE, no el código: el texto visible de cada ruta
 * publicada (`renderizarPublicadas`), sus datos estructurados (JSON-LD, los lee
 * Google), su `metadata` (title, description, Open Graph) y cada texto de
 * `@/lib/siat`. Una página nueva que entre al sitemap queda vigilada sola.
 */

/** El plazo viejo, escrito como lo escribe la gente. */
const NOMBRA_EL_PLAZO =
  /\b(1|1º|1°|01)\s*(de\s*)?oct(ubre)?\b|\b0?1-oct\b|01[-/]10[-/]2026|2026-10-01|RND\s*(N[°º]\s*)?102600000007|\bgrupos?\s*(9|9°|9º|noveno)\b|\b9°\s*(al|a)\s*12/i;

/**
 * Que la oración es sobre facturación y no, por ejemplo, sobre la tarifa de Meta del mismo día.
 * «Grupos alcanzados» y «transición» cuentan: la FAQ vieja cerraba con «Ese fue el último día de
 * transición: desde el 1 de octubre de 2026 rige para los grupos alcanzados», sin ninguna otra
 * palabra fiscal en la oración (la tenía la anterior).
 */
const HABLA_DE_FACTURAR =
  /factur|en\s+l[ií]nea|\bSIAT\b|\bSIN\b|modalidad|\bemit|emisi[oó]n|contribuyente|\bRND\b|\balcanzad[oa]s\b|transici[oó]n/i;

/** Que la afirma como vigente, en presente. */
const LA_AFIRMA =
  /\bfacturan\b|\bemiten\b|\bdeben\b|\bdebe\b|\brige\b|\bobligad[oa]s?\b|\bobligatori[oa]s?\b|\bsolo\s+pueden\b|\bsolo\s+se\s+factura\b|[uú]nicamente|exclusivamente|\bte\s+toca\b|\bte\s+alcanza\b|\balcanzad[oa]s\b|[uú]ltimo\s+d[ií]a|\bfin\s+del\s+plazo\b|\bvence\b/i;

/** Que en la misma oración dice que ya no rige. */
const LA_DA_POR_CAIDA =
  /sin\s+efecto|abrog|102600000038|\bya\s+no\s+(rige|corre|obliga)|deroga/i;

/** Una oración por vez: una persona lee una frase, no un archivo. */
function oraciones(texto: string): string[] {
  return texto
    .split(/(?<=[.?!;])\s+|\n+/)
    .map((o) => o.trim())
    .filter(Boolean);
}

/** Las oraciones que dan por vigente la obligación del 1-oct. */
function afirmanElPlazoViejo(texto: string): string[] {
  return oraciones(texto).filter(
    (o) =>
      !o.startsWith("¿") &&
      !o.endsWith("?") &&
      NOMBRA_EL_PLAZO.test(o) &&
      HABLA_DE_FACTURAR.test(o) &&
      LA_AFIRMA.test(o) &&
      !LA_DA_POR_CAIDA.test(o),
  );
}

/**
 * Urgencia SIN fecha. El detector de arriba solo mira oraciones que NOMBRAN el plazo, y
 * después del primer arreglo del 3-oct quedaron dos que lo daban por hecho sin nombrarlo:
 * «Mirarlo hoy y no en la última semana es la diferencia entre resolverlo tranquilo y no
 * llegar» (paso 2 de la guía) y el h2 «Las tres formas de no llegar». La RND 102600000038 no
 * fija fecha: una página fiscal que apura inventa el plazo que la norma sacó.
 */
const INSINUA_UN_PLAZO =
  /\bno\s+llegar\b|\bllegar\s+a\s+tiempo\b|[úu]ltima\s+semana|\bse\s+te\s+(pasa|vence|acaba)\b|\bquedan?\s+(solo\s+)?\d+\s+d[ií]as\b|\bcontra\s+reloj\b|\bapur[aá]te\b|\bfecha\s+l[ií]mite\b|\bya\s+es\s+tarde\b/i;

/** Las oraciones que apuran hacia un plazo que no existe. */
function insinuanUnPlazo(texto: string): string[] {
  return oraciones(texto).filter((o) => INSINUA_UN_PLAZO.test(o));
}

/** Toda cadena de un valor cualquiera (un módulo, un JSON-LD, una `metadata`). */
function cadenas(valor: unknown, salida: string[] = []): string[] {
  if (typeof valor === "string") salida.push(valor);
  else if (Array.isArray(valor)) valor.forEach((v) => cadenas(v, salida));
  else if (valor && typeof valor === "object") Object.values(valor).forEach((v) => cadenas(v, salida));
  return salida;
}

/** Lo que la ruta le muestra al visitante y a Google: el texto visible y el JSON-LD, por separado. */
function textosDelHtml(html: string): string[] {
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(
    (m) => cadenas(JSON.parse(m[1])),
  );
  const visible = textoDeHtml(html.replace(/<script[\s\S]*?<\/script>/gi, " "));
  return [visible, ...jsonLd];
}

describe("ninguna superficie servida da por vigente el plazo del 1 de octubre", () => {
  let renderizadas: Map<string, string | Error>;
  const metadatas = new Map<string, string[]>();

  beforeAll(async () => {
    renderizadas = await renderizarPublicadas();
    for (const ruta of RUTAS_PUBLICADAS) {
      const cargar = PAGINA_DE_RUTA.get(ruta);
      if (!cargar) continue;
      const modulo = (await cargar()) as unknown as { metadata?: unknown };
      metadatas.set(ruta, cadenas(modulo.metadata));
    }
  }, TIEMPO_PARA_RENDERIZAR);

  it("el universo trae las dos páginas fiscales y mide su texto real", () => {
    // Ancla: si las rutas salen del sitemap o el render deja de traer su titular,
    // los casos de abajo pasarían en verde sin mirar la página que importa.
    for (const ruta of ["/facturacion", "/guia-facturacion"]) {
      expect(RUTAS_PUBLICADAS, `${ruta} salió de lo publicado`).toContain(ruta);
      expect(metadatas.get(ruta)?.length ?? 0, `${ruta} sin metadata legible`).toBeGreaterThan(2);
    }
    const [visible, ...jsonLd] = textosDelHtml(htmlDe(renderizadas, "/facturacion"));
    expect(visible).toContain(siat.SIAT_TITULAR);
    // El JSON-LD se mira SOLO: la respuesta del FAQ también se pinta visible, y
    // mezclados (así estaba hasta el 3-oct) este ancla pasaba aunque la extracción
    // del <script> se rompiera y el gate dejara de leer lo que lee Google.
    expect(jsonLd, "el FAQ del JSON-LD no se leyó").toContain(siat.SIAT_FAQ[0].a);
    expect(jsonLd, "el FAQ del JSON-LD no se leyó").toContain(siat.SIAT_FAQ[0].q);
    const [, ...jsonLdGuia] = textosDelHtml(htmlDe(renderizadas, "/guia-facturacion"));
    expect(jsonLdGuia, "el HowTo de la guía no se leyó").toContain(siat.SIAT_GUIA_BAJADA);
    expect(NOMBRA_EL_PLAZO.test(visible), "la página dejó de nombrar el plazo: el gate no mide nada").toBe(true);
  });

  it("los textos de @/lib/siat no lo afirman", () => {
    const textos = cadenas(siat);
    expect(textos.length).toBeGreaterThan(15);
    expect(textos.flatMap(afirmanElPlazoViejo)).toEqual([]);
  });

  for (const ruta of RUTAS_PUBLICADAS) {
    it(`${ruta} no lo afirma (texto, JSON-LD y metadata)`, () => {
      const culpables = [...textosDelHtml(htmlDe(renderizadas, ruta)), ...(metadatas.get(ruta) ?? [])].flatMap(
        afirmanElPlazoViejo,
      );
      expect(
        culpables,
        "la RND 102600000038 (30-sep-2026) dejó sin efecto el plazo del 1-oct de los grupos 9° al 12°: " +
          "decilo en la misma oración, o no lo afirmes. Fuente: hermes-content/docs/ONIA_FACTURACION_ESTADO_REAL.md §2.6",
      ).toEqual([]);
    });
  }

  it("sin plazo, las páginas fiscales no insinúan uno (texto, JSON-LD, metadata y @/lib/siat)", () => {
    const textos = [
      ...cadenas(siat),
      ...["/facturacion", "/guia-facturacion"].flatMap((ruta) => [
        ...textosDelHtml(htmlDe(renderizadas, ruta)),
        ...(metadatas.get(ruta) ?? []),
      ]),
    ];
    expect(
      textos.flatMap(insinuanUnPlazo),
      "la RND 102600000038 no fija fecha: apurar al lead hacia una es fabricar el plazo",
    ).toEqual([]);
  });
});

describe("el detector de urgencia sin fecha anda en las dos direcciones", () => {
  it("caza lo que quedó publicado después del primer arreglo", () => {
    for (const vieja of [
      "Mirarlo hoy y no en la última semana es la diferencia entre resolverlo tranquilo y no llegar.",
      "Las tres formas de no llegar.",
      "Dejarlo para la última semana de septiembre.",
    ]) {
      expect(insinuanUnPlazo(vieja), vieja).toHaveLength(1);
    }
  });

  it("deja pasar el orden del trámite, que no apura hacia ninguna fecha", () => {
    for (const sana of [
      "Miralo antes de empezar, así no te frena a mitad del trámite.",
      "Las tres cosas que traban el trámite.",
      "Se resuelve, pero no en una tarde, y hasta que no se resuelva el trámite queda parado.",
    ]) {
      expect(insinuanUnPlazo(sana), sana).toEqual([]);
    }
  });
});

describe("el detector anda en las dos direcciones", () => {
  it("caza lo que estuvo publicado hasta el 3-oct", () => {
    for (const vieja of [
      // SIAT_TITULAR
      "Desde el 1 de octubre de 2026, miles de negocios en Bolivia facturan únicamente en línea.",
      // SIAT_BAJADA
      "La RND 102600000007 del SIN fijó el 30 de septiembre de 2026 como último día de transición para los grupos 9° al 12° de contribuyentes.",
      "Desde el 1 de octubre, los alcanzados emiten únicamente por su modalidad de facturación en línea asignada.",
      // SIAT_FAQ
      "Desde esa fecha los grupos alcanzados solo pueden emitir por su modalidad de facturación en línea asignada (RND 102600000007).",
      "Ese fue el último día de transición: desde el 1 de octubre de 2026 rige para los grupos alcanzados.",
      // la meta description de /facturacion
      "Los grupos 9° al 12° de contribuyentes deben emitir por facturación en línea desde el 01-10-2026 (RND 102600000007).",
      // SIAT_GUIA_BAJADA
      "Una hoja: cómo saber si te toca el 1 de octubre y qué hacer, paso por paso, en la Oficina Virtual del SIN.",
      // la landing vieja de dentalgest
      "Desde el 1 de octubre, solo se factura en línea",
    ]) {
      expect(afirmanElPlazoViejo(vieja), vieja).toHaveLength(1);
    }
  });

  it("deja pasar lo que dice que quedó sin efecto, la pregunta del lead y la historia", () => {
    for (const sana of [
      "El SIN dejó sin efecto el plazo del 1 de octubre para facturar en línea.",
      "La RND 102600000038, del 30 de septiembre de 2026, abrogó las resoluciones que obligaban a los grupos 9° al 12° a facturar en línea desde el 1 de octubre de 2026.",
      "¿Sigo obligado a facturar en línea desde el 1 de octubre de 2026?",
      "Antes el plazo ya se había movido dos veces: la RND 102500000036 lo llevó a marzo de 2026 y la RND 102600000007, al 30 de septiembre de 2026.",
      "Plazo 01-10-2026 · sin efecto",
    ]) {
      expect(afirmanElPlazoViejo(sana), sana).toEqual([]);
    }
  });

  it("no confunde la fecha de otro tercero el mismo día", () => {
    // El 1-oct-2026 es también el día en que Meta empezó a cobrar las respuestas.
    expect(
      afirmanElPlazoViejo("Desde el 1 de octubre de 2026 Meta cobra también las respuestas dentro de las 24 horas."),
    ).toEqual([]);
  });

  it("separa el JSON-LD del texto visible, para que una pregunta no se pegue a su respuesta", () => {
    const html =
      '<h1>Título.</h1><script type="application/ld+json">' +
      JSON.stringify({ name: "¿Sigo obligado desde el 1 de octubre de 2026?", text: "Por esa fecha, no." }) +
      "</script>";
    const textos = textosDelHtml(html);
    expect(textos).toContain("¿Sigo obligado desde el 1 de octubre de 2026?");
    expect(textos.flatMap(afirmanElPlazoViejo)).toEqual([]);
  });
});
