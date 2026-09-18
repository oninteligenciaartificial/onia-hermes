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
// LAS DOS DIRECCIONES. Hasta el 2026-09-18 este gate medía solo el PISO (que el bot no ofrezca
// una demo a minutos vista) y firmaba `ok` sobre el defecto de enfrente, que es el que cuesta la
// venta: alejarle el turno al prospecto teniendo la ventana libre. Medido ese viernes 10:13 La Paz
// sobre el proceso vivo — ofrecía "lunes 21, 14:00" con 75,8 h de aviso y el gate lo llamó `ok`,
// con el SÁBADO 19 entero sin ofrecer y la coletilla del mismo mensaje prometiendo "sáb 9:00-15:00".
// Tres días de espera para quien escribía ese día. Un piso sin techo no es una garantía: es la
// mitad barata de una, y es la mitad que no pierde plata.
//
// El techo se deriva de `VENTANAS_ATENCION` —la fuente única de cuándo está Sergio Urcullo— y no de
// una regla propia: el día que una ventana se mueva, este gate se mueve con ella.
//
// Salidas:  0 = el bot promete con un dia de aviso, sin alejar el turno, y el corte lo respalda
//           1 = roto (ofrece algo a menos de 24 h, saltea dias de atencion ofrecibles, o el corte
//               no esta en el codigo vivo)
//           2 = NO MEDIDO (sin docker, sin contenedor o sin proceso) — nunca es verde: si no puede
//               mirar lo dice, en vez de aprobar por defecto, que es como esta familia falla abierto.
//
//   node anticipacion-viva.mjs [--self-check]

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { ANTICIPACION_MINIMA_MS, parseSlotsSpec } from "./config.mjs";
import { VENTANAS_ATENCION } from "./ventanas-de-atencion.mjs";

const CONTENEDOR = "onia-center";
const CONFIG_VIVO = "/tmp/onia-bot/config.mjs";
const HORAS = 60 * 60 * 1000;
/** La Paz es UTC-4 fijo (sin horario de verano), igual que en `ventanas-de-atencion.mjs`. */
const LAPAZ_OFFSET_MS = 4 * HORAS;
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/** El mismo instante, corrido para que sus `getUTC*` devuelvan la hora de La Paz. */
function enLaPaz(ms) {
  return new Date(ms - LAPAZ_OFFSET_MS);
}

/**
 * Los dias de atencion que el bot DEJO PASAR: tienen al menos una hora ofrecible (dentro de una
 * franja y con la anticipacion cumplida) ANTES del primer horario que el prospecto puede tomar.
 *
 * Se juzga por DIA y no por hora a proposito. El valor se escribe una vez al dia y se sirve las 24 h
 * siguientes, asi que la hora exacta del primer candidato se corre sola con el reloj: comparar
 * instantes pondria el gate rojo por el mero paso del tiempo dentro de la vigencia. Un dia entero
 * saltado, en cambio, no lo explica ningun reloj.
 *
 * El sujeto es el primer horario SOSTENIBLE, no el primero de la lista: uno `pending` ya esta
 * cubierto por el piso, y medir el alejamiento contra un horario que el lead no puede tomar
 * mezclaria los dos diagnosticos.
 */
export function diasDesaprovechados({
  slots,
  now,
  ventanas = VENTANAS_ATENCION,
  anticipacionMs = ANTICIPACION_MINIMA_MS,
}) {
  const ahora = now instanceof Date ? now.getTime() : Number(now);
  const primero = (slots || []).find((s) => !s.pending && s.startAt && !Number.isNaN(Date.parse(s.startAt)));
  if (!primero) return [];
  const objetivo = Date.parse(primero.startAt);

  const piso = ahora + anticipacionMs;
  const salida = [];
  const local = enLaPaz(piso);
  let [anio, mes, dia] = [local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()];

  // El corte es el DIA local del turno ofrecido, no su hora: que el bot ofrezca el sábado a las
  // 14:00 teniendo libre el sábado a las 11:00 no es alejar el turno — es el mismo día, y el
  // generador ofrece un horario por día a propósito ("hoy 14:00 u hoy 14:30" no es una opción).
  const finLocal = enLaPaz(objetivo);
  const diaDelObjetivo = Date.UTC(finLocal.getUTCFullYear(), finLocal.getUTCMonth(), finLocal.getUTCDate());

  for (let i = 0; i < 21; i++) {
    const medianoche = Date.UTC(anio, mes, dia);
    if (medianoche >= diaDelObjetivo) break;
    const diaSemana = new Date(medianoche).getUTCDay();
    for (const [desde, hasta] of ventanas[diaSemana] || []) {
      let encontrado = null;
      for (let hora = desde; hora < hasta; hora++) {
        const cand = Date.UTC(anio, mes, dia, hora) + LAPAZ_OFFSET_MS;
        if (cand >= piso && cand < objetivo) {
          encontrado = { instante: cand, etiqueta: `${DIAS[diaSemana]} ${dia}, ${String(hora).padStart(2, "0")}:00` };
          break;
        }
      }
      if (encontrado) {
        salida.push(encontrado);
        break; // un dia se nombra una sola vez, aunque tenga dos franjas libres
      }
    }
    const siguiente = new Date(Date.UTC(anio, mes, dia + 1));
    [anio, mes, dia] = [siguiente.getUTCFullYear(), siguiente.getUTCMonth(), siguiente.getUTCDate()];
  }

  return salida;
}

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
export function evaluar({
  raw,
  corteVivo,
  now = Date.now(),
  ventanas = VENTANAS_ATENCION,
  anticipacionMs = ANTICIPACION_MINIMA_MS,
}) {
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

  const lejos = diasDesaprovechados({ slots, now: ahora, ventanas, anticipacionMs });
  for (const d of lejos) lineas.push(`  LEJOS ${d.etiqueta} estaba libre y ofrecible, y no se ofrecio`);

  return {
    lineas,
    ofrecidos: slots.length,
    cortos: cortos.length,
    desaprovechados: lejos.length,
    primerDesaprovechado: lejos[0] || null,
    // Los horarios pueden estar sanos porque el cron corrio hace un rato. El corte es lo que lo
    // sostiene el dia que no corra: su ausencia es roja aunque hoy no se note.
    roto: cortos.length > 0 || lejos.length > 0 || !corteVivo,
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
  } else if (r.desaprovechados) {
    // El arreglo casi nunca es el codigo: el generador escribe una vez al dia y lo que esta servido
    // lo calculo la corrida anterior. Se nombra el comando que lo cura para no volver a buscarlo.
    console.log(
      `VEREDICTO: roto — el bot aleja el turno: ${r.desaprovechados} dia(s) de atencion libres antes del primero que ofrece.`,
    );
    console.log(`  El mas temprano que se dejo pasar: ${r.primerDesaprovechado.etiqueta}.`);
    console.log("  Quien escribe hoy espera de mas, y la coletilla del mismo mensaje le promete ese dia.");
    console.log("  Suele ser el VALOR servido, no el codigo: lo escribe un cron 1 vez/dia.");
    console.log("  Se cura corriendo el generador: /usr/bin/python3 /root/bin/onia-renovar-slots.py");
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

  // ── El TECHO. Anclado en el defecto vivo del 2026-09-18 10:13 La Paz (viernes): el proceso
  // ofrecia "lunes 21, 14:00" en adelante y este gate firmaba `ok` con 75,8 h de aviso, teniendo el
  // sabado 19 entero libre. Los instantes se derivan de `VENTANAS_ATENCION`, no se tipean.
  const viernes = Date.parse("2026-09-18T14:13:00Z"); // 10:13 La Paz
  const elLunes = "lunes 21 de septiembre, 14:00@2026-09-21T18:00:00Z";
  const elSabado = "sábado 19 de septiembre, 14:00@2026-09-19T18:00:00Z";
  const delTecho = [
    // El sabado 19 tiene horas ofrecibles (9-15) a mas de 24 h del viernes 10:13: saltearlo es rojo.
    ["saltea un dia de atencion libre = rojo", { raw: elLunes, corteVivo: true, now: viernes }, { roto: true, desaprovechados: 1 }],
    // Mismo instante, ofreciendo lo mas temprano que se sostiene: no queda nada antes que nombrar.
    ["ofrece el primer dia ofrecible = ok", { raw: `${elSabado}|${elLunes}`, corteVivo: true, now: viernes }, { roto: false, desaprovechados: 0 }],
    // El domingo NO es atencion: que el bot lo saltee no puede ser rojo, o el gate exigiria trabajar
    // un dia que Sergio Urcullo no trabaja. Sabado 12:00 -> el lunes es el proximo ofrecible.
    ["saltear el domingo no es rojo", { raw: elLunes, corteVivo: true, now: Date.parse("2026-09-19T16:00:00Z") }, { roto: false, desaprovechados: 0 }],
  ];
  for (const [nombre, entrada, esperado] of delTecho) {
    const r = evaluar(entrada);
    const ok = r.roto === esperado.roto && r.desaprovechados === esperado.desaprovechados;
    console.log(`  ${ok ? "ok  " : "FALLA"} ${nombre}`);
    if (!ok) fallos++;
  }

  // El techo se DERIVA de las ventanas: si alguien le agrega el domingo a la fuente unica, el gate
  // pasa a exigirlo solo. Un mapa propio escrito aca lo dejaria juzgando una semana que ya no existe.
  const conDomingo = { ...VENTANAS_ATENCION, 0: [[13, 18]] };
  const domingoAhoraCuenta = diasDesaprovechados({
    slots: [{ startAt: "2026-09-21T18:00:00Z", label: "lunes 21" }],
    now: Date.parse("2026-09-19T16:00:00Z"),
    ventanas: conDomingo,
  });
  const okDerivado = domingoAhoraCuenta.length === 1;
  console.log(`  ${okDerivado ? "ok  " : "FALLA"} el techo sale de VENTANAS_ATENCION, no de un mapa propio`);
  if (!okDerivado) fallos++;

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
