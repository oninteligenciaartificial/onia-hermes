import { describe, expect, it } from "vitest";

import { PAGINAS, archivoDe, cadenaHastaTexto } from "./rutas";

/**
 * Ninguna página promete que el sistema SALE A BUSCAR los datos del negocio.
 *
 * **La clase, que es nueva y no la ve ningún gate del repo.** Los barridos que
 * ya existen persiguen tres cosas: lo que SOBRA (obra, autobombo, un precio a
 * mano), lo que FALTA (un rubro que el alta entrega y la venta no ofrece) y la
 * capacidad SIN SU LÍMITE (`limite-que-corta`). Ésta es una cuarta: **la venta
 * promete una capacidad cuyo motor existe, está cableado, responde 200 y tiene
 * sus tests en verde — y que en producción devuelve VACÍO en silencio porque le
 * falta una dependencia de entorno.**
 *
 * Es el modo de falla más difícil de ver que hay, porque las cinco preguntas
 * con las que este proyecto verifica dan todas que SÍ:
 *
 * 1. ¿Está el código? Sí: `onia-platform/lib/onboarding/extraccion/`, motor
 *    completo con orquestador, y `app/api/onboarding/extraer/route.ts`.
 * 2. ¿Está cableado? Sí: lo llama el alta (`app/onboarding/alta-negocio.tsx`).
 * 3. ¿Está detrás de un flag apagado? **No** — y por eso el chequeo de
 *    «construido ≠ terminado» pasa: no hay flag que mirar.
 * 4. ¿Sus tests pasan? Sí: el orquestador inyecta las dependencias de red, así
 *    que la suite corre entera contra fixtures y nunca toca producción.
 * 5. ¿La ruta responde? Sí, 200.
 *
 * **Lo que estaba vivo, medido el 2026-09-06.** `onia.com.bo/v1/prueba-gratis`
 * (HTTP 200) servía *"Le das el nombre de tu negocio y el sistema busca y carga
 * tus datos"*, y la FAQ de la home (que además se emite como JSON-LD FAQPage)
 * contestaba *"¿Cuánto tarda dejarlo andando?"* con *"el sistema busca tus datos
 * (tu web o tus redes) y los carga por vos"*. Ése es exactamente el camino que
 * no puede correr:
 *
 * - Con **sólo el nombre**, el orquestador depende del paso (3) «buscar por
 *   nombre» → `buscarNegocio()` → `SEARXNG_URL`. La propia función documenta que
 *   *"Devuelve [] si el buscador no esta configurado"*.
 * - `SEARXNG_URL` **no existe** en producción: 0 apariciones en
 *   `docker exec onia-platform env` y 0 en `/opt/onia-platform/app.env`.
 * - O sea que el lead que sigue la instrucción de la página escribe su nombre,
 *   mira el progreso «buscando…» y recibe el formulario **vacío**, con todo
 *   para tipear a mano. La página le prometió justo lo contrario.
 *
 * **Lo que SÍ corre y por eso el corte está en el verbo.** `traerHtml()` cae a
 * `fetch` nativo cuando no hay Crawl4AI, así que **el enlace que la persona
 * pega se lee de verdad** y sus datos se cargan solos. La promesa honesta es
 * ésa: *vos das el enlace, el sistema lo lee y lo carga*. Lo que no se puede
 * prometer es que lo ENCUENTRE por su cuenta. Por eso el gate persigue el verbo
 * de BÚSQUEDA con sujeto nuestro, y perdona el de CARGA: cargar lo que te
 * entregaron es real; salir a encontrarlo, hoy, no.
 *
 * ⚠️ **Este gate está atado a producción, no a un literal.** Un gate escrito
 * sobre un DATO tiene que anclar su valor a la fuente con respaldo, o cementa lo
 * que encontró: el día que `SEARXNG_URL` se configure, esta promesa vuelve a ser
 * cierta y el gate tiene que dejar de exigirla. La medición viva —la que
 * pregunta si el buscador está encendido— vive aparte, en
 * `scripts/busqueda-alta-viva.mjs` (`npm run busqueda:viva`), que sale 2 = NO
 * MEDIDO cuando no alcanza el contenedor: un gate que necesita estado externo no
 * se cablea a la cadena `npm test`, porque su rojo por AMBIENTE traba el merge
 * de los quince carriles.
 */

/** No cruza fin de oración ni de literal: una persona lee una frase, no un archivo. */
const SEP = '[^.;!?"]';

/** El que actúa es NUESTRO producto. Sin esto se come «buscá tu factura en el SIN». */
const SUJETO_NUESTRO = "\\b(?:el sistema|onia|la plataforma|el panel|nosotros|nuestro sistema)\\b";

/** Salir a ENCONTRAR algo que nadie le entregó. `carga`, `lee` y `completa` NO están: ésos corren. */
const VERBO_DE_BUSQUEDA =
  "\\b(?:busca|buscamos|buscar[aá]|encuentra|encontramos|encontrar[aá]|rastrea|rastreamos|averigua|averiguamos)\\b";

/**
 * Lo que se promete encontrar: la presencia del negocio del lead. Acotado a
 * propósito — «busca en tu catálogo» (el chatbot sobre datos ya cargados) es
 * otra capacidad, ésa sí viva, y no tiene que caer acá.
 */
const DATOS_DEL_LEAD =
  "\\b(?:tus datos|tu informaci[oó]n|tu negocio|tu web|tu sitio|tus redes|tu p[aá]gina)\\b";

/**
 * La oración que contiene las tres cosas, en cualquier orden. Los dos órdenes
 * importan: cubrir uno solo es medio barrido, y la mitad que no se cubre es
 * siempre la que se despega (pasó con «Bs 320» / «320 Bs» en `precios.test.ts`).
 */
const BUSCA_POR_VOS = new RegExp(
  `(?:^|["\\.;!?]\\s*)((?=${SEP}*?${SUJETO_NUESTRO})(?=${SEP}*?${VERBO_DE_BUSQUEDA})` +
    `(?=${SEP}*?${DATOS_DEL_LEAD})${SEP}+)`,
  "i",
);

describe("ninguna página promete que el sistema busque los datos del negocio", () => {
  /*
   * El ancla del recorredor. Sin esto el gate falla ABIERTO: si el resolver de
   * imports se rompe, el recorrido no visita nada, el patrón no matchea y todo
   * queda verde sobre un sitio sin vigilancia.
   *
   * Se ancla en `/v1`, que llega al texto en un salto (`page.tsx` →
   * `landing-v1/faq.tsx`): es donde vivía una de las dos copias, y un `grep`
   * sobre `page.tsx` da CERO sobre la página que la publica.
   */
  it("el recorredor llega al texto de la FAQ", () => {
    const home = PAGINAS.find((p) => p.ruta === "/v1");
    expect(home, "no existe la página /v1").toBeDefined();
    const hallado = cadenaHastaTexto(archivoDe(home!), /¿Cu[aá]nto tarda dejarlo andando\?/i);
    expect(hallado, "el recorredor no llegó a la FAQ: mide en falso").not.toBeNull();
    expect(hallado!.cadena.length).toBeGreaterThan(1);
  });

  /*
   * El caso que no puede faltar: un test de guarda escrito sólo contra el
   * archivo VIVO pasa en verde con la guarda arrancada, porque el texto de hoy
   * ya no dispara el patrón. Éstos son los dos textos REALES que producción
   * servía, con su contexto.
   */
  it("el patrón reconoce las dos promesas que estaban vivas", () => {
    for (const vivo of [
      "Un día. Te registrás solo, el sistema busca tus datos (tu web o tus redes) y los carga por vos.",
      "Sin instalación ni proyecto de meses. Le das el nombre de tu negocio y el sistema busca y carga tus datos.",
      "Onia encuentra tu web sola y completa el perfil",
    ]) {
      expect(
        BUSCA_POR_VOS.test(vivo),
        `el gate dejó de reconocer la promesa: «${vivo}»`,
      ).toBe(true);
    }
  });

  it("el patrón perdona cargar lo que la persona entregó, y la búsqueda del lead", () => {
    for (const [texto, porque] of [
      [
        "Pegás el enlace de tu web o tu red y el sistema carga tus datos por vos.",
        "cargar lo que te entregaron SÍ corre: traerHtml cae a fetch nativo",
      ],
      [
        "El sistema lee la página que le pasás y completa el perfil solo.",
        "leer un enlace dado es la promesa honesta y tiene que poder escribirse",
      ],
      [
        "Tu cliente busca tu negocio en Google y encuentra tu página.",
        "el que busca es el cliente del lead, no nuestro sistema",
      ],
      [
        "El chatbot busca en tu catálogo y contesta con el precio real.",
        "es otra capacidad, sobre datos ya cargados, y ésa sí corre",
      ],
    ] as const) {
      expect(BUSCA_POR_VOS.test(texto), `${porque}: «${texto}»`).toBe(false);
    }
  });

  /*
   * El barrido. Deriva sus sujetos del DISCO y sigue el grafo de imports, no el
   * texto del `page.tsx`: las dos copias vivas estaban en módulos importados
   * (`components/landing-v1/faq.tsx` y el cuerpo de `/v1/prueba-gratis`), así
   * que un grep sobre las páginas da CERO sobre las páginas que las publican.
   */
  it("ninguna página publica la promesa", () => {
    const culpables: string[] = [];
    for (const pagina of PAGINAS) {
      const hallado = cadenaHastaTexto(archivoDe(pagina), BUSCA_POR_VOS);
      if (hallado) culpables.push(`${pagina.ruta} → ${hallado.cadena.join(" → ")}`);
    }
    expect(
      culpables,
      "una página promete que el sistema sale a buscar los datos del negocio; en producción " +
        "esa búsqueda devuelve vacío (falta SEARXNG_URL). Prometé el camino que sí corre: " +
        "la persona pega el enlace y el sistema lo lee. Medilo con: npm run busqueda:viva",
    ).toEqual([]);
  });
});
