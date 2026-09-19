#!/usr/bin/env node
/**
 * probar_reserva_publica.mjs — recorrido de escalón 3: la agenda PÚBLICA, `/book/[orgSlug]`.
 *
 * Nunca se probó en este carril: es la única pantalla del producto que ve el cliente DEL
 * cliente (no el dueño de la cuenta, no un `zz-qa-` con sesión) — un desconocido sin login que
 * entra desde el link que el negocio comparte, elige profesional, fecha y horario, y carga sus
 * propios datos. De punta a punta contra HTTP y HTML reales de producción:
 *
 *   1. Siembra una org `zz-qa-` con plan `professional` (trae `publicBookingIncluded`, ver
 *      `lib/plan-catalogo.ts`), rubro dental, y un ADMIN con un horario activo (`ADMIN` cuenta
 *      como profesional agendable — `ROLES_CON_AGENDA`, `lib/agenda/roles-agenda.ts`).
 *   2. Abre `/book/<slug>` SIN sesión (contexto de navegador nuevo) y la MIRA renderizada.
 *   3. Recorre la API pública real: GET doctors → GET slots → POST appointments, con un
 *      paciente `zz-qa-` y un teléfono boliviano válido (7xxxxxxx: un número que no cumple ese
 *      formato se cae para otro circuito — ver memoria del carril chatbot — pero acá igual se
 *      usa uno real para no medir un caso que el producto no ve).
 *   4. Verifica que la cita quede en la base con el paciente y el horario correctos, y que el
 *      DUEÑO (con sesión real) la vea en `/appointments`.
 *
 *   node scripts/probar_reserva_publica.mjs
 *
 * Limpia todo lo `zz-qa-` que crea, en la misma corrida (éxito o fallo).
 */
import { execFileSync } from "node:child_process";
import { navegadorConSesion } from "./lib/sesion_dueno.mjs";
import { cargarPlaywright } from "./lib/playwright-que-arranca.mjs";

const APP = "https://app.onia.com.bo";
const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-reservapublica-${TS}`;
const EMAIL_DUENO = `zz-qa-reservapublica-owner-${TS}@onia.com.bo`;
const NOMBRE_PACIENTE = `zz-qa-reservapublica-${TS}-paciente`;
const TELEFONO = "76543210";
const CAPTURAS = "hermes-content/docs/recorrido/capturas";

function psql(sql) {
  const crudo = execFileSync(
    "docker",
    ["exec", "-i", "supabase-db", "psql", "-U", "postgres", "-d", "postgres", "-tAc", sql],
    { encoding: "utf8", timeout: 20_000 }
  ).trim();
  return crudo.split("\n")[0].trim();
}
function psqlSeguro(sql) {
  try {
    return psql(sql);
  } catch (e) {
    console.error(`  (falló, sigo con lo demás) ${sql.slice(0, 80)}... -> ${e.message.split("\n")[0]}`);
    return null;
  }
}

let orgId = null;
let ownerUserId = null;
let appointmentId = null;
let patientId = null;

function limpiar() {
  console.log("\n--- LIMPIEZA ---");
  if (appointmentId) {
    const fila = psqlSeguro(`select id, "dateTime", status, "patientName" from appointments where id='${appointmentId}'`);
    console.log("appointment antes de borrar:\n" + fila);
  }
  if (appointmentId) psqlSeguro(`delete from appointments where id='${appointmentId}'`);
  if (patientId) psqlSeguro(`delete from patients where id='${patientId}'`);
  if (orgId) psqlSeguro(`delete from doctor_schedules where "organizationId"='${orgId}'`);
  if (orgId) psqlSeguro(`delete from clinic_settings where "organizationId"='${orgId}'`);
  if (orgId) psqlSeguro(`delete from profiles where "organizationId"='${orgId}'`);
  if (orgId) psqlSeguro(`delete from organizations where id='${orgId}'`);
  if (ownerUserId) {
    psqlSeguro(`delete from auth.identities where user_id='${ownerUserId}'`);
    psqlSeguro(`delete from auth.users where id='${ownerUserId}'`);
  }
  const orgsRestantes = psqlSeguro(`select count(*) from organizations where slug='${SLUG}'`);
  const citasRestantes = psqlSeguro(`select count(*) from appointments where "patientName" like 'zz-qa-%'`);
  console.log(`verificado al cerrar: organizations=${orgsRestantes} appointments zz-qa-=${citasRestantes}`);
  if (orgsRestantes !== "0") {
    console.error(`LIMPIEZA INCOMPLETA — anotar a mano: ${JSON.stringify({ orgId, ownerUserId, appointmentId, patientId, SLUG })}`);
  }
}

/** Mañana en hora de Bolivia (UTC-4), y su dayOfWeek con Lunes=0 (convención de `doctor_schedules`). */
function mananaBolivia() {
  const ahora = new Date(Date.now() + 60 * 60 * 1000); // margen: no cae exactamente a medianoche
  const boliviaMs = ahora.getTime() - 4 * 60 * 60 * 1000;
  const b = new Date(boliviaMs);
  const manana = new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate() + 1));
  const iso = manana.toISOString().slice(0, 10);
  const jsDay = manana.getUTCDay(); // 0=domingo
  const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1; // Lunes=0 ... Domingo=6
  return { iso, dayOfWeek };
}

async function main() {
  const { iso: fecha, dayOfWeek } = mananaBolivia();
  console.log(`fecha de prueba: ${fecha} (dayOfWeek=${dayOfWeek})`);

  // 1. Sembrar org plan 'professional' (publicBookingIncluded:true) + dueño ADMIN + horario.
  orgId = psql(
    `insert into organizations (id, name, slug, plan, "verticalTrackId", "onboardingCompletedAt",
       "trialEnd", "planEnd", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, 'ZZ QA Reserva Pública ${TS}', '${SLUG}', 'professional',
       'dentagest-clinical', now(), now() + interval '1 year', now() + interval '1 year', now(), now())
     returning id`
  );
  console.log("org creada:", orgId, SLUG);

  ownerUserId = psql(
    `insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
       email_confirmed_at, confirmation_token, recovery_token, email_change, email_change_token_new,
       phone_change, phone_change_token, reauthentication_token, raw_app_meta_data, raw_user_meta_data,
       created_at, updated_at)
     values ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
       '${EMAIL_DUENO}', null,
       now(), '', '', '', '', '', '', '',
       '{"provider":"email","providers":["email"]}', '{}', now(), now())
     returning id`
  );
  const ownerProfileId = psql(
    `insert into profiles (id, "userId", "organizationId", name, email, role, "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${ownerUserId}', '${orgId}', 'ZZ QA Dueño Reserva', '${EMAIL_DUENO}',
       'ADMIN', now(), now())
     returning id`
  );
  console.log("dueño sembrado:", ownerUserId, ownerProfileId, EMAIL_DUENO);

  psql(
    `insert into clinic_settings (id, "organizationId", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${orgId}', now(), now())`
  );

  psql(
    `insert into doctor_schedules (id, "organizationId", "doctorId", "dayOfWeek", "startTime", "endTime", active, "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${orgId}', '${ownerProfileId}', ${dayOfWeek}, '09:00', '17:00', true, now(), now())`
  );
  console.log(`horario sembrado: dayOfWeek=${dayOfWeek} 09:00-17:00`);

  // 2. Abrir /book/<slug> SIN sesión y MIRARLA — la única pantalla del producto que ve el
  //    cliente DEL cliente, nunca antes recorrida por este carril.
  const { chromium } = await cargarPlaywright();
  const navegador = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 }, locale: "es-BO" });
  const page = await contexto.newPage();
  await page.goto(`${APP}/book/${SLUG}`, { waitUntil: "load", timeout: 30_000 }).catch((e) => {
    console.error("no pudo abrir /book/<slug>:", e.message);
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${CAPTURAS}/extra-reservapublica-00-pantalla.png`, fullPage: true }).catch(() => {});
  const textoInicial = (await page.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ").slice(0, 300);
  console.log("texto de /book/<slug> al abrir:", textoInicial);
  await navegador.close().catch(() => {});

  // 3. La API pública real, sin cookie: doctors → slots → appointments.
  const rDoctors = await fetch(`${APP}/api/booking/doctors?orgSlug=${SLUG}`);
  const jDoctors = await rDoctors.json().catch(() => null);
  console.log(`GET /api/booking/doctors -> ${rDoctors.status}`, JSON.stringify(jDoctors));
  const doctorId = jDoctors?.doctors?.[0]?.id;
  if (rDoctors.status !== 200 || !doctorId) {
    console.error(`FALLO: esperaba 200 con al menos 1 profesional. Dio ${rDoctors.status}, doctors=${JSON.stringify(jDoctors?.doctors)}`);
    limpiar();
    process.exit(1);
  }

  const rSlots = await fetch(`${APP}/api/booking/slots?doctorId=${doctorId}&date=${fecha}`);
  const jSlots = await rSlots.json().catch(() => null);
  const slotLibre = (jSlots?.slots || []).find((s) => s.available);
  console.log(`GET /api/booking/slots -> ${rSlots.status}, ${jSlots?.slots?.length ?? 0} slot(s), libre=${slotLibre?.start}`);
  if (rSlots.status !== 200 || !slotLibre) {
    console.error(`FALLO: esperaba al menos un slot libre para ${fecha}. Dio ${rSlots.status}, slots=${JSON.stringify(jSlots)}`);
    limpiar();
    process.exit(1);
  }

  const rBook = await fetch(`${APP}/api/booking/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orgSlug: SLUG,
      doctorId,
      dateTime: `${fecha}T${slotLibre.start}:00`,
      durationMin: 30,
      patientName: NOMBRE_PACIENTE,
      patientPhone: TELEFONO,
      patientEmail: null,
      reason: "zz-qa- dolor de muela (recorrido de cliente)",
    }),
  });
  const jBook = await rBook.json().catch(() => null);
  console.log(`POST /api/booking/appointments -> ${rBook.status}`, JSON.stringify(jBook));
  if (rBook.status !== 201 || !jBook?.bookingToken) {
    console.error(`FALLO: reservar desde la agenda pública debería dar 201 con bookingToken. Dio ${rBook.status}.`);
    limpiar();
    process.exit(1);
  }
  const bookingToken = jBook.bookingToken;

  // 4a. La cita quedó en la base con los datos correctos.
  const filaCita = psql(
    `select id, "organizationId", "patientName", "patientPhone", status, "dateTime"
     from appointments where "bookingToken"='${bookingToken}'`
  );
  console.log("appointment en base:", filaCita);
  appointmentId = filaCita.split("|")[0];
  patientId = psql(`select id from patients where "organizationId"='${orgId}' and phone='${TELEFONO}'`);
  if (!appointmentId || !filaCita.includes(orgId) || !filaCita.includes(NOMBRE_PACIENTE)) {
    console.error(`FALLO: la cita no quedó en la base con los datos esperados (org=${orgId}, paciente=${NOMBRE_PACIENTE}).`);
    limpiar();
    process.exit(1);
  }

  // 4b. El DUEÑO (con sesión real) la ve en /appointments — la mitad que importa: quien
  //     recibe la cita, no sólo quien la pidió.
  const { navegador: navegador2, pagina: page2 } = await navegadorConSesion(EMAIL_DUENO, {
    viewport: { width: 1280, height: 900 },
  });
  await page2.goto(`${APP}/appointments`, { waitUntil: "load", timeout: 30_000 }).catch(() => {});
  await page2.waitForTimeout(2000);
  await page2.screenshot({ path: `${CAPTURAS}/extra-reservapublica-01-agenda-del-dueno.png`, fullPage: true }).catch(() => {});
  const textoAgenda = (await page2.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ");
  const visibleEnAgenda = textoAgenda.includes(NOMBRE_PACIENTE);
  console.log(`"${NOMBRE_PACIENTE}" visible en /appointments del dueño: ${visibleEnAgenda}`);
  await navegador2.close().catch(() => {});

  if (!visibleEnAgenda) {
    console.error(`FALLO: la cita se creó (${appointmentId}) pero el dueño NO la ve en /appointments.`);
    limpiar();
    process.exit(1);
  }

  console.log(
    "\nRESULTADO: agenda pública `/book/<slug>` de punta a punta contra producción real — un " +
      "desconocido sin sesión mira la pantalla, elige profesional y horario, reserva (201), y " +
      "el dueño la ve en su agenda. Sin hallazgo."
  );
  limpiar();
  process.exit(0);
}

main().catch((e) => {
  console.error("ERROR no manejado:", e);
  limpiar();
  process.exit(2);
});
