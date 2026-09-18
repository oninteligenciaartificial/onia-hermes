import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Una foto del sitio de venta se sirve en el TAMAÑO EN QUE SE PINTA.
 *
 * QUÉ PASÓ, medido el 2026-09-18 contra `onia.com.bo` con Playwright. La única
 * foto de la home —`/fotos/dueno-duerme.webp`, 104 KB, 1600×900— se pintaba a
 * **272 CSS px** en un celular de 390 px y a **501 px** en escritorio, sin
 * `srcset`. O sea: un lead que entra desde el teléfono con datos móviles —que
 * en Bolivia es la mayoría— bajaba 104 KB para ver una imagen de 272 px de
 * ancho. Recomprimida a 960w se ve idéntica y pesa 31 KB: **73 KB de menos, el
 * 70%**, sobre un total de 431 KB de la página. Las otras dos fotos de venta
 * (`ferreteria`, `duena-telefono`, en `/v1`) tenían el mismo agujero.
 *
 * Y el original NO estaba mal comprimido: re-encodearlo a 1600w y calidad 85 da
 * 100 KB, prácticamente lo mismo. El desperdicio era exclusivamente servir 1600
 * píxeles para pintar 272. Por eso la cura es `srcset`, no recomprimir.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ⚠️ LO QUE ESTE GATE NO ES, y es lo que casi se construye en su lugar.
 *
 * La cola (`hermes-content/docs/cola/plataforma-v1.md`, ítem (b)) diagnosticaba
 * esta misma foto como la causa de un **LCP móvil de 3,1 s** y mandaba a
 * ponerle `fetchpriority=high` y sacarle el `loading="lazy"`. Medido antes de
 * obedecer, ese remedio es una REGRESIÓN:
 *
 *   · la foto está a **3.109 px de scroll** en un viewport de 844 px — casi
 *     cuatro pantallas abajo, o sea nunca entra en el viewport inicial y por
 *     definición no puede ser el elemento LCP;
 *   · el elemento LCP real es **texto del hero**, en los dos viewports, y con
 *     throttling Slow-4G + CPU 4× el LCP móvil da **1.440 ms**, no 3.100;
 *   · `fetchpriority=high` sobre una imagen de 104 KB que nadie ve todavía la
 *     pone a competir por ancho de banda contra el hero, que SÍ es el LCP.
 *
 * Por eso el sujeto de este gate es el PESO SERVIDO, no la prioridad de carga:
 * `loading="lazy"` acá es correcto y no se toca.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ CRUZA EL BINARIO Y NO SÓLO EL TEXTO. Un `srcset` es una PROMESA
 * sobre archivos que se generan a mano (`ffmpeg -vf scale=…`, porque el
 * standalone del VPS no trae `sharp` y `next/image` no optimiza ahí). Las dos
 * formas en que esa promesa se rompe callada:
 *
 *   · el archivo no existe → el navegador no avisa, cae al `src` y volvemos al
 *     desperdicio, con el `srcset` escrito y todo verde;
 *   · el archivo existe pero mide OTRA cosa que su descriptor `Nw` → el
 *     navegador elige con el número declarado y sirve el tamaño equivocado.
 *
 * Así que el ancho se lee del BINARIO, que es una fuente independiente del
 * texto que el gate juzga. Un gate que comparara el `srcset` contra una lista
 * escrita al lado sería el mismo espejo dos veces.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = AQUI;
const PUBLICO = join(AQUI, "..", "public");

/** Los tres sujetos vivos el día que se escribió esto. Ver `universoCompleto`. */
const CONOCIDOS = [
  "/fotos/dueno-duerme.webp",
  "/fotos/ferreteria.webp",
  "/fotos/duena-telefono.webp",
];

function archivosDe(dir: string): string[] {
  const salida: string[] = [];
  for (const entrada of readdirSync(dir)) {
    // Los gates vecinos siembran y borran directorios `__algo__` dentro de la
    // misma corrida: un sujeto que desaparece mientras lo leés no es superficie
    // de cliente, y enumerarlo pone rojo este gate con el producto sano.
    if (/^__.+__$/.test(entrada) || entrada === "node_modules") continue;
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) salida.push(...archivosDe(ruta));
    else if (/\.(tsx|ts)$/.test(entrada) && !/\.test\.tsx?$/.test(entrada)) salida.push(ruta);
  }
  return salida;
}

type Foto = { archivo: string; etiqueta: string; src: string };

/**
 * Las `<img>` que sirven una foto de `/fotos/`. El universo se camina del
 * DISCO y no con `git ls-files`: un componente recién escrito y sin commitear
 * es justo el sujeto que esto existe para no perder.
 */
function fotosDeVenta(): Foto[] {
  const salida: Foto[] = [];
  for (const archivo of archivosDe(SRC)) {
    const texto = readFileSync(archivo, "utf8");
    for (const etiqueta of texto.match(/<img\b[\s\S]*?\/>/g) ?? []) {
      const src = etiqueta.match(/\bsrc="(\/fotos\/[^"]+)"/)?.[1];
      if (src) salida.push({ archivo: archivo.slice(SRC.length + 1), etiqueta, src });
    }
  }
  return salida;
}

/**
 * Ancho real en píxeles de un WebP, leído de su cabecera. Cubre las tres
 * formas del contenedor: un archivo generado con otro encoder puede salir
 * VP8L o VP8X y devolver `null` acá sería un falso verde.
 */
export function anchoWebp(buf: Buffer): number | null {
  if (buf.length < 30) return null;
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") return null;
  const formato = buf.toString("ascii", 12, 16);
  if (formato === "VP8 ") return buf.readUInt16LE(26) & 0x3fff;
  if (formato === "VP8L") return (buf.readUInt32LE(21) & 0x3fff) + 1;
  if (formato === "VP8X") return (buf[24] | (buf[25] << 8) | (buf[26] << 16)) + 1;
  return null;
}

const FOTOS = fotosDeVenta();

describe("las fotos del sitio de venta se sirven en el tamaño en que se pintan", () => {
  it("el universo contiene los sujetos conocidos (si no, el barrido se rompió y firma verde)", () => {
    const encontrados = FOTOS.map((f) => f.src);
    for (const conocido of CONOCIDOS) expect(encontrados).toContain(conocido);
  });

  it.each(FOTOS.map((f) => [f.src, f] as const))("%s declara srcset y sizes", (_src, foto) => {
    expect(
      /\bsrcSet="[^"]+"/.test(foto.etiqueta),
      `${foto.archivo}: <img src="${foto.src}"> sin srcSet — el celular baja la foto entera para pintarla a un tercio`,
    ).toBe(true);
    expect(
      /\bsizes="[^"]+"/.test(foto.etiqueta),
      `${foto.archivo}: <img src="${foto.src}"> sin sizes — sin él el navegador asume 100vw y elige siempre la más grande`,
    ).toBe(true);
  });

  it.each(FOTOS.map((f) => [f.src, f] as const))(
    "%s: cada ancho que promete su srcset existe en disco y mide lo declarado",
    (_src, foto) => {
      const srcset = foto.etiqueta.match(/\bsrcSet="([^"]+)"/)?.[1];
      expect(srcset, `${foto.archivo}: sin srcSet`).toBeTruthy();

      const candidatos = srcset!
        .split(",")
        .map((c) => c.trim().split(/\s+/))
        .map(([ruta, descriptor]) => ({ ruta, declarado: Number(descriptor?.replace(/w$/, "")) }));

      expect(candidatos.length, `${foto.archivo}: un srcset de un solo candidato no elige nada`)
        .toBeGreaterThan(1);

      for (const { ruta, declarado } of candidatos) {
        expect(Number.isFinite(declarado) && declarado > 0, `${foto.archivo}: "${ruta}" sin descriptor Nw`).toBe(true);
        let real: number | null = null;
        expect(() => {
          real = anchoWebp(readFileSync(join(PUBLICO, ruta)));
        }, `${foto.archivo}: el srcset promete ${ruta} y ese archivo no está en public/ — el navegador no avisa, cae al src`).not.toThrow();
        expect(real, `${foto.archivo}: no pude leer el ancho de ${ruta} (¿no es WebP?)`).not.toBeNull();
        expect(
          real,
          `${foto.archivo}: el srcset dice ${ruta} ${declarado}w y el archivo mide ${real}px — el navegador elige con el número declarado`,
        ).toBe(declarado);
      }

      expect(
        candidatos.some((c) => c.ruta === foto.src),
        `${foto.archivo}: el src "${foto.src}" no está entre los candidatos — un navegador sin srcset se queda sin fallback medido`,
      ).toBe(true);
    },
  );
});
