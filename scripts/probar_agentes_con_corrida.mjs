#!/usr/bin/env node
/**
 * probar_agentes_con_corrida.mjs — escalón nuevo del recorrido de cliente: `/agents` con
 * agentes YA sembrados y una corrida real, la rama que `probar_agentes.mjs` (2026-09-24,
 * org vacía a propósito) no ejercitó.
 *
 * Contra `app/(dashboard)/agents/agents-view.tsx` de onia-platform:
 *   - `agents.length > 0` → lista los agentes reales (no `AGENT_KINDS` genérico), con su
 *     última corrida vía `RUN_STATUS_LABELS[lastRun.status]`.
 *   - Una `action` en `pending_approval` con `payload.suggestedMessage` → aparece bajo
 *     "Acciones propuestas y aprobadas", con el contador "N esperando aprobación" y el
 *     borrador de texto a la vista (no hace falta un dispatch: `estadoVisibleDeAccion` sólo
 *     mira el despacho para 'executed'/'auto_executed').
 *
 * Sembrado por SQL (org professional/dental vigente, mismo patrón que probar_agentes.mjs):
 * un agente "recall" habilitado + una corrida `completed` con summary + una acción
 * `pending_approval` con `suggestedMessage`.
 *
 *   node scripts/probar_agentes_con_corrida.mjs
 *
 * Limpia todo lo `zz-qa-` que crea, en la misma corrida (éxito o fallo).
 */
import { execFileSync } from "node:child_process";
import { navegadorConSesion } from "./lib/sesion_dueno.mjs";

const APP = "https://app.onia.com.bo";
const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-agentes-run-${TS}`;
const EMAIL_DUENO = `zz-qa-agentes-run-owner-${TS}@onia.com.bo`;
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
    psqlSeguro(`delete from "onia_agents_actions" where "organizationId"='${orgId}'`);
    psqlSeguro(`delete from "onia_agents_runs" where "organizationId"='${orgId}'`);
    psqlSeguro(`delete from "onia_agents_agents" where "organizationId"='${orgId}'`);
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
  const accionesRestantes = psqlSeguro(`select count(*) from "onia_agents_actions" where "organizationId"='${orgId}'`);
  console.log(
    `verificado al cerrar: organizations=${orgsRestantes} auth.users=${usersRestantes} onia_agents_actions=${accionesRestantes}`
  );
  if (orgsRestantes !== "0" || usersRestantes !== "0" || accionesRestantes !== "0") {
    console.error(`LIMPIEZA INCOMPLETA — anotar a mano: ${JSON.stringify({ orgId, ownerUserId, SLUG })}`);
  }
}

async function main() {
  orgId = psql(
    `insert into organizations (id, name, slug, plan, "verticalTrackId",
       "onboardingCompletedAt", "trialEnd", "planEnd", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, 'ZZ QA Agentes Corrida ${TS}', '${SLUG}', 'professional',
       'dentagest-clinical', now(), now() + interval '1 year', now() + interval '1 year', now(), now())
     returning id`
  );
  console.log("org creada (plan professional, dental):", orgId, SLUG);

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

  const agentId = psql(
    `insert into "onia_agents_agents"
       (id, "organizationId", name, role, "autonomyLevel", "triggerType", "intervalMinutes",
        capabilities, description, enabled, "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${orgId}', 'Recall', 'recall', 'suggest', 'cron', 1440,
       '[]'::jsonb, 'Reactivación de pacientes', true, now(), now())
     returning id`
  );
  const runId = psql(
    `insert into "onia_agents_runs"
       (id, "organizationId", "agentId", status, "startedAt", "finishedAt", summary, "itemsProduced", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${orgId}', '${agentId}', 'completed', now() - interval '2 hours',
       now() - interval '1 hour 58 minutes', 'Encontró 1 paciente sin volver hace 4 meses', 1, now(), now())
     returning id`
  );
  const actionId = psql(
    `insert into "onia_agents_actions"
       (id, "organizationId", "agentId", "runId", "actionType", status, "targetType", summary, payload, "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${orgId}', '${agentId}', '${runId}', 'send_message', 'pending_approval',
       'patient', 'Recontactar a paciente sin volver hace 4 meses',
       '{"suggestedMessage":"Hola, notamos que no volvés hace un tiempo — ¿querés agendar tu próximo control?"}'::jsonb,
       now(), now())
     returning id`
  );
  console.log("agente/corrida/acción sembrados:", { agentId, runId, actionId });

  const { navegador, pagina, fallos } = await navegadorConSesion(EMAIL_DUENO, {
    viewport: { width: 390, height: 844 },
  });
  await pagina.goto(`${APP}/agents`, { waitUntil: "load", timeout: 30_000 });
  await pagina.locator("h1", { hasText: "Agentes" }).waitFor({ timeout: 15_000 }).catch(() => {});
  const urlFinal = pagina.url();
  const texto = (await pagina.locator("body").innerText()).replace(/\s+/g, " ");
  await pagina.screenshot({ path: `${CAPTURAS}/extra-agentes-corrida-00-pantalla.png`, fullPage: true }).catch(() => {});
  await navegador.close();

  console.log(`URL final: ${urlFinal}`);
  if (fallos.length) console.log(`respuestas >=400 en la carga: ${fallos.join(" | ")}`);

  const abrioLaPantalla = urlFinal.endsWith("/agents") && !urlFinal.includes("/login") && !urlFinal.includes("/dashboard");
  const nombreDelAgenteReal = /Recall/.test(texto) && /pacientes/i.test(texto);
  const estadoUltimaCorrida = /Completada/.test(texto);
  const summaryDeCorrida = /Encontró 1 paciente sin volver hace 4 meses/.test(texto);
  const contadorEsperando = /1 esperando aprobación/.test(texto);
  const accionListada = /Recontactar a paciente sin volver hace 4 meses/.test(texto);
  const borradorVisible = /Hola, notamos que no volvés hace un tiempo/.test(texto);
  const diceSeAprueba = /se aprueba en Pendientes/.test(texto);

  console.log(`abrió /agents (no redirigió): ${abrioLaPantalla ? "sí" : "NO"}`);
  console.log(`agente real "Recall" en vocabulario dental: ${nombreDelAgenteReal ? "sí" : "NO"}`);
  console.log(`última corrida rotulada "Completada": ${estadoUltimaCorrida ? "sí" : "NO"}`);
  console.log(`summary de la corrida a la vista: ${summaryDeCorrida ? "sí" : "NO"}`);
  console.log(`contador "1 esperando aprobación": ${contadorEsperando ? "sí" : "NO"}`);
  console.log(`acción propuesta listada: ${accionListada ? "sí" : "NO"}`);
  console.log(`borrador del mensaje visible: ${borradorVisible ? "sí" : "NO"}`);
  console.log(`"se aprueba en Pendientes" junto a la acción: ${diceSeAprueba ? "sí" : "NO"}`);

  const fallo =
    !abrioLaPantalla ||
    !nombreDelAgenteReal ||
    !estadoUltimaCorrida ||
    !summaryDeCorrida ||
    !contadorEsperando ||
    !accionListada ||
    !borradorVisible ||
    !diceSeAprueba ||
    fallos.length > 0;

  if (fallo) {
    console.error("FALLO: /agents no sostiene lo que promete con agentes YA sembrados y una corrida real.");
    limpiar();
    process.exit(1);
  }

  console.log(
    "\nRESULTADO: /agents con un agente Recall real, su última corrida completada y una " +
      "acción pendiente de aprobación se ve entera — nombre real, estado de corrida, summary, " +
      "contador y borrador del mensaje. Sin hallazgo."
  );
  limpiar();
  process.exit(0);
}

main().catch((e) => {
  console.error("ERROR no manejado:", e);
  limpiar();
  process.exit(2);
});
