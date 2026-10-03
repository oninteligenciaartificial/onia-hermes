/**
 * Contenido normativo de facturación en línea (SIAT) — fuente ÚNICA.
 *
 * Estaba escrito una sola vez, adentro de
 * app/v1/funciones/facturacion-electronica-siat/page.tsx. Al necesitarlo también
 * el preview (v3) la opción era copiarlo, y copiar un texto FISCAL es
 * exactamente cómo nacieron los cuatro precios vivos del chatbot: dos páginas
 * dicen cosas distintas sobre la misma ley y ninguna se entera. Vive acá; las
 * dos páginas lo LEEN.
 *
 * REGLA DE LA CASA: el SIN ofrece un Portal Web gratuito y se dice primero.
 * La factura con valor fiscal se emite ahí (o en la modalidad asignada); Onia
 * no la emite, y la venta no dice más que eso.
 *
 * 2026-10-01 — Sergio Urcullo decidió sacar de toda superficie de VENTA el
 * estado del emisor propio («en trámite», «en pruebas de homologación», «falta
 * que el SIN autorice»): la regla «la venta nunca exhibe obra» de CLAUDE.md.
 * Lo que no está listo no se nombra; lo que SÍ se dice, en presente y sin
 * «todavía», es dónde se emite hoy la factura fiscal (el Portal del SIN) y qué
 * hace Onia (ordenar ventas, compras e IVA/IT). Así no se promete lo que no
 * existe NI se exhibe la obra. Los términos (`content/legal/terminos.md`) y
 * los docs internos siguen contando el estado entero.
 *
 * Fechas y RND verificadas contra fuentes oficiales el 2026-08-06 (PDF de la
 * RND 102500000036 + nota de prensa del SIN por la RND 102600000007).
 * Si una cifra o una fecha cambia, se cambia ACÁ y no en las páginas.
 *
 * ⚠️ 2026-10-03 — LA OBLIGACIÓN DEL 1-OCT YA NO RIGE. Este archivo decía, en
 * presente y en las dos páginas, que desde el 1 de octubre de 2026 los grupos
 * 9° al 12° emitían «únicamente» en línea (RND 102600000007). El 30 de
 * septiembre de 2026 la RND 102600000038 abrogó las cuatro RND que designaban
 * a esos grupos (102400000004, 005, 012 y 025) y, según su considerando, dejó
 * «sin efecto los plazos de incorporación»; su Par. II dice que el SIN
 * «asignará periódicamente» una modalidad en línea a los sujetos pasivos del
 * IVA que todavía no implementaron ninguna. Motivo declarado: aplicar la Ley
 * 1733 (IVA sobre el precio neto, expuesto aparte en la factura). Texto leído
 * en el PDF del SIN el 3-oct; fuente interna:
 * `hermes-content/docs/ONIA_FACTURACION_ESTADO_REAL.md` §2.6.
 * La página siguió afirmando la obligación tres días después de que dejó de
 * existir: el gate `(sitio)/plazo-sin-efecto.test.ts` lo pone en rojo ahora.
 * La norma no fija fecha nueva, y acá NO se inventa una.
 */

/**
 * Titular de la página normativa.
 *
 * En PASADO y en presente a propósito, y no es preferencia de estilo: el sitio
 * se sirve estático y el HTML se queda quieto hasta el próximo deploy, que es
 * manual. Decía *«solo podrán facturar en línea»* —futuro— y después *«desde el
 * 1 de octubre… facturan únicamente en línea»*, que la RND 102600000038 volvió
 * falso el 30-sep. Un hecho ya ocurrido («dejó sin efecto») no caduca.
 * Lo sigue buscando el que oyó del plazo: por eso el titular nombra la fecha.
 * Vigilado por `(sitio)/plazo-que-vence.test.ts` y `(sitio)/plazo-sin-efecto.test.ts`.
 */
export const SIAT_TITULAR =
  "El SIN dejó sin efecto el plazo del 1 de octubre para facturar en línea.";

/** La bajada: qué pasó, con su número de RND, y qué sigue. Sin fechas inventadas. */
export const SIAT_BAJADA =
  "La RND 102600000038, del 30 de septiembre de 2026, abrogó las resoluciones que obligaban a los grupos 9° al 12° de contribuyentes a facturar en línea desde el 1 de octubre de 2026. Ahora el SIN asigna la facturación en línea cada cierto tiempo a quien todavía no la tiene, sin una fecha fija. Si ya te la asignaron, figura en tu Oficina Virtual.";

export interface SiatBloque {
  titulo: string;
  texto: string;
}

/**
 * El argumento, en dos pasos y en ESTE orden: primero la opción gratuita
 * (honestidad legal tributaria), después qué resuelve Onia. El tercer bloque
 * («Dónde está Onia en este camino»: registro ante el SIN, pruebas de
 * homologación) se sacó el 2026-10-01 — ver la cabecera.
 */
export const SIAT_BLOQUES: readonly SiatBloque[] = [
  {
    titulo: "Lo primero que tenés que saber: podés cumplir GRATIS.",
    texto:
      "El SIN ofrece el Portal Web en Línea, gratuito, previa habilitación de esa modalidad. Allí ingresás los datos de cada factura en la página de Impuestos. Si tu negocio emite pocas facturas, esa opción cumple la norma y no cuesta nada. No estás obligado por ley a comprar un sistema privado.",
  },
  {
    titulo: "Lo que Onia resuelve hoy: orden en tus ventas y compras.",
    texto:
      "Onia registra tus ventas y compras, prepara un resumen de IVA e IT y te muestra el calendario de vencimientos para que revises los números con tu contador. La factura con valor fiscal se emite aparte: ingresás los datos de cada factura en el Portal Web gratuito del SIN. El registro exportable de Onia es un insumo para tu contador; no es el RCV oficial del SIAT.",
  },
] as const;

export interface SiatFaq {
  q: string;
  a: string;
}

/**
 * Las preguntas que trae el que buscó el plazo. La primera es la suya, tal
 * cual la escribe: «¿sigo obligado desde el 1 de octubre?». Hasta el 3-oct
 * esta lista respondía «¿cómo sé si estoy en los grupos 9° al 12°?» y «desde
 * esa fecha los grupos alcanzados solo pueden emitir en línea», las dos
 * falsas desde la RND 102600000038 (ver la cabecera).
 */
export const SIAT_FAQ: readonly SiatFaq[] = [
  {
    q: "¿Sigo obligado a facturar en línea desde el 1 de octubre de 2026?",
    a: "Por esa fecha, no. La RND 102600000038, del 30 de septiembre de 2026, abrogó las resoluciones que designaban a los grupos 9° al 12° (RND 102400000004, 05, 12 y 25) y dejó sin efecto sus plazos de incorporación, incluido el del 1 de octubre que había fijado la RND 102600000007.",
  },
  {
    q: "¿Y ahora cuándo me toca?",
    a: "La norma no fija una fecha. El SIN asigna periódicamente una modalidad de facturación en línea a los contribuyentes del IVA que todavía no tienen ninguna (RND 102600000038, parágrafo II). Si ya te asignaron una, figura en tu Oficina Virtual (siat.impuestos.gob.bo); si no sabés cómo verlo, preguntale a tu contador.",
  },
  {
    q: "¿Puedo cumplir gratis?",
    a: "Sí. Si tenés habilitada la modalidad Portal Web en Línea, podés emitir gratis ingresando los datos de cada factura. Onia no reemplaza ese paso: te ayuda a ordenar ventas, compras y cifras para revisarlas con tu contador.",
  },
  {
    q: "¿Por qué cambió?",
    a: "Lo dice la misma RND 102600000038: para que la Ley 1733, del 27 de mayo de 2026 (el IVA calculado sobre el precio neto y mostrado aparte en la factura), se aplique de forma automatizada, uniforme y verificable. Antes el plazo ya se había movido dos veces: la RND 102500000036 lo llevó a marzo de 2026 y la RND 102600000007, al 30 de septiembre de 2026.",
  },
] as const;

/** Las fuentes y el descargo. Nunca se publica el contenido sin esto. */
export const SIAT_FUENTES =
  "Fuentes: RND 102600000038 del SIN (30 de septiembre de 2026), RND 102100000011 (Sistema de Facturación) y Ley 1733. Verificado contra el texto de la RND el 3 de octubre de 2026. Esto es información general, no asesoría tributaria: confirmá tu caso con tu contador o en tu Oficina Virtual.";

/* ---------------------------------------------------------------------- */
/* LA GUÍA de una página — "cómo me habilito"                              */
/* ---------------------------------------------------------------------- */

/**
 * El lead magnet (`/guia-facturacion`).
 *
 * Vive ACÁ y no en la página por la misma razón que todo lo de arriba: es
 * texto FISCAL. Si el SIN cambia la regla otra vez (ya van tres: RND
 * 102500000036, 102600000007 y la abrogación de la 102600000038), se corrige
 * este archivo y las DOS páginas se enteran solas. Un segundo lugar con los mismos pasos es cómo nacen dos
 * versiones de la misma ley.
 *
 * División de intenciones, deliberada y vigilada:
 *   /facturacion      → QUÉ EXIGE la norma (y ya está publicada y gratis).
 *   /guia-facturacion → CÓMO ME HABILITO, paso por paso. Es la pregunta que
 *                       aparece DESPUÉS de leer la otra.
 *
 * Los 6 pasos son el recorte de cliente del checklist interno
 * `hermes-content/docs/ONIA_SIAT_HABILITAR_FACTURACION_CHECKLIST_2026.md`
 * (camino A, Portal Web en Línea) — el mismo que hicimos con nuestro propio
 * NIT. No se fabricó ninguno.
 *
 * Reglas que le dan la forma y NO se negocian:
 *  · La opción GRATIS va primero, siempre. El pitch nunca es "estás obligado
 *    a comprarme": el SIN tiene portal gratuito y cumple al 100%.
 *  · Cero precios (viven en lib/subscription-plans.ts y lib/pricing.ts).
 *  · Cero testimonios, logos o porcentajes de resultado — hay cero clientes
 *    pagando y no se inventa uno.
 *  · UNA sola línea comercial, al final, después de haber sido útil.
 */

/**
 * El plazo VIEJO en formato corto, para rótulos donde no entra la oración entera.
 *
 * Desde el 3-oct se nombra solo para decir que quedó SIN EFECTO (RND
 * 102600000038, ver la cabecera): es la fecha que trae en la cabeza el que
 * llega a la guía, y el rótulo le contesta en una línea.
 *
 * Es el 1 de octubre, no el 30 de septiembre. La RND 102600000007 fijaba el
 * 30-09 como último día de transición y el 01-10 como primer día de
 * obligación; sueltos significaban cosas opuestas, y el 30-09 es además el día
 * de la RND que los dejó sin efecto. El matiz completo vive en `SIAT_BAJADA`.
 *
 * Existe porque `/guia-facturacion` tipeaba «Plazo · 30-09-2026» en su Kicker
 * mientras su propia bajada, dos líneas abajo, decía «el 1 de octubre»: la
 * pantalla se contradecía a la vista del lead. Era el único texto de plazo de
 * las dos páginas que no salía de este archivo, justo el que encabeza la
 * pantalla, y sobrevivió al gate de tiempo verbal porque no tiene verbo.
 * Vigilado por `(sitio)/plazo-no-se-tipea.test.ts`.
 */
export const SIAT_PLAZO_CORTO = "01-10-2026";

/** Rótulo del plazo. La fecha sale de arriba: acá no se tipea ninguna. */
export const SIAT_GUIA_KICKER = `Plazo ${SIAT_PLAZO_CORTO} · sin efecto`;

/** Titular de la guía. La promesa entera cabe acá. */
export const SIAT_GUIA_TITULAR =
  "Habilitate para facturar en línea, gratis, en 6 pasos.";

/** La bajada: qué te llevás y qué NO te vamos a vender para dártelo. */
export const SIAT_GUIA_BAJADA =
  "El SIN dejó sin efecto el plazo del 1 de octubre de 2026 (RND 102600000038) y ahora asigna la facturación en línea a quien todavía no la tiene. Una hoja: cómo saber si ya te la asignaron y cómo habilitarte, paso por paso, en la Oficina Virtual. El trámite es gratuito y no necesitás comprar ningún sistema para cumplir.";

/**
 * Paso 0 — el que casi nadie hace y ordena todo lo demás.
 * La asignación es por contribuyente, no por rubro: es el error más caro de la guía.
 * Hasta el 3-oct hablaba de «tu grupo» de 2024; esos grupos quedaron abrogados
 * por la RND 102600000038 (ver la cabecera).
 */
export const SIAT_GUIA_PASO_0: SiatBloque = {
  titulo: "Paso 0 — averiguá si ya te asignaron una modalidad.",
  texto:
    "Los grupos de 2024 quedaron sin efecto (RND 102600000038) y ahora el SIN asigna periódicamente la modalidad en línea a los contribuyentes del IVA que todavía no tienen ninguna. Entrá a siat.impuestos.gob.bo con tu NIT, o preguntale a tu contador: ahí figura si ya te asignaron una y cuál. No lo deduzcas de lo que hace el negocio de al lado — dos comercios de la misma calle pueden estar en situaciones distintas, y el que se equivoca se entera tarde.",
};

export interface SiatPaso {
  titulo: string;
  detalle: string;
}

/**
 * Los 6 pasos de la Oficina Virtual, modalidad Portal Web en Línea.
 *
 * Cada `detalle` dice por qué el paso importa o qué lo traba, no solo qué
 * botón tocar: el valor de la hoja es el orden y las trampas, porque los
 * nombres de las opciones del portal pueden cambiar y el orden no.
 */
export const SIAT_GUIA_PASOS: readonly SiatPaso[] = [
  {
    titulo: "Entrá a la Oficina Virtual",
    detalle:
      "impuestos.gob.bo → «SIAT en Línea», con las credenciales del NIT. Si no las tenés a mano, conseguilas primero: sin eso ninguno de los pasos siguientes existe.",
  },
  {
    titulo: "Revisá que no tengas marcas de riesgo tributario",
    detalle:
      "Es un requisito formal (Art. 19.d). Si hay una observación activa se resuelve primero, y mientras esté ahí el trámite no avanza. Mirarlo hoy y no en la última semana es la diferencia entre resolverlo tranquilo y no llegar.",
  },
  {
    titulo: "Solicitá la autorización de la modalidad",
    detalle:
      "Para emitir a mano desde ya, la modalidad es Portal Web en Línea: no pide sistema propio ni certificado digital, y no cuesta nada. El SIN valida y autoriza. Confirmá en pantalla cuál te habilita, porque la que figure asignada en tu padrón puede ser otra.",
  },
  {
    titulo: "Configurá casa matriz y punto de venta",
    detalle:
      "Casa matriz o sucursal (0), y al menos un punto de venta. Sin un punto de venta configurado no se puede emitir ni la factura de prueba del paso 6.",
  },
  {
    titulo: "Cargá productos, servicios y clientes, y sincronizá catálogos",
    detalle:
      "Actividades, leyendas y unidades de medida salen de las tablas del SIN: hay que sincronizarlas y después homologar cómo se llama lo que vos vendés con el código que el SIN espera. Es el paso más aburrido y el que deja más errores para el final.",
  },
  {
    titulo: "Emití una factura de prueba y verificá tres cosas",
    detalle:
      "Que valide, que llegue el PDF y que el XML quede registrado en el SIN. Las tres. Una emisión que «no dio error» pero no aparece registrada no te sirve el día que tengas que facturar de verdad.",
  },
] as const;

/** Lo que conviene tener sobre la mesa ANTES de empezar. Cinco cosas, ni una más. */
export const SIAT_GUIA_A_MANO: readonly string[] = [
  "Tu NIT y las credenciales de la Oficina Virtual.",
  "La razón social exacta, tal cual figura en el padrón. Sin abreviar.",
  "Tus códigos de actividad económica, los que ya tenés asignados.",
  "El correo del negocio — el que revisás de verdad, no uno viejo.",
  "NIT o CI y razón social de un cliente, para la factura de prueba.",
] as const;

/**
 * Lo que frena. Se deriva de los pasos de arriba, no de estadísticas: no
 * tenemos una muestra de negocios habilitados y no se inventa una.
 */
export const SIAT_GUIA_FRENA: readonly string[] = [
  "Dejarlo para cuando el SIN te asigne la modalidad. No es un formulario: son seis pasos y cada uno depende del anterior.",
  "Descubrir una marca de riesgo recién en el paso 3. Se resuelve, pero no en una tarde, y hasta que no se resuelva el trámite queda parado.",
  "Llegar al paso 6 sin los catálogos sincronizados. La prueba no valida y volvés al paso 5 con ventas esperando su factura.",
];

/** Cierre de la guía: la factura fiscal se emite en el portal; Onia ordena el resto. */
export const SIAT_GUIA_CIERRE =
  "El portal del SIN es gratuito, y cada factura fiscal se emite allí ingresando los datos requeridos. Onia te sirve para tener ordenadas tus ventas, tus compras y las cifras de IVA e IT del mes.";

export interface SiatEnlace {
  label: string;
  href: string;
}

/** Fuentes oficiales, para que cualquiera verifique sin creernos. */
export const SIAT_GUIA_ENLACES: readonly SiatEnlace[] = [
  {
    label: "SIAT — Portal Web en Línea (modalidad del paso 3)",
    href: "https://siatinfo.impuestos.gob.bo/index.php/informacion/modalidades-facturacion/facturacion-portal-web",
  },
  {
    label: "SIN — SIAT en Línea (por acá se entra)",
    href: "https://www.impuestos.gob.bo/index.php/siat-en-linea/",
  },
] as const;
