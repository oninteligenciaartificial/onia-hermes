import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { CONTENDIENTES } from "@/lib/proof";
import { SIAT_BLOQUES, SIAT_FAQ, SIAT_GUIA_CIERRE } from "@/lib/siat";

import { PAGINAS, archivoDe } from "../rutas";

/**
 * Ninguna página afirma el registro ante el SIN sin la salvedad de que el
 * trámite no terminó.
 *
 * Es la mitad que le faltaba a `promesa-en-el-cuerpo.test.ts`. Aquél persigue
 * la promesa que se **importa** (`HUECO` de `lib/proof.ts`) y por eso mide
 * sobre el grafo de imports; éste persigue la misma promesa **tipeada a mano**,
 * que ese recorredor no puede ver por construcción — la página no importa
 * ningún símbolo, escribe la frase.
 *
 * ⚠️ Es la dirección INVERSA de la trampa ya conocida del grafo de imports
 * (`grep -c Sintic .../comparativa/page.tsx` da 0 sobre la página que renderiza
 * a los seis competidores). Allá el gate greppeaba el `page.tsx` y el dato
 * venía importado; acá el gate sigue el import y el dato está tipeado. **Las
 * dos formas necesitan gate, y una sola de las dos es medio barrido.**
 *
 * El defecto que lo trajo, medido el 2026-09-06 sobre el árbol:
 * `(sitio)/nosotros/page.tsx` decía, bajo el h2 «El sistema corre en
 * producción» y a continuación de «Cinco rubros disponibles» —
 *
 *   «nuestro emisor de facturación está registrado ante el SIN con las pruebas
 *    técnicas de la Fase 1 completadas.»
 *
 * — y ahí terminaba la oración. La fuente (`lib/siat.ts`) dice lo mismo pero
 * sigue: *«Quedan las etapas formales del trámite (inspección del SIN)»*. En
 * ese contexto, la frase recortada se lee de una sola manera: que Onia ya
 * factura. **No factura**: nuestra propia fila de `CONTENDIENTES` dice
 * `siat: "tramite"`.
 *
 * Y es otra vez el barrido a medias. Las otras DOS páginas que tocan el tema ya
 * lo decían bien el mismo día —la FAQ de la portada («la homologación está en
 * trámite. Mientras tanto … facturás en el Portal Web del SIN») y
 * `/v1/modulos/dental` («en trámite de homologación; mientras tanto, podés
 * emitir por el portal gratuito»)—. Dos de tres. La regla de `CLAUDE.md` —*una
 * promesa que cambia se barre en TODA la superficie*— falló donde siempre: en
 * el hermano que nadie estaba tocando.
 *
 * ⚠️ **Esto NO es exhibir obra, y la decisión ya estaba tomada**: la cabecera
 * de `obra-en-el-cuerpo.test.ts` exime explícitamente la advertencia fiscal
 * porque *«es la advertencia que evita que una clínica compre creyendo que
 * factura … y sacarla convertiría una honestidad en una promesa falsa»*. Este
 * gate no agrega una política nueva: aplica la existente al hermano que quedó
 * atrás.
 *
 * ⚠️ **El gate se apaga solo el día que el emisor se homologue.** El sujeto
 * sale de los DATOS, no de una lista de frases: si `siat` pasa a `"si"` en la
 * fila de Onia, el primer caso falla y avisa que el resto dejó de aplicar. Un
 * gate que se apaga en silencio es peor que uno que no existe.
 */

/** La fila de Onia: la única que dice qué tiene el producto de verdad. */
const ONIA = CONTENDIENTES.find((c) => c.esOnia);

/**
 * AFIRMA el logro fiscal: registro ante el SIN, o pruebas técnicas completadas.
 *
 * Se ancla en el par (verbo + SIN) y en «pruebas técnicas», que son las dos
 * formas en que la afirmación estuvo escrita. No alcanza con buscar «SIN» a
 * secas: la palabra aparece en toda la superficie fiscal legítima (el portal
 * gratuito, las RND, la Oficina Virtual) y el gate daría rojo sobre páginas
 * sanas — el falso positivo caro, el que manda a borrar la honestidad.
 */
const AFIRMA_FISCAL =
  /\b(?:registrad[oa]s?|habilitad[oa]s?|autorizad[oa]s?)\b[^.]{0,90}\bSIN\b|\bpruebas\s+t[eé]cnicas\b/i;

/**
 * SALVA: dice, en la misma página, que el trámite sigue abierto.
 *
 * Cualquiera de las tres formas vivas cuenta, porque las tres dejan al lector
 * sabiendo lo mismo. No se exige una redacción única: eso obligaría a
 * reescribir dos páginas que hoy están bien dichas, y un gate que pide
 * uniformidad de estilo termina desobedecido.
 */
const TRAE_LA_SALVEDAD =
  /\ben\s+tr[aá]mite\b|\btr[aá]mite\s+de\s+homologaci[oó]n\b|\bhomologaci[oó]n\s+(?:est[aá]\s+en\s+tr[aá]mite|conclu)|\bquedan\s+las\s+etapas\s+formales\b|\bportal\s+(?:web\s+)?(?:gratuito|en\s+l[ií]nea)\b|\bPortal\s+Web\s+del\s+SIN\b/i;

/** El cuerpo de una página, sin comentarios y con los espacios aplanados. */
function cuerpoDe(archivo: string): string {
  return readFileSync(archivo, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^[ \t]*\/\/.*$/gm, " ")
    // El JSX parte las frases en varias líneas: se aplanan los espacios antes
    // de buscar, o «registrado ante el SIN con las\n pruebas» no matchea nada.
    // Sin esto el gate falla ABIERTO, que es como no tenerlo.
    .replace(/\s+/g, " ");
}

/**
 * Cuánto texto cuenta como «al lado» de la afirmación. Dos oraciones largas.
 *
 * ⚠️ **Esta ventana es el gate.** La primera versión buscaba la salvedad en el
 * ARCHIVO ENTERO y daba VERDE sobre el defecto que vino a cazar: `/nosotros`
 * tiene, noventa líneas más arriba y en otro bloque, un principio titulado
 * «Honestidad primero» que dice *"Lo que está en trámite lo publicamos como en
 * trámite"*. El patrón lo contaba como salvedad — o sea que la página que
 * promete la honestidad tapaba al gate con su propia declaración de
 * principios, mientras el párrafo fiscal seguía roto.
 *
 * La lección, que vale para todo gate del tipo «si afirma A, tiene que traer
 * B»: **el sujeto es la VECINDAD de A, nunca el documento.** Una persona lee un
 * párrafo, no un archivo; una salvedad a dos pantallas de distancia no
 * desambigua nada. Es un eslabón distinto de las trampas ya conocidas (sujeto
 * mal elegido, patrón mal escrito, dato importado, dato dentro de una imagen):
 * acá el sujeto y el patrón están bien y lo que falla es el ALCANCE.
 */
const AL_LADO = 340;

/** ¿La afirmación que empieza en `desde` trae su salvedad al lado? */
function salvedadJuntoA(cuerpo: string, desde: number): boolean {
  return TRAE_LA_SALVEDAD.test(cuerpo.slice(desde, desde + AL_LADO));
}

describe("la promesa fiscal nunca se publica sin su salvedad", () => {
  it("hoy la factura fiscal NO está cumplida — si esto falla, el gate se apagó solo y está bien", () => {
    expect(ONIA, "CONTENDIENTES perdió la fila con esOnia: sin ella este gate no mide nada").toBeDefined();
    expect(ONIA?.estados.siat).not.toBe("si");
  });

  it("la fuente canónica ya no afirma el registro ante el SIN", () => {
    // Hasta el 2026-10-01 el ancla era `SIAT_ESTADO_ONIA`: afirmación +
    // salvedad juntas. Ese día Sergio Urcullo sacó de la venta el estado del
    // emisor (registro, pruebas, homologación): la venta no exhibe obra. La
    // constante se borró, y con ella la afirmación. Si alguien la vuelve a
    // escribir en la fuente, este caso pide que venga con su salvedad.
    for (const texto of [
      SIAT_GUIA_CIERRE,
      ...SIAT_BLOQUES.map((b) => `${b.titulo} ${b.texto}`),
      ...SIAT_FAQ.map((f) => `${f.q} ${f.a}`),
    ]) {
      if (!AFIRMA_FISCAL.test(texto)) continue;
      expect(
        TRAE_LA_SALVEDAD.test(texto),
        `lib/siat.ts volvió a afirmar el logro fiscal sin salvedad: «${texto.slice(0, 120)}…»`,
      ).toBe(true);
    }
  });

  it("los patrones separan las frases REALES sanas de la que estuvo rota", () => {
    // Sin este ancla, un patrón roto deja los casos de abajo en verde sobre
    // cualquier cosa. Los tres textos son de producción, del 2026-09-06.
    const rota =
      "nuestro emisor de facturación está registrado ante el SIN con las " +
      "pruebas técnicas de la Fase 1 completadas. Lo probás tal como está hoy";
    expect(AFIRMA_FISCAL.test(rota), "el gate dejó de reconocer la frase que estuvo rota").toBe(true);
    expect(TRAE_LA_SALVEDAD.test(rota), "el gate cree que la frase rota traía salvedad").toBe(false);

    for (const sana of [
      "Nuestro emisor está registrado ante el SIN y la homologación está en trámite. " +
        "Mientras tanto cada venta queda lista y facturás en el Portal Web del SIN, gratis y legal.",
      "Nuestro emisor ya está registrado ante el SIN y en trámite de homologación; mientras " +
        "tanto, podés emitir por el portal gratuito del SIN ingresando los datos de cada factura.",
    ]) {
      expect(AFIRMA_FISCAL.test(sana)).toBe(true);
      expect(
        TRAE_LA_SALVEDAD.test(sana),
        `el gate daría rojo sobre una página que HOY está bien dicha: «${sana.slice(0, 60)}…»`,
      ).toBe(true);
    }

    // Y no se dispara donde no hay promesa fiscal: «SIN» suelto es común en la
    // superficie legítima y no puede bastar para acusar a una página.
    expect(
      AFIRMA_FISCAL.test("emitís por el portal gratuito del SIN, ingresando los datos de cada factura"),
      "el patrón se dispara con «SIN» suelto: daría rojo sobre toda la superficie fiscal honesta",
    ).toBe(false);
  });

  it("una salvedad lejos, en otro bloque de la misma página, NO cuenta", () => {
    // El caso que dejó al gate en verde sobre el defecto. Es texto REAL de
    // `/nosotros` el 2026-09-06: el principio «Honestidad primero» está al
    // principio del archivo y el párrafo fiscal al final. Buscando en todo el
    // archivo, el primero absuelve al segundo y el gate no sirve para nada.
    const comoSeLeeElArchivo =
      'detalle: "Lo que está en trámite lo publicamos como en trámite, con su fecha ' +
      'y su resolución." ' +
      "x".repeat(AL_LADO) +
      " nuestro emisor de facturación está registrado ante el SIN con las pruebas " +
      "técnicas de la Fase 1 completadas. Lo probás tal como está hoy.";

    const afirma = AFIRMA_FISCAL.exec(comoSeLeeElArchivo);
    expect(afirma, "el patrón dejó de reconocer la afirmación").not.toBeNull();
    expect(
      TRAE_LA_SALVEDAD.test(comoSeLeeElArchivo),
      "el archivo entero SÍ trae la palabra: por eso mirar el archivo entero falla abierto",
    ).toBe(true);
    expect(
      salvedadJuntoA(comoSeLeeElArchivo, afirma!.index),
      "el gate volvió a mirar el archivo entero: una salvedad a dos pantallas absuelve un párrafo roto",
    ).toBe(false);
  });

  it.each(PAGINAS.map((p) => [p.ruta || "/", p] as const))(
    "%s no afirma el registro ante el SIN sin decir, ahí mismo, que el trámite sigue abierto",
    (ruta, pagina) => {
      const cuerpo = cuerpoDe(archivoDe(pagina));

      // TODAS las afirmaciones, no sólo la primera: una página puede tocar el
      // tema en dos bloques y tener bien dicho sólo uno.
      const patron = new RegExp(AFIRMA_FISCAL.source, "gi");
      const huerfanas: string[] = [];
      for (let m = patron.exec(cuerpo); m; m = patron.exec(cuerpo)) {
        if (salvedadJuntoA(cuerpo, m.index)) continue;
        huerfanas.push(`«…${cuerpo.slice(m.index, m.index + 120)}…»`);
      }

      expect(
        huerfanas,
        `${ruta} afirma el logro fiscal y NO dice ahí mismo que el trámite sigue ` +
          `abierto. Onia todavía no factura (CONTENDIENTES: siat="${ONIA?.estados.siat}"), ` +
          `así que suelta se lee como que ya factura. Desde el 2026-10-01 la venta no ` +
          `nombra el estado del emisor: sacá la afirmación.\n` +
          huerfanas.join("\n"),
      ).toEqual([]);
    },
  );
});
