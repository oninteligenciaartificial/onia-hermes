import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { loQuePrometeElSitio, loQuePuedeProduccion } from "./medio-de-pago-vivo.mjs";

/**
 * La parte PURA de `medio-de-pago-vivo.mjs`, que sí puede correr en la cadena.
 *
 * La medición viva queda como alias suelto (`npm run medio-de-pago:vivo`):
 * necesita salir a producción y acá pondría rojo por AMBIENTE en toda máquina
 * que no alcance el contenedor, trabando el merge de los quince carriles.
 *
 * Lo que se prueba acá es lo único que puede fallar en silencio: que un lector
 * que NO pudo leer devuelva `null` y no `false`. `false` es el valor de hoy, así
 * que un parseo roto aplanado a `false` coincidiría con la constante y firmaría
 * VERDE sobre una medición que nunca ocurrió — que es exactamente como muere
 * esta familia de gates.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));

/**
 * Espía de `spawnSync`. Devuelve sólo lo que el lector lee (`status`, `stdout`);
 * el `as never` es para no tener que fabricar un `SpawnSyncReturns` entero, que
 * sería ruido sin valor — si el lector empezara a mirar otro campo, el caso
 * fallaría, que es lo que se quiere.
 */
const envDe =
  (salida: string, status = 0) =>
  () =>
    ({ status, stdout: salida }) as never;
const sinDocker = () => null as never;
const MUCHAS = Array.from({ length: 20 }, (_, i) => `VAR_${i}=x`).join("\n");

describe("lo que el sitio declara", () => {
  it("lee la constante en sus dos valores", () => {
    expect(loQuePrometeElSitio("export const QR_PARA_PAGARLE_A_ONIA = false;")).toBe(false);
    expect(loQuePrometeElSitio("export const QR_PARA_PAGARLE_A_ONIA = true;")).toBe(true);
  });

  it("si la constante cambió de forma devuelve null, NO false", () => {
    // `false` sería el valor de hoy: aplanarlo ahí hace que el cruce dé verde
    // sin haber leído nada, y el día que el sitio prometa QR nadie se entera.
    expect(loQuePrometeElSitio("export const QR_PARA_PAGARLE_A_ONIA = leerFlag();")).toBeNull();
    expect(loQuePrometeElSitio("export const OTRA = false;")).toBeNull();
  });
});

describe("lo que producción puede", () => {
  it("distingue el contenedor con credenciales del que no las tiene", () => {
    expect(loQuePuedeProduccion(envDe(MUCHAS))).toBe(false);
    expect(loQuePuedeProduccion(envDe(`${MUCHAS}\nBCP_QR_ID=abc`))).toBe(true);
  });

  it("no poder preguntar NO es 'no hay QR'", () => {
    expect(loQuePuedeProduccion(envDe("", 1)), "docker falló").toBeNull();
    expect(loQuePuedeProduccion(sinDocker), "sin docker").toBeNull();
    // Un `env` sano trae decenas de variables: dos líneas es el contenedor
    // contestando mal, no un contenedor sin credenciales.
    expect(loQuePuedeProduccion(envDe("HOME=/root\nPATH=/bin")), "env cortado").toBeNull();
  });
});

describe("la guarda de ejecución directa", () => {
  /**
   * En un proceso HIJO a propósito: en éste el módulo ya está cacheado por el
   * import de arriba y el caso pasaría en falso.
   */
  it("importar no mide ni sale del proceso", () => {
    const salida = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import(${JSON.stringify(join(AQUI, "medio-de-pago-vivo.mjs"))}).then(() => console.log("VIVO"));`,
      ],
      { encoding: "utf8" },
    );
    expect(salida).toContain("VIVO");
  });
});
