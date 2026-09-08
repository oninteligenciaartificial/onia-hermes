import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { PLANES } from "@/lib/pricing";

/**
 * Lo que el precio anunciado COMPRA. El eje es el par (capacidad, precio).
 *
 * Medido el 2026-09-07 en `/v4`, servida por producción con 200. Su hero dice,
 * en el mismo bloque y con dos líneas de por medio:
 *
 *   «…con agentes que trabajan de noche y te dejan las decisiones a vos.»
 *   «14 días de prueba con el plan Pro, sin tarjeta. Después, desde Bs 320 al mes.»
 *
 * Y `PLANES[0].sinEsto` —el Básico, que es el que cuesta esos Bs 320— dice
 * textualmente «Agentes de IA (vienen desde Pro)». O sea: el lead lee que el
 * sistema tiene agentes, lee que cuesta desde Bs 320, y las dos frases son
 * ciertas por separado y falsas juntas. Los agentes se le apagan al pagar.
 *
 * El daño ya está escrito en la fuente, en el comentario de `NOTA_PRUEBA_POR_PLAN`
 * (`lib/pricing.ts`): «quien elegía el Básico probaba 14 días de Pro y recién al
 * pagar Bs 320 se le apagaban los agentes, las reservas online y los reportes
 * completos». La decepción llega DESPUÉS de cobrar.
 *
 * POR QUÉ NINGÚN GATE LO VEÍA, que es lo que hace nueva a esta clase:
 *  - no sobra ninguna palabra → invisible a `obra.test.ts`, `forma.test.ts`,
 *    `hueco-declarado.test.ts`;
 *  - `Bs 320` sale de `plan("basico").mensual` → `precios.test.ts` y
 *    `precios-addons.test.ts` pasan en verde;
 *  - no promete gente nuestra → invisible a `promesa-humana.test.ts`;
 *  - a la capacidad no le falta su límite, le falta su PRECIO → invisible a
 *    `limite-que-corta.test.ts`;
 *  - la nota de la prueba se LEE de `PRUEBA` en vez de tipearse, así que
 *    `prueba-vs-plan.test.ts` pasa: ese gate vigila las TARJETAS de precio y
 *    pregunta «¿dice con qué plan corre la prueba?». El hero no es una tarjeta
 *    y sí dice con qué plan corre. Su defecto es otro: promete una capacidad
 *    que el precio de al lado no compra.
 *
 * Es el mismo salto que la casa ya pagó con `/comercio/caja` y el correo de
 * cita: se ató la salvedad a UNA pieza y no viajó a la HERMANA. Acá la pieza
 * cubierta es la tarjeta de precio y la que quedó afuera es el hero, que es
 * donde el lead lee el precio PRIMERO.
 *
 * El sujeto es la VECINDAD, no el archivo: una persona lee un párrafo. Es la
 * misma corrección que `promesa-fiscal.test.ts` ya tuvo que hacer, cuando una
 * declaración de principios a 90 líneas de distancia absolvía al defecto.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = join(AQUI, "..", "..");

/**
 * Sujetos derivados del DISCO: una pantalla nueva nace cubierta y hay que
 * excluirla a la vista. `/v4` nació hoy y este gate la vio sin tocarlo.
 */
const EXENTOS = [
  join("lib", "pricing.ts"), // la fuente: acá viven las exclusiones, con su texto
];

function pantallas(dir: string, acc: string[] = []): string[] {
  for (const entrada of readdirSync(dir)) {
    if (entrada === "node_modules" || entrada.startsWith(".")) continue;
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) {
      pantallas(ruta, acc);
      continue;
    }
    if (!/\.tsx?$/.test(entrada)) continue;
    if (/\.test\.tsx?$/.test(entrada)) continue;
    if (EXENTOS.some((e) => ruta.endsWith(e))) continue;
    acc.push(ruta);
  }
  return acc;
}

const PANTALLAS = pantallas(join(SRC, "app"));

/**
 * Comentarios fuera, por estado y no por prefijo: el interior de un
 * `{/* … *\/}` multilínea arranca con texto normal, así que un filtro por
 * prefijo acusa a la bitácora que explica el propio defecto.
 */
function sinComentarios(texto: string): string {
  return texto.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^[ \t]*\/\/.*$/gm, " ");
}

/**
 * Aproxima lo que se LEE. La ventana no se puede medir sobre el fuente: el
 * marcado infla la distancia con caracteres que nadie ve, y así una promesa y
 * su precio que están en el mismo bloque del hero quedan «lejos» por culpa de
 * tres `<Btn>` en el medio. Medido en `/v4`: 488 caracteres de fuente contra
 * 345 de texto. Se sacan etiquetas y atributos, y se colapsa el blanco.
 */
function comoSeLee(fuente: string): string {
  return fuente
    .replace(/<[^>]*>/g, " ")
    .replace(/className=\{[^}]*\}/g, " ")
    .replace(/\s+/g, " ");
}

function plano(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** El plan más barato es el que el «desde» anuncia. */
const MAS_BARATO = [...PLANES].sort((a, b) => a.mensual - b.mensual)[0];
const PLANES_DE_ARRIBA = PLANES.filter((p) => p.mensual > MAS_BARATO.mensual).map((p) => p.nombre);

/**
 * Los marcadores salen del DATO (`sinEsto` del plan más barato), no de una
 * lista a mano: el día que se agregue una exclusión nueva, queda vigilada sola.
 * De cada línea se toma su sustantivo de cabeza — «Agentes de IA (vienen desde
 * Pro)» → `agentes` — porque la venta no repite la frase de la tabla, la
 * parafrasea («agentes que trabajan de noche»).
 */
function marcadorDe(exclusion: string): string | null {
  const cabeza = plano(exclusion).split(/[(—–-]| y /)[0];
  const palabra = cabeza.split(/\s+/).find((p) => p.replace(/[^a-z]/g, "").length >= 6);
  return palabra ? palabra.replace(/[^a-z]/g, "") : null;
}

const EXCLUIDAS = MAS_BARATO.sinEsto.map((linea) => ({ linea, marcador: marcadorDe(linea) })).filter(
  (e): e is { linea: string; marcador: string } => e.marcador !== null,
);

/** «desde … Bs», con o sin etiquetas de por medio (`Desde <b>Bs …`). */
const ANCLA = /desde\s*(?:<[^>]*>\s*){0,2}Bs\b/gi;

/**
 * Segundo anclaje: el JSON-LD. Ahí el precio viaja DESNUDO y con la moneda en
 * otra clave (`price: "320"`, `priceCurrency: "BOB"`), así que el anclaje de
 * arriba —que busca «Bs»— no lo puede ver, y es de donde Google saca el precio
 * que publica. La casa ya pagó esta ceguera una vez, cuando `/v1/precios`
 * tipeaba 320/750/1500 a mano en su JSON-LD con la tabla bien leída al lado.
 *
 * Sólo cuenta cuando el precio es el del plan más barato: una oferta del Pro
 * descrita con agentes es correcta.
 */
const ANCLA_JSONLD = new RegExp(
  String.raw`price:\s*(?:String\()?[^,)\n]*`,
  "gi",
);

function esPrecioDelMasBarato(fragmento: string): boolean {
  const f = plano(fragmento);
  // Sin el paréntesis de cierre a propósito: el anclaje corta en `)`, así que
  // el fragmento llega como `price: String(plan("basico"`. Exigir `plan("basico")`
  // completo dejaba este chequeo en falso SIEMPRE y el anclaje del JSON-LD en
  // código muerto — verde por el motivo equivocado, que es como se ve un
  // guardia hueco.
  return (
    f.includes(`plan("${MAS_BARATO.id}"`) || new RegExp(`\\b${MAS_BARATO.mensual}\\b`).test(f)
  );
}

/**
 * Una oración y media, no un párrafo entero.
 *
 * `promesa-fiscal` usa 340 porque ahí el sujeto es «la afirmación y su
 * salvedad». Acá 340 cruza el borde de sección y empieza a marcar frases que
 * describen el PRODUCTO («Onia unifica la gestión y los agentes con IA»), que
 * son ciertas y no prometen nada sobre el precio. Reescribir eso no es arreglar
 * un defecto, es un cambio editorial de la portada — y eso lo decide Sergio
 * Urcullo viendo la pieza, no un gate.
 *
 * A 160 queda lo indiscutible: la capacidad y el precio en la MISMA frase o
 * pegados. Las tres que se arreglaron el 2026-09-07 estaban a 20, 25 y 147.
 */
const VENTANA = 160;

/**
 * El JSON-LD no se mide en caracteres de lectura: nadie lo lee. `description` y
 * `price` son claves hermanas del mismo objeto, así que van juntas aunque haya
 * tres claves en el medio.
 */
const VENTANA_JSONLD = 340;

/**
 * La salvedad pertenece a la AFIRMACIÓN, no al párrafo, y por eso se busca
 * pegada al marcador y no en toda la ventana.
 *
 * Medido el 2026-09-07, y es el modo de falla más feo de esta familia: al
 * arreglar la banda de la home poniéndole «…, desde Pro» a los agentes, esa
 * palabra pasó a absolver la ventana ENTERA — o sea que el arreglo de una
 * instancia dejó al gate ciego para sus vecinas, y una inyección de «reservas
 * online» a un centímetro del mismo precio pasaba en VERDE. Un gate que se
 * apaga con su propio arreglo es peor que no tenerlo: parece cubierto.
 *
 * Se mira desde un poco antes del marcador (por «desde Pro: agentes…») hasta
 * bastante después (por «agentes …, desde el plan Pro»).
 */
const ANTES = 40;
const DESPUES = 140;

function tieneSalvedad(ventana: string): boolean {
  const v = plano(ventana);
  if (/add-?on|se agrega|aparte|no inclui|sin esto|sinesto/.test(v)) return true;
  // Una interpolación que RENDERIZA el nombre del plan cuenta como nombrarlo:
  // `{PRUEBA.planQueCorre}` sale «Pro» en pantalla. Leer sólo literales daría
  // rojo sobre un hero que ya dice con qué plan corre la prueba, y mandaría a
  // tipear a mano el nombre que `prueba-vs-plan.test.ts` prohíbe tipear.
  if (/planquecorre/.test(v)) return true;
  // Con LÍMITE DE PALABRA, y no es cosmética: «Pro» como subcadena vive dentro
  // de «aprobación» y «aprobás», que es como termina CADA frase que habla de
  // los agentes en este sitio. Sin el límite el gate se absolvía solo justo en
  // las páginas donde vive el defecto. Medido el 2026-09-07.
  return PLANES_DE_ARRIBA.some((nombre) => new RegExp(`\\b${plano(nombre)}\\b`).test(v));
}

type Hallazgo = { archivo: string; capacidad: string; marcador: string };

function hallazgos(): Hallazgo[] {
  const out: Hallazgo[] = [];
  for (const ruta of PANTALLAS) {
    const fuente = comoSeLee(sinComentarios(readFileSync(ruta, "utf8")));
    // La ventana depende del TIPO de anclaje, y no es una perilla: en prosa la
    // distancia mide proximidad de lectura, pero en el JSON-LD `description` y
    // `price` son hermanos del MISMO objeto —adyacentes por estructura— y entre
    // los dos caben `applicationCategory`, `operatingSystem` y `url`. Medir el
    // JSON-LD con la ventana de la prosa dejó un hueco: inyectar «reportes
    // completos» en la oferta de dental pasaba en VERDE (medido 2026-09-07).
    const anclas: { i: number; ventana: number }[] = [
      ...[...fuente.matchAll(ANCLA)].map((m) => ({ i: m.index ?? 0, ventana: VENTANA })),
      ...[...fuente.matchAll(ANCLA_JSONLD)]
        .filter((m) => esPrecioDelMasBarato(m[0]))
        .map((m) => ({ i: m.index ?? 0, ventana: VENTANA_JSONLD })),
    ];
    // La salvedad se busca sobre el texto COMPLETO y en posiciones absolutas,
    // nunca sobre la ventana ya recortada: si se recorta primero, el recorte
    // corta también la salvedad —«agentes …,| desde el plan Pro»— y el gate
    // acusa de desnuda a una frase que está vestida tres palabras más allá.
    // Medido el 2026-09-07: así salieron dos rojos falsos, los dos sobre copy
    // que este mismo commit acababa de arreglar.
    const texto = plano(fuente);
    for (const { i, ventana: alcance } of anclas) {
      for (const { linea, marcador } of EXCLUIDAS) {
        // CADA aparición del marcador necesita su propia salvedad: basta una
        // desnuda para que el lead la lea sin ella.
        let desnuda = false;
        for (let j = texto.indexOf(marcador); j !== -1; j = texto.indexOf(marcador, j + 1)) {
          if (Math.abs(j - i) > alcance) continue;
          // La salvedad NO cruza el punto: una que vive en la oración siguiente
          // es de OTRA capacidad. Sin este corte, «…y reportes completos.
          // Agentes con IA desde el plan Pro» quedaba absuelto —el «desde Pro»
          // de los agentes tapaba a los reportes— y la inyección pasaba en
          // VERDE (medido 2026-09-07).
          const crudo = texto.slice(Math.max(0, j - ANTES), j + marcador.length + DESPUES);
          const relativo = Math.min(j, ANTES) + marcador.length;
          const punto = crudo.indexOf(". ", relativo);
          const alLado = punto === -1 ? crudo : crudo.slice(0, punto);
          if (!tieneSalvedad(alLado)) desnuda = true;
        }
        if (!desnuda) continue;
        const archivo = relative(SRC, ruta);
        if (out.some((h) => h.archivo === archivo && h.marcador === marcador)) continue;
        out.push({ archivo, capacidad: linea, marcador });
      }
    }
  }
  return out;
}

describe("lo que el precio anunciado compra", () => {
  it("hay pantallas que auditar (si esto da 0, el barrido se quedó sin sujetos)", () => {
    expect(PANTALLAS.length).toBeGreaterThan(10);
  });

  it("hay exclusiones que vigilar, y salen del dato", () => {
    // Si `sinEsto` se queda sin marcadores utilizables, el gate no mide nada y
    // pasaría en verde para siempre.
    expect(EXCLUIDAS.length).toBeGreaterThan(0);
    expect(PLANES_DE_ARRIBA.length).toBeGreaterThan(0);
  });

  /**
   * El caso. Una capacidad que el plan más barato NO trae no puede aparecer
   * pegada al «desde Bs <ese plan>» sin decir que se paga aparte.
   */
  it("ninguna pantalla promete, junto al precio más bajo, algo que ese plan no incluye", () => {
    const malas = hallazgos().map(
      (h) => `${h.archivo} — «${h.capacidad}» aparece como «${h.marcador}» junto al precio`,
    );

    expect(
      malas,
      `El plan ${MAS_BARATO.nombre} cuesta Bs ${MAS_BARATO.mensual} y NO incluye lo de ` +
        `abajo. Anunciarlo a un centímetro de «desde Bs ${MAS_BARATO.mensual}» hace que el ` +
        `lead pague creyendo que lo compró, y se entera cuando se le apaga. O se nombra el ` +
        `plan que sí lo trae (${PLANES_DE_ARRIBA.join(" / ")}), o se dice que es add-on, o ` +
        `no va junto al precio:\n  ${malas.join("\n  ")}`,
    ).toEqual([]);
  });
});
