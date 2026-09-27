#!/usr/bin/env node
/**
 * El ÚNICO formulario de captura del sitio, probado hasta el otro lado.
 *
 * POR QUE EXISTE. `CapturaGuia.tsx` (la hoja del SIAT, el imán de leads de
 * `/guia-facturacion`) postea a `/api/agenda-intake`, que reenvía a Onia Center
 * por la red interna del VPS. El diseño es best-effort A PROPOSITO: si el
 * pipeline se cae, la persona igual se lleva la hoja y la pantalla NO le promete
 * seguimiento. Eso es correcto para ella — y es exactamente lo que vuelve al
 * fallo INVISIBLE para nosotros:
 *
 *   · la pantalla dice "Listo. La hoja es tuya" en los dos casos;
 *   · el `catch` del componente se traga el error de red sin una línea;
 *   · `enlaces-vivos` sigue verde: `/guia-facturacion` responde 200;
 *   · `precios-vivos` sigue verde: los montos no se movieron.
 *
 * O sea: los gates de este carril miden que la puerta ABRA. Ninguno medía que el
 * lead LLEGUE del otro lado. El día que el intake se caiga, Sergio Urcullo deja
 * de recibir leads y nada se pone rojo — a días del plazo del SIAT, que es
 * justamente cuando esa página trabaja.
 *
 * Es el patrón que ya costó caro en el bot: un test que mira el PRIMER paso no
 * ve un sistema que muere en el SEGUNDO.
 *
 * QUE MIDE, y por qué en tres eslabones separados. Un solo POST de punta a punta
 * no distingue "el handler no está desplegado" de "el destino no contesta", y
 * son arreglos en lugares opuestos:
 *
 *   1. HANDLER   — `POST /api/agenda-intake` con cuerpo inválido debe dar 202.
 *                  404 = la ruta no viajó al build vivo; 5xx = el handler tira.
 *   2. CONFIG    — el contenedor tiene `ONIA_CENTER_INTAKE_URL` y `_SECRET`.
 *                  Sin eso el handler ni lo intenta: 202 y lead a la basura.
 *   3. DESTINO   — desde adentro del contenedor, contra la URL interna:
 *                  secreto inválido -> 401 (vive y autentica)
 *                  secreto válido + cuerpo sin contacto -> 4xx (vive y valida)
 *
 * SIN ENSUCIAR, que es la razón de que el eslabón 3 se pruebe así. Cerrar el
 * circuito con datos reales crea un lead falso en `onia_center.leads` cada
 * vuelta. La pareja 401 + 422 verifica destino, auth y forma sin escribir una
 * fila: el 401 prueba que el secreto SE EXIGE, el 422 que el secreto REAL pasa
 * esa puerta y lo que frena después es la validación de campos.
 *
 * EL SECRETO NUNCA SALE. Se lee dentro del contenedor (`process.env`) y sólo
 * viaja como cabecera de ese fetch: no se imprime, no se pasa por argv y no
 * queda en el log del cron.
 *
 * NO se cablea en `prebuild` ni en la cadena `npm test`: sale a producción, como
 * `enlaces-vivos`, `precios-vivos` y `medio-de-pago-vivo`. En la cadena pondría
 * rojo por AMBIENTE y trabaría el merge de los quince carriles. Va como alias
 * suelto y se corre cada vuelta: `npm run intake:vivo`.
 *
 * COMO NO FALLA EN VERDE. Todo lo que no se pudo preguntar es `null`, y `null`
 * nunca se lee como respuesta: sale NO PUDE MEDIR con exit 2. Un `catch` que se
 * aplane a "no hay config" daría verde sobre una medición que nunca ocurrió, que
 * es como muere esta familia de gates. Y siempre IMPRIME qué midió: un gate que
 * sale 0 y mudo se archiva como verde sin haber mirado nada.
 *
 * Uso:
 *   node scripts/intake-vivo.mjs              # mide el circuito contra producción
 *   node scripts/intake-vivo.mjs --self-check # prueba su propia lógica, sin red
 *
 * Salida: 0 = el lead llega · 1 = el lead se pierde · 2 = no pude medir
 */

import { spawnSync } from "node:child_process";

const LLEGA = 0;
const SE_PIERDE = 1;
const NO_PUDE_MEDIR = 2;

const CONTENEDOR = "onia-landing";
const BASE = process.env.ONIA_SITIO_BASE ?? "https://onia.com.bo";
const RUTA = "/api/agenda-intake";
/** El handler responde 202 a todo lo que rechaza, y 204 sólo al lead registrado. */
const ACEPTADO = new Set([202, 204]);

/* ─────────────────────────── eslabón 1: el handler ────────────────────────── */

/**
 * Golpea el endpoint público con un cuerpo que el handler rechaza por forma.
 *
 * Devuelve el código, o `null` si no se pudo preguntar (sin red, DNS caído,
 * timeout). `null` NO es "el handler está roto": es "no medí".
 */
export async function golpearHandler(fetchImpl = fetch) {
  try {
    const r = await fetchImpl(`${BASE}${RUTA}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
      signal: AbortSignal.timeout(15_000),
    });
    return r.status;
  } catch {
    return null;
  }
}

/* ─────────────────────────── eslabón 2: la config ─────────────────────────── */

/**
 * Lee del entorno del PROCESO VIVO, no de un `.env` del disco: los lanzadores
 * con lista blanca de `-e` descartan variables nuevas en silencio, así que el
 * archivo puede declarar lo que el proceso no tiene.
 *
 * Devuelve `{url, tieneSecreto}` o `null` si no se pudo preguntar. Nunca
 * devuelve el secreto.
 */
export function leerConfig(ejecutar = spawnSync) {
  const r = ejecutar("docker", ["exec", CONTENEDOR, "env"], {
    encoding: "utf8",
    timeout: 30_000,
  });
  if (!r || r.status !== 0 || typeof r.stdout !== "string") return null;
  const url = /^ONIA_CENTER_INTAKE_URL=(.+)$/m.exec(r.stdout)?.[1]?.trim() ?? "";
  const tieneSecreto = /^ONIA_CENTER_INTAKE_SECRET=.+$/m.test(r.stdout);
  return { url, tieneSecreto };
}

/* ─────────────────────────── eslabón 3: el destino ────────────────────────── */

/**
 * Corre DENTRO del contenedor: la URL es interna a la red de Docker y no
 * resuelve desde afuera. Node siempre está ahí; `curl` no (medido: la imagen no
 * lo trae).
 *
 * Manda dos pedidos y devuelve `{conSecretoMalo, conSecretoBueno}` con los dos
 * códigos, o `null` si no se pudo preguntar. El script que corre adentro imprime
 * SOLO los dos números: el secreto no cruza el borde del contenedor.
 */
export function golpearDestino(ejecutar = spawnSync) {
  const adentro = `
    // Node >=20 corta cada intento de conexion a 250 ms: sin esto la sonda declara
    // muerto un destino vivo. Va inline porque esto corre DENTRO del contenedor por
    // \`node -e\`, donde red-que-parpadea.mjs no existe.
    require("node:net").setDefaultAutoSelectFamilyAttemptTimeout(2000);
    const u = process.env.ONIA_CENTER_INTAKE_URL, s = process.env.ONIA_CENTER_INTAKE_SECRET;
    if (!u || !s) { console.log("SIN-CONFIG"); process.exit(0); }
    const tocar = (secreto) => fetch(u, {
      method: "POST",
      headers: { "content-type": "application/json", "x-onia-intake-secret": secreto },
      body: JSON.stringify({ email: "", whatsapp: "", src: "gate-intake-vivo" }),
      signal: AbortSignal.timeout(8000),
    }).then((r) => r.status).catch(() => 0);
    Promise.all([tocar("no-es-el-secreto-gate-intake-vivo"), tocar(s)])
      .then(([malo, bueno]) => console.log(malo + " " + bueno));
  `;
  const r = ejecutar("docker", ["exec", CONTENEDOR, "node", "-e", adentro], {
    encoding: "utf8",
    timeout: 60_000,
  });
  if (!r || r.status !== 0 || typeof r.stdout !== "string") return null;
  const m = /^(\d+) (\d+)$/m.exec(r.stdout.trim());
  if (!m) return null;
  return { conSecretoMalo: Number(m[1]), conSecretoBueno: Number(m[2]) };
}

/* ───────────────────────────────── veredicto ──────────────────────────────── */

/**
 * Junta los tres eslabones. Separado de la E/S para que el self-check pueda
 * probar la lógica sin red y sin docker.
 *
 * `null` en cualquier eslabón => NO PUDE MEDIR, nunca un veredicto.
 */
export function veredicto({ handler, config, destino }) {
  if (handler === null) {
    return { codigo: NO_PUDE_MEDIR, motivo: `no pude llegar a ${BASE}${RUTA}` };
  }
  if (handler === 404) {
    return {
      codigo: SE_PIERDE,
      motivo: `el handler NO está en el build vivo (404 en ${RUTA}): todo lead del formulario se pierde`,
    };
  }
  if (!ACEPTADO.has(handler)) {
    return { codigo: SE_PIERDE, motivo: `el handler contestó ${handler} (esperaba 202 al rechazar por forma)` };
  }

  if (config === null) {
    return { codigo: NO_PUDE_MEDIR, motivo: `no pude leer el entorno de ${CONTENEDOR} (¿sin docker?)` };
  }
  if (!config.url || !config.tieneSecreto) {
    const falta = [!config.url && "ONIA_CENTER_INTAKE_URL", !config.tieneSecreto && "ONIA_CENTER_INTAKE_SECRET"]
      .filter(Boolean)
      .join(" y ");
    return {
      codigo: SE_PIERDE,
      motivo: `al contenedor le falta ${falta}: el handler contesta 202 y tira el lead sin intentarlo`,
    };
  }

  if (destino === null) {
    return { codigo: NO_PUDE_MEDIR, motivo: "no pude preguntarle al destino desde adentro del contenedor" };
  }
  const { conSecretoMalo, conSecretoBueno } = destino;
  if (conSecretoMalo === 0 || conSecretoBueno === 0) {
    return { codigo: SE_PIERDE, motivo: `Onia Center no contestó en 8s desde ${CONTENEDOR}: el lead se pierde` };
  }
  if (conSecretoMalo !== 401 && conSecretoMalo !== 403) {
    return {
      codigo: SE_PIERDE,
      motivo: `el destino aceptó un secreto INVÁLIDO (${conSecretoMalo}): cualquiera puede escribir en los leads`,
    };
  }
  if (conSecretoBueno >= 500) {
    return { codigo: SE_PIERDE, motivo: `el destino tira ${conSecretoBueno} con el secreto real: el lead se pierde` };
  }
  if (conSecretoBueno === 401 || conSecretoBueno === 403) {
    return {
      codigo: SE_PIERDE,
      motivo: `el secreto del contenedor NO es el que espera Onia Center (${conSecretoBueno}): todo lead rebota`,
    };
  }

  return {
    codigo: LLEGA,
    motivo: `handler 202 · config puesta · destino ${conSecretoMalo} con secreto malo y ${conSecretoBueno} con el bueno`,
  };
}

/* ─────────────────────────────── self-check ───────────────────────────────── */

function selfCheck() {
  let malas = 0;
  const ok = (cond, que) => {
    if (!cond) { console.error(`  ROJO  ${que}`); malas += 1; }
    else console.log(`  ok    ${que}`);
  };
  const sano = { handler: 202, config: { url: "http://x", tieneSecreto: true }, destino: { conSecretoMalo: 401, conSecretoBueno: 422 } };

  console.log("self-check de intake-vivo:");
  ok(veredicto(sano).codigo === LLEGA, "circuito sano -> el lead llega");
  ok(veredicto({ ...sano, handler: null }).codigo === NO_PUDE_MEDIR, "sin red -> NO PUDE MEDIR, no verde");
  ok(veredicto({ ...sano, config: null }).codigo === NO_PUDE_MEDIR, "sin docker -> NO PUDE MEDIR, no verde");
  ok(veredicto({ ...sano, destino: null }).codigo === NO_PUDE_MEDIR, "destino no preguntable -> NO PUDE MEDIR");
  ok(veredicto({ ...sano, handler: 404 }).codigo === SE_PIERDE, "handler ausente del build -> el lead se pierde");
  ok(veredicto({ ...sano, handler: 500 }).codigo === SE_PIERDE, "handler que tira -> el lead se pierde");
  ok(veredicto({ ...sano, config: { url: "", tieneSecreto: true } }).codigo === SE_PIERDE, "sin URL -> el lead se pierde");
  ok(veredicto({ ...sano, config: { url: "http://x", tieneSecreto: false } }).codigo === SE_PIERDE, "sin secreto -> el lead se pierde");
  ok(veredicto({ ...sano, destino: { conSecretoMalo: 401, conSecretoBueno: 0 } }).codigo === SE_PIERDE, "destino mudo -> el lead se pierde");
  ok(veredicto({ ...sano, destino: { conSecretoMalo: 204, conSecretoBueno: 204 } }).codigo === SE_PIERDE, "destino sin auth -> rojo");
  ok(veredicto({ ...sano, destino: { conSecretoMalo: 401, conSecretoBueno: 401 } }).codigo === SE_PIERDE, "secreto desalineado -> rojo");
  ok(veredicto({ ...sano, destino: { conSecretoMalo: 401, conSecretoBueno: 503 } }).codigo === SE_PIERDE, "destino 5xx -> rojo");
  ok(veredicto({ ...sano, handler: 204 }).codigo === LLEGA, "202 y 204 son los dos aceptables del handler");

  console.log(malas === 0 ? "\nVERDE: la lógica del gate se sostiene." : `\nROJO: ${malas} caso(s).`);
  process.exit(malas === 0 ? LLEGA : SE_PIERDE);
}

/* ──────────────────────────────── principal ───────────────────────────────── */

async function principal() {
  if (process.argv.includes("--self-check")) return selfCheck();

  const handler = await golpearHandler();
  const config = handler === null ? null : leerConfig();
  const destino = config && config.url && config.tieneSecreto ? golpearDestino() : null;

  // Siempre imprime QUE midió: un gate que sale 0 y mudo se lee como verde sin
  // haber mirado nada (medido en este carril el 2026-09-24 con `rutas:venta`).
  console.log(`circuito del formulario de captura — ${BASE}${RUTA} -> Onia Center`);
  console.log(`  1. handler público : ${handler === null ? "NO MEDIDO" : handler}`);
  console.log(
    `  2. config en ${CONTENEDOR} : ${
      config === null ? "NO MEDIDO" : `url=${config.url || "AUSENTE"} secreto=${config.tieneSecreto ? "puesto" : "AUSENTE"}`
    }`,
  );
  console.log(
    `  3. destino interno : ${
      destino === null
        ? "NO MEDIDO"
        : `${destino.conSecretoMalo} con secreto inválido · ${destino.conSecretoBueno} con el real`
    }`,
  );

  const { codigo, motivo } = veredicto({ handler, config, destino });
  if (codigo === LLEGA) console.log(`\nVERDE: el lead llega a Onia Center — ${motivo}`);
  else if (codigo === SE_PIERDE) console.error(`\nROJO: ${motivo}`);
  else console.error(`\nNO PUDE MEDIR: ${motivo}`);
  process.exit(codigo);
}

// Igual que sus hermanos: sólo corre como script. Un `import` no debe disparar
// los `docker exec` contra producción ni el `process.exit()` que mataría al
// proceso importador antes de su propio veredicto.
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  await principal();
}
