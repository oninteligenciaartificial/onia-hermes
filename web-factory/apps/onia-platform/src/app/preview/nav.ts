import { APP_URL } from "@/lib/site";

/**
 * El mapa del preview, en UN solo lugar: lo leen el header, el pie y el menú
 * de teléfono. Antes los cuatro apartados estaban escritos dos veces en ui.tsx
 * y el header los escondía en móvil, así que en teléfono el sitio tenía cuatro
 * secciones invisibles.
 *
 * Los enlaces son <a> planos a propósito (el preview no usa next/link en
 * ningún lado): una navegación completa cierra cualquier menú abierto sola.
 */

export interface NavItem {
  href: string;
  label: string;
}

/** Producto: qué es y cuánto cuesta. */
export const NAV_PRODUCTO: readonly NavItem[] = [
  { href: "/preview/rubros", label: "Rubros" },
  { href: "/preview/agentes", label: "Agentes" },
  { href: "/preview/chatbot", label: "Chatbot" },
  { href: "/preview/precios", label: "Precios" },
];

/** Decidir: las tres pantallas que matan la objeción y la que arranca. */
export const NAV_DECIDIR: readonly NavItem[] = [
  { href: "/preview/comparativa", label: "Comparativa" },
  { href: "/preview/facturacion", label: "Facturación" },
  { href: "/preview/contacto", label: "Contacto" },
  { href: "/preview/empezar", label: "Empezar" },
];

/**
 * Header de escritorio: cinco. No entran los ocho — a 940px el header se
 * desborda y el CTA se cae de la fila (medido). Agentes y Chatbot viven en el
 * pie, en el menú de teléfono y linkeados desde la portada.
 */
export const NAV_HEADER: readonly NavItem[] = [
  { href: "/preview/rubros", label: "Rubros" },
  { href: "/preview/precios", label: "Precios" },
  { href: "/preview/comparativa", label: "Comparativa" },
  { href: "/preview/facturacion", label: "Facturación" },
  { href: "/preview/contacto", label: "Contacto" },
];

/** La pantalla de arranque vive DENTRO del preview: no se sale del sitio. */
export const EMPEZAR_URL = "/preview/empezar";

/** Volver al sistema. El registro y el login son del producto, no del sitio. */
export const LOGIN_URL = `${APP_URL}/login`;
export const REGISTRO_URL = `${APP_URL}/register`;

/** Legales: existen una sola vez en el producto. Se linkean, no se copian. */
export const NAV_LEGAL: readonly NavItem[] = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
];
