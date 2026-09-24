import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Todo gate de `scripts/` tiene un NOMBRE con el que invocarlo.
 *
 * QUE SE ROMPIO, medido el 2026-09-06. De los 13 `scripts/*.mjs` de esta app,
 * ONCE no estaban nombrados en ningun lado — entre ellos `precios-fuente.mjs`,
 * que es el UNICO cruce automatico entre lo que el sitio publica y lo que el
 * producto cobra y aplica (31 cifras: montos, topes y tiers). Corrido a mano
 * salia VERDE. No lo corria nadie.
 *
 * POR QUE ES UNA CLASE Y NO UN OLVIDO. Un script huerfano falla en la
 * direccion que no se ve: no da rojo, deja de dar VEREDICTO. Y el escalon de
 * arriba tampoco lo cubre — `guards-cableados` (cadena `npm test` de la raiz de
 * onia-hermes) ata los `test:*` DECLARADOS en un `package.json`, asi que un
 * gate que nunca se declaro le es invisible: es una lista de inclusion que
 * falla abierto, un nivel mas arriba. El dia que uno de estos se rompa, se
 * quede sin su fuente o lo borren, NADA se pone rojo.
 *
 * Y el costo no es hipotetico: se paga en vueltas. El 2026-09-06 esta sesion
 * cruzo `PLAN_LIMITS` A MANO contra el otro repo, linea por linea, antes de
 * descubrir que `precios-fuente.mjs` ya lo hacia entero. `npm run` no lo
 * listaba, asi que no existia para quien no lo supiera de memoria.
 *
 * ⚠️ POR QUE ESTOS NO VAN A LA CADENA `test`. Miden cosas VIVAS: el repo del
 * producto, produccion, el VPS. Metidos en `npm test` se pondrian rojos por
 * AMBIENTE en toda maquina que no los tenga, y como el integrador corre la
 * cadena entera antes de tocar `main`, eso trabaria el merge de los quince
 * carriles. Van como alias sueltos —igual que `busqueda:viva`, que ya estaba—
 * y cada uno sale con codigo 2 (NO MEDIDO) cuando no alcanza su fuente. Lo que
 * se exige aca es que TENGAN NOMBRE, no que corran en el build.
 *
 * COMO NO FALLA EN VERDE. Los sujetos salen del DISCO, no de una lista: un
 * `.mjs` nuevo nace cubierto y hay que eximirlo a mano, a la vista. Ademas se
 * exige que el barrido haya ENCONTRADO sujetos: si el glob queda vacio (se
 * renombro la carpeta, cambio la extension), "ninguno huerfano" se leeria como
 * sano, y eso es exactamente como esta familia de gates miente.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = dirname(AQUI);

/**
 * Lo que NO necesita alias propio, con su motivo. Se exime de a UNO y por nombre:
 * eximir por categoria ("los modulos puros") tapa un arbol entero la proxima vez, y
 * el gate sale verde igual.
 */
const EXENTOS: Record<string, string> = {
  "montos-en-pantalla.mjs":
    "modulo puro sin medicion propia: lo importa precios-vivos.mjs y lo cubre montos-en-pantalla.test.ts. " +
    "Correrlo solo no mide nada — un alias suyo seria decorativo.",
  "monto-en-el-codigo.mjs":
    "modulo puro sin medicion propia: lo importa precios-vivos.mjs y lo cubre monto-en-el-codigo.test.ts. " +
    "Correrlo solo no mide nada — un alias suyo seria decorativo.",
  "recortados.mjs":
    "modulo puro sin medicion propia: lo importa mirar-venta.mjs y lo cubre recortados.test.ts. " +
    "Correrlo solo no mide nada — un alias suyo seria decorativo.",
  "rutas-de-venta.mjs":
    "modulo puro sin medicion propia: lo importan enlaces-vivos.mjs, precios-vivos.mjs y mirar-venta.mjs, " +
    "y lo cubren enlaces-vivos.test.ts y precios-vivos.test.ts. Hasta el 2026-09-24 tuvo alias " +
    "(`rutas:venta`) y era el unico de esta familia que lo tenia: correrlo imprimia NADA y salia 0, " +
    "un verde mudo en la lista de gates del carril de venta. Un alias suyo no mide — tranquiliza.",
  "promesa-inclusion.mjs":
    "modulo puro sin medicion propia: lo importa inclusion-chatbot.mjs. Es el ESPEJO byte a byte de " +
    "hermes-content/deploy/vps-ops/bot/promesa-inclusion.mjs, y vive de este lado porque el publicador " +
    "de la landing empaqueta solo web-factory/ — un import hacia el otro subarbol resuelve en el repo " +
    "y NO en el stage. Lo cruzan promesa-inclusion-espejo.test.ts (que las dos copias sean identicas) " +
    "e imports-que-viajan-al-stage.test.ts (que nadie vuelva a importar hacia afuera).",
};

/**
 * El corazon, puro: dado el listado de `.mjs` y el texto del `package.json`,
 * dice cuales no tienen forma de invocarse.
 *
 * Se pregunta por el nombre de archivo dentro de los VALORES de `scripts`, no
 * por la clave: el alias puede llamarse como sea (`precios:fuente`,
 * `busqueda:viva`), lo que importa es que algun comando lo ejecute. Y se mira
 * `scripts` y no el archivo entero, porque un `.mjs` mencionado en un comentario
 * o en `files` no es invocable — ese seria el fallo abierto de esta guarda.
 */
export function huerfanos(
  archivosMjs: readonly string[],
  scripts: Record<string, string>,
  exentos: Record<string, string> = {},
): string[] {
  const comandos = Object.values(scripts).join(" \n ");
  return archivosMjs
    .filter((f) => !(f in exentos))
    .filter((f) => !comandos.includes(f))
    .sort();
}

/** Entradas de `EXENTOS` que ya no corresponden a ningun archivo del disco. */
export function exentosPodridos(
  archivosMjs: readonly string[],
  exentos: Record<string, string>,
): string[] {
  return Object.keys(exentos)
    .filter((f) => !archivosMjs.includes(f))
    .sort();
}

/**
 * Exentos que nadie importa. El motivo de las dos exenciones vivas es el mismo —«lo
 * importa precios-vivos.mjs»— y hasta hoy nadie lo verificaba: una entrada en una
 * lista blanca cuyo motivo dejo de ser cierto queda PRE-APROBADA, y el archivo pasa a
 * ser codigo muerto que ningun gate ve. El motivo se re-mide cada corrida.
 */
export function exentosSinConsumidor(
  exentos: Record<string, string>,
  fuentes: Record<string, string>,
): string[] {
  return Object.keys(exentos)
    .filter((f) =>
      !Object.entries(fuentes).some(
        ([nombre, txt]) => nombre !== f && txt.includes(`./${f}`),
      ),
    )
    .sort();
}

const MJS = readdirSync(join(APP, "scripts"))
  .filter((f) => f.endsWith(".mjs"))
  .sort();

const SCRIPTS: Record<string, string> = JSON.parse(
  readFileSync(join(APP, "package.json"), "utf8"),
).scripts;

describe("la logica de la guarda, contra fixtures", () => {
  // Un test de guarda escrito SOLO contra el arbol vivo pasa en verde con la
  // guarda arrancada el dia que el arbol vivo no ejercita el caso. Estos dos
  // fuerzan las dos direcciones y no dependen del disco.
  it("marca el .mjs que ningun comando invoca", () => {
    expect(
      huerfanos(["solo.mjs", "atado.mjs"], { x: "node scripts/atado.mjs" }),
    ).toEqual(["solo.mjs"]);
  });

  it("no marca el que si se invoca, ni el eximido a proposito", () => {
    expect(
      huerfanos(["atado.mjs", "aparte.mjs"], { x: "node scripts/atado.mjs" }, {
        "aparte.mjs": "motivo",
      }),
    ).toEqual([]);
  });

  it("nombrarlo fuera de `scripts` NO cuenta como invocarlo", () => {
    // El modo de fallo abierto de esta guarda: un `.mjs` citado en un
    // comentario, en `files` o en una dependencia se leeria como cableado.
    expect(huerfanos(["suelto.mjs"], { test: "vitest run" })).toEqual([
      "suelto.mjs",
    ]);
  });

  it("delata la exencion que quedo sin archivo", () => {
    expect(exentosPodridos(["vive.mjs"], { "borrado.mjs": "motivo" })).toEqual([
      "borrado.mjs",
    ]);
  });

  it("delata al exento que ya nadie importa, y no al importado", () => {
    const fuentes = {
      "medidor.mjs": "import { x } from './usado.mjs';",
      "usado.mjs": "export const x = 1;",
      "nadie.mjs": "export const y = 2;",
    };
    expect(
      exentosSinConsumidor({ "usado.mjs": "m", "nadie.mjs": "m" }, fuentes),
    ).toEqual(["nadie.mjs"]);
  });

  it("importarse a si mismo no cuenta como consumidor", () => {
    expect(
      exentosSinConsumidor(
        { "solo.mjs": "m" },
        { "solo.mjs": "// ver ./solo.mjs" },
      ),
    ).toEqual(["solo.mjs"]);
  });
});

describe("los gates de este carril se pueden invocar", () => {
  it("el barrido encuentra sujetos en el disco", () => {
    // Sin esto, un glob vacio daria "ninguno huerfano" = verde.
    expect(MJS.length).toBeGreaterThan(5);
  });

  it("ningun script de scripts/ quedo sin forma de correrse", () => {
    expect(huerfanos(MJS, SCRIPTS, EXENTOS)).toEqual([]);
  });

  it("no hay exenciones que ya no correspondan a un archivo", () => {
    expect(exentosPodridos(MJS, EXENTOS)).toEqual([]);
  });

  it("cada exento lo importa de verdad algun .mjs de scripts/", () => {
    const fuentes = Object.fromEntries(
      MJS.map((f) => [f, readFileSync(join(APP, "scripts", f), "utf8")]),
    );
    expect(exentosSinConsumidor(EXENTOS, fuentes)).toEqual([]);
  });

  it("el cruce contra la fuente del producto tiene nombre propio", () => {
    // El mas caro de perder: es el unico que compara los 31 numeros del sitio
    // contra `subscription-plans.ts` y `plan-limits.ts` del otro repo. Los
    // demas gates validan la copia contra la copia.
    expect(Object.values(SCRIPTS).join(" ")).toContain("precios-fuente.mjs");
  });
});
