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
// Los dias y las horas NO se inventan: salen de `knowledge.json`
// (`empresa.horario`), que es el mismo dato que el bot ya usa para decir cuando
// atiende. Si Sergio cambia el horario ahi, esto lo sigue.
//
// Uso:  node slots-rodantes.mjs [--escribir]
// Sin `--escribir` solo dice que haria. Con el flag toca webhook.env (con backup)
// y reinicia el webhook via watchdog.

import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

// La anticipacion NO se reimplementa aca: es la MISMA constante con la que el
// motor decide si ofrece un horario (`parseSlotsSpec`). Tenerla por duplicado es
// como nacio el bug que este archivo arrastraba — ver `siguenVigentes`.
import { ANTICIPACION_MINIMA_MS } from "./config.mjs";

const ENV_FILE = process.env.ONIA_WEBHOOK_ENV_FILE || "/opt/onia/bot/webhook.env";
const KNOWLEDGE = "/opt/onia/bot/knowledge.json";
/** La Paz es UTC-4 todo el año (Bolivia no mueve la hora). */
const OFFSET_LA_PAZ = 4;
/** Hora local de la demo. La misma que Sergio venia poniendo a mano. */
const HORA_LOCAL = Number(process.env.ONIA_SLOTS_HORA || 14);
/** Cuantos horarios ofrece el bot. El guion muestra dos: A y B. */
const CUANTOS = 2;
/**
 * Cuanto tiempo se SIRVE lo que se escribe sin volver a calcularse: el periodo
 * del cron (`41 11 * * * /opt/onia/bot/slots-run.sh`).
 *
 * Entra en el calculo porque la anticipacion se gasta sola mientras el valor
 * esta publicado: con el margen justo, el primer prospecto del dia recibia sus
 * 24 h y el ultimo, cero. Lo que se garantiza es el PEOR momento de la ventana.
 * Misma doctrina que `scripts/loops/renovar-slots-bot.py`, el otro generador.
 */
const VIGENCIA_MS = 24 * 60 * 60 * 1000;

const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const DIAS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];

/** Los dias habiles del negocio, del conocimiento publicado. 1=lunes … 5=viernes. */
function diasHabiles() {
  try {
    const k = JSON.parse(readFileSync(KNOWLEDGE, "utf8"));
    const dias = k?.empresa?.horario?.dias;
    if (Array.isArray(dias) && dias.length) return dias;
  } catch { /* sin archivo: el default de abajo */ }
  return [1, 2, 3, 4, 5];
}

/**
 * Los proximos `cuantos` dias habiles que el MOTOR va a poder ofrecer durante
 * toda la vigencia de lo que se escribe.
 *
 * El piso no es "manana": es `ahora + ANTICIPACION + VIGENCIA`. Antes se pedia
 * solo que el horario no hubiera pasado (`inicioUtc > ahora`), y con eso este
 * generador escribia horarios que el bot despues NO ofrece — `parseSlotsSpec`
 * los marca `pending` por debajo de las 24 h y el guion cae en M0_SIN_HORARIOS.
 * Generar algo que el consumidor descarta es peor que no generar nada: el log
 * dice que se renovo y el prospecto lee que no hay horarios.
 */
export function proximosSlots(ahora = new Date(), cuantos = CUANTOS, habiles = diasHabiles()) {
  const salida = [];
  const desde = ahora.getTime() + ANTICIPACION_MINIMA_MS + VIGENCIA_MS;
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
    if (!habiles.includes(local.getUTCDay())) continue;
    const inicioUtc = new Date(Date.UTC(
      local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), HORA_LOCAL + OFFSET_LA_PAZ, 0, 0,
    ));
    if (inicioUtc.getTime() < desde) continue; // el motor no lo ofreceria
    const etiqueta = `${DIAS[local.getUTCDay()]} ${local.getUTCDate()} de ${MESES[local.getUTCMonth()]}, ${String(HORA_LOCAL).padStart(2, "0")}:00`;
    salida.push({ label: etiqueta, startAt: inicioUtc.toISOString().replace(".000Z", "Z") });
  }
  return salida;
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
  const limite = ahora.getTime() + ANTICIPACION_MINIMA_MS;
  return partes.every((p) => {
    const iso = (p.split("@")[1] || "").trim();
    const t = Date.parse(iso);
    return Number.isFinite(t) && t >= limite;
  });
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
