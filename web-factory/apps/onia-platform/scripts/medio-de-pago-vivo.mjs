#!/usr/bin/env node
/**
 * El medio de pago que el sitio PROMETE, cruzado contra el que producción PUEDE.
 *
 * POR QUE EXISTE. El 2026-09-11 `onia.com.bo` le prometia al lead pagar su plan
 * "por QR" en tres superficies vivas, y no existe ningun QR: el contenedor no
 * tiene una sola credencial del banco, asi que `isBcpQrConfigured()` es false y
 * el checkout, dos clics despues, manda a pedir los datos por WhatsApp. La web y
 * el producto se contradecian y la que miente llega PRIMERO.
 *
 * QUE NO ALCANZA, y por eso este cruce existe ademas del gate. El gate puro
 * (`src/content/medio-de-pago.test.ts`) verifica que ninguna superficie tipee el
 * medio a mano y que la fuente siga a la constante `QR_PARA_PAGARLE_A_ONIA`.
 * Eso vigila la COHERENCIA del sitio consigo mismo — y no puede saber si la
 * constante dice la verdad. Peor: el dia que alguien la ponga en `true`, el gate
 * deja de vigilar las superficies (ahi prometer QR seria correcto), asi que una
 * constante que se despegue de produccion apaga al gate en silencio. Este script
 * es lo unico que ata la constante a la realidad.
 *
 * NO se cablea en `prebuild` ni en la cadena `npm test`: necesita salir a
 * produccion, igual que `rubros-vivos.mjs`, `enlaces-vivos.mjs` y
 * `precios-vivos.mjs`. Colgarlo del build ata el deploy a que el VPS conteste, y
 * meterlo en la cadena pone rojo por AMBIENTE, lo que traba el merge de los
 * quince carriles. Se corre cada vuelta: `npm run medio-de-pago:vivo`.
 *
 * COMO NO FALLA EN VERDE, que es como muere esta familia. Si no se puede
 * preguntar —sin docker, sin SSH, el contenedor caido— la respuesta NO es
 * "entonces no hay QR" (que coincide con la constante de hoy y daria verde por
 * casualidad, sobre una medicion que nunca ocurrio). Sale NO PUDE MEDIR con
 * exit 2. El unico verde posible es haber leido el entorno del proceso vivo.
 *
 * Uso:
 *   node scripts/medio-de-pago-vivo.mjs        # cruza contra produccion
 *   node scripts/medio-de-pago-vivo.mjs --self-check   # prueba su propia logica
 *
 * Salida: 0 = coinciden · 1 = el sitio promete lo que produccion no tiene · 2 = no pude medir
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const COINCIDEN = 0;
const DESALINEADO = 1;
const NO_PUDE_MEDIR = 2;

const AQUI = dirname(fileURLToPath(import.meta.url));
const FUENTE = join(AQUI, "..", "src", "content", "medio-de-pago.ts");
const CONTENEDOR = "onia-platform";

/**
 * Lo que el SITIO declara. Se lee del texto del modulo y no con un `import`
 * porque este script corre con node pelado, sin el resolvedor de `@/`.
 *
 * Devuelve `null` cuando no se puede leer o la constante cambio de forma: eso
 * es NO PUDE MEDIR, nunca `false`. Un parseo que falla y se aplana a "no hay QR"
 * coincide con el valor de hoy y firmaria verde sin haber leido nada.
 */
export function loQuePrometeElSitio(texto) {
  const m = /export const QR_PARA_PAGARLE_A_ONIA\s*=\s*(true|false)\s*;/.exec(texto);
  return m ? m[1] === "true" : null;
}

/**
 * Lo que PRODUCCION puede: ¿el contenedor tiene credenciales del banco?
 *
 * Se le pregunta al entorno del PROCESO vivo, no a un `.env` del disco: ya nos
 * mordio que una variable estuviera en el archivo y no llegara al contenedor
 * (el lanzador con lista blanca de `-e`). `docker` anda tambien desde el nodo de
 * casa, donde es un shim que delega por SSH en el VPS.
 */
export function loQuePuedeProduccion(ejecutar = spawnSync) {
  const r = ejecutar("docker", ["exec", CONTENEDOR, "env"], {
    encoding: "utf8",
    timeout: 30_000,
  });
  if (!r || r.status !== 0 || typeof r.stdout !== "string") return null;
  const lineas = r.stdout.split("\n");
  // Un `env` sano trae decenas de variables. Una salida vacia o de dos lineas
  // es el contenedor contestando mal, no un contenedor sin credenciales.
  if (lineas.filter((l) => l.includes("=")).length < 5) return null;
  return lineas.some((l) => /^BCP_QR_/.test(l));
}

function selfCheck() {
  const fallos = [];
  const ok = (cond, que) => {
    if (!cond) fallos.push(que);
  };

  ok(loQuePrometeElSitio("export const QR_PARA_PAGARLE_A_ONIA = false;") === false, "lee false");
  ok(loQuePrometeElSitio("export const QR_PARA_PAGARLE_A_ONIA = true;") === true, "lee true");
  ok(loQuePrometeElSitio("export const OTRA_COSA = false;") === null, "constante ausente -> null");
  ok(
    loQuePrometeElSitio("export const QR_PARA_PAGARLE_A_ONIA = leerFlag();") === null,
    "la constante cambio de forma -> null, NO false",
  );

  const env = (salida, status = 0) => () => ({ status, stdout: salida });
  const muchas = Array.from({ length: 20 }, (_, i) => `VAR_${i}=x`).join("\n");
  ok(loQuePuedeProduccion(env(muchas)) === false, "env sin BCP_QR_ -> false");
  ok(loQuePuedeProduccion(env(`${muchas}\nBCP_QR_ID=abc`)) === true, "env con BCP_QR_ -> true");
  ok(loQuePuedeProduccion(env("", 1)) === null, "docker falla -> null");
  ok(
    loQuePuedeProduccion(env("HOME=/root\nPATH=/bin")) === null,
    "env sospechosamente corto -> null, NO false",
  );
  ok(loQuePuedeProduccion(() => null) === null, "sin docker -> null");

  if (fallos.length) {
    console.error(`SELF-CHECK ROJO:\n  - ${fallos.join("\n  - ")}`);
    process.exit(DESALINEADO);
  }
  console.log("SELF-CHECK VERDE: 9 casos.");
  process.exit(COINCIDEN);
}

function main() {
  if (process.argv.includes("--self-check")) return selfCheck();

  let texto;
  try {
    texto = readFileSync(FUENTE, "utf8");
  } catch {
    console.error(`NO PUDE MEDIR: no pude leer ${FUENTE}.`);
    process.exit(NO_PUDE_MEDIR);
  }

  const promete = loQuePrometeElSitio(texto);
  if (promete === null) {
    console.error(
      "NO PUDE MEDIR: QR_PARA_PAGARLE_A_ONIA no esta o cambio de forma en " +
        `${FUENTE}. El cruce quedo ciego; no se asume que no hay QR.`,
    );
    process.exit(NO_PUDE_MEDIR);
  }

  const puede = loQuePuedeProduccion();
  if (puede === null) {
    console.error(
      `NO PUDE MEDIR: no pude leer el entorno del contenedor "${CONTENEDOR}". ` +
        "Sin eso NO se concluye que no hay QR: verde exige haber preguntado.\n" +
        `  Se ve con: docker exec ${CONTENEDOR} env | grep -c '^BCP_QR_'`,
    );
    process.exit(NO_PUDE_MEDIR);
  }

  if (promete === puede) {
    console.log(
      `VERDE: el sitio y produccion dicen lo mismo — QR ${puede ? "disponible" : "no disponible"}. ` +
        `El lead lee el medio de pago que se va a encontrar en el checkout.`,
    );
    process.exit(COINCIDEN);
  }

  if (promete && !puede) {
    console.error(
      "ROJO: el sitio promete pagar por QR y produccion NO tiene ninguno.\n" +
        `  El lead lee "pagas por QR" y el checkout le pide los datos por WhatsApp: ` +
        "la web y el producto se contradicen, y la que miente llega PRIMERO.\n" +
        `  Se cierra poniendo QR_PARA_PAGARLE_A_ONIA = false en ${FUENTE}.`,
    );
  } else {
    console.error(
      "ROJO: produccion YA puede cobrar por QR y el sitio sigue diciendo transferencia.\n" +
        "  Es la direccion que ningun barrido de textos prohibidos ve: no sobra una palabra, FALTA — " +
        "le estamos dando al lead un camino mas lento que el que el producto ya tiene.\n" +
        `  Se cierra poniendo QR_PARA_PAGARLE_A_ONIA = true en ${FUENTE}.`,
    );
  }
  process.exit(DESALINEADO);
}

// La guarda no es ceremonia: este modulo EXPORTA sus dos lectores para que un
// test pueda probarlos, y sin ella un `import` dispararia el `docker exec` contra
// produccion y un `process.exit()` que mata al proceso importador antes de su
// primera linea. Ya paso en este repo (`demo_agendada_real.mjs`, 2026-09-03).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
