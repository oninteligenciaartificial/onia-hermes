/**
 * Ningún archivo de `web-factory/` puede importar algo de AFUERA de `web-factory/`.
 *
 * POR QUE, y cuánto costó. El publicador de la landing arma el stage con
 * `git archive origin/main web-factory/apps web-factory/packages web-factory/package.json …`
 * (`/opt/onia-landing/_deploy/build-and-stage.sh`): al stage viaja el subárbol `web-factory/` y
 * NADA más. Un import que salga de ahí —`../../../../hermes-content/…`, `../../../scripts/…`—
 * resuelve perfecto en el repo y no existe en el stage, así que el defecto FALLA EN VERDE para
 * todo el mundo: la cadena de onia-hermes lo corre donde el hermano existe, el CI también, y el
 * único que se entera es el `prebuild` del publicador, a las 3 de la mañana, con una línea
 * `landing: FALLO` en `/var/log/onia-publicar-solo.log` que no escala a nadie.
 *
 * Medido el 2026-09-17: `scripts/inclusion-chatbot.mjs` importaba
 * `../../../../hermes-content/deploy/vps-ops/bot/promesa-inclusion.mjs`; la publicación de
 * onia.com.bo murió dos corridas seguidas (17:50 y 20:50 La Paz) con `ERR_MODULE_NOT_FOUND`,
 * dejando el trabajo verde de todos los carriles sin llegar al cliente.
 *
 * DERIVA SUS SUJETOS DEL DISCO, caminando las carpetas — no de `git ls-files`. Un archivo recién
 * escrito y sin commitear es invisible para git, y es exactamente el sujeto que este gate existe
 * para cazar: el import se escribe y se publica en la misma vuelta.
 *
 * Alcanza a `import type` a propósito: TypeScript elide el tipo en runtime, pero el `prebuild`
 * corre `tsc --noEmit` antes que los tests y necesita el archivo igual.
 */
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const AQUI = dirname(fileURLToPath(import.meta.url));
/** `scripts` → `onia-platform` → `apps` → `web-factory`. */
export const WEB_FACTORY = dirname(dirname(dirname(AQUI)));

const EXTENSIONES = [".ts", ".tsx", ".mjs", ".cjs", ".js", ".jsx"];
const NO_SE_PUBLICAN = new Set(["node_modules", ".next", ".turbo", "dist", "out", "build", "coverage", ".git"]);

/** Camina el disco. Las carpetas que el `git archive` NO empaqueta tampoco son sujetos. */
export function archivosDe(dir: string, encontrados: string[] = []): string[] {
  let entradas: string[];
  try {
    entradas = readdirSync(dir);
  } catch {
    return encontrados;
  }
  for (const nombre of entradas) {
    if (NO_SE_PUBLICAN.has(nombre)) continue;
    const ruta = join(dir, nombre);
    let esDir = false;
    try {
      esDir = statSync(ruta).isDirectory();
    } catch {
      continue;
    }
    if (esDir) archivosDe(ruta, encontrados);
    else if (EXTENSIONES.some((ext) => nombre.endsWith(ext))) encontrados.push(ruta);
  }
  return encontrados;
}

/**
 * Los comentarios acusan Y absuelven: un import de ejemplo escrito en la documentación de un
 * archivo no lo ejecuta nadie. Se blanquean conservando los saltos de línea, para que el número
 * de línea que se reporta siga siendo el de verdad.
 */
export function sinComentarios(codigo: string): string {
  const enBlanco = (t: string) => t.replace(/[^\n]/g, " ");
  return codigo
    .replace(/\/\*[\s\S]*?\*\//g, enBlanco)
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, antes) => antes + enBlanco(m.slice(antes.length)));
}

const ESPECIFICADOR_RELATIVO =
  /^\s*(?:import|export)\b[\s\S]*?\bfrom\s*["'](\.[^"']*)["']|^\s*import\s*["'](\.[^"']*)["']/gm;

/** Los especificadores relativos de un archivo, con la línea en la que están escritos. */
export function importsRelativos(codigo: string): { especificador: string; linea: number }[] {
  const limpio = sinComentarios(codigo);
  const salida: { especificador: string; linea: number }[] = [];
  for (const m of limpio.matchAll(ESPECIFICADOR_RELATIVO)) {
    const especificador = m[1] ?? m[2];
    if (!especificador) continue;
    // La línea se ancla en el ESPECIFICADOR, no en el match: el `^\s*` del patrón se come el
    // salto de línea anterior, así que `m.index` apunta al renglón de arriba.
    const donde = limpio.indexOf(especificador, m.index ?? 0);
    salida.push({ especificador, linea: limpio.slice(0, donde).split("\n").length });
  }
  return salida;
}

/** ¿El especificador, resuelto desde este archivo, cae fuera del subárbol que viaja al stage? */
export function saleDelSubarbol(archivo: string, especificador: string, raiz = WEB_FACTORY): boolean {
  const destino = resolve(dirname(archivo), especificador);
  const rel = relative(raiz, destino);
  return rel.startsWith("..") || rel.startsWith(`..${sep}`);
}

export function fugas(raiz = WEB_FACTORY) {
  const salida: { archivo: string; especificador: string; linea: number }[] = [];
  for (const archivo of archivosDe(raiz)) {
    let codigo: string;
    try {
      codigo = readFileSync(archivo, "utf8");
    } catch {
      continue;
    }
    for (const { especificador, linea } of importsRelativos(codigo)) {
      if (saleDelSubarbol(archivo, especificador, raiz)) {
        salida.push({ archivo: relative(raiz, archivo), especificador, linea });
      }
    }
  }
  return salida;
}

describe("lo que importa web-factory viaja con web-factory", () => {
  it("el universo sale del disco y es el subárbol entero, no una carpeta", () => {
    const archivos = archivosDe(WEB_FACTORY);
    expect(archivos.length).toBeGreaterThan(100);
    // El sujeto conocido tiene que estar adentro, o el gate mide otra cosa.
    expect(archivos.some((a) => a.endsWith(join("scripts", "inclusion-chatbot.mjs")))).toBe(true);
    // Y las carpetas que el publicador no empaqueta no son sujetos de nadie.
    expect(archivos.some((a) => a.includes(`${sep}node_modules${sep}`))).toBe(false);
  });

  it("ningún archivo importa hacia afuera del subárbol que se publica", () => {
    const encontradas = fugas();
    expect(
      encontradas,
      encontradas.length === 0
        ? ""
        : `Estos imports resuelven en el repo pero NO en el stage de la landing, así que la ` +
          `publicación de onia.com.bo va a morir con ERR_MODULE_NOT_FOUND:\n` +
          encontradas.map((f) => `  ${f.archivo}:${f.linea} → ${f.especificador}`).join("\n"),
    ).toEqual([]);
  });

  it("reconoce la fuga aunque el archivo esté recién escrito y sin commitear", () => {
    // El sujeto se arma partido: si la ruta estuviera entera, este gate se acusaría a sí mismo.
    const haciaAfuera = "../".repeat(4) + "hermes" + "-content/deploy/vps-ops/bot/promesa-inclusion.mjs";
    const archivoFicticio = join(WEB_FACTORY, "apps", "onia-platform", "scripts", "reciencito.mjs");
    expect(saleDelSubarbol(archivoFicticio, haciaAfuera)).toBe(true);
    expect(saleDelSubarbol(archivoFicticio, "./promesa-inclusion.mjs")).toBe(false);
    expect(saleDelSubarbol(archivoFicticio, "../src/lib/pricing.ts")).toBe(false);
  });

  it("un import escrito en un comentario no acusa, y uno de verdad sí", () => {
    const enComentario = `/* import x from "${"../".repeat(9)}afuera.mjs"; */\nimport y from "./aca.mjs";`;
    expect(importsRelativos(enComentario).map((i) => i.especificador)).toEqual(["./aca.mjs"]);
    const deVerdad = `import y from "./aca.mjs";\nimport type { Z } from "${"../".repeat(9)}afuera.mjs";`;
    expect(importsRelativos(deVerdad).map((i) => i.especificador)).toHaveLength(2);
  });

  it("la línea que reporta es la real (los comentarios se blanquean, no se borran)", () => {
    const codigo = `/* uno\n   dos */\nimport y from "./aca.mjs";`;
    expect(importsRelativos(codigo)[0].linea).toBe(3);
  });
});

/*
 * ────────────────────────────────────────────────────────────────────────────
 * Lo mismo, pero para lo que se LEE en tiempo de ejecución.
 *
 * POR QUE hace falta un segundo detector. El de arriba mira `import`, y eso dejó
 * pasar el defecto que volvió a apagar la landing. Medido el 2026-09-26 03:51 UTC
 * en `/tmp/pub-landing.log`: `src/lib/duracion-de-la-cita.test.ts` no importaba
 * nada de afuera —armaba la ruta a `hermes-content/deploy/vps-ops/bot/config.mjs`
 * con `join()` y la leía— así que el gate de imports lo dio VERDE, el `prebuild`
 * del stage salió 1 y el publicador cortó con «ERR: el build falló, no publico».
 * Tres corridas del cron (23:50, 02:50, 05:50) sin publicar onia.com.bo.
 *
 * Es el MISMO costo del 2026-09-17, con otra forma: el stage trae sólo
 * `web-factory/`, así que un archivo que lo lea desde afuera falla EN VERDE para
 * todo el mundo —la cadena de onia-hermes, el CI— y el único que se entera es el
 * publicador, de madrugada, en una línea de log que no escala a nadie.
 *
 * QUE EXIGE. Un archivo que lee disco y nombra un subárbol hermano tiene que estar
 * DECLARADO acá, diciendo cuál de las dos cosas hace. Y la declaración no se cree:
 * se vuelve a medir contra el código, y cada motivo se verifica con la propiedad
 * CONTRARIA, así ninguno de los dos es un sello de goma.
 *   · `degrada`        → arma la ruta, y si el hermano falta termina en NO MEDIDO, no en `throw`.
 *   · `solo-lo-nombra` → lo nombra en prosa o en un mensaje, y NO arma ninguna ruta.
 *
 * Un archivo nuevo sin declarar sale ROJO acá, que es donde se mira, en vez de a las
 * tres de la mañana en el log del publicador.
 *
 * LOS HERMANOS SALEN DEL DISCO, no de una lista. Y se excluyen los nombres que
 * existen TAMBIÉN dentro de `web-factory/` (`docs/`, `scripts/`): ahí «docs» no
 * prueba fuga, y un gate que acusa por ambigüedad se desobedece a la tercera.
 *
 * EN EL STAGE ESTE GATE NO MIDE — y lo dice. El árbol publicado no tiene hermanos,
 * así que no hay sujetos: se declara NO MEDIDO en vez de plantarse. Plantarse es
 * exactamente el defecto que vino a cazar. Para que ese salto no se vuelva un verde
 * permanente, el primer caso corre en los DOS árboles y exige que el detector
 * conteste las dos cosas.
 */

/** Nombres que NO cuentan: existen también adentro, así que nombrarlos no prueba nada. */
export function hermanosInequivocos(raiz = WEB_FACTORY): string[] {
  const padre = dirname(raiz);
  let entradas: string[];
  try {
    entradas = readdirSync(padre);
  } catch {
    return [];
  }
  return entradas
    .filter((n) => !n.startsWith(".") && !NO_SE_PUBLICAN.has(n) && join(padre, n) !== raiz)
    .filter((n) => {
      try {
        return statSync(join(padre, n)).isDirectory();
      } catch {
        return false;
      }
    })
    .filter((n) => !existsSync(join(raiz, n)))
    .sort();
}

const LEE_DISCO = /\b(?:readFileSync|readdirSync|existsSync|statSync|opendirSync|globSync)\b/;

/** El hermano nombrado DENTRO de un literal de texto. Un identificador suelto no es una ruta. */
export function nombraAlHermano(codigoVivo: string, hermano: string): boolean {
  return new RegExp(`["'\`][^"'\`]*\\b${hermano}\\b`).test(codigoVivo);
}

/** ¿Arma una ruta hacia el hermano, o sólo lo menciona? `join()`/`resolve()` es armar. */
export function construyeRutaHacia(codigoVivo: string, hermano: string): boolean {
  return new RegExp(`\\b(?:join|resolve)\\s*\\([^;]{0,200}?["'\`][^"'\`]*\\b${hermano}\\b`).test(codigoVivo);
}

/**
 * ¿La ausencia del hermano termina en NO MEDIDO, o en una excepción?
 *
 * **Preguntar `existsSync` NO alcanza, y creer que sí alcanzaba era el agujero.** La versión
 * de `duracion-de-la-cita.test.ts` que apagó la landing preguntaba —`if (existsSync(candidato))
 * return candidato;`— y después `throw`eaba. Un gate que sólo exigiera la pregunta la habría
 * declarado sana y dado VERDE sobre el defecto que existe para cazar.
 *
 * Lo que separa la rota de la arreglada es cómo TERMINA la rama de la ausencia. Las tres formas
 * que no se plantan, todas vivas hoy en esta app:
 *   · `skipIf(…)`            — vitest lo reporta como saltado; la ausencia se VE.
 *   · `if (!…) return`       — salida neutra dentro del caso.
 *   · `process.exit(2)`      — el tri-estado de los alias: NO MEDIDO ≠ verde ≠ rojo.
 * `if (!…) throw` no está en la lista a propósito: ésa es exactamente la forma que rompió el
 * `prebuild` del publicador.
 */
export function declaraNoMedidoSinPlantarse(codigoVivo: string): boolean {
  if (/\bskipIf\s*\(/.test(codigoVivo)) return true;
  if (/\bif\s*\(\s*![^\n]{0,80}?\)\s*\{?\s*return\b/.test(codigoVivo)) return true;
  if (/\bprocess\.exit\(\s*2\s*\)/.test(codigoVivo)) return true;
  return false;
}

export function lecturasHaciaAfuera(raiz = WEB_FACTORY) {
  const hermanos = hermanosInequivocos(raiz);
  const salida: { archivo: string; nombra: string[]; construye: string[]; noSePlanta: boolean }[] = [];
  if (hermanos.length === 0) return salida;
  for (const archivo of archivosDe(raiz)) {
    let codigo: string;
    try {
      codigo = readFileSync(archivo, "utf8");
    } catch {
      continue;
    }
    const vivo = sinComentarios(codigo);
    if (!LEE_DISCO.test(vivo)) continue;
    const nombra = hermanos.filter((h) => nombraAlHermano(vivo, h));
    if (nombra.length === 0) continue;
    salida.push({
      archivo: relative(raiz, archivo),
      nombra,
      construye: nombra.filter((h) => construyeRutaHacia(vivo, h)),
      noSePlanta: declaraNoMedidoSinPlantarse(vivo),
    });
  }
  return salida;
}

/**
 * Lo que cada archivo declara hacer cuando el subárbol hermano NO está.
 * Medido archivo por archivo el 2026-09-26; las claves son rutas relativas a `web-factory/`.
 */
const DECLARADOS: Record<string, "degrada" | "solo-lo-nombra"> = {
  "apps/onia-platform/scripts/alta-confirma-vivo.mjs": "solo-lo-nombra",
  "apps/onia-platform/scripts/gates-cableados.test.ts": "solo-lo-nombra",
  "apps/onia-platform/scripts/promesa-inclusion-espejo.test.ts": "degrada",
  "apps/onia-platform/scripts/recursos-vivos.mjs": "degrada",
  "apps/onia-platform/src/app/recurso-del-cliente-en-el-contrato.test.ts": "solo-lo-nombra",
  "apps/onia-platform/src/lib/duracion-de-la-cita.test.ts": "degrada",
};

const HERMANOS = hermanosInequivocos();
/** En el stage no hay hermanos que leer. No es un verde: es un NO MEDIDO, y se dice. */
const EN_EL_REPO_COMPLETO = HERMANOS.length > 0;

/**
 * Los nombres de los fixtures se arman PARTIDOS, igual que en el gate de imports de arriba:
 * escritos enteros, este archivo sería sujeto de sí mismo —lee disco y nombraría un hermano—
 * y el detector tendría razón. Que el gate se acuse solo no prueba un defecto, lo esconde:
 * obligaría a declararlo en `DECLARADOS` y esa entrada falsa taparía al próximo de verdad.
 */
const HERMANO = "hermes" + "-content";
const AMBIGUO_COMO_VARIABLE = "out" + "put";

describe("lo que LEE web-factory en runtime también viaja con web-factory", () => {
  /**
   * Corre en los DOS árboles. Es lo que impide que el salto de abajo se vuelva un verde
   * permanente: si el detector dijera «hay hermanos» en cualquier parte —o «no hay» en
   * todas—, los casos siguientes se saltarían para siempre sin que nada lo dijera.
   */
  it("el detector distingue el repo completo del árbol que se publica", () => {
    const conHermano = mkdtempSync(join(tmpdir(), "stage-completo-"));
    const soloWebFactory = mkdtempSync(join(tmpdir(), "stage-recortado-"));
    try {
      mkdirSync(join(conHermano, "web-factory"));
      mkdirSync(join(conHermano, HERMANO));
      expect(hermanosInequivocos(join(conHermano, "web-factory"))).toEqual([HERMANO]);

      // El stage: `git archive` empaqueta `web-factory/` y NADA más.
      mkdirSync(join(soloWebFactory, "web-factory"));
      expect(hermanosInequivocos(join(soloWebFactory, "web-factory"))).toEqual([]);

      // Y un nombre que existe de los dos lados no acusa: sería ambiguo, no una fuga.
      mkdirSync(join(conHermano, "docs"));
      mkdirSync(join(conHermano, "web-factory", "docs"));
      expect(hermanosInequivocos(join(conHermano, "web-factory"))).toEqual([HERMANO]);

      /*
       * Y el gate ENTERO en el árbol del stage, que es donde corre el `prebuild` que se rompió:
       * se le pone adentro un archivo que en el repo completo SÍ sería sujeto —lee disco y arma
       * la ruta al hermano— y aun así no sale nada, porque ahí no hay contra qué medir. Sin este
       * caso, el comportamiento de este gate en el único árbol que importa quedaba razonado y no
       * medido: exactamente el defecto que vino a cazar, cometido por él mismo.
       */
      const sujeto = `import { existsSync } from "node:fs";\nconst R = join("${HERMANO}", "x.mjs");\nif (existsSync(R)) readFileSync(R);\n`;
      writeFileSync(join(soloWebFactory, "web-factory", "sujeto.mjs"), sujeto);
      expect(lecturasHaciaAfuera(join(soloWebFactory, "web-factory"))).toEqual([]);
      // …y en el repo completo el MISMO archivo sí sale, o el caso de arriba no probaría nada.
      writeFileSync(join(conHermano, "web-factory", "sujeto.mjs"), sujeto);
      expect(lecturasHaciaAfuera(join(conHermano, "web-factory")).map((l) => l.archivo)).toEqual([
        "sujeto.mjs",
      ]);
    } finally {
      rmSync(conHermano, { recursive: true, force: true });
      rmSync(soloWebFactory, { recursive: true, force: true });
    }
  });

  it("separa armar una ruta de nombrarlo en prosa", () => {
    const arma = `const R = join("${HERMANO}", "deploy", "bot", "config.mjs");`;
    const menciona = `throw new Error("vive en ${HERMANO}/deploy/bot/x.mjs y por eso está acá");`;
    expect(construyeRutaHacia(arma, HERMANO)).toBe(true);
    expect(construyeRutaHacia(menciona, HERMANO)).toBe(false);
    expect(nombraAlHermano(menciona, HERMANO)).toBe(true);
    // Un identificador suelto no es una ruta: el nombre como variable no puede acusar.
    expect(nombraAlHermano(`const ${AMBIGUO_COMO_VARIABLE} = 1;`, AMBIGUO_COMO_VARIABLE)).toBe(false);
  });

  it.skipIf(!EN_EL_REPO_COMPLETO)("los hermanos salen del disco e incluyen al que costó el deploy", () => {
    expect(HERMANOS).toContain(HERMANO);
    // Los ambiguos no son sujetos de nadie: existen también adentro de web-factory.
    expect(HERMANOS).not.toContain("docs");
    expect(HERMANOS).not.toContain("scripts");
  });

  it.skipIf(!EN_EL_REPO_COMPLETO)("todo archivo que lee hacia un hermano está declarado", () => {
    const sinDeclarar = lecturasHaciaAfuera().filter((l) => !(l.archivo in DECLARADOS));
    expect(
      sinDeclarar.map((l) => l.archivo),
      sinDeclarar.length === 0
        ? ""
        : `Estos archivos leen disco y nombran un subárbol que NO viaja al stage de la landing. ` +
          `Si arman una ruta hacia él y la ausencia termina en \`throw\` en vez de en NO MEDIDO, ` +
          `el \`prebuild\` del publicador muere y onia.com.bo deja de publicarse. ` +
          `Declaralos en DECLARADOS:\n` +
          sinDeclarar
            .map((l) => `  ${l.archivo} → nombra [${l.nombra}], arma ruta hacia [${l.construye}]`)
            .join("\n"),
    ).toEqual([]);
  });

  it.skipIf(!EN_EL_REPO_COMPLETO)("el que dice `degrada` arma la ruta Y no se planta si falta", () => {
    const encontradas = lecturasHaciaAfuera();
    const fallan = encontradas
      .filter((l) => DECLARADOS[l.archivo] === "degrada")
      .filter((l) => l.construye.length === 0 || !l.noSePlanta);
    expect(
      fallan.map((l) => l.archivo),
      fallan.length === 0
        ? ""
        : `Se declaran \`degrada\` pero no lo sostienen: o no arman ninguna ruta (entonces ` +
          `son \`solo-lo-nombra\`), o la rama de la ausencia termina en \`throw\` en vez de en ` +
          `NO MEDIDO (\`skipIf\`, \`if (!…) return\`, \`process.exit(2)\`). Plantarse ahí es lo ` +
          `que apaga el deploy de la landing: el \`prebuild\` sale 1 y el publicador no publica.`,
    ).toEqual([]);
  });

  /**
   * El caso que ancla todo lo de arriba: se le da al detector la forma EXACTA que rompió el
   * deploy y la forma con que se arregló. Sin esto, el predicado podría ablandarse con el tiempo
   * —volver a «¿pregunta `existsSync`?»— y nadie se enteraría hasta la próxima madrugada.
   */
  it("reconoce la forma que apagó la landing, y la que la arregló", () => {
    const rota = `if (existsSync(candidato)) return candidato;\nthrow new Error("árbol incompleto, este gate NO midió nada");`;
    expect(declaraNoMedidoSinPlantarse(rota)).toBe(false);

    expect(declaraNoMedidoSinPlantarse(`it.skipIf(!EN_EL_REPO_COMPLETO)("x", () => {});`)).toBe(true);
    expect(declaraNoMedidoSinPlantarse(`if (!enElRepoCompleto()) return;`)).toBe(true);
    expect(declaraNoMedidoSinPlantarse(`if (!existsSync(RECURSOS)) return [];`)).toBe(true);
    expect(declaraNoMedidoSinPlantarse(`console.log("NO MEDIDO: falta el registro");\nprocess.exit(2);`)).toBe(true);

    // Y preguntar y después tirar NO cuenta, que es justo lo que el gate viejo dejaba pasar.
    expect(declaraNoMedidoSinPlantarse(`if (!existsSync(CONTACTO)) {\n  throw new Error("no existe");\n}`)).toBe(false);
  });

  it.skipIf(!EN_EL_REPO_COMPLETO)("el que dice `solo-lo-nombra` no arma ninguna ruta", () => {
    const encontradas = lecturasHaciaAfuera();
    const fallan = encontradas
      .filter((l) => DECLARADOS[l.archivo] === "solo-lo-nombra")
      .filter((l) => l.construye.length > 0);
    expect(
      fallan.map((l) => `${l.archivo} → ${l.construye}`),
      fallan.length === 0
        ? ""
        : `Se declaran \`solo-lo-nombra\` pero arman una ruta hacia el hermano. Si de verdad la ` +
          `leen, tienen que preguntar si está y declararse \`degrada\`.`,
    ).toEqual([]);
  });

  it.skipIf(!EN_EL_REPO_COMPLETO)("el registro no se pudre: no declara archivos que ya no leen hacia afuera", () => {
    const vivos = new Set(lecturasHaciaAfuera().map((l) => l.archivo));
    const sobrantes = Object.keys(DECLARADOS).filter((a) => !vivos.has(a));
    expect(
      sobrantes,
      sobrantes.length === 0
        ? ""
        : `Estas entradas ya no corresponden a ningún archivo que lea hacia un hermano. ` +
          `Un registro con entradas muertas deja de describir el código: borralas.`,
    ).toEqual([]);
  });
});
