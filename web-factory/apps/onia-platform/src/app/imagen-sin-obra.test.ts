import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Ninguna imagen que el sitio SIRVE es una captura literal del sistema.
 *
 * Son dos reglas de Sergio Urcullo, y la misma imagen rompía las dos:
 *
 *  - 2026-09-01: *"no coloques capturas literales del sistema, se ve mal, coloca
 *    cosas referenciales"*.
 *  - 2026-08-20: *"no entiendo por qué dices si es que estamos construyendo algo
 *    que aún no está listo… hace escapar a los clientes"* — «La venta nunca
 *    exhibe obra» en `CLAUDE.md`.
 *
 * POR QUÉ HACÍA FALTA, y es el punto entero de este archivo: **ningún gate de
 * este repo puede leer lo que dice un PNG.** Medido el 2026-09-24 sobre
 * producción, no sobre una hipótesis: `onia.com.bo/v1` servía
 * `/capturas/rubros-onia.webp`, 1200×824, y adentro —en píxeles— tenía
 *
 *  1. la banda **«MUY PRONTO»**, que es LA frase que da nombre a la regla;
 *  2. **seis** rubros ofrecidos, incluida Veterinaria, que salió del alta el
 *     13-ago: el sitio vende cinco.
 *
 * Y todo estaba VERDE. Cada gate por su motivo, y cada motivo correcto:
 *
 *  - `obra-literal.test.ts` persigue el literal por la cadena de imports. El
 *    literal no estaba en el código: estaba dibujado.
 *  - `rubros-en-la-prosa.test.ts` y el alias `rubros:vivos` cruzan los rubros
 *    que el sitio ESCRIBE contra los que entrega el alta. Acá el sitio escribía
 *    cinco —el párrafo, el `alt`, `CUANTOS_RUBROS`— y pintaba seis. El texto y
 *    los píxeles se contradecían, y sólo el texto tenía dueño.
 *  - La medición de arranque del carril (`grep -ciE "muy pronto|…"` sobre el
 *    HTML de producción) devolvía **0**. Un `grep` no entra en un `.webp`.
 *
 * O sea: el defecto no se escapó por un sujeto mal derivado ni por un patrón
 * corto. Se escapó porque **nadie hacía la pregunta**, y la superficie que la
 * necesitaba era la única que ningún instrumento de texto alcanza.
 *
 * CÓMO NO FALLA EN VERDE, que es como se muere esta familia de gates:
 *
 *  1. **El sujeto se deriva del disco.** Se recorre `src/` entero y se juntan
 *     TODAS las rutas de imagen que el código referencia. Una imagen nueva nace
 *     cubierta: hay que declararla a mano, a la vista, con su motivo.
 *  2. **No se puede declarar la salida.** Una ruta que se llama `capturas/` es
 *     una captura por su propio nombre y se rechaza aunque esté declarada. Si
 *     la regla se pudiera apagar con una línea del inventario, el inventario
 *     sería el agujero.
 *  3. **Se ancla con un caso que SÍ tiene que encontrar.** Si el recorrido se
 *     rompe, no junta rutas, nada viola nada y el gate firma verde sobre un
 *     sitio sin vigilancia. Abajo se exige encontrar el logo, que está en
 *     decenas de pantallas.
 *  4. **Se ancla que la regla MUERDE**, pasándole una captura fabricada: sin
 *     eso, un clasificador que devolviera "todo bien" siempre también pasaría.
 *
 * ⚠️ Esto NO promete que las imágenes declaradas no digan nada prohibido: no
 * hay OCR acá, y una foto referencial podría traer texto dibujado. Promete lo
 * que sí se puede medir sin mirar píxeles — que el sitio no sirva capturas del
 * sistema, que es la clase de imagen donde vive el texto de producto—, y deja
 * el resto al ojo. Un gate que prometiera más de lo que mide sería peor que
 * ninguno.
 */

const APP = dirname(fileURLToPath(import.meta.url));
const SRC = join(APP, "..");
const PUBLIC = join(SRC, "..", "public");

const EXTENSIONES = /\.(webp|png|jpe?g|avif|gif|svg)$/i;

/**
 * Toda ruta de imagen que el código referencia, sacada del disco.
 *
 * Se lee el árbol COMPLETO de `src/` —`.ts`, `.tsx` y `.css`— y no la cadena de
 * imports de cada página. Es a propósito: un recorrido por imports deja afuera
 * lo que todavía no está enlazado, y para un gate de seguridad conviene fallar
 * con sujetos DE MÁS, nunca de menos. Una imagen referenciada por un componente
 * que hoy nadie monta sigue estando en el árbol que se despliega.
 */
export function imagenesReferenciadas(dir: string = SRC): string[] {
  const halladas = new Set<string>();
  const patron = new RegExp('["\'(\\s]\\/([\\w./-]+\\.(?:webp|png|jpe?g|avif|gif|svg))', "gi");

  const recorrer = (actual: string) => {
    for (const entrada of readdirSync(actual, { withFileTypes: true })) {
      const camino = join(actual, entrada.name);
      if (entrada.isDirectory()) {
        recorrer(camino);
        continue;
      }
      if (!/\.(tsx?|css)$/.test(entrada.name)) continue;
      // Un test no es superficie de venta: nombra rutas para medirlas.
      if (/\.test\.tsx?$/.test(entrada.name)) continue;
      const texto = readFileSync(camino, "utf8");
      for (const m of texto.matchAll(patron)) halladas.add("/" + m[1]);
    }
  };
  recorrer(dir);
  return [...halladas].sort();
}

/**
 * Lo que el sitio tiene derecho a servir, con el motivo de cada una.
 *
 * `marca` son los logos; `referencial` son las fotos de contexto —gente y
 * lugares del rubro, que es exactamente lo que Sergio Urcullo pidió en lugar de
 * las capturas—. No hay una tercera clase: una pantalla del producto se
 * CONSTRUYE con markup (`<Shot>` + `<Row>`, ver `landing-v1/shot.tsx`), y así
 * queda bajo los gates de texto que ya existen en vez de esconderse en un
 * raster.
 */
const IMAGENES_DECLARADAS: Record<string, { clase: "marca" | "referencial"; motivo: string }> = {
  "/brand/v2/onia-logo.svg": { clase: "marca", motivo: "logotipo sobre fondo claro" },
  "/brand/v2/onia-logo-dark.svg": { clase: "marca", motivo: "logotipo sobre fondo oscuro" },
  "/favicon.ico": { clase: "marca", motivo: "icono de la pestaña" },
  "/contexto/dental.webp": { clase: "referencial", motivo: "recepción de un consultorio dental" },
  "/contexto/comercio.webp": { clase: "referencial", motivo: "mostrador de una ferretería" },
  "/contexto/importadora.webp": { clase: "referencial", motivo: "depósito de una importadora" },
  "/contexto/estetica.webp": { clase: "referencial", motivo: "camilla de un centro de estética" },
  "/contexto/servicios.webp": { clase: "referencial", motivo: "escritorio de una contadora" },
  "/fotos/ferreteria.webp": { clase: "referencial", motivo: "dueño atendiendo su mostrador" },
  "/fotos/ferreteria-480.webp": { clase: "referencial", motivo: "la misma foto, 480w" },
  "/fotos/ferreteria-960.webp": { clase: "referencial", motivo: "la misma foto, 960w" },
  "/fotos/dueno-duerme.webp": { clase: "referencial", motivo: "el dueño durmiendo: el dolor" },
  "/fotos/dueno-duerme-480.webp": { clase: "referencial", motivo: "la misma foto, 480w" },
  "/fotos/dueno-duerme-960.webp": { clase: "referencial", motivo: "la misma foto, 960w" },
  "/fotos/duena-telefono.webp": { clase: "referencial", motivo: "la dueña con el teléfono" },
  "/fotos/duena-telefono-480.webp": { clase: "referencial", motivo: "la misma foto, 480w" },
  "/fotos/duena-telefono-960.webp": { clase: "referencial", motivo: "la misma foto, 960w" },
  // MIRADA antes de declararla (2026-09-24): son seis fotos de negocios —yoga,
  // atelier, obra, cerámica, restaurante, tienda— en un pliego que el
  // configurador usa como fondo. Cero UI del producto, cero texto dibujado.
  "/web-layout-examples.png": {
    clase: "referencial",
    motivo: "pliego de fotos de rubro, fondo de la vista previa de /servicios/webs",
  },
};

/** Una ruta que se nombra captura ES una captura: no hay declaración que la salve. */
export function esCapturaLiteral(ruta: string): boolean {
  return /(^|\/)(capturas?|screenshots?|pantallas)\//i.test(ruta);
}

describe("ninguna imagen del sitio es una captura literal del sistema", () => {
  const referenciadas = imagenesReferenciadas();

  it("el recorrido encuentra imágenes de verdad (ancla del instrumento)", () => {
    // Si esto falla, el `expect` de abajo no prueba NADA: no habría sujetos.
    expect(referenciadas).toContain("/brand/v2/onia-logo.svg");
    expect(referenciadas.length).toBeGreaterThan(5);
  });

  it("la regla muerde una captura fabricada (ancla del criterio)", () => {
    expect(esCapturaLiteral("/capturas/rubros-onia.webp")).toBe(true);
    expect(esCapturaLiteral("/screenshots/panel.png")).toBe(true);
    expect(esCapturaLiteral("/contexto/dental.webp")).toBe(false);
  });

  it("no se sirve ninguna captura literal", () => {
    const capturas = referenciadas.filter(esCapturaLiteral);
    expect(
      capturas,
      `El sitio referencia ${capturas.length} captura(s) literal(es) del sistema: ` +
        `${capturas.join(", ")}. Una pantalla del producto se construye con markup ` +
        `(<Shot> + <Row>), no se fotografía: así el texto de adentro queda bajo los ` +
        `gates que ya existen. Regla de Sergio Urcullo, 2026-09-01.`,
    ).toEqual([]);
  });

  it("toda imagen referenciada está declarada, con su motivo", () => {
    const sinDeclarar = referenciadas.filter((r) => !(r in IMAGENES_DECLARADAS));
    expect(
      sinDeclarar,
      `Imagen(es) sin declarar: ${sinDeclarar.join(", ")}. Agregala a ` +
        `IMAGENES_DECLARADAS con su clase y su motivo — y si es una pantalla del ` +
        `producto, no la agregues: construila con markup.`,
    ).toEqual([]);
  });

  it("no queda un archivo de captura en public/", () => {
    // El nombre de la carpeta es el defecto: mientras exista, alguien la vuelve
    // a referenciar. Se mide el disco, no el código.
    const sospechosas = existsSync(PUBLIC)
      ? readdirSync(PUBLIC, { withFileTypes: true })
          .filter((e) => e.isDirectory() && /^(capturas?|screenshots?|pantallas)$/i.test(e.name))
          .map((e) => relative(PUBLIC, join(PUBLIC, e.name)))
      : [];
    expect(
      sospechosas,
      `Carpeta(s) de capturas vivas en public/: ${sospechosas.join(", ")}. ` +
        `Borrala: el deploy publica public/ entero, así que el archivo sigue ` +
        `sirviéndose por su URL aunque ningún componente lo referencie.`,
    ).toEqual([]);
  });

  it("las declaradas existen en el disco (no se declara lo que no está)", () => {
    const fantasma = Object.keys(IMAGENES_DECLARADAS)
      .filter((r) => referenciadas.includes(r))
      .filter((r) => {
        const camino = join(PUBLIC, r.replace(/^\//, ""));
        return !existsSync(camino) || !statSync(camino).isFile();
      });
    expect(fantasma, `Declaradas y referenciadas, pero no están en public/: ${fantasma.join(", ")}`).toEqual([]);
  });
});
