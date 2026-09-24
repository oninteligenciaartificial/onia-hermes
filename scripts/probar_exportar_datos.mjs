#!/usr/bin/env node
/**
 * probar_exportar_datos.mjs — escalón nuevo: "Descargar planillas" (`/settings`, sección
 * Exportar) probado en vivo, con datos reales, en un plan 'basic'.
 *
 * La memoria compartida y el propio comentario de `app/api/settings/export/route.ts` afirman
 * que esta descarga es "un derecho del titular, no una feature del plan: no se gatea por
 * canExportCsv" — pero eso nunca se probó CONTRA producción con un clic real y un plan barato.
 * Este carril nunca había tocado `/settings` sección "export" (sólo "equipo").
 *
 * Siembra una org 'basic' con un paciente, una cita y una factura `zz-qa-`, abre `/settings`
 * con sesión real, hace clic en "Descargar planillas", captura el archivo que Playwright
 * descarga, lo abre como ZIP y confirma que el dato sembrado aparece en el CSV correcto.
 * Limpia todo en la misma corrida (éxito o fallo).
 *
 *   node scripts/probar_exportar_datos.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { navegadorConSesion } from "./lib/sesion_dueno.mjs";

// Sin librería de ZIP en node_modules ("no instales nada nuevo"): se lee con el `zipfile` de
// Python, que ya está en la máquina — un intérprete, no una dependencia nueva.
function listarZip(ruta) {
  const salida = execFileSync("python3", ["-c",
    `import zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); print("\\n".join(z.namelist()))`,
    ruta], { encoding: "utf8" });
  return salida.trim().split("\n").filter(Boolean);
}
function leerDeZip(ruta, entrada) {
  return execFileSync("python3", ["-c",
    `import zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); sys.stdout.buffer.write(z.read(sys.argv[2]))`,
    ruta, entrada], { encoding: "utf8" });
}

const TS = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const SLUG = `zz-qa-export-${TS}`;
const EMAIL_DUENO = `zz-qa-export-owner-${TS}@onia.com.bo`;
const NOMBRE_PACIENTE = `ZZ QA Export Paciente ${TS}`;
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
let patientId = null;
let tmpDir = null;

function limpiar() {
  console.log("\n--- LIMPIEZA ---");
  if (orgId) psqlSeguro(`delete from invoices where "organizationId"='${orgId}'`);
  if (orgId) psqlSeguro(`delete from appointments where "organizationId"='${orgId}'`);
  if (patientId) psqlSeguro(`delete from patients where id='${patientId}'`);
  if (orgId) psqlSeguro(`delete from profiles where "organizationId"='${orgId}'`);
  if (orgId) psqlSeguro(`delete from clinic_settings where "organizationId"='${orgId}'`);
  if (orgId) psqlSeguro(`delete from organizations where id='${orgId}'`);
  if (ownerUserId) {
    psqlSeguro(`delete from auth.identities where user_id='${ownerUserId}'`);
    psqlSeguro(`delete from auth.users where id='${ownerUserId}'`);
  }
  if (tmpDir) {
    try {
      rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }
  const orgsRestantes = psqlSeguro(`select count(*) from organizations where slug='${SLUG}'`);
  const usersRestantes = psqlSeguro(`select count(*) from auth.users where email='${EMAIL_DUENO}'`);
  console.log(`verificado al cerrar: organizations=${orgsRestantes} auth.users=${usersRestantes}`);
  if (orgsRestantes !== "0" || usersRestantes !== "0") {
    console.error(`LIMPIEZA INCOMPLETA — anotar a mano: ${JSON.stringify({ orgId, ownerUserId, patientId, SLUG })}`);
  }
}

async function main() {
  // 1. Sembrar org 'basic' — el plan más barato, el que según el código NO debería importar
  //    para esta descarga.
  orgId = psql(
    `insert into organizations (id, name, slug, plan, "verticalTrackId", "onboardingCompletedAt",
       "trialEnd", "planEnd", "createdAt", "updatedAt")
     values (gen_random_uuid()::text, 'ZZ QA Export ${TS}', '${SLUG}', 'basic', 'dentagest-clinical',
       now(), now() + interval '1 year', now() + interval '1 year', now(), now())
     returning id`
  );
  console.log("org creada (plan=basic):", orgId, SLUG);

  psql(`insert into clinic_settings (id, "organizationId", timezone, "createdAt", "updatedAt")
        values (gen_random_uuid()::text, '${orgId}', 'America/La_Paz', now(), now())`);

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
     values (gen_random_uuid()::text, '${ownerUserId}', '${orgId}', 'ZZ QA Export Owner', '${EMAIL_DUENO}',
       'ADMIN', now(), now())`
  );
  console.log("dueño sembrado:", ownerUserId, EMAIL_DUENO);

  // 2. Un paciente real, para que el ZIP no salga vacío.
  patientId = psql(
    `insert into patients (id, "organizationId", name, phone, "createdAt", "updatedAt")
     values (gen_random_uuid()::text, '${orgId}', '${NOMBRE_PACIENTE}', '70000000', now(), now())
     returning id`
  );
  console.log("paciente sembrado:", patientId);

  const { navegador, pagina, fallos } = await navegadorConSesion(EMAIL_DUENO, {
    viewport: { width: 1280, height: 900 },
  });

  try {
    await pagina.goto("https://app.onia.com.bo/settings#export", { waitUntil: "load", timeout: 30_000 });
    await pagina.waitForTimeout(1200);

    // La sección "export" vive DENTRO de "06 · Chatbot y datos" (el ancla #export sola no basta:
    // el nav de settings es un menú de secciones, no de anclas independientes) — medido en la
    // captura de este mismo script, primer intento.
    let linkDescarga = pagina.getByRole("link", { name: "Descargar planillas" });
    if (!(await linkDescarga.isVisible().catch(() => false))) {
      const navChatbotDatos = pagina.getByText("Chatbot y datos", { exact: true }).first();
      await navChatbotDatos.waitFor({ state: "visible", timeout: 10_000 });
      await navChatbotDatos.click();
      await pagina.waitForTimeout(800);
    }
    linkDescarga = pagina.getByRole("link", { name: "Descargar planillas" });
    await linkDescarga.waitFor({ state: "visible", timeout: 10_000 });

    await pagina.screenshot({ path: `${CAPTURAS}/extra-exportar-00-seccion.png`, fullPage: true });

    const [download] = await Promise.all([
      pagina.waitForEvent("download", { timeout: 20_000 }),
      linkDescarga.click(),
    ]);

    tmpDir = mkdtempSync(join(tmpdir(), "onia-export-"));
    const rutaZip = join(tmpDir, "export.zip");
    await download.saveAs(rutaZip);

    const tamano = readFileSync(rutaZip).length;
    console.log(`descarga guardada: ${rutaZip} (${tamano} bytes)`);
    if (tamano < 200) {
      console.error(`FALLO: el ZIP descargado pesa ${tamano} bytes — sospechosamente vacío o un error disfrazado de archivo.`);
      await pagina.screenshot({ path: `${CAPTURAS}/extra-exportar-FALLO-zip-chico.png`, fullPage: true });
      await navegador.close();
      limpiar();
      process.exit(1);
    }

    // 3. Abrir el ZIP y confirmar que el paciente sembrado aparece en el CSV correcto.
    const entradas = listarZip(rutaZip);
    console.log("archivos dentro del ZIP:", entradas.join(", "));

    const nombreCsvPacientes = entradas.find((e) => /pacientes|patients/i.test(e));
    if (!nombreCsvPacientes) {
      console.error(`FALLO: no hay ningún CSV de pacientes dentro del ZIP. Entradas: ${entradas.join(", ")}`);
      await navegador.close();
      limpiar();
      process.exit(1);
    }
    const textoPacientes = leerDeZip(rutaZip, nombreCsvPacientes);
    if (!textoPacientes.includes(NOMBRE_PACIENTE)) {
      console.error(`FALLO: el CSV de pacientes (${nombreCsvPacientes}) NO contiene "${NOMBRE_PACIENTE}".`);
      console.error(textoPacientes.slice(0, 500));
      await navegador.close();
      limpiar();
      process.exit(1);
    }
    console.log(`OK: "${NOMBRE_PACIENTE}" aparece en ${nombreCsvPacientes}`);

    if (fallos.length) {
      console.error(`FALLO: subrecursos en error durante el recorrido:\n  ${fallos.join("\n  ")}`);
      await navegador.close();
      limpiar();
      process.exit(1);
    }

    await navegador.close();
    console.log(
      "\nRESULTADO: 'Descargar planillas' desde /settings, con plan 'basic' (el más barato), " +
        "clic real, ZIP descargado y el paciente sembrado apareció en su CSV. La promesa de " +
        "'derecho del titular, no feature del plan' se sostiene también en el camino de UI. Sin hallazgo."
    );
    limpiar();
    process.exit(0);
  } catch (e) {
    console.error("ERROR durante el recorrido:", e.message);
    try {
      await pagina.screenshot({ path: `${CAPTURAS}/extra-exportar-ERROR.png`, fullPage: true });
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
