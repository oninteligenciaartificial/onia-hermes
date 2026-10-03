import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * La factura fiscal NO se vende como parte del producto.
 *
 * Medido el 2026-09-04: el contenedor `onia-platform` de producción tiene CERO
 * variables `SIAT_*` (`docker exec onia-platform env | grep -c SIAT` → 0). El
 * emisor está en trámite de homologación ante el SIN, y `proof.ts` lo dice de
 * frente en su propia fila (`siat: "tramite"`) y en el ledger `TODAVIA_NO`.
 *
 * Y aun así el pie de TODAS las páginas listaba «Facturación SIAT» dentro de la
 * columna **Producto**, al lado de Precios, Rubros y Agentes. Esa columna
 * enumera lo que el cliente compra: poner ahí la factura fiscal la declara
 * incluida, en la única superficie que no tiene la corrección al lado — el pie
 * aparece en las seis páginas y en ninguna dice «trámite». Sergio le escribe
 * esta semana a 7 leads; el más caro es una clínica que factura.
 *
 * Lo que este gate NO hace, y es a propósito: no prohíbe la palabra «SIAT» en
 * el sitio. `/facturacion` y `/guia-facturacion` son guías HONESTAS sobre la
 * facturación en línea (desde el 3-oct: el plazo del 1 de octubre de 2026 que
 * la RND 102600000038 dejó sin efecto) — explican que el Portal Web del SIN es
 * gratuito y que Onia todavía no emite. Un gate que prohibiera el literal
 * obligaría a borrarlas, que es exactamente al revés de lo que hay que hacer:
 * el problema nunca fue nombrar la norma, fue venderla como función nuestra.
 *
 * La invariante es de UBICACIÓN y de VOZ, no de vocabulario.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, "..", "..");
const PIE = readFileSync(join(RAIZ, "components", "site-footer.tsx"), "utf8");
const PROOF = readFileSync(join(RAIZ, "lib", "proof.ts"), "utf8");

/** Las columnas del pie que enumeran lo que se COMPRA. */
const COLUMNAS_DE_OFERTA = ["Producto", "Servicios"];

/**
 * Los links de un grupo del pie, leídos del archivo.
 *
 * Se recorta por título de grupo hasta el cierre del array: el pie declara los
 * grupos como literales, así que el corte es estable y no hace falta ejecutar
 * el componente.
 */
function linksDelGrupo(src: string, titulo: string): string {
  const desde = src.indexOf(`titulo: "${titulo}"`);
  if (desde === -1) return "";
  const hasta = src.indexOf("],", desde);
  return src.slice(desde, hasta);
}

/** Nombra la factura fiscal como capacidad: «SIAT», «factura electrónica», etc. */
const CLAMA_FACTURA = /siat|factura(ci[oó]n)?\s+(electr[oó]nica|fiscal)/i;

describe("la factura fiscal no se ofrece como producto", () => {
  it("el pie declara sus columnas de oferta", () => {
    // Ancla: si alguien renombra las columnas, los casos de abajo dejarían de
    // mirar nada y pasarían en verde sin vigilar. Que falle acá y se actualice
    // a mano, a la vista.
    for (const titulo of COLUMNAS_DE_OFERTA) {
      expect(PIE, `el pie ya no tiene la columna "${titulo}"`).toContain(
        `titulo: "${titulo}"`,
      );
    }
  });

  it.each(COLUMNAS_DE_OFERTA)(
    "la columna %s del pie no ofrece la factura fiscal",
    (titulo) => {
      const grupo = linksDelGrupo(PIE, titulo);
      const etiquetas = [...grupo.matchAll(/label:\s*"([^"]+)"/g)].map(
        (m) => m[1],
      );

      expect(etiquetas.length, `no se leyeron links de "${titulo}"`).toBeGreaterThan(0);

      const ofrecidas = etiquetas.filter((e) => CLAMA_FACTURA.test(e));
      expect(
        ofrecidas,
        `la columna "${titulo}" del pie enumera lo que el cliente compra, y el ` +
          `emisor fiscal está en trámite ante el SIN (cero variables SIAT_* en ` +
          `producción). Si la guía de la norma va en el pie, va como guía y ` +
          `fuera de "${COLUMNAS_DE_OFERTA.join('" y "')}".`,
      ).toEqual([]);
    },
  );

  it("la comparación sigue declarando el emisor en trámite", () => {
    // La fila de Onia en la tabla es la corrección que sostiene toda la
    // honestidad del sitio. Pasarla a "si" es exactamente el commit que hay que
    // frenar mientras produccion no tenga el emisor encendido: hoy no lo tiene.
    const filaOnia = PROOF.slice(PROOF.indexOf('id: "onia"'));
    const estados = filaOnia.slice(0, filaOnia.indexOf("veredicto"));

    expect(
      estados,
      'la fila de Onia dejó de declarar `siat: "tramite"`. Si el emisor ya está ' +
        "homologado y encendido en producción, este gate se actualiza a mano y " +
        "con la evidencia (variables SIAT_* vivas en el contenedor).",
    ).toMatch(/siat:\s*"tramite"/);
  });
});

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * El tercer eslabón del mismo barrido a medias.
 *
 * `198cca363` sacó «Facturación SIAT» del PIE de las 52 páginas. `5423e2f50`
 * la sacó del CUERPO de la portada. Y el 2026-09-05, con los dos arreglos
 * dentro, `onia.com.bo` seguía anunciando la factura como módulo del producto
 * en los dos lugares que ningún instrumento mira:
 *
 *   1. el JSON-LD de la portada y de su gemela `/v1` — «Sistema de gestión con
 *      IA …: agenda, clientes, cobros, FACTURACIÓN y agentes» —, que es la
 *      descripción que Google lee del producto; y
 *   2. `SITE_DESCRIPTION` del layout raíz — «encendés módulos cuando los
 *      necesités: … chatbot de WhatsApp, FACTURACIÓN SIAT» —, que es la
 *      descripción que hereda toda ruta sin metadata propia (hoy `/patrones`
 *      y **la página 404**, la que ve el lead que abre un link viejo).
 *
 * Las dos son `<head>`: no salen en una captura, no las ve un gate de pantalla
 * y no las ve el barrido del pie de arriba. La misma familia que la tarjeta de
 * OpenGraph (`d85ebacb0`) y que la meta description de `/terminos`.
 *
 * La invariante NO es de vocabulario —prohibir «factura» borraría las guías
 * honestas, que es al revés de lo que hay que hacer— sino de VOZ: si un texto
 * de metadata nombra la factura, el mismo bloque de metadata tiene que nombrar
 * también el trámite o el portal del SIN. Enumerarla seca, entre módulos que
 * sí entregamos, es venderla.
 */

/** Los archivos de `src/app` — el sujeto sale del DISCO, no de una lista. */
function archivosDeApp(dir: string, acc: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (entrada.name === "node_modules" || entrada.name === "__tests__") continue;
      archivosDeApp(ruta, acc);
    } else if (/\.tsx?$/.test(entrada.name) && !/\.test\.tsx?$/.test(entrada.name)) {
      acc.push(ruta);
    }
  }
  return acc;
}

/**
 * Las cadenas que viajan al `<head>` o al JSON-LD de un archivo.
 *
 * Dos formas, porque el defecto vivía en las dos: la clave directa
 * (`description: "…"`, también dentro del `@graph`) y la constante que después
 * se asigna (`const SITE_DESCRIPTION = "…"`). Mirar sólo la primera dejaba
 * afuera justo al layout raíz.
 */
function textosDeMetadata(src: string): string[] {
  const claves = [...src.matchAll(/\b(?:title|description|headline)\s*:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)];
  const constantes = [
    ...src.matchAll(
      /const\s+\w*(?:TITLE|DESCRIPTION|DESC|TITULO|DESCRIPCION)\w*\s*(?::[^=]+)?=\s*\n?\s*"((?:[^"\\]|\\.)*)"/gi,
    ),
  ];
  return [...claves, ...constantes].map((m) => m[1]);
}

/** Nombra la factura como cosa, no como tema: «facturación», «SIAT», «facturar». */
const NOMBRA_FACTURA = /\bSIAT\b|\bfacturaci[oó]n\b|\bfacturas?\b|\bfacturar\b/i;

/** La corrección que convierte la mención en guía: el trámite, o el portal del SIN. */
const DICE_LA_VERDAD =
  /tr[aá]mite|todav[ií]a no|portal|oficina virtual|gratis|gratuit|homologaci/i;

const ARCHIVOS_APP = archivosDeApp(join(RAIZ, "app"));

describe("la factura no se enumera como módulo en el <head>", () => {
  it("el barrido encuentra la metadata del sitio", () => {
    // Ancla: si el regex deja de reconocer cómo se escribe la metadata, el
    // caso de abajo recorrería cero cadenas y pasaría en verde sin vigilar
    // nada. 15 es holgado: hoy hay más de 30 páginas con metadata propia.
    const conMetadata = ARCHIVOS_APP.filter((f) => textosDeMetadata(readFileSync(f, "utf8")).length > 0);
    expect(conMetadata.length, "el barrido de metadata dejó de ver archivos").toBeGreaterThan(15);
  });

  it("ninguna metadata nombra la factura sin nombrar el trámite", () => {
    const culpables: string[] = [];

    for (const archivo of ARCHIVOS_APP) {
      const textos = textosDeMetadata(readFileSync(archivo, "utf8"));
      const nombran = textos.filter((t) => NOMBRA_FACTURA.test(t));
      if (nombran.length === 0) continue;
      if (textos.some((t) => DICE_LA_VERDAD.test(t))) continue;
      culpables.push(`${relative(RAIZ, archivo)} → «${nombran[0]}»`);
    }

    expect(
      culpables,
      "esa metadata enumera la factura entre lo que el sistema hace, y el " +
        "emisor está en trámite ante el SIN (`proof.ts` → siat: \"tramite\", " +
        "cero variables SIAT_* en producción). No hay que borrar la palabra: " +
        "hay que decir al lado que la factura se emite hoy en el Portal del SIN.",
    ).toEqual([]);
  });
});
