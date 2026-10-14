#!/usr/bin/env node
// ONIA - Monitor que MIRA lo que ve el cliente.
//
// POR QUE EXISTE: los 5 monitores previos vigilan contenedores, chatbot, n8n,
// demos y backup. Ninguno ABRE una pantalla de cliente. El fallo del login
// mostrando "credit_card_off" y "verified_user" como TEXTO (fuente de iconos de
// 3,9 MB, 117 s) devolvia HTTP 200 y fue invisible para los cinco. Lo encontro
// Sergio. Con un cliente real adentro ese fallo hoy es caro.
//
// METODO: renderiza con Chromium headless (playwright-core + chrome-headless-shell
// ya instalados en el VPS) y mide GEOMETRIA del glifo, no el HTML. Un icono
// correcto de Material Symbols ocupa ~1 em de ancho; la palabra "credit_card_off"
// a 24px ocupa ~180px. La razon ancho/font-size delata el fallo sin importar la
// causa (fuente 404, fuente lenta, ligaduras apagadas, CSP, clase que no prende).
//
// LO QUE NO CUBRE (honesto): solo paginas publicas sin sesion; un solo navegador
// (Chromium) y un solo viewport; no detecta icono equivocado-pero-angosto, color
// roto, solapamientos ni regresiones visuales que no sean de ancho de glifo; no
// mira pantallas de adentro del dashboard.
//
// Uso:
//   node mirar-cliente.mjs               -> chequea y avisa por Telegram si cambia el estado
//   node mirar-cliente.mjs --inspeccionar -> imprime lo medido y NO avisa (para calibrar)
//   node mirar-cliente.mjs --forzar-aviso -> manda el resumen a Telegram si o si (prueba del canal)
//   MIRAR_SUPERFICIES='[...]' node mirar-cliente.mjs -> superficies de prueba (inyectar fallo)

import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { planAviso, tituloAviso } from "./onia-mirar-aviso-estado.mjs";

const CHROME =
  process.env.MIRAR_CHROME ??
  "/root/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell";
const ESTADO = process.env.MIRAR_ESTADO ?? "/root/.onia-mirar-estado.json";

// Umbrales. Elegidos con margen contra lo medido en sano el 2026-08-22:
// login 0,38 s / register 0,50 s / web 0,4 s; fuente de iconos 243 KB en 0,28 s.
// Un icono bien renderizado da razon ~1,0; la palabra da 7-10. 2,5 no roza ninguno.
const U = {
  razonGlifo: 2.5, // ancho del glifo / font-size
  cargaMs: 15000, // navegacion completa
  fuenteBytes: 1_500_000, // la rota pesaba 3,9 MB
  fuenteMs: 10000, // la rota tardaba 117 s
};

const SUPERFICIES = process.env.MIRAR_SUPERFICIES
  ? JSON.parse(process.env.MIRAR_SUPERFICIES)
  : [
      // textoEsperado: copia que un deploy roto o revertido se lleva puesta.
      // minIconos: medido en vivo el 2026-08-22 (login 5, register 3, web 0);
      // el piso en 1 delata que la banda de iconos desaparecio entera.
      //
      // ⚠️ EL ANCLA NO PUEDE DEPENDER DE UNA DECISION DE NEGOCIO — corregido 2026-09-03.
      // Este monitor estuvo CINCO DIAS clavado en rojo (estado roto:true desde el
      // 2026-08-29T21:30Z) por dos anclas viejas, no por una falla real:
      //   - register esperaba "Pedí tu acceso", texto que se quito A PROPOSITO cuando el
      //     alta se reabrio el 29-ago (ONIA_ALTA_AUTOMATICA=abierta). La pantalla estaba
      //     y esta sana: asistente de 2 pasos que crea la cuenta.
      //   - web esperaba "Tu negocio no pierde", titular de una version anterior de la
      //     landing. El de hoy es "Cerrás vos. / El negocio no.".
      // El dano no es el ruido: el estado es UN booleano. Con el monitor ya en rojo, una
      // rotura NUEVA y real no cambia el estado y por lo tanto NO avisa. Una alarma
      // clavada en rojo dejo de ser una alarma.
      // Por eso las anclas de ahora son INDEPENDIENTES del estado del alta y del titular
      // de campana: texto del layout de auth (que no cambia al abrir/cerrar el alta) y
      // secciones estructurales de la home. Las tres verificadas en vivo el 2026-09-03
      // con document.body.innerText ANTES de escribirlas aca.
      // OJO al elegir una nueva: "Cerrás vos. El negocio no." NO matchea, porque el h1 va
      // partido en dos lineas y innerText mete un \n en el medio. Probar el ancla contra
      // la pagina antes de commitearla, o el monitor queda rojo por un motivo nuevo.
      {
        nombre: "app/login",
        url: "https://app.onia.com.bo/login",
        textoEsperado: ["Tu negocio completo", "Hola de nuevo"],
        minIconos: 1,
      },
      {
        nombre: "app/register",
        url: "https://app.onia.com.bo/register",
        textoEsperado: ["Tu negocio completo"],
        minIconos: 1,
      },
      {
        nombre: "web",
        url: "https://onia.com.bo/",
        textoEsperado: ["Cerrás vos.", "Trabajan de noche"],
        minIconos: 0,
      },
    ];

/** Mide en el navegador: glifos, textos y pesos reales. Corre DENTRO de la pagina. */
function medirEnPagina(textoEsperado) {
  const nodos = [...document.querySelectorAll(".material-symbols-outlined")];
  const iconos = [];

  for (const el of nodos) {
    const texto = el.firstChild?.nodeValue?.trim();
    if (!texto) continue; // icono sin ligadura: no hay nada que medir
    const fontSize = parseFloat(getComputedStyle(el).fontSize);
    if (!fontSize) continue;

    // Range sobre el nodo de texto y no el rect del elemento: los iconos viven
    // dentro de cajas de ancho fijo (`w-9`), asi que el rect del elemento mide
    // la caja y NO el glifo — con la palabra desbordando seguiria dando 36px.
    const r = document.createRange();
    r.selectNodeContents(el.firstChild);
    const ancho = r.getBoundingClientRect().width;
    r.detach?.();
    if (ancho === 0) continue; // display:none

    iconos.push({ texto, razon: +(ancho / fontSize).toFixed(2), fontSize, ancho });
  }

  const cuerpo = document.body.innerText;
  const fuente = performance
    .getEntriesByType("resource")
    .find((e) => /material-symbols/i.test(e.name));

  return {
    iconos,
    faltantes: textoEsperado.filter((t) => !cuerpo.includes(t)),
    fuente: fuente
      ? { bytes: fuente.transferSize || fuente.encodedBodySize, ms: Math.round(fuente.duration) }
      : null,
  };
}

async function revisar(browser, s) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const fallos = [];
  const datos = { nombre: s.nombre, url: s.url };

  try {
    const t0 = Date.now();
    const res = await page.goto(s.url, { waitUntil: "load", timeout: 30000 });
    datos.ms = Date.now() - t0;
    datos.status = res?.status() ?? 0;

    if (datos.status !== 200) fallos.push(`HTTP ${datos.status}`);
    if (datos.ms > U.cargaMs) fallos.push(`carga ${(datos.ms / 1000).toFixed(1)} s (max ${U.cargaMs / 1000} s)`);

    // Sin esto medirias la fuente de respaldo mientras la real todavia baja.
    await page.evaluate(() => document.fonts.ready).catch(() => {});

    const m = await page.evaluate(medirEnPagina, s.textoEsperado);
    Object.assign(datos, m);

    if (m.faltantes.length) fallos.push(`falta el texto: ${m.faltantes.join(", ")}`);
    if (m.iconos.length < (s.minIconos ?? 0))
      fallos.push(`solo ${m.iconos.length} iconos (esperaba >= ${s.minIconos})`);

    const rotos = m.iconos.filter((i) => i.razon > U.razonGlifo);
    if (rotos.length) {
      const muestra = rotos.slice(0, 3).map((i) => `"${i.texto}" (x${i.razon})`).join(", ");
      fallos.push(`${rotos.length} iconos salen como PALABRA: ${muestra}`);
    }

    if (m.fuente) {
      if (m.fuente.bytes > U.fuenteBytes)
        fallos.push(`fuente de iconos ${(m.fuente.bytes / 1048576).toFixed(2)} MB (max ${U.fuenteBytes / 1048576} MB)`);
      if (m.fuente.ms > U.fuenteMs)
        fallos.push(`fuente de iconos tardo ${(m.fuente.ms / 1000).toFixed(1)} s`);
    } else if (m.iconos.length > 0) {
      fallos.push("la pagina usa iconos pero la fuente nunca se pidio");
    }
  } catch (e) {
    fallos.push(`no abrio: ${e.message.split("\n")[0]}`);
  } finally {
    await page.close().catch(() => {});
  }

  return { ...datos, fallos };
}

async function telegram(html) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_HOME_CHANNEL?.trim();
  if (!token || !chatId) {
    console.error("[mirar] sin TELEGRAM_BOT_TOKEN/TELEGRAM_HOME_CHANNEL: no se avisa");
    return false;
  }
  // parse_mode HTML y NO Markdown: un guion bajo suelto (y estos mensajes citan
  // ligaduras como credit_card_off) abre cursiva, Telegram responde 400 y el
  // mensaje no llega nunca.
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: "HTML", disable_web_page_preview: true }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) console.error("[mirar] Telegram respondio", res.status, await res.text());
  return res.ok;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function main() {
  const inspeccionar = process.argv.includes("--inspeccionar");
  const forzar = process.argv.includes("--forzar-aviso");

  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  let resultados = [];
  try {
    for (const s of SUPERFICIES) resultados.push(await revisar(browser, s));

    // Reintento unico de las que fallaron: un pico de red no es una alarma.
    const reintentar = resultados.filter((r) => r.fallos.length);
    if (reintentar.length && !inspeccionar) {
      await new Promise((r) => setTimeout(r, 5000));
      for (const r of reintentar) {
        const s = SUPERFICIES.find((x) => x.nombre === r.nombre);
        const segundo = await revisar(browser, s);
        if (!segundo.fallos.length) Object.assign(r, segundo); // fue transitorio
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }

  const rotas = resultados.filter((r) => r.fallos.length);
  const resumen = resultados
    .map((r) => {
      const cab = `${r.fallos.length ? "🔴" : "🟢"} <b>${esc(r.nombre)}</b> — HTTP ${r.status ?? "?"}, ${r.ms ?? "?"} ms, ${r.iconos?.length ?? 0} iconos${r.fuente ? `, fuente ${(r.fuente.bytes / 1024).toFixed(0)} KB en ${r.fuente.ms} ms` : ""}`;
      return [cab, ...r.fallos.map((f) => `   • ${esc(f)}`)].join("\n");
    })
    .join("\n");

  console.log(JSON.stringify({ ok: rotas.length === 0, resultados }, null, 2));

  if (inspeccionar) return;

  // Anti-ruido: avisar al CAMBIAR de estado, recordar cada 6 h si sigue roto, y
  // avisar la recuperacion. Un monitor que grita cada 15 min se ignora.
  let estadoPrevio = null;
  if (existsSync(ESTADO)) {
    try {
      estadoPrevio = JSON.parse(readFileSync(ESTADO, "utf8"));
    } catch {
      console.error("[mirar] estado previo ilegible; historial desconocido");
    }
  }
  const ahora = Date.now();
  const aviso = planAviso(estadoPrevio, rotas.length > 0, ahora, forzar);
  const { previo, debeAvisar } = aviso;
  if (aviso.desconocido) console.error("[mirar] historial desconocido; no se infiere recuperacion");
  let enviado = false;

  if (debeAvisar) {
    const titulo = tituloAviso(aviso, rotas.length, resultados.length);
    const mensaje = `${titulo}\n\n${resumen}`;
    try {
      enviado = await telegram(mensaje);
    } catch {
      console.error("[mirar] fallo de transporte Telegram; aviso pendiente, sin confirmar entrega");
    }
    console.error(`[mirar] aviso a Telegram: ${enviado ? "ENVIADO" : "FALLO"}\n${mensaje}`);
  } else {
    console.error(`[mirar] sin aviso (roto=${rotas.length > 0}, previo=${previo.roto})`);
  }

  writeFileSync(
    ESTADO,
    JSON.stringify(aviso.despues(enviado)),
  );

  process.exit(rotas.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
