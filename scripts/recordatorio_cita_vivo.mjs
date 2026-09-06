#!/usr/bin/env node
// ¿La plataforma le AVISA a un paciente que mañana tiene turno? — medido de punta a punta.
//
// Por qué existe, y por qué no alcanzaba con lo que ya había:
//
//   El cron de recordatorios (*/15, run-onia-appointment-reminders.sh) escribe en su log
//   {"ok":true,"evaluadas":0,...} en cada corrida. Ese cero se lee IGUAL con el circuito
//   sano que con el circuito roto: si mañana se cae el SMTP, o el endpoint empieza a
//   devolver 401, o una migración renombra la columna de la marca, el log va a seguir
//   diciendo exactamente lo mismo. Un contador de cosas que pasan solas no se puede poner
//   rojo el día que no pasan. Medido el 2026-09-06: el log tenía 278 KB de `evaluadas:0`
//   y de ahí salió la conclusión "la plataforma nunca entregó un recordatorio a nadie",
//   que le costó al material de venta la frase «recordatorios de cita». El circuito estaba
//   entero; lo que faltaba eran citas.
//
//   Este script separa el CIRCUITO de los EVENTOS: siembra su propia cita, la hace pasar
//   por el cron de verdad y exige las TRES pruebas, que fallan en lugares distintos:
//
//     1. el cron la VIO         → evaluadas ≥ 1 y enviados24Email ≥ 1 (motor y filtros)
//     2. el motor lo ANOTÓ      → reminder24hSentAt escrito en la base (idempotencia)
//     3. el correo SALIÓ        → status=sent en el log de onia-mail (entrega real)
//
//   La 3 es la que nadie mira y la única que prueba entrega: la app da por "enviado" lo que
//   el SMTP aceptó, y aceptar no es entregar. El log de Postfix es append-only y trae el
//   250 del MX del destinatario — es el lado que ningún proceso nuestro puede reescribir.
//
// MANDA UN CORREO DE VERDAD (a una casilla nuestra, +qa-recordatorio). Es a demanda, no va
// a cron: cablearlo a uno manda un correo cada corrida.
//
//   node scripts/recordatorio_cita_vivo.mjs               # mide en producción (VPS)
//   node scripts/recordatorio_cita_vivo.mjs --self-check  # sólo la lógica del veredicto
//
// Salidas: 0 verde · 1 rojo · 2 NO MEDIDO (nunca verde cuando no pudo mirar).

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/** Org y doctor del banco de pruebas dental (zz-qa-clinica-chatbot). */
const ORG_QA = "cmsvyguui000001ril9vhxbn2";
const DOCTOR_QA = "cmsvz00vt000f01ri2nii94la";
/**
 * La casilla lleva el sello de la corrida (Gmail entrega todos los +alias a la misma
 * bandeja). NO es cosmético: con un destinatario fijo, el log del servidor guarda las
 * entregas de las corridas anteriores y este gate da VERDE leyendo la de ayer. Le pasó
 * en su primera corrida real, el 2026-09-06: entregó a las 09:39:35 y firmó verde con
 * la línea de las 09:37:25, porque Postfix entrega ~0,7 s DESPUÉS de que la app suelta
 * el correo y el log todavía no tenía la de ahora. Con el sello, la única línea que
 * puede aparecer es la de esta corrida.
 */
const casillaDe = (sello) => `oninteligenciaartificial+qa-recordatorio-${sello}@gmail.com`;
const APP_ENV = "/opt/onia-platform/app.env";
const URL_CRON = "https://app.onia.com.bo/api/cron/appointment-reminders";

/**
 * El veredicto, puro y sin red: separado a propósito para poder probarlo con casos que
 * NO tocan producción — incluido el que ya cumple, que es el único que caza un gate
 * escrito al revés (uno que sólo prueba sus rojos pasa igual estando roto).
 */
export function juzgar({ evaluadas, enviados24Email, marcaEnBase, entregaSmtp }) {
  if (!(evaluadas >= 1)) {
    return { ok: false, motivo: "el cron NO vio la cita: la ventana de 24 h no la alcanza o el filtro la descarta" };
  }
  if (!(enviados24Email >= 1)) {
    return { ok: false, motivo: "el cron la vio y no mandó nada (mirá omitidos/sinCupo/fallidos del JSON)" };
  }
  if (!marcaEnBase) {
    return { ok: false, motivo: "dijo enviado y NO escribió reminder24hSentAt: sin esa marca el paciente recibe el mismo aviso cada 15 min" };
  }
  if (!entregaSmtp) {
    return { ok: false, motivo: "el correo nunca salió del servidor: no hay línea de entrega en onia-mail para ese destinatario" };
  }
  if (entregaSmtp.estado !== "sent") {
    return { ok: false, motivo: `el servidor de correo NO entregó: status=${entregaSmtp.estado} — ${entregaSmtp.detalle}` };
  }
  return { ok: true, motivo: `entregado: ${entregaSmtp.detalle}` };
}

/**
 * Busca la entrega de ESTE destinatario en el log del servidor de correo. Se lee por
 * destinatario y no por message-id porque el id lo pone la app y no viaja en la respuesta
 * del cron. `to=<...>` aparece una vez por intento; nos quedamos con el último.
 */
export function buscarEntrega(logCrudo, destinatario) {
  const lineas = logCrudo.split("\n").filter((l) => l.includes(`to=<${destinatario}>`));
  if (lineas.length === 0) return null;
  const ultima = lineas[lineas.length - 1];
  const m = /status=(\w+)/.exec(ultima);
  return { estado: m ? m[1] : "desconocido", detalle: ultima.slice(-140).trim() };
}

/**
 * Postfix entrega DESPUÉS de que la app suelta el correo (0,7 s medidos), así que leer el
 * log una sola vez pregunta demasiado temprano. Se espera a que aparezca la línea de este
 * destinatario; si no aparece en `limiteMs`, se devuelve null y el veredicto es rojo — que
 * es lo honesto: nadie puede decir que el correo salió.
 */
export async function esperarEntrega(leerLog, destinatario, limiteMs = 20000, pasoMs = 1000) {
  const hasta = Date.now() + limiteMs;
  for (;;) {
    const hallado = buscarEntrega(leerLog(), destinatario);
    if (hallado || Date.now() >= hasta) return hallado;
    await new Promise((r) => setTimeout(r, pasoMs));
  }
}

const psql = (sql) =>
  execFileSync("docker", ["exec", "-i", "supabase-db", "psql", "-U", "postgres", "-d", "postgres", "-t", "-A", "-c", sql], {
    encoding: "utf8",
    input: "",
  }).trim();

async function medirEnProduccion() {
  // Sello propio de la corrida: el borrado se acota a ÉL, nunca a `zz-qa-%` suelto —
  // ese prefijo lo usan dos carriles y borrar por él se lleva el dato de prueba del otro.
  const sello = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const idPac = `zz-qa-recordatorio-${sello}-pac`;
  const idCita = `zz-qa-recordatorio-${sello}-cit`;
  const casilla = casillaDe(sello);

  let secret;
  try {
    secret = /^CRON_SECRET=(.*)$/m.exec(readFileSync(APP_ENV, "utf8"))?.[1]?.replace(/["\r]/g, "");
  } catch {
    console.log(`NO MEDIDO: no pude leer ${APP_ENV} (¿estás fuera del VPS?)`);
    return 2;
  }
  if (!secret) {
    console.log(`NO MEDIDO: ${APP_ENV} no tiene CRON_SECRET`);
    return 2;
  }

  try {
    psql("select 1");
  } catch {
    console.log("NO MEDIDO: no hay contenedor supabase-db acá");
    return 2;
  }

  try {
    // La cita nace a 24 h justas: la ventana del cron es [now+23 h, now+25 h].
    psql(
      `insert into public.patients (id,"organizationId",name,email,"emailOptOut","createdAt","updatedAt")` +
        ` values ('${idPac}','${ORG_QA}','zz-qa recordatorio ${sello}','${casilla}',false,now(),now());` +
        ` insert into public.appointments (id,"organizationId","patientId","doctorId","dateTime","durationMin",status,reason,"createdAt","updatedAt")` +
        ` values ('${idCita}','${ORG_QA}','${idPac}','${DOCTOR_QA}',(now() at time zone 'utc') + interval '24 hours',30,'PENDIENTE','${idCita}',now(),now());`
    );

    const crudo = execFileSync(
      "curl",
      ["-fsS", "--max-time", "120", "-H", `Authorization: Bearer ${secret}`, URL_CRON],
      { encoding: "utf8" }
    );
    const json = JSON.parse(crudo);
    const marcaEnBase = psql(`select "reminder24hSentAt" from public.appointments where id='${idCita}';`) !== "";
    const leerLog = () =>
      execFileSync("docker", ["logs", "onia-mail", "--since", "5m"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });

    const v = juzgar({
      evaluadas: json.evaluadas ?? 0,
      enviados24Email: json.enviados24Email ?? 0,
      marcaEnBase,
      entregaSmtp: await esperarEntrega(leerLog, casilla),
    });

    console.log(`cron: ${crudo.trim()}`);
    console.log(`marca en base (reminder24hSentAt): ${marcaEnBase ? "sí" : "NO"}`);
    console.log(v.ok ? `RECORDATORIO VIVO — ${v.motivo}` : `RECORDATORIO ROTO — ${v.motivo}`);
    return v.ok ? 0 : 1;
  } finally {
    // Siempre, incluso si algo explotó: un dato de prueba olvidado en producción le manda
    // un correo real a alguien mañana.
    try {
      psql(`delete from public.appointments where id='${idCita}'; delete from public.patients where id='${idPac}';`);
    } catch (e) {
      console.log(`OJO: no pude borrar ${idCita}/${idPac} — ${e.message.slice(0, 120)}`);
    }
  }
}

function selfCheck() {
  const entrega = { estado: "sent", detalle: "250 2.0.0 OK gsmtp" };
  const casos = [
    ["el caso que YA cumple da verde", { evaluadas: 1, enviados24Email: 1, marcaEnBase: true, entregaSmtp: entrega }, true],
    ["el cron no vio la cita", { evaluadas: 0, enviados24Email: 0, marcaEnBase: false, entregaSmtp: null }, false],
    ["la vio y no mandó nada", { evaluadas: 1, enviados24Email: 0, marcaEnBase: false, entregaSmtp: null }, false],
    ["dijo enviado y no marcó la base", { evaluadas: 1, enviados24Email: 1, marcaEnBase: false, entregaSmtp: entrega }, false],
    ["marcó la base y el correo no salió", { evaluadas: 1, enviados24Email: 1, marcaEnBase: true, entregaSmtp: null }, false],
    [
      "el servidor rebotó el correo",
      { evaluadas: 1, enviados24Email: 1, marcaEnBase: true, entregaSmtp: { estado: "bounced", detalle: "550 5.7.1" } },
      false,
    ],
  ];
  let malos = 0;
  for (const [nombre, entrada, esperado] of casos) {
    const ok = juzgar(entrada).ok === esperado;
    console.log(`  ${ok ? "ok  " : "FALLA"}  ${nombre}`);
    if (!ok) malos++;
  }
  // La lectura del log también se prueba: un `status=sent` de OTRO destinatario no puede
  // dar por entregado el nuestro.
  const log = [
    "postfix/smtp[1]: A1: to=<otro@gmail.com>, status=sent (250 OK)",
    "postfix/smtp[2]: B2: to=<yo@gmail.com>, status=deferred (conexión rechazada)",
  ].join("\n");
  const pares = [
    ["lee el estado del destinatario pedido", buscarEntrega(log, "yo@gmail.com")?.estado === "deferred"],
    ["no confunde con el correo de otro", buscarEntrega(log, "nadie@gmail.com") === null],
  ];
  for (const [nombre, ok] of pares) {
    console.log(`  ${ok ? "ok  " : "FALLA"}  ${nombre}`);
    if (!ok) malos++;
  }
  return malos;
}

/**
 * La espera es el arreglo del defecto que este gate tuvo en su primera corrida real, así
 * que se prueba: que encuentre la línea que llega TARDE (si no, el gate acusa en falso a
 * un circuito sano) y que se rinda cuando no llega nunca (si no, vuelve a colgarse de un
 * fósil y firma verde sin haber visto salir el correo).
 */
async function selfCheckEspera() {
  const linea = (dest) => `postfix/smtp[9]: C3: to=<${dest}>, status=sent (250 OK)`;
  let malos = 0;

  let vueltas = 0;
  const tardia = await esperarEntrega(() => (++vueltas < 3 ? "" : linea("yo@x.com")), "yo@x.com", 5000, 10);
  const ok1 = tardia?.estado === "sent" && vueltas >= 3;
  console.log(`  ${ok1 ? "ok  " : "FALLA"}  espera la entrega que aparece tarde`);
  if (!ok1) malos++;

  const nunca = await esperarEntrega(() => linea("otro@x.com"), "yo@x.com", 60, 10);
  const ok2 = nunca === null;
  console.log(`  ${ok2 ? "ok  " : "FALLA"}  se rinde (rojo) si el correo no sale nunca`);
  if (!ok2) malos++;

  return malos;
}

// Sin esta guarda, importar el módulo para probar `juzgar` dispararía docker exec y curl
// contra producción — y el process.exit mataría al que importa antes de su primera línea.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const codigo = process.argv.includes("--self-check")
    ? await (async () => {
        const malos = selfCheck() + (await selfCheckEspera());
        console.log(malos === 0 ? "SELF-CHECK: ok" : `SELF-CHECK: ${malos} FALLAN`);
        return malos === 0 ? 0 : 1;
      })()
    : await medirEnProduccion();
  process.exit(codigo);
}
