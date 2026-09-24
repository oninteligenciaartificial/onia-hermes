#!/usr/bin/env node
/**
 * probar_agentes_pending.mjs — escalón nuevo del recorrido de cliente: `/pending`
 * ("Pendientes") con una propuesta REAL de agente esperando aprobación, nunca antes
 * probado por este carril. Sigue el orden que dejó la entrada del 2026-09-24 16:11
 * en `ULTIMO_RECORRIDO.md`.
 *
 * Riesgo evitado a propósito: aprobar con canal real dispara un envío de verdad
 * (`app/api/onia-core/approvals/route.ts`: "APROBAR EJECUTA LA ACCION"). Este carril
 * tiene prohibido escribirle a un prospecto, así que el único botón que se toca es
 * "Rechazar" — el propio código lo documenta como el que "no manda nada".
 *
 * Sembrado por SQL replicando la cadena REAL que arma `agents-runtime.ts`
 * (agente → corrida con itemsProduced=1 → acción pending_approval → approval
 * request con metadata.agentActionId, para que markApprovalRejected encuentre la
 * acción y la transicione), no solo la tabla que mira `/agents`.
 *
 *   node scripts/probar_agentes_pending.mjs
 *
 * Limpia todo lo `zz-qa-` que crea, en la misma corrida (éxito o fallo).
 */
import { execFileSync } from "node:child_process";
import { navegadorConSesion } from "./lib/sesion_dueno.mjs";

const APP = "https://app.onia.com.bo";
const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-agentes-pending-${TS}`;
const EMAIL_DUENO = `zz-qa-agentes-pending-owner-${TS}@onia.com.bo`;
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
    psqlSeguro(`update "onia_agents_actions" set "approvalRequestId"=null where "organizationId"='${orgId}'`);
    psqlSeguro(`delete from "onia_core_approval_requests" where "organizationId"='${orgId}'`);
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
  const approvalsRestantes = psqlSeguro(`select count(*) from "onia_core_approval_requests" where "organizationId"='${orgId}'`);
  console.log(
    `verificado al cerrar: organizations=${orgsRestantes} auth.users=${usersRestantes} onia_core_approval_requests=${approvalsRestantes}`
  );
  if (orgsRestantes !== "0" || usersRestantes !== "0" || approvalsRestantes !== "0") {
    console.error(`LIMPIEZA INCOMPLETA — anotar a mano: ${JSON.stringify({ orgId, ownerUserId, SLUG })}`);
  }
}

async function main() {
  orgId = psql(
    `insert into organizations (id, name, slug, plan, "verticalTrackId",
       "onboardingCompletedAt", "trialEnd", "planEnd", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, 'ZZ QA Agentes Pending ${TS}', '${SLUG}', 'professional',
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
  const ownerProfileId = psql(
    `insert into profiles (id, "userId", "organizationId", name, email, role, "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${ownerUserId}', '${orgId}', 'ZZ QA Owner', '${EMAIL_DUENO}',
       'ADMIN', now(), now())
     returning id`
  );
  psql(
    `insert into clinic_settings (id, "organizationId", timezone, "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${orgId}', 'America/La_Paz', now(), now())
     on conflict do nothing`
  );
  console.log("dueño sembrado:", ownerUserId, ownerProfileId, EMAIL_DUENO);

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
       '{"suggestedMessage":"Hola, notamos que no volvés hace un tiempo — ¿querés agendar tu próximo control?","channel":"whatsapp","phone":"59100000000","patientName":"ZZ QA Paciente"}'::jsonb,
       now(), now())
     returning id`
  );
  // Metadata REAL: la misma forma que agents-runtime.ts escribe (kind, agentId,
  // agentRole, agentName, agentActionId, actionType, suggestedMessage, dispatch) —
  // sin agentActionId, markApprovalRejected (dispatcher.ts:446) no encuentra qué
  // acción transicionar y la rechazada queda huérfana.
  const approvalId = psql(
    `insert into "onia_core_approval_requests"
       (id, "organizationId", "entityType", "entityId", "requestType", status,
        "requestedByProfileId", reason, metadata, "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${orgId}', 'patient', '${actionId}', 'agent_action', 'pending',
       '${ownerProfileId}', 'Recontactar a paciente sin volver hace 4 meses',
       '{"kind":"agent_action","agentId":"${agentId}","agentRole":"recall","agentName":"Recall — reactivación de pacientes","agentActionId":"${actionId}","actionType":"send_message","suggestedMessage":"Hola, notamos que no volvés hace un tiempo — ¿querés agendar tu próximo control?","dispatch":{"channel":"whatsapp","to":"59100000000","recipientName":"ZZ QA Paciente","body":"Hola, notamos que no volvés hace un tiempo — ¿querés agendar tu próximo control?"}}'::jsonb,
       now(), now())
     returning id`
  );
  psql(`update "onia_agents_actions" set "approvalRequestId"='${approvalId}' where id='${actionId}'`);
  console.log("agente/corrida/acción/approval sembrados:", { agentId, runId, actionId, approvalId });

  const { navegador, pagina, fallos } = await navegadorConSesion(EMAIL_DUENO, {
    viewport: { width: 390, height: 844 },
  });

  // --- Paso A: /pending antes de decidir ---
  await pagina.goto(`${APP}/pending`, { waitUntil: "load", timeout: 30_000 });
  await pagina.locator("h1", { hasText: "Pendientes" }).waitFor({ timeout: 15_000 }).catch(() => {});
  const urlPending = pagina.url();
  const textoAntes = (await pagina.locator("body").innerText()).replace(/\s+/g, " ");
  await pagina.screenshot({ path: `${CAPTURAS}/extra-pending-00-antes.png`, fullPage: true }).catch(() => {});

  const abrioPending = urlPending.endsWith("/pending") && !urlPending.includes("/login");
  const tituloPropuesta = /Propuesta de Recall/.test(textoAntes);
  const pedidoPor = /Pedido por ZZ QA Owner/.test(textoAntes);
  const razonVisible = /Recontactar a paciente sin volver hace 4 meses/.test(textoAntes);
  const canalYDestino = /whatsapp a ZZ QA Paciente/i.test(textoAntes) || /WhatsApp a ZZ QA Paciente/.test(textoAntes);
  const cuerpoDelMensaje = /Hola, notamos que no volvés hace un tiempo/.test(textoAntes);
  const botonRechazar = await pagina.getByRole("button", { name: "Rechazar" }).count();

  console.log(`URL final /pending: ${urlPending}`);
  console.log(`abrió /pending (no redirigió): ${abrioPending ? "sí" : "NO"}`);
  console.log(`título "Propuesta de Recall" (nombre del agente, no la clave): ${tituloPropuesta ? "sí" : "NO"}`);
  console.log(`"Pedido por ZZ QA Owner": ${pedidoPor ? "sí" : "NO"}`);
  console.log(`razón de la propuesta visible: ${razonVisible ? "sí" : "NO"}`);
  console.log(`canal + destinatario visibles: ${canalYDestino ? "sí" : "NO"}`);
  console.log(`cuerpo exacto del mensaje visible: ${cuerpoDelMensaje ? "sí" : "NO"}`);
  console.log(`botón "Rechazar" presente: ${botonRechazar > 0 ? "sí" : "NO"}`);

  if (fallos.length) console.log(`respuestas >=400 en la carga: ${fallos.join(" | ")}`);

  // --- Paso B: click en Rechazar (el único que el código garantiza que no envía nada) ---
  let notaRechazo = "";
  let httpRechazoOk = false;
  if (botonRechazar > 0) {
    const respuestaPromesa = pagina
      .waitForResponse((r) => r.url().includes("/api/onia-core/approvals") && r.request().method() === "PATCH", { timeout: 15_000 })
      .catch(() => null);
    await pagina.getByRole("button", { name: "Rechazar" }).first().click();
    const respuesta = await respuestaPromesa;
    httpRechazoOk = respuesta ? respuesta.status() === 200 : false;
    await pagina.waitForTimeout(1500);
    notaRechazo = (await pagina.locator("body").innerText()).replace(/\s+/g, " ");
  }
  await pagina.screenshot({ path: `${CAPTURAS}/extra-pending-01-rechazado.png`, fullPage: true }).catch(() => {});

  const noticeRechazado = /Rechazado\. No se envío nada\./.test(notaRechazo);
  const propuestaDesaparecioDeLista = !/Propuesta de Recall/.test(notaRechazo);

  console.log(`PATCH de rechazo devolvió 200: ${httpRechazoOk ? "sí" : "NO"}`);
  console.log(`notice "Rechazado. No se envío nada.": ${noticeRechazado ? "sí" : "NO"}`);
  console.log(`la propuesta ya no aparece en la lista: ${propuestaDesaparecioDeLista ? "sí" : "NO"}`);

  // --- Paso C: efecto en la base — nada se envió, la acción quedó rejected ---
  const approvalStatus = psql(`select status from "onia_core_approval_requests" where id='${approvalId}'`);
  const actionStatus = psql(`select status from "onia_agents_actions" where id='${actionId}'`);
  const dispatchCount = psql(`select count(*) from "onia_core_dispatches" where "approvalId"='${approvalId}'`);
  console.log(`DB approval.status: ${approvalStatus} (esperado: rejected)`);
  console.log(`DB action.status: ${actionStatus} (esperado: rejected)`);
  console.log(`DB dispatches para esta aprobación: ${dispatchCount} (esperado: 0 — nada se envió)`);

  // --- Paso D: el efecto honesto en /agents (bug real de esta cadena, corregido 2026-09-13) ---
  await pagina.goto(`${APP}/agents`, { waitUntil: "load", timeout: 30_000 });
  await pagina.locator("h1", { hasText: "Agentes" }).waitFor({ timeout: 15_000 }).catch(() => {});
  const textoAgents = (await pagina.locator("body").innerText()).replace(/\s+/g, " ");
  await pagina.screenshot({ path: `${CAPTURAS}/extra-pending-02-agents-despues.png`, fullPage: true }).catch(() => {});

  const yaNoCuentaComoEsperando = !/esperando aprobación/.test(textoAgents);
  const textoHonesto = /Tus agentes ya propusieron 1 acción en sus últimas corridas, y ninguna sigue en esta lista/.test(
    textoAgents
  );
  const textoFalsoAusente = !/Todavía no hay propuestas\. Cuando un agente detecte algo/.test(textoAgents);

  console.log(`/agents ya NO cuenta "esperando aprobación": ${yaNoCuentaComoEsperando ? "sí" : "NO"}`);
  console.log(`/agents dice el texto HONESTO (propuso 1, se rechazó): ${textoHonesto ? "sí" : "NO"}`);
  console.log(`/agents NO dice "Todavía no hay propuestas" (sería falso, sí propuso): ${textoFalsoAusente ? "sí" : "NO"}`);

  await navegador.close();

  const fallo =
    !abrioPending ||
    !tituloPropuesta ||
    !pedidoPor ||
    !razonVisible ||
    !canalYDestino ||
    !cuerpoDelMensaje ||
    botonRechazar === 0 ||
    !httpRechazoOk ||
    !noticeRechazado ||
    !propuestaDesaparecioDeLista ||
    approvalStatus !== "rejected" ||
    actionStatus !== "rejected" ||
    dispatchCount !== "0" ||
    !yaNoCuentaComoEsperando ||
    !textoHonesto ||
    !textoFalsoAusente ||
    fallos.length > 0;

  if (fallo) {
    console.error("FALLO: /pending o el efecto de rechazar una propuesta real no sostiene lo que promete.");
    limpiar();
    process.exit(1);
  }

  console.log(
    "\nRESULTADO: /pending muestra una propuesta real de agente entera (agente, motivo, canal, " +
      "destinatario, mensaje exacto), Rechazar no envía nada (0 dispatches en la base) y /agents " +
      "refleja el rechazo con el texto honesto (propuso 1, ninguna sigue en la lista) en vez del " +
      "texto de 'nunca propuso nada'. Sin hallazgo."
  );
  limpiar();
  process.exit(0);
}

main().catch((e) => {
  console.error("ERROR no manejado:", e);
  limpiar();
  process.exit(2);
});
