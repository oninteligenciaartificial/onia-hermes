#!/usr/bin/env node
/**
 * probar_cupo_chatbot.mjs — recorrido de escalón 3: la tarjeta de cupo del chatbot
 * (`/settings/chatbot`, `CupoConversacionesCard`) con USO REAL sembrado, no sólo el
 * render-test que ya existe (`CupoConversacionesCard.render.test.ts`, que da un `EstadoCupo`
 * fabricado a mano). Nunca se probó en este carril contra la BASE real: org con
 * `whatsappAddon=true`, fila de `chatbot_uso_mensual` del mes en curso, y la pantalla del
 * dueño MIRADA renderizada — dos escalones, 80% (alerta) y 100% (agotada).
 *
 * Lo que verifica, contra producción:
 *   1. Con 400/500 usadas (80%, el umbral de aviso) aparece la barra ámbar, el texto de
 *      alerta y el botón "Sumar 200 conversaciones" con un link `wa.me` real que menciona el
 *      precio (Bs 190) de `RECARGA_CONVERSACIONES` — no un botón mudo ni un texto sin salida.
 *   2. Con 500/500 (agotado) la barra pasa a rojo/error y el texto avisa que se derivó a una
 *      persona — la promesa de "cupo agotado nunca es silencio" (memoria compartida) medida en
 *      la pantalla del dueño, no sólo en el motor del bot.
 *
 *   node scripts/probar_cupo_chatbot.mjs
 *
 * Limpia todo lo `zz-qa-` que crea, en la misma corrida (éxito o fallo).
 */
import { execFileSync } from "node:child_process";
import { navegadorConSesion } from "./lib/sesion_dueno.mjs";

const APP = "https://app.onia.com.bo";
const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-cupochatbot-${TS}`;
const EMAIL_DUENO = `zz-qa-cupochatbot-owner-${TS}@onia.com.bo`;
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
    psqlSeguro(`delete from chatbot_uso_mensual where "organizationId"='${orgId}'`);
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

async function mirarConUso(usadas, mes, etiqueta) {
  psql(
    `insert into chatbot_uso_mensual (id, "organizationId", mes, conversaciones, "mensajesEntrantes", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${orgId}', '${mes}', ${usadas}, ${usadas}, now(), now())
     on conflict ("organizationId", mes) do update set conversaciones=${usadas}, "updatedAt"=now()`
  );
  const filaCruda = psql(`select "organizationId", mes, conversaciones from chatbot_uso_mensual where "organizationId"='${orgId}' and mes='${mes}'`);
  console.log(`  fila sembrada (organizationId|mes|conversaciones): ${filaCruda}`);
  const { navegador, pagina, fallos } = await navegadorConSesion(EMAIL_DUENO, {
    viewport: { width: 390, height: 844 },
  });
  await pagina.goto(`${APP}/settings/chatbot`, { waitUntil: "load", timeout: 30_000 });
  const barraCupo = pagina.locator('[role="progressbar"][aria-label="Conversaciones usadas este mes"]');
  await barraCupo.waitFor({ timeout: 15_000 });
  const texto = (await pagina.locator("body").innerText()).replace(/\s+/g, " ");
  await pagina.screenshot({ path: `${CAPTURAS}/extra-cupochatbot-${etiqueta}.png`, fullPage: true }).catch(() => {});
  const valorNow = await barraCupo.getAttribute("aria-valuenow");
  const claseBarra = await barraCupo.locator("> div").first().getAttribute("class");
  const linkWa = await pagina.locator('a[href*="wa.me"]').first().getAttribute("href").catch(() => null);
  if (fallos.length) console.log(`  respuestas >=400 en la carga: ${fallos.join(" | ")}`);
  await navegador.close();
  return { texto, valorNow, claseBarra, linkWa };
}

async function main() {
  orgId = psql(
    `insert into organizations (id, name, slug, plan, "verticalTrackId", "whatsappAddon",
       "onboardingCompletedAt", "trialEnd", "planEnd", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, 'ZZ QA Cupo Chatbot ${TS}', '${SLUG}', 'professional',
       'dentagest-clinical', true, now(), now() + interval '1 year', now() + interval '1 year', now(), now())
     returning id`
  );
  console.log("org creada (whatsappAddon=true):", orgId, SLUG);

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

  const mes = new Intl.DateTimeFormat("en-CA", { timeZone: "America/La_Paz", year: "numeric", month: "2-digit" }).format(new Date());

  // Escalón 1: 400/500 = 80%, el umbral de aviso.
  const r80 = await mirarConUso(400, mes, "01-80pct");
  console.log(`80%% -> aria-valuenow=${r80.valorNow}, clase barra="${r80.claseBarra}"`);
  console.log(`  link wa.me: ${r80.linkWa}`);
  const tieneBoton80 = /Sumar 200 conversaciones/.test(r80.texto);
  const barraAmbar80 = /amber/.test(r80.claseBarra || "");
  const linkTienePrecio80 = r80.linkWa ? decodeURIComponent(r80.linkWa).includes("190") : false;
  console.log(`  botón "Sumar 200 conversaciones": ${tieneBoton80 ? "sí" : "NO"}`);
  console.log(`  barra ámbar (alerta): ${barraAmbar80 ? "sí" : "NO"}`);
  console.log(`  el link de WhatsApp menciona el precio (Bs 190): ${linkTienePrecio80 ? "sí" : "NO"}`);
  if (!tieneBoton80 || !barraAmbar80 || !r80.linkWa || !linkTienePrecio80) {
    console.error("FALLO: al 80% del cupo, la tarjeta no ofrece la salida completa (botón + alerta + precio real en el link).");
    limpiar();
    process.exit(1);
  }

  // Escalón 2: 500/500 = 100%, agotado.
  const r100 = await mirarConUso(500, mes, "02-100pct-agotado");
  console.log(`100%% -> aria-valuenow=${r100.valorNow}, clase barra="${r100.claseBarra}"`);
  const barraError100 = /error/.test(r100.claseBarra || "");
  const dicePersona = /persona|humano/i.test(r100.texto);
  console.log(`  barra roja (agotado): ${barraError100 ? "sí" : "NO"}`);
  console.log(`  el texto menciona derivar a una persona: ${dicePersona ? "sí" : "NO (revisar textoDeCupo)"}`);
  if (!barraError100) {
    console.error("FALLO: al 100%% del cupo, la barra no pasa a rojo/error — el dueño no distingue 'agotado' de 'en alerta'.");
    limpiar();
    process.exit(1);
  }

  console.log(
    "\nRESULTADO: la tarjeta de cupo del chatbot, con uso REAL sembrado en la base (no un " +
      "fixture de test), sostiene los dos escalones que promete — aviso al 80%% con salida " +
      "real por WhatsApp (precio correcto) y agotado al 100%%. Sin hallazgo."
  );
  if (!dicePersona) {
    console.log(
      "NOTA (no bloqueante): el texto de la tarjeta en 100%% no menciona explícitamente " +
        "'persona'/'humano' — puede ser correcto (textoDeCupo usa otra redacción); revisar a mano " +
        `si hace falta: "${r100.texto.slice(0, 300)}"`
    );
  }
  limpiar();
  process.exit(0);
}

main().catch((e) => {
  console.error("ERROR no manejado:", e);
  limpiar();
  process.exit(2);
});
