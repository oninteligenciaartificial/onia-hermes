#!/usr/bin/env node
/**
 * ¿Los campos de un formulario del producto son ALCANZABLES POR SU ETIQUETA?
 *
 * Nace del 2026-09-27. El carril `recorrido-cliente` reportó que
 * `/patients/new` del rubro servicios profesionales "no tiene NINGÚN campo de
 * texto donde escribir el dato". Medido acá: los campos EXISTEN y se ven
 * (captura de producción con la org dental). Lo que no existe es la ASOCIACIÓN
 * entre cada `<label>` y su control: 11 etiquetas, 11 controles, cero `htmlFor`,
 * cero `id`, cero `name`, cero `aria-label`.
 *
 * Por eso el hallazgo se lee como "pantalla vacía": un instrumento que busca
 * campos por su etiqueta (`getByLabel`, que es como los busca cualquiera que
 * automatice el producto) devuelve CERO sobre un formulario que está entero.
 *
 * Y no es sólo el instrumento: un campo sin etiqueta asociada tampoco lo anuncia
 * un lector de pantalla, no se enfoca al hacer clic en su etiqueta, y el
 * navegador no puede autocompletarlo. Es un defecto del producto que además
 * ciega a quien lo audita — la peor combinación, porque se descubre como un
 * falso hallazgo y se cierra como "no pasa nada".
 *
 * Mide sobre PRODUCCIÓN, no sobre el archivo: el `accessible name` lo calcula el
 * navegador, así que un grep del TSX sirve para DESCARTAR y nunca para confirmar.
 *
 *   node scripts/campos-alcanzables-por-etiqueta.mjs --email <dueño> --ruta /patients/new
 *
 * exit 0 = todos los controles tienen etiqueta accesible
 * exit 1 = hay controles huérfanos (los nombra)
 * exit 2 = NO MEDIDO (no pude abrir la pantalla) — nunca verde
 */
import { navegadorConSesion } from "./lib/sesion_dueno.mjs";

function arg(nombre, pordefecto = null) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : pordefecto;
}

const email = arg("email", "sergio@onia.com.bo");
const ruta = arg("ruta", "/patients/new");

let sesion;
try {
  sesion = await navegadorConSesion(email);
} catch (e) {
  console.error(`NO MEDIDO: no pude abrir sesión para ${email} — ${e.message}`);
  process.exit(2);
}

const { navegador, pagina, host, fallos } = sesion;
let codigo = 2;
try {
  const url = `https://${host}${ruta}`;
  const resp = await pagina.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  if (!resp || resp.status() >= 400) {
    console.error(`NO MEDIDO: ${ruta} devolvió ${resp ? resp.status() : "sin respuesta"}`);
    process.exit(2);
  }
  if (new URL(pagina.url()).pathname !== ruta) {
    console.error(`NO MEDIDO: pedí ${ruta} y terminé en ${new URL(pagina.url()).pathname}`);
    process.exit(2);
  }

  // El `accessible name` lo resuelve el navegador, que es justo lo que un grep no
  // puede hacer: `<label>` suelta al lado de un `<input>` SIN `htmlFor` no lo nombra.
  const campos = await pagina.evaluate(() => {
    const dentroDelFormulario = (el) => !!el.closest("form");
    const controles = [...document.querySelectorAll("input, select, textarea")]
      .filter(dentroDelFormulario)
      .filter((el) => el.type !== "hidden" && el.offsetParent !== null);
    return controles.map((el) => {
      // Las cuatro formas de nombrar un control. `el.labels` sólo trae las
      // etiquetas REALMENTE asociadas (htmlFor o envolvente): ese es el punto.
      const porEtiqueta = el.labels && el.labels.length > 0;
      const aria = el.getAttribute("aria-label");
      const ariaRef = el.getAttribute("aria-labelledby");
      const titulo = el.getAttribute("title");
      // El texto que un humano VE al lado, para poder nombrar el huérfano.
      const visible = el.closest("div")?.querySelector("label")?.textContent?.trim() ?? "";
      return {
        etiqueta: visible || el.getAttribute("placeholder") || el.tagName.toLowerCase(),
        tipo: el.tagName.toLowerCase(),
        nombrado: Boolean(porEtiqueta || aria || ariaRef || titulo),
        tieneId: Boolean(el.id),
      };
    });
  });

  if (campos.length === 0) {
    console.error(`NO MEDIDO: ${ruta} no tiene ningún control visible dentro de un <form>`);
    process.exit(2);
  }

  const huerfanos = campos.filter((c) => !c.nombrado);
  console.log(`${ruta} — ${campos.length} control(es) visible(s) en el formulario`);
  console.log(`  alcanzables por su etiqueta: ${campos.length - huerfanos.length}/${campos.length}`);
  // A propósito NO se mide `name=`: esta es una ficha de TERCEROS (el cliente del
  // negocio), así que invitar al autocompletado del navegador le ofrecería a la
  // recepcionista sus PROPIOS datos como si fueran los del paciente.
  if (fallos.length) console.log(`  respuestas >=400 durante la carga: ${fallos.join(", ")}`);

  if (huerfanos.length) {
    console.log(`\nHUÉRFANOS — un lector de pantalla no los anuncia y getByLabel no los encuentra:`);
    for (const c of huerfanos) console.log(`  · ${c.etiqueta} (${c.tipo})`);
    codigo = 1;
  } else {
    console.log(`\nOK: todos los controles tienen etiqueta accesible.`);
    codigo = 0;
  }
} catch (e) {
  console.error(`NO MEDIDO: ${e.message}`);
  codigo = 2;
} finally {
  await navegador.close();
}
process.exit(codigo);
