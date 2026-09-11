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
import { leerDeProduccion, VPS } from "./lib/vps-o-local.mjs";

/**
 * El sujeto se CREA, no se toma prestado — y esa es la diferencia entre un gate que mide
 * y uno que revienta.
 *
 * Hasta el 2026-09-11 esto eran dos ids de producción escritos a mano
 * (`ORG_QA = "cmsvyguui…"`, su doctor). Esa org figuraba como «borrable» en
 * `ONIA_INFRA_LIMPIEZA_Y_ORDEN.md` §5.1 y alguien la borró, con razón. Desde entonces el
 * `insert` moría con `violates foreign key constraint "patients_organizationId_fkey"`,
 * la excepción salía sin `catch` y el gate terminaba en **exit 1 — ROJO**: o sea el
 * instrumento que existe para probar que el recordatorio LLEGA pasó a acusar al producto
 * de no entregarlo. El falso rojo va en la dirección cara: manda a depurar un circuito
 * sano. Y nadie lo vio, porque la medición viva quedó de alias suelto y lo único cableado
 * a `npm test` es el `--self-check` puro, que no toca producción y sigue en verde.
 *
 * Pedir prestada una fila de producción tiene además una segunda forma de morir, más
 * silenciosa: que la fila siga existiendo y deje de CALIFICAR. El cron corta con
 * `isWriteBlocked(org)` (`app/api/cron/appointment-reminders/route.ts`), así que el día
 * que a la org prestada se le venza el plan el gate se pone rojo sobre un circuito que
 * está haciendo exactamente lo correcto.
 *
 * Un gate vivo tiene que ser DUEÑO de su sujeto: acá se crea una org sellada con la
 * corrida, se le pone un profesional, se mide, y el `finally` borra las cuatro filas en
 * orden de dependencia. Ninguna limpieza ajena puede volver a matarlo.
 */
const TRACK_CON_AGENDA = "dentagest-clinical";
/** Días de trial del sujeto: sólo tiene que estar vivo mientras dura la corrida. */
const TRIAL_DIAS = 7;
/**
 * El sujeto tiene que parecerse a un cliente REAL, no a una fila con los defaults de la
 * tabla. `/api/auth/register` crea toda org nueva con `TRIAL_PLAN` (`professional`,
 * `lib/subscription/plan-state.ts`), y las tres orgs vivas de producción lo tienen.
 *
 * No es un detalle: el default de la columna es `free`, y `free` trae `emailsPerMonth: 0`
 * (`lib/plan-catalogo.ts`), así que un sujeto con los defaults hace que el cron descarte la
 * cita por `sinCupo` y el gate cante "el recordatorio no llega" sobre un circuito sano. Se
 * midió el 2026-09-11 con la primera versión de este sembrado: `evaluadas:1, sinCupo:1`.
 */
const PLAN_DEL_SUJETO = "professional";
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
export function juzgar({ evaluadas, enviados24Email, marcaEnBase, entregaSmtp, sinCupo = 0 }) {
  if (!(evaluadas >= 1)) {
    return { ok: false, motivo: "el cron NO vio la cita: la ventana de 24 h no la alcanza o el filtro la descarta" };
  }
  // El cupo mensual de correo es una PRECONDICIÓN del sujeto, no el circuito de entrega:
  // agotado, el cron descarta la cita antes de intentar mandar nada, así que nadie puede
  // decir si el correo llega. Cobrarlo como rojo acusa al producto de no entregar cuando
  // lo que pasó es que este gate no pudo ejercerlo — el falso rojo va en la dirección cara.
  if (enviados24Email === 0 && sinCupo >= 1) {
    return {
      ok: false,
      noMedido: true,
      motivo: "el cupo mensual de correo del sujeto está agotado: el cron descartó la cita antes de intentar entregar",
    };
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
 * ¿El producto consideraría VIVA a esta cuenta? Espejo de `planAccessLevel(...) === "full"`
 * (`lib/subscription/plan-state.ts` de onia-platform), que es la MISMA pregunta que le hace
 * el cron con `isWriteBlocked` antes de mandar un recordatorio.
 *
 * Se pregunta sobre la org que este gate acaba de crear, y no es ceremonia: si un cambio
 * del producto endurece esa regla, el sujeto sembrado deja de calificar y el cron lo
 * descarta con `cuenta-vencida` — o sea el gate se pondría ROJO acusando al circuito de no
 * entregar, cuando el circuito estaría haciendo justo lo correcto. Pasó de verdad: el
 * 2026-09-11 el cron sumó ese corte (`278f030`) y ningún instrumento se enteró. Con esta
 * pregunta, el desajuste sale como NO MEDIDO y dice que el fixture quedó viejo.
 *
 * La gracia post-vencimiento NO se replica a propósito: acá sólo hace falta reconocer un
 * sujeto que esté limpiamente vivo. Ser MÁS estricto que el producto puede costar un NO
 * MEDIDO de más; ser más laxo firmaría un rojo falso, que es lo caro.
 */
export function cuentaViva({ planEnd, trialEnd, planCanceledAt }, ahora) {
  if (planCanceledAt && planCanceledAt.getTime() <= ahora.getTime()) return false;
  if (planEnd) return planEnd.getTime() >= ahora.getTime();
  if (trialEnd) return trialEnd.getTime() >= ahora.getTime();
  return true;
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
  const idOrg = `zz-qa-recordatorio-${sello}-org`;
  const idDoc = `zz-qa-recordatorio-${sello}-doc`;
  const idPac = `zz-qa-recordatorio-${sello}-pac`;
  const idCita = `zz-qa-recordatorio-${sello}-cit`;
  const casilla = casillaDe(sello);

  // Del disco local si está, y si no se lo preguntamos al VPS por SSH: este gate se
  // quedó ciego el día que el loop se mudó a nodo-casa, donde `/opt` no existe.
  let secret;
  const appEnv = leerDeProduccion(APP_ENV);
  if (appEnv === null) {
    console.log(`NO MEDIDO: no pude leer ${APP_ENV} ni en el disco ni en ${VPS}`);
    return 2;
  }
  secret = /^CRON_SECRET=(.*)$/m.exec(appEnv.contenido)?.[1]?.replace(/["\r]/g, "");
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
    // El sujeto entero es de esta corrida: org, profesional, paciente y cita. La org nace
    // en un rubro CON agenda y con trial vigente — si naciera vencida, el cron la
    // descartaría con `cuenta-vencida` y el gate diría "no entregó" sobre un circuito sano.
    // La cita nace a 24 h justas: la ventana del cron es [now+23 h, now+25 h].
    //
    // Sembrar es PREPARAR, no medir: si falla, este gate no puede opinar del circuito y
    // lo dice (2). Dejarlo reventar es como se rompió antes — una excepción sin `catch`
    // sale con código 1, que se lee "el recordatorio no llega" y manda a arreglar el
    // producto.
    try {
      psql(
      `insert into public.organizations (id,name,slug,plan,"verticalTrackId","trialEnd","createdAt","updatedAt")` +
        ` values ('${idOrg}','ZZ QA recordatorio ${sello}','${idOrg}','${PLAN_DEL_SUJETO}','${TRACK_CON_AGENDA}',now() + interval '${TRIAL_DIAS} days',now(),now());` +
        ` insert into public.profiles (id,"userId","organizationId",name,role,"createdAt","updatedAt")` +
        ` values ('${idDoc}','${idDoc}','${idOrg}','zz-qa profesional ${sello}','DOCTOR',now(),now());` +
        ` insert into public.patients (id,"organizationId",name,email,"emailOptOut","createdAt","updatedAt")` +
        ` values ('${idPac}','${idOrg}','zz-qa recordatorio ${sello}','${casilla}',false,now(),now());` +
        ` insert into public.appointments (id,"organizationId","patientId","doctorId","dateTime","durationMin",status,reason,"createdAt","updatedAt")` +
        ` values ('${idCita}','${idOrg}','${idPac}','${idDoc}',(now() at time zone 'utc') + interval '24 hours',30,'PENDIENTE','${idCita}',now(),now());`
      );
    } catch (e) {
      console.log(`NO MEDIDO: no pude sembrar el sujeto en producción — ${e.message.slice(0, 200)}`);
      return 2;
    }

    // La org recién sembrada tiene que estar viva SEGÚN LA REGLA DEL PRODUCTO, no según
    // lo que este archivo cree haber escrito. Si el producto endureció el corte, esto sale
    // NO MEDIDO y nombra el desajuste, en vez de un rojo que acusa al circuito.
    const [pe, te, pc] = psql(
      `select coalesce("planEnd"::text,''), coalesce("trialEnd"::text,''), coalesce("planCanceledAt"::text,'') from public.organizations where id='${idOrg}';`
    ).split("|");
    const fecha = (s) => (s ? new Date(`${s.replace(" ", "T")}Z`) : null);
    if (!cuentaViva({ planEnd: fecha(pe), trialEnd: fecha(te), planCanceledAt: fecha(pc) }, new Date())) {
      console.log(
        `NO MEDIDO: la org sembrada (${idOrg}) no califica como cuenta viva — el fixture quedó viejo frente a la regla del producto (planAccessLevel/isWriteBlocked).`
      );
      return 2;
    }

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
      sinCupo: json.sinCupo ?? 0,
      marcaEnBase,
      entregaSmtp: await esperarEntrega(leerLog, casilla),
    });

    console.log(`cron: ${crudo.trim()}`);
    console.log(`marca en base (reminder24hSentAt): ${marcaEnBase ? "sí" : "NO"}`);
    if (v.noMedido) {
      console.log(`NO MEDIDO: ${v.motivo}`);
      return 2;
    }
    console.log(v.ok ? `RECORDATORIO VIVO — ${v.motivo}` : `RECORDATORIO ROTO — ${v.motivo}`);
    return v.ok ? 0 : 1;
  } finally {
    // Siempre, incluso si algo explotó: un dato de prueba olvidado en producción le manda
    // un correo real a alguien mañana. Se borran las CUATRO filas en orden de dependencia
    // (cita → paciente → profesional → org); el borrado sigue acotado al sello de ESTA
    // corrida y nunca a `zz-qa-%` suelto, que es de dos carriles.
    try {
      psql(
        `delete from public.appointments where id='${idCita}';` +
          ` delete from public.patients where id='${idPac}';` +
          ` delete from public.profiles where id='${idDoc}';` +
          ` delete from public.organizations where id='${idOrg}';`
      );
    } catch (e) {
      console.log(`OJO: no pude borrar el sujeto ${sello} — ${e.message.slice(0, 160)}`);
    }
  }
}

function selfCheck() {
  const entrega = { estado: "sent", detalle: "250 2.0.0 OK gsmtp" };
  const casos = [
    ["el caso que YA cumple da verde", { evaluadas: 1, enviados24Email: 1, marcaEnBase: true, entregaSmtp: entrega }, true],
    ["el cron no vio la cita", { evaluadas: 0, enviados24Email: 0, marcaEnBase: false, entregaSmtp: null }, false],
    // Sin cupo NO es rojo: es NO MEDIDO, y se prueba aparte más abajo.
    ["sin cupo no da verde", { evaluadas: 1, enviados24Email: 0, sinCupo: 1, marcaEnBase: false, entregaSmtp: null }, false],
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

  // La diferencia entre "no entregó" (rojo, culpa del producto) y "no pude ejercerlo"
  // (NO MEDIDO, culpa de mi sujeto). Las dos direcciones, porque cobrar de más acusa a un
  // circuito sano y cobrar de menos deja pasar un defecto real.
  const trios = [
    ["sin cupo se declara NO MEDIDO", { evaluadas: 1, enviados24Email: 0, sinCupo: 1, marcaEnBase: false, entregaSmtp: null }, true],
    ["no mandar SIN excusa de cupo sigue siendo ROJO", { evaluadas: 1, enviados24Email: 0, sinCupo: 0, marcaEnBase: false, entregaSmtp: null }, false],
    ["un cupo agotado ajeno no tapa una entrega que SÍ salió", { evaluadas: 1, enviados24Email: 1, sinCupo: 1, marcaEnBase: true, entregaSmtp: entrega }, false],
  ];
  for (const [nombre, entrada, esperado] of trios) {
    const ok = (juzgar(entrada).noMedido === true) === esperado;
    console.log(`  ${ok ? "ok  " : "FALLA"}  ${nombre}`);
    if (!ok) malos++;
  }

  // `cuentaViva` decide si el sujeto sembrado califica para el cron. El caso que YA
  // cumple va primero a propósito: un guardia que sólo prueba sus rojos pasa igual estando
  // roto.
  const ahora = new Date("2026-09-11T12:00:00Z");
  const d = (iso) => new Date(iso);
  const vivas = [
    ["trial vigente = viva", { planEnd: null, trialEnd: d("2026-09-18T00:00:00Z"), planCanceledAt: null }, true],
    ["plan pago vigente = viva", { planEnd: d("2026-10-01T00:00:00Z"), trialEnd: null, planCanceledAt: null }, true],
    ["trial vencido = NO viva", { planEnd: null, trialEnd: d("2026-09-01T00:00:00Z"), planCanceledAt: null }, false],
    ["plan vencido = NO viva", { planEnd: d("2026-09-10T00:00:00Z"), trialEnd: null, planCanceledAt: null }, false],
    // Manda `planEnd`: un contrato pago corta el día que vence aunque su trial siga vivo.
    ["plan vencido pesa más que el trial vivo", { planEnd: d("2026-09-10T00:00:00Z"), trialEnd: d("2026-12-01T00:00:00Z"), planCanceledAt: null }, false],
    ["cancelada = NO viva", { planEnd: d("2026-10-01T00:00:00Z"), trialEnd: null, planCanceledAt: d("2026-09-05T00:00:00Z") }, false],
  ];
  for (const [nombre, entrada, esperado] of vivas) {
    const ok = cuentaViva(entrada, ahora) === esperado;
    console.log(`  ${ok ? "ok  " : "FALLA"}  ${nombre}`);
    if (!ok) malos++;
  }

  // El ancla del arreglo del 2026-09-11: este gate NO puede volver a nombrar una fila de
  // producción por id. Sin este caso, reponer un `const ORG_QA = "cm…"` deja todo en verde
  // y el gate vuelve a morir —en ROJO— el día que alguien borre esa fila.
  // Se mide sobre el código SIN comentarios: si no, la bitácora que explica el defecto se
  // acusaría a sí misma y habría que borrar el registro de lo que pasó.
  const fuente = readFileSync(new URL(import.meta.url), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^[ \t]*\/\/.*$/gm, " ");
  const idsAMano = fuente.match(/['"`]c[a-z0-9]{20,}['"`]/g) ?? [];
  const sinIds = idsAMano.length === 0;
  console.log(`  ${sinIds ? "ok  " : "FALLA"}  no nombra ninguna fila de producción por id${sinIds ? "" : ` (${idsAMano.join(", ")})`}`);
  if (!sinIds) malos++;
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
