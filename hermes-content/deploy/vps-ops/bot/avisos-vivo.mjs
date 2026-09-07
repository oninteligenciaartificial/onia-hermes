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
//  3. motorEmiteNotify — el motor DESPLEGADO tiene que emitir `notify_sergio` en LAS DOS
//                        ramas que el objetivo nombra (handoff Y demo agendada), no en una.
//                        Se maneja el engine real, no un mock. Ver `RAMAS_QUE_AVISAN`:
//                        hasta el 2026-09-07 esto medía sólo el handoff y el gate quedaba
//                        VERDE con el aviso de la demo borrado del motor.
//  4. textoAccionable  — el aviso tiene que nombrar la conversacion. Uno que no dice a
//                        quien contestarle no sirve (lo dice el propio aviso-telegram.mjs).
//
// Y si no puede medir —no hay `/opt/onia/bot`, el loop se mudo de maquina— el veredicto
// es `no_medido`, nunca `ok`. Esa es la direccion cara: un gate que firma "al dia" desde
// una maquina que no ve produccion apaga al unico instrumento que miraba el problema.
//
// Uso:  node avisos-vivo.mjs          (exit 0 verde · 1 rojo · 2 no se pudo medir)

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export const BOT_DIR = "/opt/onia/bot";
export const CONTENEDOR = "onia-center";

/** La maquina donde vive el bot desplegado. Se le pregunta cuando el disco local no lo tiene. */
export const VPS_DEL_BOT = "root@187.77.16.63";
const LLAVE_VPS = "/root/.ssh/onia_hermes_vps_ed25519";

/** Sin esto no hay nada que medir: es el modulo que el gate maneja de verdad. */
const MOTOR = "bot-engine.mjs";

/**
 * Devuelve el directorio del bot DESPLEGADO listo para importar, o `null` si no se puede.
 *
 * Por que existe: este gate importa el artefacto que CORRE, no el del repo — ahi esta todo su
 * valor, porque cada pieza ya tiene su test y lo unico que nadie prueba es el empalme entre
 * ellas. Eso lo ataba a `/opt/onia/bot`, que existe en el VPS y NO en nodo-casa, adonde se mudo
 * este carril el 2026-09-06: desde entonces el tercer numero del objetivo salia `no_medido` en
 * cada vuelta, con el circuito sano del otro lado.
 *
 * Los dos escalones, y por que NO hay un tercero que apunte al repo: traerse el artefacto
 * cuesta un `tar` por vuelta; apuntar al repo seria mas facil y **romperia lo que el gate
 * existe para probar** — mediria codigo commiteado y firmaria sobre produccion.
 */
export function resolverBotDesplegado(deps = {}) {
  const existe = deps.existsSync || existsSync;
  const correr = deps.spawnSync || spawnSync;

  // 1. El artefacto en el disco de esta maquina. Es el caso del VPS, y no sale a la red.
  if (existe(BOT_DIR)) return { dir: BOT_DIR, origen: "local" };

  // 2. nodo-casa: se lo trae del VPS a un temporal.
  const destino = mkdtempSync(join(tmpdir(), "onia-bot-desplegado-"));
  const fallar = () => {
    try {
      rmSync(destino, { recursive: true, force: true });
    } catch {
      /* que no exista ya es el resultado buscado */
    }
    return null;
  };

  let bajado;
  try {
    bajado = correr(
      "ssh",
      ["-o", "BatchMode=yes", "-o", "ConnectTimeout=15", "-i", LLAVE_VPS, VPS_DEL_BOT, `tar -cf - -C ${BOT_DIR} .`],
      { encoding: "buffer", maxBuffer: 64 * 1024 * 1024, timeout: 120_000 },
    );
  } catch {
    return fallar();
  }
  // El estado del `ssh` se mira SOLO, sin tuberia: `ssh | tar` devuelve el del ultimo comando,
  // asi que un VPS caido puede terminar en exit 0 con el destino vacio.
  if (!bajado || bajado.status !== 0) return fallar();

  let extraido;
  try {
    extraido = correr("tar", ["-xf", "-", "-C", destino], { input: bajado.stdout, timeout: 60_000 });
  } catch {
    return fallar();
  }
  if (!extraido || extraido.status !== 0) return fallar();

  // Y aun con los dos en 0 se verifica el ARTEFACTO, no el codigo de salida: lo que hace falta
  // es el motor en el destino, no que los comandos hayan dicho que si.
  if (!existe(join(destino, MOTOR))) return fallar();

  return { dir: destino, origen: "remoto" };
}

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
 * Las DOS ramas que el objetivo del carril nombra: "cada demo agendada O handoff le llega a
 * Sergio". Son HERMANAS y se emiten desde funciones DISTINTAS del motor, con payloads de
 * forma distinta (el handoff trae `reason`, la demo no), asi que probar una no dice nada de
 * la otra.
 *
 * 🔴 POR QUE ESTA LISTA EXISTE, medido el 2026-09-07. Este gate manejaba el motor SOLO hasta
 * un handoff, y su propio encabezado lo declaraba ("ante un pedido de humano"). Borrando
 * entero el `notify_sergio` de la rama de agendar, el gate seguia dando VERDE — o sea que el
 * dia que se rompa el aviso de la demo, el unico instrumento que mira este objetivo dice
 * "circuito: ok" y ningun numero se mueve, mientras cada demo reservada se pierde en silencio.
 * Es la rama que lleva la plata: un prospecto que YA eligio horario.
 *
 * Una rama que no se puede manejar es ROJO, nunca un salteo: ese es el modo de falla del que
 * venimos.
 */
export const RAMAS_QUE_AVISAN = Object.freeze(["handoff", "demo_agendada"]);

/**
 * Maneja el motor DESPLEGADO hasta CADA una de las ramas de `RAMAS_QUE_AVISAN` y arma el
 * aviso con el `construirAviso` desplegado. Es el unico eslabon que prueba que las piezas
 * encajan entre si: cada una tiene su test, y aun asi el empalme puede estar cambiado de
 * nombre.
 *
 * `emite`/`accionable` son la Y de todas las ramas: basta que una falle para que el circuito
 * este roto, porque cada una es un prospecto distinto que se pierde.
 */
export async function motorProduceAviso(dir) {
  try {
    const mod = (archivo) => pathToFileURL(join(dir, archivo)).href;
    const engine = await import(mod(MOTOR));
    const { DEFAULT_CONFIG, createBotConfig } = await import(mod("config.mjs"));
    const { construirAviso } = await import(mod("aviso-telegram.mjs"));

    const ahora = () => new Date().toISOString();

    // Los horarios de `DEFAULT_CONFIG` vienen `pending: true` (placeholders), y con esos el
    // motor cae en "no tengo horarios libres" y NUNCA llega a agendar. Produccion los carga
    // de `ONIA_BOT_SLOTS`; aca se inyectan dos reales y futuros para que la rama se maneje
    // siempre, incluso el dia que el renovador no haya corrido.
    const futuro = new Date(Date.now() + 72 * 3600 * 1000).toISOString();
    const conHorarios = createBotConfig({
      slots: [
        { key: "A", label: "horario A del gate", startAt: futuro, pending: false },
        { key: "B", label: "horario B del gate", startAt: futuro, pending: false },
      ],
    });

    // Cada rama: el guion que la dispara y la config que hace falta para llegar.
    const guiones = {
      handoff: { config: DEFAULT_CONFIG, dice: "quiero hablar con un humano por favor" },
      demo_agendada: { config: conHorarios, dice: "A" },
    };

    const ramas = {};
    let ejemplo = null;

    for (const kind of RAMAS_QUE_AVISAN) {
      const { config, dice } = guiones[kind];
      let estado = engine.createState({ conversationKey: "chatwoot:0", leadKey: "gate", channel: "web" });
      estado = engine.step(estado, { text: "Hola", receivedAt: ahora() }, { config }).nextState;
      const r = engine.step(estado, { text: dice, receivedAt: ahora() }, { config });

      const notify = (r.sideEffects || []).filter((e) => e.type === "notify_sergio").map((e) => e.payload);
      // Se exige el `kind` esperado, no "algun notify": si la rama emite otra cosa (un
      // `sin_horarios` en vez de la demo) el empalme esta roto igual.
      const deLaRama = notify.filter((p) => String(p?.kind) === kind);
      if (deLaRama.length === 0) {
        ramas[kind] = { emite: false, accionable: false };
        continue;
      }

      const aviso = construirAviso({ notify: deLaRama, conversationId: 4242, stageAfter: r.nextState?.botStage });
      // "Accionable" = nombra la conversacion. Sin eso Sergio recibe un timbre sin puerta.
      const accionable = Boolean(aviso?.texto?.includes("4242")) && aviso?.conversationId === 4242;
      ramas[kind] = { emite: true, accionable };
      if (!ejemplo) ejemplo = aviso?.texto;
    }

    return {
      emite: RAMAS_QUE_AVISAN.every((k) => ramas[k]?.emite),
      accionable: RAMAS_QUE_AVISAN.every((k) => ramas[k]?.accionable),
      ramas,
      ejemplo,
    };
  } catch {
    return null;
  }
}

/**
 * El log del proceso vivo. El `logs` de `webhook-server.sh` es un `docker exec` contra el
 * contenedor, asi que sirve igual desde la copia traida del VPS: en nodo-casa `docker` es un
 * shim que delega por SSH, o sea que el log sale de produccion en las dos maquinas.
 */
function lineasDelLog(dir) {
  if (!dir) return [];
  const out = sh("bash", [join(dir, "webhook-server.sh"), "logs"], 30000);
  return out ? out.split("\n") : [];
}

export async function medir() {
  const bot = resolverBotDesplegado();
  try {
    return await medirCon(bot);
  } finally {
    // El temporal se borra siempre: en WSL `/tmp` es un tmpfs que vive EN RAM, y son 7 MB
    // por vuelta con este loop corriendo cada hora.
    if (bot?.origen === "remoto") {
      try {
        rmSync(bot.dir, { recursive: true, force: true });
      } catch {
        /* dejar basura en /tmp no justifica tumbar la medicion */
      }
    }
  }
}

async function medirCon(bot) {
  const env = envDelProcesoVivo();
  const motor = bot ? await motorProduceAviso(bot.dir) : null;
  // Sin el proceso vivo o sin el codigo desplegado no hay nada que afirmar.
  if (!env || !motor) return { circuito: null, eventos: contarEventos(lineasDelLog(bot?.dir)), ejemplo: null };

  const credencialesOk = await credencialesResponden(env.TG_BOT_TOKEN, env.TG_CHAT_ID);
  return {
    circuito: {
      flagEncendido: String(env.ONIA_BOT_TG_AVISO || "").toLowerCase() === "true",
      credencialesOk,
      motorEmiteNotify: motor.emite,
      textoAccionable: motor.accionable,
    },
    eventos: contarEventos(lineasDelLog(bot.dir)),
    ejemplo: motor.ejemplo,
    ramas: motor.ramas,
  };
}

// La guarda: sin esto, importar este archivo para probarlo dispara docker exec contra
// produccion y un process.exit() que mata al proceso importador (medido en este carril
// el 2026-09-03 con demo_agendada_real.mjs).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { circuito, eventos, ejemplo, ramas } = await medir();
  const d = diagnosticar({ circuito, eventos });

  console.log(`circuito: ${circuito ? (d.veredicto === "no_medido" ? "?" : "medido") : "NO SE PUDO MEDIR"}`);
  if (circuito) {
    for (const [k, v] of Object.entries(circuito)) console.log(`  ${v ? "ok  " : "ROTO"} ${k}`);
  }
  // Las ramas van SIEMPRE, no sólo cuando fallan: un "motorEmiteNotify ok" sin decir sobre
  // qué ramas es justo la lectura que dejó pasar el agujero del 2026-09-07.
  if (ramas) {
    for (const kind of RAMAS_QUE_AVISAN) {
      const r = ramas[kind];
      console.log(`  ${r?.emite && r?.accionable ? "ok  " : "ROTO"} rama ${kind}`);
    }
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
