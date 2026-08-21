import { APP_URL } from "@/lib/site";

/**
 * El mapa del sitio, en UN solo lugar: lo leen el header, el pie y el menú de
 * teléfono. Antes los cuatro apartados estaban escritos dos veces en ui.tsx y
 * el header los escondía en móvil, así que en teléfono el sitio tenía cuatro
 * secciones invisibles.
 *
 * ACÁ se cambia una ruta, no cazando literales por las páginas.
 *
 * Los enlaces son <a> planos a propósito (este árbol no usa next/link en
 * ningún lado): una navegación completa cierra cualquier menú abierto sola.
 */

export interface NavItem {
  href: string;
  label: string;
}

/** Producto: qué es y cuánto cuesta. */
export const NAV_PRODUCTO: readonly NavItem[] = [
  { href: "/rubros", label: "Rubros" },
  { href: "/agentes", label: "Agentes" },
  { href: "/chatbot", label: "Chatbot" },
  { href: "/precios", label: "Precios" },
];

/** Decidir: las tres pantallas que matan la objeción y la que arranca. */
export const NAV_DECIDIR: readonly NavItem[] = [
  { href: "/comparativa", label: "Comparativa" },
  { href: "/facturacion", label: "Facturación" },
  { href: "/contacto", label: "Contacto" },
  { href: "/empezar", label: "Empezar" },
];

/**
 * Header de escritorio: cinco. No entran los ocho — a 940px el header se
 * desborda y el CTA se cae de la fila (medido). Agentes y Chatbot viven en el
 * pie, en el menú de teléfono y linkeados desde la portada.
 */
export const NAV_HEADER: readonly NavItem[] = [
  { href: "/rubros", label: "Rubros" },
  { href: "/precios", label: "Precios" },
  { href: "/comparativa", label: "Comparativa" },
  { href: "/facturacion", label: "Facturación" },
  { href: "/contacto", label: "Contacto" },
];

/** La pantalla de arranque vive DENTRO del sitio: no se sale a otro cromo. */
export const EMPEZAR_URL = "/empezar";

/** Volver al sistema. El registro y el login son del producto, no del sitio. */
export const LOGIN_URL = `${APP_URL}/login`;
export const REGISTRO_URL = `${APP_URL}/register`;

/** Legales: existen una sola vez en el producto. Se linkean, no se copian. */
export const NAV_LEGAL: readonly NavItem[] = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
];
