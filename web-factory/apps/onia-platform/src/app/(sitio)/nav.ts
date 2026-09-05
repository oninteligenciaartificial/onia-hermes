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

/**
 * Decidir: las pantallas que matan la objeción y la que arranca.
 *
 * `/nosotros` entra acá el 2026-08-23. Existía, estaba en el sitemap y no la
 * linkeaba NINGÚN nav de la v3 — solo el header/pie viejos, que ya no envuelven
 * al sitio: era inalcanzable. Con cero clientes pagando, "empresa boliviana,
 * SEPREC, NIT, Santa Cruz" es el sustituto legítimo del testimonio, y es una
 * objeción («¿quiénes son estos?»), no una hoja de producto: por eso Decidir y
 * no Producto.
 */
export const NAV_DECIDIR: readonly NavItem[] = [
  { href: "/comparativa", label: "Comparativa" },
  { href: "/facturacion", label: "Facturación" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
  { href: "/empezar", label: "Empezar" },
];

/**
 * Servicios: lo que Onia hace ADEMÁS del sistema, cada uno con su página.
 *
 * Entran acá el 2026-09-03, y es exactamente el bug de `/nosotros` de más
 * arriba sin terminar de barrer. `/servicios/marketing-ia` y
 * `/servicios/consultoria` siguen viviendo en el árbol viejo (`app/servicios/`,
 * con el `SiteFooter` archivado, el mismo cromo que `/v1`), así que ningún nav
 * del sitio v3 las nombraba. Medido sobre las 16 páginas servidas por
 * `onia.com.bo`: las enlazaban **4**, y las cuatro eran `/privacidad`,
 * `/terminos` y ellas dos entre sí. Desde la superficie de venta entera —la
 * portada, `/precios`, `/empezar`, `/rubros`, `/chatbot`, `/agentes`,
 * `/facturacion`, `/comparativa`, `/contacto`, `/nosotros`— no había **un solo
 * enlace**: para llegar a dos servicios que se cobran había que pasar por la
 * política de privacidad. Y el sitemap las pedía indexar igual, o sea que el
 * sitio se contradecía a sí mismo otra vez.
 *
 * `/servicios/webs` ya era alcanzable (la linkean seis páginas por su cuerpo),
 * pero va con las otras dos: el apartado es el mismo y una lista partida en dos
 * lugares es la que se desincroniza. Lo mide `alcance.test.ts`.
 */
export const NAV_SERVICIOS: readonly NavItem[] = [
  { href: "/servicios/webs", label: "Webs" },
  { href: "/servicios/marketing-ia", label: "Marketing IA" },
  { href: "/servicios/consultoria", label: "Consultoría" },
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

/** Volver al sistema. El registro y el login son del producto, no del sitio. */
export const LOGIN_URL = `${APP_URL}/login`;
export const REGISTRO_URL = `${APP_URL}/register`;

/**
 * Dónde manda el botón del alta: al REGISTRO, en un clic.
 *
 * Hasta el 2026-09-04 esto valía `"/empezar"` y el comentario defendía la
 * decisión: «la pantalla de arranque vive DENTRO del sitio, no se sale a otro
 * cromo». Medido sobre el HTML servido, eso costaba **tres clics** para crear
 * una cuenta: los nueve botones de la portada iban a `/empezar`, una segunda
 * página de venta cuyo único botón vuelve a decir «Creá tu cuenta» y recién ahí
 * salta a `app.onia.com.bo/register`. El paso que `/empezar` describía —«elegí
 * tu rubro»— es literalmente la primera pantalla del registro, así que el lead
 * leía dos veces lo mismo antes de poder escribir su correo.
 *
 * La referencia de cómo se vende (Sergio, 2026-09-03: lety.ai y dapta.ai de
 * HOY) arranca en uno: Dapta va de la portada al registro en **1 clic**, Lety
 * llega a la caja en 2.
 *
 * `/empezar` NO se baja —sigue publicada, en el sitemap y enlazada desde
 * `NAV_DECIDIR`, porque su URL circula en firmas y `/prueba-gratis` le redirige
 * con 308—: sale del CAMINO, no del sitio.
 *
 * La ETIQUETA del botón vive en `./alta` — no depende de la ruta sino de lo que
 * /register haga ese día. Ningún archivo del sitio escribe ese verbo a mano ni
 * su destino: `alta.test.ts` verifica las dos mitades.
 */
export const EMPEZAR_URL = REGISTRO_URL;

/** Legales: existen una sola vez en el producto. Se linkean, no se copian. */
export const NAV_LEGAL: readonly NavItem[] = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
];
