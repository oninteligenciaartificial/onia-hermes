#!/usr/bin/env node
/**
 * probar_coadministrador.mjs — recorrido de escalón 3: invitar y quitar un co-administrador
 * en `/settings` (superficie DG-043, plan `clinic` = "Completo", multiAdminIncluided:true),
 * de punta a punta contra HTTP real de producción (POST /api/admin/users, GET, DELETE).
 *
 * No se probó nunca por este carril: el bug original que DG-043 cerró (un ADMIN colado por
 * la puerta de invitación por correo en un plan que no lo paga) se verificaba leyendo código,
 * nunca ejecutando la API real con una sesión de dueño.
 *
 *   node scripts/probar_coadministrador.mjs
 *
 * Limpia todo lo `zz-qa-` que crea, en la misma corrida (éxito o fallo).
 */
import { execFileSync } from "node:child_process";
import { acunarSesion } from "./lib/sesion_dueno.mjs";

const APP = "https://app.onia.com.bo";
const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-coadmin-${TS}`;
const EMAIL_DUENO = `zz-qa-coadmin-owner-${TS}@onia.com.bo`;
const EMAIL_SEGUNDO = `zz-qa-coadmin-second-${TS}@onia.com.bo`;

/**
 * `psql -tAc` con `INSERT ... RETURNING` imprime la fila Y el tag de comando ("INSERT 0 1")
 * pegado debajo — medido de frente: `-t` no lo suprime para RETURNING como sí lo hace en
 * SELECT. Devolver sólo la primera línea es correcto para toda consulta de este script (un
 * solo valor o un conteo por fila).
 */
function psql(sql) {
  const crudo = execFileSync(
    "docker",
    ["exec", "-i", "supabase-db", "psql", "-U", "postgres", "-d", "postgres", "-tAc", sql],
    { encoding: "utf8", timeout: 20_000 }
  ).trim();
  return crudo.split("\n")[0].trim();
}

/** Variante que SÍ devuelve todas las líneas — sólo para imprimir evidencia (varias filas). */
function psqlMultilinea(sql) {
  return execFileSync(
    "docker",
    ["exec", "-i", "supabase-db", "psql", "-U", "postgres", "-d", "postgres", "-tAc", sql],
    { encoding: "utf8", timeout: 20_000 }
  ).trim();
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
  if (orgId) {
    let filas = "";
    try {
      filas = psqlMultilinea(`select id, "userId", role from profiles where "organizationId"='${orgId}'`);
    } catch (e) {
      filas = `(no se pudo leer: ${e.message.split("\n")[0]})`;
    }
    console.log("profiles antes de borrar:\n" + filas);
  }
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
    console.error(`LIMPIEZA INCOMPLETA — anotar a mano: ${JSON.stringify({ orgId, ownerUserId, segundoUserId, segundoProfileId, SLUG })}`);
  }
}

async function main() {
  // 1. Sembrar org con plan 'clinic' (multiAdminIncluido:true — Completo, Bs 1.290) y su dueño.
  orgId = psql(
    `insert into organizations (id, name, slug, plan, "verticalTrackId", "onboardingCompletedAt",
       "trialEnd", "planEnd", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, 'ZZ QA Coadmin ${TS}', '${SLUG}', 'clinic', 'dentagest-clinical',
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

  // 2. Sesión real del dueño.
  const { cookies, host } = await acunarSesion(EMAIL_DUENO);
  const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");
  const headers = { "Content-Type": "application/json", Cookie: cookieHeader };

  // 3. POST /api/admin/users — invitar un segundo ADMIN por correo. El plan 'clinic' SÍ lo paga.
  const rInvite = await fetch(`${APP}/api/admin/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email: EMAIL_SEGUNDO, name: "ZZ QA Segundo Admin", role: "ADMIN" }),
  });
  const jInvite = await rInvite.json().catch(() => null);
  console.log(`POST /api/admin/users -> ${rInvite.status}`, JSON.stringify(jInvite));
  if (rInvite.status !== 201 || !jInvite?.success) {
    console.error(
      `FALLO: invitar un segundo ADMIN en un plan 'clinic' (que SÍ trae coadministradores) ` +
        `debería dar 201. Dio ${rInvite.status}.`
    );
    limpiar();
    process.exit(1);
  }
  segundoProfileId = jInvite.data.id;

  // 4. Confirmar en la base que el profile y el auth.users del invitado quedaron.
  segundoUserId = psql(`select "userId" from profiles where id='${segundoProfileId}'`);
  const rolSegundo = psql(`select role from profiles where id='${segundoProfileId}'`);
  console.log(`profile invitado: id=${segundoProfileId} userId=${segundoUserId} role=${rolSegundo}`);
  if (rolSegundo !== "ADMIN") {
    console.error(`FALLO: el profile invitado quedó con role='${rolSegundo}', esperaba ADMIN.`);
    limpiar();
    process.exit(1);
  }

  // 5. GET /api/admin/users — confirmar que la LISTA (lo que el dueño VE) trae a los dos.
  const rList = await fetch(`${APP}/api/admin/users`, { headers: { Cookie: cookieHeader } });
  const jList = await rList.json().catch(() => null);
  const cantidad = jList?.data?.length ?? -1;
  console.log(`GET /api/admin/users -> ${rList.status}, ${cantidad} usuario(s)`);
  if (cantidad !== 2) {
    console.error(`FALLO: esperaba 2 usuarios en la lista, la pantalla mostraría ${cantidad}.`);
    limpiar();
    process.exit(1);
  }

  // 6. DELETE /api/admin/users/[id] — el camino de VUELTA: sacar al segundo ADMIN.
  //    Con 2 ADMIN, sacar uno debe permitirse (queda 1, la org no se queda sin ninguno).
  const rDelete = await fetch(`${APP}/api/admin/users/${segundoProfileId}`, {
    method: "DELETE",
    headers: { Cookie: cookieHeader },
  });
  const jDelete = await rDelete.json().catch(() => null);
  console.log(`DELETE /api/admin/users/${segundoProfileId} -> ${rDelete.status}`, JSON.stringify(jDelete));
  if (rDelete.status !== 200 || !jDelete?.success) {
    console.error(`FALLO: sacar al segundo ADMIN (quedando 1) debería dar 200. Dio ${rDelete.status}.`);
    limpiar();
    process.exit(1);
  }
  segundoProfileId = null; // ya lo borró la API; que la limpieza no intente de nuevo por id

  const quedan = psql(`select count(*) from profiles where "organizationId"='${orgId}'`);
  console.log(`profiles restantes en la org tras el DELETE: ${quedan}`);
  if (quedan !== "1") {
    console.error(`FALLO: esperaba 1 profile restante (el dueño), quedaron ${quedan}.`);
    limpiar();
    process.exit(1);
  }

  console.log(
    "\nRESULTADO: invitar un segundo ADMIN en plan 'clinic' (201), verlo en la lista (2), y " +
      "sacarlo por DELETE (200, vuelve a 1) — las tres puertas de DG-043 sostenidas de punta a " +
      "punta contra producción. Sin hallazgo."
  );
  limpiar();
  process.exit(0);
}

main().catch((e) => {
  console.error("ERROR no manejado:", e);
  limpiar();
  process.exit(2);
});
