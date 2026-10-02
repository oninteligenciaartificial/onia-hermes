import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { CONTENDIENTES } from "@/lib/proof";
import { PLANES } from "@/lib/pricing";

/**
 * La factura fiscal no se enumera entre lo que el cliente RECIBE, en ninguna
 * superficie, sin decir al lado que el emisor sigue en trámite.
 *
 * Es el mismo invariante que `(sitio)/facturacion.test.ts` ya defiende —*«de
 * UBICACIÓN y de VOZ, no de vocabulario»*— subido de la INSTANCIA a la CLASE.
 * Aquél mira UN archivo, `components/site-footer.tsx`, y sólo sus columnas
 * «Producto» y «Servicios». Nació el 2026-09-04 del pie que listaba
 * «Facturación SIAT» al lado de Precios, Rubros y Agentes, y lo arregló ahí.
 *
 * POR QUÉ HACÍA FALTA, medido por mutación el 2026-09-07, que es lo que lo
 * vuelve un hecho y no un argumento: se inyectó en el hero de la que entonces
 * era `/v4` —la portada candidata, que producción servía con 200, y que ese
 * mismo día pasó a ser `/`—
 *
 *   «Onia es el sistema con el que llevás tu negocio: agenda, clientes, caja,
 *    inventario, tu factura fiscal y cobros, con agentes que trabajan de noche…»
 *
 * y la suite entera pasó **VERDE: 49 archivos, 851 tests**. Los cuatro gates
 * que podrían haberlo visto no podían, y los cuatro motivos son correctos:
 *
 *  - `facturacion.test.ts` sólo lee el PIE. La instancia, no la clase.
 *  - `promesa-en-el-cuerpo.test.ts` persigue el SÍMBOLO `HUECO` importado de
 *    `lib/proof`. La forma cómoda del defecto; el literal tipeado a mano cae
 *    fuera. Es el mismo hueco que `obra-literal.test.ts` cerró ayer para la
 *    familia OBRA — a la familia PROMESA nunca le escribieron su gemelo.
 *  - `promesa-fiscal.test.ts` ancla en el par (verbo + SIN) y en «pruebas
 *    técnicas», y hace bien: buscar «SIAT» a secas daría rojo sobre
 *    `/facturacion` y `/guia-facturacion`, que son guías HONESTAS sobre la
 *    norma. Ése es el falso positivo caro, el que manda a borrar la honestidad.
 *  - `obra-literal.test.ts` persigue lo que FALTA («muy pronto»). Acá no falta
 *    ninguna palabra: sobra una capacidad.
 *
 * O sea que el defecto vive en el hueco entre los cuatro, y es el que ya llegó
 * a producción una vez: el pie de las 52 páginas, con Sergio Urcullo
 * escribiéndole esa semana a 7 leads, el más caro una clínica que factura.
 *
 * ⚠️ **El corte no es el vocabulario, es la VECINDAD.** Nombrar la norma está
 * bien y hay que seguir haciéndolo. Lo que no se puede es ponerla en una
 * ENUMERACIÓN de capacidades —donde el lector entiende «esto viene incluido»—
 * sin la salvedad al lado. Por eso el sujeto es la ventana alrededor de la
 * mención, nunca el archivo: una persona lee un párrafo, no un archivo. Es la
 * corrección que `promesa-fiscal.test.ts` ya tuvo que hacer cuando una
 * declaración de principios a 90 líneas absolvía al defecto.
 *
 * ⚠️ **Se apaga solo el día que el emisor se homologue.** El sujeto sale de los
 * DATOS (`CONTENDIENTES`, la fila de Onia), no de una lista de frases: cuando
 * `siat` pase a `"si"` el ancla de abajo falla y avisa que este archivo se
 * borra. Un gate que se apaga en silencio es peor que uno que no existe.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = join(AQUI, "..");

/** La fila de Onia: la única que dice qué tiene el producto de verdad. */
const ONIA = CONTENDIENTES.find((c) => c.esOnia);

/**
 * Nombra la factura fiscal. Mismo patrón que el gate del pie, a propósito: si
 * mañana hay que ampliarlo, se amplía en los dos y la diferencia se nota.
 */
const CLAMA_FACTURA = /siat|factura(?:ci[oó]n)?\s+(?:electr[oó]nica|fiscal)/i;

/**
 * Dice, ahí mismo, que el trámite sigue abierto. Cualquiera de las formas
 * vivas cuenta: exigir una redacción única obligaría a reescribir páginas que
 * hoy están bien dichas, y un gate que pide uniformidad de estilo termina
 * desobedecido.
 */
const TRAE_LA_SALVEDAD =
  /\ben\s+tr[aá]mite\b|\btr[aá]mite\s+de\s+homologaci[oó]n\b|\bhomologaci[oó]n\s+(?:est[aá]\s+en\s+tr[aá]mite|conclu)|\bportal\s+(?:web\s+)?(?:gratuito|en\s+l[ií]nea)\b|\bPortal\s+Web\s+del\s+SIN\b|\btodav[ií]a\s+no\s+(?:emit|factur)/i;

/**
 * Las palabras con las que el producto enumera lo que entrega.
 *
 * Está escrita a mano —es la única cosa a mano de este archivo— y por eso lleva
 * su ancla: cada una tiene que estar ATESTIGUADA en el `incluye` de los planes
 * de `lib/pricing.ts`. El día que el producto renombre una capacidad, el caso
 * de abajo se pone en rojo en vez de dejar la lista pudriéndose callada.
 */
const VOCABULARIO_DE_OFERTA = [
  "agenda",
  "fichas",
  "caja",
  "cobros",
  "inventario",
  "recordatorios",
  "reportes",
  "contabilidad",
  "usuarios",
  // En singular a propósito: es la raíz que cubre «Agente …» y «Agentes …»
  // (desde el 2026-09-29 los planes dicen «Agentes Vuelve a citar …»). Cuando
  // los planes decían «Agente Recall» el plural no estaba atestiguado y el
  // ancla de abajo lo cazó en la primera corrida.
  "agente",
  "reservas",
] as const;

/**
 * Lo que este gate NO mira, cada uno con su motivo escrito.
 *
 * Es una lista de EXCLUSIÓN, o sea que un archivo nuevo nace cubierto y hay que
 * sacarlo a mano, a la vista. Las dos entradas salieron de la primera corrida
 * contra el árbol real: las dos son el falso positivo caro de esta familia —el
 * que manda a romper la honestidad— y por eso van acá y no aflojando el patrón.
 */
const EXENTOS: ReadonlyArray<{ archivo: string; motivo: string }> = [
  {
    archivo: join("lib", "proof.ts"),
    motivo:
      "Es la TABLA que declara el estado real (`siat: \"tramite\"`) y el veredicto " +
      "de Onia. Sus tres ejes viven pegados —«Agenda y ficha», «Factura SIAT», " +
      "«Agentes»— así que se leen como enumeración, pero es la fuente de la " +
      "salvedad, no una oferta. Acusarla obligaría a romper el dato que " +
      "desambigua a todo el resto del sitio.",
  },
  {
    archivo: join("app", "patrones", "patrones-demo.tsx"),
    motivo:
      "Galería interna de patrones de UI (`/patrones`, en el disallow de " +
      "robots.ts y sin un solo enlace entrante). Sus cadenas son datos de " +
      "muestra para un marquee y un panel de ejemplo, no copy de venta. ⚠️ Si " +
      "algún día se le cuelga una superficie que venda, esta exención se va.",
  },
];

/** Cuánto texto cuenta como «la misma enumeración»: una oración larga. */
const LA_ENUMERACION = 140;

/** Cuánto texto cuenta como «al lado»: dos oraciones largas, igual que el gate fiscal. */
const AL_LADO = 340;

/** Cuántas capacidades vecinas convierten una mención en una enumeración de oferta. */
const VECINOS_MINIMOS = 2;

function plano(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Lo que se LEE de un archivo: sin comentarios y con los espacios aplanados.
 *
 * Los comentarios salen por ESTADO y no por prefijo — el interior de un
 * `{/* … *\/}` multilínea arranca con texto normal, así que un filtro por
 * prefijo acusaría a la bitácora que explica el propio defecto. Este archivo
 * mismo nombra la factura una docena de veces.
 */
function comoSeLee(fuente: string): string {
  return fuente
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^[ \t]*\/\/.*$/gm, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ");
}

/**
 * Sujetos derivados del DISCO, y del árbol entero de `src/`.
 *
 * No se usa `PAGINAS_PUBLICAS`: restar el `disallow` de `robots.ts` haría
 * fallar ABIERTO —manda sobre rastreadores, no apaga la pantalla— y hoy ese
 * disallow tiene `/servicios/marketing-ia` y `/servicios/consultoria`, que
 * siguen respondiendo 200 y que el propio `robots.ts` marca como «no se
 * bajan», porque su URL circula y se manda en una venta. Y no se recorre la
 * cadena de imports sino el árbol completo, que es más conservador: el copy de
 * venta casi nunca vive en el `page.tsx`, y un archivo de datos que todavía no
 * enlaza nadie entra igual (un texto de venta muerto es el que entra ya
 * aprobado el día que alguien lo cablea).
 */
function fuentes(dir: string, acc: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    if (entrada.name === "node_modules" || entrada.name.startsWith(".")) continue;
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      fuentes(ruta, acc);
      continue;
    }
    if (!/\.tsx?$/.test(entrada.name)) continue;
    if (/\.test\.tsx?$/.test(entrada.name)) continue;
    if (EXENTOS.some((e) => ruta.endsWith(e.archivo))) continue;
    acc.push(ruta);
  }
  return acc;
}

const FUENTES = fuentes(SRC);

/** Las menciones a la factura que están enumeradas como oferta y no traen salvedad. */
function ofertasSinSalvedad(texto: string): { mencion: string; vecinos: string[] }[] {
  const leible = comoSeLee(texto);
  const chato = plano(leible);
  const malas: { mencion: string; vecinos: string[] }[] = [];

  const patron = new RegExp(CLAMA_FACTURA.source, "gi");
  for (const hallado of leible.matchAll(patron)) {
    const en = hallado.index ?? 0;

    const ventana = chato.slice(
      Math.max(0, en - LA_ENUMERACION),
      en + hallado[0].length + LA_ENUMERACION,
    );
    const vecinos = VOCABULARIO_DE_OFERTA.filter((v) => ventana.includes(plano(v)));
    if (vecinos.length < VECINOS_MINIMOS) continue;

    const alLado = leible.slice(
      Math.max(0, en - AL_LADO),
      en + hallado[0].length + AL_LADO,
    );
    if (TRAE_LA_SALVEDAD.test(alLado)) continue;

    malas.push({ mencion: hallado[0], vecinos });
  }
  return malas;
}

describe("la factura fiscal no se enumera como algo que el cliente recibe", () => {
  it("hoy la factura fiscal NO está cumplida — si esto falla, borrá este archivo", () => {
    // Ancla viva: el día que el emisor se homologue, este caso falla y avisa
    // que el resto del archivo dejó de aplicar.
    expect(ONIA, "CONTENDIENTES perdió la fila con esOnia: sin ella este gate no mide nada").toBeDefined();
    expect(ONIA?.estados.siat).not.toBe("si");
  });

  it("el barrido encuentra el árbol de verdad", () => {
    // Sin este ancla, una carpeta renombrada dejaría el caso de abajo corriendo
    // sobre una lista vacía: cero sujetos, verde, y el defecto suelto.
    expect(FUENTES.length, "el barrido de src/ encontró casi nada").toBeGreaterThan(50);
    expect(
      FUENTES.some((f) => relative(SRC, f).includes("site-footer")),
      "el barrido no llega al pie, que es donde este defecto ya estuvo vivo",
    ).toBe(true);
  });

  it("cada exención apunta a un archivo que existe", () => {
    // Una entrada de lista blanca que ya no corresponde a ningún archivo no la
    // mide nadie y queda PRE-APROBADA: el día que alguien cree un archivo con
    // ese nombre nace exento sin que nadie lo haya decidido.
    for (const e of EXENTOS) {
      expect(
        existsSync(join(SRC, e.archivo)),
        `la exención «${e.archivo}» no existe en el disco: sacala o corregila`,
      ).toBe(true);
    }
  });

  it("cada palabra del vocabulario está atestiguada en el `incluye` de los planes", () => {
    // El vocabulario es lo único escrito a mano acá. Si el producto renombra una
    // capacidad, esto se pone en rojo en vez de dejar la lista pudriéndose.
    const incluye = plano(PLANES.flatMap((p) => p.incluye).join(" · "));
    for (const palabra of VOCABULARIO_DE_OFERTA) {
      expect(
        incluye.includes(plano(palabra)),
        `«${palabra}» ya no aparece en el incluye de ningún plan: el vocabulario quedó viejo`,
      ).toBe(true);
    }
  });

  it("los patrones separan la enumeración rota de la mención honesta", () => {
    // La forma REAL del defecto: la que se inyectó en /v4 y pasó verde.
    const rota =
      "Onia es el sistema con el que llevás tu negocio: agenda, clientes, caja, " +
      "inventario, tu factura fiscal y cobros, con agentes que trabajan de noche.";
    expect(
      ofertasSinSalvedad(rota).length,
      "el gate dejó de reconocer la enumeración que estuvo rota",
    ).toBe(1);

    // La misma enumeración, dicha con la salvedad al lado: tiene que pasar.
    const sana =
      "Onia es el sistema con el que llevás tu negocio: agenda, clientes, caja, " +
      "inventario y cobros. La factura fiscal se emite en el Portal Web del SIN, " +
      "que es gratuito: nuestro emisor está en trámite de homologación.";
    expect(
      ofertasSinSalvedad(sana),
      "el gate acusa a una enumeración que SÍ trae su salvedad",
    ).toEqual([]);

    // La guía honesta sobre la norma: nombra la factura muchas veces y no
    // enumera capacidades nuestras. Es el falso positivo caro y no debe saltar.
    const guia =
      "Desde el 1 de octubre de 2026 esos negocios facturan en línea. La " +
      "facturación electrónica se hace en el portal del SIN, que es gratuito y cumple.";
    expect(
      ofertasSinSalvedad(guia),
      "el gate acusa a la guía honesta sobre la norma",
    ).toEqual([]);
  });

  it("ninguna superficie enumera la factura fiscal entre lo que se recibe", () => {
    const culpables: string[] = [];

    for (const archivo of FUENTES) {
      for (const mala of ofertasSinSalvedad(readFileSync(archivo, "utf8"))) {
        culpables.push(
          `${relative(SRC, archivo)} nombra «${mala.mencion}» entre capacidades ` +
            `(${mala.vecinos.join(", ")}) sin decir al lado que el emisor está en ` +
            `trámite. El emisor NO emite: proof.ts → siat: "tramite". O se saca de ` +
            `la enumeración, o se dice el estado real ahí mismo.`,
        );
      }
    }

    expect(culpables, culpables.join("\n")).toEqual([]);
  });
});
