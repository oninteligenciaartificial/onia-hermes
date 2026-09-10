#!/usr/bin/env node
// ¿El alta puede BUSCAR los datos del negocio, o sólo leer el enlace que le pegan?
//
// POR QUE EXISTE. `capacidad-degradada.test.ts` prohíbe que la venta prometa
// que el sistema sale a buscar los datos del lead. Esa prohibición no es una
// verdad eterna: vale mientras producción no tenga el buscador encendido. Un
// gate escrito sobre un DATO tiene que anclar su valor a la fuente con
// respaldo, o cementa lo que encontró el día que se escribió — y entonces el
// día que alguien configure el buscador, el gate seguiría obligando a callar
// una capacidad viva.
//
// Esta medición vive APARTE de la cadena `npm test` a propósito: necesita el
// contenedor de producción, y un gate que depende de estado externo pone rojo
// por AMBIENTE en cualquier worktree que no lo alcance — y ese rojo traba el
// merge de los quince carriles. Sale 2 = NO MEDIDO cuando no puede preguntar,
// nunca verde.
//
// Uso:  npm run busqueda:viva            (mide producción)
//       npm run busqueda:viva -- --self-check   (puro, no toca producción)
//
// Códigos: 0 = el buscador NO está (la prohibición del gate está vigente)
//          1 = el buscador SÍ está  (revisar el gate: la promesa ya es cierta)
//          2 = NO MEDIDO

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

import { VPS_SSH } from "./deploy-vivo.mjs";

const CONTENEDOR = "onia-platform";
const APP_ENV = "/opt/onia-platform/app.env";

/** Sin `BatchMode` un SSH sin llave se cuelga pidiendo contraseña y el cron muere por timeout. */
const SSH_ARGS = ["-o", "BatchMode=yes", "-o", "ConnectTimeout=8", "-o", "StrictHostKeyChecking=accept-new"];

/** La variable de la que depende el paso (3) del motor de alta, `buscarNegocio()`. */
const VARIABLE = "SEARXNG_URL";

/**
 * Un valor cuenta como configurado sólo si además NO está vacío: `SEARXNG_URL=`
 * aparece en un `env` y no enciende nada. Sin este corte el chequeo diría que
 * sí en el caso exacto que dejaría al lead con el formulario vacío.
 */
export function estaConfigurada(lineas, variable = VARIABLE) {
  const prefijo = `${variable}=`;
  for (const linea of lineas) {
    if (!linea.startsWith(prefijo)) continue;
    if (linea.slice(prefijo.length).trim() !== "") return true;
  }
  return false;
}

function envDelContenedor() {
  try {
    return execFileSync("docker", ["exec", CONTENEDOR, "env"], {
      encoding: "utf8",
      timeout: 15000,
      stdio: ["ignore", "pipe", "ignore"],
    }).split("\n");
  } catch {
    return null;
  }
}

/**
 * El `app.env` del VPS, preguntado por SSH. `null` = no pude preguntar.
 *
 * NUNCA devuelve `[]` ni `[""]`: una respuesta vacía —el `cat` de un archivo que
 * no existe, un SSH que murió a mitad— se lee después como «el archivo está y no
 * tiene la variable», que es la respuesta contraria a la verdad. Tres estados o
 * ninguno.
 */
export function leerPorSsh(ruta = APP_ENV, destino = VPS_SSH, ejecutar = spawnSync) {
  const r = ejecutar("ssh", [...SSH_ARGS, destino, "cat", ruta], {
    encoding: "utf8",
    timeout: 15000,
  });
  if (!r || r.status !== 0 || typeof r.stdout !== "string" || r.stdout.trim() === "") return null;
  return r.stdout.split("\n");
}

/**
 * El `app.env`: disco local primero, y si no está, el VPS por SSH.
 *
 * POR QUÉ EL SSH. Este carril se mudó al nodo de casa el 2026-09-06, donde
 * `/opt/onia-platform` no existe. Desde entonces esta mitad devolvía `null` en
 * TODAS las corridas y la medición seguía —imprimiendo «no alcanzado», que nadie
 * lee— apoyada en una sola fuente. La mitad muerta es justo la que existe para
 * ver el desacuerdo que CLAUDE.md documenta: poner la variable en `app.env` y no
 * recrear el contenedor. Su hermano `deploy-vivo.mjs`, en esta misma carpeta,
 * aprendió lo mismo el 2026-09-04 y el arreglo no viajó hasta acá.
 */
function envDelArchivo() {
  if (existsSync(APP_ENV)) {
    try {
      return readFileSync(APP_ENV, "utf8").split("\n");
    } catch {
      return null;
    }
  }
  return leerPorSsh();
}

function selfCheck() {
  const casos = [
    [["SEARXNG_URL=http://searxng:8080"], true, "configurada"],
    [["SEARXNG_URL="], false, "declarada y VACIA no enciende nada"],
    [["SEARXNG_URL=   "], false, "sólo espacios tampoco"],
    [["OTRA=1", "NODE_ENV=production"], false, "ausente"],
    [["MI_SEARXNG_URL=http://x"], false, "otra variable que la contiene como sufijo"],
  ];
  let fallos = 0;
  for (const [lineas, esperado, porque] of casos) {
    const dio = estaConfigurada(lineas);
    if (dio !== esperado) {
      fallos += 1;
      console.error(`  ✗ ${porque}: esperaba ${esperado}, dio ${dio}`);
    }
  }
  // El lector del VPS: lo único que se le pide es no convertir «no pude
  // preguntar» en una respuesta. Un `[]` o un `[""]` acá se leería después como
  // «el archivo está y no tiene la variable» — la respuesta contraria a la
  // verdad, y en la dirección que deja la promesa viva sin vigilancia.
  const ssh = [
    [{ status: 255, stdout: "" }, "el SSH no entró"],
    [{ status: 1, stdout: "" }, "el archivo no existe en el VPS"],
    [{ status: 0, stdout: "" }, "contestó vacío"],
    [{ status: 0, stdout: "   \n" }, "contestó sólo espacios"],
    [null, "el ejecutor no devolvió nada"],
  ];
  for (const [respuesta, porque] of ssh) {
    const dio = leerPorSsh(APP_ENV, "destino-de-prueba", () => respuesta);
    if (dio !== null) {
      fallos += 1;
      console.error(`  ✗ ${porque}: esperaba null (no medido), dio ${JSON.stringify(dio)}`);
    }
  }
  // Y la dirección que falta: con una respuesta REAL tiene que leerla, o un
  // lector que siempre devuelve null pasaría los cinco de arriba.
  const leido = leerPorSsh(APP_ENV, "destino-de-prueba", () => ({
    status: 0,
    stdout: "NODE_ENV=production\nSEARXNG_URL=http://searxng:8080\n",
  }));
  if (!leido || !estaConfigurada(leido)) {
    fallos += 1;
    console.error(`  ✗ una respuesta real del VPS tiene que leerse: dio ${JSON.stringify(leido)}`);
  }

  // Las dos direcciones: sin el caso que DEBE dar true, un detector que siempre
  // devuelve false pasaría los otros cuatro y firmaría verde.
  console.log(fallos === 0 ? "self-check OK (11 casos, ambas direcciones)" : `self-check ROJO: ${fallos}`);
  return fallos === 0 ? 0 : 2;
}

function main() {
  if (process.argv.includes("--self-check")) return selfCheck();

  const enContenedor = envDelContenedor();
  const enArchivo = envDelArchivo();
  if (enContenedor === null && enArchivo === null) {
    console.log(`NO MEDIDO: no alcancé ni el contenedor ${CONTENEDOR} ni ${APP_ENV}.`);
    return 2;
  }

  const vivo = enContenedor !== null && estaConfigurada(enContenedor);
  const enDisco = enArchivo !== null && estaConfigurada(enArchivo);
  const donde = [
    `contenedor: ${enContenedor === null ? "no alcanzado" : vivo ? "SÍ" : "no"}`,
    `${APP_ENV}: ${enArchivo === null ? "no alcanzado" : enDisco ? "SÍ" : "no"}`,
  ].join(" · ");

  if (vivo || enDisco) {
    console.log(`${VARIABLE} ESTÁ configurada (${donde}).`);
    console.log(
      "El alta ya puede BUSCAR el negocio por nombre: la prohibición de " +
        "capacidad-degradada.test.ts venció y hay que revisarla antes de que " +
        "obligue a callar una capacidad viva.",
    );
    return 1;
  }

  console.log(`${VARIABLE} NO está configurada (${donde}).`);
  console.log(
    "El alta sólo puede LEER el enlace que la persona pega (traerHtml cae a " +
      "fetch nativo). Con sólo el nombre, buscarNegocio() devuelve [] y el " +
      "formulario queda vacío: la venta no puede prometer que lo busca.",
  );
  return 0;
}

process.exit(main());
