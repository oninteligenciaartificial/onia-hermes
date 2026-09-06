import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { EXENTAS, FUERA_DE_VENTA } from "./rutas-de-venta.mjs";

/**
 * QUÉ CUIDA: que el barrido de enlaces no se exima rutas que producción sirve.
 *
 * POR QUÉ EXISTE. Hasta el 2026-09-05 `enlaces-vivos.mjs` dejaba fuera `/v1/**`
 * entero —ocho páginas— con este argumento escrito en su propio comentario:
 * *"llevan noindex, nofollow, están en Disallow de robots.txt y no aparecen en el
 * sitemap"*. Ese corte ya está medido como FALSO el 2026-09-04, por este mismo
 * carril y en el gate hermano `obra.test.ts`: robots.txt manda sobre rastreadores,
 * no apaga la pantalla. `/v1/comparativa` responde 200, y el fetcher de WhatsApp
 * —por donde Sergio manda el sitio a un lead— le lee el `<head>` igual.
 *
 * El arreglo se aplicó al hermano y no viajó acá, que es exactamente cómo esta
 * familia de agujeros sobrevive: cada gate tiene razón por separado.
 *
 * LA INVARIANTE, y por qué está escrita así: no "que `/v1` esté dentro" —eso lo
 * cumple cualquier lista— sino que **toda ruta del disco que produccion sirva esté
 * dentro, salvo las nombradas una por una**. Una exención por categoría (noindex,
 * disallow, "es archivo") vuelve a tapar un árbol entero la próxima vez.
 */
const RAIZ = new URL("../src/app", import.meta.url).pathname;

function rutasDelDisco(dir: string, prefijo = ""): string[] {
  const salida: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) {
      if (/^page\.tsx?$/.test(e.name)) salida.push(prefijo || "/");
      continue;
    }
    if (e.name.startsWith("[") || e.name.startsWith("_") || e.name === "api") continue;
    const grupo = e.name.startsWith("(") && e.name.endsWith(")");
    salida.push(...rutasDelDisco(join(dir, e.name), grupo ? prefijo : `${prefijo}/${e.name}`));
  }
  return [...new Set(salida)];
}

/** Las únicas rutas que pueden quedar fuera, cada una con su motivo escrito. */
const EXENTAS_A_PROPOSITO = EXENTAS;

describe("el barrido de enlaces cubre todo lo que producción sirve", () => {
  const rutas = rutasDelDisco(RAIZ);

  it("encuentra las rutas del disco (si esto da poco, el recorrido se rompió y el resto miente)", () => {
    expect(rutas.length).toBeGreaterThan(20);
    expect(rutas).toContain("/");
    expect(rutas).toContain("/precios");
  });

  it("ninguna ruta del disco queda fuera salvo las exentas por su nombre", () => {
    const fuera = rutas.filter((r) => FUERA_DE_VENTA(r));
    const inesperadas = fuera.filter((r) => !EXENTAS_A_PROPOSITO.has(r));
    expect(
      inesperadas,
      `estas rutas responden 200 en producción y ningún gate sigue sus enlaces:\n  ${inesperadas.join("\n  ")}`,
    ).toEqual([]);
  });

  it("las ocho páginas de /v1 están dentro: responden 200 y se comparten por WhatsApp", () => {
    const v1 = rutas.filter((r) => r === "/v1" || r.startsWith("/v1/"));
    expect(v1.length).toBeGreaterThanOrEqual(8);
    for (const r of v1) {
      expect(FUERA_DE_VENTA(r), `${r} quedó fuera del barrido`).toBe(false);
    }
  });

  it("una exención nueva tiene que declarar su motivo, no heredarlo de robots.txt", () => {
    for (const [ruta, motivo] of EXENTAS_A_PROPOSITO) {
      expect(FUERA_DE_VENTA(ruta), `${ruta} figura exenta acá y el script la barre igual`).toBe(true);
      expect(motivo.length, `la exención de ${ruta} no dice por qué`).toBeGreaterThan(30);
      expect(/noindex|robots|disallow|sitemap/i.test(motivo), `${ruta} se exime por robots: ese corte ya se midió falso el 2026-09-04`).toBe(false);
    }
  });
});
