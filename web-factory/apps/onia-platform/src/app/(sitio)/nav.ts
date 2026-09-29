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

/**
 * Producto: qué es y cuánto cuesta.
 *
 * `/agentes` SALE el 2026-09-08 (Sergio Urcullo, «ok C»): la navegación pública
 * queda en el sistema + Chatbot. El chatbot se queda porque pasa el test de tres
 * preguntas de `CLAUDE.md` §10 —es un add-on con precio propio en `pricing.ts`—;
 * los agentes son una capacidad DENTRO de los planes, no una puerta de entrada,
 * y ocupaban una ranura al lado de «Precios».
 *
 * **No pierde alcance**: la portada la ofrece en su cuerpo
 * (`(sitio)/page.tsx`), así que sigue enlazada, en el sitemap y indexada. Por eso
 * NO entra al disallow de `robots.ts` — es la misma línea que separa a
 * `/servicios/webs` de sus hermanas: se desindexa lo que el sitio dejó de
 * ofrecer, no lo que ofrece en otra pantalla.
 */
export const NAV_PRODUCTO: readonly NavItem[] = [
  { href: "/rubros", label: "Rubros" },
  { href: "/chatbot", label: "Agente conversacional" },
  { href: "/precios", label: "Precios" },
];

/**
 * Decidir: las pantallas que matan la objeción y la que arranca.
 *
 * `/comparativa` y `/nosotros` SALEN el 2026-09-08 (Sergio Urcullo, «ok C»):
 * el menú público queda en `Rubros · Chatbot · Precios · Facturación · Contacto`
 * — el sistema y su add-on, nada más.
 *
 * ⚠️ **Salen del MENÚ, no del sitio, y las dos siguen indexadas** — que es más
 * de lo que hizo falta con `/servicios/*`. La diferencia no es de criterio sino
 * de hecho: aquéllas se quedaron sin UNA sola pantalla que las enlazara, y éstas
 * conservan su enlace en el cuerpo de una pantalla viva (`/precios` ofrece la
 * comparación al lado de la tabla; `/contacto` ofrece «quiénes somos» antes de
 * pedir una cita). Un lead sigue llegando; lo que se quita es que compitan con
 * «Precios» en la barra.
 *
 * **Y por qué el enlace del cuerpo se agregó en la misma vuelta, en vez de
 * mandarlas al disallow:** desindexar `/nosotros` no es «sale del menú». Con
 * cero clientes pagando, "empresa boliviana, SEPREC, NIT, Santa Cruz" es el
 * sustituto legítimo del testimonio — es la única pantalla que contesta
 * «¿quiénes son estos?», y esa objeción no la mata ningún precio.
 *
 * ⚠️ El comentario anterior afirmaba que `/comparativa` ya estaba «enlazada
 * desde el cuerpo de `/precios`». **Era falso** y se verificó al sacarla:
 * ningún `.tsx` del árbol vivo ni ningún módulo `@/` que él importe escribía ese
 * `href`. Una afirmación de cobertura que nadie mide es la que deja pasar el
 * defecto que el gate existe para cazar — acá habría desindexado la pantalla sin
 * que nada se pusiera rojo.
 */
export const NAV_DECIDIR: readonly NavItem[] = [
  { href: "/facturacion", label: "Facturación" },
  { href: "/contacto", label: "Contacto" },
  { href: "/empezar", label: "Empezar" },
];

/*
 * NO hay apartado «Servicios» — y no es un olvido.
 *
 * Existió del 2026-09-03 al 2026-09-08 con Webs · Marketing IA · Consultoría en
 * el pie y en el menú de teléfono. Lo sacó Sergio Urcullo (tarea `t_30b1711d`,
 * con su `ok`): *«mantener en la navegación pública solo las entradas del
 * sistema + Chatbot»*, porque **los leads confunden la web con una agencia**.
 * Onia vende UN producto —Onia Platform, por rubro—; un menú que ofrece encargos
 * al lado de «Precios» dice que esto es un estudio, no un sistema que se
 * contrata.
 *
 * **Las páginas no se bajaron** ese día: `/servicios/webs`, `/servicios/marketing-ia` y
 * `/servicios/consultoria` siguieron respondiendo 200. Salían del CAMINO, no
 * del sitio — igual que `/comparativa` cuando salió del header. ⚠️ Desde el
 * 2026-09-28 marketing-ia y consultoria SÍ se bajan: 308 a la portada
 * (`next.config.ts`, decisión de Sergio Urcullo). `/servicios/webs` sigue viva. Como ya no las
 * enlaza ninguna pantalla viva, `robots.ts` las declara fuera del índice: es la
 * salida que `alcance.test.ts` documenta para una página que deja el camino, y
 * evita que el sitio pida indexar lo que él mismo no ofrece.
 *
 * Lo ancla `nav-sin-agencia.test.ts`, que barre el mapa Y el literal desnudo en
 * el cromo: una ruta `/servicios/*` nueva en cualquier nav nace cubierta.
 */

/**
 * Header de escritorio: el CAMINO DE COMPRA, y nada más. No entran los ocho —
 * a 940px el header se desborda y el CTA se cae de la fila (medido). Agentes y
 * Chatbot viven en el pie, en el menú de teléfono y linkeados desde la portada.
 *
 * `/comparativa` SALE del header el 2026-09-04. Estaba pegada a `/precios`, o
 * sea que el camino de compra le ofrecía al lead, en el mismo renglón que el
 * precio, una pantalla que nombra seis competidores CON su precio y que además
 * dice textual «El Portal del SIN es gratis y cumple la ley. Eso lo decimos
 * nosotros primero». Enseñarle al que ya está por comprar que hay una opción
 * gratis del Estado es la fricción más cara que puede tener un header.
 *
 * El error NO es comparar: `lety.ai` —la referencia que fijó Sergio el
 * 2026-09-03 junto con `dapta.ai`— también compara contra cuatro competidores
 * con nombre. La diferencia medida es que Lety se niega a publicar el precio
 * ajeno, y que la comparación no ocupa una ranura del menú de arriba.
 *
 * **No se baja: sale del CAMINO, no del sitio.** Sigue publicada, en el
 * sitemap, en `NAV_DECIDIR` (pie y menú de teléfono) y enlazada desde el cuerpo
 * de `/precios`. Lo verifica `alcance.test.ts`, que exige que toda página
 * publicada sea alcanzable desde el árbol vivo.
 *
 * El invariante que lo sostiene está en `header-camino-de-compra.test.ts`:
 * ninguna pantalla del header muestra la tabla de competidores.
 */
export const NAV_HEADER: readonly NavItem[] = [
  { href: "/rubros", label: "Rubros" },
  { href: "/precios", label: "Precios" },
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
