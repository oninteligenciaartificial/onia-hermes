#!/usr/bin/env node
// Gate del AVISO a Sergio — el ultimo eslabon del objetivo de este carril.
//
// El objetivo dice "cada demo agendada o handoff le llega a Sergio" y se medía contando
// lineas `[aviso]` en el log. Ese numero llevaba turnos en 0 y NO se podia interpretar:
// 0 porque el circuito esta roto, o 0 porque no hubo ni un handoff real. Un numero que
// no puede ponerse rojo no es una medida, es decoracion.
//
// Este gate separa las dos cosas. Mide el CIRCUITO (cuatro eslabones, cada uno contra
// produccion) y aparte cuenta los EVENTOS. Asi "0 avisos" se lee entero:
//
//   circuito=ok  eventos=0  -> verde. Nadie pidio un humano hoy.
//   circuito=roto eventos=0 -> rojo.  El proximo que lo pida se pierde.
//
// Los cuatro eslabones, y por que cada uno esta medido donde esta:
//
//  1. flagEncendido    — del ENTORNO DEL PROCESO VIVO, no del `.env`. `webhook.env` vive
//                        fuera de git y el lanzador pasa las variables por lista blanca:
//                        ponerla en el archivo NO la hace llegar (medido 2026-09-04).
//  2. credencialesOk   — `getMe` + `getChat` contra la API de Telegram. No manda nada.
//                        Un token vencido o un chat_id equivocado hace fallar TODO aviso
//                        futuro sin dejar rastro hasta el dia que hay alguien esperando.
//  3. motorEmiteNotify — el motor DESPLEGADO, ante un pedido de humano, tiene que emitir
//                        `notify_sergio`. Se maneja el engine real, no un mock.
//  4. textoAccionable  — el aviso tiene que nombrar la conversacion. Uno que no dice a
//                        quien contestarle no sirve (lo dice el propio aviso-telegram.mjs).
//
// Y si no puede medir —no hay `/opt/onia/bot`, el loop se mudo de maquina— el veredicto
// es `no_medido`, nunca `ok`. Esa es la direccion cara: un gate que firma "al dia" desde
// una maquina que no ve produccion apaga al unico instrumento que miraba el problema.
//
// Uso:  node avisos-vivo.mjs          (exit 0 verde · 1 rojo · 2 no se pudo medir)

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const BOT_DIR = "/opt/onia/bot";
export const CONTENEDOR = "onia-center";

// ---------------------------------------------------------------------------
// Nucleo puro — esto es lo que prueba el test, sin tocar produccion
// ---------------------------------------------------------------------------

/**
 * Cuenta los avisos del log por su resultado real. Sólo mira lineas `[aviso]`: el log del
 * webhook mezcla `[n8n]` y una linea por mensaje, y contar de mas inventa avisos.
 */
export function contarEventos(lineas = []) {
  const avisos = (Array.isArray(lineas) ? lineas : []).filter((l) => String(l).includes("[aviso]"));
  const conEstado = (estado) => avisos.filter((l) => new RegExp(`\\[aviso\\]\\s+${estado}\\b`).test(l)).length;
  return {
    total: avisos.length,
    enviados: conEstado("sent"),
    salteados: conEstado("skipped"),
    fallidos: conEstado("failed"),
  };
}

/**
 * El veredicto. `circuito` en null significa "no se pudo medir" y NO puede dar verde.
 */
export function diagnosticar({ circuito, eventos }) {
  const ev = eventos || contarEventos([]);
  if (!circuito) {
    return { veredicto: "no_medido", motivos: ["no se pudo medir el circuito contra produccion"], eventos: ev };
  }

  const motivos = [];
  for (const [eslabon, etiqueta] of [
    ["flagEncendido", "flagEncendido: el proceso vivo no tiene ONIA_BOT_TG_AVISO en true"],
    ["credencialesOk", "credencialesOk: el token o el chat de Telegram no responden"],
    ["motorEmiteNotify", "motorEmiteNotify: el motor no emite notify_sergio ante un pedido de humano"],
    ["textoAccionable", "textoAccionable: el aviso no nombra la conversacion a la que contestar"],
  ]) {
    if (!circuito[eslabon]) motivos.push(etiqueta);
  }

  // Un aviso que salio mal manda sobre cualquier chequeo de configuracion: es una persona
  // esperando que Sergio le escriba, y el circuito "bien configurado" no la atendio.
  if (ev.fallidos > 0) motivos.push(`${ev.fallidos} aviso(s) FALLIDO(s) en el log`);
  if (ev.salteados > 0) motivos.push(`${ev.salteados} aviso(s) SALTEADO(s) en el log`);

  return { veredicto: motivos.length ? "roto" : "ok", motivos, eventos: ev };
}

// ---------------------------------------------------------------------------
// Medicion contra produccion
// ---------------------------------------------------------------------------

function sh(cmd, args, timeout = 20000) {
  try {
    return execFileSync(cmd, args, { encoding: "utf8", timeout, stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
}

/** El entorno del PROCESO, que es lo unico que dice el estado real de un flag. */
function envDelProcesoVivo() {
  const ps = sh("docker", ["exec", CONTENEDOR, "sh", "-c", "ps -eo pid,args"]);
  if (!ps) return null;
  const linea = ps.split("\n").find((l) => l.includes("webhook-server") && !l.includes("grep"));
  const pid = linea?.trim().split(/\s+/)[0];
  if (!pid) return null;
  const environ = sh("docker", ["exec", CONTENEDOR, "sh", "-c", `tr '\\0' '\\n' < /proc/${pid}/environ`]);
  if (!environ) return null;
  const env = {};
  for (const l of environ.split("\n")) {
    const i = l.indexOf("=");
    if (i > 0) env[l.slice(0, i)] = l.slice(i + 1);
  }
  return env;
}

/** `getMe` + `getChat`. No manda un solo mensaje: no se le grita al lobo para probar el grito. */
async function credencialesResponden(token, chatId) {
  if (!token || !chatId) return false;
  const pedir = async (metodo, qs = "") => {
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/${metodo}${qs}`, {
        signal: AbortSignal.timeout(15000),
      });
      return (await r.json())?.ok === true;
    } catch {
      return false;
    }
  };
  return (await pedir("getMe")) && (await pedir("getChat", `?chat_id=${encodeURIComponent(chatId)}`));
}

/**
 * Maneja el motor DESPLEGADO hasta un handoff y arma el aviso con el `construirAviso`
 * desplegado. Es el unico eslabon que prueba que las piezas encajan entre si: cada una
 * tiene su test, y aun asi el empalme puede estar cambiado de nombre.
 */
async function motorProduceAviso() {
  try {
    const engine = await import(`${BOT_DIR}/bot-engine.mjs`);
    const { DEFAULT_CONFIG } = await import(`${BOT_DIR}/config.mjs`);
    const { construirAviso } = await import(`${BOT_DIR}/aviso-telegram.mjs`);

    const ahora = () => new Date().toISOString();
    let estado = engine.createState({ conversationKey: "chatwoot:0", leadKey: "gate", channel: "web" });
    estado = engine.step(estado, { text: "Hola", receivedAt: ahora() }, { config: DEFAULT_CONFIG }).nextState;
    const r = engine.step(
      estado,
      { text: "quiero hablar con un humano por favor", receivedAt: ahora() },
      { config: DEFAULT_CONFIG },
    );

    const notify = (r.sideEffects || []).filter((e) => e.type === "notify_sergio").map((e) => e.payload);
    if (notify.length === 0) return { emite: false, accionable: false };

    const aviso = construirAviso({ notify, conversationId: 4242, stageAfter: r.nextState?.botStage });
    // "Accionable" = nombra la conversacion. Sin eso Sergio recibe un timbre sin puerta.
    const accionable = Boolean(aviso?.texto?.includes("4242")) && aviso?.conversationId === 4242;
    return { emite: true, accionable, ejemplo: aviso?.texto };
  } catch {
    return null;
  }
}

function lineasDelLog() {
  const out = sh("bash", [`${BOT_DIR}/webhook-server.sh`, "logs"], 30000);
  return out ? out.split("\n") : [];
}

export async function medir() {
  const env = envDelProcesoVivo();
  const motor = await motorProduceAviso();
  // Sin el proceso vivo o sin el codigo desplegado no hay nada que afirmar.
  if (!env || !motor) return { circuito: null, eventos: contarEventos(lineasDelLog()), ejemplo: null };

  const credencialesOk = await credencialesResponden(env.TG_BOT_TOKEN, env.TG_CHAT_ID);
  return {
    circuito: {
      flagEncendido: String(env.ONIA_BOT_TG_AVISO || "").toLowerCase() === "true",
      credencialesOk,
      motorEmiteNotify: motor.emite,
      textoAccionable: motor.accionable,
    },
    eventos: contarEventos(lineasDelLog()),
    ejemplo: motor.ejemplo,
  };
}

// La guarda: sin esto, importar este archivo para probarlo dispara docker exec contra
// produccion y un process.exit() que mata al proceso importador (medido en este carril
// el 2026-09-03 con demo_agendada_real.mjs).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { circuito, eventos, ejemplo } = await medir();
  const d = diagnosticar({ circuito, eventos });

  console.log(`circuito: ${circuito ? (d.veredicto === "no_medido" ? "?" : "medido") : "NO SE PUDO MEDIR"}`);
  if (circuito) {
    for (const [k, v] of Object.entries(circuito)) console.log(`  ${v ? "ok  " : "ROTO"} ${k}`);
  }
  console.log(`eventos: ${eventos.total} avisos (enviados ${eventos.enviados} · salteados ${eventos.salteados} · fallidos ${eventos.fallidos})`);
  if (d.motivos.length) console.log("motivos:\n  - " + d.motivos.join("\n  - "));
  if (ejemplo && d.veredicto === "ok") console.log(`\nlo que recibiria Sergio:\n${ejemplo.replace(/^/gm, "  ")}`);

  // La linea que le sirve al objetivo del carril: dice el numero Y como leerlo.
  const lectura =
    d.veredicto === "ok"
      ? eventos.enviados === 0
        ? "circuito sano, sin eventos reales todavia"
        : "circuito sano y avisando"
      : d.veredicto === "roto"
        ? "EL PROXIMO QUE PIDA UN HUMANO SE PIERDE"
        : "no se pudo medir contra produccion";
  console.log(`\nVEREDICTO: ${d.veredicto} · avisos enviados ${eventos.enviados} — ${lectura}`);

  process.exit(d.veredicto === "ok" ? 0 : d.veredicto === "roto" ? 1 : 2);
}
