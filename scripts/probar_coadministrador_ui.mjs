#!/usr/bin/env node
/**
 * probar_coadministrador_ui.mjs — el flujo REAL de invitar/quitar coadministrador desde
 * `/settings` (equipo), por CLICS de Playwright, no por API pelada.
 *
 * `probar_coadministrador.mjs` (2026-09-19) ya probó las tres puertas de DG-043 contra HTTP
 * real (POST /api/team, GET /api/team, DELETE /api/team/[id]) y dieron 201/200/200 sanas. Lo
 * que ESO no cubre es la pantalla: el formulario tiene una condición extra que la API no tiene
 * (`disabled={... || !newMember.password}`) y el botón de borrar dispara un `window.confirm()`
 * nativo — dos formas de que la UI se trabe con la API sana debajo. Este script cierra esa
 * mitad: abre `/settings#equipo` con sesión real, hace clic en "Agregar a alguien", llena el
 * formulario, confirma que la persona aparece en la lista, hace clic en "Quitar a <nombre>",
 * acepta el `confirm()` nativo y verifica que desaparezca — todo MIRADO (capturas) y
 * confirmado en la BASE, no sólo en el DOM.
 *
 *   node scripts/probar_coadministrador_ui.mjs
 *
 * Limpia todo lo `zz-qa-` que crea, en la misma corrida (éxito o fallo).
 */
import { execFileSync } from "node:child_process";
import { navegadorConSesion } from "./lib/sesion_dueno.mjs";

const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-coadminui-${TS}`;
const EMAIL_DUENO = `zz-qa-coadminui-owner-${TS}@onia.com.bo`;
const EMAIL_SEGUNDO = `zz-qa-coadminui-second-${TS}@onia.com.bo`;
const NOMBRE_SEGUNDO = `ZZ QA UI Segundo ${TS}`;
const CAPTURAS = "hermes-content/docs/recorrido/capturas";

// `psql -tAc` con `INSERT ... RETURNING` imprime la fila Y el tag de comando pegado abajo —
// quedarse con la primera línea es correcto para todo lo que este script consulta.
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
    console.error(`LIMPIEZA INCOMPLETA — anotar a mano: ${JSON.stringify({ orgId, ownerUserId, segundoUserId, SLUG })}`);
  }
}

async function main() {
  // 1. Sembrar org con plan 'clinic' (multiAdminIncluido:true — Completo, Bs 1.290, ofrece rol
  //    ADMIN en el <select>) y su dueño con perfil ADMIN.
  orgId = psql(
    `insert into organizations (id, name, slug, plan, "verticalTrackId", "onboardingCompletedAt",
       "trialEnd", "planEnd", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, 'ZZ QA Coadmin UI ${TS}', '${SLUG}', 'clinic', 'dentagest-clinical',
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
     values (gen_random_uuid()::text, '${ownerUserId}', '${orgId}', 'ZZ QA UI Owner', '${EMAIL_DUENO}',
       'ADMIN', now(), now())`
  );
  console.log("dueño sembrado:", ownerUserId, EMAIL_DUENO);

  const { navegador, pagina, fallos } = await navegadorConSesion(EMAIL_DUENO, {
    viewport: { width: 1280, height: 900 },
  });

  // El DELETE dispara `window.confirm()` nativo: sin este handler Playwright se queda
  // esperando el diálogo para siempre y el click nunca resuelve.
  pagina.on("dialog", (d) => d.accept());

  try {
    await pagina.goto("https://app.onia.com.bo/settings#equipo", { waitUntil: "load", timeout: 30_000 });
    await pagina.waitForTimeout(1500); // deep-link por ancla + fetch inicial de /api/team

    await pagina.screenshot({ path: `${CAPTURAS}/extra-coadminui-00-equipo-vacio.png`, fullPage: true });

    const botonAgregar = pagina.getByRole("button", { name: "Agregar a alguien" });
    await botonAgregar.waitFor({ state: "visible", timeout: 10_000 });
    await botonAgregar.click();

    await pagina.getByLabel("Nombre completo").fill(NOMBRE_SEGUNDO);
    await pagina.getByLabel("Correo electrónico de la persona").fill(EMAIL_SEGUNDO);
    await pagina.getByLabel("Contraseña inicial").fill("zzqacoadmin2026");
    await pagina.getByLabel("Qué puede hacer").selectOption("ADMIN");

    await pagina.screenshot({ path: `${CAPTURAS}/extra-coadminui-01-formulario-lleno.png`, fullPage: true });

    // El botón real de confirmar el alta dice "Darle acceso" (medido en la captura del
    // formulario lleno) — NO "Agregar a alguien", que es el que abre el formulario.
    const botonConfirmar = pagina.getByRole("button", { name: "Darle acceso" });
    await botonConfirmar.click();

    // Esperar a que la fila del segundo aparezca en la lista (loadTeam() tras el POST).
    await pagina.getByText(NOMBRE_SEGUNDO, { exact: true }).waitFor({ state: "visible", timeout: 15_000 });

    await pagina.screenshot({ path: `${CAPTURAS}/extra-coadminui-02-agregado.png`, fullPage: true });

    // Confirmar en la BASE, no sólo en el DOM: el profile con ese email quedó como ADMIN.
    segundoUserId = psql(
      `select "userId" from profiles where "organizationId"='${orgId}' and email='${EMAIL_SEGUNDO}'`
    );
    const rolSegundo = psql(
      `select role from profiles where "organizationId"='${orgId}' and email='${EMAIL_SEGUNDO}'`
    );
    console.log(`en la base tras el clic: userId=${segundoUserId} role=${rolSegundo}`);
    if (!segundoUserId || rolSegundo !== "ADMIN") {
      console.error(`FALLO: la UI dijo que agregó a ${EMAIL_SEGUNDO} pero la base no tiene un profile ADMIN con ese correo.`);
      await pagina.screenshot({ path: `${CAPTURAS}/extra-coadminui-FALLO-agregar.png`, fullPage: true });
      await navegador.close();
      limpiar();
      process.exit(1);
    }

    // Camino de vuelta: clic en "Quitar a <nombre>", aceptar el confirm() nativo, y verificar
    // que la fila desaparezca de la pantalla Y que el profile se borre de la base.
    const botonQuitar = pagina.getByRole("button", { name: `Quitar a ${NOMBRE_SEGUNDO}` });
    await botonQuitar.waitFor({ state: "visible", timeout: 10_000 });
    await botonQuitar.click();

    await pagina.getByText(NOMBRE_SEGUNDO, { exact: true }).waitFor({ state: "hidden", timeout: 15_000 });

    await pagina.screenshot({ path: `${CAPTURAS}/extra-coadminui-03-quitado.png`, fullPage: true });

    const quedaProfile = psql(
      `select count(*) from profiles where "organizationId"='${orgId}' and email='${EMAIL_SEGUNDO}'`
    );
    console.log(`profiles con ese correo tras "Quitar": ${quedaProfile}`);
    if (quedaProfile !== "0") {
      console.error(`FALLO: la pantalla dice que lo quitó pero el profile sigue en la base (${quedaProfile}).`);
      await navegador.close();
      limpiar();
      process.exit(1);
    }

    if (fallos.length) {
      console.error(`FALLO: subrecursos en error durante el recorrido:\n  ${fallos.join("\n  ")}`);
      await navegador.close();
      limpiar();
      process.exit(1);
    }

    await navegador.close();
    console.log(
      "\nRESULTADO: invitar un segundo ADMIN desde /settings (clic real, formulario, confirmar) " +
        "y quitarlo (clic real, confirm() nativo aceptado) — las dos puntas de DG-043 sostenidas " +
        "por la UI, no sólo por la API. Sin hallazgo."
    );
    limpiar();
    process.exit(0);
  } catch (e) {
    console.error("ERROR durante el recorrido de UI:", e.message);
    try {
      await pagina.screenshot({ path: `${CAPTURAS}/extra-coadminui-ERROR.png`, fullPage: true });
    } catch {}
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
