// Mantiene ONIA_BOT_SLOTS SIEMPRE con dos horarios futuros. Corre por cron.
//
// POR QUE EXISTE (2026-09-08). Los horarios de demo del bot son fechas ABSOLUTAS
// en webhook.env. Al 7-sep decian "miercoles 9" y "jueves 10": el dia 11 el bot
// volvia a decirle a TODO prospecto, en el primer mensaje, «justo ahora no tengo
// horarios libres» — exhibir una carencia en la primera frase, que es justo lo
// que la regla del 2026-08-20 prohibe en superficie de cliente.
//
// POR QUE NO CAL.COM, que era el plan. `resolveConfig()` sabe pedirle
// disponibilidad real, pero MEDIDO el 2026-09-08: `cal.onia.com.bo` NO es una
// instancia de Cal.com, es un redirect 302 a onia.com.bo/empezar. La llamada
// vuelve con HTML y `source: "error"`. Encenderlo no era configurar: era
// instalar y operar un servicio nuevo en un VPS que ya se saturo una vez.
// Esto resuelve el problema real —que los horarios caduquen— sin dependencias.
//
// Los dias y las horas NO se inventan: salen de `ventanas-de-atencion.mjs`, la
// MISMA fuente con la que el otro generador (`scripts/loops/renovar-slots-bot.py`)
// calcula y con la que el bot arma la coletilla que promete cuando atiende.
//
// ⚠️ Hasta el 2026-09-18 salian de `knowledge.json` (`empresa.horario`) con el
// motivo escrito al lado —"es el mismo dato que el bot ya usa"—, y era una
// hipotesis CON FECHA que vencio dos veces:
//   1. el 13-sep la disponibilidad se unifico en `ventanas-de-atencion.mjs` justo
//      porque habia dos copias contradiciendose, y la cura no viajo hasta aca;
//   2. medido el 2026-09-18 en el knowledge VIVO, `empresa.horario` es `null`, o
//      sea que la lectura caia SIEMPRE al default `[1..5]` y el archivo que este
//      decia seguir no tiene el dato. Fuente muerta con cara de viva.
// El efecto: este generador no podia ofrecer un sabado (09:00-15:00) ni una
// franja nocturna (20:00-22:00) NUNCA. Corridos los dos sobre el mismo instante
// —viernes 18-sep 09:43 La Paz— el .py daba "sábado 19, 10:00" y este "lunes 21,
// 14:00": dos dias de espera de diferencia escribiendo la MISMA variable.
//
// Uso:  node slots-rodantes.mjs [--escribir]
// Sin `--escribir` solo dice que haria. Con el flag toca webhook.env (con backup)
// y reinicia el webhook via watchdog.

import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

// La anticipacion NO se reimplementa aca: es la MISMA constante con la que el
// motor decide si ofrece un horario (`parseSlotsSpec`). Tenerla por duplicado es
// como nacio el bug que este archivo arrastraba — ver `siguenVigentes`.
import { ANTICIPACION_MINIMA_MS, parseSlotsSpec, slotsPending } from "./config.mjs";
// La disponibilidad tampoco se reimplementa: misma doctrina que la anticipacion.
import { franjasDeAtencion } from "./ventanas-de-atencion.mjs";

const ENV_FILE = process.env.ONIA_WEBHOOK_ENV_FILE || "/opt/onia/bot/webhook.env";
/** La Paz es UTC-4 todo el año (Bolivia no mueve la hora). */
const OFFSET_LA_PAZ = 4;
/**
 * Cuantos horarios se ESCRIBEN. El guion muestra dos (A y B), pero se generan de mas
 * a proposito: `parseSlotsSpec` elige los 2 que todavia se sostienen, asi que los
 * primeros se van cayendo solos a lo largo de la vigencia y siempre quedan dos enteros.
 *
 * Esto es lo que reemplaza al margen de VIGENCIA que este generador sumaba antes (ver
 * `proximosSlots`): en vez de alejar el primer horario para que aguante todo el dia, se
 * mandan candidatos para que el motor tenga de donde elegir. Cinco cubren la vigencia de
 * 24 h con sobra —en ese lapso caducan a lo sumo dos— y encima aguantan que el cron no
 * corra un dia. Misma doctrina que `scripts/loops/renovar-slots-bot.py`, el otro generador.
 */
const CUANTOS = 5;
/**
 * Cuanto se SIRVE lo que se escribe sin recalcularse: el periodo del cron que corre
 * este generador. No es un margen que se le sume al piso —eso ya se probo y le costaba
 * un dia de espera al prospecto—, es el plazo con el que `ponerDelDia` decide QUE HORA
 * del dia elegir para que el dia no se caiga de la oferta a mitad de camino.
 */
const VIGENCIA_MS = 24 * 3600_000;

const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const DIAS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];

// `diasHabiles()` vivia aca y se borro el 2026-09-18 junto con `HORA_LOCAL`: mientras
// siguiera exportando una disponibilidad propia, el proximo cambio la volvia a usar y el
// agujero reaparecia el mismo dia sin que nada se pusiera rojo.

/**
 * Los proximos `cuantos` dias habiles que el MOTOR va a poder ofrecer durante
 * toda la vigencia de lo que se escribe.
 *
 * El piso es `ahora + ANTICIPACION`, la regla que pidio Sergio Urcullo ("que se agenden
 * un dia antes"), y NO se le suma nada: antes llevaba ademas la VIGENCIA entera, y eso le
 * costaba al prospecto un dia completo de espera. Medido el 2026-09-17 09:15 La Paz: el
 * proceso vivo ofrecia "sábado 19, 09:00" teniendo el viernes 18 a las 14:00 —28 h de
 * aviso, dentro de la regla— disponible. El que escribia hoy recibia turno para pasado
 * manana.
 *
 * El margen existia por una razon real: lo escrito se sirve 24 h sin recalcularse, y con
 * el piso justo el primer prospecto del dia recibia sus 24 h y el ultimo, cero. Lo que lo
 * vuelve innecesario es generar de MAS (`CUANTOS`): el motor elige los 2 que todavia se
 * sostienen, asi que los de adelante se caen solos y el par sigue entero hasta el final de
 * la ventana. Se garantiza el mismo peor momento, sin alejar el primer horario.
 *
 * Lo que NO cambia: sigue prohibido escribir algo que el consumidor descarta. Antes se
 * pedia solo que el horario no hubiera pasado (`inicioUtc > ahora`) y el bot no lo ofrecia
 * igual — el log decia que se renovo y el prospecto leia que no hay horarios.
 */
export function proximosSlots(ahora = new Date(), cuantos = CUANTOS, franjas = franjasDeAtencion()) {
  const salida = [];
  const desde = ahora.getTime() + ANTICIPACION_MINIMA_MS;
  // Medianoche del dia LOCAL de hoy: a las 21:00 de La Paz ya es manana en UTC,
  // y sin esto el «a partir de manana» se corre un dia.
  const cursor = new Date(ahora.getTime() - OFFSET_LA_PAZ * 3600_000);
  cursor.setUTCHours(0, 0, 0, 0);
  for (let i = 1; salida.length < cuantos && i <= 21; i += 1) {
    // Se razona en hora LOCAL de principio a fin y recien al final se pasa a UTC.
    // El primer intento hacia al reves —tomaba medianoche UTC y le restaba 4 h para
    // ver el dia de la semana— y eso cae en el dia ANTERIOR: etiquetaba el sabado 12
    // como «viernes 12». Un nombre de dia equivocado manda al prospecto el dia que no es.
    const local = new Date(cursor);
    local.setUTCDate(local.getUTCDate() + i);
    // UN candidato por dia, igual que el .py: los de mas son para que el motor tenga
    // de donde elegir a lo largo de la vigencia, no para amontonar el mismo dia.
    const puesto = ponerDelDia(local, franjas[local.getUTCDay()] || [], desde, desde + VIGENCIA_MS);
    if (puesto) salida.push(puesto);
  }
  return salida;
}

/**
 * El horario del dia que el motor va a poder ofrecer durante MAS tiempo.
 *
 * La hora sale de la franja y no de una constante: la del sabado abre 09:00 y la
 * nocturna 20:00, asi que clavar 14:00 no era "la hora de la demo", era ofrecer un
 * horario fuera de la ventana o —lo que pasaba— descartar el dia entero.
 *
 * 🔴 Y de las horas de la franja NO siempre va la primera. Como se manda UN
 * candidato por dia, la hora elegida decide cuanto vive el DIA en la oferta, y la
 * mas temprana es tambien la primera en caerse: cuando se cae no se pierde un
 * horario, se pierde el dia entero y el prospecto salta al dia habil siguiente.
 * Medido en produccion el 2026-09-18 11:13 La Paz — el cron de las 06:23 habia
 * escrito "sábado 19, 11:00" (28,6 h de aviso, correcto al generarse) y cinco horas
 * despues ya no llegaba a 24 h: el bot le ofrecia LUNES 21 a quien escribia ese
 * viernes, con el sabado 19 a las 12:00, 13:00 y 14:00 libres, y prometiendole
 * "sáb 9:00-15:00" en la coletilla del MISMO mensaje.
 *
 * Asi que se elige por VIDA UTIL, en dos pasos:
 *   1. la hora mas TEMPRANA que aguanta toda la vigencia (`hastaElFinal`). Para los
 *      dias lejanos eso es el comienzo de la franja: no les cambia nada.
 *   2. si ninguna aguanta —solo pasa con el dia mas cercano, el que cruza el borde
 *      de la anticipacion—, la mas TARDIA que todavia entra, que es la que mantiene
 *      el dia ofrecible mas horas.
 * El paso 2 mueve el horario dentro del dia (el sabado pasa de 11:00 a 14:00) y eso
 * es barato; perder el dia cuesta el salto al siguiente, que hoy son dos dias.
 */
function ponerDelDia(local, delDia, desde, hastaElFinal) {
  let tardio = null;
  for (const [horaDesde, horaHasta] of delDia) {
    for (let hora = horaDesde; hora < horaHasta; hora += 1) {
      // hora + 4 puede pasar de 24 (la franja de las 20:00 cae al dia UTC siguiente):
      // Date.UTC lo resuelve solo, y la ETIQUETA sigue nombrando el dia LOCAL.
      const inicioUtc = new Date(Date.UTC(
        local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), hora + OFFSET_LA_PAZ, 0, 0,
      ));
      if (inicioUtc.getTime() < desde) continue; // el motor no lo ofreceria
      const etiqueta = `${DIAS[local.getUTCDay()]} ${local.getUTCDate()} de ${MESES[local.getUTCMonth()]}, ${String(hora).padStart(2, "0")}:00`;
      const puesto = { label: etiqueta, startAt: inicioUtc.toISOString().replace(".000Z", "Z") };
      if (inicioUtc.getTime() >= hastaElFinal) return puesto; // aguanta toda la vigencia
      tardio = puesto; // todavia no: me quedo con el ultimo que entre
    }
  }
  return tardio;
}

/** El formato exacto que parsea run-turn.mjs: `etiqueta@ISO`, separados por `|`. */
export function comoSpec(slots) {
  return slots.map((s) => `${s.label}@${s.startAt}`).join("|");
}

/**
 * ¿El spec que ya esta puesto lo puede OFRECER el bot ahora mismo? Si si, no se
 * toca nada.
 *
 * 🔴 La pregunta la contesta el MOTOR, no el reloj. Hasta el 2026-09-17 esto
 * pedia solo `t > ahora` ("son futuros") mientras `parseSlotsSpec` exige
 * `t >= ahora + ANTICIPACION_MINIMA_MS`. En esa banda de 24 h este script
 * escribia «VIGENTES: los horarios puestos todavia son futuros, no toco nada» y
 * el bot le decia a TODO prospecto «justo ahora no tengo horarios libres» — que
 * es EXACTAMENTE el fallo que este archivo se escribio para evitar (ver la
 * cabecera). Un generador que se declara innecesario justo el dia que hace
 * falta no falla ruidoso: falla en su propio log, diciendo que todo esta bien.
 */
export function siguenVigentes(spec, ahora = new Date()) {
  const partes = String(spec || "").split("|").filter(Boolean);
  if (!partes.length) return false;
  // Se le pregunta al MOTOR, literalmente: `parseSlotsSpec` elige los 2 que se sostienen
  // y `slotsPending` es lo que el guion consulta para decidir si ofrece. Reimplementar el
  // criterio aca es como nacio el bug de la cabecera — y desde que se generan candidatos
  // de mas, un `every` sobre TODOS pediria renovar por el primero que caduca, teniendo el
  // par entero. La pregunta correcta es la del prospecto: ¿hay dos para ofrecerle ahora?
  return !slotsPending({ slots: parseSlotsSpec(spec, { now: ahora }) || [] });
}

function main() {
  const escribir = process.argv.includes("--escribir");
  const ahora = new Date();
  const env = readFileSync(ENV_FILE, "utf8");
  const actual = (env.match(/^ONIA_BOT_SLOTS="?([^"\n]*)"?$/m) || [])[1] || "";

  if (siguenVigentes(actual, ahora)) {
    console.log("VIGENTES: los horarios puestos todavia son futuros, no toco nada.");
    console.log("  " + actual);
    return;
  }

  const nuevos = proximosSlots(ahora);
  const spec = comoSpec(nuevos);
  console.log("CADUCOS. Nuevos horarios:");
  for (const s of nuevos) console.log("  " + s.label + "  ->  " + s.startAt);

  if (!escribir) { console.log("\n(sin --escribir: no toque nada)"); return; }

  const ts = ahora.toISOString().replace(/[:.]/g, "-");
  copyFileSync(ENV_FILE, `${ENV_FILE}.bak-slots-${ts}`);
  const linea = `ONIA_BOT_SLOTS="${spec}"`;
  const nuevoEnv = /^ONIA_BOT_SLOTS=/m.test(env)
    ? env.replace(/^ONIA_BOT_SLOTS=.*$/m, linea)
    : `${env.replace(/\n*$/, "\n")}${linea}\n`;
  writeFileSync(ENV_FILE, nuevoEnv);
  console.log("webhook.env actualizado (backup: " + ENV_FILE + ".bak-slots-" + ts + ")");

  try {
    execFileSync("/opt/onia/bot/webhook-watchdog.sh", { stdio: "ignore" });
    console.log("webhook reiniciado por el watchdog.");
  } catch { console.log("AVISO: no pude reiniciar el webhook; corre webhook-server.sh restart."); }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
