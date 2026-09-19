#!/usr/bin/env node
/**
 * probar_checkout_directo.mjs — escalón 3: re-verificar `/checkout?plan=<x>` DIRECTO por URL
 * (no por el link "Mi plan" de /settings, inalcanzable para cuentas `zz-qa-` por diseño desde
 * el 18-sep — ver `probar_cambio_de_plan.mjs`). `/checkout` no está detrás de esa exclusión: es
 * una ruta aparte que cualquier sesión logueada puede abrir.
 *
 * Objetivo: re-verificar precio y copy de la escalera C (crece/clinic) contra
 * `subscription-plans.ts`/`pricing.ts`, 6 días después de la última vez que este carril lo miró
 * (2026-09-13, antes de varios ajustes de precio/inclusión que se hicieron en el medio).
 *
 *   node scripts/probar_checkout_directo.mjs
 *
 * Limpia todo lo `zz-qa-` que crea, en la misma corrida (éxito o fallo).
 */
import { navegadorConSesion, psql as psqlLectura } from "./lib/sesion_dueno.mjs";

const APP = "https://app.onia.com.bo";
const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-checkoutdir-${TS}`;
const EMAIL = `zz-qa-checkoutdir-${TS}@onia.com.bo`;

let orgId = null;
let userId = null;

function psql(sql) {
  return psqlLectura(sql).split("\n")[0].trim();
}
function psqlSeguro(sql) {
  try {
    return psql(sql);
  } catch (e) {
    console.error(`  (falló, sigo) ${sql.slice(0, 80)}... -> ${e.message.split("\n")[0]}`);
    return null;
  }
}

function limpiar() {
  console.log("\n--- LIMPIEZA ---");
  if (orgId) {
    console.log("organización antes de borrar:\n" + psqlSeguro(`select id, name, plan from organizations where id='${orgId}'`));
    psqlSeguro(`delete from profiles where "organizationId"='${orgId}'`);
    psqlSeguro(`delete from clinic_settings where "organizationId"='${orgId}'`);
    psqlSeguro(`delete from organizations where id='${orgId}'`);
  }
  if (userId) {
    psqlSeguro(`delete from auth.identities where user_id='${userId}'`);
    psqlSeguro(`delete from auth.users where id='${userId}'`);
  }
  console.log(`zz-qa- restantes en organizations: ${psqlSeguro(`select count(*) from organizations where name like 'zz-qa-%'`)}`);
}

async function main() {
  console.log(`--- sembrando org ${SLUG} en plan basic ---`);
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

  const { navegador, pagina, fallos } = await navegadorConSesion(EMAIL, { viewport: { width: 390, height: 844 } });
  try {
    // Fuente: git show origin/master:lib/subscription-plans.ts DEFAULT_PLAN_AMOUNTS,
    // 2026-09-19: crece 550/mes, clinic 1290/mes.
    const PLANES = [
      { plan: "crece", monto: "550", archivo: "checkoutdir-01-crece.png" },
      { plan: "clinic", monto: "1.290", archivo: "checkoutdir-02-clinic.png" },
    ];
    for (const { plan, monto, archivo } of PLANES) {
      console.log(`\n--- abriendo /checkout?plan=${plan} ---`);
      await pagina.goto(`${APP}/checkout?plan=${plan}`, { waitUntil: "load", timeout: 30_000 });
      await pagina.waitForTimeout(1200);
      await pagina.screenshot({ path: `hermes-content/docs/recorrido/capturas/${archivo}`, fullPage: true });
      const url = pagina.url();
      if (!url.includes("/checkout")) throw new Error(`plan=${plan}: no llegó a /checkout, terminó en ${url}`);
      const texto = await pagina.locator("body").innerText();
      const tieneMonto = texto.includes(monto);
      console.log(`plan=${plan}: url=${url} monto '${monto}' presente=${tieneMonto}`);
      if (!tieneMonto) {
        console.log("---- texto visible (primeros 800) ----");
        console.log(texto.slice(0, 800));
      }
      if (plan === "clinic") {
        const mencionaWhatsapp = /whatsapp/i.test(texto) && /incluid/i.test(texto);
        console.log(`clinic: menciona WhatsApp incluido = ${mencionaWhatsapp}`);
      }
    }

    // Escalón 3 nuevo: el selector de CICLO (weekly/monthly/annual). Fuente:
    // DEFAULT_PLAN_AMOUNTS — crece SÍ tiene weekly (145), clinic NO (el "Full" no se
    // fracciona, confirmado en subscription-plans.ts:42-43). El checkout tiene que
    // deshabilitar/avisar "Solo mensual o anual" cuando el plan no ofrece ese ciclo,
    // y mostrar el monto anual correcto cuando sí lo ofrece.
    const CICLOS = [
      { plan: "crece", cycle: "annual", monto: "5.500", archivo: "checkoutdir-03-crece-anual.png" },
      { plan: "clinic", cycle: "annual", monto: "12.900", archivo: "checkoutdir-04-clinic-anual.png" },
      { plan: "clinic", cycle: "weekly", monto: null, archivo: "checkoutdir-05-clinic-semanal.png" },
    ];
    for (const { plan, cycle, monto, archivo } of CICLOS) {
      console.log(`\n--- /checkout?plan=${plan} → clic en ciclo ${cycle} ---`);
      await pagina.goto(`${APP}/checkout?plan=${plan}`, { waitUntil: "load", timeout: 30_000 });
      await pagina.waitForTimeout(800);
      const boton = pagina.locator(`button:has-text("${cycle === "annual" ? "Anual" : cycle === "weekly" ? "Semanal" : "Mensual"}")`).first();
      await boton.click({ timeout: 10_000 }).catch((e) => console.log(`  no pude clickear el botón de ciclo: ${e.message.split("\n")[0]}`));
      await pagina.waitForTimeout(600);
      await pagina.screenshot({ path: `hermes-content/docs/recorrido/capturas/${archivo}`, fullPage: true });
      const texto2 = await pagina.locator("body").innerText();
      if (monto) {
        console.log(`plan=${plan} ciclo=${cycle}: monto '${monto}' presente=${texto2.includes(monto)}`);
      } else {
        // clinic + weekly: no debería ofrecer ese ciclo — buscamos el aviso o que haya
        // quedado en mensual (Bs 1.290) en vez de fallar silenciosamente a otro monto.
        const avisoSinCiclo = /solo mensual o anual/i.test(texto2);
        const sigueEnMensual = texto2.includes("1.290");
        console.log(`plan=clinic ciclo=weekly: aviso "solo mensual o anual"=${avisoSinCiclo}, sigue en monto mensual (1.290)=${sigueEnMensual}`);
      }
    }

    console.log("\nfallos de red (status>=400):", fallos.length ? fallos.join("; ") : "ninguno");
  } finally {
    await navegador.close();
    limpiar();
  }
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  limpiar();
  process.exit(1);
});
