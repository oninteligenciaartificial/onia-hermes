#!/usr/bin/env node
// ¿El alta sigue exigiendo confirmar el correo? — el espejo contra producción.
//
// POR QUE EXISTE. `puesta-en-marcha.test.ts` obliga a que toda enumeración que
// vaya del alta al uso del sistema nombre el paso de confirmar el correo. Esa
// obligación NO es una verdad eterna: vale mientras producción lo exija, y sale
// de `ALTA_CONFIRMA_CORREO`, que es un ESPEJO escrito a mano en `(sitio)/alta.ts`.
// Un espejo que nadie compara contra la fuente es una creencia con fecha: el
// mismo archivo ya se quedó atrás una vez (el alta se reabrió el 29-ago y el
// sitio siguió pidiendo permiso trece días).
//
// LO QUE MÁS IMPORTA ACÁ: la respuesta NO sale de una variable sino de DOS, y el
// propio producto lo advierte en `lib/registration.ts` — «el flip de la app no
// alcanza solo: GoTrue tiene GOTRUE_MAILER_AUTOCONFIRM=true y autoconfirma
// cualquier signUp». Preguntarle a una sola capa da la respuesta contraria a la
// verdad en el caso más fácil de producir: alguien enciende el flag de la app,
// GoTrue sigue autoconfirmando, y el sitio empieza a mandar a confirmar un
// correo que ya está confirmado.
//
// Vive APARTE de la cadena `npm test` a propósito: necesita los contenedores de
// producción, y un gate que depende de estado externo pone rojo por AMBIENTE en
// cualquier worktree que no los alcance — y ese rojo traba el merge de los
// quince carriles. Sale 2 = NO MEDIDO cuando no puede preguntar, nunca verde.
//
// Uso:  npm run alta:confirma-vivo
//       npm run alta:confirma-vivo -- --self-check   (puro, no toca producción)
//
// Códigos: 0 = el espejo coincide con producción
//          1 = DIFIEREN (hay que mover ALTA_CONFIRMA_CORREO y barrer el copy)
//          2 = NO MEDIDO

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const ESPEJO = join(AQUI, "..", "src", "app", "(sitio)", "alta.ts");

/** La app: `si` exacto enciende la confirmación (`lib/registration.ts` del producto). */
const VAR_APP = "ONIA_REGISTRO_CONFIRMA_CORREO";
/** GoTrue: si autoconfirma, lo de arriba no sirve para nada. */
const VAR_GOTRUE = "GOTRUE_MAILER_AUTOCONFIRM";

const CONTENEDOR_APP = "onia-platform";
const CONTENEDOR_AUTH = "supabase-auth2";

/**
 * Lee una variable de una lista de `env`.
 *
 * Devuelve `null` si NO está declarada — y eso no es lo mismo que estar en
 * `false`. Aplanar los dos a un booleano es como esta familia de chequeos falla:
 * «no sé» se vuelve «me contestaron que no», y el veredicto se invierte sin que
 * nada avise.
 */
export function valorDe(lineas, variable) {
  const prefijo = `${variable}=`;
  for (const linea of lineas ?? []) {
    if (linea.startsWith(prefijo)) return linea.slice(prefijo.length).trim();
  }
  return null;
}

/**
 * ¿El producto exige confirmar? Las DOS capas, o no se sabe.
 *
 * `null` = no se pudo decidir. Si GoTrue autoconfirma, la respuesta es `false`
 * aunque la app diga que sí: quien manda al final es el que emite la sesión.
 */
export function produccionExigeConfirmar(envApp, envAuth) {
  const app = valorDe(envApp, VAR_APP);
  const gotrue = valorDe(envAuth, VAR_GOTRUE);
  if (app === null || gotrue === null) return null;
  if (app !== "si") return false;
  return gotrue !== "true";
}

/** El espejo del sitio, leído del fuente. `null` = no lo pude leer. */
export function espejoDelSitio(fuente) {
  const m = /export const ALTA_CONFIRMA_CORREO\s*=\s*(true|false)\s*;/.exec(fuente ?? "");
  return m ? m[1] === "true" : null;
}

function envDelContenedor(nombre) {
  try {
    return execFileSync("docker", ["exec", nombre, "env"], {
      encoding: "utf8",
      timeout: 15000,
      stdio: ["ignore", "pipe", "ignore"],
    }).split("\n");
  } catch {
    return null;
  }
}

function selfCheck() {
  const casos = [
    [[["X=1", `${VAR_APP}=si`], [`${VAR_GOTRUE}=false`]], true, "las dos capas de acuerdo: exige"],
    [
      [[`${VAR_APP}=si`], [`${VAR_GOTRUE}=true`]],
      false,
      "GoTrue autoconfirma: el flip de la app NO alcanza (lo que advierte el producto)",
    ],
    [[[`${VAR_APP}=no`], [`${VAR_GOTRUE}=false`]], false, "la app no lo pide"],
    [[[`${VAR_APP}=si`], []], null, "sin la capa de GoTrue NO se sabe, no es 'no'"],
    [[[], [`${VAR_GOTRUE}=false`]], null, "sin la capa de la app tampoco"],
    [[null, null], null, "no pude preguntar a ninguna"],
  ];
  let malos = 0;
  for (const [[app, auth], esperado, porque] of casos) {
    const dio = produccionExigeConfirmar(app, auth);
    if (dio !== esperado) {
      console.error(`FAIL  ${porque}: esperaba ${esperado} y dio ${dio}`);
      malos += 1;
    }
  }
  // El lector del espejo, en las dos direcciones y con el caso que no se puede leer.
  const espejos = [
    ["export const ALTA_CONFIRMA_CORREO = true;", true],
    ["export const ALTA_CONFIRMA_CORREO = false;", false],
    ["export const OTRA_COSA = true;", null],
  ];
  for (const [fuente, esperado] of espejos) {
    const dio = espejoDelSitio(fuente);
    if (dio !== esperado) {
      console.error(`FAIL  espejo ${JSON.stringify(fuente)}: esperaba ${esperado} y dio ${dio}`);
      malos += 1;
    }
  }
  if (malos) {
    console.error(`\n${malos} caso(s) en rojo.`);
    return 1;
  }
  console.log(`OK  ${casos.length + espejos.length} casos del chequeo puro.`);
  return 0;
}

function main(argv) {
  if (argv.includes("--self-check")) return selfCheck();

  let fuente = null;
  try {
    fuente = readFileSync(ESPEJO, "utf8");
  } catch {
    /* se reporta abajo */
  }
  const espejo = espejoDelSitio(fuente);
  const real = produccionExigeConfirmar(
    envDelContenedor(CONTENEDOR_APP),
    envDelContenedor(CONTENEDOR_AUTH),
  );

  if (espejo === null) {
    console.error(`NO MEDIDO — no pude leer ALTA_CONFIRMA_CORREO en ${ESPEJO}`);
    return 2;
  }
  if (real === null) {
    console.error(
      `NO MEDIDO — no pude preguntarle a producción por las DOS capas.\n` +
        `  docker exec ${CONTENEDOR_APP} env | grep ${VAR_APP}\n` +
        `  docker exec ${CONTENEDOR_AUTH} env | grep ${VAR_GOTRUE}\n` +
        `Con una sola no alcanza: si GoTrue autoconfirma, el flag de la app no enciende nada.`,
    );
    return 2;
  }
  if (real !== espejo) {
    console.error(
      `DIFIEREN — producción ${real ? "SÍ" : "NO"} exige confirmar el correo y el sitio ` +
        `dice que ${espejo}.\n` +
        `Mové ALTA_CONFIRMA_CORREO a ${real} en src/app/(sitio)/alta.ts: el guard de\n` +
        `puesta-en-marcha.test.ts se invierte solo y te va a nombrar el copy a barrer.`,
    );
    return 1;
  }
  console.log(
    `VERDE: producción y el sitio coinciden — el alta ${real ? "exige" : "no exige"} ` +
      `confirmar el correo, y el copy de la puesta en marcha está del lado que corresponde.`,
  );
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main(process.argv.slice(2)));
}
