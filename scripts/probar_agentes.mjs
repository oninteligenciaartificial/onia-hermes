#!/usr/bin/env node
/**
 * probar_agentes.mjs — recorrido de escalón 3: la pantalla `/agents` ("Agentes"), nunca antes
 * probada por este carril contra producción con una cuenta real.
 *
 * `module.agents` entra por plan (Pro+, `agentsIncluded`) — ver
 * `lib/platform/entitlements.ts:52` en onia-platform. Una org `professional` con
 * `trialEnd`/`planEnd` vigentes debe VER la pantalla completa: título, el equipo de agentes
 * en el vocabulario del rubro (dental: "pacientes"), y el link a /pending. AGENTS_RUNTIME=1 y
 * PLATFORM_LAYER=1 ya están activos en el contenedor (verificado antes de escribir esto).
 *
 * Lo que verifica, contra producción, con sesión real (no admin API pelada):
 *   1. La pantalla abre sin 400+ en ningún subrecurso y sin redirect a /dashboard o /login
 *      (eso pasaría si `requireFeature("module.agents")` la rechazara).
 *   2. El equipo de agentes lista Recall/Cobrador/Confirmador en el vocabulario de DENTAL
 *      ("pacientes"), sin el Captador (gateado por `addon.captador`, que esta org no compró).
 *   3. El texto de "sin propuestas todavía" es el de siempre (org recién sembrada, 0 corridas).
 *   4. El link a /pending existe.
 *
 *   node scripts/probar_agentes.mjs
 *
 * Limpia todo lo `zz-qa-` que crea, en la misma corrida (éxito o fallo).
 */
import { execFileSync } from "node:child_process";
import { navegadorConSesion } from "./lib/sesion_dueno.mjs";

const APP = "https://app.onia.com.bo";
const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-agentes-${TS}`;
const EMAIL_DUENO = `zz-qa-agentes-owner-${TS}@onia.com.bo`;
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

function limpiar() {
  console.log("\n--- LIMPIEZA ---");
  if (orgId) {
    psqlSeguro(`delete from profiles where "organizationId"='${orgId}'`);
    psqlSeguro(`delete from clinic_settings where "organizationId"='${orgId}'`);
    psqlSeguro(`delete from organizations where id='${orgId}'`);
  }
  if (ownerUserId) {
    psqlSeguro(`delete from auth.identities where user_id='${ownerUserId}'`);
    psqlSeguro(`delete from auth.users where id='${ownerUserId}'`);
  }
  const orgsRestantes = psqlSeguro(`select count(*) from organizations where slug='${SLUG}'`);
  const usersRestantes = psqlSeguro(`select count(*) from auth.users where email='${EMAIL_DUENO}'`);
  console.log(`verificado al cerrar: organizations=${orgsRestantes} auth.users=${usersRestantes}`);
  if (orgsRestantes !== "0" || usersRestantes !== "0") {
    console.error(`LIMPIEZA INCOMPLETA — anotar a mano: ${JSON.stringify({ orgId, ownerUserId, SLUG })}`);
  }
}

async function main() {
  // Fila impresa ANTES de borrar, regla de la casa: se imprime al crear, no hace falta un
  // SELECT aparte porque acá se ve el mismo dato con el `returning`.
  orgId = psql(
    `insert into organizations (id, name, slug, plan, "verticalTrackId",
       "onboardingCompletedAt", "trialEnd", "planEnd", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, 'ZZ QA Agentes ${TS}', '${SLUG}', 'professional',
       'dentagest-clinical', now(), now() + interval '1 year', now() + interval '1 year', now(), now())
     returning id`
  );
  console.log("org creada (plan professional, dental, sin agentes sembrados):", orgId, SLUG);

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
  psql(
    `insert into clinic_settings (id, "organizationId", timezone, "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${orgId}', 'America/La_Paz', now(), now())
     on conflict do nothing`
  );
  console.log("dueño sembrado:", ownerUserId, EMAIL_DUENO);

  const { navegador, pagina, fallos } = await navegadorConSesion(EMAIL_DUENO, {
    viewport: { width: 390, height: 844 },
  });
  await pagina.goto(`${APP}/agents`, { waitUntil: "load", timeout: 30_000 });
  await pagina.locator("h1", { hasText: "Agentes" }).waitFor({ timeout: 15_000 }).catch(() => {});
  const urlFinal = pagina.url();
  const texto = (await pagina.locator("body").innerText()).replace(/\s+/g, " ");
  await pagina.screenshot({ path: `${CAPTURAS}/extra-agentes-00-pantalla.png`, fullPage: true }).catch(() => {});
  const linkPending = await pagina
    .locator('a[href="/pending"]')
    .first()
    .getAttribute("href")
    .catch(() => null);
  await navegador.close();

  console.log(`URL final: ${urlFinal}`);
  if (fallos.length) console.log(`respuestas >=400 en la carga: ${fallos.join(" | ")}`);

  const abrioLaPantalla = urlFinal.endsWith("/agents") && !urlFinal.includes("/login") && !urlFinal.includes("/dashboard");
  const tieneRecall = /Recall/.test(texto) && /pacientes/i.test(texto);
  const tieneCobrador = /Cobrador/.test(texto);
  const tieneConfirmador = /Confirmador/.test(texto);
  const NO_tieneCaptador = !/Captador/.test(texto);
  const tieneTextoVacio = /Todavía no hay propuestas/.test(texto);
  const diceNuncaSoloEnvia = /Nada se envía solo/.test(texto);

  console.log(`abrió /agents (no redirigió): ${abrioLaPantalla ? "sí" : "NO"}`);
  console.log(`Recall en vocabulario dental ("pacientes"): ${tieneRecall ? "sí" : "NO"}`);
  console.log(`Cobrador listado: ${tieneCobrador ? "sí" : "NO"}`);
  console.log(`Confirmador listado (dental tiene agenda): ${tieneConfirmador ? "sí" : "NO"}`);
  console.log(`Captador NO listado (add-on no comprado): ${NO_tieneCaptador ? "sí" : "NO — hallazgo"}`);
  console.log(`texto de "sin propuestas todavía" (org recién sembrada): ${tieneTextoVacio ? "sí" : "NO"}`);
  console.log(`promesa "nada se envía solo" a la vista: ${diceNuncaSoloEnvia ? "sí" : "NO"}`);
  console.log(`link a /pending: ${linkPending ?? "NO ENCONTRADO"}`);

  const fallo =
    !abrioLaPantalla ||
    !tieneRecall ||
    !tieneCobrador ||
    !tieneConfirmador ||
    !NO_tieneCaptador ||
    !tieneTextoVacio ||
    !linkPending ||
    fallos.length > 0;

  if (fallo) {
    console.error("FALLO: la pantalla /agents no sostiene lo que promete para una org professional/dental recién creada.");
    limpiar();
    process.exit(1);
  }

  console.log(
    "\nRESULTADO: /agents abre con sesión real de una org plan professional/dental recién " +
      "sembrada, en el vocabulario correcto del rubro, sin ofrecer el rol de add-on no comprado, " +
      "y con el link a Pendientes. Sin hallazgo."
  );
  limpiar();
  process.exit(0);
}

main().catch((e) => {
  console.error("ERROR no manejado:", e);
  limpiar();
  process.exit(2);
});
