import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Ningún precio de ADD-ON se escribe dentro de una frase.
 *
 * POR QUÉ EXISTE, y por qué es un archivo aparte de `precios.test.ts`. Ese gate
 * cuida los montos de PLAN y dice, en su propia cabecera, que deja los add-ons
 * afuera **a propósito**: «sus números COLISIONAN con otros productos: `Bs 390`
 * es el chatbot y el plan «Cuidado Web Crecimiento», que es correcto y no tiene
 * nada que ver». El razonamiento es cierto y la conclusión no: la colisión sólo
 * impide decir DE QUIÉN es un `Bs 390`, y para esta regla no hace falta saberlo.
 * Ninguno de los dos puede escribirlo en una frase. Así la colisión deja de ser
 * el motivo para no vigilar y pasa a ser irrelevante.
 *
 * Que quedaran sin gate no es un detalle: el add-on es justamente el producto
 * con el que `CLAUDE.md` abre el capítulo de precios —llegó a haber **cuatro
 * precios vivos del mismo chatbot**— y era la única clase que nadie medía.
 *
 * QUÉ ENCONTRÓ AL NACER (2026-09-04), todo servido con 200 en producción:
 *  - `lib/pricing.ts` publicaba **Bs 70 dos veces** (el `incluye` del Básico y
 *    la fila de `ADDONS`) y **Bs 150 dos veces** (el `sinEsto` del Básico y su
 *    fila de `ADDONS`), sin ninguna constante detrás. Las dos copias de cada
 *    uno se renderizan en la MISMA página (`/` y `/precios`): el día que cambie
 *    el precio, quien edite la fila que se llama `precio` —la obvia— deja la
 *    otra anunciando el número viejo tres tarjetas más arriba.
 *  - `content/webs.ts` escribía a mano `Bs 190`, `Bs 390` (×3) y `Bs 690` (×2)
 *    en los `mensual` de `WEB_STACKS`, con la tabla `CUIDADO_WEB` que YA tiene
 *    esos mismos tres montos como número ochenta líneas más abajo.
 *
 * El chatbot era el único que lo hacía bien, y de ahí sale la forma correcta:
 * un monto vive una sola vez como número y las pantallas lo interpolan
 * (`content/chatbot-precios.ts` → `precioAddonChatbot()`).
 *
 * QUÉ CAZA. La CLASE, no las nueve frases de hoy: un monto de add-on dentro de
 * un literal de texto. Los sujetos —tanto los archivos como los montos— salen
 * del DISCO, nunca de una lista escrita a mano: es la tercera vez que este
 * carril paga esa lección (`compartir.test.ts` sacaba sus rutas del sitemap;
 * `precios.test.ts` sacaba sus raíces de cuatro carpetas y dejó `app/v1/**`
 * sin vigilar con 17 montos adentro). Una lista de inclusión falla ABIERTO.
 */

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const SRC = path.resolve(AQUI, "..", "..");

/**
 * Exclusiones, cada una con su motivo. Vacía a propósito: si mañana hace falta
 * una, que quede escrita acá y no como un silencio.
 */
const EXENTOS: ReadonlyArray<{ archivo: string; motivo: string }> = [];

/**
 * De dónde sale cada monto de add-on. Son las tablas que YA existen: el gate no
 * define ningún número (hacerlo sería otra copia a mano, dentro del gate que
 * las prohíbe) y no sabría inventarlos si las tablas cambian.
 */
const TABLAS: ReadonlyArray<{ archivo: string; campo: RegExp }> = [
  // CUIDADO_WEB → mensual: 190 / 390 / 690
  { archivo: "content/webs.ts", campo: /^\s*\{?\s*nombre:.*?\bmensual:\s*([0-9]+)/gm },
  // CHATBOT_PLAN → mensual: 390 · anual: 3900
  { archivo: "content/chatbot-precios.ts", campo: /^\s*(?:mensual|anual):\s*([0-9]+)\s*,/gm },
  // AGENDA_ADDON / USUARIO_EXTRA_ADDON → mensual: 150 · 70
  { archivo: "lib/pricing.ts", campo: /^\s*mensualAddon:\s*([0-9]+)\s*,/gm },
];

function montosDeAddon(): number[] {
  const n = new Set<number>();
  for (const t of TABLAS) {
    const abs = path.join(SRC, t.archivo);
    if (!fs.existsSync(abs)) continue;
    const src = sinComentarios(fs.readFileSync(abs, "utf8"));
    let m: RegExpExecArray | null;
    t.campo.lastIndex = 0;
    while ((m = t.campo.exec(src)) !== null) n.add(Number(m[1]));
  }
  return [...n];
}

function archivosDe(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...archivosDe(p));
    else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

/**
 * Quita comentarios CONSERVANDO los saltos de línea, para que el número de
 * línea que reporta el gate no mienta (perseguir una línea equivocada cuesta
 * la vuelta entera; ya pasó con `voz.test.ts`).
 */
function sinComentarios(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length));
}

interface Hallazgo {
  archivo: string;
  linea: number;
  texto: string;
}

function enProsa(): Hallazgo[] {
  const montos = montosDeAddon();
  const exentos = new Set(EXENTOS.map((e) => e.archivo));
  const hallazgos: Hallazgo[] = [];

  for (const abs of archivosDe(SRC)) {
    const rel = path.relative(SRC, abs);
    if (exentos.has(rel)) continue;
    const src = sinComentarios(fs.readFileSync(abs, "utf8"));
    // Las DOS formas de escribirlo. `precios.test.ts` cuidó sólo "Bs 320" y por
    // eso la descripción de OpenGraph de /precios —la que se ve al compartir el
    // enlace por WhatsApp— se quedó con los montos congelados mientras su
    // hermana de al lado ya leía la tabla. Un gate que entiende un solo orden
    // de palabras cuida medio tema.
    for (const re of [/Bs\s*([0-9][0-9.]*)/g, /([0-9][0-9.]*)\s*Bs\b/g]) {
      let m: RegExpExecArray | null;
      while ((m = re.exec(src)) !== null) {
        const valor = Number(m[1].replace(/\./g, ""));
        if (!montos.includes(valor)) continue;
        hallazgos.push({
          archivo: rel,
          linea: src.slice(0, m.index).split("\n").length,
          texto: m[0],
        });
      }
    }
  }
  return hallazgos;
}

describe("los precios de add-on no se escriben dentro de una frase", () => {
  it("ninguna superficie de venta tipea un monto de add-on", () => {
    const hallazgos = enProsa();
    const detalle = hallazgos
      .map((h) => `  ${h.archivo}:${h.linea} → "${h.texto}"`)
      .join("\n");
    expect(
      hallazgos,
      `Estos montos de add-on están escritos dentro de una frase en vez de ` +
        `interpolarse desde su tabla. El día que cambie el precio, la tabla ` +
        `cambia y estas frases mienten —y varias se renderizan en la MISMA ` +
        `página que la tabla:\n${detalle}\n` +
        `Arreglo: interpolar desde la constante (el modelo es ` +
        `content/chatbot-precios.ts → precioAddonChatbot()).`,
    ).toEqual([]);
  });

  /**
   * Ancla. Sin esto, el día que alguien renombre un campo de las tablas el gate
   * pasa en verde midiendo NADA — que es como un gate deja de cuidar sin que
   * nadie se entere. Es el mismo fallo abierto que ya se pagó dos veces acá.
   */
  it("el gate tiene contra qué medir", () => {
    const montos = montosDeAddon();
    // 3 de Cuidado Web + 2 del chatbot + 2 de pricing = 7, con 390 repetido
    // entre Cuidado Web y chatbot: 6 distintos. Deliberadamente NO se escribe
    // ningún número esperado: sería la copia a mano que este archivo prohíbe.
    expect(montos.length).toBeGreaterThanOrEqual(6);
    for (const m of montos) expect(m).toBeGreaterThan(1);

    // Cada tabla tiene que aportar: si una deja de matchear, su producto queda
    // sin vigilancia y el total sigue pareciendo sano por culpa de las otras.
    for (const t of TABLAS) {
      const src = sinComentarios(fs.readFileSync(path.join(SRC, t.archivo), "utf8"));
      t.campo.lastIndex = 0;
      expect(
        t.campo.exec(src),
        `La tabla de "${t.archivo}" dejó de aportar montos: su campo se ` +
          `renombró y ese producto quedó sin gate, en verde.`,
      ).not.toBeNull();
    }
  });

  /**
   * Y se prueba a sí mismo con un monto REAL leído del disco: si el regex deja
   * de detectar prosa, este caso cae en vez de dejar pasar todo.
   */
  it("detecta un monto real metido en una frase", () => {
    const real = montosDeAddon()[0];
    const falso = sinComentarios(`const x = "Sale Bs ${real} al mes"; // Bs 999999`);
    expect(/Bs\s*([0-9][0-9.]*)/.exec(falso)?.[1]).toBe(String(real));
    // Y que sinComentarios de verdad ciegue lo comentado (si no, falso positivo
    // sobre las cabeceras, que citan los precios para explicar su historia).
    expect(falso).not.toContain("999999");
  });

  /** Que el recorrido sea el árbol entero, no una lista de carpetas elegidas. */
  it("cubre todo el árbol, no una lista de carpetas elegidas", () => {
    const vistos = archivosDe(SRC).map((f) => path.relative(SRC, f));
    expect(vistos.length).toBeGreaterThan(20);
    for (const rama of ["app/(sitio)/", "app/v1/", "content/", "lib/"]) {
      expect(
        vistos.some((f) => f.startsWith(rama)),
        `El recorrido no llega a "${rama}". Los sujetos se derivan de \`src/\` ` +
          `entero para que una carpeta nueva nazca cubierta: si hace falta ` +
          `dejar algo afuera, va en EXENTOS con su motivo, a la vista.`,
      ).toBe(true);
    }
  });
});
