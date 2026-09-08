#!/usr/bin/env node
/**
 * onboarding_por_la_ui.mjs — recorre el alta de negocio (`/onboarding`) de PRODUCCION con la
 * sesion del dueño, paso por paso, y saca una captura de cada uno.
 *
 *   node scripts/onboarding_por_la_ui.mjs --email zz-qa-estetica-modulos@onia.com.bo
 *   node scripts/onboarding_por_la_ui.mjs --email X --salida /root/capturas-onboarding
 *
 * CODIGOS DE SALIDA
 *   0  el onboarding se completo y la BASE lo confirma  → las capturas HAY QUE MIRARLAS igual
 *   1  el recorrido se corto en algun paso (dice cual y por que)
 *   2  no se pudo medir (falta una dependencia, la sesion no entro, la org ya estaba completa)
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * POR QUE EXISTE
 *
 * Una org recien creada por el alta real tiene `onboardingCompletedAt` en null, y el redirect a
 * `/onboarding` es GLOBAL: ninguna ruta de modulo se puede mirar hasta pasarlo. Sin esto, el
 * recorrido de los modulos 🟡 de estetica y servicios profesionales queda bloqueado para
 * siempre — que es justo donde estaba parado el item de `plataforma-v1.md` el 2026-09-06.
 *
 * ⚠️ NO se marca la columna a mano. Fingir el paso deja la org sin la agenda por defecto ni el
 * resto de lo que el onboarding escribe, y mirar modulos sobre un sujeto que el producto nunca
 * construyo no prueba nada del cliente real. Ademas, este camino MIDE el alta: es la unica
 * forma de saber si el primer cuarto de hora de un cliente nuevo funciona.
 *
 * ⚠️ Se entra por «Completar el formulario», no por «Buscar mi negocio»: ese segundo boton
 * dispara la extraccion con IA, que es gasto y necesita permiso. El camino a mano es ademas el
 * del cliente que no tiene web, que en Bolivia es la mayoria.
 *
 * ⚠️ El veredicto se le pregunta a la BASE, no a la pantalla: que se vea el paso "listo" es lo
 * que el navegador dibujo, y el `POST /api/onboarding/aplicar` puede fallar despues. Y se exige
 * que NINGUN paso haya quedado fuera de OK — un gate multipaso que mira solo el ultimo verde
 * borra el agujero del medio (medido el 2026-09-03 en recorrido_cliente.mjs).
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { navegadorConSesion, psql } from "./lib/sesion_dueno.mjs";

function arg(nombre, porDefecto) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : porDefecto;
}

const EMAIL = arg("email", "");
const SALIDA = arg("salida", "/root/capturas-onboarding");

if (!EMAIL) {
  console.error("Falta --email <cuenta dueña de la org>. Sin eso no hay a quién mirar.");
  process.exit(2);
}

/**
 * Filas de agenda del dueño. Es LO QUE HACE USABLE la cuenta en un rubro que agenda: sin una
 * sola fila, `/api/doctor-schedules` devuelve `[]`, el modal de Agendar Cita queda con
 * "Profesional" vacío y el botón apagado —sin decir por qué— y `/book/<slug>` contesta "No hay
 * horarios disponibles". El negocio no puede crear NI UNA cita, que es el primer valor que ve.
 */
function filasDeAgenda(email) {
  return Number(
    psql(
      `select count(*) from public.doctor_schedules d ` +
        `join public.profiles p on p."organizationId" = d."organizationId" and p.id = d."doctorId" ` +
        `where p.email = '${email.replace(/'/g, "''")}'`
    ) || "0"
  );
}

/** Estado del onboarding de la org de esa cuenta, leido de la base. */
function estadoOnboarding(email) {
  const fila = psql(
    `select o.slug, o."verticalTrackId", coalesce(o."onboardingCompletedAt"::text,'') ` +
      `from public.organizations o join public.profiles p on p."organizationId" = o.id ` +
      `where p.email = '${email.replace(/'/g, "''")}' limit 1`
  );
  if (!fila) return null;
  const [slug, track, completado] = fila.split("|");
  return { slug, track, completado };
}

const antes = estadoOnboarding(EMAIL);
if (!antes) {
  console.error(`'${EMAIL}' no tiene organización en producción. No hay onboarding que recorrer.`);
  process.exit(2);
}
console.log(`org: ${antes.slug} · track: ${antes.track} · onboardingCompletedAt: ${antes.completado || "null"}`);

// `--solo-agenda`: mide la cuenta YA dada de alta, sin recorrer nada. Existe porque el alta se
// hace UNA vez y el defecto se ve DESPUES — sin esto, comprobar si un deploy arregló la agenda
// obligaría a crear una org nueva cada vez.
if (process.argv.includes("--solo-agenda")) {
  const filas = filasDeAgenda(EMAIL);
  console.log(`filas de doctor_schedules del dueño: ${filas}`);
  if (!antes.completado) {
    console.error("Esa org todavía no completó el onboarding: la agenda aún no tiene por qué existir.");
    process.exit(2);
  }
  if (filas === 0) {
    console.error(
      "\nAGENDA MUERTA: el alta terminó y no dejó una sola fila de agenda.\n" +
        "En un rubro que agenda, esa cuenta no puede crear NI UNA cita y la pantalla no dice por qué."
    );
    process.exit(1);
  }
  console.log("agenda usable: el dueño tiene días cargados.");
  process.exit(0);
}

if (antes.completado) {
  console.error(
    `Esa org YA completó el onboarding (${antes.completado}). Este script no lo re-hace: volver a\n` +
      `correrlo pisaría datos reales de la cuenta. Si querés mirar sus módulos, usá mirar_bandeja_dueno.mjs.`
  );
  process.exit(2);
}

mkdirSync(SALIDA, { recursive: true });

const { navegador, pagina, host, fallos } = await navegadorConSesion(EMAIL);

/** Cada paso deja su marca acá. `ok:false` en cualquiera es un recorrido roto, aunque el último ande. */
const pasos = [];
let n = 0;

async function foto(nombre) {
  n += 1;
  const ruta = join(SALIDA, `${String(n).padStart(2, "0")}-${nombre}.png`);
  await pagina.screenshot({ path: ruta });
  return ruta;
}

async function marcar(nombre, ok, detalle) {
  const captura = await foto(nombre);
  pasos.push({ nombre, ok, detalle, captura });
  console.log(`  ${ok ? "OK  " : "ROTO"} ${nombre}${detalle ? ` — ${detalle}` : ""}\n       ${captura}`);
  return ok;
}

/**
 * Aprieta un boton por su NOMBRE ACCESIBLE y espera. Si no aparece, o aparece deshabilitado,
 * el paso se marca roto en vez de seguir: un recorrido que sigue de largo con un boton muerto
 * saca capturas de pantallas que el cliente nunca podria haber alcanzado.
 */
async function apretar(texto, { espera = 2000 } = {}) {
  const boton = pagina.getByRole("button", { name: texto }).first();
  try {
    await boton.waitFor({ state: "visible", timeout: 20000 });
  } catch {
    return { ok: false, motivo: `el botón ${JSON.stringify(texto)} no está en la pantalla` };
  }
  if (await boton.isDisabled()) {
    return { ok: false, motivo: `el botón ${JSON.stringify(texto)} está DESHABILITADO — el paso no deja avanzar` };
  }
  await boton.click();
  await pagina.waitForTimeout(espera);
  return { ok: true };
}

/** Llena un campo por su etiqueta/placeholder sólo si está vacío. */
async function llenarSiVacio(locator, valor) {
  try {
    await locator.waitFor({ state: "visible", timeout: 5000 });
  } catch {
    return false;
  }
  const actual = await locator.inputValue();
  if (actual.trim()) return false;
  await locator.fill(valor);
  return true;
}

await pagina.goto(`https://${host}/onboarding`, { waitUntil: "networkidle", timeout: 90000 });
await pagina.waitForTimeout(2500);
await pagina.addStyleTag({ content: "*{scroll-behavior:auto !important}" });

if (new URL(pagina.url()).pathname !== "/onboarding") {
  console.error(`La sesión NO entró al onboarding: terminó en ${pagina.url()}`);
  await foto("no-entro");
  await navegador.close();
  process.exit(2);
}

console.log("\nRECORRIDO:");

// ── Paso 1: la pregunta inicial ────────────────────────────────────────────────────────────
await marcar("pregunta", true, "el alta arranca pidiendo el nombre");
let r = await apretar("Completar el formulario");
if (!r.ok) {
  await marcar("pregunta-salida", false, r.motivo);
} else {
  // ── Paso 2: los datos del negocio ────────────────────────────────────────────────────────
  await marcar("negocio", true, "formulario de datos del negocio");
  r = await apretar("Continuar");
  if (!r.ok) await marcar("negocio-salida", false, r.motivo);
}

// ── Paso 3: horarios ───────────────────────────────────────────────────────────────────────
// Por defecto se APRIETA «Continuar»: es el camino que deja la cuenta usable.
//
// `--saltar-horarios` recorre el OTRO camino, que es el que denunciaba la tarea t_72ddeedb: el
// cliente aprieta «Saltar por ahora» y hasta el 2026-09-05 se iba con CERO filas de agenda, sin
// poder crear ni una cita y sin que la pantalla dijera por qué. Ese camino no se podía medir en
// producción —este script no lo recorría— así que el arreglo (`diasAgendaParaAlta`) sólo tenía
// prueba en tests. Es además el camino más probable del cliente apurado: el botón está a la
// vista en todos los pasos y cargar siete días es lo más pesado del alta.
const SALTAR_HORARIOS = process.argv.includes("--saltar-horarios");
if (pasos.every((p) => p.ok)) {
  await marcar("horarios", true, SALTAR_HORARIOS ? "horarios SIN cargar (se va a saltear)" : "horarios de atención por defecto");
  r = await apretar(SALTAR_HORARIOS ? "Saltar por ahora — lo cargo después" : "Continuar");
  if (!r.ok) await marcar("horarios-salida", false, r.motivo);
}

// ── Paso 4: servicios ──────────────────────────────────────────────────────────────────────
if (pasos.every((p) => p.ok)) {
  await marcar("servicios", true, "catálogo de servicios");
  r = await apretar("Continuar");
  if (!r.ok) await marcar("servicios-salida", false, r.motivo);
}

// ── Paso 5: equipo ─────────────────────────────────────────────────────────────────────────
if (pasos.every((p) => p.ok)) {
  const nombre = pagina.locator('input[type="text"]').first();
  const escribio = await llenarSiVacio(nombre, "Ana Quiroga");
  await marcar("equipo", true, escribio ? "cargado un miembro del equipo" : "el equipo ya venía cargado");
  r = await apretar("Terminar", { espera: 6000 });
  if (!r.ok) await marcar("equipo-salida", false, r.motivo);
}

// ── Paso 6: el cierre ──────────────────────────────────────────────────────────────────────
if (pasos.every((p) => p.ok)) {
  await marcar("listo", true, "pantalla de cierre del alta");
}

console.log("\nrespuestas >=400:", fallos.length ? `\n  ${fallos.slice(0, 8).join("\n  ")}` : "ninguna");
await navegador.close();

// ── Veredicto: se lo pregunta a la BASE, no a la pantalla ──────────────────────────────────
const despues = estadoOnboarding(EMAIL);
console.log(`\nonboardingCompletedAt: ${antes.completado || "null"} → ${despues?.completado || "null"}`);

const rotos = pasos.filter((p) => !p.ok);
if (rotos.length) {
  console.error(
    `\nRECORRIDO CORTADO en ${rotos.length} paso(s): ${rotos.map((p) => p.nombre).join(", ")}\n` +
      rotos.map((p) => `  · ${p.nombre}: ${p.detalle}`).join("\n")
  );
  process.exit(1);
}
if (!despues?.completado) {
  console.error(
    "\nLa pantalla llegó al final pero la BASE sigue con onboardingCompletedAt en null:\n" +
      "el POST /api/onboarding/aplicar no dejó el registro. La cuenta va a volver a /onboarding."
  );
  process.exit(1);
}

// El sujeto sale de lo OBSERVADO, no de una lista de rubros: si el alta MOSTRO el paso de
// horarios, este negocio agenda — y entonces tiene que salir del alta pudiendo agendar. Una
// lista de tracks escrita a mano deja al rubro nuevo sin gate el día que alguien lo agrega.
if (pasos.some((p) => p.nombre === "horarios")) {
  const filas = filasDeAgenda(EMAIL);
  console.log(`filas de doctor_schedules del dueño: ${filas}`);
  if (filas === 0) {
    console.error(
      "\nAGENDA MUERTA: el alta preguntó los horarios y terminó sin dejar una sola fila de agenda.\n" +
        "Esa cuenta NO puede crear ni una cita: el modal de Agendar Cita queda con «Profesional»\n" +
        "vacío y el botón apagado, sin decir por qué. El alta se completó igual y lo celebró."
    );
    process.exit(1);
  }
}

console.log(`\nONBOARDING COMPLETO — ${pasos.length} pasos, todos OK. Capturas en ${SALIDA}`);
console.log("Un exit 0 acá dice que el camino no se cortó. Las capturas HAY QUE MIRARLAS.");
