import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Ningún precio de PLAN se escribe a mano en la superficie de venta.
 *
 * POR QUÉ EXISTE. `CLAUDE.md` abre con esta regla y con el desastre que la
 * originó: llegó a haber **cuatro precios vivos del mismo chatbot** al mismo
 * tiempo, y con eso cualquier sesión elige mal. Los planes tienen su fuente
 * única —`PLANES` acá, espejo de `DEFAULT_PLAN_AMOUNTS` del producto— pero
 * hasta hoy nadie medía que la PROSA del sitio dijera lo mismo que la tabla.
 * Se encontraron cuatro copias tipeadas a mano (2026-09-03): la `description`
 * de `/precios`, el chip del hero de la home, nuestra propia fila de la
 * comparativa y la letra chica del semanal. Coincidían por suerte, no por
 * construcción: el día que Sergio cambia un plan, cambia la tabla y las cuatro
 * frases siguen anunciando el precio viejo.
 *
 * Y una de ellas era **metadata**, que es la parte de la superficie de cliente
 * que NO se ve mirando la pantalla: toda captura da verde sobre ese defecto.
 *
 * QUÉ CAZA, y por qué así. La CLASE —"un monto de plan escrito como literal"—,
 * no las cuatro frases de hoy. Los sujetos salen del DISCO, no de una lista de
 * inclusión: un archivo nuevo nace cubierto y hay que excluirlo a mano, a la
 * vista. (Ya se pagó el precio de lo contrario: `compartir.test.ts` sacaba sus
 * rutas del sitemap y falló ABIERTO el día que una página salió del sitemap.)
 *
 * QUÉ NO CAZA, DELIBERADAMENTE. Sólo los montos de PLANES y GRUPO. Los add-ons
 * quedan fuera porque sus números COLISIONAN con otros productos: `Bs 390` es
 * el chatbot **y** el plan «Cuidado Web Crecimiento» de `content/webs.ts`, que
 * es correcto y no tiene nada que ver. Un gate que grita por algo correcto se
 * termina apagando, y entonces no cuida nada.
 */

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const SRC = path.resolve(AQUI, "..", "..");

/** Superficie que ve un lead: las páginas del sitio y lo que ellas importan. */
const RAICES = ["app/(sitio)", "content", "lib", "components/landing-v1"];

/**
 * Exclusiones, cada una con su motivo. Vacía a propósito: si mañana hace falta
 * una, que quede escrita acá y no como un silencio.
 */
const EXENTOS: ReadonlyArray<{ archivo: string; motivo: string }> = [];

/**
 * Los montos se LEEN del disco, no se importan: los gates de esta app no
 * resuelven el alias `@/` (no hay config de vitest), y `pricing.ts` importa por
 * alias. Leerlo como texto además mantiene al gate sin dependencias de runtime.
 */
const PRICING = path.join(SRC, "lib", "pricing.ts");

/** Montos que SÓLO puede definir la tabla de planes (PLANES + GRUPO). */
function montosDePlan(): number[] {
  const src = fs.readFileSync(PRICING, "utf8");
  const n = new Set<number>();
  // `mensual: 320,` · `semanal: 89,` · `anual: 3200,` — las tres claves de precio.
  const re = /^\s*(mensual|semanal|anual):\s*([0-9]+)\s*,/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) n.add(Number(m[2]));
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
 * Quita comentarios CONSERVANDO los saltos de línea. Sin esto el número de
 * línea que reporta el gate miente — ya pasó con `voz.test.ts`, que apuntaba a
 * la 122 para algo que estaba en la 215, y perseguir esa línea cuesta la vuelta.
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

function tipeadosAMano(): Hallazgo[] {
  const montos = montosDePlan();
  const exentos = new Set(EXENTOS.map((e) => e.archivo));
  const hallazgos: Hallazgo[] = [];

  for (const raiz of RAICES) {
    for (const abs of archivosDe(path.join(SRC, raiz))) {
      const rel = path.relative(SRC, abs);
      if (exentos.has(rel)) continue;
      const src = sinComentarios(fs.readFileSync(abs, "utf8"));
      // "Bs 320", "Bs 1.500", "Bs 3.200" — con o sin separador de miles.
      const re = /Bs\s*([0-9][0-9.]*)/g;
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

describe("los precios de plan no se escriben a mano", () => {
  it("ninguna superficie de venta tipea un monto de PLANES o GRUPO", () => {
    const hallazgos = tipeadosAMano();
    const detalle = hallazgos
      .map((h) => `  ${h.archivo}:${h.linea} → "${h.texto}"`)
      .join("\n");
    expect(
      hallazgos,
      `Estos montos de plan están escritos como literal en vez de leerse de PLANES.\n` +
        `El día que cambie el precio, la tabla cambia y estas frases mienten:\n${detalle}\n` +
        `Arreglo: interpolar con bs(...) desde PLANES/GRUPO.`,
    ).toEqual([]);
  });

  /**
   * Ancla. Sin esto, el día que alguien vacíe PLANES o rompa el regex, el gate
   * pasa en verde midiendo nada — que es como un gate deja de cuidar sin que
   * nadie se entere.
   */
  it("el gate tiene contra qué medir", () => {
    const montos = montosDePlan();
    // 3 planes × (mensual + anual) + 2 semanales + GRUPO = de sobra 8 montos.
    // Deliberadamente NO se escribe ningún número esperado: hacerlo sería la
    // quinta copia a mano del precio, dentro del gate que las prohíbe.
    expect(montos.length).toBeGreaterThanOrEqual(8);
    for (const m of montos) expect(m).toBeGreaterThan(1);

    // Y se prueba a sí mismo, con un monto REAL leído del disco: si el regex
    // deja de detectar, este caso cae y el gate no puede pasar midiendo nada.
    const real = montos[0];
    const falso = sinComentarios(`const x = "Plan Bs ${real} al mes"; // Bs 999999`);
    expect(/Bs\s*([0-9][0-9.]*)/.exec(falso)?.[1]).toBe(String(real));
    // Y que sinComentarios de verdad ciega lo comentado (si no, falsos positivos).
    expect(falso).not.toContain("999999");
  });

  /** Que el archivo recorra superficie de verdad, no un directorio vacío. */
  it("mira archivos de verdad", () => {
    const total = RAICES.reduce((n, r) => n + archivosDe(path.join(SRC, r)).length, 0);
    expect(total).toBeGreaterThan(20);
  });
});
