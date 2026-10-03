#!/usr/bin/env node
/**
 * Las promesas que el producto NO cumple hoy, por su FORMA — una sola lista para las dos
 * superficies que las dicen: el sitio y el kit de venta.
 *
 * **Quién la usa.**
 *  - `src/app/promesa-que-el-producto-cumple.test.ts`: el sitio, en dos pasadas (la fuente de
 *    `src/`, y el HTML que el servidor manda de cada ruta publicada).
 *  - `onia-hermes/scripts/venta-honestidad.test.mjs` (la raíz): el kit que Sergio Urcullo le
 *    manda a las clínicas (`hermes-content/sales-kit/*.md`).
 *  - A mano, antes de mandar o publicar un borrador (un mensaje a un lead, un anuncio, un .md):
 *
 *      npm run promesas:revisar -- <archivo> [<archivo>…]
 *
 *    Sale 1 si encuentra una promesa, 0 si no, y 2 si no pudo leer: nunca verde sin haber leído.
 *
 * **Por qué vive acá y no en el test** (3-oct). El barrido del 2-oct (`02ad96e68`) sacó del SITIO
 * cuatro promesas que el catálogo §7/§8 prohíbe y dejó un gate que solo miraba `src/`. El one-pager
 * del kit las siguió diciendo las cuatro, y nada lo marcaba: el gate del kit miraba montos, planes,
 * marca y SIAT. Una lista por superficie es una lista que se afloja en una y no en la otra. Vive en
 * `web-factory/` porque el stage del publicador de la landing solo lleva ese árbol
 * (`scripts/imports-que-viajan-al-stage.test.ts`): la raíz importa de acá; al revés no se puede.
 *
 * **Fuente para medir:** `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §2, §5, §7 y §8,
 * `docs/research/ONIA_INVENTARIO_IA_20261002.md` §4 y el código de onia-platform `origin/master`.
 *
 * **Cuándo se afloja una forma:** el día que el producto lo haga en producción y se MIRE ahí (p. ej.,
 * un número de cliente conectado que mande solo). Se borra la forma con esa medición en el commit.
 */

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/** Algo que se pueda decir con una frase: «Onia», «el agente», «la IA», «el sistema». */
const SUJETO_QUE_HARIA_LA_CITA =
  String.raw`\b(la IA|el agente|los agentes|el bot|el chatbot|el asistente|el sistema|Onia)` +
  String.raw`( (te|le|les|lo|la|los|las))?`;

export const PROMESAS = [
  {
    que: "el sistema agenda solo",
    /**
     * El SUJETO es lo que hace falsa la frase: el agente, la IA o el sistema no crean la cita. El
     * link de reserva SÍ la crea (onia-platform `app/api/booking/appointments/route.ts`,
     * `tx.appointment.create`, incluido desde Crece), así que «se agendan solos desde tu link»,
     * «entra en la agenda como una cita más» o «ya queda en la agenda» son ciertas y pasan. Hasta el
     * 3-oct esta forma prohibía esas frases en todo el sitio, y su mensaje («el sistema no agenda»)
     * era falso para el link.
     */
    forma: new RegExp(
      [
        String.raw`control ya en la agenda`,
        String.raw`\bagenda(n)? por vos\b`,
        SUJETO_QUE_HARIA_LA_CITA +
          String.raw` (agenda(n|r)?|deja(n)? (la cita )?agendad[oa]s?|pone(n)? (la cita )?en (la|tu) agenda|crea(n)? la cita|reserva(n)? (la cita|el turno))\b`,
      ].join("|"),
      "i",
    ),
    porque:
      "Ni el agente, ni la IA, ni el sistema crean la cita: el agente deja el mensaje con el link para que el cliente reserve, y el dueño lo aprueba (catálogo §2, §5 y §8). El link de reserva sí la crea: «se agendan solos desde tu link» se puede decir.",
  },
  {
    que: "la IA revisa, decide, escribe cada mensaje o atiende",
    /**
     * La IA redacta UNA plantilla por agente, cuando el dueño la pide, y él la aprueba una vez. Lo
     * que sale cada mañana es esa plantilla (o el texto fijo) con el nombre y el monto de cada uno.
     * «La IA te propone el texto y vos lo aprobás», pegado a la propuesta diaria, se lee como que
     * redacta cada mensaje: va «el texto de cada agente» o «lo aprobás una vez» (descripción de
     * /agentes, 3-oct).
     */
    forma: new RegExp(
      [
        String.raw`(agentes?|asistente) (de|con) IA que (\S+ ){0,3}?(escrib|revis|decid|respond|atiend|agend|contest)`,
        String.raw`la IA (escribe|decide|revisa|atiende|responde|contesta|agenda)\b`,
        String.raw`la IA (te )?(propone|redacta|arma) (el|los|cada) (texto|mensaje|borrador)s?\b` +
          String.raw`(?! de cada (agente|recordatorio))(?![\s\S]{0,90}?\buna (sola )?vez\b)`,
      ].join("|"),
      "i",
    ),
    porque:
      "La IA redacta UNA plantilla por agente y el dueño la aprueba una vez; a quién y cuándo lo deciden reglas fijas (catálogo §8). Se dice «el texto de cada agente» o «lo aprobás una vez».",
  },
  {
    que: "entiende fotos, audios o comprobantes",
    forma: /entiende (las |tus |los )?(fotos|audios|notas de voz|comprobantes|im[aá]genes)/i,
    porque:
      "§8 del catálogo: no se puede decir que entiende fotos, comprobantes ni notas de voz (en duda: 0 negocios en modo recepcionista, el transcriptor no existe en el VPS).",
  },
  {
    que: "el mensaje sale solo por WhatsApp",
    forma: /sale(n)? (sol[oa]s? )?por tu WhatsApp|se (env[ií]a|manda)(n)? sol[oa]s? por (tu )?WhatsApp/i,
    porque:
      "El envío automático por WhatsApp necesita un número conectado y hoy hay 0 (catálogo §7). Lo que siempre existe es el link para mandarlo con un toque.",
  },
  {
    que: "agenda por profesional",
    forma: /agenda por profesional|agenda de cada profesional/i,
    porque:
      "La agenda no tiene vista ni filtro por profesional: cada cita dice con quién es (onia-platform AgendaClient.tsx, variosProfesionales). Se dice «agenda con el profesional de cada cita».",
  },
  {
    que: "un resultado prometido sobre los clientes que se van",
    /**
     * El voseo lleva tilde («Recuperás», «Recuperá») y rompía el prefijo `recupera`; el plural
     * («recuperan») tampoco entraba, ni la promesa dicha al revés («te devuelven clientes», la
     * tarjeta del Crece en /precios hasta el 3-oct). Sin `\b` después del verbo: en JS la «á» no es
     * letra para `\b`, y el espacio que sigue ya lo exige la forma.
     */
    forma:
      /tratamiento a medias (ya )?no se pierde|\b(recuper(a|á|ás|as|amos|ar|an|ará|arán)|te devuelve(n)?|devolvemos)( a)?( tus| los| las)? (pacientes|clientas?|clientes)\b/i,
    porque:
      "Lo que el producto hace es el mecanismo —te propone a quién escribirle y deja el mensaje para aprobar—, no el resultado (catálogo §8).",
  },
];

/** Cada promesa que `texto` dice, con un fragmento alrededor para el mensaje de error. */
export function promesasEn(texto) {
  return PROMESAS.flatMap(({ que, forma, porque }) =>
    [...texto.matchAll(new RegExp(forma.source, `${forma.flags.replace("g", "")}g`))].map((m) => ({
      que,
      porque,
      indice: m.index,
      fragmento: texto.slice(Math.max(0, m.index - 50), m.index + m[0].length + 30),
    })),
  );
}

/** Comentarios en blanco: explican y acusan, y no son superficie de cliente. */
function sinComentarios(fuente) {
  return fuente
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`])\/\/[^\n]*/g, (m, antes) => antes + m.slice(antes.length).replace(/[^\n]/g, " "));
}

const ESPACIO_DURO = /&nbsp;|&#160;|&#xa0;| /gi;

/**
 * Lo que se LEE de un fuente TS/JSX: sin comentarios, sin etiquetas y sin los `{" "}` que mete
 * prettier, con los espacios unidos. Una frase partida en renglones, en `<em>` o en `{" "}` sigue
 * siendo la misma frase para el que la lee.
 */
export function textoDeFuente(fuente) {
  return sinComentarios(fuente)
    .replace(/\{\s*(["'`])\s*\1\s*\}/g, " ")
    .replace(/<\/?[A-Za-z][\w.:-]*(\s[^<>]*)?\/?>/g, " ")
    .replace(ESPACIO_DURO, " ")
    .replace(/\s+/g, " ");
}

const ENTIDADES = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" };

/**
 * Lo que se LEE de un HTML servido: sin `<style>`, sin los `<!-- -->` que React mete entre nodos de
 * texto, sin etiquetas y con las entidades resueltas. Los `<script>` quedan: el JSON-LD lo lee Google.
 */
export function textoDeHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?[A-Za-z][^<>]*>/g, " ")
    .replace(ESPACIO_DURO, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&(amp|quot|apos|lt|gt);/g, (_, e) => ENTIDADES[e])
    .replace(/\s+/g, " ");
}

/** Lo que se LEE de un texto suelto o Markdown: sin el resaltado que parte la frase. */
export function textoDeTexto(texto) {
  return texto.replace(/\*\*|__|`/g, "").replace(ESPACIO_DURO, " ").replace(/\s+/g, " ");
}

function textoSegunArchivo(ruta, crudo) {
  if (/\.(tsx?|jsx?|mjs)$/.test(ruta)) return textoDeFuente(crudo);
  if (/\.html?$/.test(ruta)) return textoDeHtml(crudo);
  return textoDeTexto(crudo);
}

/** La revisión a mano: código de salida 0 (limpio), 1 (promete) o 2 (no pudo leer). */
export function revisar(rutas, escribir = console.log) {
  if (rutas.length === 0) {
    escribir("Uso: npm run promesas:revisar -- <archivo> [<archivo>…]");
    return 2;
  }
  let encontradas = 0;
  for (const ruta of rutas) {
    let crudo;
    try {
      crudo = readFileSync(ruta, "utf8");
    } catch (error) {
      escribir(`No pude leer ${ruta}: ${error.message}. NO se revisó nada.`);
      return 2;
    }
    for (const p of promesasEn(textoSegunArchivo(ruta, crudo))) {
      encontradas++;
      escribir(`${ruta}: ${p.que} «…${p.fragmento.trim()}…»\n  ${p.porque}`);
    }
  }
  escribir(
    encontradas
      ? `${encontradas} promesa(s) que el producto no cumple hoy.`
      : `Revisados ${rutas.length} archivo(s): ninguna promesa que el producto no cumpla.`,
  );
  return encontradas ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(revisar(process.argv.slice(2)));
}
