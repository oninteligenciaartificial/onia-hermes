// editor-videos — de dónde sale playwright (compartido por make-mockup y make-carousel).
//
// La skill NO declara playwright como dependencia propia: se lo pide prestado al
// workspace del repo. Eso está bien, pero el ancla estaba escrita como ruta ABSOLUTA
// ("C:/dev/proyectos/onia-hermes/web-factory/apps/site/package.json") — o sea, existía
// en UNA sola máquina. Al clonar el repo en otra carpeta (o en el VPS) el paso de
// apoyos visuales moría con un "Cannot find module 'playwright'" que no dice nada.
//
// Acá el ancla se calcula RELATIVA a este archivo y se prueban varios node_modules,
// del más específico al más general. Si no aparece, se sale con el comando exacto
// para arreglarlo en vez de reventar con un stack de resolución de módulos.
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

// scripts/ → editor-videos/ → skills/ → .claude/ → raíz del repo
export const REPO_ROOT = fileURLToPath(new URL("../../../../", import.meta.url));

// Orden de búsqueda: workspace del panel (donde vivía históricamente) → node_modules
// de la raíz del repo → node_modules del directorio que contiene al repo (checkouts
// anidados, que es justo el caso de HERMES/onia-hermes).
const ANCLAS = [
  join(REPO_ROOT, "web-factory", "apps", "site", "package.json"),
  join(REPO_ROOT, "package.json"),
  join(REPO_ROOT, "..", "package.json"),
];

/**
 * Devuelve el `chromium` de playwright, o corta el proceso con un mensaje accionable.
 * @param {string} script nombre para prefijar los errores (ej. "make-mockup")
 */
export function resolveChromium(script) {
  const intentos = [];
  for (const ancla of ANCLAS) {
    if (!existsSync(ancla)) {
      intentos.push(`  · ${ancla} — no existe`);
      continue;
    }
    try {
      const pw = createRequire(ancla)("playwright");
      if (pw?.chromium) return pw.chromium;
      intentos.push(`  · ${ancla} — resolvió playwright pero sin chromium`);
    } catch (err) {
      // Solo tragamos el "no está instalado"; un fallo INTERNO de playwright
      // (una dep suya rota) tiene que verse tal cual, no disfrazarse de "falta".
      if (err?.code !== "MODULE_NOT_FOUND" || !/'playwright'/.test(String(err.message))) throw err;
      intentos.push(`  · ${ancla} — sin playwright en su node_modules`);
    }
  }
  console.error(
    `${script}: falta playwright — sin él no se puede rendir ningún apoyo visual PNG.\n` +
      `Busqué desde:\n${intentos.join("\n")}\n` +
      `Instalalo en la raíz del repo (${REPO_ROOT}):\n` +
      `  npm i -D playwright && npx playwright install chromium`,
  );
  process.exit(1);
}

/**
 * chromium.launch() con el otro modo de falla cubierto: paquete instalado pero SIN
 * el binario descargado. Playwright ahí escupe un cartel ASCII de 20 líneas; acá se
 * responde con la única línea que hay que correr.
 */
// Chromium ya instalado fuera de la revisión que pide el paquete. En la nube de Claude Code
// viene en /opt/pw-browsers/chromium (revisión 1194) y playwright 1.62 busca la 1234: sin este
// respaldo las tarjetas morían con "Executable doesn't exist" (medido 2026-10-01, carril Lucía).
const CHROMIUM_FALLBACKS = [process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE, "/opt/pw-browsers/chromium"]
  .filter((p) => p && existsSync(p));

export async function launchChromium(script, chromium, opts) {
  try {
    return await chromium.launch(opts);
  } catch (err) {
    if (/Executable doesn't exist/i.test(String(err?.message)) && CHROMIUM_FALLBACKS.length && !opts?.executablePath) {
      return await chromium.launch({ ...opts, executablePath: CHROMIUM_FALLBACKS[0] });
    }
    if (/Executable doesn't exist/i.test(String(err?.message))) {
      console.error(
        `${script}: playwright está instalado pero le falta el binario de chromium.\n` +
          `  Descargalo:  npx playwright install chromium`,
      );
      process.exit(1);
    }
    throw err;
  }
}
