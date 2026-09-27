/**
 * ¿Todo el que le pide un veredicto a `deploy-vivo.mjs` mide TODAS las estaciones
 * que ese veredicto exige?
 *
 * NACE DE UN CASO, el 2026-09-27, y lo causó un merge de este mismo carril.
 * `deploy-vivo.mjs` ganó una tercera estación (`sinMergear`: qué tiene la rama del
 * carril que `main` todavía no) que falla CERRADA a propósito — `undefined` es la
 * ausencia de dato, no «no hay ninguno». El diseño es correcto. Lo que no se tocó en
 * el mismo commit fue el otro llamador: `hermes-content/deploy/onia-landing/publicar.sh`
 * seguía preguntando con tres estaciones, así que el publicador de la landing —el que
 * corre el cron cada 3 h y el que ejecuta un `ok`— empezó a contestar
 * `ERR: no se pudo medir … NO publico a ciegas` y **onia.com.bo dejó de publicarse sola**.
 *
 * POR QUÉ NO LO VIO NADIE, que es la parte que este gate arregla:
 *   - `test:publicadores` compara la fuente contra `/opt`: los dos lados eran
 *     idénticos, porque el que cambió fue el MÓDULO que el publicador importa.
 *   - la cadena no corre `publicar.sh --dry-run` (necesita el VPS: sería un rojo
 *     ambiental), así que el único testigo era una línea en el log de un cron.
 *   - `npm test` quedó **verde** con la landing frenada.
 *
 * Endurecer un contrato sin barrer a sus consumidores es la misma clase de fallo que
 * `CLAUDE.md` nombra para las promesas: se arregla donde saltó y los hermanos que
 * llaman a lo mismo quedan rotos. Acá el barrido se hace solo.
 *
 * LOS SUJETOS SE DERIVAN DEL DISCO, nunca de una lista escrita: un llamador nuevo
 * nace cubierto, y una estación nueva en la firma pone rojo a todos los que no la
 * midan. Por eso el gate no sabe que existe `sinMergear` — lo aprende leyendo la
 * firma de `diagnosticar()`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const MODULO = "web-factory/apps/onia-platform/scripts/deploy-vivo.mjs";

/** Las carpetas donde puede vivir un llamador. Amplias a propósito: acotar de más es cómo se escapó éste. */
const DONDE_BUSCAR = ["hermes-content/deploy", "web-factory/apps/onia-platform/scripts", "scripts"];

/**
 * Las claves que `diagnosticar()` exige, leídas de su propia firma.
 * Se lee el destructuring del parámetro: `export function diagnosticar({ a, b, c })`.
 */
export function estacionesDeLaFirma(fuente) {
  const m = fuente.match(/export function diagnosticar\(\{([^}]*)\}/);
  if (!m) return null;
  return m[1]
    .split(",")
    .map((s) => s.trim().split(/[:=]/)[0].trim())
    .filter(Boolean);
}

/** Archivos de texto bajo `dir`, recursivo. */
function archivos(dir) {
  const salida = [];
  let entradas;
  try {
    entradas = readdirSync(dir, { withFileTypes: true });
  } catch {
    return salida;
  }
  for (const e of entradas) {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next" || e.name === ".git") continue;
      salida.push(...archivos(ruta));
    } else if (statSync(ruta).size < 2_000_000) {
      salida.push(ruta);
    }
  }
  return salida;
}

/**
 * Quién le pide el veredicto a ESTE módulo. Se exige que el archivo nombre a
 * `deploy-vivo.mjs` Y llame a `diagnosticar(`: hay otro `diagnosticar()` en el repo
 * (el del canal de WhatsApp) con otra firma, y confundirlos daría rojos falsos.
 */
export function llamadoresDe(fuentePorRuta, { modulo = MODULO } = {}) {
  const nombre = modulo.split("/").pop();
  return [...fuentePorRuta.entries()]
    .filter(([ruta]) => !ruta.endsWith(nombre)) // el módulo no se llama a sí mismo
    .filter(([ruta]) => !/\.test\.(mjs|ts|js)$/.test(ruta)) // un test PRUEBA las ramas: mide de menos a propósito
    .filter(([, texto]) => texto.includes(nombre) && /\bdiagnosticar\s*\(\s*\{/.test(texto))
    .map(([ruta]) => ruta);
}

/** Qué estaciones nombra ese llamador. */
export function estacionesQueMide(texto, estaciones) {
  return estaciones.filter((e) => new RegExp(`\\b${e}\\s*:`).test(texto));
}

test("todo llamador de deploy-vivo.mjs mide las estaciones que su veredicto exige", () => {
  const fuenteModulo = readFileSync(join(RAIZ, MODULO), "utf8");
  const estaciones = estacionesDeLaFirma(fuenteModulo);
  assert.ok(
    Array.isArray(estaciones) && estaciones.length >= 3,
    `no pude leer la firma de diagnosticar() en ${MODULO}: sin eso no sé qué exigir, y un gate que no sabe qué mide es peor que ninguno`,
  );

  const fuentePorRuta = new Map();
  for (const dir of DONDE_BUSCAR) {
    for (const ruta of archivos(join(RAIZ, dir))) {
      try {
        fuentePorRuta.set(relative(RAIZ, ruta), readFileSync(ruta, "utf8"));
      } catch {
        /* binario o ilegible: no es un llamador */
      }
    }
  }

  const llamadores = llamadoresDe(fuentePorRuta);
  assert.ok(
    llamadores.length > 0,
    "no encontré NINGÚN llamador de deploy-vivo.mjs: o se renombró el módulo o el barrido quedó ciego — en los dos casos este gate dejó de medir",
  );

  const cortos = llamadores
    .map((ruta) => {
      const mide = estacionesQueMide(fuentePorRuta.get(ruta), estaciones);
      return { ruta, falta: estaciones.filter((e) => !mide.includes(e)) };
    })
    .filter((x) => x.falta.length > 0);

  assert.deepEqual(
    cortos.map((c) => `${c.ruta} no mide: ${c.falta.join(", ")}`),
    [],
    `un llamador le pide el veredicto a ${MODULO} sin medir todas sus estaciones.` +
      ` diagnosticar() falla CERRADA, así que no da un veredicto flojo: da NO_PUDE_MEDIR,` +
      ` y un publicador que no puede medir NO publica. Estaciones que exige la firma de hoy:` +
      ` ${estaciones.join(", ")}.`,
  );
});

test("el gate se cae si la firma deja de ser legible, en vez de aprobar por vacío", () => {
  assert.equal(estacionesDeLaFirma("export function otraCosa({ a }) {}"), null);
  assert.deepEqual(estacionesDeLaFirma("export function diagnosticar({ a, b: x, c = 1 }) {}"), ["a", "b", "c"]);
});

test("un llamador que nombra el módulo pero no lo interroga no es sujeto", () => {
  const soloLoMenciona = new Map([["hermes-content/deploy/x/leeme.md", "ver deploy-vivo.mjs para el detalle"]]);
  assert.deepEqual(llamadoresDe(soloLoMenciona), []);

  const loInterroga = new Map([["hermes-content/deploy/x/publicar.sh", "import deploy-vivo.mjs\n m.diagnosticar({ a: 1 })"]]);
  assert.deepEqual(llamadoresDe(loInterroga), ["hermes-content/deploy/x/publicar.sh"]);
});

test("mide por clave nombrada, no por aparición del texto", () => {
  // `sinMergear` en un comentario no es medirlo: la clave tiene que estar pasada.
  const enComentario = "# ojo con sinMergear\n m.diagnosticar({ commits: c })";
  assert.deepEqual(estacionesQueMide(enComentario, ["commits", "sinMergear"]), ["commits"]);
});
