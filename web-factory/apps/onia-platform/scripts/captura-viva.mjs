#!/usr/bin/env node
// ¿El único formulario de captura del sitio ENTREGA los leads, o los tira?
//
// POR QUE EXISTE, y por que ningun instrumento del carril podia verlo.
// `/guia-facturacion` es la unica pantalla de onia.com.bo que pide un dato y se
// lo queda. Lo que captura viaja a `/api/agenda-intake` (proxy de esta app) y de
// ahi al intake de Onia Center por la red interna del VPS, con un secreto
// compartido. Esa cadena tiene tres formas de romperse en silencio:
//
//   · falta `ONIA_CENTER_INTAKE_URL` o `ONIA_CENTER_INTAKE_SECRET` en el
//     contenedor `onia-landing`;
//   · el secreto se rota de un lado y no del otro (el destino contesta 401);
//   · Onia Center deja de estar configurado (el destino contesta 503).
//
// En las tres, el proxy devuelve 202 y el lead se pierde. Y aca esta lo que
// hace a este agujero distinto de todos los demas del carril: el 2026-09-06 se
// arreglo la MENTIRA —la pantalla ya no promete seguimiento cuando el lead no
// quedo registrado (`seguimiento-prometido.test.ts`)— y ese arreglo, correcto,
// volvio la perdida INVISIBLE. Un 202 honesto no le llega a nadie: la persona
// se lleva su hoja, la pantalla no miente, y el correo se tiro a la basura sin
// una sola linea roja. La copia honesta es el techo de lo que un gate de TEXTO
// puede hacer; lo que falta es preguntarle a la cadena si entrega.
//
// Ninguno de los otros lo alcanza, y cada uno por un motivo correcto:
// `enlaces-vivos.mjs` recorre `href` (esto es un POST), `precios-fuente.mjs`
// cruza cifras, `mirar-primera-pantalla.mjs` mira la portada y `/empezar`, y
// `deploy-vivo.mjs` mide el build. La pagina responde 200 y se ve perfecta.
//
// LO QUE NO MIDE, y quien si lo mide. El CONTRATO —que la clave que el
// formulario manda (`email`) sea la que el intake lee— no se puede probar sin
// crear un lead de verdad, asi que no se prueba aca: lo cubre
// `scripts/verificar-guia-facturacion.mjs`, que corre contra el sitio levantado
// en local y compara el cuerpo que sale del formulario. Este gate cubre la otra
// mitad, la VIVA, que aquel no puede ver porque no habla con produccion.
//
// POR QUE NO ENSUCIA EL PIPELINE. Las dos sondas estan elegidas para que el
// intake las RECHACE por diseño: una manda un secreto invalido (tiene que dar
// 401, porque la autenticacion se evalua antes que nada) y la otra manda el
// secreto real con un cuerpo VACIO (tiene que dar 422 `missing_fields`, porque
// sin negocio ni nombre ni correo no hay lead que crear). Por eso se puede
// correr cada vuelta sin dejar basura en `onia_center.leads`. Si alguna vez
// devolvieran 2xx, eso mismo es el rojo: el intake habria dejado de validar.
//
// Y por que el 401 se EXIGE en vez de conformarse con «el destino contesta»: un
// intake que acepta cualquier secreto es un endpoint publico de escritura, que
// es peor que uno caido. Las dos sondas juntas dicen mas que cualquiera sola.
//
// Vive APARTE de la cadena `npm test` a proposito: necesita el contenedor de
// produccion, y un gate que depende de estado externo pone rojo por AMBIENTE en
// cualquier worktree que no lo alcance — y ese rojo traba el merge de los quince
// carriles. Sale 2 = NO MEDIDO cuando no puede preguntar, nunca verde.
//
// Uso:  npm run captura:viva                    (mide produccion)
//       npm run captura:viva -- --self-check    (puro, no toca produccion)
//
// Codigos: 0 = la captura entrega el lead
//          1 = los leads se estan perdiendo
//          2 = NO MEDIDO

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { estaConfigurada } from "./busqueda-alta-viva.mjs";

/** El contenedor que sirve onia.com.bo (NO es Vercel: lo dice CLAUDE.md). */
const CONTENEDOR = "onia-landing";

/** Las dos que `app/api/agenda-intake/route.ts` exige para no tirar el lead. */
export const VARIABLES = ["ONIA_CENTER_INTAKE_URL", "ONIA_CENTER_INTAKE_SECRET"];

/** Un secreto que no puede ser el bueno. Con esto el intake tiene que dar 401. */
const SECRETO_INVALIDO = "zz-sonda-captura-viva-no-es-el-secreto";

/**
 * El veredicto, PURO: de las tres observaciones a un codigo de salida.
 *
 * Separado del transporte porque es lo unico que se puede probar sin produccion
 * —y porque un gate cuyo juicio vive enredado con su `docker exec` no se puede
 * probar por mutacion, que es como en este repo se descubre que un guardia esta
 * hueco.
 *
 * `null` significa SIEMPRE «no pude preguntar», nunca «me contestaron que no».
 * Confundir esos dos es como esta familia de gates falla en verde.
 */
export function veredicto({ config, sinSecreto, conSecreto }) {
  if (config === null) {
    return {
      codigo: 2,
      titulo: `NO MEDIDO: no alcancé el contenedor ${CONTENEDOR}.`,
      detalle: "Sin leer su env no se puede saber si la captura entrega.",
    };
  }

  const faltan = VARIABLES.filter((v) => !config[v]);
  if (faltan.length > 0) {
    return {
      codigo: 1,
      titulo: `LEADS PERDIDOS: falta ${faltan.join(" y ")} en ${CONTENEDOR}.`,
      detalle:
        "El proxy corta antes de salir y devuelve 202: la persona se lleva la " +
        "hoja, la pantalla no le promete nada y el correo no queda en ningún lado.",
    };
  }

  if (sinSecreto === null || conSecreto === null) {
    return {
      codigo: 2,
      titulo: "NO MEDIDO: la configuración está, pero no pude sondear el destino.",
      detalle: "Un destino que no contesta a la sonda no es un destino sano: es uno sin medir.",
    };
  }

  if (sinSecreto !== 401) {
    return {
      codigo: 1,
      titulo: `INTAKE ABIERTO O AJENO: con un secreto inválido contestó ${sinSecreto}, no 401.`,
      detalle:
        "La autenticación se evalúa antes que nada, así que un secreto que no es " +
        "el bueno sólo puede dar 401. Cualquier otra cosa significa que del otro " +
        "lado no está el intake que el proxy cree, o que dejó de validar.",
    };
  }

  if (conSecreto.status === 401) {
    return {
      codigo: 1,
      titulo: "SECRETO ROTADO: el destino rechaza el secreto que tiene el contenedor.",
      detalle:
        "Cada lead capturado se pierde con la pantalla en verde. Los dos lados " +
        "usan ONIA_CENTER_INTAKE_SECRET y hoy no son el mismo valor.",
    };
  }

  if (conSecreto.status === 503) {
    return {
      codigo: 1,
      titulo: "ONIA CENTER NO CONFIGURADO: el intake contesta 503.",
      detalle:
        "El secreto es correcto y el endpoint está vivo, pero no tiene dónde " +
        "guardar: `isOniaCenterConfigured()` da false y el lead se pierde igual.",
    };
  }

  if (conSecreto.status !== 422) {
    return {
      codigo: 1,
      titulo: `CONTRATO CAMBIADO: con el cuerpo vacío contestó ${conSecreto.status}, no 422.`,
      detalle:
        "Un cuerpo sin negocio, sin nombre y sin correo tiene que caer en " +
        "`missing_fields`. Si contestó 2xx además acaba de crear un lead vacío: " +
        "revisar `onia_center.leads` antes de seguir.",
    };
  }

  return {
    codigo: 0,
    titulo: "VERDE: la captura entrega — configurada, el secreto es el bueno y el intake responde.",
    detalle:
      "Medido sin crear un lead: secreto inválido → 401, secreto real con cuerpo " +
      "vacío → 422 missing_fields.",
  };
}

/** El env del contenedor. `null` = no pude preguntar (nunca `[]`). */
function envDelContenedor(ejecutar = execFileSync) {
  try {
    const salida = ejecutar("docker", ["exec", CONTENEDOR, "env"], {
      encoding: "utf8",
      timeout: 20000,
      stdio: ["ignore", "pipe", "ignore"],
    });
    if (typeof salida !== "string" || salida.trim() === "") return null;
    return salida.split("\n");
  } catch {
    return null;
  }
}

/**
 * Las dos sondas, corridas DENTRO del contenedor.
 *
 * Tienen que correr ahi y no desde acá: la URL del intake es
 * `http://onia-center:3012/...`, un nombre que sólo resuelve en la red de
 * Docker. Preguntando desde afuera daría `ENOTFOUND` — que se leería como
 * «el destino está caído» sobre una cadena sana.
 */
function sondear(ejecutar = execFileSync) {
  const programa = `
    // Node >=20 corta cada intento de conexion a 250 ms: sin esto la sonda declara
    // muerto un destino vivo. Va inline porque este programa corre DENTRO del
    // contenedor por \`node -e\`, donde red-que-parpadea.mjs no existe.
    require("node:net").setDefaultAutoSelectFamilyAttemptTimeout(2000);
    const url = process.env.ONIA_CENTER_INTAKE_URL;
    const sec = process.env.ONIA_CENTER_INTAKE_SECRET;
    const pedir = async (secreto) => {
      try {
        const r = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json", "x-onia-intake-secret": secreto },
          body: "{}",
          signal: AbortSignal.timeout(8000),
        });
        return { status: r.status, cuerpo: (await r.text()).slice(0, 120) };
      } catch (e) { return null; }
    };
    (async () => {
      const invalido = await pedir(${JSON.stringify(SECRETO_INVALIDO)});
      const bueno = await pedir(sec);
      console.log(JSON.stringify({ invalido, bueno }));
    })();
  `;
  try {
    const salida = ejecutar("docker", ["exec", CONTENEDOR, "node", "-e", programa], {
      encoding: "utf8",
      timeout: 40000,
      stdio: ["ignore", "pipe", "ignore"],
    });
    const linea = String(salida).trim().split("\n").pop();
    const leido = JSON.parse(linea);
    return {
      sinSecreto: leido.invalido ? leido.invalido.status : null,
      conSecreto: leido.bueno ?? null,
    };
  } catch {
    return { sinSecreto: null, conSecreto: null };
  }
}

function selfCheck() {
  const ok422 = { status: 422, cuerpo: '{"error":"missing_fields"}' };
  const casos = [
    [{ config: null, sinSecreto: null, conSecreto: null }, 2, "sin env no se concluye"],
    [
      { config: { ONIA_CENTER_INTAKE_URL: true, ONIA_CENTER_INTAKE_SECRET: false }, sinSecreto: 401, conSecreto: ok422 },
      1,
      "falta el secreto: el proxy corta y el lead se pierde",
    ],
    [
      { config: { ONIA_CENTER_INTAKE_URL: false, ONIA_CENTER_INTAKE_SECRET: true }, sinSecreto: 401, conSecreto: ok422 },
      1,
      "falta la URL",
    ],
    [
      { config: { ONIA_CENTER_INTAKE_URL: true, ONIA_CENTER_INTAKE_SECRET: true }, sinSecreto: null, conSecreto: null },
      2,
      "configurada pero sin sondear: NO MEDIDO, no verde",
    ],
    [
      { config: { ONIA_CENTER_INTAKE_URL: true, ONIA_CENTER_INTAKE_SECRET: true }, sinSecreto: 204, conSecreto: ok422 },
      1,
      "acepta un secreto invalido: el intake quedo abierto",
    ],
    [
      { config: { ONIA_CENTER_INTAKE_URL: true, ONIA_CENTER_INTAKE_SECRET: true }, sinSecreto: 401, conSecreto: { status: 401, cuerpo: "" } },
      1,
      "secreto rotado",
    ],
    [
      { config: { ONIA_CENTER_INTAKE_URL: true, ONIA_CENTER_INTAKE_SECRET: true }, sinSecreto: 401, conSecreto: { status: 503, cuerpo: "" } },
      1,
      "Onia Center sin configurar",
    ],
    [
      { config: { ONIA_CENTER_INTAKE_URL: true, ONIA_CENTER_INTAKE_SECRET: true }, sinSecreto: 401, conSecreto: { status: 200, cuerpo: "" } },
      1,
      "acepto un cuerpo vacio: dejo de validar",
    ],
    /* El caso que YA cumple. Sin el, un detector que devolviera siempre 1
     * pasaria los siete de arriba y firmaria «gate sano» sobre una cadena que
     * nunca puede estar verde. */
    [
      { config: { ONIA_CENTER_INTAKE_URL: true, ONIA_CENTER_INTAKE_SECRET: true }, sinSecreto: 401, conSecreto: ok422 },
      0,
      "la cadena sana da VERDE",
    ],
  ];
  let fallos = 0;
  for (const [entrada, esperado, porque] of casos) {
    const dio = veredicto(entrada).codigo;
    if (dio !== esperado) {
      fallos += 1;
      console.error(`  ✗ ${porque}: esperaba ${esperado}, dio ${dio}`);
    }
  }
  console.log(
    fallos === 0
      ? `self-check OK (${casos.length} casos, incluido el que ya cumple)`
      : `self-check ROJO: ${fallos}`,
  );
  return fallos === 0 ? 0 : 2;
}

function main() {
  if (process.argv.includes("--self-check")) return selfCheck();

  const lineas = envDelContenedor();
  const config =
    lineas === null
      ? null
      : Object.fromEntries(VARIABLES.map((v) => [v, estaConfigurada(lineas, v)]));

  const { sinSecreto, conSecreto } =
    config && VARIABLES.every((v) => config[v])
      ? sondear()
      : { sinSecreto: null, conSecreto: null };

  const r = veredicto({ config, sinSecreto, conSecreto });

  if (config !== null) {
    console.log(
      `contenedor ${CONTENEDOR}: ` +
        VARIABLES.map((v) => `${v}=${config[v] ? "sí" : "NO"}`).join(" · "),
    );
  }
  if (sinSecreto !== null || conSecreto !== null) {
    console.log(
      `sondas (no crean lead): secreto inválido → ${sinSecreto} · ` +
        `secreto real, cuerpo vacío → ${conSecreto ? conSecreto.status : "sin respuesta"}` +
        (conSecreto?.cuerpo ? ` ${conSecreto.cuerpo}` : ""),
    );
  }
  console.log("");
  console.log(r.titulo);
  console.log(r.detalle);
  return r.codigo;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
