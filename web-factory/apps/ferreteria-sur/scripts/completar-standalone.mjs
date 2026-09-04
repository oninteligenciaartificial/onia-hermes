/**
 * COMPLETAR EL STANDALONE — `next build` NO copia `.next/static` ni `public/`
 * dentro de `.next/standalone`. Es un paso manual conocido de Next, y sin él
 * el árbol que queda es indeployable: sirve el HTML pero SIN CSS.
 *
 * Por qué existe, medido el 2026-09-04: `npm run gates` no podía correr entero.
 * `gate:peso` corre un `next build` para leer el First Load, ese build rehace
 * `.next/standalone` en limpio, y el `gate:pliegue` que va después moría con
 * "Falta .next/static". O sea que la cadena que protege la app **fallaba en el
 * medio**, y el fallo tenía cara de defecto del sitio en vez de del arnés.
 *
 * `deploy-web-cliente.sh` ya hacía esta copia al publicar (líneas 65-66), así
 * que el deploy nunca estuvo roto por esto — sólo la verificación local.
 *
 * Va como `postbuild` para que valga por cualquier camino: después de
 * `npm run build` el standalone queda listo para servir, sin pasos a mano.
 */
import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nombre = path.basename(APP);
const raiz = path.join(APP, ".next", "standalone", "apps", nombre);

if (!existsSync(path.join(raiz, "server.js"))) {
  console.error(`✗ No hay standalone en ${raiz}: ¿corrió \`next build\`?`);
  process.exit(1);
}

for (const [origen, destino] of [
  [path.join(APP, ".next", "static"), path.join(raiz, ".next", "static")],
  [path.join(APP, "public"), path.join(raiz, "public")],
]) {
  if (!existsSync(origen)) continue;
  rmSync(destino, { recursive: true, force: true }); // sin esto quedan sobras del build anterior
  cpSync(origen, destino, { recursive: true });
}

if (!existsSync(path.join(raiz, ".next", "static"))) {
  console.error("✗ El standalone quedó SIN .next/static: se serviría sin CSS.");
  process.exit(1);
}
console.log(`✓ standalone de ${nombre} completo (static + public copiados)`);
