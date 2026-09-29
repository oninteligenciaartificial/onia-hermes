import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { PLANES } from "@/lib/pricing";
import { EMPEZAR_URL, REGISTRO_URL, registroConPlan } from "./nav";

/**
 * El plan que el lead elige en una tarjeta tiene que llegar al checkout.
 *
 * Hasta el 2026-09-29 «Empezar con el Profesional» mandaba a `/register` a
 * secas: el producto ya guardaba `?plan=` hasta el QR, pero la web no se lo
 * pasaba, y el checkout abría con el plan destacado en vez del elegido.
 *
 * Dos mitades, porque cada una falla sola:
 *   1. La clave: `registroConPlan` dice el nombre que el PRODUCTO le da al plan,
 *      el mismo que `PLANES_EN_ORDEN` de `scripts/precios-fuente.mjs` (que a su
 *      vez se cruza contra el catálogo del producto).
 *   2. El botón: toda tarjeta con «Empezar con el <plan>» (`ctaAltaPlan`) lleva
 *      `registroConPlan` de SU plan, no `EMPEZAR_URL` ni el de otro.
 *
 * Límite, dicho: un botón de plan con otra etiqueta que `ctaAltaPlan` no es
 * sujeto de acá. `alta.test.ts` ya obliga a que todo botón del alta use
 * `CTA_ALTA` o `ctaAltaPlan`, así que el hueco es un `CTA_ALTA` genérico dentro
 * de una tarjeta de plan.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, "..", "..");

/**
 * Se lee como TEXTO y no se importa: el `.mjs` abre con `#!/usr/bin/env node` y
 * vitest en Windows no lo carga («Invalid or unexpected token»).
 */
function planesEnOrden(): Map<string, string> {
  const fuente = readFileSync(join(RAIZ, "..", "scripts", "precios-fuente.mjs"), "utf8");
  const bloque = fuente.match(/export const PLANES_EN_ORDEN = \[([\s\S]*?)\];/)?.[1] ?? "";
  return new Map(
    [...bloque.matchAll(/producto:\s*"(\w+)",\s*sitio:\s*"(\w+)"/g)].map(([, producto, sitio]) => [
      sitio,
      producto,
    ]),
  );
}

/** Árboles que nadie sirve: `/v1/*` redirige a `/` (next.config.ts) y landing-v2 no lo importa nadie. */
const NO_SERVIDO = /^(app\/v1\/|components\/landing-v1\/|components\/landing-v2\/)/;

function fuentes(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) fuentes(ruta, acc);
    else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) acc.push(ruta);
  }
  return acc;
}

/** Sin comentarios: la historia de este archivo nombra `ctaAltaPlan` sin ser un botón. */
function sinComentarios(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (b) => b.replace(/[^\n]/g, ""))
    .replace(/^[ \t]*\/\/.*$/gm, "");
}

describe("el plan elegido en la web llega al checkout", () => {
  it("cada plan viaja con la clave que el producto le da", () => {
    const delScript = planesEnOrden();
    expect(delScript.size, "no se pudo leer PLANES_EN_ORDEN de precios-fuente.mjs").toBeGreaterThan(0);

    for (const plan of PLANES) {
      const clave = delScript.get(plan.id);
      expect(clave, `el plan "${plan.id}" no está en PLANES_EN_ORDEN`).toBeDefined();
      expect(registroConPlan(plan.id)).toBe(`${REGISTRO_URL}?plan=${clave}`);
    }
  });

  it("el botón genérico del alta no inventa un plan", () => {
    expect(EMPEZAR_URL).not.toContain("?");
  });

  it("toda tarjeta «Empezar con el <plan>» manda su propio plan", () => {
    const botones: string[] = [];
    const malos: string[] = [];

    for (const ruta of fuentes(RAIZ)) {
      const nombre = relative(RAIZ, ruta).replace(/\\/g, "/");
      if (NO_SERVIDO.test(nombre) || nombre.endsWith("(sitio)/alta.ts")) continue;
      const codigo = sinComentarios(readFileSync(ruta, "utf8"));

      for (const m of codigo.matchAll(/ctaAltaPlan\(([^)]*)\)/g)) {
        const variable = m[1].trim().match(/^(\w+)\.nombre$/)?.[1];
        const antes = codigo.slice(Math.max(0, m.index - 200), m.index);
        const href = [...antes.matchAll(/href=\{([^}]*)\}/g)].at(-1)?.[1].replace(/\s/g, "");
        const linea = codigo.slice(0, m.index).split("\n").length;
        botones.push(`${nombre}:${linea}`);
        if (!variable || href !== `registroConPlan(${variable}.id)`) {
          malos.push(`${nombre}:${linea} → href={${href ?? "?"}} para ctaAltaPlan(${m[1]})`);
        }
      }
    }

    // Sin sujetos el gate saldría verde por no mirar nada: hoy son /precios y el toggle.
    expect(botones.length, "no se encontró ninguna tarjeta de plan").toBeGreaterThanOrEqual(2);
    expect(malos, "tarjetas de plan que no le pasan su plan al registro").toEqual([]);
  });
});
