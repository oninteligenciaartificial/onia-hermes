import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { CONTENDIENTES } from "@/lib/proof";
import { SIAT_BLOQUES, SIAT_ESTADO_ONIA, SIAT_FAQ } from "@/lib/siat";

/**
 * Ningún texto de venta declara COMPLETA una etapa del trámite ante el SIN, ni
 * llama «formal» a lo que falta.
 *
 * Es la mitad que le faltaba a `promesa-fiscal.test.ts`. Aquél exige que el
 * logro fiscal venga con su salvedad —y lo hace bien—, pero **da por cierto el
 * logro**: mide que la afirmación esté ACOMPAÑADA, nunca que sea VERDADERA. Con
 * eso, los tres textos de `lib/siat.ts` pasaron en verde diciendo:
 *
 *   «ya completó las pruebas técnicas de la Fase 1 en el ambiente de pruebas
 *    oficial […]. Quedan las etapas formales del trámite (inspección del SIN).»
 *
 * **Quien cuenta la Fase 1 es el SIN, y su marcador dice otra cosa.** Última
 * lectura antigua del «Listado de Etapas» —2026-08-27, en
 * `hermes-content/docs/ONIA_SIAT_ESTADO_HOMOLOGACION.md` §4—: **0 % general**.
 * Una lectura nueva del portal el 2026-09-27 dio 80 % general, con emisión
 * masiva y paquetes todavía parciales. Y lo que falta no es formal: la
 * autorización del sistema (INICIADO → AUTORIZADO), que es la decisión entera,
 * no un sello.
 *
 * El mismo doc registra que creer «Fase 1 completa» leyendo nuestro estado
 * local **ya fue un error una vez** («no coincide con lo que decían nuestras
 * notas»). El sitio lo repitió, y en la peor superficie posible: la página que
 * capta la búsqueda del plazo fiscal, donde un contador puede cotejar contra el
 * portal en un minuto. Es la clase «no fabricar» aplicada a una credencial
 * regulatoria — igual de caro que un testimonio inventado.
 *
 * ⚠️ **Prohíbe la FORMA, no el texto viejo.** Un caso que buscara «Fase 1
 * completada» se apagaría solo con «etapa IV cerrada» o «homologación
 * superada»; uno que prohibiera el valor viejo se apagaría el día que la
 * respuesta correcta sea ese valor. Lo que no envejece es la forma: una palabra
 * del trámite pegada a un verbo de completitud, y «lo que falta» calificado de
 * formal.
 *
 * ⚠️ **Lo que el gate NO prohíbe, a propósito:** el futuro. «hasta que la
 * homologación concluya» y «te avisamos apenas la homologación concluya» son
 * las formas SANAS y vivas hoy — por eso `CONCLUIDA` sólo reconoce el pretérito
 * y el participio (`concluyó`, `concluida`), nunca `concluye`/`concluya`. Un
 * gate que obligara a reescribirlas termina desobedecido.
 *
 * ⚠️ **Se apaga solo el día que el SIN autorice.** El interruptor no es una
 * lista de frases: es la fila de Onia en `CONTENDIENTES`. Si `siat` pasa a
 * `"si"`, el primer caso falla y avisa que el resto dejó de aplicar — un gate
 * que se apaga en silencio es peor que uno que no existe.
 */

/** La fila de Onia: la única que dice qué tiene el producto de verdad. */
const ONIA = CONTENDIENTES.find((c) => c.esOnia);

/**
 * Límites de palabra que funcionan en CASTELLANO.
 *
 * ⚠️ `\b` de JavaScript se define sobre `[A-Za-z0-9_]`, así que **una palabra
 * que termina en vocal acentuada no tiene frontera derecha**: `/\bcerró\b/` NO
 * matchea «cerró la etapa». Y en castellano esa es la terminación del
 * pretérito de todos los verbos regulares —completó, superó, aprobó,
 * concluyó—, o sea justo las formas con las que se anuncia un logro. Medido
 * acá mismo: con `\b` el gate daba verde sobre las cuatro.
 *
 * Es la dirección simétrica de la trampa ya conocida por el lado izquierdo
 * (`/\bél\b/` tampoco matchea, porque la `é` no es word char).
 */
const IZQ = String.raw`(?<![\p{L}\p{N}_])`;
const DER = String.raw`(?![\p{L}\p{N}_])`;

/** Una etapa o hito del trámite: lo que el SIN cuenta, no lo que corre acá. */
const ETAPA = String.raw`(?:fase\s*1|fase\s*uno|homologaci[oó]n|certificaci[oó]n|etapa\s+[IVXLC]+|pruebas\s+t[eé]cnicas)`;

/**
 * Declararla terminada, en cualquiera de sus formas.
 *
 * ⚠️ **Cada verbo lleva su PRETÉRITO y su participio, y eso no es cosmético.**
 * La primera versión de este patrón decía `superad\w*|cerrad\w*|aprobad\w*` —
 * sólo participios— y pasó VERDE sobre «ya superó la homologación ante el SIN»
 * sembrado en un archivo nuevo. Tres de siete verbos estaban a medias y el
 * gate se leía perfecto: lo delató la mutación, no releerlo. Por eso abajo hay
 * un caso que recorre las dos conjugaciones de cada verbo, una por una.
 *
 * Las raíces van acotadas (`super(?:ó|…)`, no `super\w*`) porque la forma
 * ancha acusa palabras corrientes: `super\w*` mata «superficie», `aprob\w*`
 * mata «vos aprobás» —que es copy vivo de los agentes y está sano—, y
 * `conclu\w*` mata «hasta que la homologación concluya», que es justo la forma
 * honesta que este gate tiene que dejar pasar.
 */
const COMPLETA = String.raw`(?:complet\p{L}*|termin\p{L}*|finaliz\p{L}*|cerr(?:ó|aron|ad[oa]s?)|super(?:ó|aron|ad[oa]s?)|aprob(?:ó|aron|ad[oa]s?)|conclu(?:y[óo]|yeron|id[oa]s?))`;

/**
 * La etapa y el verbo, en cualquier orden y a menos de una cláusula de
 * distancia. El corte en `.;:` es lo que impide que dos oraciones vecinas sanas
 * («…la homologación está en trámite. Reportes completos…») se acusen entre sí.
 */
const DECLARA_COMPLETA = new RegExp(
  `${IZQ}${ETAPA}${DER}[^.;:]{0,60}${IZQ}${COMPLETA}${DER}` +
    `|${IZQ}${COMPLETA}${DER}[^.;:]{0,60}${IZQ}${ETAPA}${DER}`,
  "iu",
);

/**
 * Lo que falta, minimizado a un trámite de escritorio.
 *
 * Es la otra mitad y hace falta por separado: un texto puede no declarar nada
 * completo y aun así dejar al lector creyendo que la emisión está a un sello de
 * distancia, que es exactamente lo que hacía «quedan las etapas formales».
 */
const SOLO_FALTA_LO_FORMAL =
  /\b(?:quedan?|faltan?|resta\w*)\b[^.;:]{0,45}\b(?:formal(?:es|idad(?:es)?)?|inspecci[oó]n(?:es)?)\b/i;

const AQUI = dirname(fileURLToPath(import.meta.url));
/** `src/` — dos niveles arriba de `src/app/(sitio)/`. */
const SRC = join(AQUI, "..", "..");

/**
 * Todo archivo de producción del sitio.
 *
 * Se camina el DISCO y no `git ls-files`: el archivo recién escrito y sin
 * commitear es justo el sujeto que un gate así existe para cazar, y git no lo
 * ve. Se saltean los `__loquesea__`, que son siembras efímeras de otros gates
 * (un sujeto que desaparece mientras lo leés no es superficie de cliente), y
 * los `*.test.ts`: no viajan al navegador, y los fixtures de este archivo y de
 * `promesa-fiscal.test.ts` CITAN las frases históricas — sin la exclusión, los
 * gates se acusarían a sí mismos y el rojo no significaría nada.
 */
function archivosDelSitio(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const camino = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || /^__.+__$/.test(e.name)) return [];
      return archivosDelSitio(camino);
    }
    if (!/\.tsx?$/.test(e.name) || /\.test\.tsx?$/.test(e.name)) return [];
    return [camino];
  });
}

/** El cuerpo sin comentarios y con los espacios aplanados. */
function cuerpoDe(archivo: string): string {
  return readFileSync(archivo, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^[ \t]*\/\/.*$/gm, " ")
    // El JSX y Prettier parten las frases en varias líneas: se aplanan los
    // espacios o «la Fase 1\n completada» no matchea nada y el gate falla
    // ABIERTO, que es como no tenerlo.
    .replace(/\s+/g, " ");
}

/** Las tres frases que estuvieron publicadas, textuales (2026-09-19). */
const FRASES_ROTAS = [
  "Nuestro sistema está registrado ante el SIN como proveedor de facturación y ya completó " +
    "las pruebas técnicas de la Fase 1 en el ambiente de pruebas oficial: emisión individual " +
    "y masiva, anulaciones, reversiones y operación sin internet.",
  "quedan las etapas formales del trámite, así que hasta que la homologación concluya emitís " +
    "por el portal gratuito del SIN",
  "ya completó las pruebas técnicas de emisión, anulación y contingencia en el ambiente de " +
    "pruebas del SIN (Fase 1). Faltan las etapas formales de inspección.",
];

/** Frases sanas, incluidos los matices que hoy publica el sitio. */
const FRASES_SANAS = [
  "Nuestro sistema está registrado ante el SIN y sigue en pruebas de homologación. " +
    "La emisión individual, la anulación y la reversión completaron sus casos; " +
    "la emisión masiva y los paquetes de contingencia siguen en pruebas.",
  "Mientras falta la autorización, emitís cada factura en el Portal Web del SIN " +
    "con los datos que ese portal solicita.",
  "Nuestro emisor está registrado ante el SIN y la homologación está en trámite. Te avisamos " +
    "apenas la homologación concluya.",
  "Reportes completos y facturas recurrentes, y contabilidad completa — vienen en Profesional.",
  "Los agentes te proponen a quién contactar y vos aprobás; la propuesta queda terminada cuando " +
    "la aprobás.",
  // Anclas contra la raíz ancha: con `super\w*` / `aprob\w*` estas dos salían
  // acusadas y el gate mandaba a reescribir copy sano.
  "La superficie de la homologación no es el punto: vos aprobás cada propuesta antes de que salga.",
];

describe("el logro fiscal no se declara completo", () => {
  it("hoy Onia NO factura — si esto falla, el gate se apagó solo y está bien", () => {
    expect(ONIA, "CONTENDIENTES perdió la fila con esOnia: sin ella este gate no mide nada").toBeDefined();
    expect(ONIA?.estados.siat).not.toBe("si");
  });

  it("los patrones reconocen las tres frases que estuvieron publicadas", () => {
    // Sin este ancla un patrón roto deja el barrido en verde sobre cualquier
    // cosa: es la diferencia entre medir y parecer que se mide.
    for (const rota of FRASES_ROTAS) {
      expect(
        DECLARA_COMPLETA.test(rota) || SOLO_FALTA_LO_FORMAL.test(rota),
        `el gate dejó de reconocer una frase que estuvo publicada: «${rota.slice(0, 70)}…»`,
      ).toBe(true);
    }
  });

  it.each([
    ["completó", "completada"],
    ["terminó", "terminada"],
    ["finalizó", "finalizada"],
    ["cerró", "cerrada"],
    ["superó", "superada"],
    ["aprobó", "aprobada"],
    ["concluyó", "concluida"],
  ])("reconoce «%s» y «%s» pegados a una etapa del trámite", (preterito, participio) => {
    // El caso que faltaba la primera vez. Tres verbos estaban escritos sólo en
    // participio, así que «ya superó la homologación» pasaba en verde: el gate
    // parecía cubrir siete formas y cubría cuatro. Se recorren de a una porque
    // una lista probada "en bloque" esconde exactamente al miembro que falta.
    expect(
      DECLARA_COMPLETA.test(`Nuestro emisor ya ${preterito} la homologación ante el SIN.`),
      `el gate no reconoce «${preterito}»: esa redacción publica una credencial que el SIN no dio`,
    ).toBe(true);
    expect(
      DECLARA_COMPLETA.test(`Emisor con la Fase 1 ${participio} ante el SIN.`),
      `el gate no reconoce «${participio}»`,
    ).toBe(true);
  });

  it("no acusa a las frases que hoy están bien dichas", () => {
    // El falso positivo caro: el que manda a borrar la honestidad o a
    // reescribir un texto sano. «la homologación concluye/concluya» es la forma
    // correcta y vive en producción.
    for (const sana of FRASES_SANAS) {
      expect(
        DECLARA_COMPLETA.test(sana),
        `el gate daría rojo sobre una frase sana: «${sana.slice(0, 70)}…»`,
      ).toBe(false);
      expect(
        SOLO_FALTA_LO_FORMAL.test(sana),
        `el gate daría rojo sobre una frase sana: «${sana.slice(0, 70)}…»`,
      ).toBe(false);
    }
  });

  it("el barrido caza el mismo texto en un archivo nuevo, sin commitear", () => {
    // La mitad que cierra la CLASE: el defecto vivía en `lib/siat.ts`, pero lo
    // que lo hace volver es que mañana lo tipee otra pantalla. Se siembra en un
    // directorio temporal y NO dentro de `src/`: hay decenas de gates que
    // caminan este mismo árbol, y un archivo que aparece y desaparece mientras
    // corren los voltea con el producto sano (medido el 2026-09-17). Por eso el
    // detector recibe su raíz en vez de tenerla clavada.
    const raiz = mkdtempSync(join(tmpdir(), "logro-fiscal-"));
    try {
      writeFileSync(
        join(raiz, "copy.ts"),
        'export const COPY = "Nuestro emisor ya superó la homologación ante el SIN.";\n',
      );
      const acusados = archivosDelSitio(raiz).filter((a) => DECLARA_COMPLETA.test(cuerpoDe(a)));
      expect(
        acusados.length,
        "el barrido no ve un archivo nuevo del árbol: la clase queda abierta en la pantalla que lo tipee mañana",
      ).toBe(1);
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  it("el universo incluye la fuente canónica del texto fiscal", () => {
    // El sujeto conocido tiene que estar adentro. Las tres frases vivían en
    // `lib/siat.ts` —ni una página las tipeaba—, así que un universo armado
    // sobre `page.tsx` habría barrido el sitio entero sin tocar el defecto.
    const universo = archivosDelSitio(SRC).map((a) => relative(SRC, a));
    expect(universo).toContain(join("lib", "siat.ts"));
    expect(universo.length, "el barrido no encontró archivos: mide cero").toBeGreaterThan(50);
    expect(
      universo.filter((a) => /\.test\.tsx?$/.test(a)),
      "los tests entraron al universo: sus fixtures citan las frases rotas y el gate se acusa solo",
    ).toEqual([]);
  });

  it("la fuente canónica afirma lo que CORRE, no una etapa terminada", () => {
    // El ancla del arreglo, sobre los valores exportados y no sobre el archivo:
    // así también se cazan los textos que se armen por interpolación.
    const textos = [
      SIAT_ESTADO_ONIA,
      ...SIAT_BLOQUES.map((b) => `${b.titulo} ${b.texto}`),
      ...SIAT_FAQ.map((f) => `${f.q} ${f.a}`),
    ];
    for (const texto of textos) {
      expect(
        DECLARA_COMPLETA.test(texto),
        `un texto de lib/siat.ts declara terminada una etapa del trámite. El SIN es quien la ` +
          `cuenta y la lectura del 2026-09-27 dio 80 % general, con etapas parciales: se ` +
          `afirma lo que el emisor HACE contra el ambiente de pruebas.\n«…${texto.slice(0, 140)}…»`,
      ).toBe(false);
      expect(
        SOLO_FALTA_LO_FORMAL.test(texto),
        `un texto de lib/siat.ts llama «formal» a lo que falta. Lo que falta es la autorización ` +
          `del sistema (INICIADO → AUTORIZADO, §9), que es la decisión entera.\n«…${texto.slice(0, 140)}…»`,
      ).toBe(false);
    }
  });

  it("ningún archivo del sitio declara completa una etapa del trámite", () => {
    const acusados: string[] = [];
    for (const archivo of archivosDelSitio(SRC)) {
      const cuerpo = cuerpoDe(archivo);
      for (const patron of [DECLARA_COMPLETA, SOLO_FALTA_LO_FORMAL]) {
        const m = new RegExp(patron.source, "i").exec(cuerpo);
        if (m) acusados.push(`${relative(SRC, archivo)}: «…${cuerpo.slice(m.index, m.index + 120)}…»`);
      }
    }

    expect(
      acusados,
      `un texto de venta declara terminada una etapa del trámite ante el SIN, o llama «formal» a ` +
        `lo que falta. Onia todavía no factura (CONTENDIENTES: siat="${ONIA?.estados.siat}") y el ` +
        `marcador del portal —el único árbitro— dio 0 % general en su última lectura. Se afirma lo ` +
        `que el emisor HACE contra el ambiente de pruebas, y lo que falta se nombra: la ` +
        `autorización del SIN.\n` +
        acusados.join("\n"),
    ).toEqual([]);
  });
});
