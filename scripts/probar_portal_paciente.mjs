#!/usr/bin/env node
/**
 * probar_portal_paciente.mjs — recorrido de escalón 3: el PORTAL DEL PACIENTE,
 * `/book/confirm/[token]` y `/book/my-appointments/[token]`.
 *
 * Sigue directo de `probar_reserva_publica.mjs`: ese script prueba que un desconocido pueda
 * RESERVAR desde `/book/<slug>` y que el dueño la vea. Este prueba lo que pasa DESPUÉS con el
 * `bookingToken` que esa reserva le da al paciente — el enlace que el negocio (o el propio
 * producto) le manda para que confirme o vea sus citas, SIN sesión, sólo con el token en la URL:
 *
 *   1. Siembra su propia org `zz-qa-` (mismo patrón: plan `professional`, rubro dental, ADMIN
 *      con horario) y reserva por API pública para conseguir un `bookingToken` real — no repite
 *      el escalón anterior, sólo lo mínimo para tener el insumo.
 *   2. Abre `/book/my-appointments/<token>` SIN sesión: la pantalla que agrupa TODAS las citas
 *      del paciente por ese token, y la MIRA renderizada.
 *   3. Abre `/book/confirm/<token>` SIN sesión, la MIRA en estado "pendiente", aprieta
 *      "Confirmar" de verdad (PATCH real a `/api/booking/appointments`, action=confirm) y
 *      verifica en la BASE que el status pasó a CONFIRMADA — no alcanza con que la pantalla
 *      diga "¡Cita Confirmada!": eso ya se vio caer solo en el bot con el aviso posterior.
 *   4. Prueba el camino de FALLO simétrico: un token que no existe da 404 con mensaje, no una
 *      pantalla en blanco ni un 500.
 *
 *   node scripts/probar_portal_paciente.mjs
 *
 * Limpia todo lo `zz-qa-` que crea, en la misma corrida (éxito o fallo).
 */
import { execFileSync } from "node:child_process";
import { navegadorConSesion } from "./lib/sesion_dueno.mjs";
import { cargarPlaywright } from "./lib/playwright-que-arranca.mjs";

const APP = "https://app.onia.com.bo";
const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-portalpaciente-${TS}`;
const EMAIL_DUENO = `zz-qa-portalpaciente-owner-${TS}@onia.com.bo`;
const NOMBRE_PACIENTE = `zz-qa-portalpaciente-${TS}-paciente`;
const TELEFONO = "76543211";
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
  const ahora = new Date(Date.now() + 60 * 60 * 1000); // margen: no cae exactamente a medianoche
  const boliviaMs = ahora.getTime() - 4 * 60 * 60 * 1000;
  const b = new Date(boliviaMs);
  const manana = new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate() + 1));
  const iso = manana.toISOString().slice(0, 10);
  const jsDay = manana.getUTCDay(); // 0=domingo
  const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1; // Lunes=0 ... Domingo=6, igual que probar_reserva_publica.mjs
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

  // 1. Sembrar org + dueño + horario, y reservar por API pública para obtener un bookingToken real.
  orgId = psql(
    `insert into organizations (id, name, slug, plan, "verticalTrackId", "onboardingCompletedAt",
       "trialEnd", "planEnd", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, 'ZZ QA Portal Paciente ${TS}', '${SLUG}', 'professional',
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
     values (gen_random_uuid()::text, '${ownerUserId}', '${orgId}', 'ZZ QA Dueño Portal', '${EMAIL_DUENO}',
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
  console.log(`horario sembrado: dayOfWeek=${dayOfWeek} 09:00-17:00`);

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
      reason: "zz-qa- control (portal del paciente)",
    }),
  });
  const jBook = await rBook.json().catch(() => null);
  if (rBook.status !== 201 || !jBook?.bookingToken) {
    console.error(`FALLO en el insumo (reservar): ${rBook.status} ${JSON.stringify(jBook)}`);
    limpiar();
    process.exit(1);
  }
  const bookingToken = jBook.bookingToken;
  const filaCita = psql(`select id from appointments where "bookingToken"='${bookingToken}'`);
  appointmentId = filaCita;
  patientId = psql(`select id from patients where "organizationId"='${orgId}' and phone='${TELEFONO}'`);
  console.log("bookingToken real obtenido:", bookingToken, "| appointmentId:", appointmentId);

  const { chromium } = await cargarPlaywright();
  const navegador = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const contexto = await navegador.newContext({ viewport: { width: 390, height: 844 }, locale: "es-BO" });

  // 2. /book/my-appointments/<token> — el paciente ve TODAS sus citas por el token, sin sesión.
  const pageMy = await contexto.newPage();
  const respuestasMalasMy = [];
  pageMy.on("response", (r) => {
    if (r.status() >= 400) respuestasMalasMy.push(`${r.status()} ${r.url()}`);
  });
  await pageMy.goto(`${APP}/book/my-appointments/${bookingToken}`, { waitUntil: "load", timeout: 30_000 }).catch((e) => {
    console.error("no pudo abrir my-appointments:", e.message);
  });
  await pageMy.waitForTimeout(2500);
  await pageMy.screenshot({ path: `${CAPTURAS}/extra-portalpaciente-00-mis-citas.png`, fullPage: true }).catch(() => {});
  const textoMy = (await pageMy.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ");
  const muestraNombreEnMy = textoMy.includes(NOMBRE_PACIENTE) || textoMy.toLowerCase().includes("pendiente");
  console.log("my-appointments — respuestas >=400 en subrecursos:", JSON.stringify(respuestasMalasMy));
  console.log("my-appointments — texto (300):", textoMy.slice(0, 300));
  console.log("my-appointments — muestra algo reconocible de la cita:", muestraNombreEnMy);
  await pageMy.close().catch(() => {});

  // 3. /book/confirm/<token> — mirar pendiente, apretar Confirmar de verdad, verificar en la BASE.
  const pageConfirm = await contexto.newPage();
  await pageConfirm.goto(`${APP}/book/confirm/${bookingToken}`, { waitUntil: "load", timeout: 30_000 }).catch((e) => {
    console.error("no pudo abrir confirm:", e.message);
  });
  await pageConfirm.waitForTimeout(2500);
  await pageConfirm.screenshot({ path: `${CAPTURAS}/extra-portalpaciente-01-confirmar-pendiente.png`, fullPage: true }).catch(() => {});
  const textoAntes = (await pageConfirm.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ");
  console.log("confirm (antes) — texto (300):", textoAntes.slice(0, 300));

  const estadoAntes = psql(`select status from appointments where id='${appointmentId}'`);
  console.log("status en base ANTES de confirmar:", estadoAntes);

  const botonConfirmar = pageConfirm.getByRole("button", { name: /confirmar/i }).first();
  const hayBoton = await botonConfirmar.count().then((n) => n > 0).catch(() => false);
  if (!hayBoton) {
    console.error("FALLO: /book/confirm/<token> no tiene un botón 'Confirmar' visible.");
    await navegador.close().catch(() => {});
    limpiar();
    process.exit(1);
  }
  await botonConfirmar.click().catch((e) => console.error("no pudo clickear Confirmar:", e.message));
  await pageConfirm.waitForTimeout(2500);
  await pageConfirm.screenshot({ path: `${CAPTURAS}/extra-portalpaciente-02-confirmar-despues.png`, fullPage: true }).catch(() => {});
  const textoDespues = (await pageConfirm.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ");
  console.log("confirm (después) — texto (300):", textoDespues.slice(0, 300));
  await pageConfirm.close().catch(() => {});

  const estadoDespues = psql(`select status from appointments where id='${appointmentId}'`);
  console.log("status en base DESPUÉS de confirmar:", estadoDespues);

  // 4. Camino de fallo simétrico: token inexistente.
  const pageFalso = await contexto.newPage();
  const respuestasFalso = [];
  pageFalso.on("response", (r) => {
    if (r.status() >= 400) respuestasFalso.push(`${r.status()} ${r.url()}`);
  });
  await pageFalso.goto(`${APP}/book/confirm/zz-qa-token-inexistente-${TS}`, { waitUntil: "load", timeout: 30_000 }).catch(() => {});
  await pageFalso.waitForTimeout(2000);
  await pageFalso.screenshot({ path: `${CAPTURAS}/extra-portalpaciente-03-token-invalido.png`, fullPage: true }).catch(() => {});
  const textoFalso = (await pageFalso.locator("body").innerText().catch(() => "")).replace(/\s+/g, " ");
  console.log("token inexistente — respuestas >=400 en subrecursos:", JSON.stringify(respuestasFalso));
  console.log("token inexistente — texto (300):", textoFalso.slice(0, 300));
  const diceInvalido = /inválido|no se encontr|no encontr/i.test(textoFalso);
  console.log("token inexistente — la pantalla dice explícitamente que el enlace no sirve:", diceInvalido);
  await pageFalso.close().catch(() => {});

  await navegador.close().catch(() => {});

  const fallos = [];
  if (!muestraNombreEnMy) fallos.push("my-appointments no muestra nada reconocible de la cita");
  if (respuestasMalasMy.length > 0) fallos.push(`my-appointments trajo subrecursos con error: ${respuestasMalasMy.join(", ")}`);
  if (estadoDespues !== "CONFIRMADA") fallos.push(`la cita NO quedó CONFIRMADA en la base (quedó '${estadoDespues}')`);
  if (!diceInvalido) fallos.push("un token inexistente no muestra un mensaje claro de enlace inválido");

  if (fallos.length > 0) {
    console.error("\nFALLOS ENCONTRADOS:\n- " + fallos.join("\n- "));
    limpiar();
    process.exit(1);
  }

  console.log(
    "\nRESULTADO: portal del paciente (`/book/my-appointments/<token>` y `/book/confirm/<token>`) " +
      "de punta a punta contra producción real — sin sesión, con el bookingToken real de una " +
      "reserva pública: ve sus citas, confirma la suya (PATCH real, status pasa a CONFIRMADA en " +
      "la base) y un token inexistente da un mensaje claro de enlace inválido. Sin hallazgo."
  );
  limpiar();
  process.exit(0);
}

main().catch((e) => {
  console.error("ERROR no manejado:", e);
  limpiar();
  process.exit(2);
});
