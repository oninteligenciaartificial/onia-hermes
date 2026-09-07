#!/usr/bin/env node
/**
 * alta_qa_rubro.mjs — da de alta en PRODUCCION una organizacion QA de un rubro,
 * recorriendo el alta REAL (`/register`), para poder MIRAR sus modulos despues.
 *
 *   node scripts/alta_qa_rubro.mjs --rubro "Estética y spa" --negocio "ZZ QA Estetica Modulos"
 *   node scripts/alta_qa_rubro.mjs --rubro "Servicios profesionales" --negocio "ZZ QA Estudio Contable"
 *
 * CODIGOS DE SALIDA
 *   0  la org existe y quedo utilizable (recien creada, o ya estaba) → imprime su slug
 *   2  no se pudo medir / el alta rechazo el registro
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * POR QUE EXISTE
 *
 * El item «recorrer cada modulo 🟡 rubro por rubro» (hermes-content/docs/cola/plataforma-v1.md)
 * se quedo trabado en 2 de 5 rubros por una razon que no era de codigo: dental y comercio
 * tienen una org QA en produccion y **estetica y servicios profesionales no tienen ninguna**,
 * asi que no habia nada que mirar. El recorrido de cliente si pasa por esos rubros, pero su
 * script BORRA la org al terminar (limpiarProduccion): mide el camino y no deja sujeto.
 *
 * POR QUE POR LA PANTALLA Y NO POR SQL
 *
 * Insertar la org a mano saltearia justo lo que hay que verificar —que el alta del rubro
 * funciona— y ademas dejaria una org que el producto nunca construyo: sin onboarding, sin
 * agenda por defecto, sin las filas que el alta escribe. Seria un sujeto de mentira, y
 * mirar modulos sobre el no probaria nada del cliente real.
 *
 * ⚠️ TRES TRAMPAS YA PAGADAS, que este script evita a proposito:
 *
 *  1. El campo `sitioWeb` del formulario es un HONEYPOT anti-bots: esta escondido y llenarlo
 *     es declararse robot. Los campos reales NO tienen `name` ni `id`, solo `placeholder`.
 *     Un relleno que busque por `name` llena exactamente la trampa y despues culpa al
 *     producto por rechazar el alta. Se localiza por placeholder y se SALTEA el honeypot.
 *
 *  2. La cuenta nace SIN confirmar (`GOTRUE_MAILER_AUTOCONFIRM=false`) y el primer login
 *     rebota con `email_not_confirmed`. Se confirma abriendo el MISMO enlace que viaja en el
 *     mail (`token=`, NO `token_hash=`: con token_hash el endpoint contesta 400 y se lee como
 *     si el proxy comiera la query). No se toca `email_confirmed_at` a mano: eso seria fingir
 *     el paso que se esta midiendo.
 *
 *  3. Una org recien creada entra en trial y plan `free`. Varios de los modulos 🟡 (/rrhh es
 *     professional+, /agents cuelga de un add-on) quedan CORTADOS por el plan, no por su
 *     codigo — y eso se lee como "el modulo no existe" (ya paso: una feature figuro muerta en
 *     QA por el trial vencido de la org, y el cron devolvia `agents_runtime_disabled` sin una
 *     sola query). Por eso el plan se ajusta EXPLICITAMENTE y se imprime lo que se cambio.
 */
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { cargarPlaywright } from "./lib/playwright-que-arranca.mjs";

const RAICES = [
  "/root/loops/onia-platform-chatbot/node_modules",
  "/root/loops/onia-platform/node_modules",
  "/root/node_modules",
];

function cargar(paquete) {
  for (const raiz of RAICES) {
    try {
      return createRequire(`${raiz}/`)(paquete);
    } catch (e) {
      if (e?.code !== "MODULE_NOT_FOUND") throw e;
    }
  }
  console.error(
    `FALTA la dependencia '${paquete}'. Se buscó en:\n  ${RAICES.join("\n  ")}\n` +
      `Sin eso esto NO puede medir nada — no sale verde por defecto.`
  );
  process.exit(2);
}

function arg(nombre, porDefecto) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : porDefecto;
}

const APP = "https://app.onia.com.bo";
const TIMEOUT = 45_000;

const RUBRO = arg("rubro", "Estética y spa");
const NEGOCIO = arg("negocio", "ZZ QA Estetica Modulos");
const PLAN = arg("plan", "professional");
const TRIAL_DIAS = Number(arg("trial-dias", "30"));

// El correo se DERIVA del negocio para que la corrida sea repetible: correrlo dos veces con el
// mismo negocio encuentra la cuenta y no crea una segunda. El prefijo zz-qa- no es cosmetico —
// es lo que habilita leer el token de confirmacion, y marca la fila como dato de prueba.
const SLUG_BASE = NEGOCIO.toLowerCase()
  .normalize("NFD")
  .replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
const EMAIL = arg("email", `${SLUG_BASE}@onia.com.bo`);
const PASSWORD = `Zz-Qa-2026-Passw0rd!`;
const NOMBRE = "QA Modulos";

if (!EMAIL.startsWith("zz-qa-")) {
  console.error(
    `El correo debe empezar con 'zz-qa-' (llegó '${EMAIL}').\n` +
      `Sin ese prefijo no se puede leer el token de confirmación y la cuenta queda sin poder entrar.`
  );
  process.exit(2);
}

function psql(sql) {
  return execFileSync(
    "docker",
    ["exec", "-i", "supabase-db", "psql", "-U", "postgres", "-d", "postgres", "-tAc", sql],
    { encoding: "utf8", timeout: 20_000 }
  ).trim();
}

/** La org de este correo, si ya existe. Devuelve el slug o "". */
function orgDelCorreo() {
  try {
    // La tabla del usuario de la app es `public.profiles`, NO `public."User"`: con el nombre
    // equivocado psql tira 'relation does not exist', el catch lo traga y devuelve "" — o sea
    // el script concluye "el alta NO creó la organización" sobre un alta que funcionó perfecto
    // y, peor, la idempotencia falla abierto y crearía una org nueva en cada corrida.
    return psql(
      `SELECT o.slug FROM public.organizations o
         JOIN public.profiles p ON p."organizationId" = o.id
        WHERE p.email = '${EMAIL}' LIMIT 1`
    );
  } catch {
    return "";
  }
}

async function main() {
  const { chromium } = await cargarPlaywright();

  // Idempotencia: si la org ya existe no se vuelve a dar de alta. Correr esto dos veces no
  // puede dejar dos organizaciones del mismo negocio en produccion.
  const yaExiste = orgDelCorreo();
  if (yaExiste) {
    console.log(`YA EXISTÍA: la org de ${EMAIL} es '${yaExiste}' — no se creó nada.`);
    ajustarPlan(yaExiste);
    // ⚠️ Este camino salía con 0 SIN confirmar el correo: la segunda corrida daba "utilizable"
    // sobre una cuenta que no puede entrar, que es justo el verde falso que el script existe
    // para no dar. La confirmación va en los DOS caminos, no sólo en el del alta nueva.
    const navegador = await chromium.launch({ args: ["--no-sandbox"] });
    try {
      const pagina = await navegador.newPage();
      if (!(await confirmarCorreo(pagina))) {
        console.error("La cuenta sigue SIN confirmar: no va a poder entrar.");
        process.exit(2);
      }
    } finally {
      await navegador.close().catch(() => {});
    }
    console.log(`SLUG=${yaExiste}`);
    process.exit(0);
  }

  const navegador = await chromium.launch({ args: ["--no-sandbox"] });
  const pagina = await navegador.newPage({ viewport: { width: 1440, height: 900 } });

  // Un chunk caído pinta el error boundary de Next con la cara EXACTA de un bug del producto.
  // Se anota para poder descartarlo después en vez de salir a arreglar código sano.
  const fallos = [];
  pagina.on("response", (r) => {
    if (r.status() >= 400) fallos.push(`${r.status()} ${r.url()}`);
  });

  try {
    await pagina.goto(`${APP}/register`, { waitUntil: "domcontentloaded", timeout: TIMEOUT });
    await pagina.waitForTimeout(2500);

    const leerCampos = () =>
      pagina.evaluate(() =>
        [...document.querySelectorAll("input, select, textarea")]
          .filter((el) => el.type !== "hidden")
          .map((el) => ({
            tag: el.tagName.toLowerCase(),
            tipo: el.type || "",
            name: el.name || "",
            id: el.id || "",
            placeholder: el.placeholder || "",
          }))
      );

    // Paso 1: elegir el rubro. Se elige contra la lista REAL que ofrece la pantalla; pedir un
    // rubro que no está tiene que salir ROJO nombrando los que sí hay, nunca seguir de largo.
    if ((await leerCampos()).length === 0) {
      const ofrecidos = await pagina.evaluate(() =>
        [...document.querySelectorAll("button")]
          .map((el) => (el.innerText || "").trim().replace(/\s+/g, " "))
          .filter((t) => t.length > 2)
      );
      const tarjeta = pagina.locator("button", { hasText: RUBRO }).first();
      if (!(await tarjeta.count().catch(() => 0))) {
        console.error(`El alta NO ofrece el rubro "${RUBRO}". Ofrece: ${ofrecidos.join(" · ")}`);
        process.exit(2);
      }
      await tarjeta.click({ timeout: 10_000 });
      await pagina.waitForTimeout(2500);
      if ((await leerCampos()).length === 0) {
        console.error(`Se eligió "${RUBRO}" y el alta NO avanzó al formulario: sigue sin un campo.`);
        process.exit(2);
      }
    }

    // Paso 2: los campos se DESCUBREN, no se hardcodean — el día que el alta cambie de forma
    // esto tiene que notarlo, no romperse contra un selector viejo.
    const campos = await leerCampos();
    const HONEYPOT = /sitioweb|website|url|honey/i;
    for (let i = 0; i < campos.length; i++) {
      const c = campos[i];
      if (HONEYPOT.test(`${c.name} ${c.id}`)) continue;
      const pista = `${c.name} ${c.id} ${c.placeholder}`.toLowerCase();
      let valor = NOMBRE;
      if (c.tipo === "password") valor = PASSWORD;
      else if (c.tipo === "email" || /mail|@/.test(pista)) valor = EMAIL;
      else if (/whats|phone|tel|celular/.test(pista)) valor = "71000000";
      else if (/negocio|empresa|business|cl[ií]nica|tienda|comercio|spa|est[ée]tica/.test(pista))
        valor = NEGOCIO;
      else if (/city|ciudad/.test(pista)) valor = "La Paz";

      const campo = c.id
        ? pagina.locator(`#${CSS.escape(c.id)}`)
        : c.placeholder
          ? pagina.getByPlaceholder(c.placeholder, { exact: true }).first()
          : pagina.locator("input, select, textarea").nth(i);
      if (c.tag === "select") await campo.selectOption({ index: 1 }).catch(() => {});
      else await campo.fill(valor).catch(() => {});
    }

    await pagina.click("button[type=submit], form button:not([type=button])");
    await pagina.waitForTimeout(6000);

    // El veredicto se le pregunta a la BASE, no a la URL: esta pantalla no mueve la URL ni
    // cuando sale bien ni cuando sale mal, así que mirarla no puede distinguir los dos casos.
    const slug = orgDelCorreo();
    if (!slug) {
      const texto = (await pagina.innerText("body").catch(() => "")).replace(/\s+/g, " ").slice(0, 300);
      console.error(`El alta NO creó la organización. La pantalla dice: "${texto}"`);
      if (fallos.length) console.error(`respuestas >=400: ${fallos.join(" | ")}`);
      process.exit(2);
    }

    // Paso 3: confirmar el correo con el mismo enlace que viaja en el mail.
    const confirmado = await confirmarCorreo(pagina);
    console.log(`ORG CREADA: ${slug} — correo ${confirmado ? "confirmado" : "SIN confirmar"}`);
    if (!confirmado) {
      console.error("La cuenta quedó sin confirmar: no va a poder entrar.");
      process.exit(2);
    }
    ajustarPlan(slug);
    if (fallos.length) console.log(`respuestas >=400 durante el alta: ${fallos.join(" | ")}`);
    console.log(`SLUG=${slug}`);
  } finally {
    await navegador.close().catch(() => {});
  }
}

/**
 * Confirma el correo abriendo el MISMO enlace que viaja en el mail. Devuelve si quedó confirmado.
 *
 * Va `token=`, NO `token_hash=`: con `token_hash` el endpoint contesta 400 "Verify requires a
 * token or a token hash", que se lee como si el proxy comiera la query — y no es eso.
 * No se toca `email_confirmed_at` a mano: eso fingiría el paso que se está midiendo.
 */
async function confirmarCorreo(pagina) {
  const yaEsta =
    psql(`SELECT email_confirmed_at IS NOT NULL FROM auth.users WHERE email = '${EMAIL}'`) === "t";
  if (yaEsta) return true;

  const token = psql(
    `SELECT confirmation_token FROM auth.users WHERE email = '${EMAIL}' AND email LIKE 'zz-qa-%'`
  );
  if (!token) return false;

  const enlace = `${APP}/supabase/auth/v1/verify?token=${encodeURIComponent(token)}&type=signup&redirect_to=${encodeURIComponent(APP + "/")}`;
  await pagina.goto(enlace, { waitUntil: "domcontentloaded", timeout: TIMEOUT }).catch(() => {});
  await pagina.waitForTimeout(4000);
  return (
    psql(`SELECT email_confirmed_at IS NOT NULL FROM auth.users WHERE email = '${EMAIL}'`) === "t"
  );
}

/**
 * Deja el plan y el trial en condiciones de poder MIRAR los módulos.
 *
 * No es maquillaje: sin esto, /rrhh (professional+) y /agents (add-on) se ven cortados por el
 * plan y se leen como módulos rotos. Se imprime lo que se cambió para que quede a la vista que
 * la org está en un estado elegido, no en el que trae el alta.
 */
function ajustarPlan(slug) {
  const sql = `UPDATE public.organizations
     SET plan = '${PLAN}',
         "trialEnd" = now() + interval '${TRIAL_DIAS} days'
   WHERE slug = '${slug}' AND slug LIKE 'zz-qa-%'
   RETURNING slug, plan, "trialEnd"::date`;
  try {
    const salida = psql(sql);
    if (salida) console.log(`PLAN AJUSTADO: ${salida} (para poder mirar los módulos con plan)`);
  } catch (e) {
    console.error(`No se pudo ajustar el plan: ${e.message}`);
  }
}

main().catch((e) => {
  console.error(`FALLÓ: ${e.message}`);
  process.exit(2);
});
