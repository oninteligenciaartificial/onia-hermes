#!/usr/bin/env node
/**
 * probar_recuperar_contrasena.mjs — ¿"Olvidé mi contraseña" deja de verdad cambiarla y
 * entrar con la NUEVA, sin poder entrar más con la vieja?
 *
 * Escalón nuevo del 2026-09-25: el login (`app/(auth)/login/LoginForm.tsx`) promete
 * "Te enviaremos un enlace seguro para cambiar tu contraseña" en el botón "Olvidé mi
 * contraseña". Hasta hoy nadie de este carril había seguido ese camino — sólo se probó el
 * alta (`alta_correo_confirma.mjs`) y la invitación (`probar_invitacion_correo_entra.mjs`),
 * los otros dos flujos que usan `/auth/confirm?token_hash=...&type=...`. Este es el tercero
 * (`type=recovery`, destino `/update-password` según `app/auth/confirm/route.ts:DESTINO`).
 *
 * Este script:
 *  1. Siembra una org+usuario `zz-qa-` con contraseña conocida (bcrypt vía pgcrypto) y
 *     confirma que esa contraseña VIEJA funciona (`POST /api/auth/login` -> 200).
 *  2. Abre `/login`, hace clic en "Olvidé mi contraseña", escribe el correo y manda
 *     "Enviar enlace" — el mismo camino que un cliente real, no un POST directo a GoTrue.
 *  3. Lee el `recovery_token` REAL que GoTrue dejó en `auth.users` (mismo mecanismo que
 *     `confirmation_token` para alta/invitación) y abre `/auth/confirm?type=recovery` en un
 *     navegador LIMPIO.
 *  4. Confirma que aterriza en `/update-password` (no en `/login?error=...`), carga una
 *     contraseña NUEVA y la envía.
 *  5. Prueba las DOS puertas: la NUEVA contraseña entra (200) y la VIEJA ya NO entra (401) —
 *     sin la segunda mitad, un bug que deja las dos contraseñas activas pasaría desapercibido.
 *
 *   node scripts/probar_recuperar_contrasena.mjs
 *
 * Limpia todo lo `zz-qa-` que crea, en la misma corrida (éxito o fallo).
 * Salidas: 0 = el flujo de recuperación cambia la contraseña de verdad · 1 = defecto · 2 = no pude medir.
 */
import { execFileSync } from "node:child_process";
import { cargarPlaywright } from "./lib/playwright-que-arranca.mjs";

const APP = "https://app.onia.com.bo";
const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-recuperar-${TS}`;
const EMAIL = `zz-qa-recuperar-${TS}@onia.com.bo`;
const PASSWORD_VIEJA = "ZzQaVieja#20260925";
const PASSWORD_NUEVA = "ZzQaNueva#20260925";
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
let userId = null;

function limpiar() {
  console.log("\n--- LIMPIEZA ---");
  if (orgId) psqlSeguro(`delete from profiles where "organizationId"='${orgId}'`);
  if (orgId) psqlSeguro(`delete from clinic_settings where "organizationId"='${orgId}'`);
  if (orgId) psqlSeguro(`delete from organizations where id='${orgId}'`);
  if (userId) {
    psqlSeguro(`delete from auth.identities where user_id='${userId}'`);
    psqlSeguro(`delete from auth.users where id='${userId}'`);
  }
  const orgsRestantes = psqlSeguro(`select count(*) from organizations where slug='${SLUG}'`);
  const usersRestantes = psqlSeguro(`select count(*) from auth.users where email='${EMAIL}'`);
  console.log(`verificado al cerrar: organizations=${orgsRestantes} auth.users=${usersRestantes}`);
  if (orgsRestantes !== "0" || usersRestantes !== "0") {
    console.error(`LIMPIEZA INCOMPLETA — anotar a mano: ${JSON.stringify({ orgId, userId, SLUG })}`);
  }
}

async function login(email, password) {
  const r = await fetch(`${APP}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const j = await r.json().catch(() => null);
  return { status: r.status, body: j };
}

async function main() {
  // 1. Sembrar org 'basic' + usuario con contraseña VIEJA conocida (pgcrypto bcrypt).
  orgId = psql(
    `insert into organizations (id, name, slug, plan, "verticalTrackId", "onboardingCompletedAt",
       "trialEnd", "planEnd", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, 'ZZ QA Recuperar ${TS}', '${SLUG}', 'basic', 'dentagest-clinical',
       now(), now() + interval '1 year', now() + interval '1 year', now(), now())
     returning id`
  );
  console.log("org creada:", orgId, SLUG);

  userId = psql(
    `insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
       email_confirmed_at, confirmation_token, recovery_token, email_change, email_change_token_new,
       email_change_token_current, phone_change, phone_change_token, reauthentication_token,
       raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
     values ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
       '${EMAIL}', extensions.crypt('${PASSWORD_VIEJA}', extensions.gen_salt('bf')),
       now(), '', '', '', '', '', '', '', '',
       '{"provider":"email","providers":["email"]}', '{}', now(), now())
     returning id`
  );
  psqlSeguro(
    `insert into auth.identities (provider_id, user_id, identity_data, provider, id, created_at, updated_at)
     values ('${userId}', '${userId}', '{"sub":"${userId}","email":"${EMAIL}"}', 'email', gen_random_uuid(), now(), now())`
  );
  psql(
    `insert into profiles (id, "userId", "organizationId", name, email, role, "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${userId}', '${orgId}', 'ZZ QA Recuperar', '${EMAIL}', 'ADMIN', now(), now())`
  );
  console.log("usuario sembrado:", userId, EMAIL);

  // 2. Confirmar que la VIEJA contraseña funciona ANTES de tocar nada — si esto falla, el
  //    resto del script mide contra una base que ya no tiene sentido.
  const loginViejo = await login(EMAIL, PASSWORD_VIEJA);
  console.log(`[0] POST /api/auth/login (vieja, antes de recuperar) -> ${loginViejo.status}`, JSON.stringify(loginViejo.body));
  if (loginViejo.status !== 200) {
    console.error(`NO MEDIDO: la contraseña VIEJA sembrada no entra (esperaba 200, dio ${loginViejo.status}).`);
    limpiar();
    process.exit(2);
  }

  const { chromium } = await cargarPlaywright();
  const navegador = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  try {
    // 3. Igual que un cliente: abrir /login, clic en "Olvidé mi contraseña", pedir el enlace.
    const ctx1 = await navegador.newContext({ viewport: { width: 1280, height: 900 } });
    const p1 = await ctx1.newPage();
    await p1.goto(`${APP}/login`, { waitUntil: "load", timeout: 30_000 });
    await p1.getByRole("button", { name: "Olvidé mi contraseña" }).click();
    await p1.waitForTimeout(300);
    await p1.getByPlaceholder("tucorreo@ejemplo.bo").last().fill(EMAIL);
    await p1.getByRole("button", { name: /Enviar enlace/ }).click();
    await p1.waitForTimeout(2000);
    await p1.screenshot({ path: `${CAPTURAS}/extra-recuperar-01-pedido.png`, fullPage: true });
    const notice1 = await p1.locator("body").innerText();
    if (!/enlace de recuperaci[oó]n/i.test(notice1)) {
      console.error("FALLO: tras \"Enviar enlace\" la pantalla no confirma el envío (no aparece el aviso esperado).");
      await navegador.close();
      limpiar();
      process.exit(1);
    }
    console.log("[1] Pedido de recuperación enviado por la UI — aviso confirmado en pantalla.");
    await ctx1.close();

    // 4. El token_hash REAL que GoTrue puso en auth.users para el mail de recovery.
    const token = psql(`select recovery_token from auth.users where id='${userId}'`);
    if (!token) {
      console.error("NO MEDIDO: auth.users no tiene recovery_token tras el pedido.");
      await navegador.close();
      limpiar();
      process.exit(2);
    }
    const enlace = `${APP}/auth/confirm?token_hash=${token}&type=recovery`;
    console.log(`enlace de recuperación: ${enlace.replace(token, token.slice(0, 12) + "…")}`);

    // 5. Abrir el enlace en un navegador LIMPIO (el cliente lo abre desde el mail, no desde
    //    la pestaña donde pidió el reset).
    const ctx2 = await navegador.newContext({ viewport: { width: 1280, height: 900 } });
    const p2 = await ctx2.newPage();
    const fallos = [];
    p2.on("response", (r) => r.status() >= 400 && fallos.push(`${r.status()} ${r.url()}`));
    await p2.goto(enlace, { waitUntil: "load", timeout: 60_000 });
    await p2.waitForTimeout(1500);
    const urlTrasEnlace = p2.url();
    await p2.screenshot({ path: `${CAPTURAS}/extra-recuperar-02-aterrizaje.png`, fullPage: true });
    console.log(`[2] enlace de recuperación → ${urlTrasEnlace}`);
    if (!urlTrasEnlace.includes("/update-password")) {
      console.error(`FALLO: el enlace de recuperación NO llevó a /update-password — aterrizó en ${urlTrasEnlace}.`);
      await navegador.close();
      limpiar();
      process.exit(1);
    }

    // 6. Cargar la NUEVA contraseña en esa pantalla y enviarla.
    await p2.locator('input[type="password"]').first().fill(PASSWORD_NUEVA);
    await p2.locator('input[type="password"]').nth(1).fill(PASSWORD_NUEVA);
    await p2.getByRole("button", { name: /Guardar nueva contraseña/ }).click();
    await p2.waitForTimeout(2500);
    const urlFinal = p2.url();
    await p2.screenshot({ path: `${CAPTURAS}/extra-recuperar-03-guardada.png`, fullPage: true });
    console.log(`[3] tras "Guardar nueva contraseña" → ${urlFinal}`);
    if (!urlFinal.includes("/login") || !urlFinal.includes("password_updated")) {
      console.error(`FALLO: no redirigió a /login?notice=password_updated — terminó en ${urlFinal}.`);
      await navegador.close();
      limpiar();
      process.exit(1);
    }
    if (fallos.length) {
      console.error(`FALLO: subrecursos en error durante el flujo:\n  ${fallos.join("\n  ")}`);
      await navegador.close();
      limpiar();
      process.exit(1);
    }
    await navegador.close();

    // 7. La prueba de fondo, las DOS puertas: la NUEVA entra, la VIEJA ya NO.
    const loginNuevo = await login(EMAIL, PASSWORD_NUEVA);
    console.log(`[4] POST /api/auth/login (nueva) -> ${loginNuevo.status}`, JSON.stringify(loginNuevo.body));
    if (loginNuevo.status !== 200) {
      console.error(`FALLO: la contraseña NUEVA no entra tras el cambio (esperaba 200, dio ${loginNuevo.status}).`);
      limpiar();
      process.exit(1);
    }

    const loginViejoTrasCambio = await login(EMAIL, PASSWORD_VIEJA);
    console.log(`[5] POST /api/auth/login (vieja, después del cambio) -> ${loginViejoTrasCambio.status}`, JSON.stringify(loginViejoTrasCambio.body));
    if (loginViejoTrasCambio.status === 200) {
      console.error("FALLO: la contraseña VIEJA TODAVÍA entra después de \"cambiarla\" — el cambio no invalidó la anterior.");
      limpiar();
      process.exit(1);
    }

    console.log(
      "\nRESULTADO: \"Olvidé mi contraseña\" (login) -> enlace real de correo (`/auth/confirm?type=recovery`) " +
        "-> /update-password cambia la contraseña de VERDAD: la nueva entra, la vieja deja de entrar. Sin hallazgo."
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

main();
