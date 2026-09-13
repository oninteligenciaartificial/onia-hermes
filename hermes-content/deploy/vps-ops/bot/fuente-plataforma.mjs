/**
 * Leer una fuente de verdad de onia-platform —OTRO repo— desde su ref PUBLICADO.
 *
 * Vivía adentro de `precios-publicos.test.mjs`. Se saca acá porque dejó de tener un solo
 * consumidor: `promesa-inclusion.test.mjs` cruza el mismo repo hermano para otra pregunta (qué
 * planes traen el chatbot adentro). Copiar estas dos funciones habría sido exactamente la falla
 * que este repo ya pagó —dos hermanas que divergen, una se arregla y la otra no—, así que hay UNA.
 *
 * Las dos reglas que este módulo existe para sostener, las dos medidas:
 *
 * 1. NO SE SALTEA. Si no encuentra el repo, TIRA. Un gate que se apaga solo cuando no encuentra a
 *    su sujeto falla abierto, y el día que alguien cambie un precio nadie se entera.
 *
 * 2. NO SE LEE EL WORKING TREE. Medido el 2026-09-12: el gate de precios pasó VERDE mientras el
 *    bot le cotizaba a los leads "Bs 750 el Profesional y Bs 1.500 el Completo" y la fuente ya
 *    decía 890 y 1.290 (escalera C, commit 4bff903). Leía `<repo>/lib/<archivo>` del disco, y los
 *    DOS clones del nodo estaban atrás de `origin/master` (1 y 15 commits): comparaba la copia del
 *    bot contra un FOSIL del mismo día en que se copió, y dos fotos del mismo pasado coinciden
 *    siempre. Un worktree atrasado es el estado NORMAL de un carril, no una anomalía que se pueda
 *    pedir que no ocurra — por eso el sujeto es el ref publicado y no la carpeta donde uno está.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * En el nodo-casa este repo corre en un WORKTREE, así que ni `cwd` ni la ruta del archivo llevan
 * al vecino `onia-platform`. Se le pregunta a git por el checkout primario (`--git-common-dir`
 * apunta al `.git` del principal aun desde un worktree) y se prueba su hermano. Si git no está o
 * no es repo, es un candidato menos, no un error.
 */
function vecinoDelCheckoutPrincipal() {
  try {
    const gitDir = execFileSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], {
      encoding: "utf8",
    }).trim();
    return path.join(path.dirname(gitDir), "..", "onia-platform");
  } catch {
    return null;
  }
}

/** La CARPETA del repo hermano. Lo que se lee de adentro sale de `fuenteDePlataforma`. */
export function repoPlataforma() {
  const candidatos = [
    process.env.ONIA_PLATFORM_DIR,
    "/root/loops/onia-platform-chatbot",
    "/root/loops/onia-platform",
    path.join(process.cwd(), "..", "onia-platform"),
    vecinoDelCheckoutPrincipal(),
  ].filter(Boolean);
  const encontrado = candidatos.find((dir) => existsSync(path.join(dir, "lib", "subscription-plans.ts")));
  if (!encontrado) {
    throw new Error(
      `no encontre onia-platform (probe: ${candidatos.join(", ")}). ` +
        "Pasa ONIA_PLATFORM_DIR=<ruta>. NO se saltea: sin leer la fuente, este gate no vale nada.",
    );
  }
  return encontrado;
}

/** El contenido de `lib/<archivo>` tal como está PUBLICADO en `origin/master`. */
export function fuenteDePlataforma(repo, archivo) {
  try {
    execFileSync("git", ["fetch", "origin", "--quiet"], { cwd: repo, stdio: "ignore", timeout: 60_000 });
  } catch {
    // Sin red se sigue con el ref que ya esté en disco: refrescar es deseable, no imprescindible,
    // y esto corre en la cadena `npm test` de todos los carriles. Lo que NO se hace nunca es caer
    // al working tree — que es, exactamente, el bug que este módulo existe para no repetir.
  }
  try {
    return execFileSync("git", ["show", `origin/master:lib/${archivo}`], {
      cwd: repo,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });
  } catch (error) {
    throw new Error(
      `no pude leer lib/${archivo} desde origin/master en ${repo}: ${error.message}. ` +
        "Sin la fuente publicada este gate no vale nada, asi que cae en ROJO en vez de mirar el " +
        "archivo del disco (que es el fosil que dejo pasar la escalera C).",
    );
  }
}
