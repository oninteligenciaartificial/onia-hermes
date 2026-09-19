#!/usr/bin/env node
/**
 * probar_cambio_de_plan.mjs — recorrido de escalón 3: desde `/settings` (Mi plan), un dueño con
 * plan `basic` aprieta "Contratar" en la tarjeta del plan `crece` y llega a `/checkout?plan=crece`
 * con el precio correcto (Bs 550/mes, `DEFAULT_PLAN_AMOUNTS.crece.monthly` en
 * `lib/subscription-plans.ts`).
 *
 * ⚠️ MEDIDO EL 2026-09-19: esta pantalla es ESTRUCTURALMENTE INALCANZABLE para toda cuenta
 * `zz-qa-`, por diseño — no es un bug de este script ni del producto. `esCuentaQueNoEsCliente`
 * (`lib/platform/cuentas-que-no-son-clientes.ts`) matchea el SLUG de la org contra
 * `QA_SLUG_PREFIXES = ["zz-qa-"]`, y `seccionesDeConfiguracion({ cuentaInterna: true, ... })`
 * (`app/(dashboard)/settings/SettingsClient.tsx`) OMITE el grupo "plan" entero — "Mi plan",
 * "Chatbot de WhatsApp", "Descargar mis planillas" — para esas cuentas. Decisión de Sergio
 * Urcullo del 18-sep: las cuentas de QA no ven la VENTA («Mi plan», precios, pagar). Como
 * CLAUDE.md exige el prefijo `zz-qa-` en TODO lo que este carril crea, este carril NUNCA puede
 * recorrer /settings→mi-plan→/checkout con un click real bajo su propia convención — no hay
 * forma de sortear esto sin violar la regla de aislamiento. Queda documentado acá y en
 * `ULTIMO_RECORRIDO.md`; el script sirve como prueba de que el bloqueo es real y adrede, no
 * como recorrido reproducible de esa pantalla.
 *
 *   node scripts/probar_cambio_de_plan.mjs
 *
 * Limpia todo lo `zz-qa-` que crea, en la misma corrida (éxito o fallo).
 */
import { execFileSync } from "node:child_process";
import { navegadorConSesion, psql as psqlLectura } from "./lib/sesion_dueno.mjs";

const APP = "https://app.onia.com.bo";
const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-cambioplan-${TS}`;
const EMAIL = `zz-qa-cambioplan-${TS}@onia.com.bo`;

let orgId = null;
let userId = null;

/**
 * `psql -tAc` con `INSERT ... RETURNING` imprime la fila Y el tag ("INSERT 0 1") pegado
 * debajo — `psql()` de sesion_dueno.mjs no lo filtra (fue escrito para SELECT). Acá sí hace
 * falta: quedarse con la primera línea.
 */
function psql(sql) {
  return psqlLectura(sql).split("\n")[0].trim();
}

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
  if (orgId) {
    const filas = psqlSeguro(`select id, name, plan from organizations where id='${orgId}'`);
    console.log("organización antes de borrar:\n" + filas);
  }
  if (orgId) psqlSeguro(`delete from profiles where "organizationId"='${orgId}'`);
  if (orgId) psqlSeguro(`delete from clinic_settings where "organizationId"='${orgId}'`);
  if (orgId) psqlSeguro(`delete from organizations where id='${orgId}'`);
  if (userId) {
    psqlSeguro(`delete from auth.identities where user_id='${userId}'`);
    psqlSeguro(`delete from auth.users where id='${userId}'`);
  }
  const quedanOrg = psqlSeguro(`select count(*) from organizations where name like 'zz-qa-%'`);
  console.log(`zz-qa- restantes en organizations: ${quedanOrg}`);
}

async function main() {
  console.log(`--- sembrando org ${SLUG} en plan basic ---`);

  // auth.users a mano necesita los campos de token en '' (no NULL), o generate_link
  // (dentro de acunarSesion) da un 500 "Database error finding user" que se lee como bug
  // del producto — ya medido y anotado por este carril (2026-09-19).
  userId = psql(`
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      confirmation_token, recovery_token, email_change_token_new, email_change,
      email_change_token_current, phone_change, phone_change_token, reauthentication_token,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) values (
      '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
      '${EMAIL}', null, now(),
      '', '', '', '', '', '', '', '',
      '{"provider":"email","providers":["email"]}', '{}', now(), now()
    ) returning id;
  `);
  psqlSeguro(`
    insert into auth.identities (provider_id, user_id, identity_data, provider, id, created_at, updated_at)
    values ('${userId}', '${userId}', '{"sub":"${userId}","email":"${EMAIL}"}', 'email', gen_random_uuid(), now(), now());
  `);

  orgId = psql(`
    insert into organizations (id, name, slug, plan, "verticalTrackId", "onboardingCompletedAt", "createdAt", "updatedAt")
    values (gen_random_uuid(), '${SLUG}', '${SLUG}', 'basic', 'dental', now(), now(), now())
    returning id;
  `);
  psqlSeguro(`
    insert into profiles (id, "userId", "organizationId", name, email, role, "createdAt", "updatedAt")
    values (gen_random_uuid(), '${userId}', '${orgId}', 'ZZ QA Owner', '${EMAIL}', 'ADMIN', now(), now());
  `);
  console.log(`org=${orgId} user=${userId} plan=basic`);

  const { navegador, pagina, fallos } = await navegadorConSesion(EMAIL);
  try {
    console.log("--- abriendo /settings ---");
    await pagina.goto(`${APP}/settings`, { waitUntil: "load", timeout: 30_000 });
    await pagina.waitForTimeout(1500);
    await pagina.screenshot({ path: "hermes-content/docs/recorrido/capturas/cambio-plan-01-settings.png", fullPage: true });

    const urlSettings = pagina.url();
    if (!urlSettings.includes("/settings")) {
      throw new Error(`No llegó a /settings — terminó en ${urlSettings}`);
    }

    // "Mi plan" puede estar detrás de un acordeón ("Configuración avanzada" / "Tu plan y tus
    // datos") en vez de a la vista directa — se prueba primero con el link visible, y si no
    // está, se abre cualquier bloque plegable que mencione "plan" antes de rendirse.
    let enlaceCrece = pagina.locator('a[href="/checkout?plan=crece"]').first();
    if ((await enlaceCrece.count()) === 0) {
      const togglesPlan = pagina.locator('text=/plan/i');
      const n = await togglesPlan.count();
      console.log(`sin enlace directo — probando ${n} elementos con "plan" en el texto`);
      for (let i = 0; i < n; i++) {
        try {
          await togglesPlan.nth(i).click({ timeout: 2000 });
          await pagina.waitForTimeout(400);
        } catch {}
      }
      enlaceCrece = pagina.locator('a[href="/checkout?plan=crece"]').first();
    }
    const hayEnlace = await enlaceCrece.count();
    if (hayEnlace === 0) {
      await pagina.screenshot({ path: "hermes-content/docs/recorrido/capturas/cambio-plan-01b-sin-boton.png", fullPage: true });
      const textoCompleto = await pagina.locator("body").innerText();
      const enlacesCheckout = await pagina.locator('a[href*="checkout"]').all();
      console.log(`enlaces con "checkout" en /settings: ${enlacesCheckout.length}`);
      for (const l of enlacesCheckout) console.log("  ", await l.getAttribute("href"), "|", (await l.innerText()).trim());
      throw new Error('No hay ningún <a href="/checkout?plan=crece"> en /settings para un plan basic.');
    }
    await enlaceCrece.scrollIntoViewIfNeeded();
    const texto = (await enlaceCrece.innerText()).trim();
    console.log(`botón encontrado: "${texto}"`);

    console.log("--- clic → /checkout?plan=crece ---");
    await Promise.all([
      pagina.waitForURL(/\/checkout/, { timeout: 15_000 }),
      enlaceCrece.click(),
    ]);
    await pagina.waitForTimeout(1500);
    await pagina.screenshot({ path: "hermes-content/docs/recorrido/capturas/cambio-plan-02-checkout.png", fullPage: true });

    const urlCheckout = pagina.url();
    console.log(`URL final: ${urlCheckout}`);
    if (!/\/checkout\?plan=crece/.test(urlCheckout)) {
      throw new Error(`El clic no llevó a /checkout?plan=crece — terminó en ${urlCheckout}`);
    }

    // Precio mostrado: buscar "550" en el texto visible de la pantalla (moneda puede ir
    // antes o después, a veces partida en dos nodos — se lee innerText del body entero).
    const textoVisible = await pagina.locator("body").innerText();
    const tiene550 = /550/.test(textoVisible);
    const tiene890sinCrece = /\b890\b/.test(textoVisible) && !/\bcrece\b/i.test(textoVisible);
    console.log(`texto visible menciona "550": ${tiene550}`);

    const malas400 = fallos.filter((f) => !f.startsWith("404 ") || !f.includes("chunk"));
    console.log(`respuestas >=400 (subrecursos): ${fallos.length ? fallos.join(" | ") : "ninguna"}`);

    if (!tiene550) {
      await pagina.screenshot({ path: "hermes-content/docs/recorrido/capturas/cambio-plan-03-sin-precio.png", fullPage: true });
      throw new Error('El checkout de plan=crece NO muestra "550" (Bs 550/mes, DEFAULT_PLAN_AMOUNTS.crece.monthly) en el texto visible.');
    }

    console.log("\n=== RESULTADO: OK ===");
    console.log("El botón 'Contratar Crece' de /settings (plan basic) lleva a /checkout?plan=crece");
    console.log("y la pantalla muestra Bs 550, el precio correcto de subscription-plans.ts.");
  } finally {
    await navegador.close();
  }
}

main()
  .then(() => {
    limpiar();
    process.exit(0);
  })
  .catch((e) => {
    console.error("\n=== RESULTADO: FALLÓ ===");
    console.error(e.message);
    limpiar();
    process.exit(1);
  });
