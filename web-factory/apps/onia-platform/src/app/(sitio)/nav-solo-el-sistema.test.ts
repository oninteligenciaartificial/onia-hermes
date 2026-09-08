import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { NAV_HEADER, NAV_PRODUCTO, NAV_DECIDIR, NAV_LEGAL } from "./nav";

/**
 * El menú público ofrece EXACTAMENTE el sistema, su add-on y cómo empezar.
 *
 * Decisión de Sergio Urcullo, 2026-09-07 («ok C»): la navegación queda en
 * `Rubros · Chatbot · Precios · Facturación · Contacto`. Salen `Webs`,
 * `Marketing IA`, `Consultoría`, `Comparativa`, `Nosotros` y `Agentes`.
 *
 * **Por qué hace falta OTRO gate al lado de `nav-sin-agencia.test.ts`.** Aquél
 * persigue lo prohibido —`/servicios/*`— y por eso sólo ve la forma que ya
 * falló: el día que vuelva `/agentes`, o entre `/casos` o `/blog`, la decisión
 * queda rota con ese archivo en verde. Es la misma familia que ya mordió acá
 * varias veces (un barrido de literales prohibidos es ciego a lo que no está en
 * su lista). Éste invierte el sujeto: **lista de APROBADAS**, comparada por
 * igualdad de conjuntos. Una entrada nueva no nace cubierta por casualidad —
 * nace en ROJO, y para admitirla hay que escribirla acá con su motivo, que es
 * una decisión visible.
 *
 * **Y mide las dos direcciones, no sólo la de más.** Que falte `/precios` del
 * menú es tan violación de lo decidido como que sobre `/agentes`, y el gate de
 * lo prohibido no puede ver una ausencia. Ya pasó en este carril: un ítem se dio
 * por cerrado porque nadie volvió a mirar la mitad simétrica.
 *
 * **Los dos niveles.** El defecto original sobrevivió a una revisión porque el
 * `header` renderiza DOS niveles: la barra (`NAV_HEADER`) y, adentro del mismo
 * `<header>`, el menú de teléfono con `NAV_PRODUCTO` + `NAV_DECIDIR`. Un `grep`
 * al código no alcanzaba. Acá el sujeto es la UNIÓN de los tres arrays más el
 * literal desnudo del cromo, así que los dos niveles entran por construcción.
 *
 * ⚠️ **Esto NO baja ninguna página.** `/agentes`, `/comparativa` y `/nosotros`
 * siguen respondiendo 200, en el sitemap e indexadas, porque las tres conservan
 * un enlace en el cuerpo de una pantalla viva (`/`, `/precios` y `/contacto`
 * respectivamente). Salen del CAMINO, no del sitio; lo verifica
 * `alcance.test.ts`, que las mandaría al disallow de `robots.ts` si ese enlace
 * desapareciera.
 */

const SITIO = dirname(fileURLToPath(import.meta.url));

/**
 * Lo que el menú público puede ofrecer, y por qué cada una se ganó su lugar.
 * Agregar una fila acá es tomar una decisión de navegación: que se vea.
 */
const APROBADAS: Readonly<Record<string, string>> = {
  "/rubros": "la oferta: el sistema, por rubro",
  "/chatbot": "el único add-on que pasa el test de tres preguntas de CLAUDE.md §10",
  "/precios": "cuánto cuesta, sin hacerlo buscar",
  "/facturacion": "la objeción fiscal, que en Bolivia decide la compra",
  "/contacto": "hablar con alguien antes de pagar",
  "/empezar": "la salida del embudo (su URL circula en firmas y /prueba-gratis le redirige)",
};

/**
 * La barra visible: el CAMINO DE COMPRA, en orden de embudo. Es un subconjunto
 * de `APROBADAS` a propósito — `/chatbot` y `/empezar` no entran porque a 940px
 * el header se desborda y el CTA se cae de la fila (medido, ver `nav.ts`).
 *
 * Va aparte de la unión, y no es un lujo: **la unión no puede ver una ausencia
 * por nivel.** Medido por mutación el 2026-09-08 — sacar `/precios` de la barra
 * dejaba los 868 casos en VERDE, porque `/precios` seguía en `NAV_PRODUCTO` y el
 * conjunto unido no cambiaba. O sea que el precio podía desaparecer del camino
 * de compra sin que nada se pusiera rojo, que es justo la mitad que el gate de
 * lo prohibido tampoco ve.
 */
const CAMINO_DE_COMPRA = ["/rubros", "/precios", "/facturacion", "/contacto"];

/** Legales: existen por obligación, no son oferta. Viven en `NAV_LEGAL`. */
const LEGALES = NAV_LEGAL.map((i) => i.href);

/** Los archivos que pintan navegación en el sitio vivo. */
const CROMO = ["nav.ts", "ui.tsx", "menu.tsx", "barra.tsx"];

/** Saca los comentarios: la bitácora que explica el porqué no es superficie. */
function sinComentarios(texto: string): string {
  return texto.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
}

/** Los destinos internos que escribe un archivo, en las dos formas del sitio. */
function destinos(archivo: string): string[] {
  const texto = sinComentarios(readFileSync(join(SITIO, archivo), "utf8"));
  return [
    ...[...texto.matchAll(/href=\{?"(\/[^"?#]*)"/g)].map((m) => m[1]),
    ...[...texto.matchAll(/href:\s*"(\/[^"?#]*)"/g)].map((m) => m[1]),
  ];
}

/** El menú público: los dos niveles del header, más el pie. */
const DEL_MENU = [...NAV_HEADER, ...NAV_PRODUCTO, ...NAV_DECIDIR].map((i) => i.href);

describe("el menú público ofrece el sistema y nada más", () => {
  it("tiene de dónde medir", () => {
    // Sin este ancla, vaciar un array o renombrar un archivo del cromo deja los
    // casos de abajo comparando conjuntos vacíos: verde, y la decisión suelta.
    const presentes = readdirSync(SITIO);
    for (const archivo of CROMO) {
      expect(presentes, `${archivo} ya no está: este gate dejó de medir`).toContain(archivo);
    }
    for (const [nombre, arr] of [
      ["NAV_HEADER", NAV_HEADER],
      ["NAV_PRODUCTO", NAV_PRODUCTO],
      ["NAV_DECIDIR", NAV_DECIDIR],
    ] as const) {
      expect(arr.length, `${nombre} quedó vacío: el menú no se mide solo`).toBeGreaterThan(0);
    }
  });

  it("no ofrece NINGUNA entrada fuera de lo aprobado", () => {
    const sobran = [...new Set(DEL_MENU)].filter((href) => !(href in APROBADAS)).sort();
    expect(
      sobran,
      `El menú ofrece ${sobran.join(", ")}. Sergio Urcullo fijó el 2026-09-07 («ok C») ` +
        `que la navegación pública es Rubros · Chatbot · Precios · Facturación · Contacto: ` +
        `el sistema y su add-on. Una entrada más compite con «Precios» en la barra y le dice ` +
        `al lead que esto es una agencia. Si la entrada va, se agrega a APROBADAS con su motivo; ` +
        `si no, sale del menú — la página no se baja y sigue alcanzable desde el cuerpo de una pantalla.`,
    ).toEqual([]);
  });

  it("no le FALTA ninguna de las aprobadas", () => {
    // La mitad que un gate de literales prohibidos no puede ver: una ausencia.
    const faltan = Object.keys(APROBADAS).filter((href) => !DEL_MENU.includes(href)).sort();
    expect(
      faltan,
      `El menú ya no ofrece ${faltan.join(", ")}, que sí está aprobado. Sacar una entrada del ` +
        `camino de compra es una decisión, no una limpieza: si de verdad va, se saca de APROBADAS ` +
        `en el mismo cambio y se deja escrito por qué.`,
    ).toEqual([]);
  });

  it("la barra visible es EXACTAMENTE el camino de compra", () => {
    // Se compara como conjunto y no como lista: reordenar el embudo es una
    // decisión de copy legítima, perder o sumar una parada no lo es.
    expect(
      [...NAV_HEADER.map((i) => i.href)].sort(),
      `La barra de arriba quedó en ${NAV_HEADER.map((i) => i.href).join(" · ")}. Es el camino de ` +
        `compra y se mide APARTE de la unión, porque la unión no puede ver una ausencia por nivel: ` +
        `con /precios sólo en el menú de teléfono, el precio desaparece de la barra y el conjunto ` +
        `unido no cambia. /chatbot y /empezar no entran acá: a 940px el header se desborda.`,
    ).toEqual([...CAMINO_DE_COMPRA].sort());
  });

  it.each(CROMO)("%s no escribe un destino de menú a mano", (archivo) => {
    // El mapa vive en `nav.ts`. Un `<a href="/agentes">` tipeado en el cromo
    // reintroduce la entrada sin tocar ningún array, y los casos de arriba —que
    // leen los arrays— pasarían en verde sobre el defecto.
    const permitidos = new Set([...Object.keys(APROBADAS), ...LEGALES, "/"]);
    const sueltos = [...new Set(destinos(archivo))].filter((r) => !permitidos.has(r)).sort();
    expect(
      sueltos,
      `${archivo} escribe ${sueltos.join(", ")} en el cromo, salteándose el mapa de nav.ts. ` +
        `Ahí se cambia una ruta, no cazando literales por las páginas.`,
    ).toEqual([]);
  });
});
