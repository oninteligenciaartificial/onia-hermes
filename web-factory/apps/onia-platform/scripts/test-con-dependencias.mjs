#!/usr/bin/env node
/**
 * Corre la suite del sitio de venta, pero primero comprueba que vitest EXISTA.
 *
 * Por que existe (t_43a9b27c, medido el 2026-09-04): la cadena `npm test` de la
 * raiz de onia-hermes termina en `test:sitio-venta`, que entra a esta app y
 * corre sus tests. En un worktree sin las dependencias, `vitest run` moria con:
 *
 *   sh: 1: vitest: not found          → EXIT 127
 *
 * Eso es indistinguible de un test en rojo. Un carril que corria `npm test`
 * antes de pushear leia "main esta roto" o "lo rompi yo" y gastaba la vuelta;
 * ya paso con campanas-web.test.mjs. Y al reves es peor: si el modo de fallo
 * llegara a devolver 0, los tests del sitio de venta -el unico gate que impide
 * un precio de plan tipeado a mano en la superficie que ve un lead- dejarian de
 * proteger a main sin que nada se ponga rojo.
 *
 * Por eso faltar dependencias sale con un codigo PROPIO y un mensaje que dice
 * el comando exacto. Nunca en verde: un gate que no corrio no es un gate que
 * paso.
 *
 * Uso:
 *   node scripts/test-con-dependencias.mjs [args de vitest]
 *   node scripts/test-con-dependencias.mjs --solo-verificar   (solo comprueba)
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

/** Codigo propio: ni 0 (verde), ni 1 (tests en rojo), ni 127 (not found). */
export const SIN_DEPENDENCIAS = 78;

/**
 * Busca el binario de vitest subiendo por los node_modules, igual que npm.
 * En este repo no siempre esta en la app: suele quedar izado en web-factory/.
 */
export function buscarVitest(desde) {
  let dir = resolve(desde);
  for (;;) {
    const bin = join(dir, "node_modules", ".bin", "vitest");
    if (existsSync(bin)) return bin;
    const padre = dirname(dir);
    if (padre === dir) return null;
    dir = padre;
  }
}

const AVISO = [
  "",
  "  ✖ La suite del sitio de venta NO se corrio: faltan las dependencias.",
  "",
  "    Esto NO es un test en rojo. No se ejecuto ni un test.",
  "",
  "    Arreglalo con:",
  "      npm ci --prefix web-factory/apps/onia-platform",
  "",
  "    (o `cd web-factory/apps/onia-platform && npm ci` desde la raiz del repo)",
  "",
].join("\n");

function main(argv) {
  const soloVerificar = argv.includes("--solo-verificar");
  const argsVitest = argv.filter((a) => a !== "--solo-verificar");

  const bin = buscarVitest(process.cwd());
  if (!bin) {
    process.stderr.write(`${AVISO}\n`);
    return SIN_DEPENDENCIAS;
  }

  if (soloVerificar) {
    process.stdout.write(`${bin}\n`);
    return 0;
  }

  const r = spawnSync(bin, ["run", ...argsVitest], { stdio: "inherit" });
  if (r.error) {
    process.stderr.write(`${AVISO}\n`);
    return SIN_DEPENDENCIAS;
  }
  // Muerto por senal: no hay veredicto, y "sin veredicto" no es verde.
  return r.status === null ? SIN_DEPENDENCIAS : r.status;
}

// Sin esta guarda, importar el modulo lanzaria vitest (y aca, vitest dentro de
// vitest). Ya paso en scripts/demo_agendada_real.mjs el 2026-09-03.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv.slice(2)));
}
