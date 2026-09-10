#!/usr/bin/env node
/**
 * alta_correo_confirma.mjs — ¿el enlace del correo de confirmación deja ENTRAR?
 *
 * El alta de `app.onia.com.bo` crea la cuenta con la confirmación de correo ENCENDIDA
 * (`ONIA_REGISTRO_CONFIRMA_CORREO=si` en el contenedor, `confirmationPending:true` en la
 * respuesta del `POST /api/auth/register`). O sea: la cuenta nace SIN poder entrar y el
 * único camino de vuelta es el enlace del correo. Si ese enlace no funciona, el alta nueva
 * muere sin ruido: la cuenta existe, el login contesta 403 `email_not_confirmed`, y nadie
 * se entera. Ya pasó — un alta del 31-ago pasó 10 días así.
 *
 * Este instrumento abre el enlace EXACTAMENTE como lo arma el correo:
 *   plantilla https://app.onia.com.bo/correos-auth/confirmacion.html
 *   → `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`
 * y el `token_hash` se lee de `auth.users.confirmation_token`, que es de donde GoTrue lo
 * saca para el mail. No se inventa una URL: se reconstruye la que viaja.
 *
 * Después prueba el login en un navegador LIMPIO — la confirmación deja sesión en el
 * navegador que abrió el enlace, así que probar ahí no prueba nada del login.
 *
 * Uso:
 *   node scripts/alta_correo_confirma.mjs --email <correo> --password <clave>
 *   node scripts/alta_correo_confirma.mjs --self-check
 *
 * Salidas: 0 = el enlace confirma y el login entra · 1 = defecto · 2 = no pude medir.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { cargarPlaywright } from "./lib/playwright-que-arranca.mjs";

const APP = "https://app.onia.com.bo";
const CONTENEDOR_BASE = "supabase-db";

/** Lo que el `/auth/confirm` de la app contesta cuando el enlace NO sirve. */
export const RUTAS_DE_FALLO = ["/login?error=enlace_invalido", "/login?error=enlace_vencido"];

/**
 * El veredicto del enlace, dado dónde aterrizó el navegador.
 * Puro a propósito: es lo único que el `--self-check` puede fijar sin red.
 */
export function veredictoDelEnlace(urlFinal) {
  if (!urlFinal) return { ok: false, motivo: "el navegador no aterrizó en ningún lado" };
  for (const fallo of RUTAS_DE_FALLO) {
    if (urlFinal.includes(fallo.split("?")[1])) {
      return { ok: false, motivo: `el enlace del correo cae en ${fallo}` };
    }
  }
  if (urlFinal.includes("/login")) {
    return { ok: false, motivo: "el enlace del correo devuelve al login" };
  }
  return { ok: true, motivo: `aterrizó en ${urlFinal}` };
}

/** El `token_hash` que viaja en el correo. `null` = no pude leerlo (nunca cadena vacía). */
export function tokenDelCorreo(correo, ejecutar = spawnSync) {
  const sql = `select confirmation_token from auth.users where email = '${correo.replace(/'/g, "''")}';`;
  const r = ejecutar("docker", ["exec", CONTENEDOR_BASE, "psql", "-U", "postgres", "-d", "postgres", "-tAc", sql], {
    encoding: "utf8",
  });
  if (r.status !== 0) return null;
  const valor = String(r.stdout ?? "").trim();
  return valor.length > 0 ? valor : null;
}

async function main() {
  const args = process.argv.slice(2);
  const leer = (n) => {
    const i = args.indexOf(n);
    return i >= 0 ? args[i + 1] : null;
  };
  const correo = leer("--email");
  const clave = leer("--password");
  if (!correo || !clave) {
    console.error("Faltan --email y --password (los de un alta QA recién hecha).");
    process.exit(2);
  }

  const token = tokenDelCorreo(correo);
  if (!token) {
    console.error(`NO MEDIDO: no pude leer confirmation_token de ${correo} en ${CONTENEDOR_BASE}.`);
    process.exit(2);
  }
  const enlace = `${APP}/auth/confirm?token_hash=${token}&type=signup`;
  console.log(`enlace del correo: ${enlace.replace(token, token.slice(0, 12) + "…")}`);

  const { chromium, raiz } = await cargarPlaywright();
  console.log(`playwright: ${raiz}`);
  const navegador = await chromium.launch({ args: ["--no-sandbox"] });
  try {
    // 1) El enlace, en un navegador que NUNCA vio el alta — que es el caso normal:
    //    uno se registra en la compu y abre el mail en el teléfono.
    const ctx = await navegador.newContext();
    const pagina = await ctx.newPage();
    const fallos = [];
    pagina.on("response", (r) => r.status() >= 400 && fallos.push(`${r.status()} ${r.url()}`));
    await pagina.goto(enlace, { waitUntil: "load", timeout: 60000 });
    await pagina.waitForTimeout(2500);
    const urlConfirma = pagina.url();
    await pagina.screenshot({ path: "/tmp/alta-01-confirmacion.png", fullPage: false });
    const enlaceOk = veredictoDelEnlace(urlConfirma);
    console.log(`[1] enlace → ${urlConfirma} · ${enlaceOk.ok ? "OK" : "DEFECTO: " + enlaceOk.motivo}`);
    if (fallos.length) console.log(`    respuestas >=400: ${fallos.slice(0, 5).join(" · ")}`);
    await ctx.close();

    // 2) El login, en un navegador LIMPIO: la confirmación deja sesión en el que abrió
    //    el enlace, así que sin contexto nuevo esto no probaría nada.
    const ctx2 = await navegador.newContext();
    const p2 = await ctx2.newPage();
    await p2.goto(`${APP}/login`, { waitUntil: "load", timeout: 60000 });
    await p2.fill('input[type="email"]', correo);
    await p2.fill('input[type="password"]', clave);
    const antes = await p2.innerText("body");
    await p2.click('button[type="submit"]');
    await p2.waitForTimeout(6000);
    const urlLogin = p2.url();
    const despues = await p2.innerText("body");
    await p2.screenshot({ path: "/tmp/alta-02-login.png", fullPage: false });
    const nuevo = despues
      .split("\n")
      .filter((l) => l.trim() && !antes.includes(l.trim()))
      .slice(0, 4)
      .join(" | ");
    const loginOk = !urlLogin.includes("/login");
    console.log(`[2] login → ${urlLogin} · ${loginOk ? "ENTRA" : "NO ENTRA"}`);
    if (nuevo) console.log(`    texto nuevo tras apretar: ${nuevo}`);
    await ctx2.close();

    writeFileSync(
      "/tmp/alta-correo-confirma.json",
      JSON.stringify({ correo, urlConfirma, urlLogin, enlaceOk, loginOk }, null, 2),
    );
    console.log("capturas: /tmp/alta-01-confirmacion.png · /tmp/alta-02-login.png");
    process.exit(enlaceOk.ok && loginOk ? 0 : 1);
  } finally {
    await navegador.close();
  }
}

function selfCheck() {
  const casos = [
    ["aterrizar en /onboarding es confirmar", veredictoDelEnlace(`${APP}/onboarding`).ok === true],
    ["enlace_vencido es defecto", veredictoDelEnlace(`${APP}/login?error=enlace_vencido`).ok === false],
    ["enlace_invalido es defecto", veredictoDelEnlace(`${APP}/login?error=enlace_invalido`).ok === false],
    ["quedarse en /login es defecto", veredictoDelEnlace(`${APP}/login`).ok === false],
    ["sin URL es defecto", veredictoDelEnlace(null).ok === false],
    [
      "psql que falla devuelve null, nunca cadena vacía",
      tokenDelCorreo("x@y.z", () => ({ status: 1, stdout: "" })) === null,
    ],
    [
      "psql sin filas devuelve null",
      tokenDelCorreo("x@y.z", () => ({ status: 0, stdout: "\n" })) === null,
    ],
    [
      "el token se devuelve tal cual (incluido el prefijo pkce_)",
      tokenDelCorreo("x@y.z", () => ({ status: 0, stdout: "pkce_abc\n" })) === "pkce_abc",
    ],
  ];
  let malos = 0;
  for (const [nombre, ok] of casos) {
    if (!ok) malos++;
    console.log(`${ok ? "ok  " : "FAIL"} ${nombre}`);
  }
  process.exit(malos === 0 ? 0 : 1);
}

// Guarda de importación: sin esto, `import { veredictoDelEnlace }` desde un test dispara
// la medición viva (docker exec + navegador) y mata al proceso que importa con su exit().
const invocadoDirecto =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invocadoDirecto) {
  if (process.argv.includes("--self-check")) selfCheck();
  else await main();
}
