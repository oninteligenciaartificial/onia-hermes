/**
 * GATE DEL PESO — el First Load JS de la ruta raíz contra su presupuesto.
 *
 * Por qué existe: esta es la web de una ferretería de barrio en Bolivia. La abre
 * un cliente con datos móviles, no con fibra. El presupuesto son 150 kB y el
 * 2026-09-03, medido sobre el bundle de producción, la home pesaba **192 kB**
 * porque `gsap` + `ScrollTrigger` entraban al bundle inicial por un `import`
 * estático, aunque su único uso vive dentro de un `useEffect` que corre después
 * de montar (y que ni siquiera se ejecuta con reduced-motion).
 *
 * Mide con el MISMO instrumento que la definición de hecho: la tabla que imprime
 * `next build`. No estima gzipeando chunks a mano — eso es otro número y da la
 * razón por el lado equivocado.
 *
 * Uso:  node scripts/gate-peso.mjs
 *       PRESUPUESTO_KB=150 node scripts/gate-peso.mjs
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PRESUPUESTO_KB = Number(process.env.PRESUPUESTO_KB || 150);
const RUTA = "/";

// `next build` colorea si detecta TTY; al capturarlo no debería, pero se limpia
// igual para que un cambio de entorno no rompa el parseo en silencio.
const ANSI = /\[[0-9;]*m/g;

function aKb(valor, unidad) {
  const n = Number(valor);
  if (unidad === "B") return n / 1024;
  if (unidad === "MB") return n * 1024;
  return n;
}

const build = spawnSync("npx", ["next", "build"], {
  cwd: APP,
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
});

if (build.status !== 0) {
  console.error("✗ El build falló: no hay peso que medir.\n");
  console.error((build.stdout || "") + (build.stderr || ""));
  process.exit(2);
}

const salida = ((build.stdout || "") + (build.stderr || "")).replace(ANSI, "");

// Fila de la tabla de rutas:  ┌ ○ /            89.9 kB         192 kB
const FILA = /^[┌├└│\s]*[○ƒλ●ℇ]\s+(\S+)\s+[\d.]+\s*(?:B|kB|MB)\s+([\d.]+)\s*(B|kB|MB)\s*$/;

const rutas = new Map();
for (const linea of salida.split("\n")) {
  const m = FILA.exec(linea.trimEnd());
  if (m) rutas.set(m[1], aKb(m[2], m[3]));
}

if (!rutas.has(RUTA)) {
  console.error(
    `✗ No encontré la fila de ${RUTA} en la tabla de \`next build\`.\n` +
      "  El gate no puede decir verde sin haber medido: si Next cambió el formato\n" +
      "  de la tabla, hay que arreglar el parseo, no ignorar el fallo.\n" +
      `  Rutas parseadas: ${[...rutas.keys()].join(", ") || "(ninguna)"}`,
  );
  process.exit(2);
}

const peso = rutas.get(RUTA);
const ok = peso <= PRESUPUESTO_KB;

console.log(`${ok ? "✓" : "✗"} ${RUTA} — First Load JS ${peso} kB / ${PRESUPUESTO_KB} kB`);
for (const [ruta, kb] of rutas) if (ruta !== RUTA) console.log(`  · ${ruta} — ${kb} kB`);

if (!ok) {
  console.error(
    `\n✗ La home se pasa por ${(peso - PRESUPUESTO_KB).toFixed(1)} kB.\n` +
      "  Lo primero a mirar: una librería de animación importada estáticamente y\n" +
      "  usada sólo dentro de un efecto. Va con import() dinámico, no se borra.",
  );
  process.exit(1);
}
