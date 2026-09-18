/**
 * La cadena `npm test` no puede correr un gate MÁS FLOJO que el del publicador.
 *
 * ⚠️ Nace del 2026-09-17, y el costo fue la landing sin publicar. El paso
 * `test:sitio-venta` hacía `cd web-factory/apps/onia-platform && npm test`,
 * mientras el publicador corre `build` — que dispara `prebuild`, o sea
 * `tsc --noEmit && <los mismos tests>`. La mitad que faltaba era justo el
 * `tsc`: dos commits míos (94d4378c, f0e4091d) dejaron `main` con 5 errores de
 * tipo, los 1.303 tests siguieron en verde, el merge entró sin un solo rojo y
 * el publicador se negó a publicar con
 * `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL … prebuild` — una línea en
 * `/var/log/onia-publicar-solo.log` que no escala a nadie.
 *
 * El invariante que se defiende no es «corré tsc»: es que el gate de la cadena
 * haga la MISMA pregunta que el gate del publicador. Si mañana `prebuild` gana
 * un paso, la cadena lo hereda sola.
 *
 * El universo sale del DISCO (`readdirSync` de `web-factory/apps`), no de una
 * lista escrita acá ni de `git ls-files`: una app recién creada y sin commitear
 * es justo el sujeto que se quiere cazar.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const APPS = "web-factory/apps";

/** El sujeto conocido: si la derivación deja de verlo, el gate se apagó solo. */
const ANCLA = `${APPS}/onia-platform`;

function leerPackage(dir) {
  const ruta = join(RAIZ, dir, "package.json");
  if (!existsSync(ruta)) return null;
  try {
    return JSON.parse(readFileSync(ruta, "utf8"));
  } catch {
    return null;
  }
}

/**
 * Las apps que declaran un `prebuild`, derivadas del disco. `prebuild` es el
 * gate que el publicador corre solo (npm lo dispara antes de `build`), así que
 * su presencia es lo que hace a una app sujeto de este gate.
 */
export function appsConPrebuild(raiz = RAIZ) {
  const base = join(raiz, APPS);
  if (!existsSync(base)) return [];
  return readdirSync(base, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "node_modules")
    .map((e) => `${APPS}/${e.name}`)
    .filter((dir) => typeof leerPackage(dir)?.scripts?.prebuild === "string")
    .sort();
}

/**
 * Los pasos de `scripts` que entran a una app y corren npm ahí adentro.
 * Devuelve `{ paso, dir, comando }` — el `comando` es lo que se ejecuta DENTRO
 * de la app, que es lo que se compara contra su `prebuild`.
 */
export function pasosQueCorrenUnaApp(scripts) {
  const pasos = [];
  for (const [paso, valor] of Object.entries(scripts ?? {})) {
    if (paso === "test") continue; // la cadena misma, no un paso
    const m = /cd\s+(\S+)\s*&&\s*(.+?)\s*$/.exec(String(valor));
    if (m && m[1].startsWith(`${APPS}/`)) pasos.push({ paso, dir: m[1], comando: m[2] });
  }
  return pasos;
}

/**
 * ¿Ese comando corre el `prebuild` de la app? `build` cuenta porque npm
 * dispara `prebuild` antes; `test` a secas NO, y ése es el caso que costó la
 * publicación.
 */
export function cubrePrebuild(comando) {
  return /\bnpm\s+run\s+(prebuild|build)\b/.test(String(comando));
}

test("el ancla: la derivación ve la app cuyo gate ya falló una vez", () => {
  assert.ok(
    appsConPrebuild().includes(ANCLA),
    `${ANCLA} declara un prebuild y la derivación no lo ve: el universo quedó vacío y este gate se apagó en silencio`,
  );
});

test("el ancla: el parser ve algún paso de la cadena que entra a una app", () => {
  const scripts = JSON.parse(readFileSync(join(RAIZ, "package.json"), "utf8")).scripts;
  assert.ok(
    pasosQueCorrenUnaApp(scripts).length > 0,
    "ningún paso de la cadena parece correr una app: el parser se rompió y el invariante de abajo pasa por vacío",
  );
});

test("un paso que corre una app corre el MISMO gate que el publicador, no una mitad", () => {
  const scripts = JSON.parse(readFileSync(join(RAIZ, "package.json"), "utf8")).scripts;
  const conPrebuild = new Set(appsConPrebuild());
  const flojos = pasosQueCorrenUnaApp(scripts)
    .filter((p) => conPrebuild.has(p.dir) && !cubrePrebuild(p.comando))
    .map((p) => `${p.paso} corre «${p.comando}» en ${p.dir}, que tiene prebuild`);

  assert.deepEqual(
    flojos,
    [],
    "la cadena corre un gate más flojo que el publicador: va a mergear en verde lo que después impide publicar\n" +
      flojos.map((f) => `  · ${f}`).join("\n"),
  );
});

test("el paso está en la cadena: un alias suelto no lo corre nadie", () => {
  const scripts = JSON.parse(readFileSync(join(RAIZ, "package.json"), "utf8")).scripts;
  const conPrebuild = new Set(appsConPrebuild());
  const sueltos = pasosQueCorrenUnaApp(scripts)
    .filter((p) => conPrebuild.has(p.dir) && !String(scripts.test).includes(`npm run ${p.paso}`))
    .map((p) => p.paso);

  assert.deepEqual(sueltos, [], `estos pasos corren el gate de una app pero la cadena no los nombra: ${sueltos.join(", ")}`);
});

test("cubrePrebuild distingue el gate entero de su mitad", () => {
  assert.equal(cubrePrebuild("npm test"), false, "«npm test» es la mitad que dejó pasar el rojo del 2026-09-17");
  assert.equal(cubrePrebuild("npm run test"), false);
  assert.equal(cubrePrebuild("npm run prebuild"), true);
  assert.equal(cubrePrebuild("npm run build"), true, "build dispara prebuild: es el camino del publicador");
});

/**
 * AVISO, no rojo: una app con `prebuild` que la cadena no corre. No puede ser
 * rojo sin trabar el merge de TODOS los carriles por apps que hoy nadie
 * publica (`site` está a oscuras desde el 29-ago; las webs de cliente se
 * publican por su propio camino). Pero se nombra cada corrida, para que el día
 * que una de ésas se publique no se descubra por un log que nadie lee.
 */
test("aviso: apps con prebuild que la cadena no corre", () => {
  const scripts = JSON.parse(readFileSync(join(RAIZ, "package.json"), "utf8")).scripts;
  const corridas = new Set(pasosQueCorrenUnaApp(scripts).map((p) => p.dir));
  const afuera = appsConPrebuild().filter((d) => !corridas.has(d));
  if (afuera.length > 0) console.log(`AVISO · apps con prebuild que la cadena no corre: ${afuera.join(", ")}`);
});
