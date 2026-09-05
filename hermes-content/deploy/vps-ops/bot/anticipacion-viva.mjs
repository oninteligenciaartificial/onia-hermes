#!/usr/bin/env node
// Mide, EN PRODUCCION, con cuanta anticipacion ofrece el bot sus demos — y si el corte que la
// garantiza esta realmente corriendo.
//
// Por que existe: el 2026-09-05 el bot vivo ofrecio "sábado 5, 09:00" con 4 h 57 min de aviso,
// contra el "al menos un dia de anticipacion" que pidio Sergio para poder cancelar. El corte se
// arreglo en `config.mjs` y se mergeo a main el mismo dia... y NO llego al bot: el commit tiene dos
// mitades y solo una viaja sola (sincronizar.sh copia el productor `renovar-slots-bot.py`; nadie
// copia el consumidor `config.mjs`). Medido: `ANTICIPACION_MINIMA_MS` daba 2 en la rama y 0 en
// /tmp/onia-bot/config.mjs.
//
// Ninguna de las cuatro cifras del carril puede ver esto — simulador, widget, avisos y rubros
// dieron las cuatro en meta ese mismo dia. Las tres primeras miran si SALE un mensaje; la de rubros
// mira el ARBOL. Este mira lo que el proceso vivo tiene cargado.
//
// La distincion que hace el gate util, y que este carril ya pago una vez (ver avisos-vivo.mjs): se
// miden por separado los HORARIOS de hoy y el CORTE que los protege. Un cron diario puede dejar los
// horarios sanos por casualidad; sin el corte desplegado, el dia que ese cron no corra el valor
// envejece hasta el pasado y nadie se entera. Horarios ok + corte ausente NO es verde.
//
// Salidas:  0 = el bot promete con un dia de aviso y el corte lo respalda
//           1 = roto (ofrece algo a menos de 24 h, o el corte no esta en el codigo vivo)
//           2 = NO MEDIDO (sin docker, sin contenedor o sin proceso) — nunca es verde: si no puede
//               mirar lo dice, en vez de aprobar por defecto, que es como esta familia falla abierto.
//
//   node anticipacion-viva.mjs [--self-check]

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { ANTICIPACION_MINIMA_MS, parseSlotsSpec } from "./config.mjs";

const CONTENEDOR = "onia-center";
const CONFIG_VIVO = "/tmp/onia-bot/config.mjs";
const HORAS = 60 * 60 * 1000;

function sh(comando) {
  return execFileSync("docker", ["exec", CONTENEDOR, "sh", "-c", comando], {
    encoding: "utf8",
    timeout: 30_000,
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

/**
 * ONIA_BOT_SLOTS leido del entorno del PROCESO, no de webhook.env. El archivo miente en las dos
 * direcciones: sus comillas entran como parte del valor, y un lanzador con lista blanca de `-e`
 * puede no estar pasando la variable aunque el .env la declare. Lo que el bot USA es esto.
 */
export function leerSlotsDelProceso() {
  const pid = sh(`ps -eo pid,args | grep -F webhook-server | grep -v grep | head -1 | awk '{print $1}'`);
  if (!pid) return { pid: null, raw: null };
  const environ = sh(`tr '\\0' '\\n' < /proc/${pid}/environ | grep '^ONIA_BOT_SLOTS='`);
  return { pid, raw: environ.replace(/^ONIA_BOT_SLOTS=/, "") || null };
}

/** Si el corte vive en el codigo que el contenedor ejecuta. `grep -c` sobre el archivo servido. */
export function corteEnCodigoVivo() {
  const n = sh(`grep -c 'ANTICIPACION_MINIMA_MS' ${CONFIG_VIVO} || true`);
  return Number(n) > 0;
}

/**
 * El veredicto, puro y testeable. Usa el MISMO `parseSlotsSpec` del motor a proposito: si el gate
 * reimplementara la regla, los dos se desincronizarian y el gate aprobaria su propia idea del corte
 * en vez de la que corre.
 */
export function evaluar({ raw, corteVivo, now = Date.now() }) {
  const slots = parseSlotsSpec(raw, { now }) || [];
  const lineas = [];
  const ahora = now instanceof Date ? now.getTime() : Number(now);

  // `pending` y no `sostenible`: parseSlotsSpec marca el horario que NO se sostiene, porque para el
  // guion es uno sin definir (config.mjs:66). Leer un campo que no existe da undefined -> falsy ->
  // "CORTO" para TODOS, que es un rojo con el texto de un defecto real sobre horarios sanos.
  for (const slot of slots) {
    const inicio = slot.startAt ? Date.parse(slot.startAt) : NaN;
    const aviso = Number.isNaN(inicio) ? null : inicio - ahora;
    const cuanto = aviso === null ? "sin fecha verificable" : `${(aviso / HORAS).toFixed(1)} h de aviso`;
    lineas.push(`  ${slot.pending ? "CORTO" : "ok  "} ${slot.label} — ${cuanto}`);
  }

  const cortos = slots.filter((s) => s.pending);
  // Sin horarios cargados el bot cae en su rama "no tengo horarios libres": no promete de menos ni
  // de mas, asi que no es rojo. Se nombra igual, porque un cron caido se ve exactamente asi.
  if (!slots.length) lineas.push("  (el proceso no tiene horarios cargados — el bot cae en su rama sin horarios)");

  return {
    lineas,
    ofrecidos: slots.length,
    cortos: cortos.length,
    // Los horarios pueden estar sanos porque el cron corrio hace un rato. El corte es lo que lo
    // sostiene el dia que no corra: su ausencia es roja aunque hoy no se note.
    roto: cortos.length > 0 || !corteVivo,
  };
}

function medir() {
  let slots;
  let corteVivo;
  try {
    slots = leerSlotsDelProceso();
    if (!slots.pid) {
      console.log(`NO MEDIDO: no hay proceso webhook-server dentro de ${CONTENEDOR}.`);
      return 2;
    }
    corteVivo = corteEnCodigoVivo();
  } catch (err) {
    console.log(`NO MEDIDO: no pude leer el proceso vivo (${err.message.split("\n")[0]}).`);
    console.log(`  Este gate mide produccion: necesita docker y el contenedor ${CONTENEDOR}.`);
    return 2;
  }

  const r = evaluar({ raw: slots.raw, corteVivo });
  console.log(`proceso ${slots.pid} en ${CONTENEDOR} — ofrece ${r.ofrecidos} horario(s)`);
  for (const linea of r.lineas) console.log(linea);
  console.log(`corte de ${ANTICIPACION_MINIMA_MS / HORAS} h en el codigo vivo: ${corteVivo ? "si" : "NO"}`);

  if (r.cortos) {
    console.log(`VEREDICTO: roto — ${r.cortos} horario(s) a menos de 24 h; un prospecto no llega a cancelar`);
  } else if (!corteVivo) {
    // El diagnostico va con el lugar del arreglo: este carril ya perdio vueltas "arreglando" un
    // archivo que ya estaba bien porque el gate no distinguia codigo malo de deploy viejo.
    console.log("VEREDICTO: roto — hoy los horarios dan bien, pero por el cron, no por el corte.");
    console.log(`  ${CONFIG_VIVO} no tiene ANTICIPACION_MINIMA_MS: el codigo ya esta arreglado en la rama, FALTA DESPLEGAR.`);
    console.log("  El dia que el renovador no corra, el bot vuelve a ofrecer una demo para dentro de unas horas.");
  } else {
    console.log("VEREDICTO: ok — promete con un dia de aviso y el corte lo respalda");
  }
  return r.roto ? 1 : 0;
}

/** Probado en las DOS direcciones: un instrumento que solo sabe decir "ok" no sirve de gate. */
function selfCheck() {
  const now = Date.parse("2026-09-05T13:00:00Z");
  const lejos = "lunes 7, 14:00@2026-09-07T18:00:00Z";
  const cerca = "sábado 5, 09:00@2026-09-05T17:00:00Z"; // 4 h: el defecto real del 2026-09-05
  const casos = [
    ["horario lejano + corte vivo = ok", { raw: lejos, corteVivo: true }, { roto: false, cortos: 0 }],
    ["horario a 4 h = rojo", { raw: cerca, corteVivo: true }, { roto: true, cortos: 1 }],
    // El caso que motiva el gate: lo que producción tenía el 2026-09-05 a las 14:06 La Paz.
    ["horario lejano SIN corte desplegado = rojo", { raw: lejos, corteVivo: false }, { roto: true, cortos: 0 }],
    ["uno bueno y uno corto = rojo", { raw: `${lejos}|${cerca}`, corteVivo: true }, { roto: true, cortos: 1 }],
    ["sin horarios y con corte = ok", { raw: "", corteVivo: true }, { roto: false, cortos: 0 }],
  ];

  let fallos = 0;
  for (const [nombre, entrada, esperado] of casos) {
    const r = evaluar({ ...entrada, now });
    const ok = r.roto === esperado.roto && r.cortos === esperado.cortos;
    console.log(`  ${ok ? "ok  " : "FALLA"} ${nombre}`);
    if (!ok) fallos++;
  }

  // El gate tiene que leer el corte del motor, no tener el suyo: si alguien afloja el del bot, este
  // afloja con el. Un 24 h escrito aca a mano aprobaria lo que el bot ya no respeta.
  const okConstante = ANTICIPACION_MINIMA_MS === 24 * HORAS;
  console.log(`  ${okConstante ? "ok  " : "FALLA"} el corte se lee de config.mjs (${ANTICIPACION_MINIMA_MS / HORAS} h)`);
  if (!okConstante) fallos++;

  console.log(fallos ? `SELF-CHECK: ${fallos} fallo(s)` : "SELF-CHECK: ok");
  return fallos ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(process.argv.includes("--self-check") ? selfCheck() : medir());
}
