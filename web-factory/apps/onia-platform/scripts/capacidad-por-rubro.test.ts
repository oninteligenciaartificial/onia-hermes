import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { alcanza, hrefsDeArray, leerDelHermano, medir, segmento } from "./capacidad-por-rubro.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/**
 * Las partes PURAS del cruce (capacidad, rubro), cableadas a `npm test`. La
 * medición viva vive en el alias `capacidad:por-rubro` y no entra en la cadena:
 * necesita el repo hermano y pondría rojo por AMBIENTE, que traba el merge de
 * los quince carriles.
 */
describe("cruce (capacidad, rubro): las piezas que no necesitan el repo hermano", () => {
  it("alcanza() corta por SEGMENTO, que es como corta el layout", () => {
    const comunes = new Set(["dashboard"]);
    // El pack declara /billing; el layout permite el segmento entero, así que
    // /billing/recurring también entra. Confundirlos volvería a prometerle las
    // recurrentes a quien sólo tiene cobros.
    expect(alcanza({ pantalla: "/billing/recurring", navDelRubro: ["/billing"], comunes })).toBe(true);
    expect(alcanza({ pantalla: "/reports", navDelRubro: ["/billing"], comunes })).toBe(false);
  });

  it("un segmento común lo alcanza cualquier pack, aunque no lo declare", () => {
    expect(alcanza({ pantalla: "/settings", navDelRubro: [], comunes: new Set(["settings"]) })).toBe(true);
  });

  it("hrefsDeArray corta en el cierre del array y no se pasa al siguiente", () => {
    const txt = 'const A = [\n  { href: "/uno" },\n  { href: "/dos" },\n];\nconst B = [\n  { href: "/tres" },\n];';
    const leidos = hrefsDeArray(txt, "const A");
    expect(leidos).toEqual(["/uno", "/dos"]);
  });

  it("hrefsDeArray AVISA cuando el array no está, en vez de devolver vacío", () => {
    // Devolver [] haría que un rubro sin nav parezca un rubro que no alcanza
    // nada: el gate acusaría al producto de un defecto del instrumento.
    expect(hrefsDeArray("const A = [\n];", "const NO_EXISTE")).toBeNull();
  });

  it("segmento() toma el primero, que es la unidad del corte", () => {
    expect(segmento("/billing/recurring")).toBe("billing");
    expect(segmento("/reports")).toBe("reports");
  });

  it("importar el módulo NO dispara la medición ni mata al proceso", () => {
    // En ESTE proceso el módulo ya está cacheado, así que el caso pasaría en
    // falso: la prueba tiene que correr en un proceso HIJO.
    const salida = execFileSync(
      process.execPath,
      ["-e", `import(${JSON.stringify(join(AQUI, "capacidad-por-rubro.mjs"))}).then((m) => { console.log("VIVO", typeof m.alcanza); });`],
      { encoding: "utf8", timeout: 20_000 },
    );
    expect(salida).toContain("VIVO function");
    // Si la guarda faltara, el import habría impreso el informe de la medición.
    expect(salida).not.toContain("Rubros activos leídos");
    expect(salida).not.toContain("NO MEDIDO");
  });

  it("el self-check del script pasa en verde", () => {
    const salida = execFileSync(
      process.execPath,
      [join(AQUI, "capacidad-por-rubro.mjs"), "--self-check"],
      { encoding: "utf8", timeout: 20_000 },
    );
    expect(salida).toContain("self-check VERDE");
  });
});

/**
 * El ref del hermano se PONE AL DÍA antes de leerlo, o no se mide.
 *
 * `leerDelHermano` ya preguntaba por `origin/master:` en vez de por el working
 * tree —que en un carril está en su rama y sucio—, y eso estaba bien. Lo que
 * faltaba es que ese ref fuera FRESCO: `origin/master` es una ref de DISCO, y
 * sin `git fetch` vale lo que valía la última vez que alguien fetcheó en ese
 * clon. Medido el 2026-09-18: el clon elegido estaba 62 commits atrás de su
 * propio HEAD y el gate imprimía VERDE; `origin/master` coincidía con el
 * remoto de casualidad, porque otro carril había fetcheado hacía poco.
 *
 * Las dos direcciones en que un ref viejo miente son distintas, y las dos
 * terminan en verde:
 *  · el producto ACOTÓ una pantalla después del último fetch → el sitio la
 *    sigue vendiendo a un rubro que ya no la alcanza, y el cruce no lo ve;
 *  · el producto se la DEVOLVIÓ → el gate acusa al sitio de vender de más.
 *
 * Y el `atraso` que el informe imprime se mide contra ESE mismo ref, así que
 * tampoco puede delatarlo: un clon sin fetchear se declara «0 commits atrás».
 *
 * Por eso el caso ancla no es «existe una llamada a fetch» sino su ORDEN: la
 * mutación barata es dejar el fetch escrito y leer antes.
 */
describe("el cruce mide el ref publicado Y fresco, o no mide", () => {
  const REPO = "/fake/onia-platform";
  /** Un `correr` que anota cada subcomando de git y contesta lo que se le pida. */
  function espia(respuestas: Record<string, { status: number; stdout: string }>) {
    const subcomandos: string[] = [];
    const correr = (_cwd: string, args: string[]) => {
      subcomandos.push(args[0]);
      return respuestas[args[0]] ?? { status: 1, stdout: "" };
    };
    return { correr, subcomandos };
  }

  const SANAS = {
    fetch: { status: 0, stdout: "" },
    "rev-parse": { status: 0, stdout: "master\n" },
    "rev-list": { status: 0, stdout: "0\n" },
    // `show` falla: el cruce corta en «no tiene los 4 archivos», que alcanza
    // para observar el orden sin fabricar los cuatro fuentes del producto.
    show: { status: 1, stdout: "" },
  };

  it("FETCHEA antes de leer el ref: leer primero mide un fósil y sale VERDE", () => {
    const { correr, subcomandos } = espia(SANAS);
    medir({ correr, candidatos: [REPO], existe: () => true });

    const primerFetch = subcomandos.indexOf("fetch");
    expect(primerFetch, "el cruce no pone al día el ref antes de leerlo").toBeGreaterThanOrEqual(0);
    for (const lectura of ["show", "rev-list"]) {
      const i = subcomandos.indexOf(lectura);
      expect(
        i === -1 || primerFetch < i,
        `\`git ${lectura}\` corre ANTES del fetch: mide la ref que había en disco`,
      ).toBe(true);
    }
  });

  it("si no se pudo poner al día, NO LEE el ref y sale NO MEDIDO nombrando el clon", () => {
    const { correr, subcomandos } = espia({ ...SANAS, fetch: { status: 1, stdout: "" } });
    const r = medir({ correr, candidatos: [REPO], existe: () => true });

    expect(r.medido, "midió igual contra un ref que no pudo refrescar").toBe(false);
    expect(r.motivo).toContain(REPO);
    // El ancla es CONDUCTUAL, no el texto del motivo: sin esto, quitarle el corte
    // igual termina en `medido:false` —por los 4 archivos que el `show` no trae— y
    // el caso pasa en verde con el fósil ya leído. Lo que se exige es que un ref
    // que no se pudo refrescar no se lea.
    expect(
      subcomandos.includes("show"),
      "leyó el ref igual después de no poder refrescarlo",
    ).toBe(false);
  });

  it("no cae al working tree cuando el ref no trae el archivo", () => {
    // El respaldo leía el archivo del DISCO, que en un carril es su rama con
    // cambios sin publicar: convertía «esto todavía no está en master» en «lo
    // leí igual». Hace falta sembrar el archivo de verdad — con una ruta que no
    // existe, quitar el respaldo y dejarlo puesto se ven iguales.
    const raiz = mkdtempSync(join(tmpdir(), "cpr-ref-"));
    try {
      mkdirSync(join(raiz, "lib/platform"), { recursive: true });
      writeFileSync(
        join(raiz, "lib/platform/vertical-pack.ts"),
        'const GESTIOS_NAV_ITEMS = [\n  { href: "/del-working-tree" },\n];',
      );
      const { correr } = espia(SANAS); // `show` falla: el ref no lo trae
      const leido = leerDelHermano(raiz, "lib/platform/vertical-pack.ts", { correr });

      expect(leido, "leyó el working tree del carril como si fuera master").toBeNull();
      // Y el cruce entero corta: sin los 4 archivos del ref no hay medición.
      expect(medir({ correr, candidatos: [raiz], existe: () => true }).medido).toBe(false);
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });
});
