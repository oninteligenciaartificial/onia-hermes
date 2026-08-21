/**
 * Contenido normativo de facturación en línea (SIAT) — fuente ÚNICA.
 *
 * Estaba escrito una sola vez, adentro de
 * app/funciones/facturacion-electronica-siat/page.tsx. Al necesitarlo también
 * el preview (v3) la opción era copiarlo, y copiar un texto FISCAL es
 * exactamente cómo nacieron los cuatro precios vivos del chatbot: dos páginas
 * dicen cosas distintas sobre la misma ley y ninguna se entera. Vive acá; las
 * dos páginas lo LEEN.
 *
 * REGLA DE LA CASA respetada a rajatabla: el SIN ofrece un Portal Web
 * GRATUITO y se dice primero y de frente — el pitch es "no tengas que tipear",
 * jamás "estás obligado a comprarme".
 *
 * Fechas y RND verificadas contra fuentes oficiales el 2026-08-06 (PDF de la
 * RND 102500000036 + nota de prensa del SIN por la RND 102600000007).
 * Si una cifra o una fecha cambia, se cambia ACÁ y no en las páginas.
 */

/** Titular de la página normativa. */
export const SIAT_TITULAR =
  "Desde el 1 de octubre de 2026, miles de negocios solo podrán facturar en línea.";

/** La bajada: qué dice la norma, con su número de RND. */
export const SIAT_BAJADA =
  "La RND 102600000007 del SIN fijó el 30 de septiembre de 2026 como último día de transición para los grupos 9° al 12° de contribuyentes — el universo de micro y pequeñas empresas. Desde el 1 de octubre, esos negocios emiten únicamente por su modalidad de facturación en línea asignada.";

export interface SiatBloque {
  titulo: string;
  texto: string;
}

/**
 * El argumento, en tres pasos y en ESTE orden: primero la opción gratuita
 * (honestidad legal tributaria), después qué resuelve un sistema, y recién
 * al final dónde está Onia.
 */
export const SIAT_BLOQUES: readonly SiatBloque[] = [
  {
    titulo: "Lo primero que tenés que saber: podés cumplir GRATIS.",
    texto:
      "El SIN ofrece el Portal Web en Línea, gratuito, donde cualquier contribuyente emite sus facturas tipeándolas una por una en la página de Impuestos. Si tu negocio emite pocas facturas, esa opción cumple la norma y no cuesta nada. Cualquiera que te diga \"estás obligado por ley a comprar un sistema\" te está mintiendo — y con nosotros esa frase no existe.",
  },
  {
    titulo: "Lo que un sistema resuelve no es la obligación: es el re-tipeo.",
    texto:
      "El costo real del portal gratuito es tu tiempo: cada venta se tipea dos veces — una en tu cuaderno o caja, otra en el portal. Con un sistema de gestión conectado, la factura sale de la MISMA venta que ya registraste al cobrar, y tu registro de compras y ventas (RCV), el IVA y el calendario de vencimientos se arman solos. Ese es el trabajo que Onia hace — el cumplimiento ya era tuyo gratis.",
  },
  {
    titulo: "Dónde está Onia en este camino (dicho de frente)",
    texto:
      "Nuestro sistema está registrado ante el SIN como proveedor de facturación y ya completó las pruebas técnicas de la Fase 1 en el ambiente de pruebas oficial: emisión individual y masiva, anulaciones, reversiones y operación sin internet. Quedan las etapas formales del trámite (inspección del SIN). Mientras la homologación concluye, Onia registra y ordena cada venta, arma tu contabilidad, y emitís por el portal gratuito — sin re-tipear tus números, porque el sistema te los da listos.",
  },
] as const;

export interface SiatFaq {
  q: string;
  a: string;
}

export const SIAT_FAQ: readonly SiatFaq[] = [
  {
    q: "¿Cómo sé si mi negocio está en los grupos 9° al 12°?",
    a: "El SIN asignó los grupos por NIT en resoluciones de 2024 (RND 102400000004, 05, 12 y 25). Entrá a tu Oficina Virtual (siat.impuestos.gob.bo) con tu NIT o preguntale a tu contador: ahí figura tu modalidad asignada. No adivines por el rubro — depende del NIT.",
  },
  {
    q: "¿Puedo cumplir gratis?",
    a: "Sí. El SIN ofrece el Portal Web en Línea gratuito, donde emitís factura por factura tipeando los datos a mano. Cumple la norma al 100%. Lo que un sistema como Onia agrega no es el cumplimiento: es no re-tipear — la factura sale sola de tu venta, con tu caja y tu contabilidad conectadas.",
  },
  {
    q: "¿Qué pasa si no migro antes del 1 de octubre de 2026?",
    a: "Desde esa fecha los grupos alcanzados solo pueden emitir por su modalidad de facturación en línea asignada (RND 102600000007). Emitir por medios anteriores deja de ser válido para esos contribuyentes.",
  },
  {
    q: "¿Ya hubo prórrogas? ¿Puede haber otra?",
    a: "Hubo dos: la RND 102500000036 movió el plazo a marzo de 2026, y la RND 102600000007 lo movió al 30 de septiembre de 2026. Puede haber otra — nadie lo sabe. Nuestro consejo honesto: no apuestes tu facturación a que la haya.",
  },
  {
    q: "¿Y Onia ya puede emitir facturas en línea?",
    a: "Estamos en trámite: nuestro sistema está registrado ante el SIN como proveedor y ya completó las pruebas técnicas de emisión, anulación y contingencia en el ambiente de pruebas del SIN (Fase 1). Faltan las etapas formales de inspección. Mientras tanto, con Onia tu venta queda registrada y lista, y emitís por el portal gratuito del SIN — te avisamos apenas la homologación concluya.",
  },
] as const;

/** Las fuentes y el descargo. Nunca se publica el contenido sin esto. */
export const SIAT_FUENTES =
  "Fuentes: RND 102100000011 (Sistema de Facturación), RND 102500000036 y nota de prensa oficial del SIN sobre la RND 102600000007. Verificado el 6 de agosto de 2026. Esto es información general, no asesoría tributaria — tu caso concreto confirmalo con tu contador o en tu Oficina Virtual.";
