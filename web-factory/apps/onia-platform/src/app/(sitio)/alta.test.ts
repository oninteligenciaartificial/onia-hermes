import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import {
  ALTA_ABIERTA,
  CTA_ALTA,
  ctaAltaPlan,
  FRASE_PROHIBIDA,
  FRASE_RAMA_ABIERTA,
  FRASE_RAMA_CERRADA,
} from "./alta";
import { EMPEZAR_URL, REGISTRO_URL } from "./nav";

/**
 * El guard que ata el CTA a su destino.
 *
 * Lo que se rompió dos veces (23-ago y 29-ago) NO fue una frase mal escrita:
 * fue que la promesa del botón y lo que hace app.onia.com.bo/register se
 * separaron, y nadie se enteró porque el verbo estaba a mano en once archivos.
 *
 * Por eso el invariante no es "la home dice tal frase" — eso queda verde en
 * cuanto alguien cambia la palabra. Son dos, y los dos salen de `ALTA_ABIERTA`:
 *
 *   1. Todo enlace al alta saca su etiqueta de `alta.ts`, no la escribe.
 *      Atrapa el botón NUEVO que alguien agrega mañana con su propia redacción.
 *   2. El vocabulario de la rama APAGADA no sobrevive en ninguna superficie.
 *      Atrapa exactamente el bug: se invierte la bandera y queda un archivo
 *      atrás. Invertir `ALTA_ABIERTA` invierte qué frases están prohibidas, así
 *      que el guard no envejece con el copy.
 *
 * Lo que este guard NO puede ver: si `ALTA_ABIERTA` miente sobre el VPS. Eso
 * vive en otro contenedor y se verifica mirando (ver la cabecera de alta.ts).
 */

const AQUI = dirname(fileURLToPath(import.meta.url));

/**
 * Se barre `src` entero, no solo `(sitio)`.
 *
 * El árbol viejo `/v1` sigue publicado (con noindex, pero servido) y también
 * promete cosas del alta: hoy dice "Crear mi cuenta gratis", que es cierto por
 * casualidad — nadie lo barrió en agosto cuando el alta estaba cerrada. Una
 * superficie viva que nadie mira es exactamente donde se esconde la promesa
 * rota.
 */
const RAIZ = join(AQUI, "..", "..");

/**
 * Los destinos que arrancan el alta, en TODAS las formas en que se escriben.
 *
 * La última — el template literal — no estaba, y por eso el barrido a mano se
 * comió el botón primario del header legado (`site-header.tsx`), que sirve
 * /servicios/*, los legales y el 404 y decía "Probar gratis" apuntando a
 * /register. Un guard que solo conoce la forma que ya barriste no sirve.
 *
 * Se busca `href=` (con `=`, no con `:`): una entrada de menú `{ href: "/empezar",
 * label: "Prueba gratis" }` nombra la PÁGINA, no promete nada del alta.
 *
 * `registroConPlan(…)` entra el 2026-09-29, cuando las tarjetas de plan dejaron
 * de usar `EMPEZAR_URL`: sin él, los cuatro botones más cerca de la compra
 * habrían salido de este guard sin que nadie lo notara.
 */
const HREF_ALTA =
  /href=(?:\{EMPEZAR_URL\}|\{REGISTRO_URL\}|\{registroConPlan\([^)]*\)\}|"\/empezar"|\{`\$\{APP_URL\}\/register`\})/g;

/** Ventana de código tras el `href` donde tiene que estar la etiqueta. */
const VENTANA_ETIQUETA = 140;

/** El vocabulario vive en alta.ts (tiene las DOS ramas) y en este test. */
const EXENTOS = new Set(["alta.ts", "alta.test.ts"]);

/**
 * El árbol v1 (archivado con noindex, pero servido) conserva su voz propia:
 * cuatro CTAs con redacciones distintas y sus `REGISTRO_URL` locales. No se le
 * exige la etiqueta compartida — sí se le exige NO prometer lo que el producto
 * no hace, que es el chequeo que protege al lead. Si el alta se vuelve a
 * cerrar, "Crear mi cuenta gratis" de v1/prueba-gratis pone el guard en rojo y
 * obliga a mirar el archivo entero.
 */
const VOZ_PROPIA = /^(app\/v1\/|components\/landing-v1\/)/;

/**
 * `components/landing-v2/` no lo importa NADIE (verificado 2026-09-01: diez
 * archivos, cero imports; solo lo nombran dos comentarios de switcher.tsx) y su
 * cierre linkea a `/prueba-gratis`, que ya no es una página. No es una
 * superficie: es código muerto, y un guard que vigila copy que nadie renderiza
 * solo enseña a ignorar el guard. Se excluye entero — borrarlo es otro carril.
 */
const MUERTO = /^components\/landing-v2\//;

function fuentes(dir: string, acc: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) fuentes(ruta, acc);
    else if (/\.tsx?$/.test(entrada.name) && !EXENTOS.has(entrada.name))
      acc.push(ruta);
  }
  return acc;
}

/**
 * Los comentarios guardan la HISTORIA del alta y nombran las dos ramas a
 * propósito — una regla sin su historia se desobedece. El guard mira lo que ve
 * el cliente, así que los saca antes de buscar.
 *
 * Solo se descartan comentarios de línea COMPLETA: `//` a mitad de línea es casi
 * siempre `https://`.
 *
 * Los saltos de línea del comentario se conservan: sin eso el guard reporta
 * números de línea corridos y manda a leer la línea equivocada.
 */
function sinComentarios(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (bloque) => bloque.replace(/[^\n]/g, ""))
    .replace(/^[ \t]*\/\/.*$/gm, "");
}

const ARCHIVOS = fuentes(RAIZ)
  .map((ruta) => ({
    nombre: relative(RAIZ, ruta).replace(/\\/g, "/"),
    codigo: sinComentarios(readFileSync(ruta, "utf8")),
  }))
  .filter(({ nombre }) => !MUERTO.test(nombre));

describe("el CTA del alta y su destino no se pueden separar", () => {
  it("encuentra las superficies del sitio", () => {
    expect(ARCHIVOS.length).toBeGreaterThan(10);
  });

  it("las dos ramas tienen vocabularios distintos y la etiqueta sale de la activa", () => {
    const viva = ALTA_ABIERTA ? FRASE_RAMA_ABIERTA : FRASE_RAMA_CERRADA;
    expect(CTA_ALTA).toMatch(viva);
    expect(CTA_ALTA).not.toMatch(FRASE_PROHIBIDA);
    expect(ctaAltaPlan("Pro")).toContain("Pro");
  });

  it("todo enlace al alta saca su etiqueta de alta.ts", () => {
    const aMano: string[] = [];

    for (const { nombre, codigo } of ARCHIVOS) {
      if (VOZ_PROPIA.test(nombre)) continue;
      for (const m of codigo.matchAll(HREF_ALTA)) {
        const ventana = codigo.slice(
          m.index + m[0].length,
          m.index + m[0].length + VENTANA_ETIQUETA,
        );
        if (!/CTA_ALTA|ctaAltaPlan/.test(ventana)) {
          const previo = codigo.slice(0, m.index).split("\n");
          const linea = previo.length;
          const culpable = previo[linea - 1] + m[0] + ventana.split("\n")[0];
          aMano.push(`${nombre}:${linea} → ${culpable.trim()}`);
        }
      }
    }

    expect(aMano, "etiquetas escritas a mano en un enlace al alta").toEqual([]);
  });

  /**
   * El agujero que este bloque tapa: los dos guards de arriba miran la
   * ETIQUETA, y los dos daban verde mientras el botón no creaba ninguna cuenta.
   *
   * Medido el 2026-09-04 sobre el HTML que sirve onia.com.bo: los **nueve**
   * botones de la portada —«Creá tu cuenta» ×4, «Empezar» ×2, «Empezar con el
   * Básico/Pro/Full»— apuntaban a `/empezar`, que es OTRA página de venta y
   * cuyo único botón vuelve a decir «Creá tu cuenta», esta vez sí hacia
   * `app.onia.com.bo/register`. O sea: la etiqueta era correcta, la promesa era
   * correcta, el destino existía y respondía 200 — y el alta estaba a TRES
   * clics. Es el patrón que ya nos costó una semana en el bot: el primer paso
   * anda, el sistema muere en el segundo, y el test sólo mira el primero.
   *
   * `/empezar` no se baja: sigue publicada, sigue en el sitemap y sigue
   * enlazada desde `NAV_DECIDIR` (pie y menú de teléfono), porque su URL
   * circula en firmas y anuncios y `/prueba-gratis` le redirige con 308. Lo que
   * cambia es que deja de estar EN EL CAMINO: el botón que dice que crea la
   * cuenta va a donde se crea la cuenta.
   *
   * Y el paso 1 de `/empezar` era, textual, «Elegí tu rubro… el rubro lo elegís
   * en el primer paso del registro»: la página intermedia describía la pantalla
   * que venía después. Mirado renderizado, `/register` abre con «¿Qué tipo de
   * negocio tenés?» y los cinco rubros. Era el mismo paso, contado dos veces.
   */
  it("el botón que dice que crea la cuenta va donde se crea la cuenta", () => {
    // El destino compartido: una ruta del propio sitio de venta es, por
    // definición, una pantalla intermedia — el alta vive en otro contenedor.
    expect(
      EMPEZAR_URL.startsWith("/"),
      `EMPEZAR_URL es ${EMPEZAR_URL}: una ruta del sitio de venta, no el alta`,
    ).toBe(false);
    expect(EMPEZAR_URL).toBe(REGISTRO_URL);

    // Y el que se escribe a mano, que es como se vuelve a colar: dos páginas
    // (`/comparativa` y `/facturacion`) tipeaban `href="/empezar"` en vez de
    // leer la constante, así que arreglar el destino en un solo lugar las
    // dejaba atrás — exactamente el bug que `nav.ts` dice evitar.
    const enElCamino: string[] = [];

    for (const { nombre, codigo } of ARCHIVOS) {
      if (VOZ_PROPIA.test(nombre)) continue;
      for (const m of codigo.matchAll(HREF_ALTA)) {
        if (!m[0].includes('"')) continue; // href={CONSTANTE}: lo cubre el check de arriba
        const ventana = codigo.slice(
          m.index + m[0].length,
          m.index + m[0].length + VENTANA_ETIQUETA,
        );
        if (!/CTA_ALTA|ctaAltaPlan/.test(ventana)) continue;
        const linea = codigo.slice(0, m.index).split("\n").length;
        enElCamino.push(`${nombre}:${linea} → ${m[0]}`);
      }
    }

    expect(
      enElCamino,
      "botones del alta que mandan a una página de venta en vez de al registro",
    ).toEqual([]);
  });

  it("el vocabulario de la rama apagada no sobrevive en ninguna superficie", () => {
    const restos: string[] = [];

    for (const { nombre, codigo } of ARCHIVOS) {
      codigo.split("\n").forEach((linea, i) => {
        if (FRASE_PROHIBIDA.test(linea))
          restos.push(`${nombre}:${i + 1} → ${linea.trim()}`);
      });
    }

    expect(
      restos,
      `el alta está ${ALTA_ABIERTA ? "ABIERTA" : "CERRADA"} y estas líneas prometen lo contrario`,
    ).toEqual([]);
  });
});
