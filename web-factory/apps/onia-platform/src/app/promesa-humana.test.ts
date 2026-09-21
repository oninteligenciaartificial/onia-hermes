import { describe, expect, it } from "vitest";

import { PAGINAS, archivoDe, cadenaHastaTexto } from "./rutas";

/**
 * Ninguna página promete TRABAJO HUMANO que nadie del otro lado va a hacer.
 *
 * **Lo que se escapaba, medido el 2026-09-06 en el wizard de `/v1/empezar`**,
 * en las dos pantallas del final del embudo —el lead más caliente del sitio,
 * el que ya contestó todo—:
 *
 * - `steps.tsx`, debajo del campo donde se le pide la URL de su web: *«El
 *   análisis lo hace una persona del equipo, no un robot — te lo mandamos por
 *   WhatsApp en el día.»*
 * - `resultado.tsx`: *«Tu web: {url}. Una persona del equipo la revisa y te
 *   manda el análisis gratis por WhatsApp en el día.»*
 *
 * Las dos son falsas por tres motivos independientes, y cualquiera alcanzaba:
 *
 * 1. **No hay equipo.** Lo vende Sergio Urcullo, solo. `CLAUDE.md` es
 *    explícito desde el 2026-08-27. Inventar «una persona del equipo» es la
 *    misma prueba social fabricada que un testimonio inventado, sólo que en vez
 *    de un cliente falso inventa una empresa falsa — y encima se lucía contra
 *    «un robot», o sea que la ficción era el argumento de venta.
 * 2. **No hay circuito que lo entregue.** El wizard no manda NADA a un servidor
 *    nuestro (es su spec §4: la única salida es el `wa.me` que abre el propio
 *    lead). La URL que escribe existe sólo en el navegador: si no aprieta el
 *    botón de WhatsApp, nadie se entera de que la dejó. No hay cola, ni tarea,
 *    ni aviso. La promesa no llega tarde: no llega nunca.
 * 3. **«En el día» es un SLA**, y no lo cablea nada. Es el mismo defecto que el
 *    panel anunciando «corre cada 1 h» sobre un cron diario: el número es
 *    legítimo y lo que falla es el cruce contra lo que el sistema entrega.
 *
 * **Por qué ningún instrumento del carril lo veía**, que es lo que lo hace una
 * clase y no un typo. Pasaba los cuatro cortes que ya existen:
 *
 * - No usa **ni una** palabra prohibida (`muy pronto`, `beta`, `próximamente`):
 *   el barrido de obra es una lista de INCLUSIÓN y esto no exhibe obra, exhibe
 *   una capacidad que no tenemos. Es la dirección contraria y sale gratis.
 * - No hay **precio** fuera de fuente, ni **enlace** roto: los otros dos
 *   números del objetivo miran para otro lado.
 * - No se ve en **producción**: se pinta recién tras cuatro clics del wizard, y
 *   la mitad de `steps.tsx` sólo aparece si el lead marcó «tengo web». Ni la
 *   captura ni el `curl` de la URL la alcanzan.
 * - `grep` sobre `v1/empezar/page.tsx` da **cero**: el texto vive dos saltos más
 *   adentro (`page` → `wizard` → `steps`).
 *
 * ⚠️ **Lo que este gate NO prohíbe, a propósito.** La firma es *gente NUESTRA
 * haciéndole un trabajo al lead*, no la palabra «equipo» ni la palabra
 * «instante»:
 *
 * - **El equipo del LEAD.** «Tus fotos: del local, del equipo o de tus
 *   trabajos» (`content/requisitos.ts`) y el `aria-label` de `agent-scene`,
 *   donde quien aprueba el cambio de cita es del negocio del cliente. Por eso
 *   la condición no es el sustantivo solo: hace falta además un verbo de
 *   servicio dirigido al lead.
 * - **Lo que promete una MÁQUINA.** «Contesta al instante a cualquier hora» es
 *   el chatbot, y lo cumple: es software corriendo, no una persona. Por eso el
 *   plazo sólo se juzga cuando lo promete alguien en primera persona plural.
 * - **La ventana de Meta.** «Responder dentro de las 24 horas desde que el
 *   cliente escribe no lo cobra Meta» es un hecho técnico de un tercero.
 */

/** No cruza fin de oración: una persona lee una frase, no un archivo. */
const SEP = '[^.;!?"]';

/**
 * Gente NUESTRA. No alcanza «el equipo» a secas —ese suele ser el del lead—:
 * hace falta la forma que sólo puede referirse a nosotros.
 */
const GENTE_NUESTRA =
  "\\b(?:(?:una persona|alguien|un[ao]s? \\w+) del equipo|nuestro equipo|" +
  "nuestr[oa]s? (?:t[eé]cnic[oa]s?|especialistas?|expert[oa]s?|asesor(?:es)?|dise[nñ]ador(?:es|as)?)|" +
  "un asesor|un[ao] de nosotr[oa]s)\\b";

/** Un verbo de servicio dirigido al lead: lo que convierte al sustantivo en promesa. */
const ACCION_AL_LEAD =
  "\\b(?:te (?:lo |la |los |las )?(?:mand|escrib|env[ií]|pas|arm|prepar|revis|analiz|audit)\\w*|" +
  "(?:lo|la|los|las) (?:revisa|analiza|prepara|arma|audita|mira)|" +
  "(?:revisamos|analizamos|mandamos|preparamos|armamos|auditamos|miramos))\\b";

/** Un plazo comprometido. Sólo cuenta si lo promete una persona (ver abajo). */
const PLAZO =
  "\\b(?:en el (?:mismo )?d[ií]a|en menos de \\d+|en (?:24|48) ?horas?|" +
  "dentro de (?:las )?\\d+ ?horas?|en el momento|al instante|de inmediato)\\b";

/** Nos comprometemos NOSOTROS, en primera persona: distinto de lo que hace el bot. */
const COMPROMISO_NUESTRO =
  "\\b(?:te (?:lo |la |los |las )?(?:mandamos|escribimos|enviamos|pasamos|avisamos|contactamos)|" +
  "(?:respondemos|contestamos|te respondemos|te contestamos))\\b";

/** Una oración que contiene los dos ingredientes, en cualquier orden. */
function oracionCon(a: string, b: string): RegExp {
  return new RegExp(
    `(?:^|["\\.;!?]\\s*)((?=${SEP}*?${a})(?=${SEP}*?${b})${SEP}+)`,
    "i",
  );
}

/**
 * Una persona SIN nombrar de quién es, haciéndole algo al lead. Es la forma que
 * se escapaba: `GENTE_NUESTRA` pide la palabra «equipo» al lado («alguien DEL
 * EQUIPO»), y el copy vivo decía «alguien que te la explica» —sin equipo, sin
 * plazo y sin primera persona—, así que no entraba por ninguna de las dos
 * puertas. Lo que la vuelve promesa NUESTRA no es el sustantivo: es que el verbo
 * apunta al lead (`te` + acción), porque a esa persona la ponemos nosotros.
 *
 * Por eso NO alcanza con `\balguien\b`: el sitio lo usa bien cuatro veces —quien
 * aprueba una propuesta en el panel, el que pregunta un sábado por WhatsApp, el
 * que tiene el celular el día de activar Meta y «del otro lado hay alguien que
 * conoce el sistema» en /contacto, que es una llamada agendada con Sergio
 * Urcullo y sí ocurre—. Ninguna lleva `te` + verbo.
 */
const PERSONA_SIN_DUEÑO = "\\b(?:alguien|una persona)\\b";
const TE_LO_HACE =
  "\\bte (?:lo |la |los |las )?" +
  "(?:explica|configura|instala|carga|migra|capacita|arma|ense[nñ]a)\\w*\\b";

/**
 * Trabajo MANUAL nuestro sobre las cosas del lead, en primera persona del plural.
 * No necesita segundo ingrediente: «cargamos tus datos» ya no lo puede hacer una
 * máquina ni el negocio del cliente.
 *
 * Deliberadamente NO incluye «te entregamos»: la cuenta sí llega con la
 * configuración del rubro puesta, y eso lo hace el alta sola. Un gate que se come
 * una promesa verdadera obliga a borrar copy sano, que es como se desactiva.
 *
 * Tampoco «acompañamos», y esto lo decidió el gate al ponerse rojo sobre
 * `content/requisitos.ts`: «Dominio: lo comprás vos… te acompañamos en el
 * trámite» es de los stacks de webs, que son un servicio PAGO y que Sergio
 * Urcullo sí hace. Acompañar es estar al lado; el defecto de esta familia es
 * decir que hacemos NOSOTROS el trabajo del lead. Firmar sobre la primera habría
 * obligado a borrar el bloque más honesto del sitio, el que enumera lo que el
 * cliente paga aparte.
 */
const SERVICIO_MANUAL_NUESTRO =
  "\\b(?:te (?:lo |la |los |las )?(?:capacitamos|instalamos|configuramos|migramos|cargamos|explicamos)|" +
  "(?:capacitamos|instalamos|configuramos|migramos|cargamos)\\s+(?:a\\s+)?(?:tus?|el|la|los|las)\\s+\\w+)\\b";

/**
 * El mismo trabajo, NOMINALIZADO. Es el agujero que dejaban los cuatro de
 * arriba, medido el 2026-09-19 en `/v1/modulos/dental` (viva en producción):
 *
 * > «Sí, hay importación por CSV con asistente de columnas. Y si tenés los
 * > datos en otro sistema, escribinos y **te ayudamos con la migración**.»
 *
 * Es palabra por palabra la promesa que el hero ya había borrado por falsa
 * —«Migramos tus datos», ver `landing-v1/hero.tsx`: una migración hecha por
 * nosotros, sin nadie que la haga ni circuito que la arranque—, sobreviviendo
 * en la pantalla de al lado. Arreglar la instancia no cerró la clase.
 *
 * **Por qué los cuatro patrones anteriores son ciegos**: todos persiguen el
 * trabajo como VERBO conjugado (`migramos`, `cargamos`, `configuramos`). Acá
 * el trabajo viaja como SUSTANTIVO (`la migración`) y el verbo que queda es
 * uno de ayuda genérico. No nombra un plazo, no nombra un equipo, no nombra
 * una persona: no entra por ninguna de las cuatro puertas.
 *
 * Y es de las caras: el techo del negocio no es técnico, son **horas de
 * soporte por cliente** (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §9). Una promesa de
 * trabajo manual gratis en la FAQ escala con cada cliente que entra.
 *
 * ⚠️ **`implementación` queda FUERA de la lista, a propósito.** El sitio
 * vende implementación acompañada de verdad: es PAGA, sólo Grupo / Empresarial
 * la lleva y se cotiza aparte (`lib/pricing.ts`). Firmarla acá obligaría a
 * borrar copy sano, que es como se desactiva un gate. La firma del defecto es
 * prometer GRATIS, de arrastre, trabajo manual que nadie va a hacer.
 */
const AYUDA_NUESTRA =
  "\\b(?:te (?:lo |la |los |las )?(?:ayudamos|asistimos)|te damos una mano|" +
  "nos encargamos|nos ocupamos)\\b";
const TRABAJO_NOMINAL =
  "\\b(?:la|el|tu|tus|una|el)\\s+(?:migraci[oó]n|mudanza|traspaso|carga|" +
  "importaci[oó]n|configuraci[oó]n|instalaci[oó]n|capacitaci[oó]n|puesta en marcha)\\b";

/** A) Una persona nuestra le hace un trabajo al lead. */
const TRABAJO_HUMANO = oracionCon(GENTE_NUESTRA, ACCION_AL_LEAD);
/** B) Nos comprometemos nosotros, con plazo. */
const PLAZO_COMPROMETIDO = oracionCon(COMPROMISO_NUESTRO, PLAZO);
/** C) Una persona sin dueño que le hace algo al lead. */
const PERSONA_PROMETIDA = oracionCon(PERSONA_SIN_DUEÑO, TE_LO_HACE);
/** D) Nosotros, a mano, sobre lo del lead. */
const MANO_DE_OBRA = new RegExp(SERVICIO_MANUAL_NUESTRO, "i");
/** E) El mismo trabajo, dicho como sustantivo detrás de un verbo de ayuda. */
const TRABAJO_NOMINALIZADO = oracionCon(AYUDA_NUESTRA, TRABAJO_NOMINAL);

const PROMESA = [
  { patron: TRABAJO_HUMANO, que: "promete que una persona nuestra le hace un trabajo" },
  { patron: PLAZO_COMPROMETIDO, que: "le pone un plazo a algo que hacemos nosotros" },
  { patron: PERSONA_PROMETIDA, que: "promete una persona que le explica o le arma algo" },
  { patron: MANO_DE_OBRA, que: "promete mano de obra nuestra sobre los datos del lead" },
  {
    patron: TRABAJO_NOMINALIZADO,
    que: "promete ayuda nuestra con un trabajo manual del lead (dicho como sustantivo)",
  },
];

describe("ninguna página promete trabajo humano que nadie va a hacer", () => {
  /*
   * El ancla del recorredor: sin esto el gate falla ABIERTO. Si el resolver de
   * imports se rompe, el recorrido no visita nada, ningún patrón matchea y todo
   * queda VERDE sobre un sitio sin vigilancia. Se ancla en `/v1/empezar` porque
   * el defecto que originó el gate vive dos saltos adentro, que es el caso que
   * distingue esto de un `grep`.
   */
  it("el recorredor llega a steps.tsx, dos saltos adentro del wizard", () => {
    const wizard = PAGINAS.find((p) => p.ruta === "/v1/empezar");
    expect(wizard, "no existe la página /v1/empezar").toBeDefined();
    const hallado = cadenaHastaTexto(archivoDe(wizard!), /Pasanos tu web y la analizamos/i);
    expect(hallado, "el recorredor no llegó a steps.tsx: mide en falso").not.toBeNull();
    expect(hallado!.cadena.length).toBeGreaterThan(2);
  });

  it("el patrón reconoce las dos promesas vivas", () => {
    for (const vivo of [
      "El análisis lo hace una persona del equipo, no un robot — te lo mandamos por WhatsApp en el día.",
      "Tu web: tunegocio.com.bo. Una persona del equipo la revisa y te manda el análisis gratis por WhatsApp en el día.",
      "Nuestro equipo te prepara la migración.",
      "Te lo mandamos en menos de 24 horas.",
      // Las dos que este gate NO veía, tal como estaban servidas el 2026-09-07.
      "Sin instalación ni proyecto de meses: te entregamos el sistema con la configuración de tu rubro puesta y alguien que te la explica.",
      "Te lo dejamos andando nosotros: cargamos tus datos y capacitamos a tu equipo.",
      // La nominalizada, tal como estaba servida en /v1/modulos/dental el 2026-09-19.
      "Y si tenés los datos en otro sistema, escribinos y te ayudamos con la migración.",
      "Nos encargamos de la carga de tus pacientes.",
      "Te damos una mano con la configuración.",
    ]) {
      expect(
        PROMESA.some((p) => p.patron.test(vivo)),
        `el gate dejó de reconocer una promesa de trabajo humano: «${vivo}»`,
      ).toBe(true);
    }
  });

  it("el patrón perdona al equipo del lead, a la máquina y a la ventana de Meta", () => {
    for (const [texto, porque] of [
      [
        "Tus fotos: del local, del equipo o de tus trabajos. Los archivos originales, no capturas de WhatsApp.",
        "«del equipo» acá es el del LEAD, y no le hacemos nada nosotros",
      ],
      [
        "Demostracion animada: la cita se mueve al nuevo dia y una persona del equipo aprueba el cambio.",
        "en la escena del producto, quien aprueba es del negocio del cliente",
      ],
      [
        "Contesta al instante a cualquier hora —también el domingo y el feriado— con la información real que vos publicaste.",
        "lo promete el chatbot, que es software y sí lo cumple: no es trabajo humano",
      ],
      [
        "Responder dentro de las 24 horas desde que el cliente escribe no lo cobra Meta.",
        "es un hecho técnico de un tercero, no un compromiso nuestro",
      ],
      [
        "Alguien con el celular en la mano el día que lo activamos: Meta manda un código y hay que pasárnoslo en el momento.",
        "el plazo es para el CLIENTE, no una promesa nuestra",
      ],
      [
        "Elegí el horario por WhatsApp y del otro lado hay alguien que conoce el sistema.",
        "es una llamada AGENDADA con Sergio Urcullo, que sí ocurre: no es trabajo prometido de arrastre",
      ],
      [
        "Cada propuesta espera en Pendientes hasta que alguien la aprueba.",
        "quien aprueba es del negocio del cliente, y no le hacemos nada nosotros",
      ],
      [
        "Te entregamos el sistema con la configuración de tu rubro puesta.",
        "eso lo hace el alta sola: es verdad, y un gate que la come obliga a borrar copy sano",
      ],
      [
        "Dominio: lo comprás vos con tu tarjeta, a tu nombre. Te acompañamos en el trámite pero nunca tocamos tu medio de pago.",
        "es un servicio PAGO (los stacks de webs) que Sergio Urcullo sí hace, y acompañar no es hacerle el trabajo",
      ],
      [
        "Para varias razones sociales o un grupo de negocios: mismos límites más una implementación acompañada. No se compra en línea — se cotiza con tu caso.",
        "la implementación de Grupo / Empresarial es PAGA y cotizada: firmarla obliga a borrar copy sano",
      ],
      [
        "Hay importación por CSV con asistente de columnas: subís el archivo y el sistema te va diciendo qué columna es cada cosa.",
        "la importación la hace el LEAD con una pantalla que existe, no nosotros a mano",
      ],
    ] as const) {
      expect(
        PROMESA.some((p) => p.patron.test(texto)),
        `el patrón se comió algo legítimo: ${porque}`,
      ).toBe(false);
    }
  });

  it("ninguna página servida promete trabajo humano ni le pone plazo", () => {
    /*
     * Un solo `it` y no uno por página: el texto del wizard lo sirven varias
     * rutas, así que UN defecto las pondría rojas a todas y el reporte se
     * volvería ilegible. Acá se nombra el texto, por dónde entra y cuántas
     * pantallas lo sirven.
     */
    for (const { patron, que } of PROMESA) {
      const tocadas = PAGINAS.map((p) => ({
        p,
        hallado: cadenaHastaTexto(archivoDe(p), patron),
      })).filter((x) => x.hallado !== null);

      const primera = tocadas[0];
      expect(
        primera ? `«${primera.hallado!.encontrado.trim()}»` : null,
        primera
          ? `esta frase ${que}, y la sirven ${tocadas.length} pantalla(s). ` +
            `Entra por ${primera.hallado!.cadena.join(" → ")}. ` +
            `No hay equipo (lo vende Sergio Urcullo solo) y el wizard no manda ` +
            `nada a un servidor nuestro: lo que el lead escribe muere en su ` +
            `navegador si no abre el WhatsApp. Prometé sólo lo que el canal cumple.`
          : "",
      ).toBeNull();
    }
  });
});
