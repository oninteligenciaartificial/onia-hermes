#!/usr/bin/env node
/**
 * probar_cancelar_cita.mjs — escalón 3: ¿el paciente puede CANCELAR su cita desde el portal
 * público, o sólo confirmarla?
 *
 * `PATCH /api/booking/appointments` acepta `action: "cancel"` (visto leyendo
 * onia-platform/app/api/booking/appointments/route.ts) igual que `action: "confirm"`. Pero
 * `/book/confirm/[token]/page.tsx` sólo pinta un botón "Confirmar asistencia" — ningún botón
 * de cancelar — y `/book/my-appointments/[token]/page.tsx` sólo tiene "llamar" y "reservar de
 * nuevo". Este script comprueba con HTTP real: (1) que la API SÍ cancela cuando se la llama
 * directo, y (2) que ninguna de las dos pantallas del portal ofrece ese camino.
 *
 *   node scripts/probar_cancelar_cita.mjs
 *
 * Limpia todo lo `zz-qa-` que crea, en la misma corrida (éxito o fallo).
 */
import { execFileSync } from "node:child_process";
import { cargarPlaywright } from "./lib/playwright-que-arranca.mjs";

const APP = "https://app.onia.com.bo";
const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-cancelarcita-${TS}`;
const EMAIL_DUENO = `zz-qa-cancelarcita-owner-${TS}@onia.com.bo`;
const NOMBRE_PACIENTE = `zz-qa-cancelarcita-${TS}-paciente`;
const TELEFONO = "76543212";
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

function mananaBolivia() {
  const ahora = new Date(Date.now() + 60 * 60 * 1000);
  const boliviaMs = ahora.getTime() - 4 * 60 * 60 * 1000;
  const b = new Date(boliviaMs);
  const manana = new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate() + 1));
  const iso = manana.toISOString().slice(0, 10);
  const jsDay = manana.getUTCDay();
  const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;
  return { iso, dayOfWeek };
}

let orgId = null;
let ownerUserId = null;
let appointmentId = null;
let patientId = null;

function limpiar() {
  console.log("\n--- LIMPIEZA ---");
  if (appointmentId) psqlSeguro(`delete from appointments where id='${appointmentId}'`);
  if (patientId) psqlSeguro(`delete from patients where id='${patientId}'`);
  if (orgId) {
    psqlSeguro(`delete from doctor_schedules where "organizationId"='${orgId}'`);
    psqlSeguro(`delete from clinic_settings where "organizationId"='${orgId}'`);
    psqlSeguro(`delete from organization_entitlements where "organizationId"='${orgId}'`);
    psqlSeguro(`delete from profiles where "organizationId"='${orgId}'`);
  }
  if (ownerUserId) psqlSeguro(`delete from auth.users where id='${ownerUserId}'`);
  if (orgId) psqlSeguro(`delete from organizations where id='${orgId}'`);
  const orgsRestantes = psqlSeguro(`select count(*) from organizations where name like 'zz-qa-%'`);
  const citasRestantes = psqlSeguro(
    `select count(*) from appointments where notes like 'zz-qa-%' or reason like 'zz-qa-%'`
  );
  console.log(`orgs zz-qa- restantes: ${orgsRestantes} | citas zz-qa- restantes: ${citasRestantes}`);
}

async function main() {
  const { iso: fecha, dayOfWeek } = mananaBolivia();
  console.log(`fecha de prueba: ${fecha} (dayOfWeek=${dayOfWeek})`);

  orgId = psql(
    `insert into organizations (id, name, slug, plan, "verticalTrackId", "onboardingCompletedAt",
       "trialEnd", "planEnd", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, 'ZZ QA Cancelar Cita ${TS}', '${SLUG}', 'professional',
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
     values (gen_random_uuid()::text, '${ownerUserId}', '${orgId}', 'ZZ QA Dueño Cancelar', '${EMAIL_DUENO}',
       'ADMIN', now(), now())
     returning id`
  );
  psql(
    `insert into clinic_settings (id, "organizationId", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${orgId}', now(), now())`
  );
  psql(
    `insert into doctor_schedules (id, "organizationId", "doctorId", "dayOfWeek", "startTime", "endTime", active, "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${orgId}', '${ownerProfileId}', ${dayOfWeek}, '09:00', '17:00', true, now(), now())`
  );

  const rDoctors = await fetch(`${APP}/api/booking/doctors?orgSlug=${SLUG}`);
  const jDoctors = await rDoctors.json().catch(() => null);
  const doctorId = jDoctors?.doctors?.[0]?.id;
  if (rDoctors.status !== 200 || !doctorId) {
    console.error(`FALLO en el insumo (doctors): ${rDoctors.status} ${JSON.stringify(jDoctors)}`);
    limpiar();
    process.exit(1);
  }
  const rSlots = await fetch(`${APP}/api/booking/slots?doctorId=${doctorId}&date=${fecha}`);
  const jSlots = await rSlots.json().catch(() => null);
  const slotLibre = (jSlots?.slots || []).find((s) => s.available);
  if (rSlots.status !== 200 || !slotLibre) {
    console.error(`FALLO en el insumo (slots): ${rSlots.status} ${JSON.stringify(jSlots)}`);
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
      reason: "zz-qa- control (cancelar cita)",
    }),
  });
  const jBook = await rBook.json().catch(() => null);
  if (rBook.status !== 201 || !jBook?.bookingToken) {
    console.error(`FALLO en el insumo (reservar): ${rBook.status} ${JSON.stringify(jBook)}`);
    limpiar();
    process.exit(1);
  }
  const bookingToken = jBook.bookingToken;
  appointmentId = psql(`select id from appointments where "bookingToken"='${bookingToken}'`);
  patientId = psql(`select id from patients where "organizationId"='${orgId}' and phone='${TELEFONO}'`);
  console.log("bookingToken real obtenido:", bookingToken, "| appointmentId:", appointmentId);

  // 1. MIRAR las dos pantallas del portal público: ¿ofrecen cancelar?
  const { chromium } = await cargarPlaywright();
  const navegador = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 }, locale: "es-BO" });

  const pageConfirm = await contexto.newPage();
  await pageConfirm.goto(`${APP}/book/confirm/${bookingToken}`, { waitUntil: "load", timeout: 30_000 }).catch((e) => {
    console.error("no pudo abrir confirm:", e.message);
  });
  await pageConfirm.waitForTimeout(2000);
  await pageConfirm.screenshot({ path: `${CAPTURAS}/extra-cancelarcita-00-confirm.png`, fullPage: true }).catch(() => {});
  const botonesConfirm = await pageConfirm.getByRole("button").allTextContents().catch(() => []);
  const linksConfirm = await pageConfirm.getByRole("link").allTextContents().catch(() => []);
  console.log("confirm — botones visibles:", JSON.stringify(botonesConfirm));
  console.log("confirm — links visibles:", JSON.stringify(linksConfirm));
  const ofreceCancelarEnConfirm = [...botonesConfirm, ...linksConfirm].some((t) => /cancel/i.test(t));
  await pageConfirm.close().catch(() => {});

  const pageMy = await contexto.newPage();
  await pageMy.goto(`${APP}/book/my-appointments/${bookingToken}`, { waitUntil: "load", timeout: 30_000 }).catch((e) => {
    console.error("no pudo abrir my-appointments:", e.message);
  });
  await pageMy.waitForTimeout(2000);
  await pageMy.screenshot({ path: `${CAPTURAS}/extra-cancelarcita-01-my-appointments.png`, fullPage: true }).catch(() => {});
  const botonesMy = await pageMy.getByRole("button").allTextContents().catch(() => []);
  const linksMy = await pageMy.getByRole("link").allTextContents().catch(() => []);
  console.log("my-appointments — botones visibles:", JSON.stringify(botonesMy));
  console.log("my-appointments — links visibles:", JSON.stringify(linksMy));
  const ofreceCancelarEnMy = [...botonesMy, ...linksMy].some((t) => /cancel/i.test(t));
  await pageMy.close().catch(() => {});
  await navegador.close().catch(() => {});

  // 2. Probar la API directo: ¿el motor SÍ sabe cancelar aunque nadie invite a hacerlo?
  const estadoAntes = psql(`select status from appointments where id='${appointmentId}'`);
  const rCancel = await fetch(`${APP}/api/booking/appointments`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: bookingToken, action: "cancel" }),
  });
  const jCancel = await rCancel.json().catch(() => null);
  const estadoDespues = psql(`select status from appointments where id='${appointmentId}'`);
  console.log(`PATCH action=cancel — status HTTP ${rCancel.status}, body: ${JSON.stringify(jCancel)}`);
  console.log(`status en base: antes='${estadoAntes}' después='${estadoDespues}'`);

  const apiCancelaDeVerdad = rCancel.status === 200 && estadoDespues === "CANCELADA";

  const hallazgos = [];
  if (apiCancelaDeVerdad && !ofreceCancelarEnConfirm && !ofreceCancelarEnMy) {
    hallazgos.push(
      "La API `/api/booking/appointments` PATCH acepta y ejecuta `action: 'cancel'` " +
        "(200, status pasa a CANCELADA en la base), pero NINGUNA de las dos pantallas del " +
        "portal público (`/book/confirm/[token]` ni `/book/my-appointments/[token]`) ofrece " +
        "un botón o link para cancelar — sólo confirmar, llamar o volver a reservar. Un " +
        "paciente que no puede asistir no tiene forma de avisarle al negocio desde el mismo " +
        "enlace que le mandaron para gestionar su cita; tiene que llamar."
    );
  }

  if (hallazgos.length > 0) {
    console.log("\nHALLAZGO:\n- " + hallazgos.join("\n- "));
    limpiar();
    process.exit(1);
  }

  console.log(
    "\nRESULTADO: la API cancela y/o el portal ya ofrece cancelar — sin hallazgo nuevo respecto " +
      "de lo esperado."
  );
  limpiar();
  process.exit(0);
}

main().catch((e) => {
  console.error("ERROR no manejado:", e);
  limpiar();
  process.exit(2);
});
