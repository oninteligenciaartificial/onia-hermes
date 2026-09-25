#!/usr/bin/env node
/**
 * probar_invitacion_correo_entra.mjs — ¿el ENLACE del correo de invitación deja ENTRAR
 * al coadministrador invitado, con el rol correcto?
 *
 * La vuelta del 2026-09-25 12:10 verificó que el correo de invitación SALE del servidor
 * (postfix `status=sent`). Eso prueba entrega, no acceso: `probar_coadministrador.mjs` y
 * `probar_coadministrador_ui.mjs` sólo cubren el modo "Crear con contraseña"
 * (`POST /api/team`, acceso inmediato) — ninguno de los dos sigue el enlace real del modo
 * "Invitar por email" (`POST /api/admin/users`, sin contraseña). Ese enlace usa
 * `/auth/confirm?token_hash=...&type=invite` (mismo mecanismo que la confirmación de alta,
 * ver `alta_correo_confirma.mjs`), y hasta hoy nadie lo había abierto.
 *
 * Este script: invita a un segundo ADMIN por correo, lee el `confirmation_token` real de
 * `auth.users` (el mismo que GoTrue pone en el mail), abre ese enlace en un navegador
 * LIMPIO (nunca vio al dueño), y confirma que la sesión resultante entra a `/dashboard`
 * autenticada como el invitado — con `GET /api/admin/users` devolviendo 200 y viendo a
 * los DOS usuarios (prueba de que el invitado quedó con sesión de su propia org, con su
 * propio rol, no una sesión rota que igual "no da error").
 *
 *   node scripts/probar_invitacion_correo_entra.mjs
 *
 * Limpia todo lo `zz-qa-` que crea, en la misma corrida (éxito o fallo).
 * Salidas: 0 = el enlace de invitación deja entrar con el rol correcto · 1 = defecto · 2 = no pude medir.
 */
import { execFileSync } from "node:child_process";
import { acunarSesion } from "./lib/sesion_dueno.mjs";
import { cargarPlaywright } from "./lib/playwright-que-arranca.mjs";

const APP = "https://app.onia.com.bo";
const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-invenlace-${TS}`;
const EMAIL_DUENO = `zz-qa-invenlace-owner-${TS}@onia.com.bo`;
const EMAIL_SEGUNDO = `zz-qa-invenlace-second-${TS}@onia.com.bo`;
const CAPTURAS = "hermes-content/docs/recorrido/capturas";

function psql(sql) {
  const crudo = execFileSync(
    "docker",
    ["exec", "-i", "supabase-db", "psql", "-U", "postgres", "-d", "postgres", "-tAc", sql],
    { encoding: "utf8", timeout: 20_000 }
  ).trim();
  return crudo.split("\n")[0].trim();
}

let orgId = null;
let ownerUserId = null;
let segundoUserId = null;
let segundoProfileId = null;

function psqlSeguro(sql) {
  try {
    return psql(sql);
  } catch (e) {
    console.error(`  (falló, sigo con lo demás) ${sql.slice(0, 80)}... -> ${e.message.split("\n")[0]}`);
    return null;
  }
}

function limpiar() {
  console.log("\n--- LIMPIEZA ---");
  if (segundoProfileId) psqlSeguro(`delete from profiles where id='${segundoProfileId}'`);
  if (orgId) psqlSeguro(`delete from profiles where "organizationId"='${orgId}'`);
  if (orgId) psqlSeguro(`delete from clinic_settings where "organizationId"='${orgId}'`);
  if (orgId) psqlSeguro(`delete from organizations where id='${orgId}'`);
  if (segundoUserId) {
    psqlSeguro(`delete from auth.identities where user_id='${segundoUserId}'`);
    psqlSeguro(`delete from auth.users where id='${segundoUserId}'`);
  }
  if (ownerUserId) {
    psqlSeguro(`delete from auth.identities where user_id='${ownerUserId}'`);
    psqlSeguro(`delete from auth.users where id='${ownerUserId}'`);
  }
  const orgsRestantes = psqlSeguro(`select count(*) from organizations where slug='${SLUG}'`);
  const usersRestantes = psqlSeguro(
    `select count(*) from auth.users where email in ('${EMAIL_DUENO}','${EMAIL_SEGUNDO}')`
  );
  console.log(`verificado al cerrar: organizations=${orgsRestantes} auth.users=${usersRestantes}`);
  if (orgsRestantes !== "0" || usersRestantes !== "0") {
    console.error(
      `LIMPIEZA INCOMPLETA — anotar a mano: ${JSON.stringify({ orgId, ownerUserId, segundoUserId, segundoProfileId, SLUG })}`
    );
  }
}

async function main() {
  // 1. Sembrar org 'clinic' (multiAdminIncluido:true) y su dueño.
  orgId = psql(
    `insert into organizations (id, name, slug, plan, "verticalTrackId", "onboardingCompletedAt",
       "trialEnd", "planEnd", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, 'ZZ QA Inv Enlace ${TS}', '${SLUG}', 'clinic', 'dentagest-clinical',
       now(), now() + interval '1 year', now() + interval '1 year', now(), now())
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
  psql(
    `insert into profiles (id, "userId", "organizationId", name, email, role, "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${ownerUserId}', '${orgId}', 'ZZ QA Owner', '${EMAIL_DUENO}',
       'ADMIN', now(), now())`
  );
  console.log("dueño sembrado:", ownerUserId, EMAIL_DUENO);

  // 2. Sesión real del dueño, e invitación por el modo "Invitar por email" (POST /api/admin/users).
  const { cookies } = await acunarSesion(EMAIL_DUENO);
  const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

  const rInvite = await fetch(`${APP}/api/admin/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieHeader },
    body: JSON.stringify({ email: EMAIL_SEGUNDO, name: "ZZ QA Segundo Admin", role: "ADMIN" }),
  });
  const jInvite = await rInvite.json().catch(() => null);
  console.log(`POST /api/admin/users -> ${rInvite.status}`, JSON.stringify(jInvite));
  if (rInvite.status !== 201 || !jInvite?.success) {
    console.error(`FALLO: no pude sembrar la invitación (esperaba 201, dio ${rInvite.status}).`);
    limpiar();
    process.exit(2);
  }
  segundoProfileId = jInvite.data.id;
  segundoUserId = psql(`select "userId" from profiles where id='${segundoProfileId}'`);

  // 3. El token_hash REAL que GoTrue puso para el mail — el mismo que
  //    `alta_correo_confirma.mjs` lee para el enlace de confirmación de alta.
  const token = psql(`select confirmation_token from auth.users where id='${segundoUserId}'`);
  if (!token) {
    console.error(`NO MEDIDO: auth.users no tiene confirmation_token para ${EMAIL_SEGUNDO}.`);
    limpiar();
    process.exit(2);
  }
  const enlace = `${APP}/auth/confirm?token_hash=${token}&type=invite`;
  console.log(`enlace de invitación: ${enlace.replace(token, token.slice(0, 12) + "…")}`);

  // 4. Abrir el enlace en un navegador LIMPIO — el invitado nunca vio la sesión del dueño.
  const { chromium } = await cargarPlaywright();
  const navegador = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  try {
    const ctx = await navegador.newContext({ viewport: { width: 1280, height: 900 } });
    const pagina = await ctx.newPage();
    const fallos = [];
    pagina.on("response", (r) => r.status() >= 400 && fallos.push(`${r.status()} ${r.url()}`));

    await pagina.goto(enlace, { waitUntil: "load", timeout: 60_000 });
    await pagina.waitForTimeout(2500);
    const urlFinal = pagina.url();
    await pagina.screenshot({ path: `${CAPTURAS}/extra-invenlace-01-aterrizaje.png`, fullPage: true });
    console.log(`[1] enlace de invitación → ${urlFinal}`);

    if (urlFinal.includes("/login") || urlFinal.includes("error=")) {
      console.error(`FALLO: el enlace de invitación NO deja entrar — aterrizó en ${urlFinal}.`);
      await navegador.close();
      limpiar();
      process.exit(1);
    }

    // 5. La prueba de fondo: con la sesión que el enlace dejó en ESTE navegador, ¿la app
    //    reconoce al invitado con su propio rol/org? Un `/dashboard` que carga sin rebotar
    //    puede ser una sesión rota que igual no tira error — se confirma pegándole a una
    //    API que exige sesión Y organización, y mirando que el invitado vea a los DOS.
    const cookiesInvitado = (await ctx.cookies())
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
    const rList = await fetch(`${APP}/api/admin/users`, { headers: { Cookie: cookiesInvitado } });
    const jList = await rList.json().catch(() => null);
    const cantidad = jList?.data?.length ?? -1;
    console.log(`[2] GET /api/admin/users (con la sesión del invitado) -> ${rList.status}, ${cantidad} usuario(s)`);
    if (rList.status !== 200 || cantidad !== 2) {
      console.error(
        `FALLO: la sesión que dejó el enlace no ve la org del dueño como se esperaría ` +
          `(status ${rList.status}, ${cantidad} usuario(s), esperaba 200 y 2).`
      );
      await navegador.close();
      limpiar();
      process.exit(1);
    }

    // 6. Confirmar en la base que el invitado quedó con el rol que se le asignó (ADMIN).
    const rolSegundo = psql(`select role from profiles where id='${segundoProfileId}'`);
    console.log(`[3] role en profiles tras entrar: ${rolSegundo}`);
    if (rolSegundo !== "ADMIN") {
      console.error(`FALLO: el invitado entró pero su profile quedó con role='${rolSegundo}', esperaba ADMIN.`);
      await navegador.close();
      limpiar();
      process.exit(1);
    }

    if (fallos.length) {
      console.error(`FALLO: subrecursos en error durante el aterrizaje:\n  ${fallos.join("\n  ")}`);
      await navegador.close();
      limpiar();
      process.exit(1);
    }

    await navegador.close();
    console.log(
      "\nRESULTADO: el enlace del correo de invitación (`/auth/confirm?type=invite`) deja " +
        "entrar al coadministrador invitado, con sesión propia y rol ADMIN correcto — no sólo " +
        "el POST devuelve 201, el enlace de VERDAD funciona. Sin hallazgo."
    );
    limpiar();
    process.exit(0);
  } catch (e) {
    console.error("ERROR durante el recorrido:", e.message);
    try {
      await navegador.close();
    } catch {}
    limpiar();
    process.exit(2);
  }
}

main().catch((e) => {
  console.error("ERROR no manejado:", e);
  limpiar();
  process.exit(2);
});
