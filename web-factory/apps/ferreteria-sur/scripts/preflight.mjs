/**
 * PREFLIGHT — separar "el instrumento no está" de "el código está roto".
 *
 * Por qué existe, medido el 2026-09-04 en este worktree del VPS: `npm run
 * typecheck` devolvió ROJO en las DOS apps de cliente, y el código estaba
 * intacto. La causa era que `web-factory` no tenía node_modules y `tsc` no
 * existía (`sh: 1: tsc: not found`). El veredicto que llega al log del carril
 * —"dental-premium typecheck ROJO"— se lee como "la web del cliente está
 * rota", que es la dirección CARA del error: manda a arreglar código sano.
 *
 * Y la trampa gemela es peor, porque sale VERDE: `npx tsc --noEmit` sin
 * node_modules descarga un paquete distinto llamado `tsc` que imprime "This is
 * not the tsc command you are looking for" y sale con ÉXITO. Un gate que se
 * apoya en `npx` da por compilado algo que nadie compiló.
 *
 * Este script hace que el estado "sin instrumento" sea IMPOSIBLE de confundir:
 * dice qué falta, dice el comando que lo repara EN ESTE VPS, y sale con 3 —
 * ni 0 (verde) ni 1 (rojo del código).
 *
 * ⚠️ El comando de reparación NO es `pnpm install` a secas: `pnpm` no está en
 * el PATH del VPS (medido el 2026-09-04, `command -v pnpm` vacío), y el
 * runbook que lo decía mandaba a un comando que no corre. Lo que sí corre es
 * `corepack pnpm`, con la versión que fija `packageManager` en package.json.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RAIZ = path.resolve(APP, "..", "..");
const nombre = path.basename(APP);

/** Binarios que los gates de esta app ejecutan por nombre, no por `npx`. */
const REQUERIDOS = [
  { bin: "tsc", quien: "typecheck / prebuild" },
  { bin: "next", quien: "build / gate:peso" },
];

const faltan = REQUERIDOS.filter(({ bin }) => !existsSync(path.join(APP, "node_modules", ".bin", bin)));

/**
 * El navegador va aparte, y es el que más importa: `gate:pliegue`,
 * `gate:contraste` y `gate:parallax` MIRAN la pantalla, que es la única
 * verificación que este proyecto acepta. Medido el 2026-09-04: sin el Chromium
 * de Playwright los tres mueren con un stack de `triggerUncaughtException` que
 * parece un bug del gate, y `npm run gates` sale 1 después de haber pasado el
 * peso — o sea que la cadena se corta en el medio y el veredicto queda a medias.
 */
const navegador = await (async () => {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    return { que: "el paquete `playwright`", detalle: "no se pudo importar", reparar: "install" };
  }
  // Se LANZA de verdad, no se mira si el archivo está. Medido el 2026-09-04:
  // `existsSync(chromium.executablePath())` daba VERDE apuntando a
  // `chromium-1228/chrome-linux64/chrome` mientras los gates lanzan el
  // `chromium_headless_shell-1228`, que era el que faltaba — el mismo falso
  // verde que este preflight existe para eliminar. Y aun con los dos binarios
  // en disco, faltaba `libnspr4.so` y no arrancaba: un archivo presente no es
  // un navegador que abre.
  try {
    const b = await chromium.launch();
    await b.close();
    return null;
  } catch (e) {
    const linea = String(e).split("\n").find((l) => /error while loading shared libraries|Executable doesn't exist|cannot open shared object/.test(l));
    const faltanLibs = /shared librar|shared object/.test(String(e));
    return {
      que: faltanLibs ? "las librerías de sistema del navegador" : "el navegador de Playwright",
      detalle: (linea ?? String(e).split("\n")[0]).trim(),
      reparar: faltanLibs ? "deps" : "install",
    };
  }
})();

if (faltan.length === 0 && !navegador) process.exit(0);

const hayPnpm = (() => {
  try {
    execFileSync("pnpm", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();
const gestor = hayPnpm ? "pnpm" : "corepack pnpm";

console.error(`✗ INSTRUMENTO AUSENTE en ${nombre} — esto NO dice nada sobre el código.`);
for (const { bin, quien } of faltan) {
  console.error(`  falta node_modules/.bin/${bin}  (lo necesita: ${quien})`);
}
if (!existsSync(path.join(APP, "node_modules"))) {
  console.error(`  y la app no tiene node_modules: las dos apps son workspaces de ${RAIZ}`);
}
if (navegador) {
  console.error(`  falta ${navegador.que}  (lo necesitan: gate:pliegue, gate:contraste, gate:parallax)`);
  console.error(`    ${navegador.detalle}`);
}
console.error("");
console.error("  Reparalo con:");
if (faltan.length > 0) console.error(`    cd ${RAIZ} && ${gestor} install --frozen-lockfile`);
if (navegador?.reparar === "install") console.error(`    cd ${RAIZ} && ${gestor} exec playwright install chromium`);
if (navegador?.reparar === "deps") console.error(`    cd ${RAIZ} && ${gestor} exec playwright install-deps chromium   # apt, pide root`);
if (!hayPnpm) {
  console.error("  (`pnpm` no está en el PATH de esta máquina; corepack usa la versión de `packageManager`)");
}
console.error("");
console.error("  Hasta que eso corra, el veredicto de los gates de esta app es DESCONOCIDO,");
console.error("  no verde y no rojo. No lo reportes como que la web está rota.");

process.exit(3);
