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
import { readFileSync, readdirSync, statSync } from "node:fs";
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
