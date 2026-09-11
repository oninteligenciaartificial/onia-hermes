/**
 * Datos y copy del wizard /empezar.
 * Fuente de verdad del copy: web-factory/docs/ONIA_WIZARD_EMPEZAR_SPEC_2026.md §2
 * (los textos van EXACTOS — no parafrasear).
 */

import { waLink } from "@/lib/site";
import type { Equipo, Precio, Rubro, Tiene } from "./recommend";
import { precioStack } from "@/content/chatbot-precios";
import { precioWebDesde } from "@/content/webs";
import { bs, GRUPO, plan, type Plan } from "@/lib/pricing";

/**
 * Un rubro que el wizard OFRECE. Estar en la lista significa que se contrata
 * hoy: no hay campo `disponible`, y la ausencia es a propósito.
 *
 * Lo había, en `true` para los cinco, y ese dato era el único interruptor de
 * toda la maquinaria de obra del wizard: el badge "PRÓXIMAMENTE" del selector,
 * la nota de lista de espera y una pantalla de resultado que dibujaba el rubro
 * a medio armar. Apagada por un dato y no por código está ARMADA — el día que
 * entre el sexto rubro, lo natural es darlo de alta como `disponible: false`, y
 * el sitio empieza a exhibir obra sin que nada se ponga rojo.
 *
 * Lo que no está listo NO SE NOMBRA (Sergio, 2026-08-20): se deja fuera de la
 * lista, y quien busque otro rubro cae en el escape de WhatsApp que ya está al
 * pie del selector. Guarda: `obra-en-la-pantalla.test.ts`.
 */
export interface RubroOption {
  id: Rubro;
  nombre: string;
  desc: string;
}

export const RUBRO_OPTIONS: readonly RubroOption[] = [
  {
    id: "dental",
    nombre: "Dental",
    desc: "Clínicas y consultorios dentales",
  },
  {
    // Autorizado 2026-08-15 tras QA del embudo completo en produccion: registro,
    // onboarding con vocabulario propio, panel, /agenda y /comercio/caja
    // operativos, cero errores HTTP. El registro del producto lo vende.
    id: "comercio",
    nombre: "Comercio",
    desc: "Tiendas y comercios",
  },
  {
    id: "servicios",
    nombre: "Servicios",
    desc: "Estudios y profesionales que agendan y cobran",
  },
  {
    id: "proveedores",
    nombre: "Importadora",
    desc: "Importadoras y distribuidoras",
  },
  {
    // Tambien contratable (QA 2026-08-15). El wizard no la listaba.
    id: "estetica",
    nombre: "Estética y spa",
    desc: "Centros de estética, spas y peluquerías",
  },
] as const;

/**
 * Unica fuente de verdad de "que rubro se puede contratar hoy". La usan el
 * selector del wizard y `recomendar()`; antes `recommend.ts` lo tenia
 * hardcodeado en "dental" y los dos datos se contradecian.
 *
 * Hoy es "está en la lista": ofrecer y poder entregar son lo mismo.
 */
export function esRubroDisponible(rubro: Rubro): boolean {
  return RUBRO_OPTIONS.some((o) => o.id === rubro);
}

export const ESCAPE_WA_URL = waLink(
  "Hola, mi rubro no está en la lista de Onia. Mi negocio es: ",
);

export const EQUIPO_OPTIONS: readonly { id: Equipo; label: string }[] = [
  { id: "solo", label: "Solo yo" },
  { id: "2-5", label: "2 a 5" },
  { id: "6-15", label: "6 a 15" },
  { id: "15+", label: "Más de 15" },
] as const;

export const TIENE_OPTIONS: readonly {
  id: Tiene;
  label: string;
  exclusiva?: boolean;
}[] = [
  { id: "cuaderno", label: "Agenda en cuaderno o Excel" },
  { id: "web", label: "Página web" },
  { id: "chatbot", label: "Chatbot que responde solo" },
  { id: "sistema", label: "Sistema de gestión (algún software)" },
  { id: "facturacion", label: "Facturación electrónica" },
  { id: "nada", label: "Nada de esto todavía", exclusiva: true },
] as const;

/**
 * La segunda línea del precio, según lo que el plan tenga de verdad.
 *
 * El "este plan no se cobra semanal" del Full no es una frase fija: es
 * `semanal === null` en la tabla. Escrito a mano, el día que Sergio le ponga
 * semanal al Full el sitio seguiría negándolo.
 */
function ciclos(p: Plan): string {
  const anual = `anual Bs ${bs(p.anual)} (pagás 10 meses)`;
  return p.semanal === null
    ? `${anual[0].toUpperCase()}${anual.slice(1)}; este plan no se cobra semanal.`
    : `Semanal Bs ${bs(p.semanal)} o ${anual}.`;
}

/**
 * Línea de precio por plan. Los precios van VISIBLES (decisión 2026-07-30):
 * son los mismos publicados en /#precios y salen de lib/pricing.ts.
 *
 * ⚠️ Este comentario decía "salen de lib/pricing.ts" mientras las nueve cifras
 * de acá abajo estaban TIPEADAS A MANO (hasta el 2026-09-04). Coincidían con la
 * tabla por suerte, no por construcción: el día que cambiara un plan, cambiaba
 * la tabla y estas frases seguían anunciando el precio viejo — el mismo camino
 * por el que el precio de la web, veinte líneas más abajo, pasó doce días a
 * menos de la mitad. Ahora se interpolan. Guarda: `app/(sitio)/precios.test.ts`.
 */
export const PRECIO_COPY: Record<Precio, string> = {
  pro: `Bs ${bs(plan("pro").mensual)}/mes — 5 usuarios y hasta 1.500 fichas. ${ciclos(plan("pro"))}`,
  full: `Bs ${bs(plan("full").mensual)}/mes — usuarios y fichas sin límite. ${ciclos(plan("full"))}`,
  "a-medida": `${GRUPO.nombre}: Bs ${bs(GRUPO.mensual)}/mes (anual Bs ${bs(GRUPO.anual)}) más implementación desde Bs ${bs(GRUPO.implementacionDesde)}. No se compra en línea — se cotiza con tu caso.`,
};

/**
 * Los módulos que el resultado enciende, POR RUBRO.
 *
 * ⚠️ Esto era UNA lista plana, escrita para dental, y `VarianteDental` la
 * pintaba sin mirar el rubro. Como los cinco rubros están `disponible: true`,
 * los cinco caían ahí: a una tienda, a una importadora, a un spa y a un estudio
 * se les ofrecía «Historia clínica con odontograma» —cuatro de cada cinco
 * leads— justo debajo de «Armado con tus 3 respuestas — nada genérico».
 * Medido el 2026-09-06 manejando el wizard en producción. Guarda:
 * `modulos-por-rubro.test.ts`.
 *
 * Los nombres NO se inventan acá: son capacidades que el sitio ya publica en
 * `lib/pricing.ts` (`PLANES[].incluye`) y en el ensamblaje por rubro de esta
 * misma pantalla. La línea del agente sale del `resultado` del plan Pro —«los
 * agentes te proponen a quién contactar y vos aprobás con un toque»—, que es
 * transversal; en los rubros que agendan se dice en su forma concreta.
 */
const AGENTE_CONTACTAR = "Agente IA que te propone a quién contactar — con tu aprobación";
const AGENTE_REPROGRAMA = "Agente IA que reprograma — con tu aprobación";

export const PLAN_INCLUYE: Record<Rubro, readonly string[]> = {
  dental: [
    "Agenda",
    "Historia clínica con odontograma",
    "Cobros y caja",
    AGENTE_REPROGRAMA,
  ],
  comercio: [
    "Inventario con existencias y aviso de stock mínimo",
    "Ventas y cobro QR",
    "Cobros y caja",
    AGENTE_CONTACTAR,
  ],
  servicios: [
    "Agenda de trabajos",
    "Fichas de clientes y presupuestos",
    "Cobros y caja",
    AGENTE_CONTACTAR,
  ],
  proveedores: [
    "Pedidos y entregas",
    "Stock y cuentas por cobrar",
    "Cobros y caja",
    AGENTE_CONTACTAR,
  ],
  estetica: [
    "Agenda y clientas",
    "Ficha de tratamientos",
    "Caja y cobros",
    AGENTE_REPROGRAMA,
  ],
} as const;

export const NOTA_DOWNSELL = `Si te queda grande, hay un plan de entrada de Bs ${bs(plan("basico").mensual)}/mes (2 usuarios, hasta 300 fichas) que ordena las fichas y los cobros — los agentes de IA no vienen ahí.`;

export const NOTA_CUADERNO =
  "El cuaderno se jubila: agenda digital con recordatorios, sin pasar nada en limpio.";

export const NOTA_FACTURACION =
  "Facturación, de frente: el portal del SIN es gratis y cumple, y hoy la factura fiscal se emite ahí — nuestro emisor está en trámite de homologación. Lo que Onia hace mientras tanto es dejar la venta cerrada para que no tipees lo mismo dos veces.";

export const FALTA_COPY: Record<"web" | "chatbot", { nombre: string; copy: string }> = {
  web: {
    nombre: "Página web",
    // El precio NO se escribe acá: sale de content/webs.ts, la fuente. Este
    // texto anunció "desde Bs 790" durante doce días después de que Sergio
    // ratificara la línea 2.000/4.500/7.500 (2026-08-23) — menos de la mitad,
    // y en la pantalla que ve el que todavía no tiene web. Guarda:
    // precio-web.test.ts.
    copy: `Tu presencia online conectada al sistema: lo que publicás y lo que agendás viven en el mismo lugar. Desde Bs ${precioWebDesde().toLocaleString("es-BO")}, pago único.`,
  },
  chatbot: {
    nombre: "Chatbot de WhatsApp",
    // El precio NO se escribe acá: sale de content/chatbot-precios.ts, la
    // fuente única. Este texto llegó a ser el CUARTO precio vivo del mismo
    // add-on (2026-08-21).
    copy: `El botón de WhatsApp va gratis con la web. Esto es otra cosa: contesta al instante a cualquier hora con la información real que vos publicaste, y lo que no sabe te lo pasa con la conversación entera. ${precioStack()}. Lo que no entre en el estándar se define con vos y se cotiza a medida.`,
  },
};

export const FALTA_TAG = "servicio aparte, con su propio precio";

/* ---- labels para el mensaje de WhatsApp (spec §4) ---- */

export const RUBRO_MSG: Record<Rubro, string> = {
  dental: "clínica dental",
  comercio: "comercio",
  servicios: "servicios",
  proveedores: "importadora / material eléctrico",
  estetica: "estética y spa",
};

export const EQUIPO_MSG: Record<Equipo, string> = {
  solo: "solo yo",
  "2-5": "2 a 5",
  "6-15": "6 a 15",
  "15+": "más de 15",
};

export const TIENE_MSG: Record<Exclude<Tiene, "web" | "nada">, string> = {
  cuaderno: "cuaderno/Excel",
  chatbot: "chatbot",
  sistema: "sistema de gestión",
  facturacion: "facturación electrónica",
};
