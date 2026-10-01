/**
 * Webs — los stacks que vendemos, con los precios que ya están escritos.
 *
 * Fuentes (los cuatro coinciden entre sí; nada inventado):
 *  - hermes-content/propuestas/ONIA_CATALOGO_PRECIOS_2026.md §2 y §6
 *  - hermes-content/docs/ONIA_VENDOR_MANUAL_2026.md:181-193 (definiciones de
 *    una línea de cada producto, regla 50/50 y prohibición de prometer
 *    posicionamiento en Google)
 *  - hermes-content/propuestas/PRICING_RATIONALE_INTERNO.md §0
 *  - web-factory/apps/site/src/app/vendedores/cotizador-data.ts:55-67
 *
 * Landing 790 · Web Profesional 1.500 · Web Pro Onia 2.900 · Cuidado Web
 * 190/390/690 al mes.
 *
 * La TIENDA va sin precio a propósito: el único número escrito (Bs 2.500)
 * dice "con pago (BCP + carrito)" y el generador NO tiene pasarela — el
 * checkout sale por WhatsApp o email (web-factory/packages/templates/src/
 * store.ts:1143-1159). Hasta que Sergio ratifique el precio sin esa promesa,
 * se cotiza. No se publica una cifra que arrastra algo que no existe.
 *
 * Lo que incluye cada stack sale de lo que el generador hace hoy: bloques de
 * la plantilla (packages/templates/src/landing.ts:38-42), suites de
 * accesibilidad y performance (tests/e2e/a11y.spec.ts, perf.spec.ts) y el
 * checkout por WhatsApp/email de la tienda. Lo que no está construido está en
 * "no incluye": panel de edición, sitio en dos idiomas, blog y pasarela.
 *
 * DECISIÓN 2026-09-17 (Sergio Urcullo): los planes básicos SÍ tienen precio
 * publicado —Landing 2.000 y Web Profesional 4.500, lo que el configurador
 * arma solo—; lo que no se puede armar ahí (Web Pro a medida, tienda) se
 * cierra en una llamada. Fuente: ONIA_WEB_COMO_SE_VENDE.md §8.
 * Mismo día: ecommerce SOBRE PLATAFORMA (Shopify, Hotmart, Whop) entra como
 * quinto alcance, sin precio publicado — «los precios dependen del frontend
 * y del backend necesario» — para que el que vende online nos lo compre en
 * vez de armarlo él.
 *
 * PRECIOS RATIFICADOS 2026-08-23 por Sergio: 2.000 / 4.500 / desde 7.500.
 * Antes decían 790/1.500/2.900, que era una **oferta de arranque vencida el
 * 31-jul-2026** y que nadie estaba cobrando: las propuestas reales (AW
 * Climatización, Lia Albertengo, BENCH) cotizan las tres la línea premium
 * 2.000/4.500/desde 7.500. El catálogo decía una cosa y la boca otra; a Bs 1.500
 * una Web Profesional quedaba por debajo del piso de valor-día propio.
 * Fuente y tabla comparativa: hermes-content/docs/ONIA_WEB_COMO_SE_VENDE.md §8.
 */

export type WebStackId = "landing" | "profesional" | "pro" | "tienda" | "ecommerce";

export interface WebStack {
  readonly id: WebStackId;
  readonly nombre: string;
  /** Bs, pago único. null = se cotiza (no hay precio ratificado). */
  readonly precio: number | null;
  readonly paraQuien: string;
  readonly resuelve: string;
  readonly incluye: readonly string[];
  readonly noIncluye: readonly string[];
  readonly necesitasVos: readonly string[];
  /** Qué plan de Cuidado Web le corresponde. */
  readonly mensual: string;
  readonly destacado?: boolean;
}

export interface CuidadoWeb {
  readonly nombre: string;
  readonly mensual: number;
  readonly que: string;
}

/**
 * Cuidado Web. Las definiciones son las que ya están escritas
 * (ONIA_VENDOR_MANUAL_2026.md:185-187). El detalle de cuántos cambios entran
 * por mes NO está escrito en ningún lado, así que no se publica un número:
 * el alcance se fija por escrito en tu propuesta antes de arrancar.
 *
 * Va ARRIBA de `WEB_STACKS` a propósito: cada stack nombra su plan de cuidado y
 * lo interpola de acá, así que la tabla tiene que existir antes. Hasta el
 * 2026-09-04 estaba ochenta líneas más abajo y los stacks escribían los montos
 * a mano —`Bs 190`, `Bs 390` tres veces y `Bs 690` dos—, con estos mismos tres
 * números como número acá al lado. Nadie medía que coincidieran.
 */
export const CUIDADO_WEB: readonly CuidadoWeb[] = [
  { nombre: "Básico", mensual: 190, que: "Mantenimiento simple: tu sitio en línea y al día." },
  { nombre: "Crecimiento", mensual: 390, que: "Cambios ligeros y una revisión mensual." },
  { nombre: "Pro", mensual: 690, que: "Soporte más activo y mejoras pequeñas cada mes." },
] as const;

/**
 * "Cuidado Web Básico Bs 190/mes o Crecimiento Bs 390/mes" — una sola forma de
 * nombrar los planes de cuidado, con el monto leído de `CUIDADO_WEB`.
 *
 * Falla fuerte si le pasan un nombre que no existe en la tabla: un plan mal
 * escrito tiene que romper el build, no publicar "Cuidado Web undefined".
 */
export function cuidadoWeb(...nombres: readonly string[]): string {
  const partes = nombres.map((nombre) => {
    const plan = CUIDADO_WEB.find((c) => c.nombre === nombre);
    if (!plan) {
      throw new Error(
        `Cuidado Web "${nombre}" no existe en CUIDADO_WEB (hay: ${CUIDADO_WEB.map((c) => c.nombre).join(", ")}).`,
      );
    }
    return `${plan.nombre} Bs ${plan.mensual.toLocaleString("es-BO")}/mes`;
  });

  return `Cuidado Web ${partes.join(" o ")}`;
}

export const WEB_STACKS: readonly WebStack[] = [
  {
    id: "landing",
    nombre: "Landing de Captación",
    precio: 2000,
    paraQuien:
      "El que no tiene nada todavía, o el que va a hacer pauta y necesita un solo lugar donde caer.",
    resuelve:
      "Un servicio, un objetivo, un botón. Que la gente que ya te está buscando te encuentre y te escriba.",
    incluye: [
      "Una página, sin menú, con un solo llamado a la acción",
      "Botón que abre WhatsApp con el mensaje ya escrito (o formulario a tu email)",
      "Diseño hecho a partir de tu marca, con versión clara y oscura",
      "Accesibilidad y velocidad verificadas antes de publicar",
      "SEO básico: título, descripción y la imagen que aparece al compartir el link",
      "Publicación en tu dominio y tu hosting, a tu nombre",
    ],
    noIncluye: [
      "Menú ni páginas internas",
      "Blog, tienda ni carrito",
      "Panel para que edites vos mismo",
      "Sitio en dos idiomas",
      "Dominio, hosting y fotos (van a tu nombre y se pagan aparte)",
    ],
    necesitasVos: [
      "Qué hacés y de 3 a 6 servicios, cada uno con una frase",
      "WhatsApp y/o email, dirección y horarios",
      "Fotos propias en archivo original",
    ],
    mensual: cuidadoWeb("Básico"),
  },
  {
    id: "profesional",
    nombre: "Web Profesional",
    precio: 4500,
    paraQuien:
      "El negocio que ya opera y necesita que la web le explique todo y le filtre las consultas.",
    resuelve:
      "Contestar cien veces lo mismo. La web responde por vos y te llegan consultas más maduras.",
    incluye: [
      "Todo lo de la Landing",
      "Página completa: portada, credenciales, servicios, cómo trabajás, preguntas frecuentes y pie",
      "Botón de WhatsApp fijo que te sigue mientras la persona baja",
      "Íconos por servicio y tus fotos optimizadas para que cargue rápido",
    ],
    noIncluye: [
      "Tienda, carrito ni pasarela de pago",
      "Agente conversacional de WhatsApp (es otro servicio)",
      "Blog y páginas separadas tipo Nosotros (se cotizan)",
      "Envío automático de los contactos a un CRM (se agrega, se cotiza aparte)",
    ],
    necesitasVos: [
      "Todo lo de la Landing",
      "5 preguntas que te hacen tus clientes de verdad",
      "Tus pruebas: números, logros o clientes con los que trabajaste (si no hay, no se inventan)",
    ],
    mensual: cuidadoWeb("Básico", "Crecimiento"),
    destacado: true,
  },
  {
    id: "pro",
    nombre: "Web Pro Onia",
    // Sin lista desde el 2026-09-17: dirección de arte propia no se arma en
    // el configurador, se cierra en una llamada. Referencia interna: desde 7.500.
    precio: null,
    paraQuien:
      "El que compite por imagen y no puede parecerse a nadie, o el que va a invertir en pauta y quiere seguirle el rastro a los contactos.",
    resuelve:
      "Verse como la empresa que sos. Dirección de arte propia, no una plantilla reconocible.",
    incluye: [
      "Todo lo de la Web Profesional",
      "Dirección de arte a medida",
      "El copy lo escribimos nosotros a partir de tu material",
      "Seguimiento básico de los contactos que entran",
    ],
    noIncluye: [
      "Tienda ni pasarela de pago",
      "Agente conversacional de WhatsApp",
      "Pauta publicitaria y producción de fotos profesionales",
    ],
    necesitasVos: [
      "Todo lo de la Web Profesional",
      "Tu material real: brochure, fotos, precios, casos",
      "Una persona que aprueba, una sola",
    ],
    mensual: cuidadoWeb("Crecimiento", "Pro"),
  },
  {
    id: "tienda",
    nombre: "Tienda / catálogo online",
    precio: null,
    paraQuien: "El que vende productos y hoy los manda uno por uno por WhatsApp.",
    resuelve:
      "Que el cliente arme su pedido solo y te llegue completo, con productos, cantidades y subtotal.",
    incluye: [
      "Portada de tienda y una página por producto",
      "Carrito que guarda la selección",
      "El pedido te llega por WhatsApp o email con productos, cantidades y subtotal ya escritos",
      "Si a un producto le falta precio, el sistema pasa solo a “pedir cotización”",
    ],
    noIncluye: [
      // Decía «NO hay pasarela online. Esto no existe en el sistema todavía» y
      // producción lo servía en un `<li>` de /servicios/webs: le admitía al lead
      // que a lo que le estamos cobrando le falta algo, y encima lo cargaba a
      // «el sistema», que es el producto y no este servicio. El alcance se acota
      // igual sin nombrar lo que no está — y de paso le contesta cómo cobra.
      "Cobro con tarjeta en línea: el pedido te llega completo y lo cobrás por tu medio de siempre — QR, transferencia o efectivo",
      "Cuenta para que cargues productos vos mismo",
      "Migración de un catálogo grande (se cotiza aparte)",
    ],
    necesitasVos: [
      "Tu lista de productos con nombre, categoría, precio y descripción",
      "Una foto por producto",
      "Tus métodos de pago y tus políticas de envío y devolución",
    ],
    mensual: cuidadoWeb("Crecimiento", "Pro"),
  },
  {
    id: "ecommerce",
    nombre: "Ecommerce sobre Shopify, Hotmart o Whop",
    precio: null,
    paraQuien:
      "El que vende online —productos físicos, cursos o membresías— y no quiere armarlo ni sostenerlo él mismo.",
    resuelve:
      "Una tienda que cobra, entrega y escala sobre la plataforma que ya lo hace bien, con un frontend que es tuyo y no la plantilla de la plataforma.",
    incluye: [
      "Frontend a medida, con tu marca, conectado a Shopify, Hotmart o Whop",
      "Catálogo, carrito y checkout que resuelve la plataforma: tarjeta, suscripciones y entrega digital",
      "Página de producto, colecciones y landing de campaña",
      "Configuración inicial de la tienda: productos, pagos y envíos",
    ],
    noIncluye: [
      "El plan y las comisiones de la plataforma: van a tu nombre y los pagás vos",
      "Fotografía de producto y redacción de fichas (se cotizan aparte)",
      "Migración de un catálogo grande (se cotiza aparte)",
    ],
    necesitasVos: [
      "Una cuenta en la plataforma a tu nombre (te guiamos para abrirla)",
      "Tu lista de productos, cursos o planes, con precio",
      "Tus políticas de envío, devolución y acceso",
    ],
    mensual: cuidadoWeb("Crecimiento", "Pro"),
  },
] as const;

export function precioWeb(stack: WebStack): string {
  return stack.precio === null
    ? "Lo vemos en una llamada"
    : `Bs ${stack.precio.toLocaleString("es-BO")} · pago único`;
}

/**
 * El piso del catálogo: lo que cuesta el stack más barato que tiene precio.
 *
 * Existe para que ninguna pantalla escriba ese número a mano. Cuando la
 * portada, `/precios` o el wizard dicen "desde Bs X por la web", X sale de
 * acá y se mueve solo el día que cambie el catálogo.
 *
 * Nace de un barrido incompleto: el 2026-08-23 Sergio ratificó la línea
 * `2.000 / 4.500 / desde 7.500` y este archivo se movió con él, pero el copy
 * del wizard `/v1/empezar` se quedó anunciando el "desde Bs 790" de la oferta
 * de arranque vencida el 31-jul-2026 — menos de la mitad. Duró doce días
 * porque ese texto se pinta del lado del cliente, DESPUÉS de responder el
 * cuestionario: ni un `curl` de la página ni un `grep` del HTML lo veían.
 * Lo vigila `app/v1/empezar/precio-web.test.ts`.
 */
export function precioWebDesde(): number {
  const conPrecio = WEB_STACKS.map((w) => w.precio).filter(
    (p): p is number => p !== null,
  );

  return Math.min(...conPrecio);
}

export interface WebAddon {
  readonly id: "crm-formulario";
  readonly nombre: string;
  /** Bs, setup único. */
  readonly precio: number;
  readonly descripcion: string;
}

/**
 * Extras del configurador (/servicios/webs). Un solo add-on hoy: registrar
 * cada formulario en un flujo de seguimiento. Tarifa de
 * hermes-content/propuestas/ONIA_CATALOGO_PRECIOS_2026.md §4.
 */
export const WEB_ADDONS: readonly WebAddon[] = [
  {
    id: "crm-formulario",
    nombre: "Registro de contactos en CRM / n8n",
    precio: 790,
    descripcion: "Guarda cada formulario en un flujo de seguimiento. Setup único.",
  },
] as const;
