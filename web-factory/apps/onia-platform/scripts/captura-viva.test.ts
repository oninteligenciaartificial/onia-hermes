import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { VARIABLES, veredicto } from "./captura-viva.mjs";

/**
 * El juicio del gate de captura, probado con los estados que HOY no existen.
 *
 * Hoy la cadena está sana, así que un `veredicto()` que devolviera siempre 0
 * pasaría cualquier prueba contra producción. Lo que se verifica acá es que el
 * instrumento SEPA ponerse rojo —en cada una de las formas en que esa cadena se
 * rompe— y que nunca confunda «no pude preguntar» con «está sano».
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const GATE = join(AQUI, "captura-viva.mjs");

const CONFIG_OK = Object.fromEntries(VARIABLES.map((v) => [v, true]));
const CUERPO_VACIO_RECHAZADO = { status: 422, cuerpo: '{"error":"missing_fields"}' };
const SANO = { config: CONFIG_OK, sinSecreto: 401, conSecreto: CUERPO_VACIO_RECHAZADO };

describe("la cadena sana", () => {
  it("da verde sólo con las tres señales juntas", () => {
    expect(veredicto(SANO).codigo).toBe(0);
  });
});

describe("no falla en VERDE: cada `null` es «no pude preguntar»", () => {
  it("sin env del contenedor sale NO MEDIDO, no verde", () => {
    expect(veredicto({ ...SANO, config: null }).codigo).toBe(2);
  });

  /**
   * La trampa que este caso ataja: con la configuración presente es tentador
   * concluir «está todo puesto, debe andar». La configuración es necesaria y no
   * es suficiente — el secreto puede estar rotado del otro lado.
   */
  it("configurada pero sin poder sondear sale NO MEDIDO, no verde", () => {
    expect(veredicto({ ...SANO, sinSecreto: null, conSecreto: null }).codigo).toBe(2);
    expect(veredicto({ ...SANO, conSecreto: null }).codigo).toBe(2);
  });
});

describe("las tres formas de perder un lead en silencio", () => {
  it.each(VARIABLES)("sin %s el proxy corta y devuelve 202", (falta) => {
    const config = { ...CONFIG_OK, [falta]: false };
    const r = veredicto({ ...SANO, config });
    expect(r.codigo).toBe(1);
    expect(r.titulo).toContain(falta);
  });

  it("un 401 con el secreto REAL es el secreto rotado", () => {
    const r = veredicto({ ...SANO, conSecreto: { status: 401, cuerpo: "" } });
    expect(r.codigo).toBe(1);
    expect(r.titulo).toMatch(/ROTADO/i);
  });

  it("un 503 es Onia Center sin dónde guardar", () => {
    const r = veredicto({ ...SANO, conSecreto: { status: 503, cuerpo: "" } });
    expect(r.codigo).toBe(1);
    expect(r.titulo).toMatch(/503/);
  });
});

/**
 * La sonda del secreto inválido no está para ver si el destino contesta: está
 * para exigir que RECHACE. Un intake que acepta cualquier secreto es un endpoint
 * público de escritura, que es peor que uno caído — y con la otra sonda en 422
 * el gate se vería sano.
 */
describe("el secreto inválido tiene que ser rechazado", () => {
  it.each([200, 204, 422, 503, 500])("con un secreto que no es el bueno, %i es rojo", (status) => {
    expect(veredicto({ ...SANO, sinSecreto: status }).codigo).toBe(1);
  });

  it("sólo 401 lo deja pasar", () => {
    expect(veredicto({ ...SANO, sinSecreto: 401 }).codigo).toBe(0);
  });
});

/**
 * Si el cuerpo vacío deja de dar 422, el gate no sólo tiene que ponerse rojo:
 * tiene que AVISAR que su propia sonda pudo haber creado un lead. Una sonda que
 * ensucia lo que mide es un gate que hay que apagar, no uno que se ignora.
 */
describe("el contrato del cuerpo vacío", () => {
  it("un 2xx es rojo y nombra el riesgo de haber creado un lead", () => {
    const r = veredicto({ ...SANO, conSecreto: { status: 200, cuerpo: "" } });
    expect(r.codigo).toBe(1);
    expect(r.detalle).toMatch(/onia_center\.leads/);
  });
});

describe("el gate se puede importar sin disparar producción", () => {
  /**
   * En proceso HIJO a propósito: acá el módulo ya está cacheado por este mismo
   * archivo, así que el caso pasaría en falso. Sin la guarda, importarlo corre
   * `main()` —dos `docker exec` contra producción y un `process.exit` que mata
   * al importador antes de su primera línea.
   */
  it("importarlo no ejecuta la medición", () => {
    const salida = execFileSync(
      process.execPath,
      ["--input-type=module", "-e", `await import(${JSON.stringify(GATE)}); console.log("VIVO");`],
      { encoding: "utf8", timeout: 30000 },
    );
    expect(salida).toContain("VIVO");
  });

  it("su self-check es puro y pasa, incluido el caso que YA cumple", () => {
    const salida = execFileSync(process.execPath, [GATE, "--self-check"], {
      encoding: "utf8",
      timeout: 30000,
    });
    expect(salida).toContain("self-check OK");
  });
});
