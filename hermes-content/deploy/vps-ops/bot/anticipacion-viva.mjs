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

import { ANTICIPACION_MINIMA_MS, parseSlotsSpec, slotSostenible } from "./config.mjs";
import { VENTANAS_ATENCION } from "./ventanas-de-atencion.mjs";

const CONTENEDOR = "onia-center";
const CONFIG_VIVO = "/tmp/onia-bot/config.mjs";
/** El armador del par que sale al cliente: `buildConfig` vive aca y lo llama `runTurn`. */
const ARMADOR_VIVO = "/tmp/onia-bot/run-turn.mjs";
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

/**
 * El par que el bot OFRECE, obtenido EJECUTANDO el armador del contenedor (`buildConfig`, el mismo
 * que llama `runTurn`) con el spec del proceso vivo. No se lee su codigo ni se replica: se corre.
 *
 * Por que asi y no con `parseSlotsSpec` local: son dos programas distintos sobre el mismo dato. El
 * 2026-09-25 el desplegado devolvia el viernes caducado y el de la rama el sabado — un `grep` del
 * corte en `config.mjs` decia "si" en los dos casos, porque el armador caliente ni siquiera lo
 * llama. La unica respuesta que no envejece con el proximo refactor es la que da el binario que
 * corre.
 *
 * El marcador existe porque importar el motor imprime avisos de carga en stdout (knowledge.mjs
 * avisa en cada merge): sin el, un `JSON.parse` de la primera linea leeria un warning.
 */
export function leerParVivo(raw) {
  const script =
    `import { buildConfig } from ${JSON.stringify(ARMADOR_VIVO)};\n` +
    `console.log("__PAR__" + JSON.stringify(buildConfig({}).slots || []));`;
  const salida = execFileSync(
    "docker",
    ["exec", "-e", `ONIA_BOT_SLOTS=${raw ?? ""}`, CONTENEDOR, "node", "--input-type=module", "-e", script],
    { encoding: "utf8", timeout: 60_000, stdio: ["ignore", "pipe", "ignore"] },
  );
  const linea = salida.split("\n").find((l) => l.startsWith("__PAR__"));
  return linea ? JSON.parse(linea.slice("__PAR__".length)) : null;
}

/** Si el corte vive en el codigo que el contenedor ejecuta. `grep -c` sobre el archivo servido. */
export function corteEnCodigoVivo() {
  const n = sh(`grep -c 'ANTICIPACION_MINIMA_MS' ${CONFIG_VIVO} || true`);
  return Number(n) > 0;
}

/** Dos pares son el mismo si ofrecen lo mismo, con la misma letra y el mismo estado. */
function mismoPar(uno, otro) {
  const clave = (s) => `${s.key}|${s.label}|${s.startAt}|${s.pending ? 1 : 0}`;
  if ((uno || []).length !== (otro || []).length) return false;
  return uno.every((slot, i) => clave(slot) === clave(otro[i]));
}

/**
 * El veredicto, puro y testeable.
 *
 * `slotsVivos` es el par que arma EL CODIGO DEL CONTENEDOR, y es el sujeto: es lo que el prospecto
 * lee. `parseSlotsSpec` del repo entra solo como CONTRASTE — cuando los dos no coinciden, el gate
 * se pone rojo aunque el par del repo sea impecable, porque esa diferencia es el defecto.
 *
 * ⚠️ Hasta el 2026-09-25 este gate juzgaba unicamente el par del repo y lo reportaba con el nombre
 * de produccion. Medido ese dia 03:47 La Paz: `run-turn.mjs` vivo arma los slots con un
 * `parseEnvSlots()` propio —`slice(0, 2)` y `pending: false` fijo— que NO consulta `slotSostenible`,
 * asi que el bot ofrecio "viernes 25, 21:00" con 17,1 h de aviso mientras este gate firmaba `ok`
 * sobre "sabado 26 y lunes 28", que es el par que el repo habria elegido. Que `config.mjs` tenga el
 * corte desplegado no alcanza: hay que mirar si el armador caliente lo LLAMA.
 */
export function evaluar({
  raw,
  corteVivo,
  slotsVivos = null,
  now = Date.now(),
  ventanas = VENTANAS_ATENCION,
  anticipacionMs = ANTICIPACION_MINIMA_MS,
}) {
  const delRepo = parseSlotsSpec(raw, { now }) || [];
  const slots = slotsVivos || delRepo;
  const divergencia = slotsVivos ? !mismoPar(slotsVivos, delRepo) : false;
  const lineas = [];
  const ahora = now instanceof Date ? now.getTime() : Number(now);

  // El estado se RECALCULA con `slotSostenible`, la misma funcion del motor, en vez de leer el
  // campo `pending` que trae el par. No es desconfianza teorica: el armador que corre en el
  // contenedor escribe `pending: false` FIJO, asi que creerle al campo deja pasar en verde
  // exactamente el horario caducado que este gate existe para atrapar. El dato (el instante) no
  // miente; el flag si.
  const juzgados = slots.map((slot) => ({ ...slot, pending: !slotSostenible(slot, ahora) }));

  for (const slot of juzgados) {
    const inicio = slot.startAt ? Date.parse(slot.startAt) : NaN;
    const aviso = Number.isNaN(inicio) ? null : inicio - ahora;
    const cuanto = aviso === null ? "sin fecha verificable" : `${(aviso / HORAS).toFixed(1)} h de aviso`;
    lineas.push(`  ${slot.pending ? "CORTO" : "ok  "} ${slot.label} — ${cuanto}`);
  }

  const cortos = juzgados.filter((s) => s.pending);
  // Sin horarios cargados el bot cae en su rama "no tengo horarios libres": no promete de menos ni
  // de mas, asi que no es rojo. Se nombra igual, porque un cron caido se ve exactamente asi.
  if (!slots.length) lineas.push("  (el proceso no tiene horarios cargados — el bot cae en su rama sin horarios)");

  const lejos = diasDesaprovechados({ slots: juzgados, now: ahora, ventanas, anticipacionMs });
  for (const d of lejos) lineas.push(`  LEJOS ${d.etiqueta} estaba libre y ofrecible, y no se ofrecio`);

  if (divergencia) {
    lineas.push(`  DISTINTO el codigo desplegado arma otro par que el de la rama:`);
    lineas.push(`    lo que OFRECE el contenedor: ${(slotsVivos || []).map((s) => s.label).join(" · ") || "(nada)"}`);
    lineas.push(`    lo que elegiria la rama:     ${delRepo.map((s) => s.label).join(" · ") || "(nada)"}`);
  }

  return {
    lineas,
    ofrecidos: slots.length,
    cortos: cortos.length,
    desaprovechados: lejos.length,
    primerDesaprovechado: lejos[0] || null,
    divergencia,
    // Los horarios pueden estar sanos porque el cron corrio hace un rato. El corte es lo que lo
    // sostiene el dia que no corra: su ausencia es roja aunque hoy no se note.
    //
    // `divergencia` es roja POR SI SOLA, aunque hoy los dos pares se sostengan: significa que lo
    // que el prospecto lee no es lo que mide la rama, y entonces todo verde de este gate sobre el
    // resto es una casualidad del valor servido, no una garantia.
    roto: cortos.length > 0 || lejos.length > 0 || !corteVivo || divergencia,
  };
}

function medir() {
  let slots;
  let corteVivo;
  let parVivo;
  try {
    slots = leerSlotsDelProceso();
    if (!slots.pid) {
      console.log(`NO MEDIDO: no hay proceso webhook-server dentro de ${CONTENEDOR}.`);
      return 2;
    }
    corteVivo = corteEnCodigoVivo();
    parVivo = leerParVivo(slots.raw);
  } catch (err) {
    console.log(`NO MEDIDO: no pude leer el proceso vivo (${err.message.split("\n")[0]}).`);
    console.log(`  Este gate mide produccion: necesita docker y el contenedor ${CONTENEDOR}.`);
    return 2;
  }

  // Sin el par del contenedor este gate solo sabe lo que HARIA la rama, que es exactamente el
  // falso verde que costo el bucle del 25-sep. Se declara NO MEDIDO en vez de caer al de la rama.
  if (!parVivo) {
    console.log(`NO MEDIDO: no pude ejecutar buildConfig en ${ARMADOR_VIVO} dentro de ${CONTENEDOR}.`);
    console.log("  Sin el par que arma el codigo desplegado, medir el de la rama seria firmar por produccion.");
    return 2;
  }

  const r = evaluar({ raw: slots.raw, corteVivo, slotsVivos: parVivo });
  console.log(`proceso ${slots.pid} en ${CONTENEDOR} — ofrece ${r.ofrecidos} horario(s)`);
  for (const linea of r.lineas) console.log(linea);
  console.log(`corte de ${ANTICIPACION_MINIMA_MS / HORAS} h en el codigo vivo: ${corteVivo ? "si" : "NO"}`);

  if (r.cortos) {
    console.log(`VEREDICTO: roto — ${r.cortos} horario(s) a menos de 24 h; un prospecto no llega a cancelar`);
    if (r.divergencia) {
      // El lugar del arreglo, que casi nunca es el codigo: la rama ya elige bien y el contenedor no.
      console.log("  Y la rama NO lo ofreceria: el armador desplegado no aplica el corte — FALTA DESPLEGAR el bot.");
    }
  } else if (r.divergencia) {
    console.log("VEREDICTO: roto — hoy los horarios se sostienen, pero el contenedor y la rama arman pares DISTINTOS.");
    console.log("  Lo que el prospecto lee no es lo que mide la rama: cualquier verde sobre el resto es casualidad.");
    console.log("  Se cura desplegando el bot; hasta entonces este gate no puede firmar por produccion.");
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

  // ── EL PAR QUE SE JUZGA ES EL DEL CONTENEDOR. Anclado en el defecto vivo del 2026-09-25 03:50
  // La Paz: `run-turn.mjs` desplegado arma los slots con un `parseEnvSlots()` propio que recorta
  // los dos PRIMEROS y les pone `pending: false` fijo, sin pasar por `slotSostenible`. El bot
  // ofrecio el viernes a 17,1 h de aviso y este gate firmaba `ok` sobre el par que habria elegido
  // la rama. Los tres casos cubren las tres formas de esa mentira.
  const madrugada = Date.parse("2026-09-25T07:50:00Z"); // 03:50 La Paz
  const elViernes = "viernes 25 de septiembre, 21:00@2026-09-26T01:00:00Z"; // 17,1 h: caducado
  const elSabado26 = "sábado 26 de septiembre, 09:00@2026-09-26T13:00:00Z";
  const elLunes28 = "lunes 28 de septiembre, 14:00@2026-09-28T18:00:00Z";
  const cincoCandidatos = `${elViernes}|${elSabado26}|${elLunes28}`;
  /** Como los arma el contenedor: los dos primeros crudos, `pending: false` fijo. */
  const comoLosArmaElVivo = (spec) =>
    spec
      .split("|")
      .slice(0, 2)
      .map((part, i) => {
        const [label, startAt] = part.split("@");
        return { key: i === 0 ? "A" : "B", label, startAt, pending: false };
      });

  const delPar = [
    // El caso exacto del 2026-09-25: el vivo ofrece el caducado, la rama elegiria bien. Antes de
    // este arreglo `evaluar` ni miraba el par vivo y devolvia cortos: 0 / roto: false.
    [
      "juzga lo que OFRECE el contenedor, no lo que elegiria la rama",
      { raw: cincoCandidatos, slotsVivos: comoLosArmaElVivo(cincoCandidatos), corteVivo: true, now: madrugada },
      { roto: true, cortos: 1, divergencia: true },
    ],
    // El flag miente y el instante no: el vivo jura `pending: false` sobre un horario a 17 h.
    // Leer el campo en vez de recalcular con `slotSostenible` deja pasar esto en verde. El estado
    // tambien diverge —la rama lo marcaria `pending` y caeria a SIN_HORARIOS, el vivo lo ofrece
    // como firme—, y por eso `lineaCorto` afirma el recalculo por separado: si alguien vuelve a
    // leer `slot.pending`, este caso no puede quedar tapado por la divergencia.
    [
      "un `pending: false` fijo sobre un horario caducado sigue siendo CORTO",
      { raw: elViernes, slotsVivos: comoLosArmaElVivo(elViernes), corteVivo: true, now: madrugada },
      { roto: true, cortos: 1, divergencia: true, lineaCorto: true },
    ],
    // Los dos pares se sostienen y aun asi difieren: el prospecto no lee lo que la rama mide, y
    // cualquier verde sobre el resto es casualidad del valor servido.
    [
      "pares distintos aunque los dos se sostengan = rojo",
      {
        raw: `${elSabado26}|${elLunes28}`,
        slotsVivos: comoLosArmaElVivo(`${elLunes28}|${elSabado26}`),
        corteVivo: true,
        now: madrugada,
      },
      { roto: true, cortos: 0, divergencia: true },
    ],
    // Y el verde tiene que seguir existiendo: mismo par, sostenido, corte desplegado.
    [
      "el contenedor ofrece lo mismo que la rama = ok",
      {
        raw: `${elSabado26}|${elLunes28}`,
        slotsVivos: comoLosArmaElVivo(`${elSabado26}|${elLunes28}`),
        corteVivo: true,
        now: madrugada,
      },
      { roto: false, cortos: 0, divergencia: false },
    ],
  ];
  for (const [nombre, entrada, esperado] of delPar) {
    const r = evaluar(entrada);
    const ok =
      r.roto === esperado.roto &&
      r.cortos === esperado.cortos &&
      r.divergencia === esperado.divergencia &&
      (!esperado.lineaCorto || r.lineas.some((l) => l.includes("CORTO")));
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
